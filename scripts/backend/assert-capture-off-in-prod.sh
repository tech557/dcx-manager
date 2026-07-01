#!/usr/bin/env bash
# BE3-R5a — prod-guard: a production-context build must NOT enable capture.
# Fails (exit 1) if the build context is production AND VITE_BE3_CAPTURE is set
# to an enabling value. Invoked by the BE3-R5b CI workflow as a guard step
# (D-BE3-CAPTURE-OFF). Idempotent, no side effects (core.md §36b).
#
# Context is read from the first arg or $DEPLOY_CONTEXT / $VERCEL_ENV / $NODE_ENV.
# Enabling value = "1".
set -euo pipefail

CONTEXT="${1:-${DEPLOY_CONTEXT:-${VERCEL_ENV:-${NODE_ENV:-unknown}}}}"
FLAG="${VITE_BE3_CAPTURE:-}"

is_prod=false
case "$CONTEXT" in
  production|prod|Production|PRODUCTION) is_prod=true ;;
esac

if [ "$is_prod" = true ] && [ "$FLAG" = "1" ]; then
  echo "assert-capture-off-in-prod: FAIL — VITE_BE3_CAPTURE=1 in a production build (context=$CONTEXT)." >&2
  echo "Capture must never ship enabled to production (D-BE3-CAPTURE-OFF)." >&2
  exit 1
fi

echo "assert-capture-off-in-prod: OK — context=$CONTEXT, VITE_BE3_CAPTURE='${FLAG}' (not an enabled production build)."
exit 0
