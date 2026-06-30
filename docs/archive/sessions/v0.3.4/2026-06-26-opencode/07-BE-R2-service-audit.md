## BE-R2 — Service Layer Audit
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-26
Status: Completed

Intent: Read every file in src/services/ and src/actions/, catalogue exported functions, identify any usages, map mapper coverage, and assess real API readiness.

Trigger: User request: "yes" — proceed to BE-R2
Requirements covered: BE-R2 AC 1-6

Files created:
  - docs/plans/drafted/backend-discovery/output/BE-R2-service-audit.md — full service + action audit (280 lines)

Files edited: none
Files deleted: none

Churn — work reversed:
  None

Preserve-semantic check:
  No source files changed.

Acceptance criteria:
  □ Every exported function in every service file listed — PASS (17 functions across 12 files)
  □ Every exported action listed — PASS (17 actions across 7 action files)
  □ All any usages in services and actions listed with proposed types — PASS (0 found — cleanest layer in codebase)
  □ Mapper coverage table shows which entities have typed mappers — PASS (12/12 entities, 100% coverage)
  □ "Real API readiness" verdict per service file — PASS (all 12 services assessed)
  □ No source file changed — PASS

Gates:
  typecheck: N/A — data sprint
  dev: N/A — data sprint
  verify.sh: N/A — data sprint
  browser manual check: N/A — data sprint

Consumer updates required:
  None — data sprint only.

Open issues / follow-ups:
  - All services depend on localStorage (readMockJson/writeMockJson). apiClient() seam exists but throws.
  - Mappers layer is the only piece ready for backend swap — 100% typed, no any, full coverage.
  - Builder mutations never notify react-query cache — works because zustand drives re-render directly, but P4 must consider invalidation strategy.
  - BE-R3 (Integration Gap Analysis) can now start — BE-R1 + BE-R2 are both complete.
