import { describe, expect, it } from 'vitest';
import { scan } from '../../src/scan.js';
import { png } from '../helpers/png.js';
import { expoApp, findings, nativeApp, plistString } from '../helpers/projects.js';
import { tree } from '../helpers/tree.js';

const ITS_FALSE = '\t<key>ITSAppUsesNonExemptEncryption</key>\n\t<false/>';

describe('RVW201: export compliance', () => {
  it('asks for the key in Info.plist, a build setting or the Expo config', async () => {
    expect(await findings(nativeApp(), ['RVW201'])).toEqual([
      'RVW201 The Info.plist of App has no ITSAppUsesNonExemptEncryption, so App Store Connect asks the export compliance questions for every build.',
    ]);
    expect(await findings(nativeApp({ info: ITS_FALSE }), ['RVW201'])).toEqual([]);
    const setting = nativeApp({
      info: null,
      settings: { INFOPLIST_KEY_ITSAppUsesNonExemptEncryption: 'NO' },
    });
    expect(await findings(setting, ['RVW201'])).toEqual([]);
    expect(
      await findings(expoApp({ ios: { config: { usesNonExemptEncryption: false } } }), ['RVW201']),
    ).toEqual([]);
    expect(
      await findings(expoApp({ ios: { infoPlist: { ITSAppUsesNonExemptEncryption: true } } }), [
        'RVW201',
      ]),
    ).toEqual([]);
  });
});

describe('RVW301: account deletion', () => {
  const app = (files: Record<string, string>) => nativeApp({ files });

  it('finds account creation without deletion', async () => {
    const root = app({
      'App/Auth.swift': 'try await Auth.auth().createUser(withEmail: email, password: password)',
    });
    expect(await findings(root, ['RVW301'])).toEqual([
      'RVW301 Accounts are created (a createUser(withEmail:) call in App/Auth.swift:1), and no account deletion call or "Delete account" text was found in the app\'s code or strings.',
    ]);
  });

  it('counts a sign-up text on screen as account creation', async () => {
    const root = app({ 'App/SignUp.swift': 'Button("Create an account") { }' });
    expect(await findings(root, ['RVW301'])).toHaveLength(1);
  });

  it.each([
    ['a deletion call', { 'App/Settings.swift': 'func deleteAccount() async throws {}' }],
    [
      'Firebase user.delete()',
      { 'App/Settings.swift': 'try await Auth.auth().currentUser?.delete()' },
    ],
    [
      'a strings file',
      { 'App/en.lproj/Localizable.strings': '"settings.delete" = "Delete your account";' },
    ],
    ['a String Catalog', { 'App/Localizable.xcstrings': '{"strings":{"Delete Account":{}}}' }],
    [
      'a link to a deletion page',
      { 'App/Links.swift': 'let url = URL(string: "https://x.dev/delete-account")' },
    ],
  ])('accepts %s', async (_, files) => {
    const root = app({
      'App/Auth.swift': 'Auth.auth().createUser(withEmail: e, password: p)',
      ...files,
    });
    expect(await findings(root, ['RVW301'])).toEqual([]);
  });

  it('reads Dart and JavaScript sign-up calls', async () => {
    const flutter = tree({
      'pubspec.yaml': 'name: a\ndependencies:\n  flutter:\n    sdk: flutter\n',
      'ios/Runner.xcodeproj/project.pbxproj': (await import('../helpers/projects.js')).pbxproj(),
      'lib/auth.dart': 'await supabase.auth.signUp(email: e, password: p);',
    });
    expect(await findings(flutter, ['RVW301'])).toHaveLength(1);
    const expo = expoApp(
      {},
      {},
      { 'src/auth.ts': 'await createUserWithEmailAndPassword(auth, e, p);' },
    );
    expect(await findings(expo, ['RVW301'])).toHaveLength(1);
  });

  it('counts deletion words in comments too, so it stays silent rather than guess', async () => {
    const root = app({
      'App/Auth.swift':
        'Auth.auth().createUser(withEmail: e, password: p) // deleteAccount is in Settings',
    });
    expect(await findings(root, ['RVW301'])).toEqual([]);
  });
});

describe('RVW401: login services', () => {
  it('finds Google Sign-In without Sign in with Apple', async () => {
    const root = nativeApp({
      files: {
        'App/Login.swift':
          'import GoogleSignIn\nGIDSignIn.sharedInstance.signIn(withPresenting: vc)',
      },
    });
    expect(await findings(root, ['RVW401'])).toEqual([
      'RVW401 Google Sign-In is used (import GoogleSignIn in App/Login.swift:1), and no Sign in with Apple was found: no package, entitlement or AuthenticationServices call.',
    ]);
  });

  it.each([
    [
      'an AuthenticationServices request',
      { 'App/Apple.swift': 'let request = ASAuthorizationAppleIDProvider().createRequest()' },
    ],
    [
      'a Firebase apple.com provider',
      { 'App/Apple.swift': 'let provider = OAuthProvider(providerID: "apple.com")' },
    ],
  ])('accepts %s', async (_, files) => {
    const root = nativeApp({ files: { 'App/Login.swift': 'import FBSDKLoginKit', ...files } });
    expect(await findings(root, ['RVW401'])).toEqual([]);
  });

  it('accepts the Sign in with Apple entitlement', async () => {
    const root = nativeApp({
      settings: { CODE_SIGN_ENTITLEMENTS: 'App/App.entitlements' },
      files: {
        'App/Login.swift': 'import GoogleSignIn',
        'App/App.entitlements':
          '<?xml version="1.0"?><plist version="1.0"><dict><key>com.apple.developer.applesignin</key><array><string>Default</string></array></dict></plist>',
      },
    });
    expect(await findings(root, ['RVW401'])).toEqual([]);
  });

  it('reads packages and Expo AuthSession providers', async () => {
    const google = expoApp({}, { '@react-native-google-signin/google-signin': '^16.1.5' });
    expect(await findings(google, ['RVW401'])).toEqual([
      'RVW401 Google Sign-In is used (the @react-native-google-signin/google-signin package in package.json), and no Sign in with Apple was found: no package, entitlement or AuthenticationServices call.',
    ]);
    const both = expoApp(
      {},
      {
        '@react-native-google-signin/google-signin': '^16.1.5',
        'expo-apple-authentication': '~58.0.2',
      },
    );
    expect(await findings(both, ['RVW401'])).toEqual([]);
    const session = expoApp(
      {},
      {},
      { 'src/login.ts': "import * as Facebook from 'expo-auth-session/providers/facebook';" },
    );
    expect(await findings(session, ['RVW401'])).toHaveLength(1);
    const apple = expoApp(
      { ios: { usesAppleSignIn: true } },
      { 'react-native-fbsdk-next': '^13.4.3' },
    );
    expect(await findings(apple, ['RVW401'])).toEqual([]);
  });
});

describe('RVW501 to RVW503: the App Store icon', () => {
  const SET = 'App/Assets.xcassets/AppIcon.appiconset';
  const withIcon = (image: Buffer | null, entry: object = { filename: 'icon.png' }) =>
    nativeApp({
      icon: false,
      files: {
        [`${SET}/Contents.json`]: JSON.stringify({
          images: [{ idiom: 'universal', platform: 'ios', size: '1024x1024', ...entry }],
        }),
        ...(image ? { [`${SET}/icon.png`]: image } : {}),
      },
    });

  it('accepts an opaque 1024 × 1024 PNG', async () => {
    expect(await findings(withIcon(png(1024, 1024)), ['RVW501', 'RVW502', 'RVW503'])).toEqual([]);
  });

  it('finds a wrong size, an alpha channel and a transparent colour', async () => {
    expect(await findings(withIcon(png(512, 512, { alpha: true })), ['RVW502', 'RVW503'])).toEqual([
      'RVW502 The App Store icon is 512 × 512 pixels; it must be 1024 × 1024.',
      'RVW503 The App Store icon has an alpha channel.',
    ]);
    expect(
      await findings(withIcon(png(1024, 1024, { transparentColor: true })), ['RVW503']),
    ).toEqual(['RVW503 The App Store icon has a transparent colour (tRNS).']);
  });

  it('finds an empty slot and a missing icon set', async () => {
    expect(await findings(withIcon(null, {}), ['RVW501'])).toEqual([
      'RVW501 App/Assets.xcassets/AppIcon.appiconset has no image in its 1024 × 1024 App Store slot.',
    ]);
    expect(await findings(nativeApp({ icon: false }), ['RVW501'])).toEqual([
      'RVW501 App builds the icon AppIcon, and there is no AppIcon.appiconset in an asset catalog or AppIcon.icon file in the iOS folder.',
    ]);
  });

  it('notes an icon it could not read instead of passing it', async () => {
    const report = await scan(withIcon(null));
    expect(report.notes).toContain(
      'App/Assets.xcassets/AppIcon.appiconset: icon.png does not exist. The App Store icon was not checked.',
    );
  });

  it('checks the size of an Expo icon, not its transparency, which prebuild removes', async () => {
    const files = {
      'assets/icon.png': png(1024, 1024, { alpha: true }),
      'assets/small.png': png(512, 512),
    };
    expect(
      await findings(expoApp({ icon: './assets/icon.png' }, {}, files), [
        'RVW501',
        'RVW502',
        'RVW503',
      ]),
    ).toEqual([]);
    expect(
      await findings(expoApp({ ios: { icon: { light: './assets/small.png' } } }, {}, files), [
        'RVW502',
      ]),
    ).toHaveLength(1);
    expect(await findings(expoApp({ ios: { icon: './assets/app.icon' } }), ['RVW501'])).toEqual([]);
    expect(await findings(expoApp({}), ['RVW501'])).toEqual([
      'RVW501 app.json sets neither expo.icon nor expo.ios.icon, so the app icon set prebuild writes has no image.',
    ]);
  });
});

describe('RVW601 and RVW602: Xcode and iOS minimums', () => {
  it('flags a pinned Xcode older than 26 with its file and line', async () => {
    const root = nativeApp({
      files: { '.xcode-version': '16.4\n', 'codemagic.yaml': 'environment:\n  xcode: 26.0\n' },
    });
    const report = await scan(root);
    expect(
      report.findings
        .filter((item) => item.rule === 'RVW601')
        .map((item) => [item.file, item.line, item.message]),
    ).toEqual([
      [
        '.xcode-version',
        1,
        '.xcode-version pins Xcode 16.4 (.xcode-version); App Store Connect accepts uploads built with Xcode 26 or later since 28 April 2026.',
      ],
    ]);
    expect(report.checks.find((check) => check.rule === 'RVW601')?.status).toBe('found');
  });

  it('says it did not check the Xcode when nothing pins one', async () => {
    const report = await scan(nativeApp());
    expect(report.checks.find((check) => check.rule === 'RVW601')?.status).toBe('not-checked');
    expect(
      report.notes.some((note) => note.startsWith('No build file pins an Xcode version')),
    ).toBe(true);
  });

  it('flags a deployment target below iOS 13', async () => {
    expect(
      await findings(nativeApp({ settings: { IPHONEOS_DEPLOYMENT_TARGET: '12.4' } }), ['RVW602']),
    ).toEqual([
      'RVW602 App targets iOS 12.4; App Store Connect accepts iOS apps that target iOS 13.0 or later since 9 September 2026.',
    ]);
    expect(
      await findings(nativeApp({ settings: { IPHONEOS_DEPLOYMENT_TARGET: '13.0' } }), ['RVW602']),
    ).toEqual([]);
    const expo = expoApp({
      plugins: [['expo-build-properties', { ios: { deploymentTarget: '12.0' } }]],
    });
    expect(await findings(expo, ['RVW602'])).toHaveLength(1);
  });
});

describe('RVW701 and RVW702: privacy manifest', () => {
  it('accepts a manifest in Copy Bundle Resources or a synchronized folder', async () => {
    const files = { 'App/PrivacyInfo.xcprivacy': '<plist><dict/></plist>' };
    expect(
      await findings(nativeApp({ resources: ['PrivacyInfo.xcprivacy'], files }), [
        'RVW701',
        'RVW702',
      ]),
    ).toEqual([]);
  });

  it('tells a missing manifest from one left out of the target', async () => {
    expect(await findings(nativeApp(), ['RVW701', 'RVW702'])).toEqual([
      'RVW701 App has no PrivacyInfo.xcprivacy in its resources.',
    ]);
    const stray = nativeApp({ files: { 'App/PrivacyInfo.xcprivacy': '<plist><dict/></plist>' } });
    expect(await findings(stray, ['RVW701', 'RVW702'])).toEqual([
      'RVW702 App/PrivacyInfo.xcprivacy is not in the Copy Bundle Resources of App or in a folder it syncs, so the app ships without it.',
    ]);
  });

  it('reads ios.privacyManifests of an Expo app', async () => {
    expect(await findings(expoApp({}), ['RVW701'])).toHaveLength(1);
    // Prebuild writes the file for any privacyManifests object.
    const declared = expoApp({ ios: { privacyManifests: {} } });
    expect(await findings(declared, ['RVW701'])).toEqual([]);
    const filled = expoApp({ ios: { privacyManifests: { NSPrivacyTracking: false } } });
    expect(await findings(filled, ['RVW701'])).toEqual([]);
  });
});

describe('the report', () => {
  it('passes every check of a complete app and says so', async () => {
    const root = nativeApp({
      info: [
        ITS_FALSE,
        plistString('NSCameraUsageDescription', 'Scan receipts to log expenses.'),
      ].join('\n'),
      resources: ['PrivacyInfo.xcprivacy'],
      settings: { IPHONEOS_DEPLOYMENT_TARGET: '17.0' },
      files: {
        'App/PrivacyInfo.xcprivacy': '<plist><dict/></plist>',
        'App/Scan.swift': 'let s = AVCaptureSession()',
        '.xcode-version': '27.1',
      },
    });
    const report = await scan(root);
    expect(report.findings).toEqual([]);
    expect(report.verdict.code).toBe('ready');
    expect(report.checks.filter((check) => check.status !== 'passed')).toEqual([]);
  });

  it('marks ignored rules and leaves their findings out', async () => {
    const report = await scan(nativeApp(), { ignore: ['RVW201', 'RVW701'] });
    expect(report.findings).toEqual([]);
    expect(
      report.checks.filter((check) => check.status === 'ignored').map((check) => check.rule),
    ).toEqual(['RVW201', 'RVW701']);
  });

  it('does not call an app ready when its Info.plist could not be read', async () => {
    const root = nativeApp({
      info: null,
      settings: { INFOPLIST_FILE: 'App/Missing.plist', GENERATE_INFOPLIST_FILE: 'NO' },
    });
    const report = await scan(root, { ignore: ['RVW701'] });
    expect(report.verdict.code).toBe('not-known');
    expect(report.notes).toContain(
      'App/Missing.plist is named in INFOPLIST_FILE but does not exist.',
    );
  });
});
