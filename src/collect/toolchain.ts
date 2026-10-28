// Finds the Xcode versions a project's build files pin: .xcode-version, GitHub Actions workflows,
// EAS Build profiles, Codemagic, Bitrise, CircleCI and fastlane. They tell which SDK the App Store
// build is made with, which App Store Connect checks on upload.
import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { readProjectText } from '../core/files.js';
import { parseJson } from '../core/json.js';
import { record } from '../detect/packages.js';

export interface XcodePin {
  /** The version as written, e.g. "16.4" or "26.0.1". */
  version: string;
  file: string;
  line: number | null;
  /** What pins it, for the report: "setup-xcode", "Xcode app path", "EAS image", … */
  via: string;
}

/** Patterns over one line of a CI file; group 1 is the version. */
const LINE_PATTERNS: readonly { via: string; pattern: RegExp }[] = [
  { via: 'xcode-version input', pattern: /\bxcode-version:\s*['"]?(\d+(?:\.\d+){0,2})\b/ },
  {
    via: 'Xcode app path',
    pattern: /\/Applications\/Xcode[_-](\d+(?:\.\d+){0,2})[\w.-]{0,40}\.app\b/,
  },
  { via: 'xcode key', pattern: /^\s*xcode:\s*['"]?(\d+(?:\.\d+){0,2})\b/ },
  { via: 'Bitrise stack', pattern: /\bstack:\s*['"]?(?:osx-)?xcode-(\d+(?:\.\d+){0,2})/ },
  {
    via: 'fastlane action',
    pattern:
      /\b(?:xcversion|xcodes|ensure_xcode_version)\s*\(?\s*version:\s*['"]~?>?\s*(\d+(?:\.\d+){0,2})/,
  },
];

const CI_FILES = [
  'codemagic.yaml',
  'codemagic.yml',
  'bitrise.yml',
  'bitrise.yaml',
  '.circleci/config.yml',
  '.circleci/config.yaml',
  'fastlane/Fastfile',
  'ios/fastlane/Fastfile',
];

function pinsInText(text: string, file: string): XcodePin[] {
  const pins: XcodePin[] = [];
  text.split('\n').forEach((line, index) => {
    if (/^\s*#/.test(line)) return;
    for (const { via, pattern } of LINE_PATTERNS) {
      const version = pattern.exec(line)?.[1];
      if (version) pins.push({ version, file, line: index + 1, via });
    }
  });
  return pins;
}

/** The `ios.image` of each EAS Build profile, when it names an Xcode version. */
function easPins(text: string, file: string): XcodePin[] {
  let builds: Record<string, unknown>;
  try {
    builds = record(record(parseJson(text)).build);
  } catch {
    return [];
  }
  const pins: XcodePin[] = [];
  for (const profile of Object.values(builds)) {
    const image = record(record(profile).ios).image;
    if (typeof image !== 'string') continue;
    const version = /xcode-(\d+(?:\.\d+){0,2})/.exec(image)?.[1];
    if (!version) continue;
    const index = text.indexOf(image);
    const line = index === -1 ? null : text.slice(0, index).split('\n').length;
    pins.push({ version, file, line, via: 'EAS image' });
  }
  return pins;
}

/** Every Xcode version the build files under `root` pin, in file order. */
export async function xcodePins(
  root: string,
  xcodeVersionFile: string | null,
): Promise<XcodePin[]> {
  const pins: XcodePin[] = [];
  if (xcodeVersionFile) {
    pins.push({
      version: xcodeVersionFile,
      file: join(root, '.xcode-version'),
      line: 1,
      via: '.xcode-version',
    });
  }
  const workflows = join(root, '.github', 'workflows');
  const entries = await readdir(workflows, { withFileTypes: true }).catch(() => []);
  const files = entries
    .filter((entry) => entry.isFile() && /\.ya?ml$/.test(entry.name))
    .map((entry) => join(workflows, entry.name))
    .sort();
  for (const file of [...files, ...CI_FILES.map((name) => join(root, name))]) {
    const text = await readProjectText(file, root);
    if (text !== null) pins.push(...pinsInText(text, file));
  }
  const eas = await readProjectText(join(root, 'eas.json'), root);
  if (eas !== null) pins.push(...easPins(eas, join(root, 'eas.json')));
  return pins;
}
