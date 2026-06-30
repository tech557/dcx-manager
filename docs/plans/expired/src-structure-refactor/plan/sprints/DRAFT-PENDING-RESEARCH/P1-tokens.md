---
sprint: P1-tokens
plan: src-structure-refactor
title: Design Token System
status: not-started
output: docs/plans/active/src-structure-refactor/output/P1-tokens-report.md
depends-on: nothing — runs first
---

# P1 — Design Token System

## Goal

Every design value in this codebase — colour, typography, spacing, radius, shadow, motion, breakpoint — must have exactly one definition and be reachable by both TypeScript (for JSX className logic) and CSS (for Tailwind utilities and CSS vars). No value should exist in two places.

After this sprint, changing the accent colour from `#75E2FF` to anything else is a one-line edit in `src/brand/tokens.ts`. No component file is touched.

---

## Current State (before this sprint)

### What exists

| File | What it has | Problem |
|---|---|---|
| `src/brand/tokens.ts` | `colorTokens`, `blurTokens`, `radiusTokens`, `shadowTokens`, `springTokens` | Good start. But values are plain TS objects — CSS can't read them without a bridge |
| `src/brand/theme.ts` | `resolveTheme(mode)` → resolved colour set | Only gives colours. No typography, no spacing, no breakpoints |
| `src/brand/index.css` | `@theme { --font-sans }`, `:root { --theme-* }`, dark mode overrides, + 400 lines of component styles | CSS vars exist but only for 6 colour vars. Font sizes, spacing, radii are raw values throughout |

### What is missing

| Token category | Where values live today | Problem |
|---|---|---|
| Typography scale | JSX strings: `text-[0.85rem]`, `text-[0.72rem]`, `text-[0.78rem]`… | ~12 different font size values with no scale or names |
| Spacing scale | Tailwind arbitrary: `p-[0.75rem]`, `gap-[0.65rem]`, `px-[1.25rem]`… | No spatial rhythm. Can't resize the layout from one place |
| Responsive breakpoints | None defined | Builder is desktop-only by accident |
| Status colours | Scattered: `rgba(117,226,255,…)` (ready), `rgba(248,196,88,…)` (incomplete), `rgba(255,100,100,…)` (blocked) | Duplicated in CSS, in JSX className strings, in `StatusBadge.tsx` |
| Animation timing | `springTokens` exists in `tokens.ts` but not in CSS | Motion config (`src/ui/motion/motion.config.ts`) has its own values that don't reference tokens |

---

## Deliverables

### 1. Extend `src/brand/tokens.ts`

Add four new token groups. Do not remove existing ones.

#### 1a. Typography tokens

```ts
export const typographyTokens = {
  // Scale names follow t-shirt sizing + semantic names
  size: {
    '2xs':  '0.65rem',   // 10.4px — labels, badges, eyebrow text
    xs:     '0.72rem',   // 11.5px — secondary field labels, monospace tags
    sm:     '0.78rem',   // 12.5px — body small, card descriptions
    base:   '0.85rem',   // 13.6px — body default, task names
    md:     '0.9rem',    // 14.4px — metadata, island labels
    lg:     '1rem',      // 16px   — section headings
    xl:     '1.1rem',    // 17.6px — page subheadings
    '2xl':  '1.4rem',    // 22.4px — island titles
    '3xl':  'clamp(2.25rem, 8vw, 5rem)', // responsive hero
  },
  weight: {
    regular: '400',
    medium:  '500',
    semibold:'600',
    bold:    '700',
    black:   '800',
  },
  tracking: {
    tight:   '-0.01em',
    normal:  '0',
    wide:    '0.04em',
    wider:   '0.06em',
    widest:  '0.08em',
    mono:    '0.1em',
  },
  leading: {
    tight:   '1.2',
    snug:    '1.3',
    normal:  '1.45',
    relaxed: '1.7',
  },
} as const;
```

#### 1b. Spacing tokens

```ts
export const spacingTokens = {
  // Named spatial scale — use these, not magic numbers
  '0':   '0',
  px:    '1px',
  '0.5': '0.125rem',  // 2px
  '1':   '0.25rem',   // 4px
  '1.5': '0.375rem',  // 6px
  '2':   '0.5rem',    // 8px
  '2.5': '0.625rem',  // 10px
  '3':   '0.75rem',   // 12px
  '4':   '1rem',      // 16px
  '5':   '1.25rem',   // 20px
  '6':   '1.5rem',    // 24px
  '8':   '2rem',      // 32px
  '10':  '2.5rem',    // 40px
  '12':  '3rem',      // 48px
  '16':  '4rem',      // 64px
  '20':  '5rem',      // 80px
  '24':  '6rem',      // 96px
} as const;
```

#### 1c. Breakpoint tokens

```ts
export const breakpointTokens = {
  sm:   '640px',    // tablet portrait
  md:   '1024px',   // tablet landscape / small laptop
  lg:   '1280px',   // desktop
  xl:   '1536px',   // wide desktop
  '2xl':'1920px',   // ultrawide
} as const;
```

#### 1d. Status colour tokens (add to `colorTokens`)

```ts
// Add to colorTokens (both light and dark variants)
status: {
  ready: {
    fg:  '#75E2FF',
    bg:  'rgba(117,226,255,0.1)',
    border: 'rgba(117,226,255,0.3)',
  },
  incomplete: {
    fg:  '#F8C458',
    bg:  'rgba(248,196,88,0.1)',
    border: 'rgba(248,196,88,0.3)',
  },
  blocked: {
    fg:  '#FF6464',
    bg:  'rgba(255,100,100,0.1)',
    border: 'rgba(255,100,100,0.3)',
  },
  draft: {
    fg:  'rgba(247,247,248,0.45)',
    bg:  'rgba(255,255,255,0.04)',
    border: 'rgba(255,255,255,0.08)',
  },
},
```

---

### 2. Bridge tokens to CSS via `src/brand/index.css`

The existing `:root` block has 6 vars. It must grow to cover every token category. Use Tailwind v4's `@theme` block for values Tailwind needs to generate utilities, and `:root` for values used directly in CSS.

**Target `:root` block (replace the current 6-var block):**

```css
:root {
  /* --- Colour --- */
  --color-accent:           #75E2FF;
  --color-base:             #FFFFFF;
  --color-raised:           #F7F7F8;
  --color-text:             #151516;
  --color-text-muted:       rgba(21,21,22,0.68);
  --color-border-subtle:    rgba(21,21,22,0.1);
  --color-border-hairline:  rgba(0,0,0,0.07);
  --color-glass:            rgba(255,255,255,0.75);
  --color-pill:             rgba(0,0,0,0.04);
  --color-glow:             rgba(117,226,255,0.15);

  /* --- Status --- */
  --color-ready-fg:       #75E2FF;
  --color-ready-bg:       rgba(117,226,255,0.1);
  --color-ready-border:   rgba(117,226,255,0.3);
  --color-incomplete-fg:  #F8C458;
  --color-incomplete-bg:  rgba(248,196,88,0.1);
  --color-incomplete-border: rgba(248,196,88,0.3);
  --color-blocked-fg:     #FF6464;
  --color-blocked-bg:     rgba(255,100,100,0.1);
  --color-blocked-border: rgba(255,100,100,0.3);

  /* --- Typography --- */
  --text-2xs:   0.65rem;
  --text-xs:    0.72rem;
  --text-sm:    0.78rem;
  --text-base:  0.85rem;
  --text-md:    0.9rem;
  --text-lg:    1rem;
  --text-xl:    1.1rem;
  --text-2xl:   1.4rem;

  /* --- Spacing (layout-specific named vars — not for component padding) --- */
  --layout-header-h:    3.5rem;
  --layout-footer-h:    3.5rem;
  --layout-panel-w:     24rem;
  --layout-island-gap:  0.75rem;

  /* --- Radius --- */
  --radius-pill:    9999px;
  --radius-island:  2rem;
  --radius-card:    2.2rem;
  --radius-panel:   1.6rem;
  --radius-chip:    0.75rem;
  --radius-sm:      0.5rem;

  /* --- Shadow --- */
  --shadow-island:  0 12px 40px rgba(0,0,0,0.2);
  --shadow-card:    0 8px 32px rgba(0,0,0,0.3);
  --shadow-overlay: 0 20px 50px rgba(0,0,0,0.3);
  --shadow-glow:    0 0 15px rgba(117,226,255,0.15);

  /* --- Motion --- */
  --duration-fast:    80ms;
  --duration-normal:  150ms;
  --duration-slow:    300ms;
  --duration-enter:   220ms;
  --ease-spring:      cubic-bezier(0.16,1,0.3,1);
}

[data-theme="dark"], .dark {
  --color-base:             #0D0D0E;
  --color-raised:           #151516;
  --color-text:             #F7F7F8;
  --color-text-muted:       rgba(247,247,248,0.72);
  --color-border-subtle:    rgba(255,255,255,0.08);
  --color-border-hairline:  rgba(255,255,255,0.04);
  --color-glass:            rgba(0,0,0,0.2);
  --color-pill:             rgba(255,255,255,0.05);
  --color-glow:             rgba(117,226,255,0.15);
}
```

**Add to `@theme` block (for Tailwind utility generation):**

```css
@theme {
  --font-sans: "Gilroy";
  --color-accent: #75E2FF;
  --color-base: var(--color-base);
  --color-text: var(--color-text);
  --color-text-muted: var(--color-text-muted);
  --color-border: var(--color-border-subtle);

  --text-2xs:  var(--text-2xs);
  --text-xs:   var(--text-xs);
  --text-sm:   var(--text-sm);
  --text-base: var(--text-base);
  --text-md:   var(--text-md);
  --text-lg:   var(--text-lg);
  --text-xl:   var(--text-xl);
  --text-2xl:  var(--text-2xl);

  --radius-pill:   var(--radius-pill);
  --radius-island: var(--radius-island);
  --radius-card:   var(--radius-card);
  --radius-panel:  var(--radius-panel);
  --radius-chip:   var(--radius-chip);
  --radius-sm:     var(--radius-sm);

  --breakpoint-sm:  640px;
  --breakpoint-md:  1024px;
  --breakpoint-lg:  1280px;
  --breakpoint-xl:  1536px;
  --breakpoint-2xl: 1920px;
}
```

---

### 3. Update `src/brand/tokens.ts` to export CSS var names too

After adding the token groups, also export a map of CSS var names so TypeScript code can reference them without hard-coding strings:

```ts
// Add at the bottom of tokens.ts
export const cssVars = {
  color: {
    accent:         'var(--color-accent)',
    base:           'var(--color-base)',
    text:           'var(--color-text)',
    textMuted:      'var(--color-text-muted)',
    borderSubtle:   'var(--color-border-subtle)',
    glass:          'var(--color-glass)',
  },
  status: {
    ready:      { fg: 'var(--color-ready-fg)',      bg: 'var(--color-ready-bg)',      border: 'var(--color-ready-border)' },
    incomplete: { fg: 'var(--color-incomplete-fg)', bg: 'var(--color-incomplete-bg)', border: 'var(--color-incomplete-border)' },
    blocked:    { fg: 'var(--color-blocked-fg)',    bg: 'var(--color-blocked-bg)',    border: 'var(--color-blocked-border)' },
    draft:      { fg: 'var(--color-text-muted)',    bg: 'var(--color-pill)',          border: 'var(--color-border-subtle)' },
  },
  radius:  { pill: 'var(--radius-pill)', island: 'var(--radius-island)', card: 'var(--radius-card)', panel: 'var(--radius-panel)', chip: 'var(--radius-chip)', sm: 'var(--radius-sm)' },
  shadow:  { island: 'var(--shadow-island)', card: 'var(--shadow-card)', overlay: 'var(--shadow-overlay)', glow: 'var(--shadow-glow)' },
  motion:  { fast: 'var(--duration-fast)', normal: 'var(--duration-normal)', slow: 'var(--duration-slow)', enter: 'var(--duration-enter)', spring: 'var(--ease-spring)' },
  layout:  { headerH: 'var(--layout-header-h)', footerH: 'var(--layout-footer-h)', panelW: 'var(--layout-panel-w)' },
} as const;
```

---

### 4. Clean `src/brand/index.css` — tokens only

After the bridge is in place, `index.css` must contain ONLY:
1. `@import "tailwindcss"`
2. `@font-face` declarations (20 Gilroy weights — do not touch these)
3. `@theme {}` block
4. `:root {}` block with CSS vars
5. `[data-theme="dark"]` overrides
6. Base resets (`*`, `body`, `button`, etc.)

Everything else (`.card-shell`, `.kanban-board`, `.stage-phase-card`, `.glass`, etc.) gets extracted in P2. Do not delete those classes in this sprint — leave them in `index.css` temporarily. P2 moves them to component-level files and removes them from here.

**Target `index.css` line count after P1:** ≤ 120 lines (down from 500+).  
Do not extract component classes in this sprint. Just add the new token vars.

---

### 5. Update `src/ui/motion/motion.config.ts`

Replace any hard-coded timing values with references to `springTokens` from `tokens.ts`:

```ts
import { springTokens } from '@/brand/tokens';

export const motionConfig = {
  island:  springTokens.island,
  card:    springTokens.card,
  gentle:  springTokens.gentle,
  // Add:
  duration: {
    fast:   80,
    normal: 150,
    slow:   300,
    enter:  220,
  },
} as const;
```

---

## Files Changed in This Sprint

| File | Change | Direction |
|---|---|---|
| `src/brand/tokens.ts` | Add `typographyTokens`, `spacingTokens`, `breakpointTokens`, extend `colorTokens.status`, add `cssVars` | Extend |
| `src/brand/index.css` | Add full CSS var set to `:root` and `@theme`; extract nothing yet | Extend only |
| `src/ui/motion/motion.config.ts` | Reference `springTokens` for values already in tokens.ts | Refactor |

**Files NOT changed in this sprint:**
- No component files
- No JSX className strings
- No file moves

---

## Acceptance Criteria

- [ ] `src/brand/tokens.ts` exports: `typographyTokens`, `spacingTokens`, `breakpointTokens`, `cssVars`, extended `colorTokens.status`
- [ ] `src/brand/index.css` `:root` block has all vars listed in deliverable §2
- [ ] `src/brand/index.css` `@theme` block has typography + radius + breakpoint vars for Tailwind
- [ ] `src/brand/index.css` total line count ≤ current + 80 lines (tokens added, nothing removed yet — removal is P2)
- [ ] `src/ui/motion/motion.config.ts` imports from `tokens.ts`, no hard-coded ms values
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx vitest run` → all passing (tokens are additive, nothing breaks)
- [ ] No component JSX was changed

---

## Session Log Instructions

```
docs/progress/sessions/<date>-<agent>/NN-P1-tokens.md
```

Log must include:
- Identity block
- Task type: Sprint task — P1
- Files created/edited with line counts (before → after for index.css)
- Gate results
- Do not paste the CSS or TS token blocks — reference the output file

Output file:
```
docs/plans/active/src-structure-refactor/output/P1-tokens-report.md
```

Output must include: exact list of new CSS vars added, before/after line count for `index.css`, any conflicts found with existing values.
