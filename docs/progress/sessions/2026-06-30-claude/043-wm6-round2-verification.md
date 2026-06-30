---
log: 043-wm6-round2-verification
session: 2026-06-30-claude
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: audit-review
PO-Action: none
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: WM-6
---

# 043 — WM-6 round-2 verification (visual fixes)

Reviewed the implementer's round-2 output ([[042-wm6-round2-visual-fixes]]) against the 6 fixes in
`output-review/2026-06-30-claude-WM-6-review-2-po-visual-fixes.md`. Code + browser (clean restart).

## Verdict: ✅ PASS (5/6 visually verified; Fix 2 density verified by mechanism, not by seed data)

## Code review — all 6 applied correctly
1. `MonthlyTaskChip` deleted; monthly renders `<TaskCard disableExpand>` (real collapsed card).
   `TaskCard` got `disableExpand` → `isExpanded = !disableExpand && expandedNodeIds.includes(id)`.
2. Monthly task list: `flex flex-wrap content-start gap-1 overflow-y-auto` (wrapping + internal scroll).
3. `MonthlyView` grid: `[grid-template-rows:minmax(0,1fr)]` — bounds the row.
4. Per-week horizontal header removed; vertical `W{n}` label in a `w-5` gutter (`writing-mode:vertical-rl`).
5. `min-w-0` on monthly day card; wrapping container can't push width.
6. `TimelineBuilderIsland`: `monthCount=ceil(totalWeeks/4)`, `activeMonth=ceil(activeWeek/4)`;
   prev/nextMonth set `activeWeek` to month boundaries; label/chevrons adapt by `activeSubView`.

## Gates (re-run)
typecheck ✅ · lint ✅ · test 85 ✅

## Browser (Preview MCP, clean server restart, /builder/v-1 → Timeline → Monthly)
- 4 week rows; gutter labels **W1–W4** vertical ✅ (Fix 4)
- grid: 7 cols; computed row track **122.5px** (definite, not auto/content) ✅ (Fix 3)
- **0** `MonthlyTaskChip` remnants (`[title^="Hold to open"]`=0) ✅ (Fix 1)
- monthly view: no v-scroll, no h-scroll (1200=1200 @1440px); **document has no v/h scroll** ✅ (Fix 5)
- island shows **Month 1/1**; Add Week ×4 → **Month 1/2** (next enables) → click → **Month 2/2**
  (4 rows = weeks 5–8) ✅ (Fix 6)
- Desktop screenshot @1440: clean 7×4 grid, vertical gutter labels, weekend cols dimmed, no overlap.

## Caveats (not blocking, for PO awareness)
- **Fix 2 density not visually exercised**: this `v-1` mock seed places no tasks in the visible weeks
  (`[data-card-kind=task]`=0 in monthly), so the wrapping collapsed-cards + internal-scroll-under-load
  could not be screenshotted. Mechanism is sound (bounded 122.5px row + `overflow-y-auto` + flex-wrap +
  real collapsed `TaskCard`). **PO to eyeball on a data-rich version**: a busy day shows collapsed
  cards wrapping 1–2 rows then scrolling inside the cell; long-press a card → Task Editor.
- Stage wrapper has a ~37px internal horizontal delta, but it is clipped by `overflow-hidden` and
  produces **no document scrollbar** — not user-visible. Likely the edge-nav crescents. Cosmetic.
- The `useStageContext must be used inside StageProvider` console spam seen mid-session was **HMR
  churn** (Vite `?t=` re-eval of the provider); gone after a clean server restart. Not a defect.

## Recommendation
WM-6 round-2 meets REQ-CAL-MONTH-001 and the PO visual asks. Ready to close once PO confirms the
density/long-press behavior on a populated version. `sprints/WM-6.md` can return to Completed after
that confirmation.
