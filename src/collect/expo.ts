// The parts of an Expo app config (app.json) that end up in the iOS app when `expo prebuild` or EAS
// Build writes the native project: ios.infoPlist, the config plugins and their options, export
// compliance, Sign in with Apple, the icon, the privacy manifest and the deployment target.
import type { ExpoConfig } from '../detect/packages.js';
import { record } from '../detect/packages.js';

export interface ExpoPlugin {
  name: string;
  /** The options object of a `[name, options]` entry; empty for a plain name. */
  options: Record<string, unknown>;
}

export interface ExpoApp {
  /** app.json, relative to the project. */
  file: string;
  /** ios.infoPlist as written. */
  infoPlist: Record<string, unknown>;
  plugins: ExpoPlugin[];
  /** ios.config.usesNonExemptEncryption, when set. */
  usesNonExemptEncryption: unknown;
  usesAppleSignIn: boolean;
  /** ios.icon, or the top-level icon: a path, or an object of appearance variants. */
  icon: unknown;
  hasPrivacyManifests: boolean;
  /** ios.deploymentTarget of the expo-build-properties plugin, when set. */
  deploymentTarget: string | null;
  /** 1-based line of the first place `needle` appears in app.json. */
  lineOf(needle: string): number | null;
}

function pluginsOf(value: unknown): ExpoPlugin[] {
  if (!Array.isArray(value)) return [];
  const plugins: ExpoPlugin[] = [];
  for (const entry of value) {
    if (typeof entry === 'string') plugins.push({ name: entry, options: {} });
    else if (Array.isArray(entry) && typeof entry[0] === 'string') {
      plugins.push({ name: entry[0], options: record(entry[1]) });
    }
  }
  return plugins;
}

/** The Expo app of an app.json; null for app.config.js/ts, which is code and is not run. */
export function readExpoApp(config: ExpoConfig): ExpoApp | null {
  if (config.json === null) return null;
  const ios = record(config.json.ios);
  const plugins = pluginsOf(config.json.plugins);
  const buildProperties = plugins.find((plugin) => plugin.name === 'expo-build-properties');
  const target = record(buildProperties?.options.ios).deploymentTarget;
  const text = config.text;
  return {
    file: config.file,
    infoPlist: record(ios.infoPlist),
    plugins,
    usesNonExemptEncryption: record(ios.config).usesNonExemptEncryption,
    usesAppleSignIn: ios.usesAppleSignIn === true,
    icon: ios.icon ?? config.json.icon,
    hasPrivacyManifests: Object.keys(record(ios.privacyManifests)).length > 0,
    deploymentTarget: typeof target === 'string' ? target : null,
    lineOf(needle) {
      const index = text.indexOf(needle);
      return index === -1 ? null : text.slice(0, index).split('\n').length;
    },
  };
}
