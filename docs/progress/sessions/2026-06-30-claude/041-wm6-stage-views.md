---
log: 041-wm6-stage-views
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

# 041 — WM-6: Stage views / Kanban / Timeline / ViewHelper + scroll

## Status: ✅ Completed (code + gates)

## WM-5 review written
- `output-review/2026-06-30-claude-WM-5-review.md` written (carried from prior context — PASS).

## Gap analysis results (carried from prior context / Explore agent)

Pre-existing (no changes needed):
- ViewHelper gating (Timeline-only) ✅
- KBI creator pills (footer palette) ✅
- Day-card quick-create T06/T07 (DayGridCard + DayTaskCreator) ✅
- Auto-centre on focus (scrollIntoView) ✅
- Weekly 5+2 day-of-week preset: `useWeeklyView` already expands `enabledDayIds` (workdays where `isEnabled=true`); weekends (dayIndex 5=Fri, 6=Sat) have `isEnabled=false` → start collapsed. Confirmed pre-existing ✅

Gaps fixed this sprint:
- **REQ-CAL-MONTH-001**: MonthlyView overflow bug + 4-week chunked layout + compact rows + task mini-chips + long-press editor
- **REQ-BC-008** (K08): Kanban phase-column bounded height + internal scroll
- **REQ-TPL-001**: TemplatePopup wired into KanbanBuilderIsland
- **REQ-STG-001**: Mis-targeted RS-R6 seed link corrected with confirmed RS-R7 manifestation link to StageProvider

## Implementation

### `src/builder/stage/views/MonthlyView.tsx`
**REQ-CAL-MONTH-001** — Complete rewrite:
- Added `activeWeek` to `useStageContext` destructure.
- `WEEKS_PER_PAGE = 4`; compute `activeMonthIndex = Math.ceil(activeWeek / 4)` → `startWeek`/`endWeek`.
- Outer: `overflow-hidden` (no scroll); each week row: `flex-1 min-h-0 flex flex-col`.
- Grid: `flex-1 min-h-0 grid grid-cols-7 gap-2` — stretches to row height.
- Removed `overflow-y-auto`, `space-y-5`, `max-w-[1200px]`.

### `src/builder/stage/views/DayGridCard.tsx`
**REQ-CAL-MONTH-001** — Monthly mode changes:
- Added `useRef` import.
- Added `MonthlyTaskChip` component: 500ms long-press timer using `useRef<ReturnType<typeof setTimeout>>` → fires `onLongPress()` → `setFocusedNodeId(task.id)` in caller.
- Changed `h-[140px]` → `h-full` in monthly mode (fills parent row height).
- Monthly task rendering path: replaces full `<TaskCard>` with `<MonthlyTaskChip>` array (expansion disabled). Weekly path unchanged.
- Used `task.name` (correct Task field) not `task.label`.

### `src/builder/stage/views/KanbanView.tsx`
**REQ-BC-008 K08** — Removed `items-start` from `kanban-board` div; default flex cross-axis is stretch → phase columns fill `h-full max-h-full min-h-0`; PhaseCard's action list `overflow-y-auto h-full` now bounded.

### `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx`
**REQ-TPL-001** — Wired TemplatePopup (previously dead code):
- Imported `LayoutTemplate` from lucide-react and `TemplatePopup`.
- Added `isTemplateOpen, toggleTemplate` via `useToggle`.
- Added Template button in creator palette (after existing palette items, before AI Section divider).
- Rendered `<TemplatePopup isOpen={isTemplateOpen} onClose={toggleTemplate} />` below task creation popup.

## RS-R7 TRC links created
- `TRC-WM6-REQ-CAL-MONTH-001-TO-MAN-react-component-monthlyview` (confirmed, complete)
- `TRC-WM6-REQ-CAL-MONTH-001-TO-MAN-react-component-daygridcard` (confirmed, partial)
- `TRC-WM6-REQ-CAL-WEEK-001-TO-MAN-hook-useweeklyview` (confirmed, complete — pre-existing)
- `TRC-WM6-REQ-BC-008-TO-MAN-react-component-kanbanview` (confirmed, complete)
- `TRC-WM6-REQ-TPL-001-TO-MAN-react-component-kanbanbuilderisland` (confirmed, partial — gallery content future work)
- `TRC-WM6-REQ-STG-001-TO-MAN-react-component-stageprovider` (confirmed, complete — correction of mis-targeted RS-R6 seed link)

## Gates
typecheck ✅ · lint ✅ (0 warnings) · test (85, 12 files) ✅ · architecture (275 modules, 0 violations) ✅ · req:validate ✅ · req:completion-gate ✅ PASS

## PO Web Check
BLOCKED §28 — real-pointer proof (monthly compact grid no-scroll + task long-press editor, weekly 5+2 layout, kanban bounded scroll, template popup) requires Playwright/preview server. Batch with WM-2/3/4/5 Playwright queue.

## Next
WM-6 output doc + WM-5 review + sprint close.
