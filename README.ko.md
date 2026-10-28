<!-- i18n-source: README.md@838014780258973fb32ae6831b958dd6cf214ee5 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg" alt="reviewready: 제출하기 전에 CI에서 App Review 거절 사유를 잡아내고, 규칙마다 근거가 되는 Apple 출처와 해결 방법을 보여 줍니다."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml/badge.svg" alt="CI 상태"></a>
<a href="https://github.com/muhittincamdali/reviewready/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg" alt="최신 버전: v0.1.1"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg" alt="언어 버전: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg" alt="라이선스: MIT"></picture></a>
</p>

<p align="center">
<a href="#빠른-시작"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-ko-light.svg" alt="시작하기"></picture></a>
<a href="https://muhittincamdali.github.io/reviewready/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-ko-light.svg" alt="문서"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-ko-light.svg" alt="가이드"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-ko-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-ko-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-ko-light.svg" alt="예제"></picture></a>
</p>

> 이 문서는 영어 README의 번역본입니다. 내용이 다를 경우 영어 버전이 최신입니다.

<!-- brand:end -->

프로젝트 파일만 봐도 드러나는 App Review 거절 사유(목적 문자열(purpose string) 누락, 알파 채널이 있는 App Store 아이콘, 2026년 4월 28일부터 App Store Connect가 받아 주는 버전보다 오래된 Xcode)는 제출하기 전에 CI에서 잡아낼 수 있습니다. reviewready는 네이티브 iOS, Flutter, React Native/Expo 프로젝트를 읽어 이러한 문제를 나열하고, 각 문제에 근거가 되는 Apple 페이지와 프로젝트 유형에 맞는 해결 방법을 함께 보여 줍니다. 규칙 ID와 종료 코드를 갖춘 결정적(deterministic) CLI이며, AI의 추측도, 계정도, 업로드도 없습니다. 프로젝트 파일을 읽기만 하고, 빌드하거나 실행하거나 변경하지 않습니다.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-native-rejected-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-native-rejected-light.svg"><img src="docs/media/demo-native-rejected-light.svg" alt="SwiftUI 앱에서 실행한 reviewready --brief: NSCameraUsageDescription 없이 카메라 사용(RVW101), 비어 있는 사진 보관함 목적 문자열(RVW103), 알파 채널이 있는 App Store 아이콘(RVW503), Xcode 16.4 고정(RVW601), iOS 12.0 배포 타깃(RVW602), 그리고 자리 표시자 목적 문자열, 수출 규정 준수, 계정 삭제, Sign in with Apple 없는 Google Sign-In, 앱에 포함되지 않은 개인정보 보호 매니페스트에 대한 경고"></picture>

<sub>실제 CLI에서 녹화했습니다. 대상은 <a href="fixtures/native-swiftui-rejected">native-swiftui-rejected
fixture</a>로, 규칙마다 문제 하나씩을 넣어 테스트용으로 작성한 SwiftUI 앱입니다(<code>npm run demo</code>).</sub>

## 주요 기능

- **모든 규칙이 출처를 밝힙니다.** 규칙은 데이터([rules/app-review.json](rules/app-review.json))이며, Apple 문서, App Review Guidelines, Apple의 Upcoming Requirements 페이지(2026년 10월 28일 확인)로 연결됩니다. 규칙에 Apple 출처가 없거나 존재하지 않는 가이드를 가리키면 테스트가 실패합니다.
- **앱이 실제로 사용하는 기능에 맞춰 목적 문자열을 확인합니다.** Swift와 Objective-C 코드가 호출하는 API, 15개의 Flutter 패키지와 10개의 npm 패키지(각 패키지 README가 요구하는 키 포함), Podfile이 permission_handler와 react-native-permissions를 위해 컴파일에 포함하는 권한, 그리고 Expo config plugin이 기록할 내용(기본 문구 포함)이 대상입니다.
- **시뮬레이터에서 확인했습니다.** `NSContactsUsageDescription`이 없으면 검증용 앱은 iOS 27.0 Simulator에서 시스템이 보내는 메시지와 함께 비정상 종료됩니다. reviewready가 알려 주는 대로 고치면 권한 요청 창이 표시됩니다. 녹화 영상과 스크린샷은 저장소에 있습니다.
- **프로젝트 유형에 맞는 해결 방법을 알려 줍니다.** Info.plist, build setting, app.json 중 해당하는 곳에 대한 방법이며, 규칙 영역마다 가이드가 있습니다.
- **CI에 맞게 만들었습니다.** 터미널, 일반 텍스트, Markdown, JSON 보고서, 각 검사와 그 결과(발견, 통과, 검사하지 않음, 무시됨)를 모두 담은 목록, 규칙별 `--ignore`, 그리고 종료 코드(0은 문제 없음, 1은 발견 사항 있음, 2는 사용법 오류)를 제공합니다.

## 빠른 시작

**1. reviewready를 설치하세요.** [Node.js](https://nodejs.org/) 22.12 이상이 필요합니다(`node --version`으로 확인할 수 있고, Mac에서는 `brew install node`로 설치합니다). 그런 다음 npm에서 패키지를 설치하세요.

```sh
npm i -g @mcamdali/reviewready
```

**2. 앱 폴더에서 터미널을 여세요.** `.xcodeproj`, `pubspec.yaml`, `package.json` 중 하나가 있는 폴더입니다.

```sh
cd path/to/YourApp
```

**3. reviewready를 실행하세요.**

```sh
reviewready
```

먼저 **ERROR** 항목부터 처리하세요. App Review나 App Store Connect가 이 항목들 때문에 앱을 반려합니다. 그다음으로 App Review가 지적할 수 있는 **WARNING** 항목을 처리하세요. 각 항목은 해결 방법을 “How to fix” 목록에 알려 주고, 근거가 된 Apple 페이지로 연결됩니다.

Homebrew는 같은 패키지를 Node.js와 함께 설치합니다: `brew install muhittincamdali/tap/reviewready`. 설치하지 않고 `npx @mcamdali/reviewready`로 npm에서 바로 실행할 수도 있습니다.

## reviewready가 검사하는 항목

| 규칙   | 심각도  | 발견 사항                                                                                                    | 출처           |
| ------ | ------- | ------------------------------------------------------------------------------------------------------------ | -------------- |
| RVW101 | error   | 앱 코드나 앱에 포함된 패키지가 보호된 리소스를 사용하는데, Info.plist에 그에 대한 목적 문자열이 없음         | [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), 가이드라인 [5.1.1(ii)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage) |
| RVW102 | warning | 패키지가 특정 기능(예: 비디오 녹화)을 위해 목적 문자열을 필요로 함                                           | 위와 같음 |
| RVW103 | error   | 목적 문자열이 비어 있거나, 공백뿐이거나, 문자열이 아니거나, 4,000바이트 이상임                               | 위와 같음 |
| RVW104 | warning | 목적 문자열이 자리 표시자, README의 예시, 또는 config plugin의 기본 문구임                                   | 위와 같음 |
| RVW201 | warning | `ITSAppUsesNonExemptEncryption`이 없음: App Store Connect는 빌드마다 수출 규정 준수 질문을 함                | [ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption) |
| RVW301 | warning | 앱이 계정을 만드는데 계정 삭제 기능을 찾을 수 없음                                                           | 가이드라인 [5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Offering account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) |
| RVW401 | warning | 서드파티 로그인(Google, Facebook, LINE, Kakao, X)이 있는데 Sign in with Apple 또는 그에 상응하는 수단이 없음 | 가이드라인 [4.8](https://developer.apple.com/app-store/review/guidelines/#login-services) |
| RVW501 | error   | App Store 아이콘(1024 × 1024)이 없음                                                                         | [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon) |
| RVW502 | error   | App Store 아이콘이 1024 × 1024가 아님                                                                        | 위와 같음 |
| RVW503 | error   | App Store 아이콘에 알파 채널이 있어 App Store Connect가 업로드를 거부함                                      | [Apple Developer Forums thread 795411](https://developer.apple.com/forums/thread/795411) (90717 메시지) |
| RVW601 | error   | 빌드 파일이 26보다 낮은 Xcode를 고정함(2026년 4월 28일부터 적용되는 최소 버전)                               | [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/) |
| RVW602 | error   | 배포 타깃이 iOS 13 미만임(2026년 9월 9일부터 적용되는 최소 버전)                                             | 위와 같음 |
| RVW701 | warning | 앱에 개인정보 보호 매니페스트가 없음                                                                         | [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) |
| RVW702 | warning | 개인정보 보호 매니페스트가 iOS 폴더에는 있지만 앱 타깃에는 없음                                              | 위와 같음 |

RVW301과 RVW401은 앱의 호출, 문자열, 패키지를 살펴보는 휴리스틱이며, 발견 사항에도 그렇게 표시됩니다. 개인정보 보호 매니페스트는 존재 여부만 확인합니다. 매니페스트에 무엇이 선언되어 있는지는 이를 깊이 읽는 도구에 맡깁니다.

2026년 10월 28일 현재 Apple은 Upcoming Requirements 페이지와 개발자 뉴스에서 Xcode 26 이후의 SDK 최소 버전을 발표하지 않았습니다. 그래서 reviewready는 이를 검사하지 않으며, Apple이 발표하면 그 내용을 알려 주는 페이지와 함께 규칙 데이터에 추가합니다.

## 시뮬레이터에서

[test/simulator/contacts-probe](test/simulator/contacts-probe)의 검증용 앱은 열릴 때 연락처 접근 권한을 요청합니다. reviewready는 이 앱에 RVW101(그리고 개인정보 보호 매니페스트에 대한 RVW702)을 보고합니다. [scripts/simulator-check.sh](scripts/simulator-check.sh)는 이 앱을 Xcode 27.1로 빌드하고, iOS 27.0이 설치된 iPhone 17 시뮬레이터에서 커밋된 그대로의 상태와 reviewready의 두 가지 수정을 적용한 상태로 각각 실행했습니다.

| 변형                                | 실행 5초 후                                            | 시스템 로그                                                                                                                                                                     |
| ----------------------------------- | ------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NSContactsUsageDescription` 없음   | 앱이 종료됨                                            | "This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSContactsUsageDescription key …" |
| 키 있음, 매니페스트가 타깃에 포함됨 | 실행 중이며 연락처 권한 요청 창과 목적 문자열이 표시됨 | 없음                                                                                                                                                                            |

<p align="center"><img src="docs/media/simulator/contacts-probe-ios27.png" width="560" alt="Xcode 27.1로 빌드해 iOS 27.0이 설치된 iPhone 17 시뮬레이터에서 실행한 연락처 검증용 앱. 왼쪽: NSContactsUsageDescription이 없어 앱이 비정상 종료되어 홈 화면으로 돌아간 모습. 오른쪽: 키를 추가하자 Allow Probe to access your contacts 권한 요청 창에 목적 문자열 Probe shows which of your friends already use it이 표시된 모습."></p>

두 번의 실행 결과 전체는 [docs/media/simulator](docs/media/simulator)에 있습니다.

## 설치

빠른 시작의 명령은 `reviewready` 명령을 전역으로 설치합니다. 대신 프로젝트에 추가하려면 다음과 같이 하세요.

```sh
npm install --save-dev @mcamdali/reviewready
```

그러면 `npx reviewready`가 그 사본을 실행합니다. 패키지 이름은 `@mcamdali/reviewready`이며, 아래의 JavaScript API가 import하는 이름이기도 합니다. 각 GitHub 릴리스에는 패키지가 `reviewready-<version>.tgz`로, 검증용 `SHA256SUMS` 파일과 함께 들어 있습니다.

## 사용법

```text
reviewready [path] [options]
```

| 옵션                    | 설명                                                                  |
| ----------------------- | --------------------------------------------------------------------- |
| `path`                  | 프로젝트 폴더 또는 `.xcodeproj`. 기본값은 현재 폴더                   |
| `-f, --format <format>` | `tty`(기본값), `text`, `markdown`, `json`                             |
| `--json`                | `--format json`과 같음                                                |
| `-o, --output <file>`   | 보고서를 터미널 대신 파일에 기록                                      |
| `--fail-on <severity>`  | `warning`(기본값), `error`, `info`, `none`: 종료 코드가 1이 되는 기준 |
| `--ignore <rules>`      | 제외할 규칙 ID. 쉼표로 구분하며 여러 번 지정할 수 있음                |
| `--brief`               | 터미널 및 텍스트 보고서: 판정과 발견 사항만 표시                      |
| `--no-color`            | 터미널에서도 일반 텍스트로 출력(`NO_COLOR`와 `FORCE_COLOR`를 따름)    |

종료 코드: `0`은 `--fail-on` 이상의 항목이 없음, `1`은 그 이상의 발견 사항이 있음, `2`는 잘못된 인수, iOS 프로젝트를 찾지 못함 또는 예기치 않은 오류를 뜻합니다. Xcode 프로젝트, Info.plist, Expo 설정, 소스 폴더 또는 소스 파일을 읽지 못하면 판정은 “Not known”이 되고, `--fail-on none`을 지정하지 않는 한 종료 코드는 `1`입니다. reviewready는 읽지 못한 파일을 근거로 앱이 준비되었다고 판정하는 일이 없습니다.

reviewready는 iOS 앱을 스스로 찾습니다. 네이티브 앱은 루트 또는 한 단계 아래 폴더의 `.xcodeproj`를, Flutter, React Native, Expo 앱은 `ios/`를 사용합니다. 모든 iOS 앱 타깃의 Info.plist(XML 또는 바이너리), build setting, entitlement, 아이콘 세트, 개인정보 보호 매니페스트와 앱의 Swift, Objective-C, JavaScript, TypeScript, Dart 파일 및 strings 파일, Podfile, 그리고 Xcode 버전을 고정하는 파일을 읽습니다. `ios/`가 없는 Expo 앱은 app.json을 기준으로 검사합니다.

### Markdown 보고서를 코드와 함께 보관하기

```sh
reviewready --format markdown --output reviewready.md
```

### 스크립트에서 JSON 보고서 사용하기

```sh
reviewready --json > reviewready.json
```

각 발견 사항에는 `rule`, `severity`, `title`, `message`, `file`, `line`, `target`, 단계와 가이드를 담은 `fix`, 그리고 `sources`가 있습니다. `checks`는 모든 규칙을 결과와 함께 나열합니다. 이 구조는 `schemaVersion` 0이며 1.0 이전에 바뀔 수 있습니다. [examples/shell/errors-only.sh](examples/shell/errors-only.sh)는 `jq`로 이를 걸러 냅니다.

### CI에서 실행하기

[examples/github-actions/reviewready.yml](examples/github-actions/reviewready.yml)은 앱을 건드리는 모든 pull request의 작업 요약에 보고서를 추가하고, 오류가 있으면 작업을 실패시킵니다. Linux에서 실행되며 Xcode, 시뮬레이터, 빌드가 필요 없습니다. [CI 가이드](docs/guides/ci.md)를 참고하세요.

### JavaScript에서 사용하기

```js
import { render, scan } from '@mcamdali/reviewready';

const report = await scan('path/to/app', { ignore: ['RVW301'] });
console.log(report.verdict.text, report.summary);
console.log(render(report, 'markdown'));
```

실행해 볼 수 있는 버전은 [examples/api/summary.mjs](examples/api/summary.mjs)입니다.

## 데모

터미널 녹화는 각 툴체인으로 만든 프로젝트인 [fixture](fixtures/README.md)에 CLI를 실행한 결과입니다.

| 프로젝트                                                                              | 녹화                                                                                                                                              |
| ------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| 규칙마다 문제 하나씩 넣은 SwiftUI 앱                                                  | 이 페이지 맨 위                                                                                                                                   |
| camera, image_picker, permission_handler, Google Sign-In을 사용하는 Flutter 3.47.5 앱 | [라이트](docs/media/demo-flutter-light.svg) · [다크](docs/media/demo-flutter-dark.svg)                                                            |
| `ios/`가 없는 Expo SDK 58 앱: config plugin, Xcode 16.4가 설치된 EAS 이미지           | [라이트](docs/media/demo-expo-light.svg) · [다크](docs/media/demo-expo-dark.svg)                                                                  |
| 모든 검사를 통과하는 UIKit 앱                                                         | [라이트](docs/media/demo-native-ready-light.svg) · [다크](docs/media/demo-native-ready-dark.svg)                                                  |
| iOS 27.0에서 실행한 `scripts/simulator-check.sh`, 수정 전과 수정 후                   | [누락](docs/media/demo-simulator-contacts-probe-missing-27.0-light.svg) · [수정됨](docs/media/demo-simulator-contacts-probe-fixed-27.0-light.svg) |

2026년 10월 28일 Mac(Apple silicon, M5 Max)에서 Node.js 26.12로 측정했습니다. 여섯 개의 fixture에 대해 `node dist/cli/main.js --json`을 100회 실행하는 세트를 세 번 진행했으며, Node.js 시작 시간을 포함합니다. 세 세트의 중앙값은 0.113초, 0.111초, 0.112초였고, 가장 느린 실행은 0.19초였습니다. 테스트 스위트에는 331개의 테스트가 있습니다(`npm test`, 같은 기기).

## 상태

| 기능                                                                                                                                    | 상태        |
| --------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| 네이티브, Flutter, React Native, Expo 프로젝트 감지                                                                                     | 동작함      |
| Info.plist, build setting, entitlement, 아이콘, 개인정보 보호 매니페스트, 소스, 패키지, Podfile, Expo 설정에 대한 RVW101부터 RVW702까지 | 동작함      |
| 터미널, 텍스트, Markdown, JSON 보고서, 검사 목록, `--ignore`, `--brief`, `--fail-on` 종료 코드                                          | 동작함      |
| 외부 결제 링크와 In-App Purchase(guideline 3.1.1), 연령 등급 질문                                                                       | 계획됨(0.2) |
| `.xcconfig` build setting, 앱의 Swift 패키지와 Pod, `app.config.js`                                                                     | 계획됨(0.2) |
| SARIF 출력과 GitHub Action                                                                                                              | 계획됨(0.3) |
| Homebrew(`muhittincamdali/tap`)                                                                                                         | 동작함      |
| npm 레지스트리                                                                                                                          | 동작함      |
| 안정적인 규칙 스키마와 JSON 구조                                                                                                        | 계획됨(1.0) |

## 한계

- **컴파일러가 아니라 패턴입니다.** API, 계정, 로그인 규칙은 주석과 문자열을 비운 소스 텍스트에 대한 정규식입니다. 생성된 코드, 매크로 뒤에 숨은 코드, 실행 시점에 만들어지는 코드, 특이한 형태로 작성된 코드는 놓치거나 잘못 일치할 수 있습니다.
- **패키지는 이름으로 판단합니다.** 패키지의 목적 문자열은 규칙 데이터에 나열된 README에서, 거기에 명시된 버전을 기준으로 가져옵니다. 표에 없는 패키지와 `node_modules`, Pods, Swift 패키지 안의 네이티브 코드는 읽지 않습니다.
- **build setting은 project.pbxproj에서만 읽습니다.** `.xcconfig` 파일은 읽지 않습니다. 타깃의 Info.plist를 읽을 수 없으면 결과는 “not known”이 되고 보고서에 이유가 적힙니다.
- **Expo 설정은 JSON으로 읽습니다.** `app.config.js`와 `app.config.ts`는 실행하지 않으므로 결과가 “not known”이 됩니다. app.json은 읽습니다.
- **파일만 봅니다.** reviewready는 앱을 빌드하지 않고 화면도 보지 않으며, App Review는 파일에서 드러나는 것보다 더 많은 것을 보고 판단합니다. 이 저장소의 시뮬레이터 녹화는 Mac에서 실행한 `scripts/simulator-check.sh`의 결과입니다.
- **입력 크기에 제한이 있습니다.** 프로젝트는 pull request에서 올 수 있으므로, reviewready는 프로젝트 파일은 파일당 최대 32MB까지, 소스는 파일당 4MB, 총 20,000개 파일과 128MB까지, 12단계 아래까지의 폴더만 읽습니다. 읽지 않은 항목은 보고서의 노트에 나열되며 결과를 “not known”으로 만듭니다. 이 제한을 넘거나 프로젝트 밖으로 링크되었거나 읽을 수 없는 소스 파일, 그리고 더 깊거나 목록을 읽을 수 없거나 심볼릭 링크여서 탐색하지 못한 소스 폴더가 여기에 해당합니다(폴더 링크는 따라가지 않습니다). 패턴은 100만 자짜리 악의적 파일로 테스트했습니다.

## 문서

API 레퍼런스와 가이드: [muhittincamdali.github.io/reviewready](https://muhittincamdali.github.io/reviewready/)

## 가이드

- [목적 문자열](docs/guides/purpose-strings.md)
- [수출 규정 준수](docs/guides/export-compliance.md)
- [계정 삭제와 로그인 서비스](docs/guides/accounts-and-sign-in.md)
- [App Store 아이콘](docs/guides/app-icon.md)
- [Xcode와 iOS 최소 버전](docs/guides/xcode-and-ios-minimums.md)
- [개인정보 보호 매니페스트](docs/guides/privacy-manifest.md)
- [CI에서 reviewready 실행하기](docs/guides/ci.md)

## 출처

2026년 10월 28일에 확인한 자료입니다.

- Apple: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/)(최종 업데이트 2026년 10월 16일), [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/),
  [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources),
  [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/),
  [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations),
  [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files),
  [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon),
  그리고 각 규칙이 [rules/app-review.json](rules/app-review.json)에서 링크하는 페이지.
- Expo: [app config](https://docs.expo.dev/versions/latest/config/app/),
  [privacy manifests](https://docs.expo.dev/guides/apple-privacy/), 그리고 npm에 게시된 SDK 58 패키지의 config plugin과 `@expo/prebuild-config` 58.0.16.
- 규칙 데이터에 있는 각 Flutter 패키지와 npm 패키지의 README(명시된 버전 기준).

## 요구 사항

macOS, Linux, Windows에서 Node.js 22.12 이상. 프로젝트를 읽는 데는 그 밖의 것이 필요하지 않습니다. Xcode, Flutter, React Native 툴체인이 모두 필요 없습니다. 시뮬레이터 스크립트에는 Xcode와 XcodeGen이 설치된 Mac이 필요합니다.

## 아키텍처

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

- 규칙 데이터는 코드와 분리되어 있으며 버전이 관리됩니다(`app-review@2026.10.28`).
- CLI(`src/cli/`)는 인수를 파싱하고, 색상과 너비를 정하고, 종료 코드를 설정하는 일만 합니다.

## 관련 프로젝트

[glassready](https://github.com/muhittincamdali/glassready)는 iOS 27 SDK로 빌드한 앱에서 Liquid Glass가 무엇을 바꾸는지를, [sdkbump](https://github.com/muhittincamdali/sdkbump)는 앱이 UIScene 생명 주기로 실행되는지를 보여 줍니다. reviewready는 App Review가 앱을 통과시킬지에 답합니다.

## FAQ

**보고서에 문제가 없으면 앱이 심사를 통과한다는 뜻인가요?** 아닙니다. reviewready는 위에 나열한 규칙에 대해 파일이 보여 주는 내용만 검사합니다. App Review는 실행 중인 앱, 메타데이터, 그리고 어떤 파일로도 보여 줄 수 없는 가이드라인도 살펴봅니다.

**제 앱은 마이크를 사용하지 않는데 RVW102가 마이크를 요구합니다.** RVW102는 패키지가 특정 기능 하나에만 필요로 하는 키에 대한 경고입니다. 앱이 그 기능을 사용하지 않는다면 바꿀 것은 없습니다. `--ignore RVW102`를 사용하세요.

**reviewready가 제 프로젝트를 변경하나요?** 아니요. 프로젝트를 읽기만 하고, 요청한 보고서만 기록합니다.

## 기여하기

기여를 환영합니다. pull request를 열기 전에 [CONTRIBUTING.md](CONTRIBUTING.md)와 [행동 강령](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md)을 읽어 주세요. 보안 문제는 [SECURITY.md](SECURITY.md)에 설명된 대로 제보해 주세요.

## 라이선스

MIT 라이선스로 배포됩니다. 자세한 내용은 [LICENSE](LICENSE)를 참고하세요.
