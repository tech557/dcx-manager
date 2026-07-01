# Endpoint & Integration Overview — for PO review

> Plain-language companion to the frozen contract ([`contract/contract.md`](./contract/contract.md)). It maps
> **every endpoint to where it's used in the product** and **how the real backend replaces the mock**, so you
> can confirm (or correct) my understanding before the `production-api-client-switch` implementation sprint is
> drafted. Decisions I've taken are at the end, each reversible at the sprint draft.

## The one mental model

Today every data call in the app goes through a single seam:

```
UI (pages / builder / islands)
  → React Query hooks (src/queries/*)  or  actions (src/actions/*)
    → services (src/services/*.service.ts)
      → apiClient(route, options)          ← the single choke point (22 routes)
        → mockDispatch()                   ← in-memory / localStorage mock backend
```

**The real-backend switch is mechanical:** implement the same 22 routes on Supabase (schema from BE3-R2, RLS
from BE3-R3), then replace `mockDispatch` with real Supabase/HTTP calls **behind the identical contract**. The
mapper layer (`api-mappers.ts`) and every UI component stay unchanged. That is the whole point of this
discovery plan — it makes the switch a no-unknowns exercise.

## Endpoints grouped by product feature (where each is used)

### A. Dashboards & version lifecycle — *Home + Version pages*
| Endpoint | Where used | What it does |
|---|---|---|
| `GET /versions` | **Home dashboard** (`HomeDashboard.tsx`) | list all versions across every DCX/campaign |
| `GET /dcx/:dcxId/versions` | **Version workspace** (`VersionWorkspace.tsx`) | versions for one campaign |
| `GET /versions/:versionId` | version detail, metadata island | one version's header data |
| `PATCH /versions/:versionId/status` | **MetadataIsland**, `version.actions` | lifecycle transition (Draft → In Progress → Ready for Approval → Approved → Superseded) |
| `PATCH /versions/:versionId/date` | MetadataIsland | set the communicated date |
| `POST /versions/:sourceVersionId/duplicate` | **CreateVersionDialog** | **this is how a new version is created** — by duplicating an existing one |

> ⚠️ **Product-model point to confirm:** there is **no create-from-scratch** version endpoint. New versions
> are always a **duplicate** of an existing one. If v1 needs "new blank version," that's a new endpoint to add
> at build time — please confirm your intent.

### B. The Builder — *the core editor*
| Endpoint | Where used | What it does |
|---|---|---|
| `GET /versions/:versionId/builder` | **BuilderPage**, `builder.queries` | load the full tree: Phase → Action → Task → Subtask |
| `PATCH /versions/:versionId/builder` | **useAutosave** | save the whole tree (autosave on edit) |

### C. Task creation — *Channel + Composition model*
This is the app's signature flow (per the domain model: a Task is created via Channel + Composition, which
auto-names it and generates Subtask instances).
| Endpoint | Where used | What it does |
|---|---|---|
| `GET /api/channels` | TaskCreationFlow, ChannelCompositionSelect, DayTaskCreator | the channel picker |
| `GET /api/channels/:channelId/compositions` | ChannelCompositionSelect, InlineChannelCompositionSelector | compositions available for a channel |
| `POST /api/channels/:channelId/compositions` | **CreateCompositionForm** | create a user-defined composition |
| `GET /api/subtask-definitions` (+ `/:channelId`) | TaskCreationFlow, DayTaskCreator | subtask templates that auto-generate a task's subtasks |

### D. Files / attachments — *defined but not yet wired*
| Endpoint | Where used | What it does |
|---|---|---|
| `GET /versions/:versionId/files` | *(no UI consumer found)* | list attachments |
| `POST /versions/:versionId/files` | *(no UI consumer found)* | attach a Google-Drive / link URL |

> ℹ️ These are a **defined seam with no UI usage yet** — attachments are modelled (`ApiFileAttachment`, source
> `google-drive`/`link`) but nothing in the app currently calls them. This is why I lean **external-URL-only**
> for v1 (below).

### E. Activity log
| Endpoint | Where used | What it does |
|---|---|---|
| `GET /activity-logs` | **Home dashboard** | recent activity feed across everything |
| `GET /versions/:versionId/activity-logs` | per-version history | one version's event history |
| `POST /activity-logs` | BuilderErrorBoundary, import flow, lifecycle | write a lifecycle event (status change, import, duplicate) |

### F. Access / auth
| Endpoint | Where used | What it does |
|---|---|---|
| `GET /access/me` | **RouteGuard** | current user + the workspaces they belong to |
| `GET /dcx/:dcxId/access` | permission rules | can this user see/edit this campaign (`hasAccess` / `canEdit`) |

### G. Integrations — *dormant stubs (registered, not wired to any UI)*
| Endpoint | Where used | What it does |
|---|---|---|
| `POST /ai/review-draft` | *(stub only — no UI consumer)* | AI review of a draft → proposed actions |
| `GET /clickup/entry/:versionId` | *(stub only — no UI consumer)* | resolve the ClickUp task a version came from |

## Integration plan (per group)

| Group | v1 integration approach |
|---|---|
| A. Lifecycle & dashboards | Real Supabase tables (`versions`, `dcx`) + the status/date/duplicate mutations as SQL/RPC; RLS by workspace |
| B. Builder | `versions/:id/builder` = a nested read (version + phases tree) → a view/RPC; PATCH = a transactional tree upsert |
| C. Task creation | `channels` / `channel_compositions` / `subtask_definitions` catalog tables + the M:N joins; composition create = INSERT |
| D. Files | **external-URL-only** (store the URL + source); no Supabase Storage in v1 |
| E. Activity log | `activity_events` table; append on writes; read for feeds |
| F. Auth | Supabase Auth session → `memberships`; RLS enforces `hasAccess`/`canEdit` (BE3-R3 model) |
| G. Integrations | ClickUp + AI stay stubs for the v1 switch; build later; GAS out |

## Decisions taken now (each reversible at the implementation-sprint draft)

Per your go-ahead, I've decided these so the discovery dataset is complete enough to draft the implementation
sprint. Confirm or correct each when you review the draft:

| ID | Decision | Rationale |
|---|---|---|
| **OD-BE3-02** tenancy | **workspace-scoped** RLS | matches `MyAccess.workspaceIds[]` 1:1; a membership grants a whole workspace's campaigns. *Key one to confirm — it's about where you expect access to be granted.* |
| **OD-BE3-04** auth provider | **Supabase Auth (email + OAuth)** | native `auth.uid()` drives RLS with zero extra integration; SSO can be added later |
| **OD-BE3-05** files | **external-URL-only** for v1 | matches the current model exactly, and files aren't even UI-wired yet — no need for Storage now |
| **OD-BE3-01** unions | **jsonb** for `ApiTaskDate` / `ApiFieldCompletionState` | preserves the discriminated-union shape; no lossy flattening (technical) |
| **OD-BE3-03** capture threshold | **N = 3** payloads/route | enough to see field-population/nullability without over-waiting |
| **Integrations** | ClickUp stub, **AI build-next**, GAS out | core switch depends on none of them; keeps v1 low-risk (RG-R6 precedent) |
| **Registry capture ref** | **rely on the `<version>` path** (no new column) | reversible, no registry-schema change |

## What I need you to confirm at the implementation-sprint draft
1. **Create-via-duplicate only** — is that the intended v1 model, or do we add a create-from-scratch version endpoint?
2. **Workspace-scoped access** — is access granted at the workspace level (all campaigns in it), or should it be per-campaign (DCX-scoped)?
3. **Files unwired** — is attachments-UI out of v1 scope (consistent with external-URL-only), or is it coming?
4. **AI / ClickUp** — confirm both stay stubs for the switch and are separate later features.
