// RVW601 (Xcode older than App Store Connect accepts) and RVW602 (deployment target below the
// minimum), against the requirements in force on the rule data's date.
import { shownPath, type AppModel } from '../collect/app.js';
import { compareVersions, majorOf } from '../core/versions.js';
import { RULE_DATA, type RuleId } from './data.js';
import type { CheckResult, Hit } from './hit.js';

const { xcode, deploymentTarget } = RULE_DATA.requirements;

const MONTHS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

/** "2026-04-28" as "28 April 2026". */
export function longDate(iso: string): string {
  const [year, month, day] = iso.split('-').map(Number);
  return `${day} ${MONTHS[(month ?? 1) - 1]} ${year}`;
}

export function checkXcodeVersion(app: AppModel, notes: string[]): CheckResult {
  const minimum = Number(xcode.minimum);
  const hits: Hit[] = [];
  for (const pin of app.xcodePins) {
    const major = majorOf(pin.version);
    if (major === null || major >= minimum) continue;
    hits.push({
      rule: 'RVW601',
      file: pin.file,
      line: pin.line,
      variant: 'ci',
      message: `${shownPath(pin.file, app.project.root)} pins Xcode ${pin.version} (${pin.via}); App Store Connect accepts uploads built with Xcode ${xcode.minimum} or later since ${longDate(xcode.since)}.`,
    });
  }
  if (app.xcodePins.length === 0) {
    notes.push(
      `No build file pins an Xcode version, so the Xcode minimum was not checked: since ${longDate(xcode.since)}, App Store Connect accepts uploads built with Xcode ${xcode.minimum} or later.`,
    );
  }
  const checked: RuleId[] = app.xcodePins.length > 0 ? ['RVW601'] : [];
  return { hits, checked };
}

export function checkDeploymentTarget(app: AppModel): CheckResult {
  const hits: Hit[] = [];
  let known = 0;
  for (const target of app.targets) {
    const current = target.deploymentTarget;
    if (!current) continue;
    known += 1;
    if (compareVersions(current.version, deploymentTarget.minimum) >= 0) continue;
    hits.push({
      rule: 'RVW602',
      file: current.file,
      line: current.line,
      variant: target.configFile !== null ? 'expo-config' : 'info-plist',
      target: target.name,
      message: `${target.name} targets iOS ${current.version}; App Store Connect accepts iOS apps that target iOS ${deploymentTarget.minimum} or later since ${longDate(deploymentTarget.since)}.`,
    });
  }
  const checked: RuleId[] = known > 0 ? ['RVW602'] : [];
  return { hits, checked };
}
