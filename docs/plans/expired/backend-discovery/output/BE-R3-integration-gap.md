# BE-R3: Integration Gap Analysis

Generated: 2026-06-26
Based on: BE-R1-type-inventory.md, BE-R2-service-audit.md

---

## Scenario A — Same shape, real API

If the real API returns JSON with the exact same field names and nesting as the current mock data:

### Would work without changes

| Layer | Files | Reason |
|---|---|---|
| **Mappers** | `api-mappers.ts` (228 lines) | 100% typed, 0 `any` — receive Api* types, return domain types. The mapping logic is correct regardless of whether data came from localStorage or fetch. |
| **Queries** | `builder.queries.ts`, `versions.queries.ts`, `channels.queries.ts`, `subtask-definitions.queries.ts` | All queries call mapper after service call. If service returns same shape, mapping is identical. |
| **Actions (builder)** | `phase.actions.ts`, `action.actions.ts`, `task.actions.ts`, `node.actions.ts` | Store mutations only. No service calls. Unaffected. |
| **Actions (version)** | `version.actions.ts` | Thin wrappers — delegates to versions.service. If that service is swapped, actions work if the signatures match. |
| **Guards** | `action.guards.ts` | Checks `isLocked` in zustand store. Independent of backend. |
| **Helpers** | `action.helpers.ts`, `node.helpers.ts` | Pure utilities. Independent of backend. |

### Would break (and fix needed)

| Broken thing | Why | Fix |
|---|---|---|
| `versions.service.ts` | Directly calls `readMockJson`/`writeMockJson` | Replace with `fetch` calls. Keep `updateStatus` transition logic. |
| `builder.service.ts` | Directly calls `readMockJson`/`writeMockJson`. Uses `seedPhases()` for empty state. | Replace with `fetch`. Remove seed logic — real API returns data or 404. |
| `channels.service.ts` | Directly calls `readMockJson`/`writeMockJson`. `createComposition` has side-effect writes to 2 stores. | Replace with `fetch`. Side-effect writes move to server. |
| `logs.service.ts` | Directly calls `readMockJson`/`writeMockJson` | Replace with `fetch`. |
| `subtask-definitions.service.ts` | Directly calls `readMockJson` | Replace with `fetch`. |
| `files.service.ts` | `getVersionFiles` reads from localStorage version. `attachVersionFile` is a **no-op stub** (returns input, never saves). | Swap to fetch. Fix `attachVersionFile` to actually POST. |
| `access.service.ts` | Always returns hardcoded `true`. `getMyAccess` uses `readMockJson` as pass-through. | Replace with real auth endpoint. |
| `safe-storage.ts` | 66 lines of localStorage abstraction with memory fallback | Delete entirely — no service uses it after swap. |
| `api-client.ts` | `apiClient()` throws. The seam exists but was never wired. | Wire `apiClient` to do real `fetch()`. Or delete and replace with per-service fetch calls. |
| `useAutosave.ts` | Calls `saveBuilder` which calls `writeMockJson`. In a real API, autosave calls PATCH. | Works if `saveBuilder` is swapped — no hook change needed. |
| `seedVersions()` / `seedPhases()` | Hardcoded seed data (60+ lines). Only used when localStorage is empty. | Delete on swap. Real API never needs seed data. |
| `MOCK_USER_ID = 'mock-user'` | Hardcoded in 3 service files. | Replace with authenticated user from access service. |

**Summary**: 8 service files need their data source swapped. 1 file stubs a mutation. ~200 lines of seed/fallback logic is deleted. The `apiClient()` seam exists but is unused — it can be wired or replaced. Everything else survives.

---

## Scenario B — snake_case API

If the real API returns `snake_case` field names (`task_id`, `channel_id`, `created_at`) instead of the current `camelCase` (`id`, `channelId`, `createdAt`):

### Blast radius

| Layer | Impact | Files affected | Severity |
|---|---|---|---|
| **api.ts** (17 types) | All field names change | `src/types/api.ts` | High — every field on every type |
| **api-mappers.ts** | All pass-through mappers break silently | `src/services/api-mappers.ts` | **Critical** — 10 of 14 mapper pairs are simple `{ ...obj }` spreads. Types would still compile but map to wrong domain fields. The 4 recursive mappers (Task/Action/Phase/Version) would also break because their subtitles reference wrong field names. |
| **Mock data** (3 files) | Field names in mock objects would mismatch API | `src/mock/*.ts` | Medium — mocks are typed as Api* types, so TS catches mismatches during compile |
| **Domain types** | Unaffected — domain types stay camelCase | `src/types/domain.ts` | None — mappers handle the conversion |
| **Components** | Unaffected — they consume domain types only | All TSX/TS files | None |
| **Services** | Only affected if they process API data inline. Currently none do — all pass through mock layer. | `src/services/*.ts` | None after mapper fix |

### Pass-through mappers that break silently (no transformation, just spread)

| Mapper | Affected field count | Silent break? |
|---|---|---|
| `apiAssignedMemberToDomain` | 3 fields | Yes — `{ ...member }` copies snake_case into domain type, TS is happy, runtime data is wrong |
| `apiFileAttachmentToDomain` | 7 fields | Yes |
| `apiChannelToDomain` | 4 fields | Yes |
| `apiSubtaskDefinitionToDomain` | 4 fields | Yes |
| `apiChannelCompositionToDomain` | 6 fields | Yes |
| `apiSubtaskToDomain` | 8 fields | Partial — maps `metadata` via `mapJson()`, but spreads the rest |
| `apiTaskToDomain` | 18 fields | Partial — 3 fields explicitly mapped, 15 spread |
| `apiActionToDomain` | 10 fields | Partial — 1 field explicitly mapped, 9 spread |
| `apiPhaseToDomain` | 10 fields | Partial — 1 field explicitly mapped, 9 spread |
| `apiVersionToDomain` | 15 fields | Partial — 4 fields explicitly mapped, 11 spread |
| `apiDCXToDomain` | 9 fields | Partial — 1 field explicitly mapped, 8 spread |
| `apiActivityEventToDomain` | 6 fields | Partial — 1 field explicitly mapped, 5 spread |

### Conclusion

**The mapper layer would need a complete rewrite for every entity.** 10 spread-based pass-through mappers would silently serve broken data to components. Only the 4 recursive mappers (Task/Action/Phase/Version) have explicit field mapping — but even they spread the majority of fields.

**Recommendation**: If the real API outputs snake_case, add a field-rename step at the start of every `api*ToDomain` mapper. Or write a `camelizeKeys()` utility and call it once per response before any mapper runs. This would cost ~30 lines of utility code instead of modifying 24 mapper functions.

---

## Scenario C — Nested structure

If the real API returns nested objects instead of flat IDs:

| Current (flat) | Possible nested | Breaks? | Absorbed by mapper? |
|---|---|---|---|
| `task.channelId` | `task.channel.id` | Yes — all components read `task.channelId` | Yes — `apiTaskToDomain` maps `channel.id → channelId` |
| `task.compositionId` | `task.composition.id` | Yes | Yes — same pattern |
| `task.senderId` | `task.sender.id` | Yes | Yes |
| `task.receiverId` | `task.receiver.id` | Yes | Yes |
| `task.date` → `{mode, weekOffset}` | `task.date` → `{mode, weekOffset, resolvedDate}` | No — `stripResolvedDate` already handles this |
| `phase.actions` | `phase.actionCards` | Yes — `PhaseNodeData.actionCards` is a UI construct | Yes — but in `phasesToBuilderNodes`, not in the API mapper |
| `version.assignedTeam[i].userId` | `version.assignedTeam` flat object per user | Yes | Yes — mapper arrays handle this |

### Blast radius

| Layer | Impact | Severity |
|---|---|---|
| **Components** reading `task.channelId` directly | ~15 files (TaskProperties, TaskEditor, RoutingDirectorySection, etc.) | **High** — these access flat IDs |
| **Mappers** (api→domain) | Would need explicit mapping for nested → flat | **Medium** — already explicit for key fields, easy to extend |
| **Queries** | Unaffected — they only call mappers | None |
| **Mock data** | Would need to match new nesting | Low — 3 files |

### Conclusion

The mapper layer CAN absorb nested API structures — but only for the 4 recursive entities (Task/Action/Phase/Version) that have explicit field-by-field mapping. The 10 pass-through spread mappers would silently pass nested objects into domain types that expect flat fields.

**Recommendation**: Same as Scenario B — add `camelizeKeys()` or explicit field mapping at the mapper boundary. The mappers are the correct abstraction for this.

---

## Type Layer Split Plan

BE-R1 found **0 ambiguous types** in api.ts. All 17 api.ts types are pure raw-api shapes. The 21 domain.ts types add only mixins (`AIContextFields`, `CollaborationFields`).

No ambiguous types → no split needed. The current split is correct:
- api.ts = raw API shapes (17 types)
- domain.ts = UI-consumable types with mixins (21 types)
- builder-node.types.ts = card-specific data layers (wraps domain types with parent IDs)

### Cleanup needed (not a split — a deduplication)

The 10 types duplicated identically in domain.ts should be removed. Consumers already import from domain.ts — they'd need redirect to `@/types/api`:

1. Remove: `JsonValue`, `TaskDate`, `FieldCompletionState`, `PhaseIconType`, `Channel`, `SubtaskDefinition`, `ChannelComposition`, `FileAttachment`, `AssignedMember`, `ActivityEvent` from domain.ts
2. Update domain.ts DCX/Version/Phase/Action/Task/Subtask to import their Api counterparts and extend them directly instead of redeclaring fields
3. Update imports in the 39 files that import these from `@/types/domain` to `@/types/api`

---

## P4 Fix Priority List

### Priority 1 — Zero-risk type safety fixes (no runtime behaviour change)

| # | Fix | Files affected | Effort |
|---|---|---|---|
| 1 | Delete 48 dead CSS classes (from UX-R2) | `src/index.css` | 5 min |
| 2 | Add `type SaveStatus = 'idle' \| 'saving' \| 'saved' \| 'error'` | `builderStore.ts` | 2 min |
| 3 | Delete `ActionNode`, `PhaseNode`, `TaskNode` type aliases — no external consumers (from BE-R1) | `builder-node.types.ts` | 2 min |
| 4 | Remove `ISODate`/`ISOTimestamp` type aliases and inline `string` | `domain.ts` | 2 min |

### Priority 2 — Type deduplication (large blast radius, mechanical)

| # | Fix | Files affected | Effort |
|---|---|---|---|
| 5 | Remove 10 identical types from domain.ts (JsonValue, TaskDate, FieldCompletionState, PhaseIconType, Channel, SubtaskDefinition, ChannelComposition, FileAttachment, AssignedMember, ActivityEvent) | `domain.ts`, `types/index.ts` | 10 min |
| 6 | Update imports in 39 consuming files from `@/types/domain` to `@/types/api` for the 10 removed types | 39 TS/TSX files | 30 min |
| 7 | Rewrite DCX/Version/Phase/Action/Task/Subtask in domain.ts to `extends ApiVersion` etc. instead of redeclaring | `domain.ts` | 15 min |

### Priority 3 — Error handling (medium risk, tested)

| # | Fix | Files affected | Effort |
|---|---|---|---|
| 8 | Add `try/catch` to all service functions (currently only `versions.service` has it) | 7 service files | 20 min |
| 9 | Add `HttpError` class and return typed errors from service layer | `services/error-reporter.service.ts` or new file | 15 min |
| 10 | Wire `reportError(input)` to actually POST to `/error-reports` when API is real | `error-reporter.service.ts` | 5 min |

### Priority 4 — Service layer API readiness (P4 core work)

| # | Fix | Files affected | Effort |
|---|---|---|---|
| 11 | Wire `apiClient()` seam to do real `fetch()` or replace per-service | `api-client.ts`, 8 service files | 1-2 hrs |
| 12 | Remove `seedPhases()` / `seedVersions()` seed logic — real API owns data | `builder.service.ts`, `versions.service.ts` | 10 min |
| 13 | Fix `attachVersionFile` to actually POST | `files.service.ts` | 10 min |
| 14 | Add `camelizeKeys()` utility for Scenario B/C API shapes | new file `utils/camelize.ts` | 10 min |
| 15 | Add query invalidation after builder mutations — currently zustand drives re-render, but react-query cache is stale for any refetches | `queries/` | 20 min |

### Priority 5 — Mechanical file splits (lowest risk)

| # | Fix | Files affected | Effort |
|---|---|---|---|
| 16 | Split `api-mappers.ts` into `mappers/` directory by entity | new `mappers/` folder with 12 files | 30 min |
| 17 | Split `versions.service.ts` into fetch/mapper/persistence layers | `services/` | 20 min |

### Priority 6 — PO decisions needed

| # | Decision | Context |
|---|---|---|
| A | Field naming convention for internal app code: keep camelCase or adopt snake_case to match API? | Affects Priority 2 (duplicate type removal) — if we adopt snake_case internally, we don't remove duplicates, we rename domain.ts |
| B | Error handling strategy: `throw` (current) or `return Result<T, Error>`? | Affects Priority 3 — if Result pattern, all 17 service functions change signatures |
| C | Should `attachVersionFile` be a real mutation or stay as a stub? | The feature appears incomplete — files are only readable, never writable |
| D | `ai.service.ts` and `clickup.service.ts` — are these features dead code or future scope? | If dead, delete both files. If future, leave as stubs. |

---

## Summary for PO

If we connected a real API today with the same data shape:
- **8 things** would break (all services that call localStorage)
- **Everything else** works (mappers, queries, actions, components)
- After P4 Priority 1-4 (estimated ~4 hours): 0 things break, the app talks to a real backend
- The `apiClient()` seam exists but was never wired — it's the intended path but needs to be built

**Biggest gap**: No service currently makes a network call. The localStorage abstraction has no equivalent `fetch` implementation. The seam (`apiClient` that throws) proves the pattern was designed for but never implemented.

**Cleanest path to real API**: Delete `readMockJson`/`writeMockJson`, wire `apiClient()` to do `fetch()`, swap 8 service files to call `apiClient()` instead of mock functions. Mappers survive unchanged.
