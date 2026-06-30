---
review: WM-1 output + code review
sprint: WM-1
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
verdict: PASS — clean, correct, well-evidenced; 2 minor non-blocking notes
---

# WM-1 (Theme toggle) — Code & Output Review

## Verdict: ✅ PASS
First `src/`-touching sprint of the implementation plan. Codex's WM-1 is correct, clean, properly
tested, and backed by real browser evidence. No blocking issues. Two minor polish notes for later.

## Reviewed (code, not just the log)
| File | Verdict | Notes |
|---|---|---|
| `src/hooks/useTheme.ts` | ✅ | `applyThemeToDocument` sets `dataset.theme` + toggles `.dark` (REQ-FP-D05); scoped persistence via `preference.helpers` keyed user/dcx/version (UP-009/010); `isThemeMode` guards invalid stored values; `useTheme(scope?)` backward-compatible; remains the sanctioned theme accessor (§9.3); local-only, no backend write (UP-019); hydrate-once guard via `hydratedScopeRef`. |
| `src/hooks/theme.test.ts` | ✅ | 3 tests: apply-to-document, scoped persistence, invalid-fallback. Sound. |
| `src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx` | ✅ | `useTheme(getThemePreferenceScope(versionId))`; toggle flips mode; root `pointer-events-auto`. |
| `src/builder/BuilderPage.tsx` | ✅ | Header row (`builder-row-header-outer`) set `pointer-events-none` so empty header space no longer blocks the stage; interactive pills stay clickable. CSS/behavior fix inside the frozen layout — §10 OK. |

## Pointer-events change — verified safe (the one real-risk edit)
Confirmed the "pass-through container, interactive children" pattern is intact and complete:
- `.header-container-floating` → `pointer-events: none` (components.css:423).
- `.header-island-pill` → `pointer-events: auto` (components.css:427) — covers MetadataIsland's
  view-switch (Kanban/Timeline), status, files controls (MetadataIsland.tsx:148 uses `glass header-island-pill`).
- HeaderUserIsland root → `pointer-events-auto` (theme toggle, save, menu).
→ **No regression to header controls.** Only empty header space passes clicks through to the stage —
which is the intended improvement.

## Gates (re-confirmed from log; all green)
typecheck ✅ · lint ✅ · validate:architecture ✅ · test ✅ (82/82, 11 files) · verify.sh ✅ ·
req:validate ✅ (1 pre-existing warning) · req:reconcile changed ✅ (0 unlinked) · completion-gate ✅.
Real Playwright pointer proof at 1440×900 + 390×844 with persisted-across-reload screenshots. Debt
burn-down: changed-scope unlinked manifestations 3 → 0. Scope discipline: only 4 src files, all in WM-1 scope.

## Minor, non-blocking (for a later theme-touching sprint, e.g. CC-6)
1. **`useTheme` doesn't expose a setter/toggle**, so `HeaderUserIsland` pulls `setThemeMode` from
   `useAppStore` directly. Not a §9.3 violation (it reads the *mode* via `useTheme`), but tightening
   `useTheme` to return `setThemeMode`/`toggleTheme` would fully encapsulate the theme boundary.
2. **HeaderBrandIsland (logo)** has no explicit `pointer-events-auto`; if it is meant to be clickable
   (e.g. navigate home), confirm it's covered. Out of WM-1 scope; trivial.
3. Codex's own noted follow-ups are valid: completion-gate marks a changed *test* manifestation's
   `verifies` links stale when the test is in `--changed` (handled correctly); the non-blocking
   `BuilderPage → REQ-VR-001` route-name candidate was correctly **not** accepted.

## Recommendation
WM-1 is good to keep. Proceed to **CT-1** (resolve **G-IMPECCABLE** first per the sprint's stop-task).
Carry note #1 (useTheme setter) into CC-6.
