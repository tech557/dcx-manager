---
task: HV-1-HV-2-component-signoff
type: supporting-task (non-sprint — pre-build component plan + PO sign-off)
plan: frontend-polish-implementation-v0.3.5
status: SIGNED OFF
version_context: v0.3.5
origin: Codex / GPT-5 / OpenAI — discovery-only support note, 2026-06-30
  (was misfiled at output/HV-1-HV-2-component-discovery-support.md; relocated + solidified)
solidified-by: Claude (claude-opus-4-8), 2026-06-30
feeds: HV-1 (Home page), HV-2 (Version page) — MUST be read in each sprint's Step 0 before any build
requirements: REQ-FP-D07, REQ-UP-001, REQ-UP-004, REQ-UP-005, REQ-UP-009, REQ-UP-010,
  REQ-UP-011, REQ-UP-012, REQ-UP-019, REQ-UP-021, REQ-UP-022, REQ-STG-001, REQ-EFP-001,
  REQ-RESP-001, REQ-LOAD-SKEL-001
---

# HV Component Plan & Sign-Off — Home (HV-1) + Version (HV-2)

> **This is a supporting task, not a sprint.** It produces no code and runs no gates. Its sole
> output is a **PO-approved component inventory** for the two non-builder pages, so HV-1 and HV-2
> can start from a signed-off build list instead of rediscovering the split. It does **not** live in
> `output/` (that folder is reserved for executed sprint outputs — `core.md §25/§29`).

## Status

🟡 **AWAITING PO SIGN-OFF.** Each page below ends with a per-component sign-off table. HV-1/HV-2 are
**blocked from creating any new page component until the PO marks it Approved** here.

## Why this exists

Home (`/`) and Version (`/version/:id`) are still **placeholder routes** in v0.3.5 — each page is a
5-line component that renders only its skeleton. The v0.1.4 archive has rich versions of both pages,
but they depend on old types, old lifecycle statuses, old UI primitives, and builder-era assumptions.
This task fixes the four decisions per page **before** the build:

1. **Create** — net-new v0.3.5 page-local components.
2. **Reuse** — existing v0.3.5 manifestations to consume, never re-create.
3. **Borrow (reference only)** — v0.1.4 archive used for *workflow shape*, never copy/paste.
4. **Avoid** — what must not be imported because it fights the current system.

Source spec for acceptance: `FP-R4-finalize-spec.md` — Home checklist **H01–H09**, Version checklist
**V01–V11**.

## Current state (shared baseline)

| Area | Current v0.3.5 state | Evidence |
|---|---|---|
| Home route | Placeholder only; renders `HomeLoadingSkeleton` | `src/pages/home/HomePage.tsx` is 5 lines |
| Version route | Placeholder only; renders `VersionLoadingSkeleton` | `src/pages/version/VersionPage.tsx` is 5 lines |
| Routing | `/` → Home, `/version/:versionId` → Version, `/builder/:versionId` → Builder | `src/router.tsx` |
| Non-builder shell | Root nav appears only outside `/builder` | `src/pages/RootLayout.tsx` |
| Skeletons | Home + Version already have layout-preserving skeletons | `HomeLoadingSkeleton.tsx`, `VersionLoadingSkeleton.tsx` |
| Version data | Existing service/query/action stack covers list, detail, status, date, duplicate | `versions.service.ts`, `versions.queries.ts`, `version.actions.ts` |
| Mock backend | Mock dispatcher backs version routes + files/activity routes | `mock-dispatch.ts`, `versions.mock.ts`, `logs.mock.ts` |
| Manifestations | Canonical MAN nodes already exist for both placeholder pages | `MAN-react-component-src-pages-home-homepage`, `MAN-react-component-src-pages-version-versionpage` |

**File-size budget for every new component below:** ≤150 lines target / ≤250 lines hard cap (`core.md §6`).

---

# PAGE 1 — Home (HV-1)

> **Detailed PO functional spec + requirement coverage map:** [`HV-1-home-spec.md`](HV-1-home-spec.md)
> (recorded 2026-06-30). Read it alongside this component list — it carries the create-popup flow,
> implicit-DCX rule, analytics, logs spec, and the requirement gap candidates. **Decisions: D-1, D-2, D-3
> resolved; ⚠ D-6 (dashboard data scope) + D-7 (frontend-MVP vs backend split) MUST be resolved before
> HV-1 coding** (see §1.5 H-G7/H-G8 and the sign-off block).

Route `/`. Two-zone operational dashboard: left = version list + search/filters; right =
analytics + activity. Spec: H01–H09. Requirements: `REQ-FP-D07`, `REQ-UP-001`, `REQ-UP-004`,
`REQ-UP-005`, `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-011`, `REQ-UP-012`, `REQ-UP-019`, `REQ-EFP-001`,
`REQ-RESP-001`, `REQ-LOAD-SKEL-001`.

## 1.1 Components to CREATE (the build list)

| # | Component | Path | Responsibility | Why new (not reuse/copy) |
|---|---|---|---|---|
| H-C1 | `HomeDashboard` | `src/pages/home/HomeDashboard.tsx` | Page orchestrator: dashboard state + composition; keeps `HomePage` thin | Orchestration layer doesn't exist yet |
| H-C2 | `HomeHeroBar` | `src/pages/home/HomeHeroBar.tsx` | Hero identity + primary create affordance | Recreates hero without old `BrandedButton`/`Popup` deps |
| H-C3 | `HomeSearchFilters` | `src/pages/home/HomeSearchFilters.tsx` | Search + status/lifecycle filters, responsive mobile/tablet | Needs current statuses + responsive behavior |
| H-C4 | `HomeSavedViews` | `src/pages/home/HomeSavedViews.tsx` | Saved-view pills, persisted to local storage | Page-local; `REQ-UP-009/010/019` local-pref scoping |
| H-C5 | `HomeVersionList` | `src/pages/home/HomeVersionList.tsx` | Filters/searches current `Version` records | No old `EnrichedVersion` dependency |
| H-C6 | `HomeVersionCard` | `src/pages/home/HomeVersionCard.tsx` | Compact responsive card: status badge + route nav | Current lifecycle badges, current routing |
| H-C7 | `HomeAnalyticsPanel` | `src/pages/home/HomeAnalyticsPanel.tsx` | Active/total/version-count analytics from current data | Computes from current versions, not archived `MOCK_DCX_TABLE` |
| H-C8 | `HomeActivityPanel` | `src/pages/home/HomeActivityPanel.tsx` | Recent activity feed | Uses current activity-log shape / derived summaries |
| H-C9 | `CreateVersionDialog` | `src/pages/home/CreateVersionDialog.tsx` | Controlled create dialog (see data gap H-G5) | Aligned to current service limits; old create form is archive-only |

## 1.2 Components/modules to REUSE (consume, do not re-create)

| Reuse | Path / manifestation | Use in Home | Note |
|---|---|---|---|
| Version list/detail queries | `src/queries/versions.queries.ts` / `MAN-function-src-queries-versions-queries` | Version list data | Prefer React Query over direct service calls in components |
| Version service | `src/services/versions.service.ts` / `MAN-service-src-services-versions-service` | Data source behind queries | Do not create a parallel versions fixture |
| Mock versions backend | `src/services/mock/versions.mock.ts` / `MAN-service-src-services-mock-versions-mock` | Seed versions | Thin seed; extend only if H acceptance needs richer visible data (see H-G2) |
| Mock dispatcher | `src/services/mock-dispatch.ts` / `MAN-service-src-services-mock-dispatch` | `/dcx/:dcxId/versions`, `/activity-logs` | Add routes only for genuinely missing operations |
| Activity logs | `src/services/logs.service.ts`, `src/services/mock/logs.mock.ts` | Activity panel | Mock starts empty; status updates write logs |

(Shared UI atoms / button / skeleton / theme tokens / root shell are listed once in **Shared foundations** below — they apply to Home too.)

## 1.3 BORROW as reference only (v0.1.4 archive — shape, never copy)

| Archive source | Borrow the *idea* | Do **not** copy |
|---|---|---|
| `docs/archive/dcx-manager-v0.1.4/src/pages/home/Home.tsx` | Two-zone dashboard: left list, right analytics/activity | Old props model, old `GlassCard`, old create-form wiring |
| `Hero.tsx` | Home identity + create affordance | Motion setup, `BrandedButton` dependency |
| `SearchFilters.tsx` | Search + filters + saved-views behavior | Old statuses `Ready for Review`, `Rejected`, `Placed` |
| `VersionsList.tsx` / `VersionCard.tsx` | Search fields, empty state, status/client/project/product/version/team/date card content | `EnrichedVersion`, `MOCK_DCX_TABLE`, hover cycles, old `StatusBadge` |
| `StatsOverview.tsx` | Active / total / version-count analytics idea | Direct dependency on archived DCX mock table |
| `RecentlyOpened.tsx` | Activity feed + sync affordance idea | Old activity/user IDs, double-click-only sync |

## 1.4 AVOID / do not import (Home-specific)

| Do not use | Why |
|---|---|
| Any `src/builder/**` import | `core.md §13` — Home is outside the builder boundary |
| Archive `GlassCard`, `Popup`, `CreateDCXForm` | Not current-system components; copy behavior only if needed |
| Old lifecycle literals `Ready for Review`, `Rejected`, `Placed` | Obsolete; use current `VersionStatus` type |
| A new global state store for Home | Prefer React Query + page-local state + scoped local storage |
| Direct service calls inside visual child components | Keep data orchestration at the page/container layer |

## 1.5 Data-model gaps to resolve during HV-1

| ID | Gap | Evidence | Recommendation |
|---|---|---|---|
| H-G1 | No current DCX/project service | `ApiDCX` exists but no `dcx.service.ts` / mock DCX route | Derive client/product/project display from `Version.metadata`/`strategyContext`, **or** add a small signed-off mock DCX seam if filters require it |
| H-G2 | Seed versions are thin | `versions.mock.ts` seeds two `dcx-1` versions, empty attachments, one team member | Enrich seed minimally for Web Checks: multiple statuses, attachments, roles, realistic metadata |
| H-G3 | Activity logs start empty | `logs.mock.ts` empty default, writes on status change | Derive "recent activity" from versions initially; show lifecycle logs after interactions |
| H-G5 | No "create version from scratch" service route | Service supports duplicate, not create-new | Scope create flow to duplicate / create-disabled state, **or** add a real `createVersion`/`createDcx` service in HV-1 *with* a requirement trace |
| H-G7 | **Dashboard data is per-DCX only** (audit P1-2) | `useVersionsQuery(dcxId)` lists one DCX's versions only (`src/queries/versions.queries.ts`) — can't do `# Total DCXs`, global Client/Project filter, or cross-campaign search | **Decision D-6:** (a) add an all-versions/all-DCX dashboard mock+query seam traced to `REQ-HOME-*` (recommended), or (b) narrow HV-1 MVP to one `dcxId` + defer global analytics/filter. **Do not hardcode `useVersionsQuery('dcx-1')` as if global.** |
| H-G8 | **Backend-dependent create/analytics** (audit P1-3) | ClickUp fetch + list/folder mapping + DCX auto-create + Supabase analytics have no service routes (only a thin `clickup.service.ts` + version mocks) | **Decision D-7:** define the **mock/service contract** the frontend consumes (extend `src/services/mock/*` + `mock-dispatch.ts`), trace to candidates; mark live ClickUp/Supabase wiring **deferred**. HV-1 acceptance is met against the mock contract, not live integration. |

## 1.6 Build shape (suggested order)

1. Keep `HomePage` as the route entry; let it orchestrate the **dashboard data per D-6/H-G7** — an all-versions/all-DCX seam (recommended) or a narrowed single-`dcxId` MVP. **Do not assume `useVersionsQuery('dcx-1')` gives global dashboard data** (it's per-DCX only).
2. Create page-local components under `src/pages/home/` (table 1.1).
3. Use `Input` (search), `Chip` (saved views/filters), `Badge` (status), `Button` (create/enter).
4. Use current `VersionStatus` values only.
5. Persist saved-view/filter prefs locally, keys scoped per user/dcx/version (`REQ-UP-009/010/019`).
6. Navigate version selection to `/version/:versionId`.
7. Update `HomeLoadingSkeleton` after final layout so mobile/tablet/desktop skeleton geometry matches.

## 1.7 ✅ PO SIGN-OFF — Home components

> Mark each **Approved** / **Reject** / **Change**. HV-1 may only create a component once its row is Approved.

| # | Component | Decision (Approve / Reject / Change) | PO note |
|---|---|---|---|---|
| H-C1 | `HomeDashboard` | ✅ Approved | |
| H-C2 | `HomeHeroBar` | ✅ Approved | |
| H-C3 | `HomeSearchFilters` | ✅ Approved | |
| H-C4 | `HomeSavedViews` | ✅ Approved | |
| H-C5 | `HomeVersionList` | ✅ Approved | |
| H-C6 | `HomeVersionCard` | ✅ Approved | |
| H-C7 | `HomeAnalyticsPanel` | ✅ Approved | |
| H-C8 | `HomeActivityPanel` | ✅ Approved | |
| H-C9 | `CreateVersionDialog` | ✅ Approved | |

| Home decision | Recommended answer | PO sign-off |
|---|---|---|
| Copy v0.1.4 Home files? | No — recreate page-local with current stack | ✅ Approved |
| Reuse current version services/queries? | Yes | ✅ Approved |
| Add a DCX/project service? | Only if filters/create can't be met from enriched version metadata (H-G1) | ✅ Approved |
| Show old statuses? | No — map to current lifecycle | ✅ Approved |
| Create-version flow approach? | D-7 resolved: mock contract + deferred live wiring | ✅ Approved |

---

# PAGE 2 — Version (HV-2)

> **Detailed PO functional spec + requirement coverage map:** [`HV-2-version-spec.md`](HV-2-version-spec.md)
> (recorded 2026-06-30, grounded in v0.1.4). The Version page is the **version room — a step before the
> builder** (D-1). New vs v0.1.4: the **structure summary** (phases/actions/tasks counts + hover lists,
> `V-C10`). **Decisions D-1, D-4, D-5 all resolved** (D-5 → Option B: no builder visual, branded launch).
> ⚠ The `REQ-VR-001` supersession (`REQ-VER-ROOM`) is a *proposed* change — **propose + apply it in HV-1
> Step 0** (it gates Home's card→version navigation, which runs first).

Route `/version/:versionId`. Version workspace: identity header, status controls, same-campaign
switchboard, summary/resources/crew, launch-to-builder. Spec: V01–V11. Requirements: `REQ-FP-D07`,
`REQ-UP-004`, `REQ-UP-011`, `REQ-UP-012`, `REQ-UP-021`, `REQ-UP-022`, `REQ-STG-001`, `REQ-EFP-001`,
`REQ-RESP-001`, `REQ-LOAD-SKEL-001`.

## 2.1 Components to CREATE (the build list)

| # | Component | Path | Responsibility | Why new (not reuse/copy) |
|---|---|---|---|---|
| V-C1 | `VersionWorkspace` | `src/pages/version/VersionWorkspace.tsx` | Page orchestrator: selected version, siblings, status, resources, launch | Orchestration layer doesn't exist yet |
| V-C2 | `VersionMissingState` | `src/pages/version/VersionMissingState.tsx` | Not-found / error fallback with return-to-Home (`REQ-UP-022`) | Must not rely on thrown service errors as UI |
| V-C3 | `VersionHeader` | `src/pages/version/VersionHeader.tsx` | Client/product/project identity, back action, current status | Builder-free identity header |
| V-C4 | `VersionStatusControls` | `src/pages/version/VersionStatusControls.tsx` | Status transition controls | Must use current statuses (see V-rule below) |
| V-C5 | `VersionSwitchboard` | `src/pages/version/VersionSwitchboard.tsx` | Same-campaign version list + active state | Backed by `useVersionsQuery` |
| V-C6 | `VersionSummaryPanel` | `src/pages/version/VersionSummaryPanel.tsx` | Summary / readiness / resource / launch layout | Without importing builder internals |
| V-C7 | `VersionResourcesPanel` | `src/pages/version/VersionResourcesPanel.tsx` | Attachments list | Uses current `ApiFileAttachment` + `files.service.ts` |
| V-C8 | `VersionCrewPanel` | `src/pages/version/VersionCrewPanel.tsx` | Renders `assignedTeam` | Start with role initials if no user directory (V-G4) |
| V-C9 | `VersionBuilderPanel` | `src/pages/version/VersionBuilderPanel.tsx` | **D-5 → Option B:** no builder visual — a prominent branded launch component (icon/branded section, more than a button) that opens the Builder | No `src/builder/**` import (§13); launch via route to `/builder/:id`; (live read-only preview is a future enhancement) |
| V-C10 | `VersionStructureSummary` | `src/pages/version/VersionStructureSummary.tsx` | #Phases / #Actions / #Tasks counts, each with a hover popup listing the items | **NEW vs v0.1.4**; reuse shared popup shell idea, no builder imports; carries the "what's inside" weight under D-5 Option B |

**Current statuses (V-C4 must use exactly these):** `Draft`, `In Progress`, `Ready for Approval`,
`Approved`, `Superseded`. Do not offer impossible transitions unless disabled with a clear state.

## 2.2 Components/modules to REUSE (consume, do not re-create)

| Reuse | Path / manifestation | Use in Version | Note |
|---|---|---|---|
| Version detail/list queries | `src/queries/versions.queries.ts` / `MAN-function-src-queries-versions-queries` | Selected version + siblings | `useVersionQuery(id)`, then `useVersionsQuery(version.dcxId)` |
| Version actions | `src/actions/version.actions.ts` / `MAN-function-src-actions-version-actions` | status / date / duplicate | Return type says `Version` but service returns `ApiVersion` — verify mapper before extending |
| Version service | `src/services/versions.service.ts` / `MAN-service-src-services-versions-service` | Data source | Do not create a parallel fixture |
| Mock versions backend | `src/services/mock/versions.mock.ts` / `MAN-service-src-services-mock-versions-mock` | Seed / duplicate / status / files | Enrich carefully; reconcile changed-scope debt |
| Files service | `src/services/files.service.ts` | Resources panel | Current `ApiFileAttachment`; do not reuse archive attachment type |
| Activity logs | `src/services/logs.service.ts`, `src/services/mock/logs.mock.ts` | Status history | Status updates write logs |
| **Builder tree (data-only)** | `src/queries/builder.queries.ts` (`useBuilderTreeQuery`) / `src/services/builder.service.ts` | **`V-C10 VersionStructureSummary`** — phase/action/task counts + hover lists | **Approved for HV-2 (audit P1-5).** These live in `src/queries`/`src/services`, **outside `src/builder/**` — not a §13 violation.** **Data only: never import builder UI / store / actions.** The `Version` domain model has no tree, so this is the source for counts. |

(Shared UI atoms / button / skeleton / theme tokens / root shell + the shared `PageBrandBlock`/`PageUserBlock` — see **Shared foundations** below.)

## 2.3 BORROW as reference only (v0.1.4 archive — shape, never copy)

| Archive source | Borrow the *idea* | Do **not** copy |
|---|---|---|
| `version/VersionPage.tsx` | Missing fallback, header, collaborators, switchboard, status bar, summary, resources, crew, launch | Old `Popup`, `EditVersionForm`, old status labels, direct phases preview |
| `VersionSwitchBar.tsx` | Same-campaign switchboard + create-sequence action | Old status string checks |
| `VersionStatusBar.tsx` | Status-transition control layout | `Ready for Review` → use `Ready for Approval` |
| `VersionSummary.tsx` | Summary console, resource/crew/launch sections | `MiniBuilderCanvas` if it imports/implies builder internals |
| `DriveArtifacts.tsx` | File-type icon detection by title/url | Old local attachment type |
| `CollaboratorsAvatars.tsx` | Compact crew role display | External avatar URLs, archived users table |

## 2.4 AVOID / do not import (Version-specific)

| Do not use | Why |
|---|---|
| Any `src/builder/**` import (`BuilderIslandShell`, `StageProvider`, `builderStore`, `useBuilderActions`, `GlassSurface`) | `core.md §13` — Version is outside the builder boundary |
| Archive `MiniBuilderCanvas`, `EditVersionForm`, `Popup` | Not current-system; launch via route nav, not import |
| Old lifecycle literals `Ready for Review`, `Rejected`, `Placed` | Obsolete; use current `VersionStatus` |
| Thrown service errors surfaced directly as UI | Use `VersionMissingState` instead (V-C2) |

## 2.5 Data-model gaps to resolve during HV-2

| ID | Gap | Evidence | Recommendation |
|---|---|---|---|
| V-G4 | User directory missing in current `src/` | Only `MOCK_USER_ID`; archive had rich `MOCK_USERS` | Start with role/userId labels; add a small mock users service only if crew UX needs names/avatars |
| V-G6 | Builder preview vs §13 boundary (D-5) | Builder lives under `src/builder/**`; archive `MiniBuilderCanvas` not current | ✅ **Resolved → Option B:** no builder visual; branded launch component + structure summary; launch navigates to `/builder/:versionId`, no builder embed. Live read-only preview = future enhancement |
| V-G2 | Seed versions thin (shared with H-G2) | `versions.mock.ts` thin seed | Enrich for Web Checks: multiple statuses, attachments, roles |

## 2.6 Build shape (suggested order)

1. Keep `VersionPage` as route entry; read `versionId` from route params.
2. `useVersionQuery(versionId)` for selected version; then `useVersionsQuery(version.dcxId)` for siblings.
3. Render `VersionMissingState` on error / not-found, with return-to-Home.
4. Drive `updateVersionStatus`, `updateVersionCommunicationDate`, `duplicateEditableVersion` via controlled handlers.
5. Keep transitions aligned to `VersionStatus`; disable impossible transitions with clear state.
6. Render resources from `attachments` / `files.service.ts`; open external links safely.
7. Render crew from `assignedTeam`; do not block on avatar data.
8. Launch Builder via route nav to `/builder/:versionId` — never by importing builder modules.
9. Update `VersionLoadingSkeleton` after final layout, including the missing-fallback async state.

## 2.7 ✅ PO SIGN-OFF — Version components

> Mark each **Approved** / **Reject** / **Change**. HV-2 may only create a component once its row is Approved.

| # | Component | Decision (Approve / Reject / Change) | PO note |
|---|---|---|---|---|
| V-C1 | `VersionWorkspace` | ✅ Approved | |
| V-C2 | `VersionMissingState` | ✅ Approved | |
| V-C3 | `VersionHeader` | ✅ Approved | |
| V-C4 | `VersionStatusControls` | ✅ Approved | |
| V-C5 | `VersionSwitchboard` | ✅ Approved | |
| V-C6 | `VersionSummaryPanel` | ✅ Approved | |
| V-C7 | `VersionResourcesPanel` | ✅ Approved | |
| V-C8 | `VersionCrewPanel` | ✅ Approved | |
| V-C9 | `VersionBuilderPanel` (D-5 → Option B: branded launch, no visual) | ✅ Approved | |
| V-C10 | `VersionStructureSummary` (new vs v0.1.4) | ✅ Approved | |

| Version decision | Recommended answer | PO sign-off |
|---|---|---|
| Copy v0.1.4 Version files? | No — recreate page-local with current stack | ✅ Approved |
| Reuse current version services/queries/actions? | Yes | ✅ Approved |
| Builder preview approach (D-5)? | ✅ **Resolved → Option B** (no visual; branded launch component + structure summary). Option A parked as future enhancement. | ✅ PO 2026-06-30 |
| Crew display without a user directory? | Role/initials first; mock users service only if needed (V-G4) | ✅ Approved |

---

# Shared foundations (apply to BOTH pages)

These are not per-page decisions — they are reused as-is by Home and Version.

## S.0 Shared components to CREATE (sign-off-gated — used by HV-1 + HV-2)

> Both pages require a brand block and a user block (Home spec §B; Version spec §B). They are built
> **once** as app-level shared components and consumed by both pages. **The user block must recreate the
> builder header-user controls at app level (minus Save) — no `src/builder/**` import (`§13`).**

| # | Component | Path | Responsibility | Why new |
|---|---|---|---|---|
| SH-C1 | `PageBrandBlock` | `src/ui/app-shell/PageBrandBlock.tsx` | Favicon + product name brand block for Home/Version | No app-level brand block exists outside the builder |
| SH-C2 | `PageUserBlock` | `src/ui/app-shell/PageUserBlock.tsx` | User controls/icons (theme, account) **minus Save**, app-level | Builder's `HeaderUserIsland` is builder-internal (`§13`); recreate at app level |

| # | Component | Decision (Approve / Reject / Change) | PO note |
|---|---|---|---|---|
| SH-C1 | `PageBrandBlock` | ✅ Approved | |
| SH-C2 | `PageUserBlock` | ✅ Approved | |

*(Path `src/ui/app-shell/` is a suggestion — PO/executor may place under an existing app-level home; the binding rule is "shared, app-level, no builder import.")*

## S.1 Reuse — shared UI / infrastructure

| Reuse | Path / manifestation | Use | Note |
|---|---|---|---|
| UI atoms | `src/ui/atoms/Badge.tsx`, `Chip.tsx`, `Input.tsx`, `ToggleGroup.tsx` | Status badges, saved views, filters, segmented controls | Good fit for page controls |
| Shadcn button | `src/ui/shadcn/button.tsx` | Primary/secondary commands | Token-aware; icons from lucide |
| Skeleton primitive | `src/ui/skeleton/SkeletonBlock.tsx` | Realign skeletons after final layouts | `REQ-LOAD-SKEL-001` — geometry must match final layout |
| Theme tokens | `src/brand/styles/tokens.css`, `theme.css`, `components.css` | All surfaces, text, borders, skeletons | No hardcoded page-specific color systems |
| Root route shell | `src/pages/RootLayout.tsx` | Navigation context | Keep builder-only shell rules intact |

## S.2 Requirement / manifestation notes for executors

| Item | Current graph signal | HV action |
|---|---|---|
| Home route manifestation | `MAN-react-component-src-pages-home-homepage` (proposed placeholder) | Confirm/correct link to `REQ-FP-D07`, `REQ-UP-001`, `REQ-UP-004`, `REQ-EFP-001` post-impl |
| Version route manifestation | `MAN-react-component-src-pages-version-versionpage` (proposed placeholder) | Confirm/correct link to `REQ-FP-D07`, `REQ-UP-004`, `REQ-UP-021`, `REQ-UP-022`, `REQ-STG-001`, `REQ-EFP-001` |
| Version service manifestation | `MAN-service-src-services-versions-service` | Reuse; add service fns only when acceptance can't be met otherwise |
| Mock versions manifestation | `MAN-service-src-services-mock-versions-mock` | Enrich carefully; reconcile changed-scope debt |
| Query/action manifestations | `MAN-function-src-queries-versions-queries`, `MAN-function-src-actions-version-actions` | Use; update trace if extended |
| Skeleton requirement | `REQ-LOAD-SKEL-001` (implemented by SK-1) | Realign final geometry as part of HV close |

## S.3 Fast executor handoff (after sign-off)

- **HV-1 start set:** `HomePage.tsx`, `HomeLoadingSkeleton.tsx`, `versions.queries.ts`, `versions.mock.ts`, archive Home files, `FP-R4-finalize-spec.md` Home checklist **H01–H09**.
- **HV-2 start set:** `VersionPage.tsx`, `VersionLoadingSkeleton.tsx`, `versions.queries.ts`, `version.actions.ts`, `versions.mock.ts`, `files.service.ts`, `logs.service.ts`, archive Version files, `FP-R4-finalize-spec.md` Version checklist **V01–V11**.
- Run the mandatory HV gates from the sprint files, including browser checks at **mobile, tablet, desktop** viewports (`REQ-RESP-001`).

---

## PO sign-off block

- [x] **Home (Page 1)** component list + decisions reviewed and approved (§1.7).
- [x] **Version (Page 2)** component list + decisions reviewed and approved (§2.7).
- [x] **Shared components** (`SH-C1`, `SH-C2`) approved (§S.0).
- [x] Data-model gap calls (H-G1, H-G5, V-G4, V-G6) decided.
- [x] **HV-1 execution blockers resolved:**
  - [x] **D-6 / H-G7** — All-DCX/all-versions mock+query seam (Option A).
  - [x] **D-7 / H-G8** — Mock/service contract defined; live ClickUp/Supabase deferred.
- [x] **HV ordering** — `REQ-VER-ROOM` (supersedes `REQ-VR-001`) will be proposed + applied in **HV-1 Step 0** (before Home card→version navigation), or HV-2 is reordered ahead of HV-1.

Signed off by: Mahmoud  Date: 2026-06-30

> On full sign-off: set this file's `status:` to `SIGNED OFF` and unblock HV-1 / HV-2 in the README.
> **`SIGNED OFF` is not valid while D-6 or D-7 is undecided** (the two highest-risk data decisions).
> HV-1 and HV-2 must read this file in Step 0 before creating any component.
