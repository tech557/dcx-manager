# DCX Manager v0.2.13 — Master Refactor Plan

**Location:** `docs/sprints/refactor-plan-v0213.md`  
**Companion files:** `docs/component_registry.json` (authoritative file inventory)  
**Rule:** Every task here is structural only. Zero feature changes. Zero visual changes. Identical experience, coherent codebase.

---

## Part 1 — Component Hierarchy (Level System)

Every file in this project belongs to a level. A higher-level component may import a lower-level one. A lower-level component never imports a higher-level one. This is the rule that prevents circular dependencies and enforces the experience layering you described.

```
Level 0 — Design Tokens        brand/tokens.ts, brand/index.css
Level 1 — Primitive Surfaces   GlassSurface, EffectLayer, BuilderBg
Level 2 — UI Atoms             StatusBadge, LockBadge, DividerLine, PopoverShell
Level 3 — Form Elements        TextInput*, SearchableSelect*, DatePicker*, CompletionSelect
Level 4 — Card Chassis         CardShell (behaviour + drag + glass composition)
Level 5 — Card Templates       PhaseCard, ActionCard, TaskCard, DayCard
Level 6 — Island Shell         BuilderIslandShell (expand/collapse motion)
Level 7 — Island Content       MetadataIsland, FocusIsland, EditorViewerIsland, …
Level 8 — Stage System         StageCore, StageProvider, KanbanView, WeeklyView, …
Level 9 — Page Orchestrators   BuilderPage, HomePage, VersionPage
```

**Import rule: import only from equal or lower levels. Never upward.**

---

## Part 2 — Complete Target File Structure

Every file in this tree comes from `component_registry.json`. New files are marked `NEW`. Moved files are marked `MOVE`. Deleted files are marked `DELETE`. Unchanged files have no marker.

```
src/
│
│  ── LEVEL 0: DESIGN TOKENS ──────────────────────────────────────────
│
├── brand/
│   ├── tokens.ts              # colorTokens, blurTokens, radiusTokens,
│   │                          # shadowTokens, shadowStyleTokens, springTokens
│   ├── theme.ts               # resolveTheme(), isDark helper
│   └── index.css              # Tailwind entry + :root / .dark CSS variables
│                              # .card-shell, .field-indicator, .phase-density
│                              # .island-shell — all structural CSS classes here
│
│  ── LEVEL 1: PRIMITIVE SURFACES ─────────────────────────────────────
│
├── ui/
│   ├── surfaces/
│   │   ├── GlassSurface.tsx       # Frosted glass layer — reused by ALL cards
│   │   │                          # and islands. Props: borderRadius, opacity,
│   │   │                          # noBackground, backdropClassName, className
│   │   └── BuilderBg/
│   │       ├── BuilderBg.tsx      # Full-canvas ambient backdrop shell
│   │       └── LightRays.tsx      # Canvas animation loop (decorative only)
│   │
│   ├── motion/
│   │   ├── EffectLayer.tsx        # Wraps children in motion.div bound to
│   │   │                          # effectsRegistry entry. Single animation entry
│   │   │                          # point for all card/island motion.
│   │   ├── effects.registry.ts    # 10 named effects → EffectMotionProps
│   │   │                          # dropTargetGlow | invalidDrop | parentGlow |
│   │   │                          # selectedHighlight | newItemHighlight |
│   │   │                          # focusHighlight | expandCollapse |
│   │   │                          # dragFeedback | saveSyncFeedback | lockedFeedback
│   │   ├── motion.config.ts       # motionPresets (island, card, gentle)
│   │   │                          # sourced from brand/tokens.ts springTokens
│   │   └── useEffect.ts           # Hook: useEffect(name, active) → EffectMotionProps
│   │
│   │  ── LEVEL 2: UI ATOMS ──────────────────────────────────────────
│   │
│   ├── StatusBadge.tsx        # VersionStatus → colored pill (reads lifecycle.ts)
│   ├── LockBadge.tsx          # isLocked → lock/unlock pill
│   ├── DividerLine.tsx        # Vertical separator (reads useTheme)
│   └── PopoverShell.tsx       # Floating popover container
│
│  ── LEVEL 3: FORM ELEMENTS ──────────────────────────────────────────
│  All form elements are consolidated here. No duplication.
│
├── components/
│   ├── forms/
│   │   ├── inputs/
│   │   │   ├── TextInputSmall.tsx
│   │   │   ├── TextInputLarge.tsx
│   │   │   ├── TextInputInline.tsx     # inline editable field
│   │   │   ├── DualInput.tsx
│   │   │   ├── ListInputLines.tsx
│   │   │   ├── DateInputTBD.tsx
│   │   │   ├── SpecsInput.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── selects/
│   │   │   ├── SearchableSelect.tsx
│   │   │   ├── SearchableSelectIcons.tsx
│   │   │   ├── InlineSelect.tsx
│   │   │   ├── CompletionStateSelect.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── date/                        # ONE canonical date picker (DELETE duplicate)
│   │   │   ├── DatePickerPopup.tsx      # KEEP this one (502→≤150 after RF-6 split)
│   │   │   ├── CalendarGrid.tsx         # NEW — extracted calendar render
│   │   │   ├── useDatePickerState.ts    # NEW — extracted date state
│   │   │   ├── CommunicationDateField.tsx
│   │   │   ├── DatePickerToggle.tsx
│   │   │   └── index.ts
│   │   │
│   │   ├── channel/
│   │   │   ├── ChannelCompositionSelect.tsx
│   │   │   ├── InlineChannelCompositionSelector.tsx
│   │   │   └── index.ts
│   │   │
│   │   └── subtask/
│   │       ├── QuickSubtaskForm.tsx
│   │       └── index.ts
│   │
│   ├── feedback/
│   │   ├── ValidationSummary.tsx        # MOVE from components/
│   │   ├── BuilderErrorBoundary.tsx     # MOVE from components/
│   │   ├── ReadyMark.tsx                # MOVE from components/elements/redainess-marks/
│   │   └── AlertMark.tsx               # MOVE from components/elements/redainess-marks/
│   │
│   ├── modals/
│   │   ├── ApprovalConfirmModal.tsx
│   │   ├── ImportPreviewModal.tsx
│   │   └── readiness-check-modal/
│   │       └── ReadinessCheckModal.tsx
│   │
│   ├── elements/
│   │   └── buttons/
│   │       ├── InlineIslandButton.tsx
│   │       ├── IslandToggleButton.tsx
│   │       ├── MenuSections.tsx
│   │       └── index.ts
│   │
│   └── auth/
│       ├── RouteGuard.tsx
│       ├── NoAccessScreen.tsx
│       └── LoginRedirect.tsx
│
│  ── LEVELS 4–9: BUILDER ─────────────────────────────────────────────
│
├── builder/
│   │
│   │  ── LEVEL 4: CARD CHASSIS ────────────────────────────────────────
│   │
│   ├── cards/
│   │   ├── CardShell.tsx              # ≤150 lines after RF-4 split
│   │   │                              # Composes: GlassSurface + EffectLayer
│   │   │                              # + useCardDrag + useCardEffects + useCardBehavior
│   │   │
│   │   ├── GlassSurface.tsx           # MOVE from builder/cards/ → ui/surfaces/ (L1)
│   │   │                              # (imported from new path after move)
│   │   │
│   │   ├── useCardDrag.ts             # NEW — all drag event handlers
│   │   │                              # dragStart, dragEnter (contains() check),
│   │   │                              # dragOver, dragLeave, drop
│   │   │                              # Replaces dragCounter with contains() fix
│   │   │
│   │   ├── useCardEffects.ts          # NEW — unified visual state per card kind
│   │   │                              # Returns: { effectName, effectActive,
│   │   │                              # glassBorderClass, showCorners }
│   │   │                              # Reads card.registry.ts effects config
│   │   │
│   │   ├── useCardBehavior.ts         # unchanged
│   │   ├── handleCardDrop.ts          # unchanged (pure function)
│   │   ├── dragDropHelpers.ts         # unchanged
│   │   ├── card.registry.ts           # add effects{} block per card kind
│   │   ├── FieldIndicator.tsx         # unchanged
│   │   │
│   │   │  ── LEVEL 5: CARD TEMPLATES ──────────────────────────────────
│   │   │
│   │   └── templates/
│   │       │
│   │       ├── phase/
│   │       │   ├── PhaseCard.tsx             # ≤150 lines
│   │       │   ├── PhaseReadinessBadge.tsx   # readiness state → badge
│   │       │   ├── PhaseDensityBar.tsx       # action density visualisation
│   │       │   ├── phase.icons.ts            # PhaseIconType → Lucide component
│   │       │   ├── HorizontalTaskFlow.tsx    # MOVE from src/components/
│   │       │   └── TaskBentoGrid.tsx         # MOVE from src/components/
│   │       │
│   │       ├── action/
│   │       │   ├── ActionCard.tsx            # ≤100 lines
│   │       │   └── ActionTaskList.tsx        # task list + drop zones
│   │       │
│   │       ├── task/
│   │       │   ├── TaskCard.tsx              # ≤120 lines
│   │       │   └── task-properties/
│   │       │       ├── TaskProperties.tsx    # property row orchestrator
│   │       │       ├── ChannelPill.tsx       # channel icon + label pill
│   │       │       └── channel.icons.ts      # channelId → icon map
│   │       │
│   │       └── day/
│   │           └── DayCard.tsx
│   │
│   │  ── LEVEL 5 DROP ZONES (part of card system) ─────────────────────
│   │
│   ├── dropzones/
│   │   ├── DropTarget.tsx
│   │   ├── dropzone.registry.ts
│   │   └── useDropzones.ts
│   │
│   │  ── LEVEL 6: ISLAND SHELL ──────────────────────────────────────
│   │
│   ├── islands/
│   │   ├── BuilderIslandShell.tsx      # The shared chassis for ALL islands
│   │   │                               # expand/collapse motion from springTokens
│   │   │                               # glass from colorTokens + blurTokens
│   │   │                               # pill ↔ panel shape transition
│   │   │
│   │   │  ── LEVEL 7: ISLAND CONTENT ──────────────────────────────────
│   │   │
│   │   ├── HeaderBrandIsland.tsx       # Brand pill (logo + project)
│   │   ├── HeaderUserIsland/
│   │   │   ├── HeaderUserIsland.tsx
│   │   │   └── HeaderUserActionsMenu.tsx
│   │   │
│   │   ├── MetadataIsland/             # Campaign metadata, status, view tabs
│   │   │   ├── MetadataIsland.tsx      # ≤150 lines orchestrator
│   │   │   ├── CampaignDetailsGroup.tsx
│   │   │   ├── StatusDropdownBadge.tsx
│   │   │   ├── ViewTabSwitcher.tsx
│   │   │   └── MetadataModalsContainer.tsx
│   │   │
│   │   ├── EditorViewerIsland/         # Stage-pushing deep editor
│   │   │   ├── EditorViewerIsland.tsx  # ≤200 lines orchestrator
│   │   │   ├── EditorHeader.tsx
│   │   │   ├── PhaseEditorSection.tsx
│   │   │   ├── ActionEditorSection.tsx
│   │   │   ├── DayEditorSection.tsx
│   │   │   ├── UnsavedChangesModal.tsx
│   │   │   ├── useEditorDraft.ts
│   │   │   ├── useEditorGuard.ts
│   │   │   ├── useEditorReadiness.ts
│   │   │   └── TaskEditor/
│   │   │       ├── TaskEditor.tsx
│   │   │       ├── TaskSection1.tsx    # core identity fields
│   │   │       ├── TaskSection3.tsx    # subtasks
│   │   │       └── TaskSection4.tsx    # notes/misc
│   │   │
│   │   ├── FocusIsland/
│   │   │   ├── FocusIsland.tsx
│   │   │   └── options/
│   │   │       ├── WeekOption/
│   │   │       │   └── WeekOption.tsx
│   │   │       └── PropertyOption/
│   │   │           └── PropertyOption.tsx
│   │   │
│   │   ├── KanbanBuilderIsland/        # creation strip + AI entry
│   │   │   └── KanbanBuilderIsland.tsx
│   │   │
│   │   ├── SelectionIsland/
│   │   │   ├── SelectionIsland.tsx
│   │   │   ├── SelectionButtons.tsx
│   │   │   ├── SelectionLabel.tsx
│   │   │   └── selection.utils.ts
│   │   │
│   │   ├── TimelineBuilderIsland/
│   │   │   └── TimelineBuilderIsland.tsx
│   │   │
│   │   ├── ViewHelperIsland/
│   │   │   └── ViewHelperIsland.tsx    # cross-view bridge
│   │   │
│   │   ├── TaskCreationFlow/           # channel → composition → subtasks stepper
│   │   │   ├── TaskCreationFlow.tsx
│   │   │   ├── Step1_SelectChannel.tsx
│   │   │   ├── Step2_SelectComposition.tsx
│   │   │   ├── Step3_ReviewSubtasks.tsx
│   │   │   ├── CreateCompositionForm.tsx
│   │   │   └── useTaskCreationFlow.ts
│   │   │
│   │   ├── AIChatPopup/               # seed — inert in MVP
│   │   │   └── AIChatPopup.tsx
│   │   │
│   │   ├── TemplatePopup/             # seed — inert in MVP
│   │   │   └── TemplatePopup.tsx
│   │   │
│   │   └── PreviewReviewModal/
│   │       └── ReviewModal.tsx
│   │
│   │  ── LEVEL 8: STAGE SYSTEM ────────────────────────────────────────
│   │
│   ├── stage/
│   │   ├── StageCore.tsx               # canvas, movement, edge sensors, cursor
│   │   ├── StageProvider.tsx           # ≤150 lines after RF-7 split
│   │   ├── stage.registry.ts           # ViewKind → renderer component map
│   │   ├── StageLayoutContract.ts      # push | float | filter contract
│   │   ├── useDragState.ts             # NEW — drag context sub-hook
│   │   ├── useWeekState.ts             # NEW — week/subview context sub-hook
│   │   ├── TargetCursor.tsx            # MOVE from components/ → here
│   │   ├── TargetCursor.css            # MOVE from components/ → here
│   │   └── views/
│   │       ├── KanbanView.tsx          # horizontal phase columns
│   │       ├── TimelineView.tsx        # day×action matrix
│   │       ├── WeeklyView.tsx          # single-week grid
│   │       ├── MonthlyView.tsx         # 4-week grid
│   │       ├── MatrixTimelineView.tsx  # full-range matrix
│   │       ├── DayGridCard.tsx         # individual day column (timeline)
│   │       ├── DayGridCardCollapsed.tsx
│   │       ├── TimelineHourCell.tsx
│   │       ├── TimelineCustomEdgeSensors.tsx
│   │       ├── timeline.helpers.ts     # pure date math helpers
│   │       ├── SmokeStage.tsx          # dev scaffold
│   │       ├── PhaseDropZone.tsx       # expanding drop slot between phases
│   │       ├── ActionDropZone.tsx      # expanding drop slot between actions
│   │       └── TaskDropZone.tsx        # expanding drop slot between tasks
│   │
│   ├── focus/
│   │   ├── focus.engine.ts
│   │   └── useFocus.ts
│   │
│   ├── import/
│   │   ├── import.helpers.ts
│   │   └── __tests__/
│   │       └── import.helpers.test.ts
│   │
│   │  ── LEVEL 9: BUILDER PAGE ORCHESTRATOR ──────────────────────────
│   │
│   └── BuilderPage.tsx                # load gate + RouteGuard + StageProvider
│                                      # three-row grid shell
│
│  ── SHARED INFRASTRUCTURE ───────────────────────────────────────────
│
├── actions/                # ALL builder mutations
│   ├── builder.actions.ts  # barrel + BuilderActions interface
│   ├── phase.actions.ts
│   ├── action.actions.ts
│   ├── task.actions.ts
│   ├── node.actions.ts
│   ├── version.actions.ts
│   ├── action.helpers.ts
│   ├── action.guards.ts
│   └── useBuilderActions.ts
│
├── hooks/
│   ├── useTheme.ts         # isDark from appStore (single source)
│   ├── usePermissions.ts
│   ├── usePreferences.ts
│   └── useAutosave.ts
│
├── rules/
│   ├── validation.rules.ts
│   ├── readiness.rules.ts
│   ├── lifecycle.rules.ts
│   ├── permissions.rules.ts
│   └── date.rules.ts
│
├── services/               # integration seams — mock bodies + @route JSDoc
│   ├── api-client.ts
│   ├── api-mappers.ts
│   ├── access.service.ts
│   ├── versions.service.ts
│   ├── builder.service.ts
│   ├── channels.service.ts
│   ├── subtask-definitions.service.ts
│   ├── clickup.service.ts
│   ├── files.service.ts
│   ├── logs.service.ts
│   ├── error-reporter.service.ts
│   └── ai.service.ts
│
├── queries/
│   ├── QUERY_KEYS.ts
│   ├── builder.queries.ts
│   ├── versions.queries.ts
│   ├── users.queries.ts
│   ├── channels.queries.ts
│   └── subtask-definitions.queries.ts
│
├── types/
│   ├── domain.ts
│   ├── lifecycle.ts
│   ├── api.ts
│   ├── builder-node.types.ts
│   ├── card.types.ts
│   ├── stage.types.ts
│   ├── dropzone.types.ts
│   └── index.ts
│
├── store/
│   ├── appStore.ts
│   └── builderStore.ts
│
├── utils/
│   ├── id.helpers.ts
│   ├── date.helpers.ts
│   ├── node.helpers.ts
│   ├── export.helpers.ts
│   ├── import.helpers.ts    # note: also exists in builder/import/ — consolidate
│   ├── composition.helpers.ts
│   └── preference.helpers.ts
│
├── mock/
│   ├── channels.ts
│   ├── compositions.ts
│   └── subtask-definitions.ts
│
├── telemetry/
│   ├── event-names.ts
│   └── optin.ts
│
├── effects/                # MOVE contents to ui/motion/ (RF-0)
│   └── (empty after move)
│
├── pages/                  # Level 9 orchestrators
│   ├── RootLayout.tsx
│   ├── home/
│   │   └── HomePage.tsx
│   └── version/
│       └── VersionPage.tsx
│
├── main.tsx
└── router.tsx
```

---

## Part 3 — Card Visual State Specification

This is the documented expected behaviour for each card state, derived from the progress logs and session docs. This is what `useCardEffects.ts` must implement. These states replace the current two-system approach (effects registry for tasks + inline Tailwind for phase/action).

### Phase Card states

| State | Visual signal | Effect used |
|---|---|---|
| Default | Glass with readiness border (cyan/amber/red) | none — CSS `.card-shell-{readiness}` |
| Collapsed | Vertical pill, 72px wide, rotated label | none — layout only |
| Expanded | Full column, scrollable action list | `expandCollapse` on list entry |
| Drag over (action being dragged in) | Accent border glow, scale 1.015 | `dropTargetGlow` |
| Dragging (this card being moved) | 40% opacity, no glow | opacity 0.4 via `getPhaseTranslationStyle` |
| Selected | Accent border, no scale (phase too large) | `selectedHighlight` — border only, no scale |
| New item | Fade-scale in from 0.96 opacity | `newItemHighlight` |
| Locked | 56% opacity, desaturate | `lockedFeedback` |

### Action Card states

| State | Visual signal | Effect used |
|---|---|---|
| Default | Transparent background (no glass) | none — `noBackground=true` on GlassSurface |
| Collapsed | Compact row — name + task count mini-icons | none — layout only |
| Expanded | Full task list visible | `expandCollapse` on task list |
| Drag over (task being dragged in) | Subtle glass bg appears | `dropTargetGlow` — lighter than phase |
| Dragging (this card being moved) | 40% opacity | opacity 0.4 |
| Selected | Thin accent border | `selectedHighlight` — border only, no scale |
| New item | Fade-scale in | `newItemHighlight` |
| Locked | 56% opacity | `lockedFeedback` |

### Task Card states

| State | Visual signal | Effect used |
|---|---|---|
| Default (collapsed in action) | 44×44px square tile — channel icon + date | readiness border glow |
| Expanded (in action grid) | Full-width row — col-span-4 in grid | `expandCollapse` |
| Drag over | Accent glow, scale 1.015 | `dropTargetGlow` |
| Dragging | 40% opacity | opacity 0.4 |
| Selected | Corner brackets (4 × L-shaped markers) + scale | `selectedHighlight` |
| New item | Fade-scale in | `newItemHighlight` |
| Focused (editor open) | `focusHighlight` ring | `focusHighlight` |
| Locked | 56% opacity | `lockedFeedback` |

### Readiness border system (all cards)

Applied via `card.registry.ts` `effects.glassBorderClass` — one source, all cards:

```
ready      → border-[#75E2FF]/20  shadow-[0_0_15px_rgba(117,226,255,0.15)]
incomplete → border-[#F4C975]/20  shadow-[0_0_12px_rgba(244,201,117,0.12)]
blocked    → border-[#FF7575]/20  shadow-[0_0_12px_rgba(255,117,117,0.12)]
```

### Drag-and-drop interaction sequence

1. User picks up a card → `handleDragStart` → sets `isDragging=true` in StageProvider, card opacity drops to 0.4
2. Card enters a valid target → `handleDragEnter` with `contains()` check → `isDragOver=true`, `dropTargetGlow` activates
3. Card moves within target → `handleDragOver` → phase hover direction calculated (left/right of 50% threshold)
4. Card leaves target → `handleDragLeave` with `contains()` check → if `relatedTarget` is a child, ignore. Otherwise clear `isDragOver`
5. Card dropped → `handleDrop` → calls `handleCardDrop()` pure function → routes to named action command → clears all drag state
6. Drop zone slots (PhaseDropZone, ActionDropZone, TaskDropZone) expand visually when a compatible item is dragged near them

---

## Part 4 — Refactor Sprints

### Sprint RF-0 — Move effects to `ui/motion/` (30 min)

**Status:** Completed — 2026-06-25

Move `src/effects/` → `src/ui/motion/`. Update all imports. This places the animation system at Level 1 where it belongs.

**Files moved:** `effects.registry.ts`, `motion.config.ts`, `EffectLayer.tsx`, `useEffect.ts`  
**Acceptance:**
- [x] `grep -rn "from '@/effects/" src/` → 0 results.
- [x] `tsc` passes.
- [x] `verify.sh` passes.
- [x] Builder card expansion runs without browser warnings or errors.

---

### Sprint RF-1 — Eliminate date component duplication

**Status:** Completed — 2026-06-25

Two `DatePickerPopup.tsx` files, two `CommunicationDateField.tsx` files. Keep `forms/date-picker/`, delete `forms/elements/CommunicationDatePicker/`.

**RF-1.1** — [x] Fix the divergent `TaskSection1.tsx` import to use `forms/date/`.  
**RF-1.2** — [x] Delete `src/components/forms/elements/CommunicationDatePicker/` (4 files).  
**RF-1.3** — [x] Rename `forms/date-picker/` → `forms/date/`. Update all imports.

**Acceptance:**
- [x] `find src -name "CommunicationDatePicker" -type d` → 0 results.
- [x] Exactly one `CommunicationDateField.tsx`, `DatePickerPopup.tsx`, and `DatePickerToggle.tsx`.
- [x] Task editor and launch window consume the same structured `TaskDate` component.
- [x] Launch-window picker opens in fixed-date-only mode without browser warnings or errors.
- [x] `tsc` and `verify.sh` pass.

---

### Sprint RF-2 — Reorganise `components/forms/` into semantic subfolders

**Status:** Completed — 2026-06-25

Move all form elements from `forms/elements/` into `forms/inputs/`, `forms/selects/`, `forms/channel/`, `forms/subtask/`. Add barrel `index.ts` per subfolder. Delete empty legacy folders.

**Acceptance:**
- [x] `src/components/forms/elements/` deleted.
- [x] Only `channel/`, `date/`, `inputs/`, `selects/`, and `subtask/` remain.
- [x] Barrel `index.ts` exists in each form subfolder.
- [x] No legacy form-folder imports remain.
- [x] Builder loads without browser warnings or errors.
- [x] `tsc` and `verify.sh` pass.

---

### Sprint RF-3 — Move misplaced files

**Status:** Completed — 2026-06-25

| From | To | Why |
|---|---|---|
| `components/HorizontalTaskFlow.tsx` | `builder/cards/templates/phase/` | builder-only |
| `components/TaskBentoGrid.tsx` | `builder/cards/templates/phase/` | builder-only |
| `components/TargetCursor.tsx` | `builder/stage/TargetCursor.tsx` | builder-only |
| `components/TargetCursor.css` | `builder/stage/TargetCursor.css` | builder-only |
| `components/BuilderErrorBoundary.tsx` | `builder/BuilderErrorBoundary.tsx` | builder-only |
| `components/ValidationSummary.tsx` | `components/feedback/ValidationSummary.tsx` | shared feedback |
| `components/elements/redainess-marks/ReadyMark.tsx` | `components/feedback/ReadyMark.tsx` | rename + move |
| `components/elements/redainess-marks/AlertMark.tsx` | `components/feedback/AlertMark.tsx` | rename + move |
| `builder/cards/GlassSurface.tsx` | `ui/surfaces/GlassSurface.tsx` | Level 1 primitive |

**Acceptance:**
- [x] `src/components/` only contains `auth/`, `feedback/`, `forms/`, `elements/`, and `modals/`.
- [x] All RF-3 legacy import paths return zero matches.
- [x] GSAP remains imported only by `TargetCursor.tsx`.
- [x] Builder cursor and card expansion work after a clean server restart.
- [x] `tsc` and `verify.sh` pass.

---

### Sprint RF-4 — Extract `useCardDrag.ts` from `CardShell.tsx`

**Status:** Completed — regression repair and acceptance matrix completed (2026-06-25)

This is the most important sprint. It fixes the drag bugs by replacing the `dragCounter` pattern with a `contains()` check.

**RF-4.1 — Create `builder/cards/useCardDrag.ts`:**

```typescript
export function useCardDrag({ kind, data, locked, behavior, stageContext }) {
  const { nodes, expandedNodeIds, setExpandedNodeIds, isDragging,
          draggedNodeKind, draggedNodeId, setDraggingState,
          hoveredPhaseId, hoverDirection, setHoveredPhaseState } = stageContext;

  const [isDragOver, setIsDragOver] = useState(false);
  const [autoExpandedIds, setAutoExpandedIds] = useState<string[]>([]);

  // Reset when global drag ends
  useEffect(() => {
    if (!isDragging) { setIsDragOver(false); setAutoExpandedIds([]); }
  }, [isDragging]);

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    if (!e.dataTransfer.types.includes('application/x-dcx-card')) return;
    // KEY FIX: ignore events where mouse moved to a child element
    if (e.currentTarget.contains(e.relatedTarget as Node)) return;
    e.stopPropagation();
    setIsDragOver(false);
    if (autoExpandedIds.length > 0) {
      setExpandedNodeIds(expandedNodeIds.filter(id => !autoExpandedIds.includes(id)));
      setAutoExpandedIds([]);
    }
    if (draggedNodeKind === 'phase' && kind === 'phase') setHoveredPhaseState(null, null);
  };

  // ... handleDragStart, handleDragEnter, handleDragOver, handleDrop

  return { isDragOver, isDraggable, dragHandlers: { onDragStart, onDragEnter, onDragOver, onDragLeave, onDrop } };
}
```

**RF-4.2 — Slim `CardShell.tsx` to ≤150 lines** by consuming `useCardDrag`.

**Acceptance:**
- [x] CardShell.tsx ≤ 150 lines
- [x] useCardDrag.ts ≤ 120 lines
- [x] No dragCounter anywhere in codebase
- [x] Phase drag: payload isolation, direction, drop-zone routing, and reorder placement covered
- [x] Action drag between phases: nested drag propagation fixed and routing covered
- [x] Task drag between actions: nested drag propagation fixed and routing covered
- [x] Drag from palette to board: phase/action/task creation routes and browser payload fallback covered
- [x] Auto-expand on drag hover: target/parent expansion and leave-collapse decisions covered
- [x] Compatibility and child-transition helper tests pass
- [x] tsc passes

---

### Sprint RF-5 — Create `useCardEffects.ts` — Unified visual state

Unify the two visual-state systems (effects registry + inline Tailwind backdropClassName).

**RF-5.1 — Add `effects` config to `card.registry.ts`:**
```typescript
phase: {
  effects: {
    showDropGlow: true,
    showSelectionScale: false,     // phase too large to scale
    showSelectionCorners: false,
    glassBorderReady:      'border-[#75E2FF]/20 shadow-[0_0_15px_rgba(117,226,255,0.15)]',
    glassBorderIncomplete: 'border-[#F4C975]/20 shadow-[0_0_12px_rgba(244,201,117,0.12)]',
    glassBorderBlocked:    'border-[#FF7575]/20 shadow-[0_0_12px_rgba(255,117,117,0.12)]',
  }
},
action: {
  effects: {
    showDropGlow: true,
    showSelectionScale: false,
    showSelectionCorners: false,
    noBackground: true,            // action cards are transparent by default
  }
},
task: {
  effects: {
    showDropGlow: true,
    showSelectionScale: true,      // tasks scale on selection
    showSelectionCorners: true,    // L-shaped corner brackets
    glassBorderReady:      'border-[#75E2FF]/20 shadow-[0_0_15px_rgba(117,226,255,0.15)]',
    glassBorderIncomplete: 'border-[#F4C975]/20',
    glassBorderBlocked:    'border-[#FF7575]/20',
  }
},
```

**RF-5.2 — Create `builder/cards/useCardEffects.ts`:**
```typescript
export function useCardEffects({ kind, isDragOver, isJustCreated, isSelected, isLocked, readinessState }) {
  const config = cardRegistry[kind].effects;
  
  let effectName: EffectName = 'newItemHighlight';
  let effectActive = false;
  let glassBorderClass = config.glassBorderReady ?? '';

  if (isDragOver && config.showDropGlow) {
    effectName = 'dropTargetGlow'; effectActive = true;
  } else if (isJustCreated) {
    effectName = 'newItemHighlight'; effectActive = true;
  } else if (isLocked) {
    effectName = 'lockedFeedback'; effectActive = true;
  } else if (isSelected) {
    effectName = 'selectedHighlight'; effectActive = config.showSelectionScale ?? false;
  }

  if (readinessState === 'ready') glassBorderClass = config.glassBorderReady ?? '';
  else if (readinessState === 'incomplete') glassBorderClass = config.glassBorderIncomplete ?? '';
  else glassBorderClass = config.glassBorderBlocked ?? '';

  return {
    effectName, effectActive, glassBorderClass,
    showCorners: isSelected && (config.showSelectionCorners ?? false),
    noBackground: config.noBackground ?? false,
  };
}
```

**Acceptance:**
- [x] No inline `kind !== 'phase' && kind !== 'action'` conditions in CardShell
- [x] Phase cards show drop glow when an action is dragged over them — compatibility + phase effect integration test passes
- [x] Task cards show selection corner brackets when selected — browser verified four corner brackets
- [x] Action cards have transparent background when not selected
- [x] Readiness border colours correct on all three card kinds
- [x] tsc passes

---

### Sprint RF-6 — Split `DatePickerPopup.tsx` (502 lines → 3 files)

Extract `CalendarGrid.tsx` (calendar render, ~120 lines) and `useDatePickerState.ts` (state + navigation, ~60 lines). `DatePickerPopup.tsx` becomes the popup shell + composition, ≤150 lines.

**Acceptance:**
- [x] `CalendarGrid.tsx` contains calendar rendering and month navigation
- [x] `useDatePickerState.ts` owns mode, current date, selected week, and total-week state
- [x] `DatePickerPopup.tsx` is shell/composition only and ≤150 lines
- [x] Calendar month navigation works in the browser with no console warnings or errors
- [x] tsc passes + verify.sh passes

---

### Sprint RF-7 — Split `StageProvider.tsx` (281 lines → core + sub-hooks)

Extract `useDragState.ts` (~55 lines) and `useWeekState.ts` (~55 lines). Replace `window.dispatchEvent('dcx-prev-week'/'dcx-next-week')` with `prevWeek()`/`nextWeek()` functions exposed through context. `StageCore` calls context functions directly — no window events.

**Acceptance:**
- [x] `StageProvider.tsx` ≤150 lines — 108 lines
- [x] `grep -rn "dcx-prev-week\|dcx-next-week" src/` → 0 results
- [x] Week navigation works across weekly/monthly timeline subviews and shared matrix state
- [x] tsc passes + verify.sh passes

---

## Part 5 — Sprint Order and Dependencies

```
RF-0  effects → ui/motion/        independent — run first (5 min, establishes L1)
RF-1  date deduplication          independent — run alongside RF-0
RF-2  forms reorganisation        after RF-1 (date/ folder must exist)
RF-3  move misplaced files        after RF-0 (GlassSurface move needs ui/surfaces/)
RF-4  useCardDrag extraction      independent — highest impact for drag bugs
RF-5  useCardEffects unification  after RF-4 (CardShell must be slim)
RF-6  DatePickerPopup split       after RF-1 (canonical file established)
RF-7  StageProvider sub-hooks     after RF-4 (drag state now in useCardDrag)
```

Recommended order: **RF-0 → RF-3 → RF-4 → RF-1 → RF-2 → RF-7 → RF-5 → RF-6**

---

## Part 6 — What Must Not Change

- All `actions/` files — untouched
- All `types/` files — untouched  
- All `services/` files — untouched
- All `rules/` files — untouched
- `brand/tokens.ts` and `brand/index.css` — untouched
- `handleCardDrop.ts` — the drop logic is correct; only its caller changes
- `BuilderIslandShell.tsx` — correct and stable at Level 6
- All island content files — untouched (only imports update)
- All drop zone files — untouched
- The three-row builder layout in `BuilderPage.tsx` — frozen

---

## Part 7 — Component Registry: How to Keep It Current

After each sprint, run in the project root:

```bash
find src -name "*.tsx" -o -name "*.ts" | \
  grep -v "node_modules\|__tests__\|v0.1.4" | \
  while read f; do echo "{\"path\":\"${f#src/}\",\"lines\":$(wc -l < "$f")}"; done | \
  python3 -c "import sys,json; rows=[json.loads(l) for l in sys.stdin]; \
  print(json.dumps(sorted(rows,key=lambda x:-x['lines']),indent=2))" \
  > docs/component_registry.json && echo "Registry updated"
```

Or in Codex:
```bash
find src -name "*.tsx" -o -name "*.ts" | grep -v "node_modules\|__tests__" | \
  while read f; do echo "${f}: $(wc -l < "$f") lines"; done | sort -t: -k2 -rn
```

---

*Refactor Plan — DCX Manager v0.2.13 — component hierarchy, file structure, card behaviour specification*
