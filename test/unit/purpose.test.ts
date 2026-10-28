import { describe, expect, it } from 'vitest';
import { scan } from '../../src/scan.js';
import { expoApp, findings, nativeApp, plistString } from '../helpers/projects.js';
import { tree } from '../helpers/tree.js';

const PURPOSE = ['RVW101', 'RVW102', 'RVW103', 'RVW104'] as const;
const purpose = (root: string) => findings(root, [...PURPOSE]);
const CAMERA_CODE = 'import AVFoundation\nlet session = AVCaptureSession()\n';

describe('RVW101 and RVW102: missing purpose strings', () => {
  it('finds a key the app code needs, with the call and its line', async () => {
    const root = nativeApp({
      files: { 'App/Scanner.swift': `// AVCaptureSession in a comment\n${CAMERA_CODE}` },
    });
    expect(await purpose(root)).toEqual([
      'RVW101 AVCaptureSession (App/Scanner.swift:3) needs NSCameraUsageDescription (camera); App has none.',
    ]);
  });

  it('accepts the key from Info.plist or from an INFOPLIST_KEY_ build setting', async () => {
    const files = { 'App/Scanner.swift': CAMERA_CODE };
    const fromPlist = nativeApp({
      info: plistString('NSCameraUsageDescription', 'Scan receipts to log expenses.'),
      files,
    });
    expect(await purpose(fromPlist)).toEqual([]);
    const fromSetting = nativeApp({
      info: null,
      settings: { INFOPLIST_KEY_NSCameraUsageDescription: 'Scan receipts to log expenses.' },
      files,
    });
    expect(await purpose(fromSetting)).toEqual([]);
  });

  it('reads Objective-C calls and ignores calls in strings and comments', async () => {
    const root = nativeApp({
      files: {
        'App/Contacts.m':
          '#import <Contacts/Contacts.h>\nCNContactStore *store = [CNContactStore new];\n',
        'App/Notes.swift':
          'let text = "CBCentralManager is not used here"\n/* requestAlwaysAuthorization */\n',
      },
    });
    expect(await purpose(root)).toEqual([
      'RVW101 CNContactStore (App/Contacts.m:2) needs NSContactsUsageDescription (contacts); App has none.',
    ]);
  });

  it('lists up to three reasons for one key', async () => {
    const root = nativeApp({
      files: {
        'App/A.swift': 'let a = AVCaptureSession()',
        'App/B.swift': 'let b = DataScannerViewController()',
        'App/C.swift': 'picker.sourceType = .camera',
      },
    });
    expect(await purpose(root)).toEqual([
      'RVW101 AVCaptureSession (App/A.swift:1), DataScannerViewController (App/B.swift:1), UIImagePickerController camera (App/C.swift:1) needs NSCameraUsageDescription (camera); App has none.',
    ]);
  });

  it('does not ask an App Clip for what the app code needs', async () => {
    const root = nativeApp({
      productType: 'com.apple.product-type.application.on-demand-install-capable',
      files: { 'App/Scanner.swift': CAMERA_CODE },
    });
    expect(await purpose(root)).toEqual([]);
  });

  it('separates keys a Flutter package always needs from those for one feature', async () => {
    const root = tree({
      'pubspec.yaml':
        'name: harvest\ndependencies:\n  flutter:\n    sdk: flutter\n  image_picker: ^1.2.4\n',
      'ios/Runner.xcodeproj/project.pbxproj': (await import('../helpers/projects.js')).pbxproj(),
      'ios/App/Info.plist': (await import('../helpers/tree.js')).infoPlist(
        plistString('NSPhotoLibraryUsageDescription', 'Pick the photo of your harvest.'),
      ),
    });
    expect(await purpose(root)).toEqual([
      'RVW101 The image_picker package needs NSCameraUsageDescription (camera); App has none.',
      'RVW102 The image_picker package needs NSMicrophoneUsageDescription (microphone) for recording videos; App has none.',
    ]);
  });

  it('asks for the permissions a Podfile compiles in for permission_handler', async () => {
    const root = tree({
      'pubspec.yaml':
        'name: a\ndependencies:\n  flutter:\n    sdk: flutter\n  permission_handler: ^13.0.2\n',
      'ios/Runner.xcodeproj/project.pbxproj': (await import('../helpers/projects.js')).pbxproj(),
      'ios/App/Info.plist': (await import('../helpers/tree.js')).infoPlist(''),
      'ios/Podfile':
        "config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= ['PERMISSION_LOCATION=1', 'PERMISSION_CAMERA=0']\n",
    });
    expect(await purpose(root)).toEqual([
      'RVW101 permission_handler PERMISSION_LOCATION (ios/Podfile:1) needs NSLocationWhenInUseUsageDescription (location while the app is in use) (or NSLocationAlwaysAndWhenInUseUsageDescription); App has none.',
    ]);
  });
});

describe('RVW103 and RVW104: purpose string values', () => {
  it.each([
    ['<string></string>', 'NSCameraUsageDescription is empty.'],
    ['<string>   </string>', 'NSCameraUsageDescription is only whitespace.'],
    ['<true/>', 'NSCameraUsageDescription is a boolean, not a string.'],
    ['<array><string>a</string></array>', 'NSCameraUsageDescription is an array, not a string.'],
    [
      `<string>${'é'.repeat(2000)}</string>`,
      'NSCameraUsageDescription is 4000 bytes; it must be shorter than 4,000.',
    ],
  ])('RVW103 for %s', async (value, message) => {
    const root = nativeApp({ info: `\t<key>NSCameraUsageDescription</key>\n\t${value}` });
    expect(await purpose(root)).toEqual([`RVW103 ${message}`]);
  });

  it('accepts a string of 3,999 bytes', async () => {
    const root = nativeApp({ info: plistString('NSCameraUsageDescription', 'a'.repeat(3999)) });
    expect(await purpose(root)).toEqual([]);
  });

  it.each([
    ['your usage description here', 'is the sample text from the camera package README'],
    ['  [REASON] ', 'is the sample text from the react-native-permissions README'],
    [
      'Allow $(PRODUCT_NAME) to access your camera',
      'is the default text of the expo-camera, expo-image-picker config plugins',
    ],
    ['TODO write this', 'contains the placeholder "TODO"'],
    ['Lorem   ipsum dolor', 'contains the placeholder "Lorem   ipsum"'],
  ])('RVW104 for "%s"', async (value, reason) => {
    const root = nativeApp({ info: plistString('NSCameraUsageDescription', value) });
    expect(await purpose(root)).toEqual([
      `RVW104 NSCameraUsageDescription "${value.trim()}" ${reason}.`,
    ]);
  });

  it('does not flag a word that only contains a placeholder word', async () => {
    const root = nativeApp({
      info: plistString(
        'NSCameraUsageDescription',
        'Photograph the todos and placeholders on your whiteboard.',
      ),
    });
    expect(await purpose(root)).toEqual([]);
  });
});

describe('Expo config plugins', () => {
  it('flags the default text a plugin Expo applies on its own writes', async () => {
    const root = expoApp({ name: 'Field' }, { 'expo-location': '~58.0.19' });
    expect(await purpose(root)).toEqual([
      "RVW104 The expo-location config plugin writes its default text for NSLocationWhenInUseUsageDescription, NSLocationAlwaysAndWhenInUseUsageDescription, NSLocationAlwaysUsageDescription: no option or ios.infoPlist value gives the app's own.",
    ]);
  });

  it('accepts plugin options, ios.infoPlist values and options set to false', async () => {
    const root = expoApp(
      {
        ios: {
          infoPlist: { NSMicrophoneUsageDescription: 'Record voice notes about each plant.' },
        },
        plugins: [
          ['expo-camera', { cameraPermission: 'Photograph the plants you log.' }],
          [
            'expo-image-picker',
            { photosPermission: false, cameraPermission: false, microphonePermission: false },
          ],
        ],
      },
      { 'expo-camera': '~58.0.13', 'expo-image-picker': '~58.0.10' },
    );
    expect(await purpose(root)).toEqual([]);
  });

  it('asks for the keys of a package whose plugin Expo does not apply on its own', async () => {
    const missing = expoApp(
      {},
      { 'expo-tracking-transparency': '~58.0.2', 'expo-audio': '~58.0.10' },
    );
    expect(await purpose(missing)).toEqual([
      'RVW101 The expo-tracking-transparency package (its config plugin is not in expo.plugins) needs NSUserTrackingUsageDescription (App Tracking Transparency); field has none.',
      'RVW102 The expo-audio package (its config plugin is not in expo.plugins) needs NSMicrophoneUsageDescription (microphone) for recording audio; field has none.',
    ]);
    const listed = expoApp(
      {
        plugins: [
          [
            'expo-tracking-transparency',
            { userTrackingPermission: 'Show you plant offers from partners.' },
          ],
        ],
      },
      { 'expo-tracking-transparency': '~58.0.2' },
    );
    expect(await purpose(listed)).toEqual([]);
  });

  it('lets a React Native package config plugin write its keys', async () => {
    const without = expoApp({}, { 'react-native-ble-plx': '^3.5.1' });
    expect(await purpose(without)).toEqual([
      'RVW101 The react-native-ble-plx package needs NSBluetoothAlwaysUsageDescription (Bluetooth); field has none.',
    ]);
    const withPlugin = expoApp(
      { plugins: ['@config-plugins/react-native-ble-plx'] },
      { 'react-native-ble-plx': '^3.5.1' },
    );
    expect(await purpose(withPlugin)).toEqual([]);
  });

  it('points at the line of the plugin in app.json', async () => {
    const root = expoApp({ plugins: ['expo-camera'] }, { 'expo-camera': '~58.0.13' });
    const report = await scan(root);
    expect(report.findings.map((item) => [item.rule, item.file, item.line])).toContainEqual([
      'RVW104',
      'app.json',
      4,
    ]);
  });
});
