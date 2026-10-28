import { randomBytes } from 'node:crypto';
import { constants } from 'node:fs';
import { lstat, open, rename, unlink } from 'node:fs/promises';
import { dirname, isAbsolute, join, relative, sep } from 'node:path';

/** A report file that could not be written: a problem of the path, not of reviewready. */
export class OutputError extends Error {
  override name = 'OutputError';
}

// O_EXCL: the temporary file is always new. O_NOFOLLOW is not defined on Windows; O_EXCL alone
// already refuses a link there.
const TEMP_FLAGS =
  constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | (constants.O_NOFOLLOW ?? 0);

// Reasons for the errno codes a path or a full disk can cause; anything else keeps its message.
const REASONS: Record<string, string> = {
  EACCES: 'permission denied',
  EPERM: 'permission denied',
  EROFS: 'the file system is read-only',
  ENOENT: 'its folder does not exist',
  ENOTDIR: 'a part of the path is not a folder',
  EISDIR: 'it is a folder',
  ENOSPC: 'the disk is full',
  EDQUOT: 'the disk quota is used up',
};

const linkMessage = (path: string, link: string) =>
  link === path
    ? `${path} is a symbolic link; reviewready does not write a report through one. Remove the link or choose another --output path.`
    : `${path} is inside ${link}, a symbolic link; reviewready does not write a report through one. Remove the link or choose another --output path.`;

/** The error of a failed open, write or rename as an OutputError, which the CLI does not call a bug. */
function writeError(path: string, error: unknown): OutputError {
  const { code, message } = error as NodeJS.ErrnoException;
  if (code === 'ELOOP') return new OutputError(linkMessage(path, path));
  const reason = (code && REASONS[code]) ?? message;
  return new OutputError(`cannot write the report to ${path}: ${reason}`);
}

/** The folders between `root` and `path` (`root` excluded, `path` included), or none outside it. */
function stepsBelow(root: string, path: string): string[] {
  const rest = relative(root, path);
  if (!rest || rest === '..' || rest.startsWith(`..${sep}`) || isAbsolute(rest)) return [];
  const parts = rest.split(sep);
  return parts.map((_, index) => join(root, ...parts.slice(0, index + 1)));
}

/**
 * Writes the report to `path` (absolute), but never through a symbolic link inside one of
 * `roots`: the current folder and the checked project can come from a pull request, and a
 * `reviewready.md` or a `reports/` folder in it that links outside would make the write land
 * wherever the link points. Links above the roots (such as macOS's /tmp -> /private/tmp) belong
 * to the machine, not to the project, and are followed.
 *
 * The report is written to a new temporary file next to the target, opened with O_EXCL and
 * O_NOFOLLOW, and renamed into place: rename replaces a name and never follows a link, so a link
 * planted between the check and the write is replaced, not written through.
 */
export async function writeReport(path: string, text: string, roots: string[]): Promise<void> {
  const steps = new Set(roots.flatMap((root) => stepsBelow(root, path)));
  for (const step of [...steps].sort((a, b) => a.length - b.length)) {
    const status = await lstat(step).catch(() => undefined);
    if (status?.isSymbolicLink()) throw new OutputError(linkMessage(path, step));
    if (step === path && status?.isDirectory()) throw writeError(path, { code: 'EISDIR' });
  }
  const temp = join(
    dirname(path),
    `.reviewready-${process.pid}-${randomBytes(6).toString('hex')}.tmp`,
  );
  let file: Awaited<ReturnType<typeof open>>;
  try {
    file = await open(temp, TEMP_FLAGS, 0o666);
  } catch (error) {
    throw writeError(path, error);
  }
  try {
    try {
      await file.writeFile(text);
    } finally {
      await file.close();
    }
    await rename(temp, path);
  } catch (error) {
    await unlink(temp).catch(() => undefined);
    throw writeError(path, error);
  }
}
