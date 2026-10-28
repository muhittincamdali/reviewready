<!-- i18n-source: README.md@e6049c7e87beb535d91e3026106454ba19cd59d1 status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg" alt="reviewready: detecta en CI los rechazos de App Review antes de enviar la app, con la fuente de Apple de cada regla y la solución."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml/badge.svg" alt="Estado de CI"></a>
<a href="https://github.com/muhittincamdali/reviewready/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg" alt="Última versión: v0.1.0"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg" alt="Versión del lenguaje: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg" alt="Licencia: MIT"></picture></a>
</p>

<p align="center">
<a href="#inicio-rápido"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-es-light.svg" alt="Empezar"></picture></a>
<a href="https://muhittincamdali.github.io/reviewready/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-es-light.svg" alt="Documentación"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-es-light.svg" alt="Guías"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-es-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-es-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-es-light.svg" alt="Ejemplos"></picture></a>
</p>

> Esta es una traducción del README en inglés. Si hay diferencias, la versión en inglés es la vigente.

<!-- brand:end -->

Los rechazos de App Review que los archivos de un proyecto ya delatan (una cadena de propósito (purpose string) ausente, un icono de App Store con canal alfa, una versión de Xcode más antigua de lo que App Store Connect acepta desde el 28 de abril de 2026) se pueden detectar en CI antes de enviar la app. reviewready lee un proyecto nativo de iOS, Flutter o React Native/Expo y los enumera, cada uno con la página de Apple en la que se basa y la solución para tu tipo de proyecto. Es una CLI determinista con identificadores de regla y códigos de salida: sin conjeturas de IA, sin cuenta, sin subir nada. Lee los archivos de tu proyecto; no compila, no ejecuta ni cambia nada.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-native-rejected-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-native-rejected-light.svg"><img src="docs/media/demo-native-rejected-light.svg" alt="reviewready --brief sobre una app SwiftUI: RVW101 cámara sin NSCameraUsageDescription, RVW103 cadena de propósito de la fototeca vacía, RVW503 icono de App Store con canal alfa, RVW601 Xcode 16.4 fijado, RVW602 destino de despliegue iOS 12.0, y avisos por una cadena de propósito de relleno, el cumplimiento de exportación, la eliminación de cuenta, Google Sign-In sin Sign in with Apple y un manifiesto de privacidad que no está en la app"></picture>

<sub>Grabado con la CLI real sobre el <a href="fixtures/native-swiftui-rejected">fixture native-swiftui-rejected</a>, una app SwiftUI escrita para las pruebas con un problema por regla (<code>npm run demo</code>).</sub>

## Lo más destacado

- **Cada regla cita su fuente.** Las reglas son datos ([rules/app-review.json](rules/app-review.json)) que enlazan la documentación de Apple, las App Review Guidelines y la página Upcoming Requirements de Apple, leídas el 28 de octubre de 2026; las pruebas fallan si una regla no tiene fuente de Apple o nombra una guía que no existe.
- **Cadenas de propósito según lo que la app usa de verdad.** Las API que llama su código Swift y Objective-C, 15 paquetes de Flutter y 10 de npm (con la clave que pide el README de cada uno), los permisos que un Podfile compila para permission_handler y react-native-permissions, y lo que escribirán los config plugins de Expo, incluidos sus textos por defecto.
- **Comprobado en el simulador.** Sin `NSContactsUsageDescription`, nuestra app de prueba se cierra en el iOS 27.0 Simulator con el mensaje del propio sistema; con la solución que da reviewready, muestra el aviso de permiso. La grabación y las capturas están en el repositorio.
- **La solución para tu tipo de proyecto.** Info.plist, build setting o app.json, con una guía por área de reglas.
- **Pensado para CI.** Informes en terminal, texto plano, Markdown y JSON, una lista de cada comprobación con su resultado (encontrado, superado, no comprobado, ignorado), `--ignore` por regla y códigos de salida: 0 sin problemas, 1 con hallazgos, 2 error de uso.

## Inicio rápido

**1. Instala reviewready.** Necesitas [Node.js](https://nodejs.org/) 22.12 o posterior (`node --version` muestra la versión; en un Mac, `brew install node` lo instala). Después instala el paquete desde su [release de GitHub](https://github.com/muhittincamdali/reviewready/releases):

```sh
npm i -g https://github.com/muhittincamdali/reviewready/releases/download/v0.1.0/reviewready-0.1.0.tgz
```

**2. Abre una terminal en la carpeta de tu app**, la que contiene el `.xcodeproj`, `pubspec.yaml` o `package.json`:

```sh
cd path/to/YourApp
```

**3. Ejecuta reviewready:**

```sh
reviewready
```

Empieza por los hallazgos **ERROR**: App Review o App Store Connect los rechazan. Después, los hallazgos **WARNING**, que App Review puede señalar. Cada hallazgo indica su solución en la lista “How to fix” y enlaza la página de Apple de la que procede.

Homebrew instala el mismo paquete junto con Node.js: `brew install muhittincamdali/tap/reviewready`. El registro de npm (`npx @mcamdali/reviewready`) está previsto.

## Qué comprueba reviewready

| Regla  | Gravedad | Hallazgo                                                                                                                       | Fuente         |
| ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------ | -------------- |
| RVW101 | error    | El código de la app o un paquete que incluye usa un recurso protegido y el Info.plist no tiene cadena de propósito para él     | [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), directriz [5.1.1(ii)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage) |
| RVW102 | warning  | Un paquete necesita una cadena de propósito para una de sus funciones (por ejemplo, grabar vídeo)                              | igual |
| RVW103 | error    | Una cadena de propósito está vacía, solo tiene espacios en blanco, no es una cadena o ocupa 4000 bytes o más                   | igual |
| RVW104 | warning  | Una cadena de propósito es de relleno, un ejemplo de un README o el texto por defecto de un config plugin                      | igual |
| RVW201 | warning  | Falta `ITSAppUsesNonExemptEncryption`: App Store Connect hace las preguntas de cumplimiento de exportación en cada compilación | [ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption) |
| RVW301 | warning  | La app crea cuentas y no se encuentra la eliminación de cuenta                                                                 | directriz [5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Offering account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) |
| RVW401 | warning  | Un inicio de sesión de terceros (Google, Facebook, LINE, Kakao, X) sin Sign in with Apple ni un equivalente                    | directriz [4.8](https://developer.apple.com/app-store/review/guidelines/#login-services) |
| RVW501 | error    | Falta el icono de App Store (1024 × 1024)                                                                                      | [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon) |
| RVW502 | error    | El icono de App Store no mide 1024 × 1024                                                                                      | igual |
| RVW503 | error    | El icono de App Store tiene canal alfa, que App Store Connect rechaza al subirlo                                               | [Apple Developer Forums thread 795411](https://developer.apple.com/forums/thread/795411) (el mensaje 90717) |
| RVW601 | error    | Un archivo de compilación fija un Xcode anterior a la versión 26, el mínimo desde el 28 de abril de 2026                       | [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/) |
| RVW602 | error    | El destino de despliegue es inferior a iOS 13, el mínimo desde el 9 de septiembre de 2026                                      | igual |
| RVW701 | warning  | La app no tiene manifiesto de privacidad                                                                                       | [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) |
| RVW702 | warning  | Hay un manifiesto de privacidad en la carpeta de iOS, pero no en el target de la app                                           | igual |

RVW301 y RVW401 son heurísticas sobre las llamadas, las cadenas y los paquetes de la app, y así lo indican en sus hallazgos. Del manifiesto de privacidad solo se comprueba que exista; lo que declara se deja a herramientas que lo leen en profundidad.

A fecha de 28 de octubre de 2026, Apple no ha anunciado ningún mínimo de SDK posterior a Xcode 26 en su página Upcoming Requirements ni en sus noticias para desarrolladores, así que reviewready no comprueba ninguno; cuando Apple anuncie uno, se añadirá a los datos de reglas junto con la página que lo dice.

## En el simulador

La app de prueba de [test/simulator/contacts-probe](test/simulator/contacts-probe) pide acceso a los contactos al abrirse. reviewready informa de RVW101 para ella (y de RVW702 por su manifiesto de privacidad). [scripts/simulator-check.sh](scripts/simulator-check.sh) la compiló con Xcode 27.1 y la ejecutó en un simulador de iPhone 17 con iOS 27.0, tal como está en el repositorio y con las dos soluciones de reviewready.

| Variante                                  | 5 segundos después de abrir                                                 | Lo que registró el sistema                                                                                                                                                      |
| ----------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sin `NSContactsUsageDescription`          | la app ha desaparecido                                                      | "This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSContactsUsageDescription key …" |
| Con la clave y el manifiesto en el target | en ejecución, con el aviso de permiso de contactos y su cadena de propósito | nada                                                                                                                                                                            |

<p align="center"><img src="docs/media/simulator/contacts-probe-ios27.png" width="560" alt="La app de prueba de contactos en un simulador de iPhone 17 con iOS 27.0, compilada con Xcode 27.1. Izquierda: sin NSContactsUsageDescription, la app se ha cerrado y ha vuelto a la pantalla de inicio. Derecha: con la clave, el aviso Allow Probe to access your contacts muestra la cadena de propósito Probe shows which of your friends already use it."></p>

La salida completa de las dos ejecuciones está en [docs/media/simulator](docs/media/simulator).

## Instalación

El comando de Inicio rápido instala el comando `reviewready` desde el tarball del release. Para añadirlo a un proyecto en su lugar:

```sh
npm install --save-dev https://github.com/muhittincamdali/reviewready/releases/download/v0.1.0/reviewready-0.1.0.tgz
```

Después, `npx reviewready` ejecuta esa copia. El paquete se llama `@mcamdali/reviewready`, el nombre que importa la API de JavaScript de más abajo. Cada release de GitHub incluye el paquete como `reviewready-<version>.tgz`, con un archivo `SHA256SUMS` para verificarlo.

## Uso

```text
reviewready [path] [options]
```

| Opción                  | Qué hace                                                                           |
| ----------------------- | ---------------------------------------------------------------------------------- |
| `path`                  | Carpeta del proyecto o `.xcodeproj`; por defecto, la carpeta actual                |
| `-f, --format <format>` | `tty` (por defecto), `text`, `markdown` o `json`                                   |
| `--json`                | Lo mismo que `--format json`                                                       |
| `-o, --output <file>`   | Escribe el informe en un archivo en lugar de la terminal                           |
| `--fail-on <severity>`  | `warning` (por defecto), `error`, `info` o `none`: cuándo el código de salida es 1 |
| `--ignore <rules>`      | Identificadores de regla que se omiten, separados por comas; se puede repetir      |
| `--brief`               | Informes de terminal y de texto: solo el veredicto y los hallazgos                 |
| `--no-color`            | Texto plano incluso en una terminal (se respetan `NO_COLOR` y `FORCE_COLOR`)       |

Códigos de salida: `0` nada en el nivel de `--fail-on` o por encima, `1` hallazgos en ese nivel o por encima, `2` argumentos incorrectos, no se encontró ningún proyecto iOS o un error inesperado. Cuando no se ha podido leer un proyecto de Xcode, un Info.plist o la configuración de Expo, el veredicto es “Not known” y el código de salida es `1`, salvo con `--fail-on none`: reviewready nunca da una app por lista a partir de archivos que no leyó.

reviewready encuentra por sí solo la app de iOS: un `.xcodeproj` en la raíz o una carpeta más abajo en las apps nativas, `ios/` en las apps de Flutter, React Native y Expo. Lee el Info.plist de cada target de app de iOS (XML o binario), los build settings y los entitlements, el conjunto de iconos y el manifiesto de privacidad, los archivos Swift, Objective-C, JavaScript, TypeScript y Dart de la app y sus archivos de cadenas (strings), el Podfile y los archivos que fijan una versión de Xcode. Una app de Expo sin `ios/` se comprueba a partir de app.json.

### Guarda un informe en Markdown junto con el código

```sh
reviewready --format markdown --output reviewready.md
```

### Usa el informe JSON en scripts

```sh
reviewready --json > reviewready.json
```

Cada hallazgo tiene `rule`, `severity`, `title`, `message`, `file`, `line`, `target`, el `fix` con sus pasos y su guía, y `sources`; `checks` enumera cada regla con su resultado. La estructura es `schemaVersion` 0 y puede cambiar antes de la 1.0. [examples/shell/errors-only.sh](examples/shell/errors-only.sh) la filtra con `jq`.

### Ejecútalo en CI

[examples/github-actions/reviewready.yml](examples/github-actions/reviewready.yml) añade el informe al resumen del trabajo de cada pull request que toca la app y hace fallar el trabajo si hay errores. Se ejecuta en Linux: no hace falta Xcode, simulador ni compilación. Consulta la [guía de CI](docs/guides/ci.md).

### Desde JavaScript

```js
import { render, scan } from '@mcamdali/reviewready';

const report = await scan('path/to/app', { ignore: ['RVW301'] });
console.log(report.verdict.text, report.summary);
console.log(render(report, 'markdown'));
```

Una versión ejecutable es [examples/api/summary.mjs](examples/api/summary.mjs).

## Demo

Las grabaciones de terminal salen de la CLI sobre los [fixtures](fixtures/README.md), proyectos creados con cada toolchain:

| Proyecto                                                                         | Grabación                                                                                                                                                    |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| App SwiftUI con un problema por regla                                            | al principio de esta página                                                                                                                                  |
| App Flutter 3.47.5 con camera, image_picker, permission_handler y Google Sign-In | [claro](docs/media/demo-flutter-light.svg) · [oscuro](docs/media/demo-flutter-dark.svg)                                                                      |
| App Expo SDK 58 sin `ios/`: config plugins, una imagen de EAS con Xcode 16.4     | [claro](docs/media/demo-expo-light.svg) · [oscuro](docs/media/demo-expo-dark.svg)                                                                            |
| App UIKit que supera todas las comprobaciones                                    | [claro](docs/media/demo-native-ready-light.svg) · [oscuro](docs/media/demo-native-ready-dark.svg)                                                            |
| `scripts/simulator-check.sh` en iOS 27.0, sin las soluciones y con ellas         | [sin la clave](docs/media/demo-simulator-contacts-probe-missing-27.0-light.svg) · [corregido](docs/media/demo-simulator-contacts-probe-fixed-27.0-light.svg) |

Medido el 28 de octubre de 2026 en un Mac (Apple silicon, M5 Max) con Node.js 26.12: tres series de 100 ejecuciones de `node dist/cli/main.js --json` sobre los seis fixtures, con el arranque de Node.js incluido. Las medianas de las tres series fueron 0,110, 0,112 y 0,109 segundos; la ejecución más lenta tardó 0,24 segundos. El conjunto de pruebas tiene 319 pruebas (`npm test`, el mismo equipo).

## Estado

| Funcionalidad                                                                                                                                               | Estado         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| Detección de proyectos nativos, Flutter, React Native y Expo                                                                                                | funciona       |
| RVW101 a RVW702 sobre Info.plist, build settings, entitlements, iconos, manifiestos de privacidad, código fuente, paquetes, Podfile y configuración de Expo | funciona       |
| Informes en terminal, texto, Markdown y JSON; lista de comprobaciones; códigos de salida de `--ignore`, `--brief` y `--fail-on`                             | funciona       |
| Enlaces de pago externos y In-App Purchase (guideline 3.1.1), preguntas de clasificación por edad                                                           | previsto (0.2) |
| Build settings de `.xcconfig`, paquetes Swift y Pods de la app, `app.config.js`                                                                             | previsto (0.2) |
| Salida SARIF y una GitHub Action                                                                                                                            | previsto (0.3) |
| Homebrew (`muhittincamdali/tap`)                                                                                                                            | funciona       |
| Registro de npm                                                                                                                                             | previsto       |
| Esquema de reglas y estructura JSON estables                                                                                                                | previsto (1.0) |

## Límites

- **Patrones, no un compilador.** Las reglas de API, cuentas e inicio de sesión son expresiones regulares sobre el texto del código fuente, con los comentarios y las cadenas vaciados. El código generado, oculto tras macros, construido en tiempo de ejecución o escrito de forma inusual puede pasar desapercibido o coincidir por error.
- **Paquetes por nombre.** Las cadenas de propósito de un paquete salen de su README tal como figura en los datos de reglas, para la versión indicada allí. No se leen los paquetes que no están en la tabla ni el código nativo dentro de `node_modules`, Pods y paquetes Swift.
- **Build settings solo de project.pbxproj.** No se leen los archivos `.xcconfig`. Cuando no se puede leer el Info.plist de un target, el resultado es “not known” y el informe explica por qué.
- **Configuración de Expo como JSON.** `app.config.js` y `app.config.ts` no se ejecutan, así que dejan el resultado en “not known”; app.json sí se lee.
- **Solo archivos.** reviewready no compila la app ni mira sus pantallas, y App Review decide con más información de la que muestran los archivos. Las grabaciones del simulador de este repositorio salen de `scripts/simulator-check.sh`, ejecutado en un Mac.
- **Entrada acotada.** Un proyecto puede venir de una pull request, así que reviewready lee como máximo 32 MB por archivo de proyecto y, del código fuente, 4 MB por archivo, 20 000 archivos y 128 MB en total; lo que deja fuera aparece en las notas del informe. Los patrones se han probado con archivos hostiles de un millón de caracteres.

## Documentación

Referencia de la API y guías: [muhittincamdali.github.io/reviewready](https://muhittincamdali.github.io/reviewready/).

## Guías

- [Cadenas de propósito](docs/guides/purpose-strings.md)
- [Cumplimiento de exportación](docs/guides/export-compliance.md)
- [Eliminación de cuenta y servicios de inicio de sesión](docs/guides/accounts-and-sign-in.md)
- [El icono de App Store](docs/guides/app-icon.md)
- [Los mínimos de Xcode e iOS](docs/guides/xcode-and-ios-minimums.md)
- [El manifiesto de privacidad](docs/guides/privacy-manifest.md)
- [Ejecuta reviewready en CI](docs/guides/ci.md)

## Fuentes

Leídas el 28 de octubre de 2026:

- Apple: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (última
  actualización el 16 de octubre de 2026), [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/),
  [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources),
  [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/),
  [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations),
  [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files),
  [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon)
  y las páginas que enlaza cada regla en [rules/app-review.json](rules/app-review.json).
- Expo: [app config](https://docs.expo.dev/versions/latest/config/app/),
  [privacy manifests](https://docs.expo.dev/guides/apple-privacy/) y los config plugins de los paquetes del SDK 58 y de `@expo/prebuild-config` 58.0.16 tal como están publicados en npm.
- El README de cada paquete de Flutter y npm de los datos de reglas, en la versión que indican.

## Requisitos

Node.js 22.12 o posterior en macOS, Linux o Windows. Leer un proyecto no necesita nada más: ni Xcode, ni la toolchain de Flutter o React Native. El script del simulador necesita un Mac con Xcode y XcodeGen.

## Arquitectura

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

- Los datos de reglas están separados del código y tienen versión (`app-review@2026.10.28`).
- La CLI (`src/cli/`) solo analiza los argumentos, elige colores y anchos, y establece el código de salida.

## Relacionados

[glassready](https://github.com/muhittincamdali/glassready) muestra qué cambia Liquid Glass en una app compilada con el SDK de iOS 27, y [sdkbump](https://github.com/muhittincamdali/sdkbump) si arranca con el ciclo de vida de UIScene. reviewready responde si App Review la dejará pasar.

## Preguntas frecuentes

**¿Un informe limpio significa que la app pasará la revisión?** No. reviewready comprueba lo que los archivos muestran para las reglas indicadas arriba. App Review también examina la app en ejecución, sus metadatos y directrices que ningún archivo puede mostrar.

**Mi app no usa el micrófono, pero RVW102 lo pide.** RVW102 es un aviso por una clave que un paquete necesita solo para una función. Si la app no usa esa función, no hay que cambiar nada: `--ignore RVW102`.

**¿reviewready cambia mi proyecto?** No. Lo lee y solo escribe el informe que le pides.

## Contribuir

Las contribuciones son bienvenidas: lee [CONTRIBUTING.md](CONTRIBUTING.md) y el [código de conducta](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) antes de abrir una pull request, e informa de los problemas de seguridad como se describe en [SECURITY.md](SECURITY.md).

## Licencia

Publicado bajo la licencia MIT. Consulta [LICENSE](LICENSE).
