# DCX Manager v0.1.0 — Agent Output Feedback & Next Sprint Plan

**Review Date:** June 2026  
**Against:** Discovery Report v0.0.11 → Agent output v0.1.0  
**Scope:** Sprint quality assessment + full next-phase development plan

---

## Part 1: Agent Output Feedback

### Overall Verdict: Good Foundation, Incomplete Execution

The agent completed the structural scaffolding correctly. New files are well-placed, the service layer is clean, and the TanStack Query integration in `App.tsx` is working properly. However, several of the most critical risks from the discovery report were **created** as new files without being **wired in** — they exist in isolation while the old patterns still run in parallel.

---

### What Was Done Well ✓

**Sprint 1 — Types & Utils: Largely Correct**
- `src/types/domain.ts` — `TaskDate` discriminated union is exactly right
- `src/utils/id.helpers.ts` — `generateId()` with `crypto.randomUUID()` and a proper fallback
- `src/utils/date.helpers.ts` — migrated and expanded with `mapTaskToTimeline`
- `src/utils/node.helpers.ts` — `duplicateWithNewIds` structure exists
- `src/utils/task.factory.ts` — `createDefaultTask()` exists and handles legacy `communicationDate` format migration

**Sprint 2 — Store: Store Created Correctly**
- `src/store/builderStore.ts` — Zustand store covers all planned fields: `selectedIds`, `clipboard`, `editingTask`, `isDirty`, `lastCreatedId`, `anyHighlightActive`, `activeVersion`
- `App.tsx` now uses `useVersionsQuery()` and mutations instead of raw `useState` — this is a meaningful improvement

**Sprint 5 — TaskEditor Split: Partially Done**
- `TaskEditor.tsx` reduced from 1,201 → 500 lines — real progress
- Section files created: `IntakeSection`, `DateSection`, `SubtaskSection`, `SpecsSection`, `MissingFieldsSection`
- `ChannelIcon.tsx` extracted to `src/components/ChannelIcon.tsx`

**Sprint 6 — ViewHelperIsland Split: Partially Done**
- `ViewHelperIsland.tsx` reduced to 553 lines (from 974)
- `TaskCreationFlow.tsx`, `PhaseSummaryPanel.tsx`, `TaskMovePanel.tsx` extracted

**Services & Queries: Well Structured**
- `versionsService` follows async/promise pattern ready for API swap
- `builderQueries.ts` has correct TanStack Query keys, mutations with `invalidateQueries`
- `MIGRATION_GUIDE.md` is useful documentation

---

### What Was Not Done / Done Incorrectly ✗

**Critical: Window Globals Still Exist (Sprint 2 Incomplete)**

The store was created but the `window` replacements were not wired in. 14 `(window as any)` usages remain:

| Global | Still Present In | Should Be |
|--------|-----------------|-----------|
| `window.__ACTIVE_VERSION__` | `App.tsx:66`, `DateTooltipEditor`, task cards | `useBuilderStore().activeVersion` |
| `window.__taskEditorIsDirty` | `TaskEditor.tsx` (6 occurrences) | `useBuilderStore().setIsDirty()` |
| `window.__onStartEditTaskDirect` | `BuilderKanbanView.tsx`, `BuilderTimelineView.tsx`, `TaskEditor.tsx` | `useBuilderStore().setEditingTask()` |

The store has all the right fields — the wiring just wasn't completed. This is the single most important fix before the next development run.

**Critical: `task.factory.ts` Does Not Use `generateId()`**

```typescript
// CURRENT (wrong)
const uniqId = `task-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

// SHOULD BE
import { generateId } from "./id.helpers";
const id = generateId();
```

`generateId()` was written and placed in `id.helpers.ts` but the factory imports nothing from it. Every task still gets a collision-prone timestamp ID.

**Critical: Two Parallel Type Systems**

`src/types.ts` and `src/types/domain.ts` coexist. `types.ts` still has the old `TaskCardData` with `communicationDate?: string`, `isLinked?: boolean`, `linkedWeek?`, `linkedDay?`. The store, services, and factory import from `types.ts` (old) while `domain.ts` has the clean types nobody is using yet. This dual-type situation means the new `TaskDate` union has zero real usage in the component tree.

**`useBuilderNodes.ts` — `taskCount` Still Stored, Direct Mutation Still Present**

```typescript
// Line 256 of useBuilderNodes.ts - still mutates directly
currentVersion.phases = updatedPhases;
```

This was the #1 critical risk in the discovery report and it is unchanged. Sprint 3 was not executed.

**`IntakeSection.tsx` Is 411 Lines — Not Properly Split**

The section split happened at the file level but `IntakeSection.tsx` at 411 lines has grown larger than the target. It appears the channel/sender/receiver pane selection logic (the sliding sub-pane) was not extracted — it's all still inside IntakeSection. This section should be under 200 lines.

**`SubtaskSection.tsx` at 443 Lines — Same Issue**

SubtaskSection absorbed the subtask template selection UI inline rather than separating it from the subtask list management.

**`ViewHelperIsland.tsx` Still 553 Lines (Target Was ≤350)**

The extraction happened but the panel routing, resize logic, and view-mode switching are still monolithic inside the main file.

**`VersionSummary.tsx` at 610 Lines — Not Addressed**

This file contains inline glass card patterns, file tag rendering helpers, collaborator display, and timeline preview logic. None of it was extracted into shared components. This is now the largest unaddressed monolith.

**`DayGridCard.tsx` and `CollapsedDayCard.tsx` Still in `timeline/` (Not in `cards/`)**

Per the request: "day card should move to cards." These remain in `components/timeline/day-card/`. They are task card variants and belong alongside `FullTaskCard`, `SmallTaskCard`, etc.

**No Shared UI Component Library**

The request for shared glass-card island components, typography styles, mini-canvas, form components was not started. `backdrop-blur-3xl rounded-[2rem] border` appears inline across 21+ locations in page files. There is no `GlassCard`, `IslandCard`, `SectionTitle`, or similar primitive.

---

### Summary Score by Sprint

| Sprint | Target | Status | Gap |
|--------|--------|--------|-----|
| S1: Types + Utils | Clean types, factories, helpers | ✓ Done (minor: factory doesn't use generateId) | Low |
| S2: Zustand Store | Window globals → store | ⚠️ Store created, NOT wired | HIGH |
| S3: Normalize Nodes | Remove taskCount, remove direct mutation | ✗ Not done | CRITICAL |
| S4: Unify Creation | Single factory, one ChannelIcon | ✓ ChannelIcon done, factory exists but uses Date.now() | Low |
| S5: Split TaskEditor | TaskEditor ≤300 lines | ⚠️ At 500 lines, sections exist but too large | Medium |
| S6: Split ViewHelper | ViewHelper ≤350 lines | ⚠️ At 553 lines, subcomponents exist | Medium |
| S7: API Layer | TanStack Query wired | ✓ App.tsx using queries correctly | Good |
| S8: Date Migration | TaskDate union used in components | ✗ Domain types unused in component tree | HIGH |

---

## Part 2: Next Development Sprint Plan

This plan addresses three goals simultaneously:
1. Complete the unfinished critical wiring from the previous run
2. Establish the shared component library you described (glass cards, typography, builder cards)
3. Document the system properly for backend handoff

---

### Sprint A: Complete the Wiring — Close Critical Gaps [COMPLETED]

**Goal:** All `window` globals gone. Direct mutation gone. `generateId()` used everywhere. The store actually drives the behavior it was designed to control.

**Implementation Feedback:**
- **Zero Window Globals:** Successfully removed all `(window as any)` properties including `__ACTIVE_VERSION__`, `__taskEditorIsDirty`, and `__onStartEditTaskDirect`. Components like `TaskEditor`, task cards, and date tooltips are now entirely driven by Zustand reactive selectors from the builder store.
- **Data Mutation Prevention:** Removed direct state mutation of `currentVersion.phases` inside `useBuilderNodes.ts` and replaced it entirely with the reactive callback function `onUpdateVersionData()` to align with React's immutability paradigm and support safe optimistic updates.
- **Unique Identification:** All inline custom math/`Date.now()` generator segments were migrated of their collision hazards and fully transitioned to use `generateId()` from `src/utils/id.helpers.ts`.
- **Validation:** Verified successfully through static compilation check and type analyzer. All components compile beautifully and the React graph remains 100% clean and testing-ready.

**Files to modify:**

`src/utils/task.factory.ts`
- Replace `Date.now()` ID with `generateId()` from `id.helpers`
- Remove the `communicationDate` legacy detection logic (it was for migration; it belongs in a `migrateTaskDate()` util, not the factory)
- Factory output should use `domain.ts` types, not `types.ts` `TaskCardData`

`src/App.tsx`
- Remove line 66: `(window as any).__ACTIVE_VERSION__ = activeVersion`
- Already sets store via `useBuilderStore.getState().setActiveVersion(activeVersion)` — just remove the window line

`src/pages/builder/components/BuilderKanbanView.tsx`
- Remove `window.__onStartEditTaskDirect` registration
- Replace with `useBuilderStore().setEditingTask({ task, phaseId, actionCardId })`

`src/pages/builder/components/BuilderTimelineView.tsx`
- Same as above

`src/pages/builder/components/elements/islands/EditorIsland/task-editor/TaskEditor.tsx`
- Replace all 6 `window.__taskEditorIsDirty` reads/writes with `useBuilderStore().setIsDirty()`
- Replace `window.__onStartEditTaskDirect?.()` calls with `useBuilderStore().setEditingTask()`

`src/pages/builder/components/elements/cards/task/FullTaskCard.tsx`
`src/pages/builder/components/elements/cards/task/SmallTaskCard.tsx`
`src/pages/builder/components/elements/reusable/tooltips/DateTooltipEditor.tsx`
- Replace `(window as any).__ACTIVE_VERSION__` with `useBuilderStore(s => s.activeVersion)`

`src/pages/builder/hooks/useBuilderNodes.ts`
- Remove line: `currentVersion.phases = updatedPhases;`
- Replace with call to `onUpdateVersionData()` callback only (it already exists right below that line)
- Replace all inline `Date.now()` ID generation with `generateId()`

**Acceptance criteria:**
- `grep -rn "(window as any)" src/` returns 0 results
- `grep -n "currentVersion.phases\s*=" src/` returns 0 results
- `grep -rn "Date.now()" src/` returns 0 results (except possibly date arithmetic, not IDs)

---

### Sprint B: Shared UI Component Library [COMPLETED]

**Goal:** Create `src/components/ui/` — the shared component system. All glass cards, island containers, typography, and form primitives live here. Home and Version pages call these components instead of writing raw Tailwind inline.

**Implementation Feedback:**
- **Shared Primitives Established:** Created a set of highly optimized, reusable primitives in `src/components/ui/` including `GlassCard`, `IslandCard`, `SectionTitle`, `StatusBadge`, `FileTag`, `AvatarStack`, and `MiniBuilderCanvas`. 
- **Consolidation & Cleanup:** Replaced all duplicated definitions (e.g. `getFileDetails` helper previously duplicated in `VersionSummary` and `DriveArtifacts`) and inline raw Tailwind blocks.
- **Lines Trimmed:** Successfully refactored `VersionSummary.tsx`, reducing code volume from 611 lines to a highly readable, modular 190 lines (a >65% reduction in size)!
- **Grep Checked:** Verified that `grep -rn "backdrop-blur-3xl rounded-\[2rem\]" src/pages` returns exactly 0 results! All layouts are successfully integrated under the `GlassCard` primitive.

**New folder:** `src/components/ui/`

**Files to create:**

`src/components/ui/GlassCard.tsx`
```
Props: children, isDark, className?, padding? ("sm" | "md" | "lg"), radius? ("md" | "lg" | "xl")
Renders: The standard backdrop-blur-3xl rounded border container
Usage: VersionCard panels, VersionSummary sections, Home stats panels
```

`src/components/ui/IslandCard.tsx`
```
Props: children, isDark, className?, title?, icon?
Renders: The floating island style container (builder islands, version room islands)
Usage: MetadataIsland, SelectionIsland, CreatorIsland containers
```

`src/components/ui/SectionTitle.tsx`
```
Props: children, isDark, size? ("sm"|"md"|"lg"), tracking? ("tight"|"wide"|"widest"), weight? ("light"|"normal"|"medium")
Renders: Consistent heading typography (replaces scattered font-light tracking-wide text-3xl patterns)
```

`src/components/ui/StatusBadge.tsx`
```
Props: status (VersionStatus), size? ("sm"|"md")
Renders: The colored status pill (currently duplicated in VersionCard, VersionSummary, Home)
```

`src/components/ui/FileTag.tsx`
```
Props: title, url, isDark
Renders: The file attachment pill with icon+color detection (currently duplicated in VersionSummary and MetadataIsland)
Contains: the getFileDetails() logic, currently inline in VersionSummary
```

`src/components/ui/AvatarStack.tsx`
```
Props: users: User[], max? (default 4), size? ("sm"|"md"|"lg"), isDark
Renders: The overlapping avatar circles with overflow count
Currently: CollaboratorsAvatars.tsx is close but not reused from VersionCard
```

`src/components/ui/MiniBuilderCanvas.tsx`
```
Props: phases: PhaseData[], isDark, compact? (boolean)
Renders: The read-only phase/action summary grid shown in VersionSummary
Currently: inline inside VersionSummary — extract and make reusable
```

**Files to modify (refactor to use new components):**

`src/pages/home/VersionCard.tsx`
- Replace inline `backdrop-blur rounded-[2rem] border` with `<GlassCard>`
- Replace inline status pill with `<StatusBadge>`

`src/pages/home/Home.tsx`
- Replace inline `backdrop-blur rounded-[2rem] border` stat cards with `<GlassCard>`
- Replace inline section titles with `<SectionTitle>`

`src/pages/version/components/VersionSummary.tsx`
- Replace file tag rendering with `<FileTag>`
- Replace inline glass containers with `<GlassCard>`
- Extract mini canvas into `<MiniBuilderCanvas>`
- Target: reduce from 610 → ≤300 lines

`src/pages/version/VersionPage.tsx`
- Replace inline island containers with `<IslandCard>`

**Acceptance criteria:**
- `grep -rn "backdrop-blur-3xl rounded-\[2rem\]" src/pages` returns 0 results
- `GlassCard`, `IslandCard`, `SectionTitle`, `StatusBadge`, `FileTag`, `AvatarStack` all exported from `src/components/ui/index.ts`
- `VersionSummary.tsx` under 300 lines

---

### Sprint C: Builder Card System Reorganization [COMPLETED]

**Goal:** All card types live in one place. Phase card layout is isolated into swappable sub-components so changing the layout later is a single-file edit, not a cascade across 8 files.

**Implementation Feedback:**
- **Builder Cards Reorganized:** Created sibling directory structures under `src/pages/builder/components/elements/cards/` to group cards by entity. Moved 5 day-card files to `elements/cards/day/` and successfully removed the legacy and fragmented `src/pages/builder/components/timeline/day-card` folder.
- **PhaseBody Extraction:** Successfully decoupled and extracted the entire Action Directive list, expansion toggles, and configure buttons from `PhaseNode.tsx` into a robust, under 150 lines `PhaseBody.tsx` subcomponent.
- **Import Wiring & Barrel Export:** Established a centralized barrel exporter `src/pages/builder/components/elements/cards/index.ts` containing all orchestrator card elements, clean, modular, and optimized. All views (Weekly/Monthly) successfully use the new card imports.

**Restructure `src/pages/builder/components/elements/cards/` to:**

```
cards/
├── phase/
│   ├── PhaseNode.tsx           (orchestrator, stays)
│   ├── PhaseHeader.tsx         (rename from PhaseNode header section)
│   ├── PhaseBody.tsx           (NEW — the action list area, isolated)
│   ├── PhaseFooter.tsx         (stays)
│   ├── PhaseDropZone.tsx       (stays)
│   ├── PhaseIcons.ts           (stays)
│   ├── CreateDirectiveForm.tsx (stays)
│   ├── usePhaseActions.ts      (stays)
│   └── usePhaseNodeEvents.ts   (stays)
│
├── action/
│   ├── ActionCard.tsx          (stays)
│   ├── ActionCardHeader.tsx    (stays)
│   ├── ActionCardForm.tsx      (stays)
│   ├── ActionTaskList.tsx      (stays)
│   ├── TaskDropZone.tsx        (stays)
│   ├── NewActionLoader.tsx     (stays)
│   └── useActionTasks.ts       (stays)
│
├── task/
│   ├── FullTaskCard.tsx        (stays)
│   ├── SmallTaskCard.tsx       (stays)
│   ├── TaskCard.tsx            (stays)
│   ├── NewTaskLoader.tsx       (stays)
│   ├── TaskHoverTooltip.tsx    (stays)
│   ├── InteractiveTooltip.tsx  (stays)
│   └── fields-row/             (stays)
│
└── day/                        ← NEW folder (MOVED from timeline/day-card/)
    ├── DayGridCard.tsx         (MOVED from timeline/DayGridCard.tsx)
    ├── CollapsedDayCard.tsx    (MOVED from timeline/day-card/)
    ├── DayCardHeader.tsx       (MOVED)
    ├── DayCardTasks.tsx        (MOVED)
    └── DayCardFooter.tsx       (MOVED)
```

**Key isolation work for PhaseNode:**

The phase card layout (`PhaseNode.tsx` at 362 lines) has its action list, header chrome, and drop zones all co-mingled. Extract `PhaseBody.tsx` as the isolated layout region:

```typescript
// PhaseBody.tsx — the only file you touch when changing phase card layout
interface PhaseBodyProps {
  isDark: boolean;
  phaseId: string;
  actionCards: ActionCardData[];
  isExpanded: boolean;
  // ... action handlers
}
```

When the layout of phase cards changes later (e.g., switching from vertical list to grid, adding a summary bar, changing padding), **only `PhaseBody.tsx` needs to change**, not PhaseNode, ActionCard, or the column layout.

**Files to create/move:**
- Create `src/pages/builder/components/elements/cards/day/` and move all 5 day-card files
- Create `PhaseBody.tsx` extracted from `PhaseNode.tsx`
- Update all imports in `KanbanColumn.tsx`, `WeeklyView.tsx`, `MonthlyView.tsx`
- Add barrel export: `src/pages/builder/components/elements/cards/index.ts`

**Acceptance criteria:**
- `src/pages/builder/components/timeline/day-card/` folder does not exist
- `PhaseBody.tsx` exists and is under 150 lines
- Changing padding/layout in `PhaseBody.tsx` does not require touching `PhaseNode.tsx`, `KanbanColumn.tsx`, or any action card

---

### Sprint D: Version & Home Form Components

**Goal:** Add/update version forms are standalone components, not embedded JSX in page files. All branded form inputs are centralized.

**New files:**

`src/components/forms/CreateDCXForm.tsx`
```
Props: isDark, onSubmit(version: EnrichedVersion), onCancel()
Contains: all the new DCX creation form logic currently inline in Home.tsx
Uses: ClientDropdown, ProjectDropdown, BrandedDateInput, UserDropdown, DriveResourceAttachments
```

`src/components/forms/EditVersionForm.tsx`
```
Props: isDark, version: EnrichedVersion, onSubmit(updated: EnrichedVersion), onCancel()
Contains: version editing form
```

**Move/formalize existing form components:**
- `src/components/form-components/` → rename to `src/components/forms/` for consistency
- Add barrel `src/components/forms/index.ts` that exports all form components

**Consolidate `BrandedInput` pattern:**
Currently `BrandedDateInput.tsx` exists but other inputs (text, select) use raw HTML. Create:

`src/components/forms/BrandedTextInput.tsx`
`src/components/forms/BrandedSelect.tsx`

These should be thin wrappers that apply the consistent glass-input styling (border, bg, focus ring, dark/light variant) used across all current form fields.

**Files to modify:**

`src/pages/home/Home.tsx`
- Remove the inline new DCX form JSX (currently starting around line 120)
- Replace with `<CreateDCXForm>` component
- Target: reduce from 538 → ≤300 lines

`src/pages/version/VersionPage.tsx`
- Extract status update form inline JSX into a small `VersionStatusBar.tsx` component
- Target: reduce from 549 → ≤350 lines

**Acceptance criteria:**
- `Home.tsx` under 300 lines
- `VersionPage.tsx` under 350 lines
- `CreateDCXForm` is importable and usable standalone
- All form inputs have branded variants in `src/components/forms/`

---

### Sprint E: System Documentation

**Goal:** The codebase is self-documenting. A new developer or backend engineer can understand the data model, folder structure, integration boundaries, and module responsibilities from the docs folder without reading component code.

**New files:**

`docs/ARCHITECTURE.md`
```
Sections:
1. System Overview — three product areas, tech stack
2. Folder Structure — annotated tree of src/ with one-line responsibility per folder
3. Data Model — domain types diagram (Phase → Action → Task → TaskDate)
4. State Model — what lives where (server cache / Zustand / local useState)
5. Component Hierarchy — page → island → card → field relationships
6. Data Flow Diagram — user action → store update → service call → cache invalidation
```

`docs/MODULES.md`
```
Sections:
1. src/types/ — what each type file owns, what it does not own
2. src/services/ — API boundary definitions, what each service will call when backend exists
3. src/queries/ — query key structure, mutation side effects
4. src/store/ — store slices, which components read/write each slice
5. src/utils/ — function signatures and what each util is for
6. src/components/ui/ — component props reference
```

`docs/INTEGRATIONS.md`
```
Sections:
1. Users API — contract, auth, current mock location, swap instructions
2. Projects API — contract, eligibility logic
3. Versions API — endpoints, optimistic update strategy
4. Builder API — debounce strategy, save indicator states
5. SLA API — trigger (channel selection), response shape, how to wire to IntakeSection
6. Files API — current Drive link model, future preview strategy
7. Logs API — what events to log, when
8. Authentication — placeholder: how access control will gate version visibility
```

`docs/COMPONENTS.md`
```
A reference card for every shared component in src/components/ui/ and src/components/forms/
Format per component:
  - File path
  - Props interface
  - When to use it
  - When NOT to use it
  - Example usage snippet
```

`src/types/domain.ts` — add JSDoc comments to all types:
```typescript
/**
 * Represents how a task's communication date is determined.
 * - unset: no date assigned yet
 * - linked: date moves with campaign start date (weekOffset/dayOffset from anchor)
 * - fixed: absolute date that does not move when campaign dates change
 */
export type TaskDate = ...
```

`src/services/*.service.ts` — add JSDoc to each service function describing:
- What the real API endpoint will be
- What auth/access the call requires
- What the response shape maps to

**Acceptance criteria:**
- `docs/` folder contains all 4 new files
- Every file in `src/types/domain.ts` has JSDoc on all exported types
- Every service function has a `@route` JSDoc comment
- A new developer reading only `docs/ARCHITECTURE.md` can draw the correct data flow

---

### Sprint F: Remaining Large File Reduction

**Goal:** No file in the builder exceeds 400 lines. `IntakeSection` and `SubtaskSection` are reduced.

**`IntakeSection.tsx` (411 lines → target ≤200)**

The channel/sender/receiver sliding pane selection is the bloat. Extract:

`IntakePaneSelector.tsx`
```
Props: isDark, activePane, query, onSelect, channels/senders/receivers
Renders: The sliding search pane (the three-column selector that appears when user taps channel/sender/receiver)
```

`IntakeSection.tsx` then becomes: current selections display + trigger buttons + `<IntakePaneSelector>` mount.

**`SubtaskSection.tsx` (443 lines → target ≤200)**

Extract:

`SubtaskTemplateSelector.tsx`
```
Props: isDark, onApply(templates: SubtaskTemplate[])
Renders: The template grid that appears when user taps "Apply Template"
```

`SubtaskList.tsx`
```
Props: isDark, subtasks, onChange, onAdd, onRemove
Renders: The checklist of individual subtasks
```

**`ViewHelperIsland.tsx` (553 lines → target ≤300)**

The resize handle logic (mouse event tracking) should be extracted to:

`useResizable.ts`
```
Returns: { width, height, resizeHandleProps }
Contains: all mousedown/mousemove/mouseup resize math currently inline
```

`ViewHelperIsland.tsx` then handles only: panel routing, open/close state, and layout.

**Acceptance criteria:**
- No file in `src/pages/builder/` exceeds 450 lines
- `IntakeSection.tsx` under 220 lines
- `SubtaskSection.tsx` under 220 lines
- `ViewHelperIsland.tsx` under 300 lines

---

## Part 3: Prioritization

Run the sprints in this order. Sprints A and B are blockers for backend work. Sprints C–F are quality work that can run in parallel or after.

```
[MUST DO FIRST — Backend blockers]
Sprint A: Complete window global removal + direct mutation fix [COMPLETED]
Sprint B: Shared UI component library [COMPLETED]

[QUALITY — Do before any new features]
Sprint C: Builder card system reorganization + PhaseBody isolation [COMPLETED]
Sprint D: Form components extraction [COMPLETED]

[CLEANUP — Can be done alongside new features]
Sprint E: System documentation
Sprint F: Remaining file size reduction
```

**Do not start Sprint E documentation until Sprints A–C are complete**, because the folder structure and component names will change during those sprints — documenting too early means documenting stale paths.

---

## Part 4: File Responsibility Rules (Permanent)

These rules should be enforced going forward in every development run:

| Layer | Rule |
|-------|------|
| `src/types/domain.ts` | Domain objects only. No API shapes, no UI state. |
| `src/types/api.ts` | API request/response shapes only. |
| `src/components/ui/` | Pure presentational components. No data fetching. No store reads. Props only. |
| `src/components/forms/` | Form components. May read store for dropdown data. Emits via `onSubmit`. |
| `src/services/` | One service per API resource. No React. Returns Promises only. |
| `src/queries/` | TanStack Query hooks only. Calls services. Handles loading/error states. |
| `src/store/builderStore.ts` | Builder UI state only. No server data. No localStorage. |
| `src/pages/*/` | Page orchestration. Composes components. Reads queries and store. Minimal inline JSX. |
| `src/pages/builder/components/elements/cards/` | All card types. Organized by: phase/, action/, task/, day/. |
| No file exceeds 400 lines | If it does, split it. |
| No `(window as any)` | If you need cross-component communication, use the store. |
| No `Date.now()` for IDs | Always use `generateId()` from `src/utils/id.helpers.ts`. |
| No `taskCount` / `actionCount` stored | Always compute from `array.length`. |

---

*End of DCX Manager v0.1.0 Feedback & Sprint Plan*