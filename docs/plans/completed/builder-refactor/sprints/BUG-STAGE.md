# Sprint BUG-STAGE — Stage Layout State Mismatch

**Status:** 🔴 Not started  
**Priority:** BLOCKER — must run before BUG-WIDE, BUG-ISL, B13  
**Prerequisite:** None (independent of card width sprints)  
**Evidence:** Screenshots show stage content shifting/jumping when any card is clicked, and left column expanding with nothing in it when a day card is clicked in Timeline view.

---

## Root cause — two-state desync in the layout engine

The builder layout has two consumers of "is the editor open" state, but they read DIFFERENT signals:

| Consumer | Signal used | Behaviour |
|---|---|---|
| `StageCore.tsx` line 37 | `!!focusedNodeId` | Shifts content to `justify-end` on ANY focus — even day cards |
| `BuilderPage.tsx` line 74 | `isEditorOpen` (state from StageProvider) | Expands left column only when editor panel truly opens |

These fire at different times. On every click:
1. **Render 1** (synchronous): `focusedNodeId` is set → `StageCore` shifts to `justify-end` immediately. `isEditorOpen` is still `false` → `BuilderPage` keeps left column at 72px.
2. **useEffect fires** (async, next microtask): `setIsEditorOpen(!!activeNode)` → triggers re-render.
3. **Render 2**: `isEditorOpen = true` → left column expands to 25rem. Now both are correct.

Result: every click causes **two separate layout jumps**. The user sees the stage shift right, pause, then shift again.

**Additional bug:** `useEditorPanel.ts` calls `setIsEditorOpen(!!activeNode)`. For `day:` focus IDs, `useActiveNode` returns a non-null day-kind node. So `isEditorOpen` becomes `true` — but `EditorViewerIsland.isExpanded` uses `activeNode.kind !== 'day'`, which is `false`. The left column expands to 25rem with a 56×56 button inside it and 300px of empty space. This happens every time the user clicks a day card in Timeline view.

---

## BUG-STAGE.1 — Fix StageCore to use `isEditorOpen` not `!!focusedNodeId`

**File:** `src/builder/stage/StageCore.tsx`

**Find (line ~37):**
```tsx
const hasFocusedNode = !!focusedNodeId;
```

**Change to:**
```tsx
const hasFocusedNode = isEditorOpen;
```

Also add `isEditorOpen` to the destructured context imports at the top of the function:
```tsx
const { view, ..., focusedNodeId, isEditorOpen, ... } = useStageContext();
```

**Why:** `isEditorOpen` is the authoritative signal for whether the editor panel is physically open. Both StageCore and BuilderPage must respond to the same signal, or every click causes a split-state with two separate layout shifts.

**Do NOT remove `focusedNodeId` from the destructure** — it is used for other logic in StageCore (selection overlay, edge scroll). Only the `hasFocusedNode` constant changes.

**Acceptance criteria:**
```
□ Clicking a day card in Timeline view: no layout shift (editor doesn't open)
□ Clicking a phase/action/task: single layout shift (column expands once, not twice)
□ Stage content stays centered when no node is focused
□ npm run typecheck passes
```

---

## BUG-STAGE.2 — Fix false `isEditorOpen` for day-kind nodes

**File:** `src/builder/islands/EditorViewerIsland/useEditorPanel.ts`

**Find (line ~35):**
```tsx
setIsEditorOpen(!!activeNode);
```

**Change to:**
```tsx
setIsEditorOpen(!!activeNode && activeNode.kind !== 'day');
```

**Why:** `useActiveNode` returns a synthetic non-null object for `day:` focus IDs, so `!!activeNode` is truthy. But `EditorViewerIsland` already gate-keeps on `activeNode.kind !== 'day'` for its `isExpanded` state — the editor never shows its content for day nodes. `isEditorOpen` must match `isExpanded` for layout consistency. Day card clicks should only set `focusedNodeId` (for visual day selection highlighting) — they must not expand the left column.

**Acceptance criteria:**
```
□ Clicking a day card: left column stays at 4.5rem (72px), stage width unchanged
□ Clicking a phase/action/task: left column expands to 25rem as before
□ FocusIsland and stage selection highlights still work for day clicks (focusedNodeId is still set)
□ npm run typecheck passes
```

---

## BUG-STAGE.3 — Verify: centering stability in KanbanView after fix

The BUG-KAN sprint added `shouldCenter` logic that switches between `justify-center` and `justify-start` based on board width vs container width. With BUG-STAGE.1 fixed, `StageCore` no longer shifts on every click. However, `StageCore` still uses `justify-end` when the editor IS open. When the editor opens for a phase click, the stage narrows. This may cause:
- `containerWidth` to drop
- `shouldCenter` to flip from `true` to `false`
- Kanban content jumping from centered to left-aligned at the same time as the editor opens

This is two visual events (editor expand + centering flip) happening simultaneously which appears as content "jumping."

**Read these files to assess:**
- `src/builder/stage/views/KanbanView.tsx` — does containerWidth update synchronously with stage resize?
- `src/builder/stage/StageCore.tsx` after BUG-STAGE.1 change — is there still a `justify-end` when `isEditorOpen`?

**If the centering flip is still jarring:** Consider smoothing the transition by not centering at all when `isEditorOpen` is true — the editor panel already narrows the stage, so centering math would change mid-animation anyway. Instead, always use `justify-start` when the editor is open.

```tsx
// In KanbanView.tsx, update shouldCenter:
const shouldCenter = !isEditorOpen && phaseNodes.length > 0 && totalBoardWidth < containerWidth;
```

This requires importing `isEditorOpen` from `useStageContext` in KanbanView.

**Acceptance criteria:**
```
□ Opening the editor for a phase: content shifts to left-align once (single smooth transition)
□ Closing the editor: content re-centers smoothly if phases fit
□ No double jump during editor open/close transition
□ npm run typecheck passes
```

---

## BUG-STAGE.4 — Audit: does createPhase auto-focus?

Check `src/actions/useBuilderActions.ts` and the createPhase action. If `createPhase` calls `setFocusedNodeId` on the new phase ID, it would trigger the editor to open immediately after adding a phase — causing the layout to jump as the user sees the new phase appear.

Read the createPhase implementation and document what happens to `focusedNodeId` and `selectedNodeIds` after phase creation.

**If it does auto-focus:** Remove the `setFocusedNodeId` call from `createPhase`. Newly created phases should be selected (`setSelectedNodeIds([newId])`) but not focused (editor should not auto-open). The user can click to open the editor.

**Acceptance criteria:**
```
□ Adding a new phase: no editor panel opens, no layout shift
□ Newly created phase appears in the Kanban board (selected state if selectedNodeIds is set)
□ npm run typecheck passes
```

---

Gates:
```
□ npm run typecheck — 0 errors
□ npx vitest run — 27/27 (no regressions)
□ verify.sh — PASS
□ Browser gate OPEN — user to verify:
    - Clicking a day card in Timeline: no layout shift
    - Clicking a phase: single smooth shift (editor opens once)
    - Adding a phase: no layout jump
    - Stage content centered when no editor open
```

Progress log: `docs/progress/sessions/[date]-[agent]/BUG-STAGE-layout-state-fix.md`

---

## Audit note — why this was missed

This class of bug requires understanding the async gap between synchronous React state updates (`setFocusedNodeId`) and `useEffect`-driven downstream state (`setIsEditorOpen`). The initial audits focused on data bugs (nested node lookups). Layout state timing is invisible to typecheck, vitest, and code-only review. It only manifests in a running browser with real click interactions.

**Rule added to AGENTS.md §22**: When two consumers in the layout tree read different signals for the same concept, the one further from the source will always be one render behind. Either consolidate to one signal or derive both from the same source.
