# Changelog

All notable changes to reviewready are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). The rule data in `rules/` has its own
`dataVersion` (the date of its last change), shown in every report.

## [Unreleased]

### Fixed

- Source files more than 12 folder levels down, or in a folder that could not be listed, were left
  out without a note, so a project could pass with a call it never read. The report now names those
  folders and the verdict is "Not known" (exit code 1 unless `--fail-on none`).
- A source file over the 4 MB, 20,000-file or 128 MB limit, or one that could not be read, was left
  out with a note while the verdict stayed "ready" with exit code 0. Any source file that is not
  read now makes the verdict "Not known".
- Symbolic links under a source folder were dropped without a note. A linked source file inside the
  project is now read; one linked outside it, and a linked folder (which is not followed), are named
  in the notes and make the verdict "Not known".

## [0.1.0] - 2026-10-28

### Added

- The `reviewready` command (npm package `@mcamdali/reviewready`) for native iOS, Flutter, React
  Native and Expo projects, with terminal, plain text, Markdown and JSON reports, a result for every
  check, `--ignore`, `--brief`, and exit codes 0 (nothing at or above `--fail-on`), 1 (findings,
  or a project file that could not be read) and 2 (usage error).
- Rule data `app-review@2026.10.28`, with an Apple source for every rule:
  - RVW101 to RVW104: purpose strings missing for the APIs the app calls, the 15 Flutter and 10
    npm packages in the table, the Podfile permissions of permission_handler and
    react-native-permissions, and Expo's config plugins; not valid (empty, not a string, 4,000
    bytes or more); placeholder, README sample or config plugin default text.
  - RVW201: no `ITSAppUsesNonExemptEncryption`.
  - RVW301 and RVW401: account creation without deletion (guideline 5.1.1(v)), a third-party login
    without Sign in with Apple (guideline 4.8).
  - RVW501 to RVW503: the App Store icon missing, not 1024 × 1024, or with an alpha channel.
  - RVW601 and RVW602: a pinned Xcode older than 26 (since 28 April 2026) and a deployment target
    below iOS 13 (since 9 September 2026).
  - RVW701 and RVW702: no privacy manifest, or one left out of the app target.
- Six fixtures (SwiftUI with one problem per rule, UIKit that passes, Flutter 3.47.5, React Native
  0.88.1, Expo SDK 58 with and without config plugins) with recorded reports.
- A probe app and `scripts/simulator-check.sh`, with the recordings from the iOS 27.0 Simulator:
  without `NSContactsUsageDescription` the app crashes; with the fix it shows the prompt.
- Guides for each rule area and for CI, an API reference site, and examples for JavaScript, `jq`
  and GitHub Actions.

### Security

- `--output` does not write through a symbolic link: a project from a pull request can bring a
  `reviewready.md` that links outside it. The path is checked with `lstat` and opened with
  `O_NOFOLLOW`; a report file that cannot be written exits with 2 and says why.
- The Markdown report escapes `$`, so text from the project cannot open GitHub math.
- The GitHub Actions example writes the report to `$RUNNER_TEMP` instead of the checkout and checks
  the release tarball against the release's `SHA256SUMS` before it runs it.

[Unreleased]: https://github.com/muhittincamdali/reviewready/compare/v0.1.0...HEAD
[0.1.0]: https://github.com/muhittincamdali/reviewready/releases/tag/v0.1.0
