// The source files of an app that the rules read: Swift and Objective-C under the iOS folder,
// JavaScript and TypeScript of a React Native or Expo app, Dart under a Flutter app's lib/, and the
// app's localized strings (.strings, .xcstrings, .arb), which hold the words its screens show.
// Each code file is kept as written and with its comments and string contents blanked out.
import type { Dirent } from 'node:fs';
import { readdir, realpath } from 'node:fs/promises';
import { extname, join, relative, sep } from 'node:path';
import { isInside, megabytes, readProjectFile } from '../core/files.js';
import { lineIndex } from '../core/lines.js';
import { blankCommentsAndStrings } from './blank.js';

export { blankCommentsAndStrings } from './blank.js';

export type Language = 'swift' | 'objc' | 'js' | 'dart' | 'strings';

export interface SourceFile {
  path: string;
  language: Language;
  /** The file as written. */
  text: string;
  /** The same text with comments and string contents replaced by spaces; offsets and lines match. */
  code: string;
  /** 1-based line of an offset. */
  lineAt(offset: number): number;
}

export const EXTENSIONS: Readonly<Record<string, Language>> = {
  '.swift': 'swift',
  '.m': 'objc',
  '.mm': 'objc',
  '.h': 'objc',
  '.js': 'js',
  '.jsx': 'js',
  '.ts': 'js',
  '.tsx': 'js',
  '.mjs': 'js',
  '.cjs': 'js',
  '.dart': 'dart',
  '.strings': 'strings',
  '.xcstrings': 'strings',
  '.arb': 'strings',
};

/** Folders that hold dependencies, build output, tests or other platforms. */
const SKIPPED =
  /^(Pods|node_modules|build|DerivedData|\.build|Carthage|\.git|\.symlinks|\.expo|\.dart_tool|Flutter|android|web|windows|linux|macos|ios|.*Tests|__tests__|test|tests|e2e|.*\.xcodeproj|.*\.xcworkspace|.*\.xcassets|.*\.framework|.*\.xcframework)$/;

/** Files that are not app code: type declarations, tests, web-only variants and configs. */
const SKIPPED_FILES = /(\.d\.ts|\.(test|spec)\.[jt]sx?|\.web\.[jt]sx?|\.config\.[cm]?[jt]s)$/;

/** Folder levels searched below a source root; a hostile project could nest folders without end. */
export const MAX_DEPTH = 12;

/** Errors that mean a folder has nothing to list, not that its files are unknown. */
const NOTHING_TO_LIST = new Set(['ENOENT', 'ENOTDIR']);

export interface SourceListing {
  /** The source files found, sorted. */
  files: string[];
  /** Folders deeper than MAX_DEPTH, which were not searched. */
  tooDeep: string[];
  /** Folders that could not be listed, for example for lack of permission. */
  unreadable: string[];
}

/**
 * Every file with one of `languages` under `folder`, skipping dependencies, builds, tests and the
 * other platforms' folders. `folder` itself may be one of those names (for example ios/). The
 * folders it could not search are returned with the files, so the report can say what it missed.
 */
export async function listSourceFiles(
  folder: string,
  languages: ReadonlySet<Language>,
): Promise<SourceListing> {
  const found: string[] = [];
  const tooDeep: string[] = [];
  const unreadable: string[] = [];
  const walk = async (dir: string, depth: number) => {
    let entries: Dirent[];
    try {
      entries = await readdir(dir, { withFileTypes: true });
    } catch (error) {
      if (!NOTHING_TO_LIST.has((error as NodeJS.ErrnoException).code ?? '')) unreadable.push(dir);
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) {
        if (SKIPPED.test(entry.name)) continue;
        const child = join(dir, entry.name);
        if (depth >= MAX_DEPTH) tooDeep.push(child);
        else await walk(child, depth + 1);
        continue;
      }
      const language = EXTENSIONS[extname(entry.name)];
      if (
        entry.isFile() &&
        language &&
        languages.has(language) &&
        !SKIPPED_FILES.test(entry.name)
      ) {
        found.push(join(dir, entry.name));
      }
    }
  };
  await walk(folder, 0);
  return { files: found.sort(), tooDeep: tooDeep.sort(), unreadable: unreadable.sort() };
}

export function sourceFile(path: string, text: string): SourceFile {
  const language = EXTENSIONS[extname(path)] ?? 'swift';
  return {
    path,
    language,
    text,
    // A strings file is all text: the rules only read what it says.
    code: language === 'strings' ? text : blankCommentsAndStrings(text, language),
    lineAt: lineIndex(text),
  };
}

/** Where to look for sources, and in which languages. */
export interface SourceRoot {
  folder: string;
  languages: ReadonlySet<Language>;
}

/**
 * How much source reviewready reads. Sources can come from a pull request; a large app has a few
 * thousand files of a few hundred KB at most, and every file is held twice (as written and
 * blanked) while the rules run.
 */
export interface SourceLimits {
  fileBytes: number;
  files: number;
  totalBytes: number;
}

export const SOURCE_LIMITS: Readonly<SourceLimits> = {
  /** A file larger than this is generated or not app code; it is skipped with a note. */
  fileBytes: 4_000_000,
  files: 20_000,
  totalBytes: 128_000_000,
};

/** Files read at the same time. */
const READ_BATCH = 32;
/** File names a note lists before it only counts the rest. */
const NAMED_IN_NOTE = 3;

export interface SourceSet {
  files: SourceFile[];
  /** Files and folders that were not read, for the report. */
  notes: string[];
  /**
   * Whether a source folder was too deep or could not be listed. Its files are not known, and one
   * of them may call an API that needs a purpose string, so the result is not known either.
   */
  foldersNotSearched: boolean;
}

/** "Source files not read (why): a, b, c and 4 more." */
function skippedNote(paths: string[], why: string, what = 'Source files not read'): string {
  const named = paths.slice(0, NAMED_IN_NOTE).join(', ');
  const rest = paths.length - NAMED_IN_NOTE;
  return `${what} (${why}): ${named}${rest > 0 ? ` and ${rest} more` : ''}.`;
}

interface ReadResult {
  files: SourceFile[];
  tooLarge: string[];
  overBudget: string[];
}

/**
 * Reads `paths` in order, skipping files outside `root` or over the per-file limit and stopping at
 * the total.
 */
async function readWithin(
  paths: string[],
  root: string,
  limits: Readonly<SourceLimits>,
): Promise<ReadResult> {
  const result: ReadResult = { files: [], tooLarge: [], overBudget: [] };
  let total = 0;
  for (let start = 0; start < paths.length; start += READ_BATCH) {
    const batch = paths.slice(start, start + READ_BATCH);
    const reads = await Promise.all(
      batch.map((path) => readProjectFile(path, root, limits.fileBytes)),
    );
    reads.forEach((read, index) => {
      const path = batch[index] ?? '';
      if (!read.found) {
        if (read.reason === 'too-large') result.tooLarge.push(path);
      } else if (total + read.bytes.length > limits.totalBytes) {
        result.overBudget.push(path);
      } else {
        total += read.bytes.length;
        result.files.push(sourceFile(path, read.bytes.toString('utf8')));
      }
    });
  }
  return result;
}

/** `path` relative to `base`, with forward slashes. */
const shownPath = (path: string, base: string) => relative(base, path).split(sep).join('/');

/**
 * The source roots whose real path is inside the real `projectRoot`. A folder from the project may
 * be a link (ios/ -> /somewhere/else) or a `..` path; its files are not the project's and are not
 * read.
 */
async function rootsInside(
  roots: readonly SourceRoot[],
  projectRoot: string,
  notes: string[],
): Promise<SourceRoot[]> {
  const realRoot = await realpath(projectRoot).catch(() => projectRoot);
  const inside: SourceRoot[] = [];
  for (const root of roots) {
    const real = await realpath(root.folder).catch(() => null);
    // A missing folder has no files to read.
    if (real === null) continue;
    if (isInside(real, realRoot)) {
      inside.push(root);
      continue;
    }
    const shown = shownPath(root.folder, projectRoot);
    notes.push(`${shown} is outside the project; its source files were not read.`);
  }
  return inside;
}

/**
 * Reads every source file under the given roots that is inside `projectRoot`, each file once,
 * sorted by path, within `limits`. What is left out is listed in `notes`, with paths relative to
 * `projectRoot`.
 */
export async function readSources(
  roots: readonly SourceRoot[],
  projectRoot: string,
  limits: Readonly<SourceLimits> = SOURCE_LIMITS,
): Promise<SourceSet> {
  const shown = (paths: string[]) => paths.map((path) => shownPath(path, projectRoot));
  const notes: string[] = [];
  const inside = await rootsInside(roots, projectRoot, notes);
  const listings = await Promise.all(
    inside.map((root) => listSourceFiles(root.folder, root.languages)),
  );
  // The project folder itself is relative to itself as "", which a note cannot show.
  const folders = (paths: string[]) => [
    ...new Set(shown(paths).map((path) => path || 'the project folder')),
  ];
  const tooDeep = folders(listings.flatMap((listing) => listing.tooDeep));
  const unreadable = folders(listings.flatMap((listing) => listing.unreadable));
  if (tooDeep.length > 0) {
    notes.push(
      skippedNote(tooDeep, `more than ${MAX_DEPTH} levels down`, 'Source folders not searched'),
    );
  }
  if (unreadable.length > 0) {
    notes.push(skippedNote(unreadable, 'could not be listed', 'Source folders not searched'));
  }
  const paths = [...new Set(listings.flatMap((listing) => listing.files))].sort();
  if (paths.length > limits.files) {
    notes.push(
      `The project has ${paths.length} source files; reviewready read the first ${limits.files} by path.`,
    );
  }
  const { files, tooLarge, overBudget } = await readWithin(
    paths.slice(0, limits.files),
    projectRoot,
    limits,
  );
  if (tooLarge.length > 0) {
    notes.push(skippedNote(shown(tooLarge), `larger than ${megabytes(limits.fileBytes)} each`));
  }
  if (overBudget.length > 0) {
    notes.push(
      skippedNote(shown(overBudget), `after the first ${megabytes(limits.totalBytes)} of source`),
    );
  }
  return { files, notes, foldersNotSearched: tooDeep.length > 0 || unreadable.length > 0 };
}
