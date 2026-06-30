# WM-1 Output — Theme toggle + local preference foundation

Date: 2026-06-30  
Executor: Codex  
Status: Completed

## Summary
- Wired `HeaderUserIsland` theme toggle through `useTheme` so the selected theme updates `document.documentElement.dataset.theme`, `classList.dark`, and a version-scoped local preference key.
- Restored theme from the scoped preference on reload.
- Fixed the builder header hitbox so the theme toggle is reachable by a real pointer click.

## Files Touched
- `src/hooks/useTheme.ts`
- `src/hooks/theme.test.ts`
- `src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx`
- `src/builder/BuilderPage.tsx`
- `docs/product/requirements/graph/trace-links/TRC-WM1-*.json`
- `docs/product/requirements/graph/nodes/manifestation/test/MAN-test-src-hooks-theme-test.json`
- `docs/product/requirements/graph/ledger/decision-ledger.jsonl`

## Requirement Trace
- Requirements: `REQ-FP-D05`, `REQ-UP-009`, `REQ-UP-010`, `REQ-UP-019`
- Manifestations:
  - `MAN-hook-src-hooks-usetheme`
  - `MAN-test-src-hooks-theme-test`
  - `MAN-react-component-src-builder-islands-headeruserisland-headeruserisland`
  - `MAN-react-component-src-builder-builderpage`
- New trace links:
  - `TRC-WM1-REQ-FP-D05-TO-MAN-hook-src-hooks-usetheme`
  - `TRC-WM1-REQ-UP-009-TO-MAN-hook-src-hooks-usetheme`
  - `TRC-WM1-REQ-UP-010-TO-MAN-hook-src-hooks-usetheme`
  - `TRC-WM1-REQ-UP-019-TO-MAN-hook-src-hooks-usetheme`
  - `TRC-WM1-REQ-FP-D05-TO-MAN-react-component-src-builder-islands-headeruserisland-headeruserisland`
  - `TRC-WM1-REQ-UP-010-TO-MAN-react-component-src-builder-islands-headeruserisland-headeruserisland`
  - `TRC-WM1-REQ-FP-D05-TO-MAN-react-component-src-builder-builderpage`
  - `TRC-WM1-MAN-test-src-hooks-theme-test-VERIFIES-REQ-FP-D05`
  - `TRC-WM1-MAN-test-src-hooks-theme-test-VERIFIES-REQ-UP-010`

## Requirement Debt Burn-down
- Initial changed-scope completion gate found 3 unlinked manifestations: `useTheme`, `theme.test`, `HeaderUserIsland`.
- Final changed-scope reconcile found 0 `manifestationsLackingRequirements` and 0 `testsDisconnected` in detectors.
- Final completion gate passed for product files: `src/hooks/useTheme.ts`, `src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx`, `src/builder/BuilderPage.tsx`.
- Reconciler still queues one non-blocking candidate link for `BuilderPage` → `REQ-VR-001`; this is route-name similarity and was not accepted as WM-1 evidence.

## PO Web Check Evidence
Route: `/builder/v-1` on local Vite dev server.  
Viewports: `1440x900` and `390x844`.  
Evidence path: `docs/plans/active/frontend-polish-implementation-v0.3.5/output/evidence/WM-1-theme-toggle/`

Observed states from Playwright normal pointer clicks:
- Initial: `theme=dark`, `classList.dark=true`, stored `"dark"`.
- Desktop after click: `theme=light`, `classList.dark=false`, stored `"light"`.
- Desktop after reload: `theme=light`, `classList.dark=false`, stored `"light"`.
- Mobile after click: `theme=dark`, `classList.dark=true`, stored `"dark"`.
- Mobile after reload: `theme=dark`, `classList.dark=true`, stored `"dark"`.

Screenshots:
- `desktop-light-persisted.png`
- `mobile-dark-persisted.png`

## Gates
- `npm run typecheck` — PASS
- `npm run test -- src/hooks/theme.test.ts` — PASS (3 tests)
- `npm run lint` — PASS
- `npm run test` — PASS (11 files, 82 tests)
- `npm run validate:architecture` — PASS
- `bash scripts/verify.sh` — PASS
- `npm run req:folder-index` — PASS
- `npm run req:validate` — PASS with existing warning `QST-VR-011`
- `npm run req:reconcile -- --mode changed -- --files src/hooks/useTheme.ts,src/hooks/theme.test.ts,src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx,src/builder/BuilderPage.tsx` — PASS
- `npm run req:completion-gate -- --changed src/hooks/useTheme.ts,src/builder/islands/HeaderUserIsland/HeaderUserIsland.tsx,src/builder/BuilderPage.tsx` — PASS

## Notes
- Including `src/hooks/theme.test.ts` in `req:completion-gate --changed` marks its own `verifies` trace links stale by design. The product-file completion gate passed, and the focused test run is recorded in the test trace evidence.
