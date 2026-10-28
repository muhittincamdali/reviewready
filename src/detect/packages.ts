// The npm side of a React Native or Expo project: package.json, the packages the app depends on,
// the versions of React Native and Expo, and the Expo config.
import { realpath } from 'node:fs/promises';
import { join, sep } from 'node:path';
import { NOT_READ, readProjectFile, readProjectText } from '../core/files.js';
import { JsonDepthError, parseJson } from '../core/json.js';
import { lowestAllowed } from '../core/versions.js';

export interface PackageVersion {
  name: string;
  /** Exact version when installed or locked, otherwise the lowest the declared range allows. */
  version: string | null;
  /** Where `version` came from. */
  source: 'installed' | 'lockfile' | 'declared';
  /** The range in package.json. */
  declared: string;
}

export interface ExpoConfig {
  /** Path relative to the project: app.json, or app.config.js/ts (read as text, not evaluated). */
  file: string;
  /** The file as written. */
  text: string;
  /** The `expo` object of app.json; null for app.config.js/ts. */
  json: Record<string, unknown> | null;
}

/** npm packages whose version the report shows: they decide which project files exist. */
export const WATCHED_PACKAGES = ['react-native', 'expo'] as const;

export const record = (value: unknown): Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)
    ? (value as Record<string, unknown>)
    : {};

/**
 * Parses `path` read with readProjectText; undefined when it is not read, is not JSON or nests too
 * deep (see parseJson).
 */
export async function readJson(path: string, root: string | null): Promise<unknown> {
  const text = await readProjectText(path, root);
  if (text === null) return undefined;
  try {
    return parseJson(text);
  } catch {
    return undefined;
  }
}

/** What a note about an unusable package.json adds: what the report could not check. */
export const MANIFEST_NOT_CHECKED =
  'React Native and Expo apps are recognised by it, so the app was checked as native iOS: its npm packages, the Expo config and the JavaScript sources were not checked.';

/**
 * The package.json of `root`, and why it cannot be used when it is there but is not read, is not
 * JSON or is not an object (null when it is missing or fine). A broken package.json must not turn
 * a React Native app into a native one without a word in the report.
 */
export async function readManifest(
  root: string,
): Promise<{ manifest: Record<string, unknown>; problem: string | null }> {
  const file = await readProjectFile(join(root, 'package.json'), root);
  if (!file.found) {
    return { manifest: {}, problem: file.reason === 'missing' ? null : NOT_READ[file.reason] };
  }
  let value: unknown;
  try {
    value = parseJson(file.bytes.toString('utf8'));
  } catch (error) {
    if (error instanceof JsonDepthError)
      return { manifest: {}, problem: `${error.message}; it was not read.` };
    // The parser's message quotes the file; the note says only what is wrong with it.
    return { manifest: {}, problem: 'is not valid JSON.' };
  }
  const manifest = record(value);
  return { manifest, problem: manifest === value ? null : 'does not hold a JSON object.' };
}

/** A version number as npm writes it, of a sane length; anything else is not reported. */
function versionNumber(value: unknown): string | null {
  if (typeof value !== 'string' || value.length > MAX_VERSION_LENGTH) return null;
  return /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.+-]+)?$/.test(value) ? value : null;
}

const MAX_VERSION_LENGTH = 64;

/**
 * The version in node_modules/<name>/package.json. pnpm, Yarn and workspaces link installed
 * packages from outside the app folder, so the file may be anywhere; it is read only when its real
 * path is a package.json in a node_modules/<name> folder. A link to any other file would put a
 * field of that file, which the user did not ask to check, into the report.
 */
async function installedVersion(
  root: string,
  name: string,
  notes: string[],
): Promise<string | null> {
  const shown = `node_modules/${name}/package.json`;
  const real = await realpath(join(root, 'node_modules', name, 'package.json')).catch(() => null);
  if (real === null) return null;
  const tail = ['node_modules', ...name.split('/'), 'package.json'];
  if (real.split(sep).slice(-tail.length).join('/') !== tail.join('/')) {
    notes.push(`${shown} links to a file outside a node_modules/${name} folder; it was not read.`);
    return null;
  }
  return versionNumber(record(await readJson(real, null)).version);
}

/** The watched packages package.json declares, with their versions, and notes about them. */
export async function packageVersions(
  root: string,
  manifest: Record<string, unknown>,
): Promise<{ versions: Map<string, PackageVersion>; notes: string[] }> {
  const declared = {
    ...record(manifest.devDependencies),
    ...record(manifest.dependencies),
  };
  const lock = record(record(await readJson(join(root, 'package-lock.json'), root)).packages);
  const versions = new Map<string, PackageVersion>();
  const notes: string[] = [];
  for (const name of WATCHED_PACKAGES) {
    const range = declared[name];
    if (typeof range !== 'string') continue;
    const installed = await installedVersion(root, name, notes);
    const locked = versionNumber(record(lock[`node_modules/${name}`]).version);
    if (installed !== null) {
      versions.set(name, { name, version: installed, source: 'installed', declared: range });
    } else if (locked !== null) {
      versions.set(name, { name, version: locked, source: 'lockfile', declared: range });
    } else {
      versions.set(name, {
        name,
        version: lowestAllowed(range),
        source: 'declared',
        declared: range,
      });
    }
  }
  return { versions, notes };
}

/**
 * The names of the packages in `dependencies`: the ones the app ships. devDependencies are tools
 * and test helpers, which never reach the build that App Review sees.
 */
export function dependencyNames(manifest: Record<string, unknown>): Set<string> {
  return new Set(Object.keys(record(manifest.dependencies)));
}

export async function expoConfig(root: string): Promise<ExpoConfig | null> {
  for (const file of ['app.config.ts', 'app.config.js', 'app.config.mjs', 'app.config.cjs']) {
    const text = await readProjectText(join(root, file), root);
    if (text !== null) return { file, text, json: null };
  }
  const text = await readProjectText(join(root, 'app.json'), root);
  if (text === null) return null;
  let config: Record<string, unknown> = {};
  try {
    config = record(parseJson(text));
  } catch {
    return { file: 'app.json', text, json: null };
  }
  return { file: 'app.json', text, json: 'expo' in config ? record(config.expo) : config };
}
