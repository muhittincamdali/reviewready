// Files from a pull request can be written to make a pattern slow. Each case scans a project whose
// file repeats the start of a pattern a million characters long; the limit leaves room for a slow
// CI runner.
import { describe, expect, it } from 'vitest';
import { scan } from '../../src/scan.js';
import { expoApp, nativeApp } from '../helpers/projects.js';

const SIZE = 1_000_000;
const LIMIT_MS = 3_000;
const repeat = (unit: string) => unit.repeat(Math.ceil(SIZE / unit.length));

async function timed(root: string): Promise<number> {
  const started = performance.now();
  await scan(root);
  return performance.now() - started;
}

describe('rules on hostile files', () => {
  it.each([
    ['photo library calls without a parenthesis', repeat('PHPhotoLibrary . requestAuthorization ')],
    [
      'camera requests that never name the media type',
      repeat('AVCaptureDevice.requestAccess(for: '),
    ],
    [
      'speech and tracking requests split over spaces',
      repeat('SFSpeechRecognizer   ATTrackingManager   '),
    ],
    [
      'account calls that never open',
      repeat('createUser ( withEmail auth . signUp user ?. delete '),
    ],
    ['sign-up texts that never close', repeat('"Create your account')],
    ['deletion words without an account', repeat('delete-my-your-the-')],
  ])('%s', async (_, text) => {
    expect(await timed(nativeApp({ files: { 'App/Hostile.swift': text } }))).toBeLessThan(LIMIT_MS);
  });

  it('a CI file of Xcode paths that never end in .app', async () => {
    const root = nativeApp({
      files: { '.github/workflows/ci.yml': repeat('/Applications/Xcode_1.') },
    });
    expect(await timed(root)).toBeLessThan(LIMIT_MS);
  });

  it('a purpose string of placeholder-like words', async () => {
    const value = repeat('lorem      ');
    const root = expoApp({ ios: { infoPlist: { NSCameraUsageDescription: value } } });
    expect(await timed(root)).toBeLessThan(LIMIT_MS);
  });

  it('a Podfile of unclosed setup_permissions lists', async () => {
    const root = nativeApp({ files: { Podfile: repeat("setup_permissions(['Camera', ") } });
    expect(await timed(root)).toBeLessThan(LIMIT_MS);
  });
});
