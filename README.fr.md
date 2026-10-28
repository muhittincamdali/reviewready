<!-- i18n-source: README.md@8664c42f034f901757599afc006cc06fa47c80ca status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg" alt="reviewready : repère en CI les rejets d’App Review avant l’envoi, avec la source Apple de chaque règle et la correction."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml/badge.svg" alt="État de la CI"></a>
<a href="https://github.com/muhittincamdali/reviewready/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg" alt="Dernière version: v0.1.1"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg" alt="Version du langage: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg" alt="Licence: MIT"></picture></a>
</p>

<p align="center">
<a href="#démarrage-rapide"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-fr-light.svg" alt="Commencer"></picture></a>
<a href="https://muhittincamdali.github.io/reviewready/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-fr-light.svg" alt="Documentation"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-fr-light.svg" alt="Guides"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-fr-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-fr-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-fr-light.svg" alt="Exemples"></picture></a>
</p>

> Ceci est une traduction du README anglais. En cas de différence, la version anglaise fait foi.

<!-- brand:end -->

Les rejets d’App Review que les fichiers d’un projet laissent déjà voir (une chaîne de finalité (purpose string) manquante, une icône App Store avec un canal alpha, un Xcode plus ancien que ce qu’App Store Connect accepte depuis le 28 avril 2026) peuvent être repérés en CI avant l’envoi. reviewready lit un projet iOS natif, Flutter ou React Native/Expo et les liste, chacun avec la page Apple sur laquelle il repose et la correction adaptée à votre type de projet. C’est une CLI déterministe, avec des identifiants de règle et des codes de sortie : pas de supposition d’IA, pas de compte, pas d’envoi de données. Elle lit les fichiers de votre projet ; elle ne compile, n’exécute ni ne modifie rien.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-native-rejected-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-native-rejected-light.svg"><img src="docs/media/demo-native-rejected-light.svg" alt="reviewready --brief sur une app SwiftUI : RVW101 caméra sans NSCameraUsageDescription, RVW103 chaîne de finalité de la photothèque vide, RVW503 icône App Store avec un canal alpha, RVW601 Xcode 16.4 figé, RVW602 cible de déploiement iOS 12.0, et des avertissements pour une chaîne de finalité factice, la conformité à l’exportation, la suppression de compte, Google Sign-In sans Sign in with Apple et un manifeste de confidentialité absent de l’app"></picture>

<sub>Enregistré avec la vraie CLI sur le <a href="fixtures/native-swiftui-rejected">fixture native-swiftui-rejected</a>, une app SwiftUI écrite pour les tests avec un problème par règle (<code>npm run demo</code>).</sub>

## Points forts

- **Chaque règle cite sa source.** Les règles sont des données ([rules/app-review.json](rules/app-review.json)) qui renvoient à la documentation d’Apple, aux App Review Guidelines et à la page Upcoming Requirements d’Apple, lues le 28 octobre 2026 ; les tests échouent si une règle n’a pas de source Apple ou nomme un guide qui n’existe pas.
- **Des chaînes de finalité d’après ce que l’app utilise vraiment.** Les API appelées par son code Swift et Objective-C, 15 paquets Flutter et 10 paquets npm (avec la clé que demande le README de chacun), les autorisations qu’un Podfile compile pour permission_handler et react-native-permissions, et ce que les config plugins d’Expo vont écrire, y compris leurs textes par défaut.
- **Vérifié dans le simulateur.** Sans `NSContactsUsageDescription`, notre app de test plante dans l’iOS 27.0 Simulator avec le message du système ; avec la correction que donne reviewready, elle affiche la demande d’autorisation. L’enregistrement et les captures d’écran sont dans le dépôt.
- **La correction pour votre type de projet.** Info.plist, build setting ou app.json, avec un guide par domaine de règles.
- **Conçu pour la CI.** Rapports dans le terminal, en texte brut, en Markdown et en JSON, une liste de chaque vérification avec son résultat (trouvé, réussi, non vérifié, ignoré), `--ignore` par règle et des codes de sortie : 0 rien à signaler, 1 constats, 2 erreur d’utilisation.

## Démarrage rapide

**1. Installez reviewready.** Vous avez besoin de [Node.js](https://nodejs.org/) 22.12 ou plus récent (`node --version` affiche la version ; sur un Mac, `brew install node` l’installe). Installez ensuite le paquet depuis sa [release GitHub](https://github.com/muhittincamdali/reviewready/releases) :

```sh
npm i -g https://github.com/muhittincamdali/reviewready/releases/download/v0.1.1/reviewready-0.1.1.tgz
```

**2. Ouvrez un terminal dans le dossier de votre app**, celui qui contient le `.xcodeproj`, `pubspec.yaml` ou `package.json` :

```sh
cd path/to/YourApp
```

**3. Lancez reviewready :**

```sh
reviewready
```

Commencez par les constats **ERROR** : App Review ou App Store Connect les refusent. Passez ensuite aux constats **WARNING**, qu’App Review peut signaler. Chaque constat indique sa correction dans la liste « How to fix » et renvoie à la page Apple dont il provient.

Homebrew installe le même paquet avec Node.js : `brew install muhittincamdali/tap/reviewready`. Le registre npm (`npx @mcamdali/reviewready`) est prévu.

## Ce que vérifie reviewready

| Règle  | Gravité | Constat                                                                                                                               | Source         |
| ------ | ------- | ------------------------------------------------------------------------------------------------------------------------------------- | -------------- |
| RVW101 | error   | Le code de l’app ou un paquet qu’elle embarque utilise une ressource protégée et l’Info.plist n’a pas de chaîne de finalité pour elle | [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), directive [5.1.1(ii)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage) |
| RVW102 | warning | Un paquet a besoin d’une chaîne de finalité pour l’une de ses fonctions (par exemple l’enregistrement vidéo)                          | idem |
| RVW103 | error   | Une chaîne de finalité est vide, ne contient que des espaces, n’est pas une chaîne ou fait 4 000 octets ou plus                       | idem |
| RVW104 | warning | Une chaîne de finalité est factice, un exemple de README ou le texte par défaut d’un config plugin                                    | idem |
| RVW201 | warning | `ITSAppUsesNonExemptEncryption` est absent : App Store Connect pose les questions de conformité à l’exportation pour chaque build     | [ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption) |
| RVW301 | warning | L’app crée des comptes et aucune suppression de compte n’est trouvée                                                                  | directive [5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Offering account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) |
| RVW401 | warning | Une connexion tierce (Google, Facebook, LINE, Kakao, X) sans Sign in with Apple ni équivalent                                         | directive [4.8](https://developer.apple.com/app-store/review/guidelines/#login-services) |
| RVW501 | error   | Pas d’icône App Store (1024 × 1024)                                                                                                   | [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon) |
| RVW502 | error   | L’icône App Store ne fait pas 1024 × 1024                                                                                             | idem |
| RVW503 | error   | L’icône App Store a un canal alpha, qu’App Store Connect refuse à l’envoi                                                             | [Apple Developer Forums thread 795411](https://developer.apple.com/forums/thread/795411) (le message 90717) |
| RVW601 | error   | Un fichier de build fige un Xcode antérieur à la version 26, le minimum depuis le 28 avril 2026                                       | [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/) |
| RVW602 | error   | La cible de déploiement est inférieure à iOS 13, le minimum depuis le 9 septembre 2026                                                | idem |
| RVW701 | warning | L’app n’a pas de manifeste de confidentialité                                                                                         | [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) |
| RVW702 | warning | Un manifeste de confidentialité se trouve dans le dossier iOS mais pas dans la cible de l’app                                         | idem |

RVW301 et RVW401 sont des heuristiques sur les appels, les chaînes et les paquets de l’app, et le disent dans leurs constats. Pour le manifeste de confidentialité, seule sa présence est vérifiée ; ce qu’il déclare est laissé aux outils qui le lisent en détail.

Au 28 octobre 2026, Apple n’a annoncé aucun minimum de SDK après Xcode 26, ni sur sa page Upcoming Requirements ni dans ses actualités pour les développeurs ; reviewready n’en vérifie donc aucun. Quand Apple en annoncera un, il sera ajouté aux données de règles avec la page qui l’indique.

## Dans le simulateur

L’app de test de [test/simulator/contacts-probe](test/simulator/contacts-probe) demande l’accès aux contacts à son ouverture. reviewready signale RVW101 pour elle (et RVW702 pour son manifeste de confidentialité). [scripts/simulator-check.sh](scripts/simulator-check.sh) l’a compilée avec Xcode 27.1 et exécutée sur un simulateur d’iPhone 17 sous iOS 27.0, telle qu’elle est dans le dépôt puis avec les deux corrections de reviewready.

| Variante                             | 5 secondes après le lancement                                                       | Ce que le système a journalisé                                                                                                                                                  |
| ------------------------------------ | ----------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sans `NSContactsUsageDescription`    | l’app a disparu                                                                     | "This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSContactsUsageDescription key …" |
| Avec la clé, manifeste dans la cible | en cours d’exécution, avec la demande d’accès aux contacts et sa chaîne de finalité | rien                                                                                                                                                                            |

<p align="center"><img src="docs/media/simulator/contacts-probe-ios27.png" width="560" alt="L’app de test des contacts sur un simulateur d’iPhone 17 sous iOS 27.0, compilée avec Xcode 27.1. À gauche : sans NSContactsUsageDescription, l’app a planté et est revenue à l’écran d’accueil. À droite : avec la clé, la demande Allow Probe to access your contacts affiche la chaîne de finalité Probe shows which of your friends already use it."></p>

La sortie complète des deux exécutions se trouve dans [docs/media/simulator](docs/media/simulator).

## Installation

La commande du Démarrage rapide installe la commande `reviewready` depuis l’archive tarball de la release. Pour l’ajouter plutôt à un projet :

```sh
npm install --save-dev https://github.com/muhittincamdali/reviewready/releases/download/v0.1.1/reviewready-0.1.1.tgz
```

`npx reviewready` exécute ensuite cette copie. Le paquet s’appelle `@mcamdali/reviewready`, le nom qu’importe l’API JavaScript ci-dessous. Chaque release GitHub contient le paquet sous la forme `reviewready-<version>.tgz`, avec un fichier `SHA256SUMS` pour le vérifier.

## Utilisation

```text
reviewready [path] [options]
```

| Option                  | Ce qu’elle fait                                                                                |
| ----------------------- | ---------------------------------------------------------------------------------------------- |
| `path`                  | Dossier du projet ou `.xcodeproj` ; par défaut, le dossier courant                             |
| `-f, --format <format>` | `tty` (par défaut), `text`, `markdown` ou `json`                                               |
| `--json`                | Identique à `--format json`                                                                    |
| `-o, --output <file>`   | Écrit le rapport dans un fichier au lieu du terminal                                           |
| `--fail-on <severity>`  | `warning` (par défaut), `error`, `info` ou `none` : à partir de quand le code de sortie vaut 1 |
| `--ignore <rules>`      | Identifiants de règle à exclure, séparés par des virgules ; peut être répété                   |
| `--brief`               | Rapports terminal et texte : seulement le verdict et les constats                              |
| `--no-color`            | Texte brut même dans un terminal (`NO_COLOR` et `FORCE_COLOR` sont respectés)                  |

Codes de sortie : `0` rien au niveau de `--fail-on` ou au-dessus, `1` constats à ce niveau ou au-dessus, `2` arguments incorrects, aucun projet iOS trouvé ou erreur inattendue. Quand un projet Xcode, un Info.plist, la configuration Expo, un dossier ou un fichier de sources n’a pas pu être lu, le verdict est « Not known » et le code de sortie vaut `1`, sauf avec `--fail-on none` : reviewready ne déclare jamais une app prête sur la base de fichiers qu’il n’a pas lus.

reviewready trouve seul l’app iOS : un `.xcodeproj` à la racine ou un dossier plus bas pour les apps natives, `ios/` pour les apps Flutter, React Native et Expo. Il lit l’Info.plist de chaque cible d’app iOS (XML ou binaire), les build settings et les entitlements, le jeu d’icônes et le manifeste de confidentialité, les fichiers Swift, Objective-C, JavaScript, TypeScript et Dart de l’app et ses fichiers de chaînes (strings), le Podfile et les fichiers qui figent une version de Xcode. Une app Expo sans `ios/` est vérifiée à partir de app.json.

### Conserver un rapport Markdown avec le code

```sh
reviewready --format markdown --output reviewready.md
```

### Utiliser le rapport JSON dans des scripts

```sh
reviewready --json > reviewready.json
```

Chaque constat a `rule`, `severity`, `title`, `message`, `file`, `line`, `target`, le `fix` avec ses étapes et son guide, et `sources` ; `checks` liste chaque règle avec son résultat. La structure est `schemaVersion` 0 et peut changer avant la 1.0. [examples/shell/errors-only.sh](examples/shell/errors-only.sh) la filtre avec `jq`.

### L’exécuter en CI

[examples/github-actions/reviewready.yml](examples/github-actions/reviewready.yml) ajoute le rapport au résumé du job de chaque pull request qui touche l’app et fait échouer le job en cas d’erreurs. Il s’exécute sous Linux : ni Xcode, ni simulateur, ni compilation ne sont nécessaires. Voir le [guide CI](docs/guides/ci.md).

### Depuis JavaScript

```js
import { render, scan } from '@mcamdali/reviewready';

const report = await scan('path/to/app', { ignore: ['RVW301'] });
console.log(report.verdict.text, report.summary);
console.log(render(report, 'markdown'));
```

Une version exécutable est [examples/api/summary.mjs](examples/api/summary.mjs).

## Démo

Les enregistrements du terminal viennent de la CLI sur les [fixtures](fixtures/README.md), des projets créés avec chaque toolchain :

| Projet                                                                             | Enregistrement                                                                                                                                         |
| ---------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ |
| App SwiftUI avec un problème par règle                                             | en haut de cette page                                                                                                                                  |
| App Flutter 3.47.5 avec camera, image_picker, permission_handler et Google Sign-In | [clair](docs/media/demo-flutter-light.svg) · [sombre](docs/media/demo-flutter-dark.svg)                                                                |
| App Expo SDK 58 sans `ios/` : config plugins, une image EAS avec Xcode 16.4        | [clair](docs/media/demo-expo-light.svg) · [sombre](docs/media/demo-expo-dark.svg)                                                                      |
| App UIKit qui réussit toutes les vérifications                                     | [clair](docs/media/demo-native-ready-light.svg) · [sombre](docs/media/demo-native-ready-dark.svg)                                                      |
| `scripts/simulator-check.sh` sous iOS 27.0, sans puis avec les corrections         | [manquant](docs/media/demo-simulator-contacts-probe-missing-27.0-light.svg) · [corrigé](docs/media/demo-simulator-contacts-probe-fixed-27.0-light.svg) |

Mesuré le 28 octobre 2026 sur un Mac (Apple silicon, M5 Max) avec Node.js 26.12 : trois séries de 100 exécutions de `node dist/cli/main.js --json` sur les six fixtures, démarrage de Node.js compris. Les médianes des trois séries étaient de 0,113, 0,111 et 0,112 seconde ; l’exécution la plus lente a pris 0,19 seconde. La suite de tests compte 331 tests (`npm test`, même machine).

## Statut

| Fonctionnalité                                                                                                                                                                          | Statut      |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
| Détection des projets natifs, Flutter, React Native et Expo                                                                                                                             | fonctionne  |
| RVW101 à RVW702 sur l’Info.plist, les build settings, les entitlements, les icônes, les manifestes de confidentialité, le code source, les paquets, le Podfile et la configuration Expo | fonctionne  |
| Rapports terminal, texte, Markdown et JSON ; liste des vérifications ; codes de sortie de `--ignore`, `--brief` et `--fail-on`                                                          | fonctionne  |
| Liens de paiement externes et In-App Purchase (guideline 3.1.1), questions de classification par âge                                                                                    | prévu (0.2) |
| Build settings `.xcconfig`, paquets Swift et Pods de l’app, `app.config.js`                                                                                                             | prévu (0.2) |
| Sortie SARIF et une GitHub Action                                                                                                                                                       | prévu (0.3) |
| Homebrew (`muhittincamdali/tap`)                                                                                                                                                        | fonctionne  |
| Registre npm                                                                                                                                                                            | prévu       |
| Schéma de règles et structure JSON stables                                                                                                                                              | prévu (1.0) |

## Limites

- **Des motifs, pas un compilateur.** Les règles sur les API, les comptes et la connexion sont des expressions régulières appliquées au texte source dont les commentaires et les chaînes sont vidés. Le code généré, caché derrière des macros, construit à l’exécution ou écrit de façon inhabituelle peut passer inaperçu ou être reconnu à tort.
- **Paquets par leur nom.** Les chaînes de finalité d’un paquet viennent de son README tel qu’il est listé dans les données de règles, pour la version qui y est indiquée. Les paquets absents du tableau et le code natif dans `node_modules`, les Pods et les paquets Swift ne sont pas lus.
- **Build settings uniquement depuis project.pbxproj.** Les fichiers `.xcconfig` ne sont pas lus. Quand l’Info.plist d’une cible ne peut pas être lu, le résultat est « not known » et le rapport en donne la raison.
- **Configuration Expo en JSON.** `app.config.js` et `app.config.ts` ne sont pas exécutés ; ils donnent donc le résultat « not known » ; app.json est lu.
- **Uniquement des fichiers.** reviewready ne compile pas l’app et n’examine pas ses écrans, et App Review décide sur davantage que ce que montrent les fichiers. Les enregistrements du simulateur de ce dépôt viennent de `scripts/simulator-check.sh`, exécuté sur un Mac.
- **Entrée bornée.** Un projet peut provenir d’une pull request ; reviewready lit donc au plus 32 Mo par fichier de projet et, pour les sources, 4 Mo par fichier, 20 000 fichiers et 128 Mo au total, dans des dossiers jusqu’à 12 niveaux de profondeur ; ce qu’il laisse de côté est listé dans les notes du rapport et donne le résultat « not known » : un fichier de sources au-delà de ces limites, lié hors du projet ou illisible, et un dossier de sources qu’il n’a pas parcouru parce qu’il est plus profond, ne peut pas être listé ou est un lien symbolique (les liens vers des dossiers ne sont pas suivis). Les motifs sont testés sur des fichiers hostiles d’un million de caractères.

## Documentation

Référence de l’API et guides : [muhittincamdali.github.io/reviewready](https://muhittincamdali.github.io/reviewready/).

## Guides

- [Chaînes de finalité](docs/guides/purpose-strings.md)
- [Conformité à l’exportation](docs/guides/export-compliance.md)
- [Suppression de compte et services de connexion](docs/guides/accounts-and-sign-in.md)
- [L’icône App Store](docs/guides/app-icon.md)
- [Les minimums de Xcode et d’iOS](docs/guides/xcode-and-ios-minimums.md)
- [Le manifeste de confidentialité](docs/guides/privacy-manifest.md)
- [Exécuter reviewready en CI](docs/guides/ci.md)

## Sources

Lues le 28 octobre 2026 :

- Apple : [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (dernière
  mise à jour le 16 octobre 2026), [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/),
  [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources),
  [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/),
  [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations),
  [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files),
  [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon)
  et les pages que chaque règle lie dans [rules/app-review.json](rules/app-review.json).
- Expo : [app config](https://docs.expo.dev/versions/latest/config/app/),
  [privacy manifests](https://docs.expo.dev/guides/apple-privacy/) et les config plugins des paquets du SDK 58 et de `@expo/prebuild-config` 58.0.16 tels que publiés sur npm.
- Le README de chaque paquet Flutter et npm des données de règles, dans la version qu’elles indiquent.

## Prérequis

Node.js 22.12 ou plus récent sous macOS, Linux ou Windows. Lire un projet ne demande rien d’autre : ni Xcode, ni toolchain Flutter ou React Native. Le script du simulateur nécessite un Mac avec Xcode et XcodeGen.

## Architecture

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

- Les données de règles sont séparées du code et versionnées (`app-review@2026.10.28`).
- La CLI (`src/cli/`) se contente d’analyser les arguments, de choisir les couleurs et les largeurs, et de définir le code de sortie.

## Projets liés

[glassready](https://github.com/muhittincamdali/glassready) montre ce que Liquid Glass change dans une app compilée avec le SDK iOS 27, et [sdkbump](https://github.com/muhittincamdali/sdkbump) si elle démarre avec le cycle de vie UIScene. reviewready répond à la question : App Review va-t-il la laisser passer ?

## FAQ

**Un rapport vierge signifie-t-il que l’app passera la revue ?** Non. reviewready vérifie ce que les fichiers montrent pour les règles listées ci-dessus. App Review examine aussi l’app en cours d’exécution, ses métadonnées et des directives qu’aucun fichier ne peut montrer.

**Mon app n’utilise pas le micro, mais RVW102 le demande.** RVW102 est un avertissement pour une clé dont un paquet n’a besoin que pour une seule fonction. Si l’app n’utilise pas cette fonction, rien n’est à changer : `--ignore RVW102`.

**reviewready modifie-t-il mon projet ?** Non. Il le lit et n’écrit que le rapport que vous demandez.

## Contribuer

Les contributions sont les bienvenues : lisez [CONTRIBUTING.md](CONTRIBUTING.md) et le [code de conduite](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) avant d’ouvrir une pull request, et signalez les problèmes de sécurité comme décrit dans [SECURITY.md](SECURITY.md).

## Licence

Publié sous licence MIT. Voir [LICENSE](LICENSE).
