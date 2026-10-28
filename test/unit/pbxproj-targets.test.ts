import { describe, expect, it } from 'vitest';
import { parseOpenStep } from '../../src/collect/openstep.js';
import { readTargets } from '../../src/collect/pbxproj.js';

const PBXPROJ = `// !$*UTF8*$!
{
	objects = {
		P0 = {isa = PBXProject; buildConfigurationList = PL; targets = (T0, T1, ); };
		PL = {isa = XCConfigurationList; buildConfigurations = (); };
		T0 = {isa = PBXNativeTarget; name = App; productType = "com.apple.product-type.application"; buildPhases = (R0, S0, ); };
		R0 = {isa = PBXResourcesBuildPhase; files = (B0, B1, B2, ); };
		S0 = {isa = PBXSourcesBuildPhase; files = (B3, ); };
		B0 = {isa = PBXBuildFile; fileRef = F0; };
		B1 = {isa = PBXBuildFile; fileRef = F1; };
		B2 = {isa = PBXBuildFile; fileRef = MISSING; };
		B3 = {isa = PBXBuildFile; fileRef = F2; };
		F0 = {isa = PBXFileReference; path = App/PrivacyInfo.xcprivacy; sourceTree = "<group>"; };
		F1 = {isa = PBXFileReference; name = Assets.xcassets; path = Resources/Assets.xcassets; sourceTree = "<group>"; };
		F2 = {isa = PBXFileReference; path = App.swift; sourceTree = "<group>"; };
		T1 = {isa = PBXNativeTarget; name = Clip; productType = "com.apple.product-type.application.on-demand-install-capable"; fileSystemSynchronizedGroups = (G0, G1, ); };
		G0 = {isa = PBXFileSystemSynchronizedRootGroup; path = Clip; sourceTree = "<group>"; };
		G1 = {isa = PBXGroup; path = NotSynced; };
	};
	rootObject = P0;
}
`;

describe('readTargets', () => {
  it('lists the files of the Copy Bundle Resources phase by name', () => {
    const [app] = readTargets(parseOpenStep(PBXPROJ));
    expect(app?.resources).toEqual(['PrivacyInfo.xcprivacy', 'Assets.xcassets']);
    expect(app?.synchronizedFolders).toEqual([]);
  });

  it('lists the synchronized folders of an Xcode 16 target', () => {
    const [, clip] = readTargets(parseOpenStep(PBXPROJ));
    expect(clip).toMatchObject({ name: 'Clip', resources: [], synchronizedFolders: ['Clip'] });
  });
});
