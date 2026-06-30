# Sprint BUG-ISL — Islands Clipping and Moving Out of View

**Status:** 🔴 Not started  
**Prerequisite:** BUG-OVF ✅, BUG-KAN ✅  
**Evidence:** User reports islands visually shifting or leaving the viewport. Observed in screenshots: stage layout appears correct at rest but may shift when editor opens or when footer islands expand.

**Known risk areas identified by code inspection:**
1. **Footer `grid-cols-3` overflow** — `SelectionIsland` has `minWidth: 290px` with no max-width cap; at narrow viewports or when combined with expanding center island, it can overflow into adjacent grid cells.
2. **`ViewHelperIsland` popup** — uses `absolute bottom-16 right-0` inside a `relative w-14` wrapper, which is inside the right cell of `grid-cols-3`. If the parent cell is too narrow (due to centering), the popup may clip against the canvas `overflow-hidden`.
3. **EditorViewerIsland session pill** — uses `absolute bottom-[64px] left-1/2 -translate-x-1/2` inside the left column. When editor is collapsed to `w-[4.5rem]` (72px), the pill may overflow beyond the column boundary into the stage area.
4. **`overflow-visible` on side columns** — both side `<aside>` elements have `overflow-visible`, allowing island content to paint outside its column. Combined with the canvas `overflow-hidden`, islands that position themselves relative to their column may be clipped by the canvas edge rather than their column.

**Rollback boundary:** Island files only. No changes to `BuilderPage.tsx` grid layout, `StageCore.tsx`, or any store/hook.

---

## BUG-ISL.1 — Investigate: audit all island overflow vectors

Read each of these files in full and identify any element that uses `absolute`, `fixed`, or `translate` to position outside its layout parent, and note whether the parent has overflow containment:

- `src/builder/islands/SelectionIsland/SelectionIsland.tsx`
- `src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx`
- `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` (specifically the session pill section)
- `src/builder/islands/FocusIsland/FocusIsland.tsx`

For each `absolute`/`fixed` element found, document:
- Parent overflow value
- Whether the element can exceed parent bounds
- Whether `overflow-hidden` on the canvas (`#builder-canvas`) clips it

**Acceptance criteria:**
```
□ Document produced with all overflow vectors listed
□ No code changed in this step — investigation only
```

---

## BUG-ISL.2 — Fix: ViewHelperIsland popup escapes footer cell

**File:** `src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx`

The popup `absolute bottom-16 right-0` is positioned relative to the `relative w-14` wrapper. When the footer's right grid cell is narrower than 340px (the popup's default width), the popup overflows left into the center cell — and since the canvas has `overflow-hidden`, the left side of the popup clips.

**Fix:** Change the popup's `position` context to `fixed` so it positions relative to the viewport, not the grid cell. Use `bottom` and `right` CSS values that place it just above the footer row.

```tsx
// BEFORE (line 53):
className="absolute bottom-16 right-0 z-[100] ..."

// AFTER:
className="fixed bottom-[100px] right-6 z-[100] ..."
```

Where `100px` = footer row height (76px) + 24px canvas bottom padding = 100px from bottom of viewport.

**Do NOT** change popup width/height/min/max. Do not change animation.

**Acceptance criteria:**
```
□ ViewHelper popup appears anchored above the bottom-right of the canvas, not clipped
□ Popup is fully visible at viewport widths 1024px–1920px
□ Closing and reopening popup works correctly
□ npm run typecheck passes
```

---

## BUG-ISL.3 — Fix: SelectionIsland max-width constraint

**File:** `src/builder/islands/SelectionIsland/SelectionIsland.tsx`

`SelectionIsland` has `minWidth: hasSelection ? '290px' : '210px'` but no `maxWidth`. In a `grid-cols-3` layout at 1440px, each cell is 480px — but at 1280px or when the center island grows, the left cell can be squeezed. The island grows with content and can overflow into the center island.

**Fix:** Add a `maxWidth` constraint:
```tsx
style={{
  minWidth: hasSelection ? '290px' : '210px',
  maxWidth: '420px',
}}
```

**Acceptance criteria:**
```
□ SelectionIsland never wider than 420px
□ SelectionLabel and SelectionButtons still fully visible at 290px minimum
□ npm run typecheck passes
```

---

## BUG-ISL.4 — Fix: EditorSessionPill overflow in collapsed left column

**File:** `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx`

The session pill (line ~94) is `absolute bottom-[64px] left-1/2 -translate-x-1/2` inside the left `<aside>` column. When the editor is collapsed (`w-[4.5rem]` = 72px), the pill (`max-w-[200px]`) overflows 64px+ out of each side of the 72px column. With `overflow-visible` on the column, this paints over the stage area. When the stage scrolls or animates, the pill appears to "float" disconnected from its anchor.

**Fix:** Only show the session pill when the editor is expanded (`hasFocusedNode` = true / isExpanded = true). The pill is only meaningful when the user can read it in the expanded editor panel.

```tsx
// Wrap the pill render in a condition:
{isExpanded && (
  <div className="absolute bottom-[64px] ...">
    {/* pill content */}
  </div>
)}
```

Find the exact prop/state controlling expansion — it's the `isExpanded` state already used in the same component.

**Acceptance criteria:**
```
□ Session pill is NOT rendered when editor is collapsed
□ Session pill IS rendered when editor is expanded (focused node present)
□ No layout shift when editor opens/closes
□ npm run typecheck passes
```

---

## BUG-ISL.5 — Verify: no new island overflow vectors introduced by BUG-WIDE

After BUG-WIDE lands, the phase column width changes from 360px to 260px. Verify that nothing in KanbanView or DayGridCard uses `absolute`/`fixed` positioning with hardcoded offsets that assume 360px width.

Search:
```bash
grep -n "absolute\|fixed" src/builder/stage/views/KanbanView.tsx
grep -n "absolute\|fixed" src/builder/stage/views/DayGridCard.tsx
```

If found, review each — document but only fix if the position is broken.

**Acceptance criteria:**
```
□ No absolute/fixed elements in KanbanView or DayGridCard use width-dependent offsets
□ If any found, document them in the progress log
□ npm run typecheck passes (only if a fix was needed)
```

---

Gates:
```
□ npm run typecheck — 0 errors
□ npx vitest run — 27/27 (no regressions)
□ verify.sh — PASS
□ Browser gate OPEN — user to verify: no islands clip or shift when editor opens/closes, ViewHelper popup fully visible, SelectionIsland does not overlap center footer island
```

Progress log: `docs/progress/sessions/[date]-[agent]/BUG-ISL-island-clip-fix.md`

---

## Planning note — why this was missed in earlier sprints

BUG-ISL was not caught in B0–B12 audit because:
- It only manifests under specific conditions (editor open + multiple islands expanded simultaneously)
- `overflow-visible` on layout columns is a silent enabler — individual islands pass their own checks but the interaction between `overflow-visible` columns and the canvas `overflow-hidden` clips them
- Browser-gate skipping in earlier sprints meant this interaction was never exercised

**Lesson for opencode:** Any time you see `overflow-visible` on a layout column that contains `absolute`-positioned children, flag it. The canvas `overflow-hidden` will silently clip anything that escapes the column boundary.
