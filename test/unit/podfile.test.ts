import { describe, expect, it } from 'vitest';
import { readPodfile } from '../../src/collect/podfile.js';
import { tree } from '../helpers/tree.js';

describe('readPodfile', () => {
  it('reads the permission_handler macros set to 1, with their lines', async () => {
    const root = tree({
      'ios/Podfile': `post_install do |installer|
  installer.pods_project.targets.each do |target|
    target.build_configurations.each do |config|
      config.build_settings['GCC_PREPROCESSOR_DEFINITIONS'] ||= [
        '$(inherited)',
        'PERMISSION_CAMERA=1',
        'PERMISSION_MICROPHONE=0',
        # 'PERMISSION_CONTACTS=1',
        "PERMISSION_LOCATION_WHENINUSE=1", # when in use only
      ]
    end
  end
end
`,
    });
    const podfile = await readPodfile(`${root}/ios`, root);
    expect([...(podfile?.macros ?? [])]).toEqual([
      ['PERMISSION_CAMERA', 6],
      ['PERMISSION_LOCATION_WHENINUSE', 9],
    ]);
  });

  it('reads the names in setup_permissions, over one or several lines', async () => {
    const root = tree({
      'ios/Podfile': `node_require('react-native-permissions/scripts/setup.rb')
setup_permissions([
  'Camera',
  # 'Contacts',
  "Microphone",
])
setup_permissions(['FaceID'])
`,
    });
    const podfile = await readPodfile(`${root}/ios`, root);
    expect([...(podfile?.setup ?? [])]).toEqual([
      ['Camera', 3],
      ['Microphone', 5],
      ['FaceID', 7],
    ]);
  });

  it('returns null without a Podfile', async () => {
    const root = tree({ 'ios/App.swift': '' });
    expect(await readPodfile(`${root}/ios`, root)).toBeNull();
  });
});
