# Examples

| Example                                                          | What it shows                                                                               |
| ---------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| [api/summary.mjs](api/summary.mjs)                               | reviewready from JavaScript: projects sorted by errors and warnings, with the rules found   |
| [shell/errors-only.sh](shell/errors-only.sh)                     | Filtering the JSON report with `jq`: only the errors, as `file:line RULE message`           |
| [github-actions/reviewready.yml](github-actions/reviewready.yml) | A workflow for an app repository: the report in the job summary, and a failed job on errors |

Run the first two from the repository root after `npm ci && npm run build`:

```sh
node examples/api/summary.mjs
sh examples/shell/errors-only.sh fixtures/native-swiftui-rejected
```

`summary.mjs` imports `@mcamdali/reviewready` by name; inside this repository that resolves to the
package itself, so it runs the code you just built. The tests run all three on every change.
