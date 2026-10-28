import {
  chmodSync,
  cpSync,
  lstatSync,
  mkdirSync,
  readdirSync,
  readFileSync,
  symlinkSync,
  writeFileSync,
} from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { EXIT, failsOn, PACKAGE_NAME, RELEASE_TARBALL_URL } from '../../src/cli/run.js';
import { SOURCE_LIMITS } from '../../src/collect/sources.js';
import type { Report } from '../../src/model.js';
import { VERSION } from '../../src/version.js';
import { ROOT, reviewready } from '../helpers/cli.js';
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

    // The ready app with a Swift file one folder level deeper than reviewready searches.
    const deepSource = scratchDir('deep-source');
    cpSync(READY, deepSource, { recursive: true });
    const levels = Array.from({ length: 13 }, (_, index) => `L${index + 1}`).join('/');
    mkdirSync(join(deepSource, levels), { recursive: true });
    writeFileSync(join(deepSource, levels, 'Contacts.swift'), 'let store = CNContactStore()\n');

    // The ready app with the same call in a Swift file over the 4 MB a source file may have.
    const largeSource = scratchDir('large-source');
    cpSync(READY, largeSource, { recursive: true });
    const call = 'let store = CNContactStore()\n';
    writeFileSync(
      join(largeSource, 'Atlas', 'Contacts.swift'),
      call.repeat(Math.ceil((SOURCE_LIMITS.fileBytes + 1) / call.length)),
    );

    it.each([
      ['an Info.plist with a conflict marker', conflict],
      ['a source folder more than 12 levels down', deepSource],
      ['a source file larger than 4 MB', largeSource],
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

  it('does not write --output through a symbolic link the project brings along', async () => {
    const folder = scratchDir('output-link');
    const victim = join(folder, 'victim.txt');
    writeFileSync(victim, 'outside the project\n');
    const project = join(folder, 'project');
    mkdirSync(project);
    symlinkSync('../victim.txt', join(project, 'reviewready.md'));
    for (const output of ['reviewready.md', join(project, 'reviewready.md')]) {
      const result = await reviewready(
        [join(ROOT, REJECTED), '--format', 'markdown', '--output', output],
        { cwd: project },
      );
      expect(result.code).toBe(EXIT.error);
      expect(result.stderr).toContain('is a symbolic link; reviewready does not write a report');
      expect(result.stderr).not.toContain('bug');
    }
    expect(readFileSync(victim, 'utf8')).toBe('outside the project\n');
    expect(lstatSync(join(project, 'reviewready.md')).isSymbolicLink()).toBe(true);
  });

  it('does not write --output into a folder of the project that links outside it', async () => {
    const folder = scratchDir('output-folder-link');
    const elsewhere = join(folder, 'elsewhere');
    mkdirSync(elsewhere);
    const project = join(folder, 'project');
    mkdirSync(join(project, 'deep'), { recursive: true });
    symlinkSync(elsewhere, join(project, 'reports'));
    symlinkSync(elsewhere, join(project, 'deep', 'out'));
    // The project is checked as the current folder and, from outside it, as the path argument.
    const runs = [
      { cwd: project, args: ['.', '--output', 'reports/reviewready.md'] },
      { cwd: project, args: ['.', '--output', 'deep/out/x/reviewready.md'] },
      { cwd: folder, args: ['project', '--output', 'project/reports/reviewready.md'] },
    ];
    for (const { cwd, args } of runs) {
      cpSync(join(ROOT, REJECTED), project, { recursive: true });
      const result = await reviewready([...args, '--format', 'markdown'], { cwd });
      expect(result.code).toBe(EXIT.error);
      expect(result.stderr).toMatch(/is inside .+, a symbolic link; reviewready does not write/);
      expect(result.stderr).not.toContain('bug');
    }
    expect(readdirSync(elsewhere)).toEqual([]);
  });

  it('writes the report through a link above the checked folders, and replaces an old report', async () => {
    const folder = scratchDir('output-machine-link');
    const real = join(folder, 'real');
    mkdirSync(real);
    symlinkSync(real, join(folder, 'alias'));
    const file = join(folder, 'alias', 'report.md');
    writeFileSync(join(real, 'report.md'), 'old\n');
    const cwd = join(folder, 'work');
    mkdirSync(cwd);
    const result = await reviewready(
      [join(ROOT, REJECTED), '--format', 'markdown', '--output', file],
      { cwd },
    );
    expect(result.code).toBe(EXIT.findings);
    expect(readFileSync(join(real, 'report.md'), 'utf8')).toContain('## reviewready: Ledger');
    expect(readdirSync(real)).toEqual(['report.md']);
  });

  // A root user can write into a read-only folder, so the permission case needs another user.
  it.skipIf(process.getuid?.() === 0)(
    'says why --output could not be written, without calling it a bug',
    async () => {
      const folder = scratchDir('output-denied');
      const locked = join(folder, 'locked');
      mkdirSync(locked, { mode: 0o500 });
      const cases = [
        [join(locked, 'report.md'), 'permission denied'],
        [join(folder, 'missing', 'report.md'), 'its folder does not exist'],
        [folder, 'it is a folder'],
      ] as const;
      for (const [output, reason] of cases) {
        const result = await reviewready([REJECTED, '--output', output]);
        expect(result.code).toBe(EXIT.error);
        expect(result.stderr).toBe(
          `reviewready: cannot write the report to ${output}: ${reason}\n`,
        );
      }
      chmodSync(locked, 0o700);
    },
  );

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
