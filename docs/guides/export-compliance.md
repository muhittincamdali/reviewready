# Export compliance (RVW201)

Every app uploaded to App Store Connect goes through export compliance: Apple's servers are in the
United States, and an app that uses, contains or implements encryption is an export of encryption
software. Apple's page [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations)
explains the key reviewready looks for:

> If you don't have the ITSAppUsesNonExemptEncryption key in your app's Info.plist file, App Store
> Connect walks you through an export compliance questionnaire every time you upload a new version
> of your app.
> ([ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption))

Until the questions are answered, the build waits in App Store Connect, which stops automated
TestFlight and release pipelines.

## Choose the value

- **NO** (`<false/>`): the app, with every library it links, uses no encryption, or only encryption
  that is exempt. Apple: "Typically, the use of encryption that's built into the operating
  system—for example, when your app makes HTTPS connections using URLSession—is exempt."
- **YES** (`<true/>`): the app uses non-exempt encryption, such as its own cryptography. Add
  `ITSEncryptionExportComplianceCode` with the code Apple gives you after it reviews your
  documentation.

reviewready only checks that the key is there; which value is right depends on what the app does,
and Apple's page
[Determine and upload app encryption documentation](https://developer.apple.com/help/app-store-connect/manage-app-information/determine-and-upload-app-encryption-documentation)
is the place to decide it.

## Where to set it

| Project                       | Setting                                                                         |
| ----------------------------- | ------------------------------------------------------------------------------- |
| Native, Flutter, React Native | `<key>ITSAppUsesNonExemptEncryption</key><false/>` in the target's Info.plist   |
| Generated Info.plist          | the `INFOPLIST_KEY_ITSAppUsesNonExemptEncryption` build setting (`NO` or `YES`) |
| Expo                          | `"ios": { "config": { "usesNonExemptEncryption": false } }` in app.json         |
