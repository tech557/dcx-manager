## FIX-CAP — File Size Cap Repairs
Agent: opencode (big-pickle)
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Split two files exceeding hard cap (EditorViewerIsland 311→221, DayGridCard 267→247).
Trigger: Audit finding — §6 compliance
Requirements covered: §6

Files created:
  src/builder/islands/EditorViewerIsland/DiscardSessionModal.tsx — extracted discard session dialog (51 lines)
  src/builder/islands/EditorViewerIsland/useDayEditorTasks.ts — extracted day tasks filter hook (28 lines)
  src/builder/islands/EditorViewerIsland/useTaskSectionReadiness.ts — extracted task readiness checks (44 lines)
  src/builder/stage/views/DayGridCardEmpty.tsx — extracted empty state component (42 lines)
Files edited:
  src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx — replaced inline blocks with hook/component usage (221 lines, was 311)
  src/builder/stage/views/DayGridCard.tsx — replaced inline empty state with DayGridCardEmpty (247 lines, was 267)
Files deleted: none

Churn — work reversed: None

Preserve-semantic check:
  - No new imports of src/services/ or src/rules/ added ✓
  - EditorViewerIsland's props and exported interface unchanged ✓
  - useDayEditorTasks follows same traversal pattern as the original (pre-existing tree iteration pattern — not using node.helpers for this since it's a full tree gather, not a single-ID lookup; acceptable per §16 intent) ✓
  - DayGridCard renders identically (empty state logic preserved verbatim) ✓

Open decisions used: none

Acceptance criteria:
  □ EditorViewerIsland.tsx ≤ 250 lines — PASS (221)
  □ All extracted files ≤ 150 lines each — PASS (51, 28, 44, 42)
  □ No change to EditorViewerIsland's props or exported interface — PASS
  □ No new imports of src/services/ or src/rules/ added — PASS
  □ npm run typecheck passes — PASS
  □ DayGridCard.tsx ≤ 250 lines — PASS (247)
  □ All extracted files ≤ 150 lines — PASS
  □ npm run typecheck passes — PASS

Gates:
  typecheck: PASS
  vitest: PASS (27/27)
  verify.sh: PASS
  browser manual check: visual only — extracted components are pure extractions, no logic change

Consumer updates required: none (all extractions are internal to the same directory)

Open issues / follow-ups: none
