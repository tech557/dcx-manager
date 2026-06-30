# DCX Manager v0.0.11 — Technical Discovery Report

**Prepared for:** Engineering & Product  
**Codebase version:** v0.0.11  
**Date:** June 2026  
**Scope:** Full technical discovery prior to backend integration and React refactor

---

## 1. Executive Technical Assessment

### Overall Backend Readiness: LOW

The codebase is a well-executed prototype with strong visual and interaction quality, but it is **not ready for backend integration in its current form**. The core builder state lives inside a `nodes[]` array whose shape is tightly coupled to React-internal rendering concerns. There is no separation between domain data and UI state. Adding a real API today would require threading changes through 8–12 layers of nested callbacks.

### Overall Refactor Urgency: HIGH — Before Backend Integration

The refactor is not optional before backend work begins. The current architecture has three patterns that will cause silent data loss or race conditions under a backend:

1. **Direct mutation** of `currentVersion.phases` inside `useBuilderNodes` (line 256)
2. **`window` globals** carrying active version, task editor state, and creation IDs across component boundaries — making SSR, testing, and concurrent renders impossible
3. **Derived counts** (`taskCount`, `actionCount`) stored redundantly and recalculated inconsistently across at least 8 sites in `useBuilderNodes` alone

### Rebuild vs. Refactor: REFACTOR

Do not rebuild. The UX concepts, interaction patterns, animation philosophy, and kanban/timeline structure are all sound. The work is architectural, not conceptual. Preserve all visual and interaction code. Isolate, normalize, and re-plumb the data flow.

### Biggest Risks (in order)

1. `window` globals will break multi-tab, SSR, and React strict mode
2. Direct mutation of `currentVersion.phases` will lose changes unpredictably under async saves
3. `taskCount`/`actionCount` stored as data fields rather than derived — will desync from truth
4. `TaskEditor.tsx` at 1,201 lines contains business logic that must be extracted before it can be API-connected
5. `ViewHelperIsland.tsx` at 974 lines mixes layout, task creation logic, and timeline coordination
6. The date model (`isLinked?: boolean`, `linkedWeek?: number`) is too loose for backend persistence and timezone safety
7. No save/autosave mechanism exists — all state is ephemeral beyond `localStorage`

---

## 2. Current Architecture Map

### Folder Structure

```
src/
├── App.tsx                          # Root router, version state, localStorage persist
├── types.ts                         # Core domain types (DCX, DCXVersion, Phase, Action, Task)
├── mock/                            # All data: versions, users, projects, dropdowns, subtask templates
├── components/                      # Shared app-level components (Background, BrandedButton, form-components)
│   ├── topbar/
│   ├── popup/
│   └── form-components/
├── pages/
│   ├── home/                        # Home Page — version library, search, stats, create DCX
│   ├── version/                     # Version Room — version dashboard, collaborators, files
│   └── builder/                     # Builder — core workspace
│       ├── BuilderPage.tsx          # Layout shell, view routing, keyboard interactions
│       ├── context/BuilderContext   # Selection, clipboard, drag state
│       ├── hooks/
│       │   ├── useBuilderNodes.ts   # ALL phase/action/task state — 557 lines
│       │   ├── useKeyboardInteractions.ts
│       │   └── useNewObjectHighlight.ts
│       ├── utils/
│       │   ├── dateHelper.ts
│       │   └── timelineHelpers.ts
│       └── components/
│           ├── BuilderKanbanView.tsx
│           ├── BuilderTimelineView.tsx
│           ├── kanban/              # Board, column, drop zones, scroll hooks
│           ├── timeline/            # Monthly/weekly views, day grid
│           └── elements/
│               ├── cards/           # Phase, Action, Task cards + sub-hooks
│               ├── islands/         # All floating UI panels
│               └── reusable/        # Shared tooltips, navigation arrows
```

### Major Components

| Component | Lines | Role |
|-----------|-------|------|
| `TaskEditor.tsx` | 1,201 | Full task form — all field editing, subtask management, date picking |
| `ViewHelperIsland.tsx` | 974 | Move/copy tasks, batch create tasks on timeline, phase summary |
| `useBuilderNodes.ts` | 557 | ALL nodes state: create/move/delete phases, actions; sync back to version |
| `BuilderKanbanView.tsx` | ~260 | Kanban layout, EditorIsland mounting, task edit coordination |
| `BuilderTimelineView.tsx` | ~290 | Timeline layout, EditorIsland mounting, task edit coordination |
| `BuilderContext.tsx` | ~200 | Selection, clipboard, paste, bulk delete |
| `Home.tsx` | 538 | Home page — version list, filters, create DCX modal |
| `VersionPage.tsx` | 517 | Version Room — version summary, nav, launch builder |

### Main Data Flow

```
App.tsx
  └─ versions: EnrichedVersion[]     ← initialized from localStorage or mock
       └─ currentVersion              ← selected by versionId
            └─ BuilderPage
                 └─ useBuilderNodes(currentVersion)
                      └─ nodes: any[]   ← phases as React nodes
                           └─ node.data.actionCards[].tasks[]
```

Changes propagate **upward** via callbacks embedded inside `node.data` on every render cycle. The sync-back to `currentVersion.phases` happens in a `useEffect` that compares JSON-stringified snapshots.

### Main State Flow

```
localStorage ──► App.versions (useState)
                      │
                      ▼
              currentVersion (prop-drilled)
                      │
                      ▼
           useBuilderNodes → nodes[] (useState)
                      │
                      ├──► BuilderContext (selection, clipboard, drag)
                      │
                      ├──► BuilderKanbanView → HorizontalBoard → KanbanColumn → ActionCard → TaskCard
                      │         └──► EditorIsland → TaskEditor
                      │
                      └──► BuilderTimelineView → WeeklyView / MonthlyView → DayGridCard
                                └──► EditorIsland → TaskEditor
```

### Hidden Dependencies

- `window.__ACTIVE_VERSION__` — set in `App.tsx`, read by `DateTooltipEditor`, `FullTaskCard`, `SmallTaskCard`. If the builder is ever server-rendered or tested in isolation, this breaks silently.
- `window.__onStartEditTaskDirect` — set separately inside both `BuilderKanbanView` and `BuilderTimelineView`. Used by `TaskEditor` to navigate to adjacent tasks. This means the two views must both exist or the handler is missing.
- `window.__lastCreatedId` / `window.__anyHighlightActive` — used by `useNewObjectHighlight` to coordinate highlight animations on newly created objects.
- `window.clearSelection` — exposed from `BuilderContext`, called from `useBuilderNodes` and `useActionTasks`. This is a context function leaked to global scope to enable cross-boundary calls.
- `window.__taskEditorIsDirty` — set by `TaskEditor`, read by `BuilderKanbanView` to gate task switching. Critical UX safety guard implemented as a global flag.

---

## 3. Data Model Assessment

### Current Data Shape

```typescript
// As stored (types.ts)
TaskCardData {
  id: string
  name: string
  channelId: string
  message: string
  senderId: string
  receiverId: string
  specsIdentifier: string
  missingData?: string[]
  subtasks?: { id: string; label: string; done: boolean; duration?: string }[]
  communicationDate?: string    // loose: could be "2026-03-08" or "Week 2 Day 3"
  isLinked?: boolean            // fragile flag
  linkedWeek?: number           // only meaningful if isLinked
  linkedDay?: number            // only meaningful if isLinked
  isSmall?: boolean             // UI state stored in data
}

ActionCardData {
  id: string
  name: string
  startDate: string
  endDate: string
  taskCount: number    // REDUNDANT — should be tasks.length
  description?: string
  tasks?: TaskCardData[]
}

PhaseData {
  id: string
  label: string
  icon: 'awareness' | 'teaser' | 'launch' | 'scale' | 'maintenance'
  startDate: string
  endDate: string
  actionCount: number   // REDUNDANT — should be actionCards.length
  taskCount: number     // REDUNDANT — doubly-derived
  position?: { x: number; y: number }   // UI position stored in domain data
  actionCards?: ActionCardData[]
}
```

### Where Data Is Duplicated

- `taskCount` exists on `ActionCardData` and on `PhaseData`. Both are recalculated and stored on every mutation in 8+ locations in `useBuilderNodes.ts`. If any write path misses the recalculation, counts drift.
- `actionCount` exists on `PhaseData`, again derived from `actionCards.length`.
- Phase `startDate`/`endDate` are recalculated from action card dates in some paths but not all. Some paths read the stored value; others recompute.
- `isSmall` on `TaskCardData` is a UI view preference stored in domain data.

### Where Data Is Fragile

- `communicationDate` is typed as `string` but in practice holds three possible formats: ISO date, the string `"Week X Day Y"` (legacy), and empty. Code defensively checks `.includes("week")` to detect linked state.
- `linkedWeek`/`linkedDay` are only valid if `isLinked` is true, but there is no discriminated union enforcing this.
- `position` on `PhaseData` embeds canvas layout information in the domain model, making server-side phase ordering ambiguous (is order determined by `position.x` or array index?).
- `subtasks.duration` is typed as `string` (e.g., `"2 hrs"`) — impossible to sum programmatically.
- `specsIdentifier` is a raw string holding a structured ID (e.g., `SPC-OOH-COORD-001`) — no schema, no validation.
- `missingData` is `string[]` but logically represents missing required field names — no enum.

### Recommended Normalized Data Model

```typescript
// Domain types (clean, backend-ready)

type TaskDateMode = "unset" | "linked" | "fixed";

interface TaskDate {
  mode: "unset";
} | {
  mode: "linked";
  weekOffset: number;
  dayOffset: number;
  resolvedDate?: string;   // computed, not stored
} | {
  mode: "fixed";
  date: string;            // ISO date, always
}

interface Subtask {
  id: string;
  label: string;
  done: boolean;
  estimatedMinutes?: number;  // number, not string
}

interface Task {
  id: string;
  name: string;
  channelId: string;
  message: string;
  senderId: string;
  receiverId: string;
  specsIdentifier: string;
  missingFields: RequiredField[];  // enum, not string[]
  subtasks: Subtask[];
  date: TaskDate;
  // NO isSmall, NO isLinked, NO linkedWeek, NO linkedDay
}

interface Action {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  // NO taskCount — always computed as tasks.length
}

interface Phase {
  id: string;
  label: string;
  icon: PhaseIcon;
  startDate: string;
  endDate: string;
  actions: Action[];
  // NO actionCount, NO taskCount — always derived
  // NO position — layout is UI concern, not domain
}

// Derived counts (computed from source of truth)
const taskCount = phase.actions.reduce((acc, a) => acc + a.tasks.length, 0);
const actionCount = phase.actions.length;
```

---

## 4. State Management Assessment

### What Belongs in Server/API State (TanStack Query)

- `versions[]` — the full version list, currently in `App.useState` + `localStorage`
- `currentVersion` metadata (name, status, team, files, collaborators)
- `phases[]` with `actions[]` and `tasks[]` — the builder data, currently in `nodes[]`
- User list, project list, eligible projects — currently in mock files
- SLA subtask templates — currently hardcoded in `mock/subtaskTemplates.ts`
- File attachments — currently static in version mock data
- Activity log — currently in `mock/activity.ts`

### What Belongs in Local Builder UI State

- `selectedIds: Set<string>` — already in `BuilderContext`, correct
- `draggingType: string | null` — already in `BuilderContext`, correct
- `clipboard` — already in `BuilderContext`, correct
- `activeFilterIcon`, `focusedColumnId` — already in `BuilderContext`, acceptable
- `viewMode: "kanban" | "timeline"` — in `BuilderPage`, correct
- `timelineWeeksCount`, `timelineActiveWeek` — in `BuilderPage`, acceptable
- `editingTask` (which task is open in editor) — currently in both Kanban and Timeline views separately; should be in one shared location (builder-level context)
- `nodes[]` format — the React rendering format for phases; should be a derived/transformed view of canonical phase data, not the source of truth itself

### What Should NOT Be in Component State

- `taskCount` and `actionCount` — should never be stored; always computed
- `communicationDate` as raw string with embedded "week" logic — should be a typed `TaskDate` struct
- `isSmall` — UI view preference, belongs in local UI state keyed by task ID, not in domain data
- `__taskEditorIsDirty` — belongs in a React ref or a shared editor state store, not `window`
- `__ACTIVE_VERSION__` — belongs in a React context or query cache, not `window`

### Where Zustand Should Be Used

A single `useBuilderStore` (Zustand) should replace the current combination of `useBuilderNodes` + `BuilderContext` + `window` globals:

```
useBuilderStore
  phases: Phase[]           ← normalized domain data (replaces nodes[])
  selectedIds: Set<string>
  clipboard: Clipboard | null
  draggingType: string | null
  activeFilterIcon: string | null
  focusedColumnId: string | null
  editingTaskId: string | null   ← replaces window.__onStartEditTaskDirect
  isDirty: boolean               ← replaces window.__taskEditorIsDirty
  lastCreatedId: string | null   ← replaces window.__lastCreatedId
```

TanStack Query handles all remote data fetching and mutation. Zustand holds ephemeral builder UI state. Component `useState` holds only truly local ephemeral state (open/closed dropdowns, hover states, animation triggers).

---

## 5. Backend Readiness Assessment

### What Will Break When a Backend Is Added

| Issue | Impact | Location |
|-------|--------|----------|
| Direct mutation `currentVersion.phases = updatedPhases` | Data loss under async save | `useBuilderNodes.ts:256` |
| `localStorage` as persistence | Wiped on browser clear; no multi-device | `App.tsx` |
| `window.__ACTIVE_VERSION__` | Stale data after background refetch | `App.tsx`, `DateTooltipEditor`, task cards |
| IDs generated with `Date.now() + random` | Collision risk; not UUID; server will reject | All create handlers |
| `taskCount`/`actionCount` stored in phase data | Backend will compute from relations; frontend count will desync | `types.ts`, `useBuilderNodes` |
| Callbacks embedded in `node.data` | Handlers recreated on every render; phase changes trigger cascade | `useBuilderNodes.ts` |
| No optimistic update pattern | UI will feel slow waiting for API responses | Everywhere |
| Date stored as plain string | Timezone handling, linked date resolution unimplemented | `types.ts` |

### Save/Autosave Risks

The current autosave is a `useEffect` that watches `nodes` and JSON-stringifies `currentVersion.phases` for comparison. Under a backend:

- Every keystroke in `TaskEditor` triggers a node state update, which triggers this effect, which would fire an API call on every character typed — catastrophic debouncing is required.
- The effect has no loading/error state — failed saves are silent.
- The effect directly mutates `currentVersion.phases` before calling `onUpdateVersionData`, meaning if the API call fails, the local mutation has already happened and cannot be rolled back.

### API Boundary Recommendation

The builder should communicate with the backend through a **thin service layer**, not through component callbacks. All API calls should go through typed service functions that return normalized domain types. The `useBuilderStore` should call these service functions and handle loading/error/optimistic states explicitly.

### Suggested API Contracts

**Builder save (debounced, patches only):**
```
PATCH /api/versions/:versionId/phases
Body: { phases: Phase[] }
```

**Task update (granular):**
```
PATCH /api/versions/:versionId/tasks/:taskId
Body: Partial<Task>
```

**Create phase/action/task:**
```
POST /api/versions/:versionId/phases
POST /api/versions/:versionId/phases/:phaseId/actions
POST /api/versions/:versionId/actions/:actionId/tasks
```

---

## 6. Hidden Business Logic Map

### Task Creation Logic

Task creation happens in **four separate locations** with slightly different defaults:

1. `useActionTasks.ts:handleAddTask` — creates from within an action card's expand button
2. `useActionTasks.ts:handleDropNewTaskToIndex` — creates via drag-drop into an index slot
3. `BuilderPage.tsx:onAddTask` — creates from the CreatorIsland bottom bar
4. `ViewHelperIsland.tsx` — creates tasks targeted to specific timeline days

All four should call a single `createTask(defaults: Partial<Task>): Task` factory function. Currently they each build the object inline with `Date.now()` IDs and slightly different default field values.

### Date Assignment Logic

Date assignment has three separate implementations:

- In `TaskEditor` via `CommunicationDateField` + `DatePickerPopup`
- In `DateTooltipEditor` (inline quick-edit on task cards)
- In `DayGridCard` (dropping a task onto a calendar day)

All three resolve `isLinked` vs fixed differently. `DateTooltipEditor` reads `window.__ACTIVE_VERSION__` to resolve linked dates relative to the campaign start. This must be centralized into a single `resolveTaskDate(date: TaskDate, versionStartDate: string): string` utility.

### Duplication Logic

Duplication exists in two forms:

- **Task duplication:** `useActionTasks.ts:handleDuplicateTask` — inline within action card
- **Action duplication:** `usePhaseActions.ts` — duplicates the full action card including tasks
- **Paste logic:** `BuilderContext.pasteClipboard` — handles pasting copied actions or tasks

These three paths share no common code. A single `duplicateNode(node: Phase | Action | Task): typeof node` function with deep-ID-regeneration should replace all three.

### Subtask Reuse Logic

Subtask templates live in `mock/subtaskTemplates.ts` as a static array. In `TaskEditor`, the user can apply templates by selecting from a pane. The selected template items are copied into the task's `subtasks[]`. There is no SLA integration — the "SLA subtask suggestions" referenced in the brief do not yet exist in the codebase.

### SLA Generation Logic

The SLA API (channel + task type → recommended subtasks + hours) is not yet implemented. The subtask template system in `TaskEditor` is the placeholder. The architecture should anticipate an async call: user selects channel → UI calls SLA API → suggested subtasks populate. This will require an `IntakeConfiguration` section refactor.

### Cross-View Helper Logic

`ViewHelperIsland` is the primary cross-view bridge:
- In Kanban view, it shows phase/task summaries and quick-move controls
- In Timeline view, it enables task creation targeted to specific calendar days (the Mini Kanban island behavior)

The creation path in Timeline-mode ViewHelperIsland walks through 3 steps (phase → action → task name) and then calls `setNodes` directly. This duplicates the creation logic from `useBuilderNodes` and `useActionTasks`.

### File Preview Logic

Not yet implemented in the builder. `DriveArtifacts.tsx` in the Version Room shows file attachments. The "sticky file preview" mentioned in the brief is a future feature.

---

## 7. Redundant Code Map

### Similar Logic in Multiple Files

| Pattern | Files | Problem |
|---------|-------|---------|
| Task creation factory | `useActionTasks.ts`, `BuilderPage.tsx`, `ViewHelperIsland.tsx`, `CreatorIsland/AddTaskButton.tsx` | 4 inline implementations with different defaults |
| `ChannelIcon` switch component | `TaskEditor.tsx`, `ViewHelperIsland.tsx`, `FullTaskCard.tsx` | Defined 3 times identically |
| `taskCount` recalculation | `useBuilderNodes.ts` (8 sites), `BuilderContext.tsx` (3 sites), `useActionTasks.ts` (2 sites) | 13+ redundant calculations |
| Phase startDate/endDate derivation from action cards | `useBuilderNodes.ts`, `BuilderContext.pasteClipboard`, `BuilderContext.deleteSelected` | 3 separate reduction loops |
| Callback handlers embedded in `node.data` | `useBuilderNodes.ts` (version-load path, isDark-sync path, handleAddPhase path) | Same handler defined 3 times in three `useEffect` branches |
| EditorIsland + editingTask state | `BuilderKanbanView.tsx`, `BuilderTimelineView.tsx` | Identical mounting logic in both views |

### Files That Are Too Large

| File | Lines | Core Problem |
|------|-------|--------------|
| `TaskEditor.tsx` | 1,201 | Contains: form state, subtask management, date logic, channel icon rendering, spec parsing, pane navigation, copy/paste clipboard, "next task" navigation. Should be split into at minimum 4 files. |
| `ViewHelperIsland.tsx` | 974 | Contains: resize logic, task creation flow (3 steps), task move/reorder logic, channel icon rendering, phase summary. Should be split into at minimum 3 files. |
| `useBuilderNodes.ts` | 557 | Contains: phase CRUD, action CRUD, sync-back to version, isDark handler re-embedding, position calculation. Should be split into separate hooks by concern. |

### Logic That Should Be Extracted

- `createTask(defaults)` — standalone factory function
- `createAction(defaults)` — standalone factory function
- `createPhase(defaults)` — standalone factory function
- `duplicateWithNewIds(node)` — recursive deep copy with ID regeneration
- `derivePhaseStats(phase)` → `{ actionCount, taskCount, startDate, endDate }` — replaces all redundant `.reduce()` patterns
- `resolveTaskDate(date: TaskDate, versionStart: string)` — single truth for date resolution
- `ChannelIcon` — shared icon component, exported from one file
- `parseSpecsIdentifier` / `serializeSpecsIdentifier` — for the structured spec field

---

## 8. Risk Matrix

| Risk | Severity | Affected Files | Why It Matters | Recommended Mitigation |
|------|----------|----------------|----------------|------------------------|
| `currentVersion.phases = updatedPhases` direct mutation | CRITICAL | `useBuilderNodes.ts:256` | React's reconciliation and backend optimistic updates assume immutability. Direct mutation can cause stale renders and lost writes under async save. | Remove. Use `onUpdateVersionData` callback only. Store phases in Zustand, not mutated props. |
| `window.__ACTIVE_VERSION__` global | HIGH | `App.tsx`, `DateTooltipEditor.tsx`, `FullTaskCard.tsx`, `SmallTaskCard.tsx` | Stale under multi-tab, breaks testing, breaks SSR, invisible to React's state graph. | Replace with React context or Zustand selector. |
| `window.__onStartEditTaskDirect` global | HIGH | `BuilderKanbanView.tsx`, `BuilderTimelineView.tsx`, `TaskEditor.tsx` | Only set while the respective view is mounted. If Timeline unmounts, the Kanban editor loses next/prev navigation silently. | Move `editingTaskId` into Zustand. Pass open-editor handler through context. |
| `taskCount`/`actionCount` stored as data | HIGH | `types.ts`, `useBuilderNodes.ts` (13 sites) | Will desync from server counts when API returns normalized data. Any mutation that misses a recalculation creates a persistent count bug. | Remove stored counts entirely. Always derive from array length. |
| No save/autosave mechanism | HIGH | Entire builder | All builder work is lost on page refresh unless `localStorage` survives. No conflict detection. | Implement debounced PATCH with explicit dirty state and save indicator. |
| `TaskEditor.tsx` at 1,201 lines | MEDIUM | `TaskEditor.tsx` | Adding API calls (SLA, collaborators, channel validation) to this file becomes unsafe. Testing is impossible. | Extract: subtask section, date section, intake section, spec section into child components with isolated state. |
| Date model looseness (`string` + `isLinked` flag) | MEDIUM | `types.ts`, `TaskEditor.tsx`, `CommunicationDateField.tsx`, `DateTooltipEditor.tsx` | Cannot be serialized to backend cleanly. Linked date resolution is reimplemented in 3 places. Timezone handling absent. | Migrate to discriminated `TaskDate` union. Centralize resolution. |
| Callback handlers in `node.data` | MEDIUM | `useBuilderNodes.ts` | Handlers are recreated on every theme toggle, causing unnecessary re-renders of all phase columns. | Remove callbacks from node data. Pass static handler references through context. |
| `Date.now()` IDs | MEDIUM | All create handlers | Not UUID-compatible. Collisions possible in rapid creation. Server will assign real IDs; frontend must handle ID reconciliation. | Use `crypto.randomUUID()` or a nanoid utility. Plan for server-ID reconciliation on create. |
| `localStorage` as database | LOW-MEDIUM | `App.tsx` | Multi-device, multi-tab, and session persistence all break with a real backend. | Remove `localStorage` persistence once API is live. Keep as offline fallback with explicit sync state. |
| `@xyflow/react` in dependencies | LOW | `package.json` | Listed as dependency but ReactFlow canvas was replaced by the custom horizontal board. Dead code in the dependency tree. | Remove `@xyflow/react` from dependencies. |
| `specsIdentifier` as unstructured string | LOW | `types.ts`, `SpecsIdentifierField.tsx` | Backend will need to parse/validate. Currently any string is accepted with no schema. | Define a `SpecsIdentifier` type or validate format on save. |

---

## 9. Proposed Final Architecture

### Folder Structure

```
src/
├── types/
│   ├── domain.ts           # Phase, Action, Task, TaskDate, Subtask (clean domain types)
│   ├── api.ts              # API request/response shapes
│   └── ui.ts               # UI-only types (FilterState, SavedView, etc.)
│
├── services/
│   ├── versions.service.ts     # CRUD for versions
│   ├── builder.service.ts      # Phase/action/task PATCH
│   ├── users.service.ts        # Users API
│   ├── projects.service.ts     # Eligible projects API
│   ├── sla.service.ts          # SLA subtask suggestions
│   ├── files.service.ts        # Files/attachments
│   └── logs.service.ts         # Activity logs
│
├── store/
│   └── builderStore.ts         # Zustand — builder UI state (selection, clipboard, editing, dirty)
│
├── queries/
│   ├── useVersionsQuery.ts     # TanStack Query for version list
│   ├── useBuilderQuery.ts      # TanStack Query for builder phase data
│   ├── useSlaQuery.ts          # TanStack Query for SLA subtasks
│   └── useUsersQuery.ts        # TanStack Query for user list
│
├── utils/
│   ├── task.factory.ts         # createTask(), createAction(), createPhase()
│   ├── node.helpers.ts         # duplicateWithNewIds(), derivePhaseStats()
│   ├── date.helpers.ts         # resolveTaskDate(), parseDateString(), formatDateString()
│   └── id.helpers.ts           # generateId() wrapper around crypto.randomUUID()
│
├── components/                 # Shared UI components only
│   ├── ChannelIcon.tsx         # Single shared icon switcher
│   ├── BrandedButton.tsx
│   └── ...
│
└── pages/
    ├── home/
    ├── version/
    └── builder/
        ├── BuilderPage.tsx             # Layout only — no business logic
        ├── context/
        │   └── BuilderContext.tsx      # Thin context exposing store selectors
        ├── hooks/
        │   ├── usePhaseNodes.ts        # Phase display transform (domain → render nodes)
        │   ├── useActionNodes.ts       # Action display transform
        │   └── useKeyboardInteractions.ts
        └── components/
            ├── BuilderKanbanView.tsx
            ├── BuilderTimelineView.tsx
            ├── kanban/
            ├── timeline/
            └── elements/
                ├── cards/
                ├── islands/
                │   └── EditorIsland/
                │       └── task-editor/
                │           ├── TaskEditor.tsx         # Orchestrator only (~200 lines)
                │           └── sections/
                │               ├── IntakeSection.tsx
                │               ├── DateSection.tsx
                │               ├── SubtaskSection.tsx
                │               ├── SpecsSection.tsx
                │               └── MissingFieldsSection.tsx
                └── reusable/
```

### File Responsibilities

| File | Owns | Does Not Own |
|------|------|-------------|
| `domain.ts` | Phase, Action, Task, TaskDate types | API shapes, UI state |
| `builderStore.ts` | Selection, clipboard, editingTaskId, isDirty | Remote data, phase content |
| `useBuilderQuery.ts` | Fetching/caching phases from API | Local mutations, optimistic updates |
| `task.factory.ts` | Default task/action/phase shape | ID assignment (uses id.helpers) |
| `BuilderPage.tsx` | View routing, layout | State management, data fetching |
| `TaskEditor.tsx` | Coordinating section components | Individual field logic |

### Data Ownership Rules

- **Domain data** (phases, actions, tasks) is owned by the server. TanStack Query is the cache. Mutations go through service functions.
- **Builder UI state** (selection, clipboard, edit focus, drag state) is owned by Zustand `builderStore`.
- **Component-local UI state** (dropdown open, hover, animation) is owned by `useState` in that component only.
- **Derived values** (`taskCount`, `actionCount`, `resolvedDate`) are computed at render time, never stored.

### View Ownership Rules

- Kanban and Timeline are **views** of the same `builderStore.phases` data — neither owns the data.
- The `EditorIsland` is mounted **once** at the `BuilderPage` level, not inside each view — eliminating the duplicated `editingTask` state.
- The `ViewHelperIsland` in Kanban mode reads from the store. In Timeline mode it also reads from the store. Both modes use the same component with a `viewMode` prop.

---

## 10. Recommended React Libraries

| Library | Use Case | Why It Fits | Risk/Tradeoff | Alternative |
|---------|----------|-------------|---------------|-------------|
| **Zustand** | Builder UI state (selection, clipboard, dirty, editing) | Minimal boilerplate, works outside React tree (solves the `window` global problem), excellent DevTools | Adds a dependency; small team may over-use it for remote state | Jotai (lighter, atomic) |
| **TanStack Query v5** | All remote data: versions, users, SLA, files, logs | First-class optimistic updates, background refetch, cache invalidation, works perfectly with the existing prop-drill pattern as a drop-in | Learning curve for optimistic mutations | SWR (lighter, less feature-rich) |
| **nanoid** | ID generation | Collision-safe, URL-friendly, server-compatible | None meaningful | `crypto.randomUUID()` (no dependency, slightly longer IDs) |
| **zod** | API response validation and domain type parsing | Runtime validation prevents silent data corruption on API integration; generates TypeScript types from schemas | Adds parse step to every API response | `valibot` (smaller bundle) |
| **@dnd-kit/core** | Drag and drop (phase/action/task reordering) | Modern, accessible, works in scrollable containers, no HTML5 DnD quirks | API is lower-level than react-beautiful-dnd; more setup | react-beautiful-dnd (deprecated), Pragmatic DnD (Atlassian, newer) |
| **motion** | Animations | Already in use, excellent API | Already a dependency — no change | — |
| **date-fns** | Date arithmetic (week offsets, linked date resolution) | Tree-shakeable, timezone-safe, pure functions | Adds ~15KB; already doing date math manually so net improvement | `dayjs` (smaller, but fewer utilities) |

Libraries to **avoid:**

- `@xyflow/react` — currently in `package.json` but the canvas was replaced by the custom horizontal board. Remove it.
- `Three.js` — the brief explicitly flags this; CSS perspective transitions are sufficient for view transitions.
- Redux — overkill for this use case; Zustand covers the same ground with 80% less boilerplate.

---

## 11. API Boundary Design

### Users API
```
GET /api/users
GET /api/users/:userId
Response: User[]
Purpose: Populate sender/receiver dropdowns, collaborator selectors, team assignment
Access control: Current user only sees users in their org
```

### Access API (implicit, not listed in brief)
```
GET /api/me
Response: { userId, role, accessLevel, visibleVersionIds }
Purpose: Drive the "specific full-access user IDs can see everything" requirement
```

### Eligible Projects API
```
GET /api/projects/eligible
Query params: ?clientId=...
Response: Project[]
Purpose: Populate the "Create new DCX" form — only projects eligible for DCX creation
```

### Versions API
```
GET    /api/versions              → EnrichedVersion[] (list, with filters)
POST   /api/versions              → create DCX + V1 in one call
GET    /api/versions/:id          → single version detail
PATCH  /api/versions/:id          → update metadata (status, team, attachments)
POST   /api/versions/:id/clone    → duplicate version (full or partial)
```

### Builder API
```
GET    /api/versions/:id/builder           → Phase[] (full builder data)
PATCH  /api/versions/:id/builder           → save full phase tree (debounced autosave)
POST   /api/versions/:id/phases            → create phase
PATCH  /api/versions/:id/phases/:phaseId   → update phase metadata
DELETE /api/versions/:id/phases/:phaseId   → delete phase
POST   /api/versions/:id/phases/:phaseId/actions     → create action
PATCH  /api/versions/:id/actions/:actionId           → update action
DELETE /api/versions/:id/actions/:actionId           → delete action
POST   /api/versions/:id/actions/:actionId/tasks     → create task
PATCH  /api/versions/:id/tasks/:taskId               → update task
DELETE /api/versions/:id/tasks/:taskId               → delete task
POST   /api/versions/:id/tasks/:taskId/duplicate     → server-side duplicate with new IDs
```

### SLA API
```
GET /api/sla/subtasks?channelId=...&taskType=...
Response: { subtasks: SuggestedSubtask[], estimatedHours: number }
Purpose: Populate subtask suggestions in TaskEditor IntakeConfiguration section
```

### Files API
```
GET    /api/versions/:id/files           → FileAttachment[]
POST   /api/versions/:id/files           → attach file/link
DELETE /api/versions/:id/files/:fileId   → remove attachment
Purpose: Builder sticky file preview, Version Room DriveArtifacts
```

### Logs API
```
GET  /api/versions/:id/logs              → Activity[]
POST /api/versions/:id/logs              → record action (called server-side, not from UI)
Purpose: Home page activity feed, Version Room activity section
```

---

## 12. Sprint-by-Sprint Build/Refactor Plan

---

### Sprint 1: Type Safety and Data Model Foundation [COMPLETED]

**Goal:** Establish clean domain types and utility functions. No UI changes. De-risk all downstream work.

**Files touched:**
- `src/types/domain.ts` [CREATED]
- `src/types/api.ts` [CREATED]
- `src/utils/task.factory.ts` [CREATED]
- `src/utils/node.helpers.ts` [CREATED]
- `src/utils/date.helpers.ts` [CREATED]
- `src/utils/id.helpers.ts` [CREATED]

**Tasks:**
1. [x] Define `TaskDate` as discriminated union type
2. [x] Define clean `Task`, `Action`, `Phase` types (no `taskCount`, no `position`, no `isSmall`)
3. [x] Write `createTask(defaults)`, `createAction(defaults)`, `createPhase(defaults)` factories
4. [x] Write `derivePhaseStats(phase)` → `{ actionCount, taskCount, startDate, endDate }`
5. [x] Write `duplicateWithNewIds(node)` — recursive deep copy with `generateId()`
6. [x] Write `resolveTaskDate(date: TaskDate, versionStart: string): string`
7. [x] Write `generateId()` using `crypto.randomUUID()`
8. [x] Migrate date utils to `src/utils/date.helpers.ts`

**Dependencies:** None

**Acceptance criteria:**
- All factory functions have TypeScript types, no `any`
- `derivePhaseStats` tested with at least 3 phase shapes
- `duplicateWithNewIds` produces no duplicate IDs across 100 calls
- `resolveTaskDate` handles unset, linked, and fixed modes

**Risks:** Low — no UI changes

**Do not touch:** Any page component, BuilderContext, BuilderNodes hook, existing mock data

---

### Sprint 2: Zustand Store + Remove Window Globals [COMPLETED]

**Goal:** Replace all `window` globals with a Zustand store. All existing behavior preserved.

**Files touched:**
- `src/store/builderStore.ts` ← new
- `src/pages/builder/context/BuilderContext.tsx` ← simplify to thin store wrapper
- `src/App.tsx` ← remove `window.__ACTIVE_VERSION__`
- `src/pages/builder/hooks/useBuilderNodes.ts` ← replace window calls
- `src/pages/builder/components/BuilderKanbanView.tsx` ← remove window handler
- `src/pages/builder/components/BuilderTimelineView.tsx` ← remove window handler
- `src/pages/builder/components/elements/islands/EditorIsland/task-editor/TaskEditor.tsx` ← remove window reads
- `src/pages/builder/components/elements/reusable/tooltips/DateTooltipEditor.tsx` ← remove window read
- `src/pages/builder/components/elements/cards/task/FullTaskCard.tsx` ← remove window read
- `src/pages/builder/components/elements/cards/task/SmallTaskCard.tsx` ← remove window read
- `src/pages/builder/hooks/useNewObjectHighlight.ts` ← use store

**Tasks:**
1. [x] Install Zustand
2. [x] Create `builderStore` with: `selectedIds`, `clipboard`, `draggingType`, `activeFilterIcon`, `focusedColumnId`, `editingTaskId`, `isDirty`, `lastCreatedId`, `activeVersion`
3. [x] Migrate `BuilderContext` to read from/write to store (keep the same hook API for now)
4. [x] Replace `window.__ACTIVE_VERSION__` with store `activeVersion`
5. [x] Replace `window.__onStartEditTaskDirect` with store `editingTaskId`
6. [x] Replace `window.__taskEditorIsDirty` with store `isDirty`
7. [x] Replace `window.__lastCreatedId` / `window.__anyHighlightActive` with store
8. [x] Replace `window.clearSelection` with direct store action

**Dependencies:** Sprint 1 (for `generateId`)

**Acceptance criteria:**
- Zero `(window as any)` usage in `src/`
- Builder selection, copy/paste, task editor open/close all work identically
- New object highlight animation works

**Risks:** Medium — touches many files; test each window replacement individually

**Do not touch:** Visual components, drag/drop logic, timeline views, any mock data

---

### Sprint 3 [COMPLETED]: Normalize Nodes — Remove Stored Counts and Callbacks from Node Data

**Goal:** `nodes[]` no longer stores `taskCount`/`actionCount` or embedded callbacks. All counts are derived. All handlers come from context/store.

**Files touched:**
- `src/pages/builder/hooks/useBuilderNodes.ts` ← major refactor
- `src/pages/builder/context/BuilderContext.tsx` ← remove `deleteSelected`, `pasteClipboard` (move to store)
- `src/pages/builder/components/elements/cards/phase/PhaseNode.tsx` ← read callbacks from context
- `src/pages/builder/components/elements/cards/action/ActionCard.tsx` ← read callbacks from context
- All card components that read `taskCount` / `actionCount` from node data

**Tasks:**
1. Remove all `taskCount`/`actionCount` fields from node data
2. Replace with `derivePhaseStats()` calls at render time
3. Remove callback functions from `node.data` (onDelete, onLabelChange, onDatesChange, etc.)
4. Move these handlers to named functions in `useBuilderNodes`, exposed via context
5. Fix the triple-definition of handlers (version-load path, isDark-sync path, handleAddPhase path) into one definition
6. Remove `currentVersion.phases = updatedPhases` direct mutation

**Dependencies:** Sprint 1 (for `derivePhaseStats`), Sprint 2 (for store)

**Acceptance criteria:**
- No `taskCount` or `actionCount` in any node's `data` object
- No callbacks in `node.data`
- Phase count badges in UI still update correctly on task add/remove
- No direct mutation of `currentVersion`

**Risks:** Medium-High — touches the core data flow; regression risk on counts and drag reorder

**Do not touch:** Visual styling, animation, timeline views

---

### Sprint 4 [COMPLETED]: Unify Task Creation — Single Factory Across All Entry Points

**Goal:** All four task creation paths call one function. No duplicated inline task object construction.

**Files touched:**
- `src/pages/builder/components/elements/cards/action/useActionTasks.ts`
- `src/pages/builder/BuilderPage.tsx` (CreatorIsland `onAddTask` handler)
- `src/pages/builder/components/elements/islands/ViewHelperIsland/ViewHelperIsland.tsx`
- `src/pages/builder/components/elements/islands/CreatorIsland/AddTaskButton.tsx`
- `src/utils/task.factory.ts` ← add `createDefaultTask()`

**Tasks:**
1. Add `createDefaultTask(overrides?)` to task factory
2. Replace all 4 inline task object constructions with `createDefaultTask()`
3. Unify the "add to action" mutation into a single `addTaskToAction(actionId, task)` store action
4. Remove duplicated `ChannelIcon` definitions — extract to `src/components/ChannelIcon.tsx`

**Dependencies:** Sprint 1, Sprint 3

**Acceptance criteria:**
- Searching for `id: \`task-${Date.now()}` returns 0 results
- `ChannelIcon` exists in exactly one file
- All 4 creation entry points produce tasks with the same default shape

**Risks:** Low — purely additive refactor with behavior preservation

**Do not touch:** TaskEditor form, date logic, drag/drop

---

### Sprint 5 [COMPLETED]: Split TaskEditor — Extract Section Components

**Goal:** `TaskEditor.tsx` drops from 1,201 lines to ~200. Business logic moves to section components and utility functions.

**Files touched:**
- `TaskEditor.tsx` ← reduce to orchestrator
- New: `sections/IntakeSection.tsx`
- New: `sections/DateSection.tsx`
- New: `sections/SubtaskSection.tsx`
- New: `sections/SpecsSection.tsx`
- New: `sections/MissingFieldsSection.tsx`

**Tasks:**
1. Extract channel/sender/receiver selection into `IntakeSection`
2. Extract communication date (linked vs fixed) into `DateSection` — use `TaskDate` union type
3. Extract subtask list + template selector into `SubtaskSection`
4. Extract specs identifier into `SpecsSection`
5. Extract missing fields list into `MissingFieldsSection`
6. `TaskEditor` orchestrates sections, owns save/cancel, reads `isDirty` from store

**Dependencies:** Sprint 1 (for `TaskDate`), Sprint 2 (for store `isDirty`)

**Acceptance criteria:**
- `TaskEditor.tsx` under 300 lines
- Each section component has its own props interface with no `any`
- All existing fields editable and saveable
- "Dirty" guard (unsaved changes warning) still works

**Risks:** Medium — `TaskEditor` has complex inter-field dependencies (date linking, channel → SLA). Test thoroughly.

**Do not touch:** `ViewHelperIsland`, kanban/timeline views, drag/drop

---

### Sprint 6 [COMPLETED]: Split ViewHelperIsland — Extract Creation Flow

**Goal:** `ViewHelperIsland.tsx` drops from 974 lines to ~300. Task creation flow extracted. Phase/action summary extracted.

**Files touched:**
- `ViewHelperIsland.tsx` ← reduce to panel orchestrator
- New: `ViewHelperIsland/TaskCreationFlow.tsx`
- New: `ViewHelperIsland/PhaseSummaryPanel.tsx`
- New: `ViewHelperIsland/TaskMovePanel.tsx`

**Tasks:**
1. Extract the 3-step creation flow (phase → action → task name) into `TaskCreationFlow`
2. Extract phase/action summary display into `PhaseSummaryPanel`
3. Extract task move/reorder controls into `TaskMovePanel`
4. `ViewHelperIsland` handles resize, open/close, and panel routing only

**Dependencies:** Sprint 3, Sprint 4

**Acceptance criteria:**
- `ViewHelperIsland.tsx` under 350 lines
- Task creation from Timeline day cells still works end-to-end
- Resize handle behavior unchanged

**Risks:** Medium — the creation flow has multi-step state; regression risk on step transitions

---

### Sprint 7: API Service Layer + TanStack Query

**Goal:** All remote data flows through typed service functions and TanStack Query. `localStorage` becomes fallback only.

**Files touched:**
- `src/services/*.service.ts` ← all new
- `src/queries/*.ts` ← all new
- `App.tsx` ← replace `useState(versions)` with `useVersionsQuery()`
- `src/pages/builder/hooks/useBuilderNodes.ts` ← integrate `useBuilderQuery`
- All pages that read version/user/project data from props

**Tasks:**
1. Install TanStack Query
2. Create service layer stubs (return mock data initially, same shapes as current mock)
3. Create `useVersionsQuery`, `useBuilderQuery`, `useUsersQuery` hooks
4. Replace `App.versions useState` with `useVersionsQuery`
5. Add debounced `PATCH /builder` autosave via `useMutation` in `useBuilderQuery`
6. Add visible save indicator (saving / saved / error) to BuilderPage header
7. Replace `localStorage` with API when available, keep as offline fallback

**Dependencies:** All previous sprints

**Acceptance criteria:**
- Refresh does not lose builder changes (API save working)
- Save indicator is visible and accurate
- User list populates from service (not mock import)
- No `localStorage` write on every `nodes` change

**Risks:** HIGH — first backend-touching sprint. Requires API endpoints to exist. Run against mock server first.

---

### Sprint 8: SLA Integration + Date Model Migration

**Goal:** `TaskDate` discriminated union is in production. SLA API connected to IntakeSection.

**Files touched:**
- All files reading `isLinked`/`linkedWeek`/`linkedDay` from tasks
- `sections/IntakeSection.tsx` ← add SLA fetch on channel change
- `sections/DateSection.tsx` ← migrate to `TaskDate` union
- `src/services/sla.service.ts`
- `src/queries/useSlaQuery.ts`

**Tasks:**
1. Migrate all task date reads to use `resolveTaskDate(task.date, version.startDate)`
2. Remove `isLinked`, `linkedWeek`, `linkedDay` from `TaskCardData` — replace with `date: TaskDate`
3. Connect `useSlaQuery` to IntakeSection — show suggested subtasks on channel selection
4. Write backend migration note for `communicationDate` field (old format → new `TaskDate`)

**Dependencies:** Sprint 5, Sprint 7

**Acceptance criteria:**
- Linked dates update when campaign start date changes
- Fixed dates do not move when start date changes
- SLA suggestions appear when selecting a channel in TaskEditor
- No `isLinked`, `linkedWeek`, or `linkedDay` in any component

**Risks:** Medium — date migration is a data-breaking change; requires careful mock data migration

---

## 13. Google AI Studio Compatibility Plan

### How to Split Implementation Prompts

- Each sprint maps to **one generation session**. Never ask AI to implement more than one sprint at a time.
- Within a sprint, split by **file** rather than by feature. Ask for one file at a time.
- Always provide the AI with the **current file content** and the **type definitions** it must conform to.
- Specify a **max line count** in the prompt (e.g., "this file must not exceed 300 lines").

### Which Sprints Are Safe for Google AI Studio

| Sprint | Safety | Notes |
|--------|--------|-------|
| Sprint 1: Types + Utils | SAFE | Pure TypeScript, no React, easily verified |
| Sprint 2: Zustand Store | SAFE | Small files, well-defined interface |
| Sprint 3: Normalize Nodes | CAUTION | Large hook refactor; verify count behavior manually |
| Sprint 4: Unify Creation | SAFE | Small scope, easily diffed |
| Sprint 5: Split TaskEditor | CAUTION | High inter-component dependency; verify field interactions |
| Sprint 6: Split ViewHelperIsland | CAUTION | Multi-step state; test creation flow end to end |
| Sprint 7: API Layer | SAFE for stubs; CAUTION for integration | Stub generation is safe; API integration needs human review |
| Sprint 8: Date Migration | HIGH CAUTION | Data-breaking change; human review required before deployment |

### Which Sprints Need Extra Review

- **Sprint 3** — the count derivation change is invisible in the UI when working but catastrophic when wrong. Add a test that renders a phase with known tasks and asserts the displayed count.
- **Sprint 5** — the `isDirty` guard and "navigate to next task" behavior in `TaskEditor` are complex. Manually test the following scenarios: edit and cancel, edit and save, switch tasks with unsaved changes, save from subtask section.
- **Sprint 8** — date migration. Every task in mock data must be migrated manually. Verify that linked dates resolve correctly relative to `version.communicatedDate`.

### How to Avoid Huge-File Generation

- **Never ask AI to generate `TaskEditor.tsx` in one pass** — it will grow. Ask for one section at a time.
- After Sprint 5, enforce a lint rule: no single file in `task-editor/` may exceed 350 lines.
- For `ViewHelperIsland`, provide the subcomponent interfaces first and ask AI to generate each subcomponent against the interface.
- For `useBuilderNodes`, provide the `Phase[]` type and ask AI to generate each mutation function (addTask, deleteTask, moveAction) as a standalone pure function before assembling into the hook.

### How to Prevent AI from Rewriting Working UI

Include this instruction in every AI prompt for Sprints 2–6:

> "Do not modify any JSX or Tailwind className values. Do not rename any exported component or hook. Do not add or remove any props from existing component interfaces unless specifically instructed. Focus only on the data flow described in this prompt."

---

## 14. Open Questions

### Product Questions

1. What is the intended save model: autosave-only, explicit save, or both? This affects how `isDirty` and the save indicator should behave.
Answer : Both the user can disable the auto save if he want .
2. Should version duplication be "full" (all phases, actions, tasks) or "structural" (phases and actions, no tasks)? The brief says "eventually support full or partial" — what is the MVP?
Answer : It be "full"
3. Is `isSmall` a per-user preference or a per-task property? Can two users see the same task in different view sizes?
Answer : Yes they should be able to view seperatly but in some p;aces it will be resitricted to chaneg like timeline monthly view 
4. What is the intended behavior when the campaign start date changes and some tasks have linked dates — does the system automatically recompute, or prompt the user?
Answer : The system should automtically update then prompy yje usr 
5. Is there a concept of task "approval" or status beyond `done` on subtasks?
Answer : Ther shoudl be no logic for task or subtask lifecycles

### Technical Questions

1. Will the backend use the same ID format as the frontend generates, or will it assign its own IDs? The answer determines how complex optimistic ID reconciliation needs to be.
2. Is the `position: { x, y }` on `PhaseData` intentional for future free-canvas mode, or is phase order always determined by array index?
3. Should phase order be server-persisted, or is it always the array order?
4. The `specsIdentifier` field appears to follow a pattern (e.g., `SPC-OOH-COORD-001`). Is there a defined schema or is it free text?
5. Is there a conflict resolution strategy if two users edit the same version simultaneously?

### Backend Questions

1. What authentication mechanism will the API use? This affects how `window.__ACTIVE_VERSION__` should be replaced and how the access control layer works.
2. Will the SLA API return subtask templates, or will it return actual assigned work items with estimated hours?
3. Is the `communicatedDate` field on `DCXVersion` the version's planned launch date, or something else? It is currently used as the anchor for linked task dates.
4. What are the retention/audit requirements for the activity log?
5. Does the Files API connect to Google Drive directly, or to a proxy? The current mock uses Drive URLs.

### UX Questions

1. The brief calls for a "sticky file preview" in the Builder — what file types need to be previewed, and should they be rendered inline or in a panel?
2. In Timeline view, what happens to tasks without a date? They can't be placed on the calendar. Should they appear in a "Unassigned" rail, or only in the Kanban?
3. When a user switches from Kanban to Timeline, should the editor (if open) persist or close?
4. The `isSmall` flag on tasks makes some tasks render in compact form. Is this the user's choice per task, or is it automatic based on field completion?
5. Should the `missingData` field block saving, or just show a warning indicator?

---

*End of Technical Discovery Report — DCX Manager v0.0.11*





