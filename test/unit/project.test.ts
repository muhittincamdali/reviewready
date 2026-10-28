import { mkdirSync, symlinkSync } from 'node:fs';
import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { collectApp } from '../../src/collect/app.js';
import { MANIFEST_NOT_CHECKED } from '../../src/detect/packages.js';
import { detectProject, ProjectError } from '../../src/detect/project.js';
import { minimalPbxproj, tree } from '../helpers/tree.js';

const PBXPROJ = minimalPbxproj();

describe('detectProject', () => {
  it('finds a native app with its .xcodeproj at the root or one folder down', async () => {
    const top = tree({ 'App.xcodeproj/project.pbxproj': PBXPROJ });
    expect(await detectProject(top)).toMatchObject({ ecosystem: 'native', name: 'App' });
    const nested = tree({ 'Shop/Shop.xcodeproj/project.pbxproj': PBXPROJ });
    const project = await detectProject(nested);
    expect(project.iosDir).toBe(join(nested, 'Shop'));
    expect(await detectProject(join(nested, 'Shop', 'Shop.xcodeproj'))).toMatchObject({
      root: join(nested, 'Shop'),
    });
  });

  it('reads .xcode-version and ignores a file that is not a version', async () => {
    const root = tree({ 'App.xcodeproj/project.pbxproj': PBXPROJ, '.xcode-version': '26.4\n' });
    expect((await detectProject(root)).xcodeVersionFile).toBe('26.4');
    const other = tree({ 'App.xcodeproj/project.pbxproj': PBXPROJ, '.xcode-version': 'latest' });
    expect((await detectProject(other)).xcodeVersionFile).toBeNull();
  });

  it('recognises a Flutter app and a plugin with its example app', async () => {
    const app = tree({
      'pubspec.yaml': 'name: ferry\ndependencies:\n  flutter:\n    sdk: flutter\n',
      'ios/Runner.xcodeproj/project.pbxproj': PBXPROJ,
      '.fvmrc': '{"flutter": "3.47.5"}',
    });
    expect(await detectProject(app)).toMatchObject({
      ecosystem: 'flutter',
      name: 'ferry',
      flutter: { version: '3.47.5', plugin: false },
    });
    const plugin = tree({
      'pubspec.yaml': 'name: maps\nflutter:\n  plugin:\n    platforms: {}\n',
      'example/ios/Runner.xcodeproj/project.pbxproj': PBXPROJ,
    });
    expect((await detectProject(plugin)).iosDir).toBe(join(plugin, 'example', 'ios'));
  });

  it('recognises React Native and Expo apps, their packages and the React Native version', async () => {
    const root = tree({
      'package.json': JSON.stringify({
        name: 'greenline',
        dependencies: { 'react-native': '^0.88.0', 'react-native-vision-camera': '^5.2.3' },
        devDependencies: { jest: '29.7.0' },
      }),
      'package-lock.json': JSON.stringify({
        packages: { 'node_modules/react-native': { version: '0.88.1' } },
      }),
      'ios/Greenline.xcodeproj/project.pbxproj': PBXPROJ,
    });
    const project = await detectProject(root);
    expect(project.ecosystem).toBe('react-native');
    expect(
      [...project.packages.values()].map((item) => [item.name, item.version, item.source]),
    ).toEqual([['react-native', '0.88.1', 'lockfile']]);
    // devDependencies never reach the app App Review sees.
    expect([...project.dependencies]).toEqual(['react-native', 'react-native-vision-camera']);

    const expo = tree({
      'package.json': JSON.stringify({ dependencies: { expo: '~58.0.20' } }),
      'app.json': JSON.stringify({ expo: { name: 'atlas' } }),
    });
    expect(await detectProject(expo)).toMatchObject({
      ecosystem: 'expo',
      iosDir: null,
      expoConfig: { file: 'app.json', json: { name: 'atlas' } },
    });
  });

  it('prefers app.config.ts over app.json and keeps an unparsable app.json as text', async () => {
    const config = tree({
      'package.json': JSON.stringify({ dependencies: { expo: '58.0.0' } }),
      'app.json': '{}',
      'app.config.ts': 'export default {};',
    });
    expect((await detectProject(config)).expoConfig).toMatchObject({
      file: 'app.config.ts',
      json: null,
    });
    const broken = tree({ 'package.json': '{"dependencies":{"expo":"58"}}', 'app.json': '{ nope' });
    expect((await detectProject(broken)).expoConfig).toMatchObject({
      file: 'app.json',
      json: null,
    });
  });

  it('notes a package.json it cannot use instead of quietly checking a native app', async () => {
    const app = (packageJson: string) =>
      tree({ 'package.json': packageJson, 'ios/App.xcodeproj/project.pbxproj': PBXPROJ });
    const broken = await detectProject(app('{"dependencies": {"react-native": "0.88.1",}}'));
    expect(broken.ecosystem).toBe('native');
    expect(broken.notes).toEqual([`package.json is not valid JSON. ${MANIFEST_NOT_CHECKED}`]);
    expect((await detectProject(app('["react-native"]'))).notes).toEqual([
      `package.json does not hold a JSON object. ${MANIFEST_NOT_CHECKED}`,
    ]);
    // The note says what is wrong, not what the file says.
    expect(broken.notes.join(' ')).not.toContain('dependencies');
    const native = await detectProject(tree({ 'App.xcodeproj/project.pbxproj': PBXPROJ }));
    expect(native.notes).toEqual([]);
    expect((await detectProject(app('{"name": "tools"}'))).notes).toEqual([]);
    await expect(detectProject(tree({ 'package.json': '{' }))).rejects.toThrow(
      /package\.json\. package\.json is not valid JSON\.$/,
    );
  });

  it('carries the package.json note into the report notes', async () => {
    const root = tree({ 'package.json': '{', 'ios/App.xcodeproj/project.pbxproj': PBXPROJ });
    const app = await collectApp(await detectProject(root));
    expect(app.notes[0]).toBe(`package.json is not valid JSON. ${MANIFEST_NOT_CHECKED}`);
  });

  it('reads an installed version linked from a node_modules folder, as pnpm and workspaces do', async () => {
    const store = tree({
      'node_modules/.pnpm/react-native@0.88.2/node_modules/react-native/package.json':
        '{"version":"0.88.2"}',
    });
    const root = tree({
      'package.json': JSON.stringify({ dependencies: { 'react-native': '^0.88.0' } }),
      'ios/App.xcodeproj/project.pbxproj': PBXPROJ,
    });
    mkdirSync(join(root, 'node_modules'));
    symlinkSync(
      join(store, 'node_modules/.pnpm/react-native@0.88.2/node_modules/react-native'),
      join(root, 'node_modules', 'react-native'),
    );
    const project = await detectProject(root);
    expect(project.packages.get('react-native')).toMatchObject({
      version: '0.88.2',
      source: 'installed',
    });
    expect(project.notes).toEqual([]);
  });

  it('does not report a field of a file a node_modules package.json links to elsewhere', async () => {
    const outside = tree({ 'secret.json': '{"version":"4.0.0-SECRETTOKEN123"}' });
    const root = tree({
      'package.json': JSON.stringify({
        dependencies: { 'react-native': '0.88.0', expo: '^58.0.0' },
      }),
      'package-lock.json': JSON.stringify({
        packages: { 'node_modules/react-native': { version: 'file:SECRET' } },
      }),
      'ios/App.xcodeproj/project.pbxproj': PBXPROJ,
    });
    mkdirSync(join(root, 'node_modules', 'expo'), { recursive: true });
    symlinkSync(join(outside, 'secret.json'), join(root, 'node_modules', 'expo', 'package.json'));
    const project = await detectProject(root);
    expect(JSON.stringify([...project.packages.values()])).not.toContain('SECRET');
    expect(project.packages.get('expo')).toMatchObject({ version: '58.0.0', source: 'declared' });
    expect(project.packages.get('react-native')).toMatchObject({ source: 'declared' });
    expect(project.notes).toEqual([
      'node_modules/expo/package.json links to a file outside a node_modules/expo folder; it was not read.',
    ]);
  });

  it('explains what is missing', async () => {
    await expect(detectProject(tree({ 'README.md': '' }))).rejects.toThrow(/No iOS project found/);
    await expect(detectProject(join(tree({}), 'missing'))).rejects.toBeInstanceOf(ProjectError);
    await expect(
      detectProject(tree({ 'pubspec.yaml': 'name: a\nflutter:\n  uses-material-design: true\n' })),
    ).rejects.toThrow(/Flutter project without an iOS app/);
    await expect(
      detectProject(tree({ 'package.json': '{"dependencies":{"react-native":"0.88.1"}}' })),
    ).rejects.toThrow(/React Native project without ios/);
    const file = tree({ 'a.txt': 'x' });
    await expect(detectProject(join(file, 'a.txt'))).rejects.toThrow(/is not a folder/);
  });
});
