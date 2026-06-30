## P4 — Step 6 Wire versions.service.ts To apiClient
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Route version list/detail/status/date/duplicate operations through `apiClient` while preserving lifecycle rules.
Trigger: P4 Step 6.
Requirements covered: P4 Step 6; lifecycle/status preservation; mock API completeness for versions.

Files created: docs/progress/sessions/2026-06-28-codex/07-P4-task6-versions-service.md - task log (43 lines)
Files edited: src/services/versions.service.ts - replaced direct mock storage and lifecycle writes with `apiClient` route calls (52 lines); src/services/mock-dispatch.ts - added internal version lifecycle handlers and removed route dependency on `versions.service.ts` (515 lines); docs/plans/active/folder-structure-v2/sprints/P4-backend-readiness.md - Step 6 marked complete (442 lines, was 442); docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md - Step 6 result recorded (310 lines, was 304)
Files deleted: None

Churn - work reversed:
  None

Preserve-semantic check:
  Version semantics preserved in the mock backend: illegal transitions still throw, approval still requires a communication date, approved versions still supersede siblings, date updates still refresh update metadata, and duplicate still attempts to copy builder phases. No UI, shell, component, route, or token files changed.

Open decisions used:
  None

Acceptance criteria:
  PASS - `versions.service.ts` uses `apiClient`.
  PASS - `versions.service.ts` has 0 references to `readMockJson` or `writeMockJson`.
  PASS - Version list, detail, status, date, and duplicate routes remain covered in `mock-dispatch.ts`.
  PASS - Status transition logic is preserved in `mock-dispatch.ts`.
  PASS - Recursion avoided by removing `versions.service.ts` imports from `mock-dispatch.ts`.

Gates:
  typecheck: PASS - `npm run typecheck`
  test: PASS - `npm run test`, 6 files and 27 tests passed
  dev: N/A - no browser run for this task
  verify.sh: N/A - task-specific gates run
  browser manual check: Deferred - version lifecycle browser proof left for opencode MCP checks

Consumer updates required:
  None. Existing imports of version service functions keep the same public signatures.

Open issues / follow-ups:
  Duplicate still uses the unmigrated builder service to copy builder phases. Step 7 must move builder handlers into `mock-dispatch.ts` before migrating `builder.service.ts`.
