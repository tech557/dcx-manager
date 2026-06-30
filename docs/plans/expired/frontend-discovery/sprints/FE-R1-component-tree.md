---
sprint: FE-R1
plan: frontend-discovery
title: Component Tree + Dependencies
status: not-started
parallel-with: FE-R2
output: docs/plans/drafted/frontend-discovery/output/FE-R1-component-tree.md
assigned-to: Claude or Codex (ts-morph script, terminal required)
---

# FE-R1 — Component Tree + Dependencies

## Intent

Use `ts-morph` (already installed) to walk every TSX file and extract: what components it renders, what props it receives, what it imports. Produce a tree from `src/pages/` down to the leaf atoms, so we know the exact blast radius of any move or split.

**No source file changes.**

---

## Extraction Tasks

### Task 1 — Extend or run `scripts/generate-code-index.ts`

The script already tracks `childComponentsUsed` and `props`. Run it and review its output:

```bash
npx tsx scripts/generate-code-index.ts 2>&1 | head -100
```

If it writes to a file: read that file. If it prints to stdout: capture it. Determine:
- Does it produce a component tree? (parent → children relationships)
- Does it capture which file each child component comes from?
- Does it capture context hooks used?

If yes: use the output directly. If no: write `scripts/gen-component-tree.ts` that produces the missing data.

---

### Task 2 — For each island, map its component tree

The builder has 9 islands. For each, trace the full component subtree:

```
EditorViewerIsland
  └── EditorHeader
  └── TaskEditor/TaskEditor
        └── TaskSection1
        └── TaskSection3
        └── TaskSection4
              └── RoutingDirectorySection
  └── useEditorPanel (hook)
  └── useEditorDraft (hook)
  └── useActiveNode (hook — from StageProvider context)
```

Produce this tree for: `EditorViewerIsland`, `MetadataIsland`, `FocusIsland`, `KanbanBuilderIsland`, `TimelineBuilderIsland`, `HeaderUserIsland`, `SelectionIsland`, `ViewHelperIsland`, `BuilderIslandShell`.

---

### Task 3 — Map context dependencies

Which components call `useStageContext()`? Which call `useBuilderStore()`? Which read from `src/queries/`?

```bash
grep -rn "useStageContext\|useBuilderStore\|useQuery\|useMutation" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules" | sort
```

This identifies which components are context-coupled (cannot be moved without moving context access with them) vs pure/presentational (can be moved safely).

---

### Task 4 — Identify leaf atoms (components with no children)

A leaf atom renders only HTML elements and receives only primitive props. These are the safest to extract into `src/ui/atoms/`.

```ts
// In gen-component-tree.ts, a component is a leaf if:
childComponentsUsed.filter(c => c.origin === 'project').length === 0
```

List every leaf atom: name, file path, what props it accepts.

---

## Output Format

```markdown
# FE-R1: Component Tree + Dependencies

## Full Component Tree (by island)

### EditorViewerIsland (src/builder/islands/EditorViewerIsland/)
- EditorViewerIsland.tsx
  - EditorHeader.tsx (child)
  - TaskEditor/TaskEditor.tsx (child)
    - TaskSection1.tsx (child)
    - TaskSection3.tsx (child)
    - TaskSection4.tsx (child)
      - RoutingDirectorySection.tsx (child)
      - [forms imported from src/components/forms/date/, inputs/, selects/]
  hooks: useEditorPanel, useEditorDraft
  context: useStageContext (reads: selectedNodeIds, nodes)

### MetadataIsland ...

## Context + Store Coupling Map

| Component | useStageContext reads | useBuilderStore reads | Queries used |
|---|---|---|---|
| EditorViewerIsland | selectedNodeIds, nodes, expandedNodeIds | — | — |

## Leaf Atoms (safe to extract to ui/atoms/)

| Component | File | Props |
|---|---|---|
| StatusBadge | src/ui/StatusBadge.tsx | status, size, label |
| DividerLine | src/ui/DividerLine.tsx | orientation, className |

## Move Risk Assessment

| Component | Can be moved safely? | Reason |
|---|---|---|
| CardShell (extracted from index.css) | Yes | No context deps, pure CSS |
| TaskEditor | No — not standalone | Depends on useEditorDraft which reads StageContext |
```

---

## Acceptance Criteria

- [ ] All 9 islands have a full component subtree in the output
- [ ] Context coupling map covers every component that calls `useStageContext` or `useBuilderStore`
- [ ] Leaf atoms are listed with props
- [ ] Every component has a "can be moved safely" verdict with reason
- [ ] No source file changed
