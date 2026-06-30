## CT-1 — Brand light/dark token corrections + app-wide typography (L06)
Status: Completed (2026-06-30, Claude/claude-opus-4-8 — `output/CT-1-theme-tokens.md`; direct brand-contract route)
Order: 2 | Family: `change-token` | Executor: Claude | Required skill: impeccable (brand-only, if G-IMPECCABLE cleared; else direct brand-contract) | Required tool: Playwright/Preview

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-FP-D08, REQ-FP-D05, REQ-UP-009, REQ-IFX-001, REQ-FP-D12, REQ-FP-D01 |
| Scope/type | frontend / ui-presentation (brand tokens) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CT-1 (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); No pure white/black tokens; --theme-text-secondary set; main-blue-on-light safe; app-wide fonts via text-dcx-* |
| Expected manifestation categories | EMC-IFX-SEED, EMC-UP-SEED, EMC-GOV-TRACE-FRONTEND |
| Actual manifestations | `MAN-function-src-brand-styles-tokens`, `MAN-function-src-brand-styles-components` (new, grounded), `MAN-react-component-src-ui-shadcn-button` (L06). New links: `TRC-CT1-REQ-FP-D08-TO-MAN-function-src-brand-styles-tokens`, `TRC-CT1-REQ-FP-D01-TO-MAN-function-src-brand-styles-tokens`, `TRC-CT1-REQ-FP-D08-TO-MAN-function-src-brand-styles-components`, `TRC-CT1-REQ-FP-D01-TO-MAN-function-src-brand-styles-components`. Ledger `LDG-2026-06-30-CT-1-brand-token-trace`. |
| Gate result | ✅ PASS — typecheck/lint/verify.sh/validate:architecture/test(82)/req:folder-index/req:validate(QST-VR-011 pre-existing)/req:completion-gate `--changed` all green; real-pointer Playwright browser proof (§28 fallback). Debt: manifestations-lacking-requirements 2→0; pure-white token surfaces 5→0; arbitrary font sizes 1→0. |

### Scope
- **In:** Fix pure-white/black offenders; add --theme-text-secondary; shadcn light --background; contrast-safe brand-blue; **L06: app-wide font sizes via text-dcx-* tokens, no arbitrary sizes outside src/brand**.
- **G-IMPECCABLE stop-task (first):** check the impeccable quarantine state (root `CLAUDE.md` vs `agent-skills.md`). If unresolved, take the **direct brand-contract route (no impeccable)** and log the chosen mode.
- **Out:** Component behavior; structural sizing (CT-2).

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- No pure-white token surface; brand-blue legible on light; computed font-size token-sourced.

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
Routes /builder + /home + /version; light/dark; expect no pure white, readable blue-on-light, token-sourced fonts. Evidence → `output/evidence/CT-1-theme-tokens/`. Full route/viewport/seed/steps/expected: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CT-1.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
