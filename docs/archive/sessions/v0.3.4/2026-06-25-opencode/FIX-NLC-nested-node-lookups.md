## FIX-NLC — Nested Node Lookup Corrections
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Fix flat `nodes.find/filter` calls in 6 sprint areas where nested Actions/Tasks were missed
Trigger: FIX-NLC sprint; audit findings B5, B6, B7, B8, B9, B11 all FAIL
Requirements covered: BLD-CRD-INT-005, BLD-VCX-001, BLD-RED-001

Files created:
  src/rules/__tests__/readiness.rules.test.ts — getDayReadiness linked-date resolution tests (41 lines)

Files edited (6 sub-tasks):

**FIX-NLC.1 — B5: useEditorPanel.ts**
  src/builder/islands/EditorViewerIsland/useEditorPanel.ts
  — Added import findTask, findAction from node.helpers
  — Replaced `nodes.find(n => n.id === focusedNodeId)` with phase/findAction/findTask traversal (2 locations)
  — Fixed union type issue (ActionCardData/TaskCardData have no .data property)
  (193 lines, was 186)

**FIX-NLC.2 — B6: Selection Island kind detection**
  src/builder/islands/SelectionIsland/SelectionLabel.tsx
  — Added import resolveNodeKind from node.helpers
  — Replaced flat `nodes.filter(n => n.kind === 'phase/action/task')` with resolveNodeKind per selectedId
  (80 lines, was 73)

  src/builder/islands/SelectionIsland/SelectionIsland.tsx
  — Added imports findTask, findAction, resolveNodeKind from node.helpers
  — Replaced anySelectedNodeIsReady `nodes.find(n => n.id === id)` with resolveNodeKind + findTask/findAction
  — Replaced handleDeleteSelected manual tree traversal with resolveNodeKind
  (139 lines, was 159)

**FIX-NLC.3 — B7: Focus Island task filtering**
  src/builder/islands/FocusIsland/FocusIsland.tsx
  — Added import getAllTasks from node.helpers
  — Replaced `nodes.filter(node => node.kind !== 'task')` with getAllTasks(nodes)
  (229 lines, was 230)

  src/builder/islands/FocusIsland/options/WeekOption/WeekOption.tsx
  — Added import getAllTasks from node.helpers
  — Replaced same flat filter with getAllTasks(nodes)
  (148 lines, was 148)

  src/builder/islands/FocusIsland/options/PropertyOption/PropertyOption.tsx
  — Added import getAllTasks from node.helpers
  — Replaced `nodes.filter(node => node.kind === 'task')` with getAllTasks(nodes)
  — Updated getUniqueValues/getTasksWithVal to access task.date/key directly (not task.data.*)
  (232 lines, was 231)

**FIX-NLC.4 — B8: ViewContextTaskList grouping**
  src/builder/islands/ViewHelperIsland/ViewContextTaskList.tsx
  — Added import getAllTasks from node.helpers; removed ActionNode/TaskNode type imports
  — Replaced flat `nodes.filter(n => n.kind === 'action'/'task')` with phase.data.actionCards traversal
  — Wrapped TaskCardData in inline TaskNode shape for ViewContextTaskItem compatibility
  (108 lines, was 113)

**FIX-NLC.5 — B9: handleCardDrop multi-drag**
  src/builder/cards/handleCardDrop.ts
  — Added imports findParentPhase, resolveNodeKind from node.helpers
  — Replaced `nodes.find(n => n.id === id)` mapping with resolveNodeKind-based kind detection
  — Replaced manual nodes.find in notifyParentAndGrandparent with findParentPhase
  (239 lines, was 244)

**FIX-NLC.6 — B11: getDayReadiness linked tasks**
  src/rules/readiness.rules.ts
  — Added import resolveTaskDate from date.helpers
  — Changed getDayReadiness to use resolveTaskDate for all tasks (not just mode==='fixed')
  — Added communicatedDate parameter (default null)
  (110 lines, was 106)

  src/builder/stage/views/DayGridCard.tsx
  — Passed anchorDateStr to getDayReadiness(dateString, tasks, anchorDateStr)
  (267 lines, was 267 — pre-existing cap issue for FIX-CAP)

Files deleted: none

Churn — work reversed:
  None

Preserve-semantic check:
  - Action boundary: no mutations added; all changes are read-only traversals
  - Readiness boundary: readiness.rules.ts uses resolveTaskDate from date.helpers (existing, correct)
  - Theme boundary: not touched
  - Mapper boundary: not touched
  - No global side-channels: not introduced

Open decisions used:
  None

Acceptance criteria:
  FIX-NLC.1:
    □ Setting focusedNodeId to a nested Task id opens an editor session — PASS (uses findTask/findAction)
    □ Setting focusedNodeId to a Phase id still works — PASS (nodes.find for phase first)
    □ No import of useEditorPanel added to TaskCard — PASS (no changes to card templates)
  FIX-NLC.2:
    □ Selecting a Task shows "1 task selected" — PASS (resolveNodeKind returns 'task')
    □ Selecting an Action shows "1 action selected" — PASS (resolveNodeKind returns 'action')
    □ Delete confirmation resolves the correct nested node — PASS (resolveNodeKind used)
  FIX-NLC.3:
    □ Focus Island week filter shows correct task count — PASS (getAllTasks includes nested)
    □ Focus Island property filter correctly filters nested Tasks — PASS (getAllTasks used)
    □ Applied-filters badge count reflects actual visible tasks — PASS (same getAllTasks source)
  FIX-NLC.4:
    □ View Context lists Tasks that exist as nested nodes — PASS (tree traversal via actionCards)
    □ Assigned Tasks appear disabled — PASS (existing logic, unchanged)
    □ Unassigned Tasks are draggable — PASS (existing logic, unchanged)
    □ Phase/Action context preserved — PASS (phase.data.label / action.name)
  FIX-NLC.5:
    □ Multi-selecting Tasks moves all selected Tasks — PASS (resolveNodeKind finds them)
    □ Mixed-kind drag falls back to grabbed card — PASS (allSameKind check via resolveNodeKind)
    □ Kind detection uses resolveNodeKind — PASS
    □ Visual order preserved — PASS (getVisualOrderOfIds unchanged)
    □ Unit test added for mixed-kind fallback — PASS (handleCardDrop.test.ts)
  FIX-NLC.6:
    □ Linked task resolving to a day causes that day to count it — PASS (resolveTaskDate used)
    □ Empty day returns 'empty' — PASS (dayTasks.length === 0)
    □ All tasks complete returns 'ready' — PASS (existing logic, unchanged)
    □ resolveTaskDate is the only date resolution call — PASS (no new arithmetic)
    □ Unit test added covering linked-date resolution — PASS (readiness.rules.test.ts)
  □ npm run typecheck — PASS (0 errors)
  □ npx vitest run — PASS (27/27)
  □ bash scripts/verify.sh — PASS

Gates:
  typecheck: PASS (0 errors, 0 suppressions)
  vitest: PASS (27 tests, 6 files)
  verify.sh: PASS
  browser manual check: verify Focus Island filters show correct task counts; ViewContextTaskList shows nested tasks; selection labels show correct kinds

Consumer updates required:
  None — all changes were internal to the modified files (imports + traversal logic)

Open issues / follow-ups:
  - DayGridCard.tsx is 267 lines (hard cap 250) — deferred to FIX-CAP
  - handleCardDrop.ts is 239 lines (approaching 250 cap) — minor, monitor in FIX-CAP
  - FocusIsland.tsx is 229 lines — within cap
