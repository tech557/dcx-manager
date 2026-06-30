## FE-R2 — State + Data Flow Map
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-26
Status: Completed

Intent: Map where state lives, how data flows from queries to components, and which hooks are used where — to prevent P3 from breaking data pipelines.

Trigger: User request: "yes" — proceed to FE-R2
Requirements covered: FE-R2 AC 1-7

Files created:
  - docs/plans/drafted/frontend-discovery/output/FE-R2-state-flow.md — full state + data flow map (317 lines)

Files edited: none
Files deleted: none

Churn — work reversed:
  None

Preserve-semantic check:
  No source files changed. Analysis based on grep + code reading of builderStore, StageProvider, queries, actions, api-mappers.

Acceptance criteria:
  □ Zustand store fields and consumers fully listed — PASS (9 fields, 16 actions)
  □ StageContext values and consumers fully listed — PASS (28 values, 40+ components)
  □ Local state categorised — PASS (131 useState calls in 5 categories)
  □ At least 3 data flow paths traced end-to-end — PASS (5 paths: nodes, channels, versions, subtask-defs, users)
  □ Hook map covers all hooks — PASS (30 hooks across src/hooks/, islands, stage, forms)
  □ Data layer problems listed — PASS (6 problems found)
  □ No source file changed — PASS

Key findings:
  - Clean action boundary: all mutations through useBuilderActions → store.updateNodes
  - Clean query→mapper pattern: 5/6 queries use dedicated mappers (users query skips it)
  - Split selection state: selectedNodeIds/focusedNodeId exist in both builderStore and StageContext — StageContext is the active source, builderStore copy appears stale
  - StageContext is too large: 28 context values — any consumer gets all 28
  - 131 useState calls, heaviest in MetadataIsland (7) and editor area
  - No query invalidation after mutations — would cause stale data with real API

Consumer updates required:
  None — data sprint only

Open issues / follow-ups:
  - FE-R3 (Duplication + Consolidation Map) can now proceed
