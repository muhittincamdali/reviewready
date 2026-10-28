# reviewready

reviewready reads a native iOS, Flutter or React Native/Expo project and lists what App Review or
App Store Connect would turn away before you submit: missing or empty purpose strings, export
compliance, account creation without deletion, a third-party login without Sign in with Apple, the
App Store icon, the Xcode and iOS minimums and the privacy manifest. Every rule cites the Apple
page it rests on, and every finding comes with its fix. It reads files; it does not build, run or
change anything.

```sh
npm i -g https://github.com/muhittincamdali/reviewready/releases/download/v0.1.0/reviewready-0.1.0.tgz
reviewready
```

The package needs Node.js 22.12 or later. Homebrew
(`brew install muhittincamdali/tap/reviewready`) installs the same command; publishing to the npm
registry as `@mcamdali/reviewready` is planned.

## Guides

- [Purpose strings](../guides/purpose-strings.md)
- [Export compliance](../guides/export-compliance.md)
- [Account deletion and login services](../guides/accounts-and-sign-in.md)
- [The App Store icon](../guides/app-icon.md)
- [The Xcode and iOS minimums](../guides/xcode-and-ios-minimums.md)
- [The privacy manifest](../guides/privacy-manifest.md)
- [Run reviewready in CI](../guides/ci.md)

## API

The command line is a thin layer over the package's exports, so the same checks run from
JavaScript:

```ts
import { render, scan } from '@mcamdali/reviewready';

const report = await scan('path/to/app', { ignore: ['RVW301'] });
console.log(report.verdict.text, report.summary);
console.log(render(report, 'markdown'));
```

Start with {@link scan} and {@link render}; the JSON report is described by {@link Report}. Its
`schemaVersion` is 0 until the layout is declared stable in 1.0. The rule data behind every finding
is {@link RuleData}, available as {@link RULE_DATA}.
