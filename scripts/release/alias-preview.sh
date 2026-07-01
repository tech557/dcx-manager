#!/usr/bin/env bash
# alias-preview.sh <version> — create the friendly per-version Vercel alias for an existing registry
# row (e.g. dcx-manager-gov-v0-4-1-0.vercel.app -> that version's preview_url). Idempotent: re-running
# for the same version just re-points the same alias to the same URL (no-op).
#
# Called both by CI (.github/workflows/record-preview.yml, passing VERCEL_TOKEN) and manually/locally
# (with an already-authenticated Vercel CLI session — VERCEL_TOKEN not needed then). Single
# implementation, not duplicated logic, so the output-verification fix below applies everywhere.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
REGISTRY="$REPO_DIR/docs/releases/registry.csv"
VERCEL_PROJECT="${VERCEL_PROJECT:-dcx-manager-gov}"
VERCEL_SCOPE="${VERCEL_SCOPE:-dot-techs-projects}"
# Override for tests: a no-op stub instead of a real `vercel alias set` call against the live API.
ALIAS_CMD="${PROMOTE_ALIAS_CMD:-npx --yes vercel alias set}"

VERSION="${1:?usage: alias-preview.sh <version>}"

PREVIEW_URL="$(awk -v v="$VERSION" '
  function csv_split(line, arr,    n, i, c, field, inquotes) {
    n = 0; field = ""; inquotes = 0
    for (i = 1; i <= length(line); i++) {
      c = substr(line, i, 1)
      if (inquotes) {
        if (c == "\"") {
          if (substr(line, i + 1, 1) == "\"") { field = field "\""; i++ }
          else { inquotes = 0 }
        } else { field = field c }
      } else {
        if (c == "\"") { inquotes = 1 }
        else if (c == ",") { arr[++n] = field; field = "" }
        else { field = field c }
      }
    }
    arr[++n] = field
    return n
  }
  NR>1 && $0 != "" { delete f; csv_split($0, f); if (f[1] == v) { print f[8]; exit } }
' "$REGISTRY")"

if [ -z "$PREVIEW_URL" ]; then
  echo "ERROR: version '$VERSION' has no preview_url recorded in the registry." >&2
  exit 1
fi

SLUG="$(echo "$VERSION" | tr '.' '-')"
ALIAS="${VERCEL_PROJECT}-${SLUG}.vercel.app"

# The Vercel CLI has a real, confirmed bug: `vercel alias set` can exit 0 even when it fails (e.g. an
# empty/invalid deployment argument prints "Error: ..." to stdout but still returns exit code 0).
# Never trust the exit code alone — verify the command's own output actually says "Success!".
# (Deliberately not a bash array for the optional --token arg: an empty-array reference under `set -u`
# throws "unbound variable" on bash < 4.4, which macOS still ships by default — a second real bug found
# while fixing the first.)
if [ -n "${VERCEL_TOKEN:-}" ]; then
  OUTPUT="$($ALIAS_CMD "$PREVIEW_URL" "$ALIAS" --scope "$VERCEL_SCOPE" --token "$VERCEL_TOKEN" 2>&1)"
else
  OUTPUT="$($ALIAS_CMD "$PREVIEW_URL" "$ALIAS" --scope "$VERCEL_SCOPE" 2>&1)"
fi
echo "$OUTPUT"
if ! echo "$OUTPUT" | grep -qi "Success!"; then
  echo "REFUSED: 'vercel alias set' did not report Success — treating as a failure regardless of its exit code (known CLI bug)." >&2
  exit 1
fi
echo "Aliased $VERSION -> $ALIAS -> $PREVIEW_URL"
