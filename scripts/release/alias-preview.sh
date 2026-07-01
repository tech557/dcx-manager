#!/usr/bin/env bash
# alias-preview.sh <version> — create the friendly per-version Vercel alias for an existing registry
# row (e.g. dcx-manager-gov-v0-4-1-0.vercel.app -> that version's preview_url). Idempotent: re-running
# for the same version just re-points the same alias to the same URL (no-op).
#
# CI does this automatically via .github/workflows/record-preview.yml once VERCEL_TOKEN is set as a
# repo secret. Use this script to backfill versions stamped before that secret existed, or to run
# locally with an already-authenticated Vercel CLI session (no VERCEL_TOKEN needed here).
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

$ALIAS_CMD "$PREVIEW_URL" "$ALIAS" --scope "$VERCEL_SCOPE"
echo "Aliased $VERSION -> $ALIAS -> $PREVIEW_URL"
