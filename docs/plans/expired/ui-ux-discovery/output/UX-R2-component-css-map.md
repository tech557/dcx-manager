# UX-R2: Component → CSS Class Map

Generated: 2026-06-25 | Method: grep + ts-morph (generate-code-index.ts)

---

## CSS Class Usage Map

### Used CSS Classes (1+ files)

| CSS Class | Usage count (files) | Files |
|---|---|---|
| .expanded | 23 | BuilderIslandShell, CardShell, FieldIndicator, StageProvider, multiple stage views, cards |
| .dark | 22 | theme context, multiple stage views, islands, cards |
| .glass | 14 | GlassSurface, CardShell, island headers, card registry |
| .eyebrow | 6 | NoAccessScreen, LoginRedirect, RouteGuard, DayCard, HomePage, VersionPage |
| .placeholder-screen | 5 | NoAccessScreen, LoginRedirect, RouteGuard, HomePage, VersionPage |
| .island-shell | 3 | KanbanBuilderIsland, SelectionIsland, TimelineBuilderIsland |
| .glass-light | 3 | HeaderUserIsland, MetadataIsland, HeaderBrandIsland |
| .glass-dark | 3 | HeaderUserIsland, MetadataIsland, HeaderBrandIsland |
| .builder-canvas | 2 | BuilderPage, BuilderLoadingShell |
| .stage-phase-column | 1 | SmokeStage |
| .stage-phase-row | 1 | SmokeStage |
| .stage-smoke-meta | 1 | SmokeStage |
| .stage-action-stack | 1 | SmokeStage |
| .stage-canvas | 1 | StageCore |
| .readiness-badge | 1 | PhaseReadinessBadge |
| .phase-card-header | 1 | PhaseCard |
| .metadata-view-tabs | 1 | ViewTabSwitcher |
| .metadata-island | 1 | MetadataIsland |
| .kanban-task-drop | 1 | KanbanHiddenDropzones |
| .kanban-stage-drop | 1 | KanbanHiddenDropzones |
| .kanban-phase-column | 1 | KanbanView |
| .kanban-column-drop | 1 | KanbanHiddenDropzones |
| .kanban-builder-island | 1 | KanbanBuilderIsland |
| .kanban-board | 1 | KanbanView |
| .island-toggle | 1 | FocusIsland |
| .header-container-floating | 1 | MetadataIsland |
| .header-island-pill | 1 | MetadataIsland |
| .glass-glow | 1 | HeaderBrandIsland |
| .field-indicator-popup | 1 | FieldIndicator |
| .field-indicator | 1 | FieldIndicator |
| .field-indicator-wrap | 1 | FieldIndicator |
| .field-popup-edit | 1 | FieldIndicator |
| .field-popup-title | 1 | FieldIndicator |
| .editor-island | 1 | EditorViewerIsland |
| .editor-input | 1 | CreateCompositionForm |
| .editor-field-label | 1 | PhaseEditorSection |
| .editor-toggle-btn | 1 | PhaseEditorSection |
| .editor-toggle-btn-active | 1 | PhaseEditorSection |
| .drop-target | 1 | DropTarget |
| .channel-pill | 1 | ChannelPill |
| .card-template-header | 1 | DayCard |
| .card-template-meta | 1 | DayCard |
| .builder-stage-main | 1 | BuilderPage |
| .builder-stage-area | 1 | BuilderPage |
| .builder-editor-panel | 1 | BuilderPage |
| .app-shell | 1 | RootLayout |
| .app-nav | 1 | RootLayout |
| .action-card-header | 1 | ActionCard |

### Dead CSS Classes (0 usages in TSX/TS — defined only in index.css)

| Class | Notes |
|---|---|
| .card-shell | CardShell component uses Tailwind, not this class |
| .card-shell-blocked | — |
| .card-shell-incomplete | — |
| .card-shell-locked | — |
| .card-shell-ready | — |
| .card-shell-selected | — |
| .card-template-description | — |
| .stage-shell | — |
| .stage-tab | — |
| .stage-tab-active | — |
| .stage-tabs | — |
| .stage-toolbar | — |
| .stage-view | — |
| .stage-phase-card | — |
| .kanban-builder-tools | — |
| .kanban-task-list | — |
| .kanban-action-group | — |
| .kanban-action-list | — |
| .editor-empty | — |
| .editor-island-body | — |
| .editor-island-footer | — |
| .editor-island-header | — |
| .editor-toggle-group | — |
| .builder-tool-button | — |
| .builder-workspace | — |
| .builder-heading | — |
| .focus-island-floating | — |
| .glass-active | — |
| .phase-card-badge | — |
| .phase-card-badges | — |
| .phase-card-icon | — |
| .phase-card-label | — |
| .phase-density | — |
| .readiness-badge-ready | — |
| .readiness-badge-incomplete | — |
| .readiness-badge-blocked | — |
| .metadata-version-name | — |
| .metadata-version-status | — |
| .action-card-desc | — |
| .action-card-name | — |
| .action-empty-state | — |
| .action-task-list | — |
| .ai-entry | — |
| .status-pill-subtle | — |
| .task-card-message | — |
| .task-card-name | — |
| .task-field-row | — |
| .woff | font-face definition, not a class |

**Total dead classes: 48 of 96 (50%)**

---

## Component Styling Approach Map

| Approach | File count | Details |
|---|---|---|
| global-css (uses `className`) | 108 files | Classes from `index.css` or Tailwind utilities |
| tailwind | 93 files | Uses Tailwind utility patterns (flex, grid, text-) |
| inline-style | 11 files | Uses `style={{...}}` |
| css-module | 0 files | No `.module.css` imports found |

### Inline Style Files (11)
- src/builder/cards/templates/action/ActionCard.tsx
- src/builder/cards/templates/action/ActionTaskList.tsx
- src/builder/cards/templates/phase/PhaseCard.tsx
- src/builder/cards/templates/phase/TaskBentoGrid.tsx
- src/builder/cards/templates/task/TaskCard.tsx
- src/builder/cards/templates/day/DayCard.tsx
- src/builder/cards/templates/phase/HorizontalTaskFlow.tsx
- src/builder/cards/templates/task/TaskReadOnlyPopup.tsx
- src/builder/islands/ViewHelperIsland/ViewContextTaskItem.tsx
- src/builder/islands/ViewHelperIsland/ViewContextTaskList.tsx
- src/builder/islands/ViewHelperIsland/ViewHelperIsland.tsx

---

## `generate-code-index.ts` Output Summary

The script ran successfully and produced 4 files in `code-index/`:

| File | Size | Content |
|---|---|---|
| `components.json` | 98 KB | 98 component definitions with props, child components, and exports |
| `component-usages.json` | 526 KB | Every JSX element usage with file:line, props passed, and origin (native/project/external) |
| `text-labels.json` | 282 KB | Every JSX text label extracted by file:line with context |
| `unresolved.json` | 5 KB | Components that could not be resolved — 20 entries (mostly `Icon`, `Renderer`, and barrel-imported components) |

### Key insights from code index:
- **Component tree**: RootLayout → BuilderPage → BuilderWorkspaceContent orchestrates MetadataIsland, EditorViewerIsland, StageCore, FocusIsland, SelectionIsland, KanbanBuilderIsland, TimelineBuilderIsland, ViewHelperIsland
- **Unresolved**: `Icon` (used in 4 files) and `Renderer` (used in StageCore) couldn't be resolved — likely dynamic imports or external library
- **All 7 island types** are children of BuilderWorkspaceContent — confirms the layout contract
- Barrels (`index.ts`) cause the 20 unresolved entries — P2 may need to resolve these or improve the script

---

## Duplicate Visual Pattern Groups

### 1. Pill-shaped interactive elements

**Components**: `.stage-tab` (dead CSS), `.island-toggle` (FocusIsland), `.builder-tool-button` (dead CSS), `.field-indicator`, `.channel-pill`, Kanban "Create" button, inline pill buttons in forms/selects

**Shared DNA**:
```
border-radius: rounded-full or 999px
border: 1px border-subtle
backdrop-blur
font-size: ~9-10px
font-weight: semibold/bold
uppercase tracking-wider
```

**Divergence**: Sizes differ (px-2 to px-4), hover states differ, some use accent colour, some use neutral

**Unification candidate**: `<Chip>` atom with `size` (sm/md) + `variant` (accent/neutral/ghost) + `active` props

---

### 2. Glass card surface

**Components**: `CardShell`, `.card-shell` (dead CSS), `.stage-phase-card` (dead CSS), `GlassSurface`, `BuilderIslandShell`, `StickyPopupShell`, `PopoverShell`, island headers

**Shared DNA**:
```
backdrop-blur-xl or backdrop-blur-md
border: 1px solid var(--theme-border-subtle)
border-radius: rounded-2xl or rounded-[2.2rem] or rounded-[2rem]
background: rgba(...) with theme-aware opacity
```

**Divergence**: Radius varies (2rem island vs 2.2rem card vs 1.6rem panel), glass opacity varies by theme, some have `shadow-[0_12px_40px...]`

**Unification candidate**: `<GlassSurface>` already exists at `src/ui/surfaces/GlassSurface.tsx` — 14 files use the `.glass` class. Extend GlassSurface with `radius` and `intensity` variants to replace manual glass classes in islands.

---

### 3. Status / Badge display

**Components**: `StatusBadge`, `LockBadge`, `PhaseReadinessBadge`, `.readiness-badge-*` (dead CSS), `.metadata-version-status` (dead CSS), `StatusDropdownBadge`, `CompletionStateSelect` pill

**Shared DNA**:
```
rounded-full
uppercase tracking-wider font-mono
font-weight: bold/black
font-size: ~8-9px
coloured background + text pair
```

**Divergence**: StatusBadge has 3 sizes (xs/sm/base), PhaseReadinessBadge uses inline glow shadows, LockBadge uses icon + text, CompletionStateSelect uses coloured bg

**Unification candidate**: `<Badge>` atom with `variant` (status/readiness/lock) + `size` (xs/sm) + `color` (accent/warning/error/success/neutral) props

---

### 4. Input elements

**Components**: `TextInputSmall`, `TextInputLarge`, `TextInputInline`, `DualInput`, `ListInputLines`, `SpecsInput`, `DateInputTBD`, `.editor-input` (dead CSS), `SearchableSelect` search input, `ChannelCompositionFields`

**Shared DNA**:
```
background: transparent or bg-opacity
border: 1px border-subtle
border-radius: rounded-lg or rounded-xl
focus: accent border/ring
font-size: ~10-11px
```

**Divergence**: TextInputLarge is full-width, TextInputSmall is compact, DualInput splits into two, ListInputLines has add/remove controls, SpecsInput has +/− buttons

**Unification candidate**: `<Input>` atom with `size` + `variant` props. Special compound inputs (DualInput, ListInputLines) remain as wrappers around the base Input.

---

### 5. Toggle / Tab groups

**Components**: `.editor-toggle-group` (dead CSS), `.editor-toggle-btn`/`-active` (PhaseEditorSection), `.metadata-view-tabs` (ViewTabSwitcher), `.stage-tabs`/`.stage-tab` (dead CSS), `.island-toggle` (FocusIsland), `IslandToggleButton`

**Shared DNA**:
```
horizontal flex row
border: 1px border-subtle
border-radius: rounded-lg or rounded-xl
active state: accent background + accent text
inactive: transparent or subtle bg
```

**Divergence**: Editor toggle uses 2-button setup, metadata tabs use 3-tab setup, stage tabs are dead CSS, FocusIsland toggle is a single button

**Unification candidate**: `<ToggleGroup>` atom with `items` + `value` + `onChange` props

---

## Summary

- **96 CSS classes** defined in `index.css`
- **48 classes (50%) are dead** — defined but never referenced in any TSX/TS file
- **108 TSX files** use global CSS classes
- **93 TSX files** use Tailwind utility patterns
- **11 files** use inline styles (primarily card templates in builder)
- **0 CSS modules** in use
- **5 duplicate visual pattern groups** identified: Pills, Glass surfaces, Badges, Inputs, Toggles
- `generate-code-index.ts` produced 4 output files with component tree, prop flow, and text labels
