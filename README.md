<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg" alt="reviewready: Catches App Review rejections in CI before you submit, with the Apple source of every rule and the fix."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml/badge.svg" alt="CI status"></a>
<a href="https://github.com/muhittincamdali/reviewready/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg" alt="Latest version: v0.1.0"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg" alt="Language version: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg" alt="License: MIT"></picture></a>
</p>

<p align="center">
<a href="#quick-start"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-en-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-en-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-en-light.svg" alt="Get started"></picture></a>
<a href="https://muhittincamdali.github.io/reviewready/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-en-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-en-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-en-light.svg" alt="Documentation"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-en-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-en-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-en-light.svg" alt="Guides"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-en-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-en-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-en-light.svg" alt="Examples"></picture></a>
</p>

<!-- brand:end -->

App Review rejections that a project's files already show (a missing purpose string, an App
Store icon with an alpha channel, an Xcode older than App Store Connect accepts since 28 April 2026) can be caught in CI before you submit. reviewready reads a native iOS, Flutter or React
Native/Expo project and lists them, each with the Apple page it rests on and the fix for your kind
of project. It is a deterministic CLI with rule IDs and exit codes: no AI guesswork, no account, no
upload. It reads your project's files; it does not build, run or change anything.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-native-rejected-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-native-rejected-light.svg"><img src="docs/media/demo-native-rejected-light.svg" alt="reviewready --brief on a SwiftUI app: RVW101 camera without NSCameraUsageDescription, RVW103 empty photo library purpose string, RVW503 App Store icon with an alpha channel, RVW601 Xcode 16.4 pinned, RVW602 iOS 12.0 deployment target, and warnings for a placeholder purpose string, export compliance, account deletion, Google Sign-In without Sign in with Apple and a privacy manifest left out of the app"></picture>

<sub>Recorded from the real CLI on the <a href="fixtures/native-swiftui-rejected">native-swiftui-rejected
fixture</a>, a SwiftUI app written for the tests with one problem per rule (<code>npm run demo</code>).</sub>

## Highlights

- **Every rule cites its source.** The rules are data ([rules/app-review.json](rules/app-review.json))
  that link Apple's documentation, the App Review Guidelines and Apple's Upcoming Requirements page,
  read on 28 October 2026; the tests fail if a rule has no Apple source or names a guide that does
  not exist.
- **Purpose strings from what the app really uses.** The APIs its Swift and Objective-C code
  calls, 15 Flutter and 10 npm packages (with the key each one's README asks for), the
  permissions a Podfile compiles in for permission_handler and react-native-permissions, and what
  Expo's config plugins will write, including their default texts.
- **Checked in the simulator.** Without `NSContactsUsageDescription`, our probe app crashes on the
  iOS 27.0 Simulator with the system's own message; with the fix reviewready gives, it shows the
  prompt. The recording and screenshots are in the repository.
- **The fix for your kind of project.** Info.plist, build setting or app.json, with a guide per
  rule area.
- **Made for CI.** Terminal, plain text, Markdown and JSON reports, a list of every check with its
  result (found, passed, not checked, ignored), `--ignore` per rule, and exit codes: 0 clean,
  1 findings, 2 usage error.

## Quick start

**1. Install reviewready.** You need [Node.js](https://nodejs.org/) 22.12 or later
(`node --version` prints it; on a Mac, `brew install node` installs it). Then install the package
from its [GitHub release](https://github.com/muhittincamdali/reviewready/releases):

```sh
npm i -g https://github.com/muhittincamdali/reviewready/releases/download/v0.1.0/reviewready-0.1.0.tgz
```

**2. Open a terminal in your app's folder**, the one with the `.xcodeproj`, `pubspec.yaml` or
`package.json`:

```sh
cd path/to/YourApp
```

**3. Run reviewready:**

```sh
reviewready
```

Start with the **ERROR** findings: App Review or App Store Connect turns those away. Then the
**WARNING** findings, which App Review may flag. Each finding names its fix in the "How to fix"
list and links the Apple page it comes from.

Homebrew installs the same package, with Node.js: `brew install muhittincamdali/tap/reviewready`.
The npm registry (`npx @mcamdali/reviewready`) is planned.

## What reviewready checks

| Rule   | Severity | Finding                                                                                                         | Source                                                                                                                                                                                                                                            |
| ------ | -------- | --------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RVW101 | error    | The app's code or a package it ships uses a protected resource, and the Info.plist has no purpose string for it | [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), guideline [5.1.1(ii)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage) |
| RVW102 | warning  | A package needs a purpose string for one of its features (for example recording video)                          | same                                                                                                                                                                                                                                              |
| RVW103 | error    | A purpose string is empty, only whitespace, not a string, or 4,000 bytes or more                                | same                                                                                                                                                                                                                                              |
| RVW104 | warning  | A purpose string is a placeholder, a README sample or a config plugin's default text                            | same                                                                                                                                                                                                                                              |
| RVW201 | warning  | No `ITSAppUsesNonExemptEncryption`: App Store Connect asks the export compliance questions for every build      | [ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption)                                                                                                |
| RVW301 | warning  | The app creates accounts and no account deletion is found                                                       | guideline [5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Offering account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/)                               |
| RVW401 | warning  | A third-party login (Google, Facebook, LINE, Kakao, X) without Sign in with Apple or an equivalent              | guideline [4.8](https://developer.apple.com/app-store/review/guidelines/#login-services)                                                                                                                                                          |
| RVW501 | error    | No App Store (1024 × 1024) icon                                                                                 | [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon)                                                                                                                                            |
| RVW502 | error    | The App Store icon is not 1024 × 1024                                                                           | same                                                                                                                                                                                                                                              |
| RVW503 | error    | The App Store icon has an alpha channel, which App Store Connect refuses on upload                              | [Apple Developer Forums thread 795411](https://developer.apple.com/forums/thread/795411) (the 90717 message)                                                                                                                                      |
| RVW601 | error    | A build file pins an Xcode older than 26, the minimum since 28 April 2026                                       | [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/)                                                                                                                                                                  |
| RVW602 | error    | The deployment target is below iOS 13, the minimum since 9 September 2026                                       | same                                                                                                                                                                                                                                              |
| RVW701 | warning  | The app has no privacy manifest                                                                                 | [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)                                                                                                                                        |
| RVW702 | warning  | A privacy manifest is in the iOS folder but not in the app target                                               | same                                                                                                                                                                                                                                              |

RVW301 and RVW401 are heuristics over the app's calls, strings and packages, and say so in their
findings. The privacy manifest is checked for presence only; what it declares is left to tools
that read it in depth.

Apple has announced no SDK minimum after Xcode 26 on its Upcoming Requirements page or in its
developer news as of 28 October 2026, so reviewready checks none; when Apple announces one, it
goes into the rule data with the page that says so.

## In the simulator

The probe app in [test/simulator/contacts-probe](test/simulator/contacts-probe) asks for the
contacts when it opens. reviewready reports RVW101 for it (and RVW702 for its privacy manifest).
[scripts/simulator-check.sh](scripts/simulator-check.sh) built it with Xcode 27.1 and ran it on an
iPhone 17 simulator with iOS 27.0, as committed and with reviewready's two fixes:

| Variant                              | 5 seconds after launch                                   | The system logged                                                                                                                                                               |
| ------------------------------------ | -------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| No `NSContactsUsageDescription`      | the app is gone                                          | "This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSContactsUsageDescription key …" |
| With the key, manifest in the target | running, with the contacts prompt and its purpose string | nothing                                                                                                                                                                         |

<p align="center"><img src="docs/media/simulator/contacts-probe-ios27.png" width="560" alt="The contacts probe on an iPhone 17 simulator with iOS 27.0, built with Xcode 27.1. Left: without NSContactsUsageDescription the app has crashed back to the home screen. Right: with the key, the prompt Allow Probe to access your contacts shows the purpose string Probe shows which of your friends already use it."></p>

The full output of both runs is in [docs/media/simulator](docs/media/simulator).

## Installation

The command under Quick start installs the `reviewready` command from the release tarball. To add
it to a project instead:

```sh
npm install --save-dev https://github.com/muhittincamdali/reviewready/releases/download/v0.1.0/reviewready-0.1.0.tgz
```

`npx reviewready` then runs that copy. The package's name is `@mcamdali/reviewready`, the name the
JavaScript API below imports. Each GitHub release carries the package as
`reviewready-<version>.tgz` with a `SHA256SUMS` file for verifying it.

## Usage

```text
reviewready [path] [options]
```

| Option                  | What it does                                                               |
| ----------------------- | -------------------------------------------------------------------------- |
| `path`                  | Project folder or `.xcodeproj`; default is the current folder              |
| `-f, --format <format>` | `tty` (default), `text`, `markdown` or `json`                              |
| `--json`                | Same as `--format json`                                                    |
| `-o, --output <file>`   | Write the report to a file instead of the terminal                         |
| `--fail-on <severity>`  | `warning` (default), `error`, `info` or `none`: when the exit code is 1    |
| `--ignore <rules>`      | Rule IDs to leave out, comma-separated; can be repeated                    |
| `--brief`               | Terminal and text reports: only the verdict and the findings               |
| `--no-color`            | Plain text even in a terminal (`NO_COLOR` and `FORCE_COLOR` are respected) |

Exit codes: `0` nothing at or above `--fail-on`, `1` findings at or above it, `2` bad arguments,
no iOS project found, or an unexpected error. When an Xcode project, an Info.plist, the Expo
config or a source folder could not be read, the verdict is "Not known" and the exit code is `1`
unless `--fail-on none`: reviewready never calls an app ready on files it did not read.

reviewready finds the iOS app on its own: an `.xcodeproj` at the root or one folder down for native
apps, `ios/` for Flutter, React Native and Expo apps. It reads every iOS app target's Info.plist
(XML or binary), build settings and entitlements, its icon set and privacy manifest, the app's
Swift, Objective-C, JavaScript, TypeScript and Dart files and its strings files, the Podfile, and
the files that pin an Xcode. An Expo app without `ios/` is checked from app.json.

### Keep a Markdown report with the code

```sh
reviewready --format markdown --output reviewready.md
```

### Use the JSON report in scripts

```sh
reviewready --json > reviewready.json
```

Each finding has `rule`, `severity`, `title`, `message`, `file`, `line`, `target`, the `fix` with
its steps and guide, and `sources`; `checks` lists every rule with its result. The layout is
`schemaVersion` 0 and may change before 1.0. [examples/shell/errors-only.sh](examples/shell/errors-only.sh)
filters it with `jq`.

### Run it in CI

[examples/github-actions/reviewready.yml](examples/github-actions/reviewready.yml) adds the report
to the job summary of every pull request that touches the app and fails the job on errors. It
runs on Linux: no Xcode, simulator or build is needed. See the [CI guide](docs/guides/ci.md).

### From JavaScript

```js
import { render, scan } from '@mcamdali/reviewready';

const report = await scan('path/to/app', { ignore: ['RVW301'] });
console.log(report.verdict.text, report.summary);
console.log(render(report, 'markdown'));
```

A runnable version is [examples/api/summary.mjs](examples/api/summary.mjs).

## Demo

The terminal recordings come from the CLI on the [fixtures](fixtures/README.md), projects made with
each toolchain:

| Project                                                                             | Recording                                                                                                                                           |
| ----------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| SwiftUI app with one problem per rule                                               | top of this page                                                                                                                                    |
| Flutter 3.47.5 app with camera, image_picker, permission_handler and Google Sign-In | [light](docs/media/demo-flutter-light.svg) · [dark](docs/media/demo-flutter-dark.svg)                                                               |
| Expo SDK 58 app without `ios/`: config plugins, an EAS image with Xcode 16.4        | [light](docs/media/demo-expo-light.svg) · [dark](docs/media/demo-expo-dark.svg)                                                                     |
| UIKit app that passes every check                                                   | [light](docs/media/demo-native-ready-light.svg) · [dark](docs/media/demo-native-ready-dark.svg)                                                     |
| `scripts/simulator-check.sh` on iOS 27.0, without and with the fixes                | [missing](docs/media/demo-simulator-contacts-probe-missing-27.0-light.svg) · [fixed](docs/media/demo-simulator-contacts-probe-fixed-27.0-light.svg) |

Measured on 28 October 2026 on a Mac (Apple silicon, M5 Max) with Node.js 26.12: three sets of 100
runs of `node dist/cli/main.js --json` over the six fixtures, Node.js start-up included. The
medians of the three sets were 0.110, 0.112 and 0.109 seconds; the slowest run took 0.24 seconds.
The test suite has 319 tests (`npm test`, same machine).

## Status

| Feature                                                                                                                            | Status        |
| ---------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| Native, Flutter, React Native and Expo project detection                                                                           | works         |
| RVW101 to RVW702 on Info.plist, build settings, entitlements, icons, privacy manifests, sources, packages, Podfile and Expo config | works         |
| Terminal, text, Markdown and JSON reports; check list; `--ignore`, `--brief`, `--fail-on` exit codes                               | works         |
| External payment links and In-App Purchase (guideline 3.1.1), age rating questions                                                 | planned (0.2) |
| `.xcconfig` build settings, Swift packages and Pods of the app, `app.config.js`                                                    | planned (0.2) |
| SARIF output and a GitHub Action                                                                                                   | planned (0.3) |
| Homebrew (`muhittincamdali/tap`)                                                                                                   | works         |
| npm registry                                                                                                                       | planned       |
| Stable rule schema and JSON layout                                                                                                 | planned (1.0) |

## Limits

- **Patterns, not a compiler.** The API, account and login rules are regular expressions over
  source text whose comments and strings are blanked. Code that is generated, hidden behind
  macros, built at run time or written in an unusual shape can be missed or matched by mistake.
- **Packages by name.** A package's purpose strings come from its README as listed in the rule
  data, for the version named there. Packages not in the table, and the native code inside
  `node_modules`, Pods and Swift packages, are not read.
- **Build settings from project.pbxproj only.** `.xcconfig` files are not read. When a target's
  Info.plist cannot be read, the result is "not known" and the report says why.
- **Expo config as JSON.** `app.config.js` and `app.config.ts` are not run, so they make the result
  "not known"; app.json is read.
- **Files only.** reviewready does not build the app or look at its screens, and App Review
  decides on more than files show. The simulator recordings in this repository come from
  `scripts/simulator-check.sh`, run on a Mac.
- **Bounded input.** A project can come from a pull request, so reviewready reads at most 32 MB
  per project file and, of the sources, 4 MB per file, 20,000 files and 128 MB in total, in folders
  up to 12 levels down; what it leaves out is listed in the report's notes. A source folder it did
  not search, because it is deeper or cannot be listed, makes the result "not known". The patterns
  are tested on hostile files of a million characters.

## Documentation

API reference and guides: [muhittincamdali.github.io/reviewready](https://muhittincamdali.github.io/reviewready/).

## Guides

- [Purpose strings](docs/guides/purpose-strings.md)
- [Export compliance](docs/guides/export-compliance.md)
- [Account deletion and login services](docs/guides/accounts-and-sign-in.md)
- [The App Store icon](docs/guides/app-icon.md)
- [The Xcode and iOS minimums](docs/guides/xcode-and-ios-minimums.md)
- [The privacy manifest](docs/guides/privacy-manifest.md)
- [Run reviewready in CI](docs/guides/ci.md)

## Sources

Read on 28 October 2026:

- Apple: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (last
  updated 16 October 2026), [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/),
  [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources),
  [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/),
  [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations),
  [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files),
  [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon),
  and the pages each rule links in [rules/app-review.json](rules/app-review.json).
- Expo: [app config](https://docs.expo.dev/versions/latest/config/app/),
  [privacy manifests](https://docs.expo.dev/guides/apple-privacy/), and the config plugins of the
  SDK 58 packages and `@expo/prebuild-config` 58.0.16 as published on npm.
- The README of each Flutter and npm package in the rule data, at the version it names.

## Requirements

Node.js 22.12 or later on macOS, Linux or Windows. Reading a project needs nothing else: no Xcode,
Flutter or React Native toolchain. The simulator script needs a Mac with Xcode and XcodeGen.

## Architecture

```text
detectProject      native | flutter | react-native | expo, the iOS folder, the packages it ships
  ─► collectApp    app targets: Info.plist keys, build settings, entitlements, icon, privacy
                   manifests; Expo config, Podfile permissions, pinned Xcode versions, sources
  ─► checkApp      RVW101–104 purpose strings · RVW201 export compliance · RVW301/401 accounts
                   · RVW501–503 icon · RVW601/602 minimums · RVW701/702 privacy manifest
                   rules/app-review.json: rule text, fixes, sources and tables (validated with zod)
  ─► scan          findings, verdict, the result of every check, notes
  ─► render        tty | text | markdown | json
```

- The rule data is separate from the code and versioned (`app-review@2026.10.28`).
- The CLI (`src/cli/`) only parses arguments, picks colours and widths, and sets the exit code.

## Related

[glassready](https://github.com/muhittincamdali/glassready) shows what Liquid Glass changes in an
app built with the iOS 27 SDK, and [sdkbump](https://github.com/muhittincamdali/sdkbump) whether it
launches with the UIScene life cycle. reviewready answers whether App Review will let it through.

## FAQ

**Does a clean report mean the app will pass review?** No. reviewready checks what the files show
for the rules listed above. App Review also looks at the running app, its metadata and guidelines
no file can show.

**My app does not use the microphone, but RVW102 asks for it.** RVW102 is a warning for a key a
package needs only for one feature. If the app does not use that feature, nothing has to change:
`--ignore RVW102`.

**Does reviewready change my project?** No. It reads it and writes only the report you ask for.

## Contributing

Contributions are welcome: read [CONTRIBUTING.md](CONTRIBUTING.md) and the
[code of conduct](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) before
opening a pull request, and report security issues as described in [SECURITY.md](SECURITY.md).

## License

Released under the MIT license. See [LICENSE](LICENSE).
