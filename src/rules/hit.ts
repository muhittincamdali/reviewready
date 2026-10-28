// What a check returns before the report turns it into a finding: the rule, where, and what was
// seen there. The rule's title, severity, sources and fix text come from the rule data.
import type { AppTarget } from '../collect/app.js';
import type { SourceFile } from '../collect/sources.js';
import type { FixVariant, RuleId } from './data.js';

export interface Hit {
  rule: RuleId;
  /** Absolute path of the file. */
  file: string;
  line: number | null;
  message: string;
  /** Which of the rule's fixes applies. */
  variant: FixVariant;
  target?: string;
}

/**
 * What one check returns: its hits, and the rules it was able to run on this project. A rule that
 * ran without a hit is reported as passed; one that did not run (nothing it applies to, or a file
 * it needs was not read) is reported as not checked.
 */
export interface CheckResult {
  hits: Hit[];
  checked: RuleId[];
}

/** All matches of `pattern` (which must have the g flag) in `text`. */
export function* matchesIn(text: string, pattern: RegExp): Generator<RegExpExecArray> {
  pattern.lastIndex = 0;
  for (let match = pattern.exec(text); match; match = pattern.exec(text)) {
    yield match;
    if (match[0].length === 0) pattern.lastIndex++;
  }
}

/** The first match of `pattern` in the blanked code of the files, with its file and line. */
export function firstMatch(
  files: readonly SourceFile[],
  pattern: RegExp,
  field: 'code' | 'text' = 'code',
): { file: SourceFile; line: number; text: string } | null {
  for (const file of files) {
    const match = pattern.exec(file[field]);
    if (match) return { file, line: file.lineAt(match.index), text: match[0] };
  }
  return null;
}

/** Where a finding about a target's Info.plist goes, and which fix applies there. */
export function infoPlace(target: AppTarget): { file: string; variant: FixVariant } {
  const plist = target.infoPlists[0];
  if (plist) return { file: plist, variant: 'info-plist' };
  if (target.configFile !== null) return { file: target.configFile, variant: 'expo-config' };
  return { file: `${target.xcodeProject}/project.pbxproj`, variant: 'build-setting' };
}
