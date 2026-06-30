---
sprint: FP-R3
agent: Codex (GPT-5, OpenAI)
date: 2026-06-28
status: complete
source-sprint: FP-R3-modularization-audit
source-edits: none
---

# FP-R3 — Modularization & File-Size Audit

## Verdict

FP-R3 is complete as a read-only discovery sprint. No `src/` files were changed.

The implementation handoff should treat this as a bounded modularization sprint, not a redesign:
one file is over the hard cap and must be handled before implementation work claims clean file-size
governance. Twenty-seven more files are above target but below hard cap; split these only when they
are already touched for the polish implementation.

## Summary Metrics

| Metric | Count |
|---|---:|
| Files measured | 187 |
| Over hard cap | 1 |
| Over target only | 27 |
| Within target/cap | 159 |
| Homepage/version route files over target | 0 |
| Builder/page/shared UI files with source edits in this sprint | 0 |

## Cap Rules Used

| Kind | Target | Hard cap |
|---|---:|---:|
| React component (`.tsx`) | 150 | 250 |
| Custom hook (`use*.ts`) | 120 | 200 |
| Actions / service / rules / helper TS | 150 | 250 |
| Registry / config | 200 | 400 |

Tests were measured because they are under `src/builder/**`, but no test file is over target.

## Mandatory Split Candidate

| File | Lines | Cap | Risk | Concrete split proposal | Boundary |
|---|---:|---:|---|---|---|
| `src/builder/islands/EditorViewerIsland/useEditorState.ts` | 375 | 120/200 | High churn; this is the merged editor state hook from folder-structure-v2 P3 and is consumed by `EditorViewerIsland.tsx` + `useEditorReadiness.ts`. | Split inside `src/builder/islands/EditorViewerIsland/` into focused hooks/helpers: `editorNode.helpers.ts` for `DayNode`, `findEditorNode`, `getInitialDraft`; `useEditorDraftState.ts` for reducer, `updateDraftField`, `updateDraftNestedField`, save/discard draft state; `useEditorSessionState.ts` for session open/minimize/close/discard; keep `useEditorState.ts` as the orchestration facade exporting the same public shape. | Preserve Builder island/editor boundary. Do not promote editor behavior to `src/ui` or `StageProvider`. |

Implementation note: do not undo the folder-structure-v2 merge by recreating the old
`useEditorPanel.ts`, `useEditorDraft.ts`, and `useEditorGuard.ts` names. Extract smaller internals while
keeping the public `useEditorState()` seam.

## Target-Only Split Candidates

These are below hard cap, so they should not block FP-R5. Use them as scoped cleanup when the same file
is already being edited for `change-component` or `wire-mockup-data`.

| File | Lines | Cap | Proposal |
|---|---:|---:|---|
| `src/builder/stage/views/DayGridCard.tsx` | 248 | 150/250 | Extract header/action cluster into `DayGridCardHeader.tsx`; keep existing `DayGridCardCollapsed.tsx`, `DayGridCardEmpty.tsx`, `useDayGridCard.ts`, and `useDayGridDrag.ts`. |
| `src/builder/ui/forms/channel/ChannelCompositionSelect.tsx` | 239 | 150/250 | Extract searchable result list/empty state to co-located `ChannelCompositionOptions.tsx`; keep domain control under `src/builder/ui/forms/channel/`. |
| `src/builder/cards/handleCardDrop.ts` | 239 | 150/250 | Split pure lookup/validation helpers into `cardDropResolution.helpers.ts`; keep mutation command in builder cards boundary. |
| `src/builder/ui/modals/readiness-check-modal/ReadinessCheckContent.tsx` | 237 | 150/250 | Extract readiness group/list rows to co-located presentation components; keep modal orchestration in existing modal folder. |
| `src/builder/islands/FocusIsland/options/PropertyOption/PropertyOption.tsx` | 235 | 150/250 | Extract property value list and trigger button; keep FocusIsland option components under `FocusIsland/options/`. |
| `src/builder/islands/FocusIsland/FocusIsland.tsx` | 233 | 150/250 | Extract filter-state helpers to `useFocusFilters.ts` and compact expanded body to `FocusIslandPanel.tsx`; keep local island state local. |
| `src/ui/BuilderBg/LightRays.tsx` | 217 | 150/250 | Extract color parsing and canvas draw helpers inside `src/ui/BuilderBg/`; do not move builder background into feature code. |
| `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` | 210 | 150/250 | Extract drag shell/render branches to `EditorIslandDropShell.tsx`; keep `BuilderIslandShell` usage. |
| `src/builder/cards/templates/task/TaskCard.tsx` | 209 | 150/250 | Extract visual body and interaction affordances to co-located `TaskCardBody.tsx`; retain `useCardBehavior()` boundary. |
| `src/builder/cards/templates/phase/PhaseCard.tsx` | 208 | 150/250 | Extract header/footer/body sections; keep phase template in card template home. |
| `src/builder/import/import.helpers.ts` | 206 | 150/250 | Split parser/normalizer/validation helpers into co-located helper files under `src/builder/import/`; no service imports. |
| `src/builder/islands/MetadataIsland/StatusDropdownBadge.tsx` | 204 | 150/250 | Extract dropdown option row/list and status presentation mapping; keep badge in MetadataIsland folder. |
| `src/builder/islands/EditorViewerIsland/EditorHeader.tsx` | 204 | 150/250 | Extract session controls and composition selector slot; keep editor header in EditorViewerIsland folder. |
| `src/builder/islands/MetadataIsland/MetadataIsland.tsx` | 198 | 150/250 | Extract header grouping/launch window row if touched; reuse `MetadataDetailsContent` and `MetadataModalsContainer`. |
| `src/builder/ui/forms/channel/InlineChannelCompositionSelector.tsx` | 190 | 150/250 | Share option-row/list logic with `ChannelCompositionSelect` only through builder-channel co-located helpers, not generic `src/ui`. |
| `src/builder/stage/StageProvider.tsx` | 188 | 150/250 | Do not redesign provider. If touched, extract pure reducer/helper functions, leaving context contract unchanged. |
| `src/builder/BuilderPage.tsx` | 183 | 150/250 | Do not alter frozen three-row layout. Extract shell constants or island arrays only if needed. |
| `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` | 180 | 150/250 | Extract sticky popup content/body; keep `StickyPopupShell` reuse. |
| `src/builder/stage/StageCore.tsx` | 174 | 150/250 | Extract view switch/render helper; do not change stage grid or layout contract. |
| `src/builder/cards/useCardDrag.ts` | 174 | 120/200 | Extract drag payload creation helpers; keep hook public API stable. |
| `src/builder/islands/EditorViewerIsland/TaskEditor/RoutingDirectorySection.tsx` | 166 | 150/250 | Extract sender/receiver field row component; this also supports FP-R0 truncation fix. |
| `src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx` | 160 | 150/250 | Extract action cluster/menu trigger area; keep theme/save/avatar semantics. |
| `src/builder/ui/forms/subtask/QuickSubtaskForm.tsx` | 159 | 150/250 | Extract field group or action footer; keep subtask form home. |
| `src/builder/stage/views/timeline.helpers.ts` | 157 | 150/250 | Split date math from positioning helpers within `stage/views/`. |
| `src/builder/ui/modals/ImportPreviewModal.tsx` | 155 | 150/250 | Extract preview row/table body; keep modal in builder UI modal home. |
| `src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx` | 152 | 150/250 | Barely over target; defer unless already touching. Extract popup content only if needed. |
| `src/builder/stage/views/useMatrixTimeline.ts` | 136 | 120/200 | Hook target-only; extract pure matrix calculations into helper if touched. |

## Churn-Risk / Extract-Only Files

These files are historically hot. Implementation sprints should extract only, preserve public seams,
and avoid redesigning behavior or layout.

| File / cluster | Evidence | Rule for implementation |
|---|---|---|
| `src/builder/islands/EditorViewerIsland/useEditorState.ts` | folder-structure-v2 P3 merged old editor hooks into this file; completed output-review recorded 375 lines as accepted for that sprint; FE2 also previously targeted editor hook consolidation. | Split internals only; keep `useEditorState()` public return contract and avoid resurrecting deleted hook names. |
| `src/builder/islands/EditorViewerIsland/*` | Multiple completed plans mention editor panel, editor draft, editor guard, `any` cleanup, session pill, routing fields, and FP-R0 editor behavior gaps. | Treat as highest-risk cluster. Use narrow component/hook extraction and browser verification in implementation. |
| `src/builder/BuilderPage.tsx`, `src/builder/stage/StageCore.tsx`, `src/builder/stage/StageProvider.tsx` | Builder layout contract is frozen; prior plans explicitly warned against layout churn. | Do not redesign row/grid structure; only extract constants/helpers if needed for a scoped bug. |
| `src/builder/stage/views/DayGridCard.tsx` | Prior builder-refactor `FIX-CAP` targeted this file; FP-R0 found drag/drop and disabled-gradient behavior around day cards. | Extract header/body only; preserve existing hook and collapsed/empty components. |
| `src/builder/islands/MetadataIsland/*` | Prior B-FIL/FIX-FIL work added file preview and metadata popups; FP-R0/FP-R1 found token/theme issues here. | Keep metadata-specific logic in MetadataIsland; do not promote to generic UI. |
| `src/builder/islands/FocusIsland/*` | Prior B0 moved focus expansion state out of StageProvider; FP-R0 found panel behavior unclear. | Keep focus state local; do not move island state back into StageProvider. |
| `src/builder/ui/forms/channel/*` | Backend-discovery and FP-R0/FP-R2 reference channel composition wiring and visual/token debt. | Keep channel/domain controls in builder UI form home; reuse existing `Select` and popover shells. |

## Reuse / Duplication Map

`code-query.sh duplicate-controls` found duplicate-looking controls, but most are legitimate domain
adapters. Reuse guidance for implementation:

| Area | Current reusable home | Finding | Handoff |
|---|---|---|---|
| Button primitives | `src/ui/shadcn/button.tsx`, builder-specific wrappers in `src/builder/ui/buttons/` | Button-like wrappers exist: `SelectionButtons`, `InlineIslandButton`, `IslandToggleButton`, `MenuSectionButton`. | Do not create a new button primitive. Use builder wrappers for island/action controls. |
| Text/input fields | `src/ui/atoms/Input.tsx`, `ListInputLines`, `SpecsInput` | `Input` has 7 consumers, mainly editor fields. | Editor field polish should reuse `Input`; no new raw input primitive. |
| Select controls | `src/ui/forms/selects/Select.tsx`, `CompletionStateSelect`, builder channel controls | Channel composition controls are domain-specific and consumed by task/editor flows. | Reuse generic `Select` inside channel controls where possible; keep domain selectors in `src/builder/ui/forms/channel/`. |
| Toggle/tab groups | `src/ui/atoms/ToggleGroup.tsx` | `ToggleGroup` consumed by `PhaseEditorSection` and `ViewTabSwitcher`. | New tabs/toggles in builder should reuse this atom, not ad hoc buttons. |
| Island shells | `BuilderIslandShell` | Used by EditorViewer, Focus, Selection. | New island polish should reuse shell and density tokens; no alternate island chassis. |
| Popups | `PopoverShell`, `StickyPopupShell` | PopoverShell has 3 consumers; StickyPopupShell has 7 usages in modals/popups. | Keep popup vs modal distinction; reuse these shells rather than adding new surface components. |
| Glass surfaces | `src/ui/surfaces/GlassSurface.tsx` | 3 consumers. | Component polish can adjust density through tokens/props, not new glass primitives. |

## Full File-Size Table

| File | Lines | Kind | Target/Hard | Status |
|---|---:|---|---:|---|
| `src/builder/BuilderErrorBoundary.tsx` | 69 | component | 150/250 | OK |
| `src/builder/BuilderLoadingShell.tsx` | 64 | component | 150/250 | OK |
| `src/builder/BuilderPage.tsx` | 183 | component | 150/250 | OVER TARGET |
| `src/builder/cards/CardShell.tsx` | 141 | component | 150/250 | OK |
| `src/builder/cards/CardShellContent.tsx` | 64 | component | 150/250 | OK |
| `src/builder/cards/__tests__/cardDrag.helpers.test.ts` | 101 | ts | 150/250 | OK |
| `src/builder/cards/__tests__/handleCardDrop.test.ts` | 147 | ts | 150/250 | OK |
| `src/builder/cards/__tests__/useCardEffects.test.ts` | 58 | hook | 120/200 | OK |
| `src/builder/cards/card.registry.ts` | 71 | registry/config | 200/400 | OK |
| `src/builder/cards/cardDrag.helpers.ts` | 100 | helper | 150/250 | OK |
| `src/builder/cards/cardSelection.helpers.ts` | 40 | helper | 150/250 | OK |
| `src/builder/cards/dragDropHelpers.ts` | 66 | ts | 150/250 | OK |
| `src/builder/cards/handleCardDrop.ts` | 239 | ts | 150/250 | OVER TARGET |
| `src/builder/cards/templates/action/ActionCard.tsx` | 120 | component | 150/250 | OK |
| `src/builder/cards/templates/action/ActionTaskList.tsx` | 45 | component | 150/250 | OK |
| `src/builder/cards/templates/action/useActionCard.ts` | 84 | hook | 120/200 | OK |
| `src/builder/cards/templates/phase/HorizontalTaskFlow.tsx` | 63 | component | 150/250 | OK |
| `src/builder/cards/templates/phase/PhaseCard.tsx` | 208 | component | 150/250 | OVER TARGET |
| `src/builder/cards/templates/phase/PhaseReadinessBadge.tsx` | 35 | component | 150/250 | OK |
| `src/builder/cards/templates/phase/TaskBentoGrid.tsx` | 61 | component | 150/250 | OK |
| `src/builder/cards/templates/phase/phase.icons.ts` | 10 | ts | 150/250 | OK |
| `src/builder/cards/templates/phase/usePhaseCard.ts` | 87 | hook | 120/200 | OK |
| `src/builder/cards/templates/task/TaskCard.tsx` | 209 | component | 150/250 | OVER TARGET |
| `src/builder/cards/templates/task/TaskReadOnlyPopup.tsx` | 91 | component | 150/250 | OK |
| `src/builder/cards/templates/task/task-properties/ChannelPill.tsx` | 24 | component | 150/250 | OK |
| `src/builder/cards/templates/task/task-properties/TaskCardPopovers.tsx` | 99 | component | 150/250 | OK |
| `src/builder/cards/templates/task/task-properties/TaskProperties.tsx` | 148 | component | 150/250 | OK |
| `src/builder/cards/useCardBehavior.ts` | 59 | hook | 120/200 | OK |
| `src/builder/cards/useCardDrag.ts` | 174 | hook | 120/200 | OVER TARGET |
| `src/builder/cards/useCardEffects.ts` | 90 | hook | 120/200 | OK |
| `src/builder/dropzones/DropTarget.tsx` | 99 | component | 150/250 | OK |
| `src/builder/dropzones/dropzone.registry.ts` | 83 | registry/config | 200/400 | OK |
| `src/builder/dropzones/useDropzones.ts` | 21 | hook | 120/200 | OK |
| `src/builder/import/__tests__/import.helpers.test.ts` | 36 | ts | 150/250 | OK |
| `src/builder/import/import.helpers.ts` | 206 | helper | 150/250 | OVER TARGET |
| `src/builder/import/useImport.ts` | 88 | hook | 120/200 | OK |
| `src/builder/islands/AIChatPopup/AIChatPopup.tsx` | 68 | component | 150/250 | OK |
| `src/builder/islands/BuilderIslandShell.tsx` | 108 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/ActionEditorSection.tsx` | 25 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/DayEditorSection.tsx` | 75 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/DiscardSessionModal.tsx` | 51 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/EditorHeader.tsx` | 204 | component | 150/250 | OVER TARGET |
| `src/builder/islands/EditorViewerIsland/EditorSessionPill.tsx` | 29 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` | 210 | component | 150/250 | OVER TARGET |
| `src/builder/islands/EditorViewerIsland/PhaseEditorSection.tsx` | 35 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/TaskEditor/RoutingDirectorySection.tsx` | 166 | component | 150/250 | OVER TARGET |
| `src/builder/islands/EditorViewerIsland/TaskEditor/TaskEditor.tsx` | 42 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/TaskEditor/TaskSection1.tsx` | 38 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/TaskEditor/TaskSection3.tsx` | 139 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/TaskEditor/TaskSection4.tsx` | 24 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/UnsavedChangesModal.tsx` | 65 | component | 150/250 | OK |
| `src/builder/islands/EditorViewerIsland/useDayEditorTasks.ts` | 28 | hook | 120/200 | OK |
| `src/builder/islands/EditorViewerIsland/useEditorReadiness.ts` | 41 | hook | 120/200 | OK |
| `src/builder/islands/EditorViewerIsland/useEditorState.ts` | 375 | hook | 120/200 | OVER HARD |
| `src/builder/islands/EditorViewerIsland/useTaskSectionReadiness.ts` | 44 | hook | 120/200 | OK |
| `src/builder/islands/FocusIsland/FocusIsland.tsx` | 233 | component | 150/250 | OVER TARGET |
| `src/builder/islands/FocusIsland/options/PropertyOption/PropertyOption.tsx` | 235 | component | 150/250 | OVER TARGET |
| `src/builder/islands/FocusIsland/options/WeekOption/WeekOption.tsx` | 149 | component | 150/250 | OK |
| `src/builder/islands/HeaderBrandIsland.tsx` | 42 | component | 150/250 | OK |
| `src/builder/islands/HeaderUserIsland/HeaderUserActionsMenu.tsx` | 126 | component | 150/250 | OK |
| `src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx` | 160 | component | 150/250 | OVER TARGET |
| `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` | 180 | component | 150/250 | OVER TARGET |
| `src/builder/islands/MetadataIsland/CampaignDetailsGroup.tsx` | 32 | component | 150/250 | OK |
| `src/builder/islands/MetadataIsland/MetadataDetailsContent.tsx` | 113 | component | 150/250 | OK |
| `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx` | 115 | component | 150/250 | OK |
| `src/builder/islands/MetadataIsland/MetadataIsland.tsx` | 198 | component | 150/250 | OVER TARGET |
| `src/builder/islands/MetadataIsland/MetadataModalsContainer.tsx` | 111 | component | 150/250 | OK |
| `src/builder/islands/MetadataIsland/StatusDropdownBadge.tsx` | 204 | component | 150/250 | OVER TARGET |
| `src/builder/islands/MetadataIsland/ViewTabSwitcher.tsx` | 26 | component | 150/250 | OK |
| `src/builder/islands/MetadataIsland/useFilePreview.ts` | 52 | hook | 120/200 | OK |
| `src/builder/islands/PreviewReviewModal/ReviewModal.tsx` | 37 | component | 150/250 | OK |
| `src/builder/islands/SelectionIsland/DeleteConfirmation.tsx` | 44 | component | 150/250 | OK |
| `src/builder/islands/SelectionIsland/SelectionButtons.tsx` | 97 | component | 150/250 | OK |
| `src/builder/islands/SelectionIsland/SelectionIsland.tsx` | 141 | component | 150/250 | OK |
| `src/builder/islands/SelectionIsland/SelectionLabel.tsx` | 80 | component | 150/250 | OK |
| `src/builder/islands/SelectionIsland/selection.utils.ts` | 21 | helper | 150/250 | OK |
| `src/builder/islands/SelectionIsland/usePresentationMode.ts` | 21 | hook | 120/200 | OK |
| `src/builder/islands/TaskCreationFlow/CreateCompositionForm.tsx` | 48 | component | 150/250 | OK |
| `src/builder/islands/TaskCreationFlow/Step1_SelectChannel.tsx` | 32 | component | 150/250 | OK |
| `src/builder/islands/TaskCreationFlow/Step2_SelectComposition.tsx` | 51 | component | 150/250 | OK |
| `src/builder/islands/TaskCreationFlow/Step3_ReviewSubtasks.tsx` | 43 | component | 150/250 | OK |
| `src/builder/islands/TaskCreationFlow/TaskCreationFlow.tsx` | 102 | component | 150/250 | OK |
| `src/builder/islands/TaskCreationFlow/useTaskCreationFlow.ts` | 53 | hook | 120/200 | OK |
| `src/builder/islands/TemplatePopup/TemplatePopup.tsx` | 69 | component | 150/250 | OK |
| `src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx` | 152 | component | 150/250 | OVER TARGET |
| `src/builder/islands/ViewHelperIsland/ViewContextTaskItem.tsx` | 66 | component | 150/250 | OK |
| `src/builder/islands/ViewHelperIsland/ViewContextTaskList.tsx` | 108 | component | 150/250 | OK |
| `src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx` | 103 | component | 150/250 | OK |
| `src/builder/islands/ViewHelperIsland/useViewHelper.ts` | 11 | hook | 120/200 | OK |
| `src/builder/islands/ViewHelperIsland/useViewHelperScrollers.ts` | 24 | hook | 120/200 | OK |
| `src/builder/islands/island.registry.ts` | 40 | registry/config | 200/400 | OK |
| `src/builder/shared/channel.icons.ts` | 25 | ts | 150/250 | OK |
| `src/builder/stage/StageCore.tsx` | 174 | component | 150/250 | OVER TARGET |
| `src/builder/stage/StageEdgeNavigation.tsx` | 53 | component | 150/250 | OK |
| `src/builder/stage/StageLayoutContract.ts` | 36 | ts | 150/250 | OK |
| `src/builder/stage/StageProvider.tsx` | 188 | component | 150/250 | OVER TARGET |
| `src/builder/stage/stage.registry.ts` | 45 | registry/config | 200/400 | OK |
| `src/builder/stage/stageContext.types.ts` | 44 | ts | 150/250 | OK |
| `src/builder/stage/useDragState.ts` | 34 | hook | 120/200 | OK |
| `src/builder/stage/useStageExpansion.ts` | 52 | hook | 120/200 | OK |
| `src/builder/stage/useStageMovement.ts` | 88 | hook | 120/200 | OK |
| `src/builder/stage/useTaskReschedule.ts` | 32 | hook | 120/200 | OK |
| `src/builder/stage/useWeekState.ts` | 23 | hook | 120/200 | OK |
| `src/builder/stage/views/ActionDropZone.tsx` | 84 | component | 150/250 | OK |
| `src/builder/stage/views/DayGridCard.tsx` | 248 | component | 150/250 | OVER TARGET |
| `src/builder/stage/views/DayGridCardCollapsed.tsx` | 125 | component | 150/250 | OK |
| `src/builder/stage/views/DayGridCardEmpty.tsx` | 42 | component | 150/250 | OK |
| `src/builder/stage/views/DayTaskCreator.tsx` | 97 | component | 150/250 | OK |
| `src/builder/stage/views/KanbanHiddenDropzones.tsx` | 51 | component | 150/250 | OK |
| `src/builder/stage/views/KanbanView.tsx` | 143 | component | 150/250 | OK |
| `src/builder/stage/views/MatrixTimelineHeader.tsx` | 70 | component | 150/250 | OK |
| `src/builder/stage/views/MatrixTimelineView.tsx` | 118 | component | 150/250 | OK |
| `src/builder/stage/views/MonthlyView.tsx` | 104 | component | 150/250 | OK |
| `src/builder/stage/views/PhaseDropZone.tsx` | 100 | component | 150/250 | OK |
| `src/builder/stage/views/SmokeStage.tsx` | 45 | component | 150/250 | OK |
| `src/builder/stage/views/TaskDropZone.tsx` | 97 | component | 150/250 | OK |
| `src/builder/stage/views/TaskGridMarker.tsx` | 93 | component | 150/250 | OK |
| `src/builder/stage/views/TimelineCustomEdgeSensors.tsx` | 134 | component | 150/250 | OK |
| `src/builder/stage/views/TimelineHourCell.tsx` | 118 | component | 150/250 | OK |
| `src/builder/stage/views/TimelineView.tsx` | 19 | component | 150/250 | OK |
| `src/builder/stage/views/WeeklyView.tsx` | 94 | component | 150/250 | OK |
| `src/builder/stage/views/timeline.helpers.ts` | 157 | helper | 150/250 | OVER TARGET |
| `src/builder/stage/views/useDayGridCard.ts` | 114 | hook | 120/200 | OK |
| `src/builder/stage/views/useDayGridDrag.ts` | 87 | hook | 120/200 | OK |
| `src/builder/stage/views/useKanbanInteraction.ts` | 100 | hook | 120/200 | OK |
| `src/builder/stage/views/useMatrixTimeline.ts` | 136 | hook | 120/200 | OVER TARGET |
| `src/builder/stage/views/useWeeklyView.ts` | 102 | hook | 120/200 | OK |
| `src/builder/ui/buttons/InlineIslandButton.tsx` | 106 | component | 150/250 | OK |
| `src/builder/ui/buttons/IslandToggleButton.tsx` | 57 | component | 150/250 | OK |
| `src/builder/ui/buttons/MenuSections.tsx` | 47 | component | 150/250 | OK |
| `src/builder/ui/buttons/index.ts` | 9 | ts | 150/250 | OK |
| `src/builder/ui/feedback/AlertMark.tsx` | 19 | component | 150/250 | OK |
| `src/builder/ui/feedback/ReadyMark.tsx` | 19 | component | 150/250 | OK |
| `src/builder/ui/feedback/ValidationSummary.tsx` | 69 | component | 150/250 | OK |
| `src/builder/ui/forms/channel/ChannelCompositionFields.tsx` | 67 | component | 150/250 | OK |
| `src/builder/ui/forms/channel/ChannelCompositionSelect.tsx` | 239 | component | 150/250 | OVER TARGET |
| `src/builder/ui/forms/channel/CompositionLibraryModal.tsx` | 115 | component | 150/250 | OK |
| `src/builder/ui/forms/channel/InlineChannelCompositionSelector.tsx` | 190 | component | 150/250 | OVER TARGET |
| `src/builder/ui/forms/channel/RegistryDirectoryModal.tsx` | 85 | component | 150/250 | OK |
| `src/builder/ui/forms/channel/index.ts` | 3 | ts | 150/250 | OK |
| `src/builder/ui/forms/subtask/QuickSubtaskForm.tsx` | 159 | component | 150/250 | OVER TARGET |
| `src/builder/ui/forms/subtask/index.ts` | 1 | ts | 150/250 | OK |
| `src/builder/ui/modals/ApprovalConfirmModal.tsx` | 99 | component | 150/250 | OK |
| `src/builder/ui/modals/ImportPreviewModal.tsx` | 155 | component | 150/250 | OVER TARGET |
| `src/builder/ui/modals/quick-edit/QuickEditPopover.tsx` | 102 | component | 150/250 | OK |
| `src/builder/ui/modals/quick-edit/QuickEditTrigger.tsx` | 45 | component | 150/250 | OK |
| `src/builder/ui/modals/readiness-check-modal/ReadinessCheckContent.tsx` | 237 | component | 150/250 | OVER TARGET |
| `src/builder/ui/modals/readiness-check-modal/ReadinessCheckModal.tsx` | 55 | component | 150/250 | OK |
| `src/hooks/useAutosave.ts` | 45 | hook | 120/200 | OK |
| `src/hooks/useTheme.ts` | 18 | hook | 120/200 | OK |
| `src/hooks/useToggle.ts` | 10 | hook | 120/200 | OK |
| `src/pages/RootLayout.tsx` | 18 | component | 150/250 | OK |
| `src/pages/home/HomePage.tsx` | 9 | component | 150/250 | OK |
| `src/pages/version/VersionPage.tsx` | 16 | component | 150/250 | OK |
| `src/ui/BuilderBg/BuilderBg.tsx` | 30 | component | 150/250 | OK |
| `src/ui/BuilderBg/LightRays.tsx` | 217 | component | 150/250 | OVER TARGET |
| `src/ui/DividerLine.tsx` | 9 | component | 150/250 | OK |
| `src/ui/PopoverShell.tsx` | 30 | component | 150/250 | OK |
| `src/ui/StickyPopupShell.tsx` | 70 | component | 150/250 | OK |
| `src/ui/atoms/Badge.tsx` | 40 | component | 150/250 | OK |
| `src/ui/atoms/Chip.tsx` | 78 | component | 150/250 | OK |
| `src/ui/atoms/Input.tsx` | 84 | component | 150/250 | OK |
| `src/ui/atoms/ToggleGroup.tsx` | 55 | component | 150/250 | OK |
| `src/ui/atoms/index.ts` | 8 | ts | 150/250 | OK |
| `src/ui/auth/LoginRedirect.tsx` | 9 | component | 150/250 | OK |
| `src/ui/auth/NoAccessScreen.tsx` | 9 | component | 150/250 | OK |
| `src/ui/auth/RouteGuard.tsx` | 43 | component | 150/250 | OK |
| `src/ui/forms/date/CalendarGrid.tsx` | 90 | component | 150/250 | OK |
| `src/ui/forms/date/CommunicationDateField.tsx` | 118 | component | 150/250 | OK |
| `src/ui/forms/date/DatePickerPopup.tsx` | 89 | component | 150/250 | OK |
| `src/ui/forms/date/DatePickerToggle.tsx` | 47 | component | 150/250 | OK |
| `src/ui/forms/date/LinkedDateGrid.tsx` | 100 | component | 150/250 | OK |
| `src/ui/forms/date/date.utils.ts` | 64 | helper | 150/250 | OK |
| `src/ui/forms/date/index.ts` | 2 | ts | 150/250 | OK |
| `src/ui/forms/date/useDatePickerState.ts` | 48 | hook | 120/200 | OK |
| `src/ui/forms/inputs/ListInputLines.tsx` | 101 | component | 150/250 | OK |
| `src/ui/forms/inputs/SpecsInput.tsx` | 63 | component | 150/250 | OK |
| `src/ui/forms/inputs/index.ts` | 2 | ts | 150/250 | OK |
| `src/ui/forms/selects/CompletionStateSelect.tsx` | 115 | component | 150/250 | OK |
| `src/ui/forms/selects/Select.tsx` | 124 | component | 150/250 | OK |
| `src/ui/forms/selects/index.ts` | 2 | ts | 150/250 | OK |
| `src/ui/motion/EffectLayer.tsx` | 21 | component | 150/250 | OK |
| `src/ui/motion/effects.registry.ts` | 132 | registry/config | 200/400 | OK |
| `src/ui/motion/motion.config.ts` | 7 | registry/config | 200/400 | OK |
| `src/ui/motion/useEffect.ts` | 9 | hook | 120/200 | OK |
| `src/ui/shadcn/button.tsx` | 67 | component | 150/250 | OK |
| `src/ui/surfaces/GlassSurface.tsx` | 97 | component | 150/250 | OK |

## Verification

- Ran `bash scripts/agent/build-current-state.sh`.
- Ran `bash scripts/agent/verify-tooling-state.sh`; `verify.sh` passed.
- Ran `wc -l` across `src/builder`, `src/pages`, `src/ui`, and `src/hooks`.
- Ran `bash scripts/agent/code-query.sh duplicate-controls`.
- Ran `bash scripts/agent/code-query.sh raw-controls`.
- Ran `bash scripts/agent/code-query.sh consumers` for shell/control reuse checks.
- Ran `bash scripts/agent/code-query.sh affected` for high-risk split candidates.
- No `src/` files were edited.
