# External Integration Decisions (BE3-R4)

Per-integration v1 decision — **build** or **stay-stub**/**stay-out** — with owner and the exact data/config
each needs *if* built, so nothing is discovered late during `production-api-client-switch`. Decisions only; no
integration is built or credentialed here (no `src/**` change).

**Carried from RG-R6** (do not relitigate): ClickUp is the team's **task-initiation** system, **not** a release
surface; **GAS sink is scoped out** entirely; release approval stays a manual PO chat decision. ClickUp MCP is
connected (read-only discovery confirmed a 2-space workspace).

## Decision matrix

| Integration | Contract route | Current state | **v1 decision** | Owner | Data / credentials / config if built |
|---|---|---|---|---|---|
| **ClickUp** | `GET /clickup/entry/:versionId` → `ClickUpEntryPayload {versionId, dcxId, sourceTaskId}` | stub returns `dcxId:null, sourceTaskId:null` | **STAY-STUB for v1** (build in a later phase) | PO / backend | ClickUp API token (read-scoped); a `versions.source_task_id text NULL` column to persist the originating task; a task-id↔version map; which ClickUp fields sync into the entry payload |
| **AI review draft** | `POST /ai/review-draft` → `AIReviewDraft {id, summary, proposedActions: unknown[]}` | static stub (`proposedActions: []`) | **STAY-STUB for the backend-connection milestone; BUILD next** as a real Claude call | backend / AI | model id `claude-*` (project convention — latest Claude); prompt contract; **typed `proposedActions` schema** (currently `unknown[]` — must be defined; see follow-up) |
| **Files** | `file_attachments` (`google-drive` / `link` URLs) | URL-only records; `source` enum = `google-drive \| link` | **EXTERNAL-URL-ONLY for v1** (no Supabase Storage) — OD-BE3-05 | PO / backend | none for v1 (URL-only). If Storage later: a bucket + bucket RLS + extend `file_source` enum with `supabase-storage` + an upload flow |
| **GAS sink** | *(no route)* | scoped-out in RG-R6 | **STAY-OUT** (confirmed) | PO | — (none) |

**No "TBD" / blank decision cells** — every row has a decision, owner, and data-need (AC-BE3-4-1).

## OD-BE3-05 — Files: Supabase Storage vs external-URL-only for v1  *(blocks G4)*

**Recommended: external-URL-only for v1.** It matches the current `ApiFileAttachment` shape exactly
(`url` + `source ∈ {google-drive, link}`), needs no bucket, no storage RLS, and no upload UI for the backend
switch. Supabase Storage is a clean later addition: add `'supabase-storage'` to the `file_source` enum, create a
bucket with workspace-scoped RLS, and add an upload path — none of which blocks v1. Final ratification: BE3-R6.

## Build-decision → contract/schema additions handed forward (AC-BE3-4-3)

Only the two "build later" integrations carry named additions; nothing is invented here — these are handed to
R1 (contract) / R2 (schema) as **follow-up notes**, not applied:

| Build item | Named addition it requires | Hand-off target |
|---|---|---|
| ClickUp `clickup/entry` (later) | `versions.source_task_id text NULL` column; `ClickUpEntryPayload.sourceTaskId` resolves to the real task id | BE3-R2 schema (HYPOTHESIS column) + BE3-R1 contract response note |
| AI `ai/review-draft` (next) | Define `proposedActions` element type (currently `unknown[]`) — the action-proposal schema the builder consumes | BE3-R1 contract (`AIReviewDraft.proposedActions` type) — queue a `REQ-BE-AI-*` intake before build |

**No change is made to `contract.json` / `schema.sql` by R4** — these are recorded as forward follow-ups so the
build plan (or a later discovery round) implements them deliberately, not late.

## Summary
- **Build later:** ClickUp (task linking), Files→Storage (optional). **Build next:** AI (real Claude call).
- **Stay-stub v1:** ClickUp, AI (for the backend-connection milestone). **Stay-out:** GAS.
- The **core backend connection does not depend on any external integration** — all four are decoupled from the
  `production-api-client-switch` critical path, which is exactly what makes that switch low-risk.
