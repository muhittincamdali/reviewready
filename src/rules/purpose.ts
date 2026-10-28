// RVW101 to RVW104: purpose strings. Works out which keys the app needs (from the APIs its own
// code calls, the packages it ships, the permissions its Podfile compiles in and, for an Expo app
// without ios/, the config plugins that will write the Info.plist), then checks that each one is
// there and that every purpose string is valid and says something.
import { join } from 'node:path';
import { type AppModel, type AppTarget, shownPath } from '../collect/app.js';
import { RULE_DATA, type RuleId } from './data.js';
import { type CheckResult, firstMatch, type Hit, infoPlace } from './hit.js';

/** One reason the app needs one of `keys` (any one of them is enough). */
interface Need {
  keys: readonly string[];
  /** What needs it, for the message: "AVCaptureSession (Sources/Scanner.swift:12)". */
  reason: string;
  /** The feature the key is needed for, when it is not always needed (RVW102). */
  when?: string;
}

/** Apple's limit: "The purpose string is shorter than 4,000 bytes." */
export const MAX_PURPOSE_BYTES = 4000;
const NAMED_REASONS = 3;

const NATIVE_APIS = RULE_DATA.nativeApis.map((api) => ({ ...api, regex: new RegExp(api.pattern) }));
const PURPOSE_KEY = /^(NS[A-Za-z]+UsageDescription|NFCReaderUsageDescription)$/;

const shown = (app: AppModel, path: string) => shownPath(path, app.project.root);

function nativeNeeds(app: AppModel): Need[] {
  const code = app.sources.filter((file) => file.language === 'swift' || file.language === 'objc');
  const needs: Need[] = [];
  for (const api of NATIVE_APIS) {
    const found = firstMatch(code, api.regex);
    if (!found) continue;
    needs.push({
      keys: api.keys,
      reason: `${api.label} (${shown(app, found.file.path)}:${found.line})`,
    });
  }
  return needs;
}

function packageNeeds(app: AppModel): Need[] {
  const { ecosystem, dependencies } = app.project;
  const registry = ecosystem === 'flutter' ? 'flutter' : 'npm';
  const managedExpo = app.project.iosDir === null;
  const plugins = new Set(app.expo?.plugins.map((plugin) => plugin.name) ?? []);
  const needs: Need[] = [];
  for (const item of RULE_DATA.packages) {
    if (item.ecosystem !== registry || !dependencies.has(item.name)) continue;
    // In an Expo app without ios/, the package's config plugin writes the keys at prebuild.
    if (managedExpo && item.plugin && plugins.has(item.plugin)) continue;
    for (const need of item.needs) {
      needs.push({
        keys: need.keys,
        reason: `the ${item.name} package`,
        ...(need.when ? { when: need.when } : {}),
      });
    }
  }
  if (ecosystem !== 'flutter' && !managedExpo) {
    // With ios/, an Expo package's keys are in the Info.plist prebuild wrote.
    for (const plugin of RULE_DATA.expoPlugins) {
      if (!dependencies.has(plugin.name)) continue;
      for (const key of plugin.keys) {
        needs.push({
          keys: [key.key],
          reason: `the ${plugin.name} package`,
          ...(key.when ? { when: key.when } : {}),
        });
      }
    }
  }
  return needs;
}

function podfileNeeds(app: AppModel): Need[] {
  const podfile = app.podfile;
  if (!podfile) return [];
  const needs: Need[] = [];
  const file = shown(app, podfile.file);
  if (app.project.dependencies.has('permission_handler')) {
    for (const item of RULE_DATA.podfileMacros) {
      const line = podfile.macros.get(item.macro);
      if (line === undefined) continue;
      needs.push({ keys: item.keys, reason: `permission_handler ${item.macro} (${file}:${line})` });
    }
  }
  if (app.project.dependencies.has('react-native-permissions')) {
    for (const item of RULE_DATA.rnPermissions) {
      const line = podfile.setup.get(item.name);
      if (line === undefined) continue;
      needs.push({
        keys: item.keys,
        reason: `react-native-permissions ${item.name} (${file}:${line})`,
      });
    }
  }
  return needs;
}

interface ExpoPluginResult {
  needs: Need[];
  /** Keys a plugin fills with its default text, per plugin. */
  defaults: { plugin: string; keys: string[] }[];
}

/**
 * What the Expo config plugins of the installed packages will do to the Info.plist. An applied
 * plugin sets each key to its option, or the value already in ios.infoPlist, or its default text;
 * an option set to false leaves the key out. A package whose plugin Expo does not apply on its own
 * and that is not in plugins writes nothing, so its keys must be in ios.infoPlist.
 */
function expoPluginNeeds(app: AppModel, target: AppTarget): ExpoPluginResult {
  const result: ExpoPluginResult = { needs: [], defaults: [] };
  const expo = app.expo;
  if (!expo) return result;
  for (const plugin of RULE_DATA.expoPlugins) {
    if (!app.project.dependencies.has(plugin.name)) continue;
    const entry = expo.plugins.find((item) => item.name === plugin.name);
    const applied = plugin.auto || entry !== undefined;
    const defaults: string[] = [];
    for (const key of plugin.keys) {
      const option = entry?.options[key.option];
      if (!applied) {
        result.needs.push({
          keys: [key.key],
          reason: `the ${plugin.name} package, whose config plugin is not in expo.plugins`,
          ...(key.when ? { when: key.when } : {}),
        });
        continue;
      }
      if (option === false) continue;
      if (typeof option === 'string' && option.length > 0) continue;
      if (!target.info.has(key.key)) defaults.push(key.key);
    }
    if (defaults.length > 0) result.defaults.push({ plugin: plugin.name, keys: defaults });
  }
  return result;
}

const keyLabel = (key: string) => `${key} (${RULE_DATA.purposeKeys[key] ?? 'protected resource'})`;

function missingHits(target: AppTarget, needs: Need[]): Hit[] {
  const place = infoPlace(target);
  const byKey = new Map<string, Need[]>();
  for (const need of needs) {
    if (need.keys.some((key) => target.info.has(key))) continue;
    const key = need.keys[0] ?? '';
    byKey.set(key, [...(byKey.get(key) ?? []), need]);
  }
  const hits: Hit[] = [];
  for (const [key, list] of byKey) {
    const always = list.filter((need) => need.when === undefined);
    const rule: RuleId = always.length > 0 ? 'RVW101' : 'RVW102';
    const shownNeeds = always.length > 0 ? always : list;
    const reasons = [...new Set(shownNeeds.map((need) => need.reason))];
    const named = reasons.slice(0, NAMED_REASONS).join(', ');
    const more =
      reasons.length > NAMED_REASONS ? ` and ${reasons.length - NAMED_REASONS} more` : '';
    const alternatives = shownNeeds[0]?.keys.slice(1) ?? [];
    const either = alternatives.length > 0 ? ` (or ${alternatives.join(', ')})` : '';
    const when = rule === 'RVW102' ? ` for ${shownNeeds[0]?.when}` : '';
    hits.push({
      rule,
      file: place.file,
      line: null,
      variant: place.variant,
      target: target.name,
      message: `${named}${more} needs ${keyLabel(key)}${either}${when}; ${target.name} has none.`,
    });
  }
  return hits;
}

const PLACEHOLDER_WORDS = new RegExp(
  `\\b(?:${RULE_DATA.placeholders.words.map((word) => word.replace(/\s+/g, '\\s+')).join('|')})\\b`,
  'i',
);
const normalized = (text: string) => text.trim().replace(/\s+/g, ' ').toLowerCase();
const EXACT = new Map(
  RULE_DATA.placeholders.exact.map((item) => [normalized(item.text), item.from] as const),
);
const DEFAULTS = new Map(
  RULE_DATA.expoPlugins.flatMap((plugin) =>
    plugin.keys.map((key) => [normalized(key.default), plugin.name] as const),
  ),
);

/** Why a purpose string is not valid (RVW103), or null. */
function invalidReason(value: unknown): string | null {
  if (typeof value !== 'string') {
    const type = Array.isArray(value) ? 'an array' : value === null ? 'empty' : `a ${typeof value}`;
    return `is ${type}, not a string`;
  }
  if (value.trim() === '') return value === '' ? 'is empty' : 'is only whitespace';
  const bytes = Buffer.byteLength(value, 'utf8');
  if (bytes >= MAX_PURPOSE_BYTES) return `is ${bytes} bytes; it must be shorter than 4,000`;
  return null;
}

/** Why a purpose string looks like a placeholder or a default (RVW104), or null. */
function placeholderReason(value: string): string | null {
  const text = normalized(value);
  const sample = EXACT.get(text);
  if (sample) return `is the sample text from ${sample}`;
  const plugin = DEFAULTS.get(text);
  if (plugin) return `is the default text of the ${plugin} config plugin`;
  const word = PLACEHOLDER_WORDS.exec(value)?.[0];
  if (word) return `contains the placeholder "${word}"`;
  return null;
}

function valueHits(target: AppTarget): Hit[] {
  const hits: Hit[] = [];
  for (const entry of target.info.values()) {
    if (!PURPOSE_KEY.test(entry.key)) continue;
    const variant =
      entry.origin === 'build-setting'
        ? 'build-setting'
        : entry.origin === 'expo-config'
          ? 'expo-config'
          : 'info-plist';
    const base = { file: entry.file, line: entry.line, variant, target: target.name } as const;
    const invalid = invalidReason(entry.value);
    if (invalid) {
      hits.push({ ...base, rule: 'RVW103', message: `${entry.key} ${invalid}.` });
      continue;
    }
    const placeholder = placeholderReason(entry.value as string);
    if (placeholder) {
      hits.push({
        ...base,
        rule: 'RVW104',
        message: `${entry.key} "${(entry.value as string).trim()}" ${placeholder}.`,
      });
    }
  }
  return hits;
}

function defaultHits(app: AppModel, target: AppTarget, defaults: ExpoPluginResult['defaults']) {
  const file = target.configFile ?? join(app.project.root, 'app.json');
  return defaults.map((item): Hit => ({
    rule: 'RVW104',
    file,
    line: app.expo?.lineOf(`"${item.plugin}"`) ?? null,
    variant: 'expo-config',
    target: target.name,
    message: `The ${item.plugin} config plugin writes its default text for ${item.keys.join(', ')}: no option or ios.infoPlist value gives the app's own.`,
  }));
}

export function checkPurposeStrings(app: AppModel): CheckResult {
  const hits: Hit[] = [];
  const shared = [...nativeNeeds(app), ...packageNeeds(app), ...podfileNeeds(app)];
  const targets = app.targets.filter((target) => !target.unreadInfoPlist);
  for (const target of targets) {
    const expo = target.configFile !== null ? expoPluginNeeds(app, target) : null;
    // An App Clip ships only part of the app's code; the app's needs are checked on the app.
    if (!target.appClip) hits.push(...missingHits(target, [...shared, ...(expo?.needs ?? [])]));
    hits.push(...valueHits(target));
    if (expo) hits.push(...defaultHits(app, target, expo.defaults));
  }
  const checked: RuleId[] = targets.length > 0 ? ['RVW101', 'RVW102', 'RVW103', 'RVW104'] : [];
  return { hits, checked };
}
