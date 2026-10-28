<!-- i18n-source: README.md@6156987af1dcda58a7bd3220ac4f8dc2c4c989aa status=reviewed -->
<!-- brand:start -->

<p align="center"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/banner-light.svg" alt="reviewready: detecta no CI as rejeições do App Review antes de você enviar o app, com a fonte da Apple de cada regra e a correção."></picture></p>

<!-- lang-selector:start -->
<p align="center"><a href="README.md">English</a> · <a href="README.tr.md">Türkçe</a> · <a href="README.zh-CN.md">简体中文</a> · <a href="README.ja.md">日本語</a> · <a href="README.ko.md">한국어</a> · <a href="README.es.md">Español</a> · <a href="README.de.md">Deutsch</a> · <a href="README.fr.md">Français</a> · <a href="README.pt-BR.md">Português (Brasil)</a> · <a href="README.ru.md">Русский</a></p>
<!-- lang-selector:end -->

<p align="center">
<a href="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml"><img src="https://github.com/muhittincamdali/reviewready/actions/workflows/ci.yml/badge.svg" alt="Status da CI"></a>
<a href="https://github.com/muhittincamdali/reviewready/releases"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-version-light.svg" alt="Versão mais recente: v0.1.1"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/package.json"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-language-light.svg" alt="Versão da linguagem: Node.js 22.12+"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/blob/main/LICENSE"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/badge-license-light.svg" alt="Licença: MIT"></picture></a>
</p>

<p align="center">
<a href="#início-rápido"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-start-pt-BR-light.svg" alt="Começar"></picture></a>
<a href="https://muhittincamdali.github.io/reviewready/"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-docs-pt-BR-light.svg" alt="Documentação"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/docs/guides"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-guides-pt-BR-light.svg" alt="Guias"></picture></a>
<a href="https://github.com/muhittincamdali/reviewready/tree/main/examples"><picture><source media="(prefers-color-scheme: dark)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-pt-BR-dark.svg"><source media="(prefers-color-scheme: light)" srcset="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-pt-BR-light.svg"><img src="https://raw.githubusercontent.com/muhittincamdali/reviewready/main/.github/brand/button-examples-pt-BR-light.svg" alt="Exemplos"></picture></a>
</p>

> Esta é uma tradução do README em inglês. Se houver diferença, vale a versão em inglês.

<!-- brand:end -->

Rejeições do App Review que os arquivos de um projeto já mostram (uma string de finalidade (purpose string) ausente, um ícone da App Store com canal alfa, um Xcode mais antigo do que o App Store Connect aceita desde 28 de abril de 2026) podem ser detectadas no CI antes de você enviar o app. O reviewready lê um projeto nativo de iOS, Flutter ou React Native/Expo e lista essas rejeições, cada uma com a página da Apple em que se baseia e a correção para o seu tipo de projeto. É uma CLI determinística, com IDs de regra e códigos de saída: sem palpites de IA, sem conta, sem upload. Ela lê os arquivos do seu projeto; não compila, não executa e não altera nada.

<picture><source media="(prefers-color-scheme: dark)" srcset="docs/media/demo-native-rejected-dark.svg"><source media="(prefers-color-scheme: light)" srcset="docs/media/demo-native-rejected-light.svg"><img src="docs/media/demo-native-rejected-light.svg" alt="reviewready --brief em um app SwiftUI: RVW101 câmera sem NSCameraUsageDescription, RVW103 string de finalidade da biblioteca de fotos vazia, RVW503 ícone da App Store com canal alfa, RVW601 Xcode 16.4 fixado, RVW602 destino de implantação iOS 12.0, e avisos de string de finalidade de exemplo, conformidade de exportação, exclusão de conta, Google Sign-In sem Sign in with Apple e um manifesto de privacidade que ficou fora do app"></picture>

<sub>Gravado com a CLI real no <a href="fixtures/native-swiftui-rejected">fixture native-swiftui-rejected</a>, um app SwiftUI escrito para os testes com um problema por regra (<code>npm run demo</code>).</sub>

## Destaques

- **Cada regra cita sua fonte.** As regras são dados ([rules/app-review.json](rules/app-review.json)) que apontam para a documentação da Apple, as App Review Guidelines e a página Upcoming Requirements da Apple, lidas em 28 de outubro de 2026; os testes falham se uma regra não tem fonte da Apple ou cita um guia que não existe.
- **Strings de finalidade a partir do que o app realmente usa.** As APIs que o código Swift e Objective-C chama, 15 pacotes Flutter e 10 pacotes npm (com a chave que o README de cada um pede), as permissões que um Podfile compila para permission_handler e react-native-permissions, e o que os config plugins do Expo vão gravar, incluindo os textos padrão deles.
- **Verificado no simulador.** Sem `NSContactsUsageDescription`, nosso app de teste falha no iOS 27.0 Simulator com a mensagem do próprio sistema; com a correção que o reviewready indica, ele mostra o pedido de permissão. A gravação e as capturas de tela estão no repositório.
- **A correção para o seu tipo de projeto.** Info.plist, build setting ou app.json, com um guia por área de regras.
- **Feito para CI.** Relatórios no terminal, em texto simples, Markdown e JSON, uma lista de cada verificação com o resultado (encontrado, aprovado, não verificado, ignorado), `--ignore` por regra e códigos de saída: 0 sem problemas, 1 com achados, 2 erro de uso.

## Início rápido

**1. Instale o reviewready.** Você precisa do [Node.js](https://nodejs.org/) 22.12 ou posterior (`node --version` mostra a versão; no Mac, `brew install node` instala). Depois, instale o pacote a partir do [release no GitHub](https://github.com/muhittincamdali/reviewready/releases):

```sh
npm i -g https://github.com/muhittincamdali/reviewready/releases/download/v0.1.1/reviewready-0.1.1.tgz
```

**2. Abra um terminal na pasta do seu app**, aquela com o `.xcodeproj`, o `pubspec.yaml` ou o `package.json`:

```sh
cd path/to/YourApp
```

**3. Execute o reviewready:**

```sh
reviewready
```

Comece pelos achados **ERROR**: o App Review ou o App Store Connect recusam esses casos. Depois veja os achados **WARNING**, que o App Review pode apontar. Cada achado indica a correção na lista “How to fix” e linka a página da Apple de onde vem.

O Homebrew instala o mesmo pacote junto com o Node.js: `brew install muhittincamdali/tap/reviewready`. O registro do npm (`npx @mcamdali/reviewready`) está planejado.

## O que o reviewready verifica

| Regra  | Gravidade | Achado                                                                                                                    | Fonte          |
| ------ | --------- | ------------------------------------------------------------------------------------------------------------------------- | -------------- |
| RVW101 | error     | O código do app ou um pacote que ele inclui usa um recurso protegido e o Info.plist não tem string de finalidade para ele | [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources), diretriz [5.1.1(ii)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage) |
| RVW102 | warning   | Um pacote precisa de uma string de finalidade para um de seus recursos (por exemplo, gravar vídeo)                        | igual |
| RVW103 | error     | Uma string de finalidade está vazia, só tem espaços em branco, não é uma string ou tem 4.000 bytes ou mais                | igual |
| RVW104 | warning   | Uma string de finalidade é um texto de exemplo, um trecho de README ou o texto padrão de um config plugin                 | igual |
| RVW201 | warning   | Falta `ITSAppUsesNonExemptEncryption`: o App Store Connect faz as perguntas de conformidade de exportação a cada build    | [ITSAppUsesNonExemptEncryption](https://developer.apple.com/documentation/bundleresources/information-property-list/itsappusesnonexemptencryption) |
| RVW301 | warning   | O app cria contas e nenhuma exclusão de conta foi encontrada                                                              | diretriz [5.1.1(v)](https://developer.apple.com/app-store/review/guidelines/#data-collection-and-storage), [Offering account deletion](https://developer.apple.com/support/offering-account-deletion-in-your-app/) |
| RVW401 | warning   | Um login de terceiros (Google, Facebook, LINE, Kakao, X) sem Sign in with Apple ou equivalente                            | diretriz [4.8](https://developer.apple.com/app-store/review/guidelines/#login-services) |
| RVW501 | error     | Não há ícone da App Store (1024 × 1024)                                                                                   | [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon) |
| RVW502 | error     | O ícone da App Store não tem 1024 × 1024                                                                                  | igual |
| RVW503 | error     | O ícone da App Store tem canal alfa, que o App Store Connect recusa no upload                                             | [Apple Developer Forums thread 795411](https://developer.apple.com/forums/thread/795411) (a mensagem 90717) |
| RVW601 | error     | Um arquivo de build fixa um Xcode anterior à versão 26, o mínimo desde 28 de abril de 2026                                | [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/) |
| RVW602 | error     | O destino de implantação está abaixo do iOS 13, o mínimo desde 9 de setembro de 2026                                      | igual |
| RVW701 | warning   | O app não tem manifesto de privacidade                                                                                    | [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files) |
| RVW702 | warning   | Há um manifesto de privacidade na pasta do iOS, mas não no target do app                                                  | igual |

RVW301 e RVW401 são heurísticas sobre as chamadas, as strings e os pacotes do app, e dizem isso nos próprios achados. Do manifesto de privacidade, só se verifica a presença; o que ele declara fica para ferramentas que o leem a fundo.

Até 28 de outubro de 2026, a Apple não anunciou nenhum mínimo de SDK posterior ao Xcode 26, nem na página Upcoming Requirements nem nas notícias para desenvolvedores, então o reviewready não verifica nenhum; quando a Apple anunciar um, ele entrará nos dados de regras junto com a página que o informa.

## No simulador

O app de teste em [test/simulator/contacts-probe](test/simulator/contacts-probe) pede acesso aos contatos ao abrir. O reviewready reporta RVW101 para ele (e RVW702 para o manifesto de privacidade). O [scripts/simulator-check.sh](scripts/simulator-check.sh) compilou o app com o Xcode 27.1 e o executou em um simulador de iPhone 17 com iOS 27.0, como está no repositório e com as duas correções do reviewready.

| Variante                         | 5 segundos após abrir                                                     | O que o sistema registrou                                                                                                                                                       |
| -------------------------------- | ------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Sem `NSContactsUsageDescription` | o app sumiu                                                               | "This app has crashed because it attempted to access privacy-sensitive data without a usage description. The app's Info.plist must contain an NSContactsUsageDescription key …" |
| Com a chave, manifesto no target | em execução, com o pedido de acesso aos contatos e a string de finalidade | nada                                                                                                                                                                            |

<p align="center"><img src="docs/media/simulator/contacts-probe-ios27.png" width="560" alt="O app de teste de contatos em um simulador de iPhone 17 com iOS 27.0, compilado com o Xcode 27.1. Esquerda: sem NSContactsUsageDescription, o app falhou e voltou para a tela de início. Direita: com a chave, o pedido Allow Probe to access your contacts mostra a string de finalidade Probe shows which of your friends already use it."></p>

A saída completa das duas execuções está em [docs/media/simulator](docs/media/simulator).

## Instalação

O comando do Início rápido instala o comando `reviewready` a partir do tarball do release. Para adicioná-lo a um projeto:

```sh
npm install --save-dev https://github.com/muhittincamdali/reviewready/releases/download/v0.1.1/reviewready-0.1.1.tgz
```

O `npx reviewready` passa a executar essa cópia. O nome do pacote é `@mcamdali/reviewready`, o nome que a API JavaScript abaixo importa. Cada release do GitHub traz o pacote como `reviewready-<version>.tgz`, com um arquivo `SHA256SUMS` para verificá-lo.

## Uso

```text
reviewready [path] [options]
```

| Opção                   | O que faz                                                                       |
| ----------------------- | ------------------------------------------------------------------------------- |
| `path`                  | Pasta do projeto ou `.xcodeproj`; o padrão é a pasta atual                      |
| `-f, --format <format>` | `tty` (padrão), `text`, `markdown` ou `json`                                    |
| `--json`                | O mesmo que `--format json`                                                     |
| `-o, --output <file>`   | Grava o relatório em um arquivo em vez de no terminal                           |
| `--fail-on <severity>`  | `warning` (padrão), `error`, `info` ou `none`: quando o código de saída é 1     |
| `--ignore <rules>`      | IDs de regra a omitir, separados por vírgula; pode ser repetido                 |
| `--brief`               | Relatórios de terminal e de texto: só o veredito e os achados                   |
| `--no-color`            | Texto simples mesmo em um terminal (`NO_COLOR` e `FORCE_COLOR` são respeitados) |

Códigos de saída: `0` nada no nível de `--fail-on` ou acima, `1` achados nesse nível ou acima, `2` argumentos inválidos, nenhum projeto iOS encontrado ou um erro inesperado. Quando um projeto Xcode, um Info.plist, a configuração do Expo, uma pasta ou um arquivo de código-fonte não pôde ser lido, o veredito é “Not known” e o código de saída é `1`, a menos que se use `--fail-on none`: o reviewready nunca declara um app pronto com base em arquivos que não leu.

O reviewready encontra o app iOS sozinho: um `.xcodeproj` na raiz ou uma pasta abaixo nos apps nativos, `ios/` nos apps Flutter, React Native e Expo. Ele lê o Info.plist de cada target de app iOS (XML ou binário), os build settings e entitlements, o conjunto de ícones e o manifesto de privacidade, os arquivos Swift, Objective-C, JavaScript, TypeScript e Dart do app e seus arquivos de strings, o Podfile e os arquivos que fixam uma versão do Xcode. Um app Expo sem `ios/` é verificado a partir do app.json.

### Guarde um relatório em Markdown junto com o código

```sh
reviewready --format markdown --output reviewready.md
```

### Use o relatório JSON em scripts

```sh
reviewready --json > reviewready.json
```

Cada achado tem `rule`, `severity`, `title`, `message`, `file`, `line`, `target`, o `fix` com seus passos e seu guia, e `sources`; `checks` lista cada regra com o resultado. O formato é `schemaVersion` 0 e pode mudar antes da 1.0. O [examples/shell/errors-only.sh](examples/shell/errors-only.sh) o filtra com `jq`.

### Execute no CI

O [examples/github-actions/reviewready.yml](examples/github-actions/reviewready.yml) adiciona o relatório ao resumo do job de cada pull request que toca o app e faz o job falhar quando há erros. Ele roda no Linux: não são necessários Xcode, simulador nem build. Veja o [guia de CI](docs/guides/ci.md).

### Em JavaScript

```js
import { render, scan } from '@mcamdali/reviewready';

const report = await scan('path/to/app', { ignore: ['RVW301'] });
console.log(report.verdict.text, report.summary);
console.log(render(report, 'markdown'));
```

Uma versão executável é o [examples/api/summary.mjs](examples/api/summary.mjs).

## Demonstração

As gravações de terminal vêm da CLI sobre os [fixtures](fixtures/README.md), projetos criados com cada toolchain:

| Projeto                                                                          | Gravação                                                                                                                                                |
| -------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| App SwiftUI com um problema por regra                                            | no topo desta página                                                                                                                                    |
| App Flutter 3.47.5 com camera, image_picker, permission_handler e Google Sign-In | [claro](docs/media/demo-flutter-light.svg) · [escuro](docs/media/demo-flutter-dark.svg)                                                                 |
| App Expo SDK 58 sem `ios/`: config plugins, uma imagem do EAS com Xcode 16.4     | [claro](docs/media/demo-expo-light.svg) · [escuro](docs/media/demo-expo-dark.svg)                                                                       |
| App UIKit que passa em todas as verificações                                     | [claro](docs/media/demo-native-ready-light.svg) · [escuro](docs/media/demo-native-ready-dark.svg)                                                       |
| `scripts/simulator-check.sh` no iOS 27.0, sem e com as correções                 | [ausente](docs/media/demo-simulator-contacts-probe-missing-27.0-light.svg) · [corrigido](docs/media/demo-simulator-contacts-probe-fixed-27.0-light.svg) |

Medido em 28 de outubro de 2026 em um Mac (Apple silicon, M5 Max) com Node.js 26.12: três séries de 100 execuções de `node dist/cli/main.js --json` sobre os seis fixtures, incluindo a inicialização do Node.js. As medianas das três séries foram 0,110, 0,112 e 0,109 segundo; a execução mais lenta levou 0,24 segundo. A suíte de testes tem 324 testes (`npm test`, na mesma máquina).

## Status

| Recurso                                                                                                                                                  | Status          |
| -------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------- |
| Detecção de projetos nativos, Flutter, React Native e Expo                                                                                               | funciona        |
| RVW101 a RVW702 sobre Info.plist, build settings, entitlements, ícones, manifestos de privacidade, código-fonte, pacotes, Podfile e configuração do Expo | funciona        |
| Relatórios de terminal, texto, Markdown e JSON; lista de verificações; códigos de saída de `--ignore`, `--brief` e `--fail-on`                           | funciona        |
| Links de pagamento externos e In-App Purchase (guideline 3.1.1), perguntas de classificação etária                                                       | planejado (0.2) |
| Build settings de `.xcconfig`, pacotes Swift e Pods do app, `app.config.js`                                                                              | planejado (0.2) |
| Saída SARIF e uma GitHub Action                                                                                                                          | planejado (0.3) |
| Homebrew (`muhittincamdali/tap`)                                                                                                                         | funciona        |
| Registro do npm                                                                                                                                          | planejado       |
| Esquema de regras e formato JSON estáveis                                                                                                                | planejado (1.0) |

## Limites

- **Padrões, não um compilador.** As regras de API, conta e login são expressões regulares sobre o texto do código-fonte, com comentários e strings apagados. Código gerado, escondido atrás de macros, montado em tempo de execução ou escrito de forma incomum pode passar despercebido ou ser reconhecido por engano.
- **Pacotes pelo nome.** As strings de finalidade de um pacote vêm do README dele, como listado nos dados de regras, para a versão citada ali. Pacotes que não estão na tabela e o código nativo dentro de `node_modules`, Pods e pacotes Swift não são lidos.
- **Build settings apenas do project.pbxproj.** Os arquivos `.xcconfig` não são lidos. Quando o Info.plist de um target não pode ser lido, o resultado é “not known” e o relatório explica o motivo.
- **Configuração do Expo como JSON.** `app.config.js` e `app.config.ts` não são executados, então deixam o resultado como “not known”; o app.json é lido.
- **Somente arquivos.** O reviewready não compila o app nem olha as telas dele, e o App Review decide com mais do que os arquivos mostram. As gravações do simulador neste repositório vêm do `scripts/simulator-check.sh`, executado em um Mac.
- **Entrada limitada.** Um projeto pode vir de um pull request, então o reviewready lê no máximo 32 MB por arquivo de projeto e, do código-fonte, 4 MB por arquivo, 20.000 arquivos e 128 MB no total, em pastas de até 12 níveis de profundidade; o que ele deixa de fora aparece nas notas do relatório e deixa o resultado como “not known”: um arquivo de código-fonte acima desses limites, com link para fora do projeto ou que não pode ser lido, e uma pasta de código-fonte que ele não percorreu por estar mais funda, por não poder ser listada ou por ser um link simbólico (links para pastas não são seguidos). Os padrões foram testados com arquivos hostis de um milhão de caracteres.

## Documentação

Referência da API e guias: [muhittincamdali.github.io/reviewready](https://muhittincamdali.github.io/reviewready/).

## Guias

- [Strings de finalidade](docs/guides/purpose-strings.md)
- [Conformidade de exportação](docs/guides/export-compliance.md)
- [Exclusão de conta e serviços de login](docs/guides/accounts-and-sign-in.md)
- [O ícone da App Store](docs/guides/app-icon.md)
- [Os mínimos do Xcode e do iOS](docs/guides/xcode-and-ios-minimums.md)
- [O manifesto de privacidade](docs/guides/privacy-manifest.md)
- [Execute o reviewready no CI](docs/guides/ci.md)

## Fontes

Lidas em 28 de outubro de 2026:

- Apple: [App Review Guidelines](https://developer.apple.com/app-store/review/guidelines/) (última
  atualização em 16 de outubro de 2026), [Upcoming Requirements](https://developer.apple.com/news/upcoming-requirements/),
  [Requesting access to protected resources](https://developer.apple.com/documentation/uikit/requesting-access-to-protected-resources),
  [Offering account deletion in your app](https://developer.apple.com/support/offering-account-deletion-in-your-app/),
  [Complying with Encryption Export Regulations](https://developer.apple.com/documentation/security/complying-with-encryption-export-regulations),
  [Privacy manifest files](https://developer.apple.com/documentation/bundleresources/privacy-manifest-files),
  [Configuring your app icon](https://developer.apple.com/documentation/xcode/configuring-your-app-icon)
  e as páginas que cada regra linka em [rules/app-review.json](rules/app-review.json).
- Expo: [app config](https://docs.expo.dev/versions/latest/config/app/),
  [privacy manifests](https://docs.expo.dev/guides/apple-privacy/) e os config plugins dos pacotes do SDK 58 e do `@expo/prebuild-config` 58.0.16, como publicados no npm.
- O README de cada pacote Flutter e npm dos dados de regras, na versão que eles citam.

## Requisitos

Node.js 22.12 ou posterior no macOS, Linux ou Windows. Ler um projeto não exige mais nada: nem Xcode, nem toolchain de Flutter ou React Native. O script do simulador precisa de um Mac com Xcode e XcodeGen.

## Arquitetura

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

- Os dados de regras são separados do código e versionados (`app-review@2026.10.28`).
- A CLI (`src/cli/`) só analisa argumentos, escolhe cores e larguras e define o código de saída.

## Relacionados

O [glassready](https://github.com/muhittincamdali/glassready) mostra o que o Liquid Glass muda em um app compilado com o SDK do iOS 27, e o [sdkbump](https://github.com/muhittincamdali/sdkbump) mostra se ele inicia com o ciclo de vida do UIScene. O reviewready responde se o App Review vai deixá-lo passar.

## FAQ

**Um relatório limpo significa que o app vai passar na revisão?** Não. O reviewready verifica o que os arquivos mostram para as regras listadas acima. O App Review também avalia o app em execução, seus metadados e diretrizes que nenhum arquivo pode mostrar.

**Meu app não usa o microfone, mas o RVW102 pede.** O RVW102 é um aviso para uma chave de que um pacote precisa só para um recurso. Se o app não usa esse recurso, não é preciso mudar nada: `--ignore RVW102`.

**O reviewready altera meu projeto?** Não. Ele o lê e grava apenas o relatório que você pedir.

## Como contribuir

Contribuições são bem-vindas: leia o [CONTRIBUTING.md](CONTRIBUTING.md) e o [código de conduta](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) antes de abrir um pull request e relate problemas de segurança como descrito no [SECURITY.md](SECURITY.md).

## Licença

Publicado sob a licença MIT. Veja [LICENSE](LICENSE).
