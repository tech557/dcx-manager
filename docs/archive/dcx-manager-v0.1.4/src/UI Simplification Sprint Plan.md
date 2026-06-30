# DCX Manager v0.1.1 — Assessment & UI Simplification Sprint Plan

**Review Date:** June 2026  
**Codebase:** v0.1.1  
**Against:** Previous plan (Sprints A–F)  
**New goal:** Aggressive structural simplification — one UI system, not many custom pieces

---

## Part 1: v0.1.1 Assessment

### Overall Progress: Solid. Critical wiring gaps are closed.

The three critical issues from Sprint A are resolved. Zero `(window as any)` calls remain. The direct mutation of `currentVersion.phases` is gone. `task.factory.ts` now correctly imports and uses `generateId()` from `id.helpers.ts`. Documentation landed in `docs/` with real content. Sprint D form components (`CreateDCXForm`, `EditVersionForm`, `BrandedTextInput`, `BrandedSelect`) are present. The dual type system is still alive but at least `task.factory.ts` now uses the clean `domain.ts` types internally.

---

### What Was Done Well ✓

**Sprint A (critical wiring) — Complete**
- Zero `(window as any)` usages
- Zero direct mutation of version phases
- `task.factory.ts` uses `generateId()` and `domain.ts` types

**Sprint B (shared UI) — Partially complete**
- `GlassCard`, `IslandCard`, `SectionTitle`, `StatusBadge`, `FileTag`, `AvatarStack`, `MiniBuilderCanvas` all exist
- `GlassCard` is being used in `Home.tsx`, `VersionPage.tsx`, `VersionSwitchBar.tsx`, `VersionSummary.tsx`
- `FileTag` and `MiniBuilderCanvas` used in `VersionSummary.tsx`
- `Home.tsx` is now 178 lines — a genuine reduction from 538

**Sprint C (builder card reorganization) — Largely complete**
- Day cards moved to `cards/day/` correctly
- `PhaseBody.tsx` exists and is extracted
- `cards/index.ts` barrel export exists

**Sprint D (form components) — Complete**
- `CreateDCXForm`, `EditVersionForm`, `BrandedTextInput`, `BrandedSelect` all present in `src/components/forms/`
- `forms/index.ts` barrel export exists

**Sprint E (documentation) — Good first pass**
- `docs/` folder has all 5 planned files: `ARCHITECTURE.md`, `MODULES.md`, `INTEGRATIONS.md`, `COMPONENTS.md`, `MIGRATION_GUIDE.md`
- Content is substantive, not placeholder

**Sprint F (file size reduction) — Meaningful progress**
- `TaskEditor.tsx`: 495 lines (down from 1,201 originally)
- `ViewHelperIsland.tsx`: 298 lines (down from 974)
- `useBuilderNodes.ts`: 307 lines (down from 557)
- `useDeliverableWizard.ts` extracted at 284 lines
- `useResizable.ts` extracted

---

### What Remains Wrong ✗

**`@xyflow/react` is still imported in `PhaseNode.tsx`**  
`Handle`, `Position`, `NodeProps` from `@xyflow/react` are still imported and used in `PhaseNode.tsx` despite the canvas having been replaced by the custom horizontal board. This is a dead dependency shipping 180KB+ of unused code.

**The dual type system is still unresolved**  
`src/types.ts` still has `TaskCardData` with `communicationDate?: string`, `isLinked?: boolean`, `linkedWeek?`, `linkedDay?`. The entire component tree (`ActionCard`, `FullTaskCard`, `SmallTaskCard`, `BuilderContext`, `useBuilderNodes`, `useActionTasks`, etc.) imports from `types.ts`. Only 2 files use `domain.ts` types. The `task.factory.ts` now uses domain types internally, but its output is never received by components expecting `domain.ts` `Task` — they expect `TaskCardData`. This mismatch will surface immediately on backend integration.

**`GlassCard` is partially adopted but raw `backdrop-blur` remains in 35 places**  
`GlassCard` exists and is used in 4 page files, which is progress. But 35 occurrences of raw `backdrop-blur-3xl` remain across builder cards, islands, kanban columns, and tooltip overlays — none of them use the shared primitive. The builder's visual system is still custom per-component.

**Island shells are 5 different implementations of the same pattern**  
`EditorIsland`, `FocusIsland`, `CreatorIsland`, `SelectionIsland`, `MetadataIsland`, `ViewHelperIsland` all share: a `backdrop-blur-3xl border` container, dark/light theme switching, `motion.div` animation, expand/collapse behavior, and a pill shape. But each one is written from scratch with its own className strings, its own motion config, and its own expand logic. Changing the island visual language requires editing 6+ files.

**Builder card selection, drag, and hover are implemented separately in each card type**  
`PhaseNode`, `ActionCard`, `FullTaskCard`, `SmallTaskCard` all independently implement:
- `isSelected = selectedIds.has(id)`  
- `toggleSelection(id, isMulti)` on click
- `draggable`, `onDragStart`, `onDragEnd` with `setDraggingType`
- Their own dark/light selected-state styling strings

This logic is the same in all four. It is written four times.

**`StatsOverview.tsx` still has raw inline `backdrop-blur-2xl rounded-3xl border` tooltip**  
Not using `GlassCard`. The stat tooltip popup still has its own glass string.

**`VersionPage.tsx` at 337 lines — not reduced**  
Target was ≤350 so technically in range, but it still imports only one `GlassCard` usage from the shared system. The remaining visual structure is still inline.

**`Date.now()` still used for non-timestamp IDs in 3 places**  
- `CreateDCXForm.tsx`: `dcx-${Date.now()}`, `v-${Date.now()}` for DCX and version IDs
- `VersionPage.tsx`: `v-${Date.now()}` for new version ID
- `Home.tsx`: `view-${Date.now()}` for saved view ID
The builder nodes themselves are fixed; these are the remaining form/page-level ID generators.

---

### Confirmed: The Core Problem

The assessment confirms what you described. The codebase now has all the right structural pieces in place. But the **builder and page components are not using the shared system** — they are still writing their own visual logic inline. We have:

- A `GlassCard` component used in 4 places out of ~35 glass containers
- An island concept with 6 independent implementations instead of 1
- A card concept with 4 independent selection/drag implementations instead of 1
- Design tokens (colors, blur, radius, shadow) scattered as raw strings in 35+ locations

The next refactor must be structural, not additive. No new files. The goal is to make existing components *use the system that now exists*.

---

## Part 2: The Simplification Sprint Plan

### Guiding Principle

> Stop adding. Start replacing. If the visual output of a file can be produced by composing existing shared components, replace the inline code with the shared component.

The goal is: **one change to a shared primitive → all components that use it update automatically.**

---

### Sprint 1: Design Token Consolidation [COMPLETE ✓]

**Goal:** All colors, blur values, radius values, shadow strings, and motion configs that appear in more than one file are extracted into one constants file. No component invents its own theme string.

**What to create:**

`src/styles/tokens.ts`

This file is the single source of truth for all visual decisions. It exports plain string constants and helper functions — no React, no JSX.

```typescript
// Theme surfaces
export const SURFACE = {
  dark: {
    base:     "bg-[#0D0D0E]/60 border-white/[0.04]",
    raised:   "bg-[#151516]/80 border-white/[0.06]",
    glass:    "bg-black/20 border-white/[0.03]",
    pill:     "bg-white/5 border-white/[0.04]",
    pillHover:"hover:bg-white/10 hover:border-white/[0.08]",
    selected: "bg-[#75E2FF]/5 border-white/[0.06] shadow-[0_0_15px_rgba(117,226,255,0.15)]",
    overlay:  "bg-[#0d0d0e]/95 border-white/[0.04]",
  },
  light: {
    base:     "bg-white/85 border-[#151516]/10",
    raised:   "bg-white/95 border-black/[0.08]",
    glass:    "bg-white/75 border-black/[0.07]",
    pill:     "bg-black/[0.04] border-black/5",
    pillHover:"hover:bg-neutral-100",
    selected: "bg-[#75E2FF]/2 border-black/[0.06] shadow-[0_0_10px_rgba(117,226,255,0.1)]",
    overlay:  "bg-white/95 border-black/[0.08]",
  }
} as const;

// Shared radii
export const RADIUS = {
  pill:   "rounded-full",
  island: "rounded-[2rem]",
  card:   "rounded-[2.2rem]",
  panel:  "rounded-[1.6rem]",
  chip:   "rounded-xl",
  sm:     "rounded-lg",
} as const;

// Shared blur
export const BLUR = {
  heavy: "backdrop-blur-3xl",
  mid:   "backdrop-blur-xl",
  light: "backdrop-blur-md",
} as const;

// Shared shadows
export const SHADOW = {
  island: "shadow-[0_12px_40px_rgba(0,0,0,0.2)]",
  card:   "shadow-[0_8px_32px_rgba(0,0,0,0.3)]",
  overlay:"shadow-[0_20px_50px_rgba(0,0,0,0.3)]",
  glow:   "shadow-[0_0_15px_rgba(117,226,255,0.15)]",
} as const;

// Shared motion spring config (used by all island expand animations)
export const SPRING = {
  island: { type: "spring", stiffness: 180, damping: 24, mass: 0.95 },
  card:   { type: "spring", stiffness: 200, damping: 20 },
  gentle: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
} as const;

// Accent color
export const PRIMARY = "#75E2FF";

// Helper: compose surface + blur + radius for the standard island pill
export function islandClass(isDark: boolean, isExpanded: boolean): string {
  const surface = isDark ? SURFACE.dark : SURFACE.light;
  return [
    BLUR.heavy,
    RADIUS.island,
    "border transition-all duration-500 select-none pointer-events-auto",
    isExpanded ? surface.base : `${surface.pill} ${surface.pillHover}`,
  ].join(" ");
}

// Helper: card selected state
export function cardSelectedClass(isDark: boolean, isSelected: boolean): string {
  if (!isSelected) return "";
  return isDark ? SURFACE.dark.selected : SURFACE.light.selected;
}
```

**Files to update after creating tokens:**
- `GlassCard.tsx` — import from tokens
- `IslandCard.tsx` — import from tokens
- `KanbanColumn.tsx` — import from tokens
- `KanbanColumnCollapsed.tsx` — import from tokens
- All tooltip components — import from tokens

**Acceptance criteria:**
- `grep -rn "bg-\[#0D0D0E\]\|bg-\[#0d0d0e\]" src/` returns 0 results
- `grep -rn "shadow-\[0_12px_40px" src/` returns ≤1 result (the token definition itself)
- `src/styles/tokens.ts` is the only place that owns the `#75E2FF` color string

---

### Sprint 2: BuilderIslandShell — One Island Template [COMPLETE ✓]

**Goal:** All builder islands share one shell component. Changing the island shape, animation, or dark/light tokens changes all islands simultaneously.

**What to create:**

`src/pages/builder/components/elements/islands/BuilderIslandShell.tsx`

```typescript
interface BuilderIslandShellProps {
  isDark: boolean;
  isExpanded: boolean;
  onToggle?: () => void;
  
  // Collapsed state
  collapsedIcon: React.ReactNode;        // icon shown when pill
  collapsedWidth?: number;               // default 56
  collapsedHeight?: number;              // default 56
  
  // Expanded state
  expandedWidth?: number | "auto";
  expandedHeight?: number | "auto";
  
  // Shape
  shape?: "pill" | "panel";             // pill = rounded-full→island, panel = always island
  
  // Layout
  className?: string;
  children?: React.ReactNode;           // content when expanded
  
  // Positioning behavior
  position?: "bottom-bar" | "side" | "overlay" // for layout awareness
}
```

The shell owns:
- The `motion.div` with spring animation
- The `islandClass(isDark, isExpanded)` from tokens
- The collapsed→expanded size transition
- The `onClick` guard (only fires when collapsed)

Every island becomes:

```tsx
// FocusIsland (simplified)
<BuilderIslandShell isDark={isDark} isExpanded={isExpanded} onToggle={toggleExpand}
  collapsedIcon={<Target className="w-5 h-5" />}
  expandedWidth={56} expandedHeight={isExpanded ? 310 : 56}
>
  {/* content */}
</BuilderIslandShell>

// CreatorIsland (simplified)
<BuilderIslandShell isDark={isDark} isExpanded={isOpen} onToggle={() => setIsOpen(true)}
  collapsedIcon={<Plus className="w-5 h-5" />}
  shape="pill" expandedWidth="auto" expandedHeight={56}
>
  {/* creator buttons */}
</BuilderIslandShell>
```

**Islands to migrate to BuilderIslandShell:**
- `FocusIsland.tsx` — remove inline motion.div, use shell
- `CreatorIsland.tsx` — remove inline motion.div, use shell
- `EditorIsland.tsx` — use shell for outer container
- `SelectionIsland.tsx` — use shell
- `ViewHelperIsland.tsx` — use shell for the pill trigger

**Islands that stay custom (justified exceptions):**
- `MetadataIsland.tsx` — it is always `rounded-full h-14`, never expands vertically, no toggle. It is a fixed top bar, not an expandable island. It should stay as-is but import from tokens for its className.

**Acceptance criteria:**
- `motion.div` with `stiffness: 180, damping: 24` appears in exactly 1 file (`BuilderIslandShell`)
- All 5 expandable islands render through `BuilderIslandShell`
- Visual output is identical to current

---

### Sprint 3: BuilderCardShell — One Card Template [COMPLETE ✓]

**Goal:** The shared selection, drag, highlight, and dark/light behavior across all builder cards lives in one shell. Changing card interaction behavior changes all cards simultaneously.

**What to create:**

`src/pages/builder/components/elements/cards/BuilderCardShell.tsx`

```typescript
interface BuilderCardShellProps {
  id: string;
  isDark: boolean;
  isDraggable?: boolean;
  dragType?: "phase" | "action" | "task" | "day";
  
  // Selection
  isSelected?: boolean;
  onSelect?: (e: React.MouseEvent) => void;  // handles Cmd/Ctrl multi-select
  
  // Visual variant
  variant?: "phase" | "action" | "task-full" | "task-small" | "day";
  
  // Highlight (newly created)
  isHighlighted?: boolean;
  
  // Container
  className?: string;
  children: React.ReactNode;
}
```

The shell owns:
- `cardSelectedClass(isDark, isSelected)` from tokens
- `draggable`, `onDragStart`, `onDragEnd` (calls `setDraggingType`)
- `useNewObjectHighlight(id)` — highlight ring on create
- `Cmd/Ctrl + click` → `toggleSelection(id, isMulti)`
- Base surface class from tokens by variant

**Cards to migrate:**
- `ActionCard.tsx` — remove selection and drag logic, use `BuilderCardShell`
- `FullTaskCard.tsx` — remove selection and drag logic, use `BuilderCardShell`
- `SmallTaskCard.tsx` — remove selection and drag logic, use `BuilderCardShell`
- `PhaseNode.tsx` — remove selection logic, use `BuilderCardShell` for the outer container (but keep `@xyflow Handle` only if truly needed — see below)

**Regarding `@xyflow` in PhaseNode:**  
`Handle` and `Position` from `@xyflow/react` are imported but the custom `HorizontalBoard` does not use ReactFlow's canvas. These imports should be removed. `NodeProps` is used as the prop type — replace with a plain typed interface. This allows removing `@xyflow/react` from `package.json` entirely.

**Acceptance criteria:**
- `selectedIds.has(id)` for cards exists in exactly 1 file (`BuilderCardShell`)
- `setDraggingType` for cards exists in exactly 1 file (`BuilderCardShell`)
- `useNewObjectHighlight` for cards exists in exactly 1 file (`BuilderCardShell`)
- `@xyflow/react` removed from `package.json` and all source files
- All card visual selection behavior is unchanged

---

### Sprint 4: Finalize GlassCard Adoption + Remove All Raw Inline Glass [COMPLETE ✓]

**Goal:** Every glass container in the app is either `<GlassCard>`, `<BuilderIslandShell>`, `<BuilderCardShell>`, or a token-based class from `styles/tokens.ts`. No component invents its own `backdrop-blur-3xl rounded-[2rem] border` inline.

**Current count of raw `backdrop-blur` in `src/pages/`: 35**  
**Target after this sprint: 0 in page-level components**

**Categorize the 35 occurrences:**

*Category A — Should become `<GlassCard>`:*
- `StatsOverview.tsx` tooltip overlay (currently `rounded-3xl border backdrop-blur-2xl`)
- `VersionCard.tsx` — card container (not yet using `GlassCard`)
- `SearchFilters.tsx` — filter popup

*Category B — Should become `<BuilderIslandShell>` (handled by Sprint 2):*
- `FocusIsland`, `CreatorIsland`, `SelectionIsland`, `ViewHelperIsland` pill containers

*Category C — Should become `<BuilderCardShell>` (handled by Sprint 3):*
- `KanbanColumn.tsx`, `KanbanColumnCollapsed.tsx`, `CollapsedDayCard.tsx`, `PhaseNode.tsx`, `ActionCard.tsx`, `FullTaskCard.tsx`, `SmallTaskCard.tsx`

*Category D — Popup/tooltip overlays — should use a new `<PopoverShell>` component:*
- `DatePickerPopup.tsx`, `SubtaskCard.tsx` dropdown, `FilesConnection.tsx` popup, `Collaborators.tsx` popup, `PhaseLocatePopup.tsx`, `ActionLocatePopup.tsx`, `TaskLocatePopup.tsx`
- These all follow: `absolute z-50 rounded-[1.6rem] border backdrop-blur-3xl p-4`

**New component for Category D:**

`src/components/ui/PopoverShell.tsx`
```typescript
interface PopoverShellProps {
  isDark: boolean;
  children: React.ReactNode;
  className?: string;
  width?: string; // e.g. "w-[300px]"
}
// Renders: absolute z-50 backdrop-blur-3xl border rounded-panel shadow-overlay + theme surface
```

**Files to update:**
- `StatsOverview.tsx` → `<GlassCard>`
- `VersionCard.tsx` → `<GlassCard>`
- `SearchFilters.tsx` filter popup → `<GlassCard>`
- `DatePickerPopup.tsx` → `<PopoverShell>`
- `FilesConnection.tsx` popup → `<PopoverShell>`
- `Collaborators.tsx` popup → `<PopoverShell>`
- `PhaseLocatePopup.tsx` → `<PopoverShell>`
- `ActionLocatePopup.tsx` → `<PopoverShell>`
- `TaskLocatePopup.tsx` → `<PopoverShell>`
- `SubtaskCard.tsx` duration dropdown → `<PopoverShell>`
- `KanbanColumnHeader.tsx` icon picker → `<PopoverShell>`

**Acceptance criteria:**
- `grep -rn "backdrop-blur-3xl" src/pages` returns 0 results
- `grep -rn "backdrop-blur" src/components` returns exactly the token definition and the 4 shell components that legitimately own it

---

### Sprint 5: Unified Dark/Light Theme Hook [COMPLETE ✓]

**Goal:** No component receives `isDark: boolean` as a prop for the purpose of generating className strings. All theme-driven class decisions happen through one hook.

**The problem:**  
Currently, `isDark` is prop-drilled 6+ levels deep (App → BuilderPage → BuilderKanbanView → KanbanColumn → ActionCard → ActionCardHeader → ...). Every component generates its own theme strings from the boolean. Adding a third theme or changing a dark-mode color requires touching every component.

**What to create:**

`src/hooks/useTheme.ts`
```typescript
export function useTheme() {
  const isDark = useAppStore(s => s.isDark);  // or Context
  
  return {
    isDark,
    surface: isDark ? SURFACE.dark : SURFACE.light,
    text: {
      primary:   isDark ? "text-white"        : "text-[#1a1a1b]",
      secondary: isDark ? "text-white/50"     : "text-black/40",
      accent:    "text-[#75E2FF]",
    },
    divider:   isDark ? "bg-white/10"        : "bg-black/10",
    inputBg:   isDark ? "bg-white/[0.04]"    : "bg-black/[0.04]",
    inputBorder: isDark ? "border-white/[0.06]" : "border-black/[0.08]",
  };
}
```

**What this means for `isDark` props:**

Rather than removing `isDark` from all props immediately (which is a large refactor), this sprint does two things:
1. Creates `useTheme()` — any component that needs to make theme decisions calls `useTheme()` internally instead of receiving `isDark` as a prop
2. Moves `isDark` state out of `App.tsx` `useState` and into the Zustand `builderStore` (or a small separate `appStore`) so `useTheme()` can read it without prop drilling

`BuilderIslandShell` and `BuilderCardShell` should call `useTheme()` internally. Pages and islands stop passing `isDark` down.

**Phase 1 for this sprint (low risk):**
- Move `isDark` into Zustand store (new `useAppStore` or extend `builderStore`)
- Create `useTheme()` hook
- `BuilderIslandShell` and `BuilderCardShell` use `useTheme()` — they drop the `isDark` prop
- `GlassCard` and `PopoverShell` use `useTheme()` — they drop the `isDark` prop

**Phase 2 (follow-on — can be done incrementally):**
- Remove `isDark` from page props as components are touched for other reasons
- Eventually, no component has `isDark` in its prop interface

**Acceptance criteria:**
- `isDark` removed from `BuilderIslandShell`, `BuilderCardShell`, `GlassCard`, `PopoverShell` props
- These 4 shell components call `useTheme()` internally
- `App.tsx` no longer prop-drills `isDark` into these specific components
- Visual output identical to current

---

### Sprint 6: Type System Consolidation — Retire `types.ts` TaskCardData

**Goal:** One type system. `domain.ts` is the source of truth for all builder entity types. `types.ts` retains only app-level, non-builder types.

**The problem in concrete terms:**  
`task.factory.ts` creates `Task` (domain type). But `ActionCard.tsx` expects `TaskCardData` (legacy type). So right now, the factory output cannot actually be used by the components it was designed to feed. The two systems exist but never connect.

**Migration approach — do NOT rewrite all components at once:**

Step 1: Merge the two task types. Add the missing fields from `TaskCardData` that have no equivalent in `domain.ts`:

```typescript
// domain.ts — extend Task to cover everything TaskCardData had
export interface Task {
  id: string;
  name: string;
  channelId: string;
  message: string;
  senderId: string;
  receiverId: string;
  specsIdentifier: string;
  missingFields: string[];
  subtasks: Subtask[];
  date: TaskDate;
  isSmall?: boolean;         // UI preference — stays on task for now, doc as "UI only"
  // Removed: communicationDate, isLinked, linkedWeek, linkedDay
}

// domain.ts — extend Action to cover ActionCardData
export interface Action {
  id: string;
  name: string;
  description?: string;
  startDate: string;
  endDate: string;
  tasks: Task[];
  // Removed: taskCount (always compute from tasks.length)
}

// domain.ts — extend Phase to cover PhaseData  
export interface Phase {
  id: string;
  label: string;
  icon: PhaseIconType;
  startDate: string;
  endDate: string;
  actions: Action[];
  // Removed: actionCount, taskCount, position
}
```

Step 2: In `types.ts`, replace `TaskCardData`, `ActionCardData`, `PhaseData` with re-exports from `domain.ts`:
```typescript
// types.ts
export type { Task as TaskCardData, Action as ActionCardData, Phase as PhaseData } from "./types/domain";
```

This makes all existing `import { TaskCardData } from "../types"` work immediately without touching the import lines. The types now resolve to the clean domain types.

Step 3: Fix the 3 fields that differ between the old and new shapes:
- `communicationDate` → translate to `task.date` in any remaining reads (search for `communicationDate` — should be few since most were migrated)
- `taskCount`/`actionCount` — remove any stored values; use `action.tasks.length` and `phase.actions.length`

**Acceptance criteria:**
- `grep -rn "communicationDate\|isLinked\|linkedWeek\|linkedDay" src/pages` returns 0 results
- `grep -rn "taskCount\|actionCount" src/pages` returns 0 results (except docs/comments)
- `types.ts` re-exports from `domain.ts` for the 3 core builder types
- `task.factory.ts` output is assignable to `TaskCardData` without type cast

---

### Sprint 7: Remove `@xyflow/react` + Fix Remaining `Date.now()` IDs [COMPLETE ✓]

**Goal:** Dead dependencies removed. ID generation is consistent everywhere.

**`@xyflow/react` removal:**
- `PhaseNode.tsx` line 2: remove `Handle, Position, NodeProps` import
- Replace `NodeProps` in `PhaseNode` prop type with a plain interface:
  ```typescript
  interface PhaseNodeProps {
    id: string;
    data: PhaseData & { isDark: boolean; /* ... */ };
    selected?: boolean;
  }
  ```
- Confirm no other file imports from `@xyflow/react`
- Remove `"@xyflow/react"` from `package.json` dependencies

**`Date.now()` ID cleanup:**
- `CreateDCXForm.tsx`: replace `dcx-${Date.now()}` and `v-${Date.now()}` with `generateId()`
- `VersionPage.tsx`: replace `v-${Date.now()}` with `generateId()`
- `Home.tsx`: replace `view-${Date.now()}` with `generateId()` (or a simple `view-` + nanoid for readability — saved views never go to backend)

**Acceptance criteria:**
- `"@xyflow/react"` not in `package.json`
- No `import.*xyflow` in any source file
- `grep -rn "Date\.now()" src/` returns only `mock/activity.ts` (timestamp math, not ID generation) and date arithmetic uses (e.g. `new Date(Date.now() + 14 * ...)` for default end dates — these are legitimate)

---

### Sprint 8: AGENTS.md — Permanent Codegen Rules

**Goal:** A root-level `AGENTS.md` file that AI agents receive at the start of every development session. It enforces all architectural rules from this project and prevents regression.

**Create `AGENTS.md` at project root with sections:**

1. **Read this first** — brief description of what DCX Manager is
2. **File responsibility rules** — the table from the previous plan, with additions:
   - All islands use `BuilderIslandShell`
   - All builder cards use `BuilderCardShell`  
   - All glass containers use `GlassCard` or `PopoverShell`
   - All theme decisions use `useTheme()` or `styles/tokens.ts`
   - `isDark` is never prop-drilled past 2 levels
   - Never create a new glass container inline
   - Never create a new island shell from scratch
   - Never store `taskCount`, `actionCount`, or any derived count
   - Never use `(window as any)`
   - Never use `Date.now()` for IDs — use `generateId()`
   - Never import from `@xyflow/react`
   - Never add `communicationDate`, `isLinked`, `linkedWeek` to any type

3. **Component system reference** — one-paragraph summary of each shell component and when to use it
4. **Folder rules** — which folders own which concerns, what must not go where
5. **Before you start a task** — checklist: read types, read tokens, use existing shells, check if something already exists before creating a new file
6. **What not to do** — specific list of past anti-patterns this codebase has recovered from

---

## Part 3: Sprint Execution Order

```
Sprint 1: Design Token Consolidation         ← Foundational. Do first. No UI risk.
Sprint 2: BuilderIslandShell                 ← Depends on Sprint 1 tokens.
Sprint 3: BuilderCardShell                   ← Can run in parallel with Sprint 2.
Sprint 4: GlassCard/PopoverShell adoption    ← Depends on Sprints 1–3.
Sprint 5: useTheme hook                      ← Can start after Sprint 1.
Sprint 6: Type system consolidation          ← Can run independently at any point.
Sprint 7: Remove @xyflow + Date.now() IDs   ← Any time. Low risk. Do early.
Sprint 8: AGENTS.md                         ← Do last, after structure is stable.
```

Run Sprint 7 alongside Sprint 1. It is purely subtractive and has no dependencies.

---

## Part 4: What This Achieves

After these sprints, a change to any of the following requires editing **one file**:

| What changes | File to edit |
|---|---|
| Island shape, blur, animation spring | `BuilderIslandShell.tsx` |
| Card selection appearance, drag behavior | `BuilderCardShell.tsx` |
| Glass card style (radius, blur, shadow) | `GlassCard.tsx` reading from `tokens.ts` |
| Popover/tooltip overlay style | `PopoverShell.tsx` |
| Primary accent color (`#75E2FF`) | `styles/tokens.ts` |
| Dark mode surface colors | `styles/tokens.ts` |
| Phase card layout (columns, padding, section order) | `PhaseBody.tsx` |
| Task type definition | `types/domain.ts` |
| ID generation strategy | `utils/id.helpers.ts` |
| Builder save/autosave behavior | `services/versions.service.ts` |

And the rules in `AGENTS.md` ensure no future development run recreates any of these inline.

---

## Part 5: Permanent File Responsibility Rules (Updated)

| Layer | Rule |
|---|---|
| `styles/tokens.ts` | Owns all color, blur, radius, shadow, and motion constants. Nothing else owns these. |
| `components/ui/GlassCard` | Standard glass container for Home and Version pages. Never use raw backdrop-blur in pages. |
| `components/ui/PopoverShell` | Standard floating popup/tooltip overlay everywhere. |
| `components/ui/IslandCard` | Static framed container (not expandable). |
| `BuilderIslandShell` | All expandable builder islands. No island writes its own motion.div expand logic. |
| `BuilderCardShell` | All builder cards (phase, action, task, day). No card writes its own selection/drag logic. |
| `useTheme()` | All theme class decisions inside shell components. Never `isDark ? "..." : "..."` in a shell. |
| `types/domain.ts` | All builder entity types (Task, Action, Phase, TaskDate). `types.ts` re-exports these. |
| `utils/id.helpers.ts` | All ID generation. Never `Date.now()` or `Math.random()` for IDs. |
| `styles/tokens.ts` | Only file that contains `#75E2FF`, `#0D0D0E`, `backdrop-blur-3xl`, specific shadow strings. |
| No file in `src/pages/` | Defines its own glass style, island style, or card interaction behavior. |
| No `(window as any)` | Anywhere. Ever. Use the store. |
| No `@xyflow/react` | Anywhere. Ever. |
| No stored `taskCount`/`actionCount` | Always compute from array length. |

---

*End of DCX Manager v0.1.1 Assessment & Simplification Sprint Plan*