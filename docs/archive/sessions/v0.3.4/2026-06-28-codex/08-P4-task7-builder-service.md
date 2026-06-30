## P4 — Step 7 Wire builder.service.ts To apiClient
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Route builder tree reads/writes through `apiClient` while preserving mock builder seed/save behavior in the dispatcher.
Trigger: P4 Step 7.
Requirements covered: P4 Step 7; mock API completeness for builder.

Files created: docs/progress/sessions/2026-06-28-codex/08-P4-task7-builder-service.md - task log (42 lines)
Files edited: src/services/builder.service.ts - replaced direct version/storage reads and builder writes with `apiClient` route calls (22 lines); src/services/mock-dispatch.ts - added internal builder seed/save handlers and removed route dependency on `builder.service.ts` (592 lines); docs/plans/active/folder-structure-v2/sprints/P4-backend-readiness.md - Step 7 marked complete (442 lines, was 442); docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md - Step 7 result recorded (316 lines, was 310)
Files deleted: None

Churn - work reversed:
  None

Preserve-semantic check:
  Builder semantics preserved in the mock backend: initial mock phases still load, saves persist by version id, and duplicate version builder-copy now uses internal mock helpers. No UI, shell, component, route, or token files changed.

Open decisions used:
  None

Acceptance criteria:
  PASS - `builder.service.ts` uses `apiClient`.
  PASS - `builder.service.ts` has 0 references to `readMockJson` or `writeMockJson`.
  PASS - Builder GET/PATCH routes remain covered in `mock-dispatch.ts`.
  PASS - Recursion avoided by removing `builder.service.ts` imports from `mock-dispatch.ts`.

Gates:
  typecheck: PASS - `npm run typecheck`
  test: PASS - `npm run test`, 6 files and 27 tests passed
  dev: N/A - no browser run for this task
  verify.sh: N/A - task-specific gates run
  browser manual check: Deferred - builder browser proof left for opencode MCP checks

Consumer updates required:
  None. Existing imports of `getBuilder` and `saveBuilder` keep the same public signatures.

Open issues / follow-ups:
  Step 8 cleanup must remove `readMockJson`/`writeMockJson` from `api-client.ts`, delete `safe-storage.ts`, and prove no app-facing service bypasses the seam.
