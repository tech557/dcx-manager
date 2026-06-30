#!/usr/bin/env bash
# claim-version.sh <version> — fallback, pre-CI version reservation.
# Appends a `reserved` row optimistically. The shared CSV makes a double-claim a git merge conflict
# (first commit wins; the loser re-claims with a new version). Superseded once RG-R3 CI merge-time
# assignment exists (docs/plans/active/cicd-release-governance/README.md §4.2).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
VERSION="${1:?usage: claim-version.sh <version>}"

"$SCRIPT_DIR/append-release-row.sh" \
  "$VERSION" "" "" "" "" "" "" "" "" "" \
  "reserved" "" "" "" "" "claimed via claim-version.sh (pre-CI fallback)"
