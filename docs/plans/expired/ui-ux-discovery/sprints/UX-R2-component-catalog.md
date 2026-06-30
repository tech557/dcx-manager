---
sprint: UX-R2
plan: ui-ux-discovery
title: Component → CSS Class Map
status: not-started
parallel-with: UX-R1
output: docs/plans/drafted/ui-ux-discovery/output/UX-R2-component-css-map.md
assigned-to: Claude or Codex (terminal + ts-morph script)
---

# UX-R2 — Component → CSS Class Map

## Intent

Map every CSS class defined in `src/brand/index.css` to the TSX component(s) that use it. Identify classes that are used by 0 components (dead code). Map every component to its visual surface: does it use global CSS classes, Tailwind utilities, inline styles, or a CSS module?

This tells P2 exactly what to extract, what to delete, and what already has module-level ownership.

**No source file changes in this sprint.**

---

## Extraction Tasks

### Task 1 — Extract all CSS class names from `index.css`

```bash
grep -oh '\.[a-zA-Z][a-zA-Z0-9_-]*' src/brand/index.css | sort -u
```

This gives the complete list of class names defined globally. Expected count: ~80-100 classes.

---

### Task 2 — For each CSS class, find which TSX/TS files reference it

For each class name from Task 1, run:
```bash
grep -rn "className.*<classname>\|class.*<classname>" src/ --include="*.tsx" --include="*.ts"
```

Or write a small script using the class list:
```bash
while IFS= read -r cls; do
  count=$(grep -rl "${cls}" src/ --include="*.tsx" --include="*.ts" 2>/dev/null | wc -l)
  echo "$count $cls"
done < /tmp/css-classes.txt | sort -rn
```

For each class: record usage count (number of files) and which files use it.

Classes with 0 usages = dead code candidates.  
Classes with 1 usage = owned by exactly one component, easy to co-locate.  
Classes with 3+ usages = shared classes, need more thought.

---

### Task 3 — Map each TSX component to its styling approach

For every `.tsx` file in `src/`, determine how it applies styles:

```bash
# Count files using global CSS class approach
grep -rl 'className="[a-z].*[a-z]"' src/ --include="*.tsx" | wc -l

# Count files using Tailwind utility classes
grep -rl 'className="[a-z].*flex\|className="[a-z].*grid\|className="[a-z].*text-' src/ --include="*.tsx" | wc -l

# Count files with inline styles
grep -rl 'style={{' src/ --include="*.tsx" | wc -l

# Count files already using CSS modules (none expected, but verify)
grep -rl '\.module\.css' src/ --include="*.tsx" | wc -l
```

For each component file, classify its primary styling approach:
- `global-css` — uses class names from `index.css`
- `tailwind` — uses Tailwind utility classes
- `inline-style` — uses `style={{...}}`
- `mixed` — uses more than one approach
- `css-module` — uses `.module.css` (likely 0 currently)

---

### Task 4 — Run `scripts/generate-code-index.ts`

This script already exists and uses ts-morph to extract component info. Run it:

```bash
npx tsx scripts/generate-code-index.ts
```

Review the output to understand:
- Which components are children of which (component tree)
- Which props are passed between components
- Which JSX text labels exist (helps identify hardcoded UI strings)

If the script output is not in a usable format, note what it does produce and where the gaps are — P2 may need an improved version.

---

### Task 5 — Identify duplicate visual patterns

Manually scan the component list and `index.css` to identify visual patterns that appear in multiple places with different class names. Examples to look for:

- Multiple "pill-shaped button" patterns (`.stage-tab`, `.island-toggle`, `.builder-tool-button`, `.field-indicator`, `.channel-pill` — do they share styles or diverge?)
- Multiple "glass card" patterns (`.card-shell`, `.stage-phase-card`, `.glass-dark` — are these actually different or the same thing?)
- Multiple "badge/status" patterns (`.readiness-badge-ready`, `.metadata-version-status`, `StatusBadge.tsx`, `LockBadge.tsx`)
- Multiple "input" patterns (8 files in `forms/inputs/`, `.editor-input` in CSS)

For each duplicate pattern group: list which components share visual DNA and whether they could be unified under one atom component.

---

## Output Format

`docs/plans/drafted/ui-ux-discovery/output/UX-R2-component-css-map.md`

```markdown
# UX-R2: Component → CSS Class Map
Generated: YYYY-MM-DD

## CSS Class Usage Map

| CSS Class | Defined in | Used by (files) | Usage count | Action |
|---|---|---|---|---|
| .card-shell | index.css | PhaseCard.tsx, TaskCard.tsx | 2 | Extract to CardShell.module.css |
| .kanban-board | index.css | KanbanView.tsx | 1 | Extract to KanbanView.module.css |
| .placeholder-screen | index.css | (none found) | 0 | DELETE — dead code |

## Component Styling Approach Map

| Component | Path | Primary approach | Has inline styles? | CSS classes used |
|---|---|---|---|---|
| PhaseCard.tsx | src/builder/cards/templates/phase/ | mixed | Yes | card-shell, card-shell-ready, phase-card-header |
| KanbanView.tsx | src/builder/stage/views/ | global-css | No | kanban-board, kanban-phase-column |

## Duplicate Visual Pattern Groups

### Pill-shaped interactive elements
Components: StageTab, IslandToggle, BuilderToolButton, FieldIndicator, ChannelPill
Shared DNA: border-radius pill, border 1px, backdrop-blur, font-size ~0.78rem
Divergence: sizes differ, some have hover states, some don't
Unification candidate: `<Chip>` atom with size+variant props

### Glass card surface
Components: CardShell (.card-shell), StagePhaseCard (.stage-phase-card), GlassSurface
Shared DNA: backdrop-blur, border 1px border-subtle, border-radius card
Divergence: StagePhaseCard has less padding, no selected state
Unification candidate: `<CardShell>` with `variant` prop

### Status/Badge display
Components: StatusBadge.tsx, LockBadge.tsx, .readiness-badge-*, .metadata-version-status
Shared DNA: small rounded pill, coloured fg+bg, uppercase font
Divergence: different icon usage, different text transforms
Unification candidate: `<Badge status variant>` atom

### Input elements
Files: TextInputSmall, TextInputLarge, TextInputInline, DualInput, ListInputLines, SpecsInput, .editor-input
Shared DNA: transparent bg, border-subtle, border-radius sm, focus accent
Divergence: sizes, single vs multi-line, special compound inputs (DualInput)
Unification candidate: `<Input size variant>` with special cases remaining as wrappers

## Dead CSS Classes (0 usages — delete in P2)
| Class | Last known purpose |
|---|---|
| .placeholder-screen | Early mockup screen — no longer used |

## generate-code-index.ts Output Summary
[paste or summarise what the script produced]
```

---

## Acceptance Criteria

- [ ] Every CSS class in `index.css` is in the usage map with file count
- [ ] Dead classes (0 usages) are explicitly listed
- [ ] Every TSX file in `src/` has a styling approach classification
- [ ] At least 3 duplicate visual pattern groups are identified and documented
- [ ] `generate-code-index.ts` was run and its output is summarised in the output file
- [ ] No source file changed
- [ ] Session log written and references output file
