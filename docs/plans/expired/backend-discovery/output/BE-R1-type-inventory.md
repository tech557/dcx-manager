# BE-R1: Type + Mock Inventory

Generated: 2026-06-26
Based on: src/types/api.ts (166 lines), src/types/domain.ts (163 lines), src/types/ (8 files total), src/mock/ (3 files)

---

## api.ts Types

All 17 exported types/interfaces from `src/types/api.ts`.

| # | Type | Kind | Fields | Classification | Problems |
|---|---|---|---|---|---|
| 1 | `ApiJsonValue` | type alias | recursive JSON value | raw-api | `any`-like, used as catch-all metadata type (14 fields across api.ts cast to it) |
| 2 | `ApiTaskDate` | discriminated union | mode + date variants | raw-api | Clean — matches domain.ts `TaskDate` identically |
| 3 | `ApiChannel` | interface | id, label, icon, availableCompositionIds | raw-api | Clean |
| 4 | `ApiSubtaskDefinition` | interface | id, label, estimatedMinutes, channelIds | raw-api | Clean |
| 5 | `ApiChannelComposition` | interface | id, channelId, name, definitionIds, createdBy, isUserDefined | raw-api | Clean |
| 6 | `ApiDCX` | interface | id, clientId, projectName, product, subProduct, tags, createdAt, createdBy, metadata | raw-api | No `aiContext`/`sourceContext` fields |
| 7 | `ApiVersion` | interface | id, dcxId, versionNumber, status, dates, sourceType, assignedTeam, attachments, metadata, strategyContext | raw-api | No `aiContext`/`sourceContext` fields |
| 8 | `ApiPhase` | interface | id, versionId, label, icon, orderIndex, actions, updatedAt, updatedBy, metadata | raw-api | No `aiContext`/`sourceContext`/`CollaborationFields` |
| 9 | `ApiPhaseIconType` | type alias | 5 literal values | raw-api | Identical to domain.ts `PhaseIconType` |
| 10 | `ApiAction` | interface | id, phaseId, name, description, orderIndex, tasks, updatedAt, updatedBy, metadata | raw-api | No `aiContext`/`sourceContext`/`CollaborationFields` |
| 11 | `ApiTask` | interface | id, actionId, name, channelId, compositionId, message, senderId, receiverId, orderIndex, date, specsState, missingDataState, subtasks, isSmall, updatedAt, updatedBy, metadata, generationContext | raw-api | No `aiContext`/`sourceContext`/`CollaborationFields` |
| 12 | `ApiFieldCompletionState` | discriminated union | 3 status variants | raw-api | Identical to domain.ts `FieldCompletionState` |
| 13 | `ApiSubtask` | interface | id, taskId, definitionId, label, done, estimatedMinutes, orderIndex, metadata | raw-api | No `aiContext`/`sourceContext` fields |
| 14 | `ApiFileAttachment` | interface | id, versionId, title, url, source, createdBy, createdAt | raw-api | Clean |
| 15 | `ApiAssignedMember` | interface | userId, role, isProtected | raw-api | Clean |
| 16 | `ApiActivityEvent` | interface | id, type, versionId, userId, timestamp, details | raw-api | Clean |
| 17 | `ApiBuilderTree` | interface | version + phases array | raw-api | Composed fetch shape — no corresponding domain type |

**Counts**: raw-api: 17/17, ui-domain: 0/17, ambiguous: 0/17

**Summary**: All api.ts types are purely raw API shapes. No computed fields, no Date objects, clean.

---

## domain.ts Types

All 21 exported types/interfaces from `src/types/domain.ts`.

| # | Type | Kind | Classification | Duplicate in api.ts? | Notes |
|---|---|---|---|---|---|
| 1 | `JsonValue` | type alias | raw-api | YES — ApiJsonValue with different name | Identical to ApiJsonValue. Purely redundant. |
| 2 | `ISODate` | type alias | raw-api | No | Just `string` alias — light convention |
| 3 | `ISOTimestamp` | type alias | raw-api | No | Just `string` alias — light convention |
| 4 | `TaskDate` | discriminated union | raw-api | YES — ApiTaskDate identical | Identical definition, different name. Purely redundant. |
| 5 | `FieldCompletionState` | discriminated union | raw-api | YES — ApiFieldCompletionState identical | Identical definition, different name. Purely redundant. |
| 6 | `PhaseIconType` | type alias | raw-api | YES — ApiPhaseIconType identical | Identical definition, different name. Purely redundant. |
| 7 | `Channel` | interface | raw-api | YES — ApiChannel identical | Identical fields, no changes. Purely redundant. |
| 8 | `SubtaskDefinition` | interface | raw-api | YES — ApiSubtaskDefinition identical | Identical fields. Purely redundant. |
| 9 | `ChannelComposition` | interface | raw-api | YES — ApiChannelComposition identical | Identical fields. Purely redundant. |
| 10 | `AIContextFields` | interface (mixin) | ui-domain | No | Adds `metadata?`, `aiContext?`, `sourceContext?`. Only used as mixin. |
| 11 | `CollaborationFields` | interface (mixin) | ui-domain | No | Adds `updatedAt?`, `updatedBy?`. Only used as mixin. |
| 12 | `DCX` | interface | ui-domain | Partial (ApiDCX) | Extends AIContextFields (adds aiContext, sourceContext). Same base fields. |
| 13 | `Version` | interface | ui-domain | Partial (ApiVersion) | Extends AIContextFields (adds aiContext, sourceContext). Same base fields. |
| 14 | `Phase` | interface | ui-domain | Partial (ApiPhase) | Extends AIContextFields + CollaborationFields. Same base fields. |
| 15 | `Action` | interface | ui-domain | Partial (ApiAction) | Extends AIContextFields + CollaborationFields. Same base fields. |
| 16 | `Task` | interface | ui-domain | Partial (ApiTask) | Extends AIContextFields + CollaborationFields. Same base fields. |
| 17 | `Subtask` | interface | ui-domain | Partial (ApiSubtask) | Extends AIContextFields. Same base fields. |
| 18 | `FileAttachment` | interface | raw-api | YES — ApiFileAttachment identical | Identical fields. Purely redundant. |
| 19 | `AssignedMember` | interface | raw-api | YES — ApiAssignedMember identical | Identical fields. Purely redundant. |
| 20 | `ActivityEvent` | interface | raw-api | YES — ApiActivityEvent identical | Identical fields. Purely redundant. |

**Counts**: raw-api: 9/20 (the pure duplicates), ui-domain: 11/20 (mixins + composed), ambiguous: 0/20

---

## Types Duplicated Across Both Files

| Type in api.ts | Type in domain.ts | Identical? | Should deduplicate? |
|---|---|---|---|
| ApiJsonValue | JsonValue | Yes | YES — delete domain copy, keep one canonical |
| ApiTaskDate | TaskDate | Yes | YES — delete domain copy |
| ApiFieldCompletionState | FieldCompletionState | Yes | YES — delete domain copy |
| ApiPhaseIconType | PhaseIconType | Yes | YES — delete domain copy |
| ApiChannel | Channel | Yes | YES — delete domain copy |
| ApiSubtaskDefinition | SubtaskDefinition | Yes | YES — delete domain copy |
| ApiChannelComposition | ChannelComposition | Yes | YES — delete domain copy |
| ApiFileAttachment | FileAttachment | Yes | YES — delete domain copy |
| ApiAssignedMember | AssignedMember | Yes | YES — delete domain copy |
| ApiActivityEvent | ActivityEvent | Yes | YES — delete domain copy |
| ApiDCX → DCX | DCX | Partial | NO — domain adds aiContext/sourceContext via mixin |
| ApiVersion → Version | Version | Partial | NO — domain adds aiContext/sourceContext via mixin |
| ApiPhase → Phase | Phase | Partial | NO — domain adds mixins |
| ApiAction → Action | Action | Partial | NO — domain adds mixins |
| ApiTask → Task | Task | Partial | NO — domain adds mixins |
| ApiSubtask → Subtask | Subtask | Partial | NO — domain adds mixins |

**Total duplicated types**: 10/20 (50%) of domain.ts is exact copies of api.ts types.

**Recommendation**: Delete the 10 duplicate types from domain.ts. The remaining domain types (DCX, Version, Phase, Action, Task, Subtask) should extend from their Api counterparts directly instead of duplicating fields. This would make the domain layer a true mapping layer.

---

## Mock Data vs Type Mismatches

### channels.ts — `MOCK_CHANNELS: ApiChannel[]`
| Check | Result |
|---|---|
| Claimed type | `ApiChannel` |
| Fields match type? | ✅ Yes — all 3 mock entries have `id`, `label`, `icon`, `availableCompositionIds` |
| Extra fields? | None |
| Missing required fields? | None |
| Verdict | ✅ Clean match |

### compositions.ts — `MOCK_COMPOSITIONS: ApiChannelComposition[]`
| Check | Result |
|---|---|
| Claimed type | `ApiChannelComposition` |
| Fields match type? | ✅ Yes — all 7 entries have all 6 fields |
| Extra fields? | None |
| Missing required fields? | None |
| Verdict | ✅ Clean match |

### subtask-definitions.ts — `MOCK_SUBTASK_DEFINITIONS: ApiSubtaskDefinition[]`
| Check | Result |
|---|---|
| Claimed type | `ApiSubtaskDefinition` |
| Fields match type? | ✅ Yes — all 8 entries have `id`, `label`, `estimatedMinutes`, `channelIds` |
| Extra fields? | None |
| Missing required fields? | None |
| Verdict | ✅ Clean match |

**Summary**: All 3 mock files match their claimed types exactly. No mismatches found.

---

## Type Usage Map

### api.ts types — import locations

Only 6 files import from `@/types/api` directly:

| File | Types used |
|---|---|
| `services/api-mappers.ts` | ApiBuilderTree, ApiJsonValue, ApiTaskDate, ApiAction, ApiTask, ApiSubtask, ApiAssignedMember, ApiFileAttachment, ApiPhase, ApiActivityEvent, ApiDCX |
| `services/builder.service.ts` | ApiBuilderTree, ApiPhase |
| `services/versions.service.ts` | ApiVersion |
| `services/files.service.ts` | ApiFileAttachment |
| `services/channels.service.ts` | ApiChannel, ApiChannelComposition |
| `services/logs.service.ts` | ApiActivityEvent |
| `services/subtask-definitions.service.ts` | ApiSubtaskDefinition |
| `mock/channels.ts` | ApiChannel |
| `mock/compositions.ts` | ApiChannelComposition |
| `mock/subtask-definitions.ts` | ApiSubtaskDefinition |

**Pattern**: api.ts types are exclusively imported by `services/` and `mock/`. No component, island, or store imports them.

### domain.ts types — import locations

39 files import from `@/types/domain` (across rules/, actions/, components/, islands/, utils/).

**Key import groups** (by type):

| Type | Imported by (count) | Typical consumers |
|---|---|---|
| `Task` | 7 | rules/, actions/, imports/, utils/, timeline |
| `TaskDate` | 8 | forms/date/, TaskCreationFlow, rules/date |
| `Action` | 4 | rules/, actions/, imports/, utils/ |
| `Phase` | 5 | rules/, actions/, imports/, utils/, SelectionIsland |
| `FieldCompletionState` | 5 | FieldIndicator, CompletionStateSelect, TaskProperties, readiness rules |
| `Subtask` | 6 | TaskProperties, ChannelCompositionSelect, QuickSubtaskForm, composition helpers |
| `Channel` | 6 | ChannelCompositionFields, DayTaskCreator, TaskCreationFlow steps |
| `ChannelComposition` | 5 | ChannelCompositionFields, DayTaskCreator, TaskCreationFlow steps |
| `Version` | 3 | ApprovalConfirmModal, version actions, validation rules |
| `SubtaskDefinition` | 3 | CreateCompositionForm, composition helpers, useTaskCreationFlow |
| `FileAttachment` | 1 | MetadataFilesPopup |
| `PhaseIconType` | 3 | PhaseEditorSection, phase actions, phase icons |
| `AIContextFields` | 0 | Only used as mixin within domain.ts itself |
| `CollaborationFields` | 0 | Only used as mixin within domain.ts itself |

**Pattern**: domain.ts types are exclusively imported by UI-layer code (components, islands, actions, rules). No service imports them.

### Other type files — import locations

| File | Imported by | Notes |
|---|---|---|
| `builder-node.types.ts` | store/, utils/, queries/, actions/, builder/ (many) | Central — used by store, queries, dropzones, islands |
| `card.types.ts` | builder/cards/, card code | Card config layer |
| `stage.types.ts` | builder/stage/, store/, queries/ | Layout contract, view kind |
| `dropzone.types.ts` | builder/dropzones/ | Dropzone configuration |
| `lifecycle.ts` | types/api, types/domain | Version status enums, shared base |

---

## Dead Types (defined, never imported outside types/)

| Type | File | Notes | Action |
|---|---|---|---|
| `AIContextFields` | domain.ts | Mixin used only within domain.ts | KEEP — composition helper, not meant for direct import |
| `CollaborationFields` | domain.ts | Mixin used only within domain.ts | KEEP — composition helper, not meant for direct import |
| `ApiPhaseIconType` | api.ts | Used only within api.ts (ApiPhase.icon) | KEEP — needed as type for ApiPhase |
| `ApiFieldCompletionState` | api.ts | Used only within api.ts (ApiTask fields) | KEEP — needed for ApiTask |
| `ApiSubtask` | api.ts | Used only within api.ts (ApiTask.subtasks) | KEEP — needed for ApiTask |
| `ApiAction` | api.ts | Used only within api.ts (ApiPhase.actions) | KEEP — needed for ApiPhase |
| `ApiTask` | api.ts | Used only within api.ts (ApiAction.tasks) | KEEP — needed for ApiAction |
| `ApiAssignedMember` | api.ts | Used only within api.ts (ApiVersion.assignedTeam) | KEEP — needed for ApiVersion |
| `ActionNode` | builder-node.types.ts | Defined but never imported — components use `BuilderNode` discriminated union | STUDY — only `BuilderNode` is imported externally |
| `PhaseNode` | builder-node.types.ts | Same as ActionNode | STUDY |
| `TaskNode` | builder-node.types.ts | Same as ActionNode | STUDY |
| `ISODate` | domain.ts | Type alias `string` — used within domain.ts only | KEEP — light convention, no harm |
| `ISOTimestamp` | domain.ts | Type alias `string` — used within domain.ts only | KEEP — light convention, no harm |

**Potential dead types to clean up**: None. All existing types serve a purpose. The `BuilderNode` discriminated union makes `ActionNode`/`PhaseNode`/`TaskNode` unnecessary for external consumers, but they're useful for internal builder-node.types.ts type construction.

---

## Summary

| Metric | Count |
|---|---|
| Total types in api.ts | 17 |
| Total types in domain.ts | 21 |
| Types duplicated identically across both files | 10 (47% of domain.ts) |
| Types with partial overlap (api ↔ domain with mixin additions) | 7 |
| Mock/type mismatches | 0 |
| Dead types (truly unused) | 0 |
| Files importing api.ts types | 6 (+ 3 mock files) |
| Files importing domain.ts types | 39 |

### Key findings

1. **50% of domain.ts is redundant**: 10 types are identical copies of api.ts types with `Api` prefix stripped. `JsonValue = ApiJsonValue`, `TaskDate = ApiTaskDate`, `Channel = ApiChannel`, etc. These should be removed in P4 and consumers should import from api.ts.

2. **Domain layer is thin**: The 7 "real" domain types (DCX, Version, Phase, Action, Task, Subtask) only add `AIContextFields` (metadata, aiContext, sourceContext) and `CollaborationFields` (updatedAt, updatedBy) mixins — plus re-parented children (Action has `tasks`, Phase has `actions`). The core fields are identical to their Api counterparts.

3. **Mock data is clean**: All 3 mock files match their claimed Api types exactly. No drift.

4. **Clean boundary preserved**: services/import from api.ts only; UI code imports from domain.ts only. The only bridge is `services/api-mappers.ts`.

5. **No `any` in types**: `draftData: any` in builderStore is the only `any` in the state layer (found in FE-R2). Types themselves are `any`-free.

6. **`ActionNode`, `PhaseNode`, `TaskNode` are never directly imported** — only `BuilderNode` (the union) is used everywhere. These per-kind types are construction helpers.
