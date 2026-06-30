# P4 — Backend Integration Readiness — Output

**Completed**: 2026-06-26
**Plan**: `src-structure-refactor/sprints/P4-backend-readiness.md`
**Sprint status**: ✅ All 8 steps complete

---

## Summary

After P4, a developer can connect a real backend (Scenario A: same field names) by swapping
8 service files. No other changes are needed. The app runs identically with mock data as after P4.

---

## Metrics

| Metric | Before | After |
|---|---|---|
| Identical types in domain.ts duplicated from api.ts | 10 | 0 |
| `draftData: any` in builderStore | 1 | 0 |
| Services with 0 error handling | 7 | 0 |
| `attachVersionFile` stub (no-op) | 1 | 0 (writes to localStorage) |
| Stale selection state in builderStore | 1 | 0 (removed) |
| Hardcoded `MOCK_USER_ID` in services | 3 | 0 (centralized in `mock/constants.ts`) |
| `apiClient()` unconditional throw | 1 | 0 (now dispatches to mock) |

---

## Steps Completed

### Step 1 — Inventory mock data coverage ✅
10 services audited. `attachVersionFile` identified as no-op. `ai.service.ts` and `clickup.service.ts` confirmed as stubs left per A4.

### Step 2 — Fix `attachVersionFile` stub ✅
`files.service.ts` now reads version from localStorage, appends file to attachments, writes back.

### Step 3 — Remove 10 duplicate types from domain.ts ✅
Types removed: `JsonValue`, `TaskDate`, `FieldCompletionState`, `PhaseIconType`, `Channel`, `SubtaskDefinition`, `ChannelComposition`, `FileAttachment`, `AssignedMember`, `ActivityEvent`. 27 consumer files updated.

### Step 4 — Type `draftData` in builderStore ✅
Created `src/types/editor.types.ts`. Moved `EditorDraftData` union type from `useEditorDraft.ts`. Updated `builderStore.ts`, `EditorHeader.tsx`, `EditorSessionPill.tsx`, `EditorViewerIsland.tsx`. Removed all `any` from store layer.

### Step 5 — Remove stale selection state ✅
Removed `BuilderSelection` interface, `selection` field, and `setSelection` action from builderStore (0 external consumers — selection lives in StageContext).

### Step 6 — Centralized error handling ✅
Created `src/services/service-utils.ts` with `withServiceErrorHandler`. Wrapped 18 exported functions across 8 service files. Excluded `clickup.service.ts` (stub per A4) and `error-reporter.service.ts` (handler itself).

### Step 7 — Wire `apiClient()` seam ✅
`apiClient()` now dispatches to `mockDispatch()` instead of throwing. Created `src/services/mock-dispatch.ts` with 19 route pattern handlers covering all service routes.

### Step 8 — Add `MOCK_USER_ID` replacement ✅
Created `src/mock/constants.ts`. Updated 3 service files (`channels.service.ts`, `versions.service.ts`, `access.service.ts`) to import instead of redeclaring.

---

## Acceptance Criteria Results

```
AC 1: No duplicate types in domain.ts        → PASS
AC 2: No `any` in builderStore               → PASS
AC 3: attachVersionFile writes before return → PASS
AC 4: withServiceErrorHandler exists         → PASS
AC 4b: Wrapper used in ≥7 files              → PASS (8 files)
AC 5: No hardcoded MOCK_USER_ID in services  → PASS
AC 6: apiClient no longer throws             → PASS
AC 7: Build passes                           → PASS (npm run build)
AC 8: TypeScript strict                      → PASS (npx tsc --noEmit)
```

---

## Files Created

| File | Purpose |
|---|---|
| `src/types/editor.types.ts` | `EditorDraftData` + `DayDraft` type |
| `src/services/service-utils.ts` | `withServiceErrorHandler` wrapper |
| `src/services/mock-dispatch.ts` | Route-to-handler dispatch for mock API |
| `src/mock/constants.ts` | Centralized `MOCK_USER_ID` + `MOCK_WORKSPACE_ID` |

## Files Modified

| File | Changes |
|---|---|
| `src/store/builderStore.ts` | Typed `draftData`, removed `selection` |
| `src/services/api-client.ts` | `apiClient()` now dispatches to mock |
| `src/services/builder.service.ts` | Wrapped 2 exports |
| `src/services/channels.service.ts` | Import `MOCK_USER_ID`, wrapped 3 exports |
| `src/services/files.service.ts` | Wrapped 2 exports |
| `src/services/logs.service.ts` | Wrapped 2 exports |
| `src/services/subtask-definitions.service.ts` | Wrapped 1 export |
| `src/services/access.service.ts` | Import `MOCK_USER_ID`, wrapped 2 exports |
| `src/services/ai.service.ts` | Wrapped 1 export |
| `src/services/versions.service.ts` | Import `MOCK_USER_ID`, wrapped 5 exports |
| `src/builder/islands/EditorViewerIsland/useEditorDraft.ts` | Import `EditorDraftData` from types |
| `src/builder/islands/EditorViewerIsland/EditorHeader.tsx` | Typed `draftData` prop |
| `src/builder/islands/EditorViewerIsland/EditorSessionPill.tsx` | Typed `draftData` access |
| `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` | Removed `draftData?.kind` fallback |

---

## What a backend developer does after P4

To connect a real backend (Scenario A — same field names):

1. Set `VITE_USE_MOCK=false` in `.env`
2. For each of the 8 services: replace `readMockJson(key, fallback)` with `await apiClient(route)` calls
3. Delete `src/services/safe-storage.ts` (no longer needed)
4. Delete `seedPhases()` and `seedVersions()` from builder/versions service
5. Replace `MOCK_USER_ID` usage in access.service.ts with real auth token
6. Wire `reportError` to POST to `/error-reports`

The mappers, queries, actions, stores, and all UI components require no changes.
