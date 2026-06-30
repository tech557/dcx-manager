---
sprint: WM-6
plan: frontend-polish-implementation-v0.3.5
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
status: Status: Completed
version_context: v0.3.5
---

# WM-6 — Stage views / Kanban / Timeline / ViewHelper + scroll

## Requirement Trace
| Field | Value |
|---|---|
| Graph IDs | REQ-CAL-MONTH-001, REQ-CAL-WEEK-001, REQ-BC-008, REQ-TPL-001, REQ-STG-001, REQ-STG-002, REQ-STG-003, REQ-STG-004, REQ-STG-005, REQ-VHB-001, REQ-KBI-001, REQ-BC-007, REQ-BC-009, REQ-BC-010, REQ-UP-001..004, REQ-FP-CMA-002..004, REQ-FP-D03, REQ-FP-D04, REQ-UP-007, REQ-UP-008 |
| Scope/type | frontend / interaction + state |
| States before | `delivery: not-assessed` for REQ-CAL-MONTH-001, REQ-BC-008, REQ-TPL-001 |
| States after | `delivery: implemented` — all gaps fixed; pre-existing features confirmed |

## Gap analysis

| Feature | State before WM-6 | Outcome |
|---|---|---|
| REQ-CAL-MONTH-001 — No vertical scroll, compact 7-col grid, task mini-chips, long-press editor | ❌ `overflow-y-auto` bug; all weeks rendered; full TaskCards (expand capable); `h-[140px]` fixed | **Fixed** |
| REQ-CAL-WEEK-001 — 5 expanded workday + 2 collapsed weekend | ✅ Pre-existing: `useWeeklyView` expands `enabledDayIds`; Fri/Sat have `isEnabled=false` | Confirmed, no change |
| REQ-BC-008 K08 — phase-column bounded height + internal scroll | ❌ `items-start` on kanban-board let columns grow to content height | **Fixed** |
| REQ-TPL-001 — Template gallery accessible from UI | ❌ `TemplatePopup` existed but never imported (dead code) | **Fixed — wired** |
| REQ-STG-001 — Correct mis-targeted RS-R6 seed link | ❌ Existing TRC pointed to RSP-STG-SEED (skill-derived, needs-confirmation) | **Fixed — confirmed RS-R7 link to StageProvider** |
| ViewHelper gating (Timeline-only) | ✅ Pre-existing | None |
| KBI creator pills | ✅ Pre-existing | None |
| Day-card quick-create T06/T07 | ✅ Pre-existing | None |
| Auto-centre on focus | ✅ Pre-existing | None |

## Changes made

### `src/builder/stage/views/MonthlyView.tsx`
**REQ-CAL-MONTH-001** — Complete rewrite following v0.1.4 reference pattern:
- Added `activeWeek` to `useStageContext` destructure.
- Added `WEEKS_PER_PAGE = 4` constant.
- Page calculation: `activeMonthIndex = Math.ceil(activeWeek / 4)` → `startWeek` / `endWeek` (4 weeks max).
- Outer container: `overflow-hidden` — **no vertical scroll**.
- Each week row: `flex-1 min-h-0 flex flex-col` — all rows divide available height equally.
- Day grid: `flex-1 min-h-0 grid grid-cols-7 gap-2` — stretches to row height.
- Removed: `overflow-y-auto`, `space-y-5`, `min-h-full`, `max-w-[1200px]` (grid now shrinks naturally when editor opens because flex layout contracts the stage).

### `src/builder/stage/views/DayGridCard.tsx`
**REQ-CAL-MONTH-001** — Monthly-mode task rendering:
- Added `useRef` import.
- Added `MonthlyTaskChip` component inline: small `<div>` chip with truncated task name; `onPointerDown` starts 500ms timer via `useRef<ReturnType<typeof setTimeout>>`; `onPointerUp`/`onPointerLeave` cancel; timer fires `onLongPress()` which calls `setFocusedNodeId(task.id)` → opens Task Editor.
- Changed monthly card class: `h-[140px]` → `h-full` (fills parent row's flex-1 height).
- Monthly task list: renders `MonthlyTaskChip[]` (expanded-state disabled) instead of `TaskCard[]`.
- Weekly task list path: unchanged.

### `src/builder/stage/views/KanbanView.tsx`
**REQ-BC-008 K08** — Removed `items-start` from `kanban-board` div:
- Default flexbox cross-axis alignment is `stretch` → phase columns fill the container's `h-full max-h-full`.
- PhaseCard's action list already has `overflow-y-auto h-full` inside `flex-1 min-h-0` wrappers → dense columns now scroll internally.

### `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx`
**REQ-TPL-001** — Wired TemplatePopup:
- Imported `LayoutTemplate` from lucide-react; imported `TemplatePopup`.
- Added `isTemplateOpen, toggleTemplate` via `useToggle`.
- Added Template button in creator palette (after Phase/Action/Task items, before the AI Section divider).
- Rendered `<TemplatePopup isOpen={isTemplateOpen} onClose={toggleTemplate} />` below the task creation popup.

## RS-R7 TRC links
- `TRC-WM6-REQ-CAL-MONTH-001-TO-MAN-react-component-monthlyview` (confirmed, complete)
- `TRC-WM6-REQ-CAL-MONTH-001-TO-MAN-react-component-daygridcard` (confirmed, partial)
- `TRC-WM6-REQ-CAL-WEEK-001-TO-MAN-hook-useweeklyview` (confirmed, complete — pre-existing)
- `TRC-WM6-REQ-BC-008-TO-MAN-react-component-kanbanview` (confirmed, complete)
- `TRC-WM6-REQ-TPL-001-TO-MAN-react-component-kanbanbuilderisland` (confirmed, partial — gallery content future)
- `TRC-WM6-REQ-STG-001-TO-MAN-react-component-stageprovider` (confirmed, complete — corrects mis-targeted RS-R6 link)

## Requirement Debt Burn-down

| Metric | Before | After |
|---|---|---|
| REQ-CAL-MONTH-001 manifestations | 0 | 2 (MonthlyView + DayGridCard) |
| REQ-BC-008 manifestations | 0 | 1 (KanbanView) |
| REQ-TPL-001 manifestations | 0 | 1 (KanbanBuilderIsland) |
| REQ-STG-001 RS-R7 links | 0 (seed only) | 1 (StageProvider confirmed) |

## Gates
- `npm run typecheck` ✅
- `npm run lint` ✅ (0 warnings)
- `npm run validate:architecture` ✅ (275 modules, 0 violations)
- `npm run test` ✅ (85 tests, 12 files)
- `npm run req:validate` ✅ (pass: true)
- `npm run req:completion-gate -- --changed src/builder/stage/views/MonthlyView.tsx src/builder/stage/views/DayGridCard.tsx src/builder/stage/views/KanbanView.tsx src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` ✅ PASS

## PO Web Check — BLOCKED §28 (no Playwright-reachable dev server this session)
Route `/builder` monthly view: confirm 4 weeks visible, no vertical scroll, compact grid, small task chips, long-hold chip → editor opens + grid stays visible (shrinks). Week view: 5 expanded workday cards + 2 collapsed weekend cards, no h-scroll. Kanban: dense phases scroll internally. Template button in creator palette opens TemplatePopup.
Evidence path: `output/evidence/WM-6-stage-views/` — batch with WM-2/3/4/5 Playwright queue.

## Files touched
- `src/builder/stage/views/MonthlyView.tsx` (REQ-CAL-MONTH-001 — rewrite)
- `src/builder/stage/views/DayGridCard.tsx` (REQ-CAL-MONTH-001 — monthly task chips + h-full)
- `src/builder/stage/views/KanbanView.tsx` (REQ-BC-008 — remove items-start)
- `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` (REQ-TPL-001 — Template button + TemplatePopup)
- 6 × TRC JSON files (new)
