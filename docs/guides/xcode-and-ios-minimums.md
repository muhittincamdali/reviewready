# The Xcode and iOS minimums (RVW601, RVW602)

App Store Connect refuses uploads that miss two minimums listed on Apple's
[Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/) page (read on 28
October 2026):

| Since            | Requirement                                                                                                                                                                        | Rule   |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------ |
| 28 April 2026    | "Apps uploaded to App Store Connect must be built with Xcode 26 or later using an SDK for iOS 26" ([announcement, 3 February 2026](https://developer.apple.com/news/?id=ueeok6yw)) | RVW601 |
| 9 September 2026 | "iOS and iPadOS apps uploaded to App Store Connect must target iOS 13 or later."                                                                                                   | RVW602 |

Apple has not announced a later SDK minimum on that page or in its developer news as of 28 October
2026, so reviewready checks none. When Apple announces one, the date and version go into
[rules/app-review.json](../../rules/app-review.json) with the page that says so.

## RVW601: which Xcode the build uses

reviewready cannot see the Mac that builds the app, so it reads the files that pin an Xcode:

| File                                     | What it reads                                                                       |
| ---------------------------------------- | ----------------------------------------------------------------------------------- |
| `.xcode-version`                         | the version on the first line (xcodes and many CI setups read it)                   |
| `.github/workflows/*.yml`                | `xcode-version:` inputs (setup-xcode) and `/Applications/Xcode_<version>.app` paths |
| `eas.json`                               | the Xcode in each build profile's `ios.image`, e.g. `macos-sequoia-15.5-xcode-16.4` |
| `codemagic.yaml`, `.circleci/config.yml` | `xcode:` keys                                                                       |
| `bitrise.yml`                            | `stack: osx-xcode-<version>`                                                        |
| `fastlane/Fastfile`                      | `xcversion`, `xcodes` and `ensure_xcode_version` actions                            |

When none of them pins a version, the check is reported as not checked, with a note: it does not
pass on what it could not see. Fix a finding by moving the pinned version to Xcode 26 or later
(for example Xcode 27.1) and using a runner or build image that has it.

## RVW602: the deployment target

reviewready reads the lowest `IPHONEOS_DEPLOYMENT_TARGET` of each app target in
`project.pbxproj`, or `ios.deploymentTarget` of the
[expo-build-properties](https://docs.expo.dev/versions/latest/sdk/build-properties/) plugin in an
Expo app. Raise it to 13.0 or later (target › General › Minimum Deployments in Xcode), and raise
`platform :ios` in the Podfile to match.
