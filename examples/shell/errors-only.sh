#!/bin/sh
# Lists the findings App Review or App Store Connect turns away (severity error), one per line as
# "file:line RULE message", for a script or a code review comment. Needs jq.
#
#   sh examples/shell/errors-only.sh [project folder]
#
# Prints nothing when there is no error. Inside this repository it runs the build in dist/;
# elsewhere set REVIEWREADY to the command you run reviewready with (for example "reviewready"
# once it is installed).
set -eu
project="${1:-.}"
here="$(cd "$(dirname "$0")" && pwd)"
reviewready="${REVIEWREADY:-node $here/../../dist/cli/main.js}"
$reviewready "$project" --json --fail-on none |
  jq -r '.findings[]
    | select(.severity == "error")
    | "\(.file)\(if .line then ":\(.line)" else "" end) \(.rule) \(.message)"'
