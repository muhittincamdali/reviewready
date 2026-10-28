// Reads which permissions a Podfile compiles in for two permission packages that leave the choice
// to the app: Flutter's permission_handler (GCC_PREPROCESSOR_DEFINITIONS macros such as
// 'PERMISSION_CAMERA=1') and react-native-permissions (setup_permissions([...])). Only the
// permissions the Podfile turns on reach the app binary, so only those need a purpose string.
import { join } from 'node:path';
import { readProjectText } from '../core/files.js';

export interface PodfilePermissions {
  file: string;
  /** permission_handler macros set to 1, e.g. "PERMISSION_CAMERA", with their lines. */
  macros: Map<string, number>;
  /** react-native-permissions names in setup_permissions, e.g. "Camera", with their lines. */
  setup: Map<string, number>;
}

/** The Podfile text with Ruby line comments removed (outside strings is enough for these files). */
const withoutComment = (line: string) => line.replace(/(^|\s)#.*$/, '$1');

export async function readPodfile(
  iosDir: string,
  root: string,
): Promise<PodfilePermissions | null> {
  const file = join(iosDir, 'Podfile');
  const text = await readProjectText(file, root);
  if (text === null) return null;
  const macros = new Map<string, number>();
  const setup = new Map<string, number>();
  let inSetup = false;
  text.split('\n').forEach((raw, index) => {
    const line = withoutComment(raw);
    for (const match of line.matchAll(/['"](PERMISSION_[A-Z_]+)=1['"]/g)) {
      if (match[1] && !macros.has(match[1])) macros.set(match[1], index + 1);
    }
    if (/\bsetup_permissions\s*\(\s*\[/.test(line)) inSetup = true;
    if (!inSetup) return;
    for (const match of line.matchAll(/['"]([A-Za-z]+)['"]/g)) {
      if (match[1] && !setup.has(match[1])) setup.set(match[1], index + 1);
    }
    if (line.includes(']')) inSetup = false;
  });
  return { file, macros, setup };
}
