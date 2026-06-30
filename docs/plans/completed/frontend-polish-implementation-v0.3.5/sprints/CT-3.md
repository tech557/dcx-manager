## CT-3 — Responsive layout: fluid dimension tokens + builder viewport scaling (14″→85″)
Status: Completed
Order: 3.5 (runs after CT-2; before SK-1 so skeletons match the responsive geometry) | Family: `change-token` + `change-component` | Executor: Claude/opencode | Required skill: dcx-frontend-refactor | Required tool: Playwright/Preview (MULTI-viewport)

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` + `bash scripts/agent/verify-tooling-state.sh`; log results.
2. Stop on version mismatch (`§26`) or a needed gate blocked without fallback.
3. Read plan README **Carry-forward contract** + CT-2 output (`output/CT-2-structural-tokens.md`) — CT-3 builds on its `--dim-*` tokens. Obey REUSE-don't-RECREATE.
4. Confirm Playwright/Preview multi-viewport access (this sprint needs it); else §28 fallback / §29a handoff.

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-RESP-001 (primary), REQ-FP-D12, REQ-FP-D01, REQ-STG-001, REQ-STG-003, REQ-SBC-003 |
| Scope/type | frontend / ui-presentation (responsive sizing) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `REQ-RESP-001` (PO 2026-06-30); CT-2 `--dim-*` tokens; reconciles `core.md §10`/`§21` (structure & density preserved) |
| Expected manifestation categories | EMC-STG-SEED, EMC-SBC-SEED, EMC-IFX-SEED |
| Actual manifestations | _to be filled during execution_ |
| Gate result | _pending execution — must be filled before close_ |

### Decisions reconciliation (do not contradict)
- **§10 (frozen layout):** keep the three-row structure + island roles **unchanged**. CT-3 changes only
  *sizing*, never structure/strategy. No row added/moved.
- **§21 (density):** at the small end (14″ ≈ 1280–1512px) the ≤260px repeating-column cap and card-fit
  math **still hold** — verify cards still fit (no regression). Scaling **up** to 85″/4K is additive.
- **Builder = desktop-and-bigger only** (NOT mobile/tablet). Home/Version mobile/tablet is owned by HV-1/HV-2.

### Scope
- **In:** Convert CT-2's fixed `--dim-*` tokens (and related builder spacing/typography) to **fluid values**
  (`clamp()` / min–max / rem / %) so the builder scales smoothly from ~1280px to ~3840px: stage/canvas,
  column gaps, island sizing, font scale (via `text-dcx-*` + clamp where appropriate). Preserve the 3-row
  grid and the ≤260px expanded-column discipline at the floor.
- **Out:** Mobile/tablet builder support (excluded by REQ-RESP-001); Home/Version responsiveness (HV-1/HV-2);
  layout-structure changes (§10); brand color tokens (CT-1); new features.

### Acceptance (graph-state transitions)
- Confirm/correct/reject RS-R7 candidate links for touched reqs.
- Cover expected `EMC-*` → `delivery: implemented`; bind evidence → `verified`.
- Builder renders correctly and **scales fluidly** at 1280, 1512, 2560, and 3840px with the 3-row structure
  intact, no horizontal-scroll "wall", and the ≤260px column discipline honored at the floor (§21).

### PO Web Check (REAL pointer; MULTI-viewport)
Route `/builder/v-1` at **1280×800, 1512×982 (14″ MBP), 2560×1440, 3840×2160 (≈85″ 4K)**. Expect: fluid
scaling, no broken/overlapping layout, phase columns readable and capped ≤260px at the floor, 3-row
structure unchanged, 8-phase density fits without a scroll wall. Evidence → `output/evidence/CT-3-responsive/`.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC; before/after candidate-link + unlinked counts; `req:completion-gate -- --changed <files>` + `req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test -- <pattern>` (or log none) · **multi-viewport browser proof (real pointer)** · `req:validate` · `req:completion-gate`.
- **§28 fallback:** Preview/Playwright MCP unavailable → `npm run dev` + Playwright CLI / dev-smoke; mark MCP gate `BLOCKED` (never PASS); §29a handoff for browser gates Codex cannot run.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC, debt before/after, gate results, evidence). `core.md §27`.
