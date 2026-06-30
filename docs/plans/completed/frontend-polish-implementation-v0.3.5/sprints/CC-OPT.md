## CC-OPT — Opportunistic file-size cleanup
Status: Closed — NOT TRIGGERED (opportunistic-only sprint: runs only when another sprint touches an over-target file; no such trigger fired during the plan). CC-1 already brought the one hard-cap file (useEditorState 375→168) under target. Descoped to the custom-task backlog at plan close (PO, 2026-07-01). Not a deliverable; never had an acceptance set or `output/` entry.
Order: 99 | Family: `change-component` | Executor: any with dcx-frontend-refactor | Required skill: dcx-frontend-refactor | Required tool: inherits the owning sprint's tools

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | FP-R3 file-size governance (linked to the owning sprint's REQ families) |
| Scope/type | frontend / refactoring (governance) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CC-OPT (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); Over-target files split only when already touched by another sprint; no standalone broad cleanup |
| Expected manifestation categories | inherits owning sprint EMC |
| Actual manifestations | _to be filled during execution_ (confirm/correct RS-R7 candidate links for the touched reqs) |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** Split an over-target file ONLY when the owning sprint is already editing it; boundary-respecting per FP-R3.
- **In — opportunistic polish (PO 2026-06-30):** when a sprint already touches the relevant card files,
  harmonize **(a) task-card font tokens** (currently a mix of `text-dcx-3xs / 2xs / 2xs-plus / xs-plus` —
  tighten to a consistent scale) and **(b) action-card spacing rhythm** (collapsed/expanded), keeping
  consistency across Phase/Action/Task. No dedicated sprint (PO chose fold-into-CC-OPT); impeccable optional
  if G-IMPECCABLE is cleared.
- **Out:** Standalone broad cleanup.

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- Before/after line counts recorded; new extracted manifestations linked/exempted.

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
None unless the owning sprint has one; evidence under the owning sprint's folder. Evidence → `output/evidence/the owning sprint folder/`. Full route/viewport/seed/steps/expected: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CC-OPT.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
