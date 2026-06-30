## CC-2 — Responsive shared card components (design checkpoint)
Status: Completed
Order: 6 | Family: `change-component` | Executor: Claude/opencode | Required skill: dcx-frontend-refactor + design-exploration + PO sign-off | Required tool: Playwright/Preview

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-SBC-003, REQ-SBC-004, REQ-SBC-005, REQ-FP-D01, REQ-FP-D11, REQ-FP-D12, REQ-RESP-001 |
| Scope/type | frontend / ui-presentation + interaction |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CC-2 (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); One responsive Task card; non-truncating Action card; Phase states; token-driven spacing |
| Expected manifestation categories | EMC-SBC-SEED, EMC-STG-SEED |
| Actual manifestations | _to be filled during execution_ (confirm/correct RS-R7 candidate links for the touched reqs) |
| Gate result | _pending execution — must be filled before close_ |

### PO decisions resolved (2026-06-30) — design checkpoint closed
The CC-2 design checkpoint (`output/CC-2-design-checkpoint.md`) is **resolved by PO 2026-06-30**:
1. **Scope tightened** — CC-2 = responsive cards + the unified card-height model ONLY. Overflow-awareness
   (gradient fades) is **spun out to a new sprint `OA-1`**; skeleton state/tiered work is **deferred to a
   SK-1 follow-up** (SK-1 already shipped) — both removed from CC-2.
2. **Unified card-height model (NEW PO rule):** both **PhaseCard and DayGridCard** render at **~80% of the
   available stage height, centered with ~10% top + ~10% bottom margin** (replaces phase `h-full` and day
   fixed `h-[480px]`/`h-[140px]`). Rationale: island popups float over the stage; the 10% margins let popups
   overlap the *margin* zone instead of hiding card content (they may still overlap, but far less content is
   hidden). Responsive (80% of fluid stage height); preserves §10 structure + §21 density.
3. `REQ-COG-AWARE-001` is **folded into existing reqs** (REQ-FP-CMA-003 + readiness family) — no new node.
4. Overflow signal style (in OA-1) = **gradient fade only**, no arrow buttons in cards.

### Scope
- **In:** one **responsive Task card** (single component, resizes collapsed↔expanded, token-driven
  spacing/font); **non-truncating Action card** (remove `max-w-[200px]`); **Phase collapsed/expanded** states;
  the **unified 80%-height + 10%-margin model** for PhaseCard **and** DayGridCard (decision #2 above). Consume
  CT-2/CT-3 tokens; add a token for the height ratio/margins so it stays responsive.
- **Out:** Overflow-awareness gradient fades (→ **OA-1**); skeleton `state`/tiered loading (→ SK-1 follow-up);
  `useScrollEdge` hook (→ OA-1); drag/drop logic (WM-2); copy/paste (WM-4).

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- Single card resizes collapsed→expanded; name/channel/status visible; no clipping.
- **Phase AND day cards render at ~80% stage height, centered with ~10% top/bottom margin** (decision #2);
  verify an island popup overlapping a card now covers mostly the margin, not content.

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
Route `/builder/v-1` (Kanban) + Timeline view, at 1280/1512/2560; inspect collapsed/expanded cards (no
truncation), and confirm **both phase and day cards sit at ~80% height with ~10% margins** and that an open
island popup overlaps the margin zone (content stays visible). Evidence → `output/evidence/CC-2-card-responsive/`.
Full detail: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §CC-2.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
