// RVW701 (no privacy manifest) and RVW702 (a privacy manifest that is not in the app). Only whether
// the app has one is checked; what it declares is left to tools that read it in depth.
import { type AppModel, shownPath } from '../collect/app.js';
import type { RuleId } from './data.js';
import type { CheckResult, Hit } from './hit.js';

const REACT_NATIVE: ReadonlySet<string> = new Set(['react-native', 'expo']);

export function checkPrivacyManifest(app: AppModel): CheckResult {
  const hits: Hit[] = [];
  const stray = app.strayPrivacyManifests;
  for (const target of app.targets) {
    if (target.appClip) continue;
    if (target.configFile !== null) {
      if (app.expo?.hasPrivacyManifests) continue;
      hits.push({
        rule: 'RVW701',
        file: target.configFile,
        line: null,
        variant: 'expo-config',
        target: target.name,
        message:
          'app.json has no ios.privacyManifests, so prebuild writes no privacy manifest for the app.',
      });
      continue;
    }
    if (target.privacyManifests.length > 0) continue;
    const file = stray[0];
    if (file) {
      hits.push({
        rule: 'RVW702',
        file,
        line: null,
        variant: 'info-plist',
        target: target.name,
        message: `${shownPath(file, app.project.root)} is not in the Copy Bundle Resources of ${target.name} or in a folder it syncs, so the app ships without it.${REACT_NATIVE.has(app.project.ecosystem) ? " React Native's pod install adds it to the target (privacy manifest aggregation); commit the project file it changes." : ''}`,
      });
      continue;
    }
    hits.push({
      rule: 'RVW701',
      file: `${target.xcodeProject}/project.pbxproj`,
      line: null,
      variant: 'info-plist',
      target: target.name,
      message: `${target.name} has no PrivacyInfo.xcprivacy in its resources.`,
    });
  }
  const checked: RuleId[] = app.targets.length > 0 ? ['RVW701', 'RVW702'] : [];
  return { hits, checked };
}
