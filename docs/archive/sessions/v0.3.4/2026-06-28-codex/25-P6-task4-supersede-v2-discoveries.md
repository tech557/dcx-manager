## P6 — Step 4 Supersede v2 Discoveries
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Protect future final-discovery plans from treating pre-refactor v2 discovery counts as current truth.
Trigger: P6 Step 4.
Requirements covered: P6 Step 4.

Files created: docs/progress/sessions/2026-06-28-codex/25-P6-task4-supersede-v2-discoveries.md - task log (38 lines before count patch)
Files edited: docs/plans/completed/ux-discovery-v2/README.md - superseded banner added (81 lines); docs/plans/completed/frontend-discovery-v2/README.md - superseded banner added (67 lines); docs/plans/completed/backend-discovery-v2/README.md - superseded banner added (54 lines); docs/plans/active/folder-structure-v2/output/P6-closeout-coherence.md - Step 4 evidence added (323 lines); docs/plans/active/folder-structure-v2/sprints/P6-closeout-coherence.md - Step 4 marked complete (196 lines)
Files deleted: None

Churn - work reversed:
  None.

Preserve-semantic check:
  PASS - Documentation-only update. No source behavior changed.

Open decisions used:
  P6 instruction to mark UX/FE/BE v2 discovery outputs as superseded after folder-structure-v2 P1-P6 execution.

Acceptance criteria:
  PASS - UX discovery README carries superseded banner.
  PASS - Frontend discovery README carries superseded banner.
  PASS - Backend discovery README carries superseded banner.
  PASS - All banners point future agents to docs/product/decisions/src-structure-decision.md for live structural truth.

Gates:
  PASS - Manual file check confirmed all three target READMEs exist and were updated.

Consumer updates required:
  Future FE-final-discovery, FE-final-implementation, BE-final-discovery, and BE-final-implementation work must re-discover against the live tree rather than reusing v2 counts.

Open issues / follow-ups:
  None for Step 4.
