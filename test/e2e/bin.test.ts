import { spawnSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { nativeApp, plistString } from '../helpers/projects.js';
import { tree } from '../helpers/tree.js';

// The compiled entry point, as the installed `reviewready` command runs it (test/setup/build.ts
// builds it first).
const BIN = fileURLToPath(new URL('../../dist/cli/main.js', import.meta.url));

function reviewready(cwd: string, ...args: string[]) {
  return spawnSync(process.execPath, [BIN, ...args], {
    cwd,
    encoding: 'utf8',
    env: { PATH: process.env.PATH },
  });
}

describe('dist/cli/main.js', () => {
  it('starts with a node shebang so npx and Homebrew can run it', () => {
    expect(readFileSync(BIN, 'utf8').startsWith('#!/usr/bin/env node\n')).toBe(true);
  });

  it('prints the version from package.json', () => {
    const { version } = JSON.parse(
      readFileSync(new URL('../../package.json', import.meta.url), 'utf8'),
    ) as {
      version: string;
    };
    const result = reviewready(process.cwd(), '--version');
    expect(result.status).toBe(0);
    expect(result.stdout.trim()).toBe(version);
  });

  it('reads the bundled rule data and exits 1 for an app that uses the camera without a purpose string', () => {
    const root = nativeApp({ files: { 'App/Scan.swift': 'let session = AVCaptureSession()' } });
    const result = reviewready(root, '--json');
    expect(result.status).toBe(1);
    const report = JSON.parse(result.stdout);
    expect(report.rules.ruleSet).toBe('app-review');
    expect(report.findings[0].rule).toBe('RVW101');
  });

  it('exits 0 when only warnings are left and CI fails on errors', () => {
    const root = nativeApp({
      info: plistString('NSCameraUsageDescription', 'Scan receipts to log your expenses.'),
      files: { 'App/Scan.swift': 'let session = AVCaptureSession()' },
    });
    expect(reviewready(root, '--fail-on', 'error').status).toBe(0);
    expect(reviewready(root).status).toBe(1);
  });

  it('exits 2 with a one-line message for a folder without an iOS project', () => {
    const result = reviewready(tree({ 'notes.txt': 'x' }));
    expect(result.status).toBe(2);
    expect(result.stdout).toBe('');
    expect(result.stderr.trim().split('\n')).toHaveLength(1);
  });
});
