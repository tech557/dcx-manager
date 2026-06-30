#!/usr/bin/env bash
# patch-release-row.sh <version> <column-name> <value> — fill in a currently-EMPTY field on an
# existing row. Refuses if the row doesn't exist, the column name is unknown, or the field already
# has a non-empty value (never overwrites a recorded fact — corrections are a new superseding row,
# same rule as append-release-row.sh). This exists because some fields (deployment_id, preview_url)
# are only known asynchronously, after Vercel finishes a deployment that started from the same commit
# the row already records — see .github/workflows/record-preview.yml.
#
# Uses a quote-aware CSV splitter/writer — see validate-release-registry.sh for why naive `-F','` is
# unsafe (a field with a literal comma broke it in production, 2026-07-01).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
REGISTRY="$REPO_DIR/docs/releases/registry.csv"

VERSION="${1:?usage: patch-release-row.sh <version> <column-name> <value>}"
COLUMN="${2:?usage: patch-release-row.sh <version> <column-name> <value>}"
VALUE="${3:?usage: patch-release-row.sh <version> <column-name> <value>}"

if [ ! -f "$REGISTRY" ]; then
  echo "ERROR: registry not found at $REGISTRY" >&2
  exit 1
fi

COL_INDEX="$(head -1 "$REGISTRY" | tr ',' '\n' | grep -nx "$COLUMN" | head -1 | cut -d: -f1)"
if [ -z "$COL_INDEX" ]; then
  echo "ERROR: unknown column '$COLUMN'" >&2
  exit 1
fi

awk -v v="$VERSION" -v col="$COL_INDEX" -v val="$VALUE" '
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
  function quote(s) { gsub(/"/, "\"\"", s); return "\"" s "\"" }
  NR==1 { print; next }
  $0 == "" { next }
  {
    delete f
    nf = csv_split($0, f)
    if (f[1] == v) {
      found = 1
      if (f[col] != "") {
        print "REFUSED: version '\''" v "'\'' column already has a value (\"" f[col] "\") — never overwrite a recorded fact" > "/dev/stderr"
        exit 1
      }
      f[col] = val
    }
    line = ""
    for (i = 1; i <= nf; i++) {
      line = line (i > 1 ? "," : "") quote(f[i])
    }
    print line
  }
  END {
    if (!found) {
      print "REFUSED: version '\''" v "'\'' not found in registry" > "/dev/stderr"
      exit 1
    }
  }
' "$REGISTRY" > "${REGISTRY}.tmp" && mv "${REGISTRY}.tmp" "$REGISTRY" || { rm -f "${REGISTRY}.tmp"; exit 1; }

echo "Patched column '$COLUMN' for version '$VERSION'"
