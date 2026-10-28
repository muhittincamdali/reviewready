# Security policy

## Supported versions

Security fixes are made for the latest release of each project. If you are on an older version,
the fix will be in a new release and the upgrade notes will say if anything changes for you.

## Reporting a vulnerability

Please report vulnerabilities privately, not in a public issue, pull request or discussion.

1. **Preferred:** open the repository's **Security** tab and choose
   **Report a vulnerability** ([how private reporting works](https://docs.github.com/en/code-security/how-tos/report-and-fix-vulnerabilities/report-privately)).
2. **Or** email [muhittincamdali@gmail.com](mailto:muhittincamdali@gmail.com) with
   "Security" in the subject.

Include what you can of the following:

- the affected repository and version (tag or commit),
- what an attacker can do and under which conditions,
- steps or a small project that reproduces it,
- any fix or mitigation you already have in mind.

## What happens next

- You get a reply within 7 days confirming that the report arrived.
- I confirm the issue, work on a fix and agree a disclosure date with you. Fixes are released as
  soon as they are ready, together with a GitHub security advisory.
- You are credited in the advisory unless you prefer not to be.

Please give a reasonable amount of time to fix the issue before disclosing it publicly.

## Scope for reviewready

reviewready reads files of the project you point it at (project.pbxproj, Info.plist and
entitlements files, asset catalog Contents.json files and the headers of the App Store icon PNG,
PrivacyInfo.xcprivacy files, Swift, Objective-C, JavaScript, TypeScript and Dart sources, .strings,
.xcstrings and .arb files, the Podfile, package.json, package-lock.json, app.json, app.config.js/ts
as text, eas.json, pubspec.yaml, .fvmrc, .xcode-version, GitHub Actions workflows, codemagic.yaml,
bitrise.yml, .circleci/config.yml and fastlane/Fastfile, and the package.json of react-native and
expo in node_modules) and writes only the report you ask for with `--output`. It makes no network
requests and never runs project code. Reports that fit this policy include, for example: a crafted
project file that makes reviewready read outside the project, write outside the `--output` file,
run code, hang or exhaust memory, or print terminal escape sequences or Markdown links from file
names or plist values.
