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

[examples/github-actions/reviewready.yml](../../examples/github-actions/reviewready.yml) is a
workflow to copy into an app repository. It runs on pull requests that change a file reviewready
reads, adds the Markdown report to the job summary, keeps it as an artifact and fails the job on
errors:

```yaml
- name: Download reviewready and check its checksum
  env:
    RELEASE: https://github.com/muhittincamdali/reviewready/releases/download/v0.1.1
  run: |
    cd "$RUNNER_TEMP"
    curl -fsSL --retry 3 -o reviewready-0.1.1.tgz "$RELEASE/reviewready-0.1.1.tgz"
    curl -fsSL --retry 3 -o SHA256SUMS "$RELEASE/SHA256SUMS"
    sha256sum --check --strict SHA256SUMS

- name: Check for App Review rejections
  run: |
    status=0
    report="$RUNNER_TEMP/reviewready.md"
    npx --yes --package="$RUNNER_TEMP/reviewready-0.1.1.tgz" \
      reviewready --format markdown --output "$report" --fail-on error || status=$?
    if [ -f "$report" ]; then cat "$report" >> "$GITHUB_STEP_SUMMARY"; fi
    exit "$status"
```

The report goes to `$RUNNER_TEMP`, not the checkout: the checkout holds the pull request's files,
and one of them can be a `reviewready.md` that is a symbolic link to a file outside it.

It installs reviewready from the GitHub release tarball, and only after `sha256sum --check` has
matched it against the `SHA256SUMS` file of the same release, so a corrupted or cut-off download
stops the job; publishing the package to npm as
`@mcamdali/reviewready` is planned. reviewready only reads files, so the job runs on Linux: it
does not need Xcode, a simulator or a build.

## Other systems

The same command works anywhere Node.js 22.12 or later runs. For a machine-readable result, use
`--json`: the report object has the findings, the status of every check (`found`, `passed`,
`not-checked`, `ignored`) and the notes, and [examples/shell/errors-only.sh](../../examples/shell/errors-only.sh)
shows how to read it with `jq`.
