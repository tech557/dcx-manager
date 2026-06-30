## RS-R11 — Re-grounding brief (hand-off only) + calibration-debt cleanup convention
Status: Completed (2026-06-30, Claude) — RS-R11.1 brief at `output/RS-R11-reground-brief.md`; RS-R11.2 convention wired into `output/RS-rollout-calibration-mode.md` + `dcx-manifestation-reconcile`/`dcx-code-query` (synced 9/9). Gates: `req:validate` PASS (0 errors); 0 `src/`/`on-hold/` writes.

> Two tasks: **RS-R11.1** the FP re-grounding brief (hand-off only); **RS-R11.2** a durable
> calibration-debt cleanup convention (added 2026-06-30 at PO direction). Neither touches `src/`,
> `on-hold/`, or the graph schema.

---

## RS-R11.1 — Re-grounding brief (hand-off only)

### Intent
Produce a **re-grounding brief** so that, once the PO reactivates `frontend-polish-v0.3.5`, that plan can
redo FP-R4/R5 grounded in the graph. **This sprint does NOT redo FP-R4/R5 and does NOT reactivate the
on-hold plan** — both would violate the `core.md §24` on-hold boundary.

### Step 0
Per README **Global sprint requirements** (env, read carry-forward + the populated/reconciled graph + the
on-hold plan's FP-R4/R5 + core-interaction-model — READ ONLY).

### Scope — in
- Produce `output/RS-R11-reground-brief.md`:
  - the graph requirement IDs FP-R4 must cover (incl. the recovered families — keyboard/SBC/STG/DZ/
    FCS-002/RDY-003/IFX/KBI), via a top-down `trace --from` over the relevant intents;
  - a **coverage-gap map** vs the old FP-R4 criteria, using the graph's expected-vs-actual manifestation
    coverage and the verification (implemented/verified) states — so FP-R4 starts from real coverage, not a
    blank slate;
  - the hand-off contract: FP-R4 redo must cite graph IDs only and carry the mandatory Requirement Trace;
    FP-R5 rebuilds its matrix on it.

### Scope — out
- **No** FP-R4/R5 redo. **No** moving the on-hold plan. **No** edits inside `on-hold/` (read-only). No new
  graph schema changes (frozen after RS-R4/R8).

### Acceptance criteria
- [ ] (PO-verifiable) `output/RS-R11-reground-brief.md` lists the graph IDs FP-R4 must cover + the
      coverage-gap map (using expected-vs-actual coverage + verification states).
- [ ] (code-verifiable) No writes under `on-hold/` or `src/` (path + mtime check).
- [ ] States explicitly that PO reactivation is the downstream step (not done here).

### Dependencies
RS-R10. **Downstream (PO action, not this sprint):** PO moves `frontend-polish-v0.3.5` → `active/`; that
reactivated plan owns the FP-R4/R5 redo.

---

## RS-R11.2 — Requirement-graph calibration-debt cleanup convention (durable hand-off)

### Intent
The first-population graph (RS-R6 seed + RS-R7 reconciliation) **intentionally carries calibration
debt** — duplicate identities/aliases, ~238 unconfirmed candidate links, ~223 unlinked
manifestations, and weak/wrong links. Per the **test/calibration operating mode** (README "Operating
mode during rollout"; `output/RS-rollout-calibration-mode.md`) this debt is visible, auditable,
reversible, and queued, and must **not** block work. Today, though, nothing tells a future agent to
*clear it opportunistically* — it would only be touched by a dedicated sprint. This task turns
cleanup into a **distributed, durable convention**: any agent that checks/queries requirements during
normal work flags duplicates and unlinked items, clears low-risk technical debt under the existing
auto-apply rule, and **routes any product-truth change to PO confirmation** — never a silent edit
(`core.md §35b`).

### Step 0
Same as RS-R11.1 (env + carry-forward read). Additionally read the existing queues this task points
agents at (READ ONLY): `views/rs-r7-deferred-cleanup-queue.md`, `views/rs-r7-review-queue.md`,
`generated/rs-r7-review-queue.json`.

### Scope — in
- Add a **"Calibration-debt cleanup convention"** section to `output/RS-R11-reground-brief.md` stating:
  - **Where the debt lives** — the RS-R7 deferred-cleanup + review queues, and the RS-R2 queue keys
    (`candidateLinksAwaitingConfirmation`, `manifestationsLackingRequirements`, `staleBrokenTraces`,
    `supersededStillInCode`, `exemptionsAwaitingReview`).
  - **The opportunistic-cleanup workflow** an agent runs *whenever it checks requirements* (`req:query`
    / `req:trace` / `req:justify` / `req:reconcile` / `dcx-code-query`):
    | Finding | Action | Gate |
    |---|---|---|
    | Duplicate identity / alias | Record in the deferred-cleanup queue or supersede via `req:propose` (supersede-node) | PO confirm if it changes product truth |
    | Unlinked manifestation (no link, no exemption) | Propose a candidate link or a typed `Exemption` | PO confirm if it asserts product coverage |
    | Weak / wrong / stale link | Flag in `candidateLinksAwaitingConfirmation` / `staleBrokenTraces` | technical-only ≥0.80 may auto-apply + audit ledger; else PO |
    | Anything touching a locked/approved requirement | `req:propose` only — **never** silent edit | **PO sign-off required** |
  - **The boundary:** an inferred/provisional/confirmed link or coverage score **never** authorizes a
    `src/**` change (carry-forward RS-R7); cleanup mutates only graph/trace/ledger data, not product code.
- **Wire it durably (behavior-sustaining, not memory-dependent):**
  - Add an **"Opportunistic cleanup"** subsection to `output/RS-rollout-calibration-mode.md`.
  - Add a short pointer in the `dcx-manifestation-reconcile` and `dcx-code-query` skills telling agents
    to flag-and-queue duplicates/unlinked items (and route product-truth changes to PO) when they
    check requirements; re-sync via `scripts/agent/sync-skills.sh`.

### Scope — out
- **No bulk cleanup executed here.** This task defines the convention and the queue pointers; it does
  **not** clear the ~238 candidate links / ~223 unlinked manifestations (those clear opportunistically
  during real work, or in a future dedicated pass). No `src/` or `on-hold/` writes; no graph schema change.

### Acceptance criteria
- [ ] (PO-verifiable) The brief documents the calibration-debt cleanup convention: queue locations +
      the opportunistic workflow table + the no-`src`-authorization boundary.
- [ ] (PO-verifiable) The convention is wired durably — `RS-rollout-calibration-mode.md` subsection +
      a pointer in `dcx-manifestation-reconcile` and `dcx-code-query`, re-synced (`sync-skills.sh` clean).
- [ ] Product-truth changes require PO confirmation; technical-only corrections follow the ≥0.80
      auto-apply + audit-ledger rule. No silent canonical edits (`core.md §35b`).
- [ ] (code-verifiable) No writes under `src/` or `on-hold/`; no schema change (path + mtime check).

### Executor
Claude.

### Final step
Carry-forward: brief location; the calibration-debt cleanup convention is live + wired into the two
skills; explicit note that the plan is complete and hand-off is ready for PO reactivation
(`dcx-sprint-close` for this plan).
