## reviewready: Lens (React Native)

**3 problems App Review or App Store Connect turns away, and 2 warnings to review**

- deployment target iOS 15.1
- Target `HelloWorld` (`ios/HelloWorld/Info.plist`)
- `react-native` 0.88.1 (declared)

| Rule | Severity | Where | Finding |
| --- | --- | --- | --- |
| RVW101 | error | `ios/HelloWorld/Info.plist` | react-native-permissions Microphone \(ios/Podfile:23\) needs NSMicrophoneUsageDescription \(microphone\); HelloWorld has none. |
| RVW103 | error | `ios/HelloWorld/Info.plist:39` | NSLocationWhenInUseUsageDescription is empty. |
| RVW501 | error | `ios/HelloWorld/Images.xcassets/AppIcon.appiconset/Contents.json` | ios/HelloWorld/Images.xcassets/AppIcon.appiconset has no image in its 1024 × 1024 App Store slot. |
| RVW201 | warning | `ios/HelloWorld/Info.plist` | The Info.plist of HelloWorld has no ITSAppUsesNonExemptEncryption, so App Store Connect asks the export compliance questions for every build. |
| RVW702 | warning | `ios/HelloWorld/PrivacyInfo.xcprivacy` | ios/HelloWorld/PrivacyInfo.xcprivacy is not in the Copy Bundle Resources of HelloWorld or in a folder it syncs, so the app ships without it. React Native's pod install adds it to the target \(privacy manifest aggregation\); commit the project file it changes. |

<details><summary>What each finding means and how to fix it</summary>

### RVW101: Purpose string missing

`ios/HelloWorld/Info.plist`: react-native-permissions Microphone \(ios/Podfile:23\) needs NSMicrophoneUsageDescription \(microphone\); HelloWorld has none.

**Fix: Add the key to Info.plist** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/purpose-strings.md))

1. Add the key to the target's Info.plist with one sentence that says what the app does with the data, for example: \<key\>NSCameraUsageDescription\</key\>\<string\>Scan the barcode on a receipt to add it to your expenses.\</string\>
2. If the app never uses this feature, remove the code or the package that uses it instead.

Sources: [Apple: Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), [App Review Guidelines 5.1.1\(ii\) Permission](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)

### RVW103: Purpose string not valid

`ios/HelloWorld/Info.plist:39`: NSLocationWhenInUseUsageDescription is empty.

**Fix: Write a one-sentence string** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/purpose-strings.md))

1. Make the value a \<string\> of one complete sentence that says what the app does with the data, well under 4,000 bytes.

Sources: [Apple: Adhere to the requirements for purpose strings](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources)

### RVW501: No App Store icon

`ios/HelloWorld/Images.xcassets/AppIcon.appiconset/Contents.json`: ios/HelloWorld/Images.xcassets/AppIcon.appiconset has no image in its 1024 × 1024 App Store slot.

**Fix: Add the 1024 × 1024 image** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/app-icon.md))

1. Open the asset catalog in Xcode, select the app icon and drop a 1024 × 1024 PNG into the App Store \(or single-size iOS\) slot, or add an Icon Composer .icon file with the name the target builds \(ASSETCATALOG\_COMPILER\_APPICON\_NAME\).

Sources: [Apple: Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon), [Apple: Asset Catalog Format Reference, App Icon Type](https://developer.apple.com/library/archive/documentation/Xcode/Reference/xcode_ref-Asset_Catalog_Format/AppIconType.html)

### RVW201: Export compliance not declared

`ios/HelloWorld/Info.plist`: The Info.plist of HelloWorld has no ITSAppUsesNonExemptEncryption, so App Store Connect asks the export compliance questions for every build.

**Fix: Declare the app's encryption** ([guide](https://github.com/muhittincamdali/reviewready/blob/main/docs/guides/export-compliance.md))

1. If the app \(with its libraries\) uses no encryption, or only the encryption built into the operating system such as HTTPS through URLSession, add \<key\>ITSAppUsesNonExemptEncryption\</key\>\<false/\>.
2. If it uses non-exempt encryption, set it to \<true/\> and add ITSEncryptionExportComplianceCode with the code Apple gives you after reviewing your documentation.

Sources: [Apple: ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption), [Apple: Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations)

### RVW702: Privacy manifest not in the app

`ios/HelloWorld/PrivacyInfo.xcprivacy`: ios/HelloWorld/PrivacyInfo.xcprivacy is not in the Copy Bundle Resources of HelloWorld or in a folder it syncs, so the app ships without it. React Native's pod install adds it to the target \(privacy manifest aggregation\); commit the project file it changes.

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
| RVW104 | Purpose string is placeholder or default text | passed |
| RVW201 | Export compliance not declared | found |
| RVW301 | Account creation without account deletion | passed |
| RVW401 | Third-party login without an equivalent option | passed |
| RVW501 | No App Store icon | found |
| RVW502 | App Store icon is not 1024 × 1024 | passed |
| RVW503 | App Store icon has an alpha channel | passed |
| RVW601 | Xcode older than App Store Connect accepts | not checked |
| RVW602 | Deployment target below iOS 13 | passed |
| RVW701 | No privacy manifest | passed |
| RVW702 | Privacy manifest not in the app | found |

</details>

> No build file pins an Xcode version, so the Xcode minimum was not checked: since 28 April 2026, App Store Connect accepts uploads built with Xcode 26 or later.

3 errors, 2 warnings, 8 checks passed. [Rules and sources](https://github.com/muhittincamdali/reviewready#what-reviewready-checks).

<sub>[reviewready](https://github.com/muhittincamdali/reviewready) 0.1.1, rules app-review@2026.10.28 (sources read 2026-10-28). Reads the project's files; it does not build, run or change the app.</sub>
