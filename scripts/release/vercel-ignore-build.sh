#!/usr/bin/env bash
# vercel-ignore-build.sh — wired as vercel.json's `ignoreCommand` (RG-R7).
# Vercel convention: exit 0 = SKIP this deployment, any non-zero = PROCEED with the build.
# Classifies the commit range via classify-change.sh (the same path-set RG-R2/RG-R3 already use for
# Iteration/Revision assignment) and skips the Vercel build for a non-source change — so "non-source
# -> no preview" (plan §3.2/§4) is true for real, not just true in the registry's bookkeeping.
#
# Fails OPEN (proceeds with the build) on any error — e.g. a shallow clone or missing previous SHA on
# a brand-new branch's first deploy — rather than silently skipping forever. set -e is deliberately
# NOT used here for that reason.
#
# Deliberately does NOT use VERCEL_GIT_PREVIOUS_SHA: that reflects Vercel's own "last successful
# deployment" bookkeeping, which can lag behind the actual git history when an intermediate build was
# canceled or failed (real bug found live, 2026-07-01 — a non-source stamp commit still triggered a
# real build because Vercel's previous-success pointer was stale, so its diff range unintentionally
# spanned an earlier source change too). HEAD~1 is always the immediate first-parent commit — the same
# "previous tip before this push" semantics version-assign.yml uses via github.event.before — so both
# classifiers now agree by construction, not by coincidence.
BASE="HEAD~1"
HEAD="${VERCEL_GIT_COMMIT_SHA:-HEAD}"

CLASS="$(bash scripts/release/classify-change.sh "$BASE" "$HEAD" 2>/dev/null)"

if [ "$CLASS" = "non-source" ]; then
  echo "vercel-ignore-build: $BASE..$HEAD classified non-source -> skipping this deployment."
  exit 0
fi

echo "vercel-ignore-build: $BASE..$HEAD classified '$CLASS' (or classification failed) -> proceeding with the build."
exit 1
