# Purpose strings (RVW101 to RVW104)

When an app asks for the camera, the photo library, location, contacts and other protected
resources, iOS shows the purpose string from its Info.plist in the permission prompt. Apple's
page [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources)
sets the rules reviewready checks:

- App Review rejects apps that contain code accessing a protected resource without a purpose
  string, and a library the app ships counts even when the app never calls that part of it.
- Without the string, the request fails and can crash the app.
- A purpose string is not blank or only whitespace, is shorter than 4,000 bytes, is a string, and
  is "accurate, meaningful, and specific" about why the app needs access.

Guideline [5.1.1(ii)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage)
adds: "Ensure your purpose strings clearly and completely describe your use of the data."

## What reviewready reads

| Where the need comes from                          | Example                                                                                              | Rule                                                                  |
| -------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| A call in the app's Swift or Objective-C code      | `AVCaptureSession`, `CNContactStore`, `requestWhenInUseAuthorization`                                | RVW101                                                                |
| A Flutter or npm package the app ships             | `camera`, `image_picker`, `react-native-vision-camera`                                               | RVW101, or RVW102 when the package needs the key only for one feature |
| A permission the Podfile compiles in               | permission_handler `'PERMISSION_CAMERA=1'`, react-native-permissions `setup_permissions(['Camera'])` | RVW101                                                                |
| An Expo package whose config plugin is not applied | expo-tracking-transparency without a `plugins` entry                                                 | RVW101 or RVW102                                                      |

The keys are read from the target's Info.plist, from `INFOPLIST_KEY_<key>` build settings when
Xcode generates the Info.plist, and in an Expo app without `ios/` from `ios.infoPlist` and the
config plugins in `app.json`. The full tables, with the package versions whose README was read,
are in [rules/app-review.json](../../rules/app-review.json).

## Fix it in a native app

Add the key to the target's Info.plist with one sentence that says what the app does with the
data:

```xml
<key>NSCameraUsageDescription</key>
<string>Scan the barcode on a receipt to add it to your expenses.</string>
```

With a generated Info.plist, select the target in Xcode, open **Info** and add the key there;
Xcode stores it as the `INFOPLIST_KEY_NSCameraUsageDescription` build setting. If the app never
uses the feature, remove the code or the package instead of adding a string.

## Fix it in a Flutter app

Add the keys to `ios/Runner/Info.plist`. The package's README lists them; reviewready names the
package in the finding. For permission_handler, only the permissions set to `1` in the Podfile's
`GCC_PREPROCESSOR_DEFINITIONS` are compiled in, so set the ones the app does not use to `0` rather
than adding strings for them.

## Fix it in a React Native app

Add the keys to `ios/<App>/Info.plist`. With react-native-permissions, the permissions listed in
`setup_permissions([...])` in the Podfile are the ones that need a string.

## Fix it in an Expo app

Pass the text to the package's config plugin, or set the key under `ios.infoPlist`:

```json
{
  "expo": {
    "plugins": [
      [
        "expo-camera",
        { "cameraPermission": "Photograph the plants you log.", "microphonePermission": false }
      ]
    ]
  }
}
```

An option set to `false` leaves the key out, for a permission the app never asks for. Expo applies
the plugins of some packages (expo-camera, expo-location, expo-image-picker and others) even
without a `plugins` entry; then the plugin writes its default text, such as "Allow
$(PRODUCT_NAME) to access your camera", which says nothing about why. reviewready reports that as
RVW104. Run `npx expo prebuild --clean` or the next EAS Build afterwards.

## RVW102: a key for one feature

Some packages need a key only for one of their features, for example the microphone for recording
video with `image_picker`. If the app uses that feature, add the key; if it does not, nothing has
to change, and `--ignore RVW102` turns the finding off.

## RVW104: placeholder and default text

reviewready flags placeholders (TODO, TBD, FIXME, "lorem ipsum", "placeholder"), the sample texts
of package READMEs ("your usage description here", "[REASON]") and the default texts of Expo's
config plugins. Write what the person gets: "Take a photo of your meal to log it", not "This app
needs camera access".
