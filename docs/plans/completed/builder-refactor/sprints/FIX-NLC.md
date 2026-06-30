# Sprint FIX-NLC — Nested Node Lookup Corrections

**Status:** ⚠️ Code complete — 2 unit tests and browser gate outstanding (opencode, 2026-06-25)  
**Prerequisites:** FIX-NDX ✅ (traversal helpers are in `src/utils/node.helpers.ts`)  
**Audit findings:** B5, B6, B7, B8, B9, B11 all FAIL due to flat `nodes.find/filter` calls that miss nested Actions and Tasks.

**Codex plan-review amendments (2026-06-25):** Four concerns from `docs/progress/sessions/2026-06-25-codex-fix/PLAN-review.md` amend tasks 1, 4, 5, and 6 below. Read those concerns before starting any task.

**Rule:** Every file changed in this sprint MUST use `src/utils/node.helpers` traversal functions instead of `nodes.find(n => n.kind === 'task')` or equivalent flat searches.

**Rollback boundary:** `useEditorPanel.ts`, `selection.utils.ts`, `useFocus.ts`, `ViewContextTaskList.tsx`, `handleCardDrop.ts`, `date.rules.ts`

---

## FIX-NLC.1 — B5: Fix useEditorPanel nested task/action lookup

### Audit finding
`useEditorPanel` calls `nodes.find(n => n.id === focusedNodeId)` — finds only PhaseNodes. A Task or Action id returns `undefined`, so no editor session is registered.

### Codex plan-review amendment (Concern 1)
**Do NOT** import `useEditorPanel` from TaskCard, and do not create a cross-level import from L5 card templates into L7 island hooks. FIX-CRD has already solved editor entry correctly: it uses `setFocusedNodeId(task.id)` via Stage context. The fix here is solely inside `useEditorPanel` itself — it must resolve the focused id using traversal helpers so that a Task or Action id opens the correct editor section.

### File to change
`src/builder/islands/EditorViewerIsland/useEditorPanel.ts`

### Required fix
```typescript
import { findTask, findAction } from '@/utils/node.helpers';

// When registering or updating a session for focusedNodeId:
const phaseNode = nodes.find(n => n.id === focusedNodeId && n.kind === 'phase');
const actionCard = !phaseNode ? findAction(nodes, focusedNodeId) : undefined;
const taskCard   = !phaseNode && !actionCard ? findTask(nodes, focusedNodeId) : undefined;
```

Use `phaseNode`, `actionCard`, or `taskCard` (whichever is non-null) to populate the session. If none found, do not open a session — do not throw.

### Acceptance criteria
```
□ Setting focusedNodeId to a nested Task id opens an editor session with that task's data
□ Setting focusedNodeId to a Phase id still works as before
□ No import of useEditorPanel added to TaskCard or any card template
□ npx vitest run passes
□ npm run typecheck passes
```

---

## FIX-NLC.2 — B6: Fix Selection Island nested kind lookup

### Audit finding
Selection Island resolves node kind via `nodes.find(n => n.id === id)?.kind`. Nested Actions/Tasks return `undefined`, so the label shows "1 items selected".

### File to change
`src/builder/islands/SelectionIsland/selection.utils.ts` (or wherever kind is resolved)

### Required fix
```typescript
import { resolveNodeKind } from '@/utils/node.helpers';
const kind = resolveNodeKind(nodes, id); // 'phase' | 'action' | 'task' | undefined
```

Also fix the delete-confirmation ready-state check: it calls `nodes.find` to locate the node before delete. Replace with `findTask` / `findAction` for nested nodes.

### Acceptance criteria
```
□ Selecting a Task shows "1 task selected" (not "1 items selected")
□ Selecting an Action shows "1 action selected"
□ Delete confirmation resolves the correct nested node
□ npm run typecheck passes
```

---

## FIX-NLC.3 — B7: Fix Focus Island week/property filter to use nested Tasks

### Audit finding
`useFocus.ts` filters `nodes` for top-level Task nodes. Runtime Tasks are nested inside Phase → Action. All week/property filters show 0 tasks.

### File to change
`src/builder/focus/useFocus.ts` (or wherever task filtering occurs in `src/builder/islands/FocusIsland/`)

### Required fix
```typescript
import { getAllTasks } from '@/utils/node.helpers';
const allTasks = getAllTasks(nodes);
// apply week/property filters to allTasks
```

### Acceptance criteria
```
□ Focus Island week filter shows correct task count for weeks that have linked Tasks
□ Focus Island property filter correctly filters nested Tasks
□ Applied-filters badge count reflects actual visible tasks
□ npm run typecheck passes
```

---

## FIX-NLC.4 — B8: Fix ViewContextTaskList to use nested Tasks with Phase/Action grouping

### Audit finding
`ViewContextTaskList` searches `nodes` for top-level Action and Task nodes. Returns empty. Browser showed "No campaign tasks found" while Tasks were visible in Kanban.

### Codex plan-review amendment (Concern 3)
`getAllTasks()` alone is insufficient if the list needs Phase → Action → Task grouping for display. The requirement (BLD-VCX-001) is: unassigned Tasks active/draggable, assigned Tasks visible but disabled. If the current UI renders flat Tasks, `getAllTasks()` suffices. If it renders grouped by Action, use Phase traversal:

```typescript
import { getAllActions } from '@/utils/node.helpers';
const allActions = getAllActions(nodes);
// then from each action: action.tasks
```

Read the current `ViewContextTaskList` render output first to determine whether flat or grouped. Choose the appropriate helper — do not add both.

### File to change
`src/builder/islands/ViewHelperIsland/ViewContextTaskList.tsx`

### Acceptance criteria
```
□ View Context lists Tasks that exist as nested nodes in phases
□ Assigned Tasks appear disabled (not draggable)
□ Unassigned Tasks are draggable to Day columns
□ The Phase/Action context is preserved if the component groups by action
□ npm run typecheck passes
```

---

## FIX-NLC.5 — B9: Fix handleCardDrop nested node lookup for multi-drag

### Audit finding
`handleCardDrop.ts` maps selected IDs with `nodes.find`, finding only PhaseNodes. Task/Action multi-drag produces an empty `draggedNodes` list.

### Codex plan-review amendment (Concern 4)
The union `PhaseNode | ActionCardData | TaskCardData` has no shared `.kind` property (ActionCardData and TaskCardData are not BuilderNodes). Use `resolveNodeKind` to drive kind detection instead of reading `.kind` from the resolved value directly. Explicitly test the preserved visual order and mixed-kind fallback.

### File to change
`src/builder/cards/handleCardDrop.ts`

### Required fix
```typescript
import { findTask, findAction, resolveNodeKind } from '@/utils/node.helpers';

// For each selectedId, resolve the data object:
const phaseNode  = nodes.find(n => n.id === id && n.kind === 'phase');
const actionCard = phaseNode ? undefined : findAction(nodes, id);
const taskCard   = phaseNode || actionCard ? undefined : findTask(nodes, id);
const data       = phaseNode ?? actionCard ?? taskCard;

// Determine kind via resolveNodeKind, not data.kind:
const kind = resolveNodeKind(nodes, id); // 'phase' | 'action' | 'task'
```

Mixed-kind detection: if the set of kinds from all selected ids contains more than one distinct kind → fall back to dragging only the grabbed card alone.

### Acceptance criteria
```
□ Multi-selecting Tasks and dragging moves all selected Tasks
□ Mixed-kind (e.g. Phase + Task) drag falls back to dragging only the grabbed card
□ Kind detection uses resolveNodeKind, not union .kind property access
□ Visual order of moved Tasks is preserved after drop
□ npx vitest run passes (add a unit test for mixed-kind fallback)
□ npm run typecheck passes
```

---

## FIX-NLC.6 — B11: Fix getDayReadiness to include linked Tasks

### Audit finding
`getDayReadiness` filters only `mode === 'fixed'` Tasks. Linked Tasks that resolve to the same day are excluded, so days appear "empty" even when a linked Task targets them.

### Codex plan-review amendment (Concern 2)
Do NOT introduce a second date-resolution formula. The canonical resolution for linked dates already exists:

```typescript
// src/utils/date.helpers.ts
export function resolveTaskDate(date: TaskDate, communicatedDate: string | null): string | null
```

This function handles `mode === 'fixed'` (returns `date.date`) and `mode === 'linked'` (returns `addDays(communicatedDate, weekOffset * 7 + dayOffset)`). Use `resolveTaskDate` exclusively — do not reimplement the offset arithmetic.

### File to change
`src/rules/date.rules.ts` (or wherever `getDayReadiness` / `getDayReadinessForTasks` is defined)

### Required fix
```typescript
import { resolveTaskDate } from '@/utils/date.helpers';

// For each task in the day's task list:
const resolvedDate = resolveTaskDate(task.date, versionCommunicatedDate);
// Include the task if resolvedDate === dayIsoDate (regardless of mode)
```

Pass `versionCommunicatedDate` through to `getDayReadiness` — it is needed to resolve linked dates.

### Acceptance criteria
```
□ A Task with date.mode === 'linked' that resolves to July 1 causes the July 1 Day to count it
□ An empty Day (no tasks at all) returns state 'empty' (not 'ready')
□ A Day with all Tasks complete returns 'ready'
□ resolveTaskDate from date.helpers is the only date resolution call — no new offset arithmetic
□ Unit test added covering linked-date resolution (use npx vitest run)
□ npm run typecheck passes
```

---

## Testing gate for this sprint

```bash
npx vitest run    # not "npm test" — no test script exists in package.json
npm run typecheck
bash scripts/verify.sh
```

### Progress log
`docs/progress/sessions/[date]-[agent]/FIX-NLC-nested-node-lookups.md`
