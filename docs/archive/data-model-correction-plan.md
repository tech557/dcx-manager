# DCX Manager — Data Model Correction Plan

**Location:** `docs/architecture/data-model-correction-plan.md`  
**Replaces:** The Task section of `docs/architecture/data-model.md`  
**Status:** This document is the authoritative source for the new model. After all tasks complete, `data-model.md` is updated to match.

---

## 1. What Is Changing and Why

The current model treats a Task as an independently-named, empty object that a user fills in manually:

```
current:  createTask → { name: 'Untitled task', channelId: '' }  →  user fills everything
```

This is wrong. A Task is not a blank form — it is a **specific usage of a communication channel inside an action**. The name, the structure, and the required work all derive from the channel and the composition selected. The user should never face an unnamed empty task.

The corrected creation flow is:

```
1. Select or create an Action
2. Select a Channel (Email, Intranet, Meeting, Feedback Form, ...)
3. Select a ChannelComposition for that channel
       (a named, reusable template: "Standard Announcement Email")
4. The system derives the Task name: "{Action name} {Channel label}"
       e.g. "Manager Teaser Email"
5. The system creates editable Subtask Instances from the composition's SubtaskDefinitions
       (each definition = a skill/media-format type: Copywriting, Design, Approval, ...)
6. The user adjusts the generated subtasks and fills the remaining task fields in the editor
7. If no suitable composition exists, the user creates one by selecting SubtaskDefinitions
       and giving the composition a name — saved for reuse
```

The Task remains fully editable after creation. The change is in how it starts, not in what it can become.

---

## 2. The New Hierarchy

```
Project → DCX/Campaign → Version → Phase → Action → Task → Subtask Instance
                                                      ↑
                              created from Channel + ChannelComposition
                              ChannelComposition → SubtaskDefinitions (from API)
```

Supporting entities (read from API, not stored in the builder tree):

```
Channel              — a communication medium (Email, Meeting, Intranet, ...)
SubtaskDefinition    — a skill/media-format type (Copywriting, Design, Approval, ...)
ChannelComposition   — a named set of SubtaskDefinitions for a Channel
                        e.g. "Standard Announcement Email" = [Copywriting, Design, Approval]
```

---

## 3. New and Changed Types — Full Definitions

### New in `types/domain.ts`

```typescript
// A communication channel (seeded from API, may be extended locally)
export interface Channel {
  id: string;
  label: string;               // "Email", "Intranet", "Meeting", "Feedback Form"
  icon: string;                // icon key, maps to channel.icons.ts
  availableCompositionIds: string[];
}

// A skill or media-format unit — sourced from the subtask definitions API
export interface SubtaskDefinition {
  id: string;
  label: string;               // "Copywriting", "Design", "Approval", "Photography", ...
  estimatedMinutes: number | null;
  channelIds: string[];        // which channels this definition applies to
}

// A named, reusable composition: "which SubtaskDefinitions does this channel usage require?"
export interface ChannelComposition {
  id: string;
  channelId: string;
  name: string;                // "Standard Announcement Email"
  definitionIds: string[];     // ordered list of SubtaskDefinition ids
  createdBy: string;
  isUserDefined: boolean;      // false = from API seed, true = user-created
}
```

### Changed in `types/domain.ts` — Task

```typescript
export interface Task extends AIContextFields, CollaborationFields {
  id: string;
  actionId: string;
  name: string;                // DERIVED: "{actionName} {channelLabel}" — editable after creation
  channelId: string;           // required — the channel this task uses
  compositionId: string | null; // which ChannelComposition was used to generate this task
  message: string;
  senderId: string;
  receiverId: string;
  orderIndex: number;
  date: TaskDate;
  specsState: FieldCompletionState;
  missingDataState: FieldCompletionState;
  subtasks: Subtask[];
  isSmall: boolean | null;
  generationContext: JsonValue | null;
}
```

### Changed in `types/domain.ts` — Subtask

```typescript
export interface Subtask extends AIContextFields {
  id: string;
  taskId: string;
  definitionId: string | null;  // the SubtaskDefinition this was generated from (null if manually added)
  label: string;                // initially copied from definition.label, editable
  done: boolean;
  estimatedMinutes: number | null;
  orderIndex: number;
}
```

### New in `types/api.ts`

```typescript
export interface ApiChannel {
  id: string;
  label: string;
  icon: string;
  availableCompositionIds: string[];
}

export interface ApiSubtaskDefinition {
  id: string;
  label: string;
  estimatedMinutes: number | null;
  channelIds: string[];
}

export interface ApiChannelComposition {
  id: string;
  channelId: string;
  name: string;
  definitionIds: string[];
  createdBy: string;
  isUserDefined: boolean;
}
```

### Changed in `types/api.ts` — ApiTask

```typescript
export interface ApiTask {
  // ... existing fields ...
  compositionId: string | null;   // ADD
}
```

### Changed in `types/api.ts` — ApiSubtask

```typescript
export interface ApiSubtask {
  // ... existing fields ...
  definitionId: string | null;    // ADD
}
```

### Changed in `types/builder-node.types.ts` — TaskCardData

```typescript
export interface TaskCardData extends Task {
  parentActionId: string;
  // Task already has compositionId — no change needed in the card data
}
```

---

## 4. New Service Files

### `src/services/channels.service.ts`

```typescript
// @route GET /api/channels
export async function getChannels(): Promise<ApiChannel[]>

// @route GET /api/channels/:channelId/compositions
export async function getCompositions(channelId: string): Promise<ApiChannelComposition[]>

// @route POST /api/channels/:channelId/compositions
export async function createComposition(
  channelId: string,
  input: { name: string; definitionIds: string[] }
): Promise<ApiChannelComposition>
```

### `src/services/subtask-definitions.service.ts`

```typescript
// @route GET /api/subtask-definitions
// ?channelId=email — filter by channel
export async function getSubtaskDefinitions(channelId?: string): Promise<ApiSubtaskDefinition[]>
```

Both services have mock bodies returning seeded data (see §8).

---

## 5. New Query Hooks

### `src/queries/channels.queries.ts`

```typescript
export function useChannelsQuery(): UseQueryResult<Channel[]>
export function useCompositionsQuery(channelId: string | null): UseQueryResult<ChannelComposition[]>
```

### `src/queries/subtask-definitions.queries.ts`

```typescript
export function useSubtaskDefinitionsQuery(channelId?: string): UseQueryResult<SubtaskDefinition[]>
```

---

## 6. New Utility — Composition Engine

### `src/utils/composition.helpers.ts`

```typescript
/**
 * Derives the auto-generated task name from action name and channel label.
 * "{actionName} {channelLabel}" — e.g. "Manager Teaser Email"
 */
export function deriveTaskName(actionName: string, channelLabel: string): string

/**
 * Generates editable Subtask instances from a ChannelComposition's definitions.
 * Each instance copies the definition label and estimatedMinutes.
 * definitionId is stored on the subtask for traceability.
 */
export function generateSubtasksFromComposition(
  taskId: string,
  composition: ChannelComposition,
  definitions: SubtaskDefinition[]
): Subtask[]
```

---

## 7. Changed Creation Flow — `task.actions.ts`

### New `CreateTaskInput`

```typescript
export interface CreateTaskInput {
  actionId: string;
  actionName: string;          // needed to derive the task name
  channelId: string;           // required — no more empty channelId
  channelLabel: string;        // needed to derive the task name
  compositionId: string | null;
  generatedSubtasks?: Subtask[]; // pre-built from composition
  date?: TaskDate;
}
```

### Changed `createDefaultTask`

```typescript
export function createDefaultTask(
  actionId: string,
  orderIndex: number,
  input: CreateTaskInput
): TaskCardData {
  return {
    id: generateId(),
    actionId,
    parentActionId: actionId,
    name: deriveTaskName(input.actionName, input.channelLabel),
    channelId: input.channelId,
    compositionId: input.compositionId ?? null,
    message: '',
    senderId: '',
    receiverId: '',
    orderIndex,
    date: input.date ?? { mode: 'unset' },
    specsState: { status: 'empty' },
    missingDataState: { status: 'empty' },
    subtasks: input.generatedSubtasks ?? [],
    isSmall: null,
    updatedAt: now(),
    updatedBy: SYSTEM_USER_ID,
    metadata: null,
    aiContext: null,
    sourceContext: null,
    generationContext: null,
  };
}
```

---

## 8. Mock Seed Data

### `src/mock/channels.ts`

```typescript
export const MOCK_CHANNELS: ApiChannel[] = [
  { id: 'email',    label: 'Email',         icon: 'email',    availableCompositionIds: ['comp-email-std', 'comp-email-short'] },
  { id: 'intranet', label: 'Intranet',      icon: 'intranet', availableCompositionIds: ['comp-intranet-std'] },
  { id: 'meeting',  label: 'Meeting',       icon: 'meeting',  availableCompositionIds: ['comp-meeting-std'] },
  { id: 'sms',      label: 'SMS',           icon: 'sms',      availableCompositionIds: ['comp-sms-std'] },
  { id: 'social',   label: 'Social Media',  icon: 'social',   availableCompositionIds: ['comp-social-std'] },
  { id: 'feedback', label: 'Feedback Form', icon: 'feedback', availableCompositionIds: ['comp-feedback-std'] },
];
```

### `src/mock/subtask-definitions.ts`

```typescript
export const MOCK_SUBTASK_DEFINITIONS: ApiSubtaskDefinition[] = [
  { id: 'def-copy',     label: 'Copywriting',       estimatedMinutes: 120, channelIds: ['email','intranet','sms','social'] },
  { id: 'def-design',   label: 'Design',             estimatedMinutes: 180, channelIds: ['email','intranet','social'] },
  { id: 'def-approval', label: 'Approval',           estimatedMinutes: 30,  channelIds: ['email','intranet','sms','social','feedback'] },
  { id: 'def-dev',      label: 'Development',        estimatedMinutes: 240, channelIds: ['intranet','feedback'] },
  { id: 'def-review',   label: 'Content Review',     estimatedMinutes: 60,  channelIds: ['email','intranet','social'] },
  { id: 'def-logistics',label: 'Logistics',          estimatedMinutes: 90,  channelIds: ['meeting'] },
  { id: 'def-invite',   label: 'Invite Management',  estimatedMinutes: 45,  channelIds: ['meeting'] },
  { id: 'def-slides',   label: 'Slide Deck',         estimatedMinutes: 120, channelIds: ['meeting'] },
];
```

### `src/mock/compositions.ts`

```typescript
export const MOCK_COMPOSITIONS: ApiChannelComposition[] = [
  {
    id: 'comp-email-std',
    channelId: 'email',
    name: 'Standard Email',
    definitionIds: ['def-copy', 'def-design', 'def-approval'],
    createdBy: 'system',
    isUserDefined: false,
  },
  {
    id: 'comp-email-short',
    channelId: 'email',
    name: 'Short-form Email',
    definitionIds: ['def-copy', 'def-approval'],
    createdBy: 'system',
    isUserDefined: false,
  },
  {
    id: 'comp-intranet-std',
    channelId: 'intranet',
    name: 'Standard Intranet Post',
    definitionIds: ['def-copy', 'def-design', 'def-dev', 'def-approval'],
    createdBy: 'system',
    isUserDefined: false,
  },
  {
    id: 'comp-meeting-std',
    channelId: 'meeting',
    name: 'Standard Meeting',
    definitionIds: ['def-logistics', 'def-invite', 'def-slides'],
    createdBy: 'system',
    isUserDefined: false,
  },
  {
    id: 'comp-sms-std',
    channelId: 'sms',
    name: 'Standard SMS',
    definitionIds: ['def-copy', 'def-approval'],
    createdBy: 'system',
    isUserDefined: false,
  },
  {
    id: 'comp-social-std',
    channelId: 'social',
    name: 'Standard Social Post',
    definitionIds: ['def-copy', 'def-design', 'def-review', 'def-approval'],
    createdBy: 'system',
    isUserDefined: false,
  },
  {
    id: 'comp-feedback-std',
    channelId: 'feedback',
    name: 'Standard Feedback Form',
    definitionIds: ['def-dev', 'def-approval'],
    createdBy: 'system',
    isUserDefined: false,
  },
];
```

---

## 9. New UI Component — Task Creation Flow

### `src/builder/islands/TaskCreationFlow/`

This is a **new island-level flow** triggered instead of the current `createTask` palette button. It is NOT a modal — it is an inline stepper that opens inside the creation island area or as a StickyPopupShell.

```
TaskCreationFlow/
  TaskCreationFlow.tsx        ← orchestrator, manages step state (≤150 lines)
  Step1_SelectChannel.tsx     ← grid of channel buttons, search (≤80 lines)
  Step2_SelectComposition.tsx ← list of compositions for chosen channel +
                                 "Create new" option (≤100 lines)
  Step3_ReviewSubtasks.tsx    ← shows generated subtask list, allow remove/reorder
                                 before confirming creation (≤80 lines)
  CreateCompositionForm.tsx   ← inline form: name + multi-select SubtaskDefinitions (≤100 lines)
  useTaskCreationFlow.ts      ← manages step, selections, and final createTask call (≤80 lines)
```

**Props:**

```typescript
interface TaskCreationFlowProps {
  actionId: string;
  actionName: string;
  onComplete: () => void;
  onCancel: () => void;
}
```

**Internal state (in `useTaskCreationFlow`):**

```typescript
type Step = 'channel' | 'composition' | 'review' | 'create-composition';

interface FlowState {
  step: Step;
  selectedChannel: Channel | null;
  selectedComposition: ChannelComposition | null;
  generatedSubtasks: Subtask[];
}
```

**On complete:**

```typescript
builderActions.createTask({
  actionId,
  actionName,
  channelId: selectedChannel.id,
  channelLabel: selectedChannel.label,
  compositionId: selectedComposition?.id ?? null,
  generatedSubtasks,
});
```

---

## 10. Changed UI — `TaskEditorSection.tsx`

The task editor must reflect that:
- Task name is derived but editable
- Channel is now a read-only display (set at creation, not an editable text field)
- A "Change channel" option could exist but requires confirmation (it resets the composition)
- `compositionId` is displayed as a read-only reference

Changes to `TaskEditorSection.tsx`:

```typescript
// REMOVE: free-text channelId input
// ADD:    read-only channel display using ChannelPill
// ADD:    composition name display (read-only, from useCompositionsQuery)
// KEEP:   all other fields unchanged
```

---

## 11. Updated Readiness Rules

`src/rules/readiness.rules.ts` — add channel check:

```typescript
export function getTaskReadiness(task: Task): ReadinessResult {
  const reasons: string[] = [];

  // NEW: channel is required
  if (!task.channelId) {
    reasons.push('Channel is not selected.');
  }

  // EXISTING
  if (task.specsState.status === 'empty') reasons.push('Specs field is not answered.');
  if (task.missingDataState.status === 'empty') reasons.push('Missing data field is not answered.');

  return {
    state: reasons.length > 0 ? 'incomplete' : 'ready',
    reasons,
  };
}
```

---

## 12. Updated API Mappers

`src/services/api-mappers.ts` — add `compositionId` and `definitionId` to task/subtask mappers:

```typescript
// In apiTaskToDomain:
compositionId: task.compositionId ?? null,   // ADD

// In apiSubtaskToDomain:
definitionId: subtask.definitionId ?? null,  // ADD

// In domainTaskToApi:
compositionId: task.compositionId ?? null,   // ADD

// In domainSubtaskToApi:
definitionId: subtask.definitionId ?? null,  // ADD
```

---

## 13. Agent Task Breakdown

Execute these tasks in order. Each task is self-contained. `tsc --noEmit` must pass after every task.

---

### Task DM-1 — Update `types/domain.ts`

**Status:** Done — completed June 20, 2026.

**Files:** `src/types/domain.ts`  
**Action:** EDIT

1. Add `Channel`, `SubtaskDefinition`, `ChannelComposition` interfaces (§3 above)
2. Add `compositionId: string | null` to `Task`
3. Add `definitionId: string | null` to `Subtask`

**Acceptance:**
```
☑ tsc --noEmit passes
☑ Channel, SubtaskDefinition, ChannelComposition exported from domain.ts
☑ Task.compositionId exists
☑ Subtask.definitionId exists
```

---

### Task DM-2 — Update `types/api.ts`

**Status:** Done — completed June 20, 2026.

**Files:** `src/types/api.ts`  
**Action:** EDIT

1. Add `ApiChannel`, `ApiSubtaskDefinition`, `ApiChannelComposition` interfaces (§3 above)
2. Add `compositionId: string | null` to `ApiTask`
3. Add `definitionId: string | null` to `ApiSubtask`

**Acceptance:**
```
☑ tsc --noEmit passes
☑ ApiChannel, ApiSubtaskDefinition, ApiChannelComposition exported
☑ No imports from domain.ts in api.ts
```

---

### Task DM-3 — Create mock data files

**Status:** Done — completed June 20, 2026.

**Files (CREATE):**
- `src/mock/channels.ts`
- `src/mock/subtask-definitions.ts`
- `src/mock/compositions.ts`

Write exactly the seed data from §8.

**Acceptance:**
```
☑ All three files compile
☑ MOCK_CHANNELS has 6 entries
☑ MOCK_SUBTASK_DEFINITIONS has 8 entries
☑ MOCK_COMPOSITIONS has 7 entries
☑ Every compositionId referenced in MOCK_CHANNELS exists in MOCK_COMPOSITIONS
☑ Every definitionId referenced in MOCK_COMPOSITIONS exists in MOCK_SUBTASK_DEFINITIONS
```

---

### Task DM-4 — Create service files

**Status:** Done — completed June 20, 2026.

**Files (CREATE):**
- `src/services/channels.service.ts`
- `src/services/subtask-definitions.service.ts`

Write mock bodies using `readMockJson` from `api-client.ts`. Each function has `@route` JSDoc. Seed from the mock files created in DM-3.

**Acceptance:**
```
☑ getChannels() returns MOCK_CHANNELS
☑ getCompositions('email') returns only email compositions
☑ getSubtaskDefinitions('email') returns only email-compatible definitions
☑ createComposition() adds to the mock store and returns the new composition
☑ @route JSDoc on every function
☑ tsc passes
```

---

### Task DM-5 — Create query hooks

**Status:** Done — completed June 20, 2026.

**Files (CREATE):**
- `src/queries/channels.queries.ts`
- `src/queries/subtask-definitions.queries.ts`

Add query keys to `src/queries/QUERY_KEYS.ts`:
```typescript
channels: {
  all: ['channels'] as const,
  compositions: (channelId: string) => ['channels', channelId, 'compositions'] as const,
},
subtaskDefinitions: {
  byChannel: (channelId?: string) => ['subtask-definitions', channelId ?? 'all'] as const,
},
```

**Acceptance:**
```
☑ useChannelsQuery() returns Channel[] (mapped via api-mappers)
☑ useCompositionsQuery('email') returns ChannelComposition[]
☑ useSubtaskDefinitionsQuery('email') returns SubtaskDefinition[]
☑ tsc passes
```

---

### Task DM-6 — Update `api-mappers.ts`

**Status:** Done — completed June 20, 2026.

**Files:** `src/services/api-mappers.ts`  
**Action:** EDIT

Add mappers for the three new entities. Extend existing task and subtask mappers to handle `compositionId` and `definitionId` (§12 above).

**Acceptance:**
```
☑ apiChannelToDomain(), domainChannelToApi() exist
☑ apiSubtaskDefinitionToDomain() exists
☑ apiChannelCompositionToDomain(), domainChannelCompositionToApi() exist
☑ apiTaskToDomain maps compositionId
☑ apiSubtaskToDomain maps definitionId
☑ tsc passes
```

---

### Task DM-7 — Create `composition.helpers.ts`

**Status:** Done — completed June 20, 2026.

**Files (CREATE):** `src/utils/composition.helpers.ts`

Write `deriveTaskName()` and `generateSubtasksFromComposition()` exactly as specified in §6.

**Acceptance:**
```
☑ deriveTaskName('Manager Teaser', 'Email') returns 'Manager Teaser Email'
☑ generateSubtasksFromComposition(taskId, composition, definitions) returns
  one Subtask per definitionId in composition.definitionIds
☑ Each generated subtask has definitionId set
☑ Each generated subtask has a unique id from generateId()
☑ tsc passes
☑ No React imports in this file
```

---

### Task DM-8 — Update `task.actions.ts`

**Status:** Done — completed June 20, 2026.

**Files:** `src/actions/task.actions.ts`  
**Action:** EDIT

1. Import `deriveTaskName`, `generateSubtasksFromComposition` from `composition.helpers`
2. Update `CreateTaskInput` interface (§7 above)
3. Update `createDefaultTask` function (§7 above)
4. Update `builderActions.createTask` to use the new input shape

**Do not change:** `updateTask`, `deleteTask`, `moveTask`, `cloneTask`

**Acceptance:**
```
☑ createDefaultTask produces a task with:
  - name = deriveTaskName(input.actionName, input.channelLabel)
  - channelId set (not empty string)
  - compositionId set
  - subtasks = input.generatedSubtasks (not empty array unless no composition)
☑ tsc passes
☑ Existing move/update/delete tests (if any) still pass
```

---

### Task DM-9 — Create `TaskCreationFlow` component

**Status:** Done — completed June 20, 2026.

**Files (CREATE):**
```
src/builder/islands/TaskCreationFlow/TaskCreationFlow.tsx
src/builder/islands/TaskCreationFlow/Step1_SelectChannel.tsx
src/builder/islands/TaskCreationFlow/Step2_SelectComposition.tsx
src/builder/islands/TaskCreationFlow/Step3_ReviewSubtasks.tsx
src/builder/islands/TaskCreationFlow/CreateCompositionForm.tsx
src/builder/islands/TaskCreationFlow/useTaskCreationFlow.ts
```

Write each file per §9. Use `useChannelsQuery`, `useCompositionsQuery`, `useSubtaskDefinitionsQuery`. On complete, call `builderActions.createTask(...)` via `useBuilderActions()`.

**No file may exceed 120 lines.**

**Acceptance:**
```
☑ Selecting a channel advances to step 2
☑ Selecting a composition advances to step 3 (showing generated subtask list)
☑ Confirming in step 3 calls builderActions.createTask with correct input
☑ "Create new composition" in step 2 opens CreateCompositionForm
☑ Creating a composition saves it via createComposition() service and auto-selects it
☑ Cancel at any step calls onCancel()
☑ No file over 120 lines
☑ tsc passes
```

---

### Task DM-10 — Wire `TaskCreationFlow` into `KanbanBuilderIsland`

**Status:** Done — completed June 20, 2026.

**Files:** `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx`  
**Action:** EDIT

Replace the current `actions.createTask({ actionId, name: 'New task' })` direct call with rendering `<TaskCreationFlow>` when the Task palette button is triggered.

The flow should appear as a StickyPopupShell positioned near the island.

**Acceptance:**
```
☑ Clicking Task button in palette opens TaskCreationFlow (not immediately creating a task)
☑ Completing the flow creates a task on the correct action
☑ Cancelling closes the flow without creating anything
☑ tsc passes
☑ KanbanBuilderIsland.tsx ≤ 100 lines after change
```

---

### Task DM-11 — Wire `TaskCreationFlow` into `DayTaskCreator`

**Status:** Done — completed June 20, 2026.

**Files:** `src/builder/stage/views/DayTaskCreator.tsx`  
**Action:** EDIT

The `DayTaskCreator` currently shows a simple task-name input. Replace it with `Step1_SelectChannel` and `Step2_SelectComposition` steps (skip Step3 review — subtasks auto-apply and the date is pre-filled from the day context).

**Acceptance:**
```
☑ Creating a task from a day card still pre-fills the task date from the day
☑ Channel and composition are still selected through the flow
☑ tsc passes
```

---

### Task DM-12 — Update `TaskEditorSection.tsx`

**Status:** Done — completed June 20, 2026.

**Files:** `src/builder/islands/EditorViewerIsland/TaskEditorSection.tsx`  
**Action:** EDIT

1. Remove the free-text `Channel ID` input field
2. Add a read-only `ChannelPill` display (channel is set at creation)
3. Add a read-only composition name display: `"Created from: Standard Email"` (load composition name from `useCompositionsQuery`)
4. Keep all other fields unchanged

**Acceptance:**
```
☑ No free-text channelId input in the editor
☑ Channel shown as ChannelPill (read-only)
☑ Composition name displayed when compositionId is set
☑ Task name remains editable
☑ tsc passes
☑ File ≤ 120 lines
```

---

### Task DM-13 — Update `readiness.rules.ts`

**Status:** Done — completed June 20, 2026.

**Files:** `src/rules/readiness.rules.ts`  
**Action:** EDIT

Add channel presence check to `getTaskReadiness` (§11 above).

**Acceptance:**
```
☑ getTaskReadiness({ channelId: '' }) returns state: 'incomplete' with channel reason
☑ getTaskReadiness({ channelId: 'email', specsState: {status:'filled',value:'x'}, missingDataState: {status:'not-needed'} })
  returns state: 'ready'
☑ tsc passes
```

---

### Task DM-14 — Update `data-model.md`

**Status:** Done — completed June 20, 2026.

**Files:** `docs/architecture/data-model.md`  
**Action:** EDIT (replace the Task, Subtask, and hierarchy sections)

Update the document to reflect:

1. The new hierarchy (§2 of this plan) with Channel and Composition in the diagram
2. The new entities section: Channel, SubtaskDefinition, ChannelComposition
3. The corrected Task entity fields (add `compositionId`)
4. The corrected Subtask entity fields (add `definitionId`)
5. A new "Task Creation Flow" section describing the 7-step creation sequence
6. Update the "Stored vs Derived" table: task `name` is derived at creation but stored after

**Acceptance:**
```
☑ Hierarchy diagram includes Channel and ChannelComposition
☑ Channel, SubtaskDefinition, ChannelComposition entities documented with all fields
☑ Task.compositionId documented
☑ Subtask.definitionId documented
☑ Creation flow described as 7 steps matching §2 of this plan
☑ "Stored vs Derived" table updated
```

---

### Task DM-15 — Update `progress-log.md`

**Status:** Done — completed June 20, 2026.

**Files:** `docs/progress-log.md`  
**Action:** APPEND

After all tasks DM-1 through DM-14 complete, append a sprint report entry:

```markdown
## Sprint DM — Data Model Correction (Channel + Composition)
Date: [date]

Files created:
- src/types/domain.ts — added Channel, SubtaskDefinition, ChannelComposition (N lines)
- src/types/api.ts — added ApiChannel, ApiSubtaskDefinition, ApiChannelComposition (N lines)
- src/mock/channels.ts — 6 seed channels
- src/mock/subtask-definitions.ts — 8 skill definitions
- src/mock/compositions.ts — 7 named compositions
- src/services/channels.service.ts
- src/services/subtask-definitions.service.ts
- src/queries/channels.queries.ts
- src/queries/subtask-definitions.queries.ts
- src/utils/composition.helpers.ts
- src/builder/islands/TaskCreationFlow/ (6 files)

Files edited:
- src/services/api-mappers.ts — added 5 new mappers, extended task+subtask mappers
- src/actions/task.actions.ts — new CreateTaskInput, updated createDefaultTask
- src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx — wired TaskCreationFlow
- src/builder/stage/views/DayTaskCreator.tsx — wired channel/composition steps
- src/builder/islands/EditorViewerIsland/TaskEditorSection.tsx — removed free-text channelId
- src/rules/readiness.rules.ts — added channel presence check
- src/queries/QUERY_KEYS.ts — added channel and definition keys
- docs/architecture/data-model.md — updated hierarchy, entities, creation flow

Requirements covered:
- New hierarchy: Project → DCX → Version → Phase → Action → Task (via Channel+Composition) → Subtask
- Channel as first-class entity
- SubtaskDefinition as API-sourced skill type
- ChannelComposition as reusable task template
- Task name derived at creation: "{actionName} {channelLabel}"
- Subtasks auto-generated from composition definitions
- 7-step creation flow enforced through TaskCreationFlow component

God-file check:
[list any file over 150 lines]

Boundary violations found:
- None

Gates:
- npm run typecheck: [PASSED/FAILED]
- npm run dev: [PASSED/FAILED]
- bash scripts/verify.sh: [PASSED/FAILED]
- Browser smoke: [PASSED/FAILED]
```

---

## 14. What Does Not Change

These were explicitly confirmed as stable and must not be altered during this sprint:

- The four-layer architecture: Storage → ApiDTOs → Domain → BuilderRenderModel
- `node.helpers.ts` mappers (phaseToNode, nodeToPhase, etc.) — no change needed
- `BuilderNode`, `PhaseNode`, `ActionNode` types — no change needed
- All Phase and Action creation flows — unchanged
- The builder three-row layout — unchanged
- All lifecycle/status rules — unchanged
- All save continuity features — unchanged
- `api-mappers.ts` for Phase, Action, Version, DCX — unchanged

---

## 15. Files Affected by This Change (Complete List)

| File | Change type | Task |
|---|---|---|
| `src/types/domain.ts` | EDIT | DM-1 |
| `src/types/api.ts` | EDIT | DM-2 |
| `src/mock/channels.ts` | CREATE | DM-3 |
| `src/mock/subtask-definitions.ts` | CREATE | DM-3 |
| `src/mock/compositions.ts` | CREATE | DM-3 |
| `src/services/channels.service.ts` | CREATE | DM-4 |
| `src/services/subtask-definitions.service.ts` | CREATE | DM-4 |
| `src/queries/channels.queries.ts` | CREATE | DM-5 |
| `src/queries/subtask-definitions.queries.ts` | CREATE | DM-5 |
| `src/queries/QUERY_KEYS.ts` | EDIT | DM-5 |
| `src/services/api-mappers.ts` | EDIT | DM-6 |
| `src/utils/composition.helpers.ts` | CREATE | DM-7 |
| `src/actions/task.actions.ts` | EDIT | DM-8 |
| `src/builder/islands/TaskCreationFlow/TaskCreationFlow.tsx` | CREATE | DM-9 |
| `src/builder/islands/TaskCreationFlow/Step1_SelectChannel.tsx` | CREATE | DM-9 |
| `src/builder/islands/TaskCreationFlow/Step2_SelectComposition.tsx` | CREATE | DM-9 |
| `src/builder/islands/TaskCreationFlow/Step3_ReviewSubtasks.tsx` | CREATE | DM-9 |
| `src/builder/islands/TaskCreationFlow/CreateCompositionForm.tsx` | CREATE | DM-9 |
| `src/builder/islands/TaskCreationFlow/useTaskCreationFlow.ts` | CREATE | DM-9 |
| `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` | EDIT | DM-10 |
| `src/builder/stage/views/DayTaskCreator.tsx` | EDIT | DM-11 |
| `src/builder/islands/EditorViewerIsland/TaskEditorSection.tsx` | EDIT | DM-12 |
| `src/rules/readiness.rules.ts` | EDIT | DM-13 |
| `docs/architecture/data-model.md` | EDIT | DM-14 |
| `docs/progress-log.md` | APPEND | DM-15 |

**Total: 10 new files, 15 edited files, 1 appended doc.**

---

*Data Model Correction Plan — DCX Manager v0.2.4 — June 2026*
