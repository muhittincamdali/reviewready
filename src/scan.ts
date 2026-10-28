// Scans one project: detects it, reads it, runs the rules and builds the report.
import { relative, sep } from 'node:path';
import { collectApp } from './collect/app.js';
import { detectProject } from './detect/project.js';
import {
  type CheckSummary,
  type Finding,
  type Report,
  SCHEMA_VERSION,
  type Verdict,
  type VersionInfo,
} from './model.js';
import { REPOSITORY_URL } from './report/text.js';
import { checkApp } from './rules/check.js';
import { RULE_DATA, RULE_IDS, type RuleId, ruleById, type Severity } from './rules/data.js';
import type { Hit } from './rules/hit.js';
import { VERSION } from './version.js';

const SEVERITY_ORDER: Record<Severity, number> = { error: 0, warning: 1, info: 2 };

export interface ScanOptions {
  /** Rules to leave out of the findings; they are reported as ignored. */
  ignore?: readonly RuleId[];
}

const plural = (count: number, word: string, many = `${word}s`) =>
  `${count} ${count === 1 ? word : many}`;

function toFinding(hit: Hit, root: string): Finding {
  const rule = ruleById(hit.rule);
  const variant = rule.fixes[hit.variant] ? hit.variant : Object.keys(rule.fixes)[0];
  const fix = variant ? rule.fixes[variant as keyof typeof rule.fixes] : undefined;
  return {
    rule: hit.rule,
    severity: rule.severity,
    title: rule.title,
    message: hit.message,
    file: relative(root, hit.file).split(sep).join('/') || '.',
    line: hit.line,
    target: hit.target ?? null,
    fix: fix
      ? {
          id: `${hit.rule}/${variant}`,
          title: fix.title,
          steps: fix.steps,
          guide: `${REPOSITORY_URL}/blob/main/${fix.guide}`,
        }
      : null,
    sources: rule.sources,
  };
}

function byPlace(left: Finding, right: Finding): number {
  return (
    SEVERITY_ORDER[left.severity] - SEVERITY_ORDER[right.severity] ||
    left.rule.localeCompare(right.rule) ||
    left.file.localeCompare(right.file) ||
    (left.line ?? 0) - (right.line ?? 0) ||
    left.message.localeCompare(right.message)
  );
}

/**
 * The one-line verdict. `appKnown` is false when the app's Xcode project or Expo config could not
 * be read: then the app is never called ready, whatever else was found.
 */
export function verdictOf(findings: readonly Finding[], appKnown = true): Verdict {
  const errors = findings.filter((item) => item.severity === 'error').length;
  const warnings = findings.filter((item) => item.severity === 'warning').length;
  const andWarnings = warnings > 0 ? `, and ${plural(warnings, 'warning')} to review` : '';
  if (errors > 0) {
    return {
      code: 'rejected',
      text: `${plural(errors, 'problem')} App Review or App Store Connect turns away${andWarnings}`,
    };
  }
  if (!appKnown) {
    return {
      code: 'not-known',
      text: `Not known: the app's project or config could not be read (see the notes)${andWarnings}`,
    };
  }
  if (warnings > 0) {
    return { code: 'review', text: `${plural(warnings, 'warning')} App Review may flag` };
  }
  return {
    code: 'ready',
    text: 'No rejection found in the files reviewready reads',
  };
}

function checkSummaries(
  findings: readonly Finding[],
  checked: ReadonlySet<RuleId>,
  ignored: ReadonlySet<RuleId>,
): CheckSummary[] {
  return RULE_IDS.map((rule) => ({
    rule,
    title: ruleById(rule).title,
    status: ignored.has(rule)
      ? 'ignored'
      : findings.some((item) => item.rule === rule)
        ? 'found'
        : checked.has(rule)
          ? 'passed'
          : 'not-checked',
  }));
}

/** Scans the project at `path` (absolute) and returns the report. */
export async function scan(path: string, options: ScanOptions = {}): Promise<Report> {
  const project = await detectProject(path);
  const app = await collectApp(project);
  const outcome = await checkApp(app);
  const ignored = new Set(options.ignore ?? []);
  const findings = outcome.hits
    .filter((hit) => !ignored.has(hit.rule))
    .map((hit) => toFinding(hit, project.root))
    .sort(byPlace);
  const shown = (file: string) => relative(project.root, file).split(sep).join('/') || '.';
  const versions: VersionInfo[] = [...project.packages.values()].map((item) => ({
    name: item.name,
    version: item.version,
    source: item.source,
  }));
  if (project.flutter?.version) {
    versions.push({ name: 'flutter', version: project.flutter.version, source: 'pinned' });
  }
  return {
    schemaVersion: SCHEMA_VERSION,
    tool: { name: 'reviewready', version: VERSION },
    rules: { ruleSet: RULE_DATA.ruleSet, dataVersion: RULE_DATA.dataVersion, read: RULE_DATA.read },
    project: {
      path,
      name: project.name,
      ecosystem: project.ecosystem,
      versions,
      targets: app.targets.map((target) => ({
        name: target.name,
        infoPlists: target.infoPlists.map(shown),
        deploymentTarget: target.deploymentTarget?.version ?? null,
      })),
      xcode: app.xcodePins.map((pin) => ({ ...pin, file: shown(pin.file) })),
    },
    verdict: verdictOf(
      findings,
      !app.appNotChecked && !app.targets.some((target) => target.unreadInfoPlist),
    ),
    findings,
    checks: checkSummaries(findings, outcome.checked, ignored),
    notes: [...app.notes, ...outcome.notes],
    summary: {
      errors: findings.filter((item) => item.severity === 'error').length,
      warnings: findings.filter((item) => item.severity === 'warning').length,
      info: findings.filter((item) => item.severity === 'info').length,
    },
  };
}
