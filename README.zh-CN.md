<!-- i18n-source: README.md@e3810ae0705b6913776ebab7be1d27df41028f3f status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg" alt="reviewready: Catches App Review rejections in CI before you submit, with the Apple source of every rule and the fix."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml/badge.svg" alt="CI 状态"></a>
<a href="https://github.com/muhittincamdali/reviewready/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg" alt="最新版本: v0.1.0"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg" alt="语言版本: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg" alt="许可证: MIT"></picture></a>
</p>

<p align="center">
<a href="#快速开始"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-zh-CN-light.svg" alt="开始使用"></picture></a>
<a href="https://muhittincamdali.github.io/reviewready/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-zh-CN-light.svg" alt="文档"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-zh-CN-light.svg" alt="指南"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-zh-CN-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-zh-CN-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-zh-CN-light.svg" alt="示例"></picture></a>
</p>

> 本文是英文 README 的译文。如两者内容不一致，以英文版为准。

<!-- brand:end -->

项目文件本身就能暴露的 App Review 拒审原因（缺少用途说明字符串、带 alpha 通道的 App Store 图标、版本低于 App Store Connect 自 2026 年 4 月 28 日起要求的 Xcode），可以在提交前通过 CI 发现。reviewready 会读取原生 iOS、Flutter 或 React Native/Expo 项目并列出这些问题，每个问题都附有所依据的 Apple 页面，以及适合你的项目类型的修复方法。它是一个确定性的 CLI，带有规则 ID 和退出码：没有 AI 猜测，无需账号，不上传任何内容。它只读取项目文件，不会构建、运行或修改任何东西。

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-native-rejected-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-native-rejected-light.svg"><img src="docs/media/demo-native-rejected-light.svg" alt="在一个 SwiftUI 应用上运行 reviewready --brief：使用相机但缺少 NSCameraUsageDescription（RVW101）、照片库用途说明字符串为空（RVW103）、App Store 图标带 alpha 通道（RVW503）、固定为 Xcode 16.4（RVW601）、部署目标为 iOS 12.0（RVW602），以及占位的用途说明字符串、出口合规、账号删除、使用 Google Sign-In 却没有 Sign in with Apple、应用中缺少隐私清单等警告"></picture>

<sub>录制自真实的 CLI，对象是 <a href="fixtures/native-swiftui-rejected">native-swiftui-rejected
fixture</a>：一个为测试编写的 SwiftUI 应用，每条规则对应一个问题（<code>npm run demo</code>）。</sub>

## 亮点

- **每条规则都标明来源。** 规则是数据（[rules/app-review.json](rules/app-review.json)），链接到 Apple 的文档、App Review Guidelines 和 Apple 的 Upcoming Requirements 页面（阅读于 2026 年 10 月 28 日）；如果某条规则没有 Apple 来源，或引用了不存在的指南，测试就会失败。
- **根据应用实际用到的功能给出用途说明字符串。** 包括 Swift 和 Objective-C 代码调用的 API、15 个 Flutter 包和 10 个 npm 包（附上各自 README 要求的键）、Podfile 为 permission_handler 和 react-native-permissions 编译进来的权限，以及 Expo 的 config plugin 会写入的内容（含默认文本）。
- **已在模拟器中验证。** 缺少 `NSContactsUsageDescription` 时，我们的探测应用在 iOS 27.0 Simulator 上会崩溃，并输出系统自己的提示；按 reviewready 给出的方法修复后，则会弹出授权提示。录屏和截图都在仓库中。
- **针对你的项目类型给出修复方法。** 可能是 Info.plist、build setting 或 app.json，每个规则领域都有对应的指南。
- **为 CI 而设计。** 提供终端、纯文本、Markdown 和 JSON 报告，列出每项检查及其结果（发现问题、通过、未检查、已忽略），支持按规则使用 `--ignore`，退出码为：0 表示无问题，1 表示有问题，2 表示用法错误。

## 快速开始

**1. 安装 reviewready。** 需要 [Node.js](https://nodejs.org/) 22.12 或更高版本（`node --version` 可查看版本；在 Mac 上可用 `brew install node` 安装）。然后从 [GitHub release](https://github.com/muhittincamdali/reviewready/releases) 安装该软件包：

```sh
npm i -g https://github.com/muhittincamdali/reviewready/releases/download/v0.1.0/reviewready-0.1.0.tgz
```

**2. 在应用所在的文件夹中打开终端**，也就是包含 `.xcodeproj`、`pubspec.yaml` 或 `package.json` 的那个文件夹：

```sh
cd path/to/YourApp
```

**3. 运行 reviewready：**

```sh
reviewready
```

先处理 **ERROR** 级别的问题：App Review 或 App Store Connect 会直接拒绝这些。然后处理 **WARNING** 级别的问题，App Review 可能会指出它们。每个问题都会在 “How to fix” 列表中给出修复方法，并链接到它所依据的 Apple 页面。

同一个软件包的 Homebrew 安装（`brew install muhittincamdali/tap/reviewready`）和 npm registry 安装（`npx @mcamdali/reviewready`）正在计划中。

## reviewready 检查哪些内容

| 规则   | 严重程度 | 问题                                                                                             | 来源           |
| ------ | -------- | ------------------------------------------------------------------------------------------------ | -------------- |
| RVW101 | error    | 应用代码或其包含的包使用了受保护的资源，但 Info.plist 中没有对应的用途说明字符串                 | [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), 准则 [5.1.1(ii)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage) |
| RVW102 | warning  | 某个包的某项功能（例如录制视频）需要用途说明字符串                                               | 同上 |
| RVW103 | error    | 用途说明字符串为空、只有空白字符、不是字符串，或达到 4,000 字节及以上                            | 同上 |
| RVW104 | warning  | 用途说明字符串是占位文本、README 中的示例，或 config plugin 的默认文本                           | 同上 |
| RVW201 | warning  | 缺少 `ITSAppUsesNonExemptEncryption`：App Store Connect 会对每个构建版本询问出口合规问题         | [ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption) |
| RVW301 | warning  | 应用会创建账号，但未发现账号删除功能                                                             | 准则 [5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Offering account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) |
| RVW401 | warning  | 使用了第三方登录（Google、Facebook、LINE、Kakao、X），却没有 Sign in with Apple 或同等的登录方式 | 准则 [4.8](https://developer.apple.com/app-store/review/guidelines/#login-services) |
| RVW501 | error    | 缺少 App Store 图标（1024 × 1024）                                                               | [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon) |
| RVW502 | error    | App Store 图标不是 1024 × 1024                                                                   | 同上 |
| RVW503 | error    | App Store 图标带有 alpha 通道，App Store Connect 会在上传时拒绝                                  | [Apple Developer Forums thread 795411](https://developer.apple.com/forums/thread/795411) （90717 错误信息） |
| RVW601 | error    | 某个构建文件固定的 Xcode 版本低于 26，该最低版本要求自 2026 年 4 月 28 日起生效                   | [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/) |
| RVW602 | error    | 部署目标低于 iOS 13，该最低版本要求自 2026 年 9 月 9 日起生效                                        | 同上 |
| RVW701 | warning  | 应用没有隐私清单                                                                                 | [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) |
| RVW702 | warning  | 隐私清单位于 iOS 文件夹中，但不在应用 target 里                                                  | 同上 |

RVW301 和 RVW401 是基于应用的调用、字符串和包做出的启发式判断，并会在问题说明中注明这一点。隐私清单只检查是否存在；其中声明了什么，留给能深入读取它的工具。

截至 2026 年 10 月 28 日，Apple 在 Upcoming Requirements 页面和开发者新闻中都没有公布 Xcode 26 之后的 SDK 最低版本要求，因此 reviewready 不检查这一项；等 Apple 公布后，会连同说明该要求的页面一起加入规则数据。

## 在模拟器中验证

[test/simulator/contacts-probe](test/simulator/contacts-probe) 中的探测应用会在打开时请求访问通讯录。reviewready 对它报告 RVW101（以及针对其隐私清单的 RVW702）。[scripts/simulator-check.sh](scripts/simulator-check.sh) 使用 Xcode 27.1 构建了它，并在运行 iOS 27.0 的 iPhone 17 模拟器上运行：先是按仓库中原样提交的版本，再是应用了 reviewready 两项修复的版本。

| 变体                              | 启动 5 秒后                                    | 系统日志                                                                                                                                                                        |
| --------------------------------- | ---------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 没有 `NSContactsUsageDescription` | 应用已退出                                     | "This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSContactsUsageDescription key …" |
| 加上该键，清单加入 target         | 正在运行，显示通讯录授权提示及其用途说明字符串 | 无                                                                                                                                                                              |

<p align="center"><img src="docs/media/simulator/contacts-probe-ios27.png" width="560" alt="在运行 iOS 27.0 的 iPhone 17 模拟器上使用 Xcode 27.1 构建的通讯录探测应用。左：没有 NSContactsUsageDescription，应用已崩溃并回到主屏幕。右：加上该键后，授权提示 Allow Probe to access your contacts 显示了用途说明字符串 Probe shows which of your friends already use it。"></p>

两次运行的完整输出在 [docs/media/simulator](docs/media/simulator) 中。

## 安装

“快速开始”中的命令会从 release 压缩包安装 `reviewready` 命令。如果想把它添加到某个项目中：

```sh
npm install --save-dev https://github.com/muhittincamdali/reviewready/releases/download/v0.1.0/reviewready-0.1.0.tgz
```

之后 `npx reviewready` 会运行这份副本。软件包的名称是 `@mcamdali/reviewready`，也就是下面的 JavaScript API 所导入的名称。每个 GitHub release 都以 `reviewready-<version>.tgz` 的形式提供该软件包，并附有用于校验的 `SHA256SUMS` 文件。

## 使用方法

```text
reviewready [path] [options]
```

| 选项                    | 作用                                                               |
| ----------------------- | ------------------------------------------------------------------ |
| `path`                  | 项目文件夹或 `.xcodeproj`；默认为当前文件夹                        |
| `-f, --format <format>` | `tty`（默认）、`text`、`markdown` 或 `json`                        |
| `--json`                | 等同于 `--format json`                                             |
| `-o, --output <file>`   | 将报告写入文件，而不是输出到终端                                   |
| `--fail-on <severity>`  | `warning`（默认）、`error`、`info` 或 `none`：决定何时返回退出码 1 |
| `--ignore <rules>`      | 要排除的规则 ID，以逗号分隔；可重复使用                            |
| `--brief`               | 终端和文本报告：只显示结论和问题                                   |
| `--no-color`            | 即使在终端中也输出纯文本（遵循 `NO_COLOR` 和 `FORCE_COLOR`）       |

退出码：`0` 表示没有达到或高于 `--fail-on` 级别的问题，`1` 表示存在达到或高于该级别的问题，`2` 表示参数错误、未找到 iOS 项目或发生意外错误。如果无法读取 Xcode 项目、Info.plist 或 Expo 配置，结论为 “Not known”，且除非指定 `--fail-on none`，退出码为 `1`：reviewready 绝不会基于没有读取到的文件，就判定一个应用已经就绪。

reviewready 会自动找到 iOS 应用：原生应用是根目录或下一级文件夹中的 `.xcodeproj`，Flutter、React Native 和 Expo 应用则是 `ios/`。它会读取每个 iOS 应用 target 的 Info.plist（XML 或二进制）、build setting 和 entitlement、图标集和隐私清单，应用的 Swift、Objective-C、JavaScript、TypeScript 和 Dart 文件以及 strings 文件，Podfile，还有固定 Xcode 版本的文件。没有 `ios/` 的 Expo 应用则根据 app.json 检查。

### 将 Markdown 报告与代码一起保存

```sh
reviewready --format markdown --output reviewready.md
```

### 在脚本中使用 JSON 报告

```sh
reviewready --json > reviewready.json
```

每个问题包含 `rule`、`severity`、`title`、`message`、`file`、`line`、`target`，带有步骤和指南的 `fix`，以及 `sources`；`checks` 列出每条规则及其结果。该结构为 `schemaVersion` 0，在 1.0 之前可能会变化。[examples/shell/errors-only.sh](examples/shell/errors-only.sh) 用 `jq` 对其进行过滤。

### 在 CI 中运行

[examples/github-actions/reviewready.yml](examples/github-actions/reviewready.yml) 会把报告添加到每个涉及该应用的 pull request 的作业摘要中，并在出现错误时让作业失败。它在 Linux 上运行：不需要 Xcode、模拟器或构建。参见 [CI 指南](docs/guides/ci.md)。

### 在 JavaScript 中使用

```js
import { render, scan } from '@mcamdali/reviewready';

const report = await scan('path/to/app', { ignore: ['RVW301'] });
console.log(report.verdict.text, report.summary);
console.log(render(report, 'markdown'));
```

可运行的版本见 [examples/api/summary.mjs](examples/api/summary.mjs)。

## 演示

终端录屏来自对 [fixtures](fixtures/README.md) 运行 CLI，这些项目分别用不同的工具链创建：

| 项目                                                                                   | 录屏                                                                                                                                              |
| -------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 每条规则对应一个问题的 SwiftUI 应用                                                    | 本页顶部                                                                                                                                          |
| 带有 camera、image_picker、permission_handler 和 Google Sign-In 的 Flutter 3.47.5 应用 | [浅色](docs/media/demo-flutter-light.svg) · [深色](docs/media/demo-flutter-dark.svg)                                                              |
| 没有 `ios/` 的 Expo SDK 58 应用：config plugin，带 Xcode 16.4 的 EAS 镜像              | [浅色](docs/media/demo-expo-light.svg) · [深色](docs/media/demo-expo-dark.svg)                                                                    |
| 通过所有检查的 UIKit 应用                                                              | [浅色](docs/media/demo-native-ready-light.svg) · [深色](docs/media/demo-native-ready-dark.svg)                                                    |
| 在 iOS 27.0 上运行 `scripts/simulator-check.sh`，修复前与修复后                        | [缺失](docs/media/demo-simulator-contacts-probe-missing-27.0-light.svg) · [已修复](docs/media/demo-simulator-contacts-probe-fixed-27.0-light.svg) |

测量于 2026 年 10 月 28 日，设备为 Mac（Apple silicon，M5 Max），Node.js 26.12：对六个 fixture 运行 `node dist/cli/main.js --json`，共三组、每组 100 次，包含 Node.js 的启动时间。三组的中位数分别为 0.110、0.112 和 0.109 秒；最慢的一次耗时 0.24 秒。测试套件共有 311 个测试（`npm test`，同一台机器）。

## 状态

| 功能                                                                                                             | 状态          |
| ---------------------------------------------------------------------------------------------------------------- | ------------- |
| 原生、Flutter、React Native 和 Expo 项目检测                                                                     | 已可用        |
| 针对 Info.plist、build setting、entitlement、图标、隐私清单、源代码、包、Podfile 和 Expo 配置的 RVW101 至 RVW702 | 已可用        |
| 终端、文本、Markdown 和 JSON 报告；检查列表；`--ignore`、`--brief`、`--fail-on` 退出码                           | 已可用        |
| 外部支付链接和 In-App Purchase（guideline 3.1.1）、年龄分级问题                                                  | 计划中（0.2） |
| `.xcconfig` build setting、应用的 Swift package 和 Pod、`app.config.js`                                          | 计划中（0.2） |
| SARIF 输出和 GitHub Action                                                                                       | 计划中（0.3） |
| npm registry 和 Homebrew                                                                                         | 计划中        |
| 稳定的规则 schema 和 JSON 结构                                                                                   | 计划中（1.0） |

## 局限

- **是模式匹配，不是编译器。** API、账号和登录相关的规则，是对已清除注释和字符串的源码文本做正则匹配。自动生成的代码、藏在宏后面的代码、运行时才构造的代码，或写法不常见的代码，可能被漏掉，也可能被误判。
- **按名称识别包。** 包的用途说明字符串来自规则数据中所列的 README，对应其中指明的版本。表中没有的包，以及 `node_modules`、Pods 和 Swift package 中的原生代码，都不会被读取。
- **build setting 只读取 project.pbxproj。** 不读取 `.xcconfig` 文件。当无法读取某个 target 的 Info.plist 时，结果为 “not known”，报告中会说明原因。
- **Expo 配置按 JSON 读取。** 不会运行 `app.config.js` 和 `app.config.ts`，因此它们会让结果变为 “not known”；app.json 则会被读取。
- **只看文件。** reviewready 不会构建应用，也不会查看它的界面，而 App Review 的判断依据比文件所能显示的更多。本仓库中的模拟器录屏来自在 Mac 上运行的 `scripts/simulator-check.sh`。
- **输入有上限。** 项目可能来自 pull request，因此 reviewready 对每个项目文件最多读取 32 MB；对于源代码，每个文件最多 4 MB，总共最多 20,000 个文件和 128 MB；被略过的内容会列在报告的备注中。这些匹配模式已在包含一百万个字符的恶意构造文件上测试过。

## 文档

API 参考和指南：[muhittincamdali.github.io/reviewready](https://muhittincamdali.github.io/reviewready/)。

## 指南

- [用途说明字符串](docs/guides/purpose-strings.md)
- [出口合规](docs/guides/export-compliance.md)
- [账号删除与登录服务](docs/guides/accounts-and-sign-in.md)
- [App Store 图标](docs/guides/app-icon.md)
- [Xcode 与 iOS 的最低版本](docs/guides/xcode-and-ios-minimums.md)
- [隐私清单](docs/guides/privacy-manifest.md)
- [在 CI 中运行 reviewready](docs/guides/ci.md)

## 资料来源

阅读于 2026 年 10 月 28 日：

- Apple：[App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)（最后更新于 2026 年 10 月 16 日）、[Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/)、
  [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources)、
  [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/)、
  [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations)、
  [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)、
  [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon)，
  以及每条规则在 [rules/app-review.json](rules/app-review.json) 中链接的页面。
- Expo：[app config](https://docs.expo.dev/versions/latest/config/app/)、
  [privacy manifests](https://docs.expo.dev/guides/apple-privacy/)，以及 npm 上已发布的 SDK 58 各包的 config plugin 和 `@expo/prebuild-config` 58.0.16。
- 规则数据中每个 Flutter 包和 npm 包的 README，取其中指明的版本。

## 系统要求

在 macOS、Linux 或 Windows 上使用 Node.js 22.12 或更高版本。读取项目不需要其他任何东西：不需要 Xcode、Flutter 或 React Native 工具链。模拟器脚本需要装有 Xcode 和 XcodeGen 的 Mac。

## 架构

```text
detectProject      native | flutter | react-native | expo, the iOS folder, the packages it ships
  ─► collectApp    app targets: Info.plist keys, build settings, entitlements, icon, privacy
                   manifests; Expo config, Podfile permissions, pinned Xcode versions, sources
  ─► checkApp      RVW101–104 purpose strings · RVW201 export compliance · RVW301/401 accounts
                   · RVW501–503 icon · RVW601/602 minimums · RVW701/702 privacy manifest
                   rules/app-review.json: rule text, fixes, sources and tables (validated with zod)
  ─► scan          findings, verdict, the result of every check, notes
  ─► render        tty | text | markdown | json
```

- 规则数据与代码分离，并带有版本号（`app-review@2026.10.28`）。
- CLI（`src/cli/`）只负责解析参数、选择颜色和宽度，以及设置退出码。

## 相关项目

[glassready](https://github.com/muhittincamdali/glassready) 显示 Liquid Glass 会给使用 iOS 27 SDK 构建的应用带来哪些变化，[sdkbump](https://github.com/muhittincamdali/sdkbump) 则检查应用能否使用 UIScene 生命周期启动。reviewready 回答的是：App Review 会不会放行。

## 常见问题

**报告一切正常，是否意味着应用一定能通过审核？** 不是。reviewready 只针对上面列出的规则，检查文件所能显示的内容。App Review 还会查看实际运行的应用、它的元数据，以及任何文件都无法体现的准则。

**我的应用没有使用麦克风，但 RVW102 却要求麦克风权限。** RVW102 是一条警告，针对的是某个包仅为某项功能所需的键。如果应用没有使用该功能，就不需要做任何修改：使用 `--ignore RVW102`。

**reviewready 会修改我的项目吗？** 不会。它只读取项目，并且只写入你要求的报告。

## 参与贡献

欢迎参与贡献。提交 pull request 之前，请先阅读 [CONTRIBUTING.md](CONTRIBUTING.md) 和[行为准则](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md)。如发现安全问题，请按照 [SECURITY.md](SECURITY.md) 中的说明报告。

## 许可证

基于 MIT 许可证发布。详见 [LICENSE](LICENSE)。
