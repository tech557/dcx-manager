## WM-6 — Stage views / Kanban / Timeline / ViewHelper + day-card create (T06/T07) + scroll (K08)
Status: Completed (2026-06-30 impl + round-2 visual fixes; PO-confirmed at plan close 2026-07-01) — output `output/WM-6-stage-views.md`; round-2 fixes applied (`042-wm6-round2-visual-fixes`) + independently verified ✅ PASS 5/6 (`043-wm6-round2-verification`). Only outstanding item was Fix-2 monthly density (un-screenshottable because `v-1` mock has no tasks in visible weeks; mechanism sound) — **PO confirmed at plan close**. Header was stale `In Progress`.
Order: 15 | Family: `wire-mockup-data` | Executor: Claude/opencode | Required skill: — | Required tool: Playwright/Preview (REAL pointer/drag)

### Step 0 — Session environment + continuity (MANDATORY, first step)
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; **log** repo version, active plans, MCP active/awaiting lists, blocked gates, and code-index staleness.
2. **Stop** if `version_context` ≠ `docs/VERSION.md` (`core.md §26`), or if a gate this sprint needs is blocked without a fallback.
3. Read this plan README's **Carry-forward contract** AND the previous sprint's `output/*.md` (`core.md §27`); obey REUSE-don't-RECREATE (`core.md §7`).
4. Confirm tool access for this sprint's family (see README assignment discipline); if a required browser/visual tool is unavailable, use the §28 fallback below or hand off (`§29a`).

### Requirement Trace (`core.md §35a`, RS-R0b §8 shape)
| Field | Value |
|---|---|
| Graph IDs | REQ-UP-001, REQ-UP-002, REQ-UP-003, REQ-UP-004, REQ-STG-001, REQ-STG-002, REQ-STG-003, REQ-STG-004, REQ-STG-005, REQ-FP-CMA-002, REQ-FP-CMA-003, REQ-FP-CMA-004, REQ-KBI-001, REQ-TPL-001, REQ-FP-D04, REQ-VHB-001, REQ-UP-007, REQ-UP-008, REQ-FP-D03, REQ-BC-007, REQ-BC-008, REQ-BC-009, REQ-BC-010, REQ-CAL-WEEK-001, REQ-CAL-MONTH-001 |
| Scope/type | frontend / interaction + state |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → **target** `implemented` then `verified` |
| Source/lock | `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §WM-6 (+ FP-R5 PATCH); FP-R4 finalize spec (+ PATCH); View default/restore; smart-expand; auto-centre; creator pills; template; Timeline; ViewHelper in timeline; task→day; day-card quick-create (T06/T07); bounded internal scroll (K08) |
| Expected manifestation categories | EMC-STG-SEED, EMC-VHB-SEED, EMC-TPL-SEED, EMC-DZ-SEED, EMC-UP-SEED, EMC-SBC-SEED |
| Actual manifestations | _to be filled during execution_ (confirm/correct RS-R7 candidate links for the touched reqs) |
| Gate result | _pending execution — must be filled before close_ |

### Scope
- **In:** Default/restore view; smart expanded phases; auto-centre; KBI creator pills; Template popup; Timeline; ViewHelper (view-gated); task-to-day; **T06/T07 timeline day-card quick-create + parent selection + minimal data (REQ-BC-007..010)**; **K08 phase-column bounded height + internal scroll + edge/off-stage; 7–8 phases fit (live-confirmed no h-scroll)**. Correct mis-targeted REQ-STG-001 link.
- **In — LOCKED calendar layouts (PO 2026-06-30):**
  - **Week view (`REQ-CAL-WEEK-001`):** stage fits **5 expanded weekday cards (Mon–Fri) + 2 collapsed weekend
    cards (Sat–Sun)**, no horizontal scroll across the desktop range.
  - **Monthly view (`REQ-CAL-MONTH-001`):** **NO vertical scroll** — all month days in one compact 7-col grid
    (refer to v0.1.4 `docs/archive/dcx-manager-v0.1.4/src/pages/builder/timeline/MonthlyView.tsx`); day cards
    compact; **task expanded-state DISABLED** (small cards only); **long-click a small task → Task Editor**;
    opening the editor must **not** push day cards off-screen — the grid **shrinks further** to stay visible.
    (Current `MonthlyView` uses `overflow-y-auto` — replace.)
- **Out:** Low-level drag engine (WM-2).

### Acceptance (graph-state transitions)
- Confirm/correct/reject the RS-R7 candidate links for the touched requirements (review-input, not proof).
- Cover the expected `EMC-*` categories → `delivery: implemented`; bind evidence to `AC-*` → `verified` (implemented ≠ verified).
- State preserved across views; ViewHelper only in Timeline; day-card creates a task; dense columns scroll internally.

### PO Web Check (REAL pointer/drag — not `.click()`; builder cards are pointer/long-press/drag driven)
Route /builder; switch Kanban/Timeline; creator pills; Template popup; ViewHelper in Timeline; **create task from a Timeline day card**; load 8 phases + dense actions and check internal scroll. **Week view:** confirm 5 expanded weekdays + 2 collapsed weekend cards fit with no horizontal scroll (`REQ-CAL-WEEK-001`). **Monthly view:** confirm NO vertical scroll, compact 7-col grid, task cards small (no expanded state), long-click a task opens the editor and the day grid **shrinks** (cards stay on screen, none pushed off) (`REQ-CAL-MONTH-001`). Evidence → `output/evidence/WM-6-stage-views/`. Full detail: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md` §WM-6.

### Requirement Debt Burn-down
Touched REQ/EMC/MAN/TRC for this area; record **before/after** candidate-link + unlinked-manifestation counts for the touched scope; `npm run req:completion-gate -- --changed <files>` + `npm run req:validate`.

### Gates
`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · **test:** `npm run test -- <pattern>` when a matching test exists, else `npm run test` + log "no targeted test exists" with code-query evidence · **browser/visual proof** where user-visible (real pointer/drag) · `req:validate` · `req:completion-gate`.
- **§28 fallback (tool-dependent gates):** if Playwright/Preview MCP is unavailable → run `npm run dev` + Playwright CLI, or a dev-smoke (HTTP 200 + console) check; mark the MCP/visual gate **`BLOCKED — <tool> unavailable`** (never PASS), record fallback evidence + a follow-up. Codex must use a `§29a` handoff to a browser-capable agent for browser gates it cannot run.

### Final step
Update plan README carry-forward (files touched, REQ/EMC/MAN/TRC touched, debt before/after, gate results, evidence path) — `core.md §27`.
