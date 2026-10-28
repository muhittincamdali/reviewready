import { writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { MAX_PROJECT_FILE_BYTES, NOT_READ, readProjectFile } from '../../src/core/files.js';
import { tree } from '../helpers/tree.js';

describe('readProjectFile', () => {
  it('reads a regular file inside the project up to the limit', async () => {
    const root = tree({ 'Info.plist': 'x'.repeat(10) });
    const file = await readProjectFile(join(root, 'Info.plist'), root, 10);
    expect(file.found && file.bytes.length).toBe(10);
  });

  it('does not read a file over the limit', async () => {
    const root = tree({ 'Info.plist': 'x'.repeat(11) });
    expect(await readProjectFile(join(root, 'Info.plist'), root, 10)).toEqual({
      found: false,
      reason: 'too-large',
    });
  });

  it('uses the project file limit by default and says it in the note', async () => {
    const root = tree({});
    const path = join(root, 'Info.plist');
    writeFileSync(path, Buffer.alloc(MAX_PROJECT_FILE_BYTES + 1));
    expect(await readProjectFile(path, root)).toEqual({ found: false, reason: 'too-large' });
    expect(NOT_READ['too-large']).toBe('is larger than 32 MB; it was not read.');
  });
});
