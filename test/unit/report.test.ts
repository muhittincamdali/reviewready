import { describe, expect, it } from 'vitest';
import type { Finding, Report } from '../../src/model.js';
import { render } from '../../src/report/index.js';
import { clean, countsLine, wrap } from '../../src/report/text.js';
import { RULE_IDS, ruleById } from '../../src/rules/data.js';
import { longDate } from '../../src/rules/toolchain.js';
import { verdictOf } from '../../src/scan.js';

function finding(rule: Finding['rule'], overrides: Partial<Finding> = {}): Finding {
  const data = ruleById(rule);
  return {
    rule,
    severity: data.severity,
    title: data.title,
    message: 'Something.',
    file: 'App/Info.plist',
    line: 3,
    target: 'App',
    fix: {
      id: `${rule}/info-plist`,
      title: 'Do this',
      steps: ['First.', 'Second.'],
      guide: 'https://example.invalid/guide',
    },
    sources: data.sources,
    ...overrides,
  };
}

function report(findings: Finding[], overrides: Partial<Report> = {}): Report {
  return {
    schemaVersion: 0,
    tool: { name: 'reviewready', version: '0.1.0' },
    rules: { ruleSet: 'app-review', dataVersion: '2026.10.28', read: '2026-10-28' },
    project: {
      path: 'app',
      name: 'Ledger',
      ecosystem: 'native',
      versions: [],
      targets: [{ name: 'Ledger', infoPlists: ['Ledger/Info.plist'], deploymentTarget: '17.0' }],
      xcode: [{ version: '27.1', file: '.xcode-version', line: 1, via: '.xcode-version' }],
    },
    verdict: verdictOf(findings),
    findings,
    checks: RULE_IDS.map((rule) => ({
      rule,
      title: ruleById(rule).title,
      status: findings.some((item) => item.rule === rule) ? 'found' : 'passed',
    })),
    notes: [],
    summary: {
      errors: findings.filter((item) => item.severity === 'error').length,
      warnings: findings.filter((item) => item.severity === 'warning').length,
      info: 0,
    },
    ...overrides,
  };
}

describe('verdictOf', () => {
  it('puts errors first, then an app it could not read, then warnings', () => {
    expect(verdictOf([finding('RVW101'), finding('RVW201'), finding('RVW701')])).toEqual({
      code: 'rejected',
      text: '1 problem App Review or App Store Connect turns away, and 2 warnings to review',
    });
    expect(verdictOf([finding('RVW201')], false)).toEqual({
      code: 'not-known',
      text: 'Not known: part of the app could not be read (see the notes), and 1 warning to review',
    });
    expect(verdictOf([finding('RVW201')]).text).toBe('1 warning App Review may flag');
    expect(verdictOf([])).toEqual({
      code: 'ready',
      text: 'No rejection found in the files reviewready reads',
    });
    expect(verdictOf([], false).code).toBe('not-known');
  });
});

describe('render', () => {
  const sample = report([
    finding('RVW101', { line: null, message: 'AVCaptureSession needs NSCameraUsageDescription.' }),
    finding('RVW201', {
      fix: { id: 'RVW201/info-plist', title: 'Declare it', steps: ['Add it.'], guide: 'g' },
    }),
    finding('RVW101', { line: 9 }),
  ]);

  it('prints one lettered fix per distinct fix, the source and every check', () => {
    const text = render(sample, 'text');
    expect(text).toContain('ERROR    RVW101 Purpose string missing');
    expect(text).toContain('App/Info.plist:9');
    expect(text).toContain('Xcode 27.1 pinned · deployment target iOS 17.0');
    expect(text.match(/^\[A\] +Do this$/gm)).toHaveLength(1);
    expect(text.match(/Fix: \[A\] Do this/g)).toHaveLength(2);
    expect(text).toMatch(
      /Source:\s+https:\/\/developer\.apple\.com\/documentation\/uikit\/requesting-access-to-protected-resources/,
    );
    expect(text).toContain('  ✗ RVW101  Purpose string missing');
    expect(text).toContain('  ✓ RVW301  Account creation without account deletion');
    expect(text).toContain('2 errors, 1 warning, 12 checks passed');
    expect(text).toContain('sources read 2026-10-28');
    expect(text).not.toContain('\u001b[');
  });

  it('leaves out fixes, sources and checks in the brief report', () => {
    const brief = render(sample, 'text', { color: false, brief: true });
    expect(brief).toContain('ERROR    RVW101 Purpose string missing');
    expect(brief).toContain('AVCaptureSession needs NSCameraUsageDescription.');
    expect(brief).not.toContain('Fix: [');
    expect(brief).not.toContain('Source:');
    expect(brief).not.toContain('How to fix');
    expect(brief).not.toContain('Checks');
    expect(brief).toContain('Run it without --brief for the fix and source of each finding.');
    expect(render(report([]), 'text', { color: false, brief: true })).toContain(
      'Rules and sources:',
    );
  });

  it('colours the tty report only when asked', () => {
    expect(render(sample, 'tty', { color: true })).toContain('\u001b[31m');
    expect(render(sample, 'tty', { color: false })).toBe(render(sample, 'text'));
  });

  it('names checks that did not run or were ignored', () => {
    const partial = report([], {
      checks: [
        { rule: 'RVW601', title: ruleById('RVW601').title, status: 'not-checked' },
        { rule: 'RVW301', title: ruleById('RVW301').title, status: 'ignored' },
      ],
    });
    const text = render(partial, 'text');
    expect(text).toContain('– RVW601  Xcode older than App Store Connect accepts (not-checked)');
    expect(text).toContain('· RVW301  Account creation without account deletion (ignored)');
    expect(render(partial, 'markdown')).toContain(
      '| RVW601 | Xcode older than App Store Connect accepts | not checked |',
    );
  });

  it('writes the report object as JSON', () => {
    expect(JSON.parse(render(sample, 'json'))).toEqual(sample);
  });

  it('prints each fix once in Markdown and links every source', () => {
    const markdown = render(sample, 'markdown');
    expect(markdown).toContain('## reviewready: Ledger (native iOS)');
    expect(markdown).toContain(
      '| RVW101 | error | `App/Info.plist` | AVCaptureSession needs NSCameraUsageDescription. |',
    );
    expect(markdown.match(/\*\*Fix: Do this\*\* \(\[guide\]/g)).toHaveLength(1);
    expect(markdown).toContain('**Fix: Do this** (steps above)');
    expect(markdown).toContain(
      '[App Review Guidelines 5.1.1\\(ii\\) Permission](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)',
    );
  });

  it('keeps project text from becoming markup, links or terminal escapes', () => {
    const hostile = report([
      finding('RVW104', {
        message: 'NSCameraUsageDescription "[x](https://evil.example) <img> | @team #1"',
        file: 'a`b|c.plist',
      }),
    ]);
    hostile.project.name = 'App\u001b]0;pwned\u0007';
    const markdown = render(hostile, 'markdown');
    expect(markdown).not.toContain('](https://evil');
    expect(markdown).not.toContain('<img>');
    expect(markdown).toContain('\\[x\\]');
    expect(markdown).not.toContain('\u001b');
    expect(render(hostile, 'text')).not.toContain('\u001b]');
    expect(render(hostile, 'json')).not.toContain('\\u001b');
  });

  it('keeps a dollar sign in project text from opening GitHub math', () => {
    const math = report([
      finding('RVW104', { message: 'NSCameraUsageDescription "$\\color{red}{\\text{Approved}}$"' }),
    ]);
    math.project.name = '$$x$$';
    const markdown = render(math, 'markdown');
    expect(markdown).toContain('\\$\\\\color{red}{\\\\text{Approved}}\\$');
    expect(markdown).toContain('\\$\\$x\\$\\$');
    expect(markdown).not.toMatch(/(?<!\\)\$/);
  });
});

describe('text helpers', () => {
  it('wraps on words, replaces control characters and counts', () => {
    expect(wrap('one two three four', 9)).toEqual(['one two', 'three', 'four']);
    expect(clean('a\u0007b\tc\nd\u009b')).toBe('a�b\tc\nd�');
    expect(clean('Info‮tsilp.exe')).toBe('Info�tsilp.exe');
    expect(countsLine(report([]))).toBe('0 errors, 0 warnings, 14 checks passed');
  });

  it('writes requirement dates out', () => {
    expect(longDate('2026-04-28')).toBe('28 April 2026');
    expect(longDate('2026-09-09')).toBe('9 September 2026');
  });
});
