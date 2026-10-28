// Runs every check on a collected project.
import type { AppModel } from '../collect/app.js';
import { checkAccountDeletion, checkLoginServices } from './accounts.js';
import type { RuleId } from './data.js';
import { checkExportCompliance } from './encryption.js';
import type { CheckResult, Hit } from './hit.js';
import { checkAppIcon } from './icon.js';
import { checkPrivacyManifest } from './privacy.js';
import { checkPurposeStrings } from './purpose.js';
import { checkDeploymentTarget, checkXcodeVersion } from './toolchain.js';

/**
 * The rules that read the app's source files. When some source files were not read, these rules
 * did not see all of the app's code, so a rule without a finding is not checked rather than passed.
 */
export const SOURCE_RULES: ReadonlySet<RuleId> = new Set(['RVW101', 'RVW301', 'RVW401']);

export interface CheckOutcome {
  hits: Hit[];
  checked: Set<RuleId>;
  /** What the checks could not read, for the report notes. */
  notes: string[];
}

export async function checkApp(app: AppModel): Promise<CheckOutcome> {
  const notes: string[] = [];
  const results: CheckResult[] = [
    checkPurposeStrings(app),
    checkExportCompliance(app),
    checkAccountDeletion(app),
    checkLoginServices(app),
    await checkAppIcon(app, notes),
    checkXcodeVersion(app, notes),
    checkDeploymentTarget(app),
    checkPrivacyManifest(app),
  ];
  return {
    hits: results.flatMap((result) => result.hits),
    checked: new Set(
      results
        .flatMap((result) => result.checked)
        .filter((rule) => !(app.sourcesIncomplete && SOURCE_RULES.has(rule))),
    ),
    notes,
  };
}
