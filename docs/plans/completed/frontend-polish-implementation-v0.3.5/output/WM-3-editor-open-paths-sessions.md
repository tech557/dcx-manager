---
sprint: WM-3
plan: frontend-polish-implementation-v0.3.5
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
status: Status: Completed
version_context: v0.3.5
---

# WM-3 — Editor open paths + sessions

## Requirement Trace
| Field | Value |
|---|---|
| Graph IDs | REQ-EVI-001, REQ-SBC-001, REQ-SBC-004, REQ-FP-D09, REQ-DZ-001, REQ-UP-011, REQ-UP-012, REQ-UP-014 |
| Scope/type | frontend / interaction + state |
| States before | `delivery: not-assessed` (REQ-EVI-001, REQ-UP-011, REQ-UP-012, REQ-UP-014) |
| States after | `delivery: implemented` — E01/E04/E05/E06 already implemented from CC-1/CC-3. **E02 (action long-press) was implemented here then rolled back by PO post-WM-3 (editor is task-only); TRC-WM3-REQ-EVI-001 retracted.** REQ-EVI-001 remains `implemented` via E01 path (TaskCard). |

## Gap analysis (carry-forward from WM-2 review + code audit)

| Criterion | State before WM-3 | Gap |
|---|---|---|
| E01 — Task long-press opens editor | ✅ Done (TaskCard → onLongPress → setFocusedNodeId) | None |
| E02 — Action long-press opens editor | ❌ Missing — ActionCard had no onLongPress | **Fixed then reverted** — PO rolled back post-WM-3; editor is task-only in this version |
| E04 — Drag Task to editor opens/restores session | ✅ Done (useEditorDragHandlers handles application/x-dcx-task) | None |
| E05 — Multi-session pills + dirty state | ✅ Done (EditorSessionPill + useEditorSessionManager) | None |
| E06 — Safe close / dirty guard | ✅ Done (DiscardSessionModal + hasDraft guard) | None |

## Changes made

### `src/builder/cards/templates/action/useActionCard.ts`
- Destructured `setFocusedNodeId` from `useStageContext()`
- Added `setFocusedNodeId` to the hook's return value

### `src/builder/cards/templates/action/ActionCard.tsx`
- Destructured `setFocusedNodeId` from `useActionCard`
- Passed `onLongPress={() => setFocusedNodeId(action.id)}` to `CardShell`
- Now: 400ms hold on any Action card opens EditorViewerIsland with action context (E02)

### WM-2 minor debt resolved
- `output/WM-2-drag-drop-engine.md`: corrected false evidence claim (builder-dark-1440.png cited but not persisted → changed to "structural DOM proof; inline screenshot not persisted — see review note")

### RS-R7 TRC links
- **Created**: `TRC-WM3-REQ-EVI-001-TO-MAN-react-component-src-builder-cards-templates-action-actioncard` (confirmed, implements, partial coverage — E02 long-press path)
- **Confirmed**: `TRC-RS-R7-REQ-SBC-002-TO-MAN-react-component-src-builder-cards-templates-action-actioncard` (code-discovered → confirmed, drag movement verified)

## Requirement Debt Burn-down
Touched: REQ-EVI-001, REQ-SBC-004

| Metric | Before | After |
|---|---|---|
| Unlinked changed-scope manifestations | 1 | 0 |
| Candidate links needing confirmation (changed scope) | 1 | 0 |

## Gates
- `npm run typecheck` ✅
- `npm run lint` ✅ (0 warnings)
- `npm run validate:architecture` ✅ (274 modules, 0 violations)
- `npm run test` ✅ (85 tests passed, 12 files)
- `npm run req:validate` ✅ (pass: true, 0 errors)
- `npm run req:completion-gate --changed ActionCard.tsx useActionCard.ts` ✅ (PASS, 0 unlinked in scope)

## PO Web Check — BLOCKED §28 (no Playwright-reachable dev server this session)
Route `/builder`; long-press Action card (400ms hold, ≤8px movement) → expect EditorViewerIsland to expand with action context. Long-press Task → expect same. Drag Task to editor drop zone → expect session opens/restores. Open >5 sessions → expect pills visible and correct context, no unsaved discard on close.

Evidence path: `output/evidence/WM-3-editor-sessions/` — to be captured when Playwright/preview server is reliable (batch with WM-2 drag-glow + edge-scroll real-pointer check).

## Files touched
- `src/builder/cards/templates/action/ActionCard.tsx`
- `src/builder/cards/templates/action/useActionCard.ts`
- `docs/plans/active/frontend-polish-implementation-v0.3.5/output/WM-2-drag-drop-engine.md` (evidence claim fix)
- `TRC-WM3-REQ-EVI-001-TO-MAN-react-component-src-builder-cards-templates-action-actioncard.json` (new)
- `TRC-RS-R7-REQ-SBC-002-TO-MAN-react-component-src-builder-cards-templates-action-actioncard.json` (confirmed)
