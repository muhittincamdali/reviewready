# Run reviewready in CI

reviewready reads the project's files and exits with a code a CI job can act on:

| Exit code | When                                                                                                               |
| --------- | ------------------------------------------------------------------------------------------------------------------ |
| 0         | No finding at or above `--fail-on` (default `warning`)                                                             |
| 1         | A finding at or above `--fail-on`, or a project file reviewready could not read, so a rejection in it is not known |
| 2         | Bad arguments, no iOS project in the folder, or an unexpected error                                                |

`--fail-on error` lets warnings pass and fails only on what App Review or App Store Connect turns
away; `--fail-on none` never fails. `--ignore RVW301,RVW401` turns off rules that do not apply to
the app, for example a login service guideline 4.8 exempts.

## GitHub Actions

```yaml
name: App Review check

on:
  pull_request:

jobs:
  reviewready:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v5
      - uses: actions/setup-node@v5
        with:
          node-version: 24
      - name: Check the app for App Review rejections
        run: npx @mcamdali/reviewready --format markdown --output reviewready.md --fail-on error
      - name: Show the report on the run page
        if: always()
        run: cat reviewready.md >> "$GITHUB_STEP_SUMMARY"
```

reviewready only reads files, so it runs on Linux as well as macOS: it does not need Xcode, a
simulator or a build. The full workflow is in
[examples/github-actions/reviewready.yml](../../examples/github-actions/reviewready.yml).

## Other systems

The same command works anywhere Node.js 22.12 or later runs. For a machine-readable result, use
`--json`: the report object has the findings, the status of every check (`found`, `passed`,
`not-checked`, `ignored`) and the notes, and [examples/shell/errors-only.sh](../../examples/shell/errors-only.sh)
shows how to read it with `jq`.
