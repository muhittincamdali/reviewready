// JSON files of the checked project: package.json, package-lock.json, app.json and the Flutter pins.
// JSON.parse has no limit on nesting, and a 31 MB app.json of nested arrays took about 4 GB of
// memory to parse. Real project files nest a few levels, so the text is measured first, in one
// pass without building anything, and parsed only when it nests at most MAX_JSON_DEPTH levels.

/** How deep arrays and objects may nest; the same limit as for property lists. */
export const MAX_JSON_DEPTH = 64;

export class JsonDepthError extends Error {
  override name = 'JsonDepthError';
  constructor() {
    super(`nests more than ${MAX_JSON_DEPTH} levels`);
  }
}

const QUOTE = 0x22;
const BACKSLASH = 0x5c;
const OPENERS = new Set([0x5b, 0x7b]);
const CLOSERS = new Set([0x5d, 0x7d]);

/** Whether `text` opens more than `max` arrays or objects inside each other; strings are skipped. */
export function nestsDeeperThan(text: string, max: number): boolean {
  let depth = 0;
  let inString = false;
  for (let index = 0; index < text.length; index++) {
    const code = text.charCodeAt(index);
    if (inString) {
      if (code === BACKSLASH) index++;
      else if (code === QUOTE) inString = false;
    } else if (code === QUOTE) {
      inString = true;
    } else if (OPENERS.has(code)) {
      if (++depth > max) return true;
    } else if (CLOSERS.has(code)) {
      depth--;
    }
  }
  return false;
}

/** JSON.parse for project files: throws JsonDepthError past MAX_JSON_DEPTH, SyntaxError otherwise. */
export function parseJson(text: string): unknown {
  if (nestsDeeperThan(text, MAX_JSON_DEPTH)) throw new JsonDepthError();
  return JSON.parse(text) as unknown;
}
