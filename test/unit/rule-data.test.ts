import { existsSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { describe, expect, it } from 'vitest';
import { ruleSchemaJson } from '../../scripts/rule-schema.ts';
import { parseRuleData, RULE_DATA, RULE_IDS, ruleById } from '../../src/rules/data.js';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const raw = () => JSON.parse(readFileSync(`${ROOT}rules/app-review.json`, 'utf8'));

describe('rules/app-review.json', () => {
  it('has every rule once, in order', () => {
    expect(RULE_DATA.rules.map((rule) => rule.id)).toEqual([...RULE_IDS]);
  });

  it('cites an Apple page over HTTPS for every rule', () => {
    for (const rule of RULE_DATA.rules) {
      expect(rule.sources.length, rule.id).toBeGreaterThan(0);
      for (const source of rule.sources) {
        expect(source.url, rule.id).toMatch(/^https:\/\/developer\.apple\.com\//);
      }
    }
  });

  it('names the version and an HTTPS page for every package it reads', () => {
    for (const item of RULE_DATA.packages) {
      expect(item.version, item.name).toMatch(/^\d+\.\d+\.\d+$/);
      expect(item.source, item.name).toMatch(
        /^https:\/\/(pub\.dev|www\.npmjs\.com|github\.com|react-native-vision-camera\.com)\//,
      );
    }
    for (const plugin of RULE_DATA.expoPlugins)
      expect(plugin.version, plugin.name).toMatch(/^\d+\.\d+\.\d+$/);
  });

  it('has the package counts the README and CHANGELOG give', () => {
    const count = (ecosystem: string) =>
      RULE_DATA.packages.filter((item) => item.ecosystem === ecosystem).length;
    expect([count('flutter'), count('npm'), RULE_DATA.expoPlugins.length]).toEqual([15, 10, 11]);
  });

  it('links every fix to a guide that exists', () => {
    for (const rule of RULE_DATA.rules) {
      for (const fix of Object.values(rule.fixes)) {
        expect(existsSync(`${ROOT}${fix.guide}`), `${rule.id} ${fix.guide}`).toBe(true);
      }
    }
  });

  it('has a fix for every variant a check uses', () => {
    const used: Record<string, string[]> = {
      RVW101: ['info-plist', 'build-setting', 'expo-config'],
      RVW102: ['info-plist', 'expo-config'],
      RVW103: ['info-plist', 'build-setting', 'expo-config'],
      RVW104: ['info-plist', 'expo-config'],
      RVW201: ['info-plist', 'build-setting', 'expo-config'],
      RVW301: ['code'],
      RVW401: ['code'],
      RVW501: ['info-plist', 'expo-config'],
      RVW502: ['info-plist', 'expo-config'],
      RVW503: ['info-plist'],
      RVW601: ['ci'],
      RVW602: ['info-plist', 'expo-config'],
      RVW701: ['info-plist', 'expo-config'],
      RVW702: ['info-plist'],
    };
    for (const id of RULE_IDS) {
      expect(Object.keys(ruleById(id).fixes).sort(), id).toEqual([...(used[id] ?? [])].sort());
    }
  });

  it('dates the minimums it checks and the day its sources were read', () => {
    expect(RULE_DATA.requirements.xcode).toMatchObject({ minimum: '26', since: '2026-04-28' });
    expect(RULE_DATA.requirements.deploymentTarget).toMatchObject({
      minimum: '13.0',
      since: '2026-09-09',
    });
    expect(RULE_DATA.read).toBe('2026-10-28');
  });

  it('matches the JSON Schema shipped for editors', () => {
    const committed = readFileSync(`${ROOT}rules/schema.json`, 'utf8');
    expect(committed, 'run node scripts/rule-schema.ts').toBe(ruleSchemaJson());
    expect(JSON.parse(committed).properties.rules.items.properties.id.enum).toEqual([...RULE_IDS]);
  });
});

describe('parseRuleData', () => {
  it('rejects a missing or repeated rule, an http source and an unknown variant', () => {
    const data = raw();
    expect(() => parseRuleData({ ...data, rules: data.rules.slice(1) })).toThrow(
      /no entry for RVW101/,
    );
    expect(() => parseRuleData({ ...data, rules: [...data.rules, data.rules[0]] })).toThrow(
      /repeats RVW101/,
    );
    const http = structuredClone(data);
    http.rules[0].sources[0].url = 'http://developer.apple.com/x';
    expect(() => parseRuleData(http)).toThrow();
    const variant = structuredClone(data);
    variant.rules[0].fixes.android = variant.rules[0].fixes['info-plist'];
    expect(() => parseRuleData(variant)).toThrow();
  });

  it('rejects a pattern that does not compile and a key no table describes', () => {
    const pattern = structuredClone(raw());
    pattern.nativeApis[0].pattern = '(unclosed';
    expect(() => parseRuleData(pattern)).toThrow(/regular expression/);
    const key = structuredClone(raw());
    key.packages[0].needs[0].keys = ['NSSomethingNewUsageDescription'];
    expect(() => parseRuleData(key)).toThrow(
      /purposeKeys has no entry for NSSomethingNewUsageDescription/,
    );
  });

  it('throws for an unknown rule id', () => {
    expect(() => ruleById('RVW999' as never)).toThrow(/Unknown rule/);
  });
});
