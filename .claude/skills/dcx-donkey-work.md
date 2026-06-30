---
name: dcx-donkey-work
description: >
  Sweep the requirements graph for missed or under-specified work, implement
  the smallest possible fix for each gap, and produce unfakeable mechanical
  evidence the PO can verify in under 5 seconds per item — without running the
  browser. Use this skill when the user says "find what we missed",
  "donkey work", "requirements cleanup", "what requirements are not implemented",
  "sweep for gaps", "catch up on requirements", "what did we miss",
  "finish the requirements system", or any variant of "do the boring work we
  skipped". Also trigger when `req:validate` emits warnings or when
  `req:completion-gate` is blocked.
  This skill NEVER submits a git commit or PR — all changes require explicit
  user approval before being applied.
---

<!-- Claude adapter — canonical source: agent-skills/dcx-donkey-work/SKILL.md -->
<!-- To update this skill, edit agent-skills/dcx-donkey-work/SKILL.md -->

# DCX Donkey-Work Sweep

This skill finds requirements-system gaps and donkey-work cleanup items,
proposes each with a mechanical verification command, waits for PO approval,
implements only approved items, and delivers an evidence pack the PO can
spot-check in seconds.

It does NOT rely on LLM reasoning for pass/fail verdicts. Every verdict is
the raw output of a shell command.

---

## PHASE 0 — Orient (read, no code changes)

Run these in order. Do NOT touch files in this phase.

```bash
# 1. Current state snapshot
bash scripts/agent/build-current-state.sh

# 2. Requirement graph health
npm run req:validate 2>&1

# 3. Count delivery gaps
echo "=== DELIVERY GAPS ===" && \
grep -rl '"delivery": "not-assessed"' \
  docs/product/requirements/graph/nodes/requirement/ | wc -l && \
echo "=== IMPLEMENTED ===" && \
grep -rl '"delivery": "implemented"' \
  docs/product/requirements/graph/nodes/requirement/ | wc -l

# 4. Evidence coverage
echo "=== EVIDENCE NODES ===" && \
ls docs/product/requirements/graph/nodes/evidence/*.json 2>/dev/null | wc -l

# 5. Open questions
ls docs/product/requirements/graph/nodes/open-question/*.json 2>/dev/null

# 6. Acceptance-criteria coverage
ls docs/product/requirements/graph/nodes/acceptance/*.json 2>/dev/null | wc -l
```

Read the output carefully. Do not interpret — record.

---

## PHASE 1 — Build Gap Table (no code changes)

Using only the data from Phase 0, build a gap table. For each category of
gap, emit a table:

### 1A — Requirements with delivery: not-assessed but code likely exists

Check the `affected_modules` field in each REQ node. For each:
```bash
# For a given REQ id and module path:
grep -rl "REQ-BC-001\|bc-001\|BC001" src/ --include="*.tsx" --include="*.ts" | head -5
```
If the grep finds code → `PARTIAL — code exists, delivery not updated`.
If the grep finds nothing → `MISSING — no code found`.

Output table:
| REQ ID | statement (10 words) | gap-type | grep command used | finding |
|--------|----------------------|----------|-------------------|---------|
| …      | …                    | …        | …                 | …       |

### 1B — Open questions with no resolution path

Read each `QST-*.json`. For each with `governance: proposed`:
- State the question
- State whether a decision exists in `docs/product/decisions/`
- Flag: `NEEDS-DECISION` or `ANSWERED-NEEDS-GRAPH-UPDATE`

### 1C — req:validate warnings

For each warning from Phase 0:
- State the warning verbatim
- State what node needs to change
- State the mechanical fix (field name + new value)

### 1D — Manifestation coverage gaps

```bash
ls docs/product/requirements/graph/nodes/manifestation/react-component/ 2>/dev/null | wc -l
ls docs/product/requirements/graph/nodes/manifestation/function/ 2>/dev/null | wc -l
# Count REQ nodes with no linked MAN- node
npm run req:trace -- --type manifestation 2>&1 | tail -20
```

---

## HARD STOP — WAIT FOR PO APPROVAL

After Phase 1, output the complete gap table and stop.
Write this block verbatim:

```
────────────────────────────────────────────────
AWAITING PO APPROVAL
────────────────────────────────────────────────
Gap table above is complete. No files have been changed.

To proceed:
  • Reply "approve all" to implement every item above, or
  • Reply "approve BLD-XXX-NNN, BLD-YYY-NNN" to implement specific items only.

To reject an item: reply "skip BLD-XXX-NNN — <reason>".

I will not touch any file until I receive explicit approval.
────────────────────────────────────────────────
```

Do NOT proceed to Phase 2 until a user message contains "approve".

---

## PHASE 2 — Propose (approved items only)

For each approved gap item, produce a proposal block before writing a single
line of code:

```
### [REQ-ID or gap label] — PROPOSAL

Gap:      <one sentence — what is absent>
Fix:      <one sentence — exact change>
File(s):  <exact file paths — no new files unless a REQ explicitly demands one>
Anti-churn check:
  grep result showing this change has NOT been done before:
  $ grep -n "<key symbol>" <file>
  <output>
Mechanical verification (run BEFORE and AFTER fix):
  BEFORE (must FAIL or return empty):
  $ <exact shell/grep/tsc command>
  AFTER (must PASS or return non-empty):
  $ <same or complementary command>
Scope boundary:
  Files NOT touched: <list any adjacent files that might tempt scope creep>
```

Rules:
- Verification commands must be grep, wc, jq, tsc --noEmit, or npm scripts.
- No `open browser`, no `check the UI`, no Playwright in Phase 2.
- If a gap cannot be verified mechanically → flag `⚠ NEEDS-BROWSER-VERIFY`
  and skip implementation in this session. Log it for the next sprint.
- No new abstractions. No new components. No refactors beyond the exact gap.

---

## PHASE 3 — Implement (one item at a time)

For each approved item:

1. Re-read the target file(s) in full before editing.
2. Make the minimal change. No reformatting. No style cleanup beyond scope.
3. Run the BEFORE command → paste verbatim output labelled `PRE-FIX`.
4. Apply the fix.
5. Run the AFTER command → paste verbatim output labelled `POST-FIX`.
6. If POST-FIX does not show the expected change → revert and flag BLOCKED.
   Never write PASS without the output.

For graph node updates (changing a JSON field in `nodes/`):
```bash
# After editing the JSON, re-validate:
npm run req:validate 2>&1
# Must exit with pass: true
```

---

## PHASE 4 — Evidence Pack

After all approved items are implemented, produce one evidence block per item:

```
### [REQ-ID or gap label] — EVIDENCE

PRE-FIX:
  $ <command>
  <exact output>

POST-FIX:
  $ <command>
  <exact output>

FILES CHANGED: path/to/file.tsx (+N / -M lines)
GRAPH VALID: npm run req:validate → pass: true (paste last 3 lines)
CHURN CHECK: no prior work reversed
  (or: "reversed <X> — logged as churn because <reason>")
```

Then run the full frontend gate:
```bash
npm run verify:frontend 2>&1 | tail -20
```

Paste exit code and last 20 lines verbatim.

---

## PHASE 5 — Cleanup Queue

After evidence pack, produce a cleanup queue for items NOT implemented this
session (NEEDS-BROWSER-VERIFY, NEEDS-DECISION, scope too large):

```
### CLEANUP QUEUE — items deferred from this session

| Item | Reason deferred | Suggested next skill |
|------|-----------------|----------------------|
| …    | …               | …                    |
```

Suggest the correct skill for each:
- Needs a product decision → `dcx-requirement-intake`
- Needs sprint planning → `dcx-sprint-planner`
- Needs browser verification → `dcx-frontend-verify`
- Needs manifestation work → `dcx-manifestation-reconcile`

---

## HARD CONSTRAINTS (enforced throughout all phases)

| Constraint | Rule |
|---|---|
| No git commit | Never run `git commit`, `git push`, or create a PR. Only the PO does this. |
| No scope creep | Only touch files explicitly named in an approved proposal block. |
| No fake PASS | Every PASS verdict must have verbatim command output. "It looks right" is not evidence. |
| No new abstractions | Do not create new hooks, shells, or components not demanded by a REQ. |
| No browser-as-evidence | grep/jq/tsc/npm-scripts only for mechanical evidence in this skill. |
| No overwrite of approved decisions | Check `docs/product/decisions/` before proposing any behavioral change. |
| Anti-churn | Before editing any file, grep for the symbol being added. If it already exists, stop and flag DUPLICATE. |
| req:validate must pass | After every graph node edit, run `npm run req:validate` and paste the result. |

---

## Verification command cheat sheet

| Need to verify | Command pattern |
|---|---|
| JSON field value in a graph node | `jq '.delivery' docs/.../REQ-BC-001.json` |
| Symbol exists in source | `grep -rn "SymbolName" src/ --include="*.tsx"` |
| File was changed | `git diff --stat HEAD` (only after implementing) |
| TypeScript still compiles | `npx tsc --noEmit 2>&1 \| tail -5` |
| req graph valid | `npm run req:validate 2>&1` |
| Delivery field updated | `grep -l '"delivery": "implemented"' docs/.../nodes/requirement/ \| wc -l` |
| Open question resolved | `jq '.governance' docs/.../QST-VR-011.json` |

---

## Common donkey-work targets in this project

Run these to quickly find the most productive gaps:

```bash
# Requirements with delivery=not-assessed but maturity=logic-defined
# (spec exists, delivery state just not recorded)
for f in docs/product/requirements/graph/nodes/requirement/REQ-*.json; do
  del=$(jq -r '.delivery' "$f")
  mat=$(jq -r '.maturity' "$f")
  if [ "$del" = "not-assessed" ] && [ "$mat" = "logic-defined" ]; then
    echo "$(basename $f .json) | $mat | $del"
  fi
done | head -30

# req:validate warnings
npm run req:validate 2>&1 | jq '.warnings'

# Open questions needing decisions
jq -r '.id + " | " + .governance + " | " + .statement[:60]' \
  docs/product/requirements/graph/nodes/open-question/QST-*.json 2>/dev/null
```

---

## Claude-specific additions

### MCP tools available
- **eslint** (.mcp.json) — use for interactive lint repair if lint gate blocks
- **playwright** (global) — only needed for NEEDS-BROWSER-VERIFY items
  (not used in the main sweep; flagged items go to cleanup queue)
- **context7** (global) — use before writing code that depends on a versioned library

### Deferred tool loading
Use ToolSearch to load MCP tool schemas only when needed. Do not load all tools eagerly.

### OpenCode / DeepSeek V4 usage note
This skill is designed to be token-efficient. Phases 0–1 are read-only and
produce a table; Phases 3–4 are mechanical command-run-paste loops. The model
does not need to reason about pass/fail — the command output IS the verdict.
This makes the skill safe to run with fast/cheap models (DeepSeek V4 Flash,
Haiku) for discovery phases and reserve heavier models only if a proposal
needs architectural judgment.
