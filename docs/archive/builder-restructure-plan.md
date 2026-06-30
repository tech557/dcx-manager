# DCX Manager — Builder Restructure Plan (Pre-UI-Refinement)

**Status:** Do this before any UI refinements. Gemini must receive clean, separated files.  
**Rule:** Every task here is structural only. Zero visual changes. Zero feature changes.  
**Output of this plan:** A builder codebase where interaction logic, state, and rendering are always in separate files — so Gemini can edit a card template without touching drag logic, and edit drag logic without touching a rendered component.

---

## 1. The Two Problems Being Fixed

### Problem A — The `window.dispatchEvent` dead code

`useEditorDraft.ts` line 112 dispatches `'dcx-day-notes-updated'`. Zero listeners exist anywhere in the codebase. Day notes already persist to `localStorage` on the line above. The dispatch is dead code that violates the no-global-events boundary. Fix is one line: delete it.

### Problem B — Interaction, state, and rendering mixed in the same file

The pattern repeating across `stage/views/` and some islands:

```
DayGridCard.tsx     292 lines  — renders a day column AND owns date math AND owns task creation state
WeeklyView.tsx      214 lines  — renders the weekly grid AND owns edge-drag state AND owns week navigation
KanbanView.tsx      187 lines  — renders the board AND owns phase-hover drag state AND handles drops
PhaseCard.tsx       249 lines  — renders a phase column AND owns label-edit state AND manages readiness modal
EditorViewerIsland  303 lines  — renders the editor panel AND owns tab state AND owns dirty state AND owns readiness
ViewHelperIsland    308 lines  — renders the popup AND owns 5 preview states AND owns scroll helpers
```

Every one of these is doing three jobs. When Gemini opens a file to change a visual detail, it finds drag handlers and state mixed in. It either touches them accidentally or works around them awkwardly. This is why the layout keeps regressing.

---

## 2. The Separation Pattern

Every complex component in the builder should follow this structure:

```
MyThing/
  MyThing.tsx          ← renders only. props in, JSX out. ≤120 lines.
  useMyThingState.ts   ← owns local state and derived values. ≤80 lines.
  useMyThingInteraction.ts ← owns event handlers and callbacks. ≤80 lines.
```

The component imports from both hooks. The hooks know nothing about each other. Gemini editing the visual output reads only `MyThing.tsx`. Gemini fixing a drag bug reads only `useMyThingInteraction.ts`.

For simpler components, state and interaction can merge into one `useMyThing.ts` hook. The rendering file must always be separate.

---

## 3. Target Folder Structure for builder/

```
src/builder/
│
├── BuilderPage.tsx              unchanged (183 lines — acceptable orchestrator)
├── BuilderErrorBoundary.tsx     unchanged
│
├── cards/                       the card system
│   ├── CardShell.tsx            115 lines — correct, unchanged
│   ├── CardShellContent.tsx     unchanged
│   ├── FieldIndicator.tsx       unchanged
│   ├── card.registry.ts         unchanged
│   ├── useCardBehavior.ts       unchanged
│   ├── useCardDrag.ts           unchanged
│   ├── useCardEffects.ts        unchanged
│   ├── handleCardDrop.ts        unchanged
│   ├── cardDrag.helpers.ts      unchanged
│   ├── cardSelection.helpers.ts unchanged
│   ├── dragDropHelpers.ts       unchanged
│   ├── __tests__/               unchanged
│   └── templates/
│       ├── phase/
│       │   ├── PhaseCard.tsx             REFACTOR → ≤100 lines (rendering only)
│       │   ├── usePhaseCard.ts           NEW — phase state + interaction
│       │   ├── PhaseActions.tsx          NEW — expanded action list section
│       │   ├── PhaseReadinessBadge.tsx   unchanged
│       │   ├── HorizontalTaskFlow.tsx    unchanged
│       │   ├── TaskBentoGrid.tsx         unchanged
│       │   └── phase.icons.ts            unchanged
│       ├── action/
│       │   ├── ActionCard.tsx            REFACTOR → ≤80 lines (rendering only)
│       │   ├── useActionCard.ts          NEW — action expand/collapse state
│       │   └── ActionTaskList.tsx        unchanged
│       ├── task/
│       │   ├── TaskCard.tsx              unchanged (172 lines — acceptable)
│       │   └── task-properties/          unchanged
│       └── day/
│           └── DayCard.tsx               unchanged
│
├── dropzones/                   unchanged
│
├── focus/                       unchanged
│
├── import/                      unchanged
│
├── islands/
│   ├── BuilderIslandShell.tsx            unchanged
│   ├── island.registry.ts                unchanged
│   │
│   ├── EditorViewerIsland/
│   │   ├── EditorViewerIsland.tsx        REFACTOR → ≤150 lines (rendering only)
│   │   ├── useEditorPanel.ts             NEW — tab state, activeTab, lastNodeId
│   │   ├── useEditorDraft.ts             FIX — remove window.dispatchEvent line
│   │   ├── useEditorGuard.ts             unchanged
│   │   ├── useEditorReadiness.ts         unchanged
│   │   ├── useActiveNode.ts              unchanged
│   │   ├── EditorHeader.tsx              unchanged
│   │   ├── PhaseEditorSection.tsx        unchanged
│   │   ├── ActionEditorSection.tsx       unchanged
│   │   ├── DayEditorSection.tsx          unchanged
│   │   ├── UnsavedChangesModal.tsx       unchanged
│   │   └── TaskEditor/                   unchanged
│   │
│   ├── ViewHelperIsland/
│   │   ├── ViewHelperIsland.tsx          REFACTOR → ≤120 lines (rendering only)
│   │   ├── useViewHelper.ts              NEW — isExpanded + preview state (5 states)
│   │   └── useViewHelperScrollers.ts     NEW — handleScrollToPhase, handleScrollToAction
│   │
│   ├── MetadataIsland/                   unchanged (already decomposed)
│   ├── FocusIsland/                      unchanged
│   ├── KanbanBuilderIsland/              unchanged
│   ├── SelectionIsland/                  unchanged
│   ├── TaskCreationFlow/                 unchanged
│   ├── TimelineBuilderIsland/            unchanged
│   ├── HeaderBrandIsland.tsx             unchanged
│   ├── HeaderUserIsland/                 unchanged
│   ├── AIChatPopup/                      unchanged
│   ├── TemplatePopup/                    unchanged
│   └── PreviewReviewModal/               unchanged
│
└── stage/
    │
    ├── StageCore.tsx                     unchanged (129 lines)
    ├── StageProvider.tsx                 unchanged (108 lines)
    ├── StageEdgeNavigation.tsx           unchanged
    ├── StageLayoutContract.ts            unchanged
    ├── stage.registry.ts                 unchanged
    ├── stageContext.types.ts             unchanged
    ├── useDragState.ts                   unchanged
    ├── useWeekState.ts                   unchanged
    ├── useStageExpansion.ts              unchanged
    ├── useTaskReschedule.ts              unchanged
    ├── useStageMovement.ts               unchanged
    ├── targetCursor.helpers.ts           unchanged
    ├── TargetCursor.tsx                  unchanged
    │
    └── views/
        ├── KanbanView.tsx                REFACTOR → ≤100 lines (rendering only)
        ├── useKanbanInteraction.ts       NEW — phase hover drag state + handlers
        │
        ├── WeeklyView.tsx                REFACTOR → ≤100 lines (rendering only)
        ├── useWeeklyView.ts              NEW — edge drag state + timer + task/day derivation
        │
        ├── DayGridCard.tsx               REFACTOR → ≤150 lines (rendering only)
        ├── useDayGridCard.ts             NEW — isAdding state + date math + task helpers
        │
        ├── MatrixTimelineView.tsx        REFACTOR → ≤80 lines (rendering only)
        ├── useMatrixTimeline.ts          MERGE → absorb useMatrixTimelineActions.ts
        │
        ├── MonthlyView.tsx               unchanged (105 lines — acceptable)
        ├── DayGridCardCollapsed.tsx      unchanged
        ├── DayTaskCreator.tsx            unchanged
        ├── PhaseDropZone.tsx             unchanged
        ├── ActionDropZone.tsx            unchanged
        ├── TaskDropZone.tsx              unchanged
        ├── TaskGridMarker.tsx            unchanged
        ├── TimelineView.tsx              unchanged
        ├── TimelineHourCell.tsx          unchanged
        ├── TimelineCustomEdgeSensors.tsx unchanged
        ├── MatrixTimelineHeader.tsx      unchanged
        ├── SmokeStage.tsx                unchanged
        ├── timeline.helpers.ts           unchanged
        ├── useDayGridDrag.ts             unchanged
        └── useMatrixTimelineActions.ts   DELETE — merged into useMatrixTimeline.ts
```

---

## 4. Sprint Tasks

### Sprint S0 — Fix the window.dispatchEvent (5 minutes)

**File:** `src/builder/islands/EditorViewerIsland/useEditorDraft.ts`

Delete line 112:
```typescript
// DELETE this line:
window.dispatchEvent(new CustomEvent('dcx-day-notes-updated', { detail: { id: activeNode.id, notes: notesValue } }));
```

The line above it (`safeLocalStorage.setItem(...)`) already persists the notes. No listener exists for the event. Nothing breaks.

**Acceptance:**
```
□ grep -rn "dcx-day-notes-updated" src/ → 0 results
□ tsc passes
□ Day notes still save to localStorage when editor saves
```

---

### Sprint S1 — Extract `useKanbanInteraction.ts` from `KanbanView.tsx`

**Why:** `KanbanView.tsx` owns phase-hover drag state (4 variables) and 4 interaction handlers. These have nothing to do with rendering the phase columns.

**Create `src/builder/stage/views/useKanbanInteraction.ts`:**

```typescript
import { useState, useEffect } from 'react';
import { useStageContext } from '../StageProvider';
import { useBuilderActions } from '@/actions/useBuilderActions';
import { getCardDragPayload, setActiveCardDragPayload } from '@/builder/cards/cardDrag.helpers';

export function useKanbanInteraction(versionId: string) {
  const { isDragging, draggedNodeId, draggedNodeKind, setDraggingState } = useStageContext();
  const actions = useBuilderActions();

  const [isDragOver, setIsDragOver] = useState(false);
  const [hoveredPhaseId, setHoveredPhaseId] = useState<string | null>(null);
  const [hoverDirection, setHoverDirection] = useState<'left' | 'right' | null>(null);

  useEffect(() => {
    if (!isDragging) { setHoveredPhaseId(null); setHoverDirection(null); }
  }, [isDragging]);

  const handleBoardDragOver = (e: React.DragEvent<HTMLDivElement>) => { ... };
  const handleBoardDragLeave = () => setIsDragOver(false);
  const handleBoardDrop = (e: React.DragEvent<HTMLDivElement>) => { ... };
  const handlePhaseColumnDragOver = (e: React.DragEvent<HTMLElement>, phaseId: string) => { ... };
  const handlePhaseColumnDragLeave = (e: React.DragEvent<HTMLElement>, phaseId: string) => { ... };
  const getPhaseTranslationStyle = (phaseId: string): React.CSSProperties => { ... };

  return {
    isDragOver,
    hoveredPhaseId,
    hoverDirection,
    boardHandlers: { onDragOver: handleBoardDragOver, onDragLeave: handleBoardDragLeave, onDrop: handleBoardDrop },
    getPhaseColumnHandlers: (phaseId: string) => ({
      onDragOver: (e: React.DragEvent<HTMLElement>) => handlePhaseColumnDragOver(e, phaseId),
      onDragLeave: (e: React.DragEvent<HTMLElement>) => handlePhaseColumnDragLeave(e, phaseId),
    }),
    getPhaseTranslationStyle,
  };
}
```

**Update `KanbanView.tsx`** — remove all 4 state variables and 4 handlers. Import from `useKanbanInteraction`. Target: ≤100 lines.

**Acceptance:**
```
□ KanbanView.tsx ≤ 100 lines
□ useKanbanInteraction.ts ≤ 80 lines
□ Phase drag rearrangement still works with drop zones
□ Board drop (create phase from palette) still works
□ tsc passes
```

---

### Sprint S2 — Extract `useWeeklyView.ts` from `WeeklyView.tsx`

**Why:** `WeeklyView.tsx` owns 10 hooks (the most of any view file). It derives all tasks, actions, and days; manages edge-drag scroll timers; and handles week navigation state. The rendering is simple — the logic is complex.

**Create `src/builder/stage/views/useWeeklyView.ts`:**

```typescript
export function useWeeklyView() {
  const { nodes, activeWeek, totalWeeks, setActiveWeek, setTotalWeeks,
          isDragging, expandedNodeIds } = useStageContext();

  // Task/action/day derivation (currently 3 large useMemo blocks)
  const allTasks = useMemo(() => { ... }, [nodes]);
  const actionsList = useMemo(() => { ... }, [nodes]);
  const days = useMemo(() => { ... }, [activeWeek]);

  // Week initialisation (currently initializedWeeks + useEffect)
  const [initializedWeeks, setInitializedWeeks] = useState<number[]>([]);
  useEffect(() => { ... }, [activeWeek, days, allTasks]);

  // Edge drag scroll (currently isDraggingOverLeft/Right + timer ref + handlers)
  const [isDraggingOverLeft, setIsDraggingOverLeft] = useState(false);
  const [isDraggingOverRight, setIsDraggingOverRight] = useState(false);
  const edgeDragTimerRef = useRef<...>(null);
  const handleEdgeDragOver = (direction: 'left' | 'right') => { ... };
  const handleEdgeDragLeave = () => { ... };

  return { allTasks, actionsList, days, isDraggingOverLeft, isDraggingOverRight,
           handleEdgeDragOver, handleEdgeDragLeave, activeWeek, totalWeeks };
}
```

**Update `WeeklyView.tsx`** — remove all state and memos. Import from `useWeeklyView`. Target: ≤100 lines of pure JSX.

**Acceptance:**
```
□ WeeklyView.tsx ≤ 100 lines
□ useWeeklyView.ts ≤ 100 lines
□ Weekly view renders days correctly
□ Edge-drag week navigation still works
□ tsc passes
```

---

### Sprint S3 — Extract `useDayGridCard.ts` from `DayGridCard.tsx`

**Why:** `DayGridCard.tsx` is 292 lines. It owns date formatting (4 `useMemo` blocks), task creation state, collapse state, and drag handlers — all mixed with a complex JSX tree.

**Create `src/builder/stage/views/useDayGridCard.ts`:**

```typescript
export function useDayGridCard({ dateString, anchorDateStr, tasks, isMonthly }: DayGridCardOptions) {
  const { expandedNodeIds, setExpandedNodeIds, selectedNodeIds, setSelectedNodeIds } = useStageContext();

  const [isAdding, setIsAdding] = useState(false);

  // All date math (currently 4 useMemo blocks)
  const isCollapsed = !isMonthly && !expandedNodeIds.includes(`day:${dateString}`);
  const hasAnyExpandedTask = useMemo(() => ..., [tasks, expandedNodeIds]);
  const anchorDateObj = useMemo(() => parseDateString(anchorDateStr), [anchorDateStr]);
  const baseDayOfWeek = anchorDateObj.getUTCDay();
  const dayNum = useMemo(() => ..., [dateString, anchorDateStr]);
  const formattedDateParts = useMemo(() => ..., [dateString]);

  // Interaction handlers
  const handleToggleCollapse = (e: React.MouseEvent) => { ... };
  const handleSelectTask = (id: string, isMulti: boolean) => { ... };
  const handleOpenAdd = () => setIsAdding(true);
  const handleCloseAdd = () => setIsAdding(false);

  return {
    isAdding, isCollapsed, hasAnyExpandedTask, dayNum, formattedDateParts,
    baseDayOfWeek, handleToggleCollapse, handleSelectTask, handleOpenAdd, handleCloseAdd,
  };
}
```

`useDayGridDrag` already exists for the drag interaction — the new hook covers everything else.

**Update `DayGridCard.tsx`** — remove all state and memos. Import from `useDayGridCard`. Target: ≤150 lines.

**Acceptance:**
```
□ DayGridCard.tsx ≤ 150 lines
□ useDayGridCard.ts ≤ 90 lines
□ Day cards render correctly in weekly and monthly views
□ Collapse/expand toggle works
□ Task creation from day card still works
□ Date display correct
□ tsc passes
```

---

### Sprint S4 — Extract `useEditorPanel.ts` from `EditorViewerIsland.tsx`

**Why:** `EditorViewerIsland.tsx` is 303 lines. It owns tab state, lastNodeId tracking, readiness modal state, dirty state reading, and drag state — all before any JSX starts at line 187.

**Create `src/builder/islands/EditorViewerIsland/useEditorPanel.ts`:**

```typescript
export function useEditorPanel() {
  const [activeTab, setActiveTab] = useState<'info' | 'channel' | 'specs' | 'subtasks'>('info');
  const [lastNodeId, setLastNodeId] = useState<string | null>(null);
  const [isReadinessModalOpen, setIsReadinessModalOpen] = useState(false);
  const [isDragActive, setIsDragActive] = useState(false);

  // Reset tab when node changes
  const activeNode = useActiveNode();
  useEffect(() => {
    if (activeNode?.id !== lastNodeId) {
      setActiveTab('info');
      setLastNodeId(activeNode?.id ?? null);
    }
  }, [activeNode?.id, lastNodeId]);

  return {
    activeTab, setActiveTab,
    isReadinessModalOpen, setIsReadinessModalOpen,
    isDragActive, setIsDragActive,
    activeNode,
  };
}
```

**Update `EditorViewerIsland.tsx`** — remove all owned state. Import from `useEditorPanel`. Target: ≤150 lines.

**Acceptance:**
```
□ EditorViewerIsland.tsx ≤ 150 lines
□ useEditorPanel.ts ≤ 60 lines
□ Tab switching in editor still works
□ Tab resets when a different node is selected
□ Readiness modal still opens
□ tsc passes
```

---

### Sprint S5 — Extract `useViewHelper.ts` and `useViewHelperScrollers.ts` from `ViewHelperIsland.tsx`

**Why:** `ViewHelperIsland.tsx` is 308 lines. It owns 5 preview states, scroll handlers for phases and actions, and file preview logic — all before the JSX.

**Create `src/builder/islands/ViewHelperIsland/useViewHelper.ts`:**

```typescript
export function useViewHelper() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewTitle, setPreviewTitle] = useState<string | undefined>(undefined);
  const [previewContentType, setPreviewContentType] = useState<string | null>(null);
  const [previewEmbedAllowed, setPreviewEmbedAllowed] = useState<boolean | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const openPreview = (url: string, title?: string) => { ... };
  const closePreview = () => { ... };
  const checkEmbedAllowed = async (url: string) => { ... };

  return { isExpanded, setIsExpanded, isPreviewOpen, previewUrl, previewTitle,
           previewContentType, previewEmbedAllowed, openPreview, closePreview };
}
```

**Create `src/builder/islands/ViewHelperIsland/useViewHelperScrollers.ts`:**

```typescript
export function useViewHelperScrollers() {
  const { nodes } = useStageContext();
  const phases = nodes.filter(n => n.kind === 'phase');
  const actionCards = phases.flatMap(p => p.data.actionCards);
  const tasks = actionCards.flatMap(a => a.tasks ?? []);

  const handleScrollToPhase = (phaseId: string) => { ... };
  const handleScrollToAction = (actionId: string) => { ... };

  return { phases, actionCards, tasks, handleScrollToPhase, handleScrollToAction };
}
```

**Update `ViewHelperIsland.tsx`** — import from both hooks. Target: ≤120 lines.

**Acceptance:**
```
□ ViewHelperIsland.tsx ≤ 120 lines
□ useViewHelper.ts ≤ 70 lines
□ useViewHelperScrollers.ts ≤ 40 lines
□ Phase scroll still works
□ File preview still opens and embeds
□ tsc passes
```

---

### Sprint S6 — Extract `usePhaseCard.ts` from `PhaseCard.tsx`

**Why:** `PhaseCard.tsx` is 249 lines. It owns label-edit state, readiness modal state, focus toggle logic, and action list management — before any rendering.

**Create `src/builder/cards/templates/phase/usePhaseCard.ts`:**

```typescript
export function usePhaseCard({ phase, onSelect }: { phase: PhaseNodeData; onSelect?: SelectHandler }) {
  const { nodes, expandedNodeIds, setExpandedNodeIds,
          selectedNodeIds, setSelectedNodeIds, isolatedNodeIds,
          setIsolatedNodeIds } = useStageContext();
  const actions = useBuilderActions();

  const [editedLabel, setEditedLabel] = useState(phase.label);
  const [isReadinessModalOpen, setIsReadinessModalOpen] = useState(false);

  // Derived values
  const phaseIndex = nodes.filter(n => n.kind === 'phase').findIndex(n => n.id === phase.id);
  const actionIds = phase.actionCards.map(ac => ac.id);
  const allActionsExpanded = actionIds.length > 0 && actionIds.every(id => expandedNodeIds.includes(id));

  // Handlers
  const handleLabelSubmit = () => { ... };
  const handleFocusToggle = () => { ... };
  const handleSelect = (id: string, isMulti: boolean) => { ... };
  const handleToggleAllActions = () => { ... };

  return {
    editedLabel, setEditedLabel, isReadinessModalOpen, setIsReadinessModalOpen,
    phaseIndex, allActionsExpanded, handleLabelSubmit, handleFocusToggle,
    handleSelect, handleToggleAllActions,
  };
}
```

**Update `PhaseCard.tsx`** — remove all state and logic. Import from `usePhaseCard`. Target: ≤100 lines.

**Acceptance:**
```
□ PhaseCard.tsx ≤ 100 lines
□ usePhaseCard.ts ≤ 90 lines
□ Phase label inline editing still works
□ Focus toggle still works
□ Readiness modal still opens
□ Expand/collapse all actions still works
□ tsc passes
```

---

### Sprint S7 — Extract `useActionCard.ts` from `ActionCard.tsx`

**Why:** `ActionCard.tsx` is 160 lines and owns expand/collapse state, inline name editing, task count derivation, and focus state. A short hook cleans it immediately.

**Create `src/builder/cards/templates/action/useActionCard.ts`:**

```typescript
export function useActionCard({ action, onSelect }: { action: ActionCardData; onSelect?: SelectHandler }) {
  const { expandedNodeIds, setExpandedNodeIds, selectedNodeIds, setSelectedNodeIds } = useStageContext();
  const actions = useBuilderActions();

  const [editedName, setEditedName] = useState(action.name);
  const isExpanded = expandedNodeIds.includes(action.id);
  const taskCount = action.tasks?.length ?? 0;

  const handleToggleExpand = () => { ... };
  const handleNameSubmit = () => { ... };
  const handleSelect = (id: string, isMulti: boolean) => { ... };

  return { editedName, setEditedName, isExpanded, taskCount,
           handleToggleExpand, handleNameSubmit, handleSelect };
}
```

**Update `ActionCard.tsx`** — Target: ≤80 lines.

**Acceptance:**
```
□ ActionCard.tsx ≤ 80 lines
□ useActionCard.ts ≤ 60 lines
□ Action expand/collapse still works
□ Inline name edit still works
□ tsc passes
```

---

### Sprint S8 — Merge `useMatrixTimelineActions` into `useMatrixTimeline.ts`

**Why:** `useMatrixTimelineActions.ts` exists solely to serve `MatrixTimelineView.tsx`. Having a separate file for a 77-line hook that only one component uses is artificial fragmentation. Merge and simplify.

**Create `src/builder/stage/views/useMatrixTimeline.ts`** — absorb both files.  
**Delete `src/builder/stage/views/useMatrixTimelineActions.ts`.**  
**Update `MatrixTimelineView.tsx`** — import from `useMatrixTimeline`.

**Acceptance:**
```
□ useMatrixTimelineActions.ts deleted
□ MatrixTimelineView.tsx imports from useMatrixTimeline.ts
□ Matrix timeline view renders correctly
□ tsc passes
```

---

## 5. Sprint Order

```
S0  window.dispatchEvent fix         2 min — do first, standalone
S1  useKanbanInteraction             30 min — high visual impact
S2  useWeeklyView                    40 min — most hooks to move
S3  useDayGridCard                   40 min — most lines to move
S4  useEditorPanel                   30 min — frees the editor for UI work
S5  useViewHelper(Scrollers)         30 min — frees ViewHelperIsland
S6  usePhaseCard                     30 min — frees PhaseCard for visual redesign
S7  useActionCard                    20 min — quick win
S8  useMatrixTimeline merge          15 min — cleanup
```

S0 is a prerequisite. S1–S8 are independent and can run in any order. S6 and S7 are highest priority because Gemini will be editing PhaseCard and ActionCard visuals — they must be clean before that work starts.

---

## 6. After This Plan Completes

**Every component Gemini will touch for UI refinements will have:**
- A rendering file ≤150 lines with only JSX and prop wiring
- A state/interaction hook that Gemini is told to leave alone
- No event handlers mixed into the rendered output

The instruction to Gemini per UI amendment becomes:  
*"Edit only `PhaseCard.tsx`. Do not touch `usePhaseCard.ts`, `CardShell.tsx`, or `card.registry.ts`."*

That is a constraint Gemini can actually follow.

---

## 7. What Gemini Must Not Touch During UI Work (Post-Restructure)

These files are interaction/state only. Gemini should never edit them for visual reasons:

```
useKanbanInteraction.ts      — drag state
useWeeklyView.ts             — edge scroll, week derivation
useDayGridCard.ts            — date math, task creation state
useEditorPanel.ts            — tab state, dirty state
useViewHelper.ts             — preview state
useViewHelperScrollers.ts    — scroll handlers
usePhaseCard.ts              — phase label, focus toggle
useActionCard.ts             — action name, expand/collapse
useCardDrag.ts               — card drag handlers
useCardEffects.ts            — visual state registry
useCardBehavior.ts           — card behavior contract
handleCardDrop.ts            — drop logic
StageProvider.tsx            — stage context
useDragState.ts              — drag context
useWeekState.ts              — week context
```

These files belong to Codex or a dedicated fix session only.

---

*Builder Restructure Plan — DCX Manager v0.2.15 — pre-UI-refinement*
