// The report reviewready produces: one project, what it found, which checks passed and what it
// could not read. The JSON output is this structure as-is (schemaVersion 0, which may change
// before 1.0).
import type { Ecosystem } from './detect/project.js';
import type { RuleId, RuleSource, Severity } from './rules/data.js';

export const SCHEMA_VERSION = 0;

/** The fix reviewready suggests for a finding, from the rule data. */
export interface FixAdvice {
  /** The rule and the variant of its fix, e.g. "RVW101/info-plist"; the same fix has the same id. */
  id: string;
  title: string;
  steps: string[];
  /** Link to the reviewready guide for this rule. */
  guide: string;
}

export interface Finding {
  rule: RuleId;
  severity: Severity;
  title: string;
  /** What was found at this place, in one sentence. */
  message: string;
  /** Path relative to the checked folder, with forward slashes. */
  file: string;
  line: number | null;
  /** The app target the finding belongs to, when it is about one target. */
  target: string | null;
  fix: FixAdvice | null;
  sources: RuleSource[];
}

/**
 * What happened to each rule: `found` (it has findings), `passed` (it ran and found nothing),
 * `not-checked` (nothing it applies to, or a file it needs was not read) or `ignored` (--ignore).
 */
export type CheckStatus = 'found' | 'passed' | 'not-checked' | 'ignored';

export interface CheckSummary {
  rule: RuleId;
  title: string;
  status: CheckStatus;
}

export interface TargetSummary {
  name: string;
  /** Info.plist paths relative to the checked folder that reviewready read. */
  infoPlists: string[];
  /** IPHONEOS_DEPLOYMENT_TARGET, the lowest over the target's configurations. */
  deploymentTarget: string | null;
}

/**
 * The verdict, most serious first. `rejected`: an error-level finding, which App Review or App
 * Store Connect turns away. `not-known`: part of the app (its project, config, Info.plist or a
 * source folder) could not be read.
 */
export type VerdictCode = 'rejected' | 'not-known' | 'review' | 'ready';

export interface Verdict {
  code: VerdictCode;
  text: string;
}

export interface VersionInfo {
  name: string;
  version: string | null;
  /** installed, lockfile, declared (lowest version the range allows) or pinned (Flutter). */
  source: string;
}

export interface XcodePinSummary {
  version: string;
  /** Path relative to the checked folder. */
  file: string;
  line: number | null;
  via: string;
}

export interface Report {
  schemaVersion: typeof SCHEMA_VERSION;
  tool: { name: 'reviewready'; version: string };
  /** The rule data: its version, and the day its sources were read. */
  rules: { ruleSet: string; dataVersion: string; read: string };
  project: {
    /** The folder as given on the command line. */
    path: string;
    name: string;
    ecosystem: Ecosystem;
    versions: VersionInfo[];
    targets: TargetSummary[];
    /** The Xcode versions the build files pin. */
    xcode: XcodePinSummary[];
  };
  verdict: Verdict;
  findings: Finding[];
  checks: CheckSummary[];
  /** Things reviewready could not check or that the reader should know. */
  notes: string[];
  summary: { errors: number; warnings: number; info: number };
}
