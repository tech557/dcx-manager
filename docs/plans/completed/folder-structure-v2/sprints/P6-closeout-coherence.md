---
sprint: P6-closeout-coherence
plan: folder-structure-v2
version_context: v0.3.4
status: completed
executor: Codex
depends-on: P5-frontend-readiness (governance + visual baseline done; editor blocker resolved as false-alarm)
inputs:
  - docs/plans/active/folder-structure-v2/output-review/P5-frontend-readiness-review.md
  - docs/plans/active/folder-structure-v2/README.md (carry-forward contract)
output: docs/plans/active/folder-structure-v2/output/P6-closeout-coherence.md
---

# P6 — Closeout + Doc/Agent Coherence (final sprint, then plan-level close)

## Task Progress

| Task | Status | Notes |
|---|---|---|
| Step 0 — Session environment + carry-forward | Completed | Session scripts run; P5 review and README carry-forward read; P6 accepted as executable with PO-version caveat. |
| Step 1 — Resolve P5 editor blocker | Completed | P5 output reclassified as resolved; cited disabled drop-hint code path and P3 editor-open evidence. |
| Step 2 — Bounded lint cleanup | Completed | Lint reduced 119 -> 42 explicit-any only; typecheck/test/architecture pass; `typed-any-cleanup` follow-up required. |
| Step 3 — Durable structural truth | Completed | `src-structure-decision.md` refreshed to live tree; code-index regenerated. |
| Step 4 — Supersede v2 discoveries | Completed | Completed UX/FE/BE discovery READMEs now carry superseded banners pointing to current structural authority. |
| Step 5 — Version + storage debt | Completed | `docs/VERSION.md` recorded as authoritative v0.3.4; `metadata.json` sync remains PO-owned; day-note/editor-draft storage stays temporary UI-local pending BE final decision. |
| Step 6 — Agent/doc coherence | Completed | `impeccable` quarantine visible in AGENTS/CLAUDE; durable Builder follow-up register created with test count and tooling debts. |
| Step 7 — Full gates + plan close | Completed | Sprint close verdict PASS WITH DOCUMENTED DEBT; plan archived after gates and carry-forward update. |

## Why this sprint exists

P1–P5 finished the structural work, but closing the plan would (a) archive the carry-forward
"current structural truth" where the next 4 plans can't see it, (b) leave the **v2 discovery outputs
stale** (they describe the pre-refactor tree), and (c) carry real debt (114 lint errors incl. ~20
react-hooks bugs, version mismatch, stale code-index). PO decisions (2026-06-28): **bounded lint
cleanup here**, and **run this closeout BEFORE archiving** so the next plans inherit accurate state.

After this plan there are **only 4 more plans**: FE-final-discovery, FE-final-implementation,
BE-final-discovery, BE-final-implementation. This sprint makes sure those start from truth, not stale docs.

This sprint touches: lint fixes (no behavior change), and docs/agent-config. It does **not** restructure
components/shells, and does **not** use the quarantined `impeccable` skill.

## Step 0 — Session environment + carry-forward

```bash
bash scripts/agent/build-current-state.sh
bash scripts/agent/verify-tooling-state.sh
```
Record both verbatim in `output/P6-closeout-coherence.md`. Read the README `## Carry-forward contract`
and the P5 review. Confirm `version_context` v0.3.4 vs `docs/VERSION.md`. Obey REUSE-don't-RECREATE (§7/§27).

---

## Step 1 — Resolve the P5 editor-panel "blocker" (false alarm — not a regression)

The P5 editor-panel evidence gap is **not a code defect**:
- `EditorViewerIsland.tsx:121` — the "Open Editor" collapsed button is intentionally `disabled`; its
  title is *"Drag task here to edit"*. It is a **drop hint**, never clickable.
- The editor expands via `isExpanded = !!activeNode && activeNode.kind !== 'day' && !!draftData`,
  driven by **drag-drop** onto the editor island (`onDrop={handleDrop}`) or long-press → `setFocusedNodeId`.
- **P3 already captured the editor open** (`output/evidence/p3-editor-open.png`, `task-editor-input.png`).

Actions:
1. Update `output/P5-frontend-readiness.md`: reclassify the blocker as **RESOLVED — verification-path
   issue, not a regression**; cite the disabled-by-design drop hint + the drag/long-press open path +
   the existing P3 evidence.
2. **Optional (clean baseline):** capture the editor-open at 1440/1920/2560 via the correct path
   (drag a task onto the editor island, or long-press a task), saved to
   `output/evidence/P5-polish-baseline/`. If the browser MCP/Chromium is unavailable, accept P3's
   editor-open evidence + the documented interaction (core.md §28; do not fake).

Acceptance: P5 editor blocker documented as resolved (false alarm); editor-open baseline exists
(re-captured via drag, or P3 evidence cited).

---

## Step 2 — Bounded lint cleanup (PO decision: bounded, not full)

Baseline: **119 problems (114 errors, 5 warnings).** Categories:
`no-unused-vars ×51`, `no-explicit-any ×42`, `react-hooks/set-state-in-effect ×13`,
`react-hooks/exhaustive-deps ×5`, `react-hooks/static-components ×4`, `react-hooks/refs ×2`,
`no-empty-object-type ×2`.

Do (no behavior change unless fixing a confirmed bug):
1. **Remove the 51 `no-unused-vars`** (dead imports/vars). Pure cleanup.
2. **Triage + fix the ~24 react-hooks errors** (`set-state-in-effect ×13`, `exhaustive-deps ×5`,
   `static-components ×4`, `refs ×2`). These are **potential real bugs** — fix each or document why
   it's intentional (e.g. an effect that legitimately derives state). Do not blanket-disable.
3. **Fix the 2 `no-empty-object-type`** (trivial type fix).
4. **Leave the 42 `no-explicit-any`** — out of scope here; create a named follow-up
   **`typed-any-cleanup`** (these need real domain types, belongs in the FE implementation plan).

```bash
npm run lint 2>&1 | tail -3   # expect ~42 problems remaining (the deferred any), 0 react-hooks errors
npm run typecheck && npm run test && npm run validate:architecture
```

Acceptance: lint errors reduced from 114 → ≤~44 (only the deferred 42 `any` + any documented
exceptions); **0 react-hooks errors remain or each is documented**; typecheck/test/architecture PASS;
`typed-any-cleanup` follow-up named in the durable follow-ups doc (Step 6).

---

## Step 3 — Promote the structural truth to a DURABLE home (anti-misinformation keystone)

The carry-forward contract (post-P1–P5 facts) currently lives in this plan's README, which Step 7
archives. The next 4 plans need it. Refresh the **stale** `docs/product/decisions/src-structure-decision.md`
(it still describes a `src/components/` that no longer exists) so it becomes the **current, authoritative
structure record**:
- Replace the stale "Current State" with the post-refactor reality: `src/ui/{atoms,forms,surfaces,shadcn}`,
  the shells, `src/brand/styles/{theme,tokens,components}.css`, the `apiClient → mockDispatch` seam +
  `src/services/mock/*`, the merged `useEditorState`, `text-dcx-*`/`--theme-*` token language.
- Carry forward the REUSE-don't-RECREATE rule and the retained-by-policy categories.
- Keep/clear the ⚠️ STALE banner once refreshed (PO approves the decision doc).

```bash
npm run generate:code-index   # refresh the code-index the discovery plans read
```

Acceptance: `src-structure-decision.md` reflects the live tree (no references to deleted `src/components/`
or deleted primitives); the carry-forward facts survive plan archive; code-index regenerated.

---

## Step 4 — Mark the v2 discovery outputs SUPERSEDED (protect the next discovery plans)

`docs/plans/completed/{ux,frontend,backend}-discovery-v2/` describe the **pre-refactor** tree. The next
FE/BE **final-discovery** plans must NOT reuse them as current truth. Add a banner to each plan's README:

> ⚠️ SUPERSEDED by `folder-structure-v2` execution (P1–P6, 2026-06). Counts and structure here are
> PRE-refactor (atoms unconsolidated, CSS monolith, services on localStorage, editor hooks unmerged).
> The FE/BE final-discovery plans MUST re-discover against the live tree — see
> `docs/product/decisions/src-structure-decision.md` for current state.

Acceptance: all three v2 discovery READMEs carry the superseded banner.

---

## Step 5 — Reconcile version + flag tooling debt durably

1. **Version mismatch:** `docs/VERSION.md` = `v0.3.4`, `metadata.json` = `v0.3.3`. Agents never set the
   version (core.md §26) — **surface to the PO**: which is authoritative? Record the resolution; do not
   auto-change.
2. **Day-note/editor-draft localStorage** (`src/utils/browser-storage.helpers.ts`): document whether it
   stays UI-local or is scheduled for the seam in BE-final-implementation. Record the decision.

Acceptance: version mismatch surfaced with a recorded PO resolution; day-note storage decision documented.

---

## Step 6 — Agent/doc coherence (avoid misinformation for the next 4 plans)

1. **Skill tables:** add `impeccable` (QUARANTINED — see `docs/agent-skills.md`) to the CLAUDE.md and
   AGENTS.md skill listings so it isn't mistaken for an active project skill.
2. **Durable follow-ups doc:** the plan README's "Follow-ups / tooling debt" archives with the plan.
   Move the still-open items into a durable home (e.g. `docs/agent-rules/` or a `docs/product/follow-ups.md`):
   `build-log-index.sh` mislabel, `sync-skills.sh` `dcx-plan-audit` adapter truncation, Quality-gates
   `BLD-*` ID, `typed-any-cleanup`, `production-api-client-switch`, `P1b-color-tokens`.
3. **"More tests" reconciliation:** confirm the test count (still 27/6) and note it — no phantom claims.

Acceptance: impeccable listed (quarantined) in CLAUDE.md/AGENTS.md; open follow-ups live in a durable
doc, not only the to-be-archived plan README.

---

## Step 7 — Full gates + PLAN-LEVEL CLOSE (core.md §29 plan close, §24 move)

```bash
npm run typecheck && npm run lint && npm run validate:architecture && npm run test && npm run build
```
Browser: dev-smoke + the editor-open baseline from Step 1 (MCP screenshot if available; §28 fallback otherwise).

Then **close the plan**:
1. Update the README `## Carry-forward contract` final state; mark **all sprints P1–P6 complete**.
2. README `Status:` → completed; move `docs/plans/active/folder-structure-v2/` → `docs/plans/completed/`
   (core.md §24). Set the `superseded-by`/next-plan pointer to the FE/BE final-discovery plans.
3. Confirm the structural truth now lives in `src-structure-decision.md` (Step 3) so the move doesn't
   lose it.

Write `output/P6-closeout-coherence.md` (session env, lint before/after, doc refreshes, version/debt
decisions, plan-close confirmation).

---

## Acceptance criteria for sprint sign-off (and plan close)

- [x] `## Session Environment` recorded
- [x] P5 editor blocker documented RESOLVED (false alarm); editor-open baseline exists (re-captured or P3-cited)
- [x] Lint errors 114 → ≤~44; **0 react-hooks errors** (or each documented); 42 `any` deferred to named `typed-any-cleanup`
- [x] `src-structure-decision.md` refreshed to the live post-refactor tree (carry-forward truth durable); code-index regenerated
- [x] v2 discovery READMEs (ux/fe/be) carry the SUPERSEDED banner
- [x] Version mismatch surfaced + PO resolution recorded; day-note storage decision documented
- [x] `impeccable` (quarantined) listed in CLAUDE.md + AGENTS.md; open follow-ups in a durable doc
- [x] `npm run typecheck`/`test`/`validate:architecture`/`build` PASS; lint at the agreed reduced count
- [x] **Plan-level close:** all P1–P6 complete; plan moved to `completed/`; next-plan pointer set
- [x] README carry-forward updated (final state) — core.md §27/§29
