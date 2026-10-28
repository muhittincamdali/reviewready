# Changelog

All notable changes to reviewready are listed here. The format follows
[Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and the project uses
[Semantic Versioning](https://semver.org/spec/v2.0.0.html). The rule data in `rules/` has its own
`dataVersion` (the date of its last change), shown in every report.

## [Unreleased]

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

[Unreleased]: https://github.com/muhittincamdali/reviewready/commits/main
