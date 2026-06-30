# DCX Manager v0.2.2 — Refactor Plan & Updated Development Plan

**Status:** Builder is visually correct. Sprints 0–17 (including unplanned agent chat improvements) completed.  
**Problem:** Redundancy and inconsistency have accumulated. The same pattern is written 4–5 times instead of once.  
**Goal:** Remove duplication, establish shared primitives, make every file single-purpose — without changing visual output.

---

## Part 1 — Audit: What the Code Actually Has

### What is solid and must not change

- Builder three-row layout (`BuilderPage.tsx`, `brand/index.css`) — 144/993 lines, well structured
- `BuilderIslandShell.tsx` — correct animation, handles expand/collapse cleanly
- `StageCore.tsx` / `StageProvider.tsx` / `stage.registry.ts` — correct architecture
- `card.registry.ts`, `useCardBehavior.ts`, `FieldIndicator.tsx` — correct
- `actions/` split (phase/action/task/node) — correct
- `effects/effects.registry.ts` — correct
- `types/` layer — clean, no `types.ts` bridge
- `rules/` layer — correct separation
- `dropzones/` engine — correct
- `dragDropHelpers.ts` — small and correct

### What has duplication and redundancy

**Problem 1 — `isDark` conditional strings scattered across 5 files**  
`MetadataIsland`, `FocusIsland`, `BuilderIslandShell`, `HeaderBrandIsland`, `HeaderUserIsland` each repeat the same pattern:
```tsx
isDark ? 'text-white/40' : 'text-black/40'
isDark ? 'bg-white/5' : 'bg-black/[0.04]'
isDark ? 'bg-white/10' : 'bg-black/10'
```
This is 26 occurrences that should be CSS variables defined once in `brand/index.css`.

**Problem 2 — `MetadataIsland.tsx` at 327 lines mixes four concerns**  
1. Header layout (positions three islands in a row)
2. Status badge + lock indicator
3. Lifecycle transition buttons (Start / Post / Approve / Duplicate)
4. View tab switcher

Each of these is a reusable piece that will be needed elsewhere or needs to be changed independently.

**Problem 3 — `CardShell.tsx` at 242 lines contains drag/drop logic that belongs in `dragDropHelpers.ts`**  
The drop handler switch (phase/action/task × self/parent/phase) is ~120 lines of logic inside a presentation component. It should be a pure function called from the shell.

**Problem 4 — Every island reads `useAppStore` + derives `isDark` independently**  
Each island does:
```tsx
const themeMode = useAppStore((state) => state.themeMode);
const isDark = themeMode === 'dark';
```
This is a one-line hook that should be `useTheme()`.

**Problem 5 — `DayGridCard.tsx` at 296 lines mixes day rendering with task-creation form**  
The inline task-creation form (the `isAdding` state, action selector, task name input) is 80+ lines embedded in a visual rendering component.

**Problem 6 — `TaskEditorSection.tsx` at 282 lines has no sub-components**  
Three distinct form sections (identity fields, specs/missing-data three-state toggles, date configuration) are inlined without extraction.

**Problem 7 — Status badge, lock indicator, and lifecycle buttons are in MetadataIsland only**  
These will be needed on the Version Room page (`/version/:id`). They are not shared components.

**Problem 8 — `FocusIsland.tsx` at 231 lines has repeated list-render pattern**  
The same filtered-list + search + click-to-select pattern is duplicated for phases, actions, and tasks.

---

## Part 2 — Target Folder Structure

The additions below do not change any existing folder's purpose. They only add shared primitive layers that eliminate the duplication described above.

```
src/
│
├── brand/
│   ├── tokens.ts                       unchanged
│   ├── index.css                       add CSS variables for theme-sensitive values
│   └── fonts/                          unchanged
│
├── hooks/                              ADD these shared hooks
│   ├── useTheme.ts                     NEW — single place to read isDark from appStore
│   └── useIsMobile.ts                  NEW — responsive breakpoint hook (future-ready)
│
├── ui/                                 ADD shared primitive components
│   ├── StatusBadge.tsx                 NEW — VersionStatus → styled pill (used in header + version room)
│   ├── LockBadge.tsx                   NEW — locked/editable indicator pill
│   ├── DividerLine.tsx                 NEW — the h-5 w-[1px] vertical separator (used 8x in MetadataIsland)
│   └── GlassTooltip.tsx               NEW — positioned tooltip on hover (used in phase density bar)
│
├── builder/
│   │
│   ├── cards/
│   │   ├── CardShell.tsx               REFACTOR — extract drop logic to handleCardDrop.ts
│   │   ├── handleCardDrop.ts           NEW — pure function: (event, nodes, kind, data, actions) → void
│   │   ├── useCardBehavior.ts          unchanged
│   │   ├── FieldIndicator.tsx          unchanged
│   │   ├── card.registry.ts            unchanged
│   │   ├── dragDropHelpers.ts          unchanged
│   │   └── templates/
│   │       ├── phase/                  REFACTOR PhaseCard — extract sub-components
│   │       │   ├── PhaseCard.tsx       REFACTOR (≤120 lines — remove inline select logic)
│   │       │   ├── PhaseDensityBar.tsx NEW — the density bar visualization (≤40 lines)
│   │       │   ├── PhaseReadinessBadge.tsx NEW — readiness badge display only (≤30 lines)
│   │       │   └── phase.icons.ts      unchanged
│   │       ├── action/                 REFACTOR ActionCard
│   │       │   ├── ActionCard.tsx      REFACTOR (≤100 lines)
│   │       │   └── ActionTaskList.tsx  NEW — the nested task rendering section (≤60 lines)
│   │       ├── task/                   unchanged — already well-scoped
│   │       │   ├── TaskCard.tsx
│   │       │   ├── ChannelPill.tsx
│   │       │   └── channel.icons.ts
│   │       └── day/                    REFACTOR DayGridCard
│   │           ├── DayGridCard.tsx     REFACTOR (≤150 lines — rendering only)
│   │           └── DayTaskCreator.tsx  NEW — the inline create-task form (≤80 lines)
│   │
│   ├── islands/
│   │   ├── BuilderIslandShell.tsx      REFACTOR — remove isDark inline, use useTheme()
│   │   │
│   │   ├── MetadataIsland/
│   │   │   ├── MetadataIsland.tsx      REFACTOR — orchestrator only (≤120 lines)
│   │   │   ├── CampaignDetailsGroup.tsx NEW — project name + version label section (≤60 lines)
│   │   │   ├── LifecycleActions.tsx    NEW — Start/Post/Approve/Duplicate buttons (≤80 lines)
│   │   │   └── ViewTabSwitcher.tsx     NEW — Kanban/Timeline tab pills (≤50 lines)
│   │   │
│   │   ├── EditorViewerIsland/
│   │   │   ├── EditorViewerIsland.tsx  REFACTOR — shell + section selector (≤180 lines)
│   │   │   ├── useEditorDraft.ts       unchanged
│   │   │   ├── useEditorGuard.ts       unchanged
│   │   │   ├── PhaseEditorSection.tsx  unchanged
│   │   │   ├── ActionEditorSection.tsx unchanged
│   │   │   ├── TaskEditorSection.tsx   REFACTOR — extract sub-sections (≤150 lines)
│   │   │   │   → SpecsStateField.tsx   NEW — specs three-state toggle + value input (≤60 lines)
│   │   │   │   → MissingDataField.tsx  NEW — missing data toggle + value input (≤60 lines)
│   │   │   │   → TaskDateField.tsx     NEW — date mode selector + offset/fixed inputs (≤70 lines)
│   │   │   ├── DayEditorSection.tsx    unchanged
│   │   │   └── UnsavedChangesModal.tsx unchanged
│   │   │
│   │   ├── FocusIsland/
│   │   │   ├── FocusIsland.tsx         REFACTOR — remove repeated list pattern (≤130 lines)
│   │   │   └── FocusSearchList.tsx     NEW — shared filtered list with search + click (≤70 lines)
│   │   │
│   │   ├── HeaderBrandIsland.tsx       REFACTOR — use useTheme(), remove isDark inline
│   │   ├── HeaderUserIsland.tsx        REFACTOR — use useTheme(), remove isDark inline
│   │   ├── KanbanBuilderIsland/        unchanged
│   │   ├── SelectionIsland/            unchanged
│   │   ├── TimelineBuilderIsland/      unchanged
│   │   ├── ViewHelperIsland/           unchanged
│   │   └── AIChatPopup/                unchanged
│   │
│   └── stage/                          unchanged
│
├── components/
│   ├── version/                        ADD — shared version-level components
│   │   ├── VersionStatusBadge.tsx      extracted from MetadataIsland StatusBadge logic
│   │   └── VersionLockBadge.tsx        extracted from MetadataIsland lock indicator
│   ├── auth/                           unchanged
│   ├── forms/                          unchanged
│   ├── modals/                         unchanged
│   └── topbar/                         unchanged
```

---

## Part 3 — Refactor Sprints (No Feature Changes)

These sprints are pure refactoring. The visual output must be **identical before and after each sprint**. The agent must run `npm run dev` and visually confirm nothing changed before committing.

---

### Sprint R1 — Theme Hook and CSS Variables

**Status:** Done — completed June 20, 2026. See `docs/progress-log.md` Sprint R1.

**Goal:** Replace all 26 `isDark ? '...' : '...'` conditional strings with a `useTheme()` hook and CSS custom properties.

**Covers:** Brand consistency, removes the biggest source of duplication.

#### Task R1.1 — Create `src/hooks/useTheme.ts`
**Status:** Done.
```typescript
import { useAppStore } from '@/store/appStore';

export function useTheme() {
  const themeMode = useAppStore((s) => s.themeMode);
  return {
    isDark: themeMode === 'dark',
    themeMode,
  };
}
```
**Creates:** `src/hooks/useTheme.ts` (~8 lines)

#### Task R1.2 — Add theme CSS variables to `brand/index.css`
**Status:** Done.

Add at the top, inside `:root` and `.dark` selectors (or using `[data-theme="dark"]` — match whatever `appStore` applies to `<body>`):

```css
:root {
  --theme-muted: rgba(21, 21, 22, 0.4);
  --theme-divider: rgba(0, 0, 0, 0.1);
  --theme-glass-bg: rgba(255, 255, 255, 0.85);
  --theme-text-primary: #151516;
  --theme-text-muted: rgba(21, 21, 22, 0.68);
  --theme-border-subtle: rgba(0, 0, 0, 0.08);
}

[data-theme="dark"], .dark {
  --theme-muted: rgba(247, 247, 248, 0.4);
  --theme-divider: rgba(255, 255, 255, 0.1);
  --theme-glass-bg: rgba(13, 13, 14, 0.88);
  --theme-text-primary: #F7F7F8;
  --theme-text-muted: rgba(247, 247, 248, 0.72);
  --theme-border-subtle: rgba(255, 255, 255, 0.08);
}
```

#### Task R1.3 — Refactor all 5 files that use `isDark` inline
**Status:** Done.

Files: `MetadataIsland.tsx`, `FocusIsland.tsx`, `BuilderIslandShell.tsx`, `HeaderBrandIsland.tsx`, `HeaderUserIsland.tsx`

For each file:
1. Remove `const themeMode = useAppStore(...)` and `const isDark = themeMode === 'dark'`
2. Add `const { isDark } = useTheme()` (keep `isDark` as a local — it's still used for className conditionals until those are also CSS-variable-ified)
3. Where a conditional string maps directly to one of the CSS variables above, replace with the CSS variable class

**Acceptance:**
```
□ grep -rn "useAppStore.*themeMode" src/builder → 0 results
□ useTheme() is the single import for isDark in all builder files
□ npm run typecheck passes
□ Visual output identical in both light and dark mode
```

---

### Sprint R2 — Shared UI Primitives

**Status:** Done — completed June 20, 2026. See `docs/progress-log.md` Sprint R2.

**Note:** The shared primitives are extracted and wired. `MetadataIsland.tsx` remains above 200 lines because the remaining reduction requires the R3 decomposition tasks (`ViewTabSwitcher`, `LifecycleActions`, `CampaignDetailsGroup`).

**Goal:** Extract the 4 most-repeated visual atoms into `src/ui/` components. Every caller updates to use the shared component.

#### Task R2.1 — `StatusBadge.tsx`
**Status:** Done.

The status pill is built inline in `MetadataIsland` with `STATUS_COLORS`. It will also be needed in the Version Room page.

**Create** `src/ui/StatusBadge.tsx`:
```typescript
// Props: status: VersionStatus, size?: 'sm' | 'xs'
// Renders the colored pill with correct text and border
// STATUS_COLORS map lives here — not in MetadataIsland
// ~35 lines
```

**Update** `MetadataIsland.tsx`: replace the inline `<span className={... STATUS_COLORS[status] ...}>` with `<StatusBadge status={status} size="xs" />`.

#### Task R2.2 — `LockBadge.tsx`
**Status:** Done.

The locked/editable indicator (Lock icon + "Locked"/"Editable" label) appears in `MetadataIsland`. Will be needed on Version Room.

**Create** `src/ui/LockBadge.tsx`:
```typescript
// Props: isLocked: boolean
// ~25 lines
```

**Update** `MetadataIsland.tsx`.

#### Task R2.3 — `DividerLine.tsx`
**Status:** Done.

The `<div className={`h-5 w-[1px] ${isDark ? 'bg-white/10' : 'bg-black/10'}`} />` appears 8 times in `MetadataIsland`.

**Create** `src/ui/DividerLine.tsx`:
```typescript
// No props needed — reads theme from useTheme()
// Renders the vertical separator line
// ~12 lines
```

**Update** `MetadataIsland.tsx`: replace all 8 occurrences.

**Acceptance:**
```
□ STATUS_COLORS defined only in src/ui/StatusBadge.tsx
□ No inline locked/unlocked JSX in MetadataIsland
□ No inline divider div in MetadataIsland
□ MetadataIsland.tsx line count: ≤ 200 lines
□ npm run typecheck passes
□ Visual output identical
```

---

### Sprint R3 — MetadataIsland Decomposition

**Status:** Partially started during R2 compliance. `ViewTabSwitcher.tsx` and `CampaignDetailsGroup.tsx` are extracted; `LifecycleActions.tsx` exists but still needs line-target tightening; `MetadataIsland.tsx` is down to 198 lines and still needs the final R3 target of ≤150.

**Goal:** Break `MetadataIsland.tsx` (327 lines, 4 concerns) into an orchestrator + 3 focused sub-components. Each sub-component is independently testable and reusable.

#### Task R3.1 — Extract `ViewTabSwitcher.tsx`
**Status:** Done.

The view tabs section (the `VIEW_TABS.map(...)` block + the surrounding `<nav>`) is ~30 lines. It has its own props: `currentView` and `onViewChange`.

**Create** `builder/islands/MetadataIsland/ViewTabSwitcher.tsx`:
```typescript
// Props: currentView: ViewKind, onViewChange: (v: ViewKind) => void
// Renders the Kanban/Timeline pill tabs
// ~50 lines
```

#### Task R3.2 — Extract `LifecycleActions.tsx`
**Status:** In progress — extracted and functional; line-count target remains open.

The lifecycle transition buttons (Start / Post / Approve / Duplicate + the error display) are ~80 lines. They have their own async handlers.

**Create** `builder/islands/MetadataIsland/LifecycleActions.tsx`:
```typescript
// Props: versionId, status, isLocked, communicatedDate, isDuplicating
// Callbacks: onTransition, onDuplicate
// Renders: Start | Post | Approve button based on status, Duplicate if locked, error pill
// ~80 lines
```

The async handlers (`handleTransition`, `handleDuplicate`) stay in `MetadataIsland.tsx` — they use queryClient. Only the JSX and button logic moves.

#### Task R3.3 — Extract `CampaignDetailsGroup.tsx`
**Status:** Done.

The project name + version label section:
```typescript
// Props: projectLabel, versionName (derived from versionData in MetadataIsland)
// ~30 lines
```

#### Task R3.4 — Update `MetadataIsland.tsx` to use all three
**Status:** In progress — now uses all three; final orchestrator line-count target remains open.

The orchestrator now:
- Fetches `versionQuery` and `siblingsQuery`
- Derives `status`, `teamCount`, `filesCount`, `versionName`
- Handles async actions (`handleTransition`, `handleDuplicate`, `handleDateChange`)
- Renders: `HeaderBrandIsland | CampaignDetailsGroup + StatusBadge + LockBadge + dividers + date + team/files + ViewTabSwitcher + LifecycleActions | HeaderUserIsland`

**Target: ≤ 150 lines**

**Acceptance:**
```
□ MetadataIsland.tsx ≤ 150 lines
□ ViewTabSwitcher.tsx ≤ 50 lines
□ LifecycleActions.tsx ≤ 80 lines
□ CampaignDetailsGroup.tsx ≤ 30 lines
□ View switching still works
□ Status transitions still work
□ Duplicate version still works
□ npm run typecheck passes
```

---

### Sprint R4 — CardShell Drop Logic Extraction

**Status:** Done — completed June 20, 2026. See `docs/progress-log.md` Sprint R4.

**Goal:** The 120-line drop handler switch inside `CardShell.tsx` (a presentation component) becomes a pure function in `handleCardDrop.ts`.

#### Task R4.1 — Create `builder/cards/handleCardDrop.ts`
**Status:** Done.

Move the entire `handleDrop` function body (the JSON parse + switch on sourceKind × kind) into:

```typescript
// Pure function — no React, no hooks
export function handleCardDrop(opts: {
  event: React.DragEvent<HTMLDivElement>;
  nodes: BuilderNode[];
  kind: CardKind;
  data: CardData;
  actions: BuilderActionsAPI;
  locked: boolean;
}): void {
  // ... the exact switch logic, unchanged
}
```

**Creates:** `src/builder/cards/handleCardDrop.ts` (~130 lines)

#### Task R4.2 — Update `CardShell.tsx`
**Status:** Done.

Replace the entire `handleDrop` function body with a single call:
```typescript
const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
  e.preventDefault();
  setIsDragOver(false);
  handleCardDrop({ event: e, nodes, kind, data, actions: behavior.actions, locked });
};
```

**Target: `CardShell.tsx` ≤ 130 lines**

**Acceptance:**
```
□ CardShell.tsx ≤ 130 lines
□ handleCardDrop.ts is a pure function (no React imports except the type)
□ All drag/drop behavior works: phase→phase, action→action, task→task, cross-parent moves
□ Creation drag-to-board still works
□ npm run typecheck passes
```

---

### Sprint R5 — TaskEditorSection and FocusIsland Decomposition

**Status:** Done — completed June 20, 2026. See `docs/progress-log.md` Sprint R5.

**Goal:** Break the two remaining large files into focused sub-components.

#### Task R5.1 — Extract `SpecsStateField.tsx`
**Status:** Done.

The specs three-state toggle group + conditional value input is ~50 lines in `TaskEditorSection`:

**Create** `builder/islands/EditorViewerIsland/SpecsStateField.tsx`:
```typescript
// Props: value: FieldCompletionState, onChange: (v: FieldCompletionState) => void
// Renders: label, status badge, three-state toggle buttons, conditional text input
// ~60 lines
```

#### Task R5.2 — Extract `MissingDataField.tsx`
**Status:** Done.

Same pattern as specs, for `missingDataState`:

**Create** `builder/islands/EditorViewerIsland/MissingDataField.tsx`:
```typescript
// Same props pattern as SpecsStateField
// ~60 lines
```

#### Task R5.3 — Extract `TaskDateField.tsx`
**Status:** Done.

The date mode selector + linked offsets + fixed date input is ~70 lines:

**Create** `builder/islands/EditorViewerIsland/TaskDateField.tsx`:
```typescript
// Props: value: TaskDate, onChange: (v: TaskDate) => void
// Renders: mode toggle (unset/linked/fixed), conditional weekOffset/dayOffset inputs or date picker
// ~70 lines
```

#### Task R5.4 — Update `TaskEditorSection.tsx`
**Status:** Done.

Replace the three inline sections with the three extracted components. **Target: ≤ 100 lines.**

#### Task R5.5 — Extract `FocusSearchList.tsx`
**Status:** Done.

The pattern repeated 3 times in `FocusIsland` (filtered list + search result rows + click-to-select):

**Create** `builder/islands/FocusIsland/FocusSearchList.tsx`:
```typescript
// Props: 
//   items: Array<{ id: string; label: string }>,
//   searchQuery: string,
//   selectedIds: string[],
//   onSelect: (id: string) => void
// Renders: filtered list of items with selection highlighting
// ~50 lines
```

#### Task R5.6 — Update `FocusIsland.tsx`
**Status:** Done.

Replace the three list blocks with `<FocusSearchList>`. **Target: ≤ 100 lines.**

#### Task R5.7 — Extract `DayTaskCreator.tsx`
**Status:** Done.

The inline task-creation form inside `DayGridCard` (the `isAdding` state, action selector, name input, submit/cancel):

**Create** `builder/stage/views/DayTaskCreator.tsx`:
```typescript
// Props: actionsList: ActionCardData[], dateString: string, onClose: () => void
// Creates a task in the selected action with the fixed date from dateString
// ~80 lines
```

#### Task R5.8 — Update `DayGridCard.tsx`
**Status:** Done.

Remove the `isAdding` state + form JSX. Add `<DayTaskCreator>` conditional. **Target: ≤ 180 lines.**

**Acceptance for Sprint R5:**
```
□ TaskEditorSection.tsx ≤ 100 lines
□ SpecsStateField.tsx ≤ 60 lines
□ MissingDataField.tsx ≤ 60 lines
□ TaskDateField.tsx ≤ 70 lines
□ FocusIsland.tsx ≤ 100 lines
□ FocusSearchList.tsx ≤ 50 lines
□ DayGridCard.tsx ≤ 180 lines
□ DayTaskCreator.tsx ≤ 80 lines
□ Task editing in editor still fully works
□ Focus island search + select still works
□ Day card task creation inline still works
□ npm run typecheck passes
```

---

### Sprint R6 — PhaseCard and ActionCard Decomposition

**Goal:** Break PhaseCard and ActionCard into sub-components. The readiness badge and density bar are reusable; the nested action/task rendering needs its own file.

#### Task R6.1 — Extract `PhaseDensityBar.tsx`

```typescript
// Props: actionCards: ActionCardData[]
// Renders the density visualization bar
// ~30 lines
```

#### Task R6.2 — Extract `PhaseReadinessBadge.tsx`

```typescript
// Props: readiness: { state: 'ready' | 'incomplete' | 'blocked', reasons: string[] }
// Renders the readiness badge
// ~25 lines
```

#### Task R6.3 — Update `PhaseCard.tsx`

Remove inline readiness computation (it violates the readiness-source rule — it should come from the card behavior or useReadiness hook, not be called directly inside the template). Use `behavior.readiness` from `useCardBehavior` instead of calling `getPhaseReadiness` directly.

**Target: ≤ 100 lines.**

#### Task R6.4 — Extract `ActionTaskList.tsx`

The nested task rendering section inside `ActionCard`:

```typescript
// Props: tasks: TaskCardData[], locked: boolean, actionId: string
// Renders the list of TaskCard components + empty state
// ~60 lines
```

#### Task R6.5 — Update `ActionCard.tsx`

**Target: ≤ 80 lines.**

**Acceptance for Sprint R6:**
```
□ PhaseCard.tsx ≤ 100 lines
□ ActionCard.tsx ≤ 80 lines
□ PhaseDensityBar.tsx ≤ 30 lines
□ PhaseReadinessBadge.tsx ≤ 25 lines
□ ActionTaskList.tsx ≤ 60 lines
□ PhaseCard no longer calls getPhaseReadiness directly
□ npm run typecheck passes
□ Kanban view renders identically
```

---

## Part 4 — Updated Development Plan

### Current state (post-Sprint 17 agent improvements)

| System | Status |
|---|---|
| Types, lifecycle, rules, effects, brand | ✅ Complete |
| Action boundary (phase/action/task/node) | ✅ Complete |
| Router, auth seam, load gate | ✅ Complete |
| Stage system (StageCore, StageProvider, registry, views) | ✅ Complete |
| Card system (CardShell, registry, templates, drag/drop) | ✅ Complete |
| Kanban view + KanbanBuilderIsland | ✅ Complete |
| Timeline/Weekly/Monthly views | ✅ Complete |
| EditorViewerIsland + all editor sections | ✅ Complete |
| MetadataIsland (builder top bar) | ✅ Complete |
| FocusIsland, SelectionIsland | ✅ Complete |
| ViewHelperIsland, TimelineBuilderIsland | ✅ Complete |
| **Code quality / refactor** | ❌ Needed — Sprints R1–R6 above |
| Lifecycle + permissions enforcement | ❌ Needed |
| Validation + readiness gate | ❌ Needed |
| Save continuity (Ctrl+S, close guard, cache, export/import) | ❌ Needed |
| UI preferences + island config | ❌ Needed |
| Logs + error reporting | ❌ Needed |
| Backend integration | ❌ Needs ClickUp/Supabase/AI inputs |

### Revised sprint order

```
R1  Theme hook + CSS variables       (refactor — no features)
R2  Shared UI primitives             (refactor — no features)
R3  MetadataIsland decomposition     (refactor — no features)
R4  CardShell drop logic extraction  (refactor — no features)
R5  Editor/Focus/Day decomposition   (refactor — no features)
R6  PhaseCard/ActionCard split       (refactor — no features)

F9  Lifecycle + permissions enforcement
F10 Validation + readiness gate
F11 Save continuity
F12 Focus engine (full filter/isolation — FocusIsland already has search, needs isolation mode)
F13 UI preferences + island config
F14 Logs, errors, AI/template seeds
F15 Backend integration
```

### Sprint dependencies

```
R1 → R2 → R3         (theme first, then primitives, then MetadataIsland uses them)
R4                    (independent — only touches CardShell)
R5                    (independent — only touches EditorSection, FocusIsland, DayGridCard)
R6                    (depends on R1 for useTheme; otherwise independent)
F9 → F10 → F11       (lifecycle before validation; save continuity needs types to be stable)
F12                   (independent — FocusIsland already built, isolation is an extension)
F13 → F14            (preferences before seeds)
F15                   (last — needs all functional sprints + Supabase/ClickUp inputs)
```

---

## Part 5 — Updated Agent Task Breakdown

### Sprint R1 — Theme Hook

| Task | File | Action | Lines | Acceptance |
|---|---|---|---|---|
| R1.1 | `src/hooks/useTheme.ts` | DONE — CREATE | ~8 | `useTheme()` returns `{ isDark, themeMode }` |
| R1.2 | `src/brand/index.css` | DONE — EDIT — add CSS variables block | +20 | `:root` + `.dark` with `--theme-*` vars |
| R1.3a | `MetadataIsland.tsx` | DONE — EDIT — replace useAppStore+isDark with useTheme() | — | No behavior change |
| R1.3b | `FocusIsland.tsx` | DONE — EDIT | — | Same |
| R1.3c | `BuilderIslandShell.tsx` | DONE — EDIT | — | Same |
| R1.3d | `HeaderBrandIsland.tsx` | DONE — EDIT | — | Same |
| R1.3e | `HeaderUserIsland.tsx` | DONE — EDIT | — | Same |

**Gate:** `grep -rn "useAppStore.*themeMode" src/` returns 0. `tsc` passes. Visual identical.

---

### Sprint R2 — Shared Primitives

| Task | File | Action | Lines | Acceptance |
|---|---|---|---|---|
| R2.1 | `src/ui/StatusBadge.tsx` | DONE — CREATE | ~35 | Renders correct color for all 5 statuses |
| R2.2 | `src/ui/LockBadge.tsx` | DONE — CREATE | ~25 | Locked=red pill, Editable=sky pill |
| R2.3 | `src/ui/DividerLine.tsx` | DONE — CREATE | ~12 | Thin vertical line, uses theme variable |
| R2.4 | `MetadataIsland.tsx` | DONE — EDIT — use all 3 | -19 lines | No visual change; line-count reduction continues in R3 |

**Gate:** No inline STATUS_COLORS in MetadataIsland. `tsc` passes.

---

### Sprint R3 — MetadataIsland Decomposition

| Task | File | Action | Lines | Acceptance |
|---|---|---|---|---|
| R3.1 | `MetadataIsland/ViewTabSwitcher.tsx` | DONE — CREATE | 48 | Tab switch works |
| R3.2 | `MetadataIsland/LifecycleActions.tsx` | IN PROGRESS — CREATE | 104 | Extracted; final ≤80 target remains |
| R3.3 | `MetadataIsland/CampaignDetailsGroup.tsx` | DONE — CREATE | 17 | Name + version shows |
| R3.4 | `MetadataIsland/MetadataIsland.tsx` | IN PROGRESS — REFACTOR | 198 | Uses all sub-components; final ≤150 target remains |

**Gate:** MetadataIsland ≤ 150 lines. All lifecycle transitions work. View tabs work.

---

### Sprint R4 — CardShell Drop Extraction

| Task | File | Action | Lines | Acceptance |
|---|---|---|---|---|
| R4.1 | `builder/cards/handleCardDrop.ts` | DONE — CREATE — move drop switch | 177 | Pure function, no React hooks |
| R4.2 | `builder/cards/CardShell.tsx` | DONE — REFACTOR — call handleCardDrop | 97 | All drag/drop identical |

**Gate:** CardShell ≤ 130 lines. All drag variants work.

---

### Sprint R5 — Editor / Focus / Day Decomposition

| Task | File | Action | Lines | Acceptance |
|---|---|---|---|---|
| R5.1 | `EditorViewerIsland/SpecsStateField.tsx` | DONE — CREATE | 53 | Three-state toggle + input works |
| R5.2 | `EditorViewerIsland/MissingDataField.tsx` | DONE — CREATE | 53 | Same |
| R5.3 | `EditorViewerIsland/TaskDateField.tsx` | DONE — CREATE | 70 | All three date modes work |
| R5.4 | `EditorViewerIsland/TaskEditorSection.tsx` | DONE — REFACTOR | 93 | Task editing fully functional |
| R5.5 | `FocusIsland/FocusSearchList.tsx` | DONE — CREATE | 50 | Filtered list renders, selection works |
| R5.6 | `FocusIsland/FocusIsland.tsx` | DONE — REFACTOR | 98 | Focus search/select fully functional |
| R5.7 | `builder/stage/views/DayTaskCreator.tsx` | DONE — CREATE | 70 | Inline create task from day works |
| R5.8 | `builder/stage/views/DayGridCard.tsx` | DONE — REFACTOR | 153 | Day card renders, creation works |

Additional helper files created to meet R5 line targets:
- `FocusIsland/FocusLocatorPanel.tsx` (64)
- `FocusIsland/FocusModeButton.tsx` (34)
- `FocusIsland/focusItems.ts` (30)
- `builder/stage/views/useDayGridDrag.ts` (63)

**Gate:** All 8 files within caps. All listed features work. `tsc` passes.

---

### Sprint R6 — Phase and Action Card Split

| Task | File | Action | Lines | Acceptance |
|---|---|---|---|---|
| R6.1 | `cards/templates/phase/PhaseDensityBar.tsx` | CREATE | ~30 | Density bar renders |
| R6.2 | `cards/templates/phase/PhaseReadinessBadge.tsx` | CREATE | ~25 | Correct badge per state |
| R6.3 | `cards/templates/phase/PhaseCard.tsx` | REFACTOR | ≤100 | Uses behavior.readiness, not direct call |
| R6.4 | `cards/templates/action/ActionTaskList.tsx` | CREATE | ~60 | Task list renders in action |
| R6.5 | `cards/templates/action/ActionCard.tsx` | REFACTOR | ≤80 | Action card fully functional |

**Gate:** PhaseCard calls no rule directly. ActionCard ≤ 80 lines. Kanban identical.

---

## Part 6 — Rules to Add to AGENTS.md

Add the following to `AGENTS.md` §12 (Before Every Task) and §4 (File Size Rules):

```
NO direct rule calls from card templates.
Card templates must not import from src/rules/. They receive readiness
via behavior.readiness (from useCardBehavior) or as a prop.
If a card template calls getPhaseReadiness(), getTaskReadiness(),
or any rule function directly, it is violating the readiness-source boundary.

NO inline isDark logic.
Use useTheme() from src/hooks/useTheme.ts. Never read useAppStore themeMode directly.
Never write className={isDark ? '...' : '...'} for values that are
defined in the CSS variable set (--theme-muted, --theme-divider, etc.).

NO shared-primitive duplication.
Before writing a status badge, a divider line, a lock indicator, or a
tab switcher, check src/ui/ first. If it exists there, import it.
If it does not exist there and you are writing it for the second time,
extract it to src/ui/ instead.
```

---

*Refactor Plan — DCX Manager v0.2.2 — post visual rebuild*
