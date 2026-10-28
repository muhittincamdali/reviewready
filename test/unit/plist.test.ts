import { readFileSync } from 'node:fs';
import { describe, expect, it, vi } from 'vitest';
import { MAX_BINARY_PLIST_VALUES } from '../../src/collect/plist-binary.js';
import { excerpt, MAX_EXCERPT_LENGTH, MAX_PLIST_DEPTH } from '../../src/collect/plist-value.js';
import { isDict, type PlistDict, PlistError, parsePlist } from '../../src/collect/plist.js';
import {
  type BinaryObject,
  binaryPlist,
  overlappingStringsPlist,
  sharedOffsetPlist,
  sharedReferencePlist,
} from '../helpers/bplist.js';

const data = (name: string) => readFileSync(new URL(`../data/${name}`, import.meta.url));

const wrap = (body: string) =>
  `<?xml version="1.0" encoding="UTF-8"?>\n<plist version="1.0">\n${body}\n</plist>\n`;

describe('parsePlist (XML)', () => {
  it('reads every value type an Info.plist uses', () => {
    const { value } = parsePlist(data('types.xml.plist'));
    expect(value).toEqual({
      Name: 'Café & Cœur ☕',
      Small: 7,
      Large: 5_000_000_000,
      Negative: -3,
      Real: 1.5,
      Yes: true,
      No: false,
      When: new Date('2026-10-15T00:00:00Z'),
      Bytes: Uint8Array.from([0, 1, 2, 255]),
      Many: Array.from({ length: 20 }, (_, index) => index),
      Empty: {},
    });
  });

  it('records the line of each top-level key', () => {
    const { keyLines } = parsePlist(data('Info.xml.plist'));
    expect(keyLines.get('CFBundleDevelopmentRegion')).toBe(5);
    expect(keyLines.get('UIApplicationSceneManifest')).toBe(25);
    expect(keyLines.get('UIDesignRequiresCompatibility')).toBe(42);
    // Nested keys are not top-level.
    expect(keyLines.has('UISceneConfigurations')).toBe(false);
  });

  it('keeps nested scene configurations', () => {
    const { value } = parsePlist(data('Info.xml.plist'));
    if (!isDict(value)) throw new Error('not a dict');
    const manifest = value.UIApplicationSceneManifest as PlistDict;
    const configurations = manifest.UISceneConfigurations as PlistDict;
    expect(configurations.UIWindowSceneSessionRoleApplication).toEqual([
      {
        UISceneConfigurationName: 'Default Configuration',
        UISceneDelegateClassName: '$(PRODUCT_MODULE_NAME).SceneDelegate',
      },
    ]);
  });

  it('accepts comments, CDATA, numeric entities and empty elements', () => {
    const { value } = parsePlist(
      wrap(
        '<dict><!-- note --><key>A</key><string><![CDATA[x < y]]></string><key>B</key><string>&#65;&#x42;</string><key>C</key><string/><key>D</key><array/></dict>',
      ),
    );
    expect(value).toEqual({ A: 'x < y', B: 'AB', C: '', D: [] });
  });

  it('reads a string with a byte order mark', () => {
    expect(parsePlist(`﻿${wrap('<string>ok</string>')}`).value).toBe('ok');
  });

  it.each([
    ['no plist element', '<dict></dict>'],
    ['an unclosed dict', wrap('<dict><key>A</key><string>a</string>')],
    ['a value without a key', wrap('<dict><string>a</string></dict>')],
    ['an unknown element', wrap('<set/>')],
    ['a bad integer', wrap('<integer>12a</integer>')],
    ['a missing closing tag', '<plist version="1.0"><string>a</string>'],
    ['an unclosed comment', wrap('<dict><!-- note</dict>')],
    ['an unclosed DOCTYPE', '<!DOCTYPE plist <plist><dict/></plist'],
    ['an unclosed tag', wrap('<dict><key')],
  ])('rejects %s', (_, text) => {
    expect(() => parsePlist(text)).toThrow(PlistError);
  });

  it('repeats at most a short piece of the file in an error', () => {
    const long = 'x'.repeat(1_000_000);
    const messageOf = (text: string) => {
      try {
        parsePlist(text);
      } catch (error) {
        return (error as Error).message;
      }
      throw new Error('parsed');
    };
    expect(messageOf(wrap('<integer>12a</integer>'))).toBe('Not an integer: 12a');
    expect(messageOf(wrap(`<integer>${long}</integer>`))).toBe(
      `Not an integer: ${'x'.repeat(MAX_EXCERPT_LENGTH)}…`,
    );
    expect(messageOf(wrap(`<${long}/>`))).toBe(
      `Unknown element <${'x'.repeat(MAX_EXCERPT_LENGTH)}…/>.`,
    );
    expect(messageOf(wrap(`<string><${long}></string>`)).length).toBeLessThan(100);
  });

  it('cuts an excerpt between characters, not inside one', () => {
    const emoji = '😀'.repeat(MAX_EXCERPT_LENGTH + 1);
    expect(excerpt(emoji)).toBe(`${'😀'.repeat(MAX_EXCERPT_LENGTH)}…`);
    expect(excerpt('😀'.repeat(MAX_EXCERPT_LENGTH))).toBe('😀'.repeat(MAX_EXCERPT_LENGTH));
  });

  it('reads nesting up to the limit and rejects deeper nesting', () => {
    const nest = (depth: number) => wrap(`${'<array>'.repeat(depth)}${'</array>'.repeat(depth)}`);
    expect(() => parsePlist(nest(MAX_PLIST_DEPTH))).not.toThrow();
    expect(() => parsePlist(nest(MAX_PLIST_DEPTH + 1))).toThrow(/nests more than/);
    // Without the limit this is a stack overflow rather than a PlistError.
    expect(() => parsePlist(nest(200_000))).toThrow(PlistError);
  });

  it('keeps a __proto__ key as a key', () => {
    const { value } = parsePlist(
      wrap('<dict><key>__proto__</key><dict><key>polluted</key><true/></dict></dict>'),
    );
    if (!isDict(value)) throw new Error('not a dict');
    expect(Object.keys(value)).toEqual(['__proto__']);
    expect(Object.getPrototypeOf(value)).toBeNull();
    expect((value as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('keeps a "<" that starts no markup in the text', () => {
    expect(parsePlist(wrap('<string>a < b</string>')).value).toBe('a < b');
  });

  // The audit's 1 MB files took 40 s each with the regex tokenizer.
  it.each([
    ['<a', '<a'],
    ['<!--', '<!--'],
    ['<!DOCTYPE', '<!DOCTYPE'],
    ['<?', '<?'],
    ['<![CDATA[', '<![CDATA['],
  ])('reads a megabyte of unclosed %s in linear time', (_, unit) => {
    const text = `<plist><dict>${unit.repeat(Math.ceil(1_100_000 / unit.length))}</dict></plist>`;
    const started = performance.now();
    expect(() => parsePlist(text)).toThrow(PlistError);
    expect(performance.now() - started).toBeLessThan(1000);
  });
});

describe('parsePlist (binary)', () => {
  it('reads the same values as the XML file plutil converted', () => {
    expect(parsePlist(data('types.binary.plist')).value).toEqual(
      parsePlist(data('types.xml.plist')).value,
    );
    expect(parsePlist(data('Info.binary.plist')).value).toEqual(
      parsePlist(data('Info.xml.plist')).value,
    );
  });

  it('has no key lines', () => {
    expect(parsePlist(data('Info.binary.plist')).keyLines.size).toBe(0);
  });

  it('rejects a truncated file', () => {
    const bytes = data('Info.binary.plist');
    expect(() => parsePlist(bytes.subarray(0, 20))).toThrow(PlistError);
  });

  it('rejects an offset table that points past the end', () => {
    const bytes = Uint8Array.from(data('Info.binary.plist'));
    const view = new DataView(bytes.buffer);
    view.setBigUint64(bytes.length - 8, BigInt(bytes.length));
    expect(() => parsePlist(bytes)).toThrow(PlistError);
  });

  it('rejects an object count larger than the file', () => {
    const bytes = Uint8Array.from(data('Info.binary.plist'));
    const view = new DataView(bytes.buffer);
    view.setBigUint64(bytes.length - 24, 2n ** 40n);
    expect(() => parsePlist(bytes)).toThrow(PlistError);
  });

  it('reads shared references within the value budget', () => {
    const { value } = parsePlist(sharedReferencePlist(2, 100));
    if (!isDict(value)) throw new Error('not a dict');
    const outer = value.k as boolean[][];
    expect(outer).toHaveLength(100);
    expect(outer.every((inner) => inner.length === 100 && inner.every(Boolean))).toBe(true);
  });

  it('stops a shared-reference amplification at the value budget, quickly', () => {
    // The audit's 1.7 KB file: 200^4 values without a budget; it ran out of memory after 25 s.
    const bytes = sharedReferencePlist(4, 200);
    expect(bytes.length).toBeLessThan(2000);
    const started = performance.now();
    expect(() => parsePlist(bytes)).toThrow(
      new PlistError(`Binary plist has more than ${MAX_BINARY_PLIST_VALUES} values.`),
    );
    expect(performance.now() - started).toBeLessThan(1000);
  });

  it('shares a string that many references name', () => {
    const text = 'x'.repeat(5000);
    const bytes = binaryPlist([
      { dict: [[1, 2]] },
      { ascii: 'k' },
      { array: Array.from({ length: 1000 }, () => 3) },
      { ascii: text },
    ]);
    const { value } = parsePlist(bytes);
    if (!isDict(value)) throw new Error('not a dict');
    expect(value.k).toEqual(Array.from({ length: 1000 }, () => text));
  });

  it('decodes a large string once when many references share its offset', () => {
    // 10,000 references, each its own entry in the offset table, all at one 1 MB string. Keyed by
    // reference, the cache decoded the string 10,000 times (10 GB).
    const references = 10_000;
    const bytes = sharedOffsetPlist(references, 1_000_000);
    const decode = vi.spyOn(TextDecoder.prototype, 'decode');
    try {
      const { value } = parsePlist(bytes);
      expect(Array.isArray(value) && value.length).toBe(references);
      const decoded = decode.mock.calls.reduce((sum, [input]) => sum + (input?.byteLength ?? 0), 0);
      expect(decoded / bytes.length).toBeLessThanOrEqual(1);
    } finally {
      decode.mockRestore();
    }
  });

  it('stops overlapping strings at the decoded-bytes budget', () => {
    // Every byte of a run is a 14-byte string marker, and each offset names the next byte: the
    // strings overlap and together decode 14 times the run.
    const run = 20_000;
    const bytes = overlappingStringsPlist(run);
    expect(() => parsePlist(bytes)).toThrow(
      new PlistError('Binary plist decodes to more bytes than the file holds.'),
    );
  });

  it('keeps a __proto__ key as a key', () => {
    const bytes = binaryPlist([
      { dict: [[1, 2]] },
      { ascii: '__proto__' },
      { dict: [[3, 4]] },
      { ascii: 'polluted' },
      { true: true },
    ]);
    const { value } = parsePlist(bytes);
    if (!isDict(value)) throw new Error('not a dict');
    expect(Object.keys(value)).toEqual(['__proto__']);
    expect((value as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('rejects nesting deeper than the limit', () => {
    const depth = MAX_PLIST_DEPTH + 1;
    const objects: BinaryObject[] = [{ dict: [[1, 2]] }, { ascii: 'k' }];
    for (let level = 0; level < depth; level++) objects.push({ array: [3 + level] });
    objects.push({ true: true });
    expect(() => parsePlist(binaryPlist(objects))).toThrow(/nests more than/);
  });
});

describe('isDict', () => {
  it.each([
    [{}, true],
    [[], false],
    ['a', false],
    [new Date(0), false],
    [new Uint8Array(), false],
    [undefined, false],
  ])('%o is %s', (value, expected) => {
    expect(isDict(value)).toBe(expected);
  });
});
