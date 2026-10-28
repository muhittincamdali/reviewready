import { chmodSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import {
  listSourceFiles,
  MAX_DEPTH,
  readSources,
  SOURCE_LIMITS,
  type SourceLimits,
  sourceFile,
} from '../../src/collect/sources.js';
import { tree } from '../helpers/tree.js';

describe('listSourceFiles', () => {
  it('lists app code and skips dependencies, builds, tests, other platforms and configs', async () => {
    const root = tree({
      'App.tsx': '',
      'src/screens/Home.tsx': '',
      'src/screens/Home.web.tsx': '',
      'src/screens/Home.test.tsx': '',
      'src/types.d.ts': '',
      'metro.config.js': '',
      'node_modules/x/index.js': '',
      'ios/App/AppDelegate.swift': '',
      'android/app/Main.js': '',
      '__tests__/App.test.tsx': '',
      'README.md': '',
    });
    const { files } = await listSourceFiles(root, new Set(['js']));
    expect(files.map((file) => file.slice(root.length + 1))).toEqual([
      'App.tsx',
      'src/screens/Home.tsx',
    ]);
  });

  it('reads Swift and Objective-C under ios/ itself but not Pods or test targets', async () => {
    const root = tree({
      'ios/App/AppDelegate.swift': '',
      'ios/App/Bridge.m': '',
      'ios/App/Bridge.h': '',
      'ios/Pods/Lib/Lib.swift': '',
      'ios/AppTests/AppTests.swift': '',
    });
    const { files } = await listSourceFiles(join(root, 'ios'), new Set(['swift', 'objc']));
    expect(files.map((file) => file.slice(root.length + 1))).toEqual([
      'ios/App/AppDelegate.swift',
      'ios/App/Bridge.h',
      'ios/App/Bridge.m',
    ]);
  });

  // Folders 1 to `levels` deep under the root, as a relative path.
  const nested = (levels: number) =>
    Array.from({ length: levels }, (_, index) => `L${index + 1}`).join('/');

  it(`searches ${MAX_DEPTH} folder levels and returns the folders below them`, async () => {
    const root = tree({
      [`${nested(MAX_DEPTH)}/Shallow.swift`]: '',
      [`${nested(MAX_DEPTH + 1)}/Deep.swift`]: '',
      [`${nested(MAX_DEPTH)}/Pods/L${MAX_DEPTH + 1}/Lib.swift`]: '',
    });
    const listing = await listSourceFiles(root, new Set(['swift']));
    expect(listing.files.map((file) => file.slice(root.length + 1))).toEqual([
      `${nested(MAX_DEPTH)}/Shallow.swift`,
    ]);
    // A skipped folder is never searched, so it is not missed either.
    expect(listing.tooDeep).toEqual([join(root, nested(MAX_DEPTH + 1))]);
    expect(listing.unreadable).toEqual([]);
  });
});

describe('readSources', () => {
  it('reads each file once, sorted, with its language', async () => {
    const root = tree({ 'lib/main.dart': 'void main() {}', 'lib/a/b.dart': '' });
    const dart = new Set(['dart'] as const);
    const { files, notes, incomplete } = await readSources(
      [
        { folder: join(root, 'lib'), languages: dart },
        { folder: join(root, 'lib', 'a'), languages: dart },
      ],
      root,
    );
    expect(notes).toEqual([]);
    expect(incomplete).toBe(false);
    expect(files.map((file) => [file.path.slice(root.length + 1), file.language])).toEqual([
      ['lib/a/b.dart', 'dart'],
      ['lib/main.dart', 'dart'],
    ]);
  });

  const limited = (limits: Partial<SourceLimits>) => ({ ...SOURCE_LIMITS, ...limits });
  const swift = new Set(['swift'] as const);

  it('skips a file over the per-file limit with a note', async () => {
    const root = tree({ 'ios/App/A.swift': 'x'.repeat(50), 'ios/App/Big.swift': 'x'.repeat(200) });
    const { files, notes } = await readSources(
      [{ folder: join(root, 'ios'), languages: swift }],
      root,
      limited({ fileBytes: 100 }),
    );
    expect(files.map((file) => file.path.slice(root.length + 1))).toEqual(['ios/App/A.swift']);
    expect(notes).toEqual(['Source files not read (larger than 0 MB each): ios/App/Big.swift.']);
  });

  it('says the sources are not all known when a limit leaves a file out', async () => {
    const root = tree(
      Object.fromEntries(
        Array.from({ length: 4 }, (_, index) => [`ios/F${index}.swift`, 'x'.repeat(10)]),
      ),
    );
    const read = (limits: Partial<SourceLimits>) =>
      readSources([{ folder: join(root, 'ios'), languages: swift }], root, limited(limits));
    expect((await read({})).incomplete).toBe(false);
    // Exactly at each limit, every file is read.
    expect((await read({ fileBytes: 10, files: 4, totalBytes: 40 })).incomplete).toBe(false);
    expect((await read({ fileBytes: 9 })).incomplete).toBe(true);
    expect((await read({ files: 3 })).incomplete).toBe(true);
    expect((await read({ totalBytes: 39 })).incomplete).toBe(true);
  });

  it.skipIf(process.getuid?.() === 0)(
    'names a file it could not read and says the sources are not all known',
    async () => {
      const root = tree({ 'ios/App/Main.swift': '', 'ios/App/Contacts.swift': 'CNContactStore()' });
      const locked = join(root, 'ios', 'App', 'Contacts.swift');
      chmodSync(locked, 0o000);
      try {
        const result = await readSources([{ folder: join(root, 'ios'), languages: swift }], root);
        expect(result.files.map((file) => file.path.slice(root.length + 1))).toEqual([
          'ios/App/Main.swift',
        ]);
        expect(result.notes).toEqual([
          'Source files not read (could not be read): ios/App/Contacts.swift.',
        ]);
        expect(result.incomplete).toBe(true);
      } finally {
        chmodSync(locked, 0o600);
      }
    },
  );

  it('reads the first files by path up to the file count', async () => {
    const root = tree(
      Object.fromEntries(Array.from({ length: 6 }, (_, index) => [`ios/F${index}.swift`, ''])),
    );
    const { files, notes } = await readSources(
      [{ folder: join(root, 'ios'), languages: swift }],
      root,
      limited({ files: 4 }),
    );
    expect(files).toHaveLength(4);
    expect(notes).toEqual([
      'The project has 6 source files; reviewready read the first 4 by path.',
    ]);
  });

  it('stops at the total and names the files it left out', async () => {
    const root = tree(
      Object.fromEntries(
        Array.from({ length: 8 }, (_, index) => [`ios/F${index}.swift`, 'x'.repeat(10)]),
      ),
    );
    const { files, notes } = await readSources(
      [{ folder: join(root, 'ios'), languages: swift }],
      root,
      limited({ totalBytes: 35 }),
    );
    expect(files).toHaveLength(3);
    expect(notes).toEqual([
      'Source files not read (after the first 0 MB of source): ios/F3.swift, ios/F4.swift, ios/F5.swift and 2 more.',
    ]);
  });

  it('does not read a source folder linked to a folder outside the project', async () => {
    const outside = tree({ 'Secret.swift': 'let secret = 1' });
    const root = tree({ 'App/Main.swift': 'let main = 1' });
    symlinkSync(outside, join(root, 'ios'));
    const { files, notes } = await readSources(
      [
        { folder: join(root, 'ios'), languages: swift },
        { folder: join(root, 'App'), languages: swift },
      ],
      root,
    );
    expect(files.map((file) => file.path.slice(root.length + 1))).toEqual(['App/Main.swift']);
    expect(notes).toEqual(['ios is outside the project; its source files were not read.']);
  });

  it('does not read a source folder given as a .. path out of the project', async () => {
    const parent = tree({ 'other/Secret.swift': 'let secret = 1', 'app/Main.swift': '' });
    const root = join(parent, 'app');
    const { files, notes } = await readSources(
      [{ folder: join(root, '..', 'other'), languages: swift }],
      root,
    );
    expect(files).toEqual([]);
    expect(notes).toEqual(['../other is outside the project; its source files were not read.']);
  });

  it('reads a source folder linked to a folder inside the project', async () => {
    const root = tree({ 'native/ios/App.swift': '' });
    symlinkSync(join(root, 'native', 'ios'), join(root, 'ios'));
    const { files, notes } = await readSources(
      [{ folder: join(root, 'ios'), languages: swift }],
      root,
    );
    expect(files.map((file) => file.path.slice(root.length + 1))).toEqual(['ios/App.swift']);
    expect(notes).toEqual([]);
  });

  it('names the folders it did not search and says the sources are not all known', async () => {
    const levels = Array.from({ length: MAX_DEPTH + 1 }, (_, index) => `L${index + 1}`);
    const files: Record<string, string> = { 'ios/App/Main.swift': '' };
    for (const branch of ['a', 'b', 'c', 'd']) {
      files[`ios/${branch}/${levels.join('/')}/Contacts.swift`] = 'CNContactStore()';
    }
    const root = tree(files);
    const result = await readSources([{ folder: join(root, 'ios'), languages: swift }], root);
    expect(result.files.map((file) => file.path.slice(root.length + 1))).toEqual([
      'ios/App/Main.swift',
    ]);
    const deepest = levels.slice(0, MAX_DEPTH).join('/');
    expect(result.notes).toEqual([
      `Source folders not searched (more than ${MAX_DEPTH} levels down): ios/a/${deepest}, ios/b/${deepest}, ios/c/${deepest} and 1 more.`,
    ]);
    expect(result.incomplete).toBe(true);
  });

  // A root user can list a folder without read permission, so this case needs another user.
  it.skipIf(process.getuid?.() === 0)(
    'names a folder it could not list and says the sources are not all known',
    async () => {
      const root = tree({ 'ios/App/Main.swift': '', 'ios/Locked/Contacts.swift': '' });
      const locked = join(root, 'ios', 'Locked');
      chmodSync(locked, 0o000);
      try {
        const result = await readSources([{ folder: join(root, 'ios'), languages: swift }], root);
        expect(result.files.map((file) => file.path.slice(root.length + 1))).toEqual([
          'ios/App/Main.swift',
        ]);
        expect(result.notes).toEqual([
          'Source folders not searched (could not be listed): ios/Locked.',
        ]);
        expect(result.incomplete).toBe(true);
      } finally {
        chmodSync(locked, 0o700);
      }
    },
  );

  it.skipIf(process.getuid?.() === 0)(
    'names the project folder itself when it could not be listed',
    async () => {
      const root = tree({ 'package.json': '{}', 'App.tsx': '' });
      chmodSync(root, 0o300);
      try {
        const result = await readSources([{ folder: root, languages: new Set(['js']) }], root);
        expect(result.files).toEqual([]);
        expect(result.notes).toEqual([
          'Source folders not searched (could not be listed): the project folder.',
        ]);
        expect(result.incomplete).toBe(true);
      } finally {
        chmodSync(root, 0o700);
      }
    },
  );

  it('gives line numbers by offset', () => {
    const file = sourceFile('/a.swift', 'one\ntwo\nthree');
    expect(file.lineAt(0)).toBe(1);
    expect(file.lineAt(file.text.indexOf('three'))).toBe(3);
  });
});
