// Reads files of the checked project. Their names and symbolic links come from the project, so a
// file is read only when it is a regular file and, unless the caller says otherwise, inside the
// project folder: a link to /dev/zero or a FIFO would never end, and a link out of the project
// would read a file the user did not ask to check.
import { readFile, realpath, stat } from 'node:fs/promises';
import { isAbsolute, relative, sep } from 'node:path';

export type ProjectFile =
  | { found: true; bytes: Buffer }
  | { found: false; reason: 'missing' | 'outside' | 'not-file' | 'too-large' };

/**
 * The largest project file reviewready reads: Info.plist, project.pbxproj, package.json and the
 * lock files. A large app's pbxproj or package-lock.json is a few MB; the limit keeps a file from
 * a pull request from costing more memory and time than a real project would.
 */
export const MAX_PROJECT_FILE_BYTES = 32_000_000;

/** A byte count for a report: 32000000 is "32 MB". */
export const megabytes = (bytes: number) => `${Math.round(bytes / 1_000_000)} MB`;

/** How a report says why a file was not read, after the file's name. */
export const NOT_READ = {
  missing: 'does not exist.',
  outside: 'is outside the project; it was not read.',
  'not-file': 'is not a file; it was not read.',
  'too-large': `is larger than ${megabytes(MAX_PROJECT_FILE_BYTES)}; it was not read.`,
} as const;

/** Whether `path` is `folder` or inside it (both already resolved with realpath). */
export function isInside(path: string, folder: string): boolean {
  const rest = relative(folder, path);
  return rest !== '..' && !rest.startsWith(`..${sep}`) && !isAbsolute(rest);
}

/**
 * Reads `path` when it is a regular file inside `root` of at most `maxBytes`. With `root` null
 * only the regular-file check applies, for files a package manager may link from outside the
 * project (node_modules).
 */
export async function readProjectFile(
  path: string,
  root: string | null,
  maxBytes = MAX_PROJECT_FILE_BYTES,
): Promise<ProjectFile> {
  let real: string;
  try {
    real = await realpath(path);
  } catch {
    return { found: false, reason: 'missing' };
  }
  if (root !== null && !isInside(real, await realpath(root).catch(() => root))) {
    return { found: false, reason: 'outside' };
  }
  try {
    const info = await stat(real);
    if (!info.isFile()) return { found: false, reason: 'not-file' };
    if (info.size > maxBytes) return { found: false, reason: 'too-large' };
    const bytes = await readFile(real);
    // The file may have grown between stat and read.
    if (bytes.length > maxBytes) return { found: false, reason: 'too-large' };
    return { found: true, bytes };
  } catch {
    return { found: false, reason: 'missing' };
  }
}

/** The text of `path` (see readProjectFile), or null when it is not read. */
export async function readProjectText(path: string, root: string | null): Promise<string | null> {
  const file = await readProjectFile(path, root);
  return file.found ? file.bytes.toString('utf8') : null;
}
