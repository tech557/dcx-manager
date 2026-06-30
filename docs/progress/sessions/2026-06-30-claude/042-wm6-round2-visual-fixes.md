---
log: 042-wm6-round2-visual-fixes
session: 2026-06-30-claude
agent: Claude
model: claude-sonnet-4-6
provider: Anthropic
date: 2026-06-30
type: implementation
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: WM-6
---

# 042 — WM-6 Round 2: Visual fixes per PO review

## Status: ✅ Gates PASS (code); PO browser re-verification pending (BLOCKED §28)

## Review applied
`2026-06-30-claude-WM-6-review-2-po-visual-fixes.md` — 6 fixes required.
Round-1 review was static-only PASS; PO found visual regressions.
Sprint status reverted to In Progress per review instruction.

## Fixes applied

### Fix 1 — Delete MonthlyTaskChip; reuse collapsed TaskCard (REUSE-don't-RECREATE)
- `DayGridCard.tsx`: removed `MonthlyTaskChip` inline component + `useRef` import.
- Monthly task list now renders real `<TaskCard disableExpand={true}>` — the same collapsed card (`w-14 h-[60px]` with channel icon) used in WeeklyView and HorizontalTaskFlow.
- Long-press → editor path already lives in `CardShell` via `useCardDrag`; no custom timer needed.
- `TaskCard.tsx`: added `disableExpand?: boolean` prop; `isExpanded = !disableExpand && expandedNodeIds.includes(task.id)`. Guarantees monthly cards never expand even if double-clicked.

### Fix 2 — Wrapping flex rows, internal scroll only
- `DayGridCard.tsx` monthly task container: `flex flex-col gap-0.5` → `flex flex-wrap content-start gap-1 overflow-y-auto scrollbar-none`.
- Collapsed cards (~56px wide) wrap naturally 2–3 per row; overflow scrolls *inside* the cell.

### Fix 3 — Grid row constraint (root cause of all overflow)
- `MonthlyView.tsx` day grid: `grid grid-cols-7` → `grid grid-cols-7 [grid-template-rows:minmax(0,1fr)]`.
- With a `minmax(0,1fr)` row track, `DayGridCard h-full` resolves to a bounded height; `overflow-y-auto` in the task list now engages properly.

### Fix 4 — Vertical week labels in narrow gutter; header row removed
- `MonthlyView.tsx`: replaced `flex flex-col` week row (header + grid) with `flex flex-row` week row.
- Narrow left gutter `w-5 shrink-0`: `<span style="writing-mode:vertical-rl; transform:rotate(180deg)">W{n}</span>`.
- Date-range span removed entirely — reclaims vertical space, eliminates overlap with right-side cards.

### Fix 5 — No horizontal overflow
- `DayGridCard.tsx` monthly root: added `min-w-0` to prevent cell from pushing the 7-col grid wider.
- Wrapping task container (Fix 2) never expands width beyond the cell — collapsed cards wrap, not overflow.

### Fix 6 — Month nav in monthly view; week nav in weekly view
- `TimelineBuilderIsland.tsx`: added `setActiveWeek` to context destructure.
- `monthCount = Math.ceil(totalWeeks / 4)`; `activeMonth = Math.ceil(activeWeek / 4)`.
- `prevMonth`: `setActiveWeek(max(1, (activeMonth-2)*4+1))`. `nextMonth`: `setActiveWeek(min(totalWeeks, activeMonth*4+1))`.
- Nav chevrons + indicator label switch between `Month a/b` (monthly mode) and `Week a/b` (weekly mode) based on `activeSubView`.
- Chevron disabled states: monthly → `activeMonth <= 1` / `activeMonth >= monthCount`; weekly unchanged.
- Add Week remains the only growth control; crossing a multiple of 4 increments `monthCount`.

## Gates
typecheck ✅ · lint ✅ (0 warnings) · test (85) ✅ · architecture (275 modules) ✅ · req:validate ✅ · completion-gate ✅ PASS

## Sprint status
`WM-6.md` reverted to `Status: In Progress` — PO browser re-verification required before close.

## PO Web Check required before close
1. Monthly: no window/stage scroll at desktop width, editor open + closed.
2. Day cell: collapsed real task cards wrapping 1–2 rows, internal scroll only, no cell overflow.
3. Week gutter labels read vertically; no date text overlaps any card.
4. Long-press monthly task card → Task Editor.
5. Island: month switch in monthly view (Month a/b); week switch in weekly view (Week a/b); Add Week increments; new month unlocks past 4 weeks.
Evidence → `output/evidence/WM-6-stage-views/`.
