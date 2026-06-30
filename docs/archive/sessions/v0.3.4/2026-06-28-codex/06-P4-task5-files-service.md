## P4 — Step 5 Wire files.service.ts To apiClient
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Route version file reads/writes through `apiClient` and ensure attachment persistence happens in the mock backend.
Trigger: P4 Step 5.
Requirements covered: P4 Step 5; BE2 attachVersionFile gap; mock API completeness for version files.

Files created: docs/progress/sessions/2026-06-28-codex/06-P4-task5-files-service.md - task log (43 lines)
Files edited: src/services/files.service.ts - replaced direct version storage reads/writes with `apiClient` route calls (22 lines); src/services/mock-dispatch.ts - added version-store helpers and file attachment mock handlers, removed route dependency on `files.service.ts` (383 lines); docs/plans/active/folder-structure-v2/sprints/P4-backend-readiness.md - Step 5 marked complete (442 lines, was 442); docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md - Step 5 result recorded (304 lines, was 297)
Files deleted: None

Churn - work reversed:
  None

Preserve-semantic check:
  File semantics improved within P4 scope: attachments are written to the version record in the mock backend instead of relying on app-facing service storage. No UI, shell, component, route, or token files changed.

Open decisions used:
  None

Acceptance criteria:
  PASS - `files.service.ts` uses `apiClient`.
  PASS - `files.service.ts` has 0 references to `readMockJson` or `writeMockJson`.
  PASS - `GET /versions/:versionId/files` and `POST /versions/:versionId/files` remain covered in `mock-dispatch.ts`.
  PASS - `attachVersionFile` persists the file onto the matching version's attachments.
  PASS - Recursion avoided by removing `files.service.ts` imports from `mock-dispatch.ts`.

Gates:
  typecheck: PASS - `npm run typecheck`; rerun after import cleanup also PASS
  test: PASS - `npm run test`, 6 files and 27 tests passed
  dev: N/A - no browser run for this task
  verify.sh: N/A - task-specific gates run
  browser manual check: Deferred - file attachment persistence browser proof left for opencode MCP checks

Consumer updates required:
  None. Existing imports of `getVersionFiles` and `attachVersionFile` keep the same public signatures.

Open issues / follow-ups:
  Browser proof for file attachment persistence is deferred to opencode because requested MCP checks are unconfigured in this Codex session.
