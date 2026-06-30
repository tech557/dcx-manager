---
task: HV-1-home-spec
type: supporting-task (non-sprint — PO functional spec + requirement coverage map)
plan: frontend-polish-implementation-v0.3.5
version_context: v0.3.5
recorded-by: Claude (claude-opus-4-8) from PO (Mahmoud) verbal spec, 2026-06-30
status: SPEC RECORDED — requirement candidates NOT yet proposed (await HV-1)
feeds: HV-1 (Home page); pairs with tasks/HV-1-HV-2-component-signoff.md (PAGE 1)
governance: new requirements must go through `npm run req:propose` + PO sign-off (core.md §35b).
  This doc does NOT mutate the graph; it stages candidates for proposal at HV-1 time.
---

# Home Page — PO Functional Spec + Requirement Coverage (HV-1)

> Source: PO verbal description, 2026-06-30. This records the spec, maps each feature to **existing**
> graph requirements, and stages **gap candidates** ready to `req:propose` when HV-1 runs.
> Component build-list + sign-off lives in [`HV-1-HV-2-component-signoff.md`](HV-1-HV-2-component-signoff.md) §PAGE 1.

## A. Layout & shell model

- **Desktop:** Home is a **fixed full viewport — 100vh × 100vw, no page scroll**. Internal blocks
  scroll within their own regions; the shell itself does not.
- **Mobile/tablet:** layout TBD (PO unsure). Must still satisfy `REQ-RESP-001` (Home responsive on
  mobile + tablet).
- **Island model:** Home uses a **single, compact "one-island" shell** — *not* the builder's strict
  multi-island system. The strict island concept is **reserved for the Builder page only** (this is a
  deliberate change from earlier thinking; v0.1.4's final implementation chose the compact one-island
  approach for Home, which the builder did not yet have).

## B. Blocks (top-level Home composition)

1. **Brand block** — favicon + product name.
2. **User block** — same controls/icons as the builder's header user island, **minus the Save button**.
3. **Header** — description text + **Add button** → opens the **New Version popup** (see §C).
4. **Dashboard (analytics summary)** — see §D.
5. **Version list** — cards / bento (see §E).
6. **Logs block** — version status-update logs (see §F).

## C. New Version popup (imitate v0.1.4 as-is)

The create flow is the heart of Home. Behavior:

1. **Fetch from the client API** → returns a list of **filtered ClickUp tasks**.
2. **ClickUp taxonomy mapping:** each task sits in a **list = project** and a **folder = client**.
3. **Auto-versioning** — the new version number is assigned automatically.
4. **Assign team** — team members assigned **without titles** (role/name only, no job titles).
5. **Add documents** — attach reference documents during creation.
6. **DCX container is implicit:** **one campaign = one DCX with many versions.** There is **no
   standalone "create a DCX" action** — when a user adds a version, the system **auto-creates the DCX
   container** if the campaign doesn't have one yet, then attaches the version to it.

## D. Dashboard (analytics summary)

Summary counts only:

- **# Active** — count of DCXs whose status is **not `Approved` and not `Superseded`** (i.e. `Draft`,
  `In Progress`, `Ready for Approval`). No `Rejected` status in the current lifecycle (D-2 resolved).
- **# Total DCXs**.
- **# Versions**.
- **Data source:** the **future Supabase DB** (analytics are not derivable from current mocks alone).

## E. Version list

- Rendered as **cards**, or a **bento layout** (bento is *look-and-feel only* — the cards themselves
  must still be well-designed with proper, real data).
- Each card shows proper version data and is **clickable → opens the Version page** (the version room,
  a step before the builder — see Decision D-1, now resolved).

## E2. Search & filter

- **Search** the version list by **name, client, or any property** (free-text across version fields).
- **Filter** via a **configurable sidebar** that exposes the version properties as **dropdown / select**
  controls. Properties to expose:
  - **Client**
  - **Project**
  - **Version Status**
  - **Created by** (user)
- The sidebar is **configurable** — the set of filterable properties is driven by the version property
  model, not hardcoded one-offs.
- v0.1.4 reference (`home/SearchFilters.tsx`): had a `RightSidebar` with **Status / Client / Product**
  as multi-select chip toggles + **saved views** pills + save-view flow. Differences to apply: (a) add
  **Project** and **Created by**, (b) the spec calls for **dropdown/select** controls (not chip toggles),
  (c) reuse the saved-views idea (`REQ-UP-009/010/019` local persistence).

## F. Logs block

- Shows logs — **primarily version status-update logs**.
- Each log entry displays **user name, user photo, and timestamp**.
- **Source (D-3 resolved):** reads the **same `activity_logs`** as the builder's Project-Metadata
  Island (`REQ-CR-001/004`) — **read-only / display-only, no separate Home log store.** MVP scope is
  lifecycle events only (`REQ-CR-002`).
- **Loading:** **auto-loads on page open** (pull-on-load — not real-time streaming).

---

## G. Requirement coverage map

Legend: ✅ covered by an existing graph requirement · 🟡 partial (exists but needs extension) · ❌ gap (new candidate).

| Home feature | Existing graph requirement(s) | State | Note |
|---|---|---|---|
| Archive reference for Home build | `REQ-FP-D07` | ✅ | v0.1.4 reference is the grounding for HV-1 |
| Home responsive (mobile/tablet) | `REQ-RESP-001` | 🟡 | Says Home responsive; does **not** state fixed 100vh×100vw desktop / no-scroll → needs **HOME-LAYOUT** candidate |
| Compact one-island shell (not builder islands) | `REQ-UP-005…008`, `REQ-UP-020` | 🟡 | Those are **builder** island reqs; Home's compact single-island is unstated → **HOME-SHELL** candidate |
| Brand block (favicon + name) | — | ❌ | **HOME-BRAND** candidate |
| User block (builder user controls minus Save) | (HeaderUserIsland exists; WM-1 touched it) | ❌ | No requirement for a Home user block → **HOME-USER** candidate |
| Header + Add button opens create popup | — | ❌ | **HOME-CREATE-ENTRY** candidate |
| Create popup fetches filtered ClickUp tasks | `REQ-VR-006` (prefilled project payload), ClickUp refs `REQ-VR-001/VL-009/BC-024/PR-005` | 🟡 | Create-popup ClickUp fetch + filter not stated → **HOME-CREATE-FETCH** candidate |
| ClickUp taxonomy: list=project, folder=client | — | ❌ | **HOME-CREATE-TAXONOMY** candidate |
| Auto-versioning on create | `REQ-VL-002` (draft/created), `REQ-RV-016/017` | 🟡 | Auto-assign version number not explicit → fold into **HOME-CREATE-FLOW** |
| Assign team without titles | `REQ-VR-006` (prefilled users) | 🟡 | "without titles" is a new presentation rule → fold into **HOME-CREATE-FLOW** |
| Add documents on create | `REQ-EFP-001` (doc preview), `files.service.ts` | 🟡 | Attach-on-create not explicit → fold into **HOME-CREATE-FLOW** |
| **One DCX per campaign; version add auto-creates DCX** | `REQ-VL-019` (DCX status derived from versions) | ❌ | The **auto-create-DCX-container** rule is unstated → **HOME-DCX-IMPLICIT** candidate (business rule — PO sign-off) |
| Dashboard: # Active / # Total DCXs / # Versions | `REQ-VL-019/021/022/024` (DCX status + dashboard), `REQ-DM-021` | 🟡 | The three specific counts + "Active" definition not stated → **HOME-ANALYTICS** candidate |
| Analytics sourced from Supabase | `REQ-CR-001` (logs in Supabase) | 🟡 | Analytics-from-Supabase not stated → fold into **HOME-ANALYTICS** (backend-deferred) |
| Version list cards/bento, click → Version page | `REQ-VR-001` (version link → **Builder directly**), VL family | 🟡 ⚠ | D-1 **resolved**: card → Version page (room). `REQ-VR-001` must be **superseded** → **HOME-VERSION-LIST** candidate |
| Search by name / client / any property | — | ❌ | **HOME-SEARCH** candidate |
| Configurable filter sidebar (Client, Project, Version Status, Created by; dropdown/select) | `REQ-UP-009/010/019` (local pref persistence for saved views) | 🟡 | Filter property set + dropdown controls unstated → **HOME-FILTER** candidate |
| Logs block (status updates, user name/photo/time) | `REQ-CR-001/002/004`, `REQ-VL-029` | 🟡 | `REQ-CR-004` puts logs in the **builder** Project-Metadata Island; Home logs block + name/photo/time presentation unstated → **HOME-LOGS** candidate |

---

## H. New requirement candidates — ready to `req:propose` at HV-1

> **Not yet in the graph** (§35b). At HV-1 Step, run `npm run req:propose` for each, get PO sign-off,
> then `npm run req:apply-after-signoff`. Suggested family prefix **`HOME`** — PO confirms the final
> prefix/IDs at proposal time.

| Candidate | Draft statement | Scope | Acceptance idea |
|---|---|---|---|
| `REQ-HOME-LAYOUT` | Home is a fixed full-viewport shell (100vh × 100vw, no page scroll) on desktop; internal regions scroll independently. Mobile/tablet layout per `REQ-RESP-001`. | frontend | Desktop: no document scrollbar; each block scrolls within itself at 1280–3840px |
| `REQ-HOME-SHELL` | Home uses a single compact island/shell, not the builder's strict multi-island system; strict islands remain builder-only. | frontend | Home renders one shell container; no `src/builder/**` island imports (`core.md §13`) |
| `REQ-HOME-BRAND` | Home shows a brand block: favicon + product name. | frontend | Brand block visible top of Home |
| `REQ-HOME-USER` | Home shows a user block reusing the builder header user controls, **minus the Save action**. | frontend | User block renders builder user controls; no Save button present |
| `REQ-HOME-CREATE-ENTRY` | Home header has a description + Add button that opens the New Version popup. | frontend | Add button opens create popup |
| `REQ-HOME-CREATE-FLOW` | New Version popup (imitating v0.1.4): auto-assigns version number, assigns team without titles, and attaches reference documents during creation. | frontend + product | Created version has auto number, team (no titles), optional docs |
| `REQ-HOME-CREATE-FETCH` | The create popup fetches a filtered list of ClickUp tasks from the client API to seed version creation. | backend + frontend | Popup lists filtered ClickUp tasks from client API |
| `REQ-HOME-CREATE-TAXONOMY` | ClickUp taxonomy maps to product entities: a ClickUp **list = project**, a ClickUp **folder = client**. | product | Task's list/folder resolve to project/client on the created version |
| `REQ-HOME-DCX-IMPLICIT` | One campaign = one DCX with many versions. There is no standalone DCX-create action; adding a version auto-creates the DCX container when none exists, then attaches the version. | product (PO sign-off) | First version of a campaign creates its DCX; subsequent versions attach to it |
| `REQ-HOME-ANALYTICS` | Home dashboard shows summary counts — # Active DCXs (status not `Approved` and not `Superseded`), # Total DCXs, # Versions — sourced from the Supabase DB. | frontend + backend | Three counts render from Supabase analytics (backend-deferred until DB); Active excludes `Approved`/`Superseded` |
| `REQ-HOME-VERSION-LIST` | Home shows a version list (cards / optional bento for look-and-feel) with proper version data; clicking a card opens the Version page (room) for that version. | frontend | Cards show real data; click navigates to `/version/:id` |
| `REQ-HOME-SEARCH` | The Home version list is searchable by name, client, or any version property (free-text). | frontend | Typing filters the list across version fields |
| `REQ-HOME-FILTER` | Home provides a configurable filter sidebar exposing version properties (Client, Project, Version Status, Created by) as dropdown/select controls; selections persist locally as saved views. | frontend | Sidebar filters list; selections persist per `REQ-UP-009/010/019` |
| `REQ-HOME-LOGS` | Home shows a read-only logs block of version status-update logs (each with user name, photo, timestamp), reading the same `activity_logs` as the builder; auto-loads on page open. | frontend + operations | Entries render name + photo + time from `activity_logs`; no separate store; loads on open |

---

## I. Decisions

### Resolved
| # | Decision | Resolution (PO, 2026-06-30) | Action |
|---|---|---|---|
| **D-1** | Where does a Home version card click go? | **Version page (room) — a step before the builder.** The Version page holds the mini-builder view + "open builder" toggle. | Card → `/version/:id`. **Supersede `REQ-VR-001`** ("opens Builder directly, not a Version Room") via a new node + `supersedes` TraceLink at HV time (§35b). |
| **D-2** | "Active" definition + does "Rejected" exist? | **Active = not `Approved` and not `Superseded`** (so `Draft`/`In Progress`/`Ready for Approval`). **No `Rejected`** — current lifecycle unchanged. | `REQ-HOME-ANALYTICS` carries the Active definition; no lifecycle/status-literal change. |
| **D-3** | Home logs surface. | **Same `activity_logs` as the builder, read-only/display-only** (no new store); **auto-loads on page open** (pull-on-load, not real-time). | `REQ-HOME-LOGS` reads existing logs; no separate log store. |

### ✅ Resolved by PO (2026-06-30)
| # | Decision | Resolution |
|---|---|---|
| **D-6** | **Home dashboard data scope** (audit P1-2 / gap H-G7). | **Option A** — Add an all-versions/all-DCX dashboard mock+query seam traced to `REQ-HOME-*` candidates. |
| **D-7** | **Frontend-MVP vs backend-deferred split** (audit P1-3). | **Option A** — Define mock/service contract frontend consumes (extend `src/services/mock/*` + `mock-dispatch.ts`); trace to backend-dependent candidates; mark live ClickUp/Supabase wiring as deferred follow-ups. HV-1 acceptance against mock contract. |

> **Backend-dependent candidates** (satisfied via mock contract in HV-1, live wiring deferred per D-7):
> `REQ-HOME-CREATE-FETCH`, `REQ-HOME-CREATE-TAXONOMY`, `REQ-HOME-DCX-IMPLICIT`, `REQ-HOME-ANALYTICS`.

> **Graph-authority note (audit P2-1):** the `REQ-HOME-*` / `REQ-VER-*` candidates and the `REQ-VR-001`
> supersession (D-1) are **not yet in the graph**. Existing approved requirements remain canonical until
> the candidates are proposed + applied (`§35b/§35e`). Do not implement a behavior that contradicts an
> approved requirement (e.g. the version-room redirect vs `REQ-VR-001`) until its supersession is applied.

---

## J. HV-1 executor handoff

When HV-1 runs: (1) read this spec + the component sign-off (§PAGE 1); (2) **D-1/D-2/D-3/D-6/D-7 all resolved**; (3) `req:propose` + **apply `REQ-VER-ROOM`** (supersedes `REQ-VR-001`) before
card→version navigation, then `req:propose` the other §H candidates the sprint will manifest, get
sign-off, apply; (4) build only PO-approved components; (5) trace each new manifestation to its
(now-approved) requirement; (6) run gates + debt burn-down per the HV-1 sprint file.
