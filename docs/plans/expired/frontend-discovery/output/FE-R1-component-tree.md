# FE-R1: Component Tree + Dependencies

Generated: 2026-06-26 | Method: ts-morph (generate-code-index.ts) + grep

Based on: `code-index/components.json` (98 components) + `code-index/component-usages.json` (all JSX element usages)

---

## Full Component Tree (by island)

### BuilderIslandShell (src/builder/islands/BuilderIslandShell.tsx)
- BuilderIslandShell.tsx
  - motion.div (native)
  - AnimatePresence (framer)
  hooks: useTheme (reads: isDark)
  context: none (pure layout shell)
  props: isExpanded, onToggle, collapsedIcon, collapsedWidth, expandedWidth, shape, id, children, position

### EditorViewerIsland (src/builder/islands/EditorViewerIsland/)
- EditorViewerIsland.tsx
  - BuilderIslandShell (shared shell)
  - EditorSessionPill.tsx (child)
  - EditorHeader.tsx (child)
    - TextInputInline (form)
    - ReadyMark (feedback)
    - AlertMark (feedback)
    - InlineChannelCompositionSelector (channel)
    - MenuSectionButton (button)
  - PhaseEditorSection.tsx (child) — renders conditionally for phase nodes
  - ActionEditorSection.tsx (child) — renders conditionally for action nodes
    - TextInputLarge (form)
  - TaskEditor/TaskEditor.tsx (child) — renders conditionally for task nodes
    - TaskSection1.tsx
    - TaskSection3.tsx
    - TaskSection4.tsx
      - RoutingDirectorySection.tsx
  - DayEditorSection.tsx (child) — renders conditionally for day nodes
    - TextInputLarge (form)
  - UnsavedChangesModal.tsx (child)
  - ReadinessCheckModal (modal)
  - DiscardSessionModal.tsx (child)
  hooks: useEditorPanel, useEditorDraft, useEditorGuard, useActiveNode, useTaskSectionReadiness
  context: useStageContext (reads: nodes, focusedNodeId, setFocusedNodeId, setIsEditorOpen)
          useBuilderStore (reads: sessions, activeTaskId, isLocked, draft data)

### MetadataIsland (src/builder/islands/MetadataIsland/)
- MetadataIsland.tsx
  - HeaderBrandIsland.tsx (child)
  - MetadataDetailsContent.tsx (child)
    - CampaignDetailsGroup.tsx (child)
    - DividerLine (ui/atom)
    - StatusDropdownBadge.tsx (child)
    - CommunicationDateField (form)
    - ViewTabSwitcher.tsx (child)
  - HeaderUserIsland.tsx (child)
  - MetadataFilesPopup.tsx (child)
    - StickyPopupShell (ui/shell)
  - MetadataModalsContainer.tsx (child)
    - ApprovalConfirmModal (modal)
    - ImportPreviewModal (modal)
    - ValidationSummary (feedback)
  hooks: useTheme (reads: isDark), useQueryClient
  context: none (receives all data via props)

### FocusIsland (src/builder/islands/FocusIsland/)
- FocusIsland.tsx
  - BuilderIslandShell (shared shell)
  - IslandToggleButton (button)
  - WeekOption.tsx (child)
  - PropertyOption.tsx (child)
  hooks: useTheme (reads: isDark)
  context: useStageContext (reads: nodes, selectedNodeIds, setSelectedNodeIds)

### KanbanBuilderIsland (src/builder/islands/KanbanBuilderIsland/)
- KanbanBuilderIsland.tsx
  - IslandToggleButton (button)
  - InlineIslandButton (button)
  - StickyPopupShell (ui/shell)
  - TaskCreationFlow (child)
    - CreateCompositionForm.tsx
    - Step1SelectChannel.tsx
    - Step2SelectComposition.tsx
    - Step3ReviewSubtasks.tsx
  hooks: useBuilderActions
  context: none (receives all data via props)

### SelectionIsland (src/builder/islands/SelectionIsland/)
- SelectionIsland.tsx
  - BuilderIslandShell (shared shell)
  - SelectionLabel.tsx (child)
  - SelectionButtons.tsx (child)
  - DeleteConfirmation.tsx (child)
    - GlassSurface (ui/surface)
  hooks: usePresentationMode
  context: useStageContext (reads: nodes, selectedNodeIds, setSelectedNodeIds, view, expandedNodeIds, setExpandedNodeIds, isPresentationActive, enterPresentationMode, exitPresentationMode)
          useBuilderActions (mutations)

### TimelineBuilderIsland (src/builder/islands/TimelineBuilderIsland/)
- TimelineBuilderIsland.tsx
  hooks: useTheme (reads: isDark), useStageContext (reads: activeSubView)
  context: useStageContext (reads: nodes, activeWeek, setActiveWeek, setView)

### ViewHelperIsland (src/builder/islands/ViewHelperIsland/)
- ViewHelperIsland.tsx
  - ViewContextTaskList.tsx (child)
    - ViewContextTaskItem.tsx (child)
      - ChannelPill (task-property)
  hooks: useViewHelper, useViewHelperScrollers
  context: useStageContext (reads: nodes, view, setView, setDraggingState)

### HeaderUserIsland (src/builder/islands/HeaderUserIsland/)
- HeaderUserIsland.tsx
  - AnimatePresence (framer)
  - HeaderUserActionsMenu.tsx (child)
  - Link (router)
  hooks: useAutosave, useTheme
  context: useAppStore (reads: setThemeMode)
          useBuilderStore (reads: saveStatus)

### HeaderBrandIsland (src/builder/islands/HeaderBrandIsland.tsx)
- HeaderBrandIsland.tsx
  - motion.button (framer)
  - span, h1 (native)
  hooks: useTheme (reads: isDark)
  context: none

---

## Stage Views Component Tree

### Stage Core (src/builder/stage/StageCore.tsx)
- StageCore
  - StageEdgeNavigation (child)
  - Renderer (dynamic — resolves via stage.registry.ts)
    → KanbanView | MatrixTimelineView | WeeklyView | MonthlyView | TimelineView | SmokeStage
  context: useStageContext (reads: view, nodes, focusedNodeId, isEditorOpen, expandedNodeIds, ...)

### KanbanView (src/builder/stage/views/KanbanView.tsx)
- KanbanView
  - KanbanHiddenDropzones → DropTarget
  - PhaseDropZone (per phase gap)
  - PhaseCard (per phase)
    - PhaseReadinessBadge
    - HorizontalTaskFlow / TaskBentoGrid
  context: useStageContext, useBuilderActions, useDropzones

### TimelineView (src/builder/stage/views/TimelineView.tsx)
- TimelineView
  - WeeklyView → DayGridCard → DayGridCardCollapsed, TaskCard, DayTaskCreator
  - MonthlyView → DayGridCard
  - MatrixTimelineView → MatrixTimelineHeader, TimelineCustomEdgeSensors, TimelineHourCell → TaskGridMarker
  context: useStageContext (reads: activeSubView)

### Card Templates
- CardShell (shared chassis)
  - CardShellContent → GlassSurface
  - PhaseCard → PhaseReadinessBadge, HorizontalTaskFlow, TaskBentoGrid
  - ActionCard → ActionTaskList
  - TaskCard → TaskReadOnlyPopup, TaskProperties → ChannelPill, TaskCardPopovers
  - DayCard (standalone — no CardShell)

---

## Context + Store Coupling Map

| Component | useStageContext reads | useBuilderStore reads | useAppStore | Queries | useBuilderActions |
|---|---|---|---|---|---|
| EditorViewerIsland | nodes, focusedNodeId, setFocusedNodeId, setIsEditorOpen | sessions, activeTaskId, isLocked, draft | — | — | Yes (via useEditorDraft) |
| useEditorPanel | nodes, focusedNodeId, setFocusedNodeId, setIsEditorOpen | sessions, activeTaskId, openSession, minimizeSession, closeSession, switchSession | — | — | — |
| useEditorDraft | (via context) | sessions, updateDraft, saveSession, discardSessionDraft | — | — | Yes |
| FocusIsland | nodes, selectedNodeIds, setSelectedNodeIds | — | — | — | — |
| PropertyOption | nodes | — | — | — | — |
| WeekOption | nodes, totalWeeks | — | — | — | — |
| SelectionIsland | nodes, selectedNodeIds, setSelectedNodeIds, view, expandedNodeIds, setExpandedNodeIds, isPresentationActive, enterPresentationMode, exitPresentationMode | — | — | — | Yes |
| TimelineBuilderIsland | nodes, activeWeek, setActiveWeek, setView | — | — | — | — |
| ViewHelperIsland | nodes, view, setView | — | — | — | — |
| ViewContextTaskList | nodes | — | — | — | — |
| ViewContextTaskItem | setDraggingState | — | — | — | — |
| useViewHelperScrollers | nodes, view, setView | — | — | — | — |
| StageCore | view, nodes, focusedNodeId, isEditorOpen, expandedNodeIds, ... | — | — | — | — |
| KanbanView | nodes, selectedNodeIds, expandedNodeIds, focusedNodeId, view, isEditorOpen | — | — | — | Yes |
| SmokeStage | nodes, selectedNodeIds, focusedNodeId, expandedNodeIds, position | — | — | — | — |
| MonthlyView | nodes, totalWeeks | — | — | — | — |
| TimelineView | activeSubView | — | — | — | — |
| PhaseDropZone | isDragging, draggedNodeKind, nodes, setDraggingState | — | — | — | Yes |
| ActionDropZone | isDragging, draggedNodeKind, nodes, setDraggingState | — | — | — | Yes |
| TaskDropZone | isDragging, draggedNodeKind, nodes, setDraggingState | — | — | — | Yes |
| useDayGridDrag | nodes, rescheduleTask, setDraggingState | — | — | — | Yes |
| useKanbanInteraction | nodes, selectedNodeIds, ... | — | — | — | Yes |
| useMatrixTimeline | nodes, selectedNodeIds, expandedNodeIds, ... | — | — | — | Yes |
| useWeeklyView | nodes, activeWeek, setActiveWeek, totalWeeks, expandedNodeIds, setExpandedNodeIds | — | — | — | — |
| useFocus | setSelectedNodeIds, setFocusedNodeId, setExpandedNodeIds, expandedNodeIds, setIsolatedNodeIds | — | — | — | — |
| usePresentationMode | isPresentationActive, enterPresentationMode, exitPresentationMode, selectedNodeIds | — | — | — | — |
| CardShell | nodes, kind-based config | — | — | — | Yes (via useCardBehavior) |
| useActionCard | expandedNodeIds, ... | — | — | — | Yes |
| usePhaseCard | nodes, expandedNodeIds, ... | — | — | — | Yes |
| TaskCard | expandedNodeIds, setFocusedNodeId | — | — | — | — |
| useCardDrag | (via context) | — | — | — | — |
| TaskGridMarker | selectedNodeIds, setSelectedNodeIds, setDraggingState | — | — | — | — |
| BuilderPage | view, setView, focusedNodeId, nodes, isEditorOpen, setDraggingState | nodes, setSaveStatus, isLocked, setLocked | — | useAutosave | — |
| HeaderUserIsland | — | saveStatus | setThemeMode | — | — |
| HeaderBrandIsland | — | — | — | — | — |
| BuilderIslandShell | — | — | — | useTheme | — |
| MetadataIsland | — | — | — | useQueryClient | — |
| RouteGuard | — | — | — | useQuery (access, dcxAccess) | — |
| usePermissions | — | — | — | useQuery (access, dcxAccess) | — |

### Queries used by component
| Query | Used by |
|---|---|
| getBuilderNodes (builder.queries) | BuilderPage (via useAutosave) |
| getChannels (channels.queries) | TaskCreationFlow, ChannelCompositionSelect |
| getVersions (versions.queries) | MetadataIsland |
| getSubtaskDefinitions (subtask-definitions.queries) | TaskCreationFlow |
| getUsers (users.queries) | MetadataIsland |
| accessQuery | RouteGuard, usePermissions |

### Hook dependency map

| Hook | Used by |
|---|---|
| useTheme (isDark) | BuilderIslandShell, PropertyOption, WeekOption, HeaderBrandIsland, HeaderUserIsland, MetadataIsland, MetadataFilesPopup, StatusDropdownBadge, ViewTabSwitcher, TimelineBuilderIsland, CommunicationDateField, DatePickerPopup, DatePickerToggle, PopoverShell |
| useCardBehavior | CardShell, useActionCard, usePhaseCard, TaskCard |
| useBuilderActions | useActionCard, usePhaseCard, TaskProperties, useCardBehavior, DropTarget, useEditorDraft, KanbanBuilderIsland, SelectionIsland, TaskCreationFlow, useTaskReschedule, ActionDropZone, DayTaskCreator, KanbanView, PhaseDropZone, TaskDropZone, useDayGridDrag, useKanbanInteraction, useMatrixTimeline |
| useAutosave | BuilderPage, HeaderUserIsland |
| useDragState | StageProvider |

---

## Leaf Atoms (safe to extract to ui/atoms/)

These components render only HTML/native elements and receive only primitive props. No project-internal child components.

| Component | File | Props | Can move? |
|---|---|---|---|
| DividerLine | src/ui/DividerLine.tsx | orientation, className | Yes |
| StatusBadge | src/ui/StatusBadge.tsx | status, size | Yes |
| LockBadge | src/ui/LockBadge.tsx | isLocked | Yes |
| PopoverShell | src/ui/PopoverShell.tsx | children, className, width | Yes |
| StickyPopupShell | src/ui/StickyPopupShell.tsx | isOpen, onClose, onMinimize, isMinimized, title, children, className, style | Yes (but uses useTheme) |
| GlassSurface | src/ui/surfaces/GlassSurface.tsx | children, width, height, borderRadius, className, backdropClassName, opacity, noBackground | Yes |
| EffectLayer | src/ui/motion/EffectLayer.tsx | effect, active, className | Yes |
| BuilderBg | src/ui/BuilderBg/BuilderBg.tsx | (none) | Yes |
| LightRays | src/ui/BuilderBg/LightRays.tsx | raysOrigin, raysColor, raysSpeed, lightSpread, rayLength, pulsating, fadeDistance, saturation, followMouse, mouseInfluence, noiseAmount, distortion | Yes |
| AlertMark | src/components/feedback/AlertMark.tsx | className, id | Yes |
| ReadyMark | src/components/feedback/ReadyMark.tsx | className, id | Yes |
| InlineIslandButton | src/components/elements/buttons/InlineIslandButton.tsx | id, label, isActive, isDisabled, icon, onClick, draggable, title, className | Yes |
| IslandToggleButton | src/components/elements/buttons/IslandToggleButton.tsx | id, isActive, onClick, icon, activeIcon, title, ariaLabel, className | Yes |
| MenuSectionButton | src/components/elements/buttons/MenuSections.tsx | id, label, title, isActive, isPassed, onClick | Yes |
| TextInputSmall | src/components/forms/inputs/TextInputSmall.tsx | (input props) | Yes |
| TextInputLarge | src/components/forms/inputs/TextInputLarge.tsx | (input props) | Yes |
| TextInputInline | src/components/forms/inputs/TextInputInline.tsx | (input props) | Yes |
| DualInput | src/components/forms/inputs/DualInput.tsx | (compound input) | Yes |
| ListInputLines | src/components/forms/inputs/ListInputLines.tsx | (compound input) | Yes |
| SpecsInput | src/components/forms/inputs/SpecsInput.tsx | (compound input) | Yes |
| InlineSelect | src/components/forms/selects/InlineSelect.tsx | (select props) | Yes |
| SearchableSelect | src/components/forms/selects/SearchableSelect.tsx | (select props) | Yes |
| SearchableSelectIcons | src/components/forms/selects/SearchableSelectIcons.tsx | (select props) | Yes |
| CompletionStateSelect | src/components/forms/selects/CompletionStateSelect.tsx | status, onChange | Yes |
| DateInputTBD | src/components/forms/inputs/DateInputTBD.tsx | (input props) | Yes |
| PhaseReadinessBadge | src/builder/cards/templates/phase/PhaseReadinessBadge.tsx | state, label | Yes |
| ChannelPill | src/builder/cards/templates/task/task-properties/ChannelPill.tsx | channel, size | Yes |
| CampaignDetailsGroup | src/builder/islands/MetadataIsland/CampaignDetailsGroup.tsx | projectLabel, versionName, isLocked | Yes |
| ValidationSummary | src/components/feedback/ValidationSummary.tsx | isOpen, issues, onClose, onFocusIssue | Yes |
| DropTarget | src/builder/dropzones/DropTarget.tsx | zone, versionId, className | Yes |
| LightRays | src/ui/BuilderBg/LightRays.tsx | raysOrigin, raysColor, raysSpeed, ... | Yes |

---

## Move Risk Assessment

| Component | Can be moved? | Reason |
|---|---|---|
| **Islands** | | |
| BuilderIslandShell | Yes — with care | Pure layout shell. Depends on useTheme but that's a shared hook. |
| HeaderBrandIsland | Yes | No context deps, uses only useTheme. |
| HeaderUserIsland | No — fragile | Reads saveStatus from builderStore and setThemeMode from appStore. Depends on useAutosave. |
| MetadataIsland | Yes | All data via props. No context coupling. Uses useTheme + useQueryClient. |
| EditorViewerIsland | No | Tightly coupled to StageContext (nodes, focusedNodeId) and builderStore (sessions, draft). 7 internal hooks. |
| FocusIsland | No | Reads nodes + selectedNodeIds from StageContext. |
| KanbanBuilderIsland | Yes — with care | All data via props. Uses useBuilderActions for node creation. |
| SelectionIsland | No | Reads nodes, selectedNodeIds, expandedNodeIds from StageContext. |
| TimelineBuilderIsland | No | Reads activeWeek, nodes from StageContext. |
| ViewHelperIsland | No | Reads nodes, view from StageContext. |
| **Stage Views** | | |
| StageCore | No | Central view orchestration, heavily coupled to StageContext. |
| KanbanView | No | Reads nodes, selectedNodeIds, expandedNodeIds from StageContext. |
| WeeklyView | Yes | Pure layout — DayGridCard receives all data via props. |
| MonthlyView | No — uses StageContext | Reads nodes, totalWeeks from StageContext. |
| MatrixTimelineView | Yes | All data via props. |
| SmokeStage | No | Reads nodes, selectedNodeIds, focusedNodeId, expandedNodeIds from StageContext. |
| **Card Templates** | | |
| CardShell | Yes | Reads card-level state, no direct context coupling in the component itself. |
| PhaseCard | Yes — with care | Wrapped in card's behavior hooks. Can be extracted with its hooks. |
| ActionCard | Yes — with care | Same as PhaseCard. |
| TaskCard | Yes — with care | Same as above. |
| DayCard | Yes | Standalone template, no context coupling. |
| **UI Atoms** | | |
| All ui/ atoms | Yes | No context deps. Safe to move. |
| **Forms** | | |
| All forms/ components | Yes | Pure inputs. Receive all data via props. |
| **Auth** | | |
| RouteGuard | Yes | Uses react-query standalone. |
| LoginRedirect, NoAccessScreen | Yes | Pure presentational. |

### Summary

| Risk level | Count | Examples |
|---|---|---|
| Safe to move | ~35 | All ui/ atoms, forms, feedback, buttons, DividerLine, LockBadge, StatusBadge, GlassSurface, HeaderBrandIsland, CampaignDetailsGroup |
| Move with care | ~8 | BuilderIslandShell, MetadataIsland, KanbanBuilderIsland, PhaseCard, ActionCard, TaskCard, WeeklyView |
| Not safe to move | ~20 | Any component using StageContext directly: EditorViewerIsland, FocusIsland, SelectionIsland, all Stage views, ViewHelperIsland, TimelineBuilderIsland |

---

## Key Findings

1. **StageContext is the central coupling point**: 40+ files depend on `useStageContext()`. Any move or split of StageProvider affects the entire builder.

2. **2 store layers**: `builderStore` (zustand — mutations + sessions) and `StageContext` (React context — view state + selection). Components that read both are the hardest to extract.

3. **~35 leaf atoms** safe to extract immediately — all in `src/ui/`, `src/components/forms/`, `src/components/elements/buttons/`, and some `src/components/feedback/`.

4. **~8 components moveable with care** — they have no context dependencies but may import from barrel files or use shared hooks.

5. **~20 components not safe to move** — all are StageContext consumers. P2 cannot extract these without first untangling StageContext or making it an optional dependency.

6. **CardShell is surprisingly decoupled** — despite being the visual chassis for all cards, it uses `useCardBehavior` (which wraps `useBuilderActions`) rather than StageContext directly.
