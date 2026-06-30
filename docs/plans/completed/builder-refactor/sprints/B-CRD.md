# Sprint B-CRD — CardShell Parallel States ✅ BLD-CRD-INT-002

**Status:** ✅ Completed  
**Requirements:** BLD-CRD-INT-002, BLD-KAN-002, BLD-KAN-003, BLD-KAN-004, BLD-CRD-001, BLD-CRD-002, BLD-CRD-003  
**Rollback boundary:** Revert CardShell.tsx, useCardDrag.ts, TaskCard.tsx, TaskReadOnlyPopup.tsx, handleCardDrop.ts

This sprint establishes the parallel-state interaction model and is a prerequisite for B4, B5, and B9.

---

## B-CRD.1 — Long-press detection in CardShell

### Objective
Add long-press detection (400ms hold, 8px movement cancellation tolerance) to CardShell. Long press on a Task calls `onLongPress`. Drag cancels the timer.

### Files to inspect
- `src/builder/cards/CardShell.tsx`
- `src/builder/cards/useCardDrag.ts`

### Files likely to change
- `src/builder/cards/CardShell.tsx`
- `src/builder/cards/useCardDrag.ts`

### Required behaviour

In `useCardDrag.ts`, add:
```typescript
const LONG_PRESS_MS = 400; // ✅ TA-001 (Long-press duration 400ms hold)
const LONG_PRESS_MOVE_THRESHOLD = 8; // ✅ BLD-CRD-INT-003 / OD-003 (8px movement cancellation threshold)
const longPressTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
const pointerStartPos = useRef<{ x: number; y: number } | null>(null);

function startLongPress(e: React.PointerEvent, onLongPress?: () => void) {
  pointerStartPos.current = { x: e.clientX, y: e.clientY };
  if (!onLongPress) return;
  longPressTimerRef.current = setTimeout(() => { onLongPress(); }, LONG_PRESS_MS);
}

function cancelLongPress() {
  if (longPressTimerRef.current) {
    clearTimeout(longPressTimerRef.current);
    longPressTimerRef.current = null;
  }
}
```

Cancel long press in: `handleDragStart`, on pointer move >8px from start, on pointer up.

Add to `CardShell.tsx`:
- New optional prop: `onLongPress?: () => void`
- Pass to `useCardDrag`
- Wire `onPointerDown` → `startLongPress(e, onLongPress)`, `onPointerUp` → `cancelLongPress()`

### Preserve-semantic boundaries
- All existing drag behaviour unchanged
- `onLongPress` is optional — Phase and Action cards are unaffected
- Do not change handleCardDrop.ts, card.registry.ts, readiness.rules.ts

### Acceptance criteria
```
□ Holding Task card for 400ms without moving fires onLongPress
□ Starting drag within 400ms cancels the timer (no false long-press)
□ Single-click and double-click behaviour unchanged on all card types
□ onLongPress prop on CardShell is typed as optional
□ npm run typecheck passes
```

### Agent Execution Notes
**With terminal:** Run typecheck. Manual: hold a Task card without moving for 0.5s. Verify nothing fires on Phase/Action cards.  
**Without terminal:** Return CardShell.tsx and useCardDrag.ts complete. State all new props added.

---

## B-CRD.2 — Parallel popup state in TaskCard ✅ BLD-CRD-INT-002

### Objective
Add independent popup open/closed state to TaskCard. Popup state and expanded state are completely separate systems.

### Files to inspect
- `src/builder/cards/templates/task/TaskCard.tsx`
- `src/builder/cards/CardShell.tsx` (after B-CRD.1)
- `src/builder/stage/StageProvider.tsx` (to understand expandedNodeIds)

### Files likely to change
- `src/builder/cards/templates/task/TaskCard.tsx`

### Required behaviour
Add to TaskCard:
```typescript
const [isPopupOpen, setIsPopupOpen] = useState(false);
```

Single click: current `onClick` in CardShell already calls `behavior.handleClick` → `onSelect`. Additionally call `setIsPopupOpen(true)`.

The mechanism: TaskCard wraps CardShell and passes an `onClickCapture` or uses a wrapper div with an additional onClick. The simplest approach: TaskCard adds its own `onClick` on a wrapping element that calls `setIsPopupOpen(true)` in addition to whatever CardShell does for selection.

Double click: handled by CardShell `handleDoubleClick` (toggles expandedNodeIds). `isPopupOpen` is NOT affected.

Pass to CardShell: `onLongPress={() => openEditorSession(task.id)}` — the `openEditorSession` function is a stub returning `console.log('open editor', task.id)` in this sprint; it will be wired to real editor sessions in B5.

**Critical invariant** (BLD-CRD-INT-002): Popup open does NOT affect `expandedNodeIds`. Expanded state does NOT close popup. Both states are independent.

### Preserve-semantic boundaries
- CardShell's double-click expand behaviour unchanged
- CardShell's selection (handleClick) unchanged
- Do not touch Phase or Action cards

### Acceptance criteria
```
□ Single click: card selected AND isPopupOpen becomes true
□ Double click: expand toggles AND isPopupOpen is unchanged
□ With popup open, double-click expands card while popup stays
□ With card expanded, single-click opens popup without affecting expand state
□ npm run typecheck passes
```

### Agent Execution Notes
**With terminal:** Run typecheck. Open builder, click a task — confirm selection and placeholder popup. Double click — confirm expand toggles and popup stays.  
**Without terminal:** Return TaskCard.tsx complete. Confirm which click handler was used and that it does not interfere with CardShell's own handlers.

---

## B-CRD.3 — Create TaskReadOnlyPopup

### Objective
Visual read-only popup rendered when `isPopupOpen` is true in TaskCard.

### Files to inspect
- `src/builder/cards/templates/task/TaskCard.tsx` (after B-CRD.2)
- `src/ui/surfaces/GlassSurface.tsx`
- `src/builder/cards/templates/task/task-properties/ChannelPill.tsx`
- `src/types/domain.ts` (for Task type)
- `src/types/builder-node.types.ts` (for TaskCardData)

### Files likely to change
- `src/builder/cards/templates/task/TaskReadOnlyPopup.tsx` (CREATE — ≤100 lines)
- `src/builder/cards/templates/task/TaskCard.tsx` (EDIT — import and render popup)

### Required behaviour

`TaskReadOnlyPopup.tsx` props: `task: TaskCardData`, `isOpen: boolean`, `onClose: () => void`

Content:
- Task name (bold)
- ChannelPill (import existing `ChannelPill.tsx`)
- Sender ID and Receiver ID (display as-is in V1; formatted labels in V2)
- Date (show mode + value: "Fixed: 12 Jun" or "Linked: Week 2, Day 3" or "Unset")
- Readiness state badge (show state: ready/incomplete/blocked + count of reasons if incomplete)
- Subtask count ("3 subtasks")
- Close button (X) top-right

Popup container: glass surface using `GlassSurface`. Fixed position relative to nearest positioned ancestor. Width: responsive 280px - 360px (preferred 320px) ✅ BLD-CRD-INT-004 / OD-004.

Close on outside click: add `mousedown` listener on `document` inside a `useEffect`. Remove on component unmount.

### Preserve-semantic boundaries
- No new state in CardShell or StageProvider
- Do not import from rules/ directly — get readiness from task data or behavior prop

### Acceptance criteria
```
□ TaskReadOnlyPopup.tsx ≤ 100 lines
□ Popup renders with glass surface
□ Shows: name, channel pill, sender/receiver, date, readiness badge, subtask count
□ Close button works
□ Clicking outside closes popup
□ BLD-CRD-INT-002: popup open/close has zero effect on expandedNodeIds
□ npm run typecheck passes
```

### Agent Execution Notes
**With terminal:** Run typecheck. Click Task — popup appears. Double-click while popup open — expand toggles, popup stays. Click outside — popup closes.  
**Without terminal:** Return TaskReadOnlyPopup.tsx and updated TaskCard.tsx. State all new imports.

---

## B-CRD.4 — Newly-edited state after editor save ✅ BLD-CRD-002

### Objective
When a Task is saved from the editor, it receives a brief newly-edited visual feedback.

### Files to inspect
- `src/builder/islands/EditorViewerIsland/useEditorDraft.ts`
- `src/builder/cards/CardShell.tsx`
- `src/builder/cards/useCardEffects.ts`

### Files likely to change
- `src/builder/islands/EditorViewerIsland/useEditorDraft.ts`
- `src/builder/stage/StageProvider.tsx` (add `recentlyEditedIds` set)
- `src/builder/cards/CardShell.tsx` (read recentlyEditedIds)

### Required behaviour
After `handleSave` succeeds in `useEditorDraft.ts`:
1. Call `context.markAsRecentlyEdited(task.id)`
2. `StageProvider` holds `recentlyEditedIds: string[]`; `markAsRecentlyEdited` adds the id and removes it after 1000ms
3. `CardShell` reads `recentlyEditedIds.includes(data.id)` as `isJustEdited`; pass to `useCardEffects`
4. `useCardEffects` treats `isJustEdited` similarly to `isJustCreated` — brief highlight

Duration: ✅ BLD-CRD-INT-006 / OD-009 (subtle 2-second highlight, i.e., 2000ms).

### Acceptance criteria
```
□ Saving a task in the editor causes a brief highlight on that task's card
□ Highlight disappears after ~1s
□ npm run typecheck passes
```

---

## B-CRD.5 — Receiving-child state on drop ✅ BLD-CRD-003

### Objective
When a card receives a new or moved child, the direct parent shows the receiving-child state. The grandparent expands but does not show receiving-child state.

### Files to inspect
- `src/builder/cards/handleCardDrop.ts`
- `src/builder/cards/templates/action/ActionCard.tsx`
- `src/builder/cards/templates/phase/PhaseCard.tsx`
- `src/builder/stage/stageContext.types.ts`

### Files likely to change
- `src/builder/stage/StageProvider.tsx` (add `receivingChildId`)
- `src/builder/stage/stageContext.types.ts`
- `src/builder/cards/handleCardDrop.ts` (call setReceivingChild after drop)
- `src/builder/cards/CardShell.tsx` (read receivingChildId, pass isReceivingChild)
- `src/builder/cards/useCardEffects.ts` (handle isReceivingChild state)

### Required behaviour
After a successful drop:
1. `handleCardDrop.ts` calls `context.setReceivingChildId(directParentId)` with the direct parent's id
2. StageProvider holds `receivingChildId: string | null`, clears after 800ms
3. The direct parent card shows a distinct receiving-child visual state (not the same as isDragOver)
4. The grandparent expands if not already expanded — but does NOT show receiving-child state

Receiving-child is a distinct visual from the generic drag-over glow. It persists for 800ms after the drop.

### Acceptance criteria
```
□ Dropping a Task onto an Action: Action shows receiving-child state for ~800ms
□ Action's parent Phase expands if collapsed, but shows no receiving-child state
□ Dropping an Action onto a Phase: Phase shows receiving-child state
□ npm run typecheck passes
```

### Agent Execution Notes
**With terminal:** Run typecheck. Drag a task to a different action. Confirm that action briefly changes visual after drop.  
**Without terminal:** Return all changed files. Provide manual test: "Drag a task from one action to another. The destination action should briefly show a distinct visual state (not a glow) for about 0.8 seconds."

### Progress log
`docs/progress/sessions/[date]-[agent]/B-CRD-card-parallel-states.md`
