# Contributing to reviewready

Thanks for taking the time to improve reviewready. The
[shared contributing guide](https://github.com/muhittincamdali/.github/blob/main/CONTRIBUTING.md)
applies (small fixes as a pull request, larger changes as an issue first, security issues through
[SECURITY.md](SECURITY.md), the
[code of conduct](https://github.com/muhittincamdali/.github/blob/main/CODE_OF_CONDUCT.md) for
everyone). This file adds what is specific to this repository.

## Set up

Node.js 22.12 or later, then:

```sh
git clone https://github.com/muhittincamdali/reviewready.git
cd reviewready
npm ci
npm test          # builds dist/ first, then runs every test
```

CI runs `npm run lint`, `npm run typecheck`, `npm test` and `npm run build` on Node.js 22 and 24;
if they pass locally they pass on your pull request. Tests read only files in the repository and
write only to `.test-work/`, which is removed when the run ends; they need neither the network
nor Xcode.

| Command                                           | What it does                                                                                       |
| ------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `npm run lint`                                    | Biome (code) and Prettier (formatting); `npm run format` fixes formatting                          |
| `npm run typecheck`                               | TypeScript in strict mode over `src/`, `test/` and `scripts/`                                      |
| `npm test`                                        | Unit, integration, snapshot and end-to-end tests                                                   |
| `npm run demo`                                    | Records the terminal SVGs in `docs/media/` from the CLI                                            |
| `npm run docs`                                    | Builds the documentation site into `site/` (run `npm ci --prefix docs/site` once first)            |
| `npm run smoke`                                   | Packs the package, installs the tarball and runs it                                                |
| `node scripts/rule-schema.ts`                     | Writes `rules/schema.json` from the zod schema of the rule data                                    |
| `node scripts/fixture-icons.ts`                   | Writes the App Store icons of the fixtures that are not copied from a template                     |
| `scripts/simulator-check.sh missing\|fixed <dir>` | Mac with Xcode and XcodeGen: builds the contacts probe, runs it on a simulator, records the result |

## Where things live

- `src/detect/`: what kind of project a folder holds and the packages it ships.
- `src/collect/`: readers for Info.plist (XML and binary), project.pbxproj, icon sets and PNG
  headers, the Podfile, the Expo config, the files that pin an Xcode, and source files with
  comments and strings blanked. No rule logic here.
- `src/rules/`: one file per rule area (`purpose.ts`, `encryption.ts`, `accounts.ts`, `icon.ts`,
  `toolchain.ts`, `privacy.ts`), `check.ts` that runs them, and the data loader (`data.ts`).
- `rules/app-review.json`: what each rule says, with sources and fixes, and the tables of APIs,
  packages, config plugins and login services.
- `src/report/`: terminal, Markdown and JSON output. `src/cli/`: arguments and exit codes.
- `fixtures/`: real projects; [fixtures/README.md](fixtures/README.md) says how each was made.
- `test/simulator/contacts-probe`: the app `scripts/simulator-check.sh` runs.

## Tests

- A bug fix starts with a test that fails without it. A false positive or a missed finding is best
  reported with the smallest project that shows it; `test/helpers/projects.ts` builds a native or
  Expo app in `.test-work/` from an Info.plist, build settings and files.
- Fixture reports are recorded in `test/__snapshots__/fixtures`. When output changes on purpose,
  run `npm test -- -u`, read the diff, and run `npm run demo` if the terminal output changed.
- `test/integration/fixtures.test.ts` lists the expected findings of each fixture; change that
  list deliberately, never to make a run pass.

## Adding to the rule data

Every rule needs at least one https source on developer.apple.com that says what the rule says.
A package in the purpose string table names the version and the page whose README lists its keys;
a key the package needs only for one feature gets a `when` that names the feature. A config plugin
entry names the version whose source was read. A behaviour seen in the simulator goes into a guide
with how to reproduce it, labelled with the simulator runtime and the Xcode build. Bump
`dataVersion` and `read` to the date of your change, and run `node scripts/rule-schema.ts` when the
schema changes.

## Wording

reviewready reports what it can show. A finding says what was found and where; it does not say an
app "will be rejected" beyond what the cited page says. Say "simulator" when a result is from the
simulator, and keep planned features marked as planned. The hygiene check in CI rejects
unverifiable superlatives.

## Commits and pull requests

[Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) (`feat:`, `fix:`, `docs:`,
`test:`, `refactor:`, `build:`, `ci:`, `chore:`), one topic per pull request, and an entry under
"Unreleased" in [CHANGELOG.md](CHANGELOG.md) for anything a user would notice.

The branches up to the first release were merged into `main` locally, before the repository was
on GitHub, so they went in without a pull request or a CI run; that history is kept as it is
rather than rewritten. Every change after the repository is published goes through a pull request
whose CI checks pass.

## Releases

Maintainers bump `version` in `package.json`, move the "Unreleased" entries under the new version
in `CHANGELOG.md`, and push a `v<version>` tag. The release workflow checks, packs and publishes;
see the comment at the top of `.github/workflows/release.yml`.

## License

By contributing, you agree that your contributions are licensed under the [MIT license](LICENSE).
