# UX-R3: Style Pattern Synthesis

Generated: 2026-06-26
Based on: UX-R1-token-inventory.md, UX-R2-component-css-map.md

---

## Final Token Set for P1

### Colour tokens to add

| Token name | Value | Usage count | Net new? | Priority |
|---|---|---|---|---|
| color.surface.deepBg | #050506 | 3 | New | recommended |
| color.surface.dropdown | #121212 | 2 | New | recommended |
| color.surface.alternate | #0c0d0f | 2 | New | recommended |
| color.accent.glow.strong | rgba(117,226,255,0.5) | 3 | New | recommended |
| color.accent.glow.medium | rgba(117,226,255,0.3) | 6+ | New | required |
| color.accent.glow.soft | rgba(117,226,255,0.25) | 5+ | New | required |
| color.accent.bg | rgba(117,226,255,0.2) | 4 | New | recommended |
| color.accent.borderLight | rgba(117,226,255,0.08) | 3 | New | recommended |
| color.status.error | #FF7575 | 2 | New | required |
| color.status.error.alt | #FF6464 | 2 | New | required |
| color.status.error.bg | rgba(255,117,117,0.12) | 1 | New | recommended |
| color.status.warning | #F8C458 | 2 | New | required |
| color.status.warning.bg | rgba(248,196,88,0.2) | 1 | New | recommended |
| color.status.success | #10B981 or rgb(52,211,153) | 2+ | New | required |
| color.status.success.bg | rgba(16,185,129,0.2) | 2 | New | recommended |
| color.info | rgba(56,189,248,0.7) | 1 | New | recommended |
| color.info.bg | rgba(56,189,248,0.1) | 4 | New | recommended |
| color.dark.mutedAlt | rgba(13,13,14,0.45) | 1 | New | recommended |

Note: Many rgba accent variants (0.01 through 0.5 opacity) appear 1× each and should NOT get individual tokens. Use a `color.accent.withOpacity()` utility function instead — P1 should create a helper `alpha(hex, opacity)` that generates `rgba(r,g,b,opacity)` dynamically.

### Typography tokens to add

**Full font-size token set (P1 must create a `typographyTokens` system):**

| Token name | Value (px) | Value (rem) | Usage count | Priority |
|---|---|---|---|---|
| text-4xs | 7px | 0.4375rem | 4 | recommended |
| text-3xs | 8px | 0.5rem | 27 | required |
| text-3xs+ | 8.5px | 0.53125rem | 13 | recommended |
| text-2xs | 9px | 0.5625rem | 65 | required |
| text-2xs+ | 9.5px | 0.59375rem | 7 | recommended |
| text-xs | 10px | 0.625rem | 81 | required |
| text-xs+ | 10.5px | 0.65625rem | 7 | recommended |
| text-sm | 11px | 0.6875rem | 43 | required |
| text-md | 12px | 0.75rem | 3 | optional |
| text-md+ | 13px | 0.8125rem | 3 | optional |
| text-base | 15px | 0.9375rem | 3 | optional |

**CSS font-size values in index.css to replace with tokens:**

| Value | Usage count | Proposed token |
|---|---|---|
| 0.65rem | 1 | — (one-off, inline) |
| 0.7rem | 3 | text-3xs+ |
| 0.72rem | 2 | — (one-off) |
| 0.75rem | 2 | text-md |
| 0.78rem | 4 | text-sm |
| 0.82rem | 1 | — (one-off) |
| 0.85rem | 3 | text-xs |
| 0.86rem | 1 | — (one-off) |
| 0.9rem | 2 | text-md+ |
| 1rem | 1 | text-base |
| 1.05rem | 1 | — (one-off) |

### Spacing tokens to add (used 5+ times)

| Token name | Value | Usage count | Priority |
|---|---|---|---|
| space-1 | 0.25rem | 3 | recommended |
| space-1.5 | 0.35rem | 4 | recommended |
| space-2 | 0.5rem | 9 | required |
| space-3 | 0.75rem | 6 | required |
| space-4 | 1rem | 7 | required |
| space-5 | 1.25rem | 1 | optional |
| space-6 | 1.5rem | 5 | required |
| space-8 | 2rem | 1 | optional |

### Radius tokens to add

| Token name | Value | Usage count | Net new? | Priority |
|---|---|---|---|---|
| radiusTokens.md | rounded-md (0.375rem) | 22 | New | required |
| radiusTokens.2xl | rounded-2xl (1rem) | 17 | New | required |

CSS `border-radius` values to reconcile with radius tokens:
| Value | Usage count | In radiusTokens? | Action |
|---|---|---|---|
| 999px | 15 | radiusTokens.pill | Already covered |
| 1rem | 2 | — | Maps to rounded-lg (radiusTokens.sm = 0.5rem?) — possible inconsistency |
| 1.5rem | 2 | — | Gap — no token |
| 1.4rem | 1 | — | Gap |
| 0.8rem | 1 | — | Gap |
| 0.85rem | 1 | — | Gap |
| 0.75rem | 1 | — | Gap |
| 0.6rem | 1 | — | Gap |
| 0.5rem | 1 | — | Maps to rounded-lg |

### Tokens already in tokens.ts that need CSS var bridging

These values have a token but JSX still uses raw values instead of CSS vars:

| Value | Token exists | Raw usage count | What to do |
|---|---|---|---|
| rgba(117,226,255,0.15) | colorTokens.dark.selectedGlow | 12 | Replace with `var(--theme-selected-glow)` — needs a new CSS var in :root |
| #75E2FF | colorTokens.accent | 269 | Replace with `var(--theme-accent)` — most-used value in the codebase |

### Tokens in tokens.ts that are unused in JSX/CSS

| Token | Value | Used? |
|---|---|---|
| colorTokens.light.base | #FFFFFF | Used via CSS var --theme-text-primary (light) — keep |
| colorTokens.light.glass | rgba(255,255,255,0.75) | Matches --theme-glass-bg (light) — keep |
| blurTokens.light | backdrop-blur-md | Not greppable in className |
| springTokens | (all) | Used in framer-motion config — keep |

All tokens in `tokens.ts` are referenced. No dead tokens.

---

## Design Inconsistencies — PO Decision Required

### 1. Border radius conflict: `.card-shell` vs `PhaseCard` vs `GlassSurface`

- `.card-shell` (dead CSS in index.css): `border-radius: 2.2rem`
- `radiusTokens.card`: `rounded-[2.2rem]`
- `PhaseCard.tsx` JSX: uses `rounded-2xl` (`1rem`)
- `GlassSurface.tsx`: conditionally uses `rounded-[2rem]` or `rounded-[1.6rem]`

**Conflict**: "Card" radius is 2.2rem in the token but PhaseCard uses 1rem. Is the token value the intended card radius? Or did PhaseCard intentionally use a smaller radius?

**Recommendation**: Adopt `radiusTokens.card` (2.2rem) as the canonical "card" radius. PhaseCard should use the token. GlassSurface's 2rem should either align to 2.2rem (card) or 1.6rem (panel).

### 2. Font-size system: px vs rem

- All TSX components use `text-[Npx]` Tailwind arbitrary classes (9px, 10px, 11px...)
- `index.css` uses `font-size: 0.78rem, 0.85rem, 0.7rem...`
- These two systems partially overlap but do not match

**Conflict**: 10px = 0.625rem but 0.85rem = 13.6px. Same logical size (small text) uses different values depending on whether the style is in TSX or CSS.

**Recommendation**: Convert ALL font sizes to rem-based tokens. The px→rem mapping in UX-R1 is the starting point. The typography token scale becomes the single source of truth.

### 3. Accent colour opacity proliferation

UX-R1 found 23 unique rgba variants of #75E2FF (opacity ranging from 0.01 to 1.0). Many are one-offs used in specific contexts.

**Conflict**: Is every opacity variant intentional, or is this drift? The 0.15 opacity variant (selectedGlow) has a token and 12 uses. The 0.08 variant has 3 uses. But 0.034, 0.065, 0.12 each have 1 use.

**Recommendation**: Define a canonical opacity scale: `0.08 (subtle) → 0.15 (soft) → 0.2 (bg) → 0.3 (medium) → 0.5 (strong) → 1.0 (full)`. Anything outside this scale is likely drift. P1 should create a `color.accent.withOpacity(level)` utility.

### 4. Naming conflict: "sm" radius token

- `radiusTokens.sm` = `rounded-lg` (0.5rem / 8px)
- Tailwind's `rounded-sm` = 0.125rem / 2px
- Tailwind's `rounded` = 0.25rem / 4px
- Tailwind's `rounded-md` = 0.375rem / 6px
- Tailwind's `rounded-lg` = 0.5rem / 8px

**Conflict**: `radiusTokens.sm` uses the Tailwind `rounded-lg` value, which is confusing. "sm" → "lg" is a naming mismatch.

**Recommendation**: Rename `radiusTokens.sm` to `radiusTokens.lg` to match Tailwind conventions, or use semantic names (`radiusTokens.input`).

---

## Component Extraction Priority for P2

### Tier 1 — Extract immediately (single owner, clear home)

| Class | Current owner | Move to | Risk |
|---|---|---|---|
| .kanban-board | KanbanView.tsx | KanbanView.module.css | Low |
| .kanban-phase-column | KanbanView.tsx | KanbanView.module.css | Low |
| .kanban-builder-island | KanbanBuilderIsland.tsx | KanbanBuilderIsland.module.css | Low |
| .island-shell | KanbanBuilderIsland, SelectionIsland, TimelineBuilderIsland | BuilderIslandShell.module.css | Low |
| .readiness-badge | PhaseReadinessBadge.tsx | PhaseReadinessBadge.module.css | Low |
| .phase-card-header | PhaseCard.tsx | PhaseCard.module.css | Low |
| .metadata-island | MetadataIsland.tsx | MetadataIsland.module.css | Low |
| .metadata-view-tabs | ViewTabSwitcher.tsx | ViewTabSwitcher.module.css | Low |
| .field-indicator | FieldIndicator.tsx | FieldIndicator.module.css | Low |
| .field-indicator-popup | FieldIndicator.tsx | FieldIndicator.module.css | Low |
| .editor-island | EditorViewerIsland.tsx | EditorViewerIsland.module.css | Low |
| .editor-toggle-btn/-active | PhaseEditorSection.tsx | PhaseEditorSection.module.css | Low |
| .drop-target | DropTarget.tsx | DropTarget.module.css | Low |
| .channel-pill | ChannelPill.tsx | ChannelPill.module.css | Low |
| .card-template-header | DayCard.tsx | DayCard.module.css | Low |
| .card-template-meta | DayCard.tsx | DayCard.module.css | Low |
| .action-card-header | ActionCard.tsx | ActionCard.module.css | Low |
| .builder-stage-main | BuilderPage.tsx | BuilderPage.module.css | Low |
| .builder-stage-area | BuilderPage.tsx | BuilderPage.module.css | Low |
| .builder-editor-panel | BuilderPage.tsx | BuilderPage.module.css | Low |
| .builder-canvas | BuilderPage, BuilderLoadingShell | BuilderPage.module.css | Low (shared) |

**Tier 1 subtotal: 21 classes across ~15 component files**

### Tier 2 — Extract with shared atom (multiple users, shared design DNA)

| Classes | Unification atom | Consumers |
|---|---|---|
| `.glass` + `.glass-light` + `.glass-dark` + `.glass-glow` + `.glass-active` | `<GlassSurface variant>` | 14 files (islands, cards, surfaces) |
| `.dark` (22 files) + theme context | CSS var system (already exists via `--theme-*`) | 22 files |
| `.expanded` (23 files) | BuilderIslandShell state prop | 23 files — already controlled via `ShellState.expanded` |
| `.header-container-floating` + `.header-island-pill` | `<HeaderIslandPill>` atom | MetadataIsland only → Tier 1 candidate |
| `.kanban-task-drop` + `.kanban-stage-drop` + `.kanban-column-drop` | `<DropTarget>` | KanbanHiddenDropzones → already uses DropTarget internally |
| `.stage-phase-column` + `.stage-phase-row` + `.stage-action-stack` + `.stage-smoke-meta` | `<SmokeStage>` sub-components | SmokeStage → Tier 1 if separated |

### Tier 3 — Decision required before extracting

| Classes | Conflict | Decision needed |
|---|---|---|
| `.card-shell` (dead) vs CardShell.tsx (Tailwind) | CardShell component uses Tailwind, not the CSS class | Should CardShell adopt `.card-shell` CSS? Or delete the dead CSS? |
| `.editor-toggle-group` (dead) vs inline toggle in PhaseEditorSection | Inline Tailwind for toggle instead of CSS class | Is the .editor-toggle-group design what we want, or should we keep the inline version? |
| `.phase-card-badge`/`-badges` (dead) vs inline badge in PhaseCard | Badges are inline toggles, not CSS classes | Do we want CSS class-based badges or keep inline? |
| `.metadata-version-name`/`-status` (dead) vs StatusDropdownBadge | These were planned but never wired | Should P2 wire them or delete the CSS? |
| `.readiness-badge-*` (dead, 3 variants) vs PhaseReadinessBadge inline | PhaseReadinessBadge uses inline color classes, not CSS | Should readiness states be CSS classes or inline utility strings? |

---

## Dead CSS Classes — Safe to Delete

### Safe to delete (no reference in any TSX/TS file)
All 48 classes with 0 usages are safe to delete. None are used dynamically. These fell into 3 categories:

**1. Unused utility classes (never wired to a component):**
`.card-shell-*` (6 classes), `.stage-tab*` (3), `.editor-island-*` (3), `.editor-toggle-group`, `.kanban-builder-tools`, `.kanban-task-list`, `.kanban-action-*` (2), `.phase-card-*` (5), `.readiness-badge-*` (3), `.metadata-version-*` (2), `.action-card-*` (3), `.action-empty-state`, `.action-task-list`, `.builder-*` (3), `.task-card-*` (3), `.status-pill-subtle`, `.glass-active`, `.woff`, `.ai-entry`, `.phase-density`, `.builder-tool-button`, `.focus-island-floating`, `.stage-view`, `.stage-toolbar`, `.stage-shell`, `.stage-phase-card`, `.card-template-description`, `.editor-empty`, `.task-field-row`

**2. Already replaced by Tailwind equivalents:**
`.card-shell` — CardShell component uses Tailwind utilities. Safe to delete.
`.builder-heading`, `.builder-workspace` — Layout handled by Tailwind grid.

**3. Font face definition:**
`.woff` — font-face definition artifact, not a visual class. Keep during P1, delete in P2 if fonts are migrated.

**Action for P2**: Delete all 48 classes from `index.css` in P2 sprint 1. The file will shrink significantly.

---

## Responsive Design Gap

### Components with responsive behaviour: 8 of ~110 TSX files (7%)

**Files with breakpoint-aware CSS:**
- `src/builder/stage/StageCore.tsx` — `md:pr-4` on stage container
- `src/builder/cards/CardShellContent.tsx` — `md:p-5` on card content
- `src/builder/cards/templates/phase/PhaseCard.tsx` — `md:max-w-[210px]`
- `src/builder/cards/templates/action/ActionCard.tsx` — `md:max-w-[220px]`
- `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` — `xs:/sm:/max-w` chain
- `src/builder/islands/MetadataIsland/StatusDropdownBadge.tsx` — `lg:text-sm`
- `src/builder/islands/MetadataIsland/CampaignDetailsGroup.tsx` — `lg:text-lg`
- `src/ui/LockBadge.tsx` — `md:inline` to show label on wider screens

**Patterns found:** Only Tailwind breakpoint prefix classes (sm:, md:, lg:). No `@media` queries, no CSS `@media` blocks, no container queries. All responsive tweaks are width-constraint changes (max-w, text-size, padding). No structural layout changes at breakpoints.

**Breakpoints used:**
- xs (375px): 1 file
- sm (640px): 1 file  
- md (768px): 5 files
- lg (1024px): 2 files

### Minimum responsive contract recommendation

**Recommendation: Desktop-only (1440px+).** The current codebase has only 7% of files with any responsive behaviour, and those are cosmetic width adjustments (max-width, font-size). The three-row builder layout is documented as frozen (§10) and designed for a 1440px canvas. Adding responsive support for <1024px would require a fundamentally different layout strategy.

If the PO decides responsive is needed:
- Target minimum: 1024px (standard tablet landscape)
- Below 1024px: hidden builder islands or collapsed layout
- All new components starting P2 should use `lg:` prefix as their smallest target

---

## PO Decisions Required Before P2 Starts

☐ **Border radius conflict**: Is 2.2rem the canonical "card" radius, or should PhaseCard's 1rem radius win?
☐ **Font-size system**: px-based (current JSX) vs rem-based (CSS) — do we convert all to rem via typography tokens?
☐ **Accent opacity proliferation**: Canonical opacity scale (0.08, 0.15, 0.2, 0.3, 0.5, 1.0) — approve this scale?
☐ **radiusTokens.sm naming**: Rename to `radiusTokens.lg` (matching Tailwind) or keep as-is?
☐ **Tier 3 extractions**: Should P2 wire `.readiness-badge-*` CSS classes to PhaseReadinessBadge, or keep inline classes?
☐ **Tier 3 extractions**: Delete `.card-shell`-* CSS classes (CardShell uses Tailwind) or refactor CardShell to use them?
☐ **Responsive contract**: Desktop-only (1440px+) intentionally, or must it work at 1024px?
