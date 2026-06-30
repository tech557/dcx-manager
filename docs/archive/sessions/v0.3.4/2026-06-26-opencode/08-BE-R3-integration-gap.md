## BE-R3 — Integration Gap Analysis
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-26
Status: Completed

Intent: Combine BE-R1 (type inventory) and BE-R2 (service audit) to answer what breaks if the app points at a real API, and produce a prioritised P4 fix list.

Trigger: User request: "yes" — proceed to BE-R3
Requirements covered: BE-R3 AC 1-5

Files created:
  - docs/plans/drafted/backend-discovery/output/BE-R3-integration-gap.md — full integration gap analysis (196 lines)

Files edited: none
Files deleted: none

Churn — work reversed:
  None

Preserve-semantic check:
  No source files changed.

Acceptance criteria:
  □ All three scenarios analysed with blast radius estimate — PASS (Scenario A: same-shape API, B: snake_case, C: nested structure)
  □ Type split plan covers all ambiguous types from BE-R1 — PASS (0 ambiguous types found — current split is correct; 10 duplicate types identified for removal instead)
  □ P4 fix list is prioritised and specific — PASS (6 priority levels, 17 fixes + 4 PO decisions, with file names and effort estimates)
  □ PO decisions are clearly separated from implementation tasks — PASS (Section "Priority 6 — PO decisions needed" has 4 items A-D)
  □ No source file changed — PASS

Gates:
  typecheck: N/A — data sprint
  dev: N/A — data sprint
  verify.sh: N/A — data sprint
  browser manual check: N/A — data sprint

Consumer updates required:
  None — data sprint only.

Open issues / follow-ups:
  - Backend-discovery plan complete — move to docs/plans/completed/
  - Key finding: 0 services make network calls. apiClient() seam exists but throws. Mappers survive unchanged.
  - All planned discovery sprints across UI/UX, frontend, and backend are now complete. Ready for P2 (Polish) / P4 (Backend).
