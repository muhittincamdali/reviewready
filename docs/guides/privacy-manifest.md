# The privacy manifest (RVW701, RVW702)

A privacy manifest, `PrivacyInfo.xcprivacy`, is a property list that records the data an app
collects and the reasons it uses "required reason" APIs such as `UserDefaults`, file timestamps,
system boot time and disk space ([Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)).
Apple asks for the collected data "for your app or third-party SDK on all platforms", and
[since 1 May 2024](https://developer.apple.com/documentation/bundleresources/describing-use-of-required-reason-api)
"apps that don't describe their use of required reason API in their privacy manifest file aren't
accepted by App Store Connect".

reviewready checks only that the app has a manifest and ships it. What the manifest declares is
left to tools that read it in depth; SDKs ship their own manifests.

| Rule   | What it means                                                                                                                               |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------- |
| RVW701 | No `PrivacyInfo.xcprivacy` in the app target's Copy Bundle Resources or synchronized folders, or an Expo app without `ios.privacyManifests` |
| RVW702 | The file is in the iOS folder, but no app target copies it into the app                                                                     |

## Native and Flutter apps

In Xcode, **File › New › File from Template › App Privacy**, name it `PrivacyInfo.xcprivacy` and
tick the app target (for Flutter, the `Runner` target). Apple's
[Adding a privacy manifest to your app or third-party SDK](https://developer.apple.com/documentation/bundleresources/adding-a-privacy-manifest-to-your-app-or-third-party-sdk)
walks through the keys. For RVW702, select the file, open the File inspector and tick the app
target under **Target Membership**.

## React Native apps

React Native's `pod install` adds the required reasons of React Native and the installed pods to
`ios/<App>/PrivacyInfo.xcprivacy` and adds the file to the app target (privacy manifest
aggregation, `scripts/cocoapods/privacy_manifest_utils.rb` in react-native 0.88.1). A project file
committed before `pod install`, like the one `@react-native-community/template` 0.88.1 ships, shows
RVW702: run `pod install` and commit the project file it changes.

## Expo apps

Add `ios.privacyManifests` to app.json; prebuild writes it into `PrivacyInfo.xcprivacy` and adds
the file to the app ([Expo: Privacy manifests](https://docs.expo.dev/guides/apple-privacy/)):

```json
{
  "expo": {
    "ios": {
      "privacyManifests": {
        "NSPrivacyAccessedAPITypes": [
          {
            "NSPrivacyAccessedAPIType": "NSPrivacyAccessedAPICategoryUserDefaults",
            "NSPrivacyAccessedAPITypeReasons": ["CA92.1"]
          }
        ]
      }
    }
  }
}
```
