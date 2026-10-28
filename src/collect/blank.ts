// Blanking of comments and string literals, so that the rules' patterns never match inside them
// while offsets and line numbers stay those of the file. Swift, Objective-C, JavaScript/TypeScript
// and Dart all use // and /* */ comments; their string literals differ.
import type { Language } from './sources.js';

/** Index just past the closing `quote` of a literal whose content starts at `from`. */
function literalEnd(text: string, from: number, quote: string, escapes: boolean): number {
  const multiline = quote.length > 1;
  let position = from;
  while (position < text.length) {
    if (escapes && text[position] === '\\') position += 2;
    else if (text.startsWith(quote, position)) return position;
    else if (!multiline && quote !== '`' && text[position] === '\n') return position;
    else position++;
  }
  return text.length;
}

/** The literal that starts at `index`, as [quote, content start, escapes], or null. */
function literalAt(
  text: string,
  index: number,
  language: Language,
): { quote: string; start: number; escapes: boolean } | null {
  const char = text[index];
  if (language === 'swift') {
    if (char !== '"' && !(char === '#' && /^#+"/.test(text.slice(index, index + 8)))) return null;
    let hashes = 0;
    while (text[index + hashes] === '#') hashes++;
    const open = index + hashes;
    const quote = text.startsWith('"""', open) ? '"""' : '"';
    return { quote: `${quote}${'#'.repeat(hashes)}`, start: open + quote.length, escapes: !hashes };
  }
  if (language === 'objc') {
    return char === '"' || char === "'" ? { quote: char, start: index + 1, escapes: true } : null;
  }
  if (language === 'js') {
    return char === '"' || char === "'" || char === '`'
      ? { quote: char, start: index + 1, escapes: true }
      : null;
  }
  // Dart: '…', "…", '''…''', """…""" and raw strings r'…' without escapes.
  const raw = char === 'r' && (text[index + 1] === '"' || text[index + 1] === "'");
  if (raw && /\w/.test(text[index - 1] ?? '')) return null;
  const open = raw ? index + 1 : index;
  const quoteChar = text[open];
  if (quoteChar !== '"' && quoteChar !== "'") return null;
  const quote = text.startsWith(quoteChar.repeat(3), open) ? quoteChar.repeat(3) : quoteChar;
  return { quote, start: open + quote.length, escapes: !raw };
}

/**
 * Replaces comments and the contents of string literals with spaces, keeping newlines and quote
 * characters, so offsets and line numbers stay the same.
 */
export function blankCommentsAndStrings(text: string, language: Language): string {
  const out = text.split('');
  const blank = (from: number, to: number) => {
    for (let index = from; index < to; index++) if (out[index] !== '\n') out[index] = ' ';
  };
  let index = 0;
  while (index < text.length) {
    if (text.startsWith('//', index)) {
      const end = text.indexOf('\n', index);
      const stop = end === -1 ? text.length : end;
      blank(index, stop);
      index = stop;
      continue;
    }
    if (text.startsWith('/*', index)) {
      // Swift and Dart block comments nest; Objective-C and JavaScript ones do not.
      const nests = language === 'swift' || language === 'dart';
      let depth = 1;
      let position = index + 2;
      while (position < text.length && depth > 0) {
        if (text.startsWith('*/', position)) {
          depth--;
          position += 2;
        } else if (nests && text.startsWith('/*', position)) {
          depth++;
          position += 2;
        } else position++;
      }
      blank(index, position);
      index = position;
      continue;
    }
    const literal = literalAt(text, index, language);
    if (!literal) {
      index++;
      continue;
    }
    const end = literalEnd(text, literal.start, literal.quote, literal.escapes);
    blank(literal.start, end);
    index = end + (text.startsWith(literal.quote, end) ? literal.quote.length : 0);
  }
  return out.join('');
}
