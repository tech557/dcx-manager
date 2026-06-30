# Sprint BUG-WIDE — Expanded Card Width Reduction

**Status:** 🔴 Not started  
**Prerequisite:** BUG-OVF ✅, BUG-KAN ✅  
**Evidence:** Screenshots show only 2 expanded day columns visible at once in Timeline view. Expanded phases in Kanban are too wide to comfortably show 3–4 at once on a 1440px screen. The 360px expanded width is the shared root cause across both views.

**Root cause:** `DayGridCard` uses `w-[360px]` when any task is expanded, and `KanbanView` phase columns use `min-w-[340px] w-[360px] max-w-[400px]`. At 1440px viewport (~1200px stage width after side columns), only 3 × 360px = 1080px fit — less than 3 full expanded cards, and far fewer when pre-anchor collapsed cards also consume space. Reducing to 260px increases visible cards to 4+ without touching task card height.

**Constraint (hard — do not violate):** Task card height is frozen at `h-[60px]`. Do not change it.

**Rollback boundary:** `DayGridCard.tsx`, `KanbanView.tsx`, `BuilderLoadingShell.tsx`.

---

## BUG-WIDE.1 — DayGridCard: reduce expanded-task-present width

**File:** `src/builder/stage/views/DayGridCard.tsx`  
**Current line ~123:**
```tsx
: `${hasAnyExpandedTask ? 'w-[360px]' : 'w-[220px]'} h-[480px] p-4 flex-none`
```

**Change:**
```tsx
: `${hasAnyExpandedTask ? 'w-[260px]' : 'w-[220px]'} h-[480px] p-4 flex-none`
```

`w-[220px]` (no expanded task, 3-column task tile grid) stays unchanged — the 3 × 56px tiles + 2 × 8px gaps + 32px padding = 216px still fits.

**Check ActionCard title max-w:** `ActionCard.tsx` line ~55 has `max-w-[200px] md:max-w-[220px]`. With `w-[260px]` and `p-4` = 16px padding each side → inner width = 228px. `max-w-[200px]` fits (200 < 228). No change needed.

**Task card check:** task card expanded is `w-full h-[60px]`. At 228px inner width — fine. Title truncates slightly more but height is preserved. ✅

**Acceptance criteria:**
```
□ Expanded day cards are 260px wide (inspect in browser)
□ Non-expanded day cards remain 220px wide
□ Task card height stays 60px — do not change h-[60px] in TaskCard.tsx
□ Task card content (icon, title, date) still visible — no content clipped
□ npm run typecheck passes
```

---

## BUG-WIDE.2 — KanbanView: reduce expanded phase column width

**File:** `src/builder/stage/views/KanbanView.tsx`  
**Current line ~129:**
```tsx
? 'min-w-[340px] w-[360px] max-w-[400px]'
```

**Change:**
```tsx
? 'min-w-[240px] w-[260px] max-w-[300px]'
```

**Update totalBoardWidth calculation (same file):**  
The BUG-KAN ResizeObserver calculation uses `expandedNodeIds.includes(p.id) ? 360 : 72`. Update to `260`:
```typescript
return sum + (expandedNodeIds.includes(p.id) ? 260 : 72);
```

**Acceptance criteria:**
```
□ Expanded phase columns are 260px wide (inspect in browser)
□ Collapsed phase columns remain 72px wide
□ shouldCenter still correctly computes (totalBoardWidth uses 260 not 360)
□ npm run typecheck passes
```

---

## BUG-WIDE.3 — BuilderLoadingShell: update skeleton phase width

**File:** `src/builder/BuilderLoadingShell.tsx`  
**Current line ~48:**
```tsx
<div key={i} className="shrink-0 h-full w-[360px] bg-white/[0.02] border border-white/5 rounded-2xl shimmer-bg" />
```

**Change:** `w-[360px]` → `w-[260px]`

This keeps the loading shell skeleton visually consistent with the live 260px phase width after this fix.

**Acceptance criteria:**
```
□ LoadingShell skeleton phase columns are 260px (same as live)
□ npm run typecheck passes
```

---

## BUG-WIDE.4 — Verify no churn introduced

Read `WeeklyView.tsx` and confirm it has no hardcoded 360 reference. Read `useWeeklyView.ts` for any width calculations.

**Files to inspect (read-only check, no change expected):**
- `src/builder/stage/views/WeeklyView.tsx`
- `src/builder/stage/useWeeklyView.ts`

**Acceptance criteria:**
```
□ No hardcoded 360 in weekly view files
□ No hardcoded 360 left in KanbanView after BUG-WIDE.2
□ Grep: `grep -rn "w-\[360" src/builder/stage` returns 0 results
```

---

Gates:
```
□ npm run typecheck — 0 errors
□ npx vitest run — 27/27 (no regressions)
□ verify.sh — PASS
□ Browser gate OPEN — user to verify: 3+ expanded day columns visible without scrolling in Timeline, 3+ expanded phases visible in Kanban
```

Progress log: `docs/progress/sessions/[date]-[agent]/BUG-WIDE-card-width-reduction.md`
