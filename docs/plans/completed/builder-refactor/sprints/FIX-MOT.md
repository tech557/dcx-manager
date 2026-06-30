# Sprint FIX-MOT — Reduced Motion Compliance

**Status:** 🔴 Not started  
**Prerequisite:** None (isolated to motion system)  
**Audit finding:** B10 was PARTIAL PASS. Confirmed decision BLD-MOT-001 / OD-006 requires view transitions to **respect `prefers-reduced-motion`** with a short fade or instant switch. No such handling exists.

**Rollback boundary:** `effects.registry.ts`, `StageCore.tsx`

---

## FIX-MOT.1 — Add prefers-reduced-motion to view transition effects

### Audit finding
`effects.registry.ts` defines `viewTransitionIn` and `viewTransitionOut` with directional slide + 220ms duration. No `prefers-reduced-motion` branch exists. OD-006 says: reduced-motion must produce a short fade (≤ 100ms) or instant switch.

### Files to change
- `src/ui/motion/effects.registry.ts` — add reduced-motion variants for view transitions
- `src/builder/stage/StageCore.tsx` — read `useReducedMotion()` from Framer Motion and select the correct variant

### Required behaviour

In `effects.registry.ts`, add alongside existing view transition presets:
```typescript
export const viewTransitionReducedIn  = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.08 } };
export const viewTransitionReducedOut = { exit: { opacity: 0 }, transition: { duration: 0.08 } };
```

In `StageCore.tsx`:
```typescript
import { useReducedMotion } from 'framer-motion';
const prefersReduced = useReducedMotion();

// Use prefersReduced ? viewTransitionReducedIn : viewTransitionIn
// Use prefersReduced ? viewTransitionReducedOut : viewTransitionOut
```

### Acceptance criteria
```
□ When OS reduces motion: view switch uses a short fade (≤ 100ms), no slide
□ When OS allows motion: existing 220ms directional slide is unchanged
□ useReducedMotion() from framer-motion is the source (not a manual media query)
□ effects.registry.ts ≤ 200 lines (wc -l confirmed)
□ npm run typecheck passes
```

---

## FIX-MOT.2 — Fix direction state update during render

### Audit finding
Direction state is updated during render rather than in an effect or event handler, which can cause React warnings in Strict Mode.

### File to change
`src/builder/stage/StageCore.tsx`

### Required fix
Move the direction derivation into a `useEffect` that responds to view change, not inline during render. Or derive it as a pure computed value using a ref to track the previous view (refs are safe to write during render).

### Acceptance criteria
```
□ No React "cannot update during render" warning in Strict Mode
□ Direction still correctly tracks Kanban→Timeline and Timeline→Kanban
□ npm run typecheck passes
```

### Progress log
`docs/progress/sessions/[date]-[agent]/FIX-MOT-reduced-motion.md`
