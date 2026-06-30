## CC-4 — Readiness accessibility
Status: Completed (2026-06-30, Claude/claude-opus-4-8) — output `output/CC-4-readiness-a11y.md`; gates green (test 85); real browser a11y proof (clean port 3000); reviewed (opus 4.8). [Header label corrected 2026-06-30 — was stale `Drafted`.]
Order: 8 | Family: `change-component` | Executor: Claude/opencode | Required skill: dcx-frontend-refactor | Required tool: Playwright/Preview + a11y (axe CLI or aria/role assertions)

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-RDY-001, REQ-FP-D11 |
| Scope/type | frontend / ui-presentation (a11y) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CC-4 (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); Collapsed Phase readiness via tooltip + aria-label; indicators visible per card type |
| Expected manifestation categories | EMC-SBC-SEED |
| Actual manifestations | _to be filled during execution_ (confirm/correct RS-R7 candidate links for the touched reqs) |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** Tooltip + aria-label for collapsed-Phase readiness; visible readiness indicators where component-only.
- **Out:** Readiness computation (WM-5).

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- Collapsed phase exposes readiness to hover + screen reader; columns stay compact.

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
Route /builder 1440; collapse a Phase; hover/focus readiness marker; expect tooltip + SR (aria-label) text. Evidence → `output/evidence/CC-4-readiness-a11y/`. Full route/viewport/seed/steps/expected: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CC-4.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
