---
sprint: P3
title: File Structure
plan: src-structure-refactor
status: drafted
depends-on: P2 (all P2 gates must pass first)
data-source: SA-R1-dependency-graph.md, SA-R3-structure-assessment.md, FE-R1-component-tree.md, FE-R3-duplication-map.md
---

# P3 — File Structure

## Goal

After P3, every file is in the right folder, no file exceeds 250 lines, import layer violations
are gone, and a dependency-cruiser config enforces the layer rules permanently.

**What does not move in P3**: The 20 context-coupled components (StageCore, KanbanView,
EditorViewerIsland, etc.) stay in-place. Moving them requires untangling StageContext, which
is post-v1 scope.

---

## Before

| Metric | Count |
|---|---|
| Import layer violations | 3 |
| Files over 250-line cap | 2 (task.actions.ts: 288, ReadinessCheckModal: 282) |
| Dependency-cruiser rule file | 0 |
| DayGridCard.tsx (248 lines) | At-risk (2 lines under cap) |

---

## After

| Metric | Target |
|---|---|
| Import layer violations | 0 |
| Files over 250-line cap | 0 |
| Dependency-cruiser rule file | 1 (.dependency-cruiser.js) |
| dep-cruiser violations | 0 |

---

## Layer Architecture (reference)

The allowed dependency graph (lower layers may NOT import from higher layers):

```
L1: src/types/
L2: src/utils/, src/tokens.ts
L3: src/mock/, src/services/api-mappers.ts
L4: src/services/ (other)
L5: src/queries/
L6: src/store/
L7: src/actions/
L8: src/hooks/
L9: src/ui/         (pure UI atoms, no builder imports)
L10: src/builder/   (islands, stage, cards, dropzones)
L11: src/router/, src/pages/
```

**Current violations** (SA-R1):
1. `src/ui/BuilderBg/LightRays.tsx → src/builder/stage/StageProvider` (L9 → L10)
2. `src/builder/islands/EditorViewerIsland/CompositionLibraryModal.tsx → src/builder/cards/templates/.../channel.icons` (L10 cross-island)
3. `src/builder/islands/EditorViewerIsland/InlineChannelCompositionSelector.tsx → src/builder/cards/templates/.../channel.icons` (L10 cross-island)

---

## Step-by-step work

### Step 1 — Fix layer violation 1: LightRays.tsx

**File**: `src/ui/BuilderBg/LightRays.tsx`

**Violation**: Imports `StageProvider` (a builder-layer module) from within the ui/ layer.

**Decision** (per Gemini review — explicit, no ambiguity): **Option A — Prop Injection.**

Read LightRays.tsx to identify the specific value it reads from StageProvider (likely `isDark`
or an active state flag). Add that value as a new prop on LightRays. The parent component
(in builder/) passes the value down. LightRays becomes a pure function of its props.

Example:
```typescript
// Before (violates layer):
import { useStageContext } from '@/builder/stage/StageProvider';
const { someValue } = useStageContext();

// After (clean):
interface LightRaysProps {
  // ... existing props
  someValue?: boolean; // passed by parent
}
```

LightRays stays in `src/ui/BuilderBg/`. No files move. The builder import is removed.
Update the parent component that renders LightRays to pass the prop.

---

### Step 2 — Fix layer violations 2 and 3: channel.icons import

**Files**:
- `src/builder/islands/EditorViewerIsland/CompositionLibraryModal.tsx`
- `src/builder/islands/EditorViewerIsland/InlineChannelCompositionSelector.tsx`

**Violation**: Both import from `src/builder/cards/templates/task/task-properties/channel.icons`
— a cross-island import (EditorViewerIsland → cards/templates).

**Fix**: Move `channel.icons.ts` (or the specific export used) to a shared location:
`src/builder/shared/channel.icons.ts` or `src/utils/channel.icons.ts`.

Update imports in all 3 files (the 2 violators + the original in task-properties/).

```bash
# Verify: find all consumers of channel.icons
grep -rn 'channel.icons' src/ --include='*.tsx' --include='*.ts'
```

---

### Step 3 — Split task.actions.ts (288 lines → 3 files)

**File**: `src/actions/task.actions.ts` (288 lines — over 250 cap)

**Split plan** (by action group):

| New file | Functions | Approx lines |
|---|---|---|
| `src/actions/task.create.ts` | createTask, DayTaskCreator helpers | ~80 |
| `src/actions/task.update.ts` | updateTask, moveTask, moveTasks | ~120 |
| `src/actions/task.delete.ts` | deleteTask, subtask helpers | ~80 |

Update `src/actions/builder.actions.ts` (aggregator) to import from the 3 new files.
Delete `task.actions.ts` after all consumers are updated.

---

### Step 4 — Split ReadinessCheckModal.tsx (282 lines → 2 files)

**File**: `src/builder/islands/EditorViewerIsland/ReadinessCheckModal.tsx` (282 lines)

**Split plan**:

| New file | Content | Approx lines |
|---|---|---|
| `ReadinessCheckModal.tsx` | Modal shell, open/close, and entry point | ~80 |
| `ReadinessCheckContent.tsx` | The checklist rows and readiness logic | ~200 |

`ReadinessCheckModal` imports `ReadinessCheckContent` and renders it inside the modal shell.

---

### Step 5 — Add dependency-cruiser config

**File**: `.dependency-cruiser.js` (project root)

Install if not present:
```bash
npm install --save-dev dependency-cruiser
```

Create rule config that enforces the layer architecture. Key rules to encode:

```javascript
// src/ui/ must not import from src/builder/
{
  name: 'no-ui-to-builder',
  severity: 'error',
  from: { path: '^src/ui/' },
  to: { path: '^src/builder/' }
},
// src/services/ must not import from src/queries/ or src/store/
{
  name: 'no-service-to-store',
  severity: 'error',
  from: { path: '^src/services/' },
  to: { path: '^src/(queries|store)/' }
},
// Non-builder pages must not import from src/builder/
// (builder pages are desktop+4K only; non-builder pages are mobile-first)
{
  name: 'no-pages-to-builder',
  severity: 'error',
  from: { path: '^src/(pages|router)/' },
  to: { path: '^src/builder/' }
},
// src/types/ must not import from anything else in src/
{
  name: 'no-types-imports',
  severity: 'error',
  from: { path: '^src/types/' },
  to: { path: '^src/(builder|ui|services|store|queries|actions|hooks|router)/' }
},
// src/mock/ must only import from src/types/
{
  name: 'mock-types-only',
  severity: 'error',
  from: { path: '^src/mock/' },
  to: { path: '^src/', pathNot: '^src/types/' }
}
```

Add to package.json scripts:
```json
"validate-layers": "depcruise src --validate .dependency-cruiser.js"
```

**Gate**: `npm run validate-layers` must return 0 violations.

---

### Step 6 — Document StageContext future split (informational only, no code change)

Add a comment block to `src/builder/stage/StageProvider.tsx` documenting the future split:

```typescript
/*
 * StageContext currently holds 28 values covering: selection, drag, view, timeline, and presentation.
 * Future: Split into SelectionContext, DragContext, ViewContext, TimelineContext.
 * Each split reduces the re-render surface for context consumers.
 * This split is post-v1 scope — do not attempt it without first mapping all consumers per context key.
 * Reference: FE-R2-state-flow.md (StageContext context values table)
 */
```

---

## Acceptance Criteria

```bash
# 1. No import layer violations
npm run validate-layers
# Expected: 0 errors

# 2. No files over 250 lines in actions/
wc -l src/actions/task.create.ts src/actions/task.update.ts src/actions/task.delete.ts
# Expected: all < 250

# 3. ReadinessCheckModal split
wc -l src/builder/islands/EditorViewerIsland/ReadinessCheckModal.tsx
# Expected: < 250

# 4. Old task.actions.ts deleted
ls src/actions/task.actions.ts 2>&1
# Expected: No such file

# 5. LightRays no longer imports from builder
grep -n 'builder/stage/StageProvider\|builder/stage\|StageProvider' src/ui/BuilderBg/LightRays.tsx
# Expected: 0 results

# 6. channel.icons moved to shared location
ls src/builder/shared/channel.icons.ts 2>/dev/null || ls src/utils/channel.icons.ts 2>/dev/null
# Expected: found (one of the two)

# 7. dep-cruiser installed
npx depcruise --version
# Expected: version string

# 8. Build passes
npm run build
# Expected: 0 errors
```

---

## Session log location

Save output to: `docs/plans/completed/src-structure-refactor/output/P3-file-structure-output.md`
