---
sprint: P2-components
plan: src-structure-refactor
title: Atomic Component System
status: not-started
output: docs/plans/active/src-structure-refactor/output/P2-components-report.md
depends-on: P1-tokens (must be complete — component styles must reference CSS vars, not raw values)
---

# P2 — Atomic Component System

## Goal

Every component owns its styles. `src/brand/index.css` shrinks to ≤ 60 lines (font declarations + base resets only). No component style lives in a global file. All sizing, colour, and spacing values in component files reference CSS vars from P1 — no raw hex values, no arbitrary Tailwind brackets for design values.

After this sprint, changing how every card header looks means opening one file.

---

## Current State Problem

`src/brand/index.css` today has ~400 lines of component-specific CSS class definitions mixed into the global stylesheet. Examples:

- `.card-shell`, `.card-shell-selected`, `.card-shell-ready` — card state styles
- `.kanban-board`, `.kanban-phase-column`, `.kanban-action-list` — kanban layout
- `.stage-phase-card`, `.stage-phase-row`, `.stage-phase-column` — stage layout
- `.editor-input`, `.editor-field-label`, `.editor-toggle-btn` — editor form elements
- `.glass`, `.glass-dark`, `.glass-light`, `.glass-glow` — glass surface utilities
- `.island-shell`, `.island-shell.expanded` — island container styles
- `.readiness-badge-*` — status badge colours
- `.channel-pill`, `.task-card-name`, `.task-card-message` — card content

**These are component-specific classes with no business being in a global file.**

Additionally, JSX files have patterns like:
```tsx
className="text-[0.85rem] font-bold tracking-[-0.01em] text-[rgba(247,247,248,0.72)]"
```
Raw values that duplicate what tokens.ts already defines.

---

## Architecture After This Sprint

```
src/ui/
  atoms/
    Button/
      Button.tsx
      Button.module.css    ← owns its styles
      index.ts
    Badge/
      Badge.tsx            ← StatusBadge, LockBadge, ReadinessBadge merged here
      Badge.module.css
      index.ts
    Input/
      Input.tsx            ← base input (replaces raw <input> with className soup)
      Input.module.css
      index.ts
    Divider/
      Divider.tsx
      index.ts
    Popover/
      PopoverShell.tsx
      StickyPopupShell.tsx
      Popover.module.css
      index.ts
  surfaces/
    GlassSurface.tsx       ← already exists, gains .module.css
    GlassSurface.module.css
  motion/                  ← unchanged

src/builder/components/    ← receives moved files from src/components/ (P3 does the move)
  cards/
    CardShell/
      CardShell.tsx        ← extracted from .card-shell CSS class
      CardShell.module.css
      index.ts
  islands/
    IslandShell/
      IslandShell.tsx      ← extracted from .island-shell CSS class
      IslandShell.module.css
      index.ts
  feedback/
    ReadinessBadge.tsx     ← already exists, gains typed status prop + CSS vars
```

---

## Deliverables

### 1. CSS var migration rule (enforced in this sprint)

Every CSS value that is a design token MUST reference a CSS var. Pattern:

```css
/* BEFORE (hard-coded) */
.card-shell { border-radius: 2.2rem; }
.card-shell:hover { border-color: rgba(255,255,255,0.12); }

/* AFTER (tokenised) */
.card-shell { border-radius: var(--radius-card); }
.card-shell:hover { border-color: var(--color-border-subtle); }
```

Same rule for JSX inline styles:
```tsx
/* BEFORE */
style={{ borderRadius: '2.2rem', color: 'rgba(247,247,248,0.72)' }}

/* AFTER */
style={{ borderRadius: 'var(--radius-card)', color: 'var(--color-text-muted)' }}
```

---

### 2. Glass surface system — `src/ui/surfaces/`

The existing `GlassSurface.tsx` component plus `.glass`, `.glass-dark`, `.glass-light`, `.glass-glow` CSS classes become a proper component system:

**`src/ui/surfaces/GlassSurface.module.css`** (new):
```css
.glass {
  backdrop-filter: blur(24px);
  -webkit-backdrop-filter: blur(24px);
  border: 1px solid var(--color-border-subtle);
  transition: all var(--duration-slow) var(--ease-spring);
}
.glass-dark {
  background: var(--color-glass);
  box-shadow: var(--shadow-island), inset 0 1px 0 var(--color-border-hairline);
}
.glass-light {
  background: rgba(255,255,255,0.65);
  box-shadow: 0 12px 40px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.25);
}
.glow:hover {
  box-shadow: var(--shadow-island), var(--shadow-glow);
  border-color: var(--color-ready-border);
}
```

`GlassSurface.tsx` gains a `variant` prop: `'dark' | 'light' | 'glow'`.

---

### 3. Atom: Badge

Consolidate `StatusBadge.tsx` and `LockBadge.tsx` into `src/ui/atoms/Badge/` with a single `<Badge>` component that accepts a `status` prop and reads from CSS vars:

```tsx
// Props
type BadgeStatus = 'ready' | 'incomplete' | 'blocked' | 'draft' | 'locked';
type BadgeSize = 'xs' | 'sm' | 'md';
interface BadgeProps { status: BadgeStatus; size?: BadgeSize; label?: string; }
```

```css
/* Badge.module.css */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: var(--text-2xs);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: var(--tracking-wider, 0.06em);
  padding: 0.15rem 0.4rem;
  border-radius: var(--radius-pill);
  border: 1px solid;
}
.ready     { color: var(--color-ready-fg);      background: var(--color-ready-bg);      border-color: var(--color-ready-border); }
.incomplete{ color: var(--color-incomplete-fg); background: var(--color-incomplete-bg); border-color: var(--color-incomplete-border); }
.blocked   { color: var(--color-blocked-fg);    background: var(--color-blocked-bg);    border-color: var(--color-blocked-border); }
.draft     { color: var(--color-text-muted);    background: var(--color-pill);           border-color: var(--color-border-subtle); }
```

---

### 4. Atom: Input

Replace the 8 individual input files in `src/components/forms/inputs/` (TextInputSmall, TextInputLarge, TextInputInline, DualInput…) with one `<Input>` atom that accepts a `size` and `variant` prop:

```tsx
// src/ui/atoms/Input/Input.tsx
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'inline' | 'block';
}
```

```css
/* Input.module.css */
.input {
  background: var(--color-pill);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-sm);
  color: var(--color-text);
  font-size: var(--text-base);
  transition: border-color var(--duration-normal);
  width: 100%;
  outline: none;
}
.input:focus { border-color: var(--color-accent); }
.sm  { padding: 0.25rem 0.5rem; font-size: var(--text-xs); }
.md  { padding: 0.5rem 0.75rem; }
.lg  { padding: 0.75rem 1rem;   font-size: var(--text-md); }
```

The 8 existing input files become thin wrappers or are deleted after this atom exists.

---

### 5. Component: CardShell

The `.card-shell` class family currently lives in `index.css`. Extract to:

**`src/builder/components/cards/CardShell/CardShell.tsx`**:
```tsx
interface CardShellProps {
  children: React.ReactNode;
  state?: 'default' | 'selected' | 'locked' | 'ready' | 'incomplete' | 'blocked';
  className?: string;
}
```

**`src/builder/components/cards/CardShell/CardShell.module.css`**:
```css
.shell {
  position: relative;
  display: grid;
  gap: var(--spacing-3, 0.75rem);
  padding: 1rem 1.1rem;
  border: 1px solid transparent;
  border-radius: var(--radius-card);
  backdrop-filter: blur(20px);
  transition: border-color var(--duration-normal), box-shadow var(--duration-normal);
}
.shell:hover          { border-color: var(--color-border-subtle); }
.selected             { border-color: var(--color-ready-border); box-shadow: 0 0 0 1px var(--color-glow), var(--shadow-card); }
.locked               { cursor: not-allowed; }
.ready                { border-left: 3px solid var(--color-ready-fg); }
.incomplete           { border-left: 3px solid var(--color-incomplete-fg); }
.blocked              { border-left: 3px solid var(--color-blocked-fg); }
```

---

### 6. Component: IslandShell

The `.island-shell` class lives in `index.css`. Extract to:

**`src/builder/components/islands/IslandShell/IslandShell.tsx`** and **`IslandShell.module.css`**:

```css
.shell {
  border-radius: var(--radius-pill);
  border: 1px solid var(--color-border-subtle);
  background: var(--color-glass);
  backdrop-filter: blur(24px);
  box-shadow: var(--shadow-island), inset 0 1px 0 var(--color-border-hairline);
  transition: border-radius var(--duration-slow) var(--ease-spring),
              box-shadow var(--duration-normal);
}
.expanded { border-radius: var(--radius-island); }
.shell:hover { box-shadow: var(--shadow-card), inset 0 1px 0 var(--color-border-hairline); }
```

---

### 7. Clean `src/brand/index.css`

After extracting every component class to a module:

**Remove from `index.css`:** `.card-shell*`, `.kanban-*`, `.stage-*`, `.glass*`, `.island-shell*`, `.editor-*`, `.readiness-badge*`, `.channel-pill`, `.task-card-*`, `.action-card-*`, `.phase-card-*`, `.field-indicator*`, `.drop-target`, `.builder-*`, `.metadata-*`, `.header-*`, `.focus-island-*`, `.status-pill-*`

**Keep in `index.css`:**
- `@import "tailwindcss"`
- `@font-face` declarations
- `@theme {}` block
- `:root {}` and `[data-theme="dark"]` blocks
- `* { box-sizing: border-box; }`
- `body { margin: 0; font-family: "Gilroy"; }`
- `a, button, input, textarea, select` base resets

**Target line count:** ≤ 60 lines

---

## Responsive Values

All component module CSS must include responsive overrides where layout changes at breakpoint. Pattern:

```css
/* CardShell.module.css — responsive example */
.shell {
  padding: 0.75rem 1rem; /* mobile */
}
@media (min-width: 1024px) {
  .shell { padding: 1rem 1.1rem; } /* desktop */
}
```

Every component that has a fixed px width or height must declare its responsive value. Components that scroll (stage views) do not need responsive overrides.

---

## Acceptance Criteria

- [ ] `src/brand/index.css` ≤ 60 lines — no component class definitions
- [ ] `src/ui/atoms/` folder exists with `Badge/`, `Input/`, `Divider/`, `Popover/` each having a `.module.css`
- [ ] `src/ui/surfaces/GlassSurface.module.css` exists; `GlassSurface.tsx` uses it
- [ ] `src/builder/components/cards/CardShell/` exists with component + module CSS
- [ ] `src/builder/components/islands/IslandShell/` exists with component + module CSS
- [ ] All CSS values in module files reference `var(--*)` — no raw hex, no raw `rem` where a token exists
- [ ] `grep -r "#75E2FF\|rgba(117" src/ --include="*.css" --include="*.tsx" --include="*.ts"` → only in `tokens.ts`
- [ ] All 8 existing `src/components/forms/inputs/` files are replaced or wrapped by the new `Input` atom (old files deleted or thinned to 3-line re-exports)
- [ ] `StatusBadge.tsx` and `LockBadge.tsx` delegate to the new `Badge` atom (old files become 3-line wrappers or are deleted)
- [ ] `npx tsc --noEmit` → 0 errors
- [ ] `npx vitest run` → all passing
- [ ] Every new component module CSS has at least one `@media` responsive override where applicable

---

## Session Log Instructions

```
docs/progress/sessions/<date>-<agent>/NN-P2-components.md
```

Output file at:
```
docs/plans/active/src-structure-refactor/output/P2-components-report.md
```

Output must include:
- Before/after line count for `index.css`
- List of every class extracted from `index.css` and where it moved
- List of every new component module file created
- Count of JSX files where raw values were replaced with CSS vars
