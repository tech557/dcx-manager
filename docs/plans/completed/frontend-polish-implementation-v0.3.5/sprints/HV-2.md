## HV-2 — Version workspace
Status: Completed
Order: 17 | Family: `change-component + wire-mockup-data` | Executor: Claude/opencode | Required skill: dcx-frontend-refactor (no impeccable) | Required tool: Playwright/Preview

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).
5. **Read the HV discovery findings (below) + the two task docs:** [`tasks/HV-2-version-spec.md`](../tasks/HV-2-version-spec.md) (PO functional spec, requirement coverage, resolved decisions) and [`tasks/HV-1-HV-2-component-signoff.md`](../tasks/HV-1-HV-2-component-signoff.md) §PAGE 2 (component build-list + sign-off). **Build only PO-approved components.**

### Discovery findings (PO spec + decisions — 2026-06-30; intended spec for HV-2 specifics)
> These solidify the FP-R5 §HV-2 brief with the PO's detailed spec (grounded in v0.1.4). They are the
> **intended target**; **graph IDs remain canonical until the staged `REQ-VER-*` candidates are proposed
> + applied** (`§35b/§35e`). Follow this for design — but do not implement behavior that contradicts an
> existing approved requirement until the superseding candidate is applied.

**Resolved PO decisions (see `tasks/HV-2-version-spec.md` §H):**
- **D-1:** the Version page **is the version room — a step before the builder**; the builder is launched **from here**. The `REQ-VER-ROOM` supersession of `REQ-VR-001` is **proposed + applied in HV-1 Step 0** (audit P1 ordering fix), so by HV-2 it should already be canonical — **confirm it is applied in Step 0**; if not, apply it (with PO sign-off) before relying on the version-room flow (`§35b/§35e`).
- **D-4:** product type (and client/project) is **read from a ClickUp task custom field** for now; the dedicated Apps Script client/project endpoint is **deferred to the backend decision** (swap behind the data layer, no UI rework).
- **D-5:** **Option B — no builder visual.** The version control component uses the **structure summary** + a **prominent branded launch component** (more than a button) that opens the builder by route. The live read-only builder preview (Option A) is a **future enhancement** (spec §J). No `src/builder/**` import (`§13`).

**Version composition:** brand + user blocks (**shared with Home — `PageBrandBlock`/`PageUserBlock`**, app-level, no `src/builder/**` import) · **header combo** (client, project, product type, campaign collaborators = all users shared on any campaign version per `REQ-PR-004`, campaign status derived per `REQ-VL-019/021/022/024`) · **version control component** (branded launch + version docs + version crew + structure summary) · **other-versions switchboard** (siblings + status; selecting one **changes the control component's context**). **Desktop = fixed 100vh×100vw, no page scroll** (matches Home).

**Structure summary is NEW vs v0.1.4:** counts of **# Phases / # Actions / # Tasks**, each with a **hover popup listing the items**. **Data source (P1-5 fix):** the `Version` domain model has no phase/action/task tree — read it via **`useBuilderTreeQuery` / `builder.service.ts`** (these live in `src/queries` / `src/services`, **outside `src/builder/**`, so they're allowed**). This is a **data-only** dependency: **no builder UI/store/actions imports**. Approved in the sign-off Page-2 reuse table.

**Component build-list (sign-off-gated — `tasks/HV-1-HV-2-component-signoff.md` §2.1):** `VersionWorkspace`, `VersionMissingState`, `VersionHeader`, `VersionStatusControls`, `VersionSwitchboard`, `VersionSummaryPanel`, `VersionResourcesPanel`, `VersionCrewPanel`, `VersionBuilderPanel` (D-5 → branded launch, no visual), `VersionStructureSummary` (new).

**Requirement candidates to `req:propose` + sign off before manifesting (`§35b`; spec §G):** `REQ-VER-ROOM` (supersedes `REQ-VR-001` — **proposed/applied in HV-1 Step 0**; confirm here), `REQ-VER-HEADER`, `REQ-VER-COLLAB-DISPLAY`, `REQ-VER-LAUNCH`, `REQ-VER-DOCS`, `REQ-VER-STRUCTURE-SUMMARY`, `REQ-VER-SWITCHBOARD`, `REQ-VER-LAYOUT`.

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-FP-D07, REQ-UP-004, REQ-UP-005, REQ-UP-011, REQ-UP-012, REQ-UP-021, REQ-UP-022, REQ-STG-001, REQ-EFP-001, REQ-RESP-001 |
| Scope/type | frontend / ui-presentation + interaction (page) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §HV-2 (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); Version route is a real workspace grounded in v0.1.4 with missing-version fallback; no builder-internal imports |
| Expected manifestation categories | EMC-UP-SEED, EMC-EFP-SEED, EMC-STG-SEED, EMC-GOV-TRACE-FRONTEND |
| Actual manifestations | _to be filled during execution_ (confirm/correct RS-R7 candidate links for the touched reqs) |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** Rebuild Version from v0.1.4: missing fallback, header combo, collaborators, status controls, switchboard, create-sequence, structure summary + **branded launch panel (D-5 → Option B, no builder visual)**, resources, crew. **No src/builder/** imports (§13).**
- **Out:** Builder internals in route components.

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- Workspace usable (not placeholder); status transitions; missing-version fallback; launch builder works; no builder import (grep).

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
Route /version/:id 1440+390; seed version w/ files/team; switch versions, change status, inspect resources/crew, launch builder; check missing-version fallback. Evidence → `output/evidence/HV-2-version/`. Full route/viewport/seed/steps/expected: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §HV-2.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Responsiveness (REQ-RESP-001, added 2026-06-30) — MANDATORY for this page
Version page must be **fully responsive including mobile and tablet** (unlike the desktop-only Builder).
Build from v0.1.4 with responsive breakpoints/stacking. **PO Web Check viewports MUST include mobile
(≈375×812) and tablet (≈768×1024)** plus desktop — usable (switch versions, change status, launch builder,
missing-version fallback) at all three. **SK-1 skeletons for Version must be re-aligned to the final
responsive layout built here** (skeleton matches final geometry per breakpoint — REQ-LOAD-SKEL-001).

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
