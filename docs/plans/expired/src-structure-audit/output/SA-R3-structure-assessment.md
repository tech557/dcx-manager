# src/ Structure Assessment — v0.3.2

Date: 2026-06-25
Based on: SA-R1 output (`dependency-graph.md`), `codebase-manifest.md`, `core.md §8`

---

## Summary

All 44 files in `src/components/` are builder-only — not a single one is imported from outside the builder. The split between `src/ui/` and `src/components/` is technically valid (primitives vs composed forms) but practically meaningless since both serve only the builder. `src/builder/stage/views/` (25 files) is the largest flat folder and would benefit from sub-grouping. Two files exceed the 250-line hard cap and must be split before any structural moves.

**Most urgent:** Move `src/components/` into `src/builder/` to eliminate the L3→L4/L5 upward imports and the circular dependency with builder. **Can wait:** Sub-grouping `views/` — valuable but high-churn, better done after the forms move.

---

## Zone 1 — `src/components/` vs `src/ui/`

**SA-R1 finding:** All 13 builder-imported files in `src/components/` are imported only by builder. Zero files are imported outside builder. The 31 "unused" files are only referenced internally via barrel exports (index.ts) that the builder imports.

| Folder | Files | Builder-imported | Used outside builder |
|---|---|---|---|
| `src/ui/` | 13 | 0 (LightRays is ui→builder, not builder→ui) | 0 |
| `src/components/` | 44 | 13 (via barrel exports) | 0 |

**Option A** — Keep both, sharpen boundary rule
- Write: "L2 = stateless atoms with no domain imports; L3 = stateful or domain-aware shared components"
- No files move, zero import changes
- Risk: low. Benefit: low — agents will still guess wrong because the distinction is about domain knowledge, not file type

**Option B** — Merge `src/ui/` into `src/components/primitives/`
- Move 13 files from `src/ui/` → `src/components/primitives/`
- ~10 import paths to update
- Risk: medium (import churn, no structural gain — just moves the confusion under one roof)

**Option C** — Move builder-only components into `src/builder/`
- Since ALL of `src/components/` is builder-only, the entire folder moves under builder
- More precisely: `src/components/` → `src/builder/components/` (or `src/builder/forms/` — see Zone 2)
- ~40 import paths to update across builder files
- Risk: medium (high import churn but structurally correct — resolves the circular dep with builder)

**Recommended option:** **C** (but execute in stages — Zone 2 first, then remaining components).

**Risk:** Medium (40+ import updates, but import find-and-replace is mechanical)
**Import changes if adopted:** ~40 files (all current `@/components/` imports become `@/builder/components/`)

---

## Zone 2 — `src/components/forms/` (28 files)

**SA-R1 finding:** Every form file that is imported (via barrel exports) is imported only by builder. Zero form files are imported outside builder. The 2 upward violations from `src/components/forms/channel/` to `src/builder/cards/` confirm these files belong in builder.

Breakdown within forms/:
| Sub-folder | Files | Imported by builder | Imported outside |
|---|---|---|---|
| forms/channel/ | 6 | Yes (via index.ts) | No |
| forms/date/ | 8 | Yes (via index.ts) | No |
| forms/inputs/ | 8 | Yes (via index.ts) | No |
| forms/selects/ | 5 | Yes (via index.ts) | No |
| forms/subtask/ | 2 | Yes (via index.ts) | No |

**Option A** (recommended) — Move `src/components/forms/` → `src/builder/forms/`
- 28 files move as a unit
- All current `@/components/forms/...` imports become `@/builder/forms/...`
- Resolves the 2 upward violations (channel forms importing builder cards becomes intra-builder)
- Eliminates the builder↔components circular dependency
- Risk: low (28 files, all imports are self-contained within forms/ and builder/ — no external consumers)

**Option B** — Keep location, add builder-only comment header
- No moves, zero risk
- Benefit: zero — still violates L3→L4/5 in both directions

**Option C** — Move only `forms/channel/` (the 6 files with upward violations)
- Partial fix — leaves forms/date/, forms/inputs/ etc. in the wrong folder
- Risk: low but incomplete

**Recommended option:** **A** (move all 28 files)
**Risk:** Low
**Import changes if adopted:** ~18 files in builder/ reference `@/components/forms/...`

---

## Zone 3 — `src/builder/stage/views/` (25 files)

**SA-R1 finding:** 25 files, no sub-grouping. Based on file names and imports:

| Group | Files | Count |
|---|---|---|
| Kanban-specific | `KanbanView.tsx`, `KanbanHiddenDropzones.tsx`, `useKanbanInteraction.ts` | 3 |
| Timeline-specific | `TimelineView.tsx`, `TimelineHourCell.tsx`, `TimelineCustomEdgeSensors.tsx`, `timeline.helpers.ts`, `useMatrixTimeline.ts`, `MatrixTimelineView.tsx`, `MatrixTimelineHeader.tsx` | 7 |
| Monthly-specific | `MonthlyView.tsx` | 1 |
| Weekly/Grid-specific | `WeeklyView.tsx`, `useWeeklyView.ts`, `DayGridCard.tsx`, `DayGridCardCollapsed.tsx`, `DayGridCardEmpty.tsx`, `useDayGridCard.ts`, `useDayGridDrag.ts`, `DayTaskCreator.tsx` | 8 |
| Drop zones (shared) | `ActionDropZone.tsx`, `PhaseDropZone.tsx`, `TaskDropZone.tsx` | 3 |
| Grid markers / smoke | `TaskGridMarker.tsx`, `SmokeStage.tsx` | 2 |

**Option A** — Sub-group by view type: `views/kanban/`, `views/timeline/`, `views/shared/`
- 25 file moves, ~30 cross-import updates within views/ (relative imports change)
- Risk: medium-high (many relative imports between files in different sub-groups become `../shared/` etc.)
- Benefit: eliminates the "biggest single folder" complaint, matches island-per-folder pattern

**Option B** — Extract shared helpers to `views/_shared/`, keep view files flat
- Move: DayGridCard*, drop zones, SmokeStage, TaskGridMarker → `views/_shared/`
- ~12 file moves, ~20 import updates
- Risk: medium
- Benefit: partial — kanban/timeline specific files still mix

**Option C** — Keep flat, enforce naming convention
- Zero moves, zero risk
- Benefit: low — 25 files is near the threshold where human developers and agents lose track

**Recommended option:** **B** (extract shared helpers first — lowest churn for biggest gain)
**Risk:** Medium
**Import changes if adopted:** ~20 files

---

## Zone 4 — `EditorViewerIsland/` (21 files including TaskEditor/)

**SA-R1 finding:** The `TaskEditor/` sub-folder (5 files: `TaskEditor.tsx`, `RoutingDirectorySection.tsx`, `TaskSection1.tsx`, `TaskSection3.tsx`, `TaskSection4.tsx`) imports from `src/components/forms/` (date pickers, inputs, selects) and `src/components/forms/subtask/`. None are reused outside the island.

**Option A** (recommended) — Keep as-is
- 21 files in one island is large but well-structured: root has 16 files (panel shell + hooks), TaskEditor/ has 5 (task editing)
- The TaskEditor forms are island-specific (they render inside the editor panel) — moving them to `src/components/forms/task/` would create a false abstraction because they'd still need island context
- After Zone 2 (forms → builder), the imports will still be correct since both will be under builder/

**Option B** — Move `TaskEditor/` to `src/builder/forms/task/`
- 5 file moves, ~5 import updates
- Pro: separates editor shell from editing forms
- Con: TaskSection files depend on island hooks (useEditorDraft, useActiveNode) — moving them creates a dependency back to the island, or forces those hooks to be extracted too

**Option C** — Split into two islands: `EditorViewerIsland` (chrome) + `TaskEditorIsland` (content)
- High churn for unclear gain — the "island" boundary is useful for layout, but separating editor chrome from editor content within the same panel column is premature

**Recommended option:** **A** (keep as-is)
**Risk:** None (no changes)
**Import changes if adopted:** 0

---

## Zone 5 — Large File Splits

### Files over 250 lines (must split)

| File | Lines | Current responsibility | Proposed split |
|---|---|---|---|
| `src/actions/task.actions.ts` | 288 | Task CRUD (create, update, delete), status transitions, validation | → `task-crud.actions.ts` (CRUD, ~120 lines), `task-status.actions.ts` (status transitions + validation, ~100 lines), keep `task.actions.ts` as re-exports (~20 lines) |
| `src/components/modals/readiness-check-modal/ReadinessCheckModal.tsx` | 282 | Readiness check modal — renders readiness rules, displays violations, handles dismiss | → Extract `ReadinessRulesRenderer.tsx` (renders individual rule results, ~100 lines) and `ReadinessCheckModal.tsx` (shell + interaction, ~100 lines). Remaining 82 lines: imports, types, exports |

### Files over 200 lines (near cap — watch)

| File | Lines | Action |
|---|---|---|
| `src/builder/stage/views/DayGridCard.tsx` | 248 | Watch — split when next feature touches it |
| `src/builder/cards/handleCardDrop.ts` | 239 | Watch — split drop logic per node kind |
| `src/components/forms/channel/ChannelCompositionSelect.tsx` | 238 | Will move to builder/ — split after move |
| `src/builder/islands/FocusIsland/options/PropertyOption/PropertyOption.tsx` | 232 | Watch |
| `src/builder/islands/FocusIsland/FocusIsland.tsx` | 229 | Watch |
| `src/services/api-mappers.ts` | 228 | Watch — split by domain mapper |
| `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` | 221 | Watch |
| `src/builder/islands/MetadataIsland/StatusDropdownBadge.tsx` | 218 | Watch |
| `src/services/versions.service.ts` | 215 | Watch |
| `src/ui/BuilderBg/LightRays.tsx` | 215 | Watch — will move to builder/ |
| `src/actions/action.actions.ts` | 213 | Watch |
| `src/builder/cards/templates/phase/PhaseCard.tsx` | 209 | Watch |
| `src/builder/cards/templates/task/TaskCard.tsx` | 204 | Watch |

---

## Prioritised Action List

| Priority | Zone | Action | Import changes | Risk |
|---|---|---|---|---|
| 1 | Zone 2 | Move `src/components/forms/` → `src/builder/forms/` | ~18 files | Low |
| 2 | Zone 1 | Move remaining `src/components/` → `src/builder/components/` (excluding forms, already done) | ~20 files | Low |
| 3 | Zone 1 | Move `src/ui/BuilderBg/` → `src/builder/background/` (resolves L2→L8 violation) | ~1 file | Low |
| 4 | Zone 5 | Split `task.actions.ts` (288 lines) | 0 (re-export kept) | Low |
| 5 | Zone 5 | Split `ReadinessCheckModal.tsx` (282 lines) | 0 (same file kept) | Low |
| 6 | Zone 3 | Sub-group `views/` — extract shared helpers to `views/_shared/` | ~20 files | Medium |
| 7 | Zone 4 | Keep `EditorViewerIsland/` as-is | 0 | None |

---

## What Does NOT Need to Change

- **`src/actions/`** — 10 files, correctly placed as mutation layer. All actions remain where they are.
- **`src/services/`** — 13 files, correctly placed as integration seams. No merge needed.
- **`src/rules/`** — 7 files, correctly placed as business logic layer.
- **`src/store/`** — 3 files, correctly placed. No change.
- **`src/types/`** — 9 files, correctly placed. `api.ts` (166 lines) is close to 150 but types don't have the same readability burden.
- **`src/utils/`** — 9 files, correctly placed. `node.helpers.ts` is well-structured.
- **`src/hooks/`** — 5 files, correctly placed as shared hooks layer.
- **`src/builder/cards/`** — 34 files, well-structured with templates/ sub-folders.
- **`src/builder/stage/` root** — 11 files, correctly placed. StageProvider, StageCore, stage context types all belong here.
- **`src/pages/`** — 5 files, correctly placed as L9 page orchestrators.
- **`src/brand/`** — 3 files + fonts, correctly placed as visual foundation.
- **`src/mock/`** — 3 files, test-only, no change.
- **Telemetry** — 2 files, no change.

---

## PO Decision Required

☐ **Zone 1** (`components/` vs `ui/`): approve Option C (move all builder-only components into builder)
☐ **Zone 2** (`components/forms/`): approve Option A (move all 28 files to `src/builder/forms/`)
☐ **Zone 3** (`stage/views/`): approve Option B (extract shared helpers to `views/_shared/`)
☐ **Zone 4** (`EditorViewerIsland`): approve Option A (keep as-is)
☐ **Zone 5** (large files): confirm split list — `task.actions.ts` and `ReadinessCheckModal.tsx` must split
☐ Approve creation of active plan: **src-structure-refactor** (one sprint per priority level)
