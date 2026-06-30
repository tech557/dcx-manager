# Sprint FIX-DEN — Kanban Phase Density (Re-work)

**Status:** ⚠️ Code complete — browser gate outstanding (opencode, 2026-06-25)  
**Prerequisite:** None (isolated CSS change)  
**Audit finding:** B3 audit result was FAIL. Three 400px phases + two 24px gaps = 1248px in a 1200px viewport. Three expanded phases require horizontal scroll, violating BLD-CRD-INT-005 / OD-005.

**Rollback boundary:** `PhaseCard.tsx` or the phase column width class in `KanbanView.tsx`

---

## FIX-DEN.1 — Adjust expanded Phase width to fit three columns

### Audit finding
Phase columns are hard-fixed at 400px. OD-005 / BLD-CRD-INT-005 specifies: **preferred 360–400px, minimum 340px, scroll below target**. At 1200px Kanban width, three 400px columns + two 24px gaps = 1248px (overflow). Three 360px columns + two 24px gaps = 1128px (fits).

### Files to inspect
- `src/builder/stage/views/KanbanView.tsx` — phase column width class
- `src/builder/cards/templates/phase/PhaseCard.tsx` — any local width constraint

### Files to change
- Whichever file hard-codes `w-[400px]` or equivalent for the expanded phase column.

### Required behaviour
- Expanded Phase: `min-w-[340px] w-[360px] max-w-[400px]` (use CSS `clamp` or Tailwind equivalent).
- Collapsed Phase: unchanged (72px).
- Three expanded phases + two 24px gaps ≤ 1200px at 1440px viewport.
- Below minimum (340px) the column scrolls horizontally — do not clip content.

### Calculation to verify
Three phases at 360px = 1080px + two 24px gaps = 1128px. ✅ Fits in 1200px Kanban width.

### Acceptance criteria
```
□ Three expanded Phase columns visible simultaneously at 1440×900 without horizontal scroll
□ Collapsed Phase width unchanged (72px)
□ Phase content (name, actions) not clipped at 360px
□ npm run typecheck passes
□ Browser manual check: three phases visible side-by-side at 1440px
```

### Agent Execution Notes
Before changing, `grep -r "w-\[400px\]" src/builder/` to find the exact class. Change only the phase column width — do not touch card content, action widths, or task widths.

### Progress log
`docs/progress/sessions/[date]-[agent]/FIX-DEN-kanban-density.md`
