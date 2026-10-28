import { describe, expect, it } from 'vitest';
import type { Report, VerdictCode } from '../../src/model.js';
import { reviewready } from '../helpers/cli.js';

interface Expected {
  verdict: VerdictCode;
  /** rule, file:line (or file), fix id. */
  findings: string[];
  exitCode: number;
}

const EXPECTED: Record<string, Expected> = {
  'native-swiftui-rejected': {
    verdict: 'rejected',
    exitCode: 1,
    findings: [
      'RVW101 Ledger.xcodeproj/project.pbxproj RVW101/build-setting',
      'RVW103 Ledger.xcodeproj/project.pbxproj:157 RVW103/build-setting',
      'RVW503 Ledger/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png RVW503/info-plist',
      'RVW601 .xcode-version:1 RVW601/ci',
      'RVW602 Ledger.xcodeproj/project.pbxproj:216 RVW602/info-plist',
      'RVW104 Ledger.xcodeproj/project.pbxproj:156 RVW104/info-plist',
      'RVW201 Ledger.xcodeproj/project.pbxproj RVW201/build-setting',
      'RVW301 Ledger/SignUpView.swift:13 RVW301/code',
      'RVW401 Ledger/SignUpView.swift:1 RVW401/code',
      'RVW702 Ledger/PrivacyInfo.xcprivacy RVW702/info-plist',
    ],
  },
  'native-uikit-ready': { verdict: 'ready', exitCode: 0, findings: [] },
  'flutter-harvest': {
    verdict: 'rejected',
    exitCode: 1,
    findings: [
      'RVW101 ios/Runner/Info.plist RVW101/info-plist',
      'RVW101 ios/Runner/Info.plist RVW101/info-plist',
      'RVW101 ios/Runner/Info.plist RVW101/info-plist',
      'RVW601 codemagic.yaml:6 RVW601/ci',
      'RVW104 ios/Runner/Info.plist:27 RVW104/info-plist',
      'RVW201 ios/Runner/Info.plist RVW201/info-plist',
      'RVW301 lib/main.dart:32 RVW301/code',
      'RVW401 pubspec.yaml RVW401/code',
      'RVW701 ios/Runner.xcodeproj/project.pbxproj RVW701/info-plist',
    ],
  },
  'rn-088-camera': {
    verdict: 'rejected',
    exitCode: 1,
    findings: [
      'RVW101 ios/HelloWorld/Info.plist RVW101/info-plist',
      'RVW103 ios/HelloWorld/Info.plist:39 RVW103/info-plist',
      'RVW501 ios/HelloWorld/Images.xcassets/AppIcon.appiconset/Contents.json RVW501/info-plist',
      'RVW201 ios/HelloWorld/Info.plist RVW201/info-plist',
      'RVW702 ios/HelloWorld/PrivacyInfo.xcprivacy RVW702/info-plist',
    ],
  },
  'expo-58-camera': {
    verdict: 'rejected',
    exitCode: 1,
    findings: [
      'RVW101 app.json RVW101/expo-config',
      'RVW601 eas.json:8 RVW601/ci',
      'RVW104 app.json RVW104/expo-config',
      'RVW701 app.json RVW701/expo-config',
    ],
  },
  'expo-58-default': {
    verdict: 'review',
    exitCode: 1,
    findings: ['RVW201 app.json RVW201/expo-config', 'RVW701 app.json RVW701/expo-config'],
  },
};

const summarize = (report: Report) =>
  report.findings.map((item) =>
    [item.rule, `${item.file}${item.line ? `:${item.line}` : ''}`, item.fix?.id].join(' '),
  );

describe.each(Object.entries(EXPECTED))('fixtures/%s', (name, expected) => {
  const path = `fixtures/${name}`;

  it('has the expected findings, verdict and exit code', async () => {
    const { code, stdout } = await reviewready([path, '--json']);
    const report = JSON.parse(stdout) as Report;
    expect(summarize(report)).toEqual(expected.findings);
    expect(report.verdict.code).toBe(expected.verdict);
    expect(code).toBe(expected.exitCode);
  });

  it.each(['text', 'markdown', 'json'] as const)(
    'matches the recorded %s report',
    async (format) => {
      const extension = { text: 'txt', markdown: 'md', json: 'json' }[format];
      const { stdout } = await reviewready([path, '--format', format]);
      await expect(stdout).toMatchFileSnapshot(`../__snapshots__/fixtures/${name}.${extension}`);
    },
  );
});

it('covers native SwiftUI and UIKit, Flutter, React Native and Expo, with and without findings', () => {
  const names = Object.keys(EXPECTED);
  for (const prefix of ['native-uikit', 'native-swiftui', 'flutter', 'rn-', 'expo-']) {
    expect(
      names.some((name) => name.startsWith(prefix)),
      prefix,
    ).toBe(true);
  }
  expect(Object.values(EXPECTED).filter((item) => item.verdict === 'ready')).toHaveLength(1);
});

it('triggers every rule in at least one fixture', async () => {
  const seen = new Set<string>();
  for (const name of Object.keys(EXPECTED)) {
    const report = JSON.parse((await reviewready([`fixtures/${name}`, '--json'])).stdout) as Report;
    for (const item of report.findings) seen.add(item.rule);
  }
  expect([...seen].sort()).toEqual([
    'RVW101',
    'RVW103',
    'RVW104',
    'RVW201',
    'RVW301',
    'RVW401',
    'RVW501',
    'RVW503',
    'RVW601',
    'RVW602',
    'RVW701',
    'RVW702',
  ]);
});
