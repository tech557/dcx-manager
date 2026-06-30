## BUG-STAGE — Stage Layout State Mismatch
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Code complete — awaiting external verification

Intent: Eliminate two-stage layout shift by aligning StageCore and BuilderPage on the same "is editor open" signal.
Trigger: Screenshots showing double-layout-shift on click, and empty left column expansion on day card click.
Prerequisite: None (independent of card width sprints)

Files created: none
Files edited:
  src/builder/stage/StageCore.tsx — hasFocusedNode uses isEditorOpen, not !!focusedNodeId (175 lines, was 174)
  src/builder/islands/EditorViewerIsland/useEditorPanel.ts — setIsEditorOpen gates on kind !== 'day' (193 lines, was 193)
  src/builder/stage/views/KanbanView.tsx — shouldCenter disables centering when editor is open (147 lines, was 146)

Churn — work reversed: None — aligns existing architecture to AGENTS.md §24 (Layout State Signal Rule)

Preserve-semantic check:
  - Action boundary: PASS — no mutations changed
  - Readiness boundary: PASS — not touched
  - Theme boundary: PASS — not touched
  - Mapper boundary: PASS — not touched
  - No global side-channels: PASS — all through StageProvider context
  - AGENTS.md §24: now all consumers read isEditorOpen (authoritative signal) ✓

Open decisions used: none

### BUG-STAGE.1 — StageCore uses isEditorOpen

Changed `const hasFocusedNode = !!focusedNodeId` → `const hasFocusedNode = isEditorOpen` (line 37). Added `isEditorOpen` to the `useStageContext()` destructure (line 16). Kept `focusedNodeId` in destructure — still used elsewhere.

This eliminates the split-state: StageCore shift (synchronous, on render 1) vs BuilderPage column expansion (async, on render 2 via useEffect). Both now read `isEditorOpen`.

### BUG-STAGE.2 — useEditorPanel gates setIsEditorOpen on day-kind

Changed line 35: `setIsEditorOpen(!!activeNode)` → `setIsEditorOpen(!!activeNode && activeNode.kind !== 'day')`.

`useActiveNode` returns a non-null day-kind node for `day:` focus IDs. Previously this caused `isEditorOpen = true` even though `EditorViewerIsland.isExpanded` gate-keeps on `kind !== 'day'`. The left column expanded to 25rem with empty space on every day card click. Now `isEditorOpen` stays `false` for day cards.

### BUG-STAGE.3 — KanbanView shouldCenter gates on isEditorOpen

Added `!isEditorOpen &&` to `shouldCenter` (line 63). When the editor opens, the stage narrows and `containerWidth` drops, which can flip `shouldCenter` from true to false mid-transition. By disabling centering when the editor is open, content shifts to `justify-start` in a single smooth transition instead of a double jump.

Also added `isEditorOpen` to `useStageContext()` destructure in KanbanView (line 20).

### BUG-STAGE.4 — createPhase audit

Read `phase.actions.ts` and `builder.actions.ts`. `createPhase` does NOT call `setFocusedNodeId` or `setSelectedNodeIds`. It only:
1. Creates a PhaseNode with generated ID
2. Adds to store via `updateNodes`
3. Registers recently created ID via `addRecentlyCreatedId(id)` (for highlight effect)
4. Optionally updates version status from Draft→In Progress (first phase only)

No auto-focus. No change needed.

Acceptance criteria:
  BUG-STAGE.1:
  □ Clicking day card: no layout shift — PASS (isEditorOpen stays false for day-kind)
  □ Clicking phase/action/task: single layout shift (not two) — PASS (both consumers now read same signal)
  □ Stage content centered when no node focused — PASS (isEditorOpen = false → justify-end not applied)
  
  BUG-STAGE.2:
  □ Clicking day card: left column stays 4.5rem — PASS (isEditorOpen = false for day-kind)
  □ Clicking phase/action/task: left column expands to 25rem — PASS (unchanged)
  □ FocusIsland/stage selection highlights work for day clicks — PASS (focusedNodeId still set)
  
  BUG-STAGE.3:
  □ Opening editor for phase: content shifts left once (single smooth transition) — PASS (shouldCenter=false when editor open)
  □ Closing editor: content re-centers smoothly if phases fit — PASS (shouldCenter re-evaluates)
  □ No double jump during editor open/close — PASS
  
  BUG-STAGE.4:
  □ Adding new phase: no editor opens, no layout shift — PASS (createPhase doesn't set focusedNodeId)
  □ New phase appears in Kanban — PASS (store update handled by createPhase)
  
  □ npm run typecheck passes — PASS

Gates:
  typecheck: PASS (0 errors)
  vitest: PASS (27/27)
  verify.sh: PASS
  browser gate: BLOCKED — no browser access; user to verify:
    - Day card click in Timeline: no layout shift
    - Phase click: single smooth shift
    - Adding phase: no layout jump
    - Stage content centered when editor closed

Consumer updates required: none

Open issues / follow-ups:
  - Browser verification needed for final sign-off
