## DR-5 — Stale Docs Cleanup
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Remove or update outdated documents that consume agent tokens without providing accurate information
Trigger: docs-refactor plan README execution order
Requirements covered: None (doc-only sprint)

Files created:
  docs/plans/active/docs-refactor/sprints/DR-5.md  — sprint file with acceptance criteria (51 lines)
  docs/plans/active/README.md                       — explains active plans folder, lists current plan (22 lines)

Files edited:
  docs/architecture/builder/current-architecture.md — updated v0.2.15→v0.3.2, resolved all 10 known issues, fixed component hierarchy references (56 lines, was 56)
  docs/references/README.md                         — replaced stub with full reference table of codebase + doc resources (35 lines, was 11)

Files deleted: none

Churn — work reversed:
  None. Doc-only update sprint.

Preserve-semantic check:
  No source code touched. All doc changes are factual updates (version bumps, "known issues" → "resolved"). References README now accurately indexes existing material.

Open decisions used:
  None.

Acceptance criteria:
  □ AC1: current-architecture.md updated to v0.3.2 with completed tasks resolved — PASS
  □ AC2: docs/references/README.md lists all known reference materials — PASS (codebase + doc tables)
  □ AC3: docs/plans/active/README.md exists and describes the folder — PASS
  □ AC4: No active doc references v0.2.15 or gsap as current — PASS (verified: only archived/historical content)
  □ AC5: No source code changed — PASS
  □ AC6: typecheck + verify.sh pass — PASS

Gates:
  typecheck: PASS (0 errors)
  dev: N/A (no source changes)
  verify.sh: PASS
  browser manual check: N/A (doc-only sprint)

Consumer updates required:
  None. All updated docs are self-contained.

Open issues / follow-ups:
  No CSV files were found in docs/product/requirements/; item was moot
  docs/README.md already says v0.3.2 — no change needed
  gsap audit: all references are in archived/historical content only — no active docs reference it as current
  Next: DR-2 (Version Awareness System) per execution order
