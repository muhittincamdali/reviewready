import { mkdirSync, readFileSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EXIT, failsOn, PACKAGE_NAME, RELEASE_TARBALL_URL } from '../../src/cli/run.js';
import type { Report } from '../../src/model.js';
import { VERSION } from '../../src/version.js';
import { reviewready } from '../helpers/cli.js';
import { pbxproj } from '../helpers/projects.js';
import { scratchDir } from '../helpers/scratch.js';
import { infoPlist, tree } from '../helpers/tree.js';

const REJECTED = 'fixtures/native-swiftui-rejected';
const READY = 'fixtures/native-uikit-ready';
const WARNINGS = 'fixtures/expo-58-default';

describe('exit codes', () => {
  it('is 1 for findings at or above --fail-on (default warning) and 0 below it', async () => {
    expect((await reviewready([REJECTED])).code).toBe(EXIT.findings);
    expect((await reviewready([WARNINGS])).code).toBe(EXIT.findings);
    expect((await reviewready([WARNINGS, '--fail-on', 'error'])).code).toBe(EXIT.ok);
    expect((await reviewready([REJECTED, '--fail-on', 'error'])).code).toBe(EXIT.findings);
    expect((await reviewready([REJECTED, '--fail-on', 'none'])).code).toBe(EXIT.ok);
    expect((await reviewready([READY, '--fail-on', 'info'])).code).toBe(EXIT.ok);
  });

  it('fails on error only when asked, so warnings can pass CI', async () => {
    const report = JSON.parse((await reviewready([REJECTED, '--json'])).stdout) as Report;
    expect(failsOn(report, 'error')).toBe(true);
    const warningsOnly = {
      ...report,
      findings: report.findings.filter((item) => item.severity !== 'error'),
    };
    expect(failsOn(warningsOnly, 'error')).toBe(false);
    expect(failsOn(warningsOnly, 'warning')).toBe(true);
  });

  it('turns rules off with --ignore, as a list or repeated', async () => {
    const result = await reviewready([
      WARNINGS,
      '--ignore',
      'rvw201',
      '--ignore',
      'RVW701',
      '--json',
    ]);
    const report = JSON.parse(result.stdout) as Report;
    expect(report.findings).toEqual([]);
    expect(result.code).toBe(EXIT.ok);
    expect((await reviewready([WARNINGS, '--ignore', 'RVW201,RVW701'])).code).toBe(EXIT.ok);
    const unknown = await reviewready([WARNINGS, '--ignore', 'RVW201,GLS001']);
    expect(unknown.code).toBe(EXIT.error);
    expect(unknown.stderr).toContain('unknown rule GLS001');
  });

  describe('when the app project or a file of it is not read', () => {
    const outside = tree({
      'Info.plist': infoPlist(),
      'ios/Evil.xcodeproj/project.pbxproj': pbxproj(),
    });
    const conflict = tree({
      'App.xcodeproj/project.pbxproj': pbxproj(),
      'App/Info.plist': infoPlist('<<<<<<< HEAD\n<key>A</key><string>b</string>'),
    });
    const linkedPlist = tree({ 'App.xcodeproj/project.pbxproj': pbxproj() });
    mkdirSync(join(linkedPlist, 'App'));
    symlinkSync(join(outside, 'Info.plist'), join(linkedPlist, 'App', 'Info.plist'));
    const linkedIos = tree({ 'package.json': '{"dependencies":{"react-native":"0.88.0"}}' });
    symlinkSync(join(outside, 'ios'), join(linkedIos, 'ios'));
    const configJs = tree({
      'package.json': '{"dependencies":{"expo":"~58.0.20"}}',
      'app.config.ts': 'export default { ios: { infoPlist: {} } };',
    });

    it.each([
      ['an Info.plist with a conflict marker', conflict],
      ['an Info.plist linked outside the project', linkedPlist],
      ['an ios/ folder linked outside the project', linkedIos],
      ['an Expo config written as code', configJs],
    ])('says the result is not known and fails for %s', async (_, root) => {
      const result = await reviewready([root, '--json', '--ignore', 'RVW201,RVW501,RVW701']);
      const report = JSON.parse(result.stdout) as Report;
      expect(report.verdict.code).toBe('not-known');
      expect(result.code).toBe(EXIT.findings);
      expect((await reviewready([root, '--fail-on', 'error'])).code).toBe(EXIT.findings);
      expect((await reviewready([root, '--fail-on', 'none'])).code).toBe(EXIT.ok);
    });
  });

  it('is 2 for a bad option, a missing folder or a folder without an iOS app', async () => {
    const bad = await reviewready([READY, '--format', 'xml']);
    expect(bad.code).toBe(EXIT.error);
    expect(bad.stderr).toContain("argument 'xml' is invalid");
    const missing = await reviewready(['does/not/exist']);
    expect(missing.code).toBe(EXIT.error);
    expect(missing.stderr).toMatch(/^reviewready: \/.*does\/not\/exist does not exist\.\n$/);
    const empty = await reviewready([tree({ 'README.md': '' })]);
    expect(empty.code).toBe(EXIT.error);
    expect(empty.stderr).toMatch(/^reviewready: No iOS project found in /);
    expect(empty.stderr).not.toContain('bug');
  });
});

describe('output', () => {
  it('uses the current folder by default and names it as given', async () => {
    const result = await reviewready(['--json'], { cwd: join(process.cwd(), READY) });
    expect((JSON.parse(result.stdout) as Report).project.path).toBe('.');
  });

  it('--json is the JSON format', async () => {
    const short = await reviewready([REJECTED, '--json']);
    const long = await reviewready([REJECTED, '--format', 'json']);
    expect(short.stdout).toBe(long.stdout);
    expect(JSON.parse(short.stdout)).toMatchObject({
      schemaVersion: 0,
      tool: { name: 'reviewready' },
    });
  });

  it('writes the report to a file with --output and says so on stderr', async () => {
    const file = join(scratchDir('output'), 'report.md');
    const result = await reviewready([REJECTED, '--format', 'markdown', '--output', file]);
    expect(result.stdout).toBe('');
    expect(result.stderr).toContain(
      `Wrote ${file}: 5 problems App Review or App Store Connect turns away`,
    );
    expect(readFileSync(file, 'utf8')).toContain('## reviewready: Ledger (native iOS)');
  });

  it('colours a terminal unless NO_COLOR is set, and FORCE_COLOR colours a pipe', async () => {
    expect((await reviewready([REJECTED], { tty: true })).stdout).toContain('\u001b[');
    expect(
      (await reviewready([REJECTED], { tty: true, env: { NO_COLOR: '1' } })).stdout,
    ).not.toContain('\u001b[');
    expect((await reviewready([REJECTED, '--no-color'], { tty: true })).stdout).not.toContain(
      '\u001b[',
    );
    expect((await reviewready([REJECTED], { env: { FORCE_COLOR: '1' } })).stdout).toContain(
      '\u001b[',
    );
    expect((await reviewready([REJECTED, '--format', 'text'], { tty: true })).stdout).not.toContain(
      '\u001b[',
    );
  });

  it('prints the version and a help text with the exit codes and the package name', async () => {
    expect((await reviewready(['--version'])).stdout).toBe(`${VERSION}\n`);
    const help = await reviewready(['--help']);
    expect(help.code).toBe(EXIT.ok);
    expect(help.stdout).toContain('Exit codes:');
    expect(help.stdout).toContain(`npx ${PACKAGE_NAME}`);
    expect(help.stdout).toContain(RELEASE_TARBALL_URL);
    expect(help.stdout).toContain('--ignore <rules>');
    expect(help.stdout).toContain('--brief');
    const brief = await reviewready([REJECTED, '--brief']);
    expect(brief.code).toBe(EXIT.findings);
    expect(brief.stdout).not.toContain('How to fix');
  });

  it('reads the project without changing it', async () => {
    const folder = scratchDir('readonly');
    const root = tree({
      'App.xcodeproj/project.pbxproj': pbxproj(),
      'App/Info.plist': infoPlist(),
    });
    const before = readFileSync(join(root, 'App.xcodeproj/project.pbxproj'));
    await reviewready([root, '--json'], { cwd: folder });
    expect(readFileSync(join(root, 'App.xcodeproj/project.pbxproj'))).toEqual(before);
  });
});
