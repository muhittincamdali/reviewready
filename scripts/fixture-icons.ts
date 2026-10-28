// Writes the App Store icons of the fixtures that are not copied from a template: an opaque one
// for the apps that pass, one with an alpha channel for the ones that should not.
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { png } from '../test/helpers/png.ts';

const ICONS: Record<string, boolean> = {
  'native-swiftui-rejected/Ledger/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png': true,
  'native-uikit-ready/Atlas/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png': false,
  'expo-58-camera/assets/icon.png': true,
};

for (const [path, alpha] of Object.entries(ICONS)) {
  writeFileSync(
    fileURLToPath(new URL(`../fixtures/${path}`, import.meta.url)),
    png(1024, 1024, { alpha }),
  );
  console.log(`fixtures/${path}`);
}
