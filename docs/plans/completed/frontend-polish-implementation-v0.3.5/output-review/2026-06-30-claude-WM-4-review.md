---
review: WM-4 output review
sprint: WM-4
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-sonnet-4-6)
date: 2026-06-30
verdict: PASS — keyboard shortcuts + subtask copy/paste correct; PO rolled back E02 (action long-press) post-WM-3 — document and retract WM-3 TRC
---

# WM-4 Review — Card interactions + card/subtask copy-paste

## Verdict: ✅ PASS — correct implementation; one PO revert to document

## Verified in code

### Pre-existing (confirmed no regression)
- Single-click select: `CardShell.tsx` onClick → `behavior.handleClick` → `onSelect?.(id, multi)` ✅
- Double-click expand/collapse: `CardShell.tsx:101-108` — independent of click, toggles `expandedNodeIds` ✅
- Task card popup: `TaskReadOnlyPopup` portal, anchored to card ref ✅
- Card duplicate (UI button): `SelectionIsland.handleDuplicateSelected` → `nodeActions.duplicateNode` ✅

### Newly implemented
- **REQ-KEY-002 (Ctrl+C)**: `BuilderWorkspaceContent` keyboard handler saves `selectedNodeIds` to `cardClipboard.current`. ✅
- **REQ-KEY-003 (Ctrl+V)**: iterates `cardClipboard.current`, calls `builderActionsHook.duplicateNode({ nodeId })` per ID. Smart target = each node's original parent (nodeActions resolves this automatically). ✅
- **REQ-KEY-007 (guard)**: `isTypingTarget()` returns true for INPUT/TEXTAREA/contenteditable; C and V shortcuts skip early. ✅
- **REQ-SBT-COPY-001 (subtask copy/paste)**: `QuickSubtaskForm` gains per-row checkboxes, Copy N button (writes to `subtaskClipboard.ts` module), Paste N button (appends cloned subtasks with new IDs, no overwrite). ✅ Distinct from card copy-paste as required.

### Gates
typecheck ✅ · lint ✅ · test (85) ✅ · architecture (275 modules) ✅ · req:validate ✅ · completion-gate ✅

## PO revert — WM-3 E02 (action long-press opens editor) **rolled back post-WM-3**

**What happened:** After WM-3 shipped, PO reverted `ActionCard.tsx` and `useActionCard.ts`:
- Removed `onLongPress={() => setFocusedNodeId(action.id)}` from `CardShell` in ActionCard
- Removed `setFocusedNodeId` from `useActionCard` return value
- Comment added: "Editor is task-only in this version — Action cards do not open the editor (no onLongPress)"

**Implication for WM-3 output:** The E02 criterion ("Action long-press opens editor") was marked `delivery: implemented` in `output/WM-3-editor-open-paths-sessions.md` and a TRC was created. That state no longer matches the code. Needs correction.

**Minor debt to resolve:**
1. Update `output/WM-3-editor-open-paths-sessions.md` — E02 delivery state back to `not-assessed` (code reverted by PO)
2. Mark `TRC-WM3-REQ-EVI-001-TO-MAN-...-actioncard` as retracted (PO decision reversed E02 scope)
3. Update REQ-EVI-001 note to reflect task-only scope

## Open item (not blocking)
Real-pointer keyboard proof and subtask paste proof BLOCKED §28 — batch with WM-2/WM-3 Playwright queue.

## Recommendation
Keep WM-4. Resolve E02 debt before or during WM-5 close. Ready for **WM-5** (focus/selection/keyboard/readiness + REQ-PRESENT-001 drill-in fix).
