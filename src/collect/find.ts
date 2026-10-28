// Finds files and folders by name under a project folder, skipping dependencies and build output.
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';

/** Folders that never hold the app's own files. */
const SKIPPED = /^(Pods|node_modules|build|DerivedData|\.build|Carthage|\.git|\.symlinks)$/;
const MAX_DEPTH = 8;

/**
 * Every folder (`kind` "folder") or regular file (`kind` "file") called `name` under `folder`,
 * sorted. A folder with the name is not searched further.
 */
export async function findNamed(
  folder: string,
  name: string,
  kind: 'file' | 'folder',
): Promise<string[]> {
  const found: string[] = [];
  const walk = async (dir: string, depth: number) => {
    if (depth > MAX_DEPTH) return;
    const entries = await readdir(dir, { withFileTypes: true }).catch(() => []);
    for (const entry of entries) {
      const path = join(dir, entry.name);
      if (entry.name === name && (kind === 'file' ? entry.isFile() : entry.isDirectory())) {
        found.push(path);
        continue;
      }
      if (entry.isDirectory() && !SKIPPED.test(entry.name)) await walk(path, depth + 1);
    }
  };
  await walk(folder, 0);
  return found.sort();
}
