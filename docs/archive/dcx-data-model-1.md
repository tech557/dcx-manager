# DCX Manager — Data Model

**Document 2 of 5** (Requirements → **Data Model** → Tech Stack → Integration Assessment → Development Plan)  
**Derived from:** `dcx-requirements-master.csv`, `types/domain.ts` (v0.1.4), the Decision Register, and Strategic Amends  
**Location:** `docs/architecture/data-model.md`

---

## 1. Purpose and Reading Order

This document defines the canonical data model for DCX Manager v0.2.0. It is the contract that the database (Supabase), the API DTOs, the domain types, and the builder render model all agree on.

It separates four layers explicitly, because the requirements demand it (DM-018, DM-019, DM-020):

```
1. Storage layer        → Supabase tables (the backend source of truth)
2. API DTO layer        → wire format sent/received over HTTP (ApiXxx types)
3. Domain layer         → the app's working model (Task, Action, Phase, Version)
4. Builder render layer → BuilderNode[] used only by the builder stage
```

Each layer maps to the next through explicit mapper functions. No layer reaches across more than one boundary. A backend field rename never reaches a card; a card redesign never reaches a table.

---

## 2. The Core Hierarchy

The official saved structure (DM-001, DM-002):

```
Project
└── DCX / Campaign
    └── Version (a specific plan iteration)
        └── Phase (a stage of the campaign)
            └── Action (a grouped activity within a phase)
                └── Task (created from Channel + ChannelComposition)
                    └── Subtask Instance (generated from SubtaskDefinition)

ChannelComposition
└── Channel
└── SubtaskDefinition[]
```

Rules enforced by the model:

- A **Task cannot exist without an Action** (DM-003, RV-008, BC-028). The schema enforces this with a non-nullable `action_id` foreign key.
- A **Task is created from a Channel and ChannelComposition**. The user does not start from a blank unnamed task; the system derives the initial task name and subtask instances from the selected composition.
- A **Subtask is a task detail**, not a structural node (DM-002). It is stored inside the task, never queried as a standalone hierarchy element.
- A **Day is not a stored entity** (DM-005). Days, weeks, and months are computed views derived from task dates. There is no `days` table.
- Files attach at the **Version level only** (FI-001, FI-004). No `file_id` on phases, actions, or tasks in MVP.

---

## 3. Entity Definitions

### 3.1 DCX

The campaign container. One DCX holds many versions.

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | Stable ID (BC-017) |
| `clientId` | string | Reference to client |
| `projectName` | string | |
| `product` | string | |
| `subProduct` | string \| null | |
| `tags` | string[] | |
| `createdAt` | ISO timestamp | |
| `createdBy` | string (userId) | |
| `metadata` | json \| null | **AI-ready seed** (AIM-001) — flexible context, never replaces core fields |

**Derived (never stored on DCX):** `status` — computed from its versions' statuses (VL-019 through VL-024). See §7.

---

### 3.2 Version

A single plan iteration under a DCX. The unit of access, lifecycle, and editing.

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | Stable ID |
| `dcxId` | string | Parent DCX |
| `versionNumber` | string | e.g. "V3" |
| `status` | VersionStatus | See §7 (VL-001) |
| `communicatedDate` | ISO date \| null | Anchor for linked task dates; may be TBD/null (DM-006, DM-007, DM-008) |
| `createdAt` | ISO timestamp | |
| `createdBy` | string (userId) | |
| `lastUpdatedAt` | ISO timestamp | |
| `lastUpdatedBy` | string (userId) | |
| `inProgressAt` | ISO timestamp \| null | Set when first phase added (VL-027, VL-030) |
| `readyAt` | ISO timestamp \| null | Set when marked Ready (VL-030) |
| `approvedAt` | ISO timestamp \| null | Set when Approved |
| `supersededAt` | ISO timestamp \| null | Set when Superseded |
| `sourceType` | VersionSourceType | `scratch \| duplicate \| import \| template` (VL-017, VL-018) |
| `sourceVersionId` | string \| null | Set when duplicated |
| `sourceBackupId` | string \| null | Set when imported |
| `sourceTemplateId` | string \| null | **Seed** — future template source |
| `assignedTeam` | AssignedMember[] | Workspace users (see §3.11) |
| `attachments` | FileAttachment[] | Version-level files (see §3.10) |
| `metadata` | json \| null | **AI-ready seed** (AIM-001) |
| `strategyContext` | json \| null | **AI-ready seed** — proposal/objective links |

**Derived (computed, may be cached but not treated as truth):** none at version level beyond status display.

---

### 3.3 Phase

A stage of the campaign. Holds actions.

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | Stable ID |
| `versionId` | string | Parent version |
| `label` | string | |
| `icon` | PhaseIconType | `awareness \| teaser \| launch \| scale \| maintenance` |
| `orderIndex` | number | Column order in Kanban |
| `updatedAt` | ISO timestamp \| null | **Collaboration seed** (SC-014, DM-024) |
| `updatedBy` | string \| null | **Collaboration seed** |
| `metadata` | json \| null | **AI-ready seed** (AIM-001) |

**Derived (computed from children, may be cached for display — DM-016, DM-017):**
- `startDate` — earliest task/action date within the phase
- `endDate` — latest task/action date within the phase
- `readiness` — computed from child actions/tasks (RDY-001)
- `density` / `focus` — task/action concentration for the Phase Card heatmap seed (SBC-003)

Phase start/end dates are **not authored** — they derive from the plan (DM-016). The backend may cache them but must know they are derived.

---

### 3.4 Action

A grouped activity within a phase. Holds tasks.

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | Stable ID |
| `phaseId` | string | Parent phase |
| `name` | string | |
| `description` | string \| null | |
| `orderIndex` | number | Order within phase |
| `updatedAt` | ISO timestamp \| null | **Collaboration seed** |
| `updatedBy` | string \| null | **Collaboration seed** |
| `metadata` | json \| null | **AI-ready seed** |

**Derived (computed from children — DM-015):**
- `startDate` — earliest task date in the action
- `endDate` — latest task date in the action
- `readiness` — computed from child tasks (RDY-001)
- `taskCount` — count of child tasks (SBC-004)
- `isEmpty` — true when no tasks; allowed in Draft, blocks Ready (RV-007)

---

### 3.5 Task

A single communication or deliverable. The highest-investment entity (SBC-005).

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | Stable ID |
| `actionId` | string | Parent action — **non-nullable** (DM-003) |
| `name` | string | Derived at creation as `{actionName} {channelLabel}`, then stored and editable |
| `channelId` | string | Delivery channel reference |
| `compositionId` | string \| null | ChannelComposition used to generate the task; null for manually created legacy/custom tasks |
| `message` | string | Copy/payload |
| `senderId` | string | Sender reference |
| `receiverId` | string | Receiver reference |
| `orderIndex` | number | Order within action |
| `date` | TaskDate | Discriminated union — see §5 (DM-009) |
| `specsState` | FieldCompletionState | `filled \| not-needed \| empty` (RV-011, DQ-001) |
| `missingDataState` | FieldCompletionState | `filled \| not-needed \| empty` (RV-010, DQ-001) |
| `subtasks` | Subtask[] | Task detail (DM-002) |
| `isSmall` | boolean \| null | Compact card rendering hint |
| `updatedAt` | ISO timestamp \| null | **Collaboration seed** |
| `updatedBy` | string \| null | **Collaboration seed** |
| `metadata` | json \| null | **AI-ready seed** (AIM-001) |
| `generationContext` | json \| null | **AI-ready seed** — AI generation source |

**Derived (computed, never stored):**
- `readiness` — per-field readiness states for the Task Card indicators (RDY-003, SBC-005)
- `resolvedDate` — calculated calendar date when `date.mode === 'linked'` (DM-012)

**Note on legacy fields:** v0.1.4 had both `missingFields` and `missingData` (aliases) and `specsIdentifier` as a plain string. The v0.2.0 model replaces these with the typed `specsState` and `missingDataState` three-state fields (DM-023, RV-010, RV-011, RV-012). The legacy aliases do not exist in v0.2.0.

---

### 3.6 Subtask

A checklist item inside a task. Not a hierarchy node.

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `taskId` | string | Parent task |
| `definitionId` | string \| null | SubtaskDefinition used to generate this instance; null for manually added subtasks |
| `label` | string | |
| `done` | boolean | |
| `estimatedMinutes` | number \| null | |
| `orderIndex` | number | |
| `metadata` | json \| null | **AI-ready seed** |

---

### 3.7 Channel

A communication medium selected when creating a task.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable channel key, e.g. `email` |
| `label` | string | Display label, e.g. "Email" |
| `icon` | string | Icon key used by the UI |
| `availableCompositionIds` | string[] | ChannelComposition IDs available for this channel |

Channels are API-sourced seed data. They are referenced by tasks through `channelId`.

---

### 3.8 SubtaskDefinition

A reusable skill/media-format type used to generate subtask instances.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable definition key |
| `label` | string | Display label, e.g. "Copywriting" |
| `estimatedMinutes` | number \| null | Default estimate copied to generated subtasks |
| `channelIds` | string[] | Channels this definition can be used with |

Definitions are API-sourced and are not stored inside the builder tree. Generated subtasks store `definitionId` for traceability.

---

### 3.9 ChannelComposition

A named reusable template that defines which SubtaskDefinitions a channel usage requires.

| Field | Type | Notes |
|---|---|---|
| `id` | string | Stable composition key |
| `channelId` | string | Owning channel |
| `name` | string | Display name, e.g. "Standard Email" |
| `definitionIds` | string[] | Ordered list of SubtaskDefinition IDs |
| `createdBy` | string | `system` or user ID |
| `isUserDefined` | boolean | false for seed data, true for user-created compositions |

Compositions are referenced by tasks through `compositionId`. They generate editable subtask instances at creation time.

---

## 4. Task Creation Flow

Correct task creation is a seven-step flow:

1. Select or create an Action.
2. Select a Channel such as Email, Intranet, Meeting, SMS, Social Media, or Feedback Form.
3. Select a ChannelComposition for that channel.
4. Derive the initial task name as `{Action name} {Channel label}`.
5. Generate editable Subtask instances from the composition's ordered SubtaskDefinitions.
6. Let the user adjust the generated subtasks and fill remaining task fields in the editor.
7. If no suitable composition exists, let the user create one by selecting SubtaskDefinitions and naming the composition for reuse.

The task remains editable after creation. The correction is only about how the task starts: from channel and composition, not from a blank unnamed object.

---

### 3.10 FileAttachment

External file references at the version level (FI-001 through FI-006, EFP-001).

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `versionId` | string | Owner version |
| `title` | string | |
| `url` | string | External link (Google Drive etc.) — no content stored (FI-003) |
| `source` | `'google-drive' \| 'link'` | |
| `createdBy` | string (userId) | |
| `createdAt` | ISO timestamp | |

MVP stores links only, not uploaded content (FI-003, FI-007). File access follows version access (FI-006). Active viewing state (open file, zoom, tab) is **local UI state, never stored** (FI-005, BC-027).

---

### 3.11 AssignedMember

A workspace user attached to a version's team.

| Field | Type | Notes |
|---|---|---|
| `userId` | string | Reference to user |
| `role` | string | Job title / display role (e.g. "ICS", "Creative Director") |
| `isProtected` | boolean | True = from project payload, cannot be removed (PR-007, ACCESS-003) |

For MVP, permission is flat: any shared user can do everything except edit locked versions (PR-008). `role` here is a display label, not a permission gate. Permission granularity is seeded for the future (PR-017) but not enforced now.

---

### 3.12 ActivityEvent

Lifecycle audit records (CR-001, CR-002, CR-003, VL-029).

| Field | Type | Notes |
|---|---|---|
| `id` | string (uuid) | |
| `type` | LifecycleEventType | See §7 |
| `versionId` | string | |
| `userId` | string | Actor |
| `timestamp` | ISO timestamp | |
| `details` | json \| null | e.g. which versions were superseded |

MVP logs **lifecycle events only** (CR-002) — never field edits or autosaves (CR-010). Logs are written by the backend (LOG-001 direction), shown manually, not real-time (CR-004). UX behavior events are a **separate** seeded layer (CR-009, UP-018), never mixed into this table.

---

## 5. The Task Date Model

The most nuanced part of the model (DM-009 through DM-014). `TaskDate` is a discriminated union:

```typescript
type TaskDate =
  | { mode: 'unset' }
  | { mode: 'linked'; weekOffset: number; dayOffset: number }   // resolvedDate computed, never stored
  | { mode: 'fixed'; date: string };                            // absolute ISO date
```

Rules:

- **Linked** dates store a relative position (`weekOffset`, `dayOffset`) from the version's `communicatedDate` (DM-010). They are NOT stored as absolute dates.
- **`resolvedDate`** is computed at runtime when needed, never persisted (DM-012). If `communicatedDate` is TBD/null, linked dates stay relative and the UI shows them as unresolved (DM-008).
- **Fixed** dates are absolute and are excluded from communication-date shifting (DM-011, DM-014).
- Changing the version `communicatedDate` recalculates all linked task dates dynamically — it does not rewrite each task in the database (DM-013). This is a cost-control decision: one field change does not trigger N task writes.

The same model lets action and phase spans derive automatically: action start/end come from the earliest/latest task date (DM-015); phase start/end come from the earliest/latest action/task date (DM-016).

---

## 6. The Field Completion Model

For fields where "none" is a valid intentional answer (DM-023, RV-010, RV-011, RV-012):

```typescript
type FieldCompletionState =
  | { status: 'filled'; value: string }
  | { status: 'not-needed' }
  | { status: 'empty' };       // = not yet answered
```

Applied to `specsState` and `missingDataState` on Task. A task is ready (for these two fields) only when each is `filled` or `not-needed` — never `empty` (DM-023). This is what lets the Task Card field indicators show "ready / unset / filled / not needed" (SBC-005, RDY-003), and it forces an explicit decision rather than silent emptiness.

---

## 7. The Lifecycle Model

### Version statuses (VL-001)

```typescript
type VersionStatus =
  | 'Draft'              // exists, no real builder work yet (VL-002)
  | 'In Progress'        // first phase added — set automatically (VL-003, VL-027)
  | 'Ready for Approval' // structure complete, validated, locked (VL-005)
  | 'Approved'           // PM accepted — locked (VL-009)
  | 'Superseded';        // did not move forward — locked (VL-013)
```

`Superseded` replaces the older separate "rejected/disregarded" concepts (VL-001 note). The v0.1.4 values `'Ready for Review'`, `'Rejected'`, `'Placed'` do not exist in v0.2.0.

### Locked vs editable

```
EDITABLE:  Draft, In Progress
LOCKED:    Ready for Approval, Approved, Superseded
```

Locked versions are read-only (VL-010, VL-015, RV-003). To change a locked version, the user duplicates it into a new editable version (VL-016, VL-028, RV-004).

### Allowed transitions (VL-026)

```
Draft ──(auto on first phase)──► In Progress
In Progress ──(Ready validation passes)──► Ready for Approval
Ready for Approval ──► Approved
Ready for Approval ──► Superseded (manual)
Approved ──(approving one auto-supersedes others in same DCX)──► [others become Superseded]
```

Key side effects:
- Approving a version auto-supersedes all other versions under the same DCX (VL-011) — a batch update requiring a confirmation modal (VL-012).
- Approval requires `communicatedDate` to be set (VL-008); Ready does not (VL-007).
- No Ready → In Progress rollback (VL-023); duplication is the path back to editing.

### DCX status (derived — VL-019)

DCX status is computed from its versions, never stored:

```
has Approved version          → Approved   (VL-023)
else has Ready for Approval    → Ready      (VL-022)
else has In Progress           → In Progress(VL-021)
else all Superseded            → In Progress (needs new version — VL-024)
else all Draft                 → Draft      (VL-020)
```

### Lifecycle event types (CR-003)

```typescript
type LifecycleEventType =
  | 'version_created'
  | 'in_progress_started'
  | 'ready_submitted'
  | 'approved'
  | 'superseded'
  | 'duplicated'
  | 'import_applied';
```

---

## 8. The Four-Layer Mapping

### Layer 1 → Layer 2: Storage to API DTO

Supabase tables use snake_case columns; API DTOs use camelCase (API naming to be confirmed, API-001). The backend serializes rows into `ApiVersion`, `ApiPhase`, `ApiAction`, `ApiTask`, `ApiSubtask`, `ApiFileAttachment`, `ApiActivityEvent`. Backend uses clean domain naming — `actions[]`, not `actionCards[]` (DM-018).

### Layer 2 → Layer 3: API DTO to Domain

`api-mappers.ts` converts wire format into the app's domain model (DM-019). Key transformations:
- `ApiPhase.actions[]` → `Phase.actions[]` (domain keeps `actions`)
- `resolvedDate` stripped on the way out (never sent to backend)
- snake_case → camelCase if backend uses snake_case

### Layer 3 → Layer 4: Domain to Builder Render

`node.helpers.ts` converts domain phases into `BuilderNode[]` for the stage (DM-020). This is where `actions` becomes `actionCards` — the builder render model's naming. The `BuilderNode` is purely a rendering artifact; it never persists.

```
Supabase row
  └─(backend serialize)→ ApiPhase { actions[] }
       └─(api-mappers)→ Phase { actions[] }            [domain]
            └─(node.helpers)→ PhaseNode { data: { actionCards[] } }  [render]
```

Each arrow is one mapper. A change at any layer stops at the next mapper and does not propagate further. This is the architectural guarantee that lets cards be redesigned without touching the database (DM-019, DM-020, and the Builder Action Boundary).

---

## 9. AI-Ready Metadata Seed

Per AIM-001, optional context fields exist on every core entity (DCX, Version, Phase, Action, Task, Subtask):

- `metadata` — flexible catch-all
- `strategyContext` (Version) — proposal/objective links
- `generationContext` (Task) — AI generation source
- `aiContext` / `sourceContext` — reserved

These are **additive and optional**. They never replace structured fields. They are not populated in MVP. They exist so future AI features (AIC-001) have a place to store context, reasoning, and template/objective mapping without a schema migration.

---

## 10. Stored vs Derived — Quick Reference

| Value | Stored? | Source |
|---|---|---|
| Task `name` | Stored after creation | Initially derived from Action name + Channel label, then editable |
| Task `date` (mode + offsets/fixed) | Stored | Authored |
| Task `resolvedDate` | Never stored | Computed from anchor + offsets |
| Action `startDate` / `endDate` | Derived (may cache) | Earliest/latest task date |
| Phase `startDate` / `endDate` | Derived (may cache) | Earliest/latest action/task date |
| Phase/Action/Task `readiness` | Never stored | Centralized validation helper |
| Version `status` | Stored | Lifecycle transitions |
| DCX `status` | Never stored | Derived from versions |
| Day / Week / Month groupings | Never stored | Computed from task dates |
| UI state (selection, hover, view) | Never in backend | Local only (DM-021, UP-019) |

The governing rule (DM-017): task dates are the source of truth; spans and groupings are derived. If a derived value is cached, the backend must know it is derived and never treat it as authoritative.

---

*Data Model — DCX Manager v0.2.0 — derived from the master requirements*
