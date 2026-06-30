---
review: WM-6 output review (round 2 — PO visual)
sprint: WM-6
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
verdict: CHANGES REQUESTED — monthly view fails REQ-CAL-MONTH-001 in the browser; 6 fixes required
supersedes: 2026-06-30-claude-WM-6-review.md (static-only PASS; missed all visual regressions)
---

# WM-6 Review (round 2) — Monthly view does not meet REQ-CAL-MONTH-001

## Why this review exists
The round-1 review verdict was **PASS**, but every browser/visual proof in it was marked
`BLOCKED §28` — it verified the code *compiled and matched the described intent*, never that it
*renders correctly*. PO opened the monthly view and found it broken. **Lesson for the agent: a
sprint whose acceptance is "no vertical scroll / compact grid / cards stay on screen" cannot be
closed PASS while the visual gate is BLOCKED — that gate IS the acceptance.** Mark such a sprint
`BLOCKED`/`Partial`, not Completed.

PO evidence: monthly view screenshot (HSA Campaign, 4 weeks). Observed: task lists overflow their
day cells and overlap the week below; week date-ranges overlap the right-edge cards; week labels
eat a full header row; a bespoke task chip is used instead of the real card.

## Verdict: CHANGES REQUESTED

---

## Fix 1 — Reuse the collapsed Task card; delete `MonthlyTaskChip` (REUSE-don't-RECREATE, core.md §7)

**Symptom:** Monthly days render task **text chips** (blue pills "LinkedIn article", "YouTube
pre-roll", …), not the product's task card.

**Root cause:** [`DayGridCard.tsx:29-57`](src/builder/stage/views/DayGridCard.tsx:29) defines a new
inline `MonthlyTaskChip`, and [`DayGridCard.tsx:239-247`](src/builder/stage/views/DayGridCard.tsx:239)
renders it in monthly mode. This **duplicates two things that already exist**:
- the **collapsed `TaskCard`** (channel-icon mini card, `w-14 h-[60px]`,
  [`TaskCard.tsx:65-117`](src/builder/cards/templates/task/TaskCard.tsx:65)), and
- its **long-press→editor** behavior (already on `CardShell` via `useCardDrag`, 400ms — the WM-3
  task-only editor path). `MonthlyTaskChip` re-codes its own 500ms timer for the same effect.

**Required fix:**
- Delete `MonthlyTaskChip`.
- In the monthly branch render the **collapsed `TaskCard`** (the same component the week view and the
  action card's `HorizontalTaskFlow` already use — see
  [`HorizontalTaskFlow.tsx:58`](src/builder/cards/templates/phase/HorizontalTaskFlow.tsx:58)).
- Keep the spec rule "expanded-state DISABLED": ensure monthly never adds these task ids to
  `expandedNodeIds` (cards stay collapsed). Long-press already opens the editor via the shared card
  path — no custom timer needed.

**Acceptance:** monthly day cells show the real channel-icon task card (collapsed); long-press opens
the Task Editor; no bespoke chip component remains.

---

## Fix 2 — Day container = 1–2 wrapping rows with internal vertical scroll (like the action card)

**Symptom:** A day with many tasks renders a tall stack that overflows the cell and overlaps the
next week (e.g. Fri 10 stack runs over the Week-3 date range).

**Root cause:** Two layered problems:
1. The monthly task list is a single vertical column
   ([`DayGridCard.tsx:240`](src/builder/stage/views/DayGridCard.tsx:240)
   `flex flex-col gap-0.5 overflow-y-auto`). It *has* `overflow-y-auto`, but it never clips because
   its parent has no bounded height — see Fix 4.
2. PO wants the **action-collapsed-card layout**: collapsed cards flowing in **1–2 rows that wrap**,
   with vertical scroll past that — not a 1-wide column.

**Required fix:**
- Lay the collapsed task cards in a wrapping flow: `flex flex-wrap content-start gap-1` inside a
  `flex-1 min-h-0 overflow-y-auto` container, so they fill 1–2 rows then scroll vertically.
- The collapsed `TaskCard` is `flex-none` (~56px) → ~3 per row in a ~180px cell, `min-w-0` on the
  cell prevents horizontal overflow.

**Acceptance:** a day with N tasks shows them wrapping across the cell width; overflow scrolls
*inside* the cell only; nothing spills into the week below.

---

## Fix 3 — Constrain the 7-col grid row height (the real cause of all overflow)

**Symptom (root of Fix 2 + the overlap):** day cards grow to content height; `h-full` and the
cell's `overflow-y-auto` do nothing.

**Root cause:** [`MonthlyView.tsx:73`](src/builder/stage/views/MonthlyView.tsx:73) the day grid is
`flex-1 min-h-0 grid grid-cols-7`. A CSS grid with the default `grid-auto-rows: auto` sizes its
single implicit row to the **tallest cell's content**. So `DayGridCard h-full`
([`DayGridCard.tsx:154`](src/builder/stage/views/DayGridCard.tsx:154)) resolves against an
auto (content) row → unbounded → the card's internal `overflow-y-auto` never engages, and the grid
visibly overflows the `flex-1` height into the week below.

**Required fix:** give the grid a definite row track:
`grid grid-cols-7 [grid-template-rows:minmax(0,1fr)]` (or `grid-rows-[minmax(0,1fr)]`). With a
`minmax(0,1fr)` row, `h-full` cells get a bounded height and their internal scroll engages. Verify
in-browser that each `DayGridCard`'s task list is the *only* scroller.

**Acceptance:** with dense data, `monthlyView.scrollHeight === clientHeight` (no view scroll) and
each overflowing day cell scrolls internally.

---

## Fix 4 — Week labels vertical; remove the overlapping header row + date-range

**Symptom:** "WEEK 1/2/3/4" sit in a header row that consumes vertical space; the right-aligned
date-range (`2026-07-05 — 2026-07-11`) overlaps the rightmost day cards.

**Root cause:** [`MonthlyView.tsx:62-70`](src/builder/stage/views/MonthlyView.tsx:62) renders a
full-width `justify-between` header per week (WEEK n … date-range). The date-range is pushed to the
far right edge and overlaps the Sat column when rows are dense.

**Required fix:**
- Drop the horizontal per-week header row.
- Restructure each week as a row with a **narrow left gutter** + the 7-col grid:
  `flex flex-row` → gutter `w-5 shrink-0` containing a **vertical** label
  (`[writing-mode:vertical-rl] rotate-180 text-dcx-2xs tracking-widest` → reads bottom-to-top) with
  "WEEK n". This reclaims the vertical space and removes the date overlap.
- Date-range: either drop it, or place it small inside the gutter under the label. Do **not** keep it
  full-width right-aligned.

**Acceptance:** week labels read vertically in a thin left gutter; no date text overlaps any day
card; the saved vertical space goes to the day grids.

---

## Fix 5 — Zero page scroll (vertical AND horizontal), month must fit

**Symptom / requirement:** PO: "there should be no vertical or horizontal scroll." Only the day
cells scroll internally.

**Root cause:** vertical overflow is Fix 3. Horizontal: confirm the collapsed cards + `min-w-0`
cells never force the 7-col grid wider than the stage (the bespoke chip was `w-full` so it didn't,
but the real collapsed card is `flex-none` 56px — the wrapping container from Fix 2 must `min-w-0`
and wrap, never push width).

**Required fix:** after Fixes 2–4, assert in-browser at the desktop range: `document` and
`#timeline-subview-panel` have no scrollbars; only `DayGridCard` task lists scroll. Editor-open must
shrink the grid (flex contracts) — re-verify the "cards stay on screen" clause of REQ-CAL-MONTH-001.

**Acceptance:** no window/stage scrollbar in monthly view at 1280–1920px wide, editor open or closed.

---

## Fix 6 — Timeline island: month switch, not week; add-week grows months

**Symptom / requirement:** Bottom island shows `TIMELINE Week {activeWeek}/{totalWeeks}` with
week prev/next. PO wants a **month** switcher; "you can only add weeks (show next month if weeks
< 4 [i.e. once a month exceeds 4 weeks])."

**Root cause:** [`TimelineBuilderIsland.tsx:46-77`](src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx:46)
indicator + chevrons are week-based; [`useWeekState.ts`](src/builder/stage/useWeekState.ts) only
exposes `activeWeek/totalWeeks/prev/nextWeek`.

**Required fix (derive months from weeks — a month = 4 weeks):**
- `monthCount = Math.ceil(totalWeeks / 4)`, `activeMonth = Math.ceil(activeWeek / 4)`.
- Indicator → `Month {activeMonth}/{monthCount}`.
- prev/next month set `activeWeek` to that month's first week:
  prev → `setActiveWeek((activeMonth - 2) * 4 + 1)`; next → `setActiveWeek(activeMonth * 4 + 1)`
  (clamp ≥1 / ≤totalWeeks). Disable prev at month 1, next at the last month.
- Keep the **Add Week** button as the only growth control (no "add month"): it grows `totalWeeks`;
  when `totalWeeks` crosses a multiple of 4, `monthCount` increments and the new month becomes
  navigable — this is the "show next month" behavior. A partial month (<4 weeks) is valid and
  renders only its weeks.
- Consider adapting by `activeSubView`: month nav in monthly view; week nav may stay in weekly view.
  Confirm intent with PO if unsure, but monthly view must show month switching.
- This composes with `MonthlyView`'s existing paging
  ([`MonthlyView.tsx:45-47`](src/builder/stage/views/MonthlyView.tsx:45),
  `activeMonthIndex = ceil(activeWeek/4)`), so the switcher drives which 4-week page renders.

**Acceptance:** island reads `Month a/b`; prev/next page whole months and move the monthly grid;
Add Week extends the timeline and spawns a new navigable month once a month fills past 4 weeks.

---

## Secondary / watch items
- `MonthlyView` rows are each `flex-1`; a month with a single (partial) week makes one giant row.
  Cap with `max-h` or `auto-rows` so a 1-week month doesn't balloon.
- Could not re-confirm in my session that "Switch to Timeline view" actually swaps the stage to
  `TimelineView` (stage kept `data-view="timeline"` but rendered the kanban container under a small
  seed). **Agent: verify the Timeline main-view → TimelineView → monthly sub-view path renders
  `[data-monthly-view]` before testing the above.** May be a seed/synthetic-click artifact in my
  session — flagging, not asserting.
- `sprints/WM-6.md` is `Status: Completed`; revert to in-progress until these land (the original
  output also marked the PO Web Check BLOCKED, so it was never close-eligible per the §28 rule).

## Files in scope for the fixes
- `src/builder/stage/views/DayGridCard.tsx` (Fix 1, 2)
- `src/builder/stage/views/MonthlyView.tsx` (Fix 3, 4, 5, secondary)
- `src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx` (Fix 6)
- `src/builder/stage/useWeekState.ts` (Fix 6 — optional month helpers)

## Re-verification required before re-close (real browser, dense seed)
1. Monthly: no window/stage scroll, editor open & closed.
2. Day cell: collapsed real task cards wrapping 1–2 rows, internal scroll only.
3. Week labels vertical, no date overlap.
4. Long-press a monthly task card → Task Editor.
5. Island shows Month switch; Add Week spawns next month past 4 weeks.
Evidence → `output/evidence/WM-6-stage-views/` (screenshots, not just code).
