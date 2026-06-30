---
sprint: P4
title: Backend Integration Readiness
plan: src-structure-refactor
status: drafted
depends-on: P3 (all P3 gates must pass first)
data-source: BE-R1-type-inventory.md, BE-R2-service-audit.md, BE-R3-integration-gap.md, FE-R2-state-flow.md
---

# P4 — Backend Integration Readiness

## Goal

After P4, a developer can connect a real backend (Scenario A: same field names) by swapping
8 service files. No other changes are needed. The app runs identically with mock data as after P4.

This sprint does NOT make any network calls. It does NOT change runtime behaviour.
See ASSUMPTIONS.md A9.

---

## Before

| Metric | Count |
|---|---|
| Identical types in domain.ts duplicated from api.ts | 10 |
| `draftData: any` in builderStore | 1 |
| Services with 0 error handling | 7 |
| `attachVersionFile` stub (no-op) | 1 |
| Mock data endpoints missing | TBD (Step 1 inventories these) |
| Stale selection state in builderStore | 1 (selectedNodeIds, focusedNodeId in store + context) |
| Deprecated store fields in active use | 2 (builderStore.selection) |

---

## After

| Metric | Target |
|---|---|
| Identical types in domain.ts | 0 (10 removed, consumers redirected to api.ts) |
| `draftData: any` | 0 (typed as EditorDraftData) |
| Services with 0 error handling | 0 |
| `attachVersionFile` | Working mock (reads + writes to local store) |
| Mock data endpoints | 100% coverage (every service function has mock data) |
| Stale selection state | 0 (builderStore.selection removed) |

---

## Step-by-step work

### Step 1 — Inventory mock data coverage

Before making any changes, run an inventory of which service functions have meaningful mock data
vs which are stubs or no-ops.

```bash
# Find all service exports
grep -n 'export.*async\|export const.*=' src/services/*.ts | grep -v '\.d\.ts'
```

From BE-R2, known gaps:
- `attachVersionFile` — no-op (returns input, never saves)
- `ai.service.ts` — returns static seed object
- `clickup.service.ts` — returns static seed object
- `access.service.ts` — always returns `isAuthenticated: true, canEdit: true` (unrealistic but acceptable for mock)

For each gap, decide:
| Function | Decision | Reason |
|---|---|---|
| `attachVersionFile` | Fix: write to version.attachments in localStorage | Users can attach files — this should work in mock |
| `ai.service.ts` | Leave as stub | Future scope (ASSUMPTIONS.md A4) |
| `clickup.service.ts` | Leave as stub | Future scope (ASSUMPTIONS.md A4) |
| `access.service.ts` | Leave as-is | Auth is replaced entirely at backend integration time |

---

### Step 2 — Fix attachVersionFile stub

**File**: `src/services/files.service.ts`

**Current**: `attachVersionFile(versionId, file)` returns `file` unchanged (no-op).

**Fix**: Read the version from localStorage, append the file to `version.attachments`, write back.

```typescript
export const attachVersionFile = async (
  versionId: string,
  file: ApiFileAttachment
): Promise<ApiFileAttachment> => {
  const key = getMockStorageKey(`versions`);
  const versions: ApiVersion[] = readMockJson(key, []);
  const idx = versions.findIndex(v => v.id === versionId);
  if (idx === -1) throw new Error(`Version ${versionId} not found`);
  versions[idx].attachments = [...(versions[idx].attachments ?? []), file];
  writeMockJson(key, versions);
  return file;
};
```

---

### Step 3 — Remove 10 duplicate types from domain.ts

**File**: `src/types/domain.ts`

**Types to remove** (exact duplicates of api.ts types):
`JsonValue`, `TaskDate`, `FieldCompletionState`, `PhaseIconType`,
`Channel`, `SubtaskDefinition`, `ChannelComposition`, `FileAttachment`,
`AssignedMember`, `ActivityEvent`

**Types to KEEP** in domain.ts (have real additions):
`AIContextFields`, `CollaborationFields`, `ISODate`, `ISOTimestamp`,
`DCX`, `Version`, `Phase`, `Action`, `Task`, `Subtask`

**Step 3a**: Remove the 10 types from domain.ts.

**Step 3b**: Keep the 6 domain-enriched types (DCX, Version, Phase, Action, Task, Subtask)
**independently declared** — do NOT have them extend their Api counterparts.

**Why** (per Codex review): If `interface Version extends ApiVersion`, then any transport
shape change (field rename, field removal) silently breaks the domain model. The mapper is
the correct and only boundary between transport and domain. Domain types must stay stable
even when the API changes.

What this means in practice: the 6 domain types keep their full field declarations.
The 10 removed types (JsonValue, TaskDate, Channel, etc.) are moved to api.ts imports.
No inheritance introduced.

**Step 3c**: Update imports in the 39 files that import the removed types from `@/types/domain`.
They must now import from `@/types/api`.

```bash
# Find all files importing the removed types
grep -rn "import.*{.*JsonValue\|TaskDate\|FieldCompletionState\|PhaseIconType\|Channel\|SubtaskDefinition\|ChannelComposition\|FileAttachment\|AssignedMember\|ActivityEvent.*}.*from.*domain" src/
```

For each file, add/update the api import and remove from the domain import.

**Gate**:
```bash
# domain.ts must not export the 10 removed types
grep -n 'export.*JsonValue\|export.*TaskDate\|export.*FieldCompletionState\|export.*PhaseIconType\|export.*\bChannel\b\|export.*SubtaskDefinition\|export.*ChannelComposition\|export.*FileAttachment\|export.*AssignedMember\|export.*ActivityEvent' src/types/domain.ts
# Expected: 0 results
```

---

### Step 4 — Type `draftData` in builderStore

**File**: `src/store/builderStore.ts`

**Current**: `draftData: any` in `EditorSession` interface (line ~11).

**Fix**: Define an `EditorDraftData` interface that describes every field the draft can hold.
Place it in `src/types/` (e.g., `src/types/editor.types.ts`).

From FE-R2 — draft data fields used by `useEditorDraft`:
```typescript
export interface EditorDraftData {
  name?: string;
  description?: string;
  label?: string;
  icon?: string;
  channelId?: string;
  compositionId?: string;
  message?: string;
  senderId?: string;
  receiverId?: string;
  date?: TaskDate;          // imported from @/types/api
  subtasks?: Subtask[];     // imported from @/types/domain
  specsState?: FieldCompletionState; // imported from @/types/api
  missingDataState?: FieldCompletionState;
  routingSegments?: string[];
  quickKey?: string;
  quickLabel?: string;
  quickIcon?: string;
  // Add any remaining fields found by searching for `draft.` reads in useEditorDraft.ts
}
```

Update `EditorSession.draftData: any` → `EditorSession.draftData: Partial<EditorDraftData>`.

Fix any TypeScript errors that arise from removing `any` — each cast is a sign of an actual
type contract that should now be explicit.

---

### Step 5 — Remove stale selection state from builderStore

**File**: `src/store/builderStore.ts`

**Background**: FE-R2 found `selection.selectedNodeIds` and `selection.focusedNodeId` in builderStore
are deprecated — StageContext is the live source of truth, and `setSelection` appears unused.

**Before making changes**: Verify no consumer reads from the store's selection:
```bash
grep -rn 'builderStore.*selection\|useBuilderStore.*selectedNodeIds\|useBuilderStore.*focusedNodeId\|setSelection' src/ --include='*.tsx' --include='*.ts'
```

If 0 results: remove `selection` from builderStore state interface and `setSelection` action.

If results found: document them and DO NOT remove — update this sprint file with the findings.

---

### Step 6 — Centralized error handling via transport wrapper

**Decision** (per Codex review): Do NOT add repetitive `try/catch` blocks to every service
function. Instead, create one centralized wrapper that all services use.

**File**: `src/services/service-utils.ts` (new file)

```typescript
import { reportError } from './error-reporter.service';

export const withServiceErrorHandler = <TArgs extends unknown[], TReturn>(
  fnName: string,
  fn: (...args: TArgs) => Promise<TReturn>
) => {
  return async (...args: TArgs): Promise<TReturn> => {
    try {
      return await fn(...args);
    } catch (error) {
      await reportError({ message: `${fnName} failed`, error });
      throw error;
    }
  };
};
```

Usage in service files:
```typescript
export const getChannels = withServiceErrorHandler('getChannels', async () => {
  return readMockJson<ApiChannel[]>(getMockStorageKey('channels'), MOCK_CHANNELS);
});
```

**Files to update**: Wrap exported functions in 7 service files:
`builder.service.ts`, `channels.service.ts`, `files.service.ts`, `logs.service.ts`,
`subtask-definitions.service.ts`, `access.service.ts`, `ai.service.ts`

(`versions.service.ts` already has error handling — update to use the wrapper for consistency.)

This gives consistent error reporting without duplicating try/catch in every function.
When the real backend connects, only `error-reporter.service.ts` needs to change.

---

### Step 7 — Wire apiClient() seam (mock-compatible)

**File**: `src/services/api-client.ts`

**Current**: `apiClient()` always throws — "seam only in Sprint 2" comment.

**Fix**: Wire `apiClient()` to dispatch to the mock functions when `USE_MOCK=true` (env var).
Services do not need to change — only `apiClient()` changes.

```typescript
export const apiClient = async <TData, TBody = undefined>(
  route: string,
  options?: ApiClientRequestOptions<TBody>
): Promise<ApiClientResponse<TData>> => {
  if (import.meta.env.VITE_USE_MOCK === 'true') {
    // Route to mock handler — a switch or map based on route + method
    return mockDispatch<TData>(route, options);
  }
  // Real fetch (not implemented in this sprint — throws if VITE_USE_MOCK is false)
  throw new Error('Real API not configured. Set VITE_USE_MOCK=true or implement fetch.');
};
```

Create `src/services/mock-dispatch.ts` that maps route patterns to mock service functions.

**Note**: Services do NOT need to call `apiClient()` yet. This is the seam — individual services
can be migrated to use it in a future sprint when a real API is connected.

---

### Step 8 — Add MOCK_USER_ID replacement

**Current**: `MOCK_USER_ID = 'mock-user'` is hardcoded in 3 service files.

**Fix**: Create `src/mock/constants.ts`:
```typescript
export const MOCK_USER_ID = 'mock-user-001';
export const MOCK_WORKSPACE_ID = 'workspace-001';
```

Update the 3 service files to import from there instead of redeclaring. This centralizes
the value so it changes in one place when real auth is added.

---

## Acceptance Criteria

```bash
# 1. domain.ts has no duplicate types
grep -cn 'export.*JsonValue\|export.*\bChannel\b\|export.*TaskDate\|export.*FileAttachment' src/types/domain.ts
# Expected: 0

# 2. No `any` in builderStore
grep -n ': any' src/store/builderStore.ts
# Expected: 0 results

# 3. attachVersionFile is no longer a no-op
grep -n 'return file' src/services/files.service.ts
# Expected: 0 results (it now writes before returning)

# 4. Centralized error handler exists
grep -n 'withServiceErrorHandler' src/services/service-utils.ts
# Expected: found

# 4b. Services use the wrapper (not ad-hoc try/catch)
grep -rn 'withServiceErrorHandler' src/services/*.ts | wc -l
# Expected: ≥7 (one per wrapped function, across 7+ service files)

# 5. MOCK_USER_ID declared only once
grep -rn "MOCK_USER_ID.*=.*'" src/services/ | wc -l
# Expected: 0 (now centralized in src/mock/constants.ts)

# 6. apiClient() no longer unconditionally throws
grep -n "throw new Error.*seam only" src/services/api-client.ts
# Expected: 0 results

# 7. 39 import files compile after type dedup
npm run build
# Expected: 0 errors

# 8. TypeScript strict check (no any)
npx tsc --noEmit --strict 2>&1 | grep 'any' | wc -l
# Expected: 0 (or near-0, for pre-existing any in third-party)
```

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

---

## Session log location

Save output to: `docs/plans/completed/src-structure-refactor/output/P4-backend-readiness-output.md`
