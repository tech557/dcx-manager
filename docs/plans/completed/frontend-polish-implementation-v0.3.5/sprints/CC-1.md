## CC-1 — Editor state hard-cap split
Status: Completed
Order: 5 | Family: `change-component` | Executor: any with dcx-frontend-refactor (Codex OK — no browser) | Required skill: dcx-frontend-refactor | Required tool: none (smoke via browser-capable agent / §29a)

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-EVI-001, REQ-UP-011, REQ-UP-012 (governance: FP-R3 file-size cap, RSP/GOV process work) |
| Scope/type | frontend / refactoring (file-size governance) supporting REQ-EVI-001 |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CC-1 (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); useEditorState.ts ≤ cap; public facade unchanged; no behavior change |
| Expected manifestation categories | EMC-EVI-SEED, EMC-UP-SEED, EMC-GOV-TRACE-TESTQA |
| Actual manifestations | _to be filled during execution_ (confirm/correct RS-R7 candidate links for the touched reqs) |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** Split useEditorState.ts internally under EditorViewerIsland/; keep public useEditorState() facade; do not revive deleted hook names.
- **Out:** Behavior changes; promoting to src/ui.

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- File over-hard-cap count 1 → 0; editor still opens (smoke).

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
Smoke only: open Builder/editor still works (browser-capable executor or §29a handoff). Evidence → `output/evidence/CC-1-editor-split/`. Full route/viewport/seed/steps/expected: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CC-1.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
