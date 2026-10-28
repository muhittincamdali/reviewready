<!-- i18n-source: README.md@838014780258973fb32ae6831b958dd6cf214ee5 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg" alt="reviewready: находит причины отклонения App Review в CI до отправки, с источником Apple для каждого правила и исправлением."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml/badge.svg" alt="Статус CI"></a>
<a href="https://github.com/muhittincamdali/reviewready/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg" alt="Последняя версия: v0.1.1"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg" alt="Версия языка: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg" alt="Лицензия: MIT"></picture></a>
</p>

<p align="center">
<a href="#быстрый-старт"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-ru-light.svg" alt="Начать"></picture></a>
<a href="https://muhittincamdali.github.io/reviewready/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-ru-light.svg" alt="Документация"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-ru-light.svg" alt="Руководства"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-ru-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-ru-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-ru-light.svg" alt="Примеры"></picture></a>
</p>

> Это перевод README на английском языке. Если они расходятся, актуальна английская версия.

<!-- brand:end -->

Отклонения App Review, которые видны уже по файлам проекта (отсутствующая строка назначения (purpose string), значок App Store с альфа-каналом, Xcode старее того, что App Store Connect принимает с 28 апреля 2026 года), можно поймать в CI до отправки. reviewready читает нативный iOS-проект, проект на Flutter или React Native/Expo и перечисляет такие проблемы: к каждой приложена страница Apple, на которой она основана, и исправление для вашего типа проекта. Это детерминированный CLI с идентификаторами правил и кодами завершения: без догадок ИИ, без аккаунта, без загрузки данных. Он читает файлы вашего проекта; ничего не собирает, не запускает и не изменяет.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-native-rejected-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-native-rejected-light.svg"><img src="docs/media/demo-native-rejected-light.svg" alt="reviewready --brief для приложения на SwiftUI: RVW101 камера без NSCameraUsageDescription, RVW103 пустая строка назначения для медиатеки, RVW503 значок App Store с альфа-каналом, RVW601 закреплён Xcode 16.4, RVW602 целевая версия развёртывания iOS 12.0, а также предупреждения о строке назначения-заглушке, соответствии экспортным требованиям, удалении аккаунта, Google Sign-In без Sign in with Apple и о манифесте конфиденциальности, не включённом в приложение"></picture>

<sub>Записано с настоящего CLI на <a href="fixtures/native-swiftui-rejected">фикстуре native-swiftui-rejected</a> — приложении на SwiftUI, написанном для тестов, с одной проблемой на каждое правило (<code>npm run demo</code>).</sub>

## Основные возможности

- **Каждое правило указывает источник.** Правила — это данные ([rules/app-review.json](rules/app-review.json)), которые ссылаются на документацию Apple, App Review Guidelines и страницу Apple Upcoming Requirements, прочитанные 28 октября 2026 года; тесты падают, если у правила нет источника Apple или оно называет несуществующее руководство.
- **Строки назначения — по тому, что приложение действительно использует.** API, которые вызывает его код на Swift и Objective-C, 15 пакетов Flutter и 10 пакетов npm (с ключом, который просит README каждого из них), разрешения, которые Podfile компилирует для permission_handler и react-native-permissions, и то, что запишут config plugins Expo, включая их тексты по умолчанию.
- **Проверено в симуляторе.** Без `NSContactsUsageDescription` наше пробное приложение падает в iOS 27.0 Simulator с собственным сообщением системы; с исправлением, которое предлагает reviewready, оно показывает запрос разрешения. Запись и скриншоты лежат в репозитории.
- **Исправление для вашего типа проекта.** Info.plist, build setting или app.json, с отдельным руководством для каждой области правил.
- **Сделано для CI.** Отчёты в терминале, обычным текстом, в Markdown и JSON, список каждой проверки с её результатом (найдено, пройдено, не проверялось, проигнорировано), `--ignore` для отдельных правил и коды завершения: 0 — всё чисто, 1 — есть замечания, 2 — ошибка использования.

## Быстрый старт

**1. Установите reviewready.** Вам нужен [Node.js](https://nodejs.org/) 22.12 или новее (`node --version` покажет версию; на Mac его устанавливает `brew install node`). Затем установите пакет из npm:

```sh
npm i -g @mcamdali/reviewready
```

**2. Откройте терминал в папке вашего приложения** — той, где лежит `.xcodeproj`, `pubspec.yaml` или `package.json`:

```sh
cd path/to/YourApp
```

**3. Запустите reviewready:**

```sh
reviewready
```

Начните с замечаний **ERROR**: App Review или App Store Connect отклонят приложение из-за них. Затем разберите замечания **WARNING**, на которые App Review может указать. Для каждого замечания исправление описано в списке «How to fix», а ссылка ведёт на страницу Apple, из которой оно взято.

Homebrew устанавливает тот же пакет вместе с Node.js: `brew install muhittincamdali/tap/reviewready`. Без установки его запускает из npm команда `npx @mcamdali/reviewready`.

## Что проверяет reviewready

| Правило | Серьёзность | Замечание                                                                                                               | Источник       |
| ------- | ----------- | ----------------------------------------------------------------------------------------------------------------------- | -------------- |
| RVW101  | error       | Код приложения или поставляемый с ним пакет использует защищённый ресурс, а в Info.plist для него нет строки назначения | [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), пункт [5.1.1(ii)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage) |
| RVW102  | warning     | Пакету нужна строка назначения для одной из его функций (например, для записи видео)                                    | то же |
| RVW103  | error       | Строка назначения пуста, состоит только из пробелов, не является строкой или занимает 4 000 байт и более                | то же |
| RVW104  | warning     | Строка назначения — заглушка, пример из README или текст по умолчанию из config plugin                                  | то же |
| RVW201  | warning     | Нет `ITSAppUsesNonExemptEncryption`: App Store Connect задаёт вопросы об экспортном соответствии для каждой сборки      | [ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption) |
| RVW301  | warning     | Приложение создаёт аккаунты, а удаления аккаунта не найдено                                                             | пункт [5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Offering account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) |
| RVW401  | warning     | Вход через стороннюю службу (Google, Facebook, LINE, Kakao, X) без Sign in with Apple или эквивалента                   | пункт [4.8](https://developer.apple.com/app-store/review/guidelines/#login-services) |
| RVW501  | error       | Нет значка App Store (1024 × 1024)                                                                                      | [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon) |
| RVW502  | error       | Размер значка App Store не равен 1024 × 1024                                                                                | то же |
| RVW503  | error       | У значка App Store есть альфа-канал, который App Store Connect отклоняет при загрузке                                   | [Apple Developer Forums thread 795411](https://developer.apple.com/forums/thread/795411) (сообщение 90717) |
| RVW601  | error       | Файл сборки закрепляет Xcode старее версии 26 — минимума с 28 апреля 2026 года                                          | [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/) |
| RVW602  | error       | Целевая версия развёртывания ниже iOS 13 — минимума с 9 сентября 2026 года                                              | то же |
| RVW701  | warning     | У приложения нет манифеста конфиденциальности                                                                           | [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) |
| RVW702  | warning     | Манифест конфиденциальности лежит в папке iOS, но не входит в таргет приложения                                         | то же |

RVW301 и RVW401 — эвристики по вызовам, строкам и пакетам приложения, и в своих замечаниях они об этом сообщают. Манифест конфиденциальности проверяется только на наличие; то, что в нём заявлено, оставлено инструментам, которые читают его подробно.

По состоянию на 28 октября 2026 года Apple не объявляла минимальную версию SDK после Xcode 26 ни на странице Upcoming Requirements, ни в новостях для разработчиков, поэтому reviewready ничего подобного не проверяет; когда Apple такую версию объявит, она попадёт в данные правил вместе со страницей, где об этом сказано.

## В симуляторе

Пробное приложение из [test/simulator/contacts-probe](test/simulator/contacts-probe) при открытии запрашивает доступ к контактам. reviewready сообщает для него RVW101 (и RVW702 для его манифеста конфиденциальности). [scripts/simulator-check.sh](scripts/simulator-check.sh) собрал его в Xcode 27.1 и запустил на симуляторе iPhone 17 с iOS 27.0 — в том виде, как оно лежит в репозитории, и с двумя исправлениями reviewready.

| Вариант                          | Через 5 секунд после запуска                                         | Что записала система                                                                                                                                                            |
| -------------------------------- | -------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Без `NSContactsUsageDescription` | приложение исчезло                                                   | "This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSContactsUsageDescription key …" |
| С ключом, манифест в таргете     | работает, показан запрос доступа к контактам и его строка назначения | ничего                                                                                                                                                                          |

<p align="center"><img src="docs/media/simulator/contacts-probe-ios27.png" width="560" alt="Пробное приложение для контактов на симуляторе iPhone 17 с iOS 27.0, собранное в Xcode 27.1. Слева: без NSContactsUsageDescription приложение упало и вернулось на главный экран. Справа: с ключом запрос Allow Probe to access your contacts показывает строку назначения Probe shows which of your friends already use it."></p>

Полный вывод обоих запусков лежит в [docs/media/simulator](docs/media/simulator).

## Установка

Команда из раздела «Быстрый старт» устанавливает команду `reviewready` глобально. Чтобы вместо этого добавить его в проект:

```sh
npm install --save-dev @mcamdali/reviewready
```

После этого `npx reviewready` запускает эту копию. Пакет называется `@mcamdali/reviewready` — это имя импортирует JavaScript API, описанный ниже. Каждый релиз на GitHub содержит пакет в виде `reviewready-<version>.tgz` и файл `SHA256SUMS` для его проверки.

## Использование

```text
reviewready [path] [options]
```

| Параметр                | Что делает                                                                               |
| ----------------------- | ---------------------------------------------------------------------------------------- |
| `path`                  | Папка проекта или `.xcodeproj`; по умолчанию — текущая папка                             |
| `-f, --format <format>` | `tty` (по умолчанию), `text`, `markdown` или `json`                                      |
| `--json`                | То же, что `--format json`                                                               |
| `-o, --output <file>`   | Записать отчёт в файл вместо терминала                                                   |
| `--fail-on <severity>`  | `warning` (по умолчанию), `error`, `info` или `none`: когда код завершения равен 1       |
| `--ignore <rules>`      | Идентификаторы правил, которые нужно пропустить, через запятую; параметр можно повторять |
| `--brief`               | Отчёты для терминала и текстовые: только вердикт и замечания                             |
| `--no-color`            | Обычный текст даже в терминале (`NO_COLOR` и `FORCE_COLOR` учитываются)                  |

Коды завершения: `0` — нет ничего на уровне `--fail-on` и выше, `1` — есть замечания на этом уровне и выше, `2` — неверные аргументы, iOS-проект не найден или произошла непредвиденная ошибка. Если проект Xcode, Info.plist, конфигурацию Expo, папку или файл с исходным кодом прочитать не удалось, вердикт — «Not known», а код завершения — `1`, если не указан `--fail-on none`: reviewready никогда не объявляет приложение готовым, опираясь на файлы, которые он не прочитал.

reviewready находит iOS-приложение сам: `.xcodeproj` в корне или на одну папку глубже — для нативных приложений, `ios/` — для приложений на Flutter, React Native и Expo. Он читает Info.plist каждого iOS-таргета приложения (XML или бинарный), build settings и entitlements, набор значков и манифест конфиденциальности, файлы приложения на Swift, Objective-C, JavaScript, TypeScript и Dart и его файлы строк (strings), Podfile и файлы, которые закрепляют версию Xcode. Приложение на Expo без `ios/` проверяется по app.json.

### Храните отчёт в Markdown вместе с кодом

```sh
reviewready --format markdown --output reviewready.md
```

### Используйте отчёт в JSON в скриптах

```sh
reviewready --json > reviewready.json
```

У каждого замечания есть `rule`, `severity`, `title`, `message`, `file`, `line`, `target`, `fix` с шагами и руководством и `sources`; `checks` перечисляет каждое правило с его результатом. Формат — `schemaVersion` 0, и до версии 1.0 он может измениться. [examples/shell/errors-only.sh](examples/shell/errors-only.sh) фильтрует его с помощью `jq`.

### Запуск в CI

[examples/github-actions/reviewready.yml](examples/github-actions/reviewready.yml) добавляет отчёт в сводку задания каждого pull request, затрагивающего приложение, и завершает задание ошибкой, если найдены ошибки. Он работает на Linux: Xcode, симулятор и сборка не нужны. См. [руководство по CI](docs/guides/ci.md).

### Из JavaScript

```js
import { render, scan } from '@mcamdali/reviewready';

const report = await scan('path/to/app', { ignore: ['RVW301'] });
console.log(report.verdict.text, report.summary);
console.log(render(report, 'markdown'));
```

Готовый к запуску вариант — [examples/api/summary.mjs](examples/api/summary.mjs).

## Демо

Записи терминала получены из CLI на [фикстурах](fixtures/README.md) — проектах, созданных каждым из инструментариев:

| Проект                                                                                   | Запись                                                                                                                                                     |
| ---------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Приложение на SwiftUI с одной проблемой на каждое правило                                | в начале этой страницы                                                                                                                                     |
| Приложение на Flutter 3.47.5 с camera, image_picker, permission_handler и Google Sign-In | [светлая](docs/media/demo-flutter-light.svg) · [тёмная](docs/media/demo-flutter-dark.svg)                                                                  |
| Приложение на Expo SDK 58 без `ios/`: config plugins, образ EAS с Xcode 16.4             | [светлая](docs/media/demo-expo-light.svg) · [тёмная](docs/media/demo-expo-dark.svg)                                                                        |
| Приложение на UIKit, проходящее все проверки                                             | [светлая](docs/media/demo-native-ready-light.svg) · [тёмная](docs/media/demo-native-ready-dark.svg)                                                        |
| `scripts/simulator-check.sh` на iOS 27.0, без исправлений и с ними                       | [без ключа](docs/media/demo-simulator-contacts-probe-missing-27.0-light.svg) · [исправлено](docs/media/demo-simulator-contacts-probe-fixed-27.0-light.svg) |

Измерено 28 октября 2026 года на Mac (Apple silicon, M5 Max) с Node.js 26.12: три серии по 100 запусков `node dist/cli/main.js --json` на шести фикстурах, включая запуск Node.js. Медианы трёх серий составили 0,113, 0,111 и 0,112 секунды; самый медленный запуск занял 0,19 секунды. В наборе тестов 331 теста (`npm test`, на той же машине).

## Статус

| Возможность                                                                                                                                              | Статус            |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------- |
| Определение нативных проектов, проектов на Flutter, React Native и Expo                                                                                  | работает          |
| RVW101–RVW702 для Info.plist, build settings, entitlements, значков, манифестов конфиденциальности, исходного кода, пакетов, Podfile и конфигурации Expo | работает          |
| Отчёты в терминале, текстовые, в Markdown и JSON; список проверок; коды завершения `--ignore`, `--brief` и `--fail-on`                                   | работает          |
| Внешние ссылки на оплату и In-App Purchase (guideline 3.1.1), вопросы о возрастном рейтинге                                                              | планируется (0.2) |
| Build settings из `.xcconfig`, пакеты Swift и Pods приложения, `app.config.js`                                                                           | планируется (0.2) |
| Вывод в формате SARIF и GitHub Action                                                                                                                    | планируется (0.3) |
| Homebrew (`muhittincamdali/tap`)                                                                                                                         | работает          |
| Реестр npm                                                                                                                                               | работает |
| Стабильная схема правил и формат JSON                                                                                                                    | планируется (1.0) |

## Ограничения

- **Шаблоны, а не компилятор.** Правила для API, аккаунтов и входа — это регулярные выражения по тексту исходного кода, из которого вычищены комментарии и строки. Код, который сгенерирован, спрятан за макросами, собирается во время выполнения или написан необычным образом, может быть пропущен или распознан по ошибке.
- **Пакеты — по названию.** Строки назначения пакета берутся из его README, как указано в данных правил, для версии, названной там. Пакеты, которых нет в таблице, и нативный код внутри `node_modules`, Pods и пакетов Swift не читаются.
- **Build settings — только из project.pbxproj.** Файлы `.xcconfig` не читаются. Если Info.plist таргета прочитать не удалось, результат — «not known», и отчёт объясняет причину.
- **Конфигурация Expo как JSON.** `app.config.js` и `app.config.ts` не выполняются, поэтому результат для них — «not known»; app.json читается.
- **Только файлы.** reviewready не собирает приложение и не смотрит на его экраны, а App Review принимает решение, опираясь на большее, чем показывают файлы. Записи симулятора в этом репозитории получены из `scripts/simulator-check.sh`, запущенного на Mac.
- **Ограниченный ввод.** Проект может прийти из pull request, поэтому reviewready читает не более 32 МБ на файл проекта, а из исходного кода — 4 МБ на файл, 20 000 файлов и 128 МБ в сумме, в папках до 12 уровней вложенности; то, что он пропускает, перечислено в примечаниях отчёта и даёт результат «not known»: файл с исходным кодом сверх этих лимитов, ссылающийся за пределы проекта или недоступный для чтения, и папка с исходным кодом, которую он не просмотрел, потому что она глубже, её содержимое не удалось получить или она является символической ссылкой (ссылки на папки не отслеживаются). Шаблоны проверены на враждебных файлах в миллион символов.

## Документация

Справочник по API и руководства: [muhittincamdali.github.io/reviewready](https://muhittincamdali.github.io/reviewready/).

## Руководства

- [Строки назначения](docs/guides/purpose-strings.md)
- [Экспортное соответствие](docs/guides/export-compliance.md)
- [Удаление аккаунта и службы входа](docs/guides/accounts-and-sign-in.md)
- [Значок App Store](docs/guides/app-icon.md)
- [Минимальные версии Xcode и iOS](docs/guides/xcode-and-ios-minimums.md)
- [Манифест конфиденциальности](docs/guides/privacy-manifest.md)
- [Запуск reviewready в CI](docs/guides/ci.md)

## Источники

Прочитаны 28 октября 2026 года:

- Apple: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (последнее
  обновление — 16 октября 2026 года), [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/),
  [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources),
  [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/),
  [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations),
  [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files),
  [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon)
  и страницы, на которые ссылается каждое правило в [rules/app-review.json](rules/app-review.json).
- Expo: [app config](https://docs.expo.dev/versions/latest/config/app/),
  [privacy manifests](https://docs.expo.dev/guides/apple-privacy/) и config plugins пакетов SDK 58 и `@expo/prebuild-config` 58.0.16 в том виде, как они опубликованы в npm.
- README каждого пакета Flutter и npm из данных правил — в версии, которую они называют.

## Требования

Node.js 22.12 или новее на macOS, Linux или Windows. Для чтения проекта больше ничего не нужно: ни Xcode, ни инструментария Flutter или React Native. Для скрипта симулятора нужен Mac с Xcode и XcodeGen.

## Архитектура

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

- Данные правил отделены от кода и версионируются (`app-review@2026.10.28`).
- CLI (`src/cli/`) только разбирает аргументы, выбирает цвета и ширину и задаёт код завершения.

## Связанные проекты

[glassready](https://github.com/muhittincamdali/glassready) показывает, что Liquid Glass меняет в приложении, собранном с SDK iOS 27, а [sdkbump](https://github.com/muhittincamdali/sdkbump) — запускается ли оно с жизненным циклом UIScene. reviewready отвечает на вопрос, пропустит ли его App Review.

## FAQ

**Означает ли чистый отчёт, что приложение пройдёт проверку?** Нет. reviewready проверяет то, что показывают файлы, по перечисленным выше правилам. App Review смотрит ещё и на работающее приложение, его метаданные и требования, которые не может показать ни один файл.

**Моё приложение не использует микрофон, но RVW102 его запрашивает.** RVW102 — предупреждение о ключе, который пакету нужен только для одной функции. Если приложение эту функцию не использует, ничего менять не нужно: `--ignore RVW102`.

**Меняет ли reviewready мой проект?** Нет. Он читает его и записывает только тот отчёт, который вы запросили.

## Участие в разработке

Мы рады вашему участию: прочитайте [CONTRIBUTING.md](CONTRIBUTING.md) и [кодекс поведения](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md), прежде чем открывать pull request, а о проблемах безопасности сообщайте так, как описано в [SECURITY.md](SECURITY.md).

## Лицензия

Распространяется по лицензии MIT. Подробнее — в файле [LICENSE](LICENSE).
