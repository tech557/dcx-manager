## SA-R2 — Candidate Tool Evaluation
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Evaluate 3–5 tools for code structure inspection and recommend 1–2 for adoption
Trigger: src-structure-audit plan — SA-R2 sprint
Requirements covered: None (research sprint)

Files created:
  docs/references/tool-evaluation.md           — 6 tools evaluated across 4 criteria (136 lines)
  docs/plans/active/src-structure-audit/sprints/SA-R2.md  — sprint file (34 lines)

Files edited: none
Files deleted: none

Churn — work reversed:
  None. Research sprint with no source code changes.

Preserve-semantic check:
  No source code in src/ was changed.

Open decisions used:
  None.

Recommendation:
  ✅ **Adopt dependency-cruiser** for CI-enforceable import rules
  ✅ **Keep ts-morph** (already installed) for deep ad-hoc analysis
  Install: `npm i -D dependency-cruiser`
  First rules: block ui→builder and components→builder imports

Gates:
  typecheck: PASS (0 errors)
  verify.sh: PASS

Next steps:
  SA-R3: Structure assessment based on SA-R1 findings + produce builder-decisions doc
