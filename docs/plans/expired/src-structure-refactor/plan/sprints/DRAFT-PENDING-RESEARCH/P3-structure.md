---
sprint: P3-structure
plan: src-structure-refactor
title: File Structure Moves + Import Enforcement
status: not-started
output: docs/plans/active/src-structure-refactor/output/P3-structure-report.md
depends-on: P2-components (component files must be in final form before paths are locked)
---

# P3 — File Structure Moves + Import Enforcement

## Goal

Eliminate `src/components/` as a folder. Move every builder-specific file to `src/builder/`. Fix the 3 layer violations found in SA-R1. Install `dependency-cruiser` to enforce import rules going forward so the violations can never silently return.

After this sprint, an agent opening `src/` sees folders whose names tell them exactly what scope each file has.

---

## Current State

From SA-R1:

| Folder | Files | Problem |
|---|---|---|
| `src/components/` | 44 | All builder-only, 0 files imported outside builder |
| `src/ui/BuilderBg/` | 2 | `LightRays.tsx` imports `StageProvider` (L2 → L8 violation) |
| `src/builder/stage/views/` | 25 flat | Largest single flat folder |

### 3 layer violations

| File | Violation |
|---|---|
| `src/ui/BuilderBg/LightRays.tsx` | Imports `@/builder/stage/StageProvider` (L2 → L8) |
| `src/components/forms/channel/CompositionLibraryModal.tsx` | Imports `@/builder/cards/.../channel.icons` (L3 → L4) |
| `src/components/forms/channel/InlineChannelCompositionSelector.tsx` | Imports `@/builder/cards/.../channel.icons` (L3 → L4) |

---

## Target State

```
src/
  builder/
    background/          ← NEW: was src/ui/BuilderBg/
      BuilderBg.tsx
      LightRays.tsx
    cards/               ← unchanged
    components/          ← NEW: was src/components/ (non-forms)
      elements/
        buttons/
      feedback/
      modals/
    dropzones/           ← unchanged
    focus/               ← unchanged
    forms/               ← NEW: was src/components/forms/
      channel/
      date/
      inputs/            ← may be thin wrappers after P2 creates Input atom
      selects/
      subtask/
    import/              ← unchanged
    islands/             ← unchanged
    stage/
      views/
        _shared/         ← NEW: drop zones, smoke, grid marker
        kanban/          ← NEW: kanban-specific
        timeline/        ← NEW: timeline-specific
        weekly/          ← NEW: weekly/grid-specific
        monthly/         ← NEW: monthly
  ui/
    atoms/               ← NEW from P2
    motion/              ← unchanged
    surfaces/            ← unchanged
    [root atoms]         ← DividerLine, PopoverShell, StickyPopupShell, StatusBadge, LockBadge stay until P2 wrappers exist
  components/            ← GONE after this sprint
```

---

## Sprint Steps (execute in order — typecheck after each step)

### Step 1 — Install dependency-cruiser

```bash
npm install --save-dev dependency-cruiser
npx depcruise --init   # generates .dependency-cruiser.js
```

Edit `.dependency-cruiser.js` to add two forbidden rules:

```js
forbidden: [
  {
    name: 'no-ui-imports-builder',
    comment: 'src/ui/ must not import from src/builder/ (L2 must not import L4+)',
    severity: 'error',
    from: { path: '^src/ui/' },
    to:   { path: '^src/builder/' },
  },
  {
    name: 'no-components-imports-builder',
    comment: 'src/components/ must not import from src/builder/ (L3 must not import L4+)',
    severity: 'error',
    from: { path: '^src/components/' },
    to:   { path: '^src/builder/' },
  },
],
```

Add to `package.json` scripts:
```json
"depcruise": "depcruise src --config .dependency-cruiser.js --output-type err"
```

Run `npm run depcruise` — expect exactly 3 violations (the 3 known from SA-R1). If more appear, stop and investigate.

**Typecheck gate: `npx tsc --noEmit` PASS**

---

### Step 2 — Move `src/components/forms/` → `src/builder/forms/`

Move all 28 files as a unit. Sub-folder structure is preserved:

```
src/components/forms/channel/ → src/builder/forms/channel/
src/components/forms/date/    → src/builder/forms/date/
src/components/forms/inputs/  → src/builder/forms/inputs/
src/components/forms/selects/ → src/builder/forms/selects/
src/components/forms/subtask/ → src/builder/forms/subtask/
```

After moving, update every import that referenced `@/components/forms/...` to `@/builder/forms/...`.

Estimated import updates: ~18 files (all in `src/builder/islands/` and `src/builder/cards/`).

**Verify:** `npm run depcruise` should now report 1 violation (the `no-components-imports-builder` rule now resolves as channel forms are inside builder — only LightRays remains). If it reports 0: the channel form violations are also resolved, which is correct.

**Typecheck gate: `npx tsc --noEmit` PASS**

---

### Step 3 — Move remaining `src/components/` → `src/builder/components/`

**Before moving:** check `src/components/auth/` usage.

```bash
grep -r "components/auth" src/ --include="*.tsx" --include="*.ts"
```

If 0 results: `auth/` files are unused — delete them, don't move them.  
If results exist in `src/pages/`: move to `src/builder/components/auth/` if they're builder-specific, or to `src/` root if shared.

Move remaining:
```
src/components/elements/ → src/builder/components/elements/
src/components/feedback/ → src/builder/components/feedback/
src/components/modals/   → src/builder/components/modals/
```

Update all `@/components/...` imports to `@/builder/components/...`.

Delete `src/components/` once empty.

**Verify:** `ls src/components` → should return "No such file or directory".

**Typecheck gate: `npx tsc --noEmit` PASS**

---

### Step 4 — Move `src/ui/BuilderBg/` → `src/builder/background/`

```
src/ui/BuilderBg/BuilderBg.tsx → src/builder/background/BuilderBg.tsx
src/ui/BuilderBg/LightRays.tsx → src/builder/background/LightRays.tsx
```

Update the 1 import that references `@/ui/BuilderBg/BuilderBg`.

Delete `src/ui/BuilderBg/`.

**Verify:** `npm run depcruise` → **0 violations**. This is the final violation fix.

**Typecheck gate: `npx tsc --noEmit` PASS**

---

### Step 5 — Sub-group `src/builder/stage/views/`

Create sub-folders and move files:

```
views/_shared/
  ActionDropZone.tsx
  PhaseDropZone.tsx
  TaskDropZone.tsx
  TaskGridMarker.tsx
  SmokeStage.tsx

views/kanban/
  KanbanView.tsx
  KanbanHiddenDropzones.tsx
  useKanbanInteraction.ts

views/timeline/
  TimelineView.tsx
  TimelineHourCell.tsx
  TimelineCustomEdgeSensors.tsx
  timeline.helpers.ts
  useMatrixTimeline.ts
  MatrixTimelineView.tsx
  MatrixTimelineHeader.tsx

views/weekly/
  WeeklyView.tsx
  useWeeklyView.ts
  DayGridCard.tsx
  DayGridCardCollapsed.tsx
  DayGridCardEmpty.tsx
  useDayGridCard.ts
  useDayGridDrag.ts
  DayTaskCreator.tsx

views/monthly/
  MonthlyView.tsx
```

Add a `views/index.ts` barrel that re-exports all view components so existing imports from `@/builder/stage/views/WeeklyView` still work without updating every consumer.

**Typecheck gate: `npx tsc --noEmit` PASS**

---

### Step 6 — Split large files

Run these only after Steps 1–5 pass typecheck. Independent of each other.

#### `src/actions/task.actions.ts` (288 lines)

Split into:
```
src/actions/task-crud.actions.ts    ← create, update, delete (~120 lines)
src/actions/task-status.actions.ts  ← status transitions + validation (~100 lines)
src/actions/task.actions.ts         ← re-exports only (~20 lines — keeps all existing imports valid)
```

#### `src/builder/components/modals/readiness-check-modal/ReadinessCheckModal.tsx` (282 lines — now at new path after Step 3)

Split into:
```
ReadinessRulesRenderer.tsx  ← renders individual rule result rows (~100 lines)
ReadinessCheckModal.tsx     ← modal shell + state + open/close (~120 lines)
```

**Typecheck gate: `npx tsc --noEmit` PASS**

---

## Numeric Targets

| Metric | Before | Target |
|---|---|---|
| `src/components/` files | 44 | 0 (folder deleted) |
| Layer violations | 3 | 0 |
| Files over 250 lines | 2 | 0 |
| Largest flat folder (views/) | 25 | ≤ 8 per sub-folder |
| dependency-cruiser violations | N/A (not installed) | 0 |

---

## Acceptance Criteria

- [ ] `ls src/components` → error (folder deleted)
- [ ] `src/builder/forms/` contains exactly 28+ files
- [ ] `src/builder/components/` contains the former auth/, elements/, feedback/, modals/ trees
- [ ] `src/builder/background/` contains BuilderBg.tsx + LightRays.tsx
- [ ] `src/builder/stage/views/` root contains ≤ 2 files (barrel index only)
- [ ] `npm run depcruise` → 0 violations
- [ ] `find src -name "*.ts" -o -name "*.tsx" | xargs wc -l | awk '$1>250 {print}'` → empty
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx vitest run` → all passing
- [ ] `bash scripts/gen-manifest.sh` run to update codebase manifest

---

## Session Log Instructions

```
docs/progress/sessions/<date>-<agent>/NN-P3-structure.md
```

Output file at:
```
docs/plans/active/src-structure-refactor/output/P3-structure-report.md
```

Output must include:
- Count of files moved per step
- Before/after depcruise violation count at each step
- Before/after `wc -l` for split files
- Any auth/ files that were deleted rather than moved (list the files)
