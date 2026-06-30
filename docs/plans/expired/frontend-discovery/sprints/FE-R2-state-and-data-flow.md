---
sprint: FE-R2
plan: frontend-discovery
title: State + Data Flow Map
status: not-started
parallel-with: FE-R1
output: docs/plans/drafted/frontend-discovery/output/FE-R2-state-flow.md
assigned-to: Claude or Codex (grep + ts-morph, terminal required)
---

# FE-R2 — State + Data Flow Map

## Intent

Map where state lives, how data flows from queries to components, and which hooks are used where. This ensures P3 (file moves) doesn't accidentally break the data pipeline by moving a file that a context or hook depends on in a non-obvious way.

**No source file changes.**

---

## Extraction Tasks

### Task 1 — State inventory

Three state layers exist. Map what lives in each:

#### Zustand store (`src/store/`)
```bash
cat src/store/builderStore.ts
```
List every state field and every action. For each state field, grep which components read it:
```bash
grep -rn "useBuilderStore" src/ --include="*.tsx" --include="*.ts" | sort
```

#### React context (`src/builder/stage/StageProvider.tsx`)
```bash
cat src/builder/stage/StageProvider.tsx
```
List every value exposed in the context. For each, grep which components consume it:
```bash
grep -rn "useStageContext" src/ --include="*.tsx" --include="*.ts" | sort
```

#### Local component state (`useState`)
```bash
grep -rn "useState" src/ --include="*.tsx" | wc -l  # total count
grep -rn "useState" src/builder/islands/ --include="*.tsx" | sort  # per island
```

Categorise local state by what it controls: UI toggle (open/close), form draft value, hover/focus, loading state.

---

### Task 2 — Data flow from query to component

For each query in `src/queries/`:
```bash
ls src/queries/
```

Trace the path: `query file → service call → mapper → domain type → component prop`.

Example:
```
src/queries/useVersionQuery.ts
  → calls src/services/versions.service.ts
    → calls mock data (src/mock/)
      → returns RawVersion
        → passes through versions.mapper (if exists)
          → returns Version (domain type)
            → consumed by: MetadataIsland, StageProvider
```

Identify:
- Which queries go through a mapper (correctly separated)
- Which queries return raw/un-mapped data directly to components (problem)
- Which components receive data as props vs call hooks directly

---

### Task 3 — Hook dependency map

For each custom hook in `src/hooks/` and each hook in island folders:

```bash
find src -name "use*.ts" -o -name "use*.tsx" | grep -v node_modules | sort
```

For each hook:
- What does it read? (context, store, props, local state, queries)
- What does it return?
- Which components use it?
- Can it be moved without breaking its consumers?

---

### Task 4 — Action flow

For each file in `src/actions/`:
```bash
ls src/actions/
```

For each action:
- What does it call? (service, store mutation, query invalidation)
- Which components dispatch it?

```bash
grep -rn "import.*actions" src/ --include="*.tsx" --include="*.ts" | sort
```

---

## Output Format

```markdown
# FE-R2: State + Data Flow Map

## Zustand Store (`src/store/builderStore.ts`)

### State fields
| Field | Type | Read by (components) | Written by (components/actions) |
|---|---|---|---|
| selectedPlanId | string | MetadataIsland, BuilderPage | action: setSelectedPlan |

### Store actions
| Action | Called by |
|---|---|
| setSelectedPlan | MetadataIsland, header buttons |

## Stage Context (`StageProvider.tsx`)

### Context values
| Value | Type | Consumed by |
|---|---|---|
| nodes | Node[] | EditorViewerIsland, FocusIsland, KanbanView, WeeklyView, … |
| selectedNodeIds | string[] | 8 files |

## Local State Summary

| Pattern | Count | Examples |
|---|---|---|
| UI open/close toggle | 12 | isOpen in FocusIsland, MetadataIsland |
| Form draft | 4 | EditorDraft in TaskEditor |
| Hover/focus | 6 | isHovered in CardShell |

## Data Flow Paths

### Version data
query → service → mapper → domain type → component
[trace here]

### Task data
[trace here]

## Hook Map

| Hook | File | Reads | Returns | Used by |
|---|---|---|---|---|
| useEditorPanel | EditorViewerIsland/ | StageContext | panel state + handlers | EditorViewerIsland |
| useActiveNode | EditorViewerIsland/ | StageContext.selectedNodeIds, nodes | activeNode: Node | TaskEditor |

## Data Layer Problems Found

| Problem | File | Details |
|---|---|---|
| Raw data used directly | src/queries/useChannelQuery.ts | Returns unmapped RawChannel, no mapper called |
| any type in mapper | src/services/api-mappers.ts:45 | mapAction(raw: any) — no type safety |
```

---

## Acceptance Criteria

- [ ] Zustand store fields and consumers fully listed
- [ ] StageContext values and consumers fully listed
- [ ] Local state categorised (toggle / form / hover / loading)
- [ ] At least 3 data flow paths traced end-to-end
- [ ] Hook map covers all hooks in `src/hooks/` and `src/builder/islands/`
- [ ] Data layer problems (unmapped queries, `any` types) listed
- [ ] No source file changed
