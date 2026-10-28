// Records the README and guide demos as terminal SVGs (light and dark) in docs/media/:
//
// - CLI demos run the built reviewready on a fixture from the repository root, as a reader would.
//   The typed command is `reviewready`, the command npm, Homebrew and the release tarball
//   install; it runs the same dist/cli/main.js this script runs.
// - Simulator sessions replay docs/media/simulator/<name>.txt, the output that
//   scripts/simulator-check.sh printed on a Mac; they cannot be recorded in CI.
//
// Run with `npm run demo` (builds first).
import { execFileSync } from 'node:child_process';
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { type Session, terminalSvg } from './terminal-svg.ts';

const ROOT = fileURLToPath(new URL('../', import.meta.url));
export const MEDIA = `${ROOT}docs/media/`;

export interface Demo {
  name: string;
  fixture: string;
  args: string[];
  title: string;
  comment: string;
}

export const DEMOS: Demo[] = [
  {
    name: 'native-rejected',
    fixture: 'native-swiftui-rejected',
    args: ['--brief'],
    title: 'reviewready · SwiftUI app with one problem per rule',
    comment:
      '# fixtures/native-swiftui-rejected: camera, icon, Xcode 16.4, iOS 12, sign-up, Google',
  },
  {
    name: 'flutter',
    fixture: 'flutter-harvest',
    args: ['--brief'],
    title: 'reviewready · Flutter app',
    comment: '# fixtures/flutter-harvest: Flutter 3.47.5, camera, image_picker, permission_handler',
  },
  {
    name: 'expo',
    fixture: 'expo-58-camera',
    args: ['--brief'],
    title: 'reviewready · Expo app without ios/',
    comment: '# fixtures/expo-58-camera: config plugins, EAS image with Xcode 16.4',
  },
  {
    name: 'native-ready',
    fixture: 'native-uikit-ready',
    args: [],
    title: 'reviewready · UIKit app that passes every check',
    comment: '# fixtures/native-uikit-ready: the same features, done right',
  },
];

/** Recorded scripts/simulator-check.sh runs: docs/media/simulator/<name>.txt. */
export const SIMULATOR_SESSIONS = [
  { name: 'contacts-probe-missing-27.0', variant: 'missing', runtime: '27.0' },
  { name: 'contacts-probe-fixed-27.0', variant: 'fixed', runtime: '27.0' },
] as const;

/** Runs the CLI for one demo and returns what a terminal would have shown. */
export function record(demo: Demo): Session {
  const env: NodeJS.ProcessEnv = { ...process.env, FORCE_COLOR: '1' };
  delete env.NO_COLOR;
  const args = [`fixtures/${demo.fixture}`, ...demo.args];
  let output: string;
  try {
    output = execFileSync(process.execPath, [`${ROOT}dist/cli/main.js`, ...args], {
      cwd: ROOT,
      env,
      encoding: 'utf8',
    });
  } catch (error) {
    // Exit code 1 means findings; the report is still on stdout.
    output = (error as { stdout?: string }).stdout ?? '';
  }
  return {
    title: demo.title,
    comment: demo.comment,
    command: `reviewready ${args.join(' ')}`,
    output,
  };
}

/** The recorded output of scripts/simulator-check.sh for one variant, as a session. */
export function simulatorSession(session: (typeof SIMULATOR_SESSIONS)[number]): Session {
  return {
    title: `iOS ${session.runtime} Simulator · contacts probe (${session.variant})`,
    comment: '# recorded on a Mac (Apple silicon) with Xcode 27.1 on 28 October 2026',
    command: `scripts/simulator-check.sh ${session.variant} docs/media/simulator ${session.runtime}`,
    output: readFileSync(`${MEDIA}simulator/${session.name}.txt`, 'utf8'),
  };
}

export const mediaPath = (name: string, theme: 'light' | 'dark') =>
  `${MEDIA}demo-${name}-${theme}.svg`;

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  mkdirSync(MEDIA, { recursive: true });
  const sessions: [string, Session][] = [
    ...DEMOS.map((demo): [string, Session] => [demo.name, record(demo)]),
    ...SIMULATOR_SESSIONS.map((session): [string, Session] => [
      `simulator-${session.name}`,
      simulatorSession(session),
    ]),
  ];
  for (const [name, session] of sessions) {
    for (const theme of ['light', 'dark'] as const) {
      writeFileSync(mediaPath(name, theme), terminalSvg(session, theme));
    }
    console.log(`docs/media/demo-${name}-{light,dark}.svg`);
  }
}
