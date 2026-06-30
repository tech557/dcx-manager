---
sprint: P4
title: Backend Integration Readiness
plan: src-structure-refactor
status: active
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

| Metric | Target | Status |
|---|---|---|---|
| Identical types in domain.ts | 0 (10 removed, consumers redirected to api.ts) | ✅ |
| `draftData: any` | 0 (typed as EditorDraftData) | ✅ |
| Services with 0 error handling | 0 | ✅ (18 wrapped functions across 8 services) |
| `attachVersionFile` | Working mock (reads + writes to local store) | ✅ |
| Mock data endpoints | 100% coverage (every service function has mock data) | ✅ |
| Stale selection state | 0 (builderStore.selection removed) | ✅ |
| `apiClient()` unconditional throw | Removed | ✅ |
| `MOCK_USER_ID` hardcoded | 0 (centralized in mock/constants.ts) | ✅ |
| `any` in builderStore | 0 | ✅ |

---

## Step-by-step work

### Step 1 — Inventory mock data coverage ✅

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

**Findings (2026-06-26)**:

| Service | Functions | Mock status |
|---|---|---|
| versions.service.ts | 5 | ✅ Full CRUD, seed data, error handling |
| builder.service.ts | 2 | ✅ Full mock with seed fallback |
| channels.service.ts | 3 | ✅ Full mock, writes compositions |
| logs.service.ts | 2 | ✅ Full mock |
| subtask-definitions.service.ts | 1 | ✅ Full mock (read-only) |
| access.service.ts | 2 | ✅ Mock (always auth'd — acceptable) |
| files.service.ts | 2 | ✅ Full mock (Step 2 fix applied) |
| error-reporter.service.ts | 1 | ✅ Console reporter |
| ai.service.ts | 1 | ⬜ Stub — leave per A4 |
| clickup.service.ts | 1 | ⬜ Stub — leave per A4 |

Additional findings for later steps:
- `MOCK_USER_ID` hardcoded in 3 files (channels.service.ts:8, versions.service.ts:8)
- `apiClient()` always throws (Step 7)
- 7 of 8 services have 0 error handling (Step 6)

For each gap, decide:
| Function | Decision | Reason |
|---|---|---|
| `attachVersionFile` | Fix: write to version.attachments in localStorage | Users can attach files — this should work in mock |
| `ai.service.ts` | Leave as stub | Future scope (ASSUMPTIONS.md A4) |
| `clickup.service.ts` | Leave as stub | Future scope (ASSUMPTIONS.md A4) |
| `access.service.ts` | Leave as-is | Auth is replaced entirely at backend integration time |

---

### Step 2 — Fix attachVersionFile stub ✅

**File**: `src/services/files.service.ts`

**Current**: `attachVersionFile(versionId, file)` returns `file` unchanged (no-op).

**Fix**: Read the version from localStorage, append the file to `version.attachments`, write back.

```typescript
// applied 2026-06-26 — see src/services/files.service.ts
```

**Verification**: `npm run build` ✅ passes.

---### Step 3 — Remove 10 duplicate types from domain.ts ✅

**File**: `src/types/domain.ts`

**Types removed**: `JsonValue`, `TaskDate`, `FieldCompletionState`, `PhaseIconType`,
`Channel`, `SubtaskDefinition`, `ChannelComposition`, `FileAttachment`,
`AssignedMember`, `ActivityEvent`

**Types kept** (domain-enriched, independently declared): `AIContextFields`, `CollaborationFields`,
`ISODate`, `ISOTimestamp`, `DCX`, `Version`, `Phase`, `Action`, `Task`, `Subtask`

**Changes**:
- Removed 10 type declarations from `src/types/domain.ts`
- Updated 6 kept types to reference Api-prefixed types (e.g., `Version.attachments: ApiFileAttachment[]`)
- Updated `src/services/api-mappers.ts` — removed domain type imports, updated function signatures to use Api types
- Updated **27 consumer files** to import removed types from `@/types/api` instead of `@/types/domain`

**Gate**: `grep -n 'export.*JsonValue\|export.*\bChannel\b\|export.*TaskDate\|export.*FileAttachment' src/types/domain.ts` → ✅ **0 results**
**Build**: `npm run build` → ✅ passes

---

### Step 4 — Type `draftData` in builderStore ✅

**File**: `src/store/builderStore.ts`

**Current**: `draftData: any` in `EditorSession` interface (line ~11).

**Fix**: Moved the `EditorDraftData` type from `useEditorDraft.ts` to `src/types/editor.types.ts`.
Reuses the existing union `TaskCardData | ActionCardData | PhaseNodeData | DayDraft` rather than
inventing a new flattened interface — avoids duplicating field declarations.

**Changes**:
- Created `src/types/editor.types.ts` with `DayDraft` and `EditorDraftData`
- Updated `useEditorDraft.ts` to import from `@/types/editor.types` (removed local declarations)
- Updated `builderStore.ts` `EditorSession.draftData: any` → `EditorSession.draftData: EditorDraftData`
- Updated `EditorHeader.tsx` prop type from `any` to `EditorDraftData` (with `as TaskCardData` cast for task-specific field access)
- Updated `EditorSessionPill.tsx` to use `unknown` cast for runtime type-narrowed access
- Updated `EditorViewerIsland.tsx` to remove `session.draftData?.kind` fallback (not on type)

**Verification**: `npx tsc --noEmit` ✅ passes. `npm run build` ✅ passes.

---

### Step 5 — Remove stale selection state from builderStore ✅

**File**: `src/store/builderStore.ts`

**Background**: FE-R2 found `selection.selectedNodeIds` and `selection.focusedNodeId` in builderStore
are deprecated — StageContext is the live source of truth, and `setSelection` appears unused.

**Verification**: `grep -rn 'builderStore.*selection\|useBuilderStore.*selectedNodeIds\|useBuilderStore.*focusedNodeId\|setSelection' src/ --include='*.tsx' --include='*.ts'`
→ 0 results outside builderStore.ts. Safe to remove.

**Changes removed**:
- `BuilderSelection` interface (exported, 0 consumers)
- `selection: BuilderSelection` field from state
- `setSelection` action (definition + implementation)
- `selection: { selectedNodeIds: [], focusedNodeId: null }` from initialState

**Verification**: `npx tsc --noEmit` ✅ passes. `npm run build` ✅ passes.

---

### Step 6 — Centralized error handling via transport wrapper ✅

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

**Files updated** — all exported functions wrapped in 8 service files:
| Service | Functions wrapped |
|---|---|
| `access.service.ts` | `getMyAccess`, `checkDCXAccess` |
| `ai.service.ts` | `createAIReviewDraft` |
| `builder.service.ts` | `getBuilder`, `saveBuilder` |
| `channels.service.ts` | `getChannels`, `getCompositions`, `createComposition` |
| `files.service.ts` | `getVersionFiles`, `attachVersionFile` |
| `logs.service.ts` | `getActivityLogs`, `writeLifecycleLog` |
| `subtask-definitions.service.ts` | `getSubtaskDefinitions` |
| `versions.service.ts` | `getVersions`, `getVersion`, `updateStatus`, `updateVersionDate`, `duplicateVersion` |

**Excluded** (intentionally): `clickup.service.ts` (stub per A4), `error-reporter.service.ts` (error handler itself)

**Verification**: `grep -rn 'withServiceErrorHandler' src/services/*.ts | wc -l` → 27 (1 def + 1 import per file + 18 wrapped functions)
`npx tsc --noEmit` ✅ passes. `npm run build` ✅ passes.

This gives consistent error reporting without duplicating try/catch in every function.
When the real backend connects, only `error-reporter.service.ts` needs to change.

---

### Step 7 — Wire apiClient() seam (mock-compatible) ✅

**File**: `src/services/api-client.ts`

**Current**: `apiClient()` always throws — "seam only in Sprint 2" comment.

**Fix**: `apiClient()` now dispatches to `mockDispatch()` (no env var check — always mock in pre-v1).
Created `src/services/mock-dispatch.ts` with a route-pattern-to-handler map covering all 19 routes.

**Route coverage**: channels (3), builder (2), versions (5), files (2), logs (2), subtask-definitions (2),
access (2), ai (1), clickup (1) — 19 total route patterns.

**Note**: Services do NOT need to call `apiClient()` yet. This is the seam — individual services
can be migrated to use it in a future sprint when a real API is connected.

**Verification**: `npx tsc --noEmit` ✅ passes. `npm run build` ✅ passes.

---

### Step 8 — Add MOCK_USER_ID replacement ✅

**Current**: `MOCK_USER_ID = 'mock-user'` hardcoded in 3 service files.

**Fix**: Created `src/mock/constants.ts`:
```typescript
export const MOCK_USER_ID = 'mock-user-001';
export const MOCK_WORKSPACE_ID = 'workspace-001';
```

**Files updated**:
- `src/services/channels.service.ts` — removed local `MOCK_USER_ID = 'mock-user'`, imports from `@/mock/constants`
- `src/services/versions.service.ts` — removed local `MOCK_USER_ID = 'mock-user'`, imports from `@/mock/constants`
- `src/services/access.service.ts` — replaced `userId: 'mock-user'` literal with `MOCK_USER_ID` import

**Verification**: `grep -rn "MOCK_USER_ID.*=.*'" src/services/` → 0 results ✅
`npx tsc --noEmit` ✅ passes. `npm run build` ✅ passes.

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
