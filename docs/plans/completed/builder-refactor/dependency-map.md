# Builder Refactor — Dependency Map

## Hard dependencies (cannot start without predecessor)

| Sprint | Requires |
|---|---|
| B-FIL | B0 (StageProvider must be clean before island state is moved) |
| B-CRD | B0 (isEditorOpen must exist before editor session wiring) |
| B3 | B2 (stage sizing must be correct before density is tuned) |
| B4 | B-CRD (long-press and newly-created wiring depends on CardShell changes) |
| B5 | B0 + B-CRD (isEditorOpen in context + onLongPress in CardShell) |
| B8 | B-FIL (ViewHelperIsland must be cleared of file preview before View Context content is added) |
| B9 | B-CRD (drag payload ids array must be wired in useCardDrag) |
| B10 | B2 (stage must fill available width before transition is tested) |
| B12 | B1 through B11 all complete |
| B13 | B12 complete |

## Soft dependencies (recommended order)

- B6 before B7 (selection island before focus island — same Row 3 context)
- B1 before B3 (skeleton confirms layout before density is tuned)
- B4 before B5 (card reveal should work before editor sessions are built)

## Independent sprints (can run in any order after B0)

B1, B2, B6, B7, B11 are independent of each other after B0.
