---
task: HV-2-version-spec
type: supporting-task (non-sprint — PO functional spec + requirement coverage map)
plan: frontend-polish-implementation-v0.3.5
version_context: v0.3.5
recorded-by: Claude (claude-opus-4-8) from PO (Mahmoud) verbal spec + v0.1.4 archive, 2026-06-30
status: SPEC RECORDED — requirement candidates NOT yet proposed (await HV-2)
feeds: HV-2 (Version page); pairs with tasks/HV-1-HV-2-component-signoff.md (PAGE 2)
governance: new requirements go through `npm run req:propose` + PO sign-off (core.md §35b).
  This doc does NOT mutate the graph; it stages candidates for proposal at HV-2 time.
archive-ref: docs/archive/dcx-manager-v0.1.4/src/pages/version/ (VersionPage, VersionSwitchBar,
  VersionStatusBar, VersionSummary, CollaboratorsAvatars, DriveArtifacts)
---

# Version Page — PO Functional Spec + Requirement Coverage (HV-2)

> Source: PO verbal description, 2026-06-30, grounded in the v0.1.4 archive (PO: "refer to v0.1.4 for
> the two pages and you'll get 100% of the picture"). Component build-list + sign-off lives in
> [`HV-1-HV-2-component-signoff.md`](HV-1-HV-2-component-signoff.md) §PAGE 2.

## A. Role & layout

- The Version page is the **version room** — **a step before the Builder**. Clicking a version on Home
  opens this page; the Builder is launched **from** here (not directly from Home).
- **Desktop:** same sizing as Home — **fixed 100vh × 100vw**, no page scroll; internal regions scroll.
- Reuses the **brand block** and **user block** from Home (same controls; user block minus Save).

> ⚠ This contradicts canonical **`REQ-VR-001`** ("a version link opens the Builder directly, not a
> Version Room first"). D-1 is resolved in favour of the version room → `REQ-VR-001` must be
> **superseded** (new node + `supersedes` TraceLink, PO sign-off, §35b).

## B. Blocks (top-level Version composition)

1. **Brand block** — favicon + name (shared with Home).
2. **User block** — builder user controls minus Save (shared with Home).
3. **Header combo** — see §C.
4. **Version control component** — see §D (the centerpiece).
5. **Other-versions block** — all sibling versions + their status; selecting one **changes the context**
   driving the version control component (§D). See §E.

## C. Header combo

A single identity header carrying:

- **Client name**
- **Project name**
- **Product type** — for now, **read from a custom field on the ClickUp task** (D-4 resolved). A
  dedicated client/project endpoint (Apps Script) may later become the canonical source — **deferred to
  the backend decision**; swap behind the data layer when decided, no UI rework.
- **Collaborators** — **all users shared on ANY version of the campaign.** Rationale: in this internal
  tool, being shared on one version grants read+write to **all** campaign versions (`REQ-PR-004`).
- **Campaign status** — the DCX/campaign-level status (derived from member version statuses, not set
  manually — `REQ-VL-019/021/022/024`).

v0.1.4 reference: `VersionPage.tsx` header renders `client // product`, project name, and a campaign
collaborators avatar row computed as the **unique users across all campaign versions** — matches the
spec. `VersionStatusBar.tsx` renders the (version) status + transition buttons.

## D. Version control component (centerpiece)

Contains, for the **active version in context**:

1. **Builder launch (D-5 → Option B, PO 2026-06-30).** **No builder visual.** Lean on the structure
   summary (§D.4) for "what's inside", and make **launching the Builder a well-designed, prominent
   component** inside the version control component — **more than a small button** (a branded section /
   icon-led launch panel). Stays inside `§13` (no `src/builder/**`); launch is route navigation to
   `/builder/:id`. *Option A (live read-only builder visual + view toggle) is parked as a **future
   enhancement** — see §J Future enhancements.*
2. **Version documents** — the version's attached docs/resources. (v0.1.4: "Workspace Resources" /
   `DriveArtifacts` / `FileTag`.)
3. **Version collaborators** — the team assigned to *this* version (the staging crew). (v0.1.4:
   "Version Staging Crew" with hover-to-inspect role.)
4. **Structure summary** — counts of **# Phases / # Actions / # Tasks**, each with a **popup that lists
   the items when hovered.** ⚠ **This is NEW — not in v0.1.4.** (In Option B this carries most of the
   "what's inside" weight, since there's no visual preview.)
   **Data source (audit P1-5):** the `Version` domain model (`src/types/domain.ts`) has **no** phase/
   action/task tree — read it via **`useBuilderTreeQuery` / `builder.service.ts`** (in `src/queries` /
   `src/services`, **outside `src/builder/**` → not a §13 violation**). **Data only — never import builder
   UI/store/actions.** Approved in the sign-off Page-2 reuse table.

## E. Other-versions block (switchboard)

- Lists **all other versions** of the campaign with **their status**.
- Selecting a version **changes the context** of the version control component (§D) to that version —
  i.e. the page lets you inspect each sibling version's mini-view/docs/crew/structure without leaving.
- v0.1.4 reference: `VersionSwitchBar.tsx` (same-campaign switchboard + add-version action).

---

## F. Requirement coverage map

Legend: ✅ covered · 🟡 partial · ❌ gap.

| Version feature | Existing graph requirement(s) | State | Note |
|---|---|---|---|
| Archive reference for Version build | `REQ-FP-D07` | ✅ | v0.1.4 `version/` is the grounding |
| Version page responsive | `REQ-RESP-001` | 🟡 | Fixed 100vh×100vw desktop not stated → reuse `REQ-HOME-LAYOUT` framing or **VER-LAYOUT** candidate |
| Brand + user blocks (shared) | — (see Home `REQ-HOME-BRAND`, `REQ-HOME-USER`) | 🟡 | Shared blocks; reuse the Home candidates |
| **Version room exists (step before builder)** | `REQ-VR-001` (denies a version room) | ❌ ⚠ | **Supersede `REQ-VR-001`** → **VER-ROOM** candidate (D-1 resolved) |
| Header: client / project | VL/DM identity fields | 🟡 | Display unstated → **VER-HEADER** candidate |
| Header: product type from ClickUp custom field | `REQ-VR-006` (prefilled project payload) | 🟡 | D-4 resolved: product type from a ClickUp task **custom field** (endpoint deferred to backend) → fold into **VER-HEADER** |
| Header: collaborators = all users shared on any version | `REQ-PR-004` (shared on one = access all), `REQ-VR-005`, `REQ-VR-006` | ✅🟡 | Access rule exists; the campaign-wide collaborator **display** is new → **VER-COLLAB-DISPLAY** |
| Header: campaign status (derived) | `REQ-VL-019/021/022/024` | ✅🟡 | Derivation exists; header display new |
| Builder launch (D-5 → Option B, **no builder visual**) | `REQ-VR-001` (launch — superseded by `REQ-VER-ROOM`), §13 boundary | ❌ | Branded launch panel + route nav; no builder imports (§13) → **REQ-VER-LAUNCH** |
| Version documents | `REQ-EFP-001` (doc preview), `files.service.ts` | 🟡 | Resources panel display → **VER-DOCS** candidate |
| Version collaborators (this version's crew) | `REQ-VR-006` | 🟡 | Staging-crew display → fold into **VER-COLLAB-DISPLAY** |
| Structure summary: #phases/#actions/#tasks + hover list | `useBuilderTreeQuery`/`builder.service.ts` (data-only, outside `src/builder/**`) | ❌ | **NEW (not in v0.1.4)** → **VER-STRUCTURE-SUMMARY** candidate; data via builder-tree query (audit P1-5) |
| Other-versions switchboard + change context | VL family, v0.1.4 `VersionSwitchBar` | 🟡 | Switchboard + context-switch behavior → **VER-SWITCHBOARD** candidate |
| Status transition controls | `REQ-VL-014` (manual supersede), `REQ-VL-009/011`, `REQ-VL-012` (approve confirm) | 🟡 | Transitions exist as logic; controls display + current statuses |
| Missing/not-found state | `REQ-UP-022` (missing item restore) | 🟡 | v0.1.4 has a missing screen → component `V-C2` |

---

## G. New requirement candidates — ready to `req:propose` at HV-2

> Not yet in the graph (§35b). Suggested family prefix **`VER`** — PO confirms final prefix/IDs at
> proposal time. Includes the **supersession** of `REQ-VR-001`.

| Candidate | Draft statement | Scope | Acceptance idea |
|---|---|---|---|
| `REQ-VER-ROOM` (supersedes `REQ-VR-001`) | A version opens a Version page (room) first — identity, control component, and sibling switchboard — and the Builder is launched from there, not directly from a version link. | product (PO sign-off) | Home version click → `/version/:id`; Builder reached via launch action |
| `REQ-VER-HEADER` | The Version page header shows client name, project name, product type (read from a ClickUp task custom field for now; endpoint TBD with backend), and the derived campaign status. | frontend + backend | Header renders all four; product type resolves from the ClickUp custom field |
| `REQ-VER-COLLAB-DISPLAY` | The Version page shows campaign collaborators (all users shared on any campaign version) and the active version's assigned crew. | frontend | Header shows campaign-wide users; control component shows this version's crew |
| `REQ-VER-LAUNCH` | The version control component launches the full Builder via route navigation (`/builder/:id`) through a prominent branded launch component (more than a button); no builder visual or `src/builder/**` import on the Version page (`core.md §13`, D-5 → Option B). | frontend | Branded launch component navigates to `/builder/:id`; no builder embed |
| `REQ-VER-DOCS` | The version control component lists the active version's attached documents/resources, openable safely. | frontend | Docs render from `attachments`/`files.service.ts` |
| `REQ-VER-STRUCTURE-SUMMARY` | The version control component shows counts of phases, actions, and tasks (read via the builder-tree query as data-only, no builder UI/store import); hovering a count shows a popup listing those items. | frontend | Counts correct from `useBuilderTreeQuery`; hover popup lists items (NEW vs v0.1.4) |
| `REQ-VER-SWITCHBOARD` | The Version page lists all sibling campaign versions with status; selecting one switches the control component's context to that version. | frontend | Selecting a sibling re-targets the control component |
| `REQ-VER-LAYOUT` | The Version page is a fixed full-viewport shell (100vh × 100vw, no page scroll) on desktop, matching Home. | frontend | Desktop: no document scrollbar; regions scroll internally |

---

## H. Decisions

### Resolved
| # | Decision | Resolution (PO, 2026-06-30) | Action |
|---|---|---|---|
| **D-1** | Version click destination | **Version page (room), a step before the builder** (launch builder from here). | Supersede `REQ-VR-001` via `REQ-VER-ROOM` + `supersedes` TraceLink at HV-2. |
| **D-5** | Builder preview vs launch-only | **Option B — no builder visual.** Version control component relies on the structure summary (§D.4) + a prominent **branded launch component** (more than a button); launch is route navigation. Stays inside `§13`. Option A (live read-only visual) **parked as a future enhancement** (§J). | `V-C9` = `VersionBuilderPanel` (branded launch); candidate `REQ-VER-LAUNCH`. |
| **D-4** | Product-type / client / project data source | **For now: read from a ClickUp task custom field.** The dedicated client/project endpoint (Apps Script) is **deferred to the backend decision** and can replace the custom-field source behind the data layer without UI rework. | `REQ-VER-HEADER` reads the ClickUp custom field; endpoint logged as backend-dependent (§J). |

*(All Version decisions resolved; the canonical endpoint source is a future backend choice, not a blocker.)*

---

## I. HV-2 executor handoff

When HV-2 runs: (1) read this spec + the component sign-off (§PAGE 2); (2) all PO decisions resolved —
no blocking decisions; (3) `req:propose` the §G candidates (incl. the `REQ-VR-001` supersession), get
sign-off, apply; (4) build only PO-approved components; (5) trace each new manifestation; (6) run gates
+ debt burn-down per the HV-2 sprint file.

---

## J. Future enhancements (not in HV-2 scope)

| Enhancement | Description | Why deferred |
|---|---|---|
| Live read-only builder preview (D-5 Option A) | A non-interactive live visual of the builder views inside the version control component, with a view toggle (Kanban/Timeline/…). | Needs either a sanctioned read-only builder render path (a `§13` boundary exception) or a per-version snapshot/screenshot pipeline with staleness handling — both are architecture work beyond HV-2's UI scope. Revisit as its own requirement/sprint. |
| Client/project data endpoint (D-4) | A dedicated Apps Script client/project endpoint as the canonical source for client/project/product-type (replacing the ClickUp custom-field read). | Backend-dependent — tied to the backend decision. Swap behind the data layer when decided; no UI rework. |
