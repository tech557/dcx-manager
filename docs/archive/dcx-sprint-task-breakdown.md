# DCX Manager v0.2.0 — Sprint & Task Breakdown (AI Agent Execution)

**Companion to:** `docs/03-development-plan.md` §6 (Build Order)  
**Cross-references:** `dcx-requirements-master.csv` (REQ), `docs/architecture/data-model.md` (DM), `docs/architecture/tech-stack-and-integrations.md` (STACK/INTEG), `docs/04-agent-execution-protocol.md` (PROTOCOL)  
**Location:** `docs/sprints/sprint-task-breakdown.md`

---

## How to Read This Document

Each **Sprint** maps 1:1 to a Phase in the Development Plan §6. Each sprint lists **Tasks**. Each task has:

- **Covers** — the requirement IDs (from `dcx-requirements-master.csv`) the task satisfies
- **References** — the sections of the Data Model / Stack / Integration docs the agent must read first
- **Creates / Edits** — exact files
- **Do** — precise build instruction
- **Acceptance** — verifiable pass conditions; the task is not done until all pass

**Global rules for every task (from PROTOCOL):**
- Read the referenced doc sections before writing code.
- Requirements (the CSV) override code assumptions. If a conflict appears, follow the requirement and log it.
- Never call `setNodes` or a service from a card/island/stage component — route through the action boundary (`actions/builder.actions.ts`).
- Never compute readiness inside a card — read it from `rules/readiness.rules.ts`.
- `tsc --noEmit` and `bash scripts/verify.sh` must pass before a sprint is committed.
- After each sprint, update `docs/progress-log.md`.

---

## Sprint 0 — Project Shell

**Phase ref:** Phase 0. **Goal:** Project runs with placeholder; structure, docs, scripts in place.

### Task 0.1 — Initialize project
- **Status:** Done.
- **Covers:** none (setup). **References:** STACK A.2–A.3.
- **Creates:** Vite React-TS project, `package.json`, `vite.config.ts`, `tsconfig.json`.
- **Do:** Init Vite React-TS. Install: `react-router-dom`, `@tanstack/react-query`, `zustand`, `motion`, `lucide-react`, `@tailwindcss/vite`, `tailwindcss`, `@google/genai`. Add scripts: `dev`, `build`, `typecheck`, `lint`.
- **Acceptance:** `npm install` succeeds; `npm run dev` serves on port 3000; `npm run typecheck` passes on empty project.

### Task 0.2 — Folder skeleton
- **Status:** Done.
- **Covers:** none. **References:** Development Plan §3 (full structure).
- **Creates:** every folder from §3 with `.gitkeep` in empty ones.
- **Acceptance:** all of `brand/ effects/ types/ rules/ actions/ store/ services/ queries/ utils/ hooks/ ui/ components/ pages/ builder/{stage,cards,dropzones,islands,focus}` exist.

### Task 0.3 — Docs, AGENTS.md, verify script
- **Status:** Done.
- **Covers:** none. **References:** PROTOCOL.
- **Creates:** `AGENTS.md`, `README.md`, `docs/` with the five documents, `docs/progress-log.md`, `scripts/verify.sh`.
- **Do:** `verify.sh` greps for forbidden patterns: `src/types.ts` existing, `'Ready for Review'|'Rejected'|'Placed'`, `useState<any[]>`, `(window as any)`, a card/island importing a service directly.
- **Acceptance:** `bash scripts/verify.sh` passes on the empty project; `AGENTS.md` states the action-boundary and readiness-source rules.

---

## Sprint 1 — Brand, Types, Rules Skeletons, Effects

**Phase ref:** Phase 1. **Goal:** Complete type contract + rule skeletons + effects registry. Verified by `tsc` only — no UI.

### Task 1.1 — Brand system
- **Status:** Done.
- **Covers:** IFX-001 (token foundation). **References:** STACK A.2; v0.1.4 `tokens.ts` (values only).
- **Creates:** `brand/tokens.ts`, `brand/theme.ts`, `brand/index.css`.
- **Do:** Copy token *values* (colors, blur, radius, shadow, spring configs) from v0.1.4 into the new token module. Do not copy structure.
- **Acceptance:** tokens compile; theme resolves light/dark; no hardcoded hex outside `tokens.ts`.

### Task 1.2 — Domain & lifecycle types
- **Status:** Done.
- **Covers:** DM-001, DM-002, DM-003, DM-009, DM-010, DM-011, DM-023, VL-001, VL-017, VL-018, VL-030, AIM-001. **References:** DM §3, §4, §5, §6, §8.
- **Creates:** `types/domain.ts`, `types/lifecycle.ts`.
- **Do:** Implement entities exactly per DM §3 (Task with `specsState`/`missingDataState` as `FieldCompletionState`, no legacy aliases; collaboration + AI-ready optional fields). `TaskDate` discriminated union per DM §4. `VersionStatus` 5 values per DM §6 in `lifecycle.ts`; `api.ts` will import from here.
- **Acceptance:** `tsc` passes; `grep "missingFields\|'Ready for Review'\|'Placed'\|'Rejected'" types/` returns nothing; `VersionStatus` defined only in `lifecycle.ts`.

### Task 1.3 — API & builder-node & card/stage/dropzone types
- **Status:** Done.
- **Covers:** DM-018, DM-019, DM-020, SBC-001, STG-001, DZ-001. **References:** DM §7; Development Plan §3, §4.
- **Creates:** `types/api.ts`, `types/builder-node.types.ts`, `types/card.types.ts`, `types/stage.types.ts`, `types/dropzone.types.ts`, `types/index.ts`.
- **Do:** `api.ts` = wire DTOs, imports `VersionStatus` from `lifecycle.ts`, uses `actions[]` naming (DM-018). `builder-node.types.ts` = `BuilderNode`/`PhaseNode`/`ActionCardData` with `actionCards`. `card.types.ts` = `CardKind`, `CardCapability`, `CardConfig`, `FieldIndicator`. `stage.types.ts` = `ViewKind`, `StageContext`, `StageLayoutContract`. `dropzone.types.ts` = typed `Dropzone` per DZ-001.
- **Acceptance:** `tsc` passes; `api.ts` does not import `domain.ts`; dropzone type has view/target/accepted-types/targetId/position/active/edge/command fields.

### Task 1.4 — Rules skeletons
- **Status:** Done.
- **Covers:** RV-015, RDY-001, VL-026, PR-020, DM-024. **References:** DM §4, §5, §6; REQ Validation/Lifecycle/Permissions.
- **Creates:** `rules/validation.rules.ts`, `rules/readiness.rules.ts`, `rules/lifecycle.rules.ts`, `rules/permissions.rules.ts`, `rules/date.rules.ts` (skeletons with typed signatures + `ALLOWED_TRANSITIONS` constant).
- **Acceptance:** `tsc` passes; `canTransition(from,to)` exists and returns false for illegal transitions per DM §6; readiness functions exist with stub bodies.

### Task 1.5 — Effects registry
- **Status:** Done.
- **Covers:** IFX-001. **References:** Development Plan §4.3; STACK A.2 (Motion).
- **Creates:** `effects/effects.registry.ts`, `effects/useEffect.ts`, `effects/motion.config.ts`, `effects/EffectLayer.tsx`.
- **Do:** Define named effects: dropTargetGlow, invalidDrop, parentGlow, selectedHighlight, newItemHighlight, focusHighlight, expandCollapse, dragFeedback, saveSyncFeedback, lockedFeedback. Motion presets sourced from `brand/tokens.ts`.
- **Acceptance:** `useEffect('selectedHighlight', true)` returns valid motion props; effects reference only brand tokens; no effect contains business logic.

### Task 1.6 — Pure utils
- **Status:** Done.
- **Covers:** BC-017, DM-005, DM-012, DM-015, DM-016, UP-010. **References:** DM §4, §9.
- **Creates:** `utils/id.helpers.ts`, `utils/date.helpers.ts`, `utils/node.helpers.ts`, `utils/preference.helpers.ts`.
- **Do:** `id.helpers` = UUID generator. `date.helpers` = pure math (resolve linked date, derive spans). `node.helpers` = domain↔BuilderNode mappers (DM-020). `preference.helpers` = scoped localStorage keys `userId+dcxId+versionId` (UP-010).
- **Acceptance:** `tsc` passes; `node.helpers` round-trips a phase domain↔node without data loss; `resolvedDate` never written into stored shapes.

**Sprint 1 gate:** Done — `tsc --noEmit` + `verify.sh` pass. No UI yet.

---

## Sprint 2 — Action Boundary, Store, Services, Queries

**Phase ref:** Phase 2. **Goal:** The one mutation path + integration seams (mocked).

### Task 2.1 — Action boundary
- **Status:** Done.
- **Covers:** BC-030, BC-004, BC-005, BC-006, SBC-002, DZ-001. **References:** Development Plan §4.4; DM §2.
- **Creates:** `actions/builder.actions.ts`, `actions/action.guards.ts`, `actions/useBuilderActions.ts`.
- **Do:** Named commands: createPhase, updatePhase, deletePhase, movePhase, createAction, updateAction, deleteAction, moveAction, createTask, updateTask, deleteTask, moveTask, duplicateNode, applyImport. Each runs through `action.guards.ts` (lock/permission). Commands are the ONLY writers of `builderStore` nodes.
- **Acceptance:** `tsc` passes; every command checks guards first; no component yet imports these (boundary established).

### Task 2.2 — Stores
- **Status:** Done.
- **Covers:** DM-020, DM-021, UP-013, UP-014, SC-005. **References:** DM §9; STACK A.2 (Zustand).
- **Creates:** `store/appStore.ts`, `store/builderStore.ts`.
- **Do:** `builderStore` holds `BuilderNode[]` (typed), selection, `isLocked`, `saveStatus`, `saveError`. UI-only state, cleared on unmount (UP-014). No domain truth in store beyond the working node tree.
- **Acceptance:** `grep "any\[\]" store/` returns nothing; store exposes a reset for unmount cleanup.

### Task 2.3 — Services + mappers + api-client
- **Status:** Done.
- **Covers:** SC-001, SC-002, DM-019, DM-018, VL-011, CR-002, INTEG B.2–B.6. **References:** INTEG B; DM §7.
- **Creates:** `services/api-client.ts`, `api-mappers.ts`, `access.service.ts`, `versions.service.ts`, `builder.service.ts`, `clickup.service.ts`, `files.service.ts`, `logs.service.ts`, `error-reporter.service.ts`, `ai.service.ts`.
- **Do:** Mock bodies (localStorage) with `@route` JSDoc per INTEG. `api-mappers` does API↔domain incl. `actions[]`↔`actionCards[]` and strips `resolvedDate`. `versions.service.updateStatus` performs auto-supersede (VL-011) and writes a lifecycle log (CR-002) — mock console for now.
- **Acceptance:** mock `getBuilder→mapper→domain→node.helpers→BuilderNode[]` round-trips; every service fn has `@route`; `updateStatus('…','Approved')` supersedes siblings in mock.

### Task 2.4 — Query layer
- **Status:** Done.
- **Covers:** SC-001, SC-005. **References:** STACK A.2 (TanStack Query).
- **Creates:** `queries/QUERY_KEYS.ts`, `versions.queries.ts`, `builder.queries.ts`, `users.queries.ts`.
- **Acceptance:** query keys centralized; builder query returns typed `BuilderNode[]` via mappers.

**Sprint 2 gate:** Done — `tsc` + `verify.sh` pass; data path proven in a scratch test.

---

## Sprint 3 — Router, Auth, Load Gate

**Phase ref:** Phase 3. **Goal:** Direct builder entry + guarded load.

### Task 3.1 — Router & layout
- **Status:** Done.
- **Covers:** VR-001. **References:** INTEG B.4; STACK A.3.
- **Creates:** `router.tsx`, `main.tsx`, `pages/*` placeholders.
- **Do:** `/builder/:versionId` opens the Builder directly (VR-001), not a Version Room. Home + Version routes under a root layout.
- **Acceptance:** all routes render placeholders; no `useState` page switching anywhere.

### Task 3.2 — Auth + access seam + guard
- **Status:** Done.
- **Covers:** PR-001, PR-002, PR-021, VR-004, PR-003, VR-005. **References:** INTEG B.3; rules/permissions.
- **Creates:** `components/auth/RouteGuard.tsx`, `LoginRedirect.tsx`, `NoAccessScreen.tsx`; wire `access.service.ts`.
- **Do:** Guard reads `getMyAccess()` + `checkDCXAccess()` (mock pass-through). Non-auth → LoginRedirect; no access → NoAccessScreen (PR-021).
- **Acceptance:** unauth mock blocks builder; no-access mock shows NoAccessScreen; guard sits above `BuilderPage`.

### Task 3.3 — Load gate + progressive sequence
- **Status:** Done.
- **Covers:** VR-002, VR-003. **References:** INTEG B.2.
- **Creates:** `builder/BuilderPage.tsx` (gate only), loader.
- **Do:** Builder not usable until data + connection ready (VR-002). Progressive sequence: shell → stage → phases → actions → tasks (VR-003).
- **Acceptance:** loader shows before builder; builder mounts only after query resolves.

**Sprint 3 gate:** Done — routes compile; guard + gate verified with mocks.

---

## Sprint 4 — Stage System

**Phase ref:** Phase 4. **Goal:** One Stage core, view registry, layout contract, smoke render.

### Task 4.1 — Stage core + provider + registry
- **Status:** Done.
- **Covers:** STG-001, STG-002, DM-022. **References:** Development Plan §4.2; DM §2.
- **Creates:** `builder/stage/StageCore.tsx`, `StageProvider.tsx`, `stage.registry.ts`.
- **Do:** Core owns canvas, boundaries, movement, view switching, context preservation (selected task, focus, expanded, position — STG-002). Registry maps `ViewKind`→renderer.
- **Acceptance:** switching views preserves selection + position in a stub; adding a registry entry mounts a new view with no core change.

### Task 4.2 — Layout contract + movement
- **Status:** Done.
- **Covers:** STG-003, STG-004, STG-005. **References:** Development Plan §4.2; Strategic Amends §19.
- **Creates:** `stage/StageLayoutContract.ts`, `useStageMovement.ts`.
- **Do:** Contract declares push/float/filter behavior per surface (STG-003). Movement handles edge-scroll + off-stage dropzones (STG-004) and timeline off-date navigation (STG-005).
- **Acceptance:** contract enumerates Editor=push, popup=float, Focus=filter; drag near edge triggers scroll in a stub.

### Task 4.3 — Smoke render
- **Status:** Done.
- **Covers:** DM-020, DM-022. **References:** DM §7.
- **Creates:** placeholder view renderers + temp `SmokeStage`.
- **Do:** mock → mappers → `BuilderNode[]` → render phase labels on the stage.
- **Acceptance:** `/builder/v-1` shows real phase names from mock; data path confirmed end-to-end.

**Sprint 4 gate:** Done — stage renders mock phases; smoke marked temporary.

---

## Sprint 5 — Card System + Dropzone Engine

**Phase ref:** Phase 5. **Goal:** The shared card system + typed dropzones; templates built fresh.

### Task 5.1 — Card shell + registry + behavior
- **Status:** Done.
- **Covers:** SBC-001, SBC-002, RDY-001. **References:** Development Plan §4.1; DM §3; Strategic Amends §1.
- **Creates:** `builder/cards/CardShell.tsx`, `card.registry.ts`, `useCardBehavior.ts`.
- **Do:** Shell = selection, drag, lock, readiness border, highlight, motion (consumes `effects/`). Registry config per kind: capabilities, movement axis (SBC-002), indicators, `readinessSource`, template. `useCardBehavior` wires a card to its config + `useBuilderActions`. Readiness comes from `rules/readiness.rules.ts` (RDY-001) — never computed in the card.
- **Acceptance:** changing a registry `movement.axis` changes drag behavior with no template edit; shell reads readiness from rules, not local calc.

### Task 5.2 — Field indicator + popup
- **Status:** Done.
- **Covers:** SBC-005, RDY-003, DM-023. **References:** DM §5; Strategic Amends §4.
- **Creates:** `builder/cards/FieldIndicator.tsx`.
- **Do:** Shared chip showing ready/unset/filled/not-needed; click → controlled popup (field name, value, readiness); double-click → edit mode (SBC-005).
- **Acceptance:** task field chips reflect `FieldCompletionState`; popup opens on click, edit on double-click.

### Task 5.3 — Dropzone engine
- **Status:** Done.
- **Covers:** DZ-001, STG-004, STG-005. **References:** Strategic Amends §20; `dropzone.types.ts`.
- **Creates:** `builder/dropzones/dropzone.registry.ts`, `useDropzones.ts`, `DropTarget.tsx`.
- **Do:** View rules generate typed dropzones; `DropTarget` runs an action-boundary command on drop (DZ-001).
- **Acceptance:** dropzones generated from view rules, not hardcoded; drop fires a named command; invalid drop shows `invalidDrop` effect.

### Task 5.4 — Card templates (fresh)
- **Status:** Done.
- **Covers:** SBC-003, SBC-004, SBC-005. **References:** Strategic Amends §2–4; v0.1.4 visual reference.
- **Creates:** `builder/cards/templates/{phase,action,task,day}/…`.
- **Do:** Build templates fresh against v0.1.4 *look*. Phase = density/blocker seed (SBC-003); Action = simple structural (SBC-004); Task = field-status surface (SBC-005); Day = view-derived.
- **Acceptance:** each template renders inside `CardShell`; redesigning a template needs no shell/registry/rules edit.

**Sprint 5 gate:** Done — cards render with shared behavior; templates swappable in isolation.

---

## Sprint 6 — Kanban View + Creation

**Phase ref:** Phase 6. **Goal:** Build the full hierarchy in Kanban via the action boundary.

### Task 6.1 — Kanban renderer
- **Status:** Done.
- **Covers:** BC-001, BC-003, DM-022, STG-004. **References:** Strategic Amends §17.
- **Creates:** `builder/stage/views/KanbanView.tsx`.
- **Acceptance:** phases render horizontally; actions vertical in phase; tasks in actions; default view is Kanban (BC-001).

### Task 6.2 — Kanban Builder Island + drag-to-create
- **Status:** Done.
- **Covers:** KBI-001, BC-004, BC-005, BC-006, BC-012, BC-013. **References:** Strategic Amends §6.
- **Creates:** `builder/islands/KanbanBuilderIsland/…`.
- **Do:** Compact→expanded strip with reserved AI entry. Drag-to-create: phase on board, action on phase, task on action; valid target highlighted; created item highlighted after drop. All creation via action boundary.
- **Acceptance:** create phase/action/task each work and route through named commands; invalid drop blocked; AI entry point present (inert).

**Sprint 6 gate:** full hierarchy buildable in Kanban on mocks.

---

## Sprint 7 — Timeline / Weekly / Monthly

**Phase ref:** Phase 7. **Goal:** Date-driven views + timeline creation.

### Task 7.1 — Timeline renderer + day creation
- **Status:** Done.
- **Covers:** BC-007, BC-008, BC-009, BC-010, DM-005, STG-005. **References:** DM §4; Strategic Amends §18.
- **Creates:** `views/TimelineView.tsx`, day cards.
- **Do:** Timeline = task-creation only (BC-007). Day creation translates day→TaskDate (BC-008); parent selection required (BC-009); minimal task data then complete later (BC-010). Off-date dropzones (STG-005).
- **Acceptance:** create task from a day sets correct linked/fixed date; task always gets an action parent; far-date drag exposes navigation.

### Task 7.2 — Weekly & Monthly derived views
- **Status:** Done.
- **Covers:** DM-005, DM-022, STG-002. **References:** DM §4, §9.
- **Creates:** `views/WeeklyView.tsx`, `MonthlyView.tsx`.
- **Acceptance:** weekly/monthly render purely from task dates; no `days` data created; view switch preserves context.

**Sprint 7 gate:** all four views render from the same node tree.

---

## Sprint 8 — Editor/Viewer Island + Task Config

**Phase ref:** Phase 8. **Goal:** Stage-pushing deep editor.

### Task 8.1 — Editor/Viewer Island
- **Status:** Done.
- **Covers:** EVI-001, BC-011, STG-003. **References:** Strategic Amends §15, §19.
- **Creates:** `builder/islands/EditorViewerIsland/…`.
- **Do:** Pushes/reduces stage (never overlay); stage stays usable; opened object stays selected; not resizable but may hold inner popups. Unsaved-change guard on close/switch/leave (save/discard/cancel).
- **Acceptance:** opening the editor narrows the stage rather than covering it; unsaved guard fires on all exits.

### Task 8.2 — Task configuration + indicators
- **Status:** Done.
- **Covers:** SBC-005, RV-009, RV-010, RV-011, RV-012, DM-023, RDY-003. **References:** DM §5.
- **Edits:** task template + editor sections.
- **Do:** Full task config; specs/missing-data as three-state (`filled|not-needed|empty`); field chips reflect readiness.
- **Acceptance:** a task cannot be "ready" with `empty` specs/missing-data; chips and editor agree (single readiness source).

**Sprint 8 gate:** deep task editing works; stage-push verified.

---

--
 
## Sprint 8.5 — God-File Correction (Code Quality)
 
**Goal:** Split every file over the hard cap. No new features. No visual changes. Only structural improvement. `tsc` must still pass. The app must look identical before and after.
 
**Do not:** add any UI changes, change any behavior, add new components. Only reorganize.
 
---
 
### Task 8.5.1 — Split `EditorViewerIsland.tsx` (635 lines → 6 files)
- **Status:** Done.
 
**Why:** 635 lines. Combines outer shell, unsaved-guard dialog, draft state management, guard logic, readiness display, and three separate editor forms (phase/action/task) in one file.
 
**Creates:**
 
```
builder/islands/EditorViewerIsland/
  EditorViewerIsland.tsx      ← outer shell only: layout, header, footer, empty state (≤150)
  PhaseEditorSection.tsx      ← phase label + icon selector form (≤80)
  ActionEditorSection.tsx     ← action name + description form (≤70)
  TaskEditorSection.tsx       ← task fields: name, channel, sender, receiver, message,
                                 specsState, missingDataState, date config (≤180)
  useEditorDraft.ts           ← draftData useState, updateDraftField, updateDraftNested,
                                 sync useEffect, handleSave, handleDiscard (≤100)
  useEditorGuard.ts           ← pendingAction, handleProceedPending, handleCancelPending (≤60)
```
 
**How to split:**
 
Extract `useEditorDraft.ts` first — pull out `draftData`, `setDraftData`, `updateDraftField`, `updateDraftNestedField`, `handleSave`, `handleDiscard`, and the `useEffect` that syncs draft with `activeNode`. Return them as a hook. Signature:
```typescript
export function useEditorDraft(activeNode: BuilderNode | null, actions: ReturnType<typeof useBuilderActions>) {
  // ...
  return { draftData, updateDraftField, updateDraftNestedField, handleSave, handleDiscard, isDirty };
}
```
 
Extract `useEditorGuard.ts` — pull out `pendingAction`, `handleProceedPending`, `handleCancelPending`. These read from `StageContext` and depend on `useEditorDraft`'s `handleSave`.
 
Extract `PhaseEditorSection.tsx` — the JSX block under `{activeNode.kind === 'phase' && ...}`. Props: `draftData`, `updateDraftField`. Pure presentation.
 
Extract `ActionEditorSection.tsx` — the JSX block under `{activeNode.kind === 'action' && ...}`. Same pattern.
 
Extract `TaskEditorSection.tsx` — the JSX block under `{activeNode.kind === 'task' && ...}`. Props: `draftData`, `updateDraftField`.
 
`EditorViewerIsland.tsx` becomes:
```typescript
// Uses useEditorDraft, useEditorGuard, readinessFeedback memo
// Renders: empty state | (header + section + footer) + guard dialog
// Selects which section to render based on activeNode.kind
// ~140 lines
```
 
**Verify:**
```
□ EditorViewerIsland.tsx ≤ 150 lines
□ TaskEditorSection.tsx ≤ 180 lines
□ All others ≤ 100 lines
□ npm run typecheck — 0 errors
□ Opening and editing a task in the browser: identical behavior to before split
□ Unsaved-changes guard still fires on close/view-switch/select
□ Readiness banner still shows
```
 
---
 
### Task 8.5.2 — Split `builder.actions.ts` (549 lines → 5 files)
- **Status:** Done.
 
**Why:** 549 lines. Contains all phase, action, and task commands, all input interfaces, all helper functions (`renumberPhases`, `renumberActions`, `renumberTasks`, `updatePhaseNode`, `mapActions`), and the full `builderActions` object.
 
**Creates:**
 
```
actions/
  builder.actions.ts      ← barrel re-export + BuilderActions interface (≤50 lines)
  phase.actions.ts        ← CreatePhaseInput, UpdatePhaseInput, MovePhaseInput, 
                             createPhase, updatePhase, deletePhase, movePhase (≤150)
  action.actions.ts       ← CreateActionInput, UpdateActionInput, MoveActionInput,
                             createAction, updateAction, deleteAction, moveAction (≤150)
  task.actions.ts         ← CreateTaskInput, UpdateTaskInput, MoveTaskInput,
                             createTask, updateTask, deleteTask, moveTask (≤150)
  node.actions.ts         ← DuplicateNodeInput, ApplyImportInput,
                             duplicateNode, applyImport (≤80)
  action.helpers.ts       ← renumberPhases, renumberActions, renumberTasks,
                             updatePhaseNode, mapActions (≤80) — internal, not exported
  action.guards.ts        ← unchanged
  useBuilderActions.ts    ← unchanged
```
 
**How to split:**
 
Move all helper functions (`renumberPhases`, etc.) into `action.helpers.ts` first. These are not exported publicly — only the action files import them.
 
Move phase input interfaces + `createPhase`/`updatePhase`/`deletePhase`/`movePhase` into `phase.actions.ts`. Each function calls `getState()`, uses helpers, calls `setState()`. Pattern is identical for all four files.
 
Move action and task commands similarly. `node.actions.ts` gets `duplicateNode` and `applyImport`.
 
`builder.actions.ts` becomes a barrel:
```typescript
export * from './phase.actions';
export * from './action.actions';
export * from './task.actions';
export * from './node.actions';
 
export const builderActions = {
  ...phaseActions,
  ...actionActions,
  ...taskActions,
  ...nodeActions,
};
```
 
`useBuilderActions.ts` imports from `builder.actions.ts` barrel — no change needed.
 
**Verify:**
```
□ builder.actions.ts ≤ 50 lines
□ Each phase/action/task/node file ≤ 150 lines
□ action.helpers.ts ≤ 80 lines
□ npm run typecheck — 0 errors
□ Create phase in Kanban — works
□ Create action — works
□ Create task — works
□ Move action between phases — works
```
 
---
 
### Task 8.5.3 — Split `TimelineView.tsx` (508 lines → 4 files)
- **Status:** Done.
 
**Why:** 508 lines. Contains the grid layout, individual day column rendering, individual task marker rendering, and date calculation helpers mixed in with JSX.
 
**Creates:**
 
```
builder/stage/views/
  TimelineView.tsx         ← grid layout, zone wiring, header row, scroll container (≤150)
  TimelineDayColumn.tsx    ← single day column with its tasks and drop target (≤120)
  timeline.helpers.ts      ← already exists at 157 lines — move any remaining date
                             logic here, verify ≤ 200 lines
```
 
Note: `TaskGridMarker.tsx` and `DayGridCard.tsx` already exist as separate files — do not merge them back.
 
**Verify:**
```
□ TimelineView.tsx ≤ 150 lines
□ TimelineDayColumn.tsx ≤ 120 lines
□ npm run typecheck — 0 errors
□ Timeline view renders task markers correctly
□ Dropping a task on a day still works
```
 
---
 
### Sprint 8.5 gate
 
```bash
npm run typecheck        # 0 errors
npm run dev              # app identical to before split
bash scripts/verify.sh   # no forbidden patterns
```
 
Confirm in the browser: kanban, timeline, weekly, monthly all render. Task editor opens, edits save, guard fires on dirty close. If any behavior changed, the split introduced a bug — fix it before continuing.
 
**Commit:** `sprint-8.5: god-file correction — split EditorViewerIsland, builder.actions, TimelineView`
 
---
 
## Sprint 9-UI — Builder Visual Foundation
 
**Goal:** The builder looks and feels like DCX Manager, not a wireframe. This sprint applies the brand system that already exists in `brand/tokens.ts` and `brand/index.css` to the builder layout, card shells, and island containers. No new features. No architecture changes.
 
**Covers requirements:** SBC-001, SBC-003, SBC-004, SBC-005, IFX-001, STG-003 (visual application)
 
---
 
### Task 9-UI.1 — Builder canvas layout
 
**File:** `src/builder/BuilderPage.tsx`
 
**Problem:** The builder renders as a document-flow page (`<section className="builder-workspace">`). It needs to be a full-viewport canvas with the stage filling the remaining space after the top bar.
 
**Do:**
 
Replace the `builder-workspace` layout with a true canvas layout. Add to `brand/index.css`:
 
```css
.builder-canvas {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100vh;
  overflow: hidden;
  background:
    radial-gradient(ellipse at 20% 0%, rgba(117, 226, 255, 0.07) 0%, transparent 60%),
    radial-gradient(ellipse at 80% 100%, rgba(117, 226, 255, 0.04) 0%, transparent 50%),
    rgb(13, 13, 14);
}
 
.builder-stage-area {
  display: flex;
  overflow: hidden;
  position: relative;
}
 
.builder-stage-main {
  flex: 1;
  min-width: 0;
  overflow: auto;
}
 
.builder-editor-panel {
  flex: 0 0 24rem;
  overflow-y: auto;
  border-left: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(0, 0, 0, 0.3);
  backdrop-filter: blur(24px);
}
```
 
Update `BuilderPage.tsx` to use these classes. `EditorViewerIsland` slides in from the right using the editor panel slot.
 
**Verify:**
```
□ Builder fills 100vh — no page scroll
□ Dark gradient background visible
□ Editor panel is a sidebar that does not overlay the stage
```
 
---
 
### Task 9-UI.2 — Builder top bar (Metadata Island)
 
**File:** `builder/islands/MetadataIsland/MetadataIsland.tsx` (create)
 
**Problem:** The builder has no top bar. v0.1.4 had a rich top bar with version name, status, collaborators, and view toggles. This is required by UP-001, BC-013, UP-020.
 
**Do:**
 
Add to `brand/index.css`:
```css
.metadata-island {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  height: 3.5rem;
  padding: 0 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  background: rgba(13, 13, 14, 0.8);
  backdrop-filter: blur(20px);
  flex-shrink: 0;
}
 
.metadata-version-name {
  font-size: 0.9rem;
  font-weight: 700;
  color: rgb(247, 247, 248);
  letter-spacing: -0.01em;
}
 
.metadata-version-status {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  padding: 0.2rem 0.6rem;
  border-radius: 999px;
  border: 1px solid;
}
 
.metadata-view-tabs {
  display: flex;
  gap: 0.25rem;
  margin-left: auto;
}
```
 
Create `MetadataIsland.tsx`:
```typescript
// Props: versionId, currentView, onViewChange, isLocked
// Shows: version name, status badge, view tabs (Kanban/Timeline/Weekly/Monthly)
// View tabs call onViewChange — this is a pure presentation component
// Status badge color: Draft=gray, In Progress=accent, Ready=amber, Approved=green, Superseded=muted
// ~100 lines
```
 
Mount it in `BuilderPage.tsx` as the first row of `.builder-canvas`.
 
**Verify:**
```
□ Top bar visible with version name and status
□ View tabs switch the stage view
□ Status badge shows the correct color for the mock version status
□ Bar is ≤ 100 lines
```
 
---
 
### Task 9-UI.3 — Glass card surfaces
 
**Files:** `brand/index.css` + card template files
 
**Problem:** Cards render with flat `rgba(255,255,255,0.06)` backgrounds. v0.1.4 had deep glass with backdrop-blur, layered borders, and depth. The tokens are defined — they just have not been applied.
 
**Do:**
 
Update `.card-shell` in `brand/index.css` to use the full glass surface:
```css
.card-shell {
  position: relative;
  display: grid;
  gap: 0.75rem;
  min-width: 0;
  padding: 1rem 1.1rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 1.4rem;
  background: rgba(255, 255, 255, 0.04);
  backdrop-filter: blur(20px);
  -webkit-backdrop-filter: blur(20px);
  box-shadow: 0 4px 24px rgba(0, 0, 0, 0.3), inset 0 1px 0 rgba(255,255,255,0.06);
  transition: border-color 0.15s ease, box-shadow 0.15s ease;
}
 
.card-shell:hover {
  border-color: rgba(255, 255, 255, 0.12);
}
 
.card-shell-selected {
  border-color: rgba(117, 226, 255, 0.5);
  box-shadow: 0 0 0 1px rgba(117, 226, 255, 0.15),
              0 4px 24px rgba(0, 0, 0, 0.35),
              inset 0 1px 0 rgba(255,255,255,0.06);
}
```
 
Update `.kanban-phase-column` to give phase columns a subtle glass background:
```css
.kanban-phase-column {
  display: grid;
  gap: 0.75rem;
  align-content: start;
  padding: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 1.8rem;
  background: rgba(255, 255, 255, 0.025);
  backdrop-filter: blur(8px);
  min-width: 17rem;
  max-width: 22rem;
}
```
 
**Verify:**
```
□ Cards have visible glass depth (blur, layered border, shadow)
□ Selected card has the accent glow
□ Phase columns have subtle container depth
□ Hover state gives feedback
```
 
---
 
### Task 9-UI.4 — Phase card visual identity
 
**File:** `builder/cards/templates/phase/PhaseCard.tsx`
 
**Problem:** Phase card shows icon as a raw string (e.g. "awareness"), has no visual phase identity, and has no visual expansion structure.
 
**Do:**
 
Add phase icon mapping. Create `builder/cards/templates/phase/phase.icons.ts`:
```typescript
// Maps PhaseIconType to a lucide-react icon component
// ~15 lines
export const PHASE_ICONS: Record<PhaseIconType, React.ComponentType<{ size?: number }>> = {
  awareness: Megaphone,
  teaser:    Sparkles,
  launch:    Rocket,
  scale:     TrendingUp,
  maintenance: Wrench,
};
```
 
Update `PhaseCard.tsx` to:
- Show the correct icon in the header with the accent color
- Show phase label in uppercase tracking font (eyebrow style)
- Show action count and task count as pill badges
- Show the density bar (already exists but make it more prominent)
- Add a subtle "PHASE N" label
Add to `brand/index.css`:
```css
.phase-card-header {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}
 
.phase-card-icon {
  color: rgb(117, 226, 255);
  flex-shrink: 0;
}
 
.phase-card-label {
  font-size: 1rem;
  font-weight: 800;
  letter-spacing: -0.01em;
  color: rgb(247, 247, 248);
  text-transform: uppercase;
}
 
.phase-card-badges {
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
}
 
.phase-card-badge {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: rgba(247, 247, 248, 0.6);
}
```
 
**Verify:**
```
□ Phase shows the correct icon (not "awareness" as text)
□ Phase name is visually prominent
□ Action + task count badges visible
□ Card is ≤ 150 lines
```
 
---
 
### Task 9-UI.5 — Task card visual identity + channel icons
 
**Files:** `builder/cards/templates/task/TaskCard.tsx` + `builder/cards/templates/task/channel.icons.ts`
 
**Problem:** Task card shows `channelId` as a raw string. v0.1.4 had styled channel icons (dark pill with icon + channel name) as the primary visual identity of a task.
 
**Do:**
 
Create `builder/cards/templates/task/channel.icons.ts`:
```typescript
// Channel ID → { icon: LucideIcon, label: string, color: string }
// Covers: email, sms, push, social, display, ooh, radio, tv, print, digital
// ~30 lines
```
 
Create `builder/cards/templates/task/ChannelPill.tsx`:
```typescript
// Renders a dark pill with the channel icon + short label
// Props: channelId: string
// Falls back to a generic pill if channelId is not mapped
// ~40 lines
```
 
Update `TaskCard.tsx`:
- Replace raw `{task.channelId || 'Task'}` eyebrow with `<ChannelPill channelId={task.channelId} />`
- Task name prominent, bold
- Message preview muted text, 2-line clamp
- Field indicators (specs, missing data) in a row at the bottom
Add to `brand/index.css`:
```css
.channel-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.2rem 0.55rem 0.2rem 0.4rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.07);
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgb(247, 247, 248);
}
 
.task-card-name {
  font-size: 0.85rem;
  font-weight: 700;
  color: rgb(247, 247, 248);
  line-height: 1.3;
}
 
.task-card-message {
  font-size: 0.78rem;
  color: rgba(247, 247, 248, 0.5);
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```
 
**Verify:**
```
□ Task cards show the channel pill (icon + label), not raw channelId string
□ Task name is prominent
□ Message preview shows truncated to 2 lines
□ Field indicators (Specs, Data) visible at bottom
```
 
---
 
### Task 9-UI.6 — Action card layout
 
**File:** `builder/cards/templates/action/ActionCard.tsx`
 
**Problem:** Action card is a stub with minimal visual structure. It should show name, description, task count, and nested task cards clearly.
 
**Do:**
 
Add to `brand/index.css`:
```css
.action-card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 0.5rem;
}
 
.action-card-name {
  font-size: 0.82rem;
  font-weight: 700;
  color: rgb(247, 247, 248);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
 
.action-card-desc {
  font-size: 0.75rem;
  color: rgba(247, 247, 248, 0.45);
  line-height: 1.4;
  margin: 0;
}
 
.action-task-list {
  display: grid;
  gap: 0.5rem;
  padding-inline-start: 0.5rem;
  border-left: 1px solid rgba(255, 255, 255, 0.07);
}
 
.action-empty-state {
  font-size: 0.75rem;
  color: rgba(247, 247, 248, 0.28);
  text-align: center;
  padding: 0.75rem 0;
  border: 1px dashed rgba(255, 255, 255, 0.07);
  border-radius: 0.75rem;
}
```
 
Update `ActionCard.tsx` to use these classes with nested task cards indented under it.
 
**Verify:**
```
□ Action name prominent, uppercase tracking
□ Tasks indented under the action with a left border
□ Empty state message when no tasks
□ Action card ≤ 150 lines
```
 
---
 
### Sprint 9-UI gate
 
```bash
npm run typecheck        # 0 errors
npm run dev              # builder matches expected visual
bash scripts/verify.sh   # no forbidden patterns
```
 
Visual checklist:
```
□ Builder fills the full viewport with dark gradient background
□ Top bar shows version name, status badge, and view tabs
□ Phase cards show icon + name + count badges + density bar
□ Task cards show channel pill, name, message preview, field indicators
□ Action cards show name + nested tasks with left-border indent
□ Cards have glass depth (blur, layered border, shadow)
□ Selected card shows accent glow
□ No raw channelId strings visible
□ No "awareness"/"launch" text as icon labels
```
 
**Commit:** `sprint-9-ui: builder visual foundation — canvas, top bar, glass cards, channel icons`
 
---
 
## Sprint 10-UI — Islands, Kanban Builder Island, Readiness Indicators
 
**Goal:** The floating islands look like the branded DCX Manager islands. The Kanban Builder Island is properly styled. Readiness indicators appear on cards.
 
---
 
### Task 10-UI.1 — Island shell visual
 
**File:** `brand/index.css` — island CSS classes
 
**Problem:** Islands use `kanban-builder-island` class with functional but un-branded styling. No glass, no pill expansion, no visual hierarchy consistent with v0.1.4.
 
**Do:**
 
Update island CSS in `brand/index.css`:
```css
.island-shell {
  border-radius: 999px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(13, 13, 14, 0.88);
  backdrop-filter: blur(24px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.4),
              inset 0 1px 0 rgba(255, 255, 255, 0.06);
  transition: border-radius 0.25s ease, box-shadow 0.2s ease;
}
 
.island-shell.expanded {
  border-radius: 1.5rem;
}
 
.island-shell:hover {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.5),
              0 0 0 1px rgba(255, 255, 255, 0.04),
              inset 0 1px 0 rgba(255, 255, 255, 0.07);
}
```
 
Update `KanbanBuilderIsland.tsx` to use `.island-shell` class consistently.
 
**Verify:**
```
■ Kanban Builder Island has glass pill appearance
■ Expands smoothly with border-radius transition
■ Builder tool buttons are clearly legible
■ AI entry point is visually distinct (muted) from active tools
```
 
---
 
### Task 10-UI.2 — Readiness indicators on cards
 
**Files:** `builder/cards/templates/phase/PhaseCard.tsx`, `action/ActionCard.tsx`
 
**Problem:** Cards have a `card-shell-ready`/`card-shell-incomplete`/`card-shell-blocked` class applied by `CardShell` but the visual signal is only a colored left border. In v0.1.4, cards had a visible readiness indicator.
 
**Do:**
 
Add readiness badge inside `PhaseCard.tsx` and `ActionCard.tsx`:
```css
.readiness-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.65rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  padding: 0.15rem 0.4rem;
  border-radius: 999px;
}
 
.readiness-badge-ready {
  background: rgba(117, 226, 255, 0.1);
  color: rgb(117, 226, 255);
}
 
.readiness-badge-incomplete {
  background: rgba(248, 196, 88, 0.1);
  color: rgb(248, 196, 88);
}
 
.readiness-badge-blocked {
  background: rgba(255, 100, 100, 0.1);
  color: rgb(255, 100, 100);
}
```
 
Cards already receive `behavior.readiness` from `useCardBehavior` — use it to render the badge.
 
**Verify:**
```
■ Phase cards show readiness badge (ready/incomplete/blocked)
■ Action cards show readiness badge
■ Badge matches the left-border color
■ Readiness still comes from rules/readiness.rules.ts, not computed in card
```
 
---
 
### Task 10-UI.3 — Editor island visual polish
 
**File:** `builder/islands/EditorViewerIsland/EditorViewerIsland.tsx`
 
**Problem:** After the 8.5 split, the outer shell still uses raw Tailwind strings with `bg-neutral-950`, `border-neutral-800`, etc. These should use brand tokens/CSS classes.
 
**Do:**
 
Add to `brand/index.css`:
```css
.editor-island {
  width: 24rem;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  background: rgba(13, 13, 14, 0.92);
  backdrop-filter: blur(24px);
  border-left: 1px solid rgba(255, 255, 255, 0.07);
  overflow: hidden;
  height: 100%;
}
 
.editor-island-header {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-shrink: 0;
}
 
.editor-island-body {
  flex: 1;
  overflow-y: auto;
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}
 
.editor-island-footer {
  padding: 0.875rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  gap: 0.625rem;
  justify-content: flex-end;
  flex-shrink: 0;
}
 
.editor-empty {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 1.5rem;
  text-align: center;
  color: rgba(247, 247, 248, 0.3);
}
```
 
Replace all raw Tailwind color strings in `EditorViewerIsland.tsx` with these CSS classes.
 
**Section files** (`PhaseEditorSection`, `ActionEditorSection`, `TaskEditorSection`) also need their inline Tailwind color utilities replaced with CSS classes or brand-system class names.
 
Add form field CSS:
```css
.editor-field-label {
  display: block;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.07em;
  color: rgba(247, 247, 248, 0.45);
  margin-bottom: 0.4rem;
  font-family: monospace;
}
 
.editor-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 0.6rem;
  padding: 0.5rem 0.75rem;
  font-size: 0.85rem;
  color: rgb(247, 247, 248);
  outline: none;
  transition: border-color 0.15s;
}
 
.editor-input:focus {
  border-color: rgb(117, 226, 255);
}
 
.editor-toggle-group {
  display: grid;
  gap: 0.25rem;
}
 
.editor-toggle-btn {
  padding: 0.35rem;
  font-size: 0.72rem;
  font-weight: 700;
  border-radius: 0.5rem;
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.03);
  color: rgba(247, 247, 248, 0.5);
  cursor: pointer;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  transition: all 0.1s;
}
 
.editor-toggle-btn-active {
  border-color: rgba(117, 226, 255, 0.5);
  background: rgba(117, 226, 255, 0.08);
  color: rgb(117, 226, 255);
}
```
 
**Verify:**
```
■ Editor panel uses brand CSS classes, not raw Tailwind color strings
■ Form inputs are visually consistent with the dark glass theme
■ Three-state toggles (specsState, missingDataState, date mode) styled correctly
■ Save/Discard buttons have proper active/disabled visual states
■ No bg-neutral-*, border-neutral-*, text-neutral-* in editor island files
```
 
---
 
### Sprint 10-UI gate
 
```bash
npm run typecheck        # 0 errors
npm run dev              # visual output matches expected
bash scripts/verify.sh   # no forbidden patterns
```
 
Visual checklist:
```
■ All islands have glass pill/container appearance
■ Kanban Builder Island expands with smooth border-radius transition
■ Phase and action cards show readiness badges
■ Editor island uses brand CSS classes throughout
■ Editor form fields have the dark glass input style
■ Three-state toggles visually distinct (active = accent, inactive = muted)
■ No raw Tailwind color utility strings in island or editor files
■ Builder overall looks consistent with the v0.1.4 visual language
```
 
**Commit:** `sprint-10-ui: island visuals, readiness indicators, editor polish`
 
---
 


## Sprint 11 — Lifecycle + Permissions Enforcement [COMPLETED]

**Phase ref:** Phase 9. **Goal:** Status rules and locks enforced.

### Task 11.1 — Lifecycle rules [COMPLETED]
- **Covers:** VL-003, VL-008, VL-011, VL-012, VL-019–VL-028, VL-031, RV-003, RV-004, RV-016. **References:** DM §6.
- **Edits:** `rules/lifecycle.rules.ts`, `versions.service.ts`, status bar, `components/modals/ApprovalConfirmModal.tsx`.
- **Do:** Auto In-Progress on first phase (VL-003/027). Approval requires communicatedDate (VL-008), confirms (VL-012), auto-supersedes siblings (VL-011). DCX status derived (VL-019–024). Allowed transitions enforced (VL-026); no Ready→In-Progress rollback (VL-028); locked = duplicate to edit (RV-004/016).
- **Acceptance:** first phase flips Draft→In Progress; approve without date is blocked; approve shows modal then supersedes others; illegal transitions rejected.

### Task 11.2 — Permissions enforcement [COMPLETED]
- **Covers:** PR-008, PR-009, PR-010, PR-011, PR-019, PR-020, VL-010, VL-015, VL-025. **References:** INTEG B.3.
- **Edits:** `rules/permissions.rules.ts`, `hooks/usePermissions.ts`, `action.guards.ts`, builder controls.
- **Do:** MVP flat model: any shared user does everything except edit locked versions (PR-008). Locked (Ready/Approved/Superseded) = read-only (VL-010/015/025). UI-state actions are not permission-gated (PR-019). Guards enforce on every command; note that backend must also enforce (PR-020).
- **Acceptance:** locked version disables all mutating controls; action commands refuse on locked; opening/selecting (UI state) still works on locked.

**Sprint 11 gate:** lifecycle + locks behave per DM §6.

---

## Sprint 12 — Validation + Readiness Gate [COMPLETED]

**Phase ref:** Phase 10. **Goal:** Ready gate validates the full tree; draft warnings.

### Task 12.1 — Validation & readiness rules
- **Covers:** RV-001, RV-002, RV-006, RV-007, RV-008, RV-009, RV-010, RV-011, RV-012, RDY-001, RDY-003, DM-004, BC-028, BC-029, VL-006. **References:** DM §5; REQ Validation.
- **Edits:** `rules/validation.rules.ts`, `rules/readiness.rules.ts`.
- **Do:** Save never blocks (RV-002). Ready validates version→phase→action→task (RV-001): no empty phase/action (RV-006/007), task parent required (RV-008), required fields + specs/missing-data resolved (RV-009/010/011/012). Readiness per level from one source (RDY-001).
- **Acceptance:** incomplete tree saves fine; Ready blocked with empty phase/action or unresolved task; readiness identical across card + editor.

### Task 12.2 — Draft warnings + Ready feedback
- **Covers:** RV-013, RV-014. **References:** Strategic Amends §5.
- **Edits:** card badges, validation summary UI.
- **Do:** Draft shows warning states (RV-013); failed Ready shows what blocks + where (RV-014), navigable.
- **Acceptance:** warning badges show in Draft; failed Ready lists blockers and focuses them.

**Sprint 12 gate:** Ready gate enforced; warnings visible.

**Status:** Completed.

---

## Sprint 13 — Save Continuity + Import/Export

**Phase ref:** Phase 11. **Goal:** Autosave, recovery, JSON backup/import.

### Task 13.1 — Save + recovery
- **Covers:** SC-001–SC-013. **References:** INTEG B.2.
- **Edits:** autosave hook, `BuilderHeader`, `preference.helpers.ts`.
- **Do:** Full-tree debounced autosave (SC-002/003); manual save + Ctrl/Cmd+S (SC-004); status UI (SC-005); keep work on failure + retry path (SC-006/007); local cache scoped by user+version (SC-008); close warning when dirty (SC-009). Backend is truth (SC-001).
- **Acceptance:** Ctrl+S saves immediately; failed save keeps work + shows error + retry; dirty close warns; cache restores after simulated disconnect.

**Status:** Done.

**Edits / Creates:**
- `src/hooks/useAutosave.ts` (new)
- `src/store/builderStore.ts` (saveStatus integration — existing)
- `src/builder/BuilderPage.tsx` (wired autosave + Ctrl/Cmd+S shortcut)

### Task 13.2 — Export + import reconciliation
- **Covers:** SC-010, SC-011, BC-014, BC-015, BC-016, BC-018, BC-019, BC-020, BC-021, BC-022, RV-017, RV-018, RV-019. **References:** DM §3; Strategic Amends §10.
- **Creates:** `utils/export.helpers.ts`, `import.helpers.ts`, `components/modals/ImportPreviewModal.tsx`.
- **Do:** JSON export (SC-010). Import = selective reconciliation (BC-016): matched ID updates (BC-018), new ID adds (BC-019), missing ID warns delete (BC-020); grouped preview (BC-021); validate before apply (BC-022); do not copy audit/history (RV-019).
- **Acceptance:** export downloads readable JSON; import preview shows updated/added/deleted groups; apply runs only after confirm + validation.

**Status:** Done.

**Edits / Creates:**
- `src/utils/export.helpers.ts` (new)
- `src/builder/import/import.helpers.ts` (new)
- `src/builder/import/useImport.ts` (new)
- `src/components/modals/ImportPreviewModal.tsx` (new)
- `src/builder/islands/MetadataIsland/MetadataIsland.tsx` (Import + label wiring)
- `src/builder/import/__tests__/import.helpers.test.ts` (new unit smoke test)

**Notes:** Export and full import reconciliation flow implemented in this sprint: parsing, diffing, grouped preview (added/updated/missing), explicit delete confirmation, merge/apply via the action boundary, audit lifecycle log entry on apply (`import_applied`), and a small unit smoke-test for import helpers. Per-item label plumbing and UI improvements were also added. The flow deliberately strips audit/history fields on import (RV-019).

**Sprint 13 gate:** save, recover, export, import all work on mocks.

---

## Sprint 14 — Focus Engine, View Helper, Sticky Popup, File Preview

**Phase ref:** Phase 12. **Goal:** Selection/isolation + cross-view bridge + shared popup shell.

### Task 14.1 — Sticky popup shell
- **Covers:** SPS-001. **References:** Strategic Amends §13.
- **Creates:** `ui/StickyPopupShell.tsx`.
- **Do:** Reusable sticky/resizable/minimizable shell that floats above the stage (never resizes it); branded header; optional saved size/position pref.
- **Acceptance:** shell floats, resizes, minimizes; stage size unaffected.

**Status:** Done. (Created `src/ui/StickyPopupShell.tsx` — lightweight resizable/minimizable shell)

### Task 14.2 — Focus engine + island
- **Covers:** FCS-001, FCS-002. **References:** Strategic Amends §11.
- **Creates:** `builder/focus/focus.engine.ts`, `useFocus.ts`, `builder/islands/FocusIsland/…`.
- **Do:** Focus by week/action/task/task-property: match → select → highlight → expand containers → preserve hierarchy (FCS-001). Isolation hides non-matching (FCS-002) — visual only, never deletes. Works in Kanban + Timeline.
- **Acceptance:** selecting a focus highlights+expands matches; isolation hides others with zero data change; works both views.

**Status:** Done. (Added `src/builder/focus/focus.engine.ts`, extended `useFocus` with `focusByQuery`, FocusIsland wired)

### Task 14.3 — View Helper bridge + file preview
- **Covers:** VHB-001, EFP-001, FI-005, BC-027. **References:** Strategic Amends §12, §14; INTEG B.5.
- **Creates:** `builder/islands/ViewHelperIsland/…`; file preview via StickyPopupShell.
- **Do:** Timeline shows Kanban-style helper (dated tasks disabled; undated draggable to a day); Kanban shows weekly helper (drag changes phase/action, date unchanged) — VHB-001. File preview embeds via iframe with external-open fallback (EFP-001); active file viewing is local state (FI-005/BC-027).
- **Acceptance:** cross-view drag works both directions; file preview embeds or falls back; no file content stored.

**Sprint 14 gate:** focus, bridge, popup shell, preview all functional. (Completed)

---

## Sprint 15 — UI Preferences + Island Config

**Phase ref:** Phase 13. **Goal:** Scoped preferences + island configuration model.

### Task 15.1 — Preferences
- **Covers:** UP-001, UP-002, UP-003, UP-004, UP-009, UP-010, UP-011, UP-012, UP-013, UP-014, UP-019, UP-021, UP-022, DM-021, BC-002. **References:** DM §9; REQ Preferences.
- **Creates:** `hooks/usePreferences.ts`.
- **Do:** Restore last view per user+version (UP-002); new version defaults to Kanban (UP-003); restore safe context only (UP-004/011/022); never restore temp state (UP-012); no backend writes for UI prefs (UP-019); locked version restores layout but not editor (UP-021); cleanup rules (UP-013/014).
- **Acceptance:** reopening a version restores its view; new version = Kanban; stale/invalid restores ignored; no UI-pref network calls.
- **Status:** Done.
  - **Verification:** `src/hooks/usePreferences.ts` added; localStorage-scoped read/write helpers used; defaults to Kanban when absent; does not write network calls.

### Task 15.2 — Island registry
- **Covers:** UP-005, UP-006, UP-007, UP-008, UP-020, BC-013. **References:** Strategic Amends §19; STG-003.
- **Creates:** `builder/islands/island.registry.ts`.
- **Do:** Each island: scope (global/view-specific/view-limited), layout contract, persist rules (UP-005–008); view/island compatibility matrix (UP-020).
- **Acceptance:** view-limited islands appear only in their views; global island state persists across views; matrix drives mounting.
- **Status:** Done.
  - **Verification:** `src/builder/islands/island.registry.ts` added with example entries (`viewHelper`, `selectionIsland`); `islandsForView(view)` helper returns the expected set for a given `ViewKind`.

**Sprint 15 gate:** preferences + island behavior config-driven.

---

## Sprint 16 — Logs, Errors, AI & Template Seeds

**Phase ref:** Phase 14. **Goal:** Audit + error reporting; AI/template seams seeded.

### Task 16.1 — Logs + error reporting
- **Covers:** CR-001–CR-010, VL-029, VR-007, VR-008, VR-009, VR-010. **References:** INTEG B.2; DM §3.9.
- **Edits:** `logs.service.ts`, `error-reporter.service.ts`; `components/BuilderErrorBoundary.tsx`.
- **Do:** Lifecycle-only logs (CR-002), backend-written, manual view (CR-004), no noisy writes (CR-010). Error reporting via lightweight channel (VR-008) with readable payload (VR-009/CR-007) and user-triggered + critical-auto alerts (VR-010); error boundary wraps stage.
- **Acceptance:** status transitions emit one log each (console mock); save failure offers report with readable payload; boundary catches a thrown error without white-screen.
- **Status:** Done.
  - **Verification:** `src/components/BuilderErrorBoundary.tsx` created; `reportsError()` and `writeLifecycleLog()` used to record mock reports and lifecycle log entries; boundary renders a fallback UI and allows manual report + reload.

### Task 16.2 — AI + template seeds
- **Covers:** AIC-001, AIM-001, TPL-001, BC-023, BC-024, BC-025, RV-020, RV-021, CR-009, UP-015, UP-016, UP-017, UP-018, UP-023, SC-014. **References:** Development Plan §4; Strategic Amends §7, §8, §10.
- **Creates:** `builder/islands/AIChatPopup/…` (inert), object template popup (inert), telemetry event-name layer.
- **Do:** AI Chat uses StickyPopupShell; output must route through review/preview/apply (AIC-001) — pipeline stub only. AI metadata fields already exist (AIM-001). Template popup seeded (TPL-001) on the modular import engine. Telemetry seeded, separate from audit (CR-009/UP-018), not sent in MVP (UP-023).
- **Acceptance:** AI popup opens and is clearly inert; no AI path mutates builder directly; template popup shows categories/search/empty states; telemetry layer defines event names without sending.
- **Status:** Done.
  - **Verification (seed + wiring):** `src/builder/islands/AIChatPopup/AIChatPopup.tsx` and `src/builder/islands/TemplatePopup/TemplatePopup.tsx` implement preview→review→apply stubs that call `builderActions.applyImport`; `src/telemetry/event-names.ts` defines telemetry names and `src/telemetry/optin.ts` persists local opt-in under `telemetry.opt_in`. No outbound telemetry or AI network calls are performed.

**Sprint 16 gate:** seeds present and inert; full app works on mocks.

---

## Sprint 17 — Backend Integration

**Phase ref:** Phase 15. **Goal:** Replace mock bodies with real services. **Blocking inputs:** ClickUp API, Supabase schema, AI spec (INTEG B.7).

### Task 17.1 — Supabase data + auth
- **Covers:** SC-001, BC-017, CR-001, PR-001, PR-002, PR-003, PR-020, VR-002, VR-004. **References:** INTEG B.2–B.3; DM §3.
- **Edits:** `api-client.ts`, `versions/builder/access/logs` services.
- **Do:** Swap mock bodies for real Supabase calls; confirm API naming (API-001) + UUID strategy (API-002); wire Google OAuth to RouteGuard; backend enforces locks/permissions (PR-020). Mappers unchanged.
- **Acceptance:** real read/save round-trips through mappers unchanged; OAuth gates the builder; status transition + supersede atomic on backend.

### Task 17.2 — ClickUp + Drive
- **Covers:** VR-001, VR-006, PR-005, FI-002, FI-003, FI-006, EFP-001. **References:** INTEG B.4–B.5.
- **Edits:** `clickup.service.ts`, `files.service.ts`.
- **Do:** Resolve ClickUp link→`/builder/:versionId`; consume project payload (prefilled users VR-006/PR-005, V1 files FI-002). Drive links + preview confirmed against real permissions.
- **Acceptance:** a real ClickUp link opens the correct builder; prefilled protected users present; Drive preview embeds or falls back per permissions.

**Sprint 17 gate:** app runs on real Supabase/ClickUp/Drive; mappers and UI untouched from mock phase.

---

## Coverage Check

Every MVP requirement in `dcx-requirements-master.csv` maps to at least one task above. Seed-now requirements (AIC-001, AIM-001, TPL-001, BC-023/024/025, RV-020/021, SC-014, UP-015/016/017, CR-005/009) are seeded in Sprints 1–2 (types/seams) and 14 (inert surfaces). Future-only requirements (FI-007, PR-016/017/018, BC-024) are reserved by type/seam and explicitly not built.

When in doubt during execution, the order of authority is: **Requirements CSV → Data Model → this breakdown → existing code**.

---

*Sprint & Task Breakdown — DCX Manager v0.2.0 — for AI agent execution*
