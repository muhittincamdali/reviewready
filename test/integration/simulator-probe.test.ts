// The probe app scripts/simulator-check.sh runs on an iOS simulator. These tests pin what
// reviewready says about it, next to what the simulator showed (docs/media/simulator).
import { readFileSync } from 'node:fs';
import { describe, expect, it } from 'vitest';
import type { Report } from '../../src/model.js';
import { reviewready } from '../helpers/cli.js';

const PROBE = 'test/simulator/contacts-probe';
const recorded = (variant: string) =>
  readFileSync(
    new URL(`../../docs/media/simulator/contacts-probe-${variant}-27.0.txt`, import.meta.url),
    'utf8',
  );

describe('the contacts probe', () => {
  it('has the two findings the simulator run shows', async () => {
    const report = JSON.parse((await reviewready([PROBE, '--json'])).stdout) as Report;
    expect(report.findings.map((item) => `${item.rule} ${item.message}`)).toEqual([
      'RVW101 CNContactStore (Probe/ProbeApp.swift:15) needs NSContactsUsageDescription (contacts); Probe has none.',
      'RVW702 Probe/PrivacyInfo.xcprivacy is not in the Copy Bundle Resources of Probe or in a folder it syncs, so the app ships without it.',
    ]);
  });

  it('matches the recorded simulator runs', () => {
    expect(recorded('missing')).toContain('running 5 seconds after launch: no');
    expect(recorded('missing')).toContain('must contain an NSContactsUsageDescription key');
    expect(recorded('missing')).toContain('PrivacyInfo.xcprivacy: not in the app');
    expect(recorded('fixed')).toContain('running 5 seconds after launch: yes');
    expect(recorded('fixed')).toContain('PrivacyInfo.xcprivacy: in the app');
  });
});
