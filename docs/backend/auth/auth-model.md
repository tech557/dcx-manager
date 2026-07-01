# Auth & Access-Control Model (BE3-R3)

How the existing `src/services/access.service.ts` seam maps to real **Supabase Auth + Row-Level Security**,
with a draft policy for every route in the frozen contract. Model + draft SQL only — nothing is enforced or
applied (D-BE3-NO-APPLY). Companion files: [`schema-auth-additions.sql`](./schema-auth-additions.sql),
[`rls-policies.sql`](./rls-policies.sql).

## The seam that must be satisfied exactly

```ts
interface MyAccess  { userId: string; isAuthenticated: boolean; workspaceIds: string[] }
interface DCXAccess { dcxId: string;  hasAccess: boolean;       canEdit: boolean }
```

The real model must produce these two shapes without changing the interface (the mock returns effectively-open
access today; real = Supabase session + memberships).

## Interface conformance (AC-BE3-3-1)

| Interface field | Real source | Mechanism |
|---|---|---|
| `MyAccess.userId` | Supabase Auth session | `auth.uid()::text` |
| `MyAccess.isAuthenticated` | session presence | `auth.uid() IS NOT NULL` |
| `MyAccess.workspaceIds[]` | `memberships` | `app_user_workspace_ids()` → the user's `workspace_id` set |
| `DCXAccess.dcxId` | request path param | echoed from `/dcx/:dcxId/access` |
| `DCXAccess.hasAccess` | membership in the dcx's workspace | `dcx.workspace_id ∈ app_user_workspace_ids()` |
| `DCXAccess.canEdit` | role in that workspace | `app_user_can_edit(dcx.workspace_id)` (role ∈ editor/admin) |

`GET /access/me` and `GET /dcx/:dcxId/access` are **session/membership resolves, not table CRUD** — they read
the auth session + `memberships`, so they have no per-table RLS policy (noted in `rls-policies.sql`).

## Route × policy coverage (AC-BE3-3-2)

Every **write** contract route → a write (INSERT/UPDATE) policy; every **read** route → a visibility (SELECT)
rule. Route set = `scripts/backend/extract-routes.sh` (22).

### Write routes (7) → write policies

| Contract write route | Table mutated | Policy |
|---|---|---|
| POST `/api/channels/:channelId/compositions` | `channel_compositions` | `channel_compositions_write` (editor/admin) |
| PATCH `/versions/:versionId/builder` | `phases`,`actions`,`tasks`,`subtasks` | `phases_write`,`actions_write`,`tasks_write`,`subtasks_write` |
| PATCH `/versions/:versionId/status` | `versions` | `versions_write` |
| PATCH `/versions/:versionId/date` | `versions` | `versions_write` |
| POST `/versions/:sourceVersionId/duplicate` | `versions` (+subtree) | `versions_write` (+ subtree writes) |
| POST `/versions/:versionId/files` | `file_attachments` | `file_attachments_write` |
| POST `/activity-logs` | `activity_events` | `activity_events_write` |

### Read routes (15) → visibility rules

| Contract read route | Table(s) read | Policy |
|---|---|---|
| GET `/api/channels` | `channels` | `channels_read` |
| GET `/api/channels/:channelId/compositions` | `channel_compositions` | `channel_compositions_read` |
| GET `/api/subtask-definitions` | `subtask_definitions` | `subtask_definitions_read` |
| GET `/api/subtask-definitions/:channelId` | `subtask_definitions` | `subtask_definitions_read` |
| GET `/versions` | `versions` | `versions_read` |
| GET `/dcx/:dcxId/versions` | `versions` | `versions_read` |
| GET `/versions/:versionId` | `versions` | `versions_read` |
| GET `/versions/:versionId/builder` | `versions`,`phases`,`actions`,`tasks`,`subtasks` | `*_read` on each |
| GET `/versions/:versionId/files` | `file_attachments` | `file_attachments_read` |
| GET `/activity-logs` | `activity_events` | `activity_events_read` |
| GET `/versions/:versionId/activity-logs` | `activity_events` | `activity_events_read` |
| GET `/access/me` | session + `memberships` | resolve (no table policy) |
| GET `/dcx/:dcxId/access` | session + `memberships` + `dcx` | resolve + `dcx_read` |
| GET `/clickup/entry/:versionId` | integration (BE3-R4) | n/a — not table CRUD |
| POST `/ai/review-draft` | integration (BE3-R4) | n/a — not table CRUD |

**Coverage: 0 uncovered contract routes.** Every read route has a visibility rule (or is a session/integration
resolve); every write route has a write policy. The two integration routes are explicitly out of table-RLS
scope (BE3-R4 owns their v1 decision).

## Open decisions

### OD-BE3-02 — multi-tenancy boundary: workspace-scoped vs DCX-scoped  *(blocks G3)*
**Recommended: workspace-scoped.** Access is granted at the `workspace` level (`memberships`), and every dcx
belongs to one workspace; membership in the workspace grants access to all its DCXs, matching
`MyAccess.workspaceIds[]` directly.

| Option | Pros | Cons |
|---|---|---|
| **workspace-scoped** (rec.) | 1:1 with `MyAccess.workspaceIds`; one membership row grants a whole workspace; simplest RLS chain (`version → dcx → workspace`) | no per-DCX narrowing without an extra grant table |
| DCX-scoped | fine-grained per-campaign sharing | needs a `dcx_grants(user_id, dcx_id, role)` table + every policy joins it; `MyAccess.workspaceIds` becomes derived, not primary |

**Path:** ship workspace-scoped for v1; add an optional `dcx_grants` override table later if per-DCX sharing is
needed (does not break the v1 model). Final ratification: BE3-R6.

### OD-BE3-04 — real auth provider  *(record here; decided at build)*
**Recommended: Supabase Auth (email + OAuth)** for v1 — native `auth.uid()` drives every RLS helper with no
extra integration. Existing workspace SSO can be added later via Supabase Auth SSO/SAML without changing the
membership model. Recorded for the build plan.

## Merge note for BE3-R6
`schema-auth-additions.sql` (workspaces, memberships, `membership_role`, helper functions) must be **merged
into `docs/backend/schema/schema.sql`**, and `dcx.client_id` renamed to `dcx.workspace_id text NOT NULL
REFERENCES workspaces(id)`. R3 does not touch `docs/backend/schema/**` (single-owner boundary, audit blocking
#3) — this is recorded as the explicit R3→R6 follow-up.
