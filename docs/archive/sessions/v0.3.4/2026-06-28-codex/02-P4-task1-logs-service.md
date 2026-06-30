## P4 — Step 1 Wire logs.service.ts To apiClient
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Route activity-log service calls through the `apiClient` seam without introducing mock-dispatch recursion.
Trigger: P4 Step 1.
Requirements covered: P4 Step 1; backend-discovery-v2 service seam requirement.

Files created: docs/progress/sessions/2026-06-28-codex/02-P4-task1-logs-service.md - task log (42 lines)
Files edited: src/services/logs.service.ts - replaced direct mock storage reads/writes with `apiClient` calls (30 lines); src/services/mock-dispatch.ts - added internal activity-log mock handlers and removed route dependency on `logs.service.ts` (189 lines); docs/plans/active/folder-structure-v2/sprints/P4-backend-readiness.md - Step 1 marked complete (442 lines, was 442); docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md - Step 1 result recorded (279 lines, was 273)
Files deleted: None

Churn - work reversed:
  None

Preserve-semantic check:
  Service boundary preserved: app-facing `logs.service.ts` now calls `apiClient`; mock persistence stays inside the retained dev/mock layer. No UI, shell, component, route, or token files changed.

Open decisions used:
  None

Acceptance criteria:
  PASS - `logs.service.ts` has 0 references to `readMockJson` or `writeMockJson`.
  PASS - `GET /versions/:versionId/activity-logs` still returns filtered logs through mock-dispatch.
  PASS - `POST /activity-logs` still persists lifecycle logs through mock-dispatch.
  PASS - Recursion avoided by removing `logs.service.ts` imports from `mock-dispatch.ts`.

Gates:
  typecheck: PASS - `npm run typecheck`
  test: PASS - `npm run test`, 6 files and 27 tests passed
  dev: N/A - no UI/browser behavior changed
  verify.sh: N/A - task-specific gates run
  browser manual check: N/A - service-only step; unconfigured MCP checks left for opencode

Consumer updates required:
  None. Existing imports of `getActivityLogs` and `writeLifecycleLog` keep the same public signatures.

Open issues / follow-ups:
  `mock-dispatch.ts` still imports public functions from the remaining unmigrated services. Continue separating handlers before each service migration.
