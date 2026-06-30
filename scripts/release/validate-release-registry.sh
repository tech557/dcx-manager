#!/usr/bin/env bash
# validate-release-registry.sh [csv-path] — fails (exit 1) on:
#   - duplicate `version`
#   - two verified/approved rows for the same approved_for env at different commit_sha
#   - a malformed row (wrong column count vs the header)
#
# Uses a quote-aware CSV splitter (csv_split), NOT naive `-F','` — a field containing a literal comma
# (e.g. an approved-by name like `"PO (Mahmoud, tech@dotment.com)"`) broke the naive split in production
# (real CI failure, 2026-07-01); never split CSV on a raw comma again in this script family.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
REGISTRY="${1:-$REPO_DIR/docs/releases/registry.csv}"

if [ ! -f "$REGISTRY" ]; then
  echo "ERROR: registry not found at $REGISTRY" >&2
  exit 1
fi

awk '
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
  NR==1 { ncols = csv_split($0, hdr); next }
  $0 == "" { next }
  {
    delete f
    nf = csv_split($0, f)
    if (nf != ncols) {
      printf "MALFORMED ROW (line %d): expected %d columns, got %d: %s\n", NR, ncols, nf, $0
      errors++
      next
    }
    version = f[1]; commit_sha = f[3]; preview_url = f[8]; status = f[11]; approved_for = f[12]

    if (version in seen_version) {
      printf "DUPLICATE VERSION (line %d): '\''%s'\'' already seen at line %d\n", NR, version, seen_version[version]
      errors++
    } else {
      seen_version[version] = NR
    }

    # Only check for env conflicts once a row actually targets an environment (approved_for set).
    # A bare "verified" row with no approved_for yet is just a candidate build — many of those can
    # coexist; they are not in conflict with each other (bug found via RG-R3 live CI, 2026-07-01).
    if (approved_for != "" && (status == "verified" || status == "promoted-staging" || status == "promoted-prod")) {
      key = approved_for
      if (key in verified_commit && verified_commit[key] != commit_sha) {
        printf "CONFLICTING VERIFIED/APPROVED ROWS for env '\''%s'\'' (line %d): commit '\''%s'\'' vs earlier '\''%s'\'' (line %d)\n", \
          key, NR, commit_sha, verified_commit[key], verified_line[key]
        errors++
      } else {
        verified_commit[key] = commit_sha
        verified_line[key] = NR
      }
    }
  }
  END {
    if (errors > 0) {
      printf "\nFAIL: %d issue(s) found.\n", errors
      exit 1
    }
    print "PASS: registry is valid."
  }
' "$REGISTRY"
