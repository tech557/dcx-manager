## WM-5 — Focus / selection / keyboard / readiness wiring
Status: Completed (2026-06-30; header reconciled 2026-07-01 at plan close) — output `output/WM-5-focus-selection-keyboard-readiness.md`; review ✅ PASS (`output-review/2026-06-30-claude-WM-5-review.md`); gates green (test 85). Header was stale `Drafted`.
Order: 14 | Family: `wire-mockup-data` | Executor: Claude/opencode | Required skill: — | Required tool: Playwright/Preview (REAL pointer)

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-FCS-001, REQ-FCS-002, REQ-FP-D02, REQ-FP-CMA-001, REQ-FP-CMA-003, REQ-RDY-001, REQ-RDY-003, REQ-SBC-DES-001, REQ-KEY-001, REQ-KEY-002, REQ-KEY-003, REQ-KEY-004, REQ-KEY-005, REQ-KEY-006, REQ-KEY-007, REQ-UP-005, REQ-UP-006, REQ-UP-012, REQ-PRESENT-001 |
| Scope/type | frontend / interaction + state |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §WM-5 (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); Focus highlight/spotlight; selection actions; keyboard shortcuts guarded in inputs; readiness rollup; auto-centre |
| Expected manifestation categories | EMC-SBC-SEED, EMC-UP-SEED, EMC-GOV-TRACE-TESTQA |
| Actual manifestations | _to be filled during execution_ (confirm/correct RS-R7 candidate links for the touched reqs) |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** Focus = highlight/spotlight default (isolation opt-in only); selection count/type/PRESENT; Ctrl+A/C/V/Delete/Escape/Ctrl+S; readiness compute/rollup; auto-centre. Correct generic-Select/Input keyboard RS-R7 links.
- **In — FIX presentation/focus drill-in (`REQ-PRESENT-001`, PO 2026-06-30):** focusing/presenting an object
  must **expand the object's DESCENDANT subtree** (children + grandchildren) and **centre** it — NOT the
  current behavior (`StageProvider.enterPresentationMode` line ~57 + `useStageExpansion` expand only
  ANCESTORS and collapse the subtree, which is the PO-observed "weird behavior"). Keep minimal: expand
  descendants + centre; do not add ancestor/unrelated-collapse complexity.
- **Out:** Card visual redesign.

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- Focus highlights matches while non-matches stay visible; shortcuts guard text inputs; readiness updates.

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
Route /builder; apply focus filters, use Ctrl+A/C/V/Delete/Escape/Ctrl+S, inspect readiness; expect default focus = highlight not hide. **Present/focus drill-in:** select a phase (then an action) and present/focus it → its **descendants expand** (phase→actions→tasks) and it **centres**; confirm it does NOT collapse the subtree (the prior bug). Evidence → `output/evidence/WM-5-focus-selection/`. Full detail: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §WM-5.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
