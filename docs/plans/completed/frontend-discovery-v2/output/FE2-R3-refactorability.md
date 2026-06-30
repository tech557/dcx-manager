# FE2-R3 — Refactorability + Extraction Plan
Date: 2026-06-26 | Agent: opencode

## Session Environment
Same session as FE2-R1 and FE2-R2.
Code-index fresh, dep-cruiser basic, all gates available.

## 3 — Safe-to-extract components

| Component | File | Consumers | Notes |
|-----------|------|-----------|-------|
| StickyPopupShell | src/ui/StickyPopupShell.tsx | 7 | Already in src/ui/ |
| DividerLine | src/ui/DividerLine.tsx | 6 | Already in src/ui/ |
| Chip | src/ui/atoms/Chip.tsx | 4 | Already in src/ui/atoms/ |
| EffectLayer | src/ui/motion/EffectLayer.tsx | 4 | Already in src/ui/ |
| QuickEditPopover | src/builder/ui/modals/quick-edit/QuickEditPopover.tsx | 4 | In builder/ui/ |
| ReadinessCheckModal | src/builder/ui/modals/readiness-check-modal/ReadinessCheckModal.tsx | 4 | In builder/ui/ |
| PopoverShell | src/ui/PopoverShell.tsx | 3 | Already in src/ui/ |
| DropTarget | src/builder/dropzones/DropTarget.tsx | 3 | In builder/dropzones/ |
| BuilderIslandShell | src/builder/islands/BuilderIslandShell.tsx | 3 | In builder/islands/ |
| Badge | src/ui/atoms/Badge.tsx | 3 | Already in src/ui/atoms/ |
| GlassSurface | src/ui/surfaces/GlassSurface.tsx | 3 | Already in src/ui/surfaces/ |
| IslandToggleButton | src/builder/ui/buttons/IslandToggleButton.tsx | 3 | In builder/ui/ |
| AlertMark | src/builder/ui/feedback/AlertMark.tsx | 3 | In builder/ui/ |
| ReadyMark | src/builder/ui/feedback/ReadyMark.tsx | 3 | In builder/ui/ |
| TextInputLarge | src/ui/forms/inputs/TextInputLarge.tsx | 3 | In src/ui/forms/ |
| BuilderLoadingShell | src/builder/BuilderLoadingShell.tsx | 2 | In builder/ |
| StageEdgeNavigation | src/builder/stage/StageEdgeNavigation.tsx | 2 | In builder/stage/ |
| ToggleGroup | src/ui/atoms/ToggleGroup.tsx | 2 | Already in src/ui/atoms/ |
| BuilderBg | src/ui/BuilderBg/BuilderBg.tsx | 2 | In src/ui/ |
| ReviewModal | src/builder/islands/PreviewReviewModal/ReviewModal.tsx | 2 | In builder/islands/ |
| CreateCompositionForm | .../TaskCreationFlow/CreateCompositionForm.tsx | 2 | Co-located |
| Step1SelectChannel | .../TaskCreationFlow/Step1_SelectChannel.tsx | 2 | Co-located |
| Step2SelectComposition | .../TaskCreationFlow/Step2_SelectComposition.tsx | 2 | Co-located |
| DayGridCard | src/builder/stage/views/DayGridCard.tsx | 2 | In builder/stage/views/ |
| InlineIslandButton | src/builder/ui/buttons/InlineIslandButton.tsx | 2 | In builder/ui/ |
| CommunicationDateField | src/ui/forms/date/CommunicationDateField.tsx | 2 | In src/ui/forms/ |
| CompletionStateSelect | src/ui/forms/selects/CompletionStateSelect.tsx | 2 | In src/ui/forms/ |
| InlineSelect | src/ui/forms/selects/InlineSelect.tsx | 2 | In src/ui/forms/ |
| ActionCard | src/builder/cards/templates/action/ActionCard.tsx | 2 | Co-located |
| PhaseCard | src/builder/cards/templates/phase/PhaseCard.tsx | 2 | Co-located |
| TaskReadOnlyPopup | .../templates/task/TaskReadOnlyPopup.tsx | 2 | Co-located |
| QuickSubtaskForm | src/builder/ui/forms/subtask/QuickSubtaskForm.tsx | 2 | In builder/ui/ |
| ChannelPill | .../task-properties/ChannelPill.tsx | 2 | Co-located |
| ... and 78 more safe components (1 consumer each) | | | |
| LockBadge | src/ui/LockBadge.tsx | 0 | Orphaned — dead |
| ReadinessBadge | src/ui/ReadinessBadge.tsx | 0 | Orphaned — dead |
| StatusBadge | src/ui/StatusBadge.tsx | 0 | Orphaned — dead |
| FieldIndicator | src/builder/cards/FieldIndicator.tsx | 0 | Orphaned — dead |
| DateInputTBD | src/ui/forms/inputs/DateInputTBD.tsx | 0 | Orphaned — dead |
| DualInput | src/ui/forms/inputs/DualInput.tsx | 0 | Orphaned — dead |
| TextInputSmall | src/ui/forms/inputs/TextInputSmall.tsx | 0 | Orphaned — dead |
| SearchableSelect | src/ui/forms/selects/SearchableSelect.tsx | 0 | Orphaned — dead |
| SearchableSelectIcons | src/ui/forms/selects/SearchableSelectIcons.tsx | 0 | Orphaned — dead |
| DayCard | src/builder/cards/templates/day/DayCard.tsx | 0 | Orphaned — dead |

**Total safe: 111** (was 35 pre-P1, delta: +76)

**Note:** The pre-P1 count of 35 was conservative — it only counted "leaf atoms" (presentational, used in 2+ islands). The script-based count of 111 includes ALL components without context/store imports, including single-use components. The 35-count is not directly comparable to the 111-count; the true delta for "safe leaf atoms" is ~24 (P1 migrated most of the pre-P1 35 safe atoms into src/ui/ and src/builder/ui/).

## 3 — Context-coupled components (do not move without refactor)

| Component | Signals | Consumers |
|-----------|---------|-----------|
| CardShell | StageContext | 6 |
| TaskDropZone | StageContext | 4 |
| TaskCard | StageContext | 4 |
| ActionDropZone | StageContext | 2 |
| PhaseDropZone | StageContext | 2 |
| BuilderPage | useBuilderStore, StageContext | 1 |
| BuilderWorkspaceContent | useBuilderStore, StageContext | 1 |
| StageCore | StageContext | 1 |
| StageProvider | useContext, useBuilderStore | 1 |
| EditorSessionPill | builderStore | 1 |
| FocusIsland | StageContext | 1 |
| HeaderUserIsland | useBuilderStore, useAppStore | 1 |
| SelectionIsland | StageContext | 1 |
| TimelineBuilderIsland | StageContext | 1 |
| ViewContextTaskItem | StageContext | 1 |
| ViewContextTaskList | StageContext | 1 |
| MonthlyView | StageContext | 1 |
| TaskGridMarker | StageContext | 1 |
| TaskBentoGrid | StageContext | 1 |
| PropertyOption | StageContext | 1 |
| WeekOption | StageContext | 1 |
| KanbanView | StageContext | 0 |
| SmokeStage | StageContext | 0 |
| TimelineView | StageContext | 0 |

**Total context-coupled: 24** (was 20 pre-P1, delta: +4)

Newly coupled (pre-P1 these were not detected or didn't exist):
- BuilderWorkspaceContent (new component?)
- EditorSessionPill (builderStore signal)
- TaskBentoGrid (StageContext — new component?)
- ViewContextTaskItem (StageContext — new?)

## 4 — Over-cap file blast radius

| File | Lines | Cap | Importers (blast radius) |
|------|-------|-----|--------------------------|
| `src/builder/islands/EditorViewerIsland/useEditorPanel.ts` | 249 | 200 | 1 (EditorViewerIsland.tsx) |
| `src/builder/islands/EditorViewerIsland/useEditorDraft.ts` | 215 | 200 | 1 (EditorViewerIsland.tsx) |

**Blast radius: low** — both hooks are single-owner (only EditorViewerIsland.tsx imports them).
Splitting them has no cascading impact on other files.

## 5 — Extraction priority order for folder-structure-v2 P2

1. **Merge editor hooks (useEditorPanel + useEditorDraft + useEditorGuard → useEditorState)**
   - Why: Recommended by FE-R3, not executed in P1. All 3 are single-owner, co-located in EditorViewerIsland/. Merging reduces 3 StageContext subscriptions to 1, reducing re-renders.
   - Verifies: `grep -c "useEditorState" src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` → 1

2. **Split useEditorPanel.ts (249 lines, cap 200)**
   - Why: Most over-cap file (+49 excess). Only 1 importer, low risk.
   - Verifies: `wc -l < src/builder/islands/EditorViewerIsland/useEditorPanel.ts` ≤ 200 (or file removed if merged into useEditorState)

3. **Split useEditorDraft.ts (215 lines, cap 200)**
   - Why: 2nd most over-cap (+15 excess). Single importer.
   - Verifies: `wc -l < src/builder/islands/EditorViewerIsland/useEditorDraft.ts` ≤ 200 (or file removed if merged)

4. **Delete orphaned dead components (7 files, 0 consumers, no dynamic registration)**
   - LockBadge, ReadinessBadge, StatusBadge, FieldIndicator, DateInputTBD, DualInput, TextInputSmall, SearchableSelect, SearchableSelectIcons, DayCard
   - Why: 0 consumers and no dynamic resolution pattern (unlike KanbanView/SmokeStage/TimelineView which are stage.registry entries).
   - Verifies: `npm run build` passes after deletion

5. **Consolidate badge duplicates (StatusBadge, ReadinessBadge, LockBadge → Badge atom)**
   - Why: 3 orphaned badge components — P1 created `Badge` atom in `src/ui/atoms/Badge.tsx` but old badge files were not deleted.
   - Verifies: `grep -rn "StatusBadge\|ReadinessBadge\|LockBadge" src/ --include="*.tsx" --include="*.ts" | grep -v "\.test\." | grep -v node_modules | wc -l` → 0

6. **Delete dead CSS classes (48 identified in FE-R3)**
   - Why: Deletion-only task, no behavioral risk. CSS classes from pre-P1 that are now dead after Tailwind migration.
   - Verifies: Dep-cruiser passes, `npm run build` passes

7. **Delete unused hooks (useFocus, usePreferences, usePermissions)**
   - Why: 0 consumers each. If confirmed dead, delete. If dynamically called, document.
   - Verifies: `grep -rl "useFocus\|usePreferences\|usePermissions" src/ --include="*.tsx" --include="*.ts"` returns only the definition file

## Adopted decisions from expired plan (still valid)

- StageContext stays as-is (full decomposition too risky for P2 — only drag state extraction was planned and not executed)
- ~20 context-coupled components stay in-place (cannot move)
- CardShell is decoupled enough to extract with `useCardBehavior`
- CSS modules rejected (Tailwind-first architecture confirmed)
- usertoggle hook (useToggle exists in src/hooks/useToggle.ts — P1 already created it)
- No `as any` at service boundaries (confirmed clean in FE2-R2)

## Changed findings vs expired FE-R3

| Dimension | FE-R3 (pre-P1) | FE2-R3 (post-P1) | Δ |
|-----------|---------------|-------------------|---|
| Total components | 98 | 135 | +37 |
| Safe leaf atoms | ~35 | ~24 (comparable metric) | -11 |
| Context-coupled | 20 | 24 | +4 |
| Orphaned components | 0 (claimed) | 15 (scripted) | +15 |
| Dead CSS classes | 48 | still exists (not deleted) | 0 |
| Over-cap files | 2 (150-line cap) | 2 (200/250-line cap) | 0 |
| useToggle hook | recommended | exists (P1 created it) | resolved ✓ |
| Editor hooks merge | recommended | NOT done | unaddressed |
| Drag state extraction | planned | NOT done | unaddressed |

**Critical finding:** The pre-P1 "0 orphaned components" claim in FE-R3 was incorrect — it was based on `components.json` `consumers` field which does not exist. The current `component-usages.json` shows 15 true orphans. Some are dynamically resolved (KanbanView, SmokeStage, TimelineView via stage.registry.ts), but at least 10 are genuinely dead.
