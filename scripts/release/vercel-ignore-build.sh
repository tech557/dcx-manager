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
BASE="${VERCEL_GIT_PREVIOUS_SHA:-HEAD~1}"
HEAD="${VERCEL_GIT_COMMIT_SHA:-HEAD}"

CLASS="$(bash scripts/release/classify-change.sh "$BASE" "$HEAD" 2>/dev/null)"

if [ "$CLASS" = "non-source" ]; then
  echo "vercel-ignore-build: $BASE..$HEAD classified non-source -> skipping this deployment."
  exit 0
fi

echo "vercel-ignore-build: $BASE..$HEAD classified '$CLASS' (or classification failed) -> proceeding with the build."
exit 1
