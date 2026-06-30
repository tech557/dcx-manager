# BUG-OVF: Timeline Day Column Left-Clip & Horizontal Scroll

**Status:** ✅ Completed (Claude 2026-06-25)  
**Sprint file:** `docs/plans/active/builder-refactor/sprints/BUG-OVF.md`

---

## Root Cause

Two separate issues in `WeeklyView.tsx`:

### Issue 1 — Centering broken by `justify-start`
An earlier fix had added `justify-start` to prevent left-clip, which broke centering. The correct pattern centers content when it fits AND shows a scrollbar when it overflows, using `min-w-full w-max` on the inner wrapper:

```tsx
<div className="min-w-full w-max min-h-full flex items-center justify-center p-1.5">
  <div className="flex gap-4">{cards}</div>
</div>
```

- `min-w-full`: inner is at least 100% of scroll container → justify-center has room to center
- `w-max`: inner grows to content size when cards overflow → triggers scrollbar  
- `justify-center`: centers card group in the inner wrapper

### Issue 2 — Scroll container grows with content (THE HARD BUG)

The scroll container was a `flex-1` child in a flex parent:
```tsx
// BROKEN: flex-1 child expands to content, overflow-x-auto never triggers
<div className="flex-1 min-w-0 overflow-x-auto min-h-0 w-full">
```

In CSS flex layout, `overflow: hidden` on a flex parent clips VISUAL output but does NOT constrain child size calculations. The `flex-1 min-w-0` child can still expand beyond the parent when content is wider. When the scroll container grows to match content (e.g. 1648px = content), `scrollWidth === clientWidth` → no scrollbar.

**Fix: absolute inset-0** anchors the scroll container to its parent's constrained dimensions:
```tsx
// FIXED: absolute child takes exact parent dimensions, overflow-x-auto works
<div className="relative flex-1 min-h-0 w-full flex overflow-hidden">
  <div className="absolute inset-0 overflow-x-auto" id="days-horizontal-columns">
    <div className="min-w-full w-max min-h-full flex items-center justify-center p-1.5">
      <div className="flex gap-4">{cards}</div>
    </div>
  </div>
</div>
```

`absolute inset-0` = `position: absolute; top:0; right:0; bottom:0; left:0` — the element takes its size from the nearest `position: relative` ancestor (which is constrained by flex layout to stage width). Content inside can then genuinely overflow this fixed-size box, triggering the scrollbar.

---

## Verified Results (DOM eval 2026-06-25)

| Metric | Before fix | After fix |
|--------|-----------|-----------|
| `scroll container position` | `static` (flex child) | `absolute` |
| `containerClientW` (all 7 expanded) | 1648px (grew to content) | 1200px (fixed) |
| `containerScrollW` (all 7 expanded) | 1648px | 1348px |
| `hasScrollbar` | false ❌ | true ✅ |
| centering (cards fit) | justify-center | justify-center ✅ |

---

## Kanban Centering (confirmed working)

`KanbanView.tsx` uses the same `w-max min-w-full` pattern on its inner wrapper, with a `shouldCenter` flag (ResizeObserver-based) toggling `justify-center` vs `justify-start`. The kanban `overflow-x-auto` is on the root element which IS constrained (it's a `w-full h-full` renderer child), so no `absolute` fix was needed there.

---

## Pattern Guide for Future Agents

### "Center-or-scroll" layout pattern
```tsx
{/* Outer: constrained size via absolute positioning */}
<div className="relative w-full h-full overflow-hidden">
  <div className="absolute inset-0 overflow-x-auto">
    <div className="min-w-full w-max min-h-full flex justify-center">
      <div className="flex gap-4">{repeatingItems}</div>
    </div>
  </div>
</div>
```

### Why `flex-1 overflow-x-auto` alone fails
- Flex children with `overflow-x-auto` only scroll when `clientWidth < scrollWidth`
- In a flex parent without a hard max-width constraint, `flex-1` children expand past the parent
- `min-w-0` prevents SHRINK below min-content but doesn't cap GROWTH when parent uses `overflow: hidden`
- `absolute inset-0` is reliable because absolute elements take their size from the nearest `position: relative` ancestor, which already has a fixed computed size from flex layout above it

### Anti-pattern to avoid
```tsx
// DON'T: flex-1 child in an overflow:hidden flex parent — may expand to content!
<div className="flex overflow-hidden">
  <div className="flex-1 min-w-0 overflow-x-auto">
    <div className="w-max">wide content</div>
  </div>
</div>
```
