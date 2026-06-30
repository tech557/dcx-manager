# UX2-R3 — Visual System Synthesis
Date: 2026-06-26 | Agent: opencode

## Session Environment

```
repository_version: v0.3.2
package_version: 0.2.0
active_plans: []
code_index_stale: true (1124 min)
mcp_operational: [eslint]
verify.sh: pass
R1 output: OK (docs/plans/drafted/ux-discovery-v2/output/UX2-R1-token-status.md)
R2 output: OK (docs/plans/drafted/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md)
```

## P1 completion status

| Metric | Pre-P1 | Post-P1 | Delta |
|--------|--------|---------|-------|
| Raw hex values | 269 | 26 occurrences (14 unique) | -243 (90.3% reduction) |
| Token gaps remaining | N/A | 6 | — |
| Dead tokens (exported, unused) | N/A | 4 | — |

What P1 claimed vs what the scan shows:

P1 claimed 0 raw hex values remaining (its primary target was `#75E2FF`, status hexes, and `text-[Npx]` classes) — this is correct. Those specific patterns are fully eliminated. However, 26 raw hex occurrences remain as Tailwind arbitrary values for surface/dark backgrounds (e.g., `bg-[#0d0d0e]`, `bg-[#121212]`) that P1's CSS vars exist for but were never applied to the JSX. Additionally, 6 hex values have no corresponding token at all. P1 also left 4 dead token exports and 3 newly dead CSS classes (from component refactors since the expired UX-R2 audit).

## Remaining token work (folder-structure-v2 P1)

1. **Add missing surface tokens** — 6 hex values have no token:
   - `#0a0a0d` → add `color.dark.deepest` to tokens.ts + CSS var
   - `#0e0f12` → add `color.dark.deepestAlt` to tokens.ts + CSS var
   - `#161617` → add `color.dark.surface` to tokens.ts + CSS var
   - `#241113` → add `color.status.error.deepBg` to tokens.ts + CSS var
   - `#55c2df` → add `color.accent.variant` to tokens.ts + CSS var
   - `#006080` → add `color.accent.deep` to tokens.ts + CSS var
   - Files affected: `src/brand/tokens.ts`, `src/brand/index.css`
   - Acceptance: `grep -rn '#0a0a0d\|#0e0f12\|#161617\|#241113\|#55c2df\|#006080' src/ --include="*.tsx" | wc -l` = 0

2. **Replace 26 remaining raw hex values with CSS vars** — apply existing surface CSS vars (`var(--theme-surface-deep)`, `var(--theme-dropdown-bg)`, `var(--theme-glass-bg)`, etc.) to Tailwind arbitrary classes:
   - Files affected: 22 files listed in UX2-R1 §3b
   - Specific replacements: `bg-[#050506]` → `bg-[var(--theme-surface-deep)]`, `bg-[#0d0d0e]` → `bg-[var(--theme-glass-bg)]`, etc.
   - Acceptance: `grep -rn 'bg-\[#[0-9A-Fa-f]\{3,8\}\]' src/ --include="*.tsx" | wc -l` = 0

3. **Remove 3 newly dead CSS classes from index.css:**
   - `.readiness-badge`, `.editor-toggle-btn`, `.editor-toggle-btn-active`
   - Files affected: `src/brand/index.css`
   - Acceptance: `grep -rn 'readiness-badge\|editor-toggle-btn' src/ --include="*.tsx" | wc -l` = 0

4. **Remove 4 dead token exports from tokens.ts:**
   - `typographyTokens` (CSS vars used directly via `var(--text-*)`), `radiusTokens`, `shadowTokens` — never imported
   - `blurTokens` — keep (used via `brandTokens.blur.heavy`)
   - Files affected: `src/brand/tokens.ts`
   - Acceptance: `grep -rn 'typographyTokens\|radiusTokens\|shadowTokens' src/ --include="*.ts" --include="*.tsx" | grep -v "brand/tokens" | wc -l` = 0

## Remaining visual duplication (folder-structure-v2 P2)

| Group | Components | Recommended resolution |
|-------|------------|----------------------|
| Pill-shaped elements | `.island-toggle`, `.channel-pill`, `.field-indicator`, inline buttons, FocusIsland toggle | Extract `<Chip>` atom with `size` (sm/md) + `variant` (accent/neutral/ghost) + `active` props |
| Glass card surface | `GlassSurface.tsx`, `BuilderIslandShell`, `StickyPopupShell`, `PopoverShell`, island headers | Extend `GlassSurface` with `radius` and `intensity` variants — replace manual `.glass` class in 9 files |
| Status / Badge display | `StatusBadge`, `LockBadge`, `StatusDropdownBadge`, `PhaseReadinessBadge` | Merge into `<Badge>` atom with `variant` (status/readiness/lock) + `size` (xs/sm) + `color` props |
| Input elements | 7 variants: TextInputSmall, TextInputLarge, TextInputInline, DualInput, ListInputLines, SpecsInput, DateInputTBD | Extract `<Input>` atom with `size` + `variant` props; compound inputs wrap the base |
| Toggle / Tab groups | PhaseEditorSection toggle, ViewTabSwitcher, FocusIsland toggle, IslandToggleButton | Extract `<ToggleGroup>` atom with `items` + `value` + `onChange` props |

## Dead CSS cleanup (folder-structure-v2 P1)

3 dead classes to delete from `src/brand/index.css`:
- `.readiness-badge` — `grep -rn "readiness-badge" src/ --include="*.tsx" | wc -l` = 0
- `.editor-toggle-btn` — `grep -rn "editor-toggle-btn" src/ --include="*.tsx" | wc -l` = 0
- `.editor-toggle-btn-active` — same as above

## Rejected approaches (do not re-propose in folder-structure-v2)

- **CSS modules**: Rejected by `src-structure-refactor` plan. This project is Tailwind-first. Introducing CSS modules adds build complexity (import syntax, className bindings, PostCSS overhead) with minimal benefit. The correct approach is: delete dead classes, convert single-owner classes to co-located Tailwind in JSX, keep global CSS only for the 9 truly shared classes.
- **Full StageContext split**: Rejected as too risky. 28 values, too many consumers. Only drag state extraction is safe for the current phase.

## folder-structure-v2 P1 task list

1. Add 6 missing tokens to `src/brand/tokens.ts` and `src/brand/index.css` (surface-dark, surface-dark-alt, surface-mid, error-deep-bg, accent-variant, accent-deep)
2. Replace 26 raw hex Tailwind arbitrary values with CSS var references across 22 files
3. Delete 3 dead CSS classes from `src/brand/index.css`
4. Remove 3 dead token exports (`typographyTokens`, `radiusTokens`, `shadowTokens`) from `src/brand/tokens.ts`; keep `blurTokens` (indirect consumer via `brandTokens`)
5. Run `npm run typecheck` and `bash scripts/verify.sh` after all token replacements

## folder-structure-v2 P2 task list

1. Merge `TextInputSmall`, `TextInputLarge`, `TextInputInline` into a single `<Input>` atom with `size` prop; refactor `DualInput`, `ListInputLines`, `SpecsInput` to wrap it
2. Merge `StatusBadge`, `LockBadge`, `StatusDropdownBadge`, `PhaseReadinessBadge` into a single `<Badge>` atom with `variant` + `size` + `color` props
3. Extract `<ToggleGroup>` atom from `PhaseEditorSection` toggle, `ViewTabSwitcher` tabs, and `IslandToggleButton`
4. Extract `<Chip>` atom from `.island-toggle`, `.channel-pill`, `.field-indicator`, and inline pill buttons
5. Extend `GlassSurface` with `radius` and `intensity` variants; replace `.glass` class usage in 9 files with the extended component

## Acceptance criteria

- [x] Synthesis uses only UX2-R1 and UX2-R2 outputs — no new source file reads
- [x] P1 completion status includes the before/after hex count and 90.3% reduction
- [x] folder-structure-v2 task lists are numbered, specific, and each has a runnable acceptance criterion
- [x] Rejected approaches section present with CSS modules listed and reason given
- [x] Output written to `docs/plans/drafted/ux-discovery-v2/output/UX2-R3-synthesis.md`
- [x] No source files changed
