// Small projects for the rule tests: a native app whose Info.plist, build settings, resources and
// files a test chooses, and an Expo app from its app.json and package.json.
import { scan } from '../../src/scan.js';
import type { Report } from '../../src/model.js';
import type { RuleId } from '../../src/rules/data.js';
import { png } from './png.js';
import { infoPlist, tree } from './tree.js';

export interface NativeApp {
  /** Top-level Info.plist XML (key/value pairs); null for no INFOPLIST_FILE. */
  info?: string | null;
  /** Extra build settings of the app target. */
  settings?: Record<string, string>;
  /** File names in the target's Copy Bundle Resources phase. */
  resources?: string[];
  productType?: string;
  files?: Record<string, string | Uint8Array>;
  /** Writes an opaque 1024 × 1024 App Store icon (default true). */
  icon?: boolean;
}

const quote = (value: string) => `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export function pbxproj(app: NativeApp = {}): string {
  const settings: Record<string, string> = {
    SDKROOT: 'iphoneos',
    ...(app.info === null
      ? { GENERATE_INFOPLIST_FILE: 'YES' }
      : { INFOPLIST_FILE: 'App/Info.plist' }),
    ...app.settings,
  };
  const lines = Object.entries(settings)
    .map(([key, value]) => `\t\t\t\t${key} = ${quote(value)};`)
    .join('\n');
  const resources = (app.resources ?? []).map((name, index) => ({ name, index }));
  return `// !$*UTF8*$!
{
	archiveVersion = 1;
	objects = {
		P0 = {isa = PBXProject; buildConfigurationList = PL; targets = (T0, ); };
		PL = {isa = XCConfigurationList; buildConfigurations = (PR, ); };
		PR = {isa = XCBuildConfiguration; name = Release; buildSettings = { }; };
		T0 = {isa = PBXNativeTarget; name = App; productType = ${quote(app.productType ?? 'com.apple.product-type.application')}; buildConfigurationList = TL; buildPhases = (R0, ); };
		TL = {isa = XCConfigurationList; buildConfigurations = (TR, ); };
		TR = {isa = XCBuildConfiguration; name = Release; buildSettings = {
${lines}
			}; };
		R0 = {isa = PBXResourcesBuildPhase; files = (${resources.map((item) => `B${item.index}, `).join('')}); };
${resources.map((item) => `\t\tB${item.index} = {isa = PBXBuildFile; fileRef = F${item.index}; };\n\t\tF${item.index} = {isa = PBXFileReference; path = ${quote(`App/${item.name}`)}; sourceTree = "<group>"; };`).join('\n')}
	};
	rootObject = P0;
}
`;
}

const ICON_SET = 'App/Assets.xcassets/AppIcon.appiconset';

/** A native app folder: App.xcodeproj, App/Info.plist, an icon and the given files. */
export function nativeApp(app: NativeApp = {}): string {
  const icon =
    app.icon === false
      ? {}
      : {
          [`${ICON_SET}/Contents.json`]: JSON.stringify({
            images: [
              { idiom: 'universal', platform: 'ios', size: '1024x1024', filename: 'icon.png' },
            ],
          }),
          [`${ICON_SET}/icon.png`]: png(1024, 1024),
        };
  return tree({
    'App.xcodeproj/project.pbxproj': pbxproj(app),
    ...(app.info === null ? {} : { 'App/Info.plist': infoPlist(app.info ?? '') }),
    ...icon,
    ...app.files,
  });
}

/** An Expo app folder without ios/. */
export function expoApp(
  expo: Record<string, unknown>,
  dependencies: Record<string, string> = {},
  files: Record<string, string | Uint8Array> = {},
): string {
  return tree({
    'package.json': JSON.stringify({
      name: 'field',
      dependencies: { expo: '~58.0.20', ...dependencies },
    }),
    'app.json': JSON.stringify({ expo }, null, 2),
    ...files,
  });
}

/** The findings of one rule (or all), as "RULE message". */
export async function findings(root: string, rules?: RuleId[]): Promise<string[]> {
  const report: Report = await scan(root);
  return report.findings
    .filter((item) => !rules || rules.includes(item.rule))
    .map((item) => `${item.rule} ${item.message}`);
}

export const plistString = (key: string, value: string) =>
  `\t<key>${key}</key>\n\t<string>${value}</string>`;
