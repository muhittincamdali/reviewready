## reviewready: field-notes (Expo)

**2 problems App Review or App Store Connect turns away, and 2 warnings to review**

- Xcode 16.4 pinned
- Target `field-notes`
- `react-native` 0.88.0 (declared)
- `expo` 58.0.20 (declared)

| Rule | Severity | Where | Finding |
| --- | --- | --- | --- |
| RVW101 | error | `app.json` | The expo-tracking-transparency package \(its config plugin is not in expo.plugins\) needs NSUserTrackingUsageDescription \(App Tracking Transparency\); field-notes has none. |
| RVW601 | error | `eas.json:8` | eas.json pins Xcode 16.4 \(EAS image\); App Store Connect accepts uploads built with Xcode 26 or later since 28 April 2026. |
| RVW104 | warning | `app.json` | The expo-location config plugin writes its default text for NSLocationWhenInUseUsageDescription, NSLocationAlwaysAndWhenInUseUsageDescription, NSLocationAlwaysUsageDescription: no option or ios.infoPlist value gives the app's own. |
| RVW701 | warning | `app.json` | app.json has no ios.privacyManifests, so prebuild writes no privacy manifest for the app. |

<details><summary>What each finding means and how to fix it</summary>

### RVW101: Purpose string missing

`app.json`: The expo-tracking-transparency package \(its config plugin is not in expo.plugins\) needs NSUserTrackingUsageDescription \(App Tracking Transparency\); field-notes has none.

**Fix: Set the text in app.json** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/purpose-strings.md))

1. Set the key under expo.ios.infoPlist in app.json, or pass the text to the package's config plugin option, with a sentence that says what the app does with the data.
2. Run npx expo prebuild --clean \(or the next EAS Build\) so the native Info.plist gets it.

Sources: [Apple: Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), [App Review Guidelines 5.1.1\(ii\) Permission](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)

### RVW601: Xcode older than App Store Connect accepts

`eas.json:8`: eas.json pins Xcode 16.4 \(EAS image\); App Store Connect accepts uploads built with Xcode 26 or later since 28 April 2026.

**Fix: Build with Xcode 26 or later** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/xcode-and-ios-minimums.md))

1. Change the pinned version to Xcode 26 or later \(for example 27.1\) in the file and line the finding names, and use a runner or build image that has it.
2. Fix the build warnings and errors the newer SDK reports before the next upload.

Sources: [Apple: Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/), [Apple Developer News: Upcoming SDK minimum requirements \(3 February 2026\)](https://developer.apple.com/news/?id=ueeok6yw)

### RVW104: Purpose string is placeholder or default text

`app.json`: The expo-location config plugin writes its default text for NSLocationWhenInUseUsageDescription, NSLocationAlwaysAndWhenInUseUsageDescription, NSLocationAlwaysUsageDescription: no option or ios.infoPlist value gives the app's own.

**Fix: Pass your own text to the config plugin** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/purpose-strings.md))

1. Add the plugin to expo.plugins with its permission option, for example \["expo-camera", { "cameraPermission": "Scan a receipt to add it to your expenses." }\], or set the key under expo.ios.infoPlist.
2. Set the option to false instead if the app never uses that permission: the plugin then leaves the key out.

Sources: [Apple: Adhere to the requirements for purpose strings](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), [App Review Guidelines 5.1.1\(ii\) Permission](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)

### RVW701: No privacy manifest

`app.json`: app.json has no ios.privacyManifests, so prebuild writes no privacy manifest for the app.

**Fix: Add ios.privacyManifests to app.json** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/privacy-manifest.md))

1. Add expo.ios.privacyManifests with NSPrivacyAccessedAPITypes \(and the data types the app collects\); prebuild writes them into PrivacyInfo.xcprivacy.

Sources: [Apple: Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files), [Apple: Describing use of required reason API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

</details>

<details><summary>Checks</summary>

| Rule | Check | Result |
| --- | --- | --- |
| RVW101 | Purpose string missing | found |
| RVW102 | Purpose string missing for a package feature | passed |
| RVW103 | Purpose string not valid | passed |
| RVW104 | Purpose string is placeholder or default text | found |
| RVW201 | Export compliance not declared | passed |
| RVW301 | Account creation without account deletion | passed |
| RVW401 | Third-party login without an equivalent option | passed |
| RVW501 | No App Store icon | passed |
| RVW502 | App Store icon is not 1024 × 1024 | passed |
| RVW503 | App Store icon has an alpha channel | passed |
| RVW601 | Xcode older than App Store Connect accepts | found |
| RVW602 | Deployment target below iOS 13 | not checked |
| RVW701 | No privacy manifest | found |
| RVW702 | Privacy manifest not in the app | passed |

</details>

2 errors, 2 warnings, 9 checks passed. [Rules and sources](https://github.com/muhittincamdali/reviewready#what-reviewready-checks).

<sub>[reviewready](https://github.com/muhittincamdali/reviewready) 0.1.1, rules app-review@2026.10.28 (sources read 2026-10-28). Reads the project's files; it does not build, run or change the app.</sub>
