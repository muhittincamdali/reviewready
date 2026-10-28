import { join } from 'node:path';
import { describe, expect, it } from 'vitest';
import { findAppIcon, readIconFile } from '../../src/collect/icons.js';
import { png } from '../helpers/png.js';
import { tree } from '../helpers/tree.js';

const contents = (images: object[]) => JSON.stringify({ images, info: { version: 1 } });
const SET = 'App/Assets.xcassets/AppIcon.appiconset';

describe('findAppIcon', () => {
  it('reads the single-size iOS image, not its dark and tinted variants', async () => {
    const root = tree({
      [`${SET}/Contents.json`]: contents([
        { idiom: 'universal', platform: 'ios', size: '1024x1024', filename: 'light.png' },
        {
          idiom: 'universal',
          platform: 'ios',
          size: '1024x1024',
          filename: 'dark.png',
          appearances: [{ appearance: 'luminosity', value: 'dark' }],
        },
      ]),
      [`${SET}/light.png`]: png(1024, 1024),
      [`${SET}/dark.png`]: png(1024, 1024, { alpha: true }),
    });
    const icon = await findAppIcon(root, 'AppIcon', root);
    expect(icon.kind).toBe('icon-set');
    expect(icon.appStore).toMatchObject({ file: join(root, SET, 'light.png'), problem: null });
    expect(icon.appStore?.png?.alpha).toBe(false);
  });

  it('reads the ios-marketing image of an icon set with every size', async () => {
    const root = tree({
      [`${SET}/Contents.json`]: contents([
        { idiom: 'iphone', size: '60x60', scale: '3x', filename: 'small.png' },
        { idiom: 'ios-marketing', size: '1024x1024', scale: '1x', filename: 'store.png' },
      ]),
      [`${SET}/store.png`]: png(1000, 1000),
    });
    const icon = await findAppIcon(root, 'AppIcon', root);
    expect(icon.appStore?.png).toMatchObject({ width: 1000, height: 1000 });
  });

  it('uses the icon name the target builds and finds nested catalogs', async () => {
    const root = tree({
      'App/Resources/Brand.xcassets/Beta.appiconset/Contents.json': contents([]),
      [`${SET}/Contents.json`]: contents([]),
    });
    const icon = await findAppIcon(root, 'Beta', root);
    expect(icon.path).toBe(join(root, 'App/Resources/Brand.xcassets/Beta.appiconset'));
    expect(icon.appStore).toEqual({ file: null, png: null, problem: null });
  });

  it('reports an Icon Composer file without reading it', async () => {
    const root = tree({
      'App/AppIcon.icon/icon.json': '{}',
      [`${SET}/Contents.json`]: contents([]),
    });
    expect(await findAppIcon(root, 'AppIcon', root)).toEqual({
      path: join(root, 'App/AppIcon.icon'),
      kind: 'icon-composer',
      appStore: null,
    });
  });

  it('skips Pods and node_modules and says when there is no icon', async () => {
    const root = tree({
      'Pods/Some.xcassets/AppIcon.appiconset/Contents.json': contents([]),
      'node_modules/x/Images.xcassets/AppIcon.appiconset/Contents.json': contents([]),
    });
    expect(await findAppIcon(root, 'AppIcon', root)).toEqual({
      path: null,
      kind: null,
      appStore: null,
    });
  });

  it('says why an icon set could not be read', async () => {
    const broken = tree({ [`${SET}/Contents.json`]: '{ "images": [' });
    expect((await findAppIcon(broken, 'AppIcon', broken)).appStore?.problem).toBe(
      'Contents.json is not valid JSON.',
    );
    const missing = tree({
      [`${SET}/Contents.json`]: contents([
        { idiom: 'universal', platform: 'ios', size: '1024x1024', filename: 'gone.png' },
      ]),
    });
    expect((await findAppIcon(missing, 'AppIcon', missing)).appStore?.problem).toBe(
      'gone.png does not exist.',
    );
    const jpeg = tree({
      [`${SET}/Contents.json`]: contents([
        { idiom: 'universal', platform: 'ios', size: '1024x1024', filename: 'icon.jpg' },
      ]),
      [`${SET}/icon.jpg`]: Buffer.from([0xff, 0xd8, 0xff, 0xe0, ...new Array(40).fill(0)]),
    });
    expect((await findAppIcon(jpeg, 'AppIcon', jpeg)).appStore?.problem).toBe(
      'icon.jpg is not a PNG file.',
    );
  });

  it('does not follow a file name that leaves the icon set', async () => {
    const root = tree({
      [`${SET}/Contents.json`]: contents([
        { idiom: 'universal', platform: 'ios', size: '1024x1024', filename: '../../../secret.png' },
      ]),
      'secret.png': png(4, 4),
    });
    expect((await findAppIcon(root, 'AppIcon', root)).appStore).toEqual({
      file: null,
      png: null,
      problem: null,
    });
  });
});

describe('readIconFile', () => {
  it('reads a PNG named in an Expo config and says when it is missing', async () => {
    const root = tree({ 'assets/icon.png': png(512, 512) });
    expect((await readIconFile(join(root, 'assets/icon.png'), root)).png?.width).toBe(512);
    expect((await readIconFile(join(root, 'assets/none.png'), root)).problem).toBe(
      'does not exist.',
    );
  });
});
