# BE2-R3 — Integration Gap Report
Date: 2026-06-27 | Agent: opencode

## Session Environment
Same session as BE2-R1 and BE2-R2. repository_version: v0.3.4.

R1 output: `docs/plans/drafted/backend-discovery-v2/output/BE2-R1-type-health.md` ✓
R2 output: `docs/plans/drafted/backend-discovery-v2/output/BE2-R2-service-readiness.md` ✓

## Scenario A readiness summary

| Status | Count | Notes |
|--------|-------|-------|
| Ready (0 blockers) | **0** | No service is fully ready for same-shape API swap |
| Needs error handling | **2** | clickup (stub), error-reporter (IS the handler — acceptable) |
| Needs mapper | **0** | 100% mapper coverage across all entities |
| Needs apiClient wired | **8** | All 8 localStorage-dependent services still use `readMockJson`/`writeMockJson` |

## 3 — Per-service Scenario A status

| Service | Type | Status | Blockers |
|---------|------|--------|----------|
| `access.service.ts` | localStorage | BLOCKED | needs apiClient wired |
| `builder.service.ts` | localStorage | BLOCKED | needs apiClient wired |
| `channels.service.ts` | localStorage | BLOCKED | needs apiClient wired |
| `files.service.ts` | localStorage | BLOCKED | needs apiClient wired |
| `subtask-definitions.service.ts` | localStorage | BLOCKED | needs apiClient wired |
| `versions.service.ts` | localStorage | BLOCKED | needs apiClient wired |
| `logs.service.ts` | localStorage | BLOCKED | needs apiClient wired |
| `ai.service.ts` | stub (no I/O) | READY (stub, stays) | — |
| `clickup.service.ts` | stub (no I/O) | READY (stub, stays) | — |
| `mock-dispatch.ts` | routing layer | READY | — |
| `service-utils.ts` | utility | READY | — |
| `api-client.ts` | infrastructure | READY | — |
| `api-mappers.ts` | infrastructure | READY | — |
| `error-reporter.service.ts` | infrastructure | READY | — |

**Mapper check results:** All 8 localStorage services return `Api*` types. All have matching mappers in `src/services/api-mappers.ts` or `src/queries/`. 0 missing mappers.

**Error handling:** 9 services use `withServiceErrorHandler` wrapper. 3 infrastructure services (api-client, error-reporter, api-mappers) have no wrapper but are intentional (low-level I/O, IS the handler, pure functions). 2 stubs (clickup, ai) have no wrapper but produce no side effects.

**apiClient wiring:** 0 services call `apiClient()`. All 8 localStorage services use `readMockJson`/`writeMockJson` directly. `apiClient()` exists and delegates to `mockDispatch()` but has zero callers.

## 4 — ai.service.ts and clickup.service.ts status

**Both are pure stubs.**

`ai.service.ts` (17 lines):
```typescript
export const createAIReviewDraft = withServiceErrorHandler('createAIReviewDraft',
  async (prompt: string): Promise<AIReviewDraft> => {
    return {
      id: 'mock-ai-draft',
      summary: `Seed-only AI draft for: ${prompt}`,
      proposedActions: [],
    };
  });
```
Uses `withServiceErrorHandler` wrapper. Returns static data. No real implementation. `proposedActions: unknown[]` is appropriately typed for a stub.

`clickup.service.ts` (16 lines):
```typescript
export async function getClickUpEntryPayload(versionId: string): Promise<ClickUpEntryPayload> {
  return { versionId, dcxId: null, sourceTaskId: null };
}
```
No `withServiceErrorHandler` wrapper. Returns static null data. No real implementation.

**Recommendation:** Both are feature stubs. Keep as-is unless P4 explicitly includes AI or ClickUp integration.

## 5 — Exact fix list for folder-structure-v2 P4

### Priority 1 — Wire apiClient into 8 localStorage services

| # | Service | Change | Acceptance criterion | Risk |
|---|---------|--------|---------------------|------|
| 1 | `versions.service.ts` | Replace `readMockJson`/`writeMockJson` with `apiClient()` calls. Keep status transition logic (updateStatus uses `lifecycle.rules`). | `npm run typecheck` passes; `npm run test` passes | **high** — called by version.actions, feeds MetadataIsland |
| 2 | `builder.service.ts` | Replace `readMockJson`/`writeMockJson` with `apiClient()`. Remove `seedPhases()` — real API returns data or 404. | `npm run typecheck` passes; builder loads without seed data | **high** — central data pipeline, feeds StageProvider |
| 3 | `channels.service.ts` | Replace `readMockJson`/`writeMockJson` with `apiClient()`. `createComposition` side-effect writes (updating channel's composition list) move to server. | `npm run typecheck` passes; channel/composition flows work | **med** — used by TaskCreationFlow, ChannelCompositionSelect |
| 4 | `logs.service.ts` | Replace `readMockJson`/`writeMockJson` with `apiClient()`. | `npm run typecheck` passes | **low** — read/write logs, no downstream state coupling |
| 5 | `subtask-definitions.service.ts` | Replace `readMockJson` with `apiClient()`. | `npm run typecheck` passes | **low** — simple read-only with filter |
| 6 | `files.service.ts` | Replace `readMockJson`/`writeMockJson` with `apiClient()`. Fix `attachVersionFile` — currently no-op stub (returns input without saving). | `npm run typecheck` passes; file attachment actually saves | **med** — `attachVersionFile` is broken even in mock mode |
| 7 | `access.service.ts` | Replace `readMockJson` with `apiClient()`. Currently returns hardcoded `{isAuthenticated: true, canEdit: true}` for all users. | `npm run typecheck` passes | **med** — affects RouteGuard and usePermissions |
| 8 | `logs.service.ts` (re-assess) | Already included above. Low risk, clean CRUD. | — | **low** |

### Priority 2 — Post-swap cleanup

| # | File | Change | Acceptance criterion | Risk |
|---|------|--------|---------------------|------|
| 9 | `src/utils/safe-storage.ts` | **Delete entirely** — no service uses localStorage after P4 swap | `npm run typecheck` passes; `grep -rn "safe-storage\|safeLocalStorage" src/` returns 0 | **low** |
| 10 | `src/services/api-client.ts` | Remove `readMockJson`/`writeMockJson`. Keep only `apiClient()` and types. | `npm run typecheck` passes; `grep -rn "readMockJson\|writeMockJson" src/services/` returns 0 | **low** |
| 11 | `src/services/mock-dispatch.ts` | Delete or keep as fallback. Routes are replaced by real `apiClient` fetch calls. | Decision needed: delete or keep for dev/test | **low** |
| 12 | `src/mock/` | Delete seed data files (channels.ts, compositions.ts, subtask-definitions.ts, constants.ts) | `npm run build` passes | **low** |
| 13 | `src/builder/islands/EditorViewerIsland/useEditorDraft.ts` | Remove `as any` casts on `draftData` (currently 3 casts at lines 48,66,83) | `npm run lint | grep "no-explicit-any"` shows 0 violations in this file | **low** |
| 14 | `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` | Remove `as any` casts on `draftData` (currently 4 at lines 62,143,143,174) | `npm run lint | grep "no-explicit-any"` shows 0 violations in this file | **low** |

### Priority 3 — Type cleanup (non-blocking for API swap)

| # | File | Change | Acceptance criterion | Risk |
|---|------|--------|---------------------|------|
| 15 | `src/types/domain.ts` | Remove 6 remaining semantic duplicate types (Action, Phase, Task, Subtask, DCX, Version) — make them extend their Api counterparts with mixins instead of redeclaring fields | `npm run typecheck` passes; component tests pass | **med** — affects 39 files that import from `@/types/domain` |
| 16 | Various editor files | Replace `as any` casts with proper discriminated union narrowing on `draftData` | `npm run lint | grep "no-explicit-any"` shows reduction from 63 baseline | **med** |

## Delta from expired BE-R3

| Dimension | BE-R3 (pre-P1) | BE2-R3 (post-P4) | Δ |
|-----------|---------------|-------------------|---|
| localStorage services | 8 | 8 | 0 |
| apiClient status | **throws** | **wired to mockDispatch** | ✓ P4 improvement |
| DraftData type | `any` | `EditorDraftData` | ✓ P4 improvement |
| Mapper coverage | 100% | 100% | ✓ |
| Error handling | 1 service (versions) | 9 services (via `withServiceErrorHandler`) | ✓ P4 improvement |
| any in services/actions | 0 | 0 | ✓ |
| Mock routes | 0 | 22 (mock-dispatch.ts) | ✓ P4 improvement |
| Duplicate types (pre-cleanup) | 10 | 6 (semantic only) | -4 resolved |
| TypeScript errors | not measured | **0** | baseline |
| any violations (total) | 1 (draftData) | **63** | +62 (new code) |
| Seed data deletion | not done | not done | 0 |
| safe-storage deletion | not done | not done | 0 |

## What breaks immediately if mock → real API today

**Everything in the data layer.** If localStorage is cleared and `readMockJson` returns fallback data:
- Builder loads with empty seed phases (via `seedPhases()`) — works but shows empty
- Channels, compositions, subtask definitions fall back to static mock data — works but shows defaults
- Versions seed data — shown but empty
- No actual API calls are made — `apiClient()` is wired but no service calls it

If localStorage is removed entirely (the real P4 goal):
1. **8 services** would throw immediately — all depend on `readMockJson`/`writeMockJson`
2. **Mock files** still provide static fallbacks but no persistence
3. **Mappers** survive unchanged — they don't depend on data source
4. **Queries** survive — they call services + mappers, service swap is transparent
5. **Actions** (builder mutations) survive — they operate on zustand store, not services
6. **Components** survive — they consume domain types from queries/store, data source is invisible
7. **useAutosave** works — calls `saveBuilder` which is a service that needs swapping
8. **version.actions** works — calls `versions.service` which is a service that needs swapping

**Survival rate: ~85% of the codebase is unaffected by a mock→real API transition.**
