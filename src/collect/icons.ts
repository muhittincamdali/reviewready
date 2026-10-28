// Finds a target's app icon: the .appiconset of its asset catalog, or an Icon Composer .icon file,
// and reads the App Store (1024 × 1024) image of the icon set.
import { join } from 'node:path';
import { NOT_READ, readProjectFile } from '../core/files.js';
import { parseJson } from '../core/json.js';
import { record } from '../detect/packages.js';
import { findNamed } from './find.js';
import { type PngInfo, readPng } from './png.js';

export interface AppStoreImage {
  /** The PNG file the icon set names for the App Store icon; null when no file is assigned. */
  file: string | null;
  png: PngInfo | null;
  /** Why the image could not be read, for the report notes. */
  problem: string | null;
}

export interface AppIcon {
  /** The icon set or .icon file found, or null when there is none with the target's icon name. */
  path: string | null;
  kind: 'icon-set' | 'icon-composer' | null;
  /** The App Store image of an icon set; null for an Icon Composer file or a missing icon. */
  appStore: AppStoreImage | null;
}

/**
 * The image entry Xcode uses for the App Store: `ios-marketing` in an icon set with all sizes, or
 * the single-size `universal` iOS image without an appearance (dark and tinted variants are not
 * the App Store icon).
 */
function appStoreEntry(contents: Record<string, unknown>): Record<string, unknown> | null {
  const images = Array.isArray(contents.images) ? contents.images.map(record) : [];
  const isLarge = (image: Record<string, unknown>) => image.size === '1024x1024';
  return (
    images.find((image) => image.idiom === 'ios-marketing' && isLarge(image)) ??
    images.find(
      (image) =>
        image.idiom === 'universal' &&
        (image.platform === 'ios' || image.platform === undefined) &&
        isLarge(image) &&
        image.appearances === undefined,
    ) ??
    null
  );
}

async function readAppStoreImage(set: string, root: string): Promise<AppStoreImage> {
  const contents = await readProjectFile(join(set, 'Contents.json'), root);
  if (!contents.found) {
    return { file: null, png: null, problem: `Contents.json ${NOT_READ[contents.reason]}` };
  }
  let entry: Record<string, unknown> | null;
  try {
    entry = appStoreEntry(record(parseJson(contents.bytes.toString('utf8'))));
  } catch {
    return { file: null, png: null, problem: 'Contents.json is not valid JSON.' };
  }
  const name = typeof entry?.filename === 'string' ? entry.filename : null;
  if (name === null || name.includes('/')) return { file: null, png: null, problem: null };
  const file = join(set, name);
  const image = await readProjectFile(file, root);
  if (!image.found) return { file, png: null, problem: `${name} ${NOT_READ[image.reason]}` };
  try {
    return { file, png: readPng(image.bytes), problem: null };
  } catch (error) {
    return { file, png: null, problem: `${name} ${(error as Error).message}.` };
  }
}

/**
 * The icon called `name` (ASSETCATALOG_COMPILER_APPICON_NAME, AppIcon by default) under the iOS
 * folder. An Icon Composer `<name>.icon` file is reported as found but not read: Xcode renders its
 * images from the layers when it builds the app, so there is no App Store PNG to check.
 */
export async function findAppIcon(iosDir: string, name: string, root: string): Promise<AppIcon> {
  const composer = (await findNamed(iosDir, `${name}.icon`, 'folder'))[0];
  if (composer) return { path: composer, kind: 'icon-composer', appStore: null };
  const catalogs = await findNamed(iosDir, `${name}.appiconset`, 'folder');
  const set = catalogs.find((path) => /\.xcassets(\/|\\)/.test(path));
  if (!set) return { path: null, kind: null, appStore: null };
  return { path: set, kind: 'icon-set', appStore: await readAppStoreImage(set, root) };
}

/** Reads an image file named in an Expo config, for its size. */
export async function readIconFile(file: string, root: string): Promise<AppStoreImage> {
  const image = await readProjectFile(file, root);
  if (!image.found) return { file, png: null, problem: NOT_READ[image.reason] };
  try {
    return { file, png: readPng(image.bytes), problem: null };
  } catch (error) {
    return { file, png: null, problem: `${(error as Error).message}.` };
  }
}
