## SA-R3 — Structure Assessment & Decision Doc
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Produce a written assessment of 5 confusion zones with options and trade-offs, for PO review
Trigger: SA-R3 sprint file, after SA-R1 completed
Input read: `output/SA-R1-dependency-graph.md`, `codebase-manifest.md`, `core.md §8`, plan README

Files created:
  docs/plans/active/src-structure-audit/output/SA-R3-structure-assessment.md  — 5 zones, options, prioritised action list, PO checklist (226 lines)

Files edited: none
Files deleted: none

Churn — work reversed: none

Preserve-semantic check:
  No source code in src/ was changed.

Key findings:
  Zone 1 — ALL 44 src/components/ files are builder-only (0 imported outside builder)
  Zone 2 — forms/ (28 files) are builder-only, recommended to move to src/builder/forms/
  Zone 3 — stage/views/ (25 files) has clear view groupings; extract shared helpers recommended
  Zone 4 — EditorViewerIsland (21 files) is well-structured; keep as-is
  Zone 5 — 2 files must split (task.actions.ts 288, ReadinessCheckModal.tsx 282)

Recommendations:
  Priority 1: Move components/forms/ → builder/forms/ (low risk, 18 import changes)
  Priority 2: Move remaining components/ → builder/components/ (low risk, 20 import changes)
  Priority 3: Move ui/BuilderBg/ → builder/background/ (resolves L2→L8 violation)
  Priority 4-5: Split the 2 oversized files (0 import changes)
  Priority 6: Sub-group stage/views/ shared helpers (medium risk, 20 import changes)
  Priority 7: Keep EditorViewerIsland as-is

  Things confirmed fine: actions/, services/, rules/, store/, types/, utils/, hooks/, cards/, pages/, brand/

Gates:
  No source code changed: PASS
  No packages installed: PASS

Next step: Plan pauses for PO approval of the decision doc checklist.
