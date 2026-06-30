# FE2-R2 — State + Hook Pattern Analysis
Date: 2026-06-26 | Agent: opencode

## Session Environment
Same as FE2-R1 (parallel sprint):
- repository_version: v0.3.2
- code_index: fresh (regenerated same session)
- All gates available

## 3 — useState summary

- Total useState calls: **150** (was 131 pre-P1, delta: **+19**)

| # | File | useState calls |
|---|------|---------------|
| 14 | `src/builder/stage/StageProvider.tsx` | 14 |
| 6 | `src/builder/islands/EditorViewerIsland/useEditorPanel.ts` | 6 |
| 6 | `src/builder/islands/EditorViewerIsland/TaskEditor/RoutingDirectorySection.tsx` | 6 |
| 5 | `src/ui/forms/date/useDatePickerState.ts` | 5 |
| 4 | `src/builder/ui/forms/channel/ChannelCompositionSelect.tsx` | 4 |
| 4 | `src/builder/stage/views/useKanbanInteraction.ts` | 4 |
| 4 | `src/builder/stage/useDragState.ts` | 4 |
| 4 | `src/builder/stage/StageCore.tsx` | 4 |
| 4 | `src/builder/islands/TaskCreationFlow/useTaskCreationFlow.ts` | 4 |
| 4 | `src/builder/islands/MetadataIsland/MetadataIsland.tsx` | 4 |
| 4 | `src/builder/islands/FocusIsland/FocusIsland.tsx` | 4 |
| 4 | `src/builder/import/useImport.ts` | 4 |
| 3 | `src/builder/stage/views/useWeeklyView.ts` | 3 |
| 3 | `src/builder/stage/views/useMatrixTimeline.ts` | 3 |
| 3 | `src/builder/stage/views/TimelineHourCell.tsx` | 3 |
| 3 | `src/builder/stage/views/DayTaskCreator.tsx` | 3 |
| 3 | `src/builder/stage/useWeekState.ts` | 3 |
| 3 | `src/builder/islands/TemplatePopup/TemplatePopup.tsx` | 3 |
| 3 | `src/builder/islands/TaskCreationFlow/CreateCompositionForm.tsx` | 3 |
| 3 | `src/builder/islands/AIChatPopup/AIChatPopup.tsx` | 3 |
| 3 | `src/builder/cards/CardShell.tsx` | 3 |
| 2 | `src/ui/forms/selects/SearchableSelectIcons.tsx` | 2 |
| 2 | `src/ui/forms/selects/SearchableSelect.tsx` | 2 |
| 2 | `src/ui/forms/selects/CompletionStateSelect.tsx` | 2 |
| 2 | `src/ui/forms/inputs/TextInputInline.tsx` | 2 |
| 2 | `src/ui/forms/inputs/ListInputLines.tsx` | 2 |
| 2 | `src/ui/forms/date/CommunicationDateField.tsx` | 2 |
| 2 | `src/ui/BuilderBg/LightRays.tsx` | 2 |
| 2 | `src/hooks/useToggle.ts` | 2 |
| 2 | `src/builder/ui/modals/quick-edit/QuickEditPopover.tsx` | 2 |
| 2 | `src/builder/ui/forms/channel/InlineChannelCompositionSelector.tsx` | 2 |
| 2 | `src/builder/stage/views/useDayGridDrag.ts` | 2 |
| 2 | `src/builder/stage/views/TaskDropZone.tsx` | 2 |
| 2 | `src/builder/stage/views/PhaseDropZone.tsx` | 2 |
| 2 | `src/builder/stage/views/KanbanView.tsx` | 2 |
| 2 | `src/builder/stage/views/ActionDropZone.tsx` | 2 |
| 2 | `src/builder/stage/useStageMovement.ts` | 2 |
| 2 | `src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx` | 2 |
| 2 | `src/builder/islands/MetadataIsland/useFilePreview.ts` | 2 |
| 2 | `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx` | 2 |
| 2 | `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` | 2 |
| 2 | `src/builder/islands/FocusIsland/options/PropertyOption/PropertyOption.tsx` | 2 |
| 2 | `src/builder/islands/EditorViewerIsland/useEditorDraft.ts` | 2 |
| 2 | `src/builder/dropzones/DropTarget.tsx` | 2 |
| 2 | `src/builder/cards/useCardDrag.ts` | 2 |
| 2 | `src/builder/cards/templates/task/task-properties/TaskProperties.tsx` | 2 |
| 2 | `src/builder/cards/templates/task/TaskReadOnlyPopup.tsx` | 2 |
| 2 | `src/builder/cards/templates/task/TaskCard.tsx` | 2 |
| 2 | `src/builder/cards/templates/phase/usePhaseCard.ts` | 2 |
| 2 | `src/builder/cards/templates/action/useActionCard.ts` | 2 |
| 1 | `src/builder/stage/views/useDayGridCard.ts` | 1 |
| 1 | `src/builder/islands/TaskCreationFlow/TaskCreationFlow.tsx` | 1 |

**Total: 51 files with useState calls**

## 4 — Context inventory

| Context file | Export count | Too large? |
|-------------|-------------|------------|
| `src/builder/stage/StageProvider.tsx` | 18 | Yes (10+) |

**Total context definitions: 1**

Note: Script counts exports in the context file, not individual context values.
FE-R2 pre-P1 reported 28 context values. The current file has 18 exports — partially slimmed via P1/P3
but still too large. Drag state was not extracted into a separate context as planned.

## 5 — Custom hook inventory

- **Total custom hooks: 38**

**Folder distribution:**
| Folder | Hooks |
|--------|-------|
| `src/hooks/` | 5 (useAutosave, usePermissions, usePreferences, useTheme, useToggle) |
| `src/builder/cards/` | 5 (useCardBehavior, useCardEffects, useCardDrag, usePhaseCard, useActionCard) |
| `src/builder/stage/` | 4 (useWeekState, useStageExpansion, useDragState, useStageMovement) |
| `src/builder/stage/views/` | 6 (useWeeklyView, useDayGridDrag, useKanbanInteraction, useDayGridCard, useMatrixTimeline) |
| `src/builder/islands/` | 11 (EditorViewer: 7, Selection: 1, Metadata: 1, TaskCreation: 1, ViewHelper: 2) |
| `src/builder/dropzones/` | 1 (useDropzones) |
| `src/builder/focus/` | 1 (useFocus) |
| `src/builder/import/` | 1 (useImport) |
| `src/actions/` | 1 (useBuilderActions) |
| `src/ui/forms/` | 1 (useDatePickerState) |
| `src/ui/motion/` | 1 (useEffect) |
| `src/queries/` | 1 (users.queries — hook-like but a query file) |

**Usage classification:**
| Hook | Tag |
|------|-----|
| `useTheme` | shared (3+) |
| `useToggle` | shared (3+) |
| `useBuilderActions` | shared (3+) |
| `useCardBehavior` | shared (3+) |
| `useEffect` (ui/motion) | shared (3+) |
| `useAutosave` | used in 2 |
| `useDropzones` | used in 2 |
| `useCardEffects` | used in 2 |
| `useViewHelper` | used in 2 |
| `useFilePreview` | used in 2 |
| `useDatePickerState` | single-owner |
| `useCardDrag` | single-owner |
| `usePhaseCard` | single-owner |
| `useActionCard` | single-owner |
| `useViewHelperScrollers` | single-owner |
| `useEditorGuard` | single-owner |
| `useDayEditorTasks` | single-owner |
| `useEditorReadiness` | single-owner |
| `useEditorDraft` | single-owner |
| `useEditorPanel` | single-owner |
| `useTaskSectionReadiness` | single-owner |
| `usePresentationMode` | single-owner |
| `useTaskCreationFlow` | single-owner |
| `useWeekState` | single-owner |
| `useStageExpansion` | single-owner |
| `useDragState` | single-owner |
| `useStageMovement` | single-owner |
| `useTaskReschedule` | single-owner |
| `useWeeklyView` | single-owner |
| `useDayGridDrag` | single-owner |
| `useKanbanInteraction` | single-owner |
| `useDayGridCard` | single-owner |
| `useMatrixTimeline` | single-owner |
| `useImport` | single-owner |
| `usePreferences` | UNUSED |
| `usePermissions` | UNUSED |
| `useFocus` | UNUSED |
| `users.queries` | UNUSED |

## 6 — ESLint hook violations

Files with `react-hooks` warnings:

- `src/ui/forms/selects/SearchableSelectIcons.tsx:28,39` — set-state-in-effect
- `src/ui/forms/selects/SearchableSelect.tsx:49` — static-components
- `src/ui/forms/date/DatePickerToggle.tsx:13` — static-components
- `src/builder/stage/StageEdgeNavigation.tsx:62` — set-state-in-effect
- `src/builder/stage/views/KanbanHiddenDropzones.tsx:37:6` — exhaustive-deps (missing: expandedNodeIds)
- `src/builder/islands/EditorViewerIsland/useEditorDraft.ts:103` — set-state-in-effect
- `src/builder/islands/EditorViewerIsland/useEditorDraft.ts:109:6` — exhaustive-deps (missing: activeTaskId)
- `src/builder/stage/views/DayTaskCreator.tsx:63:6` — exhaustive-deps (missing: getTasksForWeek, getTasksWithVal)
- `src/ui/forms/inputs/TextInputInline.tsx:88` — set-state-in-effect
- `src/builder/stage/views/useDayGridDrag.ts:114:6` — exhaustive-deps (missing: getTasksForWeek, getTasksWithVal)
- `src/ui/forms/inputs/ListInputLines.tsx:59` — set-state-in-effect
- `src/builder/stage/views/DayGridCard.tsx:38:8` — exhaustive-deps (unnecessary dependency: composition)
- `src/ui/forms/date/DatePickerPopup.tsx:71,86` — immutability warnings
- `src/builder/stage/views/timeline.helpers.ts:99` — set-state-in-effect
- `src/builder/islands/SelectionIsland/usePresentationMode.ts:153:5` — exhaustive-deps (missing: enterPresentationMode, exitPresentationMode)
- `src/builder/cards/useCardBehavior.tsx:25,43` — set-state-in-effect
- `src/builder/cards/useCardDrag.ts:26` — set-state-in-effect
- `src/builder/cards/templates/phase/usePhaseCard.ts:45` — set-state-in-effect
- `src/builder/cards/templates/phase/PhaseDropZone.tsx:26` — refs warning
- `src/builder/stage/useStageExpansion.ts:24` — set-state-in-effect
- `src/builder/ui/forms/channel/ChannelCompositionFields.tsx:37` — set-state-in-effect
- `src/builder/islands/TaskCreationFlow/CreateCompositionForm.tsx:63` — static-components
- `src/builder/stage/StageProvider.tsx:33` — set-state-in-effect
- `src/builder/stage/StageEdgeNavigation.tsx:26` — set-state-in-effect
- `src/builder/stage/StageCore.tsx:14:23` — exhaustive-deps (unknown function dependencies)

## 7 — Editor hook merge status

**Status: NOT merged — 3 hooks still exist as separate files**

| Hook | File | Imported by |
|------|------|-------------|
| `useEditorPanel` | EditorViewerIsland/useEditorPanel.ts | EditorViewerIsland.tsx (line 16) |
| `useEditorDraft` | EditorViewerIsland/useEditorDraft.ts | EditorViewerIsland.tsx (line 6) |
| `useEditorGuard` | EditorViewerIsland/useEditorGuard.ts | EditorViewerIsland.tsx (line 7) |

All 3 hooks are consumed exclusively by `EditorViewerIsland.tsx` — the merge into `useEditorState` (recommended by FE-R3) was NOT executed in P1.

## Delta from expired FE-R2

| Dimension | FE-R2 (pre-P1) | FE2-R2 (post-P1) | Δ |
|-----------|---------------|-------------------|---|
| useState calls | 131 | 150 | +19 |
| Context definitions | 1 (StageProvider) | 1 (StageProvider) | 0 |
| StageProvider exports (script) | 28 values (manual) | 18 exports (scripted) | not directly comparable |
| Custom hooks | ~35 (manual estimate) | 38 (scripted) | +3 |
| Editor hooks merged? | N/A | No (still 3 files) | merge not executed |
| ESLint react-hooks violations | not measured | 25+ | baseline established |

## Risks for folder-structure-v2 P2/P3

1. **StageProvider.tsx is too large** — 14 useState + 18 exports. Still the single largest context. Drag state was NOT extracted as planned. This blocks any refactor that needs to move context consumers.
2. **Editor hooks not merged** — FE-R3 recommended merging useEditorPanel/Draft/Guard into useEditorState. P1 skipped it. All 3 are single-owner and co-located — low-risk merge candidate for P2.
3. **21 single-owner hooks** — These are coupled to their parent component and cannot be extracted without moving the component. They block folder moves.
4. **usePreferences and usePermissions appear UNUSED** — may have been inlined or dead code. Investigate before P3.
5. **useFocus is UNUSED** — focus engine may have been refactored. Check if focus.engine.ts is still necessary.
6. **StageCore.tsx:14 exhaustive-deps with "unknown function dependencies"** — This is a severe lint finding. useEffect receives a function reference whose deps can't be tracked, risking stale closures.
7. **Multiple set-state-in-effect violations in card hooks** (useCardBehavior, useCardDrag, usePhaseCard) — these cause double-renders and could cause infinite loops under React 18 Strict Mode.
8. **Missing dependencies in useDayGridDrag and DayTaskCreator** (getTasksForWeek, getTasksWithVal) — these are stale closure bugs, not just lint noise.
9. **StageContext has only 1 consumer for most values** — The "too large" problem isn't just about count, but about coupling. Any component subscribing to StageContext is re-rendered on every context update.
