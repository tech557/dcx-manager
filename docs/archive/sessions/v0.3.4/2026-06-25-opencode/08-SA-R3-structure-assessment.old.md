## SA-R3 — Current Structure Assessment
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Produce written assessment of src/ structure and a decision document for PO review
Trigger: src-structure-audit plan — SA-R3 sprint
Requirements covered: None (research sprint — no file moves)

Files created:
  docs/product/decisions/src-structure-decision.md   — 5 area assessment + 5 decisions (147 lines)
  docs/plans/active/src-structure-audit/sprints/SA-R3.md  — sprint file (41 lines)

Files edited: none
Files deleted: none

Churn — work reversed:
  None. Research sprint with no source code changes.

Preserve-semantic check:
  No source code in src/ was changed.

Open decisions used:
  None — decision doc is in "Proposed" status awaiting PO approval.

Key findings:
  1. src/components/forms/ (29 files) is entirely builder-specific — recommended move to src/builder/forms/
  2. src/ui/BuilderBg/ violates L1→L8 — recommended move to src/builder/background/
  3. src/builder/stage/views/ (25 files) is flat — recommended sub-grouping (kanban, timeline, shared)
  4. EditorViewerIsland/TaskEditor/ is correctly placed — keep
  5. services/ (13 files) is fine as-is — keep

Layer violations resolved:
  V1 (ui→builder): Fixed by D2 (move BuilderBg)
  V2-V3 (components→builder): Fixed by D1 (move channel forms)
  V4-V5: Not violations — foundational layers

Circular dependency builder↔components: Resolved by D1 (cycle was caused by channel form imports)

Proposed decisions (all awaiting PO):
  D1: Move src/components/forms/channel/ → src/builder/forms/channel/ (6 files, low risk)
  D2: Move src/ui/BuilderBg/ → src/builder/background/ (2 files, low risk)
  D3: Sub-group src/builder/stage/views/ (25 files, high risk — dedicated sprint)
  D4: Keep EditorViewerIsland/TaskEditor/ as-is
  D5: Keep services/ as-is

Gates:
  typecheck: PASS (0 errors)
  verify.sh: PASS

Next steps:
  Await PO review of docs/product/decisions/src-structure-decision.md
  If approved → create new plan (src-structure-refactor) with one sprint per folder move
