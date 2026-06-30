---
name: dcx-donkey-work
description: Sweep the DCX Manager requirements graph for missed or under-specified work, implement the smallest possible fix for each gap, produce unfakeable mechanical evidence the PO can verify in under 5 seconds per item without running the browser, and never submit any changes without explicit PO approval. Use when asked to find what we missed, do donkey work, requirements cleanup, sweep for gaps, catch up on requirements, or finish the requirements system.
compatibility: opencode
metadata:
  agent: opencode
  executor: deepseek-v4-flash
  role: implementation
---

# DCX Donkey-Work Sweep

You are working in the DCX Manager project. Read `AGENTS.md` first, then `docs/agent-rules/core.md` (§4 twice), then `docs/agent-rules/log-format.md`, then `docs/agent-guides/opencode.md` before touching any file.

Write the identity block at the top of your log entry before touching code.

This skill finds requirement gaps, proposes each with a mechanical verification
command, waits for PO approval, implements only approved items, and delivers an
evidence pack checkable in seconds. Every PASS verdict is raw command output —
never LLM reasoning.

---

## PHASE 0 — Orient (read-only, no file changes)

Run all of these before forming any opinion:

```bash
bash scripts/agent/build-current-state.sh

npm run req:validate 2>&1

echo "=== DELIVERY GAPS ===" && \
grep -rl '"delivery": "not-assessed"' \
  docs/product/requirements/graph/nodes/requirement/ | wc -l

echo "=== IMPLEMENTED ===" && \
grep -rl '"delivery": "implemented"' \
  docs/product/requirements/graph/nodes/requirement/ | wc -l

echo "=== EVIDENCE NODES ===" && \
ls docs/product/requirements/graph/nodes/evidence/*.json 2>/dev/null | wc -l

ls docs/product/requirements/graph/nodes/open-question/*.json 2>/dev/null

ls docs/product/requirements/graph/nodes/acceptance/*.json 2>/dev/null | wc -l
```

Record the raw output. Do not interpret it yet.

---

## PHASE 1 — Gap Table (no file changes)

### 1A — Requirements with delivery: not-assessed

For each REQ-*.json node, check whether code matching its `affected_modules`
field exists:

```bash
# Fast scan — for each req, grep its ID against src/
for f in docs/product/requirements/graph/nodes/requirement/REQ-*.json; do
  id=$(basename "$f" .json)
  mod=$(jq -r '.affected_modules // ""' "$f" | head -c 60)
  scope=$(jq -r '.scope // ""' "$f")
  del=$(jq -r '.delivery' "$f")
  if [ "$del" = "not-assessed" ] && [ "$scope" = "frontend" ]; then
    hits=$(grep -rl "$id" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
    echo "$id | hits=$hits | $mod"
  fi
done | head -40
```

Classify each:
- `hits > 0` → `PARTIAL — code exists, delivery field not updated`
- `hits = 0` → `MISSING — no source reference found`

Output table:

| REQ ID | statement (10 words) | gap-type | hits | finding |
|--------|----------------------|----------|------|---------|

### 1B — Open questions with no resolution path

```bash
for f in docs/product/requirements/graph/nodes/open-question/QST-*.json; do
  id=$(jq -r '.id' "$f")
  gov=$(jq -r '.governance' "$f")
  stmt=$(jq -r '.statement' "$f" | head -c 80)
  echo "$id | $gov | $stmt"
done
```

For each `governance: proposed`: check `docs/product/decisions/` for a matching
decision. Flag `NEEDS-DECISION` or `ANSWERED-NEEDS-GRAPH-UPDATE`.

### 1C — req:validate warnings

List each warning from Phase 0. For each, state:
- the node ID
- the field to change
- the new value

### 1D — Manifestation coverage

```bash
ls docs/product/requirements/graph/nodes/manifestation/react-component/ 2>/dev/null | wc -l
ls docs/product/requirements/graph/nodes/manifestation/function/ 2>/dev/null | wc -l
npm run req:trace -- --type manifestation 2>&1 | tail -20
```

---

## HARD STOP — AWAIT PO APPROVAL

After Phase 1, output the complete gap table and print this block verbatim:

```
────────────────────────────────────────────────
AWAITING PO APPROVAL — no files have been changed
────────────────────────────────────────────────
Reply "approve all"               → implement every item above
Reply "approve REQ-BC-001, ..."   → implement specific items only
Reply "skip REQ-BC-001 — reason"  → exclude an item

I will not touch any file until I receive a message containing "approve".
────────────────────────────────────────────────
```

**Do NOT proceed to Phase 2 without a user message that contains "approve".**

---

## PHASE 2 — Proposals (approved items only, no file changes yet)

For each approved item write one proposal block:

```
### REQ-ID — PROPOSAL

Gap:      <one sentence — what is absent>
Fix:      <one sentence — exact change, no extras>
File(s):  <exact paths — no new files unless the REQ demands one>

Anti-churn check:
  $ grep -n "<key symbol or field>" <file>
  <output — must show the symbol does NOT already exist, or the field has the wrong value>

Mechanical verification:
  BEFORE (must fail or return empty):
  $ <grep / jq / tsc / npm-script command>
  <expected output>

  AFTER (must pass or return non-empty):
  $ <same or complementary command>
  <expected output>

Scope boundary — files NOT touched: <adjacent files that might tempt scope creep>
```

Rules:
- Verification commands: grep, jq, wc, tsc --noEmit, npm run req:validate only.
- No browser. No Playwright. No "check the UI."
- If a gap cannot be verified mechanically → mark `⚠ NEEDS-BROWSER-VERIFY`
  and skip it. Add to cleanup queue (Phase 5).
- No new abstractions. No new components. No refactors outside scope.

---

## PHASE 3 — Implement (one item at a time)

Per item:

1. Re-read the target file(s) in full before editing.
2. Make the minimal change. No reformatting. No style cleanup.
3. Run the BEFORE command → paste raw output as `PRE-FIX:`.
4. Apply the fix.
5. Run the AFTER command → paste raw output as `POST-FIX:`.
6. If POST-FIX does not show the expected result → revert and flag BLOCKED.

For any graph node JSON edit:
```bash
npm run req:validate 2>&1
# must show pass: true before moving to next item
```

---

## PHASE 4 — Evidence Pack

One block per implemented item:

```
### REQ-ID — EVIDENCE

PRE-FIX:
  $ <command>
  <exact terminal output>

POST-FIX:
  $ <command>
  <exact terminal output>

FILES CHANGED: <path> (+N / -M lines)  [use wc -l for the current line count]
GRAPH VALID:
  $ npm run req:validate 2>&1 | tail -5
  <output — must contain "pass": true>
CHURN CHECK: no prior work reversed
  (or: reversed <X> — logged as churn because <reason>)
```

Then run and paste:
```bash
npm run verify:frontend 2>&1 | tail -20
```

Exit code must be 0. Never write PASS without the output.

---

## PHASE 5 — Cleanup Queue

Items not implemented this session (NEEDS-BROWSER-VERIFY, NEEDS-DECISION,
scope too large):

| Item | Reason deferred | Suggested next action |
|------|-----------------|-----------------------|
| …    | …               | dcx-requirement-intake / dcx-sprint-planner / dcx-frontend-verify / dcx-manifestation-reconcile |

---

## HARD CONSTRAINTS

| Constraint | Rule |
|---|---|
| No git commit | Never run `git commit`, `git push`, or create a PR. PO only. |
| No scope creep | Only files named in an approved proposal block. |
| No fake PASS | Verbatim command output is the verdict. "It looks right" is not evidence. |
| No new abstractions | No new hooks, components, or shells not demanded by a REQ. |
| No browser evidence | grep / jq / tsc / npm scripts only. |
| No overwrite decisions | Check `docs/product/decisions/` before any behavioral change. |
| Anti-churn | Grep for the symbol before adding it. If it exists, flag DUPLICATE and stop. |
| req:validate must pass | After every graph node edit, run it and paste the result. |
| wc -l in log | Every changed file → `(N lines, was M)` in the log. |
| No `npm test` | Use `npx vitest run` for unit tests. |

---

## Quick-find commands

```bash
# Requirements spec'd but delivery not recorded
for f in docs/product/requirements/graph/nodes/requirement/REQ-*.json; do
  del=$(jq -r '.delivery' "$f"); mat=$(jq -r '.maturity' "$f")
  if [ "$del" = "not-assessed" ] && [ "$mat" = "logic-defined" ]; then
    echo "$(basename $f .json)"
  fi
done | wc -l

# req:validate warnings only
npm run req:validate 2>&1 | jq '.warnings'

# Open questions
jq -r '.id + " | " + .governance + " | " + .statement[:60]' \
  docs/product/requirements/graph/nodes/open-question/QST-*.json 2>/dev/null

# Symbol lookup
grep -rn "SYMBOL" src/ --include="*.tsx" --include="*.ts"

# JSON field check
jq '.delivery, .maturity, .governance' \
  docs/product/requirements/graph/nodes/requirement/REQ-BC-001.json
```
