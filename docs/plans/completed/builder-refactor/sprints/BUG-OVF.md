# Sprint BUG-OVF — Timeline Day Columns Clipped / Islands Shifting Off-Screen

**Status:** ✅ Completed (2026-06-25 Claude) — see `docs/progress/sessions/2026-06-25-claude/BUG-OVF-timeline-overflow.md`  
**Prerequisite:** None  
**Evidence:** Screenshot shows Weekly/Timeline view with pre-anchor day columns (-2, -1, 0) partially clipped by the left edge of the stage. Islands appear to shift when the editor opens.

**Root cause:** `WeeklyView.tsx` line 65 uses `justify-center` on the inner day-columns wrapper (`min-w-full min-h-full flex items-center justify-center`). When the total width of all day columns exceeds the scroll container's width, flex centering clips content on the **left** side — and the `overflow-x-auto` scroll container scrolls right only, so left-clipped content is inaccessible. This is a known CSS behaviour: centered overflow in a scroll container loses the left portion.

**Rollback boundary:** `WeeklyView.tsx` only.

---

## BUG-OVF.1 — Fix left-clip on day columns in Weekly/Timeline view

### File to change
`src/builder/stage/views/WeeklyView.tsx`

### Lines to inspect
Line 64–66 (scroll + centering containers):
```tsx
<div className="flex-1 overflow-x-auto min-h-0 w-full" id="days-horizontal-columns">
  <div className="min-w-full min-h-full flex items-center justify-center p-1.5">
    <div className="flex gap-4 shrink-0">
```

### Required fix
Remove `justify-center` from line 65. Change to `justify-start`. The days should begin at the left edge of the scroll container and the user scrolls right to see later days.

```tsx
<div className="flex-1 overflow-x-auto min-h-0 w-full" id="days-horizontal-columns">
  <div className="min-w-full min-h-full flex items-center justify-start p-1.5">
    <div className="flex gap-4 shrink-0">
```

Then, on mount (or when the view activates), scroll the container so the **anchor day column** is visible near the left edge of the viewport:
```typescript
// After render, find the anchor day element and scroll it into view
const anchorEl = document.querySelector('[data-is-anchor="true"]');
anchorEl?.scrollIntoView({ block: 'nearest', inline: 'start', behavior: 'instant' });
```

Check whether the anchor column already has a `data-is-anchor` or `data-anchor` attribute in the day column render. If not, add `data-anchor="true"` to the anchor day's wrapper element.

### Do NOT
- Change the stage layout, StageCore, BuilderPage, or any island
- Add any new state to StageProvider
- Change day column widths

### Acceptance criteria
```
□ In Weekly/Timeline view, all day columns are accessible (no left-clip)
□ On view activation the anchor day (launch date) is the first fully visible column from the left
□ Scrolling right reveals later days
□ Stage layout (three-row grid) is unchanged
□ npm run typecheck passes
□ Browser check: open Timeline view, scroll — all day columns reachable in both directions from anchor
```

---

## BUG-OVF.2 — Verify island layout does not shift stage width

### Evidence
Screenshots show stage content apparently shifting when the editor island opens. The stage grid uses `EditorViewerIsland` pushing stage (via `isEditorOpen` CSS variable controlling the left column width from 4.5rem to 25rem). This is the frozen layout contract (AGENTS.md §10).

### Files to inspect
`src/builder/BuilderPage.tsx` — the three-column grid layout.
`src/builder/stage/StageCore.tsx` — confirm `w-full h-full` fills the center.

### Required action
Read both files. If the grid layout is intact (the three columns are `auto / 1fr / auto`), no change needed — the shift is expected behaviour (stage narrows when editor opens). Document the result.

If the grid layout was changed, restore it to the frozen contract.

### Acceptance criteria
```
□ Editor open: center stage width = viewport - editor column (25rem) - focus column (4.5rem)
□ Editor closed: center stage width = viewport - left column (4.5rem) - right column (4.5rem)
□ No content falls outside the stage boundary
□ npm run typecheck passes if any change was made
```

### Progress log
`docs/progress/sessions/[date]-[agent]/BUG-OVF-timeline-overflow.md`
