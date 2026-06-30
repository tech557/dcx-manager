## Planning Amendment — Codex Plan-Review Integration
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-25
Status: Completed

Intent: Incorporate Codex plan-review concerns into FIX sprint files; reflect FIX-NDX and FIX-CRD completion; correct stale status documents.
Trigger: User request to check `docs/progress/sessions/2026-06-25-codex-fix/PLAN-review.md` and account for the two completed sprints.

---

## Codex concerns addressed

| Concern | Where addressed |
|---------|----------------|
| 1. FIX-CRD.2 must not make TaskCard import useEditorPanel (level violation) | FIX-NLC.md §1 — amended to say fix is inside useEditorPanel only; no new cross-level import |
| 2. FIX-NLC.6 must reuse resolveTaskDate, not introduce a second formula | FIX-NLC.md §6 — amended to mandate resolveTaskDate from date.helpers.ts |
| 3. FIX-NLC.4 needs Phase/Action grouping, not just getAllTasks() | FIX-NLC.md §4 — amended to require reading the existing render structure first; use getAllActions if grouping is needed |
| 4. FIX-NLC.5 union type has no shared .kind — use resolveNodeKind | FIX-NLC.md §5 — amended to mandate resolveNodeKind for all kind detection; added visual-order and mixed-kind test to acceptance criteria |
| 5. npm test does not exist — use npx vitest run | testing-plan.md — corrected; FIX-NLC.md testing gate section added |
| 6. Active README reports failed sprints as completed | README.md — corrected with two-table layout (audit results + FIX sprint status); historical logs unchanged |

---

## Files edited

- `docs/plans/active/builder-refactor/sprints/FIX-NLC.md` — all four technical amendments applied
- `docs/plans/active/builder-refactor/testing-plan.md` — npm test → npx vitest run
- `docs/plans/active/builder-refactor/README.md` — status tables corrected

## Completed sprints recognised

- `FIX-NDX` — marked ✅ in README (code in src/utils/node.helpers.ts, tests in src/utils/__tests__/node.helpers.test.ts)
- `FIX-CRD` — marked ✅ in README (TaskReadOnlyPopup rebuilt to 91 lines anchored, long press wired, 2000ms timing, no animate-pulse)

---

## What the next agent should start

FIX-DEN, FIX-NLC, FIX-FIL, and FIX-MOT are now all unblocked and can be assigned in parallel (they are independent of each other). FIX-CAP must follow FIX-NLC.

Priority order if running sequentially:
1. FIX-NLC (highest impact — fixes 6 failing sprints)
2. FIX-DEN (isolated CSS change, low risk)
3. FIX-FIL (isolated to MetadataIsland)
4. FIX-MOT (isolated to motion registry + StageCore)
5. FIX-CAP (after FIX-NLC, in case NLC changes shrink EditorViewerIsland line count)
6. FIX-POL
7. B13
