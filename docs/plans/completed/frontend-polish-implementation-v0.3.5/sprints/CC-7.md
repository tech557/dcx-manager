## CC-7 — Compact action-card density (so ~3 collapsed actions fit a phase)
Status: Completed (2026-06-30, Claude/claude-sonnet-4-6)
Order: 6.6 (after OA-1; cards phase) | Family: `change-component` (+ optional `impeccable` visual-review, G-IMPECCABLE-gated) | Executor: Claude (if impeccable) / Claude-opencode | Required skill: dcx-frontend-refactor | Required tool: Playwright/Preview
Origin: PO observation 2026-06-30 — 3 collapsed action cards do not fit comfortably in a phase; not covered by any existing sprint. Implements `REQ-DENSITY-001` (b).

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` + `bash scripts/agent/verify-tooling-state.sh`; log results.
2. Stop on version mismatch (`§26`) or a needed gate blocked without fallback.
3. Read plan README **Carry-forward contract** + CC-2 output (card model + 80%/10% height) + OA-1 (fades). Obey REUSE-don't-RECREATE.
4. **G-IMPECCABLE gate:** if using `impeccable` for the visual rhythm, the quarantine must be resolved first (root `CLAUDE.md` vs `agent-skills.md`); else implement the compaction directly via `dcx-frontend-refactor` and log the mode. Confirm Playwright/Preview access; else §28 fallback / §29a handoff.

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-DENSITY-001 (primary), REQ-SBC-004 (action card), REQ-SBC-001, REQ-RESP-001 |
| Scope/type | frontend / ui-presentation (compact density) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `REQ-DENSITY-001` (PO 2026-06-30); CC-2 card model; §21 density; §10 structure preserved |
| Expected manifestation categories | EMC-SBC-SEED, EMC-IFX-SEED |
| Actual manifestations | _to be filled during execution_ |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** reduce the **collapsed ActionCard vertical footprint** (header + task-row) so **~3 collapsed action
  cards fit comfortably** in an expanded phase's 80%-height action area, **without breaking the consistent
  spacing / visual rhythm** shared across Phase/Action/Task cards. Tune action header height, the
  HorizontalTaskFlow row height, and the inter-action gap holistically. Optional `impeccable` visual-review
  pass (gated) for a creative, consistent compaction — advisory only; the component change is `dcx-frontend-refactor`.
- **Out:** Task tile redesign (CC-2 done); phase card structure (§10); overflow fades (OA-1 done); brand
  color tokens (CT-1); new features. **No** spacing inconsistency introduced (must stay rhythm-consistent).

### Acceptance (graph-state transitions)
- Confirm/correct/reject RS-R7 candidate links for the touched reqs.
- Cover expected `EMC-*` → `delivery: implemented`; bind evidence → `verified`.
- **~3 collapsed action cards fit comfortably** in an expanded phase at the desktop range, and **~3–4
  collapsed tasks still fit** in an action row (REQ-DENSITY-001 b+c), with no spacing-rhythm regression
  across card types.

### PO Web Check (REAL pointer; visual density)
Route `/builder/v-1`: expand a phase seeded with **≥3 actions, each with 3–4 tasks**; confirm 3 collapsed
actions fit without immediate overflow, the OA-1 fade only appears beyond that, and spacing looks consistent
with Phase/Task cards. Viewports 1280/1512/2560. Evidence → `output/evidence/CC-7-compact-action/`.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC; before/after candidate-link + unlinked counts; `req:completion-gate -- --changed <files>` + `req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test -- <pattern>` (or log none) · **browser/visual proof (real pointer, multi-viewport)** · `req:validate` · `req:completion-gate`.
- **§28 fallback:** MCP unavailable → `npm run dev` + Playwright CLI / dev-smoke; mark MCP gate `BLOCKED` (never PASS); §29a handoff.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC, debt before/after, gate results, evidence). `core.md §27`.
