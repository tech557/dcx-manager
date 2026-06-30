#!/usr/bin/env bash
# validate-release-registry.sh [csv-path] — fails (exit 1) on:
#   - duplicate `version`
#   - two verified/approved rows for the same approved_for env at different commit_sha
#   - a malformed row (wrong column count vs the header)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
REGISTRY="${1:-$REPO_DIR/docs/releases/registry.csv}"

if [ ! -f "$REGISTRY" ]; then
  echo "ERROR: registry not found at $REGISTRY" >&2
  exit 1
fi

awk -F',' '
  function unquote(s) { gsub(/^"|"$/, "", s); return s }
  NR==1 { ncols = NF; next }
  NF == 1 && $0 == "" { next }  # tolerate a trailing blank line
  {
    if (NF != ncols) {
      printf "MALFORMED ROW (line %d): expected %d columns, got %d: %s\n", NR, ncols, NF, $0
      errors++
      next
    }
    version = unquote($1)
    status = unquote($11)
    approved_for = unquote($12)
    commit_sha = unquote($3)

    if (version in seen_version) {
      printf "DUPLICATE VERSION (line %d): '\''%s'\'' already seen at line %d\n", NR, version, seen_version[version]
      errors++
    } else {
      seen_version[version] = NR
    }

    if (status == "verified" || status == "promoted-staging" || status == "promoted-prod") {
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
