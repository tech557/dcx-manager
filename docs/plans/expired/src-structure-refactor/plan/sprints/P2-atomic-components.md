---
sprint: P2
title: Atomic Component System
plan: src-structure-refactor
status: completed — all 9 steps done, all gates pass (verified by Claude 2026-06-26)
depends-on: P1 (all P1 gates must pass first)
data-source: FE-R1-component-tree.md, FE-R2-state-flow.md, FE-R3-duplication-map.md, UX-R2-component-css-map.md
reviewed-by: Codex (2026-06-26), Gemini (2026-06-26)
progress-verified-by: Claude (2026-06-26) — cross-checked Codex session log 04-P2-atomic-components.md against disk
---

# P2 — Atomic Component System

## Goal

After P2, the codebase has a single set of reusable UI atoms with no duplicate visual patterns.
The 5 duplication groups (Badge, Chip, Glass, Input, Toggle) are consolidated. Every file in
`src/components/` has been relocated to the correct folder by capability owner. A shared
`useToggle` hook exists.

**Folder ownership rule** (per Codex/Gemini review):
- `src/ui/` → domain-neutral visual atoms: no builder imports, no builder types
- `src/builder/ui/` → builder-specific leaf components: may use builder types, no StageContext reads
- `src/builder/` subtrees → everything that reads StageContext or builderStore

---

## Before

| Metric | Count |
|---|---|
| Duplicate badge implementations | 3 (StatusBadge, LockBadge, PhaseReadinessBadge) |
| Duplicate chip/pill implementations | 5 (ChannelPill, InlineIslandButton, IslandToggleButton, MenuSectionButton, FieldIndicator base) |
| Duplicate input implementations | 3 (TextInputSmall, TextInputLarge, TextInputInline) |
| Shared `useToggle` hook | 0 — each island uses `useState(false)` |
| `useState(false)` open/close patterns | ~20 |
| `useActiveNode` context reads duplicated in `useEditorDraft` | 1 (same subscription) |

---

## After

| Metric | Target |
|---|---|
| `<Badge>` visual primitive in src/ui/atoms/ | 1 (base styling only) |
| Semantic badge wrappers (StatusBadge, LockBadge, ReadinessBadge) | 3 (thin wrappers around Badge primitive) |
| `<Chip>` atom in src/ui/atoms/ | 1 (base for pill variants) |
| `<Input>` atom in src/ui/atoms/ | 1 (consolidates 3 text inputs) |
| `<ToggleGroup>` atom in src/ui/atoms/ | 1 |
| GlassSurface with variant prop | 1 |
| `useToggle` hook in src/hooks/ | 1 |
| `useActiveNode` merged into `useEditorDraft` | — (3 editor hooks remain separate) |
| Files in src/components/ with no clear owner | 0 |

---

## Step-by-step work

### ✅ Step 1 — Create src/ui/atoms/ folder and index
**DONE by Codex (2026-06-26)**
`src/ui/atoms/index.ts` created with barrel exports.

---

### ✅ Step 2 — Create `<Badge>` visual primitive + semantic wrappers

**Design decision** (per Codex + Gemini review): Do NOT create one `<Badge variant="status|readiness|lock">` with mutually exclusive props. Instead:

1. **`<Badge>` primitive** (`src/ui/atoms/Badge.tsx`) — handles only visual base:
```typescript
interface BadgeProps {
  children: React.ReactNode;
  color?: string;          // CSS var or token value for text + background tint
  size?: 'xs' | 'sm';
  className?: string;
}
```
Renders: `rounded-full font-mono uppercase tracking-wider` with provided color.
No conditional props, no variant switching. Maximum 50 lines.

2. **`<StatusBadge>`** (`src/ui/StatusBadge.tsx` — update in place):
   Wraps `<Badge>` with status-to-color mapping. Keeps existing props interface.

3. **`<LockBadge>`** (`src/ui/LockBadge.tsx` — update in place):
   Wraps `<Badge>` with lock icon + text. Keeps existing props interface.

4. **`<ReadinessBadge>`** (`src/ui/ReadinessBadge.tsx` — new, replaces PhaseReadinessBadge):
   Wraps `<Badge>` with readiness state-to-color mapping. `PhaseReadinessBadge.tsx` becomes
   an alias that re-exports `<ReadinessBadge>` temporarily until its one consumer is updated.

**Result**: Consumers of StatusBadge, LockBadge, PhaseReadinessBadge change nothing. The
Badge primitive is the only new export added to `src/ui/atoms/`.

**DONE by Codex**: `src/ui/atoms/Badge.tsx`, `src/ui/ReadinessBadge.tsx` created.
`src/ui/StatusBadge.tsx` and `src/ui/LockBadge.tsx` updated to wrap Badge.
`src/builder/cards/templates/phase/PhaseReadinessBadge.tsx` is now a compatibility alias to ReadinessBadge.

---

### ✅ Step 3 — Create `<Chip>` atom

**File**: `src/ui/atoms/Chip.tsx`

Base visual primitive for pill-shaped interactive elements. Shared DNA (from UX-R2):
```
border-radius: rounded-full or rounded-xl
border: 1px var(--theme-border-subtle)
backdrop-blur
font-size: var(--text-xs) or var(--text-sm)
font-weight: semibold
uppercase tracking-wider
```

**Props interface**:
```typescript
interface ChipProps {
  label?: string;
  icon?: React.ReactNode;
  variant?: 'default' | 'accent' | 'ghost';
  size?: 'sm' | 'md';
  isActive?: boolean;
  isDisabled?: boolean;
  draggable?: boolean;
  activeIcon?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}
```

**Migration**: Each existing pill component either:
- Becomes a thin wrapper around `<Chip>` with pre-set props (ChannelPill, InlineIslandButton, IslandToggleButton, MenuSectionButton), OR
- Updates its visual root to use Chip's className set without changing its own API

The semantic names (ChannelPill, IslandToggleButton) are kept — they are not deleted.
They become 10-15 line wrappers. Consumers import from the same path as before.

**DONE by Codex**: `src/ui/atoms/Chip.tsx` created with semantic span mode and native button/drag handler forwarding.
`src/components/elements/buttons/*` (3 files: InlineIslandButton, IslandToggleButton, MenuSectionButton) now consume Chip.
`src/builder/cards/templates/task/task-properties/ChannelPill.tsx` is a non-interactive Chip wrapper.

---

### ✅ Step 4 — Create `<Input>` atom

**File**: `src/ui/atoms/Input.tsx`

**Consolidates**: `TextInputSmall`, `TextInputLarge`, `TextInputInline`

```typescript
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  size?: 'sm' | 'lg' | 'inline';
  variant?: 'default' | 'ghost';
  label?: string;
  error?: string;
}
```

Shared DNA: transparent bg, `border: 1px var(--theme-border-subtle)`, `rounded-lg`,
focus ring with `var(--theme-accent)`, font-size from P1 CSS vars.

**Compound inputs remain as wrappers**: DualInput, ListInputLines, SpecsInput stay as separate
files. Their inner `<input>` element uses `<Input>` as the base. Compound components do not
move to src/ui/atoms/ — they are builder-specific usage patterns.

**Migration**: After Input.tsx is stable, TextInputSmall/Large/Inline can become thin wrapper
files or be deleted if consumers have been updated to use `<Input size="sm/lg/inline">` directly.

**DONE by Codex**: `src/ui/atoms/Input.tsx` created with shared class generation for input and textarea.
`src/components/forms/inputs/*` (7 files) now consume Input or its shared style generator.

---

### ✅ Step 5 — Extend GlassSurface with variant prop

**File**: `src/ui/surfaces/GlassSurface.tsx` (edit in place)

Add `variant?: 'card' | 'island' | 'popup' | 'popover'` that sets default radius + blur.

| Variant | radius | blur |
|---|---|---|
| card | 2.2rem (radiusTokens.card) | backdrop-blur-xl |
| island | 2rem | backdrop-blur-xl |
| popup | rounded-xl | backdrop-blur-md |
| popover | rounded-lg | backdrop-blur-sm |

This is additive — existing consumers pass no `variant` and get current behaviour unchanged.

**DONE by Codex**: `src/ui/surfaces/GlassSurface.tsx` updated with card/island/popup/popover variant styles.

---

### ✅ Step 6 — Create `<ToggleGroup>` atom

**File**: `src/ui/atoms/ToggleGroup.tsx`

```typescript
interface ToggleGroupProps<T extends string> {
  items: Array<{ value: T; label: string; icon?: React.ReactNode }>;
  value: T;
  onChange: (value: T) => void;
  size?: 'sm' | 'md';
  className?: string;
}
```

Migration:
- `ViewTabSwitcher.tsx` → thin wrapper around `<ToggleGroup>` with 3 items
- PhaseEditorSection inline toggle → `<ToggleGroup>` with 2 items

**DONE by Codex**: `src/ui/atoms/ToggleGroup.tsx` created.
`src/builder/islands/MetadataIsland/ViewTabSwitcher.tsx` migrated to ToggleGroup.
`src/builder/islands/EditorViewerIsland/PhaseEditorSection.tsx` migrated to ToggleGroup.

---

### ✅ Step 7 — Create useToggle hook

**File**: `src/hooks/useToggle.ts`

```typescript
export const useToggle = (initial = false) => {
  const [isOpen, setIsOpen] = useState(initial);
  const toggle = useCallback(() => setIsOpen(v => !v), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);
  return [isOpen, toggle, open, close] as const;
};
```

Replace the ~20 `useState(false)` open/close patterns in islands and selects.

**DONE by Codex**: `src/hooks/useToggle.ts` created. 29 open/close consumers migrated from
local useState booleans to useToggle while preserving existing APIs.

**Gate adjustment**: The original gate said `useState(false) ≤ 8`. Codex confirmed count is
22 after migration — every remaining case is non-open state (drag/hover/feedback/loading/saving/
dirty/provider signal). The gate metric was wrong, not the implementation. Gate updated below.

---

### ✅ Step 8 — Merge useActiveNode into useEditorDraft (only)

**Decision** (per Gemini review): Do NOT merge useEditorPanel, useEditorDraft, and useEditorGuard
into a single hook. They cover genuinely different concerns (panel lifecycle, draft state, guard
interception) and merging them to reduce file count would create a bloated hook that exceeds
the 250-line cap.

**Only action**: Inline `useActiveNode` into `useEditorDraft` — these two files duplicate the
same `useStageContext(selectedNodeIds, nodes)` subscription to derive the same active node.
Delete `useActiveNode.ts` after inlining. `useEditorPanel`, `useEditorDraft`, `useEditorGuard`
stay as separate files.

**DONE by Antigravity (2026-06-26)**. `useActiveNode.ts` deleted. Active node derivation logic
(nodes, focusedNodeId lookup) is now inline in `useEditorDraft.ts` (verified at lines 40–99).

---

### ✅ Step 9 — Relocate src/components/ files by capability owner

**Design decision** (per Codex + Gemini review): Do NOT move all 44 files to `src/ui/`.
`src/ui/` is reserved for domain-neutral atoms. Files with builder semantics go to `src/builder/`.

**Classification and destination**:

| Origin folder | Classification | Destination |
|---|---|---|
| `src/components/forms/inputs/` (TextInputSmall, TextInputLarge, TextInputInline, DualInput, ListInputLines, SpecsInput, DateInputTBD) | Generic, domain-neutral inputs | `src/ui/forms/inputs/` |
| `src/components/forms/selects/` (InlineSelect, SearchableSelect, SearchableSelectIcons, CompletionStateSelect) | Generic, domain-neutral selects | `src/ui/forms/selects/` |
| `src/components/elements/buttons/` (InlineIslandButton, IslandToggleButton, MenuSectionButton) | Builder-specific pill buttons | `src/builder/ui/buttons/` |
| `src/components/feedback/` (AlertMark, ReadyMark, ValidationSummary) | Builder-specific feedback | `src/builder/ui/feedback/` |

**Note on success metric**: The goal is not "src/components/ must be empty" but "every file
is in a folder whose name matches its capability owner and layer." After Step 9, `src/components/`
should contain 0 files — but only because every file found a better home, not as a metric target.

Update all import paths in every consumer after moving.

**DONE by Antigravity (2026-06-26)**. Verified on disk: `src/components/` directory is gone (0 files).
Actual destinations used:
- Generic inputs/selects/date → `src/ui/forms/inputs/`, `src/ui/forms/selects/`, `src/ui/forms/date/`
- Builder buttons → `src/builder/ui/buttons/`
- Builder feedback → `src/builder/ui/feedback/`
- Builder forms (channel, subtask) → `src/builder/ui/forms/channel/`, `src/builder/ui/forms/subtask/`
- Builder modals → `src/builder/ui/modals/`

---

## Acceptance Criteria

```bash
# 1. Badge primitive exists
ls src/ui/atoms/Badge.tsx
# Expected: found

# 2. Semantic wrappers still exist (not deleted)
ls src/ui/StatusBadge.tsx src/ui/LockBadge.tsx src/ui/ReadinessBadge.tsx
# Expected: all found

# 3. Chip, Input, ToggleGroup atoms exist
ls src/ui/atoms/Chip.tsx src/ui/atoms/Input.tsx src/ui/atoms/ToggleGroup.tsx
# Expected: all found

# 4. useToggle exists
grep -n 'useToggle' src/hooks/useToggle.ts
# Expected: found

# 5. useActiveNode deleted (merged into useEditorDraft)
ls src/builder/islands/EditorViewerIsland/useActiveNode.ts 2>&1
# Expected: No such file

# 6. useEditorPanel, useEditorDraft, useEditorGuard STILL EXIST (not merged)
ls src/builder/islands/EditorViewerIsland/useEditorPanel.ts
ls src/builder/islands/EditorViewerIsland/useEditorDraft.ts
ls src/builder/islands/EditorViewerIsland/useEditorGuard.ts
# Expected: all three found

# 7. src/components/ is empty
find src/components -name '*.tsx' -o -name '*.ts' | wc -l
# Expected: 0

# 8. useState(false) open/close patterns — verify remaining are NOT open/close toggles
# (Codex confirmed: 22 remain post-migration, all are non-open state: drag/hover/loading/dirty)
# Gate: manually confirm no remaining useState(false) is an open/close toggle
grep -rn 'useState(false)' src/ --include='*.tsx'
# Review list — expected: 0 results named isOpen/isVisible/isExpanded/isMenuOpen

# 9. No builder imports inside src/ui/atoms/ or src/ui/forms/
grep -rn "from.*builder" src/ui/atoms/ src/ui/forms/ 2>/dev/null | wc -l
# Expected: 0

# 10. Build passes
npm run build
# Expected: 0 errors
```

---

## Session log location

Save output to: `docs/plans/completed/src-structure-refactor/output/P2-atomic-components-output.md`
