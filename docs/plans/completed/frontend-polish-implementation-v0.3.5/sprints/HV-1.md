## HV-1 — Homepage operational dashboard
Status: Completed
Order: 16 | Family: `change-component + wire-mockup-data` | Executor: Claude/opencode | Required skill: dcx-frontend-refactor (no impeccable) | Required tool: Playwright/Preview

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).
5. **Read the HV discovery findings (below) + the two task docs:** [`tasks/HV-1-home-spec.md`](../tasks/HV-1-home-spec.md) (PO functional spec, requirement coverage, resolved decisions) and [`tasks/HV-1-HV-2-component-signoff.md`](../tasks/HV-1-HV-2-component-signoff.md) §PAGE 1 (component build-list + sign-off). **Build only PO-approved components; do not create a component whose sign-off row is not Approved.**
6. **D-6 + D-7 resolved** (dashboard data scope: all-DCX mock seam; frontend-MVP: mock contract, live deferred). Then **`req:propose` + apply `REQ-VER-ROOM`** (supersedes `REQ-VR-001`) with PO sign-off **before** building card→`/version/:id` navigation (`§35b`), and `req:propose` the other `REQ-HOME-*` candidates this sprint will manifest.

### Discovery findings (PO spec + decisions — 2026-06-30; intended spec for HV-1 specifics)
> These solidify the FP-R5 §HV-1 brief with the PO's detailed spec. They are the **intended target**;
> **graph IDs remain canonical until the staged `REQ-HOME-*` candidates are proposed + applied** (`§35b/§35e`).
> Where this *describes* Home more specifically than FP-R5, follow it for design — but do not implement any
> behavior that contradicts an existing approved requirement until the superseding candidate is applied.

**Resolved PO decisions (see `tasks/HV-1-home-spec.md` §I) — all resolved:**
- **D-1:** a Home version card opens the **Version page (room)** — `/version/:id`, a step before the builder (not the builder directly). ⚠ `REQ-VR-001` ("opens Builder directly, not a Version Room") is **still approved canonical truth**. **Resolution of the ordering dependency (audit P1):** HV-1 **proposes + applies `REQ-VER-ROOM` (supersedes `REQ-VR-001`) in Step 0** with PO sign-off, *before* building card navigation. The `/version/:id` route already exists, so HV-1 navigates to it (the Version page renders its placeholder/skeleton until HV-2 builds it). Do not implement the redirect until the supersession is applied.
- **D-2:** Home dashboard **"# Active" = DCXs whose derived status is *not* `Approved` and *not* `Superseded`** (DCX status is derived from member versions — `REQ-VL-019/021/022/024`). The D-6 mock/dashboard seam must model **DCX-level** status, not raw version counts. **No `Rejected`** — current lifecycle unchanged.
- **D-3:** Home logs block reads the **same `activity_logs`** as the builder (read-only, no separate store), **auto-loads on page open**.
- **D-6 (resolved PO 2026-06-30):** Option A — Add an all-versions/all-DCX dashboard mock+query seam traced to the `REQ-HOME-*` candidates. **Do not start with a hardcoded `useVersionsQuery('dcx-1')` assuming global scope.**
- **D-7 (resolved PO 2026-06-30):** Option A — Mock/service contract; live ClickUp/Supabase deferred. HV-1 acceptance against mock contract.

**Home composition (blocks):** brand block (favicon + name) · user block (builder user controls **minus Save**) · header + Add → New Version popup · dashboard analytics (# Active / # Total DCXs / # Versions, from Supabase) · version list (cards/bento, click → Version page) · search (name/client/any property) + configurable filter sidebar (Client, Project, Version Status, Created by — dropdown/select) · logs block. **Desktop = fixed 100vh×100vw, no page scroll; compact single-island shell (strict islands stay builder-only).**

**New Version popup (imitate v0.1.4):** fetch filtered ClickUp tasks from the client API → ClickUp **list = project, folder = client** → auto-version, assign team (no titles), attach docs. **One campaign = one DCX, many versions; adding a version auto-creates the DCX container** (no standalone DCX-create).

**Backend split (D-7) — MVP vs deferred.** HV-1 is a `change-component + wire-mockup-data` sprint, **not** a backend sprint. The following are **backend-dependent** and must be driven by a defined **mock/service contract** for HV-1 (production integration deferred unless the sprint is explicitly expanded): ClickUp task fetch (`REQ-HOME-CREATE-FETCH`), list/folder→project/client mapping (`REQ-HOME-CREATE-TAXONOMY`), DCX auto-create (`REQ-HOME-DCX-IMPLICIT`), Supabase analytics (`REQ-HOME-ANALYTICS`). **Before coding:** define the mock seam these consume (extend `src/services/mock/*` + `mock-dispatch.ts`), trace it to the candidates, and mark real ClickUp/Supabase wiring as deferred follow-ups. HV-1 acceptance is satisfied against the **mock contract**, not live integrations.

**Shared blocks:** the brand block and user block are **shared with HV-2** — build them as app-level `PageBrandBlock` / `PageUserBlock` (sign-off rows in `tasks/HV-1-HV-2-component-signoff.md` §Shared). The user block must **recreate** the builder header-user controls at app level (minus Save) — **no `src/builder/**` import** (`§13`).

**Component build-list (sign-off-gated — `tasks/HV-1-HV-2-component-signoff.md` §1.1):** `HomeDashboard`, `HomeHeroBar`, `HomeSearchFilters`, `HomeSavedViews`, `HomeVersionList`, `HomeVersionCard`, `HomeAnalyticsPanel`, `HomeActivityPanel`, `CreateVersionDialog`.

**Requirement candidates to `req:propose` + sign off before manifesting (`§35b`; spec §H):** `REQ-HOME-LAYOUT`, `REQ-HOME-SHELL`, `REQ-HOME-BRAND`, `REQ-HOME-USER`, `REQ-HOME-CREATE-ENTRY`, `REQ-HOME-CREATE-FLOW`, `REQ-HOME-CREATE-FETCH`, `REQ-HOME-CREATE-TAXONOMY`, `REQ-HOME-DCX-IMPLICIT`, `REQ-HOME-ANALYTICS`, `REQ-HOME-VERSION-LIST`, `REQ-HOME-SEARCH`, `REQ-HOME-FILTER`, `REQ-HOME-LOGS`. (The existing graph IDs below cover the *adjacent* logic; these candidates cover the Home **UI/presentation** gaps.)

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-FP-D07, REQ-UP-001, REQ-UP-004, REQ-UP-009, REQ-UP-010, REQ-UP-019, REQ-EFP-001, REQ-RESP-001 |
| Scope/type | frontend / ui-presentation + interaction (page) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §HV-1 (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); Home is a functional versions/campaigns dashboard grounded in v0.1.4; no builder-internal imports |
| Expected manifestation categories | EMC-UP-SEED, EMC-EFP-SEED, EMC-GOV-TRACE-FRONTEND |
| Actual manifestations | _to be filled during execution_ (confirm/correct RS-R7 candidate links for the touched reqs) |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** Rebuild Home from v0.1.4 (docs/archive/dcx-manager-v0.1.4/src/pages/home/*): hero/create, search, filters, saved views, version cards, analytics, activity, empty states. **No src/builder/** imports (§13).**
- **Out:** Builder implementation.

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- Dashboard matches v0.1.4 workflows; user can find + enter a version; no builder-internal import (verify by grep).

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
Route **`/`** (Home is the index route — there is **no `/home`** in `src/router.tsx`) at 1440+390; seed mock versions; search/filter/save view/create/select version; expect usable dashboard. Evidence → `output/evidence/HV-1-home/`. Full route/viewport/seed/steps/expected: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §HV-1.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Responsiveness (REQ-RESP-001, added 2026-06-30) — MANDATORY for this page
Home must be **fully responsive including mobile and tablet** (unlike the desktop-only Builder). Build from
the v0.1.4 reference with responsive breakpoints/stacking. **PO Web Check viewports MUST include mobile
(≈375×812) and tablet (≈768×1024)** in addition to desktop — the page must be usable (find + enter a
version, search/filter) at all three. **SK-1 skeletons for Home must be re-aligned to the final responsive
layout built here** (skeleton must match final geometry at each breakpoint — REQ-LOAD-SKEL-001).

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
