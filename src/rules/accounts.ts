// RVW301 (account creation without deletion) and RVW401 (third-party login without Sign in with
// Apple). Both read what the app's code calls and what its strings say, and the packages it ships:
// heuristics, which the findings say.
import { join } from 'node:path';
import { type AppModel, shownPath } from '../collect/app.js';
import type { SourceFile } from '../collect/sources.js';
import { RULE_DATA, type RuleId } from './data.js';
import { type CheckResult, firstMatch, type Hit } from './hit.js';

const { accounts, login } = RULE_DATA;
const CREATION = accounts.creation.map((item) => ({ ...item, regex: new RegExp(item.pattern) }));
const DELETION = accounts.deletion.map((item) => ({ ...item, regex: new RegExp(item.pattern) }));
const CREATION_TEXT = new RegExp(accounts.creationText);
const DELETION_TEXT = new RegExp(accounts.deletionText);
const APPLE_NATIVE = new RegExp(login.apple.native);
const APPLE_TEXT = new RegExp(login.apple.text);

const isCode = (file: SourceFile) => file.language !== 'strings';

interface Place {
  file: string;
  line: number | null;
  what: string;
}

function accountCreation(app: AppModel): Place | null {
  const code = app.sources.filter(isCode);
  for (const item of CREATION) {
    const found = firstMatch(code, item.regex);
    if (found) return { file: found.file.path, line: found.line, what: item.label };
  }
  // Words on screen: in string literals of the code, or in the strings files.
  const found = firstMatch(app.sources, CREATION_TEXT, 'text');
  return found ? { file: found.file.path, line: found.line, what: `the text ${found.text}` } : null;
}

function accountDeletion(app: AppModel): boolean {
  const code = app.sources.filter(isCode);
  if (DELETION.some((item) => firstMatch(code, item.regex))) return true;
  return firstMatch(app.sources, DELETION_TEXT, 'text') !== null;
}

export function checkAccountDeletion(app: AppModel): CheckResult {
  const checked: RuleId[] = app.sources.length > 0 ? ['RVW301'] : [];
  const creation = accountCreation(app);
  if (!creation || accountDeletion(app)) return { hits: [], checked };
  const where = `${shownPath(creation.file, app.project.root)}${creation.line ? `:${creation.line}` : ''}`;
  const hit: Hit = {
    rule: 'RVW301',
    file: creation.file,
    line: creation.line,
    variant: 'code',
    message: `Accounts are created (${creation.what} in ${where}), and no account deletion call or "Delete account" text was found in the app's code or strings.`,
  };
  return { hits: [hit], checked };
}

/** The manifest that lists the app's packages: pubspec.yaml or package.json. */
function manifestPlace(app: AppModel, name: string): Place {
  const file = join(
    app.project.root,
    app.project.ecosystem === 'flutter' ? 'pubspec.yaml' : 'package.json',
  );
  return { file, line: null, what: `the ${name} package` };
}

function thirdPartyLogin(app: AppModel): { label: string; place: Place } | null {
  const { ecosystem, dependencies } = app.project;
  const native = app.sources.filter(
    (file) => file.language === 'swift' || file.language === 'objc',
  );
  const javascript = app.sources.filter((file) => file.language === 'js');
  for (const service of login.thirdParty) {
    const packages = ecosystem === 'flutter' ? service.flutter : service.npm;
    const installed = packages.find((name) => dependencies.has(name));
    if (installed) return { label: service.label, place: manifestPlace(app, installed) };
    if (service.native) {
      const found = firstMatch(native, new RegExp(service.native));
      if (found) {
        return {
          label: service.label,
          place: { file: found.file.path, line: found.line, what: found.text },
        };
      }
    }
    for (const module of service.imports) {
      const quoted = new RegExp(`['"]${module.replace(/[/.-]/g, '\\$&')}['"]`);
      const found = firstMatch(javascript, quoted, 'text');
      if (found) {
        return {
          label: service.label,
          place: { file: found.file.path, line: found.line, what: `an import of ${module}` },
        };
      }
    }
  }
  return null;
}

function signInWithApple(app: AppModel): boolean {
  const { ecosystem, dependencies } = app.project;
  const packages = ecosystem === 'flutter' ? login.apple.flutter : login.apple.npm;
  if (packages.some((name) => dependencies.has(name))) return true;
  if (app.targets.some((target) => target.entitlements.has(login.apple.entitlement))) return true;
  const code = app.sources.filter(isCode);
  return firstMatch(code, APPLE_NATIVE) !== null || firstMatch(code, APPLE_TEXT, 'text') !== null;
}

export function checkLoginServices(app: AppModel): CheckResult {
  const checked: RuleId[] = ['RVW401'];
  const found = thirdPartyLogin(app);
  if (!found || signInWithApple(app)) return { hits: [], checked };
  const { place } = found;
  const where = shownPath(place.file, app.project.root);
  const hit: Hit = {
    rule: 'RVW401',
    file: place.file,
    line: place.line,
    variant: 'code',
    message: `${found.label} is used (${place.what} in ${where}${place.line ? `:${place.line}` : ''}), and no Sign in with Apple was found: no package, entitlement or AuthenticationServices call.`,
  };
  return { hits: [hit], checked };
}
