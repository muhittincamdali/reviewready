// Reads the app targets of an Xcode project from project.pbxproj (an old-style "OpenStep"
// property list): their names, product types and the build settings that decide which Info.plist
// they use and which platform they build for.
import { dirname, join, resolve } from 'node:path';
import { NOT_READ, readProjectFile } from '../core/files.js';
import {
  type OpenStepDict,
  type OpenStepValue,
  parseOpenStep,
  XcodeProjectError,
} from './openstep.js';

export type BuildSettings = Readonly<Record<string, string | readonly string[]>>;

export interface XcodeTarget {
  name: string;
  productType: string;
  /** Build settings per configuration (Debug, Release, …), project-level values included. */
  configurations: Readonly<Record<string, BuildSettings>>;
  /** File names (last path component) in the target's Copy Bundle Resources phase. */
  resources: string[];
  /**
   * Folders Xcode 16 and later add to the target as a whole (PBXFileSystemSynchronizedRootGroup),
   * relative to the folder that contains the .xcodeproj: every file in them is part of the target.
   */
  synchronizedFolders: string[];
}

export interface XcodeProject {
  /** Path of the .xcodeproj folder. */
  path: string;
  /** The folder that contains the .xcodeproj, which $(SRCROOT) refers to. */
  sourceRoot: string;
  targets: XcodeTarget[];
  /** The Xcode version that last upgraded the project (attributes.LastUpgradeCheck), e.g. "2610". */
  lastUpgradeCheck: string | null;
}

const asDict = (value: OpenStepValue | undefined): OpenStepDict | undefined =>
  typeof value === 'object' && !Array.isArray(value) ? value : undefined;
const asString = (value: OpenStepValue | undefined): string | undefined =>
  typeof value === 'string' ? value : undefined;
const asArray = (value: OpenStepValue | undefined): OpenStepValue[] =>
  Array.isArray(value) ? value : [];

function settingsOf(dict: OpenStepDict | undefined): Record<string, string | string[]> {
  const result: Record<string, string | string[]> = {};
  for (const [key, value] of Object.entries(dict ?? {})) {
    if (typeof value === 'string') result[key] = value;
    else if (Array.isArray(value)) result[key] = value.filter((item) => typeof item === 'string');
  }
  return result;
}

function configurationsOf(
  objects: OpenStepDict,
  listId: string | undefined,
): Map<string, Record<string, string | string[]>> {
  const result = new Map<string, Record<string, string | string[]>>();
  const list = asDict(objects[listId ?? '']);
  for (const id of asArray(list?.buildConfigurations)) {
    const configuration = asDict(objects[asString(id) ?? '']);
    const name = asString(configuration?.name);
    if (configuration && name) result.set(name, settingsOf(asDict(configuration.buildSettings)));
  }
  return result;
}

const lastComponent = (path: string) => path.split('/').filter(Boolean).at(-1) ?? path;

/** The file names a target's PBXResourcesBuildPhase copies into the app. */
function resourcesOf(objects: OpenStepDict, target: OpenStepDict): string[] {
  const names: string[] = [];
  for (const phaseId of asArray(target.buildPhases)) {
    const phase = asDict(objects[asString(phaseId) ?? '']);
    if (asString(phase?.isa) !== 'PBXResourcesBuildPhase') continue;
    for (const buildFileId of asArray(phase?.files)) {
      const buildFile = asDict(objects[asString(buildFileId) ?? '']);
      const file = asDict(objects[asString(buildFile?.fileRef) ?? '']);
      const name = asString(file?.path) ?? asString(file?.name);
      if (name) names.push(lastComponent(name));
    }
  }
  return names;
}

/** The paths of a target's synchronized folders (Xcode 16 and later). */
function synchronizedFoldersOf(objects: OpenStepDict, target: OpenStepDict): string[] {
  const paths: string[] = [];
  for (const id of asArray(target.fileSystemSynchronizedGroups)) {
    const group = asDict(objects[asString(id) ?? '']);
    const path = asString(group?.path);
    if (path && asString(group?.isa) === 'PBXFileSystemSynchronizedRootGroup') paths.push(path);
  }
  return paths;
}

/** attributes.LastUpgradeCheck of the project's root object, when it has one. */
export function lastUpgradeCheck(pbxproj: OpenStepValue): string | null {
  const objects = asDict(asDict(pbxproj)?.objects);
  const project = asDict(objects?.[asString(asDict(pbxproj)?.rootObject) ?? '']);
  return asString(asDict(project?.attributes)?.LastUpgradeCheck) ?? null;
}

/** Reads the native targets of a parsed project.pbxproj. */
export function readTargets(pbxproj: OpenStepValue): XcodeTarget[] {
  const objects = asDict(asDict(pbxproj)?.objects);
  const rootId = asString(asDict(pbxproj)?.rootObject);
  if (!objects || !rootId) throw new XcodeProjectError('project.pbxproj has no objects.');
  const project = asDict(objects[rootId]);
  if (!project) throw new XcodeProjectError('project.pbxproj has no root object.');
  const projectConfigurations = configurationsOf(objects, asString(project.buildConfigurationList));

  const targets: XcodeTarget[] = [];
  for (const id of asArray(project.targets)) {
    const target = asDict(objects[asString(id) ?? '']);
    if (asString(target?.isa) !== 'PBXNativeTarget' || !target) continue;
    const configurations: Record<string, BuildSettings> = {};
    for (const [name, settings] of configurationsOf(
      objects,
      asString(target.buildConfigurationList),
    )) {
      configurations[name] = { ...projectConfigurations.get(name), ...settings };
    }
    targets.push({
      name: asString(target.name) ?? asString(target.productName) ?? 'unnamed',
      productType: asString(target.productType) ?? '',
      configurations,
      resources: resourcesOf(objects, target),
      synchronizedFolders: synchronizedFoldersOf(objects, target),
    });
  }
  return targets;
}

/**
 * Reads `<path>.xcodeproj/project.pbxproj` when it is a regular file inside `root` (by default
 * the .xcodeproj folder itself). Errors name the file as `project.pbxproj`; the caller knows
 * which .xcodeproj it asked for and how to show that path.
 */
export async function readXcodeProject(path: string, root = path): Promise<XcodeProject> {
  const file = join(path, 'project.pbxproj');
  const read = await readProjectFile(file, root);
  if (!read.found) throw new XcodeProjectError(`project.pbxproj ${NOT_READ[read.reason]}`);
  const parsed = parseOpenStep(read.bytes.toString('utf8'));
  return {
    path,
    sourceRoot: dirname(resolve(path)),
    targets: readTargets(parsed),
    lastUpgradeCheck: lastUpgradeCheck(parsed),
  };
}

const APP_PRODUCT_TYPES = new Set([
  'com.apple.product-type.application',
  'com.apple.product-type.application.on-demand-install-capable', // App Clip
]);

/** One build setting as a string (a list is joined with spaces). */
export const setting = (settings: BuildSettings, key: string): string | undefined => {
  const value = settings[key];
  return typeof value === 'string' ? value : value?.join(' ');
};

/** Whether the target builds with the iOS SDK (SDKROOT iphoneos, or `auto` listing iphoneos). */
export function buildsForIOS(settings: BuildSettings): boolean {
  const sdk = setting(settings, 'SDKROOT');
  if (sdk === undefined) return false;
  if (sdk.startsWith('iphoneos')) return true;
  if (sdk === 'auto') return /\biphoneos\b/.test(setting(settings, 'SUPPORTED_PLATFORMS') ?? '');
  return false;
}

/** iOS app targets (apps and App Clips): the ones that are submitted to App Review. */
export function iosAppTargets(project: XcodeProject): XcodeTarget[] {
  return project.targets.filter(
    (target) =>
      APP_PRODUCT_TYPES.has(target.productType) &&
      Object.values(target.configurations).some(buildsForIOS),
  );
}

const VARIABLE = /\$\(([A-Za-z0-9_]+)\)|\$\{([A-Za-z0-9_]+)\}/g;

/**
 * The Info.plist files a target's configurations name in INFOPLIST_FILE, as absolute paths.
 * $(SRCROOT), $(PROJECT_DIR), $(TARGET_NAME) and $(PRODUCT_NAME) are expanded; a path that still
 * contains an unknown variable is returned in `unresolved`.
 */
export function infoPlistFiles(
  project: XcodeProject,
  target: XcodeTarget,
): { files: string[]; unresolved: string[] } {
  const files = new Set<string>();
  const unresolved = new Set<string>();
  for (const settings of Object.values(target.configurations)) {
    const raw = setting(settings, 'INFOPLIST_FILE');
    if (!raw) continue;
    const known: Record<string, string> = {
      SRCROOT: project.sourceRoot,
      PROJECT_DIR: project.sourceRoot,
      TARGET_NAME: target.name,
      PRODUCT_NAME:
        setting(settings, 'PRODUCT_NAME')?.replace(VARIABLE, target.name) ?? target.name,
    };
    let missing = false;
    const expanded = raw.replace(VARIABLE, (whole, round?: string, curly?: string) => {
      const value = known[round ?? curly ?? ''];
      if (value === undefined) missing = true;
      return value ?? whole;
    });
    if (missing) unresolved.add(raw);
    else files.add(resolve(project.sourceRoot, expanded));
  }
  return { files: [...files], unresolved: [...unresolved] };
}

/** Whether every configuration of the target has Xcode generate (part of) its Info.plist. */
export function generatesInfoPlist(target: XcodeTarget): boolean {
  const values = Object.values(target.configurations);
  return (
    values.length > 0 &&
    values.every((settings) => setting(settings, 'GENERATE_INFOPLIST_FILE') === 'YES')
  );
}
