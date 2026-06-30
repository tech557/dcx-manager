# UX2-R1 — Token Verification + Gap Analysis
Date: 2026-06-26 | Agent: opencode | Codebase state: post-P1

## Session Environment

**build-current-state.sh:**
```
repository_version: v0.3.2
package_version: 0.2.0
metadata_version: v0.3.3
active_plans: []
code_index_stale: true (1119 min)
mcp_operational: [eslint]
mcp_awaiting: [storybook, shadcn, semgrep, sonarqube]
```

**verify-tooling-state.sh:**
```
typecheck: available
lint: available
test: available
build: available
validate:architecture: available
verify.sh: pass
dependency_cruiser: available
semgrep_cli: not_installed
playwright: available
code_index: stale (1119 min)
```

## Summary

| Metric | Pre-P1 (expired baseline) | Post-P1 (this scan) | Delta |
|--------|--------------------------|---------------------|-------|
| Raw hex values | 269 | 26 raw hex occurrences across 14 unique hex values | -243 |
| Arbitrary Tailwind values | N/A | 211 unique patterns | — |
| Exported tokens | N/A | 10 exported tokens (2 unused indirectly) | — |
| Dead tokens (direct export, no import) | N/A | 4 (typographyTokens, blurTokens, radiusTokens, shadowTokens) | — |

## 3a — Remaining raw hex values (full list)

| File | Line | Value | Recommended token |
|------|------|-------|-------------------|
| `src/ui/PopoverShell.tsx` | 21 | `#050506` | `var(--theme-surface-deep)` |
| `src/ui/StickyPopupShell.tsx` | 29 | `#050506` | `var(--theme-surface-deep)` |
| `src/ui/forms/selects/SearchableSelect.tsx` | 83 | `#121212` | `var(--theme-dropdown-bg)` |
| `src/ui/forms/selects/SearchableSelectIcons.tsx` | 88 | `#121212` | `var(--theme-dropdown-bg)` |
| `src/ui/BuilderBg/LightRays.tsx` | 21 | `#ffffff` | Default param — not a color literal |
| `src/ui/BuilderBg/BuilderBg.tsx` | 17 | `#ffffff` | Default param — not a color literal |
| `src/builder/BuilderLoadingShell.tsx` | 26 | `#0d0d0e` | `var(--theme-glass-bg)` |
| `src/builder/ui/modals/ApprovalConfirmModal.tsx` | 33 | `#0d0d0e` | `var(--theme-glass-bg)` |
| `src/builder/ui/modals/quick-edit/QuickEditPopover.tsx` | 78 | `#0a0a0d` | No token exists — needs `color.dark.deepest` |
| `src/builder/cards/card.registry.ts` | 5 | `#F4C975` | `var(--theme-warning)` |
| `src/builder/cards/templates/task/TaskReadOnlyPopup.tsx` | 71 | `#0e0f12` | No token exists — needs `color.dark.deepest` |
| `src/builder/islands/BuilderIslandShell.tsx` | 54 | `#0D0D0E` | `var(--theme-glass-bg)` dark variant |
| `src/builder/islands/EditorViewerIsland/EditorSessionPill.tsx` | 19 | `#161617` | No token exists — needs `color.dark.surface` |
| `src/builder/islands/EditorViewerIsland/EditorSessionPill.tsx` | 22 | `#161617` | No token exists — needs `color.dark.surface` |
| `src/builder/islands/EditorViewerIsland/DiscardSessionModal.tsx` | 16 | `#0d0d0e` | `var(--theme-glass-bg)` |
| `src/builder/islands/EditorViewerIsland/UnsavedChangesModal.tsx` | 21 | `#0d0d0e` | `var(--theme-glass-bg)` |
| `src/builder/islands/HeaderUserIsland/HeaderUserActionsMenu.tsx` | 26 | `#0c0d0f` | `var(--theme-surface-alternate)` |
| `src/builder/islands/SelectionIsland/DeleteConfirmation.tsx` | 16 | `#241113` | No token exists — needs `color.status.error.bg` |
| `src/builder/islands/SelectionIsland/SelectionLabel.tsx` | 64 | `#55c2df` | No token exists — needs `color.accent.variant` |  `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx` | 36 | `#0d0d0e` | `var(--theme-glass-bg)` |
| `src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx` | 107 | `#050506` | `var(--theme-surface-deep)` |
| `src/builder/islands/MetadataIsland/StatusDropdownBadge.tsx` | 153 | `#0c0d0f` | `var(--theme-surface-alternate)` |
| `src/builder/islands/MetadataIsland/StatusDropdownBadge.tsx` | 159 | `#006080` | No token exists — needs `color.accent.deep` |
| `src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx` | 53 | `#0d0d0e` | `var(--theme-glass-bg)` |
| `src/builder/stage/views/KanbanView.tsx` | 94 | `#0D0D0E` | `var(--theme-glass-bg)` |
| `src/builder/stage/views/KanbanView.tsx` | 98 | `#F7F7F8` | `var(--theme-text-primary)` |

## 3b — Files with hardcoded colors

```
src/ui/PopoverShell.tsx
src/ui/StickyPopupShell.tsx
src/ui/forms/selects/SearchableSelect.tsx
src/ui/forms/selects/SearchableSelectIcons.tsx
src/ui/BuilderBg/LightRays.tsx
src/ui/BuilderBg/BuilderBg.tsx
src/builder/BuilderLoadingShell.tsx
src/builder/ui/modals/ApprovalConfirmModal.tsx
src/builder/ui/modals/quick-edit/QuickEditPopover.tsx
src/builder/cards/card.registry.ts
src/builder/cards/templates/task/TaskReadOnlyPopup.tsx
src/builder/islands/BuilderIslandShell.tsx
src/builder/islands/EditorViewerIsland/EditorSessionPill.tsx
src/builder/islands/EditorViewerIsland/DiscardSessionModal.tsx
src/builder/islands/EditorViewerIsland/UnsavedChangesModal.tsx
src/builder/islands/HeaderUserIsland/HeaderUserActionsMenu.tsx
src/builder/islands/SelectionIsland/DeleteConfirmation.tsx
src/builder/islands/SelectionIsland/SelectionLabel.tsx
src/builder/islands/MetadataIsland/MetadataFilesPopup.tsx
src/builder/islands/MetadataIsland/StatusDropdownBadge.tsx
src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx
src/builder/stage/views/KanbanView.tsx
```

## 4 — Arbitrary Tailwind values in use

211 unique patterns found. Summary by category:

| Category | Pattern example | Occurrences |
|----------|----------------|-------------|
| Typography via CSS var | `text-[var(--text-X)]` | 274 (8 patterns) |
| Accent via CSS var | `text-[var(--theme-accent)]` | 111 |
| Accent bg via CSS var | `bg-[var(--theme-accent)]` | 70 |
| Accent border via CSS var | `border-[var(--theme-accent)]` | 67 |
| Surface colors (hardcoded) | `bg-[#050506]` etc | 18 (13 files) |
| Shadows via CSS var | `shadow-[0_0_X_var(--theme-*)]` | 18 |
| Raw rgba shadows | `shadow-[0_Xpx_Ypx_rgba(...)]` | 12 |
| Raw hex colors | See 3a table | 26 |
| Layout (w-/h-/max-w-/max-h-) | `w-[260px]` etc | 40+ |
| Spacing/tracking | `tracking-[0.08em]` | 5 |
| Effects (blur, scale, opacity) | `backdrop-blur-[24px]` | 5 |
| Border radius | `rounded-[2rem]` | 5 |

Full list: see `/tmp/ux2-r1-arbitrary-3.txt`

## 5 — Token coverage

Files importing from `brand/tokens` or `tokens`:

```
src/builder/islands/BuilderIslandShell.tsx
src/store/appStore.ts
src/ui/motion/effects.registry.ts
src/ui/motion/motion.config.ts
```

Exported token names (10 total):

| Export | Kind | Used (files) | Via brandTokens? |
|--------|------|-------------|-----------------|
| `ThemeMode` | type | 3 | N/A |
| `colorTokens` | const | 2 | ✓ |
| `typographyTokens` | const | 0 | No |
| `blurTokens` | const | 0 | Yes (BuilderIslandShell) |
| `radiusTokens` | const | 0 | No |
| `shadowTokens` | const | 0 | No |
| `shadowStyleTokens` | const | 1 | ✓ |
| `springTokens` | const | 1 | Yes (via brandTokens) |
| `brandTokens` | const | 1 | N/A |
| `alpha` | fn | 1 | N/A |

## 6 — Dead tokens (exported, never used)

| Token | Reason | Action |
|-------|--------|--------|
| `typographyTokens` | Exported but never imported. CSS vars (`--text-xs` etc) ARE used via `var(--text-xs)` but the object is dead code. | Candidate for removal in folder-structure-v2 P1. Consumers use CSS vars directly. |
| `radiusTokens` | Exported but never imported. Tailwind classes like `rounded-lg`, `rounded-full` are used inline, not via the token object. | Candidate for removal in folder-structure-v2 P1. |
| `shadowTokens` | Exported but never imported. Shadow values are used via CSS classes and arbitrary `shadow-[...]` values. | Candidate for removal in folder-structure-v2 P1. |
| `blurTokens` | Never directly imported, but IS used via `brandTokens.blur.heavy` in BuilderIslandShell.tsx. | Keep — has one consumer through brandTokens. |

Note: These tokens define CSS variable names (like `var(--text-xs)`) and Tailwind classes that ARE in use. The objects themselves are dead exports, but their *values* (the CSS variable definitions in index.css) are actively used.

## Token gaps (hardcoded values with no token equivalent)

| Value | Occurrences | Gap |
|-------|-------------|-----|
| `#0a0a0d` | 1 (QuickEditPopover) | No surface token — needs `color.dark.deepest` |
| `#0e0f12` | 1 (TaskReadOnlyPopup) | No surface token — needs `color.dark.deepestAlt` |
| `#241113` | 1 (DeleteConfirmation) | No status token — needs `color.status.error.deepBg` |
| `#55c2df` | 1 (SelectionLabel hover) | No accent variant token — needs `color.accent.variant` |
| `#006080` | 1 (StatusDropdownBadge light mode active) | No accent token — needs `color.accent.deep` |
| `#161617` | 2 (EditorSessionPill) | No surface token — needs `color.dark.surface` |

## P1 completion status

**P1 claimed (from P1-design-tokens-output.md):**
| Check | Claimed result |
|-------|---------------|
| Raw `#75E2FF` in TS/TSX | 0 — PASS |
| Raw accent rgba in TS/TSX | ≤5 — PASS (1 fallback in Canvas) |
| Raw status hex (#FF7575 etc) | 0 — PASS |
| Arbitrary `text-[Npx]` classes | 0 — PASS |
| Dead CSS selectors removed | 48 — PASS |
| `typographyTokens` export | Exists — PASS |
| `alpha()` utility | Exists — PASS |

**This scan confirms:**
- `#75E2FF` in TS/TSX: **0** ✓
- `#FF7575` / `#FF6464` / `#F8C458` in TS/TSX: **0** ✓
- `text-[Npx]` in TS/TSX: **0** ✓
- Raw accent rgba `rgba(117,...)`: **1** (LightRays.tsx fallback) ✓ (P1 ≤5 allowance)
- Dead CSS selectors: **0 remaining** ✓
- `typographyTokens` export: exists ✓
- `alpha()` utility: exists ✓

**Gap not claimed by P1:**
- 26 raw hex occurrences (14 unique hex values) remain as Tailwind arbitrary values in background/border/text colors — these are surface and accent variant colors, not `#75E2FF` or status hexes
- 23 raw rgba values in components (non-accent, non-`var(--...)` references) — mostly in shadows, glass effects, and repeating gradient patterns
- 4 dead token exports (typographyTokens, radiusTokens, shadowTokens, blurTokens — though blurTokens has one indirect consumer via brandTokens)
- 6 hex values have no corresponding token (see "Token gaps" above)

## Acceptance criteria

- [x] Raw hex count is grep-verified (exact number: 26 occurrences, 14 unique hex values)
- [x] Full file list with line numbers for all hardcoded colors
- [x] Arbitrary Tailwind count is full (211 unique patterns, no `head` truncation)
- [x] Dead token list populated (4 dead, 1 with indirect consumer)
- [x] P1 completion status is a quantified before/after comparison
- [x] Output written to `output/UX2-R1-token-status.md`
- [x] No source files changed
