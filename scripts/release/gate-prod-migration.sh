#!/usr/bin/env bash
# gate-prod-migration.sh <version> — pure gate check, no side effects. Prints ALLOWED/BLOCKED and
# exits 0/1 accordingly. A production migration may run ONLY when this gate says ALLOWED.
#
# A version is ALLOWED for production migration iff:
#   1. an approval record exists at docs/releases/approvals/<version>-production.md
#   2. that record has non-empty approved-by and approved-at fields
# This mirrors promote.sh's gate logic (same approval-record contract) but is a separate, smaller
# script because migration-gating is a pre-check callers run before touching Supabase directly via
# the MCP/CLI — it does not itself call any Supabase tool (this script never connects to a database).
#
# Preview/staging migrations are NOT gated by this script — they target dcx-manager-dev (OD-RG-05),
# which is never production data, so there is nothing to gate (core.md §28: previews never point at prod).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
APPROVALS_DIR="${GATE_APPROVALS_DIR:-$REPO_DIR/docs/releases/approvals}"

VERSION="${1:?usage: gate-prod-migration.sh <version>}"
APPROVAL_FILE="$APPROVALS_DIR/${VERSION}-production.md"

if [ ! -f "$APPROVAL_FILE" ]; then
  echo "BLOCKED: no approval record at ${APPROVAL_FILE} — production migrations require a recorded PO approval."
  exit 1
fi

APPROVED_BY="$(grep -m1 '^approved-by:' "$APPROVAL_FILE" | sed 's/^approved-by:[[:space:]]*//')"
APPROVED_AT="$(grep -m1 '^approved-at:' "$APPROVAL_FILE" | sed 's/^approved-at:[[:space:]]*//')"

if [ -z "$APPROVED_BY" ] || [ -z "$APPROVED_AT" ]; then
  echo "BLOCKED: approval record exists but is missing 'approved-by:' or 'approved-at:'."
  exit 1
fi

echo "ALLOWED: $VERSION approved for production by '$APPROVED_BY' at '$APPROVED_AT'."
exit 0
