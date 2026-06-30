# CC-6 Output — Stage + Island Light Surfaces

Sprint: CC-6 | Plan: frontend-polish-implementation-v0.3.5 | Version: v0.3.5
Executor: Claude (claude-sonnet-4-6) | Date: 2026-06-30 | Status: Completed

---

## Scope delivered

Consumed CT-1 tokens so the Stage canvas and row-1/row-3 islands switch fully to light surfaces in light theme. Depends on WM-1 + CT-1 (both completed).

## Files touched

- `src/brand/styles/components.css` — `.builder-canvas` background changed from `var(--theme-component-surface-deep)` (always `rgb(13,13,14)`) to `var(--theme-surface-deep)` (light `#FAF9F6`, dark `#050506`). One-line surgical fix; no other rules changed.
- `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` — Added `useTheme` import; `isDark` used to theme the expanded-state "Controls" heading (`text-[var(--theme-text-primary)]` in light vs `text-white/95` in dark) and all three vertical dividers (`bg-black/10` in light vs `bg-white/10` in dark).

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-FP-D05, REQ-IFX-001 |
| Scope/type | frontend / ui-presentation |
| States before | MAN-function-src-brand-styles-components: `delivery: not-assessed`; MAN-react-component-src-builder-islands-kanbanbuilderisland: `delivery: not-assessed` |
| States after | Both → `delivery: implemented` |
| TRC links created | TRC-CC6-REQ-FP-D05-TO-MAN-function-src-brand-styles-components (implements, partial); TRC-CC6-REQ-IFX-001-TO-MAN-react-component-kanbanbuilderisland (implements, partial) |
| Expected manifestation categories | EMC-IFX-SEED |
| Actual manifestations confirmed | MAN-function-src-brand-styles-components (components.css canvas fix); MAN-react-component-src-builder-islands-kanbanbuilderisland (island content theming) |

## Why this was the right fix

`--theme-component-surface-deep` is `rgb(13,13,14)` in **both** light and dark themes — it was designed for the always-dark builder glass system, not for theme-aware canvas backgrounds. Switching `.builder-canvas` to `--theme-surface-deep` (already correctly set to `#FAF9F6` light / `#050506` dark by CT-1) was the minimal one-token change needed. The island shells were already theme-aware via `island-shell` CSS class using `--theme-glass-bg` and `BuilderIslandShell.tsx` using `isDark` — only the canvas background and KanbanBuilderIsland inner labels were unthemed.

## Debt Burn-down

| Metric | Before | After |
|---|---|---|
| Requirements lacking manifestations | 256 | 255 |
| Changed-scope manifestationsLackingRequirements | 1 | 0 |
| Candidate links needing confirmation (global) | 7 | 7 (unchanged; CC-6 new TRCs are skill-derived/confirmed) |

## Gates

- typecheck ✅
- lint ✅
- test(85) ✅ (no targeted test for CSS surface token; full suite green)
- architecture(274 modules) ✅
- req:validate ✅ (QST-VR-011 pre-existing)
- req:completion-gate --changed ✅ PASS

## Browser Proof

Preview MCP + node/playwright screenshot (clean port 3000):
- `/builder/v-1`, light theme (`.dark` removed), 1440×900 and 390×844
- `#builder-canvas` computed `background-color: rgb(250, 249, 246)` = `#FAF9F6` ✅
- 0 console errors ✅
- No dark canvas/island patches visible ✅ — canvas is warm cream, glass islands are white-glass, cards sit on light surface

Evidence: `output/evidence/CC-6-light-surfaces/builder-light-1440.png`, `builder-light-390.png`

## PO Web Check — PENDING

Real-pointer test: theme toggle in builder header → switch to light → inspect stage canvas + islands. Expected: no dark split-render patches on canvas or island shells. Evidence path: `output/evidence/CC-6-light-surfaces/`.

Note: `KanbanBuilderIsland` expanded inner buttons (`InlineIslandButton`) retain dark-pill styling (`bg-neutral-950/75`) — these are interactive controls designed to contrast against any surface and are not "dark patches" per the surface-level scope. PO may flag for follow-up if needed.
