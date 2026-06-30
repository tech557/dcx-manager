#!/usr/bin/env bash
set -euo pipefail

fail() {
  echo "verify failed: $1" >&2
  exit 1
}

if [ -f "src/types.ts" ]; then
  fail "src/types.ts is forbidden; use src/types/* modules."
fi

if grep -RInE "'Ready for Review'|'Rejected'|'Placed'" src >/tmp/dcx_verify_statuses.txt; then
  cat /tmp/dcx_verify_statuses.txt >&2
  fail "legacy lifecycle status found."
fi

if grep -RInE "useState<\\s*any\\s*\\[\\s*\\]\\s*>" src >/tmp/dcx_verify_anystate.txt; then
  cat /tmp/dcx_verify_anystate.txt >&2
  fail "useState<any[]> is forbidden."
fi

if grep -RIn "(window as any)" src >/tmp/dcx_verify_window_any.txt; then
  cat /tmp/dcx_verify_window_any.txt >&2
  fail "(window as any) is forbidden."
fi

if [ -d "src/builder" ] && grep -RInE "from ['\"]@?/services/|from ['\"](\\.\\./)+services/" src/builder/cards src/builder/islands src/builder/stage 2>/tmp/dcx_verify_grep_err >/tmp/dcx_verify_service_imports.txt; then
  cat /tmp/dcx_verify_service_imports.txt >&2
  fail "cards, islands, and stage components must not import services directly."
fi

echo "verify passed"
