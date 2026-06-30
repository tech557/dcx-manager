# DCX Manager v0.2.0 — Development Plan & Feature-Controlled File Structure

**Document 5 of 5** (Requirements → Data Model → Tech Stack → Integration Assessment → **Development Plan**)  
**Approach:** Fresh build. v0.1.4 is a **reference library** for brand, visual language, and proven component internals — not a codebase to migrate.  
**Location:** `docs/03-development-plan.md`

---

## 1. The Shift: From Migration to Fresh Build

The earlier plan migrated v0.1.4 file by file. This plan abandons that. The reasons:

- v0.1.4 carries the structure of five refactor cycles. Migrating it imports that history.
- The requirements now define systems v0.1.4 never had: the Shared Card System, the Stage System, the Dropzone Engine, the Effects System, shared readiness. These are not refactors of existing files — they are new foundations.
- The most valuable thing in v0.1.4 is not its file structure. It is the **brand**, the **visual language**, and the **proven interaction internals** (how the date picker calendar works, how the kanban drag math works, how the glass styling looks).

So v0.1.4 becomes a **reference**, used three ways:

| Use | What we take | How |
|---|---|---|
| Brand | tokens, colors, glass styling, spacing, motion springs | Copy `tokens.ts` values into the new token system |
| Visual reference | how a phase/action/task card looks, how islands feel | Look at it, rebuild the template against the new card system |
| Logic reference | date math, drag math, calendar rendering, timeline grid | Read the proven internals, re-implement inside the new structure |

Nothing is migrated wholesale. Every file in v0.2.0 is written fresh against the new architecture, consulting v0.1.4 where it already solved a hard problem.

---

## 2. The Core Architectural Idea: Feature Control Through Configuration

The requirement behind everything you asked for — controllable, amendable card design / stage / effects / shared actions / shared properties — is solved by one principle:

> **UI features are defined by data (config/registries), not hardcoded in components. The component reads its behavior from a registry. To change a feature, you edit config, not component code.**

This turns five fragile, scattered concerns into five controlled systems:

| You want to control… | Controlled by… | You amend it by… |
|---|---|---|
| Card design | Card registry + swappable templates | Editing a template file or a card config entry |
| Stage / views | Stage core + view renderer registry | Adding a renderer + one registry entry |
| Effects / motion | Effects registry (named effects) | Editing one effect definition; every consumer updates |
| Shared actions | Action boundary (one action API) | Editing/adding one named command |
| Shared properties | Card capability + field-indicator config | Editing a typed config object |

Each system has a single home. A change has a single place to make it. That is what "controlled and amendable" means in practice.

---

## 3. The Feature-Controlled File Structure

```
src/
│
├── main.tsx
├── router.tsx
│
├── brand/                              ← THE BRAND SYSTEM (from v0.1.4 reference)
│   ├── tokens.ts                       ← colors, blur, radius, shadow, spring configs
│   ├── theme.ts                        ← light/dark resolution
│   └── index.css                       ← tailwind entry
│
├── effects/                            ← THE EFFECTS SYSTEM (IFX-001)
│   ├── effects.registry.ts             ← named effects: dropTargetGlow, invalidDrop,
│   │                                      parentGlow, selectedHighlight, newItemHighlight,
│   │                                      focusHighlight, expandCollapse, dragFeedback,
│   │                                      saveSyncFeedback, lockedFeedback
│   ├── useEffect.ts                     ← hook: useEffect('selectedHighlight', active)
│   ├── motion.config.ts                ← spring/timing presets (from brand tokens)
│   └── EffectLayer.tsx                  ← optional wrapper component for declarative effects
│
├── types/                              ← THE DATA CONTRACT (Data Model doc)
│   ├── domain.ts                        ← Task, Action, Phase, Version, Subtask, TaskDate
│   ├── lifecycle.ts                     ← VersionStatus, transitions, source types, events
│   ├── api.ts                           ← ApiXxx DTOs (imports lifecycle.ts)
│   ├── builder-node.types.ts            ← BuilderNode, PhaseNode, ActionCardData
│   ├── card.types.ts                    ← CardKind, CardCapability, CardConfig, FieldIndicator
│   ├── stage.types.ts                   ← ViewKind, StageContext, StageLayoutContract
│   ├── dropzone.types.ts                ← typed Dropzone model (DZ-001)
│   └── index.ts
│
├── rules/                              ← BUSINESS RULES (never in components)
│   ├── validation.rules.ts              ← readiness validation (RV-*, RDY-*)
│   ├── readiness.rules.ts               ← per-level + per-field readiness (RDY-001/003)
│   ├── lifecycle.rules.ts               ← transitions, locks, supersede (VL-*)
│   ├── permissions.rules.ts             ← access + lock guards (PR-*)
│   └── date.rules.ts                    ← linked/fixed resolution, span derivation (DM-009..16)
│
├── actions/                            ← THE SHARED ACTION BOUNDARY (BC-030, DZ-001)
│   ├── builder.actions.ts               ← THE public action API cards/islands/stage call:
│   │                                      createPhase, updatePhase, deletePhase, movePhase,
│   │                                      createAction, updateAction, deleteAction, moveAction,
│   │                                      createTask, updateTask, deleteTask, moveTask,
│   │                                      duplicateNode, applyImport
│   ├── action.guards.ts                 ← isLocked / permission checks before any mutation
│   └── useBuilderActions.ts             ← hook exposing the action API to components
│
├── store/
│   ├── appStore.ts                      ← theme, global UI
│   └── builderStore.ts                  ← BuilderNode[], selection, isLocked, saveStatus
│
├── services/                           ← INTEGRATION SEAMS (Integration doc)
│   ├── api-client.ts                    ← fetch wrapper, auth headers, base URL
│   ├── api-mappers.ts                   ← API DTO ↔ domain (DM-019)
│   ├── access.service.ts                ← auth/access seam (PR-001/003)
│   ├── versions.service.ts              ← version CRUD + lifecycle
│   ├── builder.service.ts               ← builder read/save
│   ├── clickup.service.ts               ← entry link / payload seam
│   ├── files.service.ts                 ← version file links
│   ├── logs.service.ts                  ← lifecycle event writes
│   ├── error-reporter.service.ts        ← error reporting seam
│   └── ai.service.ts                    ← AI seam (stub, AIC-001)
│
├── queries/
│   ├── QUERY_KEYS.ts
│   ├── versions.queries.ts
│   ├── builder.queries.ts
│   └── users.queries.ts
│
├── utils/                              ← PURE TECHNICAL HELPERS (no business logic)
│   ├── id.helpers.ts
│   ├── date.helpers.ts                  ← pure date math (consumed by date.rules.ts)
│   ├── node.helpers.ts                  ← domain ↔ BuilderNode mappers (DM-020)
│   ├── export.helpers.ts
│   ├── import.helpers.ts                ← reconciliation engine (BC-016..020)
│   └── preference.helpers.ts            ← scoped localStorage (UP-009/010)
│
├── hooks/
│   ├── useTheme.ts
│   ├── usePermissions.ts                ← reads permissions.rules.ts
│   ├── usePreferences.ts                ← scoped UI prefs (UP-*)
│   └── useReadiness.ts                  ← reads readiness.rules.ts for any node
│
├── ui/                                 ← BRAND-LEVEL PRIMITIVES (shared everywhere)
│   ├── GlassCard.tsx
│   ├── PopoverShell.tsx
│   ├── StickyPopupShell.tsx             ← reusable sticky/resizable/minimizable (SPS-001)
│   ├── SectionTitle.tsx
│   ├── StatusBadge.tsx                  ← reads lifecycle.ts
│   ├── AvatarStack.tsx
│   ├── FileTag.tsx
│   └── index.ts
│
├── components/                         ← APP-WIDE (non-builder) components
│   ├── auth/  (RouteGuard, LoginRedirect, NoAccessScreen)
│   ├── forms/ (Create/Edit DCX, dropdowns, inputs)
│   ├── modals/ (ApprovalConfirm, ImportPreview)
│   └── topbar/ (BrandIsland, UserIsland, ThemeToggle)
│
├── pages/
│   ├── home/
│   └── version/
│
└── builder/                            ← THE BUILDER (feature-controlled)
    │
    ├── BuilderPage.tsx                  ← load gate + RouteGuard + StageProvider
    │
    ├── stage/                          ← THE STAGE SYSTEM (STG-001..005)
    │   ├── StageCore.tsx                ← canvas, boundaries, movement, edge-scroll
    │   ├── StageProvider.tsx            ← stage context: view, selection, focus, position
    │   ├── stage.registry.ts            ← VIEW REGISTRY: kanban/timeline/weekly/monthly
    │   ├── StageLayoutContract.ts       ← who pushes / floats / filters (STG-003)
    │   ├── useStageMovement.ts          ← edge-scroll, off-stage navigation (STG-004/005)
    │   └── views/                       ← VIEW RENDERERS (plug into StageCore)
    │       ├── KanbanView.tsx
    │       ├── TimelineView.tsx
    │       ├── WeeklyView.tsx
    │       └── MonthlyView.tsx
    │
    ├── cards/                          ← THE SHARED CARD SYSTEM (SBC-001..005)
    │   ├── card.registry.ts             ← CARD REGISTRY: maps CardKind → config
    │   │                                   (capabilities, movement rules, indicators,
    │   │                                    readiness source, template)
    │   ├── CardShell.tsx                ← shared chassis: selection, drag, lock, highlight,
    │   │                                   readiness border, motion (consumes effects/)
    │   ├── useCardBehavior.ts            ← wires a card to its registry config + actions
    │   ├── FieldIndicator.tsx           ← shared field-status chip + controlled popup (SBC-005)
    │   └── templates/                   ← SWAPPABLE VISUAL TEMPLATES (Tier 3, freely edited)
    │       ├── phase/  PhaseCard.tsx + parts
    │       ├── action/ ActionCard.tsx + parts
    │       ├── task/   TaskCard.tsx + field-row parts
    │       └── day/    DayCard.tsx + parts
    │
    ├── dropzones/                      ← THE DROPZONE ENGINE (DZ-001)
    │   ├── dropzone.registry.ts         ← view rules generate typed dropzones
    │   ├── useDropzones.ts               ← active zones for current view + drag
    │   └── DropTarget.tsx                ← renders a zone, runs the action command on drop
    │
    ├── islands/                        ← BUILDER ISLANDS (config-driven)
    │   ├── island.registry.ts           ← ISLAND REGISTRY: scope (global/view-specific/
    │   │                                   view-limited), layout contract, persist rules (UP-005..008, UP-020)
    │   ├── IslandShell.tsx               ← shared island chassis
    │   ├── KanbanBuilderIsland/          ← creation strip + AI entry (KBI-001)
    │   ├── EditorViewerIsland/           ← stage-pushing deep editor (EVI-001)
    │   ├── FocusIsland/                  ← selection/isolation engine (FCS-001/002)
    │   ├── ViewHelperIsland/             ← cross-view bridge (VHB-001)
    │   ├── MetadataIsland/               ← project info, files, history
    │   ├── SelectionIsland/
    │   └── AIChatPopup/                  ← seed, uses StickyPopupShell (AIC-001)
    │
    └── focus/                           ← FOCUS / SELECTION ENGINE (FCS-001/002)
        ├── focus.engine.ts              ← match → select → highlight → expand → isolate
        └── useFocus.ts
```

---

## 4. How Each "Controlled Feature" Works

### 4.1 Card design — controlled by `cards/card.registry.ts` + `templates/`

A card is three separable things:

```
CardShell (chassis)      → selection, drag, lock, readiness border, highlight, motion
   reads ↓
card.registry.ts (config)→ what THIS card kind can do, how it moves, what indicators it shows
   renders ↓
templates/<kind>/        → what THIS card LOOKS like (freely redesignable)
```

To redesign the Task Card visually: edit `templates/task/TaskCard.tsx`. The shell, behavior, movement, and readiness are untouched.

To change what the Phase Card *can do* (e.g. enable the heatmap indicator): edit its entry in `card.registry.ts`. No template rewrite.

To add a brand-new card kind: add a registry entry + a template. The shell and actions already support it.

Registry entry shape (conceptual):
```typescript
phase: {
  kind: 'phase',
  capabilities: ['select','multiSelect','expand','drag','reorder','delete','lock','readiness','density'],
  movement: { axis: 'horizontal', container: 'board' },
  indicators: ['readiness','density','blockers'],
  readinessSource: 'children',          // phase readiness = child actions/tasks
  template: PhaseCardTemplate,
}
```

### 4.2 Stage — controlled by `stage/stage.registry.ts` + `views/`

Kanban, Timeline, Weekly, Monthly are **renderers** plugged into one `StageCore` (STG-001). The core owns canvas, movement, edge-scroll, off-stage dropzones, and context preservation. A view only renders content.

To add a view: write a renderer in `views/`, add one registry entry. View switching, movement, and context preservation come free (STG-002).

### 4.3 Effects — controlled by `effects/effects.registry.ts`

Every visual feedback (drop glow, invalid drop, parent glow, selected highlight, new-item highlight, focus highlight, expand/collapse, drag feedback, save feedback, locked feedback) is a **named effect** defined once. Components consume them via `useEffect('selectedHighlight', active)` — they never hardcode animation (IFX-001).

To change how "selected" looks everywhere: edit one effect definition. Every card and island updates. Motion never owns business state (guardrail).

### 4.4 Shared actions — controlled by `actions/builder.actions.ts`

Every mutation — create/update/delete/move/duplicate/import — is a named command in one file. Cards, islands, dropzones, and the AI pipeline all call the same action API through `useBuilderActions()`. No component calls `setNodes` or a service directly (Builder Action Boundary, BC-030).

To change how "move task" behaves, or to make it a granular API patch later: edit one command. Every caller updates.

### 4.5 Shared properties — controlled by `card.types.ts` + `FieldIndicator.tsx`

Shared card capabilities (selection, readiness, lock, indicators) and field-status indicators are typed config (SBC-001, SBC-005). The Task Card's field chips (date, missing data, specs, sender, receiver, channel, subtasks) are driven by an indicator config + the shared `FieldIndicator` component with its controlled popup. Readiness for every level comes from `rules/readiness.rules.ts` — cards never compute it themselves (RDY-001).

---

## 5. The Three-Tier Edit Safety Model

| Tier | What | Edit freedom | Examples |
|---|---|---|---|
| **Tier 1 — Truth** | types, rules, services, mappers, actions | Change deliberately, with review | `domain.ts`, `lifecycle.rules.ts`, `builder.actions.ts` |
| **Tier 2 — Systems** | shells, registries, stage core, effects registry, dropzone engine | Change when a capability changes | `CardShell.tsx`, `card.registry.ts`, `StageCore.tsx`, `effects.registry.ts` |
| **Tier 3 — Templates** | card templates, view renderers, island content, brand tokens | Change freely for visual work | `templates/task/TaskCard.tsx`, `views/KanbanView.tsx`, `brand/tokens.ts` |

A designer working on card visuals lives entirely in Tier 3. They cannot break readiness, lifecycle, or persistence because those live in Tier 1, reached only through the action boundary and rules.

---

## 6. Development Plan — Build Order

163 of 217 requirements are MVP. The build sequences foundations first, then the controlled systems, then features, then integration. Each phase ends with a working, demoable app on mocks.

The phases below are the **high-level map**. Each phase maps 1:1 to a Sprint in the companion document `docs/sprints/sprint-task-breakdown.md`, which breaks every phase into granular AI-agent tasks. Each task there carries: the requirement IDs it covers (from `dcx-requirements-master.csv`), the Data Model / Stack / Integration sections to read first, the exact files to create or edit, and per-task acceptance criteria. Use this section to understand the arc; use the breakdown document to execute. The order of authority during execution is: **Requirements CSV → Data Model → Sprint breakdown → existing code.**

### Phase 0 — Project Shell
Vite + React + TS, router, folder skeleton, `AGENTS.md`, docs in place, `verify.sh`. App runs with a placeholder. *(Setup only.)*

### Phase 1 — Brand + Types + Rules + Effects foundation
- `brand/` tokens + theme (values referenced from v0.1.4)
- `types/` all contracts (domain, lifecycle, api, builder-node, card, stage, dropzone)
- `rules/` skeletons (validation, readiness, lifecycle, permissions, date)
- `effects/` registry + hook (named effects, motion presets)
- `utils/` id, date, node, preference helpers
*Verified by `tsc` only. No UI yet.*
**Covers:** DM-*, VL-*, RDY-*, IFX-001 foundations.

### Phase 2 — Action boundary + Store + Services
- `actions/builder.actions.ts` + guards + `useBuilderActions`
- `store/builderStore.ts` (typed BuilderNode[])
- `services/` all seams (mock bodies, `@route` JSDoc) + `api-mappers.ts`
- `queries/`
**Covers:** SC-001/002, BC-030, integration seams, DM-019/020.

### Phase 3 — Router + Auth + Load Gate
- `router.tsx`, `RouteGuard`, `LoginRedirect`, `NoAccessScreen`
- `access.service.ts` wired to guard
- Builder load gate + progressive load sequence
**Covers:** VR-001/002/003, PR-001/002/021.

### Phase 4 — Stage System
- `StageCore`, `StageProvider`, `stage.registry.ts`, `StageLayoutContract`, `useStageMovement`
- Empty view renderers registered (kanban/timeline/weekly/monthly)
- Smoke test: mock → mappers → BuilderNode[] → placeholder render on stage
**Covers:** STG-001..005, DM-022.

### Phase 5 — Card System + Dropzone Engine
- `CardShell`, `card.registry.ts`, `useCardBehavior`, `FieldIndicator`
- `dropzones/` engine
- Card templates (phase, action, task, day) built fresh against v0.1.4 visual reference
**Covers:** SBC-001..005, DZ-001, RDY-001/003.

### Phase 6 — Kanban View + Creation
- `KanbanView` renderer, Kanban Builder Island (KBI-001)
- Create/move/delete via action boundary; drag-to-create with valid-target highlight
**Covers:** BC-001..006, KBI-001, BC-012/013.

### Phase 7 — Timeline / Weekly / Monthly Views
- Timeline renderer, day-based creation, off-stage date dropzones
- Weekly/monthly derived views
**Covers:** BC-007/008/009/010, STG-005, DM-005.

### Phase 8 — Editor/Viewer Island + Task Configuration
- Stage-pushing `EditorViewerIsland`, TaskEditor, field indicators → popups
- Unsaved-changes guard
**Covers:** EVI-001, BC-011, SBC-005, RV-009..012.

### Phase 9 — Lifecycle + Permissions Enforcement
- Fill `lifecycle.rules.ts`, `permissions.rules.ts`
- Auto In-Progress, approval + auto-supersede + confirmation modal, locked read-only
**Covers:** VL-003/011/012/027, PR-008/011, RV-003.

### Phase 10 — Validation + Readiness Gate
- Fill `validation.rules.ts`, `readiness.rules.ts`
- Ready gate, draft warning badges, failure feedback
**Covers:** RV-001..015, RDY-001/003, DM-004.

### Phase 11 — Save Continuity + Import/Export
- Autosave, manual save/Ctrl+S, close warning, local cache
- JSON export, import reconciliation engine + preview modal
**Covers:** SC-002..014, BC-015..022.

### Phase 12 — Focus Engine + View Helper + Sticky Popup Shell
- `focus.engine.ts` (match/select/highlight/expand/isolate), Focus Island
- `StickyPopupShell`, View Helper cross-view bridge, embedded file preview
**Covers:** FCS-001/002, VHB-001, SPS-001, EFP-001.

### Phase 13 — UI Preferences + Island Config
- `usePreferences`, `island.registry.ts`, view restore, cleanup rules
**Covers:** UP-001..023.

### Phase 14 — Logs + Errors + AI/Template Seeds
- `logs.service.ts`, `error-reporter.service.ts`, error boundary
- AI Chat popup shell seed, AI metadata fields, object template popup seed
**Covers:** CR-001..010, AIC-001, AIM-001, TPL-001.

### Phase 15 — Backend Integration
- Replace mock service bodies with real Supabase/ClickUp/Drive calls
- Connect Google OAuth to RouteGuard
- Confirm API naming + UUID strategy
*Requires the three outstanding inputs: ClickUp API, Supabase schema, AI spec.*

---

## 7. What v0.1.4 Is Used For (and What It Is Not)

**Used as reference:**
- Brand token values (colors, blur, radius, springs) → copied into `brand/tokens.ts`
- Visual look of each card and island → rebuilt as templates
- Proven internals: date-picker calendar, kanban drag math, timeline grid math, glass styling → re-implemented inside the new systems

**Not used:**
- Its file structure
- Its type system (`types.ts` bridge, wrong VersionStatus, missingData aliases)
- Its `App.tsx` routing
- Its `nodes: any[]`
- Any file copied wholesale

The rule: **open v0.1.4 to remember how something looked or how a hard calculation worked; write the v0.2.0 file fresh against the new architecture.**

---

## 8. The Five Documents, Assembled

```
1. Requirements          dcx-requirements-master.csv
2. Data Model            docs/architecture/data-model.md
3. Tech Stack            docs/architecture/tech-stack-and-integrations.md  (Part A)
4. Integration Assessment docs/architecture/tech-stack-and-integrations.md (Part B)
5. Development Plan       docs/03-development-plan.md   ← this document
   └ Sprint breakdown     docs/sprints/sprint-task-breakdown.md  (granular AI-agent tasks)
   + v0.1.4               reference library (brand, visuals, proven internals)
```

With all five plus v0.1.4 as reference, an AI agent has: what to build (requirements), the data shape (data model), the tools and seams (stack + integrations), the build order and file structure (this plan), and a visual/brand reference. Every UI feature — cards, stage, effects, shared actions, shared properties — has a single controlled home that can be amended by editing config rather than rewriting components.

---

*Development Plan — DCX Manager v0.2.0 — fresh build, feature-controlled architecture*
