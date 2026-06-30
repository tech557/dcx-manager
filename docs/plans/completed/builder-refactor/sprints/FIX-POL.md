# Sprint FIX-POL — Visual Polish Re-run

**Status:** 🔴 Not started  
**Prerequisites:** FIX-NDX, FIX-CRD, FIX-DEN, FIX-NLC, FIX-FIL, FIX-MOT, FIX-CAP must all be complete.  
**Audit finding:** B12 was FAIL because: (1) preconditions B1–B11 were unmet, (2) interaction logic was changed inside a visual-only sprint, (3) no screenshot evidence existed, (4) prohibited marketing language was used in the log.

**Constraint:** This sprint is CSS and visual layout ONLY. No hook changes, no state changes, no interaction logic. If any change requires touching a `.ts` hook or store, it belongs in a different sprint.

---

## FIX-POL scope

After all FIX-* sprints pass, confirm the following visual items are correct. Each item is a **check + fix if broken** — do not change what already works.

### FIX-POL.1 — Loading shell geometry match
Confirm `BuilderLoadingShell.tsx` skeleton widths match the live layout:
- Side columns: `w-[4.5rem]` (72px), matching the closed editor/focus columns
- Phase skeleton columns: `w-[360px]` (updated after FIX-DEN)
- Footer skeleton: matches `h-14` (56px)

If mismatched, update only `BuilderLoadingShell.tsx`.

### FIX-POL.2 — Theme-adaptive surfaces
Confirm `.island-shell` surfaces, `MetadataFilesPopup`, and `TimelineBuilderIsland` are theme-adaptive (light/dark). **Visual CSS only.** Do not touch logic.

### FIX-POL.3 — Empty state design
Confirm KanbanView zero-phases empty state and DayGridCard weekly empty state render correctly and are not broken by FIX-CAP extraction. If extraction moved JSX, verify it renders.

### FIX-POL.4 — Screenshot evidence (mandatory)
Capture and attach to the progress log:
- Light mode: Kanban view, Timeline view, Editor open
- Dark mode: Kanban view, Timeline view, Editor open

Without screenshots, FIX-POL cannot be marked complete.

---

## Acceptance criteria
```
□ LoadingShell skeleton dimensions match live layout after FIX-DEN phase width change
□ All islands are theme-adaptive (light/dark) in browser
□ Empty states render correctly in both Kanban and weekly Day view
□ Six screenshots attached to progress log (3 light + 3 dark)
□ No .ts hook or store files changed in this sprint
□ No interaction behaviour changed
□ npm run typecheck passes
□ bash scripts/verify.sh passes
```

### Progress log
`docs/progress/sessions/[date]-[agent]/FIX-POL-visual-polish.md`
