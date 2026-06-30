---
review: CC-5 output review
sprint: CC-5
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
verdict: PASS — clean architecture; ready for CC-6
---

# CC-5 Review — reduced-motion

## Verdict: ✅ PASS
Well-architected and correct. The reduced-motion coverage is **type-enforced**, which is stronger than a manual checklist.

## Verified in code
- **`reducedEffectsRegistry: Record<EffectName, EffectMotionProps>`** — the type guarantees **every** effect
  has a reduced variant (typecheck passing = complete coverage). Confirmed all 12 entries present
  (dropTargetGlow, invalidDrop, parentGlow, selectedHighlight, newItemHighlight, focusHighlight,
  expandCollapse, dragFeedback, saveSyncFeedback, lockedFeedback, viewTransitionIn/Out). ✅ (M01)
- **Variants are genuinely reduced:** no `scale`/`rotate`/`x`-translate; durations ≤0.08s or `0` (instant);
  `invalidDrop` x-shake → opacity pulse (feedback preserved, motion removed). ✅ (M05 / §20)
- **Single injection point:** `EffectLayer` calls `useReducedMotion()` and routes via `useEffect(reduced)` →
  all card/island/dropzone consumers inherit reduced-motion with **zero per-component change**. Elegant. ✅
- **New `useReducedMotion.ts`** (reactive `matchMedia('(prefers-reduced-motion: reduce)')`) at `src/hooks/`. ✅
- **Skeleton shimmer** already handled by SK-1's `@media (prefers-reduced-motion)` CSS — correctly NOT duplicated. ✅
- `viewTransitionIn/Out` reuse the existing `viewTransitionReducedIn/Out` constants. ✅ (M02)

## Gates / debt
typecheck ✅ · lint ✅ · test 85 ✅ · architecture(274) ✅ · req:validate ✅ · completion-gate ✅ · changed-scope unlinked 0.

## Notes (minor, non-blocking)
1. **`invalidDrop` reduced variant is 200ms** — slightly over §20's "≤100ms fade" guideline. It's an opacity
   pulse (not motion), so acceptable, but could tighten to ≤100ms for strict §20 conformance.
2. **Browser proof = structural** (26 `EffectLayer` wrappers in DOM, `matchMedia` present, 0 console errors,
   clean port 3000). **Real `prefers-reduced-motion` emulation deferred** — needs an OS toggle or Playwright
   `emulateMedia` (Preview MCP can't emulate it; Playwright can't reach the sandboxed port). Low-risk given
   the type-enforced completeness + single-injection design. PO Web Check: OS reduced-motion on → drag/expand/
   select → expect instant/fade, no springs/shakes.
3. No targeted unit test for the motion hooks (acceptable); a tiny `reducedEffectsRegistry` completeness test
   would be redundant with the `Record<EffectName>` type.

## Recommendation
Keep CC-5. Ready for **CC-6** (stage + island light surfaces) — the last CC sprint before the WM behavior block.
