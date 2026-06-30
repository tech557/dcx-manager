---
sprint: CC-2
title: Responsive shared cards + unified 80%/10% card-height model
status: Completed
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
---

# CC-2 — Responsive Shared Cards + 80%/10% Card-Height Model

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-SBC-003, REQ-SBC-004, REQ-SBC-005, REQ-FP-D01, REQ-FP-D11, REQ-FP-D12, REQ-RESP-001, REQ-FP-CMA-003 |
| Scope/type | frontend / ui-presentation + interaction |
| States | `not-assessed` → `implemented` |
| Source/lock | FP-R5-synthesis §CC-2; CC-2 design checkpoint v4 (PO resolved 2026-06-30); audit verdict (opus 4.8) |
| Gate result | ✅ PASS |

## Scope (tightened per audit)

**In CC-2:** responsive Task card, non-truncating Action card, Phase + Day card 80%/10% height model, TaskBentoGrid nested-scroll removal, HorizontalTaskFlow expanded-task width, text-only empty states, skeleton contrast fix, selected-task scroll-into-view.

**Out of CC-2 (per audit):** overflow gradient fades → OA-1; skeleton state prop/tiered loading → SK-1b; KanbanView stage overflow signals → CC-6/WM-6.

## Files Changed

| File | Change |
|---|---|
| `src/brand/styles/tokens.css` | Added `--dim-card-height-pct: 80%` token |
| `src/brand/styles/components.css` | Skeleton contrast fix: dark 4-9% → 10-22%; light 4-8% → 7-14%; reduced-motion updated |
| `src/builder/cards/templates/task/TaskCard.tsx` | Unified `h-[60px]`; `px-1.5` collapsed / `px-2.5 py-1.5` expanded |
| `src/builder/cards/CardShell.tsx` | Added `scrollIntoView` on `effectiveSelected` change for task kind |
| `src/builder/cards/templates/action/ActionCard.tsx` | Removed `max-w-[200px] md:max-w-[220px]` from name input |
| `src/builder/cards/templates/phase/HorizontalTaskFlow.tsx` | `gap-2` (was 1.5); expanded task `w-[calc(100%-1rem)] mx-2 flex-none`; "No tasks yet" text-only empty state |
| `src/builder/cards/templates/phase/TaskBentoGrid.tsx` | Removed `max-h-[300px] overflow-y-auto`; "No tasks created yet" text-only empty state |
| `src/builder/cards/templates/phase/PhaseCard.tsx` | 80%/10% wrapper (outer `h-full flex flex-col justify-center` + inner `h-[var(--dim-card-height-pct)]`); "No actions yet" empty state for 0 actions |
| `src/builder/stage/views/DayGridCard.tsx` | Weekly: `h-[480px]` → `h-[var(--dim-card-height-pct)]` |
| `src/builder/stage/views/DayGridCardCollapsed.tsx` | `h-[480px]` → `h-[var(--dim-card-height-pct)]` |
| `src/builder/stage/views/WeeklyView.tsx` | `min-h-full` → `h-full`; `flex gap-4` → `flex gap-4 h-full items-center` (provides height context for day cards) |

## 80%/10% Height Model — Implementation Detail

PhaseCard wraps both branches in:
```tsx
<div className="h-full flex flex-col justify-center">   {/* fills column, centers card */}
  <div className="h-[var(--dim-card-height-pct)] min-h-0">  {/* constrains to 80% */}
    <CardShell ... className="... h-full ...">
```
The `justify-center` distributes 20% remaining space equally — 10% top + 10% bottom. No JS measurement needed.

DayGridCard uses the same token; WeeklyView provides the `h-full` chain so percentage resolves against the stage height.

## Gates

| Gate | Result |
|---|---|
| `npm run typecheck` | ✅ PASS |
| `npm run lint` | ✅ PASS |
| `npm run test` | ✅ PASS (82 tests) |
| `npm run validate:architecture` | ✅ PASS (271 modules, 0 violations) |
| `npm run req:validate` | ✅ PASS (QST-VR-011 pre-existing) |
| `npm run req:completion-gate --changed` | ✅ PASS |
| Browser smoke (Preview MCP) | ✅ PASS |

## Browser Evidence

Route `/builder/v-1` — Preview MCP at 1456×816:
- Phase cards (collapsed): ~80% stage height, ~10% margin top + bottom ✅
- Phase card (expanded, Awareness): visible with action list, "No tasks yet" text-only empty state ✅
- Action name input no longer truncated ✅
- No JS console errors ✅

Screenshots: `output/evidence/CC-2-card-responsive/`

## Requirement Debt Burn-down

- TaskBentoGrid nested scroll removed → no more scroll-within-scroll violation ✅
- Selected task scrollIntoView wired (REQ-FP-CMA-003 intent) ✅
- `--dim-card-height-pct` token → all card heights now responsive to stage fluid sizing ✅
- Skeleton contrast increased 3×: previously ~6% opacity (barely visible on dark bg), now ~16% average ✅
- `req:completion-gate --changed`: ✅ PASS
- `req:validate`: ✅ PASS (QST-VR-011 pre-existing)

## Carry-Forward to OA-1

- `useScrollEdge` hook + overflow gradient fades (PhaseCard action list, HorizontalTaskFlow row) → **OA-1**
- Skeleton `state` prop (pending/error) + tiered stagger → **SK-1b**
- Stage→phase KanbanView horizontal overflow signals + magnetic snap → **CC-6/WM-6**
