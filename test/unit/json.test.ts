import { describe, expect, it } from 'vitest';
import { JsonDepthError, MAX_JSON_DEPTH, nestsDeeperThan, parseJson } from '../../src/core/json.js';
import { detectProject } from '../../src/detect/project.js';
import { minimalPbxproj, tree } from '../helpers/tree.js';

const nested = (levels: number) => `${'['.repeat(levels)}${']'.repeat(levels)}`;

describe('parseJson', () => {
  it('parses JSON that nests up to the limit and refuses one level more', () => {
    expect(parseJson(nested(MAX_JSON_DEPTH))).toBeInstanceOf(Array);
    expect(() => parseJson(nested(MAX_JSON_DEPTH + 1))).toThrow(JsonDepthError);
    expect(() => parseJson(`{"a":${nested(MAX_JSON_DEPTH)}}`)).toThrow('nests more than 64 levels');
  });

  it('does not count brackets inside strings, escaped quotes included', () => {
    const brackets = JSON.stringify({ name: `"${'['.repeat(500)}\\"{{{` });
    expect(nestsDeeperThan(brackets, 2)).toBe(false);
    expect(parseJson(brackets)).toEqual(JSON.parse(brackets));
  });

  it('leaves syntax errors to JSON.parse', () => {
    expect(() => parseJson('{"a":')).toThrow(SyntaxError);
  });
});

describe('deeply nested project files', () => {
  it('are refused quickly instead of being parsed', async () => {
    // 4 files of 8 MB each, the shape that took 5 GB of memory and 9 s before the limit.
    const deep = nested(4_000_000);
    const root = tree({
      'package.json': `{"dependencies":{"react-native":"0.88.0","expo":"58.0.0"},"x":${deep}}`,
      'package-lock.json': `{"x":${deep}}`,
      'app.json': `{"expo":${deep}}`,
      'node_modules/react-native/package.json': `{"x":${deep}}`,
      'App.xcodeproj/project.pbxproj': minimalPbxproj(),
    });
    const started = performance.now();
    const project = await detectProject(root);
    expect(performance.now() - started).toBeLessThan(2000);
    expect(project.ecosystem).toBe('native');
    expect(project.notes[0]).toMatch(/^package\.json nests more than 64 levels; it was not read\./);
  });

  it('keep an Expo app.json that nests too deep as text', async () => {
    const root = tree({
      'package.json': '{"dependencies":{"expo":"58.0.0"}}',
      'app.json': `{"expo":${nested(4_000_000)}}`,
    });
    const started = performance.now();
    const project = await detectProject(root);
    expect(performance.now() - started).toBeLessThan(2000);
    expect(project.expoConfig).toMatchObject({ file: 'app.json', json: null });
  });
});
