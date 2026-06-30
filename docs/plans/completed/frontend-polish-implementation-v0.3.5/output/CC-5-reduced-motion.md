---
sprint: CC-5
plan: frontend-polish-implementation-v0.3.5
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
status: Completed
gates: typecheck ✅ | lint ✅ | test 85 ✅ | architecture 274 ✅ | req:validate ✅ | req:completion-gate ✅
evidence: output/evidence/CC-5-reduced-motion/README.md
---

# CC-5 — Motion + Interaction Feedback (reduced-motion)

## Summary
Added system-wide reduced-motion branches to the effects/motion stack.
Every `EffectLayer` consumer (cards, drop targets, date picker, any future user) automatically
respects `prefers-reduced-motion: reduce` without any per-component change.

## Files touched
| File | Change |
|---|---|
| `src/hooks/useReducedMotion.ts` | **New** — reactive `window.matchMedia('(prefers-reduced-motion: reduce)')` hook |
| `src/ui/motion/effects.registry.ts` | Added `reducedEffectsRegistry` — full parallel registry for all 12 `EffectName` entries |
| `src/ui/motion/useEffect.ts` | Added `reduced` param; routes to `reducedEffectsRegistry` when `true` |
| `src/ui/motion/EffectLayer.tsx` | Calls `useReducedMotion()` and forwards `reduced` to `useLayerEffect` |

## Design decisions
- `useReducedMotion` lives at `src/hooks/` (alongside `useScrollEdge`, `useTheme`) — shared concern, not
  motion-module-internal.
- `EffectLayer` is the single injection point: all consumers inherit reduced-motion for free.
- Reduced variants: eliminate `scale`/`rotate`/`x` translate; use ≤100ms opacity fades or instant (0ms)
  state changes. `invalidDrop` switches from x-shake to opacity pulse — feedback remains clear.
- Skeleton shimmer already handled by SK-1 `@media (prefers-reduced-motion: reduce)` CSS — no change needed.
- `viewTransitionIn/Out` reduced entries reuse the existing `viewTransitionReducedIn/Out` constants.

## Requirement Trace
| REQ | Before | After | Evidence |
|---|---|---|---|
| REQ-IFX-001 | not-assessed | implemented | TRC-CC5-REQ-IFX-001-TO-MAN-function-effects-registry + hook |
| REQ-FP-D06 | not-assessed | implemented | TRC-CC5-REQ-FP-D06-TO-MAN-function-effects-registry |
| REQ-DZ-001 | not-assessed | implemented | TRC-CC5-REQ-DZ-001-TO-MAN-function-effects-registry (partial) |

## MAN nodes updated
| MAN | Before | After |
|---|---|---|
| `MAN-function-src-ui-motion-effects-registry` | not-assessed | implemented |
| `MAN-hook-src-ui-motion-useeffect` | not-assessed | implemented |
| `MAN-react-component-src-ui-motion-effectlayer` | not-assessed | implemented |
| `MAN-hook-src-hooks-usereducedmotion` | _(new)_ | implemented |

## Requirement Debt Burn-down
- Changed-scope `manifestationsLackingRequirements`: 0 (new MAN has TRC links; existing MANs already linked)
- `req:completion-gate --changed` ✅ PASS (gate report: 0 unverified, 0 stale)
- `req:validate` ✅ PASS (QST-VR-011 pre-existing)

## Gates
- `typecheck` ✅
- `lint` ✅ (0 warnings)
- `test 85` ✅ (no targeted test exists for useReducedMotion — motion hook; no targeted test for EffectLayer)
- `validate:architecture` ✅ (274 modules, +1 `useReducedMotion`)
- `req:validate` ✅
- `req:completion-gate --changed` ✅

## Browser proof
Preview MCP clean port 3000 — `/builder/v-1` loads, 26 `.card-effect-wrap` EffectLayer wrappers in DOM,
0 console errors, `matchMedia` API present and responsive.
Real reduced-motion emulation (`prefers-reduced-motion: reduce`) requires OS toggle or Playwright
`emulateMedia` — structural DOM proof above is the available evidence. PO Web Check: toggle OS
reduced-motion, navigate `/builder`, drag/expand/select; expect instant/fade behavior, no springs or shakes.

## Canonical homes (carry-forward)
- `useReducedMotion` → `src/hooks/useReducedMotion.ts` (do not duplicate `matchMedia` logic elsewhere)
- `reducedEffectsRegistry` → `src/ui/motion/effects.registry.ts` (add entries here for any new EffectName)
- `EffectLayer` is the single injection point — do not call `useReducedMotion` inside card/island components directly
