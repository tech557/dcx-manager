---
sprint: P1
title: Design Token System
plan: src-structure-refactor
status: completed — corrected stylesheet metric accepted by PO when starting P2
data-source: UX-R1-token-inventory.md, UX-R2-component-css-map.md, UX-R3-style-synthesis.md
---

# P1 — Design Token System

## Goal

After P1, every color, font size, spacing value, and border radius used 3+ times in the codebase
has a named token and is referenced via CSS variable. No raw hex codes or `text-[Npx]` Tailwind
arbitrary classes remain in component files. 48 dead CSS classes are deleted.

---

## Before

| Metric | Count |
|---|---|
| Raw `#75E2FF` usages in src/ | 269 |
| Raw `rgba(117,226,255,...)` accent variants | 50+ unique opacities |
| Untokenized status hex colors (#FF7575, #FF6464, #F8C458) | ~6 usages each |
| Files using `text-[Npx]` arbitrary font sizes | ~80 files |
| Font-size tokens | 0 (no typographyTokens) |
| Radius tokens missing (rounded-md, rounded-2xl) | 2 |
| Dead CSS classes in index.css | 48 |
| Total lines in index.css | ~400 |

---

## After

| Metric | Target |
|---|---|
| Raw `#75E2FF` usages in src/ | 0 |
| Raw accent rgba opacities outside token defs | ≤5 one-off usages using alpha() |
| Untokenized status colors | 0 |
| `text-[Npx]` arbitrary font sizes | 0 |
| Font-size tokens | 11 (text-4xs through text-base) |
| Radius tokens missing | 0 |
| Dead CSS classes | 0 |
| Lines in index.css | <180 |

---

## Step-by-step work

### Step 1 — Add new tokens to src/tokens.ts

Add the following to `tokens.ts` (extend existing exports, do not replace):

**typographyTokens** (new export — currently does not exist):
```typescript
export const typographyTokens = {
  '4xs': '0.4375rem',  // 7px
  '3xs': '0.5rem',     // 8px
  '3xs+': '0.53125rem',// 8.5px
  '2xs': '0.5625rem',  // 9px
  '2xs+': '0.59375rem',// 9.5px
  xs: '0.625rem',      // 10px — most used (81 occurrences)
  'xs+': '0.65625rem', // 10.5px
  sm: '0.6875rem',     // 11px — second most used (43 occurrences)
  md: '0.75rem',       // 12px
  'md+': '0.8125rem',  // 13px
  base: '0.9375rem',   // 15px
} as const;
```

**New colorTokens additions** (add to existing colorTokens structure):
```typescript
// Accent opacity scale — canonical 6 levels (see ASSUMPTIONS.md A6)
accent: {
  subtle: 'rgba(117,226,255,0.08)',   // border glow
  soft: 'rgba(117,226,255,0.12)',     // soft bg
  selectedGlow: 'rgba(117,226,255,0.15)', // selected ring (was dark.selectedGlow)
  bg: 'rgba(117,226,255,0.2)',        // background tint
  medium: 'rgba(117,226,255,0.3)',    // hover glow
  strong: 'rgba(117,226,255,0.5)',    // strong glow
},
// Status colors
status: {
  error: '#FF7575',
  errorAlt: '#FF6464',
  errorBg: 'rgba(255,117,117,0.12)',
  errorBgAlt: 'rgba(255,100,100,0.2)',
  warning: '#F8C458',
  warningBg: 'rgba(248,196,88,0.2)',
  warningGlow: 'rgba(245,158,11,0.35)',
  success: 'rgba(52,211,153,1)',
  successBg: 'rgba(16,185,129,0.2)',
  successGlow: 'rgba(16,185,129,0.35)',
},
// Info
info: 'rgba(56,189,248,0.7)',
infoBg: 'rgba(56,189,248,0.1)',
// Surface variants (dark theme)
surface: {
  deepBg: '#050506',
  dropdown: '#121212',
  alternate: '#0c0d0f',
},
```

**New radiusTokens additions**:
```typescript
md: 'rounded-md',    // 0.375rem — 22 usages in TSX
'2xl': 'rounded-2xl', // 1rem — 17 usages in TSX
```

**New alpha() utility** (add to src/utils/ or bottom of tokens.ts):
```typescript
export const alpha = (hex: string, opacity: number): string => {
  // Converts #RRGGBB to rgba. Used for one-off accent opacity values.
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${opacity})`;
};
```

---

### Step 2 — Add CSS variables to index.css :root

Add new CSS vars to the existing `:root` block (light theme defaults) and `[data-theme='dark']` block.

New vars to add to each theme block:

```css
/* Typography */
--text-4xs: 0.4375rem;
--text-3xs: 0.5rem;
--text-2xs: 0.5625rem;
--text-xs: 0.625rem;    /* most used */
--text-sm: 0.6875rem;
--text-md: 0.75rem;
--text-base: 0.9375rem;

/* Accent scale */
--theme-accent-subtle: rgba(117,226,255,0.08);
--theme-accent-soft: rgba(117,226,255,0.12);
--theme-selected-glow: rgba(117,226,255,0.15);  /* already exists in tokens, add CSS var */
--theme-accent-bg: rgba(117,226,255,0.2);
--theme-accent-medium: rgba(117,226,255,0.3);
--theme-accent-strong: rgba(117,226,255,0.5);

/* Status */
--theme-error: #FF7575;
--theme-error-alt: #FF6464;
--theme-error-bg: rgba(255,117,117,0.12);
--theme-warning: #F8C458;
--theme-warning-bg: rgba(248,196,88,0.2);
--theme-success: rgba(52,211,153,1);
--theme-success-bg: rgba(16,185,129,0.2);
--theme-info: rgba(56,189,248,0.7);
--theme-info-bg: rgba(56,189,248,0.1);

/* Surface */
--theme-surface-deep: #050506;
--theme-dropdown-bg: #121212;
```

For light theme, define appropriate light values (or inherit dark ones for status colors which are theme-invariant).

---

### Step 3 — Delete 48 dead CSS classes from index.css

Remove all classes confirmed dead by UX-R2. These have 0 usages in any TSX/TS file.

Complete list (48 classes):
`.card-shell`, `.card-shell-blocked`, `.card-shell-incomplete`, `.card-shell-locked`,
`.card-shell-ready`, `.card-shell-selected`, `.card-template-description`, `.stage-shell`,
`.stage-tab`, `.stage-tab-active`, `.stage-tabs`, `.stage-toolbar`, `.stage-view`,
`.stage-phase-card`, `.kanban-builder-tools`, `.kanban-task-list`, `.kanban-action-group`,
`.kanban-action-list`, `.editor-empty`, `.editor-island-body`, `.editor-island-footer`,
`.editor-island-header`, `.editor-toggle-group`, `.builder-tool-button`, `.builder-workspace`,
`.builder-heading`, `.focus-island-floating`, `.glass-active`, `.phase-card-badge`,
`.phase-card-badges`, `.phase-card-icon`, `.phase-card-label`, `.phase-density`,
`.readiness-badge-ready`, `.readiness-badge-incomplete`, `.readiness-badge-blocked`,
`.metadata-version-name`, `.metadata-version-status`, `.action-card-desc`, `.action-card-name`,
`.action-empty-state`, `.action-task-list`, `.ai-entry`, `.status-pill-subtle`,
`.task-card-message`, `.task-card-name`, `.task-field-row`, `.woff`

Do NOT delete the 48 live classes (`.glass`, `.expanded`, `.dark`, `.eyebrow`, `.island-shell`, etc.).

---

### Step 4 — Replace raw accent color usages in src/

**Target**: Replace every raw `#75E2FF` usage with `var(--theme-accent)`.

Run to find all files:
```bash
grep -rn '#75E2FF\|#75e2ff' src/ --include='*.tsx' --include='*.ts'
```

Expected files (from UX-R1): ~100+ files, 269 total usages.

Replacement pattern:
- In className strings: replace `text-[#75E2FF]` or `text-[var(--theme-accent)]` → use Tailwind arbitrary var: `text-[var(--theme-accent)]`  
- In style props: replace `color: '#75E2FF'` → `color: 'var(--theme-accent)'`
- In CSS (index.css): already a CSS var — update definition if duplicated

**After replacement gate**:
```bash
grep -rn '#75E2FF' src/ --include='*.tsx' --include='*.ts'
# Must return 0 results
```

---

### Step 5 — Replace accent rgba variants with canonical tokens

**Target**: Replace all `rgba(117,226,255,X)` usages with the 6-level canonical CSS vars.

Mapping (from UX-R1 — only the opacities with 3+ usages need var replacement; others use alpha()):

| Raw value | Replace with |
|---|---|
| rgba(117,226,255,0.08) | var(--theme-accent-subtle) |
| rgba(117,226,255,0.12) | var(--theme-accent-soft) |
| rgba(117,226,255,0.15) | var(--theme-selected-glow) |
| rgba(117,226,255,0.2) | var(--theme-accent-bg) |
| rgba(117,226,255,0.3) | var(--theme-accent-medium) |
| rgba(117,226,255,0.5) | var(--theme-accent-strong) |
| rgba(117,226,255,{anything else}) | alpha('#75E2FF', {opacity}) — one-off utility call |

Note: Watch for space variants (`rgba(117, 226, 255, 0.3)` vs `rgba(117,226,255,0.3)`). Both must be replaced.

**After replacement gate**:
```bash
grep -rn 'rgba(117' src/ --include='*.tsx' --include='*.ts'
# Must return ≤5 results (only any remaining one-offs using alpha())
```

---

### Step 6 — Replace status color hex usages with CSS vars

Run to find files:
```bash
grep -rn '#FF7575\|#FF6464\|#F8C458' src/ --include='*.tsx' --include='*.ts'
```

Replace:
- `#FF7575` → `var(--theme-error)`
- `#FF6464` → `var(--theme-error-alt)`
- `#F8C458` → `var(--theme-warning)`

And replace rgba status usages similarly with their CSS vars.

---

### Step 7 — Replace all text-[Npx] font sizes with text-[var(--text-X)] or token classes

**Target**: Every `text-[Npx]` Tailwind arbitrary class replaced with Tailwind arbitrary var syntax using the typography token CSS vars.

Mapping (from UX-R1):
| Old class | New class |
|---|---|
| text-[7px] | text-[var(--text-4xs)] |
| text-[8px] | text-[var(--text-3xs)] |
| text-[8.5px] | text-[var(--text-3xs)] (nearest; see A6) |
| text-[9px] | text-[var(--text-2xs)] |
| text-[9.5px] | text-[var(--text-2xs)] (nearest) |
| text-[10px] | text-[var(--text-xs)] |
| text-[10.5px] | text-[var(--text-xs)] (nearest) |
| text-[11px] | text-[var(--text-sm)] |
| text-[12px] | text-[var(--text-md)] |
| text-[13px] | text-[var(--text-md-plus)] |
| text-[15px] | text-[var(--text-base)] |

Also replace font-size values in index.css with CSS var references.

**After replacement gate**:
```bash
grep -rn 'text-\[[0-9]*\.?[0-9]*px\]' src/ --include='*.tsx' --include='*.ts'
# Must return 0 results
```

---

### Step 8 — Update index.css font-size values to use CSS var references

For any `font-size: 0.78rem` etc. in index.css, replace with `font-size: var(--text-sm)` (or nearest).

---

## Acceptance Criteria (gates that must all pass before P2 starts)

```bash
# 1. No raw accent hex color in components
grep -rn '#75E2FF' src/ --include='*.tsx' --include='*.ts' | wc -l
# Expected: 0

# 2. No arbitrary accent rgba variants (more than 5 one-offs means drift)
grep -rn 'rgba(117' src/ --include='*.tsx' --include='*.ts' | wc -l
# Expected: ≤5

# 3. No untokenized status hex colors
grep -rn '#FF7575\|#FF6464\|#F8C458' src/ --include='*.tsx' --include='*.ts' | wc -l
# Expected: 0

# 4. No arbitrary px font sizes
grep -rn 'text-\[[0-9]*\.?[0-9]*px\]' src/ --include='*.tsx' --include='*.ts' | wc -l
# Expected: 0

# 5. index.css is significantly smaller
wc -l src/index.css
# Expected: < 180 lines (was ~400)

# 6. typographyTokens export exists in tokens.ts
grep -n 'typographyTokens' src/tokens.ts
# Expected: found

# 7. alpha() utility exists
grep -rn 'export.*alpha' src/
# Expected: found in tokens.ts or utils/

# 8. Build passes
npm run build
# Expected: 0 errors
```

---

## Session log location

Save output to: `docs/plans/completed/src-structure-refactor/output/P1-design-tokens-output.md`
