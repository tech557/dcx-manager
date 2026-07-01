#!/usr/bin/env bash
# BE3-R5a — contract snapshot + drift check.
# Re-emits the contract route list from code (reusing extract-routes.sh) and diffs
# it against the committed contract.json route set. Non-zero exit = contract DRIFT.
# Used locally, then by the BE3-R5b CI job on every preview.
#
# Usage: capture-contract-snapshot.sh [path/to/contract.json]
# Portable: paths derived from script location (core.md §36b). Idempotent.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
ROOT="$(cd "${HERE}/../.." && pwd)"
CONTRACT="${1:-${ROOT}/docs/backend/contract/contract.json}"

if [ ! -f "$CONTRACT" ]; then
  echo "contract-snapshot: committed contract not found at $CONTRACT" >&2
  exit 2
fi

# Route set from code (method + path), sorted for stable comparison.
code_routes="$(bash "${HERE}/extract-routes.sh" | jq -r '.[] | "\(.method) \(.path)"' | sort)"
# Route set from the committed contract.
committed_routes="$(jq -r '.routes[] | "\(.method) \(.path)"' "$CONTRACT" | sort)"

if [ "$code_routes" = "$committed_routes" ]; then
  count="$(printf '%s\n' "$code_routes" | grep -c .)"
  echo "contract-snapshot: OK — no drift ($count routes match committed contract)"
  exit 0
fi

echo "contract-snapshot: DRIFT DETECTED — code route set differs from committed contract.json" >&2
echo "--- only in code (+) / only in committed (-) ---" >&2
diff <(printf '%s\n' "$committed_routes") <(printf '%s\n' "$code_routes") >&2 || true
exit 1
