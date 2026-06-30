# FE-R2: State + Data Flow Map

Generated: 2026-06-26 | Method: grep + manual review of builderStore, StageProvider, queries, actions

---

## Zustand Store (`src/store/builderStore.ts`)

### State fields

| Field | Type | Read by (components) | Written by |
|---|---|---|---|
| nodes | BuilderNode[] | BuilderPage, StageProvider, useAutosave | setNodes, updateNodes (via actions) |
| selection.selectedNodeIds | string[] | (deprecated — StageContext owns this now) | setSelection |
| selection.focusedNodeId | string \| null | (deprecated — StageContext owns this now) | setSelection |
| isLocked | boolean | BuilderPage, useEditorPanel | setLocked (via actions) |
| saveStatus | SaveStatus | BuilderPage, HeaderUserIsland | setSaveStatus (via useAutosave) |
| saveError | string \| null | (error display) | setSaveStatus |
| recentlyCreatedIds | string[] | StageProvider (useEffect sync) | addRecentlyCreatedId (via actions) |
| sessions | EditorSession[] | useEditorPanel (reads), useEditorDraft (reads/writes) | openSession, minimizeSession, closeSession, switchSession, updateDraft, saveSession, discardSessionDraft |
| activeTaskId | string \| null | useEditorPanel | openSession, switchSession, minimizeSession, closeSession |

### Store actions

| Action | Called by |
|---|---|
| setNodes | builder.actions |
| updateNodes | action.actions, node.actions, phase.actions, task.actions, builder.actions |
| setSelection | (deprecated — StageContext preferred) |
| setLocked | builder.actions |
| setSaveStatus | useAutosave |
| addRecentlyCreatedId | phase.actions, action.actions, task.actions |
| clearRecentlyCreatedIds | StageProvider (useEffect) |
| openSession | useEditorPanel |
| minimizeSession | useEditorPanel |
| closeSession | useEditorPanel |
| switchSession | useEditorPanel |
| updateDraft | useEditorDraft |
| saveSession | useEditorDraft |
| discardSessionDraft | useEditorDraft |
| reset | (error recovery) |

---

## Stage Context (`StageProvider.tsx`)

### Context values

| Value | Type | Consumed by |
|---|---|---|
| view | ViewKind | BuilderPage, StageCore, ViewHelperIsland, useViewHelperScrollers |
| selectedNodeIds | string[] | FocusIsland, SelectionIsland, SmokeStage, useFocus, usePresentationMode, useActionCard, usePhaseCard, useDayGridCard, useKanbanInteraction, useMatrixTimeline |
| focusedNodeId | string \| null | BuilderPage, TaskCard (set), useEditorPanel, useStageExpansion |
| expandedNodeIds | string[] | useActionCard, usePhaseCard, TaskCard, useStageExpansion, SelectionIsland, SmokeStage, WeeklyView, useWeeklyView, useKanbanInteraction, useMatrixTimeline, useFocus |
| isolatedNodeIds | string[] \| null | useFocus |
| position | StagePosition | SmokeStage |
| nodes | BuilderNode[] | EditorViewerIsland, FocusIsland, SelectionIsland, StageCore, KanbanView, PhaseDropZone, ActionDropZone, TaskDropZone, SmokeStage, MonthlyView, ViewContextTaskList, useViewHelperScrollers, useDayGridCard, useDayGridDrag, useMatrixTimeline, useWeeklyView, useKanbanInteraction, useEditorPanel, useEditorGuard, usePhaseCard, useFocus, PropertyOption, WeekOption |
| setView | setter | BuilderPage, TimelineBuilderIsland, ViewHelperIsland, useViewHelperScrollers |
| setSelectedNodeIds | setter | SelectionIsland, FocusIsland, useFocus, useActionCard, usePhaseCard, useDayGridCard, useKanbanInteraction, useMatrixTimeline, TaskGridMarker |
| setFocusedNodeId | setter | EditorViewerIsland (useEditorPanel), TaskCard, useFocus |
| setExpandedNodeIds | setter | SelectionIsland, useFocus, useActionCard, usePhaseCard, useWeeklyView, useStageExpansion |
| setIsolatedNodeIds | setter | useFocus |
| setPosition | setter | useStageMovement |
| isEditorOpen | boolean | BuilderPage, StageCore |
| setIsEditorOpen | setter | useEditorPanel |
| recentlyEditedIds | string[] | CardShell (effect animation) |
| markAsRecentlyEdited | fn | (via actions) |
| receivingChildId | string \| null | CardShell (effect animation) |
| setReceivingChildId | fn | (via actions) |
| pendingAction | action \| null | (modal/discard flow) |
| setPendingAction | fn | useEditorGuard |
| rescheduleTask | fn | useDayGridDrag |
| activeSubView | 'weekly' \| 'monthly' | TimelineBuilderIsland, TimelineView |
| setActiveSubView | setter | TimelineBuilderIsland |
| activeWeek | number | WeekOption, MonthlyView, useWeeklyView, TimelineBuilderIsland |
| setActiveWeek | setter | WeekOption, useWeeklyView, TimelineBuilderIsland, MatrixTimelineHeader |
| totalWeeks | number | WeekOption, WeeklyView, MonthlyView, useWeeklyView, useMatrixTimeline |
| isPresentationActive | boolean | SelectionIsland (usePresentationMode) |
| enterPresentationMode | fn | usePresentationMode |
| exitPresentationMode | fn | usePresentationMode |
| isDragging | boolean | PhaseDropZone, ActionDropZone, TaskDropZone, CardShell |
| draggedNodeKind | BuilderNodeKind \| null | PhaseDropZone, ActionDropZone, TaskDropZone |
| draggedNodeId | string \| null | PhaseDropZone, ActionDropZone, TaskDropZone |
| activeDrag | ActiveDragState \| null | KanbanView |
| setDraggingState | fn | BuilderPage, ViewContextTaskItem, PhaseDropZone, ActionDropZone, TaskDropZone, TaskGridMarker, useDayGridDrag, useKanbanInteraction, useMatrixTimeline |

---

## Local State Summary

| Pattern | Count | Example locations |
|---|---|---|
| UI open/close toggle | ~20 | isOpen (FocusIsland, MetadataIsland, StatusDropdownBadge, Selects, TaskCreationFlow, HeaderUserActionsMenu, PropertyOption, WeekOption, AIChatPopup, TemplatePopup, MetadataFilesPopup) |
| Form draft / input values | ~15 | CreateCompositionForm (name, definitionIds), RoutingDirectorySection (segments, quickKey, quickLabel, quickIcon), DayTaskCreator, SearchableSelect search term |
| Selection / active item | ~8 | activeWeek (FocusIsland), activeProperty (FocusIsland), isFocusIslandExpanded, focusMode, taskActionId (KanbanBuilderIsland) |
| Hover / focus | ~6 | isConfirmingDelete (SelectionIsland), isCreatingComposition (TaskCreationFlow), isReviewOpen (AIChatPopup), isDuplicating (MetadataIsland) |
| Async status | ~4 | errorText, validationIssues (MetadataIsland), showSuccess (TimelineBuilderIsland) |

**Total `useState` calls: 131 across all TSX files**

Category breakdown:
- Islands: 60+ useState calls (heavy in MetadataIsland: 7, FocusIsland: 5, RoutingDirectorySection: 6, EditorViewerIsland area: several)
- Forms: ~30 useState calls (selects, inputs, date pickers)
- Stage views: ~25 useState calls (drag state, day grid, timeline)

---

## Data Flow Paths

### Path 1: Builder nodes (the central data pipeline)

```
src/queries/builder.queries.ts (useBuilderNodesQuery)
  → src/services/builder.service.ts (getBuilder)
    → src/services/api-client.ts (readMockJson — reads from localStorage/mock)
      → ApiBuilderTree (raw API shape)
  → src/services/api-mappers.ts (apiBuilderTreeToDomain)
    → DomainBuilderTree { version: Version, phases: Phase[] }
  → src/utils/node.helpers.ts (phasesToBuilderNodes)
    → BuilderNode[] (flattened tree: PhaseNode → ActionNode → TaskNode)
  → consumed by: BuilderPage → StageProvider (via props)
    → distributed to all StageContext consumers via context
```

**Mapper used**: Yes — `apiBuilderTreeToDomain` → `apiVersionToDomain` → `apiPhaseToDomain` → `apiActionToDomain` → `apiTaskToDomain`
**Correctness**: Mappers are correctly called. No raw API types leak to components.

### Path 2: Channel + Composition data

```
src/queries/channels.queries.ts (useChannelsQuery / useCompositionsQuery)
  → src/services/channels.service.ts (getChannels / getCompositions)
    → api-client (mock/localStorage)
      → ApiChannel[] / ApiChannelComposition[]
  → api-mappers.ts (apiChannelToDomain / apiChannelCompositionToDomain)
    → Channel[] / ChannelComposition[]
  → consumed by: TaskCreationFlow (props), ChannelCompositionSelect (props), InlineChannelCompositionSelector (props)
```

**Mapper used**: Yes
**Note**: Mappers are trivial (`{...channel}` spread). Api types and domain types are identical — the mapper exists for type safety but adds no transformation.

### Path 3: Version data

```
src/queries/versions.queries.ts (useVersionQuery / useVersionsQuery)
  → src/services/versions.service.ts (getVersion / getVersions)
    → api-client (mock/localStorage)
      → ApiVersion / ApiVersion[]
  → api-mappers.ts (apiVersionToDomain)
    → Version / Version[]
  → consumed by: MetadataIsland (props via BuilderPage), StageProvider not directly
```

**Mapper used**: Yes
**Consumer note**: Version data reaches MetadataIsland via props from BuilderPage, not via context or store.

### Path 4: Subtask definitions

```
src/queries/subtask-definitions.queries.ts
  → src/services/subtask-definitions.service.ts
    → api-client (mock)
      → ApiSubtaskDefinition[]
  → api-mappers.ts (apiSubtaskDefinitionToDomain)
    → SubtaskDefinition[]
  → consumed by: TaskCreationFlow (props), CreateCompositionForm (props)
```

**Mapper used**: Yes

### Path 5: User/access data

```
src/queries/users.queries.ts (useCurrentUserQuery)
  → src/services/access.service.ts (getMyAccess)
    → api-client (mock)
      → { userId, workspaceIds }
  → No mapper — inline mapping in queryFn
  → consumed by: RouteGuard, usePermissions
```

**Mapper used**: No — inline `{ id: access.userId, workspaceIds: ... }` in queryFn.

### Data layer assessment

| Criterion | Status |
|---|---|
| All queries go through a mapper | ✅ Yes (builder, channels, versions, subtask definitions) |
| Inline mapping instead of dedicated mapper | ⚠️ users.queries.ts — minor, but should use api-mappers |
| Raw API types leak to components | ❌ No — all components receive domain types |
| Builder nodes use domain types in components | ✅ Correct — BuilderNode is the domain UI type |
| `as any` at service boundaries | ❌ Not found in api-mappers.ts (clean) |

---

## Hook Map

| Hook | File | Reads | Returns | Used by |
|---|---|---|---|---|
| **Global hooks** | | | | |
| useTheme | src/hooks/useTheme.ts | useAppStore (themeMode) | { isDark, themeMode } | 14 components (islands, surfaces, forms) |
| usePermissions | src/hooks/usePermissions.ts | useQuery (access) | { canEdit, isLoading } | RouteGuard |
| usePreferences | src/hooks/usePreferences.ts | (scope param) | { preferences, setPreference } | AIChatPopup, TemplatePopup |
| useAutosave | src/hooks/useAutosave.ts | useBuilderStore (nodes), builderActions (save) | { saveNow } | BuilderPage, HeaderUserIsland |
| **Builder hooks** | | | | |
| useCardBehavior | src/builder/cards/useCardBehavior.ts | kind, data, selected, locked, builderActions | { readiness, selected, locked, onClick } | CardShell, useActionCard, usePhaseCard, TaskCard |
| useCardDrag | src/builder/cards/useCardDrag.ts | behavior, drag config | drag handlers | CardShell (internally) |
| useCardEffects | src/builder/cards/useCardEffects.ts | kind, data | { effectName, effectActive, glassBorderClass } | CardShell (via EffectLayer) |
| useDropzones | src/builder/dropzones/useDropzones.ts | view, nodes, dragState | Dropzone[] | KanbanView |
| useFocus | src/builder/focus/useFocus.ts | useStageContext (selection) | { isolatedNodeIds, set... } | FocusIsland |
| useImport | src/builder/import/useImport.ts | builderStore (nodes) | { importNodes, ... } | ImportPreviewModal |
| **Stage hooks** | | | | |
| useDragState | src/builder/stage/useDragState.ts | (local useState) | { isDragging, draggedNodeKind, ... } | StageProvider → context |
| useStageExpansion | src/builder/stage/useStageExpansion.ts | nodes, focusedNodeId, selectedNodeIds | (side effect: setExpandedNodeIds) | StageProvider |
| useStageMovement | src/builder/stage/useStageMovement.ts | position | { handlers } | StageCore |
| useTaskReschedule | src/builder/stage/useTaskReschedule.ts | nodes, builderActions | { rescheduleTask } | StageProvider → context |
| useWeekState | src/builder/stage/useWeekState.ts | nodes | { activeWeek, totalWeeks, ... } | StageProvider → context |
| **Editor hooks** | | | | |
| useEditorPanel | EditorViewerIsland/ | useStageContext, useBuilderStore | { ...panel state } | EditorViewerIsland |
| useEditorDraft | EditorViewerIsland/ | useStageContext, useBuilderStore, useBuilderActions | { draftData, updateDraft, ... } | EditorViewerIsland |
| useEditorGuard | EditorViewerIsland/ | useStageContext | { pendingAction, guard } | EditorViewerIsland |
| useActiveNode | EditorViewerIsland/ | useStageContext (selectedNodeIds, nodes) | { activeNode } | EditorViewerIsland |
| useDayEditorTasks | EditorViewerIsland/ | (node data) | { tasks } | DayEditorSection |
| useEditorReadiness | EditorViewerIsland/ | activeNode | ReadinessResult | EditorHeader |
| useTaskSectionReadiness | EditorViewerIsland/ | draftData | { readiness } | TaskEditor |
| **Island hooks** | | | | |
| useFilePreview | MetadataIsland/ | (file URL) | { preview } | MetadataFilesPopup |
| usePresentationMode | SelectionIsland/ | useStageContext | { ...presentation } | SelectionIsland |
| useTaskCreationFlow | TaskCreationFlow/ | channels, compositions | { flow state } | TaskCreationFlow |
| useViewHelper | ViewHelperIsland/ | — | { ...view state } | ViewHelperIsland |
| useViewHelperScrollers | ViewHelperIsland/ | useStageContext | { scroll handlers } | ViewHelperIsland |
| **Stage view hooks** | | | | |
| useDayGridCard | stage/views/ | useStageContext | { day card state } | DayGridCard |
| useDayGridDrag | stage/views/ | useStageContext, useBuilderActions | { drag handlers } | DayGridCard |
| useKanbanInteraction | stage/views/ | useStageContext, useBuilderActions | { interaction handlers } | KanbanView |
| useMatrixTimeline | stage/views/ | useStageContext, useBuilderActions | { timeline state } | MatrixTimelineView |
| useWeeklyView | stage/views/ | useStageContext | { week state } | WeeklyView |
| **Form hooks** | | | | |
| useDatePickerState | forms/date/ | (date value) | { isOpen, ... } | DatePickerPopup |

---

## Action Flow

### Action files and their responsibilities

| File | Actions | Called by |
|---|---|---|
| `builder.actions.ts` | saveBuilder, lockBuilder, unlockBuilder | BuilderPage, HeaderUserIsland |
| `phase.actions.ts` | createPhase, deletePhase, reorderPhases | KanbanBuilderIsland (palette), KanbanView, SelectionIsland |
| `action.actions.ts` | createAction, deleteAction, updateAction | KanbanBuilderIsland, PhaseCard context menu, EditorViewerIsland |
| `task.actions.ts` | createTask, deleteTask, updateTask | DayTaskCreator, TaskEditor, SelectionIsland |
| `node.actions.ts` | moveNode, duplicateNodes | DropTarget, useDayGridDrag, SelectionIsland |
| `version.actions.ts` | approveVersion | MetadataIsland (approval modal) |
| `action.guards.ts` | canModify (permission check) | All action files (internal) |

### Action → Store mutation map

```
phase.actions:
  createPhase → store.updateNodes (adds new PhaseNode)
  deletePhase → store.updateNodes (removes + renumbers)
  reorderPhases → store.updateNodes (reorders)

action.actions:
  createAction → store.updateNodes (adds ActionCardData to phase)
  deleteAction → store.updateNodes (removes ActionCardData)
  updateAction → store.updateNodes (updates ActionCardData in place)

task.actions:
  createTask → store.updateNodes (adds TaskCardData to action)
  deleteTask → store.updateNodes (removes TaskCardData)
  updateTask → store.updateNodes (updates TaskCardData in place)

node.actions:
  moveNode → store.updateNodes (moves node between parents)
  duplicateNodes → store.updateNodes (clones nodes with new ids)
```

### Action dispatch pattern

All mutations go through `useBuilderActions()`:
```
Component → useBuilderActions() → builderActions.xxx → store.updateNodes
```

This follows the §9.1 Action boundary rule correctly. No component calls `setNodes` or `store.updateNodes` directly (except BuilderPage for initial load).

---

## Data Layer Problems

| Problem | File | Severity | Details |
|---|---|---|---|
| `EditorSession.draftData` typed as `any` | builderStore.ts:11 | Medium | Draft data flows through the store without type safety. Every consumer casts it. |
| Selection state split across two stores | builderStore.selection + StageContext | High | `selectedNodeIds` and `focusedNodeId` exist in both builderStore and StageContext. builderStore's copy appears stale/unused (components read from StageContext). |
| No query invalidation after mutations | All action files | Medium | Mutations update local store state but do not invalidate react-query caches. Data can drift between mock store and query cache. |
| Users query skips api-mappers | queries/users.queries.ts:14 | Low | Inline mapping `{ id: access.userId, ... }` instead of calling a mapper function. Not a bug but inconsistent with other queries. |
| `mapJson` uses `as` cast | api-mappers.ts:41 | Low | `return value as JsonValue | null` — no validation. |
| `draftData` deep clone via JSON | builderStore.ts:99,144 | Low | `JSON.parse(JSON.stringify(...))` is lossy (no Dates, no Maps). Should use structuredClone (available in modern environments). |

---

## Key Findings

1. **Clean action boundary**: All mutations go through `useBuilderActions()` → action files → `store.updateNodes`. No direct store writes from components.

2. **Clean query→mapper pattern**: 5/6 query files use dedicated mappers. Users query is the only inconsistency.

3. **Split selection state**: `selectedNodeIds` and `focusedNodeId` exist in both `builderStore.selection` (zustand) and `StageContext` (React context). StageContext is the active source — builderStore copy appears unused. This is technical debt for P3.

4. **131 `useState` calls**: Heaviest in MetadataIsland (7) and EditorViewerIsland-related files. Most are UI toggle patterns — good candidates for a shared `useToggle` hook.

5. **StageContext is too large**: 28 context values spread across drag state, selection state, view state, expansion state, and presentation mode. Any component that needs 1 value gets all 28.

6. **No query invalidation after mutations**: After `createPhase`, the store updates but `react-query` caches are not invalidated. With mock data this works, but it would cause stale data with a real API.
