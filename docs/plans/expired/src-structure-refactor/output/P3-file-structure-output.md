# P3 — File Structure — Output

**Completed**: 2026-06-26
**Plan**: `docs/plans/active/src-structure-refactor/sprints/P3-file-structure.md`

---

## Summary

All 6 steps completed. P3 plan moved from `active/` to `completed/`.

---

## Step Outcomes

### Step 1 — LightRays layer violation fixed
- `src/ui/BuilderBg/LightRays.tsx`: Removed `useOptionalStageContext()` import from builder
- `src/ui/BuilderBg/BuilderBg.tsx`: Accepts `selectedNodeIds` prop
- `src/builder/BuilderPage.tsx`: Passes `selectedNodeIds` from StageContext
- ✅ Verified: no builder imports remain in `src/ui/`

### Step 2 — channel.icons cross-island fix
- Moved from `src/builder/cards/templates/task/task-properties/channel.icons.ts`
- → `src/builder/shared/channel.icons.ts`
- All 4 consumers updated
- Old file deleted

### Step 3 — task.actions.ts split (288 → 3 files)
| File | Lines | Contents |
|---|---|---|
| `src/actions/task.create.ts` | 107 | CreateTaskInput, createDefaultTask, cloneTask, createTask |
| `src/actions/task.update.ts` | 175 | UpdateTaskInput, updateTask, moveTask, moveTasks |
| `src/actions/task.delete.ts` | 17 | deleteTask |
- `src/actions/builder.actions.ts` updated to import from all 3 new files
- `src/actions/action.actions.ts` and `src/actions/node.actions.ts` updated to import `cloneTask` from `./task.create`
- Old `src/actions/task.actions.ts` deleted

### Step 4 — ReadinessCheckModal.tsx split (282 → 2 files)
| File | Lines | Contents |
|---|---|---|
| `src/builder/ui/modals/readiness-check-modal/ReadinessCheckModal.tsx` | 55 | Modal shell, blank state, entry point |
| `src/builder/ui/modals/readiness-check-modal/ReadinessCheckContent.tsx` | 237 | Criteria building, progress bar, checklist rows |
- **Bonus**: Fixed 24 remaining `@/components/` import paths across 15 files (P2 leftovers):
  - `@/components/forms/inputs` → `@/ui/forms/inputs`
  - `@/components/forms/selects` → `@/ui/forms/selects`
  - `@/components/forms/channel` → `@/builder/ui/forms/channel`
  - `@/components/forms/subtask` → `@/builder/ui/forms/subtask`
  - `@/components/forms/date` → `@/ui/forms/date`
  - `@/components/elements/buttons` → `@/builder/ui/buttons`
  - `@/components/modals/*` → `@/builder/ui/modals/*`
  - `@/components/feedback/ValidationSummary` → `@/builder/ui/feedback/ValidationSummary`
  - `@/components/auth/RouteGuard` → `@/ui/auth/RouteGuard`
- All `@/components/` imports eliminated from codebase

### Step 5 — Dependency-cruiser config
- Created `.dependency-cruiser.cjs` with 7 layer rules
- Added `validate-layers` script to `package.json`
- Layer rules enforced:
  - No types → higher layers
  - No utils → services/store/actions/hooks/ui/builder
  - No services → queries/store
  - No ui → builder
  - No pages/router → builder
  - No mock → non-types/utils
- ✅ `npm run validate-layers`: 0 violations (261 modules, 527 dependencies)

### Step 6 — StageContext future split documented
- Added comment block to `src/builder/stage/StageProvider.tsx` documenting the planned split into SelectionContext, DragContext, ViewContext, TimelineContext, PresentationContext

---

## Acceptance Criteria Results

| # | Check | Result |
|---|---|---|
| 1 | `npm run validate-layers` | ✅ 0 errors |
| 2 | `wc -l` task action files | ✅ all < 250 (107, 175, 17) |
| 3 | `wc -l` ReadinessCheckModal.tsx | ✅ 55 lines |
| 4 | Old task.actions.ts deleted | ✅ confirmed |
| 5 | LightRays imports from builder | ✅ 0 matches |
| 6 | channel.icons in shared/ | ✅ found |
| 7 | depcruise installed | ✅ v18.0.0 |
| 8 | `npm run build` | ✅ passes |

---

## Known Remaining Issues (post-v1)

### Cross-island imports (not enforced by depcruise)
- `ViewHelperIsland → cards/templates/.../ChannelPill.tsx` (use shared/ instead)
- `KanbanBuilderIsland → cards/cardDrag.helpers.ts` (move to shared/)

These are not in P3 scope — require PO agreement to move shared utilities.

### StageContext coupling
- 40+ components depend on StageContext — documented in StageProvider.tsx comment
- Post-v1: split into 5 focused contexts
