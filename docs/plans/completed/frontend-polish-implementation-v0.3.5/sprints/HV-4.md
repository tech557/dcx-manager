## HV-4 — Visual fidelity: Version page restyle + motion polish
Status: Completed (2026-06-30; header reconciled 2026-07-01 at plan close) — output `output/HV-4-version-glass.md`; gates green (test 85), §13 grep clean, 3-viewport browser proof (1440/768/375). Header was stale `Drafted`.
Order: 19 | Family: `change-component` | Executor: Claude/opencode | Required skill: dcx-frontend-refactor (impeccable only if extending `src/brand/`) | Required tool: Playwright/Preview (REAL pointer)
Depends on: **HV-3** (consumes its brand glass foundation + ambient background + status tokens).

> Source of detail: `output-review/2026-06-30-claude-HV-1-HV-2-visual-fidelity-sprint.md` (gap map §5,
> per-component plan §6 Phase D). Read it first.

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. `bash scripts/agent/build-current-state.sh` + `verify-tooling-state.sh`; log version, plans, MCPs, blocked gates, staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`§26`) or a needed gate is blocked w/o fallback.
3. **Confirm HV-3 is merged** (brand foundation + ambient bg + status tokens exist). If not, stop — HV-4 depends on it. Read HV-2 output (`output/HV-2-version.md`) + the review doc; obey REUSE-don't-RECREATE (`§7`).
4. Confirm Playwright/Preview; else §28 fallback / §29a handoff.

### Requirement Trace (`core.md §35a`)
| Field | Value |
|---|---|
| Graph IDs | REQ-VER-LAYOUT, REQ-VER-HEADER, REQ-VER-COLLAB-DISPLAY, REQ-VER-LAUNCH, REQ-VER-DOCS, REQ-VER-STRUCTURE-SUMMARY, REQ-VER-SWITCHBOARD, REQ-RESP-001, REQ-LOAD-SKEL-001 |
| Scope/type | frontend / **ui-presentation only** (styling refactor; no logic/wiring/tree change) |
| States | delivery `implemented` (function) → **target** visual parity with v0.1.4 |
| Source/lock | review doc above; v0.1.4 `docs/archive/dcx-manager-v0.1.4/src/pages/version/*` |
| Expected manifestation categories | EMC-UP-SEED (presentation) |
| Actual manifestations | _to fill during execution_ |
| Gate result | _pending execution_ |

### Scope
- **In (`src/pages/version/*`):** apply HV-3 glass foundation + ambient bg to VersionWorkspace shell;
  restyle VersionHeader (breadcrumb micro-labels, accent title, collaborator stack), VersionStatusControls
  (status tokens + active glow), VersionSwitchboard (glass items, active accent state, status flags),
  VersionSummaryPanel / VersionStructureSummary (glass count cards + glass hover popups),
  VersionResourcesPanel (FileTag-style glass tags + hover lift), VersionCrewPanel, and **VersionBuilderPanel**
  — the branded launch ("more than a button" per HV-2 D-5: glow ring + blur + hover scale). Framer
  enter/hover via `motion/react`. Re-align SK-1 Version skeletons (REQ-LOAD-SKEL-001).
- **Out:** Home (HV-3); any component add/remove/rename or prop/logic/query/store/router change; new requirements; `src/builder/**` import (§13 — structure summary stays data-only via `useBuilderTreeQuery`/`builder.service.ts`, already wired in HV-2).

### Acceptance
- `git diff` shows only className/token/CSS/`motion/react` wrapper changes — no logic/tree change.
- Version page matches v0.1.4 language (glass header/panels/switchboard, branded launch, status system, motion) at 3 viewports; missing-version fallback also styled.
- No `src/builder/**` import in `src/pages/version/**` (grep gate).

### PO Web Check (REAL pointer)
Route `/version/:id` at **1440×900, 768×1024, 375×812**: ambient bg tracks pointer; header/status/switchboard/
summary/resources/crew are glass with depth; switching versions keeps the active accent state; the launch
panel reads as a branded CTA; structure-summary hover popups are glass; missing-version fallback is styled.
Before/after screenshots → `output/evidence/HV-4-version/`.

### Gates
`typecheck` · `lint` · `validate:architecture` · `test` · **browser/visual proof at 3 viewports** · `req:validate` · `req:completion-gate -- --changed <files>`. §28 fallback as in HV-3.

### Responsiveness (REQ-RESP-001) — MANDATORY
Version page fully responsive (mobile + tablet + desktop); skeletons re-aligned per breakpoint.

### Final step
Update plan README carry-forward (files, manifestations, gates, evidence) — `core.md §27`.
