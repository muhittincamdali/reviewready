// Everything the rules look at for one project: its iOS app targets with the Info.plist values,
// entitlements, icon and privacy manifests they ship, the Expo config, the Podfile permissions,
// the pinned Xcode versions and the app's own source files.
import { join, relative, resolve, sep } from 'node:path';
import { NOT_READ, readProjectFile, readProjectText } from '../core/files.js';
import { compareVersions } from '../core/versions.js';
import type { Project } from '../detect/project.js';
import { type ExpoApp, readExpoApp } from './expo.js';
import { findNamed } from './find.js';
import { type AppIcon, findAppIcon } from './icons.js';
import {
  generatesInfoPlist,
  infoPlistFiles,
  iosAppTargets,
  readXcodeProject,
  setting,
  type BuildSettings,
  type XcodeProject,
  type XcodeTarget,
} from './pbxproj.js';
import { isDict, type PlistValue, parsePlist } from './plist.js';
import { type PodfilePermissions, readPodfile } from './podfile.js';
import { type Language, readSources, type SourceFile, type SourceRoot } from './sources.js';
import { type XcodePin, xcodePins } from './toolchain.js';

/** Where an Info.plist value comes from. */
export type InfoOrigin = 'info-plist' | 'build-setting' | 'expo-config';

export interface InfoEntry {
  key: string;
  value: PlistValue | unknown;
  file: string;
  line: number | null;
  origin: InfoOrigin;
}

export interface DeploymentTarget {
  version: string;
  file: string;
  line: number | null;
}

export interface AppTarget {
  name: string;
  /** The .xcodeproj the target belongs to; null for an Expo app without ios/. */
  xcodeProject: string | null;
  /** app.json, for an Expo app without ios/; null otherwise. */
  configFile: string | null;
  /** Whether the target is an App Clip, which ships only part of the app's code. */
  appClip: boolean;
  /** The Info.plist keys the shipped app has, as far as the files say. */
  info: ReadonlyMap<string, InfoEntry>;
  /** Info.plist files read for the target. */
  infoPlists: string[];
  /** Whether an Info.plist was named but could not be read, so its keys are not known. */
  unreadInfoPlist: boolean;
  /** The entitlement keys of CODE_SIGN_ENTITLEMENTS. */
  entitlements: ReadonlySet<string>;
  deploymentTarget: DeploymentTarget | null;
  /** The app icon; null for an Expo app without ios/ (its icon is in the Expo config). */
  icon: AppIcon | null;
  /** The icon name the target builds (ASSETCATALOG_COMPILER_APPICON_NAME). */
  iconName: string;
  /** PrivacyInfo.xcprivacy files that are part of the target. */
  privacyManifests: string[];
}

export interface AppModel {
  project: Project;
  targets: AppTarget[];
  sources: SourceFile[];
  expo: ExpoApp | null;
  podfile: PodfilePermissions | null;
  xcodePins: XcodePin[];
  /** PrivacyInfo.xcprivacy files under the iOS folder that no target includes. */
  strayPrivacyManifests: string[];
  /**
   * Whether an .xcodeproj could not be read or had no iOS app target, so the app's Info.plist and
   * build settings were not checked.
   */
  appNotChecked: boolean;
  notes: string[];
}

/** The configuration App Store builds use; another one is read when a project has no Release. */
const RELEASE = 'Release';
const INFOPLIST_KEY = 'INFOPLIST_KEY_';
const DEFAULT_ICON_NAME = 'AppIcon';
const PRIVACY_MANIFEST = 'PrivacyInfo.xcprivacy';
const APP_CLIP = 'com.apple.product-type.application.on-demand-install-capable';

/**
 * How a note names a file: relative to the project folder, with forward slashes. Reports are
 * committed and shared, and an absolute path would carry the home folder (and user name) of
 * whoever ran reviewready.
 */
export const shownPath = (path: string, projectRoot: string) =>
  relative(projectRoot, path).split(sep).join('/') || '.';

function lineOf(text: string | null, needle: string): number | null {
  if (text === null) return null;
  const index = text.indexOf(needle);
  return index === -1 ? null : text.slice(0, index).split('\n').length;
}

function releaseSettings(target: XcodeTarget): BuildSettings {
  return target.configurations[RELEASE] ?? Object.values(target.configurations)[0] ?? {};
}

async function readPlistFile(
  path: string,
  root: string,
  label: string,
  notes: string[],
): Promise<{ dict: Record<string, PlistValue>; keyLines: ReadonlyMap<string, number> } | null> {
  const file = await readProjectFile(path, root);
  const shown = shownPath(path, root);
  if (!file.found) {
    notes.push(`${shown} is named in ${label} but ${NOT_READ[file.reason]}`);
    return null;
  }
  try {
    const { value, keyLines } = parsePlist(file.bytes);
    if (!isDict(value)) throw new Error('the top level is not a dictionary');
    return { dict: value, keyLines };
  } catch (error) {
    notes.push(`${shown} could not be read as a property list: ${(error as Error).message}`);
    return null;
  }
}

function lowestDeploymentTarget(
  target: XcodeTarget,
  pbxproj: string,
  text: string | null,
): DeploymentTarget | null {
  const versions = Object.values(target.configurations)
    .map((settings) => setting(settings, 'IPHONEOS_DEPLOYMENT_TARGET'))
    .filter((value): value is string => value !== undefined && /^\d+(\.\d+)*$/.test(value));
  const version = versions.sort(compareVersions)[0];
  if (!version) return null;
  return { version, file: pbxproj, line: lineOf(text, `IPHONEOS_DEPLOYMENT_TARGET = ${version}`) };
}

/** Whether `file` is in one of the target's resources or synchronized folders. */
function isInTarget(file: string, target: XcodeTarget, sourceRoot: string): boolean {
  const name = file.split(sep).at(-1) ?? file;
  if (target.resources.includes(name)) return true;
  return target.synchronizedFolders.some((folder) => {
    const rest = relative(resolve(sourceRoot, folder), file);
    return rest !== '' && !rest.startsWith('..') && !rest.startsWith(sep);
  });
}

interface TargetContext {
  xcode: XcodeProject;
  root: string;
  pbxprojText: string | null;
  manifests: string[];
  notes: string[];
}

async function readTarget(target: XcodeTarget, context: TargetContext): Promise<AppTarget> {
  const { xcode, root, notes } = context;
  const info = new Map<string, InfoEntry>();
  const { files, unresolved } = infoPlistFiles(xcode, target);
  for (const raw of unresolved) {
    notes.push(
      `${target.name}: INFOPLIST_FILE ${raw} uses a build setting reviewready does not expand.`,
    );
  }
  const infoPlists: string[] = [];
  for (const file of files) {
    const plist = await readPlistFile(file, root, 'INFOPLIST_FILE', notes);
    if (!plist) continue;
    infoPlists.push(file);
    for (const [key, value] of Object.entries(plist.dict)) {
      if (info.has(key)) continue;
      info.set(key, {
        key,
        value,
        file,
        line: plist.keyLines.get(key) ?? null,
        origin: 'info-plist',
      });
    }
  }
  const pbxproj = join(xcode.path, 'project.pbxproj');
  const settings = releaseSettings(target);
  if (generatesInfoPlist(target) || files.length === 0) {
    for (const [name, value] of Object.entries(settings)) {
      if (!name.startsWith(INFOPLIST_KEY) || typeof value !== 'string') continue;
      const key = name.slice(INFOPLIST_KEY.length);
      if (info.has(key)) continue;
      const line = lineOf(context.pbxprojText, `${name} = `);
      info.set(key, { key, value, file: pbxproj, line, origin: 'build-setting' });
    }
  }
  if (files.length + unresolved.length === 0 && !generatesInfoPlist(target)) {
    notes.push(
      `${target.name}: the Xcode project sets neither INFOPLIST_FILE nor GENERATE_INFOPLIST_FILE = YES; they may be set in an .xcconfig file, which reviewready does not read.`,
    );
  }
  const entitlements = new Set<string>();
  const entitlementsSetting = setting(settings, 'CODE_SIGN_ENTITLEMENTS');
  if (entitlementsSetting && !entitlementsSetting.includes('$')) {
    const file = resolve(xcode.sourceRoot, entitlementsSetting);
    const plist = await readPlistFile(file, root, 'CODE_SIGN_ENTITLEMENTS', notes);
    for (const key of Object.keys(plist?.dict ?? {})) entitlements.add(key);
  }
  const iconName = setting(settings, 'ASSETCATALOG_COMPILER_APPICON_NAME') ?? DEFAULT_ICON_NAME;
  return {
    name: target.name,
    xcodeProject: xcode.path,
    configFile: null,
    appClip: target.productType === APP_CLIP,
    info,
    infoPlists,
    unreadInfoPlist: infoPlists.length < files.length + unresolved.length,
    entitlements,
    deploymentTarget: lowestDeploymentTarget(target, pbxproj, context.pbxprojText),
    icon: await findAppIcon(xcode.sourceRoot, iconName, root),
    iconName,
    privacyManifests: context.manifests.filter((file) =>
      isInTarget(file, target, xcode.sourceRoot),
    ),
  };
}

/** The Expo app as one target, from app.json: what prebuild will write into the native project. */
function expoTarget(project: Project, expo: ExpoApp): AppTarget {
  const file = join(project.root, expo.file);
  const info = new Map<string, InfoEntry>();
  for (const [key, value] of Object.entries(expo.infoPlist)) {
    info.set(key, { key, value, file, line: expo.lineOf(`"${key}"`), origin: 'expo-config' });
  }
  if (expo.usesNonExemptEncryption !== undefined && !info.has('ITSAppUsesNonExemptEncryption')) {
    info.set('ITSAppUsesNonExemptEncryption', {
      key: 'ITSAppUsesNonExemptEncryption',
      value: expo.usesNonExemptEncryption,
      file,
      line: expo.lineOf('"usesNonExemptEncryption"'),
      origin: 'expo-config',
    });
  }
  return {
    name: project.name,
    xcodeProject: null,
    configFile: file,
    appClip: false,
    info,
    infoPlists: [],
    unreadInfoPlist: false,
    entitlements: new Set(expo.usesAppleSignIn ? ['com.apple.developer.applesignin'] : []),
    deploymentTarget: expo.deploymentTarget
      ? { version: expo.deploymentTarget, file, line: expo.lineOf('"deploymentTarget"') }
      : null,
    icon: null,
    iconName: DEFAULT_ICON_NAME,
    privacyManifests: [],
  };
}

const NATIVE: ReadonlySet<Language> = new Set(['swift', 'objc', 'strings']);
const JAVASCRIPT: ReadonlySet<Language> = new Set(['js']);
const DART: ReadonlySet<Language> = new Set(['dart', 'strings']);

/** Where each kind of project keeps the code the rules read. */
function sourceRoots(project: Project): SourceRoot[] {
  const roots: SourceRoot[] = [];
  if (project.iosDir) roots.push({ folder: project.iosDir, languages: NATIVE });
  if (project.ecosystem === 'flutter') {
    roots.push({ folder: join(project.root, 'lib'), languages: DART });
  }
  if (project.ecosystem === 'react-native' || project.ecosystem === 'expo') {
    roots.push({ folder: project.root, languages: JAVASCRIPT });
  }
  return roots;
}

/** What a note adds when an .xcodeproj cannot be read. */
export const PROJECT_NOT_CHECKED =
  'Its targets were not checked, so their Info.plist, icon and privacy manifest are not known.';

async function nativeTargets(project: Project, notes: string[]) {
  const targets: AppTarget[] = [];
  let appNotChecked = false;
  const manifests = project.iosDir ? await findNamed(project.iosDir, PRIVACY_MANIFEST, 'file') : [];
  for (const path of project.xcodeProjects) {
    let xcode: XcodeProject;
    try {
      xcode = await readXcodeProject(path, project.root);
    } catch (error) {
      notes.push(
        `${shownPath(path, project.root)}: ${(error as Error).message} ${PROJECT_NOT_CHECKED}`,
      );
      appNotChecked = true;
      continue;
    }
    const pbxprojText = await readProjectText(join(path, 'project.pbxproj'), project.root);
    const context = { xcode, root: project.root, pbxprojText, manifests, notes };
    for (const target of iosAppTargets(xcode)) targets.push(await readTarget(target, context));
  }
  if (
    project.iosDir &&
    project.xcodeProjects.length > 0 &&
    targets.length === 0 &&
    !appNotChecked
  ) {
    notes.push('No iOS app target was found in the Xcode project.');
    appNotChecked = true;
  }
  const included = new Set(targets.flatMap((target) => target.privacyManifests));
  const stray = manifests.filter((file) => !included.has(file));
  return { targets, appNotChecked, strayPrivacyManifests: stray };
}

/** Reads the app targets, configs and sources of a detected project. */
export async function collectApp(project: Project): Promise<AppModel> {
  const notes = [...project.notes];
  const expo = project.expoConfig ? readExpoApp(project.expoConfig) : null;
  if (project.expoConfig && expo === null) {
    notes.push(
      `${project.expoConfig.file} is code and is not run: reviewready reads the native project and app.json only, so values set in it are not checked.`,
    );
  }
  const native = await nativeTargets(project, notes);
  const targets = native.targets;
  if (project.iosDir === null && expo) targets.push(expoTarget(project, expo));
  const sources = await readSources(sourceRoots(project), project.root);
  notes.push(...sources.notes);
  return {
    project,
    targets,
    sources: sources.files,
    expo,
    podfile: project.iosDir ? await readPodfile(project.iosDir, project.root) : null,
    xcodePins: await xcodePins(project.root, project.xcodeVersionFile),
    strayPrivacyManifests: native.strayPrivacyManifests,
    appNotChecked: native.appNotChecked || (project.iosDir === null && expo === null),
    notes,
  };
}
