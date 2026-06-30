#!/usr/bin/env bash
# rs-r4-smoke-tests.sh — Smoke tests for RS-R4 skills+rules+wiring
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/../../.." && pwd)"
failures=0

pass() { echo "  PASS: $1"; }
fail() { echo "  FAIL: $1" >&2; failures=$((failures + 1)); }

echo "=== RS-R4 Smoke Tests ==="
echo ""

# 1. Check skills in canonical agent-skills/
echo "--- Canonical skills (agent-skills/) ---"
for skill in dcx-sprint-planner dcx-plan-audit dcx-sprint-close \
             dcx-requirement-intake dcx-requirement-maturation dcx-manifestation-reconcile; do
  if [[ -f "$ROOT/agent-skills/$skill/SKILL.md" ]]; then
    pass "$skill/SKILL.md exists"
  else
    fail "$skill/SKILL.md missing in agent-skills/"
  fi
done

# 2. Check skills in .claude/skills/ and .agents/skills/
echo "--- Distributed skills ---"
for skill in dcx-requirement-intake dcx-requirement-maturation dcx-manifestation-reconcile; do
  if [[ -f "$ROOT/.claude/skills/$skill.md" ]]; then
    pass ".claude/skills/$skill.md present"
  else
    fail ".claude/skills/$skill.md missing"
  fi
  if [[ -f "$ROOT/.agents/skills/$skill.md" ]]; then
    pass ".agents/skills/$skill.md present"
  else
    fail ".agents/skills/$skill.md missing"
  fi
done

# 3. sync-skills.sh includes all 9 skills
echo "--- sync-skills.sh coverage ---"
skill_count=$(grep -o 'dcx-[a-z-]*' "$ROOT/scripts/agent/sync-skills.sh" | sort -u | wc -l | tr -d ' ')
if [[ "$skill_count" -ge 9 ]]; then
  pass "sync-skills.sh lists $skill_count dcx- skills (expected 9+)"
else
  fail "sync-skills.sh lists only $skill_count dcx- skills (expected 9+)"
fi

# 4. Planner enforces Requirement Trace
echo "--- Planner Requirement Trace enforcement ---"
if grep -q "Requirement Trace" "$ROOT/agent-skills/dcx-sprint-planner/SKILL.md"; then
  pass "planner contains Requirement Trace section"
else
  fail "planner missing Requirement Trace section"
fi
if grep -q "graph.ID" "$ROOT/agent-skills/dcx-sprint-planner/SKILL.md"; then
  pass "planner enforces graph-ID grounding"
else
  fail "planner missing graph-ID grounding check"
fi

# 5. Audit fails ungrounded traces
echo "--- Audit grounding enforcement ---"
if grep -q "graph.ID" "$ROOT/agent-skills/dcx-plan-audit/SKILL.md"; then
  pass "audit checks graph-ID grounding"
else
  fail "audit missing graph-ID grounding check"
fi
if grep -q "NOT READY" "$ROOT/agent-skills/dcx-plan-audit/SKILL.md"; then
  pass "audit can return NOT READY for ungrounded traces"
else
  fail "audit missing NOT READY verdict"
fi

# 6. Sprint close includes req:completion-gate
echo "--- Sprint close completion gate ---"
if grep -q "req:completion-gate\|req:validate" "$ROOT/agent-skills/dcx-sprint-close/SKILL.md"; then
  pass "sprint close includes requirement gates"
else
  fail "sprint close missing requirement gates"
fi

# 7. core.md has §35 requirements governance rules
echo "--- core.md §35 rules ---"
if grep -q "§35.*Requirements Governance" "$ROOT/docs/agent-rules/core.md"; then
  pass "core.md has §35 Requirements Governance section"
else
  fail "core.md missing §35 Requirements Governance"
fi
for rule in "Graph-ID Grounding" "Sign-Off Before Mutation" "Validate + Reconcile Before Done" "No Silent Unlinked Manifestations" "System Is the Source of Truth" "Skills Enforce These Rules"; do
  if grep -q "$rule" "$ROOT/docs/agent-rules/core.md"; then
    pass "core.md §35 includes '$rule'"
  else
    fail "core.md §35 missing '$rule'"
  fi
done

# 8. AGENTS.md has requirements tool routing
echo "--- AGENTS.md requirements routing ---"
if grep -q "Requirements tool routing\|Requirements governance" "$ROOT/AGENTS.md"; then
  pass "AGENTS.md has requirements tool routing"
else
  fail "AGENTS.md missing requirements tool routing"
fi
for tool in dcx-requirement-intake dcx-requirement-maturation dcx-manifestation-reconcile; do
  if grep -q "$tool" "$ROOT/AGENTS.md"; then
    pass "AGENTS.md references $tool"
  else
    fail "AGENTS.md missing $tool reference"
  fi
done

# 9. Completion hook script exists
echo "--- Completion hook ---"
if [[ -f "$ROOT/scripts/agent/run-completion-hook.sh" ]]; then
  pass "run-completion-hook.sh exists"
else
  fail "run-completion-hook.sh missing"
fi

# 10. PostToolUse has completion hook
echo "--- PostToolUse hook ---"
if grep -q "run-completion-hook" "$ROOT/.claude/settings.json"; then
  pass "PostToolUse includes completion hook"
else
  fail "PostToolUse missing completion hook"
fi

# 11. Completion gate pre-RS-R5 skip (negative: gate exits 0 on empty graph)
echo "--- Completion gate pre-RS-R5 behavior ---"
gate_output=$(cd "$ROOT" && npm run req:completion-gate -- --changed agent-skills/dcx-sprint-planner/SKILL.md 2>&1 || true)
if echo "$gate_output" | grep -q "SKIPPED — pre-RS-R5"; then
  pass "req:completion-gate skips cleanly on empty graph (pre-RS-R5)"
else
  fail "req:completion-gate does not handle pre-RS-R5 state"
fi

# 12. sync-skills.sh runs cleanly
echo "--- sync-skills.sh reproducibility ---"
sync_output=$(bash "$ROOT/scripts/agent/sync-skills.sh" 2>&1)
skill_count=$(echo "$sync_output" | grep -o 'dcx-[a-z-]*' | sort -u | wc -l | tr -d ' ')
if [[ "$skill_count" -ge 9 ]]; then
  pass "sync-skills.sh runs clean and syncs $skill_count skills"
else
  fail "sync-skills.sh failed or synced only $skill_count"
fi

echo ""
echo "=== Summary: $failures failure(s) ==="
exit $failures
