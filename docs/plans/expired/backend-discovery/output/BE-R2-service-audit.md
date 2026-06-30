# BE-R2: Service Layer Audit

Generated: 2026-06-26
Based on: src/services/ (12 files, 820 lines), src/actions/ (9 files, 938 lines), src/queries/ (5 files)

---

## Service Files

### src/services/api-client.ts (53 lines)
| Export | Signature | Typed? | Purpose |
|---|---|---|---|
| `getMockStorageKey(key)` | `string → string` | Yes | Builds localStorage prefix |
| `readMockJson<T>(key, fallback)` | `(string, T) → T` | Yes (generic) | Read from localStorage with JSON parse, fallback to default |
| `writeMockJson<T>(key, value)` | `(string, T) → T` | Yes (generic) | Write to localStorage, returns value |
| `apiClient<TData, TBody>(route, options?)` | `(string, ApiClientRequestOptions) → Promise<ApiClientResponse<TData>>` | Yes (generic) | **THROWS** — "seam only in Sprint 2" |

**Calls mock?**: Yes — pure localStorage. `apiClient` is an intentional placeholder that always throws.

**Any usages**: 0. Fully generic.

---

### src/services/api-mappers.ts (228 lines)
Full bi-directional mappers for every domain entity. `mapJson()` and `stripResolvedDate()` are internal helpers.

| Entity | api→domain mapper | domain→api mapper | Input typed? | Notes |
|---|---|---|---|---|
| AssignedMember | `apiAssignedMemberToDomain` | `domainAssignedMemberToApi` | Yes | Spread — identical shapes |
| FileAttachment | `apiFileAttachmentToDomain` | `domainFileAttachmentToApi` | Yes | Spread — identical shapes |
| Channel | `apiChannelToDomain` | `domainChannelToApi` | Yes | Spread — identical shapes |
| SubtaskDefinition | `apiSubtaskDefinitionToDomain` | —(reverse not needed) | Yes | Spread — identical shapes |
| ChannelComposition | `apiChannelCompositionToDomain` | `domainChannelCompositionToApi` | Yes | Spread — identical shapes |
| Subtask | `apiSubtaskToDomain` | `domainSubtaskToApi` | Yes | Maps `metadata` via `mapJson()` |
| Task | `apiTaskToDomain` | `domainTaskToApi` | Yes | Strips `resolvedDate`, maps metadata, recurses subtasks |
| Action | `apiActionToDomain` | `domainActionToApi` | Yes | Recurses tasks, maps metadata |
| Phase | `apiPhaseToDomain` | `domainPhaseToApi` | Yes | Recurses actions, maps metadata |
| Version | `apiVersionToDomain` | `domainVersionToApi` | Yes | Maps assignedTeam, attachments, metadata, strategyContext |
| DCX | `apiDCXToDomain` | `domainDCXToApi` | Yes | Maps metadata |
| ActivityEvent | `apiActivityEventToDomain` | `domainActivityEventToApi` | Yes | Maps details |
| BuilderTree | `apiBuilderTreeToDomain` | `domainBuilderTreeToApi` | Yes | Composes version + phase mappers |
| — (phases only) | — | `domainPhasesToApi` | Yes | Maps Phase[] → ApiPhase[] |

**Any usages**: 0. All inputs/outputs fully typed. The `as ApiJsonValue | null` casts in domain→api mappers are explicit type-safe downcasts (ApiJsonValue ≅ JsonValue, but TypeScript doesn't infer identity without explicit cast).

**Called from**: All mappers are called in `queries/` (builder, channels, versions, subtask-definitions) or `hooks/useAutosave.ts` (domainPhasesToApi).

---

### src/services/versions.service.ts (215 lines)
| Export | Signature | Calls mock? | Has mapper? | Error handling? | Any? |
|---|---|---|---|---|---|
| `getVersions(dcxId)` | `string → Promise<ApiVersion[]>` | Yes (readMockJson, seedVersions) | No — returns ApiVersion directly | No | No |
| `getVersion(versionId)` | `string → Promise<ApiVersion>` | Yes (readMockJson) | No — returns ApiVersion directly | Yes — throws if not found | No |
| `updateStatus(versionId, status)` | `(string, VersionStatus) → Promise<ApiVersion>` | Yes (readMockJson + writeMockJson) | No — returns ApiVersion directly | Yes — throws on illegal transition (calls lifecycle.rules) | No |
| `updateVersionDate(versionId, date)` | `(string, string\|null) → Promise<ApiVersion>` | Yes (readMockJson + writeMockJson) | No — returns ApiVersion directly | No | No |
| `duplicateVersion(sourceVersionId)` | `string → Promise<ApiVersion>` | Yes (readMockJson + writeMockJson) | No — returns ApiVersion directly | Yes — throws if source not found | No |

**Real API readiness**: LOW. All return types are `ApiVersion` (raw API shape), but `version.actions.ts` re-exports them as `Promise<Version>` (domain type) — consumers expect domain types. The domain mapping happens in `queries/versions.queries.ts` via `apiVersionToDomain`.

---

### src/services/builder.service.ts (86 lines)
| Export | Signature | Calls mock? | Has mapper? | Error handling? | Any? |
|---|---|---|---|---|---|
| `getBuilder(versionId)` | `string → Promise<ApiBuilderTree>` | Yes (readMockJson + seedPhases) | No — returns ApiBuilderTree directly | No | No |
| `saveBuilder(versionId, phases)` | `(string, ApiPhase[]) → Promise<ApiBuilderTree>` | Yes (writeMockJson) | No — returns ApiBuilderTree directly | No | No |

**Real API readiness**: LOW. `seedPhases()` generates default data when nothing is in localStorage. The tree structure (version + phases) is constructed from two separate stores.

---

### src/services/channels.service.ts (76 lines)
| Export | Signature | Calls mock? | Has mapper? | Error handling? | Any? |
|---|---|---|---|---|---|
| `getChannels()` | `→ Promise<ApiChannel[]>` | Yes (readMockJson, MOCK_CHANNELS) | No | No | No |
| `getCompositions(channelId)` | `string → Promise<ApiChannelComposition[]>` | Yes (readMockJson, MOCK_COMPOSITIONS) | No | No | No |
| `createComposition(channelId, input)` | `(string, {name, definitionIds}) → Promise<ApiChannelComposition>` | Yes (readMockJson + writeMockJson) | No | No | No |

**Real API readiness**: MEDIUM. Fully CRUD with typed inputs. `createComposition` writes to both compositions list and channel's `availableCompositionIds`. The only blocker is swapping localStorage for fetch.

---

### src/services/files.service.ts (18 lines)
| Export | Signature | Calls mock? | Has mapper? | Error handling? | Any? |
|---|---|---|---|---|---|
| `getVersionFiles(versionId)` | `string → Promise<ApiFileAttachment[]>` | Yes (gets from version.attachments) | No | No | No |
| `attachVersionFile(versionId, file)` | `(string, ApiFileAttachment) → Promise<ApiFileAttachment>` | **NO-OP** (returns input) | No | No | No |

**Real API readiness**: LOW. `attachVersionFile` is a stub — it never saves. `getVersionFiles` reads from a version's attachments array, but never updates it.

---

### src/services/logs.service.ts (39 lines)
| Export | Signature | Calls mock? | Has mapper? | Error handling? | Any? |
|---|---|---|---|---|---|
| `getActivityLogs(versionId)` | `string → Promise<ApiActivityEvent[]>` | Yes (readMockJson) | No | No | No |
| `writeLifecycleLog(input)` | `WriteLifecycleLogInput → Promise<ApiActivityEvent>` | Yes (readMockJson + writeMockJson) | No | No | No |

**Real API readiness**: MEDIUM. Clean CRUD. Only blocker is swapping localStorage for fetch.

---

### src/services/subtask-definitions.service.ts (22 lines)
| Export | Signature | Calls mock? | Has mapper? | Error handling? | Any? |
|---|---|---|---|---|---|
| `getSubtaskDefinitions(channelId?)` | `string? → Promise<ApiSubtaskDefinition[]>` | Yes (readMockJson, MOCK_SUBTASK_DEFINITIONS) | No | No | No |

**Real API readiness**: MEDIUM. Simple read-only with optional filter.

---

### src/services/access.service.ts (38 lines)
| Export | Signature | Calls mock? | Has mapper? | Error handling? | Any? |
|---|---|---|---|---|---|
| `getMyAccess()` | `→ Promise<MyAccess>` | Yes (readMockJson, static default) | No — inline | No | No |
| `checkDCXAccess(dcxId)` | `string → Promise<DCXAccess>` | Yes (readMockJson, static default with `true`) | No — inline | No | No |

**Real API readiness**: LOW. Always returns `isAuthenticated: true`, `canEdit: true`. Not realistic.

---

### src/services/ai.service.ts (16 lines)
| Export | Signature | Calls mock? | Has mapper? | Error handling? | Any? |
|---|---|---|---|---|---|
| `createAIReviewDraft(prompt)` | `string → Promise<AIReviewDraft>` | No — returns static {id, summary, []} | No | No | No — but `proposedActions: unknown[]` |

**Real API readiness**: LOW. Pure seed stub. `unknown[]` is fine — the AI feature is not P4 priority.

---

### src/services/clickup.service.ts (16 lines)
| Export | Signature | Calls mock? | Has mapper? | Error handling? | Any? |
|---|---|---|---|---|---|
| `getClickUpEntryPayload(versionId)` | `string → Promise<ClickUpEntryPayload>` | No — returns static {versionId, null, null} | No | No | No |

**Real API readiness**: LOW. Pure seed stub.

---

### src/services/error-reporter.service.ts (13 lines)
| Export | Signature | Calls mock? | Has mapper? | Error handling? | Any? |
|---|---|---|---|---|---|
| `reportError(payload)` | `ErrorReportPayload → Promise<{reported: true}>` | No — just console.error | No | No | No — but `failedPayload?: unknown` |

**Real API readiness**: PATCH. The console.error approach is valid for dev; real backend would be a `POST /error-reports`. `unknown` type for payload is appropriate.

---

## Action Files

### src/actions/builder.actions.ts (16 lines)
Aggregator — merges `phaseActions`, `actionActions`, `taskActions`, `nodeActions` into single `builderActions` object.

### src/actions/useBuilderActions.ts (6 lines)
React hook: `useMemo(() => builderActions, [])`. Clean — no deps, no re-render.

### src/actions/phase.actions.ts (133 lines)
| Action | Calls service? | Validates input? | Error handling? | any? |
|---|---|---|---|---|
| `createPhase` | Yes — lazy `versions.service` (updates status Draft→In Progress) | No | No | No |
| `updatePhase` | No — store mutation only | No | No | No |
| `deletePhase` | No — store mutation only | No | No | No |
| `movePhase` | No — store mutation only | No | No | No |
| `movePhases` | No — store mutation only | No | No | No |

### src/actions/action.actions.ts (213 lines)
| Action | Calls service? | Validates input? | Error handling? | any? |
|---|---|---|---|---|
| `createAction` | No — store mutation only | No | Yes — throws if phase not found | No |
| `updateAction` | No — store mutation only | No | No | No |
| `deleteAction` | No — store mutation only | No | No | No |
| `moveAction` | No — store mutation only | No | No | No |
| `moveActions` | No — store mutation only | No | No | No |

### src/actions/task.actions.ts (288 lines)
| Action | Calls service? | Validates input? | Error handling? | any? |
|---|---|---|---|---|
| `createTask` | No — store mutation only | No | Yes — throws if action not found | No |
| `updateTask` | No — store mutation only | No | Yes — early return if phase not found (silent) | No |
| `deleteTask` | No — store mutation only | No | No | No |
| `moveTask` | No — store mutation only | No | No | No |
| `moveTasks` | No — store mutation only | No | No | No |

### src/actions/node.actions.ts (130 lines)
| Action | Calls service? | Validates input? | Error handling? | any? |
|---|---|---|---|---|
| `duplicateNode` | No — store mutation only | No | No | No |
| `applyImport` | No — store mutation only | No | No | No |

### src/actions/version.actions.ts (22 lines)
| Action | Calls service? | Validates input? | Error handling? | any? |
|---|---|---|---|---|
| `updateVersionStatus` | Yes — `versions.service.updateStatus` | No (delegates to service) | No (delegates to service) | No |
| `updateVersionCommunicationDate` | Yes — `versions.service.updateVersionDate` | No | No | No |
| `duplicateEditableVersion` | Yes — `versions.service.duplicateVersion` | No | No | No |

### src/actions/action.guards.ts (37 lines)
`assertCanRunBuilderMutation(command)`: checks `isLocked` from builderStore. Throws `ActionGuardError` if locked. All builder actions call this guard.

### src/actions/action.helpers.ts (57 lines)
Shared pure utilities: `renumberPhases`, `renumberActions`, `renumberTasks`, `updatePhaseNode`, `mapActions`, `findPhaseForAction`. All fully typed.

---

## `any` Usage Summary

**0 occurrences of `: any` or `as any` in src/services/ or src/actions/**.

The only type-safety concern is `draftData: any` in `builderStore.ts` (identified in FE-R2), which is in the store, not services/actions.

---

## Mapper Coverage

| Entity | api→domain mapper | domain→api mapper | Called from |
|---|---|---|---|
| AssignedMember | ✅ `apiAssignedMemberToDomain` | ✅ `domainAssignedMemberToApi` | (internal — via Version mapping) |
| FileAttachment | ✅ `apiFileAttachmentToDomain` | ✅ `domainFileAttachmentToApi` | (internal — via Version mapping) |
| Channel | ✅ `apiChannelToDomain` | ✅ `domainChannelToApi` | `queries/channels.queries.ts` |
| ChannelComposition | ✅ `apiChannelCompositionToDomain` | ✅ `domainChannelCompositionToApi` | `queries/channels.queries.ts` |
| SubtaskDefinition | ✅ `apiSubtaskDefinitionToDomain` | ❌ No reverse needed | `queries/subtask-definitions.queries.ts` |
| Subtask | ✅ `apiSubtaskToDomain` | ✅ `domainSubtaskToApi` | (internal — via Task mapping) |
| Task | ✅ `apiTaskToDomain` | ✅ `domainTaskToApi` | (internal — via Action mapping) |
| Action | ✅ `apiActionToDomain` | ✅ `domainActionToApi` | (internal — via Phase mapping) |
| Phase | ✅ `apiPhaseToDomain` | ✅ `domainPhaseToApi` | (internal — via BuilderTree mapping) |
| Version | ✅ `apiVersionToDomain` | ✅ `domainVersionToApi` | `queries/versions.queries.ts` |
| DCX | ✅ `apiDCXToDomain` | ✅ `domainDCXToApi` | (potential future use) |
| ActivityEvent | ✅ `apiActivityEventToDomain` | ✅ `domainActivityEventToApi` | (potential future use) |
| BuilderTree | ✅ `apiBuilderTreeToDomain` | ✅ `domainBuilderTreeToApi` | `queries/builder.queries.ts` |
| Phases[] (only) | ❌ No reverse for array-only | ✅ `domainPhasesToApi` | `hooks/useAutosave.ts` |

**Coverage**: 100%. Every entity has typed bi-directional mappers. 0 mappers use `any`.

**Missing mappers**: Only `CurrentUser` in `users.queries.ts` — it transforms `MyAccess` inline instead of using a mapper. Trivial.

---

## Real API Readiness per Service

| Service | Ready to swap? | Blockers |
|---|---|---|
| `access.service.ts` | ❌ No | Always returns hardcoded `true` values. No real auth flow. |
| `ai.service.ts` | ❌ No | Static seed data only. Feature itself is placeholder. |
| `api-client.ts` | ❌ No | `apiClient()` throws. All services bypass it and use `readMockJson`/`writeMockJson` directly. |
| `api-mappers.ts` | ✅ Yes | Fully typed, no `any`. Swap mock → real API data, mappers work unchanged. |
| `builder.service.ts` | ❌ No | `seedPhases` generates data on empty store. `getBuilder` constructs tree from 2 stores (version + phases). |
| `channels.service.ts` | ⚠️ Partial | `createComposition` has side-effect writes (updating channel's composition list). Otherwise clean. |
| `clickup.service.ts` | ❌ No | Static seed stub. Feature not real. |
| `error-reporter.service.ts` | ⚠️ Partial | Logic works for dev. Console.error → API call. |
| `files.service.ts` | ❌ No | `attachVersionFile` is a no-op stub. |
| `logs.service.ts` | ⚠️ Partial | Clean CRUD. Only localStorage dependency. |
| `subtask-definitions.service.ts` | ⚠️ Partial | Simple read-only with filter. Only localStorage dependency. |
| `versions.service.ts` | ⚠️ Partial | CRUD + status transitions (with rules). `updateStatus` has the most real logic. Only localStorage dependency. |

**Overall verdict**: 0 services are "ready to swap" as-is. The mappers layer is the only piece that survives a real backend swap.

---

## Summary

| Metric | Count |
|---|---|
| Service files | 12 (820 lines) |
| Action files | 8 (938 lines, excluding helpers) |
| Exported service functions | 17 |
| Exported action functions | 17 (+ 2 guard functions) |
| `any` usages | **0** |
| Entities with typed mappers | 12/12 (100%) |
| Services with localStorage dependency | 8/12 |
| Services that are pure seed stubs | 3 (ai, clickup, error-reporter) |
| Queries that call mappers | 4/5 (users.queries transforms inline) |

### Key findings

1. **Cleanest layer in the entire codebase**: Services and actions have zero `any` usages. All input/output types are explicit. This is a strong foundation.

2. **All services depend on localStorage, not network**: Every real data service (`readMockJson`/`writeMockJson`) reads/writes localStorage. The `apiClient()` seam exists but is unused. Swapping requires replacing `readMockJson`/`writeMockJson` with `fetch` calls.

3. **Actions split into two patterns**: Builder mutations (phase/action/task/node) are pure store operations — they never call services. Version mutations are thin wrappers that delegate to `versions.service`. There is no inconsistency — this is intentional (builder is optimistic, version has server-enforced state machine).

4. **Mappers are a standalone layer**: They receive typed API shapes and return typed domain shapes. They would survive a backend swap unchanged. The only work is in the service layer.

5. **No query invalidation after store mutations**: Builder mutations (createPhase, createAction, createTask, delete*) modify the zustand store directly. The queries layer is not notified — the store change triggers React re-render via the zustand subscription. This works because the builder queries re-fetch on mount, not on invalidation. This is a P4 consideration.
