## CC-5 — Motion + interaction feedback (reduced motion)
Status: Completed (2026-06-30, Claude/claude-sonnet-4-6) — output `output/CC-5-reduced-motion.md`; gates green (test 85); browser smoke ✅ clean port 3000.
Order: 9 | Family: `change-component` | Executor: Claude/opencode | Required skill: dcx-frontend-refactor | Required tool: Playwright/Preview (reduced-motion emulation: preview_resize colorScheme / emulateMedia prefers-reduced-motion)

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-FP-D06, REQ-IFX-001, REQ-DZ-001, REQ-LOAD-SKEL-001 |
| Scope/type | frontend / ui-presentation (motion) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CC-5 (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); Every effect has a ≤100ms/instant reduced-motion branch; reusable drop feedback; skeleton shimmer respects reduced motion |
| Expected manifestation categories | EMC-IFX-SEED, EMC-DZ-SEED |
| Actual manifestations | _to be filled during execution_ (confirm/correct RS-R7 candidate links for the touched reqs) |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** Reduced-motion branches across effects.registry.ts, island expand/collapse, card feedback, drop previews, skeleton shimmer; reusable valid/invalid drop feedback.
- **Out:** Drag data movement (WM-2); new animations.

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- Every spring/transition has reduced branch; useReducedMotion selects them; feedback still clear.

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
Route /builder, reduced-motion emulation; drag/expand/select/create; expect instant/≤100ms fade, clear feedback. Evidence → `output/evidence/CC-5-reduced-motion/`. Full route/viewport/seed/steps/expected: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CC-5.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
