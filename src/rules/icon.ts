// RVW501 to RVW503: the App Store icon. Reads the 1024 × 1024 image of the target's icon set (or
// the Expo icon) and checks it is there, has the right size and has no alpha channel.
import { join, resolve } from 'node:path';
import { type AppModel, type AppTarget, shownPath } from '../collect/app.js';
import { type AppStoreImage, readIconFile } from '../collect/icons.js';
import { record } from '../detect/packages.js';
import type { FixVariant, RuleId } from './data.js';
import type { CheckResult, Hit } from './hit.js';

export const APP_STORE_ICON_SIZE = 1024;

function imageHits(
  image: AppStoreImage,
  target: AppTarget,
  variant: FixVariant,
  checkAlpha: boolean,
): Hit[] {
  const png = image.png;
  if (!png || !image.file) return [];
  const base = { file: image.file, line: null, variant, target: target.name };
  const hits: Hit[] = [];
  if (png.width !== APP_STORE_ICON_SIZE || png.height !== APP_STORE_ICON_SIZE) {
    hits.push({
      ...base,
      rule: 'RVW502',
      message: `The App Store icon is ${png.width} × ${png.height} pixels; it must be 1024 × 1024.`,
    });
  }
  if (checkAlpha && png.alpha) {
    const how =
      png.colorType === 4 || png.colorType === 6
        ? 'an alpha channel'
        : 'a transparent colour (tRNS)';
    hits.push({ ...base, rule: 'RVW503', message: `The App Store icon has ${how}.` });
  }
  return hits;
}

function nativeIconHits(app: AppModel, target: AppTarget, notes: string[]): Hit[] {
  const icon = target.icon;
  const pbxproj = `${target.xcodeProject}/project.pbxproj`;
  if (!icon || icon.kind === null) {
    return [
      {
        rule: 'RVW501',
        file: pbxproj,
        line: null,
        variant: 'info-plist',
        target: target.name,
        message: `${target.name} builds the icon ${target.iconName}, and there is no ${target.iconName}.appiconset in an asset catalog or ${target.iconName}.icon file in the iOS folder.`,
      },
    ];
  }
  if (icon.kind === 'icon-composer') return [];
  const image = icon.appStore;
  const set = shownPath(icon.path ?? '', app.project.root);
  if (!image) return [];
  if (image.problem) {
    notes.push(`${set}: ${image.problem} The App Store icon was not checked.`);
    return [];
  }
  if (!image.file) {
    return [
      {
        rule: 'RVW501',
        file: join(icon.path ?? '', 'Contents.json'),
        line: null,
        variant: 'info-plist',
        target: target.name,
        message: `${set} has no image in its 1024 × 1024 App Store slot.`,
      },
    ];
  }
  return imageHits(image, target, 'info-plist', true);
}

/** The light (default) icon of an Expo config: a path, or the `light` of an appearance object. */
function expoIconPath(icon: unknown): string | null {
  if (typeof icon === 'string') return icon;
  const variants = record(icon);
  const light = variants.light ?? variants.any;
  return typeof light === 'string' ? light : null;
}

async function expoIconHits(app: AppModel, target: AppTarget, notes: string[]): Promise<Hit[]> {
  const file = target.configFile ?? join(app.project.root, 'app.json');
  const path = expoIconPath(app.expo?.icon);
  if (path === null) {
    return [
      {
        rule: 'RVW501',
        file,
        line: null,
        variant: 'expo-config',
        target: target.name,
        message:
          'app.json sets neither expo.icon nor expo.ios.icon, so the app icon set prebuild writes has no image.',
      },
    ];
  }
  if (path.endsWith('.icon') || /^https?:/.test(path)) return [];
  const image = await readIconFile(resolve(app.project.root, path), app.project.root);
  if (image.problem) {
    notes.push(`The icon ${path} in app.json ${image.problem} The App Store icon was not checked.`);
    return [];
  }
  // Expo's prebuild removes the transparency of the icon it writes (withIosIcons), so only the
  // size is checked.
  return imageHits(image, target, 'expo-config', false);
}

export async function checkAppIcon(app: AppModel, notes: string[]): Promise<CheckResult> {
  const hits: Hit[] = [];
  for (const target of app.targets) {
    if (target.configFile !== null) hits.push(...(await expoIconHits(app, target, notes)));
    else hits.push(...nativeIconHits(app, target, notes));
  }
  const checked: RuleId[] = app.targets.length > 0 ? ['RVW501', 'RVW502', 'RVW503'] : [];
  return { hits, checked };
}
