#!/bin/bash
# Builds the contacts probe app (test/simulator/contacts-probe) with the installed Xcode, runs it on
# an iOS simulator and records what happens, for the two findings reviewready reports on it:
#
#   scripts/simulator-check.sh missing <out-dir> [runtime]   as committed: no NSContactsUsageDescription,
#                                                            PrivacyInfo.xcprivacy left out of the target
#   scripts/simulator-check.sh fixed <out-dir> [runtime]     the key added and the manifest in the target
#
# It writes <out-dir>/<variant>.txt (the toolchain, what the built app contains, whether the app
# was still running after the request, and the system's message) and <out-dir>/<variant>.png (a
# screenshot). It needs macOS, Xcode with an iOS simulator runtime, and XcodeGen.
#
# The probe itself is never changed: the build runs on a copy in .simulator-work/ (ignored by git).
# It creates (once) and boots a simulator named "reviewready-iPhone-17-<runtime>", so it never
# touches your other simulators, and resets that simulator's privacy settings before each run.
set -euo pipefail

variant="${1:?usage: scripts/simulator-check.sh missing|fixed <out-dir> [runtime]}"
out="${2:?usage: scripts/simulator-check.sh missing|fixed <out-dir> [runtime]}"
version="${3:-27.0}"
case "$variant" in missing | fixed) ;; *) echo "variant is missing or fixed" >&2; exit 2 ;; esac
root="$(cd "$(dirname "$0")/.." && pwd)"
mkdir -p "$out"
out="$(cd "$out" && pwd)"

runtime="com.apple.CoreSimulator.SimRuntime.iOS-${version//./-}"
name="reviewready-iPhone-17-$version"
udid="$(xcrun simctl list devices -j | node -e '
  const [name] = process.argv.slice(1);
  const devices = Object.values(JSON.parse(require("fs").readFileSync(0, "utf8")).devices).flat();
  const found = devices.find((device) => device.name === name && device.isAvailable);
  process.stdout.write(found ? found.udid : "");' "$name")"
if [ -z "$udid" ]; then
  udid="$(xcrun simctl create "$name" com.apple.CoreSimulator.SimDeviceType.iPhone-17 "$runtime")"
fi
xcrun simctl boot "$udid" 2> /dev/null || true
xcrun simctl bootstatus "$udid" -b > /dev/null
# English system prompts, whatever the Mac's language: the screenshots go into an English README.
if [ "$(xcrun simctl spawn "$udid" defaults read -g AppleLocale 2> /dev/null)" != en_US ]; then
  xcrun simctl spawn "$udid" defaults write -g AppleLanguages -array en
  xcrun simctl spawn "$udid" defaults write -g AppleLocale en_US
  xcrun simctl shutdown "$udid"
  xcrun simctl boot "$udid"
  xcrun simctl bootstatus "$udid" -b > /dev/null
fi
xcrun simctl status_bar "$udid" override --time 9:41 --batteryState charged --batteryLevel 100 \
  --cellularBars 4 --wifiBars 3 > /dev/null 2>&1 || true

work="$root/.simulator-work/contacts-probe-$variant"
rm -rf "$work"
mkdir -p "$work"
cp -R "$root/test/simulator/contacts-probe/." "$work/"
if [ "$variant" = fixed ]; then
  # The two fixes reviewready gives: the purpose string as a build setting, and the manifest in the
  # target (no longer excluded from its sources, so XcodeGen adds it to Copy Bundle Resources).
  sed -i '' -e 's/^        excludes:$//' -e 's/^          - PrivacyInfo.xcprivacy$//' "$work/project.yml"
  sed -i '' 's/^        INFOPLIST_KEY_CFBundleDisplayName: Probe$/&\
        INFOPLIST_KEY_NSContactsUsageDescription: "Probe shows which of your friends already use it."/' \
    "$work/project.yml"
fi
(cd "$work" && xcodegen generate --quiet)
xcodebuild -project "$work/Probe.xcodeproj" -scheme Probe -destination "id=$udid" \
  -derivedDataPath "$work/dd" build > "$work/build.log" 2>&1 || { tail -20 "$work/build.log"; exit 1; }
app="$(find "$work/dd/Build/Products" -maxdepth 2 -name 'Probe.app' | head -1)"
bundle="$(/usr/libexec/PlistBuddy -c 'Print :CFBundleIdentifier' "$app/Info.plist")"
sdk="$(/usr/libexec/PlistBuddy -c 'Print :DTSDKName' "$app/Info.plist")"
purpose="$(/usr/libexec/PlistBuddy -c 'Print :NSContactsUsageDescription' "$app/Info.plist" 2> /dev/null || echo 'not set')"
manifest="$([ -f "$app/PrivacyInfo.xcprivacy" ] && echo 'in the app' || echo 'not in the app')"

xcrun simctl privacy "$udid" reset all "$bundle" > /dev/null 2>&1 || true
xcrun simctl uninstall "$udid" "$bundle" 2> /dev/null || true
xcrun simctl install "$udid" "$app"
# log show reads --start in the Mac's local time.
started="$(date '+%Y-%m-%d %H:%M:%S')"
xcrun simctl launch "$udid" "$bundle" > /dev/null
sleep "${SETTLE_SECONDS:-5}"
xcrun simctl io "$udid" screenshot "$out/$variant.png" > /dev/null 2>&1
# grep reads the whole list: with -q it would stop early, and pipefail would count the
# launchctl that it cut off as a failure.
running="$(xcrun simctl spawn "$udid" launchctl list | grep -c "UIKitApplication:$bundle" || true)"
[ "$running" -gt 0 ] && running=yes || running=no
message="$(xcrun simctl spawn "$udid" log show --style compact --start "$started" \
  --predicate 'eventMessage CONTAINS "privacy-sensitive data"' 2> /dev/null |
  grep -o 'This app has crashed.*' | head -1 || true)"
xcrun simctl terminate "$udid" "$bundle" 2> /dev/null || true

{
  echo "variant:    $variant"
  echo "built with: $(xcodebuild -version | head -1) ($(xcodebuild -version | tail -1 | sed 's/Build version //')), SDK $sdk"
  echo "simulator:  iPhone 17, iOS $version"
  echo "NSContactsUsageDescription in the built Info.plist: $purpose"
  echo "PrivacyInfo.xcprivacy: $manifest"
  echo "running 5 seconds after launch: $running"
  echo "system message: ${message:-none}"
} | tee "$out/$variant.txt"
