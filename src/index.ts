/**
 * reviewready checks a native iOS, Flutter or React Native/Expo project for the App Review
 * rejections its files can show before you submit: purpose strings, export compliance, account
 * deletion, Sign in with Apple, the App Store icon, the Xcode and iOS minimums and the privacy
 * manifest. Every rule cites its source.
 *
 * ```js
 * import { render, scan } from '@mcamdali/reviewready';
 *
 * const report = await scan('path/to/app', { ignore: ['RVW301'] });
 * console.log(report.verdict.text, report.summary);
 * console.log(render(report, 'markdown'));
 * ```
 *
 * The command-line tool is `reviewready`; this module is the same scan for scripts.
 *
 * @packageDocumentation
 */
export { type CliEnvironment, EXIT, FAIL_ON, failsOn, PACKAGE_NAME, run } from './cli/run.js';
export { type Ecosystem, ProjectError } from './detect/project.js';
export type {
  CheckStatus,
  CheckSummary,
  Finding,
  FixAdvice,
  Report,
  TargetSummary,
  Verdict,
  VerdictCode,
  VersionInfo,
  XcodePinSummary,
} from './model.js';
export { SCHEMA_VERSION } from './model.js';
export { FORMATS, type Format, render, type TtyOptions } from './report/index.js';
export {
  FIX_VARIANTS,
  type FixVariant,
  RULE_DATA,
  RULE_IDS,
  type Rule,
  type RuleData,
  type RuleFix,
  type RuleId,
  type RuleSource,
  ruleDataSchema,
  ruleFixSchema,
  ruleSchema,
  ruleSourceSchema,
  SEVERITIES,
  type Severity,
} from './rules/data.js';
export { type ScanOptions, scan, verdictOf } from './scan.js';
export { VERSION } from './version.js';
