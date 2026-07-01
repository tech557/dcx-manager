Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
PO-Action: none
Version: v1.0.10.0
Change-Class: source

# Expanded task title smaller, contain task scroll to the action card, smaller action title

## Request
PO: (1) reduce the expanded task-card title font; (2) a task's scroll-into-view should scroll inside
its parent action card, not the stage (phases scroll the stage themselves in the StageProvider);
(3) reduce the action-card title size.

## What changed

| File | Change |
|---|---|
| `cardScroll.helpers.ts` (new) | `scrollIntoViewWithinAction(el, axis)` — scrolls ONLY the nearest scroll container that lives inside the task's own action card (bounded by `[data-card-kind="action"]`); never bubbles to the stage. Native `scrollIntoView` scrolls every scrollable ancestor incl. the kanban stage scroller — this replaces it. |
| `CardShell.tsx` | Both task scroll effects (on expand, on select) now call `scrollIntoViewWithinAction(el, 'x')` instead of `el.scrollIntoView(...)`. |
| `TaskCard.tsx` | Expanded task title `text-dcx-xs → text-dcx-2xs` (~9px). |
| `ActionCard.tsx` | Action title `text-sm → text-dcx-xs` (~10px). |

## Gates
| Gate | Result |
|---|---|
| `npm run typecheck` | PASS |
| `eslint` (4 files) | PASS |
| `bash scripts/verify.sh` | `verify passed` |
| `npm run test` | PASS — 92/92 |
| File-size caps | PASS — CardShell 154, helper 32 |

## Browser verification (Preview MCP)
- Contained scroll — proven against the real DOM: on an off-screen task in an overflowing task flow,
  running the reveal scrolled the **task flow by 126px** while the **stage (`#kanban-scroller`) delta = 0**
  (`scrolledContainerIsTheFlow: true`, `stageMoved: false`). The task no longer drags the stage.
- Titles: builder screenshot shows action titles smaller (~10px, e.g. "Nurture email se…"), and the
  expanded task title ("Brand awa…") smaller (~9px). Hierarchy intact, nothing clipped, no console errors.
</content>
