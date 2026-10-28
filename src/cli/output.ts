import { constants } from 'node:fs';
import { lstat, open } from 'node:fs/promises';

/** A report file that could not be written: a problem of the path, not of reviewready. */
export class OutputError extends Error {
  override name = 'OutputError';
}

// O_NOFOLLOW is not defined on Windows; there the lstat check alone refuses a link.
const FLAGS =
  constants.O_WRONLY | constants.O_CREAT | constants.O_TRUNC | (constants.O_NOFOLLOW ?? 0);

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
    if ((error as NodeJS.ErrnoException).code === 'ELOOP') throw new OutputError(linkMessage(path));
    throw error;
  }
  try {
    await file.writeFile(text);
  } finally {
    await file.close();
  }
}
