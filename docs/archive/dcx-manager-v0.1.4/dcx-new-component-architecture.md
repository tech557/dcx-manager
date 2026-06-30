# DCX Manager — New Component Architecture Plan

**Version:** v0.2.0 (Phase F Completed)  
**Phase:** Phase F — `useIslandPanel` hook (Completed)  
**Type:** Part of Phased Implementation  

---

## Part 1: v0.1.3 Gap Assessment

Before the plan, an honest inventory of what v0.1.3 got right and what is still structurally unsound.

### What is solid and should not be touched

- `BuilderIslandShell` — adopted by all 5 expandable islands. Works.
- `BuilderCardShell` — adopted by Phase, Action, FullTask, SmallTask cards. Works.
- `styles/tokens.ts` — present, consistent, used by both shells.
- `useTheme()` + `appStore` — clean. `isDark` is no longer prop-drilled through the shells.
- `@xyflow/react` — fully removed.
- `types.ts` re-exports from `domain.ts`. `Task`, `Action`, `Phase` are the real types. `TaskCardData`, `ActionCardData`, `PhaseData` are aliases — backward-compatible.
- `AGENTS.md` at project root — substantive and accurate.
- `services/`, `queries/`, `store/`, `utils/` — clean layer separation. Do not touch.
- `mock/` — do not touch until API is ready.

### Remaining gaps to carry forward (do not let these grow)

**1. `isDark` prop still passed in 16 places across builder islands/cards**  
`FocusIsland`, `ViewHelperIsland`, `SelectionIsland`, `CreatorIsland`, `MetadataIsland`, and their children still receive `isDark: boolean` as a prop and use it for inline `isDark ? "..." : "..."` strings — even though `useTheme()` is available. The shells themselves do not need it anymore. The island content panels still do. This is acceptable as a transition state but should not spread further.

**2. `DayGridCard` does not use `BuilderCardShell`**  
It is the only builder card that missed the shell migration. It has its own glass container inline.

**3. `BuilderPage.tsx` owns view switching inline**  
View mode, timeline sub-mode, weeks count, active week — all stored as `useState` in `BuilderPageContentInner`. There is no abstraction between "what view is active" and "what content is rendered in the stage." Adding a third view (Intelligence, Analytics) requires touching `BuilderPage.tsx` directly.

**4. `fields row/` folder has a space in the name**  
`src/pages/builder/components/elements/cards/task/fields row/` — a folder name with a space. This is a filesystem and import risk. Should be `fields-row/`.

**5. `BuilderContext.tsx` at 428 lines is the largest non-UI file**  
It combines selection, clipboard, paste logic, delete logic, and all the phase/action mutation callback handlers. It is doing too much. Under backend integration, these handlers will need to become API calls — and they're all packed into one context file.

**6. The builder folder nesting is 14 levels deep**  
`src/pages/builder/components/elements/islands/EditorIsland/task-editor/components/DatePickerPopup.tsx` — this path is not navigable. The `elements/` folder adds a level with no semantic value.

**7. `nodes[]` is still the builder's source of truth**  
`useBuilderNodes` converts `EnrichedVersion.phases` into a `nodes[]` array that lives in `useState`. This nodes format is a React rendering artifact, not a data model. All builder mutations go through this array. When the backend is added, every mutation will need to be re-wired to an API call. The current structure makes that harder than it needs to be.

---

## Part 2: Component Categorization Model

The fundamental problem: the codebase has grown into a single large pages/ tree with no clear separation between things that are **stable** (backend-facing) and things that are **experimental** (visual templates). This plan creates that separation explicitly.

### Three stability tiers

**Tier 1 — Backend-stable. Never changes for visual reasons.**
- Domain types (`types/domain.ts`)
- Services (`services/`)
- Query hooks (`queries/`)
- State stores (`store/`)
- Utility functions (`utils/`)
- Data factories (`utils/task.factory.ts`)

These are off-limits during any visual experiment. A designer changing card radius must never need to open a service file.

**Tier 2 — Structural. Changes only when architecture changes, not for visual experiments.**
- Shell components (`BuilderCardShell`, `BuilderIslandShell`, `GlassCard`, `PopoverShell`)
- Design tokens (`styles/tokens.ts`)
- `useTheme()` hook
- Builder context and hooks (`BuilderContext`, `useBuilderNodes`)
- Stage manager (to be created)

These define the rules. They should be changed deliberately and reviewed carefully.

**Tier 3 — Visual templates. Freely changeable without risk.**
- Card templates (Phase, Action, Task, Day, Subtask)
- Island panels (the content inside islands)
- Page layout components
- Widget components (VersionCard, StatsOverview, MiniBuilderCanvas)

A designer experimenting with phase card layout, subtask row style, or version card visual should only ever touch Tier 3 files. Tier 1 and 2 must remain stable.

---

## Part 3: Ideal Folder and Module Structure

### Principle

Flatten the builder tree. Remove the semantic-free `components/elements/` segment. Put cards, islands, views, and toolbars at one consistent depth. Make every folder self-describing by its name alone.

### Proposed structure

```
src/
│
├── styles/
│   └── tokens.ts                    # TIER 2 — all design constants
│
├── hooks/
│   └── useTheme.ts                  # TIER 2 — theme hook
│
├── types/
│   ├── domain.ts                    # TIER 1 — Task, Action, Phase, TaskDate
│   └── api.ts                       # TIER 1 — API contract shapes
│
├── services/                        # TIER 1 — API boundary (one file per resource)
├── queries/                         # TIER 1 — TanStack Query hooks
├── store/                           # TIER 2 — Zustand (appStore, builderStore)
├── utils/                           # TIER 1 — id.helpers, date.helpers, task.factory, node.helpers
├── mock/                            # TIER 1 — seed data (untouched until API ready)
│
├── components/                      # TIER 2/3 — shared app components
│   ├── ui/                          # TIER 2 — shells and primitives
│   │   ├── GlassCard.tsx
│   │   ├── PopoverShell.tsx
│   │   ├── IslandCard.tsx
│   │   ├── SectionTitle.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── AvatarStack.tsx
│   │   ├── FileTag.tsx
│   │   └── index.ts
│   ├── forms/                       # TIER 3 — form components
│   ├── topbar/                      # TIER 3 — BrandIsland, UserIsland, ThemeToggle
│   ├── popup/                       # TIER 3 — Popup modal wrapper
│   ├── Background.tsx               # TIER 3 — animated background
│   ├── BrandedButton.tsx
│   └── ChannelIcon.tsx
│
├── pages/
│   ├── home/                        # TIER 3 — Home page + widgets
│   │   ├── Home.tsx
│   │   ├── VersionCard.tsx          ← TIER 3 card template (freely changeable)
│   │   ├── Hero.tsx
│   │   ├── SearchFilters.tsx
│   │   ├── StatsOverview.tsx
│   │   ├── VersionsList.tsx
│   │   └── RecentlyOpened.tsx
│   │
│   ├── version/                     # TIER 3 — Version Room + widgets
│   │   ├── VersionPage.tsx
│   │   └── components/
│   │       ├── VersionSummary.tsx   ← TIER 3 card template
│   │       ├── VersionSwitchBar.tsx
│   │       ├── VersionStatusBar.tsx
│   │       ├── DriveArtifacts.tsx
│   │       ├── CollaboratorsAvatars.tsx
│   │       ├── ProjectNavigation.tsx
│   │       └── SandboxBriefing.tsx
│   │
│   └── builder/                     # TIER 2/3 — Builder workspace
│       ├── BuilderPage.tsx          # TIER 2 — layout shell only
│       │
│       ├── stage/                   # TIER 2 — stage/view management (NEW)
│       │   ├── StageManager.tsx     # TIER 2 — orchestrates active view + island zones
│       │   ├── KanbanStage.tsx      # TIER 3 — kanban view entry point
│       │   └── TimelineStage.tsx    # TIER 3 — timeline view entry point
│       │
│       ├── cards/                   # TIER 2/3 — all builder card templates
│       │   ├── BuilderCardShell.tsx # TIER 2 — shared card shell (selection, drag, highlight)
│       │   ├── phase/               # TIER 3 — phase card template
│       │   │   ├── PhaseCard.tsx    # (rename from PhaseNode)
│       │   │   ├── PhaseHeader.tsx
│       │   │   ├── PhaseBody.tsx
│       │   │   ├── PhaseFooter.tsx
│       │   │   ├── PhaseDropZone.tsx
│       │   │   ├── PhaseIcons.ts
│       │   │   ├── CreateDirectiveForm.tsx
│       │   │   ├── PhaseActionList.tsx
│       │   │   ├── usePhaseActions.ts
│       │   │   └── usePhaseEvents.ts
│       │   ├── action/              # TIER 3 — action card template
│       │   │   ├── ActionCard.tsx
│       │   │   ├── ActionHeader.tsx
│       │   │   ├── ActionForm.tsx
│       │   │   ├── ActionTaskList.tsx
│       │   │   ├── TaskDropZone.tsx
│       │   │   ├── NewActionLoader.tsx
│       │   │   └── useActionTasks.ts
│       │   ├── task/                # TIER 3 — task card templates
│       │   │   ├── FullTaskCard.tsx
│       │   │   ├── SmallTaskCard.tsx
│       │   │   ├── TaskCard.tsx     # router: renders Full or Small
│       │   │   ├── NewTaskLoader.tsx
│       │   │   ├── TaskHoverTooltip.tsx
│       │   │   ├── InteractiveTooltip.tsx
│       │   │   └── fields-row/      # (renamed from "fields row")
│       │   │       ├── FieldsRow.tsx
│       │   │       ├── MessageField.tsx
│       │   │       ├── SenderField.tsx
│       │   │       ├── ReceiverField.tsx
│       │   │       ├── SpecsField.tsx
│       │   │       └── MissingField.tsx
│       │   ├── day/                 # TIER 3 — day card template
│       │   │   ├── DayGridCard.tsx  # migrate to BuilderCardShell
│       │   │   ├── CollapsedDayCard.tsx
│       │   │   ├── DayCardHeader.tsx
│       │   │   ├── DayCardTasks.tsx
│       │   │   └── DayCardFooter.tsx
│       │   └── index.ts             # barrel export
│       │
│       ├── islands/                 # TIER 2/3 — all builder islands
│       │   ├── BuilderIslandShell.tsx  # TIER 2 — shared island shell
│       │   ├── metadata/            # TIER 3 — top bar campaign info
│       │   │   ├── MetadataIsland.tsx
│       │   │   ├── ProjectDetails.tsx
│       │   │   ├── Collaborators.tsx
│       │   │   ├── FilesConnection.tsx
│       │   │   └── ViewToggle.tsx
│       │   ├── creator/             # TIER 3 — creation toolbar
│       │   │   ├── CreatorIsland.tsx
│       │   │   ├── AddPhaseButton.tsx
│       │   │   ├── AddActionButton.tsx
│       │   │   └── AddTaskButton.tsx
│       │   ├── editor/              # TIER 3 — task editor panel
│       │   │   ├── EditorIsland.tsx
│       │   │   └── task-editor/
│       │   │       ├── TaskEditor.tsx
│       │   │       ├── sections/
│       │   │       │   ├── IntakeSection.tsx
│       │   │       │   ├── DateSection.tsx
│       │   │       │   ├── SubtaskSection.tsx
│       │   │       │   ├── SpecsSection.tsx
│       │   │       │   └── MissingFieldsSection.tsx
│       │   │       └── components/
│       │   │           ├── IntakeConfiguration.tsx
│       │   │           ├── IntakePaneSelector.tsx
│       │   │           ├── CommunicationDateField.tsx
│       │   │           ├── DatePickerPopup.tsx
│       │   │           ├── DatePickerToggle.tsx
│       │   │           ├── DeliveryMessageField.tsx
│       │   │           ├── SubtaskCard.tsx
│       │   │           ├── SubtaskList.tsx
│       │   │           ├── SubtaskTemplateSelector.tsx
│       │   │           ├── TaskTitleField.tsx
│       │   │           ├── SpecsIdentifierField.tsx
│       │   │           └── MissingSetupItemsField.tsx
│       │   ├── focus/               # TIER 3 — locate/navigate island
│       │   │   ├── FocusIsland.tsx
│       │   │   ├── PhaseLocatePopup.tsx
│       │   │   ├── ActionLocatePopup.tsx
│       │   │   └── TaskLocatePopup.tsx
│       │   ├── selection/           # TIER 3 — bulk selection controls
│       │   │   ├── SelectionIsland.tsx
│       │   │   ├── ExpandButton.tsx
│       │   │   └── CollapseButton.tsx
│       │   ├── view-helper/         # TIER 3 — cross-view helper island
│       │   │   ├── ViewHelperIsland.tsx
│       │   │   ├── PhaseSummaryPanel.tsx
│       │   │   ├── TaskCreationFlow.tsx
│       │   │   ├── TaskMovePanel.tsx
│       │   │   ├── useDeliverableWizard.ts
│       │   │   └── useResizable.ts
│       │   ├── timeline-builder/    # TIER 3 — timeline navigation controls
│       │   │   ├── TimelineBuilderIsland.tsx
│       │   │   ├── AddWeekButton.tsx
│       │   │   ├── TimelineNavigator.tsx
│       │   │   └── ViewModeToggle.tsx
│       │   └── identity/            # TIER 3 — brand + user identity islands
│       │       ├── BrandIsland.tsx
│       │       └── UserIsland.tsx
│       │
│       ├── tooltips/                # TIER 3 — inline card editors (flat, not nested)
│       │   ├── DateTooltipEditor.tsx
│       │   ├── NameTooltipEditor.tsx
│       │   ├── MessageTooltipEditor.tsx
│       │   ├── SenderTooltipEditor.tsx
│       │   ├── ReceiverTooltipEditor.tsx
│       │   ├── SpecsTooltipEditor.tsx
│       │   ├── MissingDataTooltipEditor.tsx
│       │   ├── NavigationArrows.tsx
│       │   ├── useTooltipCoords.ts
│       │   ├── useTooltipDraft.ts
│       │   └── useTooltipResize.ts
│       │
│       ├── kanban/                  # TIER 3 — kanban view components
│       │   ├── HorizontalBoard.tsx
│       │   ├── KanbanColumn.tsx
│       │   ├── KanbanColumnCollapsed.tsx
│       │   ├── KanbanColumnHeader.tsx
│       │   ├── ActionDropZone.tsx
│       │   ├── EmptyStatePlaceholder.tsx
│       │   ├── OffStageSummary.tsx
│       │   ├── useKanbanColumnEvents.ts
│       │   ├── useColumnBoundaryEffects.ts
│       │   └── useHorizontalBoardScroll.ts
│       │
│       ├── timeline/                # TIER 3 — timeline view components
│       │   ├── TimelineView.tsx
│       │   ├── WeeklyView.tsx
│       │   ├── MonthlyView.tsx
│       │   └── TimelineTaskMarker.tsx
│       │
│       ├── context/
│       │   └── BuilderContext.tsx   # TIER 2 — to be split (see Part 6)
│       │
│       ├── hooks/
│       │   ├── useBuilderNodes.ts   # TIER 2 — nodes/state management
│       │   ├── useKeyboardInteractions.ts
│       │   └── useNewObjectHighlight.ts
│       │
│       └── utils/
│           ├── dateHelper.ts
│           └── timelineHelpers.ts
```

### What this structure achieves

- **Depth reduced** from 14 levels to 8 levels maximum
- **`elements/` folder removed** — it was a wrapper with no meaning
- **`reusable/tooltips/` flattened** to `builder/tooltips/`
- **`kanban/column/`** merged up into `kanban/` — the column sub-folder added depth without adding clarity
- **`components/`** removed from builder path — everything under `builder/` is already a builder component
- **Every top-level builder folder** (`cards/`, `islands/`, `kanban/`, `timeline/`, `tooltips/`, `stage/`) names what it contains

---

## Part 4: Layer Responsibility Rules

### What each layer owns — and does not own

**`styles/tokens.ts`**
- Owns: all color strings, blur values, radius values, shadow strings, motion spring configs, the `PRIMARY` color
- Does not own: component logic, className generation (except the two helper functions `islandClass`, `cardSelectedClass`)
- Rule: If you find yourself typing `#75E2FF` anywhere other than this file, stop

**`components/ui/`** (GlassCard, PopoverShell, IslandCard, etc.)
- Owns: the visual shell — structure, blur, border, padding, radius, shadow
- Does not own: content, business logic, data fetching, store reads (except `useTheme`)
- Rule: These are layout primitives. They render `children`. Nothing more.

**`BuilderCardShell`** and **`BuilderIslandShell`**
- Owns: selection behavior, drag behavior, highlight animation, spring expand/collapse, theme-driven surface
- Does not own: the content inside cards or islands, any domain data, any API concern
- Rule: If you want to change what a phase card looks like, you edit `PhaseCard.tsx` — not `BuilderCardShell`

**`cards/phase/`, `cards/action/`, `cards/task/`, `cards/day/`** — Tier 3 card templates
- Owns: layout, structure, field display, expand/collapse state, local interactions
- Does not own: selection state (in shell), drag behavior (in shell), API calls (in hooks/services)
- Rule: These are the files a designer edits. Changing them must not require touching the shell, the store, or the services

**`islands/editor/`, `islands/focus/`, etc.** — Tier 3 island panels
- Owns: the content inside the island shell
- Does not own: the island animation or shell structure (that is in `BuilderIslandShell`)
- Rule: An island panel component defines *what* is in the island. `BuilderIslandShell` defines *how* it opens and closes

**`stage/`** — new layer (see Part 7)
- Owns: which view is active, island zone layout, stage layout decisions
- Does not own: the views themselves (those are in `kanban/` and `timeline/`)
- Rule: Adding a new view (Intelligence, Analytics) means adding a new file in `stage/` and a new view folder — not editing `BuilderPage.tsx`

**`context/BuilderContext.tsx`**
- Currently owns too much — see Part 6 for the split plan
- Should own only: selection, clipboard, drag state, and the onStartEditTask bridge
- Should not own: phase/action mutation handlers (those belong in the store or hooks)

**`services/`**, **`queries/`**, **`utils/`**, **`store/`**
- Fully off-limits during visual experiments
- Rule: A Tier 3 file never imports from `services/` directly. It reads from the store or uses a hook

---

## Part 5: Card System — How Cards Should Be Structured

### The principle

All builder cards share a chassis (`BuilderCardShell`) and diverge only in their content template. The content template is the part that evolves. The chassis is the part that stays stable.

### Card hierarchy and variation axes

```
BuilderCardShell (chassis)
  ├── variant: "phase" | "action" | "task-full" | "task-small" | "day"
  ├── isSelected, isDraggable, dragType, dragData (behavior)
  └── children (the template)

PhaseCard (template)           → uses variant="phase"
  ├── PhaseHeader (editable label, icon, date range)
  ├── PhaseBody (action list, drop zones)
  └── PhaseFooter (count badge, add button)

ActionCard (template)          → uses variant="action"
  ├── ActionHeader (name, date, menu)
  ├── ActionTaskList (task rows)
  └── TaskDropZone

FullTaskCard (template)        → uses variant="task-full"
  ├── channel icon + name
  ├── FieldsRow (sender, receiver, date, specs)
  └── hover tooltips

SmallTaskCard (template)       → uses variant="task-small"
  └── compact row layout

DayGridCard (template)         → uses variant="day"
  ├── DayCardHeader
  ├── DayCardTasks
  └── DayCardFooter

SubtaskCard (mini-row)         → NOT a BuilderCardShell card
  └── checkbox row in the editor panel — different context entirely
```

### Why `SubtaskCard` does not use `BuilderCardShell`

`SubtaskCard` lives inside the `EditorIsland` task editor. It does not need drag behavior, stage selection, or highlight animation. Forcing it into `BuilderCardShell` would add complexity without benefit. It is a form row, not a stage card. Keep it as a simple controlled component inside the editor.

### How to safely experiment with card layouts

To change the visual layout of a phase card:
1. Edit `PhaseHeader.tsx`, `PhaseBody.tsx`, or `PhaseFooter.tsx`
2. Done. No other file needs to change.

To add a new field to the task card:
1. Add the field to `FieldsRow.tsx` or directly to `FullTaskCard.tsx`
2. Done.

To try a completely different phase card visual (e.g., horizontal layout instead of vertical):
1. Create `PhaseCardHorizontal.tsx` as an alternative template
2. Swap it in `KanbanColumn.tsx` — one line change
3. No shell changes, no store changes, no type changes

This is what "Tier 3 is freely changeable" means in practice.

### `VersionCard` — not a builder card, but same principle

`VersionCard.tsx` in the Home page is a Tier 3 template. It uses `GlassCard` as its chassis. To experiment with a different visual shape:
1. Edit `VersionCard.tsx`
2. Done. `GlassCard` provides the consistent shell.

---

## Part 6: Island System — How Islands Should Be Structured

### The principle

All builder islands share a chassis (`BuilderIslandShell`) and diverge only in their panel content. The shell handles expansion, animation, and theming. The panel handles purpose.

### Island classification

Islands have three behavioral modes:

**Mode A — Pill-expands-inline**  
The island expands but does not interact with stage content. Content wraps or scrolls inside the island.
- `CreatorIsland` (bottom center, expands horizontally)
- `TimelineBuilderIsland` (bottom center, replaces Creator in timeline mode)
- `SelectionIsland` (bottom left, expands to show actions)

**Mode B — Overlay**  
The island expands as a floating overlay above stage content. Content below is still visible but potentially obscured.
- `FocusIsland` (right side, expands downward with locate popovers)
- `ViewHelperIsland` (bottom right, expands into a panel above the bottom bar)

**Mode C — Stage-aware sticky**  
The island must not overlap specific content. The `EditorIsland` must never overlap the task being edited. It currently handles this by sizing itself relative to `window.innerHeight`.
- `EditorIsland` — must stay clear of the stage content area

**Mode D — Always-expanded bar**  
Not an expandable island. Always visible. No collapse.
- `MetadataIsland` (top center, always a fixed-height bar)
- `BrandIsland`, `UserIsland` (top corners, always visible)

### Shared island actions

The following behaviors are used across multiple islands but currently reimplemented per-island:

| Action | Used by | Current state |
|--------|---------|---------------|
| Close/dismiss | EditorIsland, ViewHelperIsland | Per-island custom |
| Expand to full | EditorIsland | Custom |
| Panel navigation | FocusIsland (phase/action/task tabs) | Custom |
| Resize handle | ViewHelperIsland | `useResizable.ts` — good |
| Scroll-to-item | FocusIsland locate popups | Custom per popup |

**Recommendation:** Extract an `useIslandPanel` hook that handles: `activePanel: string | null`, `setPanel(name)`, `closePanel()`. All islands that switch between sub-panels (Focus has phase/action/task; ViewHelper has creation flow/move panel/summary) would use this instead of their own `useState` panel state.

### How to safely experiment with island content

To change what appears in the FocusIsland:
1. Edit the panel content files in `islands/focus/`
2. The shell animation and pill behavior stay unchanged

To add a new island (e.g., an Intelligence Island for future views):
1. Create `islands/intelligence/IntelligenceIsland.tsx`
2. Wrap content in `<BuilderIslandShell>` with appropriate props
3. Mount it in `StageManager.tsx` for the view that needs it
4. No existing files change

---

## Part 7: Stage Manager — How View Switching Should Work

### The original problem

`BuilderPage.tsx` currently contains:

```typescript
const [viewMode, setViewMode] = useState<"kanban" | "timeline">("kanban");
const [timelineViewMode, setTimelineViewMode] = useState<"weekly" | "monthly">("weekly");
const [timelineWeeksCount, setTimelineWeeksCount] = useState<number>(4);
const [timelineActiveWeek, setTimelineActiveWeek] = useState<number>(1);
```

Plus conditional rendering of `CreatorIsland` vs `TimelineBuilderIsland` based on `viewMode`. Plus conditional rendering of `BuilderKanbanView` vs `BuilderTimelineView` in `<main>`. This meant adding a third view required editing `BuilderPage.tsx` in multiple places.

**Phase B update:** This problem has been resolved. `BuilderPage.tsx` no longer owns this state or view switching. `StageManager.tsx` now owns active view state, timeline sub-state, bottom island selection, and active stage rendering.

### The solution: StageManager

**`builder/stage/StageManager.tsx`**

This component owns:
- Active view state (`viewMode`)
- View-specific sub-state (timeline weeks, active week, timeline sub-mode)
- Which island toolbar appears at the bottom center
- Which view component fills the stage
- Island zone layout (whether islands avoid overlapping certain areas)

`BuilderPage.tsx` becomes:

```tsx
// BuilderPage.tsx after StageManager extraction — ~100 lines
return (
  <div className="relative w-screen h-screen overflow-hidden">
    <Background />
    <BuilderHeader currentVersion={currentVersion} onClose={onClose} saveStatus={saveStatus} />
    <StageManager
      nodes={nodes}
      setNodes={setNodes}
      currentVersion={currentVersion}
      onAddPhase={handleAddPhase}
      onDragAddAction={handleDragAddAction}
      onMoveCardDirectly={handleMoveCardDirectly}
    />
  </div>
);
```

**`StageManager.tsx`** internally:

```tsx
// What StageManager controls
const [viewMode, setViewMode] = useState<ViewMode>("kanban");
// view-specific state...

return (
  <>
    {/* Bottom bar: view-dependent island */}
    <BottomBar viewMode={viewMode} ... />

    {/* Fixed islands: always present */}
    <SelectionIsland ... />
    <ViewHelperIsland ... />

    {/* Stage: the active view */}
    <main>
      {viewMode === "kanban" && <KanbanStage ... />}
      {viewMode === "timeline" && <TimelineStage ... />}
      {/* future: viewMode === "intelligence" && <IntelligenceStage ... /> */}
    </main>
  </>
);
```

**`stage/KanbanStage.tsx`** — thin wrapper:
```tsx
// Composes HorizontalBoard + handles kanban-specific props
// ~40 lines
```

**`stage/TimelineStage.tsx`** — thin wrapper:
```tsx
// Composes TimelineView + handles timeline-specific props
// ~40 lines
```

### Island-stage awareness

The `EditorIsland` needs to not cover the selected task in the kanban view. The current approach reads `window.innerHeight` and clamps its height. This should become a **stage layout contract**:

```typescript
// StageManager passes layout zones to islands that need them
interface StageLayoutZones {
  headerHeight: number;
  bottomBarHeight: number;
  editorWidth: number;      // 0 when editor is closed
  stageContentArea: DOMRect;
}
```

Islands that are stage-aware (Mode C) receive `stageLayoutZones` as a prop. They use it to position themselves relative to safe areas. This replaces the current `window.innerHeight` reads in `EditorIsland`.

### Adding a future view

Adding an Intelligence View later:
1. Create `stage/IntelligenceStage.tsx`
2. Add `"intelligence"` to the `ViewMode` type
3. Add a case in `StageManager`'s view render switch
4. Add a button to `ViewToggle.tsx` in `MetadataIsland`

No existing stage files change beyond these additions.

---

## Part 8: Tooltips, Popovers, Modals, Inspectors, and Floating Panels

### The classification

These are currently scattered across `elements/reusable/tooltips/` and various island components. The proposed structure groups them by function:

**Inline card editors** (appear attached to a card on hover/click, dismiss on blur):
- `DateTooltipEditor`, `NameTooltipEditor`, `MessageTooltipEditor`, `SenderTooltipEditor`, `ReceiverTooltipEditor`, `SpecsTooltipEditor`, `MissingDataTooltipEditor`
- Lives in: `builder/tooltips/`
- Uses: `useTooltipCoords`, `useTooltipDraft`, `useTooltipResize`
- Shell: `PopoverShell` for the floating container

**Locate popups** (appear from the FocusIsland, navigate to content):
- `PhaseLocatePopup`, `ActionLocatePopup`, `TaskLocatePopup`
- Lives in: `builder/islands/focus/`
- Uses: `PopoverShell`

**Date picker** (appears from `CommunicationDateField` inside the editor):
- `DatePickerPopup`
- Lives in: `builder/islands/editor/task-editor/components/`
- Uses: `PopoverShell`

**Selection dropdowns** inside editor sections:
- `IntakePaneSelector`, `SubtaskTemplateSelector`
- Lives in: `builder/islands/editor/task-editor/components/`
- Uses: `PopoverShell`

**App-level modal**:
- `Popup.tsx` in `components/popup/`
- Wraps `CreateDCXForm`, `EditVersionForm`

### Finding rule

> If it is attached to a card and appears on hover/click in the builder stage: it is a `builder/tooltip`
> If it appears from inside an island panel: it lives with that island
> If it is a full-screen modal blocking the app: it is in `components/popup/`
> If it is a floating info overlay above any surface: it uses `PopoverShell`

---

## Part 9: What Stays Backend-Stable

These must not change during visual experiments. Lock them.

| File/Layer | What it is | Why it must not change |
|---|---|---|
| `types/domain.ts` | Task, Action, Phase, TaskDate | Backend serializes/deserializes these exact shapes |
| `types/api.ts` | API request/response contracts | Defines the API boundary |
| `services/*.service.ts` | Mock API endpoints | Swapped for real API — any change here breaks integration |
| `queries/*.ts` | TanStack Query hooks | Tied to service contracts and cache keys |
| `store/builderStore.ts` | Builder state (editing, selection, save) | Shared state contract between components |
| `store/appStore.ts` | Theme state | App-wide |
| `utils/task.factory.ts` | `createDefaultTask()` | Creates the shape the backend receives |
| `utils/id.helpers.ts` | `generateId()` | ID format must be consistent with backend expectations |
| `utils/date.helpers.ts` | Date resolution, timezone math | Backend-facing calculations |
| `mock/` | Seed data | Replaced wholesale when API is ready |

### The rule for Tier 1 during this phase

> No Tier 1 file is touched for a visual reason. If a visual change seems to require editing a type, service, or utility — the architecture is wrong. Fix the architecture, not the type.

---

## Part 10: What Stays Frontend-Experimental

These can change freely, including wholesale redesign:

- `cards/phase/` — entire folder. Change layout, add sections, swap header style.
- `cards/action/` — entire folder. Try a different action card shape.
- `cards/task/FullTaskCard.tsx`, `SmallTaskCard.tsx` — try different field layouts.
- `cards/day/` — try a different day card style.
- `pages/home/VersionCard.tsx` — try different version card shapes.
- `pages/version/components/VersionSummary.tsx` — redesign freely.
- `islands/editor/task-editor/sections/` — restructure sections, add tabs, try a different editor layout.
- `islands/focus/` — try a different locate panel layout.
- All files in `kanban/` except the data-binding layer in `HorizontalBoard.tsx`
- All files in `timeline/` except the date calculation helpers
- `components/ui/` visual properties (radius, shadow, blur amounts) — change via `tokens.ts`

### The rule for Tier 3 during this phase

> Changing a Tier 3 file must never require opening a Tier 1 file. If it does, something is wrong with how the Tier 3 component accesses data.

---

## Part 11: Phased Implementation Plan

### Phase A — Structural moves (no logic changes, low risk)

**Goal:** Get the folder structure right without changing any logic.

Steps:
1. Rename `fields row/` to `fields-row/` — fix the space in the folder name
2. Move `BuilderIslandShell.tsx` from `elements/islands/` to `builder/islands/`
3. Move `BuilderCardShell.tsx` from `elements/cards/` to `builder/cards/`
4. Flatten the kanban sub-folder: move `column/` files up into `kanban/`, delete `column/` folder
5. Rename `PhaseNode.tsx` to `PhaseCard.tsx` (and update the export/import)
6. Flatten `islands/BrandIsland/` → `islands/identity/`, merge `islands/UserIsland/` into same
7. Remove the `elements/` and `components/` wrapper folders from the builder path
8. Update all import paths (search/replace)

**Risk:** Low. Import paths change, no logic changes. Verify build passes.

### Phase B — Stage Manager extraction

**Goal:** `BuilderPage.tsx` becomes a layout shell. View state moves into `StageManager`.

**Status:** Completed.

**Completed implementation notes:**
- Created `src/pages/builder/stage/StageManager.tsx`.
- Created thin stage wrappers: `stage/KanbanStage.tsx` and `stage/TimelineStage.tsx`.
- Created `stage/BuilderHeader.tsx` so the page shell renders header composition through the stage layer.
- Moved `viewMode`, `timelineViewMode`, `timelineWeeksCount`, and `timelineActiveWeek` state out of `BuilderPage.tsx`.
- Moved `CreatorIsland` / `TimelineBuilderIsland`, `SelectionIsland`, and `ViewHelperIsland` mounting into `StageManager`.
- Reduced `BuilderPage.tsx` to the app background, builder provider, and `<StageManager />`.
- Verified with `npm run lint` and `npm run build`.

Steps:
1. [x] Create `builder/stage/StageManager.tsx` — move `viewMode`, `timelineViewMode`, `timelineWeeksCount`, `timelineActiveWeek` state into it
2. [x] Create `builder/stage/KanbanStage.tsx` — thin wrapper around `HorizontalBoard` / `BuilderKanbanView`
3. [x] Create `builder/stage/TimelineStage.tsx` — thin wrapper around `TimelineView` / `BuilderTimelineView`
4. [x] Move the `CreatorIsland`/`TimelineBuilderIsland` conditional from `BuilderPage` into `StageManager`
5. [x] Move `SelectionIsland` and `ViewHelperIsland` mounting into `StageManager`
6. [x] `BuilderPage.tsx` renders only: `<Background>`, `<BuilderHeader>`, `<StageManager>`

**Risk:** Medium. Test all view transitions, island mounting, and keyboard shortcuts after this change.

### Phase C — DayGridCard shell migration

**Goal:** `DayGridCard` uses `BuilderCardShell` like all other builder cards.

**Status:** Completed.

**Completed implementation notes:**
- Wrapped the expanded `DayGridCard.tsx` outer container in `<BuilderCardShell variant="day" ...>`.
- Removed the expanded day card's inline glass/backdrop-blur surface classes and now relies on the shared day variant shell.
- Preserved drag-to-day/drop-on-day handlers, week selection, and double-click expand/collapse behavior.
- Added an optional `onClick` pass-through to `BuilderCardShell` so day cards can keep normal week selection while existing Ctrl/Cmd multi-select behavior remains intact.
- Verified with `npm run lint` and `npm run build`.

Steps:
1. [x] Wrap the outer container of `DayGridCard.tsx` in `<BuilderCardShell variant="day" ...>`
2. [x] Remove inline glass/backdrop-blur from `DayGridCard.tsx`
3. [x] Test drag-to-day, drop-on-day, and day card expand/collapse

**Risk:** Low. Single file change.

### Phase D — BuilderContext split

**Goal:** `BuilderContext.tsx` (428 lines) becomes a thin bridge. Mutation handlers move to the store or a dedicated hook.

**Status:** Completed.

**Completed implementation notes:**
- Created `src/pages/builder/hooks/useBuilderMutations.tsx` as the dedicated phase/action mutation layer.
- Moved `onLabelChange`, `onIconChange`, `onDatesChange`, `onDeletePhase`, `onActionCardsChange`, `onMoveCardUp`, `onMoveCardDown`, and `onMoveCardToPhase` out of `BuilderContext`.
- Exposed existing `onAddDragAction` and `onMoveCardDirectly` through `BuilderMutationsProvider` so card-level mutation calls no longer depend on `BuilderContext`.
- Updated phase card logic to use `useBuilderMutations()` for mutation callbacks.
- Kept `BuilderContext` focused on selection, clipboard, delete selection, drag state, and `onStartEditTask`.
- Moved focus-column reads in builder views directly to `builderStore`, reducing unrelated state in `BuilderContext`.
- Verified with `npm run lint` and `npm run build`.

Steps:
1. [x] Create `builder/hooks/useBuilderMutations.tsx` — extract all phase/action/task mutation callbacks (`onLabelChange`, `onIconChange`, `onDatesChange`, `onDeletePhase`, `onActionCardsChange`, `onMoveCardUp`, `onMoveCardDown`, `onMoveCardToPhase`, `onMoveCardDirectly`)
2. [x] `BuilderContext` retains only: `selectedIds`, `clipboard`, `copySelection`, `pasteClipboard`, `deleteSelected`, `draggingType`, `onStartEditTask`
3. [x] Cards that need mutation callbacks read from `useBuilderMutations()` instead of `useBuilder()`

**Risk:** Medium. High test coverage needed — mutation callbacks are the backbone of card interaction.

### Phase E — `isDark` prop cleanup

**Goal:** No island or card content component receives `isDark: boolean` as a prop.

**Status:** Completed.

**Completed implementation notes:**
- Removed `isDark` from builder card, tooltip, island, stage, kanban, and timeline component props.
- Updated affected components to read theme state locally with `useTheme()`.
- Removed obsolete `isDark={isDark}` handoffs from builder call sites.
- Kept the external `BuilderPage` prop and `useBuilderNodes` argument in place because those are page/data-boundary concerns, not island/card content props.
- Verified with `npm run lint` and `npm run build`.

Steps:
1. [x] For each island content file that still accepts `isDark` as a prop: add `const { isDark } = useTheme()` internally and remove the prop from the interface
2. [x] Remove `isDark` from the prop passed at call sites
3. [x] Verify visual output unchanged after each file

**Risk:** Low per file, but many files. Do 3–4 files per session to keep PRs reviewable.

### Phase F — `useIslandPanel` hook

**Goal:** Islands that manage sub-panels (Focus, ViewHelper) share a common panel navigation hook.

**Status:** Completed.

**Completed implementation notes:**
- Created `src/pages/builder/hooks/useIslandPanel.ts`.
- The hook supports both local and externally controlled panel state, so layout-aware islands can keep their current parent contracts.
- Migrated `FocusIsland` main locator expansion to `useIslandPanel` while preserving the existing `activePanel` / `setActivePanel` props used by the kanban and timeline layouts.
- Migrated `FocusIsland` phase/action/task locator popup state from three booleans to one `useIslandPanel` instance.
- Migrated `ViewHelperIsland` open/close state to `useIslandPanel` and kept the deliverable wizard open callback behavior intact.
- Verified with `npm run lint` and `npm run build`.

Steps:
1. [x] Create `builder/hooks/useIslandPanel.ts` — returns `{ activePanel, setPanel, closePanel }`
2. [x] Migrate `FocusIsland` (phase/action/task panel tabs) to use `useIslandPanel`
3. [x] Migrate `ViewHelperIsland` (creation flow/move panel/summary panels) to use `useIslandPanel`

**Risk:** Low. Internal hook migration with no prop changes.

---

## Part 12: What Must Not Be Touched During This Phase

**Tier 1 files — absolute freeze:**
- `types/domain.ts` — no field additions, no removals
- `services/` — no changes
- `queries/` — no changes
- `utils/task.factory.ts` — no changes
- `utils/id.helpers.ts` — no changes
- `mock/` — no changes

**Logic that must not regress:**
- Drag and drop between phases, actions, and timeline days
- Task editor open/close, dirty state guard, next/prev task navigation
- Copy/paste of actions and tasks
- Keyboard interactions (delete, Escape, multi-select)
- Autosave debounce behavior
- The `useNewObjectHighlight` shimmer animation

**Do not add new UI primitives** during this phase. `GlassCard`, `PopoverShell`, `BuilderCardShell`, `BuilderIslandShell` are the system. If a new UI need arises, compose these — do not create a fifth shell.

**Do not add new Zustand stores.** The current two stores (`appStore`, `builderStore`) are sufficient.

---

## Summary: The Architecture in One Paragraph

The app has three stable layers that never change for visual reasons (types, services, store) and one free layer that changes constantly (card templates, island panels, page widgets). Between them sits a structural layer (shells, tokens, stage manager, context) that changes only when the rules change. Every builder card is a `BuilderCardShell` with a swappable content template. Every expandable island is a `BuilderIslandShell` with a swappable panel. Every view is mounted by `StageManager`. Every theme decision flows from `useTheme()`. A designer can reshape any card or island content without opening a store file. A backend engineer can update a service without knowing how cards look. That separation is the architecture.

---

*End of DCX Manager New Component Architecture Plan*
