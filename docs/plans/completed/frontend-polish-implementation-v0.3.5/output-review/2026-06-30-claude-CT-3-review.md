---
review: CT-3 output review + phase/day card height question
sprint: CT-3
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
verdict: PASS (functional) — safe to proceed to SK-1; 2 tracked notes + 1 PO design call
---

# CT-3 — Review + phase/day card height

## Verdict: ✅ PASS (functional) — safe to move to the next sprint (SK-1)
CT-3 converted the 6 `--dim-*` tokens to `clamp()` fluid values; gates green (typecheck/lint/test 82/
architecture/req:validate/completion-gate); computed-value evidence at 1280/1512/2560 confirms fluid
scaling; 3-row structure preserved; also flipped the stale CT-2/SK-1 status labels. No component changes
needed (CT-2 already pointed components at `var(--dim-*)`).

## Two tracked notes (neither blocks SK-1)
1. **§21 cap interpretation — needs ratification.** `--dim-phase-expanded` = `clamp(220px, 18.06vw, 340px)`:
   231px at the 1280 floor (≤260 ✓), but **grows to 340px above ~1440px**. `core.md §21` literally says
   "Maximum is w-[260px] for expanded card columns." CT-3 reads that as a **1440-density floor**, not an
   absolute cap, and stays under §21's hard "≥360px = forbidden" line (340 < 360). This is the correct
   spirit of responsiveness (abundant space on big screens), but **§21's wording should be updated** to
   "≤260px at the 1440 density floor; may scale up to <360px on larger viewports" so no future agent reads
   a contradiction. **PO/governance ratification** — not a safety blocker.
2. **Screenshot evidence gap (§32).** Output cites `output/evidence/CT-3-responsive/` screenshots, but that
   folder **does not exist** — only computed-value text evidence was saved. Computed values are sufficient
   to verify the *tokens*, but the claimed PNGs are missing and 3840px wasn't evidenced (cap proven at
   2560). Capture the multi-viewport screenshots, or correct the claim. Honest-evidence hygiene.

## Your phase-card vs day-card height question (PO design call)
**Facts (current code):**
- **Phase card = `h-full`** (fills the Kanban column; KanbanView column is also `h-full`) → always max stage
  height, internal scroll for tasks. This is the standard Kanban "equal-height columns" pattern.
- **Day card = fixed** (`h-[480px]` weekly, `h-[140px]` monthly) → uniform height across the 7-day row.
- Neither is responsive-height (CT-3 didn't touch card heights — out of scope; still fixed px).

**Recommendation: keep them as they are — do NOT unify.** Reasons:
- Kanban and Timeline are **different renderers in one Stage** (`REQ-STG-001`). Equal-height columns is the
  *expected, functional* Kanban convention; fixed-height day cells is the right Timeline-row convention.
  Matching them across two different views adds logic/complexity for no real UX gain — and you said you
  don't want to complicate the view or code.
- `h-full` phase is the **simplest** option (no per-phase content-height calculation; no layout jumping as
  tasks are added). The "sometimes looks weird" is only the *sparse-phase stretched* case.
- If the sparse-phase look bothers you later, the **lowest-complexity** tweak is cosmetic only — content is
  already centered (`justify-between`/`center`); an optional `max-h` cap on very tall phases could be added
  **without** switching to content-height. That's a future micro-polish, not a structural change, and not now.
- **The legacy FP-R4 "day cards same fixed height as phase cards" (T02) goal is over-constraining** given
  they're different renderers — recommend dropping that matching goal.

**Timing:** this is a card-sizing decision; it belongs with **CC-2** (responsive Task card re-engineering),
not SK-1. So it does **not** block the next sprint — decide it before CC-2.

## Go / no-go
**Proceed to SK-1.** CT-3 is functionally complete. Carry forward: (a) ratify §21 wording; (b) capture/fix
CT-3 screenshots; (c) make the phase/day-height call before CC-2 (recommendation above: keep as-is).
