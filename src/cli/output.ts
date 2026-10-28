import { constants } from 'node:fs';
import { lstat, open } from 'node:fs/promises';

/** A report file that could not be written: a problem of the path, not of reviewready. */
export class OutputError extends Error {
  override name = 'OutputError';
}

// O_NOFOLLOW is not defined on Windows; there the lstat check alone refuses a link.
const FLAGS =
  constants.O_WRONLY | constants.O_CREAT | constants.O_TRUNC | (constants.O_NOFOLLOW ?? 0);

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

/** The error of a failed open or write as an OutputError, which the CLI does not call a bug. */
function writeError(path: string, error: unknown): OutputError {
  const { code, message } = error as NodeJS.ErrnoException;
  if (code === 'ELOOP') return new OutputError(linkMessage(path));
  const reason = (code && REASONS[code]) ?? message;
  return new OutputError(`cannot write the report to ${path}: ${reason}`);
}

const linkMessage = (path: string) =>
  `${path} is a symbolic link; reviewready does not write a report through one. Remove the link or choose another --output path.`;

/**
 * Writes the report to `path`, but never through a symbolic link: the checked project can bring
 * one along (a reviewready.md in a pull request that points outside it), and following it would
 * overwrite whatever it points to. lstat gives the clear message; O_NOFOLLOW closes the gap between
 * the check and the open.
 */
export async function writeReport(path: string, text: string): Promise<void> {
  const existing = await lstat(path).catch(() => undefined);
  if (existing?.isSymbolicLink()) throw new OutputError(linkMessage(path));
  let file: Awaited<ReturnType<typeof open>>;
  try {
    file = await open(path, FLAGS, 0o666);
  } catch (error) {
    throw writeError(path, error);
  }
  try {
    await file.writeFile(text);
  } catch (error) {
    throw writeError(path, error);
  } finally {
    await file.close();
  }
}
