// RVW201: export compliance. Without ITSAppUsesNonExemptEncryption, App Store Connect asks the
// export compliance questions for every uploaded build.
import type { AppModel } from '../collect/app.js';
import type { RuleId } from './data.js';
import { type CheckResult, type Hit, infoPlace } from './hit.js';

export const ENCRYPTION_KEY = 'ITSAppUsesNonExemptEncryption';

export function checkExportCompliance(app: AppModel): CheckResult {
  const hits: Hit[] = [];
  const targets = app.targets.filter((target) => !target.unreadInfoPlist);
  for (const target of targets) {
    if (target.info.has(ENCRYPTION_KEY)) continue;
    const place = infoPlace(target);
    const where =
      place.variant === 'expo-config'
        ? 'app.json sets neither ios.config.usesNonExemptEncryption nor ios.infoPlist.ITSAppUsesNonExemptEncryption'
        : `The Info.plist of ${target.name} has no ${ENCRYPTION_KEY}`;
    hits.push({
      rule: 'RVW201',
      file: place.file,
      line: null,
      variant: place.variant,
      target: target.name,
      message: `${where}, so App Store Connect asks the export compliance questions for every build.`,
    });
  }
  const checked: RuleId[] = targets.length > 0 ? ['RVW201'] : [];
  return { hits, checked };
}
