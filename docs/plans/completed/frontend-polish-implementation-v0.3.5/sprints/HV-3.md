## HV-3 — Visual fidelity: brand glass foundation + ambient background + Home restyle
Status: Completed (2026-06-30 + PO visual fixes; round-2 audit ✅ PASS all 4 fixes — `046-hv3-round2-audit`; output `output/HV-3-home-glass.md`; gates green test 85, browser proof 1440/768/375; header reconciled 2026-07-01). Header was stale `Drafted`. Known debt FL-HV3-01 (MAN filename typo) / FL-HV3-02 (tablet stack) → custom-task backlog.
Order: 18 | Family: `change-token + change-component` | Executor: Claude/opencode | Required skill: dcx-frontend-refactor + impeccable (`src/brand/` ONLY) | Required tool: Playwright/Preview (REAL pointer; mouse-light + glass are pointer-driven)

> Source of detail: `output-review/2026-06-30-claude-HV-1-HV-2-visual-fidelity-sprint.md` (gap map §5,
> token additions §6 Phase A, per-component plan §6 Phase C). This sprint file is the executable wrapper;
> read the review doc first — it carries the exact values and class strings.

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting, blocked gates, code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or a required gate is blocked without a fallback.
3. Read the review doc above AND the HV-1 output (`output/HV-1-home.md`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm Playwright/Preview access; else §28 fallback or `§29a` handoff for browser proof.
5. **Run `/impeccable init`** before any `src/brand/` edit. impeccable may edit `src/brand/` ONLY; all `src/pages/**` edits are hand-authored Tailwind/token swaps (no impeccable outside brand).

### Requirement Trace (`core.md §35a`)
| Field | Value |
|---|---|
| Graph IDs | REQ-HOME-LAYOUT, REQ-HOME-SHELL, REQ-HOME-BRAND, REQ-HOME-VERSION-LIST, REQ-HOME-SEARCH, REQ-HOME-FILTER, REQ-HOME-ANALYTICS, REQ-HOME-LOGS, REQ-RESP-001, REQ-LOAD-SKEL-001 |
| Scope/type | frontend / **ui-presentation only** (styling refactor; no logic/wiring/tree change) |
| States | delivery `implemented` (function) → **target** visual parity with v0.1.4; presentation manifestations refreshed |
| Source/lock | `output-review/2026-06-30-claude-HV-1-HV-2-visual-fidelity-sprint.md`; v0.1.4 `docs/archive/dcx-manager-v0.1.4/src/{components/Background.tsx,components/ui/GlassCard.tsx,pages/home/*}` |
| Expected manifestation categories | EMC-UP-SEED (presentation) |
| Actual manifestations | _to fill during execution_ |
| Gate result | _pending execution_ |

### Scope
- **In — Phase A (brand foundation, `src/brand/` only):**
  - **Fix the token bug**: define `--theme-surface-raised`, `--theme-surface-raised-hover`, `--theme-border` (light+dark) — they are referenced 63× across HV pages but undefined (transparent fills + currentColor borders). Alias to existing tokens (review §2/§6-A-1).
  - Add elevation presets (`--shadow-card/-island/-overlay`, `--glow-accent`), glass page classes (`.glass-panel/.glass-card/.glass-field/.btn-brand/.status-badge`), a `.mouse-glow` util, status token set (`--status-*`), blur/duration vars (review §6 Phase A).
- **In — Phase B (ambient background):** render the builder mouse-light (`src/ui/BuilderBg/BuilderBg.tsx`; optionally re-export as `src/ui/AmbientBackground`) on Home; container `relative overflow-hidden`, content `z-10`, `app-shell` gradient as base. **`src/ui` import only — NOT `src/builder` (§13).**
- **In — Phase C (Home restyle, `src/pages/home/*`):** apply glass+tokens+motion to HomeDashboard, HomeHeroBar, HomeSearchFilters, HomeSavedViews, **HomeVersionCard** (glass-glow + mouse-follow radial + status badge + chevron/avatar motion), HomeAnalyticsPanel, HomeActivityPanel, CreateVersionDialog (review §6 Phase C). Framer enter/stagger via `motion/react` (existing dep).
- **Out:** Version page (HV-4); any component add/remove/rename; any prop/handler/query/store/router change; new requirements.

### Acceptance
- `git diff` shows **only** className / token / CSS / `motion/react` wrapper changes — no logic, props, queries, store, or router edits; no component tree change.
- Home visually matches v0.1.4 language (glass surfaces, depth, accent glow, mouse-light bg, status system, hero scale) at desktop/tablet/mobile.
- The undefined-token bug is gone (cards/inputs/panels render real surfaces + borders app-wide).
- No `src/builder/**` import in `src/pages/**` or `src/ui/app-shell/**` (grep gate).

### PO Web Check (REAL pointer)
Route `/` at **1440×900, 768×1024, 375×812**: confirm mouse-light bg tracks pointer; version cards are
glass with hover accent glow + mouse-follow highlight; status badges tinted (Ready pulses); hero scaled +
accent first word; search/filter/saved-views/analytics/activity are glass; create dialog is a glass modal.
Before/after screenshots → `output/evidence/HV-3-home/`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test` (+ "no targeted test" note if none) · **browser/visual proof at 3 viewports** · `req:validate` (no graph change expected) · `req:completion-gate -- --changed <files>`.
- **§28 fallback** if Playwright/Preview unavailable → `npm run dev` + Playwright CLI / dev-smoke; mark visual gate **BLOCKED — <tool>** (never PASS) + follow-up.

### Responsiveness (REQ-RESP-001) — MANDATORY
Home stays fully responsive (mobile + tablet + desktop). Re-align SK-1 Home skeletons to the new glass
geometry per breakpoint (REQ-LOAD-SKEL-001).

### Final step
Update plan README carry-forward (files touched, manifestations refreshed, gate results, evidence path) — `core.md §27`. Hand the reusable brand foundation to HV-4.
