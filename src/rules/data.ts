// The rule data: what each rule says, its sources and its fixes, and the tables the checks match
// against (APIs, packages, config plugins, login SDKs), from rules/app-review.json. The checks in
// this folder decide where a rule applies; the words and the tables come from the data file, so
// they can be reviewed without reading code.
import { readFileSync } from 'node:fs';
import { z } from 'zod';

export const SEVERITIES = ['error', 'warning', 'info'] as const;
export type Severity = (typeof SEVERITIES)[number];

export const RULE_IDS = [
  'RVW101',
  'RVW102',
  'RVW103',
  'RVW104',
  'RVW201',
  'RVW301',
  'RVW401',
  'RVW501',
  'RVW502',
  'RVW503',
  'RVW601',
  'RVW602',
  'RVW701',
  'RVW702',
] as const;
export type RuleId = (typeof RULE_IDS)[number];

/** Which fix of a rule applies: by where the finding is. */
export const FIX_VARIANTS = ['info-plist', 'build-setting', 'expo-config', 'code', 'ci'] as const;
export type FixVariant = (typeof FIX_VARIANTS)[number];

/** One source a rule cites. */
export const ruleSourceSchema = z.object({
  title: z.string().min(1),
  url: z.url({ protocol: /^https$/ }),
});
export type RuleSource = z.infer<typeof ruleSourceSchema>;

/** One fix of a rule: what to do, step by step, and the guide. */
export const ruleFixSchema = z.object({
  title: z.string().min(1),
  steps: z.array(z.string().min(1)).min(1),
  guide: z.string().regex(/^docs\/guides\/[\w-]+\.md$/),
});
export type RuleFix = z.infer<typeof ruleFixSchema>;

/** One rule of the rule data. */
export const ruleSchema = z.object({
  id: z.enum(RULE_IDS),
  severity: z.enum(SEVERITIES),
  title: z.string().min(1),
  summary: z.string().min(1),
  sources: z.array(ruleSourceSchema).min(1),
  fixes: z.partialRecord(z.enum(FIX_VARIANTS), ruleFixSchema),
});
export type Rule = z.infer<typeof ruleSchema>;

const purposeKey = z.string().regex(/^(NS[A-Za-z]+UsageDescription|NFCReaderUsageDescription)$/);
const pattern = z.string().refine((value) => {
  try {
    new RegExp(value);
    return true;
  } catch {
    return false;
  }
}, 'not a valid regular expression');
const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);

/** A purpose string a package needs; `when` names the feature it is needed for, if not always. */
const needSchema = z.object({
  keys: z.array(purposeKey).min(1),
  when: z.string().min(1).optional(),
});

/** The shape of rules/app-review.json; rules/schema.json is generated from it. */
export const ruleDataSchema = z.object({
  $schema: z.string().optional(),
  ruleSet: z.literal('app-review'),
  dataVersion: z.string().regex(/^\d{4}\.\d{2}\.\d{2}$/),
  /** The day the sources were read. */
  read: date,
  requirements: z.object({
    xcode: z.object({ minimum: z.string(), since: date, text: z.string() }),
    deploymentTarget: z.object({ minimum: z.string(), since: date, text: z.string() }),
  }),
  rules: z.array(ruleSchema),
  /** Every purpose string key the checks know, with what it gives access to. */
  purposeKeys: z.record(purposeKey, z.string().min(1)),
  nativeApis: z.array(
    z.object({ label: z.string().min(1), pattern, keys: z.array(purposeKey).min(1) }),
  ),
  packages: z.array(
    z.object({
      ecosystem: z.enum(['flutter', 'npm']),
      name: z.string().min(1),
      /** The version whose README was read. */
      version: z.string().min(1),
      source: z.url({ protocol: /^https$/ }),
      needs: z.array(needSchema).min(1),
      /** The config plugin that writes the keys in an Expo app, when it has one. */
      plugin: z.string().min(1).optional(),
    }),
  ),
  expoPlugins: z.array(
    z.object({
      name: z.string().min(1),
      version: z.string().min(1),
      /** Whether Expo applies the plugin when the package is installed, without a plugins entry. */
      auto: z.boolean(),
      keys: z.array(
        z.object({
          key: purposeKey,
          option: z.string().min(1),
          default: z.string().min(1),
          when: z.string().min(1).optional(),
        }),
      ),
    }),
  ),
  podfileMacros: z.array(z.object({ macro: z.string(), keys: z.array(purposeKey).min(1) })),
  podfileMacroSource: z.url({ protocol: /^https$/ }),
  rnPermissions: z.array(z.object({ name: z.string(), keys: z.array(purposeKey).min(1) })),
  rnPermissionsSource: z.url({ protocol: /^https$/ }),
  placeholders: z.object({
    exact: z.array(z.object({ text: z.string().min(1), from: z.string().min(1) })),
    words: z.array(z.string().min(1)),
  }),
  login: z.object({
    thirdParty: z.array(
      z.object({
        label: z.string().min(1),
        native: z.union([pattern, z.literal('')]),
        flutter: z.array(z.string()),
        npm: z.array(z.string()),
        imports: z.array(z.string()),
      }),
    ),
    apple: z.object({
      native: pattern,
      entitlement: z.string(),
      flutter: z.array(z.string()),
      npm: z.array(z.string()),
      text: pattern,
    }),
  }),
  accounts: z.object({
    creation: z.array(z.object({ label: z.string(), pattern })),
    creationText: pattern,
    deletion: z.array(z.object({ label: z.string(), pattern })),
    deletionText: pattern,
  }),
});
export type RuleData = z.infer<typeof ruleDataSchema>;

/**
 * Parses and checks rule data: every rule ID must appear exactly once, and every key a table
 * names must be in purposeKeys.
 */
export function parseRuleData(json: unknown): RuleData {
  const data = ruleDataSchema.parse(json);
  const ids = data.rules.map((item) => item.id);
  const missing = RULE_IDS.filter((id) => !ids.includes(id));
  const repeated = ids.filter((id, index) => ids.indexOf(id) !== index);
  if (missing.length > 0) throw new Error(`Rule data has no entry for ${missing.join(', ')}.`);
  if (repeated.length > 0) throw new Error(`Rule data repeats ${repeated.join(', ')}.`);
  const named = [
    ...data.nativeApis.flatMap((item) => item.keys),
    ...data.packages.flatMap((item) => item.needs.flatMap((need) => need.keys)),
    ...data.expoPlugins.flatMap((item) => item.keys.map((key) => key.key)),
    ...data.podfileMacros.flatMap((item) => item.keys),
    ...data.rnPermissions.flatMap((item) => item.keys),
  ];
  const unknown = [...new Set(named.filter((key) => !(key in data.purposeKeys)))];
  if (unknown.length > 0) throw new Error(`purposeKeys has no entry for ${unknown.join(', ')}.`);
  return data;
}

// src/ and dist/ are both one level below the package root.
export const RULE_DATA: RuleData = parseRuleData(
  JSON.parse(readFileSync(new URL('../../rules/app-review.json', import.meta.url), 'utf8')),
);

const BY_ID = new Map(RULE_DATA.rules.map((item) => [item.id, item]));

export function ruleById(id: RuleId): Rule {
  const found = BY_ID.get(id);
  if (!found) throw new Error(`Unknown rule ${id}`);
  return found;
}
