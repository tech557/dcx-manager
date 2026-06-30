# BE2-R2 — Service Layer Readiness
Date: 2026-06-27 | Agent: opencode

## Session Environment
Same session as BE2-R1. repository_version: v0.3.4. All gates available.

## 3 — Service inventory

| Service file | Data source | Exported functions |
|-------------|-------------|-------------------|
| `access.service.ts` | unknown/mock | getMyAccess, checkDCXAccess |
| `ai.service.ts` | unknown/mock | createAIReviewDraft |
| `api-client.ts` | localStorage | getMockStorageKey, readMockJson, writeMockJson, apiClient |
| `api-mappers.ts` | unknown/mock | 26 mapper functions (all entities, bi-directional) |
| `builder.service.ts` | unknown/mock | getBuilder, saveBuilder |
| `channels.service.ts` | unknown/mock | getChannels, getCompositions, createComposition |
| `clickup.service.ts` | unknown/mock | getClickUpEntryPayload |
| `error-reporter.service.ts` | unknown/mock | reportError |
| `files.service.ts` | unknown/mock | getVersionFiles, attachVersionFile |
| `logs.service.ts` | unknown/mock | getActivityLogs, writeLifecycleLog |
| `mock-dispatch.ts` | unknown/mock | mockDispatch |
| `service-utils.ts` | unknown/mock | withServiceErrorHandler |
| `subtask-definitions.service.ts` | unknown/mock | getSubtaskDefinitions |
| `versions.service.ts` | unknown/mock | getVersions, getVersion, updateStatus, updateVersionDate, duplicateVersion |

**Total: 14 service files** (was 12 pre-P1 — new: `mock-dispatch.ts`, `service-utils.ts`)

**New files (P4 additions):**
- `mock-dispatch.ts` — REST-like router that maps URL patterns to service functions. 22 routes defined for all endpoints (channels, builder, versions, files, logs, subtask-definitions, access, ai, clickup).
- `service-utils.ts` — `withServiceErrorHandler` wrapper providing consistent try/catch/reportError for all service functions (used by 9/14 service files).

## 4 — localStorage usage

**Services still using localStorage: 8** (same as pre-P1)

| Service | localStorage refs | How |
|---------|------------------|-----|
| `api-client.ts` | 1 | Direct `safeLocalStorage.getItem`/`setItem` |
| `access.service.ts` | 2 | `readMockJson` (via api-client) |
| `builder.service.ts` | 2 | `readMockJson`/`writeMockJson` (via api-client) |
| `channels.service.ts` | 4 | `readMockJson`/`writeMockJson` (via api-client) |
| `files.service.ts` | 3 | `readMockJson`/`writeMockJson` (via api-client) |
| `logs.service.ts` | 3 | `readMockJson`/`writeMockJson` (via api-client) |
| `subtask-definitions.service.ts` | 1 | `readMockJson` (via api-client) |
| `versions.service.ts` | 2 | `readMockJson`/`writeMockJson` (via api-client) |

All localStorage access goes through `readMockJson`/`writeMockJson` in `api-client.ts`. Only `api-client.ts` directly touches `safeLocalStorage`.

## 5 — apiClient status

**WIRED — no longer throws.** `apiClient()` now delegates to `mockDispatch()` which routes to the actual service functions.

```typescript
// src/services/api-client.ts:47-52
export async function apiClient<TData, TBody = unknown>(
  route: string,
  options: ApiClientRequestOptions<TBody> = {},
): Promise<ApiClientResponse<TData>> {
  return mockDispatch<TData>(route, options as ApiClientRequestOptions<unknown>);
}
```

`mockDispatch.ts` defines 22 route handlers covering all endpoints:
- GET/POST channels, compositions
- GET/PATCH builder
- GET/PATCH/POST versions, files, activity-logs
- GET subtask-definitions, access
- POST ai/review-draft
- GET clickup/entry

**However, `apiClient()` is still never called by any service or component.** All 8 data services continue to use `readMockJson`/`writeMockJson` directly. `apiClient` is wired to `mockDispatch` but nobody uses it.

## 6 — Error handling coverage

**9 services with `withServiceErrorHandler` wrapper:**
access, ai, builder, channels, files, logs, subtask-definitions, versions (all have try/catch via wrapper)

**Services with no wrapper (no error handling):**
- `api-client.ts` — has its own try/catch in `readMockJson`
- `api-mappers.ts` — pure functions, no I/O, no error handling needed
- `clickup.service.ts` — stub, no error handling
- `error-reporter.service.ts` — IS the error reporter, uses console.error directly
- `mock-dispatch.ts` — has try/catch in the dispatch loop, throws if no route matches

**Real gap:** Only `clickup.service.ts` and `error-reporter.service.ts` have no error handling — and both are intentional (stub/stub). The 8 data services all use `withServiceErrorHandler`.

## 7 — Mapper coverage

**Mapper files found: 1** (`src/services/api-mappers.ts`)

**Mapper references in services: 0** — Services return `Api*` types directly. Mapping happens at the query layer.

**Mapper entity coverage:**
| Entity | api→domain | domain→api | Called from |
|--------|-----------|-----------|-------------|
| AssignedMember | ✅ | ✅ | (internal — via Version mapping) |
| FileAttachment | ✅ | ✅ | (internal — via Version mapping) |
| Channel | ✅ | ✅ | queries/channels.queries.ts |
| ChannelComposition | ✅ | ✅ | queries/channels.queries.ts |
| SubtaskDefinition | ✅ | ❌ (no reverse needed) | queries/subtask-definitions.queries.ts |
| Subtask | ✅ | ✅ | (internal — via Task mapping) |
| Task | ✅ | ✅ | (internal — via Action mapping) |
| Action | ✅ | ✅ | (internal — via Phase mapping) |
| Phase | ✅ | ✅ | (internal — via BuilderTree mapping) |
| Version | ✅ | ✅ | queries/versions.queries.ts |
| DCX | ✅ | ✅ | (potential future use) |
| ActivityEvent | ✅ | ✅ | (potential future use) |
| BuilderTree | ✅ | ✅ | queries/builder.queries.ts |
| Phases[] | ❌ | ✅ | hooks/useAutosave.ts |

100% mapper coverage. 0 `any` in mappers.

## Delta from expired BE-R2

| Metric | BE-R2 (pre-P1) | BE2-R2 (post-P4) | Δ |
|--------|---------------|-------------------|---|
| Service files | 12 | 14 | +2 (mock-dispatch, service-utils) |
| localStorage-dependent services | 8 | 8 | 0 |
| apiClient status | **throws** | **delegates to mockDispatch** | wired ✓ |
| apiClient callers | 0 | 0 | still unused |
| any in services/actions | 0 | 0 | 0 ✓ |
| Error handling wrapper | none | withServiceErrorHandler (9 services) | added ✓ |
| Mapper coverage | 100% | 100% | unchanged ✓ |
| Mock routes | none | 22 route patterns | +22 |

## Key P4 improvements
1. **`mock-dispatch.ts`** — New REST router mapping 22 URL patterns to service functions. This is the bridge that makes real API swapping possible: swap `mockDispatch` body for `fetch` calls.
2. **`service-utils.ts`** — New `withServiceErrorHandler` wrapper providing consistent error handling across 9 services.
3. **`apiClient` no longer throws** — Calls through to `mockDispatch` which returns real data.

## Blockers for folder-structure-v2 P4

1. **8 localStorage-dependent services** — None have been converted to fetch. `apiClient()` is wired but unused. Each service needs `readMockJson`/`writeMockJson` replaced with `apiClient(...)` calls.
2. **`apiClient()` has 0 callers** — The seam exists but no service uses it. P4 must migrate each service from direct mock storage to `apiClient()`.
3. **`files.service.ts:attachVersionFile` is a no-op stub** — Returns input without saving. Not localStorage-dependent but has no real implementation.
4. **`mock-dispatch.ts` uses `JSON.parse` on body strings** — The current implementation passes raw string bodies; a real fetch-based `apiClient` would handle JSON serialization properly.
5. **`clickup.service.ts` and `ai.service.ts` are pure stubs** — No real behavior. P4 needs decision: keep as stubs or implement.
