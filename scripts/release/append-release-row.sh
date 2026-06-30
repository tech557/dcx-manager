#!/usr/bin/env bash
# append-release-row.sh — the ONLY writer for docs/releases/registry.csv.
# Append-only: refuses to write if the given version already has a row.
# Corrections are a new superseding row, never an edit of an existing one.
# Duplicate check uses a quote-aware CSV splitter — see validate-release-registry.sh for why naive
# `-F','` is unsafe (a field with a literal comma, e.g. an approval name, broke it in production).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
REGISTRY="$REPO_DIR/docs/releases/registry.csv"

usage() {
  echo "usage: append-release-row.sh <version> <change_class> <commit_sha> <branch> <session_folder> \\
       <clickup_task> <deployment_id> <preview_url> <staging_url> <production_url> \\
       <status> <approved_for> <approved_by> <approved_at> <gates> <notes>" >&2
  exit 1
}

[ "$#" -eq 16 ] || usage

VERSION="$1"

if [ ! -f "$REGISTRY" ]; then
  echo "ERROR: registry not found at $REGISTRY" >&2
  exit 1
fi

if awk -v v="$VERSION" '
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
  NR>1 && $0 != "" { delete f; csv_split($0, f); if (f[1] == v) { found = 1 } }
  END { exit !found }
' "$REGISTRY"; then
  echo "REFUSED: version '$VERSION' already has a row in registry.csv — append a superseding row with a new version instead, never edit an existing one." >&2
  exit 1
fi

# Build the CSV row, escaping embedded commas/quotes per-field (simple double-quote wrap).
row=""
for field in "$@"; do
  escaped="${field//\"/\"\"}"
  if [ -z "$row" ]; then
    row="\"$escaped\""
  else
    row="$row,\"$escaped\""
  fi
done

echo "$row" >> "$REGISTRY"
echo "Appended row for version '$VERSION' to $REGISTRY"
