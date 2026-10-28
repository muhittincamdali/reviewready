// The terminal report: the verdict first, then each finding with where it is, what it means and
// the source it rests on, then each fix once, lettered, with its steps and guide, and last the
// list of checks that passed. render() has already replaced the control characters in every
// string of the report.
import type { CheckStatus, FixAdvice, Finding, Report } from '../model.js';
import { countsLine, ECOSYSTEM_LABELS, RULES_URL, toolchainLine, wrap } from './text.js';

export interface TtyOptions {
  color: boolean;
  /** Total width to wrap to (default 100, at least 60). */
  width?: number;
}

type Style = 'bold' | 'dim' | 'red' | 'yellow' | 'cyan' | 'green' | 'blue';
const CODES: Record<Style, [number, number]> = {
  bold: [1, 22],
  dim: [2, 22],
  red: [31, 39],
  yellow: [33, 39],
  green: [32, 39],
  cyan: [36, 39],
  blue: [34, 39],
};

const LABEL_WIDTH = 9;
const INDENT = ' '.repeat(LABEL_WIDTH);
const SEVERITY_STYLE = { error: 'red', warning: 'yellow', info: 'cyan' } as const;
const VERDICT_STYLE = {
  rejected: 'red',
  'not-known': 'yellow',
  review: 'yellow',
  ready: 'green',
} as const;
const CHECK_MARK: Record<CheckStatus, string> = {
  found: '✗',
  passed: '✓',
  'not-checked': '–',
  ignored: '·',
};
const CHECK_STYLE: Record<CheckStatus, Style> = {
  found: 'red',
  passed: 'green',
  'not-checked': 'dim',
  ignored: 'dim',
};
const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

type Paint = (style: Style, text: string) => string;

function painter(color: boolean): Paint {
  return (style, text) => {
    if (!color) return text;
    const [open, close] = CODES[style];
    return `\u001b[${open}m${text}\u001b[${close}m`;
  };
}

/** Each distinct fix of the report with its letter, in order of first appearance. */
function letterFixes(
  findings: readonly Finding[],
): Map<string, { letter: string; fix: FixAdvice }> {
  const result = new Map<string, { letter: string; fix: FixAdvice }>();
  for (const item of findings) {
    if (!item.fix || result.has(item.fix.id)) continue;
    result.set(item.fix.id, { letter: LETTERS[result.size] ?? '?', fix: item.fix });
  }
  return result;
}

function header(report: Report, paint: Paint, width: number): string[] {
  const { project, rules } = report;
  const dim = (text: string) => wrap(text, width).map((line) => paint('dim', line));
  const [name = '', ...rest] = wrap(
    `${project.name} · ${ECOSYSTEM_LABELS[project.ecosystem]} · ${project.path}`,
    width,
  );
  const nameLength = project.name.length;
  const lines = [
    ...dim(
      `reviewready ${report.tool.version} · rules ${rules.ruleSet}@${rules.dataVersion} (sources read ${rules.read})`,
    ),
    '',
    `${paint('bold', name.slice(0, nameLength))}${name.slice(nameLength)}`,
    ...rest,
  ];
  const toolchain = toolchainLine(report);
  if (toolchain) lines.push(...dim(toolchain));
  for (const version of project.versions) {
    lines.push(...dim(`${version.name} ${version.version ?? '(unknown)'} (${version.source})`));
  }
  for (const target of project.targets) {
    const plists = target.infoPlists.length > 0 ? ` (${target.infoPlists.join(', ')})` : '';
    lines.push(...dim(`target ${target.name}${plists}`));
  }
  const style = VERDICT_STYLE[report.verdict.code];
  lines.push(
    '',
    ...wrap(report.verdict.text, width).map((line) => paint('bold', paint(style, line))),
    '',
  );
  return lines;
}

function fixSection(
  fixes: Map<string, { letter: string; fix: FixAdvice }>,
  paint: Paint,
  width: number,
) {
  const out = [paint('bold', 'How to fix'), ''];
  for (const { letter, fix } of fixes.values()) {
    out.push(`${paint('bold', `[${letter}]`.padEnd(LABEL_WIDTH))}${paint('bold', fix.title)}`);
    fix.steps.forEach((step, index) => {
      const marker = `${index + 1}. `;
      const [first = '', ...rest] = wrap(step, width - LABEL_WIDTH - marker.length);
      out.push(
        `${INDENT}${marker}${first}`,
        ...rest.map((line) => `${INDENT}${' '.repeat(marker.length)}${line}`),
      );
    });
    out.push(`${INDENT}${paint('dim', fix.guide)}`, '');
  }
  return out;
}

function checkSection(report: Report, paint: Paint): string[] {
  const out = [paint('bold', 'Checks'), ''];
  for (const check of report.checks) {
    const mark = paint(CHECK_STYLE[check.status], CHECK_MARK[check.status]);
    const status =
      check.status === 'passed' || check.status === 'found' ? '' : ` (${check.status})`;
    out.push(`  ${mark} ${check.rule}  ${check.title}${paint('dim', status)}`);
  }
  out.push('');
  return out;
}

export function renderTty(report: Report, options: TtyOptions): string {
  const paint = painter(options.color);
  const width = Math.max(60, options.width ?? 100);
  const body = (text: string, style?: Style) =>
    wrap(text, width - LABEL_WIDTH).map((line) => `${INDENT}${style ? paint(style, line) : line}`);
  const fixes = letterFixes(report.findings);
  const out = header(report, paint, width);

  for (const item of report.findings) {
    const label = item.severity.toUpperCase().padEnd(LABEL_WIDTH);
    const style = SEVERITY_STYLE[item.severity];
    const [titleFirst = '', ...titleRest] = wrap(
      `${item.rule}  ${item.title}`,
      width - LABEL_WIDTH,
    );
    out.push(
      `${paint('bold', paint(style, label))}${paint('bold', titleFirst)}`,
      ...titleRest.map((line) => `${INDENT}${paint('bold', line)}`),
      `${INDENT}${paint('blue', `${item.file}${item.line ? `:${item.line}` : ''}`)}`,
      ...body(item.message),
    );
    const fix = item.fix ? fixes.get(item.fix.id) : undefined;
    if (fix) out.push(...body(`Fix: [${fix.letter}] ${fix.fix.title}`, 'bold'));
    const source = item.sources[0];
    if (source) out.push(...body(`Source: ${source.url}`, 'dim'));
    out.push('');
  }

  if (fixes.size > 0) out.push(...fixSection(fixes, paint, width));
  out.push(...checkSection(report, paint));
  for (const note of report.notes) {
    out.push(...wrap(`Note: ${note}`, width).map((line) => paint('dim', line)));
  }
  if (report.notes.length) out.push('');
  out.push(paint('bold', countsLine(report)), paint('dim', `Rules and sources: ${RULES_URL}`));
  return `${out.join('\n')}\n`;
}
