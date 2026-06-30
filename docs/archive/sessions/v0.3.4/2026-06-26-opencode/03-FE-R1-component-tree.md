## FE-R1 — Component Tree + Dependencies
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-26
Status: Completed

Intent: Map the full component tree with parent→children relationships, context/store coupling, leaf atoms, and move risk assessment for P2.

Trigger: User request: "start with front end discovery first sprint"
Requirements covered: FE-R1 AC 1-5

Files created:
  - docs/plans/drafted/frontend-discovery/output/FE-R1-component-tree.md — full component tree analysis (328 lines)

Files edited: none
Files deleted: none

Churn — work reversed:
  None

Preserve-semantic check:
  No source files changed. All analysis based on generate-code-index.ts output and grep.

Open decisions used:
  None

Acceptance criteria:
  □ All 9 islands have a full component subtree in output — PASS (EditorViewerIsland, MetadataIsland, FocusIsland, KanbanBuilderIsland, SelectionIsland, TimelineBuilderIsland, ViewHelperIsland, HeaderUserIsland, HeaderBrandIsland)
  □ Context coupling map covers every component using useStageContext or useBuilderStore — PASS (40+ entries)
  □ Leaf atoms listed with props — PASS (30+ atoms)
  □ Every component has "can be moved safely" verdict — PASS (Safe: ~35, Care: ~8, Not safe: ~20)
  □ No source file changed — PASS

Key findings:
  - StageContext is the central coupling point (40+ dependents)
  - 2 store layers: builderStore (zustand) + StageContext (React context)
  - CardShell is surprisingly decoupled — only uses useCardBehavior
  - editor is the most complex island: 7 internal hooks, 2 store reads, 6 child subsections
  - TimelineBuilderIsland is simplest: 1 file, just button icons

Consumer updates required:
  None — data sprint only

Open issues / follow-ups:
  - FE-R2 (State + Data Flow Map) can now proceed
