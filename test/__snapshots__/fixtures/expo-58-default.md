## reviewready: hello-world (Expo)

**2 warnings App Review may flag**

- Target `hello-world`
- `react-native` 0.88.0 (declared)
- `expo` 58.0.20 (declared)

| Rule | Severity | Where | Finding |
| --- | --- | --- | --- |
| RVW201 | warning | `app.json` | app.json sets neither ios.config.usesNonExemptEncryption nor ios.infoPlist.ITSAppUsesNonExemptEncryption, so App Store Connect asks the export compliance questions for every build. |
| RVW701 | warning | `app.json` | app.json has no ios.privacyManifests, so prebuild writes no privacy manifest for the app. |

<details><summary>What each finding means and how to fix it</summary>

### RVW201: Export compliance not declared

`app.json`: app.json sets neither ios.config.usesNonExemptEncryption nor ios.infoPlist.ITSAppUsesNonExemptEncryption, so App Store Connect asks the export compliance questions for every build.

**Fix: Declare the app's encryption in app.json** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/export-compliance.md))

1. Set expo.ios.config.usesNonExemptEncryption to false if the app uses no encryption or only exempt encryption such as HTTPS, or to true and follow Apple's documentation otherwise.

Sources: [Apple: ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption), [Apple: Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations)

### RVW701: No privacy manifest

`app.json`: app.json has no ios.privacyManifests, so prebuild writes no privacy manifest for the app.

**Fix: Add ios.privacyManifests to app.json** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/privacy-manifest.md))

1. Add expo.ios.privacyManifests with NSPrivacyAccessedAPITypes \(and the data types the app collects\); prebuild writes them into PrivacyInfo.xcprivacy.

Sources: [Apple: Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files), [Apple: Describing use of required reason API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

</details>

<details><summary>Checks</summary>

| Rule | Check | Result |
| --- | --- | --- |
| RVW101 | Purpose string missing | passed |
| RVW102 | Purpose string missing for a package feature | passed |
| RVW103 | Purpose string not valid | passed |
| RVW104 | Purpose string is placeholder or default text | passed |
| RVW201 | Export compliance not declared | found |
| RVW301 | Account creation without account deletion | passed |
| RVW401 | Third-party login without an equivalent option | passed |
| RVW501 | No App Store icon | passed |
| RVW502 | App Store icon is not 1024 × 1024 | passed |
| RVW503 | App Store icon has an alpha channel | passed |
| RVW601 | Xcode older than App Store Connect accepts | not checked |
| RVW602 | Deployment target below iOS 13 | not checked |
| RVW701 | No privacy manifest | found |
| RVW702 | Privacy manifest not in the app | passed |

</details>

> No build file pins an Xcode version, so the Xcode minimum was not checked: since 28 April 2026, App Store Connect accepts uploads built with Xcode 26 or later.

0 errors, 2 warnings, 10 checks passed. [Rules and sources](https://github.com/muhittincamdali/reviewready#what-reviewready-checks).

<sub>[reviewready](https://github.com/muhittincamdali/reviewready) 0.1.0, rules app-review@2026.10.28 (sources read 2026-10-28). Reads the project's files; it does not build, run or change the app.</sub>
