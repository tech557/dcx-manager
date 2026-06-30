## P4 — Step 3 Wire channels.service.ts To apiClient
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Route channel and composition service calls through `apiClient` while preserving composition creation side effects.
Trigger: P4 Step 3.
Requirements covered: P4 Step 3; mock API completeness for channels and compositions.

Files created: docs/progress/sessions/2026-06-28-codex/04-P4-task3-channels-service.md - task log (43 lines)
Files edited: src/services/channels.service.ts - replaced direct mock storage reads/writes with `apiClient` route calls (36 lines); src/services/mock-dispatch.ts - added internal channel/composition mock handlers and removed route dependency on `channels.service.ts` (272 lines); docs/plans/active/folder-structure-v2/sprints/P4-backend-readiness.md - Step 3 marked complete (442 lines, was 442); docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md - Step 3 result recorded (291 lines, was 285)
Files deleted: None

Churn - work reversed:
  None

Preserve-semantic check:
  Channel and composition semantics preserved: composition creation still writes the composition and updates the channel's available composition ids. No UI, shell, component, route, or token files changed.

Open decisions used:
  None

Acceptance criteria:
  PASS - `channels.service.ts` uses `apiClient`.
  PASS - `channels.service.ts` has 0 references to `readMockJson` or `writeMockJson`.
  PASS - `GET /api/channels`, `GET /api/channels/:channelId/compositions`, and `POST /api/channels/:channelId/compositions` remain covered in `mock-dispatch.ts`.
  PASS - Composition creation side effect remains in the mock backend.
  PASS - Recursion avoided by removing `channels.service.ts` imports from `mock-dispatch.ts`.

Gates:
  typecheck: PASS - `npm run typecheck`
  test: PASS - `npm run test`, 6 files and 27 tests passed
  dev: N/A - no browser run for this task
  verify.sh: N/A - task-specific gates run
  browser manual check: Deferred - channel/composition browser flow left for opencode MCP checks

Consumer updates required:
  None. Existing imports of `getChannels`, `getCompositions`, and `createComposition` keep the same public signatures.

Open issues / follow-ups:
  Browser proof for the channel/composition flow is deferred to opencode because requested MCP checks are unconfigured in this Codex session.
