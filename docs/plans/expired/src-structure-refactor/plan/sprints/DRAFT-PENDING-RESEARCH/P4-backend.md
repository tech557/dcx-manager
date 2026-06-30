---
sprint: P4-backend
plan: src-structure-refactor
title: Backend Integration Readiness
status: not-started
output: docs/plans/active/src-structure-refactor/output/P4-backend-report.md
depends-on: P1-tokens (for shared type awareness); P2/P3 not required — can run in parallel
---

# P4 — Backend Integration Readiness

## Goal

When a real backend ships, connecting it should mean: point `src/services/` at the new API base URL and fix type mismatches — nothing else. No component should need to change. No query logic should need to change. The type boundary between API and UI must be explicit and enforced.

After this sprint, the backend team can read `src/types/api-raw.ts` to know exactly what the frontend expects, and the frontend team can change the UI without knowing anything about the API shape.

---

## Current State Problems

### Problem 1 — `src/types/api.ts` mixes raw API shapes with UI types

`src/types/api.ts` (166 lines) contains types that are a mix of:
- Raw API response shapes (what the server sends — arrays of IDs, snake_case or camelCase depending on the field)
- UI-derived types (what components need — computed fields, UI-only states)
- Types that exist only because the mock data has that shape

When the real API ships and returns different field names or nesting, there is no clear place to absorb the change without touching component files.

### Problem 2 — `src/services/api-mappers.ts` is 228 lines with no type contract

`src/services/api-mappers.ts` transforms raw API responses into domain types. It is 228 lines. But:
- The input type is not strictly typed as "raw API response" — some functions accept `any` or use partial types
- The output type bleeds UI-specific fields that should not come from the API layer
- There is no test for a mapping function

### Problem 3 — `src/services/versions.service.ts` is 215 lines

`versions.service.ts` handles version fetching and transformation. It does too much: fetches, transforms, caches, and derives UI-specific computed fields in the same file.

### Problem 4 — No documented integration contract

There is no file that tells a backend developer what the frontend expects. The API spec lives in mock data files (`src/mock/`) which are not structured as a contract.

---

## Deliverables

### 1. Split `src/types/` into two clear files

#### `src/types/api-raw.ts` (new)
Contains only raw API response shapes — exactly what the server sends, nothing more.

Rules for this file:
- No computed fields (no `isReady`, no `taskCount`, no `displayName`)
- No union types derived from UI state
- Field names must match what the actual (or planned) API returns
- Every type is prefixed `Raw` to distinguish it: `RawProject`, `RawVersion`, `RawPhase`, `RawAction`, `RawTask`

Structure:
```ts
// src/types/api-raw.ts
export interface RawTask {
  id: string;
  action_id: string;          // snake_case if that's what API sends
  name: string;
  channel_id: string | null;
  channel_composition_id: string | null;
  status: 'draft' | 'active' | 'completed' | 'blocked';
  due_date: string | null;    // ISO string from API
  subtasks: RawSubtask[];
  locked: boolean;
  created_at: string;
  updated_at: string;
}
// ... RawSubtask, RawAction, RawPhase, RawVersion, RawProject, RawChannel, RawChannelComposition
```

#### `src/types/domain.ts` (already exists — keep, but clean)
Contains UI domain types — what components work with. These may have computed fields, camelCase fields, and UI-specific status derivations.

```ts
// src/types/domain.ts
export interface Task {
  id: string;
  actionId: string;
  name: string;
  channelId: string | null;
  compositionId: string | null;
  status: TaskStatus;
  dueDate: Date | null;       // Date object, not string
  subtasks: Subtask[];
  isLocked: boolean;
  isReady: boolean;           // computed — no equivalent in RawTask
  taskKind: 'channel' | 'manual';  // computed from channelId
}
```

#### `src/types/api.ts` (existing — becomes a re-export barrel)
After the split, `api.ts` becomes:
```ts
// Kept for backwards compatibility during migration. Do not add new types here.
export * from './api-raw';
export * from './domain';
```

---

### 2. Add strict types to `src/services/api-mappers.ts`

Every mapper function must have an explicit input type (`Raw*`) and output type (domain type). No `any`.

Pattern:
```ts
// BEFORE
export function mapTask(raw: any): Task { ... }

// AFTER
import type { RawTask } from '@/types/api-raw';
import type { Task }    from '@/types/domain';

export function mapTask(raw: RawTask): Task {
  return {
    id:           raw.id,
    actionId:     raw.action_id,
    name:         raw.name,
    channelId:    raw.channel_id,
    compositionId:raw.channel_composition_id,
    status:       raw.status,
    dueDate:      raw.due_date ? new Date(raw.due_date) : null,
    subtasks:     raw.subtasks.map(mapSubtask),
    isLocked:     raw.locked,
    isReady:      deriveReadiness(raw),
    taskKind:     raw.channel_id ? 'channel' : 'manual',
  };
}
```

If `api-mappers.ts` stays over 200 lines after adding types, split it by domain:
```
src/services/mappers/
  task.mapper.ts
  phase.mapper.ts
  channel.mapper.ts
  index.ts   ← re-exports all
```

---

### 3. Split `src/services/versions.service.ts` (215 lines)

Current responsibilities (all in one file):
- Fetch version data from API
- Transform response into domain type
- Cache the result
- Derive computed fields (is version editable, phase count, etc.)

Split into:
```
src/services/versions.fetch.ts    ← HTTP fetch + raw response type (~60 lines)
src/services/versions.mapper.ts   ← RawVersion → Version transformation (~60 lines)
src/services/versions.service.ts  ← orchestration: fetch + map + cache (~60 lines)
```

---

### 4. Write the integration contract document

Create `docs/product/decisions/api-integration-contract.md`:

```markdown
# API Integration Contract

Version: v0.3.2
Status: Frontend-ready, awaiting backend

## Base URL

Current (mock): `src/mock/`
Target: `VITE_API_BASE_URL` environment variable

## Auth

Expected: Bearer token in `Authorization` header
Token source: `src/services/auth.service.ts` (existing)

## Endpoints

| Method | Path | Request | Response | Mapper |
|---|---|---|---|---|
| GET | `/projects/:id` | — | `RawProject` | `mapProject()` in `project.mapper.ts` |
| GET | `/versions/:id` | — | `RawVersion` | `mapVersion()` in `versions.mapper.ts` |
| PATCH | `/tasks/:id` | `Partial<RawTask>` | `RawTask` | `mapTask()` |
| ... | | | | |

## What the frontend will NOT change when the backend ships

- No component file
- No query file in `src/queries/`
- No action file in `src/actions/`
- No rule file in `src/rules/`

## What will change when the backend ships

- `VITE_API_BASE_URL` environment variable (`.env`)
- `src/services/*.fetch.ts` files: replace mock import with real fetch call
- `src/types/api-raw.ts`: update field names if API uses different casing or structure
- `src/services/mappers/*.mapper.ts`: update field mappings to match
```

---

### 5. Add one mapper test per domain entity

In `src/services/mappers/__tests__/`:

```ts
// task.mapper.test.ts
import { mapTask } from '../task.mapper';
import type { RawTask } from '@/types/api-raw';

const rawTask: RawTask = {
  id: 'task-1',
  action_id: 'action-1',
  name: 'Write copy',
  channel_id: 'ch-email',
  channel_composition_id: null,
  status: 'draft',
  due_date: '2026-07-01T00:00:00Z',
  subtasks: [],
  locked: false,
  created_at: '2026-06-01T00:00:00Z',
  updated_at: '2026-06-01T00:00:00Z',
};

test('mapTask converts snake_case to camelCase', () => {
  const task = mapTask(rawTask);
  expect(task.actionId).toBe('action-1');
  expect(task.channelId).toBe('ch-email');
  expect(task.dueDate).toBeInstanceOf(Date);
  expect(task.isLocked).toBe(false);
  expect(task.taskKind).toBe('channel');
});

test('mapTask derives isReady correctly', () => {
  const task = mapTask({ ...rawTask, status: 'active' });
  expect(task.isReady).toBe(/* whatever the readiness rule says */);
});
```

Add tests for: `mapTask`, `mapSubtask`, `mapAction`, `mapPhase`, `mapVersion`.

---

## Acceptance Criteria

- [ ] `src/types/api-raw.ts` exists with `Raw*` types for all 7 domain entities (Project, Version, Phase, Action, Task, Subtask, Channel/ChannelComposition)
- [ ] `src/types/domain.ts` contains only UI domain types — no `Raw*` types in it
- [ ] `src/types/api.ts` is a re-export barrel only (≤ 5 lines)
- [ ] Every function in `src/services/api-mappers.ts` (or split mappers) has explicit `Raw*` input type — no `any`
- [ ] `src/services/versions.service.ts` ≤ 70 lines
- [ ] `docs/product/decisions/api-integration-contract.md` exists with endpoint table
- [ ] Mapper tests exist for at least 5 domain entities
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx vitest run` → all passing (including new mapper tests)

---

## Session Log Instructions

```
docs/progress/sessions/<date>-<agent>/NN-P4-backend.md
```

Output file at:
```
docs/plans/active/src-structure-refactor/output/P4-backend-report.md
```

Output must include:
- List of `Raw*` types created and how they differ from existing `api.ts` types
- List of mapper functions that had `any` → now typed (with before/after types)
- Line count before/after for `versions.service.ts` and `api-mappers.ts`
- Confirmation that no component file was changed
