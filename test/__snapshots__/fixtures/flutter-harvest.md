## reviewready: harvest (Flutter)

**4 problems App Review or App Store Connect turns away, and 5 warnings to review**

- Xcode 16.4 pinned · deployment target iOS 15.0
- Target `Runner` (`ios/Runner/Info.plist`)

| Rule | Severity | Where | Finding |
| --- | --- | --- | --- |
| RVW101 | error | `ios/Runner/Info.plist` | permission\_handler PERMISSION\_CONTACTS \(ios/Podfile:48\) needs NSContactsUsageDescription \(contacts\); Runner has none. |
| RVW101 | error | `ios/Runner/Info.plist` | The camera package needs NSMicrophoneUsageDescription \(microphone\); Runner has none. |
| RVW101 | error | `ios/Runner/Info.plist` | The image\_picker package needs NSPhotoLibraryUsageDescription \(photo library\); Runner has none. |
| RVW601 | error | `codemagic.yaml:6` | codemagic.yaml pins Xcode 16.4 \(xcode key\); App Store Connect accepts uploads built with Xcode 26 or later since 28 April 2026. |
| RVW104 | warning | `ios/Runner/Info.plist:27` | NSCameraUsageDescription "your usage description here" is the sample text from the camera package README. |
| RVW201 | warning | `ios/Runner/Info.plist` | The Info.plist of Runner has no ITSAppUsesNonExemptEncryption, so App Store Connect asks the export compliance questions for every build. |
| RVW301 | warning | `lib/main.dart:32` | Accounts are created \(a createUserWithEmailAndPassword call in lib/main.dart:32\), and no account deletion call or "Delete account" text was found in the app's code or strings. |
| RVW401 | warning | `pubspec.yaml` | Google Sign-In is used \(the google\_sign\_in package in pubspec.yaml\), and no Sign in with Apple was found: no package, entitlement or AuthenticationServices call. |
| RVW701 | warning | `ios/Runner.xcodeproj/project.pbxproj` | Runner has no PrivacyInfo.xcprivacy in its resources. |

<details><summary>What each finding means and how to fix it</summary>

### RVW101: Purpose string missing

`ios/Runner/Info.plist`: permission\_handler PERMISSION\_CONTACTS \(ios/Podfile:48\) needs NSContactsUsageDescription \(contacts\); Runner has none.

**Fix: Add the key to Info.plist** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/purpose-strings.md))

1. Add the key to the target's Info.plist with one sentence that says what the app does with the data, for example: \<key\>NSCameraUsageDescription\</key\>\<string\>Scan the barcode on a receipt to add it to your expenses.\</string\>
2. If the app never uses this feature, remove the code or the package that uses it instead.

Sources: [Apple: Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), [App Review Guidelines 5.1.1\(ii\) Permission](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)

### RVW101: Purpose string missing

`ios/Runner/Info.plist`: The camera package needs NSMicrophoneUsageDescription \(microphone\); Runner has none.

**Fix: Add the key to Info.plist** (steps above)

Sources: [Apple: Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), [App Review Guidelines 5.1.1\(ii\) Permission](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)

### RVW101: Purpose string missing

`ios/Runner/Info.plist`: The image\_picker package needs NSPhotoLibraryUsageDescription \(photo library\); Runner has none.

**Fix: Add the key to Info.plist** (steps above)

Sources: [Apple: Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), [App Review Guidelines 5.1.1\(ii\) Permission](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)

### RVW601: Xcode older than App Store Connect accepts

`codemagic.yaml:6`: codemagic.yaml pins Xcode 16.4 \(xcode key\); App Store Connect accepts uploads built with Xcode 26 or later since 28 April 2026.

**Fix: Build with Xcode 26 or later** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/xcode-and-ios-minimums.md))

1. Change the pinned version to Xcode 26 or later \(for example 27.1\) in the file and line the finding names, and use a runner or build image that has it.
2. Fix the build warnings and errors the newer SDK reports before the next upload.

Sources: [Apple: Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/), [Apple Developer News: Upcoming SDK minimum requirements \(3 February 2026\)](https://developer.apple.com/news/?id=ueeok6yw)

### RVW104: Purpose string is placeholder or default text

`ios/Runner/Info.plist:27`: NSCameraUsageDescription "your usage description here" is the sample text from the camera package README.

**Fix: Say why the app needs access** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/purpose-strings.md))

1. Replace the text with one sentence that names what the app does with the data, for example "Take a photo of your meal to log it" rather than "needs camera access".

Sources: [Apple: Adhere to the requirements for purpose strings](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), [App Review Guidelines 5.1.1\(ii\) Permission](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)

### RVW201: Export compliance not declared

`ios/Runner/Info.plist`: The Info.plist of Runner has no ITSAppUsesNonExemptEncryption, so App Store Connect asks the export compliance questions for every build.

**Fix: Declare the app's encryption** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/export-compliance.md))

1. If the app \(with its libraries\) uses no encryption, or only the encryption built into the operating system such as HTTPS through URLSession, add \<key\>ITSAppUsesNonExemptEncryption\</key\>\<false/\>.
2. If it uses non-exempt encryption, set it to \<true/\> and add ITSEncryptionExportComplianceCode with the code Apple gives you after reviewing your documentation.

Sources: [Apple: ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption), [Apple: Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations)

### RVW301: Account creation without account deletion

`lib/main.dart:32`: Accounts are created \(a createUserWithEmailAndPassword call in lib/main.dart:32\), and no account deletion call or "Delete account" text was found in the app's code or strings.

**Fix: Let people delete their account in the app** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/accounts-and-sign-in.md))

1. Add a Delete account action that is easy to find, usually in the account settings, and that deletes the account record with its personal data, not only deactivates it.
2. If deletion finishes on a website, link straight to that page. With Sign in with Apple, also revoke the user's tokens.
3. If the app already has it under words reviewready does not know, turn the finding off with --ignore RVW301.

Sources: [App Review Guidelines 5.1.1\(v\) Account Sign-In](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Apple: Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/)

### RVW401: Third-party login without an equivalent option

`pubspec.yaml`: Google Sign-In is used \(the google\_sign\_in package in pubspec.yaml\), and no Sign in with Apple was found: no package, entitlement or AuthenticationServices call.

**Fix: Offer Sign in with Apple next to the other login** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/accounts-and-sign-in.md))

1. Add Sign in with Apple \(AuthenticationServices on iOS, sign\_in\_with\_apple on Flutter, expo-apple-authentication or @⁠invertase/react-native-apple-authentication on React Native\) and the Sign in with Apple capability.
2. If the app falls under one of the exceptions of guideline 4.8, or offers another login service with the listed features, turn the finding off with --ignore RVW401.

Sources: [App Review Guidelines 4.8 Login Services](https://developer.apple.com/app-store/review/guidelines/#login-services), [Apple: Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)

### RVW701: No privacy manifest

`ios/Runner.xcodeproj/project.pbxproj`: Runner has no PrivacyInfo.xcprivacy in its resources.

**Fix: Add a privacy manifest to the app target** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/privacy-manifest.md))

1. In Xcode choose File \> New \> File from Template, pick App Privacy, name it PrivacyInfo.xcprivacy and tick the app target.
2. Record the data the app collects \(NSPrivacyCollectedDataTypes\) and the reasons for each required reason API the app's own code uses \(NSPrivacyAccessedAPITypes\). SDKs ship their own manifests.

Sources: [Apple: Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files), [Apple: Describing use of required reason API](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)

</details>

<details><summary>Checks</summary>

| Rule | Check | Result |
| --- | --- | --- |
| RVW101 | Purpose string missing | found |
| RVW102 | Purpose string missing for a package feature | passed |
| RVW103 | Purpose string not valid | passed |
| RVW104 | Purpose string is placeholder or default text | found |
| RVW201 | Export compliance not declared | found |
| RVW301 | Account creation without account deletion | found |
| RVW401 | Third-party login without an equivalent option | found |
| RVW501 | No App Store icon | passed |
| RVW502 | App Store icon is not 1024 × 1024 | passed |
| RVW503 | App Store icon has an alpha channel | passed |
| RVW601 | Xcode older than App Store Connect accepts | found |
| RVW602 | Deployment target below iOS 13 | passed |
| RVW701 | No privacy manifest | found |
| RVW702 | Privacy manifest not in the app | passed |

</details>

4 errors, 5 warnings, 7 checks passed. [Rules and sources](https://github.com/muhittincamdali/reviewready#what-reviewready-checks).

<sub>[reviewready](https://github.com/muhittincamdali/reviewready) 0.1.0, rules app-review@2026.10.28 (sources read 2026-10-28). Reads the project's files; it does not build, run or change the app.</sub>
