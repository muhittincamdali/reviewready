import { describe, expect, it } from 'vitest';
import { blankCommentsAndStrings } from '../../src/collect/blank.js';

const visible = (text: string) => text.replace(/ +/g, ' ').trim();

describe('blankCommentsAndStrings', () => {
  it('keeps the length and the line breaks of the file', () => {
    const text = 'let a = "x\\ny" // c\n/* b\n */ let b = 1';
    const code = blankCommentsAndStrings(text, 'swift');
    expect(code).toHaveLength(text.length);
    expect(code.split('\n')).toHaveLength(text.split('\n').length);
  });

  it('blanks Swift strings, raw and multi-line strings and nested comments', () => {
    const text = 'a("x") b(#"y"z"#) c("""\nq\n""") /* 1 /* 2 */ 3 */ d';
    const code = blankCommentsAndStrings(text, 'swift');
    expect(code).not.toMatch(/[xyzq123]/);
    expect(code.replace(/\s+/g, '')).toBe('a("")b(#""#)c("""""")d');
  });

  it('blanks Objective-C strings and characters but does not nest comments', () => {
    const text = `x(@"s", 'c') /* a /* b */ y`;
    expect(visible(blankCommentsAndStrings(text, 'objc'))).toBe(`x(@" ", ' ') y`);
  });

  it('blanks JavaScript strings, including template literals across lines', () => {
    const text = ['a(\'b\') c("d") e(`f\n', '$', '{g}`) // h'].join('');
    const code = blankCommentsAndStrings(text, 'js');
    expect(code).not.toMatch(/[bdfgh]/);
    expect(code).toContain('a(');
  });

  it('blanks Dart strings, triple-quoted and raw strings, and keeps identifiers ending in r', () => {
    const text = "a('b') c(r'd\\') e('''f\n''') bar('g')";
    const code = blankCommentsAndStrings(text, 'dart');
    expect(code).not.toMatch(/[bdfg](?!a)/);
    expect(code).toContain('bar(');
  });

  it('stops a single-line string at the end of the line', () => {
    const code = blankCommentsAndStrings('a = "open\nb = 1', 'swift');
    expect(code.split('\n')[1]).toBe('b = 1');
  });
});
