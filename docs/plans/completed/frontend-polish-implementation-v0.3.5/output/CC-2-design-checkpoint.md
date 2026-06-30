---
sprint: CC-2
title: CC-2 Design Checkpoint (v4 — cognitive-load principle grounded)
status: RESOLVED-2026-06-30 (PO decisions recorded by Claude opus 4.8)
date: 2026-06-30
author: Claude (claude-sonnet-4-6)
---

# CC-2 Design Checkpoint (v4)

> ## ✅ PO DECISIONS — RESOLVED 2026-06-30 (supersedes the §8 sign-off list below)
> Reviewed by Claude (opus 4.8); the earlier "po-signoff RECEIVED — all 6" note in the audit brief was
> **premature** (the brief's own Q1–Q5 were never answered). Actual PO decisions:
> 1. **Scope tightened.** CC-2 = responsive cards + the unified card-height model ONLY. Overflow-awareness
>    gradient fades (§2/§3) **spun out → new sprint `OA-1`**. Skeleton `state`/tiered loading (§5)
>    **deferred to a SK-1 follow-up** (SK-1 already shipped; this is additive). §4 (remove TaskBentoGrid
>    `max-h`/scroll) stays with CC-2 as a card change.
> 2. **Unified card-height model (NEW — replaces §P-silence on height):** PhaseCard AND DayGridCard render
>    at **~80% of available stage height, centered with ~10% top + ~10% bottom margin** (replaces phase
>    `h-full` + day fixed heights). Margins let island popups overlap the margin, not card content.
> 3. **`REQ-COG-AWARE-001` is NOT added as a new node** — folded into REQ-FP-CMA-003 (auto-centre) + the
>    readiness "no hidden state" family. Implemented in OA-1 with those as the trace.
> 4. **Overflow signal = gradient fade only** (no arrow buttons in cards). Arrows/snap → stage (CC-6/WM-6).
>
> The §1–§8 design content below is retained as the worked design; items §2/§3/§5 now live in OA-1 / the
> SK-1 follow-up per decision #1.

> **PO sign-off required before any code changes.** (Satisfied 2026-06-30 — see decisions above.)

---

## § P — Product Principle (new, grounding everything below)

### "Never add mental work on top of the real work"

The tool exists to support a creative, strategic process. Every second a user spends asking *"is there more? am I missing something? where did that go?"* is cognitive budget stolen from the actual problem they're solving.

**The rule:** A user must ALWAYS know their spatial context without effort. No card or container may be cropped or truncated without a clear, effortless signal that more exists — and where it is.

This applies at every nesting level:

| Level | Container | Children | Overflow direction |
|---|---|---|---|
| Stage | KanbanView | Phase columns | Horizontal |
| Phase | PhaseCard (expanded) | Action cards | Vertical |
| Action (collapsed) | HorizontalTaskFlow | Task tiles | Horizontal |
| Action (expanded) | TaskBentoGrid | Task cards | Vertical (removed per §2) |

**Permitted signals** (subtle, not noisy):
- Gradient fade at the overflow edge (the fade IS the signal — it shows content continues)
- Arrow button that appears only when there IS overflow (opacity-0 when none, opacity-100 when scrollable)
- A mini-skeleton stub at the edge — the visual language of "more is loading / more is there"
- Magnetic / snap scroll — never leave a card half-visible at the scroll boundary

**Prohibited:** A hard clip with nothing — a card cut at 50% with no signal.

This principle becomes a formal requirement (proposed below as REQ-COG-AWARE-001) and drives CC-2, part of CC-6, and WM-6.

---

## § R — Requirement Proposal

```
ID:        REQ-COG-AWARE-001 (proposed — requires req:propose + PO sign-off to enter graph)
Statement: At every nesting level (stage→phase, phase→action, action→task),
           the user must always perceive spatial context without effort.
           No container may clip its children without an overflow signal
           (gradient fade, arrow, mini-stub, or magnetic snap).
           Cropped cards with no signal are a §P violation.
Scope:     frontend / ux-contract
Priority:  MVP
Affected:  KanbanView, PhaseCard, HorizontalTaskFlow, TaskBentoGrid, BuilderLoadingShell
Deferred:  magnetic snap (WM-6); Home/Version list overflow (HV-1/HV-2)
```

This will be proposed via `npm run req:propose` after PO sign-off and implemented across CC-2, CC-6, WM-6.

---

## § 1 — Stage → Phase awareness (KanbanView) — **CC-6 / WM-6 scope**

When phase columns overflow the stage viewport horizontally, a phase card must never sit half-visible at the right or left edge.

**Signals:**
- Left/right edge gradient fades (`from-transparent to-[var(--theme-surface-deep)]`) on the KanbanView container — visible only when there IS scroll content in that direction
- Directional arrow button (left/right) that appears on hover when scrollable — disappears when at boundary
- *Magnetic snap* (CSS `scroll-snap-type: x mandatory` on the stage, `scroll-snap-align: start` on each phase column) — phase columns land on clean boundaries

**Why deferred from CC-2:** KanbanView is owned by the stage, not the card components. This belongs in CC-6 (Stage + island surfaces) or WM-6 (stage views). Tracked as a CC-6 pre-condition in the carry-forward.

---

## § 2 — Phase → Action awareness (PhaseCard) — **in CC-2 scope**

The action list inside an expanded phase scrolls vertically. The user must always know if there are more actions above or below the visible area.

**Signal:** Top and bottom gradient overlays on the scrollable action list, toggled by scroll position.

```tsx
// Inside PhaseCard expanded section — wraps the overflow-y-auto div
<div className="relative flex-1 min-h-0 overflow-hidden">
  {/* top fade — visible when scrollTop > 0 */}
  <div className="absolute top-0 left-0 right-0 h-8 bg-gradient-to-b from-[var(--theme-glass-bg)] to-transparent pointer-events-none z-10 transition-opacity"
       style={{ opacity: atTop ? 0 : 1 }} />

  {/* scrollable list */}
  <div ref={listRef} onScroll={handleScroll}
       className="flex flex-col gap-2 overflow-y-auto pr-1 flex-1 min-h-0 ...">
    {action cards}
  </div>

  {/* bottom fade — visible when not at bottom */}
  <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[var(--theme-glass-bg)] to-transparent pointer-events-none z-10 transition-opacity"
       style={{ opacity: atBottom ? 0 : 1 }} />
</div>
```

`atTop` / `atBottom` computed from `scrollTop`, `scrollHeight`, `clientHeight` via a `useScrollEdge` hook (small, reusable, ≤ 30 lines — lives in `src/hooks/useScrollEdge.ts`).

**No arrow buttons for actions** — the gradient is sufficient at this density. Arrow buttons would clutter the phase header.

---

## § 3 — Action → Task awareness (horizontal row, action collapsed) — **in CC-2 scope**

The horizontal task row (`HorizontalTaskFlow`) scrolls horizontally. Left/right gradient fades signal overflow.

**Signal:** Same pattern as §2, applied horizontally.

```tsx
// HorizontalTaskFlow wraps its scroll container
<div className="relative mt-2 overflow-hidden">
  {/* left fade */}
  <div className="absolute left-0 top-0 bottom-0 w-6 bg-gradient-to-r from-[var(--theme-glass-bg)] to-transparent pointer-events-none z-10 transition-opacity"
       style={{ opacity: atLeft ? 0 : 1 }} />

  {/* scrollable row */}
  <div ref={rowRef} onScroll={handleScroll}
       className="flex flex-row flex-nowrap items-center gap-2 py-2 overflow-x-auto ...">
    {task tiles + drop zones}
  </div>

  {/* right fade */}
  <div className="absolute right-0 top-0 bottom-0 w-6 bg-gradient-to-l from-[var(--theme-glass-bg)] to-transparent pointer-events-none z-10 transition-opacity"
       style={{ opacity: atRight ? 0 : 1 }} />
</div>
```

`useScrollEdge` is shared between PhaseCard (§2) and HorizontalTaskFlow (§3).

**Expanded task in the row:** wrapper becomes `w-[calc(100%-1rem)] mx-2 flex-none` — fills the visible row width. Combined with `inline: 'nearest'` scroll on selection, one expanded task fills the view at a time.

---

## § 4 — Action → Task awareness (grid, action expanded) — **in CC-2 scope**

Remove `max-h-[300px] overflow-y-auto` from `TaskBentoGrid`. Tasks flow naturally in the grid; no internal scroll. The phase's action-list scroll (§2) handles any overflow. No additional awareness signal needed in the grid — all tasks are always visible (no clip).

---

## § 5 — Structural skeleton — **in CC-2 scope for task row; broader principle for future**

### Skeleton as a structural primitive (not just a loading indicator)

The PO describes skeleton blocks as serving three states:
1. **Loading** — data is being fetched (current use)
2. **Pending / optimistic** — item created but backend not yet confirmed
3. **Error** — connection failed; item shows as a block until retry

`SkeletonBlock` gains:
- `children` prop — inner stubs can be nested
- `state` prop: `'loading' | 'pending' | 'error'` — drives visual variant:
  - `loading`: current shimmer (white 10-22% on dark)
  - `pending`: same shimmer, slightly warmer tint (white 8% + subtle amber)
  - `error`: static red-tinted block (no shimmer) — `rgba(255,80,80,0.08)` base

```tsx
export function SkeletonBlock({ className, style, surface = 'dark', state = 'loading', children }) {
  const base = surface === 'light' ? 'skeleton-block-light' : 'skeleton-block';
  const stateClass = state === 'error' ? 'skeleton-block-error' : state === 'pending' ? 'skeleton-block-pending' : '';
  return (
    <div className={`${base} ${stateClass} ${className}`} style={style}>
      {children}
    </div>
  );
}
```

**Tiered loading sequence (BuilderLoadingShell enhancement):**
Phase column skeletons contain inner action stubs (CSS animation-delay stagger):
```
t=0ms:   Header bar + stage outline + footer bar
t=100ms: Phase column outlines (3× expanded)
t=200ms: Action header stubs inside each phase (2–3 per column)
t=300ms: Task-tile row stub inside each action (3× 56px dots)
```
All via `animation-delay` CSS — no JS timers.

### Dark-mode contrast fix
```css
.skeleton-block {
  /* Dark surface: skeleton reads as LIGHT on dark bg — was 4-9%, now 10-22% */
  background: linear-gradient(90deg, rgba(255,255,255,0.10) 25%, rgba(255,255,255,0.22) 50%, rgba(255,255,255,0.10) 75%);
}
.skeleton-block-light {
  /* Light surface: reads as DARK on light bg — was 4-8%, now 7-14% */
  background: linear-gradient(90deg, rgba(0,0,0,0.07) 25%, rgba(0,0,0,0.14) 50%, rgba(0,0,0,0.07) 75%);
}
.skeleton-block-pending {
  background: linear-gradient(90deg, rgba(255,200,80,0.06) 25%, rgba(255,200,80,0.12) 50%, rgba(255,200,80,0.06) 75%);
}
.skeleton-block-error {
  background: rgba(255,80,80,0.08);
  animation: none;
}
@media (prefers-reduced-motion: reduce) {
  .skeleton-block        { background: rgba(255,255,255,0.12); animation: none; }
  .skeleton-block-light  { background: rgba(0,0,0,0.08);       animation: none; }
}
```

---

## § 6 — Empty states — text only, no borders

**No dashed or solid borders** on any empty state. Text + neutral color only.

| Location | Text |
|---|---|
| HorizontalTaskFlow (0 tasks) | `No tasks yet` — `text-dcx-2xs text-neutral-600 py-2` |
| TaskBentoGrid (0 tasks) | `No tasks created yet` — `text-dcx-xs text-neutral-600 col-span-4 py-3 px-2` |
| PhaseCard expanded (0 actions) | `No actions yet` — `text-dcx-xs text-neutral-700 flex-1 flex items-center justify-center` |

---

## § 7 — Files touched in CC-2

| File | Change | §6 cap |
|---|---|---|
| `src/hooks/useScrollEdge.ts` | New — shared scroll-edge detector | ≤30 / 200 ✓ |
| `TaskCard.tsx` | Merge branches; inner padding; single popup | ~150 / 250 ✓ |
| `CardShell.tsx` | Add selected→scrollIntoView for tasks | ~150 / 250 ✓ |
| `ActionCard.tsx` | Remove `max-w-[200px]` | ~120 / 250 ✓ |
| `HorizontalTaskFlow.tsx` | Overflow fade signals; expanded task width; empty state | ~90 / 250 ✓ |
| `TaskBentoGrid.tsx` | Remove max-h/scroll; empty state | ~55 / 250 ✓ |
| `PhaseCard.tsx` | Overflow fade signals; empty-actions state | ~225 / 250 ✓ watch |
| `BuilderLoadingShell.tsx` | Tiered phase/action/task stubs | ~75 / 250 ✓ |
| `SkeletonBlock.tsx` | children + state prop | ~30 / 200 ✓ |
| `components.css` | Skeleton contrast + pending/error variants | — |

**PhaseCard.tsx watch:** currently 208 lines → projected ~225 with fade overlay additions. Still under 250 hard cap but close. If it exceeds, extract the overflow-fade wrapper to `ScrollWithEdgeFade.tsx` in `src/builder/ui/`.

**CC-6 / WM-6 carry-forward (not CC-2):**
- KanbanView stage → phase horizontal awareness (gradient + arrows + magnetic snap)
- REQ-COG-AWARE-001 formal proposal via `req:propose`

---

## § 8 — PO Sign-Off — 6 items

1. **§P principle captured correctly?** "Never add mental work on top of real work" → no cropped card without a signal at every level.

2. **Overflow signal = gradient fade** (not arrows, not counters) at phase/action/task level in CC-2. Arrows deferred to KanbanView (CC-6/WM-6). **Yes / want arrows too in CC-2 / Redirect:**

3. **`useScrollEdge` shared hook** drives both PhaseCard fade and HorizontalTaskFlow fade. **Yes / Redirect:**

4. **Structural skeleton — `state` prop** (`loading` / `pending` / `error`) + `children` nesting. Pending = amber shimmer; Error = static red-tint block. **Yes / Redirect:**

5. **Tiered skeleton animation-delay stagger** (CSS only, no JS state). **Yes / Redirect:**

6. **Empty states — text only, no borders.** **Yes / Redirect:**
