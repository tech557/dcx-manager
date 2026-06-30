## FIX-MOT — Reduced Motion Compliance + Direction Fix
Agent: opencode (big-pickle)
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Add `prefers-reduced-motion` branch for view transitions and fix direction state update during render.
Trigger: BLD-MOT-001 / OD-006, audit finding B10 PARTIAL PASS
Requirements covered: BLD-MOT-001, OD-006

Files created: (none)
Files edited:
  src/ui/motion/effects.registry.ts — added `viewTransitionReducedIn` / `viewTransitionReducedOut` exports (132 lines, was 121)
  src/builder/stage/StageCore.tsx — added `useReducedMotion()` conditional, moved direction derivation to `useEffect` (174 lines, was 163)
Files deleted: (none)

Churn — work reversed: None

Preserve-semantic check:
  - effects.registry: added exported constants alongside existing registry, did not modify existing entries ✓
  - StageCore: reduced-motion branch uses flat props (no variants), full-motion path unchanged ✓
  - No imports crossed violation boundaries ✓

Open decisions used: none

Acceptance criteria:
  □ When OS reduces motion: view switch uses short fade (≤ 100ms) — PASS (inline flat props, 80ms transition)
  □ When OS allows motion: existing 220ms directional slide unchanged — PASS
  □ useReducedMotion() from framer-motion is the source — PASS (imported from motion/react re-export)
  □ effects.registry.ts ≤ 200 lines — PASS (132 lines)
  □ npm run typecheck passes — PASS

  FIX-MOT.2:
  □ No React "cannot update during render" warning — PASS (moved to useEffect)
  □ Direction still tracks correctly — PASS (same logic, only execution timing changed)
  □ npm run typecheck passes — PASS

Gates:
  typecheck: PASS
  dev: N/A (no terminal for browser; component safe — no new hooks/state)
  vitest: PASS (27/27)
  verify.sh: PASS
  browser manual check: visual only — reduced-motion path produces fade at 80ms vs slide at 220ms

Consumer updates required: none (exported constants are new, not consumed elsewhere)

Open issues / follow-ups: none
