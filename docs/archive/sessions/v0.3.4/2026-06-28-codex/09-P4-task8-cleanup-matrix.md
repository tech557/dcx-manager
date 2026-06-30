## P4 — Step 8 Cleanup And Mock API Completeness Matrix
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Remove the old mock storage helper seam, delete `safe-storage.ts`, and prove every app-facing data domain is covered by the mock API seam.
Trigger: P4 Step 8.
Requirements covered: P4 Step 8; P4 Step 8f; backend mock API completeness requirement.

Files created: src/services/mock/store.ts - mock storage helper (34 lines); src/services/mock/channels.mock.ts - channel/composition mock handlers (68 lines); src/services/mock/logs.mock.ts - activity-log mock handlers (33 lines); src/services/mock/subtasks.mock.ts - subtask-definition mock handler (18 lines); src/services/mock/access.mock.ts - access mock handlers (22 lines); src/services/mock/builder.mock.ts - builder mock handlers (80 lines); src/services/mock/versions.mock.ts - version/file lifecycle mock handlers (226 lines); src/utils/browser-storage.helpers.ts - guarded browser localStorage helper for non-backend UI state (7 lines); docs/progress/sessions/2026-06-28-codex/09-P4-task8-cleanup-matrix.md - task log (46 lines)
Files edited: src/services/api-client.ts - removed `readMockJson`/`writeMockJson` and safe-storage import (21 lines); src/services/mock-dispatch.ts - replaced large handler implementation with slim route dispatcher (106 lines); src/utils/preference.helpers.ts - replaced safe-storage import with browser-storage helper (40 lines); src/builder/islands/EditorViewerIsland/useEditorState.ts - replaced safe-storage import with browser-storage helper; existing P3 cap overage remains (375 lines); docs/plans/active/folder-structure-v2/sprints/P4-backend-readiness.md - Step 8 marked complete (442 lines, was 442); docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md - cleanup matrix and Step 8 gates recorded (352 lines, was 316)
Files deleted: src/utils/safe-storage.ts - obsolete storage utility removed after all source references were replaced

Churn - work reversed:
  None

Preserve-semantic check:
  Backend seam semantics preserved: public services route through `apiClient`; mock persistence stays in the retained dev/mock backend; clickup and AI remain explicit pure stubs. No component, shell, token, or route UI behavior changed. `useEditorState.ts` was touched only to replace the deleted storage helper import; its pre-existing P3 file-size debt was not expanded.

Open decisions used:
  None

Acceptance criteria:
  PASS - `readMockJson` / `writeMockJson` removed from `api-client.ts`.
  PASS - `src/utils/safe-storage.ts` deleted and all source references removed.
  PASS - `mock-dispatch.ts` retained and documented as dev/mock dispatcher.
  PASS - `src/mock/*` retained as fixtures.
  PASS - `src/services/mock/*` created to keep mock backend below file-size caps.
  PASS - Mock API completeness matrix recorded in P4 output.
  PASS - 0 app-facing service files use `readMockJson`, `writeMockJson`, or `localStorage`.

Gates:
  typecheck: PASS - `npm run typecheck`
  test: PASS - `npm run test`, 6 files and 27 tests passed
  build: PASS - `npm run build`; existing Vite warnings remain for dynamic/static imports and chunk size
  lint: PASS - focused ESLint on touched files with `./node_modules/.bin/eslint --max-warnings 0 ...`
  verify.sh: N/A - task-specific gates run
  browser manual check: Deferred - MCP/browser proof left for opencode per user request

Consumer updates required:
  Public service signatures preserved. Non-backend local storage consumers now import `getBrowserStorage` from `src/utils/browser-storage.helpers.ts`.

Open issues / follow-ups:
  Repo-wide `npm run lint` still has pre-existing backlog; focused lint on touched files passes. `useEditorState.ts` remains over the file-size cap from the accepted P3 state; P4 did not split it because this sprint is backend-only.
