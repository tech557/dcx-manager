## OA-1 — Overflow / spatial-awareness signals (gradient fades)
Status: Completed
Order: 6.5 (after CC-2 cards exist; coordinate stage-level part with CC-6/WM-6) | Family: `change-component` | Executor: Claude/opencode | Required skill: dcx-frontend-refactor | Required tool: Playwright/Preview
Origin: spun out of the CC-2 design checkpoint (PO 2026-06-30, decision #1). Implements the "never add mental work on top of real work" principle (decision #3: folded into existing reqs, no new node).

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` + `bash scripts/agent/verify-tooling-state.sh`; log results.
2. Stop on version mismatch (`§26`) or a needed gate blocked without fallback.
3. Read plan README **Carry-forward contract** + CC-2 output (cards must exist first). Obey REUSE-don't-RECREATE.
4. Confirm Playwright/Preview access; else §28 fallback / §29a handoff.

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-FP-CMA-003 (auto-centre/spatial awareness — primary), REQ-RDY-001 ("no hidden state" family), REQ-IFX-001, REQ-STG-001 |
| Scope/type | frontend / ui-presentation (spatial-overflow awareness) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | CC-2 design checkpoint §2/§3/§P (`output/CC-2-design-checkpoint.md`); PO 2026-06-30. **`REQ-COG-AWARE-001` is NOT a new node** — folded here as an extension/cross-link of REQ-FP-CMA-003 + the readiness "no hidden state" family (PO decision #3). |
| Expected manifestation categories | EMC-STG-SEED, EMC-SBC-SEED, EMC-IFX-SEED |
| Actual manifestations | _to be filled during execution_ |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** **gradient-fade only** (PO decision #4 — no arrow buttons in cards) overflow signals so no card is
  clipped without a cue:
  - **phase → action** (vertical): top/bottom fade on the PhaseCard expanded action list, toggled by scroll position.
  - **action → task** (horizontal): left/right fade on `HorizontalTaskFlow`'s task row.
  - new shared **`src/hooks/useScrollEdge.ts`** (≤30 lines) driving both; reduced-motion safe (no shimmer).
- **Out:** Arrow buttons / magnetic snap and **stage → phase** (KanbanView) horizontal awareness → **CC-6/WM-6**
  (stage-owned). No new requirement node (decision #3). No skeleton work (SK-1 follow-up). No card-height
  changes (CC-2 owns the 80%/10% model).

### Acceptance (graph-state transitions)
- Confirm/correct/reject RS-R7 candidate links for the touched reqs.
- Cover expected `EMC-*` → `delivery: implemented`; bind evidence → `verified`.
- A scrollable action list / task row shows a fade cue when content overflows and **no** cue at the boundaries; no half-clipped card with no signal.

### PO Web Check (REAL pointer; gradient-fade only)
Route `/builder/v-1`: expand a phase with many actions (vertical fade appears/clears at top/bottom); a
collapsed action with many tasks (horizontal fade appears/clears left/right). Reduced-motion: fades static,
no shimmer. Evidence → `output/evidence/OA-1-overflow-awareness/`.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC; before/after candidate-link + unlinked counts; `req:completion-gate -- --changed <files>` + `req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test -- <pattern>` (or log none) · **browser proof (real pointer)** incl. reduced-motion · `req:validate` · `req:completion-gate`.
- **§28 fallback:** MCP unavailable → `npm run dev` + Playwright CLI / dev-smoke; mark MCP gate `BLOCKED` (never PASS); §29a handoff.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC, debt before/after, gate results, evidence). `core.md §27`.
