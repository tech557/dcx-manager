#!/usr/bin/env bash
# promote.sh <version> <staging|production> — the ONLY path that moves a stable Vercel alias.
# promote.sh --rollback <staging|production> — re-alias back to the previous promoted-* deployment.
#
# Refuses unless all four §2.3 layers hold for <version>:
#   1. registry row exists and status == "verified" (not failed)
#   2. registry row's branch == "integration"
#   3. registry row has a non-empty preview_url (the immutable build to promote — no rebuild)
#   4. an approval record exists at docs/releases/approvals/<version>-<env>.md
#
# On success: re-aliases the EXACT existing Vercel deployment (resolved live from preview_url via the
# Vercel CLI — no rebuild), appends a new registry row computing the promoted version per the plan's
# §3.2 increment rules (Stage+1/reset for staging, Major+1/reset for production), and syncs
# docs/VERSION.md.
#
# Domain targets are configurable via PROMOTE_STAGING_DOMAIN / PROMOTE_PRODUCTION_DOMAIN — default to
# vercel.app subdomains since dcx.dotment.com / staging.dcx.dotment.com need PO DNS access not yet
# granted (RG-R0b/RG-R4 carry-forward). Swap the env var once DNS exists; no script change needed.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
REPO_DIR="$(cd "$SCRIPT_DIR/../.." && pwd)"
REGISTRY="$REPO_DIR/docs/releases/registry.csv"
APPROVALS_DIR="$REPO_DIR/docs/releases/approvals"
VERCEL_PROJECT="${VERCEL_PROJECT:-dcx-manager-gov}"
STAGING_DOMAIN="${PROMOTE_STAGING_DOMAIN:-${VERCEL_PROJECT}-staging.vercel.app}"
PRODUCTION_DOMAIN="${PROMOTE_PRODUCTION_DOMAIN:-${VERCEL_PROJECT}.vercel.app}"
# Override for tests: a no-op stub instead of a real `vercel alias set` call against the live API.
ALIAS_CMD="${PROMOTE_ALIAS_CMD:-npx --yes vercel alias set}"

usage() {
  echo "usage: promote.sh <version> <staging|production>" >&2
  echo "       promote.sh --rollback <staging|production>" >&2
  exit 1
}

[ "$#" -eq 2 ] || usage
ARG1="$1"
ENV="$2"
[ "$ENV" = "staging" ] || [ "$ENV" = "production" ] || usage

if [ "$ENV" = "staging" ]; then TARGET_DOMAIN="$STAGING_DOMAIN"; else TARGET_DOMAIN="$PRODUCTION_DOMAIN"; fi

# Quote-aware CSV splitter — see validate-release-registry.sh for why naive `-F','` is unsafe (a field
# with a literal comma, e.g. an approval name, broke the naive version of this script in production).
CSV_SPLIT_FN='
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
'

row_for_version() {
  awk -v v="$1" "$CSV_SPLIT_FN"'
    NR>1 && $0 != "" { delete f; csv_split($0, f); if (f[1]==v) { print; exit } }
  ' "$REGISTRY"
}

# field <row> <n> — extract column n (1-indexed) from a single CSV row, quote-aware.
field() {
  echo "$1" | awk -v n="$2" "$CSV_SPLIT_FN"'
    { delete f; csv_split($0, f); print f[n] }
  '
}

# --- Rollback path ---
if [ "$ARG1" = "--rollback" ]; then
  PREV_ROW="$(awk -v env="$ENV" "$CSV_SPLIT_FN"'
    NR>1 && $0 != "" {
      delete f; csv_split($0, f)
      if (f[11] ~ /^promoted-/ && f[12]==env) { last=$0 }
    }
    END { print last }
  ' "$REGISTRY")"
  if [ -z "$PREV_ROW" ]; then
    echo "REFUSED: no prior promoted-$ENV row found to roll back to." >&2
    exit 1
  fi
  PREV_PREVIEW_URL="$(field "$PREV_ROW" 8)"
  if [ -z "$PREV_PREVIEW_URL" ]; then
    echo "REFUSED: prior promoted row has no preview_url recorded — cannot resolve the deployment to roll back to." >&2
    exit 1
  fi
  echo "Rolling back $ENV to the previous promoted build: $PREV_PREVIEW_URL"
  $ALIAS_CMD "$PREV_PREVIEW_URL" "$TARGET_DOMAIN"
  echo "Rolled back $ENV -> $TARGET_DOMAIN -> $PREV_PREVIEW_URL"
  exit 0
fi

# --- Promotion path ---
VERSION="$ARG1"
ROW="$(row_for_version "$VERSION")"
if [ -z "$ROW" ]; then
  echo "REFUSED: version '$VERSION' has no registry row." >&2
  exit 1
fi

STATUS="$(field "$ROW" 11)"
BRANCH="$(field "$ROW" 4)"
PREVIEW_URL="$(field "$ROW" 8)"
COMMIT_SHA="$(field "$ROW" 3)"

if [ "$STATUS" != "verified" ]; then
  echo "REFUSED: version '$VERSION' status is '$STATUS', not 'verified'." >&2
  exit 1
fi
if [ "$BRANCH" != "integration" ]; then
  echo "REFUSED: version '$VERSION' was built on branch '$BRANCH', not 'integration'." >&2
  exit 1
fi
if [ -z "$PREVIEW_URL" ]; then
  echo "REFUSED: version '$VERSION' has no preview_url recorded — nothing to promote without a rebuild." >&2
  exit 1
fi

APPROVAL_FILE="$APPROVALS_DIR/${VERSION}-${ENV}.md"
if [ ! -f "$APPROVAL_FILE" ]; then
  echo "REFUSED: no approval record at ${APPROVAL_FILE#$REPO_DIR/} — promotion requires a recorded PO approval, not a chat instruction." >&2
  exit 1
fi

APPROVED_BY="$(grep -m1 '^approved-by:' "$APPROVAL_FILE" | sed 's/^approved-by:[[:space:]]*//')"
APPROVED_AT="$(grep -m1 '^approved-at:' "$APPROVAL_FILE" | sed 's/^approved-at:[[:space:]]*//')"
if [ -z "$APPROVED_BY" ] || [ -z "$APPROVED_AT" ]; then
  echo "REFUSED: approval record exists but is missing 'approved-by:' or 'approved-at:' frontmatter." >&2
  exit 1
fi

echo "All four gate layers satisfied for $VERSION -> $ENV. Re-aliasing (no rebuild)..."
$ALIAS_CMD "$PREVIEW_URL" "$TARGET_DOMAIN"

# Compute the promoted version per plan §3.2.
CURRENT="${VERSION#v}"
MAJOR="$(echo "$CURRENT" | cut -d'.' -f1)"
STAGE="$(echo "$CURRENT" | cut -d'.' -f2)"
if [ "$ENV" = "staging" ]; then
  STAGE=$((STAGE + 1))
  NEW_VERSION="v${MAJOR}.${STAGE}.0.0"
  NEW_STATUS="promoted-staging"
else
  MAJOR=$((MAJOR + 1))
  NEW_VERSION="v${MAJOR}.0.0.0"
  NEW_STATUS="promoted-prod"
fi

bash "$SCRIPT_DIR/append-release-row.sh" \
  "$NEW_VERSION" "promotion" "$COMMIT_SHA" "$BRANCH" "promote.sh" \
  "" "" "$PREVIEW_URL" "" "" \
  "$NEW_STATUS" "$ENV" "$APPROVED_BY" "$APPROVED_AT" "" \
  "promoted from $VERSION via promote.sh, exact deployment, no rebuild"

sed -i.bak "s/| current | \`v[0-9.]*\` |/| current | \`${NEW_VERSION}\` |/" "$REPO_DIR/docs/VERSION.md" && rm -f "$REPO_DIR/docs/VERSION.md.bak"

echo "Promoted: $VERSION -> $ENV -> $TARGET_DOMAIN (recorded as $NEW_VERSION)"
