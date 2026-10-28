## reviewready: Ledger (native iOS)

**5 problems App Review or App Store Connect turns away, and 5 warnings to review**

- Xcode 16.4 pinned · deployment target iOS 12.0
- Target `Ledger`

| Rule | Severity | Where | Finding |
| --- | --- | --- | --- |
| RVW101 | error | `Ledger.xcodeproj/project.pbxproj` | AVCaptureSession \(Ledger/ScannerView.swift:6\) needs NSCameraUsageDescription \(camera\); Ledger has none. |
| RVW103 | error | `Ledger.xcodeproj/project.pbxproj:157` | NSPhotoLibraryUsageDescription is empty. |
| RVW503 | error | `Ledger/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png` | The App Store icon has an alpha channel. |
| RVW601 | error | `.xcode-version:1` | .xcode-version pins Xcode 16.4 \(.xcode-version\); App Store Connect accepts uploads built with Xcode 26 or later since 28 April 2026. |
| RVW602 | error | `Ledger.xcodeproj/project.pbxproj:216` | Ledger targets iOS 12.0; App Store Connect accepts iOS apps that target iOS 13.0 or later since 9 September 2026. |
| RVW104 | warning | `Ledger.xcodeproj/project.pbxproj:156` | NSLocationWhenInUseUsageDescription "Location placeholder" contains the placeholder "placeholder". |
| RVW201 | warning | `Ledger.xcodeproj/project.pbxproj` | The Info.plist of Ledger has no ITSAppUsesNonExemptEncryption, so App Store Connect asks the export compliance questions for every build. |
| RVW301 | warning | `Ledger/SignUpView.swift:13` | Accounts are created \(a createUser\(withEmail:\) call in Ledger/SignUpView.swift:13\), and no account deletion call or "Delete account" text was found in the app's code or strings. |
| RVW401 | warning | `Ledger/SignUpView.swift:1` | Google Sign-In is used \(import GoogleSignIn in Ledger/SignUpView.swift:1\), and no Sign in with Apple was found: no package, entitlement or AuthenticationServices call. |
| RVW702 | warning | `Ledger/PrivacyInfo.xcprivacy` | Ledger/PrivacyInfo.xcprivacy is not in the Copy Bundle Resources of Ledger or in a folder it syncs, so the app ships without it. |

<details><summary>What each finding means and how to fix it</summary>

### RVW101: Purpose string missing

`Ledger.xcodeproj/project.pbxproj`: AVCaptureSession \(Ledger/ScannerView.swift:6\) needs NSCameraUsageDescription \(camera\); Ledger has none.

**Fix: Add the key in the target's Info tab** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/purpose-strings.md))

1. In Xcode, select the target, open Info, and add the key with a sentence that says what the app does with the data. Xcode stores it as the INFOPLIST\_KEY\_\<key\> build setting.
2. If the app never uses this feature, remove the code or the package that uses it instead.

Sources: [Apple: Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), [App Review Guidelines 5.1.1\(ii\) Permission](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)

### RVW103: Purpose string not valid

`Ledger.xcodeproj/project.pbxproj:157`: NSPhotoLibraryUsageDescription is empty.

**Fix: Write a one-sentence string** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/purpose-strings.md))

1. Set the INFOPLIST\_KEY\_\<key\> build setting \(target \> Info in Xcode\) to one complete sentence that says what the app does with the data.

Sources: [Apple: Adhere to the requirements for purpose strings](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources)

### RVW503: App Store icon has an alpha channel

`Ledger/Assets.xcassets/AppIcon.appiconset/AppIcon-1024.png`: The App Store icon has an alpha channel.

**Fix: Export the icon without transparency** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/app-icon.md))

1. Export the 1024 × 1024 icon as an opaque PNG: give it a solid background and turn off "Transparency" or "Alpha" in the export settings \(in Preview: File \> Export, untick Alpha\).
2. Check it with: sips -g hasAlpha path/to/icon.png \(it should print hasAlpha: no\).

Sources: [Apple Developer Forums: Icon composer icon contains alpha channel upload error \(the 90717 message, with a DTS engineer\)](https://developer.apple.com/forums/thread/795411), [Apple: Human Interface Guidelines, App icons](https://developer.apple.com/design/human-interface-guidelines/app-icons)

### RVW601: Xcode older than App Store Connect accepts

`.xcode-version:1`: .xcode-version pins Xcode 16.4 \(.xcode-version\); App Store Connect accepts uploads built with Xcode 26 or later since 28 April 2026.

**Fix: Build with Xcode 26 or later** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/xcode-and-ios-minimums.md))

1. Change the pinned version to Xcode 26 or later \(for example 27.1\) in the file and line the finding names, and use a runner or build image that has it.
2. Fix the build warnings and errors the newer SDK reports before the next upload.

Sources: [Apple: Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/), [Apple Developer News: Upcoming SDK minimum requirements \(3 February 2026\)](https://developer.apple.com/news/?id=ueeok6yw)

### RVW602: Deployment target below iOS 13

`Ledger.xcodeproj/project.pbxproj:216`: Ledger targets iOS 12.0; App Store Connect accepts iOS apps that target iOS 13.0 or later since 9 September 2026.

**Fix: Raise the deployment target** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/xcode-and-ios-minimums.md))

1. Set IPHONEOS\_DEPLOYMENT\_TARGET of the app target to 13.0 or later \(target \> General \> Minimum Deployments in Xcode\), and raise platform :ios in the Podfile to match.
2. Remove the code paths that only ran on older iOS versions.

Sources: [Apple: Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/)

### RVW104: Purpose string is placeholder or default text

`Ledger.xcodeproj/project.pbxproj:156`: NSLocationWhenInUseUsageDescription "Location placeholder" contains the placeholder "placeholder".

**Fix: Say why the app needs access** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/purpose-strings.md))

1. Replace the text with one sentence that names what the app does with the data, for example "Take a photo of your meal to log it" rather than "needs camera access".

Sources: [Apple: Adhere to the requirements for purpose strings](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), [App Review Guidelines 5.1.1\(ii\) Permission](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)

### RVW201: Export compliance not declared

`Ledger.xcodeproj/project.pbxproj`: The Info.plist of Ledger has no ITSAppUsesNonExemptEncryption, so App Store Connect asks the export compliance questions for every build.

**Fix: Declare the app's encryption** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/export-compliance.md))

1. Set the INFOPLIST\_KEY\_ITSAppUsesNonExemptEncryption build setting to NO if the app uses no encryption or only exempt encryption such as HTTPS, or to YES with ITSEncryptionExportComplianceCode otherwise.

Sources: [Apple: ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption), [Apple: Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations)

### RVW301: Account creation without account deletion

`Ledger/SignUpView.swift:13`: Accounts are created \(a createUser\(withEmail:\) call in Ledger/SignUpView.swift:13\), and no account deletion call or "Delete account" text was found in the app's code or strings.

**Fix: Let people delete their account in the app** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/accounts-and-sign-in.md))

1. Add a Delete account action that is easy to find, usually in the account settings, and that deletes the account record with its personal data, not only deactivates it.
2. If deletion finishes on a website, link straight to that page. With Sign in with Apple, also revoke the user's tokens.
3. If the app already has it under words reviewready does not know, turn the finding off with --ignore RVW301.

Sources: [App Review Guidelines 5.1.1\(v\) Account Sign-In](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Apple: Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/)

### RVW401: Third-party login without an equivalent option

`Ledger/SignUpView.swift:1`: Google Sign-In is used \(import GoogleSignIn in Ledger/SignUpView.swift:1\), and no Sign in with Apple was found: no package, entitlement or AuthenticationServices call.

**Fix: Offer Sign in with Apple next to the other login** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/accounts-and-sign-in.md))

1. Add Sign in with Apple \(AuthenticationServices on iOS, sign\_in\_with\_apple on Flutter, expo-apple-authentication or @⁠invertase/react-native-apple-authentication on React Native\) and the Sign in with Apple capability.
2. If the app falls under one of the exceptions of guideline 4.8, or offers another login service with the listed features, turn the finding off with --ignore RVW401.

Sources: [App Review Guidelines 4.8 Login Services](https://developer.apple.com/app-store/review/guidelines/#login-services), [Apple: Sign in with Apple](https://developer.apple.com/sign-in-with-apple/)

### RVW702: Privacy manifest not in the app

`Ledger/PrivacyInfo.xcprivacy`: Ledger/PrivacyInfo.xcprivacy is not in the Copy Bundle Resources of Ledger or in a folder it syncs, so the app ships without it.

**Fix: Add the file to the app target** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/privacy-manifest.md))

1. Select PrivacyInfo.xcprivacy in Xcode, open the File inspector and tick the app target under Target Membership, so it appears in Build Phases \> Copy Bundle Resources.

Sources: [Apple: Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)

</details>

<details><summary>Checks</summary>

| Rule | Check | Result |
| --- | --- | --- |
| RVW101 | Purpose string missing | found |
| RVW102 | Purpose string missing for a package feature | passed |
| RVW103 | Purpose string not valid | found |
| RVW104 | Purpose string is placeholder or default text | found |
| RVW201 | Export compliance not declared | found |
| RVW301 | Account creation without account deletion | found |
| RVW401 | Third-party login without an equivalent option | found |
| RVW501 | No App Store icon | passed |
| RVW502 | App Store icon is not 1024 × 1024 | passed |
| RVW503 | App Store icon has an alpha channel | found |
| RVW601 | Xcode older than App Store Connect accepts | found |
| RVW602 | Deployment target below iOS 13 | found |
| RVW701 | No privacy manifest | passed |
| RVW702 | Privacy manifest not in the app | found |

</details>

5 errors, 5 warnings, 4 checks passed. [Rules and sources](https://github.com/muhittincamdali/reviewready#what-reviewready-checks).

<sub>[reviewready](https://github.com/muhittincamdali/reviewready) 0.1.1, rules app-review@2026.10.28 (sources read 2026-10-28). Reads the project's files; it does not build, run or change the app.</sub>
