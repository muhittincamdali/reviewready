# Account deletion and login services (RVW301, RVW401)

Two guidelines decide what an app with accounts has to offer. reviewready reads the app's code,
strings and packages for each; both rules are heuristics and say so in their findings.

## RVW301: account creation needs account deletion

Guideline [5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage):
"If your app supports account creation, you must also offer account deletion within the app."
Apple's page [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/)
adds what that means:

- Make the option easy to find, usually in the account settings.
- Delete the account record with its personal data; only deactivating it is not enough.
- If deletion finishes on a website, link straight to that page.
- If the app uses Sign in with Apple, revoke the user's tokens with the
  [Sign in with Apple REST API](https://developer.apple.com/documentation/signinwithapplerestapi/revoke-tokens).

### What reviewready looks for

| Account creation                                                                                                                                                                   | Account deletion                                                                                                                                                                                                          |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `createUser(withEmail:)`, `createUserWithEmailAndPassword`, `auth.signUp(`, `Amplify.Auth.signUp`, Clerk's `useSignUp` / `signUp.create`, or the texts "Create account", "Sign up" | `deleteAccount`, `deleteUser`, `removeAccount`, `user.delete()` / `currentUser?.delete()`, or "Delete account", "Remove my account", `delete-account` in the code or the strings files (`.strings`, `.xcstrings`, `.arb`) |

The finding names the first creation call and its line. If the app deletes accounts through words
or calls reviewready does not know, turn the rule off with `--ignore RVW301`.

## RVW401: a third-party login needs an equivalent option

Guideline [4.8 Login Services](https://developer.apple.com/app-store/review/guidelines/#login-services):
an app that uses a third-party or social login service "to set up or authenticate the user's
primary account with the app must also offer as an equivalent option another login service" that:

- limits data collection to the user's name and email address;
- lets users keep their email address private;
- does not collect interactions with the app for advertising without consent.

[Sign in with Apple](https://developer.apple.com/sign-in-with-apple/) is such a service. The
guideline's exceptions: an app that only uses the company's own account system, an alternative app
marketplace's own login, education, enterprise or business accounts, government or industry
citizen ID, and clients for a specific third-party service.

### What reviewready looks for

| Third-party login                                                                                                                                                                                                                                                | Sign in with Apple                                                                                                                                                                                                                                         |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Google Sign-In, Facebook Login, LINE, Kakao, Log in with X: by package (`google_sign_in`, `@react-native-google-signin/google-signin`, `react-native-fbsdk-next`, …), native import (`import GoogleSignIn`, `FBSDKLoginKit`) or Expo AuthSession provider import | `sign_in_with_apple`, `expo-apple-authentication`, `@invertase/react-native-apple-authentication`, the `com.apple.developer.applesignin` entitlement, `ios.usesAppleSignIn` in app.json, `ASAuthorizationAppleIDProvider`, or an `"apple.com"` provider ID |

### Fix it

- **Native:** add the Sign in with Apple capability and an `ASAuthorizationAppleIDProvider`
  request (`SignInWithAppleButton` in SwiftUI).
- **Flutter:** [sign_in_with_apple](https://pub.dev/packages/sign_in_with_apple) and the
  capability in `ios/Runner`.
- **React Native:** [@invertase/react-native-apple-authentication](https://github.com/invertase/react-native-apple-authentication).
- **Expo:** [expo-apple-authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
  and `"usesAppleSignIn": true` under `ios` in app.json.

If the app falls under an exception, or offers another login with the three features, use
`--ignore RVW401`.
