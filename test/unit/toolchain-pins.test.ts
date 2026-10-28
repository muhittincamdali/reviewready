import { describe, expect, it } from 'vitest';
import { xcodePins } from '../../src/collect/toolchain.js';
import { tree } from '../helpers/tree.js';

const pinsOf = async (files: Record<string, string>, versionFile: string | null = null) => {
  const root = tree(files);
  return (await xcodePins(root, versionFile)).map((pin) => [
    pin.version,
    pin.file.slice(root.length + 1),
    pin.line,
    pin.via,
  ]);
};

describe('xcodePins', () => {
  it('reads setup-xcode inputs and Xcode app paths in GitHub Actions workflows', async () => {
    expect(
      await pinsOf({
        '.github/workflows/ios.yml': `jobs:
  build:
    steps:
      - uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: '16.4'
      - run: sudo xcode-select -s /Applications/Xcode_26.0.1.app
      # - run: sudo xcode-select -s /Applications/Xcode_15.4.app
    env:
      DEVELOPER_DIR: /Applications/Xcode_27.1_beta.app/Contents/Developer
`,
        '.github/workflows/notes.md': 'xcode-version: 1.0',
      }),
    ).toEqual([
      ['16.4', '.github/workflows/ios.yml', 6, 'xcode-version input'],
      ['26.0.1', '.github/workflows/ios.yml', 7, 'Xcode app path'],
      ['27.1', '.github/workflows/ios.yml', 10, 'Xcode app path'],
    ]);
  });

  it('reads .xcode-version, Codemagic, Bitrise, CircleCI and fastlane', async () => {
    expect(
      await pinsOf(
        {
          'codemagic.yaml': 'workflows:\n  ios:\n    environment:\n      xcode: 16.4\n',
          'bitrise.yml': 'meta:\n  bitrise.io:\n    stack: osx-xcode-16.2.x\n',
          '.circleci/config.yml': 'jobs:\n  build:\n    macos:\n      xcode: "15.4.0"\n',
          'fastlane/Fastfile': 'lane :beta do\n  xcodes(version: "26.1")\nend\n',
        },
        '27.1',
      ),
    ).toEqual([
      ['27.1', '.xcode-version', 1, '.xcode-version'],
      ['16.4', 'codemagic.yaml', 4, 'xcode key'],
      ['16.2', 'bitrise.yml', 3, 'Bitrise stack'],
      ['15.4.0', '.circleci/config.yml', 4, 'xcode key'],
      ['26.1', 'fastlane/Fastfile', 2, 'fastlane action'],
    ]);
  });

  it('reads the Xcode of each EAS Build image and skips images without one', async () => {
    const eas = JSON.stringify(
      {
        build: {
          production: { ios: { image: 'macos-sequoia-15.5-xcode-16.4' } },
          preview: { ios: { image: 'latest' } },
          broken: 'x',
        },
      },
      null,
      2,
    );
    expect(await pinsOf({ 'eas.json': eas })).toEqual([['16.4', 'eas.json', 5, 'EAS image']]);
    expect(await pinsOf({ 'eas.json': '{ not json' })).toEqual([]);
  });

  it('finds nothing in a project that pins no Xcode', async () => {
    expect(await pinsOf({ 'README.md': 'Built with Xcode 16.4' })).toEqual([]);
  });
});
