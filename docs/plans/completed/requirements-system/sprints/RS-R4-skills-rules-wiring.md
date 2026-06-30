## RS-R4 — Skills + agent-rule wiring + planner/audit grounding + hooks/gates + skill-sync
Status: Completed

### Intent
Make the graph **authoritative and self-sustaining across agents**: ship the workflow skills, make the
behaviors **mandatory** in `AGENTS.md`/`core.md`, have `dcx-sprint-planner`/`dcx-plan-audit` **enforce
graph-ID grounding + the mandatory Requirement Trace**, wire the **change-triggered reconciliation +
validators as completion gates/hooks**, and **sync all skills to every agent dir**. This sprint turns the
Behavior-Sustaining Map (RS-R0b) into real rules + mechanical checks.

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + RS-R0b Behavior-Sustaining Map +
RS-R1/R2/R3 command names + existing skills). Re-read `scripts/agent/sync-skills.sh` (hardcoded `SKILLS=()`).

### Scope — in
- **Skills (canonical `agent-skills/` → synced):**
  - `dcx-requirement-intake` — a typed user message (`core.md §33`) → candidate-requirement assessment →
    proposal → contradiction/duplicate/supersession + impact check (reusing RS-R1 validators + RS-R3
    reconciliation + `code-query.sh`) → PO-confirm → record with responsibilities + expected categories.
  - `dcx-requirement-maturation` — advances a node along the maturity dimension, progressively adding
    rules/conditions/exceptions/acceptance-outcomes/responsibilities/expected-categories, respecting the
    progressive-validation matrix.
  - `dcx-manifestation-reconcile` — wraps RS-R3's change-triggered check for agents finishing work.
- **Agent-rule wiring (`core.md`/`AGENTS.md`):** add the mandatory rules — every behavior claim/sprint must
  cite a graph ID; every governed mutation requires sign-off (RS-R2); validators + change-triggered
  reconciliation run **before "done"**; the system is the source of truth. Place rules at the correct layer
  (mandate in rules; mechanism in scripts/hooks). **Do not weaken any existing `core.md` rule.**
- **Planner/audit grounding:** `dcx-sprint-planner` **fails** plans missing the mandatory **Requirement
  Trace** (RS-R0b format); `dcx-plan-audit` **fails** ungrounded/unverifiable traces and behavior claims
  with no graph ID.
- **Hooks / completion gates:** wire the change-triggered reconciliation + `validate` into the completion
  path (e.g. a `verify`-style gate or a documented hook), so a sprint cannot be closed with unreconciled
  new manifestations or failing validators. Respect the existing PostToolUse log-index hook.
- **Skill-sync to ALL agent dirs (discover → repair → prove; do NOT assume current state):** first run the
  discovery command and log actual state — `ls -1 .claude/skills/dcx-*.md .agents/skills/dcx-*.md`
  (carry-forward warns distribution differs across checkouts). Then add the new skills to `sync-skills.sh`'s
  `SKILLS=()` array; run `bash scripts/agent/sync-skills.sh`; re-run the discovery command and confirm both
  dirs carry every `dcx-*` skill incl. the three new ones.
- **Generated low-token context:** ensure the rule points agents at the RS-R2 `query/trace/justify` slices,
  never the whole store.
- **Unit/smoke tests** for the planner/audit grounding failure modes and the completion-gate check.

### Scope — out
- No requirement DATA migration (RS-R6), no full reconciliation run (RS-R7), no dogfood (RS-R9), no doc
  disposition (RS-R10).

### Acceptance criteria
- [ ] (code-verifiable) **Pre-state logged then proven:** the discovery command
      `ls -1 .claude/skills/dcx-*.md .agents/skills/dcx-*.md` is run before and after sync, with actual
      output recorded (not assumed). `dcx-requirement-intake`, `dcx-requirement-maturation`,
      `dcx-manifestation-reconcile` present in `agent-skills/`; `sync-skills.sh` `SKILLS=()` updated;
      `bash scripts/agent/sync-skills.sh` runs clean; the post-sync discovery shows all nine `dcx-*` skills
      in **both** `.claude/skills/` and `.agents/skills/`.
- [ ] (PO-verifiable) `AGENTS.md`/`core.md` carry the mandatory rules (cite-graph-ID, sign-off-before-write,
      reconcile+validate-before-done) without weakening existing rules.
- [ ] (code/PO-verifiable) `dcx-sprint-planner` fails a plan missing the Requirement Trace; `dcx-plan-audit`
      fails an ungrounded trace (demonstrated).
- [ ] (code-verifiable) The completion gate/hook blocks closing with unreconciled new manifestations or
      failing validators (tested or documented fallback per §28).
- [ ] Gates: `npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test` ·
      `bash scripts/verify.sh` · `bash scripts/agent/sync-skills.sh`. §28 fallbacks named.

### Dependencies
RS-R1 + RS-R2 + RS-R3. Feeds RS-R7/R8/R9 (the live graph relies on these gates).

### Executor
Codex (tooling + skills) + Claude (rule wording in `core.md`/`AGENTS.md`).

### Final step
Carry-forward: skill names + locations + sync result; the new `core.md`/`AGENTS.md` rule numbers; the
completion-gate command/hook name.
