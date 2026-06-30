# P1 — Design Token System Output

Date: 2026-06-26
Agent: Codex
Version: v0.3.2
Status: Partial — implementation complete; one stale numeric acceptance target requires PO correction

## Work completed

- Promoted `src-structure-refactor` from `drafted/` to `active/`.
- Added typography, accent-opacity, status, surface, radius, and alpha tokens in `src/brand/tokens.ts`.
- Added matching CSS custom properties for both theme modes.
- Replaced 269 raw accent hex usages across TypeScript and TSX consumers.
- Replaced raw accent/status rgba values with canonical CSS variables.
- Replaced all arbitrary `text-[Npx]` classes with typography variables.
- Removed all 48 CSS selectors identified as dead by the P1 source analysis.
- Updated affected unit-test expectations.
- Resolved the canvas-gradient incompatibility discovered during browser validation by resolving the CSS variable to a computed color before passing it to Canvas 2D.

## Acceptance results

| Check | Result |
|---|---|
| Raw `#75E2FF` in TS/TSX | PASS — 0 |
| Raw accent rgba in TS/TSX | PASS — 1 fallback in Canvas integration, within the ≤5 allowance |
| Raw status hex values in TS/TSX | PASS — 0 |
| Arbitrary `text-[Npx]` classes | PASS — 0 |
| Confirmed dead selectors remaining | PASS — 0 |
| `typographyTokens` export | PASS |
| `alpha()` utility | PASS |
| Typecheck | PASS |
| Unit tests | PASS — 27/27 |
| Build | PASS |
| `verify.sh` | PASS |
| Fresh browser load | PASS — builder rendered, 0 console warnings/errors |
| `src/brand/index.css` below 180 lines | FAIL — 714 lines |

## Stale metric finding

P1 documented the stylesheet baseline as approximately 400 lines. The actual baseline at execution was 1,000 lines. Removing the confirmed dead selectors reduced it to 714 lines. Reaching fewer than 180 lines would require deleting live rules or moving/minifying CSS solely to satisfy a line-count estimate, so that operation was not performed.

Recommended correction before closing P1:

- Replace the `<180 lines` criterion with `all 48 confirmed dead selectors removed`.
- Record the measured reduction: `1,000 → 714` lines.

## Gate notes

- Vitest reported an environment-level WebSocket bind warning for `0.0.0.0:24678`; all six test files and 27 tests still passed.
- Build retains pre-existing dynamic/static import and bundle-size warnings; no build errors were introduced.

## Next action

PO or plan owner should approve the corrected stylesheet metric. Once accepted, change P1 and its session log from `Partial` to `Completed`; P2 must not start before that acceptance is recorded.
