import { mkdirSync, readFileSync, symlinkSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { parseOpenStep, XcodeProjectError } from '../../src/collect/openstep.js';
import { MAX_PLIST_DEPTH } from '../../src/collect/plist-value.js';
import {
  buildsForIOS,
  generatesInfoPlist,
  infoPlistFiles,
  iosAppTargets,
  lastUpgradeCheck,
  readTargets,
  readXcodeProject,
  setting,
  type XcodeProject,
} from '../../src/collect/pbxproj.js';
import { scratchDir } from '../helpers/scratch.js';

const fixture = (name: string) => new URL(`../data/pbxproj/${name}`, import.meta.url);

/** Puts a test pbxproj into a temporary `<name>.xcodeproj` folder and reads it back. */
async function project(file: string, name: string): Promise<XcodeProject> {
  const root = scratchDir('pbxproj');
  const folder = join(root, 'ios', `${name}.xcodeproj`);
  mkdirSync(folder, { recursive: true });
  writeFileSync(join(folder, 'project.pbxproj'), readFileSync(fixture(file)));
  return readXcodeProject(folder);
}

describe('parseOpenStep', () => {
  it('reads dictionaries, arrays, quoted and bare strings and skips comments', () => {
    const value = parseOpenStep(`// !$*UTF8*$!
{
  archiveVersion = 1; /* a comment */
  list = ( a, "b c", );
  nested = { "key with space" = "line\\nbreak \\"q\\""; path = "$(SRCROOT)/App/Info.plist"; };
  data = <0fbd 7774>;
}`);
    expect(value).toEqual({
      archiveVersion: '1',
      list: ['a', 'b c'],
      nested: { 'key with space': 'line\nbreak "q"', path: '$(SRCROOT)/App/Info.plist' },
      data: '0fbd7774',
    });
  });

  it.each([
    ['an unclosed dictionary', '{ a = 1;'],
    ['a missing semicolon', '{ a = 1 }'],
    ['an unclosed string', '{ a = "x; }'],
    ['an unclosed comment', '{ /* a = 1; }'],
    ['text after the root', '{ } extra'],
  ])('rejects %s with the line number', (_, text) => {
    expect(() => parseOpenStep(text)).toThrow(XcodeProjectError);
    expect(() => parseOpenStep(text)).toThrow(/line \d+/);
  });

  it('reads nesting up to the limit and rejects deeper nesting', () => {
    const nest = (depth: number) => `${'('.repeat(depth)}${')'.repeat(depth)}`;
    expect(() => parseOpenStep(nest(MAX_PLIST_DEPTH))).not.toThrow();
    expect(() => parseOpenStep(`{ a = ${nest(MAX_PLIST_DEPTH - 1)}; }`)).not.toThrow();
    expect(() => parseOpenStep(nest(MAX_PLIST_DEPTH + 1))).toThrow(
      `Arrays and dictionaries nest more than ${MAX_PLIST_DEPTH} levels (line 1).`,
    );
    // Without the limit this is "Maximum call stack size exceeded" rather than an XcodeProjectError.
    expect(() => parseOpenStep('('.repeat(200_000))).toThrow(XcodeProjectError);
    expect(() => parseOpenStep('{ a = '.repeat(200_000))).toThrow(XcodeProjectError);
  });
});

describe('parseOpenStep and __proto__', () => {
  it('keeps a __proto__ key as a key', () => {
    const value = parseOpenStep('{ __proto__ = { polluted = YES; }; }') as Record<string, unknown>;
    expect(Object.keys(value)).toEqual(['__proto__']);
    expect(value.polluted).toBeUndefined();
  });
});

describe('readTargets', () => {
  it('reads the Flutter Runner and its test target, merging project-level settings', async () => {
    const runner = await project('flutter-runner.pbxproj', 'Runner');
    expect(runner.targets.map(({ name, productType }) => [name, productType])).toEqual([
      ['Runner', 'com.apple.product-type.application'],
      ['RunnerTests', 'com.apple.product-type.bundle.unit-test'],
    ]);
    const app = runner.targets[0];
    expect(Object.keys(app?.configurations ?? {}).sort()).toEqual(['Debug', 'Profile', 'Release']);
    // SDKROOT is set on the project, INFOPLIST_FILE on the target.
    expect(app?.configurations.Debug?.SDKROOT).toBe('iphoneos');
    expect(app?.configurations.Debug?.INFOPLIST_FILE).toBe('Runner/Info.plist');
  });

  it('only returns iOS app targets from iosAppTargets', async () => {
    const runner = await project('flutter-runner.pbxproj', 'Runner');
    expect(iosAppTargets(runner).map((target) => target.name)).toEqual(['Runner']);
  });

  it('resolves INFOPLIST_FILE against the folder that holds the .xcodeproj', async () => {
    const runner = await project('flutter-runner.pbxproj', 'Runner');
    const app = iosAppTargets(runner)[0];
    if (!app) throw new Error('no app target');
    expect(infoPlistFiles(runner, app)).toEqual({
      files: [join(runner.sourceRoot, 'Runner/Info.plist')],
      unresolved: [],
    });
    expect(generatesInfoPlist(app)).toBe(false);
  });

  it('sees that an xcodegen SwiftUI target generates its Info.plist', async () => {
    const trailhead = await project('xcodegen-trailhead.pbxproj', 'Trailhead');
    const app = iosAppTargets(trailhead)[0];
    if (!app) throw new Error('no app target');
    expect(generatesInfoPlist(app)).toBe(true);
    expect(app.configurations.Release?.INFOPLIST_KEY_UIDesignRequiresCompatibility).toBe('YES');
    expect(setting(app.configurations.Debug ?? {}, 'IPHONEOS_DEPLOYMENT_TARGET')).toBe('18.0');
  });

  it('reads LastUpgradeCheck from the root object', async () => {
    expect((await project('flutter-runner.pbxproj', 'Runner')).lastUpgradeCheck).toMatch(/^\d{4}$/);
    expect(
      lastUpgradeCheck(
        parseOpenStep('{ objects = { P = { isa = PBXProject; }; }; rootObject = P; }'),
      ),
    ).toBeNull();
  });

  it('rejects a property list without objects', () => {
    expect(() => readTargets(parseOpenStep('{ archiveVersion = 1; }'))).toThrow(XcodeProjectError);
  });

  it('reports an .xcodeproj without project.pbxproj', async () => {
    const folder = scratchDir('empty');
    await expect(readXcodeProject(folder)).rejects.toThrow(XcodeProjectError);
  });

  it('does not read a project.pbxproj that is /dev/zero', { timeout: 2000 }, async () => {
    const folder = scratchDir('zero');
    symlinkSync('/dev/zero', join(folder, 'project.pbxproj'));
    await expect(readXcodeProject(folder)).rejects.toThrow(/is outside the project/);
  });
});

describe('infoPlistFiles', () => {
  const target = (settings: Record<string, string>) => ({
    name: 'App',
    productType: 'com.apple.product-type.application',
    configurations: { Debug: settings },
    resources: [],
    synchronizedFolders: [],
  });
  const xcode: XcodeProject = {
    path: '/p/App.xcodeproj',
    sourceRoot: '/p',
    targets: [],
    lastUpgradeCheck: null,
  };

  it.each([
    ['$(SRCROOT)/App/Info.plist', '/p/App/Info.plist'],
    // biome-ignore lint/suspicious/noTemplateCurlyInString: an Xcode build setting, not a template.
    ['${PROJECT_DIR}/Info.plist', '/p/Info.plist'],
    ['$(TARGET_NAME)/Info.plist', '/p/App/Info.plist'],
  ])('expands %s', (raw, expected) => {
    expect(infoPlistFiles(xcode, target({ INFOPLIST_FILE: raw })).files).toEqual([expected]);
  });

  it('returns paths with unknown variables as unresolved', () => {
    expect(infoPlistFiles(xcode, target({ INFOPLIST_FILE: '$(CONFIG_DIR)/Info.plist' }))).toEqual({
      files: [],
      unresolved: ['$(CONFIG_DIR)/Info.plist'],
    });
  });
});

describe('buildsForIOS', () => {
  it.each([
    [{ SDKROOT: 'iphoneos' }, true],
    [{ SDKROOT: 'iphoneos27.0' }, true],
    [{ SDKROOT: 'macosx' }, false],
    [{ SDKROOT: 'auto', SUPPORTED_PLATFORMS: 'iphoneos iphonesimulator macosx' }, true],
    [{ SDKROOT: 'auto', SUPPORTED_PLATFORMS: 'macosx' }, false],
    [{}, false],
  ])('%o is %s', (settings, expected) => {
    expect(buildsForIOS(settings)).toBe(expected);
  });
});
