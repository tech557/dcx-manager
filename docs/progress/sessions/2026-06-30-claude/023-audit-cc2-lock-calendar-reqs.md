---
log: 023-audit-cc2-lock-calendar-reqs
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: mixed
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
---

# 023 — Audit CC-2 implementation; lock 2 calendar-view requirements

## Type: mixed (audit-review + governed mutation / PO requirement lock)
PO: audit CC-2 output; lock two calendar-view requirements (week + monthly).

## CC-2 implementation audit: ✅ PASS
Full review: `output-review/2026-06-30-claude-CC-2-implementation-review.md`. Verified in code:
- 80%/10% height model via `--dim-card-height-pct: 80%` + PhaseCard `justify-center` + inner `h-[80%]`
  (no JS); DayGridCard weekly/collapsed on the token; WeeklyView gives the h-full chain.
- Task card merged to one component; Action `max-w` removed; TaskBentoGrid nested-scroll removed.
- Scope discipline held (fades→OA-1, skeleton state→SK-1b, stage→CC-6/WM-6).
- Gates green (typecheck/lint/test 82/architecture/req:validate/completion-gate).
- **Notes:** recurring evidence gap — `output/evidence/CC-2-card-responsive/` empty (screenshots not saved;
  single-viewport smoke only); monthly day card still `h-[140px]` (will be redefined by the new monthly req).

## Two calendar requirements LOCKED (governed, PO-signed 2026-06-30)
Proposed + applied (`req:propose` → `req:apply-after-signoff`; ledger LDG-2026-06-30-create-node-*;
`req:validate` PASS 0 errors):
- **`REQ-CAL-WEEK-001`** — Weekly view: stage fits **5 expanded weekday + 2 collapsed weekend** day cards,
  no horizontal scroll across the desktop range; unified 80%/10% height; replaces phase columns (REQ-STG-001).
- **`REQ-CAL-MONTH-001`** — Monthly view: **NO vertical scroll**; all days in one compact 7-col grid (refer
  v0.1.4 `MonthlyView.tsx`); compact day cards; **task expanded-state DISABLED** (small cards only);
  **long-click small task → Task Editor**; opening the editor must NOT push day cards off-screen — the grid
  **shrinks further** to stay visible. (Current `MonthlyView` uses `overflow-y-auto` — to be replaced.)

Grounding verified: current `src/builder/stage/views/MonthlyView.tsx` line 52 `overflow-y-auto` (vertical
scroll) — the monthly req drives a real change; v0.1.4 monthly reference confirmed present.

## Wired into the plan
- **WM-6** (timeline/calendar owner): added both REQ IDs to its trace; added a "LOCKED calendar layouts"
  scope block + PO Web Check steps for week (5+2) and monthly (no v-scroll, small tasks, long-click editor
  shrinks grid).

## Gates
Audit + governed graph. `req:validate` PASS (0 errors). **0 `src/` writes by me.**

## Next
- Fix the screenshot-evidence pattern (real multi-viewport PNGs).
- WM-6 now carries the locked week/monthly layouts; implement when the sprint runs (per order).
