## WM-4 — Card interactions + card/subtask copy-paste
Status: Completed (2026-06-30; header reconciled 2026-07-01 at plan close) — output `output/WM-4-card-interactions-copy-paste.md`; review ✅ PASS (`output-review/2026-06-30-claude-WM-4-review.md`); gates green (test 85). Header was stale `Drafted`. Doc debt: retract WM-3 E02 TRC (PO reverted action long-press) → custom-task backlog.
Order: 13 | Family: `wire-mockup-data` | Executor: Claude/opencode | Required skill: — | Required tool: Playwright/Preview (REAL pointer)

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-SBC-001, REQ-SBC-002, REQ-SBC-DUP-001, REQ-SBT-COPY-001, REQ-KEY-002, REQ-KEY-003, REQ-KEY-007, REQ-EVI-001, REQ-FCS-001, REQ-UP-012 |
| Scope/type | frontend / interaction |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §WM-4 (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); Single/double click behaviors; independent states; card copy/paste; subtask copy/paste distinct from card-level |
| Expected manifestation categories | EMC-SBC-SEED, EMC-GOV-TRACE-FRONTEND, EMC-GOV-TRACE-TESTQA |
| Actual manifestations | _to be filled during execution_ (confirm/correct RS-R7 candidate links for the touched reqs) |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** Single-click select + anchored popup; double-click expand/collapse independent of popup; receiving/new-card feedback; card copy/paste; **subtask copy/paste (REQ-SBT-COPY-001) without re-running generation, no blind overwrite**. Reject generic-Select RS-R7 links.
- **Out:** Responsive visual card redesign (CC-2).

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- Click/select/popup/expand coexist; card + subtask copy/paste duplicate without overwrite.

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
Route /builder; click/double-click Task/Action/Phase; copy/paste cards; copy/paste subtasks between Tasks; expect subtask copy distinct from card copy. Evidence → `output/evidence/WM-4-card-copy/`. Full route/viewport/seed/steps/expected: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §WM-4.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
