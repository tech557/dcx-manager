# CC-5 Evidence — Reduced-motion branches

## Session: 2026-06-30 | Agent: Claude (claude-sonnet-4-6)

### DOM smoke — builder loads clean (normal motion)
- Route: `/builder/v-1` at 800×900 (Preview MCP, clean port 3000)
- 26 `.card-effect-wrap` EffectLayer wrappers in the DOM ✅
- 0 console errors ✅
- `window.matchMedia('(prefers-reduced-motion: reduce)').matches` → `false` (normal motion active) ✅
- `addEventListener` on MediaQueryList supported ✅

### Structural verification
- `useReducedMotion()` hook correctly reads `window.matchMedia(MQ)` and subscribes to `change` events
- `useEffect(name, active, reduced)` routes to `reducedEffectsRegistry` when `reduced=true`
- `EffectLayer` calls `useReducedMotion()` internally — all consumers of `EffectLayer` (CardShell, DropTarget, DatePickerPopup) automatically inherit reduced-motion behaviour
- `reducedEffectsRegistry` has complete coverage of all 12 `EffectName` entries:
  - `dropTargetGlow` → boxShadow only, no scale, duration 0.08s
  - `invalidDrop` → opacity pulse [1→0.5→1], no x-shake
  - `parentGlow` → boxShadow only, instant
  - `selectedHighlight` → no scale (no-op animate)
  - `newItemHighlight` → opacity 0→1, 0.08s (no scale)
  - `focusHighlight` → instant outline (no transition)
  - `expandCollapse` → opacity 0→1, 0.08s (no scale)
  - `dragFeedback` → boxShadow only, no scale/rotate
  - `saveSyncFeedback` → boxShadow only, instant
  - `lockedFeedback` → opacity + filter, instant
  - `viewTransitionIn/Out` → reuses existing `viewTransitionReducedIn/Out` (0.08s fade)
- Skeleton shimmer reduced-motion already handled by SK-1 CSS `@media (prefers-reduced-motion: reduce)`

### Screenshot
`builder-1440-cc5-smoke.jpeg` — builder at clean port 3000, 26 EffectLayer wrappers visible, no errors.

### Note: live reduced-motion emulation
Preview MCP `preview_resize colorScheme` does not expose `prefers-reduced-motion` emulation.
Real emulation requires Playwright `page.emulateMedia({ reducedMotion: 'reduce' })`.
PO Web Check (real pointer/drag with reduced-motion OS toggle) is the live proof step — the structural
DOM/code assertions above are the available non-emulation evidence.
