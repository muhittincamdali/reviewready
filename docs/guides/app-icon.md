# The App Store icon (RVW501 to RVW503)

Xcode makes every icon size from one 1024 × 1024 image: "iOS, iPadOS, tvOS, and watchOS apps can
auto-generate all icon variations from a single 1024×1024 pixel image"
([Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon)).
In an icon set with every size, the `ios-marketing` 1024 × 1024 image is the App Store icon
([Asset Catalog Format Reference](https://developer.apple.com/library/archive/documentation/Xcode/Reference/xcode_ref-Asset_Catalog_Format/AppIconType.html)).

reviewready finds the icon the target builds (`ASSETCATALOG_COMPILER_APPICON_NAME`, `AppIcon` by
default) and reads only the headers of its App Store PNG.

| Rule   | What it means                                                                | What Xcode or App Store Connect does                                                                                                                                                                                                                                                                        |
| ------ | ---------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| RVW501 | No icon set or Icon Composer file with that name, or an empty App Store slot | No App Store icon to upload                                                                                                                                                                                                                                                                                 |
| RVW502 | The image is not 1024 × 1024                                                 | Xcode 27.1's asset catalog compiler warns "is 512x512 but should be 1024x1024" and, with nothing else in the set, fails with "did not have any applicable content"                                                                                                                                          |
| RVW503 | The image has an alpha channel or a transparent colour (`tRNS`)              | App Store Connect refuses the upload: "The large app icon in the asset catalog … can't be transparent or contain an alpha channel" (asset validation 90717, quoted in [this Apple Developer Forums thread](https://developer.apple.com/forums/thread/795411)). Xcode 27.1 builds the app without a warning. |

The Xcode messages above were recorded with Xcode 27.1 (27A9275) on a Mac (Apple silicon) by
compiling one asset catalog per case with `xcrun actool`.

## Check and fix an icon

```sh
sips -g pixelWidth -g pixelHeight -g hasAlpha path/to/AppIcon.appiconset/icon.png
```

`hasAlpha: yes` is RVW503. Export the icon again as an opaque PNG with a solid background: in
Preview, **File › Export**, untick **Alpha**. In a design tool, turn off transparency in the PNG
export settings.

## Icon Composer

An `AppIcon.icon` file made with [Icon Composer](https://developer.apple.com/design/human-interface-guidelines/app-icons)
holds layers, and Xcode renders the App Store image from them at build time. reviewready reports
the file as found and does not read it.

## Expo

In an Expo app without `ios/`, the icon is `expo.ios.icon` or `expo.icon` in app.json. Expo
recommends a 1024 × 1024 PNG, and its prebuild removes the transparency of the icon it writes
(`removeTransparency` in @expo/prebuild-config 58.0.16), so reviewready checks the size only. An
`.icon` file is not read. Without either key, the icon set prebuild writes is empty: RVW501.
