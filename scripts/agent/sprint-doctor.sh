#!/usr/bin/env bash
# sprint-doctor.sh — Pre-handoff readiness gate for a sprint (run BEFORE declaring done).
#
# Bundles the checks an output-auditor would otherwise bounce a sprint on, so the
# executor catches them itself in ONE pass instead of 3-4 re-audit rounds.
# See core.md §36. Paste this output into the sprint handoff / session log.
#
# Usage: bash scripts/agent/sprint-doctor.sh <plan-name> <sprint-id> [executor-agent]
#   e.g. bash scripts/agent/sprint-doctor.sh requirements-system RS-R6 opencode
#   flags: --no-gates  (skip the slow npm gates; checks docs/portability only)
set -uo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"   # portable: derived, never hardcoded
RUN_GATES=1
POS=()
for a in "$@"; do
  case "$a" in
    --no-gates) RUN_GATES=0 ;;
    --*) ;;                       # ignore unknown flags
    *) POS+=("$a") ;;             # positional args only
  esac
done
PLAN="${POS[0]:-}"
SPRINT="${POS[1]:-}"
AGENT="${POS[2]:-}"

if [[ -z "$PLAN" || -z "$SPRINT" ]]; then
  echo "Usage: bash scripts/agent/sprint-doctor.sh <plan-name> <sprint-id> [executor-agent] [--no-gates]"
  exit 2
fi

PLAN_DIR="$REPO/docs/plans/active/$PLAN"
HARD_FAIL=0
WARN=0
pass(){ echo "  ✅ $1"; }
fail(){ echo "  ❌ $1"; HARD_FAIL=$((HARD_FAIL+1)); }
warn(){ echo "  ⚠️  $1"; WARN=$((WARN+1)); }

echo "=== Sprint Doctor — $PLAN / $SPRINT ==="
echo "Repo: $REPO"
echo

echo "[1] Close-out artifacts"
# build-notes / output file for the sprint
shopt -s nullglob
notes=("$PLAN_DIR"/output/"$SPRINT"*.md)
if (( ${#notes[@]} )); then
  if grep -qi "Requirement Trace" "${notes[0]}"; then pass "build-notes present + has Requirement Trace (${notes[0]##*/})";
  else warn "build-notes present but missing a '## Requirement Trace' section (${notes[0]##*/})"; fi
else
  fail "no output/${SPRINT}*.md build-notes file"
fi

# sprint status == Completed
sfile=("$PLAN_DIR"/sprints/"$SPRINT"*.md)
if (( ${#sfile[@]} )); then
  st="$(grep -m1 '^Status:' "${sfile[0]}" | sed 's/^Status:[[:space:]]*//')"
  if echo "$st" | grep -qi "Completed"; then pass "sprint status = Completed";
  else fail "sprint status is '$st' (expected Completed) — ${sfile[0]##*/}"; fi
else
  fail "sprint file ${SPRINT}*.md not found"
fi

echo
echo "[2] Session log + index (the executor owns its log — core.md §29a/§33)"
# prefer a log whose FILENAME contains the sprint id (precise, case-INsensitive — filenames use
# lowercase 'rs-r6' while sprint ids are 'RS-R6'); fall back to case-insensitive content match.
loghit="$(find "$REPO"/docs/progress/sessions -ipath "*${AGENT}*" -iname "*${SPRINT}*.md" 2>/dev/null | head -1)"
[[ -z "$loghit" ]] && loghit="$(grep -ril "$SPRINT" "$REPO"/docs/progress/sessions/*"${AGENT}"*/ 2>/dev/null | head -1)"
if [[ -n "$loghit" ]]; then
  rel="${loghit#$REPO/docs/progress/}"
  if grep -qF "$(basename "$(dirname "$loghit")")/$(basename "$loghit")" "$REPO/docs/progress/index.csv" 2>/dev/null; then
    pass "session log present + indexed (${rel})"
  else
    fail "session log ${rel} exists but is NOT in index.csv — run scripts/build-log-index.sh"
  fi
else
  fail "no session log mentions $SPRINT${AGENT:+ for agent '$AGENT'} under docs/progress/sessions/"
fi

echo
echo "[3] Carry-forward updated (core.md §27)"
if grep -q "$SPRINT" "$PLAN_DIR/README.md" 2>/dev/null; then pass "README/carry-forward references $SPRINT";
else warn "no mention of $SPRINT in plan README carry-forward — append it"; fi

echo
echo "[4] Tooling portability (core.md §36) — no machine-specific paths"
# scan tracked tooling for the absolute repo path or /Users/ home paths
# (exclude this scanner — it necessarily contains the search pattern text)
portsrc="$(grep -RIl --exclude-dir=node_modules --exclude=sprint-doctor.sh -e "$REPO/" -e "/Users/" \
  "$REPO/scripts" "$REPO/agent-skills" "$REPO/.agents" "$REPO/.claude/settings.json" 2>/dev/null || true)"
if [[ -z "$portsrc" ]]; then pass "no absolute/home paths in scripts, skills, or settings.json";
else
  fail "absolute/home path found (breaks other checkouts/agents):"
  echo "$portsrc" | sed "s#$REPO/#    #"
fi

echo
echo "[5] Determinism reminder (auditor checks these — verify NOW)"
warn "any 'every item / all sources' criterion: confirm count == source count (don't group/range)"
warn "any wc -l / find counts in build-notes: re-run them; do not hand-type"

if [[ "$RUN_GATES" == "1" ]]; then
  echo
  echo "[6] Gates (exact commands)"
  run(){ local name="$1"; shift; if "$@" >/tmp/sd_gate.out 2>&1; then pass "$name"; else fail "$name (see output)"; tail -3 /tmp/sd_gate.out | sed 's/^/      /'; fi; }
  run "npm run typecheck" npm run --silent typecheck
  run "npm run lint"      npm run --silent lint
  run "npm run test"      npx vitest run
  run "npm run validate:architecture" npm run --silent validate:architecture
  run "bash scripts/verify.sh" bash "$REPO/scripts/verify.sh"
else
  echo
  echo "[6] Gates — SKIPPED (--no-gates)"
fi

echo
echo "=== Verdict ==="
if (( HARD_FAIL == 0 )); then
  echo "✅ READY TO HAND OFF — $WARN warning(s) to eyeball. Paste this into your log."
  exit 0
else
  echo "❌ NOT READY — $HARD_FAIL hard check(s) failed, $WARN warning(s). Fix before handoff (this is what the auditor would REOPEN on)."
  exit 1
fi
