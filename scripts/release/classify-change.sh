#!/usr/bin/env bash
# classify-change.sh <base> <head> — emit "source" or "non-source" for the diff between two refs.
# Path-set is authoritative (docs/plans/active/cicd-release-governance/README.md §3.3); the Type: log
# label is a human-readable mirror only, never the source of truth.
set -euo pipefail

# Operates on the git repo containing the CALLER's working directory (not this script's own repo) —
# this lets CI/tests invoke it against any checkout, including a throwaway repo in tests.
BASE="${1:?usage: classify-change.sh <base> <head>}"
HEAD="${2:?usage: classify-change.sh <base> <head>}"

# dogfood/source-probe.txt is an explicit allowlist entry (RG-R7 dogfood fixture) classified as source
# without touching real product src/**; dogfood/doc-probe.txt is deliberately excluded (non-source).
SOURCE_PATTERN='^(src/|index\.html$|vite\.config\.ts$|tsconfig.*\.json$|package\.json$|package-lock\.json$|components\.json$|eslint\.config\.js$|\.dependency-cruiser\.cjs$|dogfood/source-probe\.txt$)'

changed_files="$(git diff --name-only "$BASE" "$HEAD")"

if [ -z "$changed_files" ]; then
  echo "non-source"
  exit 0
fi

if echo "$changed_files" | grep -qE "$SOURCE_PATTERN"; then
  echo "source"
else
  echo "non-source"
fi
