import { execFileSync, spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { EXTENSIONS } from '../../src/collect/sources.js';
import { scratchDir } from '../helpers/scratch.js';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const hasJq = spawnSync('jq', ['--version']).status === 0;

describe('examples/api/summary.mjs', () => {
  it('imports the built package by name and prints the fixtures by errors', () => {
    const output = execFileSync(process.execPath, ['examples/api/summary.mjs'], {
      cwd: ROOT,
      encoding: 'utf8',
    });
    expect(
      output
        .trim()
        .split('\n')
        .map((line) => line.split(':')[0]?.replace(/\s+/g, ' ').trim()),
    ).toEqual([
      '5 errors 5 warnings Ledger (native)',
      '4 errors 5 warnings harvest (flutter)',
      '3 errors 2 warnings Lens (react-native)',
      '2 errors 2 warnings field-notes (expo)',
      '0 errors 2 warnings hello-world (expo)',
      '0 errors 0 warnings Atlas (native)',
    ]);
  });
});

describe.skipIf(!hasJq)('examples/shell/errors-only.sh', () => {
  const run = (fixture: string) =>
    execFileSync('sh', ['examples/shell/errors-only.sh', fixture], { cwd: ROOT, encoding: 'utf8' });

  it('lists only the errors, with their place', () => {
    expect(run('fixtures/expo-58-camera')).toBe(
      'app.json RVW101 The expo-tracking-transparency package (its config plugin is not in expo.plugins) needs NSUserTrackingUsageDescription (App Tracking Transparency); field-notes has none.\n' +
        'eas.json:8 RVW601 eas.json pins Xcode 16.4 (EAS image); App Store Connect accepts uploads built with Xcode 26 or later since 28 April 2026.\n',
    );
  });

  it('prints nothing for a project with warnings only', () => {
    expect(run('fixtures/expo-58-default')).toBe('');
  });
});

describe('examples/github-actions/reviewready.yml', () => {
  // The shell of the check step, with the release tarball replaced by the local build and the
  // checked folder passed as $CHECK. GitHub runs it with `bash -e`.
  const workflow = readFileSync(join(ROOT, 'examples/github-actions/reviewready.yml'), 'utf8');
  const block = workflow.split('- name: Check for App Review rejections')[1]?.split('\n\n')[0];
  const script = (block ?? '')
    .split('\n')
    .slice(2)
    .map((line) => line.replace(/^ {10}/, ''))
    .join('\n')
    .replace(
      /npx --yes --package=\S+ \\\n\s+reviewready/,
      `node ${JSON.stringify(join(ROOT, 'dist/cli/main.js'))} "$CHECK"`,
    );

  const runStep = (check: string) => {
    const cwd = scratchDir('action');
    const summary = join(cwd, 'summary.md');
    const result = spawnSync('bash', ['-e', '-c', script], {
      cwd,
      encoding: 'utf8',
      env: { ...process.env, CHECK: check, GITHUB_STEP_SUMMARY: summary },
    });
    return { status: result.status, summary: readFileSync(summary, 'utf8') };
  };

  it('runs when any file reviewready reads changes', () => {
    const section = workflow.split('    paths:\n')[1]?.split('  workflow_dispatch:')[0] ?? '';
    const paths = [...section.matchAll(/^ {6}- '([^']+)'$/gm)].map((match) => match[1]);
    const sources = Object.keys(EXTENSIONS).map((extension) => `**/*${extension}`);
    expect(paths).toEqual(
      expect.arrayContaining([
        ...sources,
        '**/*.xcodeproj/**',
        '**/Info.plist',
        '**/*.entitlements',
        '**/*.xcassets/**',
        '**/PrivacyInfo.xcprivacy',
        '**/Podfile',
        'package.json',
        'app.json',
        'eas.json',
        'pubspec.yaml',
        '.xcode-version',
        '.github/workflows/**',
        'codemagic.yaml',
        'bitrise.yml',
        '.circleci/**',
        '**/fastlane/Fastfile',
      ]),
    );
  });

  it('limits how long the job may run and replaces only the tarball command', () => {
    expect(workflow).toMatch(/^ {4}timeout-minutes: 10$/m);
    expect(script).not.toContain('npx');
    expect(script).toContain(
      '"$CHECK" --format markdown --output reviewready.md --fail-on error || status=$?',
    );
  });

  it('adds the report to the summary and fails the job on errors', () => {
    const { status, summary } = runStep(join(ROOT, 'fixtures/native-swiftui-rejected'));
    expect(status).toBe(1);
    expect(summary).toMatch(/^## reviewready: Ledger \(native iOS\)/);
  });

  it('passes a project with warnings only', () => {
    const { status, summary } = runStep(join(ROOT, 'fixtures/expo-58-default'));
    expect(status).toBe(0);
    expect(summary).toContain('RVW201');
  });

  it('keeps exit code 2 when reviewready writes no report', () => {
    const { status, summary } = runStep(scratchDir('empty'));
    expect(status).toBe(2);
    expect(summary).toBe('reviewready exited with 2 and wrote no report; see the step log.\n');
  });
});
