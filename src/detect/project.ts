// Recognises what kind of project a folder holds (native iOS, Flutter, React Native or Expo),
// where its iOS app project is, the packages it depends on, and the Flutter and Xcode versions it
// pins. The npm packages and
// the Expo config are read in packages.ts.
import { readdir, stat } from 'node:fs/promises';
import { basename, dirname, join, resolve } from 'node:path';
import { readProjectText } from '../core/files.js';
import {
  dependencyNames,
  type ExpoConfig,
  expoConfig,
  MANIFEST_NOT_CHECKED,
  type PackageVersion,
  packageVersions,
  readJson,
  readManifest,
  record,
} from './packages.js';

export type { ExpoConfig, PackageVersion } from './packages.js';

export type Ecosystem = 'native' | 'flutter' | 'react-native' | 'expo';

export interface FlutterInfo {
  /** From .fvmrc or .fvm/fvm_config.json; null when the project does not pin one. */
  version: string | null;
  plugin: boolean;
}

export interface Project {
  root: string;
  name: string;
  ecosystem: Ecosystem;
  /** The folder with the iOS app's Xcode project; null for an Expo app without ios/. */
  iosDir: string | null;
  /** Absolute paths of the .xcodeproj folders of the app. */
  xcodeProjects: string[];
  /** The versions of react-native and expo, when the app depends on them. */
  packages: ReadonlyMap<string, PackageVersion>;
  /**
   * The packages the app ships: `dependencies` of package.json, or the top-level `dependencies:`
   * of a Flutter pubspec.yaml. Empty for a native app.
   */
  dependencies: ReadonlySet<string>;
  flutter: FlutterInfo | null;
  expoConfig: ExpoConfig | null;
  /** The Xcode version in .xcode-version (the file xcodes and CI setups read), when there is one. */
  xcodeVersionFile: string | null;
  /** Report notes about project files that are there but could not be used, e.g. package.json. */
  notes: string[];
}

export class ProjectError extends Error {
  override name = 'ProjectError';
}

const SKIPPED_FOLDERS = new Set([
  'Pods',
  'node_modules',
  'build',
  'DerivedData',
  '.build',
  'Carthage',
  '.git',
  '.symlinks',
]);

async function xcodeProjectsIn(folder: string): Promise<string[]> {
  try {
    const entries = await readdir(folder, { withFileTypes: true });
    return entries
      .filter((entry) => entry.isDirectory() && entry.name.endsWith('.xcodeproj'))
      .map((entry) => join(folder, entry.name))
      .sort();
  } catch {
    return [];
  }
}

/** Native apps keep the .xcodeproj at the root or one folder down (App/App.xcodeproj). */
async function nativeXcodeProjects(root: string): Promise<string[]> {
  const top = await xcodeProjectsIn(root);
  if (top.length > 0) return top;
  const entries = await readdir(root, { withFileTypes: true }).catch(() => []);
  const nested = await Promise.all(
    entries
      .filter((entry) => entry.isDirectory() && !SKIPPED_FOLDERS.has(entry.name))
      .map((entry) => xcodeProjectsIn(join(root, entry.name))),
  );
  return nested.flat().sort();
}

/**
 * Whether the top-level `flutter:` section of a pubspec has a `plugin:` key: a Flutter plugin,
 * whose app is example/. Read line by line; a multi-line pattern that let whitespace span lines
 * retried at every blank line, which made a pubspec of blank lines quadratic.
 */
export function isFlutterPlugin(pubspec: string): boolean {
  let inFlutter = false;
  for (const line of pubspec.split('\n')) {
    if (/^flutter:\s*$/.test(line)) {
      inFlutter = true;
      continue;
    }
    if (!inFlutter || line.trim() === '') continue;
    if (!/^\s/.test(line)) inFlutter = false;
    else if (/^\s+plugin:/.test(line)) return true;
  }
  return false;
}

/**
 * The package names under the top-level `dependencies:` of a pubspec.yaml, read line by line like
 * isFlutterPlugin. dev_dependencies are test and build tools and are not part of the app.
 */
export function pubspecDependencies(pubspec: string): Set<string> {
  const names = new Set<string>();
  let inDependencies = false;
  let indent: number | null = null;
  for (const line of pubspec.split('\n')) {
    if (/^dependencies:\s*(#.*)?$/.test(line)) {
      inDependencies = true;
      indent = null;
      continue;
    }
    if (!inDependencies || line.trim() === '' || line.trim().startsWith('#')) continue;
    if (!/^\s/.test(line)) {
      inDependencies = false;
      continue;
    }
    const match = /^(\s+)([A-Za-z_][\w]*)\s*:/.exec(line);
    if (!match?.[1] || !match[2]) continue;
    indent ??= match[1].length;
    if (match[1].length === indent) names.add(match[2]);
  }
  return names;
}

async function flutterInfo(root: string, pubspec: string): Promise<FlutterInfo> {
  const fvmrc = record(await readJson(join(root, '.fvmrc'), root));
  const fvmConfig = record(await readJson(join(root, '.fvm', 'fvm_config.json'), root));
  const pinned = fvmrc.flutter ?? fvmConfig.flutterSdkVersion;
  return {
    version: typeof pinned === 'string' ? pinned : null,
    plugin: isFlutterPlugin(pubspec),
  };
}

/**
 * Detects the project at `path`: a project folder, or an .xcodeproj folder for a native app.
 * Throws ProjectError when there is nothing iOS to check.
 */
export async function detectProject(path: string): Promise<Project> {
  const target = resolve(path);
  const info = await stat(target).catch(() => null);
  if (!info) throw new ProjectError(`${path} does not exist.`);
  if (info.isDirectory() && target.endsWith('.xcodeproj')) {
    return nativeProject(dirname(target), [target], await xcodeVersionFile(dirname(target)));
  }
  if (!info.isDirectory()) throw new ProjectError(`${path} is not a folder.`);

  const pubspec = await readProjectText(join(target, 'pubspec.yaml'), target);
  if (pubspec !== null && /^[ \t]+sdk:[ \t]*flutter\b|^flutter:/m.test(pubspec)) {
    const flutter = await flutterInfo(target, pubspec);
    const iosDir = join(target, flutter.plugin ? join('example', 'ios') : 'ios');
    const xcodeProjects = await xcodeProjectsIn(iosDir);
    if (xcodeProjects.length === 0) {
      throw new ProjectError(`${path} is a Flutter project without an iOS app (no ${iosDir}).`);
    }
    const name = /^name:\s*([\w-]+)/m.exec(pubspec)?.[1] ?? basename(target);
    return {
      root: target,
      name,
      ecosystem: 'flutter',
      iosDir,
      xcodeProjects,
      packages: new Map(),
      dependencies: pubspecDependencies(pubspec),
      flutter,
      expoConfig: null,
      xcodeVersionFile: await xcodeVersionFile(target),
      notes: [],
    };
  }

  const { manifest, problem } = await readManifest(target);
  const { versions: packages, notes: packageNotes } = await packageVersions(target, manifest);
  if (packages.has('expo') || packages.has('react-native')) {
    const ecosystem = packages.has('expo') ? 'expo' : 'react-native';
    const iosDir = join(target, 'ios');
    const xcodeProjects = await xcodeProjectsIn(iosDir);
    if (xcodeProjects.length === 0 && ecosystem === 'react-native') {
      throw new ProjectError(`${path} is a React Native project without ios/.`);
    }
    return {
      root: target,
      name: typeof manifest.name === 'string' ? manifest.name : basename(target),
      ecosystem,
      iosDir: xcodeProjects.length > 0 ? iosDir : null,
      xcodeProjects,
      packages,
      dependencies: dependencyNames(manifest),
      flutter: null,
      expoConfig: ecosystem === 'expo' ? await expoConfig(target) : null,
      xcodeVersionFile: await xcodeVersionFile(target),
      notes: packageNotes,
    };
  }

  const xcodeProjects = await nativeXcodeProjects(target);
  if (xcodeProjects.length === 0) {
    throw new ProjectError(
      `No iOS project found in ${path}: expected an .xcodeproj, a Flutter pubspec.yaml or a React Native or Expo package.json.${problem ? ` package.json ${problem}` : ''}`,
    );
  }
  const notes = problem ? [`package.json ${problem} ${MANIFEST_NOT_CHECKED}`] : [];
  return nativeProject(target, xcodeProjects, await xcodeVersionFile(target), notes);
}

/** The first line of .xcode-version, e.g. "26.4" or "27.1". */
async function xcodeVersionFile(root: string): Promise<string | null> {
  const text = await readProjectText(join(root, '.xcode-version'), root);
  const version = text?.trim().split('\n')[0]?.trim();
  return version && /^\d+(\.\d+){0,2}$/.test(version) ? version : null;
}

function nativeProject(
  root: string,
  xcodeProjects: string[],
  xcodeVersion: string | null,
  notes: string[] = [],
): Project {
  const first = xcodeProjects[0] ?? root;
  return {
    root,
    name: basename(first).replace(/\.xcodeproj$/, ''),
    ecosystem: 'native',
    iosDir: dirname(first),
    xcodeProjects,
    packages: new Map(),
    dependencies: new Set(),
    flutter: null,
    expoConfig: null,
    xcodeVersionFile: xcodeVersion,
    notes,
  };
}
