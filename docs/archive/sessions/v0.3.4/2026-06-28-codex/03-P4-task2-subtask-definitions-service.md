## P4 — Step 2 Wire subtask-definitions.service.ts To apiClient
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Route subtask-definition reads through the `apiClient` seam while preserving mock fixture fallback.
Trigger: P4 Step 2.
Requirements covered: P4 Step 2; mock API completeness for subtask definitions.

Files created: docs/progress/sessions/2026-06-28-codex/03-P4-task2-subtask-definitions-service.md - task log (42 lines)
Files edited: src/services/subtask-definitions.service.ts - replaced direct mock storage read/filtering with `apiClient` route calls (12 lines); src/services/mock-dispatch.ts - added internal subtask-definition mock handler and removed route dependency on `subtask-definitions.service.ts` (203 lines); docs/plans/active/folder-structure-v2/sprints/P4-backend-readiness.md - Step 2 marked complete (442 lines, was 442); docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md - Step 2 result recorded (285 lines, was 279)
Files deleted: None

Churn - work reversed:
  None

Preserve-semantic check:
  Service boundary preserved: app-facing subtask reads now use `apiClient`; mock fixture fallback remains in the retained dev/mock layer. No UI, shell, component, route, or token files changed.

Open decisions used:
  None

Acceptance criteria:
  PASS - `subtask-definitions.service.ts` uses `apiClient`.
  PASS - `subtask-definitions.service.ts` has 0 references to `readMockJson` or `writeMockJson`.
  PASS - Both all-definition and channel-filtered routes remain covered in `mock-dispatch.ts`.
  PASS - Recursion avoided by removing `subtask-definitions.service.ts` imports from `mock-dispatch.ts`.

Gates:
  typecheck: PASS - `npm run typecheck`
  test: PASS - `npm run test`, 6 files and 27 tests passed
  dev: N/A - no UI/browser behavior changed
  verify.sh: N/A - task-specific gates run
  browser manual check: N/A - service-only step; unconfigured MCP checks left for opencode

Consumer updates required:
  None. Existing imports of `getSubtaskDefinitions` keep the same public signature.

Open issues / follow-ups:
  `mock-dispatch.ts` still imports public functions from the remaining unmigrated services. Continue separating handlers before each service migration.
