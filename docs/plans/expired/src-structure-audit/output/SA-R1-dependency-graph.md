# SA-R1: Dependency Graph

_Generated: 2026-06-25 | ts-morph via scripts/gen-dep-graph.ts_

## Folder Import Matrix

| From ↓ imports From → | actions | brand | builder | components | hooks | mock | pages | queries | rules | services | store | telemetry | types | ui | utils |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| actions | — |  |  |  |  |  |  |  |  | ✓ | ✓ |  | ✓ |  | ✓ |
| brand |  | — |  |  |  |  |  |  |  |  |  |  |  |  |  |
| builder | ✓ | ✓ | — | ✓ | ✓ |  |  | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ | ✓ |
| components |  |  | ? | — | ✓ |  |  | ✓ | ✓ | ✓ |  |  | ✓ | ✓ | ✓ |
| hooks |  |  |  |  | — |  |  | ✓ | ✓ | ✓ | ✓ |  | ✓ |  | ✓ |
| mock |  |  |  |  |  | — |  |  |  |  |  |  | ✓ |  |  |
| pages |  |  |  |  |  |  | — |  |  |  |  |  |  |  |  |
| queries |  |  |  |  |  |  |  | — |  | ✓ |  |  | ✓ |  | ✓ |
| rules |  |  |  |  |  |  |  |  | — |  |  |  | ✓ |  | ✓ |
| services |  |  |  |  |  | ✓ |  |  | ✓ | — |  |  | ✓ |  | ✓ |
| store |  | ✓ |  |  |  |  |  |  |  |  | — |  | ✓ |  |  |
| telemetry |  |  |  |  |  |  |  |  |  |  |  | — |  |  | ✓ |
| types |  |  |  |  |  |  |  |  |  |  |  |  | — |  |  |
| ui |  | ✓ |  |  | ✓ |  |  |  |  |  |  |  | ✓ | — |  |
| utils |  |  |  |  |  |  |  |  |  |  |  |  | ✓ |  | — |

_Legend: ✓ = imports exist, ? = surprising upward import, — = self, (blank) = no imports._

## Layer Violations

| File | Imports | Expected direction | Violation |
|---|---|---|---|
| `src/ui/BuilderBg/LightRays.tsx` | `@/builder/stage/StageProvider` (builder/stage) | L2 (ui) should not import L8 (builder/stage) | ⚠️ upward |
| `src/components/forms/channel/CompositionLibraryModal.tsx` | `@/builder/cards/templates/task/task-properties/channel.icons` (builder/cards) | L3 (components) should not import L4 (builder/cards) | ⚠️ upward |
| `src/components/forms/channel/InlineChannelCompositionSelector.tsx` | `@/builder/cards/templates/task/task-properties/channel.icons` (builder/cards) | L3 (components) should not import L4 (builder/cards) | ⚠️ upward |

## src/components/ — Scope Analysis

| File | Imported by builder? | Imported outside builder? | Verdict |
|---|---|---|---|
| src/components/auth/LoginRedirect.tsx | No | No | unused |
| src/components/auth/NoAccessScreen.tsx | No | No | unused |
| src/components/auth/RouteGuard.tsx | No | No | unused |
| src/components/elements/buttons/index.ts | Yes | No | builder-only |
| src/components/elements/buttons/InlineIslandButton.tsx | No | No | unused |
| src/components/elements/buttons/IslandToggleButton.tsx | Yes | No | builder-only |
| src/components/elements/buttons/MenuSections.tsx | No | No | unused |
| src/components/feedback/AlertMark.tsx | Yes | No | builder-only |
| src/components/feedback/ReadyMark.tsx | Yes | No | builder-only |
| src/components/feedback/ValidationSummary.tsx | Yes | No | builder-only |
| src/components/forms/channel/ChannelCompositionFields.tsx | No | No | unused |
| src/components/forms/channel/ChannelCompositionSelect.tsx | No | No | unused |
| src/components/forms/channel/CompositionLibraryModal.tsx | No | No | unused |
| src/components/forms/channel/index.ts | Yes | No | builder-only |
| src/components/forms/channel/InlineChannelCompositionSelector.tsx | No | No | unused |
| src/components/forms/channel/RegistryDirectoryModal.tsx | No | No | unused |
| src/components/forms/date/CalendarGrid.tsx | No | No | unused |
| src/components/forms/date/CommunicationDateField.tsx | No | No | unused |
| src/components/forms/date/date.utils.ts | No | No | unused |
| src/components/forms/date/DatePickerPopup.tsx | No | No | unused |
| src/components/forms/date/DatePickerToggle.tsx | No | No | unused |
| src/components/forms/date/index.ts | Yes | No | builder-only |
| src/components/forms/date/LinkedDateGrid.tsx | No | No | unused |
| src/components/forms/date/useDatePickerState.ts | No | No | unused |
| src/components/forms/inputs/DateInputTBD.tsx | No | No | unused |
| src/components/forms/inputs/DualInput.tsx | No | No | unused |
| src/components/forms/inputs/index.ts | Yes | No | builder-only |
| src/components/forms/inputs/ListInputLines.tsx | No | No | unused |
| src/components/forms/inputs/SpecsInput.tsx | No | No | unused |
| src/components/forms/inputs/TextInputInline.tsx | No | No | unused |
| src/components/forms/inputs/TextInputLarge.tsx | No | No | unused |
| src/components/forms/inputs/TextInputSmall.tsx | No | No | unused |
| src/components/forms/selects/CompletionStateSelect.tsx | No | No | unused |
| src/components/forms/selects/index.ts | Yes | No | builder-only |
| src/components/forms/selects/InlineSelect.tsx | No | No | unused |
| src/components/forms/selects/SearchableSelect.tsx | No | No | unused |
| src/components/forms/selects/SearchableSelectIcons.tsx | No | No | unused |
| src/components/forms/subtask/index.ts | Yes | No | builder-only |
| src/components/forms/subtask/QuickSubtaskForm.tsx | No | No | unused |
| src/components/modals/ApprovalConfirmModal.tsx | Yes | No | builder-only |
| src/components/modals/ImportPreviewModal.tsx | Yes | No | builder-only |
| src/components/modals/quick-edit/QuickEditPopover.tsx | Yes | No | builder-only |
| src/components/modals/quick-edit/QuickEditTrigger.tsx | No | No | unused |
| src/components/modals/readiness-check-modal/ReadinessCheckModal.tsx | Yes | No | builder-only |

## Files Exceeding 150 Lines

| File | Lines | Cap | Action needed |
|---|---|---|---|
| src/actions/task.actions.ts | 288 | 250 | must split |
| src/components/modals/readiness-check-modal/ReadinessCheckModal.tsx | 282 | 250 | must split |
| src/builder/stage/views/DayGridCard.tsx | 248 | 250 | close to cap |
| src/builder/cards/handleCardDrop.ts | 239 | 250 | close to cap |
| src/components/forms/channel/ChannelCompositionSelect.tsx | 238 | 250 | close to cap |
| src/builder/islands/FocusIsland/options/PropertyOption/PropertyOption.tsx | 232 | 250 | close to cap |
| src/builder/islands/FocusIsland/FocusIsland.tsx | 229 | 250 | close to cap |
| src/services/api-mappers.ts | 228 | 250 | close to cap |
| src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx | 221 | 250 | close to cap |
| src/builder/islands/MetadataIsland/StatusDropdownBadge.tsx | 218 | 250 | close to cap |
| src/services/versions.service.ts | 215 | 250 | close to cap |
| src/ui/BuilderBg/LightRays.tsx | 215 | 250 | close to cap |
| src/actions/action.actions.ts | 213 | 250 | close to cap |
| src/builder/cards/templates/phase/PhaseCard.tsx | 209 | 250 | close to cap |
| src/builder/cards/templates/task/TaskCard.tsx | 204 | 250 | close to cap |
| src/builder/import/import.helpers.ts | 198 | 250 | watch |
| src/builder/islands/MetadataIsland/MetadataIsland.tsx | 197 | 250 | watch |
| src/builder/islands/EditorViewerIsland/useEditorPanel.ts | 193 | 250 | watch |
| src/components/forms/channel/InlineChannelCompositionSelector.tsx | 189 | 250 | watch |
| src/builder/BuilderPage.tsx | 185 | 250 | watch |
| src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx | 179 | 250 | watch |
| src/builder/stage/StageProvider.tsx | 177 | 250 | watch |
| src/builder/stage/StageCore.tsx | 175 | 250 | watch |
| src/builder/cards/useCardDrag.ts | 172 | 250 | watch |
| src/types/api.ts | 166 | 250 | watch |
| src/builder/islands/EditorViewerIsland/TaskEditor/RoutingDirectorySection.tsx | 165 | 250 | watch |
| src/builder/islands/EditorViewerIsland/useEditorDraft.ts | 165 | 250 | watch |
| src/types/domain.ts | 163 | 250 | watch |
| src/components/forms/subtask/QuickSubtaskForm.tsx | 159 | 250 | watch |
| src/builder/stage/views/timeline.helpers.ts | 157 | 250 | watch |
| src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx | 155 | 250 | watch |
| src/components/modals/ImportPreviewModal.tsx | 155 | 250 | watch |
| src/builder/islands/EditorViewerIsland/EditorHeader.tsx | 152 | 250 | watch |
| src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx | 152 | 250 | watch |
| src/store/builderStore.ts | 151 | 250 | watch |
