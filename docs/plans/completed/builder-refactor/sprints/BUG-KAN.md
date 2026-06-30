# Sprint BUG-KAN — Kanban Phase Count and Centering

**Status:** 🔴 Not started  
**Prerequisite:** BUG-OVF (stage width must be correct before diagnosing phase layout)  
**Evidence:** Screenshots show (a) phases appearing left-aligned when they should center, and (b) not all phases visible simultaneously at the required density.

---

## BUG-KAN.1 — Fix phase centering logic

### Evidence
`KanbanView.tsx` line 65: `phaseNodes.length <= 3 ? 'justify-center' : 'justify-start'`

This condition counts **total** phases, not the number that fit in the current stage width. With 4 phases total and 3 expanded at 360px each (= 1128px) fitting in a 1200px stage, the board uses `justify-start` because length is 4 — even though 3 columns fit fine. The result is phases sitting at the left edge instead of centering.

### File to change
`src/builder/stage/views/KanbanView.tsx`

### Required fix
Replace the hardcoded `<= 3` threshold with a width-aware calculation. Read the available stage width from the container element and compare it to the total width of all columns:

```typescript
// Derive the centering decision from actual rendered widths, not a magic number
const EXPANDED_COL_WIDTH = 360;
const COLLAPSED_COL_WIDTH = 72;
const COL_GAP = 24; // gap-6 = 1.5rem = 24px

const totalColWidth = phaseNodes.reduce((sum, p) => {
  return sum + (expandedNodeIds.includes(p.id) ? EXPANDED_COL_WIDTH : COLLAPSED_COL_WIDTH);
}, 0);
const totalGapWidth = (phaseNodes.length - 1) * COL_GAP;
const totalBoardWidth = totalColWidth + totalGapWidth;

// Use the kanban scroll container's client width as available width
const [containerWidth, setContainerWidth] = useState(0);
// read via ref on the outer scroll div
```

Simpler acceptable alternative: derive `shouldCenter` as `totalBoardWidth < containerWidth` where `containerWidth` is obtained via a `ResizeObserver` or a ref clientWidth read on mount.

If a ResizeObserver is too complex for this sprint, use a reasonable breakpoint: `justify-center` if `totalBoardWidth <= 1150` (3 expanded phases + 2 gaps = 1128px), `justify-start` otherwise.

### Acceptance criteria
```
□ 3 expanded phases (1128px total) are horizontally centered in the stage when no editor is open
□ 4+ phases use justify-start (scroll to reach overflow)
□ Collapsed phases (4 × 72px + gaps = 360px) are centered in the stage
□ No layout change to StageProvider or BuilderPage
□ npm run typecheck passes
□ Browser check: 3 expanded phases sit in the middle of the stage canvas
```

---

## BUG-KAN.2 — Verify all phases are reachable in the Kanban scroll view

### Evidence
Screenshots suggest not all phases are visible simultaneously. With 4 phases and the stage at ~1200px:
- 3 expanded + 1 collapsed: 1128 + 72 + 3×24 = 1272px — overflows by ~72px, requires slight scroll
- 4 expanded: 4×360 + 3×24 = 1512px — overflows, scroll required

### Required action
Confirm that the Kanban scroll container (`overflow-x-auto` on line 52) allows scrolling to reach all phases. Do not change the scroll behaviour — just verify it works.

If phases are invisible (not just off-screen but completely missing from the DOM), investigate whether a `max-w` constraint on the kanban board is clipping them. Report the finding.

### Acceptance criteria
```
□ All phase columns exist in the DOM regardless of total width
□ Scrolling the Kanban view reaches all phases
□ The scroll container shows a thin scrollbar when content overflows
□ Browser check: 4 phases with 2 expanded — all 4 reachable by scrolling
```

---

## BUG-KAN.3 — Timeline view: verify required day columns are visible

### Evidence
Timeline view should show the anchor week with days centred around the launch date. Requirement: all days in the current week range are reachable via scroll.

### Required action
After BUG-OVF.1 is applied, confirm that the timeline view shows the expected number of day columns (at minimum: -2 through +4 from the anchor as shown in the screenshot). If columns are missing from the DOM, investigate the day generation logic.

### Acceptance criteria
```
□ Timeline shows all days from the configured range (minimum 7 days visible/reachable)
□ The anchor day is visible without scrolling on initial render
□ No day columns are missing from the DOM
□ Browser check: scroll left and right from anchor — all expected days reachable
```

### Progress log
`docs/progress/sessions/[date]-[agent]/BUG-KAN-kanban-phase-layout.md`
