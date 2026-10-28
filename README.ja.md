<!-- i18n-source: README.md@4f0c5c0678109a70c5b44246d1e07e9b463cafe3 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg" alt="reviewready：提出前に CI で App Review のリジェクト要因を検出し、各ルールの根拠となる Apple のページと対処方法を示します。"></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml/badge.svg" alt="CI ステータス"></a>
<a href="https://github.com/muhittincamdali/reviewready/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg" alt="最新バージョン: v0.1.1"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg" alt="言語バージョン: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg" alt="ライセンス: MIT"></picture></a>
</p>

<p align="center">
<a href="#クイックスタート"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-ja-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-ja-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-ja-light.svg" alt="はじめる"></picture></a>
<a href="https://muhittincamdali.github.io/reviewready/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-ja-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-ja-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-ja-light.svg" alt="ドキュメント"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-ja-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-ja-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-ja-light.svg" alt="ガイド"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-ja-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-ja-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-ja-light.svg" alt="サンプル"></picture></a>
</p>

> このドキュメントは英語版 README の翻訳です。内容が異なる場合は英語版が最新です。

<!-- brand:end -->

プロジェクトのファイルを見ればわかる App Review のリジェクト要因（purpose string の欠落、アルファチャンネルを含む App Store アイコン、2026 年 4 月 28 日以降に App Store Connect が受け付ける Xcode より古い Xcode）は、提出前に CI で検出できます。reviewready はネイティブ iOS、Flutter、React Native/Expo のプロジェクトを読み取ってそれらを一覧にし、各項目に根拠となる Apple のページと、プロジェクトの種類に合わせた対処方法を添えます。ルール ID と終了コードを備えた決定論的な CLI で、AI による推測も、アカウントも、アップロードも必要ありません。読むのはプロジェクトのファイルだけで、ビルドも実行も変更も行いません。

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-native-rejected-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-native-rejected-light.svg"><img src="docs/media/demo-native-rejected-light.svg" alt="SwiftUI アプリに対する reviewready --brief の出力。NSCameraUsageDescription のないカメラ利用（RVW101）、空の写真ライブラリ用 purpose string（RVW103）、アルファチャンネルを含む App Store アイコン（RVW503）、Xcode 16.4 の固定（RVW601）、iOS 12.0 のデプロイメントターゲット（RVW602）に加え、プレースホルダーの purpose string、輸出コンプライアンス、アカウント削除、Sign in with Apple のない Google Sign-In、アプリに含まれていないプライバシーマニフェストに関する警告"></picture>

<sub>実際の CLI から記録したものです。対象は <a href="fixtures/native-swiftui-rejected">native-swiftui-rejected
fixture</a> で、テスト用に書かれた、ルールごとに 1 つの問題を含む SwiftUI アプリです（<code>npm run demo</code>）。</sub>

## 主な特長

- **すべてのルールが出典を示します。** ルールはデータ（[rules/app-review.json](rules/app-review.json)）で、Apple のドキュメント、App Review Guidelines、Apple の Upcoming Requirements ページ（2026 年 10 月 28 日に確認）にリンクしています。ルールに Apple の出典がない場合や、存在しないガイドを指している場合は、テストが失敗します。
- **アプリが実際に使うものから purpose string を判定します。** Swift と Objective-C のコードが呼び出す API、15 の Flutter パッケージと 10 の npm パッケージ（それぞれの README が求めるキー付き）、Podfile が permission_handler や react-native-permissions のためにコンパイルに含める権限、そして Expo の config plugin が書き込む内容（デフォルトのテキストを含む）が対象です。
- **シミュレータで確認済みです。** `NSContactsUsageDescription` がないと、検証用アプリは iOS 27.0 Simulator でシステム自身のメッセージとともにクラッシュします。reviewready が示す修正を加えると、許可のプロンプトが表示されます。録画とスクリーンショットはリポジトリに含まれています。
- **プロジェクトの種類に合った対処方法を示します。** Info.plist、build setting、app.json のいずれかで、ルールの分野ごとにガイドがあります。
- **CI 向けに作られています。** ターミナル、プレーンテキスト、Markdown、JSON のレポート、すべてのチェックを結果（検出、合格、未チェック、無視）とともに並べた一覧、ルール単位の `--ignore`、そして終了コード（0 は問題なし、1 は検出あり、2 は使い方の誤り）を備えています。

## クイックスタート

**1. reviewready をインストールします。** [Node.js](https://nodejs.org/) 22.12 以降が必要です（`node --version` で確認できます。Mac では `brew install node` でインストールできます）。続いて、[npm](https://www.npmjs.com/package/@mcamdali/reviewready) からパッケージをインストールします。

```sh
npm i -g @mcamdali/reviewready
```

**2. アプリのフォルダでターミナルを開きます。** `.xcodeproj`、`pubspec.yaml`、`package.json` のいずれかがあるフォルダです。

```sh
cd path/to/YourApp
```

**3. reviewready を実行します。**

```sh
reviewready
```

まず **ERROR** の項目から対処してください。これらは App Review または App Store Connect で差し戻されます。次に、App Review が指摘する可能性のある **WARNING** の項目に進みます。各項目には対処方法が “How to fix” リストに示され、根拠となる Apple のページへのリンクが付いています。

Homebrew では同じパッケージを Node.js とともにインストールできます：`brew install muhittincamdali/tap/reviewready`。インストールせずに `npx @mcamdali/reviewready` で npm から実行することもできます。

## reviewready がチェックする内容

| ルール | 重大度  | 検出内容                                                                                                                      | 出典           |
| ------ | ------- | ----------------------------------------------------------------------------------------------------------------------------- | -------------- |
| RVW101 | error   | アプリのコード、または同梱しているパッケージが保護されたリソースを使っているのに、Info.plist に対応する purpose string がない | [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), ガイドライン [5.1.1(ii)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage) |
| RVW102 | warning | パッケージが、ある機能（たとえばビデオ録画）のために purpose string を必要としている                                          | 同上 |
| RVW103 | error   | purpose string が空、空白のみ、文字列ではない、または 4,000 バイト以上である                                                  | 同上 |
| RVW104 | warning | purpose string がプレースホルダー、README のサンプル、または config plugin のデフォルトテキストである                         | 同上 |
| RVW201 | warning | `ITSAppUsesNonExemptEncryption` がない：App Store Connect はビルドごとに輸出コンプライアンスの質問をする                      | [ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption) |
| RVW301 | warning | アプリがアカウントを作成するのに、アカウント削除の機能が見つからない                                                          | ガイドライン [5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Offering account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) |
| RVW401 | warning | サードパーティのログイン（Google、Facebook、LINE、Kakao、X）があるのに、Sign in with Apple またはそれに相当するものがない     | ガイドライン [4.8](https://developer.apple.com/app-store/review/guidelines/#login-services) |
| RVW501 | error   | App Store 用アイコン（1024 × 1024）がない                                                                                     | [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon) |
| RVW502 | error   | App Store 用アイコンが 1024 × 1024 ではない                                                                                   | 同上 |
| RVW503 | error   | App Store 用アイコンにアルファチャンネルがあり、App Store Connect がアップロード時に拒否する                                  | [Apple Developer Forums thread 795411](https://developer.apple.com/forums/thread/795411) （90717 のメッセージ） |
| RVW601 | error   | ビルドファイルが 26 より古い Xcode を固定している（2026 年 4 月 28 日以降の最低バージョン）                                   | [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/) |
| RVW602 | error   | デプロイメントターゲットが iOS 13 未満（2026 年 9 月 9 日以降の最低バージョン）                                               | 同上 |
| RVW701 | warning | アプリにプライバシーマニフェストがない                                                                                        | [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) |
| RVW702 | warning | プライバシーマニフェストが iOS フォルダにあるが、アプリのターゲットに含まれていない                                           | 同上 |

RVW301 と RVW401 は、アプリの呼び出し、文字列、パッケージに基づくヒューリスティックで、検出結果にもその旨が記載されます。プライバシーマニフェストは存在の有無だけを確認します。宣言内容は、それを詳しく読み取るツールに任せています。

2026 年 10 月 28 日時点で、Apple は Upcoming Requirements ページにも開発者向けニュースにも、Xcode 26 より後の SDK 最低バージョンを発表していません。そのため reviewready はその確認を行いません。Apple が発表した時点で、それを示すページとともにルールデータに追加します。

## シミュレータでの確認

[test/simulator/contacts-probe](test/simulator/contacts-probe) の検証用アプリは、起動時に連絡先へのアクセスを求めます。reviewready はこれに対して RVW101（およびそのプライバシーマニフェストに対して RVW702）を報告します。[scripts/simulator-check.sh](scripts/simulator-check.sh) は Xcode 27.1 でこのアプリをビルドし、iOS 27.0 の iPhone 17 シミュレータで、コミットされたままの状態と reviewready の 2 つの修正を適用した状態の両方を実行しました。

| バリエーション                             | 起動 5 秒後                                                | システムのログ                                                                                                                                                                  |
| ------------------------------------------ | ---------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NSContactsUsageDescription` なし          | アプリが終了している                                       | "This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSContactsUsageDescription key …" |
| キーあり、マニフェストをターゲットに含める | 実行中で、連絡先のプロンプトと purpose string が表示される | なし                                                                                                                                                                            |

<p align="center"><img src="docs/media/simulator/contacts-probe-ios27.png" width="560" alt="Xcode 27.1 でビルドし、iOS 27.0 の iPhone 17 シミュレータで動かした連絡先の検証用アプリ。左：NSContactsUsageDescription がなく、アプリがクラッシュしてホーム画面に戻っている。右：キーを追加すると、プロンプト Allow Probe to access your contacts に purpose string Probe shows which of your friends already use it が表示される。"></p>

2 回の実行の出力は、すべて [docs/media/simulator](docs/media/simulator) にあります。

## インストール

「クイックスタート」のコマンドは、`reviewready` コマンドをグローバルにインストールします。代わりにプロジェクトへ追加する場合は次のとおりです。

```sh
npm install --save-dev @mcamdali/reviewready
```

以降は `npx reviewready` がそのコピーを実行します。パッケージ名は `@mcamdali/reviewready` で、後述の JavaScript API が import する名前です。各 GitHub リリースには、パッケージが `reviewready-<version>.tgz` として、検証用の `SHA256SUMS` ファイルとともに添付されています。

## 使い方

```text
reviewready [path] [options]
```

| オプション              | 内容                                                                        |
| ----------------------- | --------------------------------------------------------------------------- |
| `path`                  | プロジェクトのフォルダまたは `.xcodeproj`。デフォルトはカレントフォルダ     |
| `-f, --format <format>` | `tty`（デフォルト）、`text`、`markdown`、`json`                             |
| `--json`                | `--format json` と同じ                                                      |
| `-o, --output <file>`   | レポートをターミナルではなくファイルに書き出す                              |
| `--fail-on <severity>`  | `warning`（デフォルト）、`error`、`info`、`none`：終了コードを 1 にする条件 |
| `--ignore <rules>`      | 除外するルール ID。カンマ区切りで、複数回指定できる                         |
| `--brief`               | ターミナルとテキストのレポート：判定と検出結果のみ                          |
| `--no-color`            | ターミナルでもプレーンテキストにする（`NO_COLOR` と `FORCE_COLOR` に対応）  |

終了コード：`0` は `--fail-on` 以上の項目がないこと、`1` はそれ以上の検出があること、`2` は引数の誤り、iOS プロジェクトが見つからないこと、または予期しないエラーです。Xcode プロジェクト、Info.plist、Expo の設定、ソースフォルダ、ソースファイルのいずれかを読み取れなかった場合、判定は “Not known” となり、`--fail-on none` を指定しない限り終了コードは `1` になります。reviewready は、読み取っていないファイルをもとにアプリを「準備完了」と判定することはありません。

reviewready は iOS アプリを自動で見つけます。ネイティブアプリではルート、または 1 階層下の `.xcodeproj`、Flutter、React Native、Expo アプリでは `ios/` を使います。読み取る対象は、各 iOS アプリターゲットの Info.plist（XML またはバイナリ）、build setting、entitlement、アイコンセット、プライバシーマニフェスト、アプリの Swift、Objective-C、JavaScript、TypeScript、Dart のファイルと strings ファイル、Podfile、そして Xcode を固定しているファイルです。`ios/` のない Expo アプリは app.json からチェックします。

### Markdown レポートをコードと一緒に保存する

```sh
reviewready --format markdown --output reviewready.md
```

### スクリプトで JSON レポートを使う

```sh
reviewready --json > reviewready.json
```

各検出結果には、`rule`、`severity`、`title`、`message`、`file`、`line`、`target`、手順とガイドを含む `fix`、そして `sources` があります。`checks` は全ルールを結果とともに列挙します。この構造は `schemaVersion` 0 で、1.0 より前に変わる可能性があります。[examples/shell/errors-only.sh](examples/shell/errors-only.sh) は `jq` でこれを絞り込みます。

### CI で実行する

[examples/github-actions/reviewready.yml](examples/github-actions/reviewready.yml) は、アプリに触れるすべての pull request のジョブサマリーにレポートを追加し、エラーがあればジョブを失敗させます。Linux 上で動作し、Xcode、シミュレータ、ビルドは不要です。[CI ガイド](docs/guides/ci.md)を参照してください。

### JavaScript から使う

```js
import { render, scan } from '@mcamdali/reviewready';

const report = await scan('path/to/app', { ignore: ['RVW301'] });
console.log(report.verdict.text, report.summary);
console.log(render(report, 'markdown'));
```

実際に動かせるものは [examples/api/summary.mjs](examples/api/summary.mjs) です。

## デモ

ターミナルの録画は、各ツールチェーンで作ったプロジェクトである[フィクスチャ](fixtures/README.md)に対して CLI を実行したものです。

| プロジェクト                                                                          | 録画                                                                                                                                                |
| ------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| ルールごとに 1 つの問題がある SwiftUI アプリ                                          | このページの冒頭                                                                                                                                    |
| camera、image_picker、permission_handler、Google Sign-In を使う Flutter 3.47.5 アプリ | [ライト](docs/media/demo-flutter-light.svg) · [ダーク](docs/media/demo-flutter-dark.svg)                                                            |
| `ios/` のない Expo SDK 58 アプリ：config plugin、Xcode 16.4 の EAS イメージ           | [ライト](docs/media/demo-expo-light.svg) · [ダーク](docs/media/demo-expo-dark.svg)                                                                  |
| すべてのチェックに合格する UIKit アプリ                                               | [ライト](docs/media/demo-native-ready-light.svg) · [ダーク](docs/media/demo-native-ready-dark.svg)                                                  |
| iOS 27.0 での `scripts/simulator-check.sh`、修正なしと修正あり                        | [修正前](docs/media/demo-simulator-contacts-probe-missing-27.0-light.svg) · [修正後](docs/media/demo-simulator-contacts-probe-fixed-27.0-light.svg) |

2026 年 10 月 28 日に、Mac（Apple silicon、M5 Max）と Node.js 26.12 で計測しました。6 つのフィクスチャに対して `node dist/cli/main.js --json` を 100 回実行するセットを 3 回行い、Node.js の起動時間を含みます。3 セットの中央値は 0.113 秒、0.111 秒、0.112 秒で、最も遅かった実行は 0.19 秒でした。テストスイートには 331 件のテストがあります（`npm test`、同じマシン）。

## ステータス

| 機能                                                                                                                                          | ステータス    |
| --------------------------------------------------------------------------------------------------------------------------------------------- | ------------- |
| ネイティブ、Flutter、React Native、Expo のプロジェクト検出                                                                                    | 動作します    |
| Info.plist、build setting、entitlement、アイコン、プライバシーマニフェスト、ソース、パッケージ、Podfile、Expo の設定に対する RVW101 〜 RVW702 | 動作します    |
| ターミナル、テキスト、Markdown、JSON のレポート。チェック一覧。`--ignore`、`--brief`、`--fail-on` の終了コード                                | 動作します    |
| 外部決済リンクと In-App Purchase（guideline 3.1.1）、年齢制限レーティングの質問                                                               | 計画中（0.2） |
| `.xcconfig` の build setting、アプリの Swift パッケージと Pod、`app.config.js`                                                                | 計画中（0.2） |
| SARIF 出力と GitHub Action                                                                                                                    | 計画中（0.3） |
| Homebrew（`muhittincamdali/tap`）                                                                                                             | 動作します    |
| npm レジストリ                                                                                                                                | 動作します      |
| 安定したルールスキーマと JSON の構造                                                                                                          | 計画中（1.0） |

## 制限事項

- **パターンマッチングであり、コンパイラではありません。** API、アカウント、ログインに関するルールは、コメントと文字列を空白に置き換えたソーステキストに対する正規表現です。自動生成されたコード、マクロの裏に隠れたコード、実行時に組み立てられるコード、特殊な書き方をしたコードは、見逃されたり誤って一致したりすることがあります。
- **パッケージは名前で判定します。** パッケージの purpose string は、ルールデータに記載された README のうち、そこに示されたバージョンのものから取得します。表にないパッケージや、`node_modules`、Pods、Swift パッケージの中にあるネイティブコードは読み取りません。
- **build setting は project.pbxproj からのみ読み取ります。** `.xcconfig` ファイルは読み取りません。ターゲットの Info.plist を読み取れない場合、結果は “not known” となり、レポートに理由が記載されます。
- **Expo の設定は JSON として読み取ります。** `app.config.js` と `app.config.ts` は実行しないため、結果は “not known” になります。app.json は読み取ります。
- **対象はファイルのみです。** reviewready はアプリをビルドせず、画面も確認しません。また App Review は、ファイルからわかる以上の情報で判断します。このリポジトリのシミュレータ録画は、Mac で実行した `scripts/simulator-check.sh` によるものです。
- **入力には上限があります。** プロジェクトは pull request 由来の場合があるため、reviewready はプロジェクトファイルを 1 つあたり最大 32 MB まで、ソースについては 1 ファイルあたり 4 MB、合計 20,000 ファイルかつ 128 MB まで、12 階層下までのフォルダしか読みません。読み飛ばしたものはレポートのノートに記載され、結果は “not known” になります。対象は、これらの上限を超える、プロジェクト外へリンクされている、または読み取れないソースファイルと、それより深い、一覧を取得できない、またはシンボリックリンクであるために探索しなかったソースフォルダです（フォルダへのリンクはたどりません）。パターンは、100 万文字の悪意あるファイルでテスト済みです。

## ドキュメント

API リファレンスとガイド：[muhittincamdali.github.io/reviewready](https://muhittincamdali.github.io/reviewready/)

## ガイド

- [Purpose string](docs/guides/purpose-strings.md)
- [輸出コンプライアンス](docs/guides/export-compliance.md)
- [アカウント削除とログインサービス](docs/guides/accounts-and-sign-in.md)
- [App Store アイコン](docs/guides/app-icon.md)
- [Xcode と iOS の最低バージョン](docs/guides/xcode-and-ios-minimums.md)
- [プライバシーマニフェスト](docs/guides/privacy-manifest.md)
- [CI で reviewready を実行する](docs/guides/ci.md)

## 参考資料

2026 年 10 月 28 日に確認：

- Apple：[App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)（最終更新 2026 年 10 月 16 日）、[Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/)、
  [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources)、
  [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/)、
  [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations)、
  [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files)、
  [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon)、
  および各ルールが [rules/app-review.json](rules/app-review.json) でリンクしているページ。
- Expo：[app config](https://docs.expo.dev/versions/latest/config/app/)、
  [privacy manifests](https://docs.expo.dev/guides/apple-privacy/)、および npm で公開されている SDK 58 パッケージの config plugin と `@expo/prebuild-config` 58.0.16。
- ルールデータにある各 Flutter パッケージと npm パッケージの README（そこに示されたバージョンのもの）。

## 動作要件

macOS、Linux、Windows 上の Node.js 22.12 以降。プロジェクトの読み取りに、ほかのものは必要ありません。Xcode、Flutter、React Native のツールチェーンは不要です。シミュレータ用スクリプトには、Xcode と XcodeGen を入れた Mac が必要です。

## アーキテクチャ

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

- ルールデータはコードから分離されており、バージョン管理されています（`app-review@2026.10.28`）。
- CLI（`src/cli/`）は、引数の解析、色と幅の選択、終了コードの設定だけを行います。

## 関連プロジェクト

[glassready](https://github.com/muhittincamdali/glassready) は、iOS 27 SDK でビルドしたアプリで Liquid Glass によって何が変わるかを、[sdkbump](https://github.com/muhittincamdali/sdkbump) は、アプリが UIScene ライフサイクルで起動するかどうかを示します。reviewready は、App Review を通過できるかどうかに答えます。

## FAQ

**レポートに問題がなければ、審査を通過できるということですか？** いいえ。reviewready がチェックするのは、上に挙げたルールについて、ファイルからわかる範囲です。App Review は、実際に動作するアプリ、そのメタデータ、そしてファイルでは確認できないガイドラインも見ます。

**アプリはマイクを使わないのに、RVW102 がマイクを求めてきます。** RVW102 は、パッケージが特定の機能のためだけに必要とするキーに対する警告です。アプリがその機能を使っていないなら、何も変える必要はありません。`--ignore RVW102` を指定してください。

**reviewready はプロジェクトを変更しますか？** いいえ。プロジェクトを読み取り、指示されたレポートだけを書き出します。

## コントリビューション

コントリビューションを歓迎します。pull request を作成する前に、[CONTRIBUTING.md](CONTRIBUTING.md) と[行動規範](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md)をお読みください。セキュリティ上の問題は、[SECURITY.md](SECURITY.md) に記載の方法で報告してください。

## ライセンス

MIT ライセンスで公開しています。詳細は [LICENSE](LICENSE) を参照してください。
