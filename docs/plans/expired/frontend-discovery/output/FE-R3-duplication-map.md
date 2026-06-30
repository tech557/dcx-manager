# FE-R3: Duplication + Consolidation Map

Generated: 2026-06-26
Based on: FE-R1-component-tree.md, FE-R2-state-flow.md, UX-R2-component-css-map.md

---

## Component Duplication Groups

### Group 1 — Badge/Status display

**Components**: `StatusBadge` (ui/), `LockBadge` (ui/), `PhaseReadinessBadge` (phase card), `StatusDropdownBadge` (metadata), `.readiness-badge-*` (dead CSS)

**Visual overlap**: High — all are small rounded pills with uppercase font-mono text, coloured background + text pair.

**State overlap**: None — all are purely presentational, receive status via props. No context reads.

**Used in islands**: StatusBadge → 4 islands (Metadata, Editor, Selection, HeaderUser). LockBadge → 2 (Metadata, Header). PhaseReadinessBadge → 1 (PhaseCard). StatusDropdownBadge → 1 (MetadataIsland).

**Recommendation**: **CONSOLIDATE NOW** — Create `<Badge status variant size>` atom.
- `StatusBadge` becomes `<Badge variant="status" status={...} />`
- `LockBadge` becomes `<Badge variant="lock" isLocked />` or accepts `variant="status"` with a lock icon prop
- `PhaseReadinessBadge` becomes `<Badge variant="readiness" state={...} />`
- `StatusDropdownBadge` stays separate (has dropdown interaction — it's a Select, not a pure badge)

**Risk**: Low — no context deps, pure display.

---

### Group 2 — Pill chip elements

**Components**: `ChannelPill`, `FieldIndicator`, `InlineIslandButton`, `IslandToggleButton`, `MenuSectionButton`, + dead CSS classes (`.stage-tab`, `.island-toggle`, `.builder-tool-button`, `.channel-pill`, `.field-indicator`)

**Visual overlap**: High — all are horizontally-oriented pills with border, backdrop-blur, small font (~10-11px), uppercase tracking-wider.

**State overlap**: Partial:
- `ChannelPill`: presentational (no active/hover state changes)
- `FieldIndicator`: presentational (has popup but no active state)
- `InlineIslandButton`: has active state + drag support
- `IslandToggleButton`: has active state + icon swap
- `MenuSectionButton`: has active + passed states

**Used in islands**: ChannelPill → 3 (ViewHelper, EditorHeader, TaskProperties). FieldIndicator → 1 (PhaseCard/ActionCard). InlineIslandButton → 1 (KanbanBuilderIsland). IslandToggleButton → 2 (FocusIsland, KanbanBuilderIsland). MenuSectionButton → 1 (EditorHeader).

**Recommendation**: **CONSOLIDATE NOW** — Create `<Chip>` atom with `variant` (default/accent/ghost) + `size` (sm/md) + `active` + `draggable` props. `IslandToggleButton` retains its icon-swap behaviour as a wrapper around `Chip`. `FieldIndicator` stays separate (it has a popup, not just chip styling — but the visual base should use `Chip` classes).

**Risk**: Medium — need to verify click/drag handlers don't assume specific className structures.

---

### Group 3 — Glass card surface

**Components**: `CardShell` + `CardShellContent`, `GlassSurface`, `BuilderIslandShell`, `StickyPopupShell`, `PopoverShell`

**Visual overlap**: High — all use backdrop-blur, border-subtle, glass background with rounded corners.

**State overlap**: Distinct:
- `CardShell`: card-specific (selected, locked, expanded states)
- `GlassSurface`: generic surface (width, height, borderRadius, opacity, noBackground)
- `BuilderIslandShell`: island-specific (expanded/collapsed, position, shape)
- `StickyPopupShell`: popup-specific (isOpen, isMinimized, resize)
- `PopoverShell`: popover-specific (simple wrapper)

**Used in islands**: CardShell → 2 (PhaseCard, ActionCard, TaskCard). GlassSurface → 14 files. BuilderIslandShell → 8 islands. StickyPopupShell → 3 (AIChatPopup, MetadataFilesPopup, KanbanBuilderIsland). PopoverShell → 3 (selects, TaskReadOnlyPopup).

**Recommendation**: **CONSOLIDATE LATER** — extend `GlassSurface` with a `variant` (card/island/popup/popover) and `radius` (2rem/2.2rem/1.6rem) prop. All glass surfaces derive from it. CardShell, BuilderIslandShell, StickyPopupShell, and PopoverShell become wrappers around `GlassSurface`.

**Risk**: Low if gradual — start with `GlassSurface` accepting `variant`, then migrate consumers one at a time.

---

### Group 4 — Input elements

**Components**: `TextInputSmall`, `TextInputLarge`, `TextInputInline`, `DualInput`, `ListInputLines`, `SpecsInput`, `DateInputTBD`, `SearchableSelect` (search input part), `ChannelCompositionFields`

**Visual overlap**: Medium — all share transparent bg, border-subtle, focus accent, rounded-lg, small font.

**State overlap**: None — all receive value + onChange via props. No context reads.

**Used in islands**: TextInputLarge → 2 (ActionEditorSection, DayEditorSection). TextInputInline → 1 (EditorHeader). Others → 1 file each.

**Recommendation**: **CONSOLIDATE NOW** — Create `<Input>` base atom with `size` (sm/lg/inline) + `variant` (default/ghost). Compound inputs (`DualInput`, `ListInputLines`, `SpecsInput`) become wrappers around `<Input>`. `TextInputLarge` and `TextInputSmall` become `<Input size="lg">` and `<Input size="sm">`.

**Risk**: Low — pure form elements, no context deps.

---

### Group 5 — Toggle / Tab groups

**Components**: `ViewTabSwitcher` (MetadataIsland), inline toggle in `PhaseEditorSection`, `IslandToggleButton` (FocusIsland/KanbanBuilderIsland), dead CSS (`.editor-toggle-group`, `.stage-tabs`, `.stage-tab`)

**Visual overlap**: Medium — all are horizontal button groups with active/inactive states, border-radius, coloured active background.

**State overlap**: All track "which item is active" via local useState or setActiveTab prop.

**Used in islands**: ViewTabSwitcher → 1 (MetadataIsland). PhaseEditorSection toggle → 1. IslandToggleButton → 2 islands.

**Recommendation**: **CONSOLIDATE LATER** — Create `<ToggleGroup>` atom with `items` + `value` + `onChange`. `IslandToggleButton` is a single-toggle variant. `ViewTabSwitcher` becomes `<ToggleGroup>` with tab style.

**Risk**: Low — all presentational.

---

### Group 6 — DropZone patterns

**Components**: `PhaseDropZone`, `ActionDropZone`, `TaskDropZone`, `KanbanHiddenDropzones`, `DropTarget`

**Visual overlap**: High — all are invisible drop targets with hover highlight on drag-over.

**State overlap**: All read `isDragging`, `draggedNodeKind`, `nodes` from StageContext + `useBuilderActions` for drop handling.

**Used in islands**: PhaseDropZone → KanbanView. ActionDropZone → SmokeStage. TaskDropZone → SmokeStage. KanbanHiddenDropzones → KanbanView. DropTarget → KanbanHiddenDropzones.

**Recommendation**: **KEEP SEPARATE** — DropZones have different acceptance logic by kind (phase vs action vs task). The shared `DropTarget` base is already extracted. The specific zones are thin wrappers with different validation rules.

---

### Group 7 — Modal/Popup shells

**Components**: `StickyPopupShell`, `PopoverShell`, `DiscardSessionModal`, `UnsavedChangesModal`, `DeleteConfirmation`, `AIChatPopup`, `TemplatePopup`, `ReviewModal`, `MetadataFilesPopup`, `ImportPreviewModal`, `ApprovalConfirmModal`, `ReadinessCheckModal`

**Visual overlap**: Medium — all use glass-surface style, backdrop, close button.

**State overlap**: All have `isOpen`/`onClose` pattern plus specific content.

**Recommendation**: **KEEP SEPARATE** — These are different interaction patterns (anchored popover vs centered modal vs sticky popup). The visual base (glass surface) should be unified via Group 3 (GlassSurface), but each modal/popup has unique behaviour.

---

## Hook Duplication

### Overlap 1 — `useActiveNode` vs `useEditorDraft`

**Both** read `selectedNodeIds` and `nodes` from StageContext to derive which node is being edited.

**Files**: `useActiveNode.ts`, `useEditorDraft.ts` (both in EditorViewerIsland/)

**Recommendation**: **CONSOLIDATE** — `useEditorDraft` should call `useActiveNode` internally. Currently both independently read context and derive similar state. This duplicates the StageContext subscription.

### Overlap 2 — `useEditorPanel` vs `useEditorDraft` vs `useEditorGuard`

All three read `focusedNodeId` and `nodes` from StageContext, and all are used by `EditorViewerIsland`. They manage different aspects of the same flow (panel open/close, draft state, unsaved changes guard).

**Files**: `useEditorPanel.ts`, `useEditorDraft.ts`, `useEditorGuard.ts`

**Recommendation**: **CONSOLIDATE LATER** — Merge into a single `useEditorState` hook that returns `{ panel, draft, guard }`. The three are never used independently (all consumed by EditorViewerIsland only).

### Overlap 3 — `useCardDrag` + `useCardEffects` + `useCardBehavior`

All three accept `kind` + `data` + state flags and return card-level behaviour. `useCardEffects` is called inside `CardShell`; `useCardDrag` consumes `behavior` from `useCardBehavior`.

**Files**: `useCardBehavior.ts`, `useCardDrag.ts`, `useCardEffects.ts`

**Recommendation**: **KEEP SEPARATE** — They compose intentionally (effects depends on data, drag depends on behavior). The separation follows single-responsibility correctly.

### Overlap 4 — StageProvider internal hooks (`useDragState`, `useWeekState`, `useStageExpansion`, `useTaskReschedule`)

All 4 are consumed only by `StageProvider` itself (merged into a single context value).

**Recommendation**: **KEEP SEPARATE** — They are internal to StageProvider and compose well. No duplication — each has a distinct concern (drag, calendar math, auto-expand, reschedule).

### Overlap 5 — Open/close toggle hooks

Every island has its own `useState(false)` for open/close toggling. There is no shared `useToggle` helper.

**Files**: FocusIsland, PropertyOption, WeekOption, StatusDropdownBadge, KanbanBuilderIsland, MetadataIsland, HeaderUserActionsMenu, SearchableSelect, SearchableSelectIcons

**Recommendation**: **CONSOLIDATE NOW** — Create `useToggle(initialValue)` hook in `src/hooks/`. Returns `[isOpen, toggle, setOpen, setClose]`. Replace 10+ local `useState(false)` patterns. The hook is trivial (3 lines) but prevents inconsistent naming.

---

## Atom Extraction Candidates (ranked)

| Rank | Component | File | Used in N islands | Context deps | Risk | Priority |
|---|---|---|---|---|---|---|
| 1 | StatusBadge | src/ui/StatusBadge.tsx | 4+ | None | Safe | P1 |
| 2 | DividerLine | src/ui/DividerLine.tsx | 6 | None | Safe | P1 |
| 3 | LockBadge | src/ui/LockBadge.tsx | 2+ | None | Safe | P1 |
| 4 | PopoverShell | src/ui/PopoverShell.tsx | 3+ | useTheme | Low | P1 |
| 5 | GlassSurface | src/ui/surfaces/GlassSurface.tsx | 14+ | None | Safe | P1 |
| 6 | EffectLayer | src/ui/motion/EffectLayer.tsx | 2 | None | Safe | P2 |
| 7 | CampaignDetailsGroup | MetadataIsland/ | 1 | None | Safe | P2 |
| 8 | AlertMark | feedback/ | 1 | None | Safe | P2 |
| 9 | ReadyMark | feedback/ | 1 | None | Safe | P2 |
| 10 | ChannelPill | task-properties/ | 3 | None | Safe | P2 |
| 11 | PhaseReadinessBadge | phase card/ | 1 | None | Safe | P2 |
| 12 | InlineIslandButton | elements/buttons/ | 1 | None | Safe | P2 |
| 13 | IslandToggleButton | elements/buttons/ | 2 | None | Safe | P2 |
| 14 | MenuSectionButton | elements/buttons/ | 1 | None | Safe | P2 |
| 15 | ValidationSummary | feedback/ | 1 | None | Safe | P2 |
| 16 | TextInputSmall | forms/inputs/ | multiple | None | Safe | P1 (as part of Group 4) |
| 17 | TextInputLarge | forms/inputs/ | multiple | None | Safe | P1 (as part of Group 4) |
| 18 | TextInputInline | forms/inputs/ | 1 | None | Safe | P2 (as part of Group 4) |
| 19 | DualInput | forms/inputs/ | 1 | None | Safe | P2 |
| 20 | ListInputLines | forms/inputs/ | 1 | None | Safe | P2 |
| 21 | InlineSelect | forms/selects/ | multiple | None | Safe | P2 |
| 22 | SearchableSelect | forms/selects/ | multiple | None | Safe | P2 |
| 23 | CompletionStateSelect | forms/selects/ | 1 | None | Safe | P2 |
| 24 | DateInputTBD | forms/inputs/ | 1 | None | Safe | P2 |
| 25 | DropTarget | dropzones/ | 1 | None | Safe | P2 |

### Tier 1 — Extract now (used in 2+ islands, no context deps)
1. StatusBadge — 4+ islands
2. DividerLine — 6+ islands
3. LockBadge — 2+ islands
4. PopoverShell — 3+ islands
5. GlassSurface — 14+ files (core visual primitive)
6. TextInputSmall/TextInputLarge — consolidate into `<Input>`
7. ChannelPill — 3 islands
8. IslandToggleButton — 2 islands

### Tier 2 — Extract later (used in 1 island, safe to move)
9. All remaining forms/inputs and forms/selects
10. AlertMark, ReadyMark, ValidationSummary
11. CampaignDetailsGroup, PhaseReadinessBadge
12. InlineIslandButton, MenuSectionButton

---

## Deletion Candidates

### Unused component files (0 imports — from FE-R1)

| File | Last known purpose | Safe to delete? |
|---|---|---|
| — (no truly unused files found) | — | — |

All component files exported from the codebase have at least one consumer. No orphaned components were found.

### Dead CSS classes (from UX-R2 — confirmed 0 consumers)

| Class | Category | Safe to delete? |
|---|---|---|
| `.card-shell` + `.card-shell-*` (6 classes) | Dead — CardShell uses Tailwind | Yes |
| `.stage-shell`, `.stage-tab`, `.stage-tab-active`, `.stage-tabs`, `.stage-toolbar`, `.stage-view`, `.stage-phase-card` | Dead — stage layout uses Tailwind | Yes |
| `.phase-card-badge`, `.phase-card-badges`, `.phase-card-icon`, `.phase-card-label`, `.phase-density` | Dead — phased card inline styles | Yes |
| `.readiness-badge-ready`, `.readiness-badge-incomplete`, `.readiness-badge-blocked` | Dead — PhaseReadinessBadge uses inline classes | Yes |
| `.metadata-version-name`, `.metadata-version-status` | Dead — never wired | Yes |
| `.action-card-desc`, `.action-card-name`, `.action-empty-state`, `.action-task-list` | Dead — ActionCard uses inline | Yes |
| `.editor-empty`, `.editor-island-body`, `.editor-island-footer`, `.editor-island-header`, `.editor-toggle-group` | Dead — editor layout uses Tailwind | Yes |
| `.kanban-builder-tools`, `.kanban-task-list`, `.kanban-action-group`, `.kanban-action-list` | Dead — Kanban islands use Tailwind | Yes |
| `.builder-workspace`, `.builder-heading`, `.builder-tool-button`, `.card-template-description`, `.focus-island-floating`, `.glass-active`, `.status-pill-subtle`, `.task-card-message`, `.task-card-name`, `.task-field-row`, `.ai-entry` | Dead — various | Yes |
| `.woff` | Font-face artifact | Yes (delete font, or keep if font is loaded) |

**Total: 48 dead CSS classes. Safe to delete.**

### Verified: No orphaned component files found
The generate-code-index confirmed every component has at least one consumer.

---

## PO Decisions Required Before P2

☐ **Group 1 (Badge)**: Consolidate StatusBadge, LockBadge, PhaseReadinessBadge into single `<Badge>` atom — confirm?
☐ **Group 2 (Chip)**: Consolidate ChannelPill, InlineIslandButton, IslandToggleButton, MenuSectionButton into `<Chip>` — confirm?
☐ **Group 4 (Input)**: Consolidate TextInputSmall/Large/Inline into `<Input size>` — confirm?
☐ **Group 3 (Glass)**: Extend GlassSurface with `variant` prop (card/island/popup) — confirm direction?
☐ **Group 5 (Toggle)**: Create `<ToggleGroup>` for ViewTabSwitcher and inline toggles — confirm?
☐ **Hook Overlap 1**: Merge useActiveNode into useEditorDraft — confirm?
☐ **Hook Overlap 2**: Merge useEditorPanel/Draft/Guard into single useEditorState — confirm?
☐ **Hook Overlap 5**: Create shared `useToggle` hook — confirm?
☐ **Deletion**: Delete all 48 dead CSS classes in P2 sprint 1 — confirm?
☐ **Deletion**: Keep all component files (none are orphaned) — no action needed.
