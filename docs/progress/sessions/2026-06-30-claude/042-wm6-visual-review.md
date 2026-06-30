---
log: 042-wm6-visual-review
session: 2026-06-30-claude
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: audit-review
PO-Action: pending
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: WM-6
---

# 042 — WM-6 monthly-view visual review (PO-reported)

PO opened the monthly view and reported visual breakage. Thorough review written for the
implementing agent. Also answered PO's question about the stray root `output/` folder.

## Output
`output-review/2026-06-30-claude-WM-6-review-2-po-visual-fixes.md` — **CHANGES REQUESTED**,
supersedes the round-1 static-only PASS.

## Root cause summary (6 fixes)
1. `MonthlyTaskChip` ([DayGridCard.tsx:29](src/builder/stage/views/DayGridCard.tsx:29)) duplicates the
   collapsed `TaskCard` + its long-press→editor — REUSE violation. Replace with collapsed `TaskCard`.
2. Day container must be 1–2 wrapping rows + internal vertical scroll (action-card pattern), not a
   1-wide column.
3. **Real overflow cause:** monthly grid ([MonthlyView.tsx:73](src/builder/stage/views/MonthlyView.tsx:73))
   is `flex-1 grid grid-cols-7` with default `grid-auto-rows:auto` → row sizes to content → `h-full`
   cards unbounded → internal scroll never engages → cells overflow into next week. Fix:
   `[grid-template-rows:minmax(0,1fr)]`.
4. Week header row ([MonthlyView.tsx:62](src/builder/stage/views/MonthlyView.tsx:62)) eats vertical
   space and the right-aligned date-range overlaps cards. Replace with a vertical "WEEK n" label in a
   thin left gutter.
5. Zero page scroll (v+h) — falls out of 3+4; re-verify editor-open shrink clause.
6. Timeline island ([TimelineBuilderIsland.tsx:46](src/builder/islands/TimelineBuilderIsland/TimelineBuilderIsland.tsx:46))
   → Month switch (month = 4 weeks; `monthCount=ceil(totalWeeks/4)`); Add Week stays the only growth
   control and spawns the next navigable month past 4 weeks.

## Process finding
Round-1 WM-6 review was PASS with **all** browser proofs `BLOCKED §28` — but REQ-CAL-MONTH-001's
acceptance IS the visual render. A sprint cannot be Completed/PASS while its acceptance gate is
blocked. Flagged in the review; `sprints/WM-6.md` should revert from `Status: Completed`.

## Browser repro note
Could not fully drive monthly view in my session (near-empty seed; "Switch to Timeline" kept the
kanban container under `data-view="timeline"`). Root cause established from code + PO screenshot;
flagged the view-switch observation for the agent to confirm (likely seed/synthetic-click artifact).

## Side finding — stray root `output/` (answered PO question)
`/output/OA-1-overflow-awareness.md` + `/output/evidence/OA-1-overflow-awareness/*.jpeg` exist at
**repo root**. The OA-1 sprint wrote to a relative `output/` path resolved from cwd (repo root)
instead of the plan's `docs/plans/active/.../output/`. The `.md` is a duplicate (canonical copy is in
the plan dir); the two evidence JPEGs may be the only copies. Not gitignored. Recommend: move the two
JPEGs into the plan's `output/evidence/OA-1-overflow-awareness/`, delete the root `output/`, and add a
guard (gitignore `/output/` or a sprint-close check) so agents stop writing there. Awaiting PO call —
not deleted.
