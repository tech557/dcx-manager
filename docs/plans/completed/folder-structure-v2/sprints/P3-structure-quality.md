---
sprint: P3-structure-quality
plan: folder-structure-v2
version_context: v0.3.4
status: completed
executor: Codex
depends-on: P2-component-consolidation
inputs:
  - docs/plans/completed/frontend-discovery-v2/output/FE2-R1-architecture.md
  - docs/plans/completed/frontend-discovery-v2/output/FE2-R2-state-hooks.md
  - docs/plans/completed/frontend-discovery-v2/output/FE2-R3-refactorability.md
output: docs/plans/active/folder-structure-v2/output/P3-structure-quality.md
---

# P3 — Structure + Code Quality

> **Execution method — incremental task logs.** Starting 2026-06-27, P3 follows the same recoverable
> workflow used for P2: after each completed task, Codex updates this sprint file and
> `output/P3-structure-quality.md`, writes a dedicated progress log, verifies that log's claims, and
> only then moves to the next task. Any browser/MCP-only check that cannot be completed by Codex is
> left explicitly for opencode in the final task log.

## Task Progress

| Task | Scope | Status | Log |
|---|---|---|---|
| Task 0 | Session environment, P2 output audit read, carry-forward contract, methodology setup | Completed | `docs/progress/sessions/2026-06-27-codex/24-P3-task0-session-methodology.md` |
| Task 1 | Step 1 merge EditorViewer hooks into `useEditorState` | Completed | `docs/progress/sessions/2026-06-27-codex/25-P3-task1-editor-hook-merge.md` |
| Task 2 | Step 2 delete unused hooks | Completed | `docs/progress/sessions/2026-06-27-codex/26-P3-task2-unused-hooks.md` |
| Task 3 | Step 3 fix stale-closure bugs | Completed | `docs/progress/sessions/2026-06-27-codex/27-P3-task3-stale-closures.md` |
| Task 4 | Step 4 remove `as any` casts from EditorViewerIsland cluster | Completed | `docs/progress/sessions/2026-06-27-codex/28-P3-task4-editor-any-cleanup.md` |
| Task 5 | Step 5 drag state extraction or documented skip | Completed | `docs/progress/sessions/2026-06-27-codex/29-P3-task5-drag-state.md` |
| Task 6 | Step 6 full gates + output + opencode handoff summary | Completed with documented debt | `docs/progress/sessions/2026-06-27-codex/30-P3-task6-full-gates.md` |
| Task 7 | Carry-forward update + sprint close decision | Completed with opencode handoff | `docs/progress/sessions/2026-06-27-codex/31-P3-task7-carry-forward.md` |

## Goal

Resolve the 2 over-cap hook files by merging 3 EditorViewer hooks into one.
Delete 4 unused hooks. Fix the 3 stale-closure lint violations (not lint noise — real bugs).
Extract drag state from StageProvider into a separate context (was planned in P1, not done).
Reduce no-explicit-any violations in EditorViewerIsland from 17 to 0.

---

## Read before starting

```
docs/plans/completed/frontend-discovery-v2/output/FE2-R1-architecture.md  ← over-cap files
docs/plans/completed/frontend-discovery-v2/output/FE2-R2-state-hooks.md  ← hook inventory, lint violations
docs/plans/completed/frontend-discovery-v2/output/FE2-R3-refactorability.md  ← extraction priority order
```

The 3 stale-closure bugs from FE2-R2 (not just lint noise):
- `useDayGridDrag.ts:114` — exhaustive-deps, missing: `getTasksForWeek`, `getTasksWithVal`
- `DayTaskCreator.tsx:63` — exhaustive-deps, missing: `getTasksForWeek`, `getTasksWithVal`
- `StageCore.tsx:14` — exhaustive-deps with "unknown function dependencies" (severe)

These three can cause incorrect behavior at runtime, not just lint warnings.

---

## Steps

### Step 0 — Session environment

```bash
bash scripts/agent/build-current-state.sh
bash scripts/agent/verify-tooling-state.sh
```

Record both outputs verbatim in `output/P3-structure-quality.md` under a `## Session Environment`
section. Confirm `version_context` (`v0.3.4`) matches `docs/VERSION.md` `current`; if mismatched,
stop and ask the PO. Confirm P2 output exists (this sprint assumes dead components were removed) —
if `output/P2-component-consolidation.md` is missing, stop.

**Carry-forward contract (MANDATORY — read before any edit).** Read the README
`## Carry-forward contract — current structural state` section **and** the P1+P2 `output/*.md`, and
obey the **REUSE-don't-RECREATE** rule. For P3 specifically: reuse existing hooks/contexts (e.g.
`useDragState.ts` already exists — check before extracting); merge into the existing `useEditorState`
target rather than spawning parallel files; if any CSS is touched it lives in `src/brand/styles/*`
with `--theme-*` tokens (no literals, no new CSS file); typography is `text-dcx-*`. At sprint end,
update the README carry-forward block with what P3 changed.

**Structure/shell guard (P1-P2-final-audit, 2026-06-27):**
- **Preserve the component + shell structure.** Do not move/merge the shells (`CardShell`,
  `CardShellContent`, `BuilderIslandShell`, `PopoverShell`, `StickyPopupShell`) or the atom homes
  (`src/ui/atoms`, `src/ui/forms`, `src/ui/surfaces`). P3 is hooks/quality only — **no component or
  folder restructuring.**
- **`src/ui/shadcn/button.tsx` + `src/stories/*` are pre-P5 scaffolding, NOT dead code** — do **not**
  delete them in the "unused hooks/dead code" passes.
- **Ignore `docs/product/decisions/src-structure-decision.md`** for any move — it is ⚠️ STALE
  (describes a `src/components/` that no longer exists). Use the README carry-forward facts as truth.

---

### Step 1 — Merge EditorViewer hooks into useEditorState

Current state: 3 single-owner hooks in `src/builder/islands/EditorViewerIsland/`:
- `useEditorPanel.ts` — 249 lines (over cap)
- `useEditorDraft.ts` — 215 lines (over cap)
- `useEditorGuard.ts` — unknown lines (single-owner)

All 3 are imported ONLY by `EditorViewerIsland.tsx`. Merge them into `useEditorState.ts`.

Steps:
1. Read all 3 hook files to understand their APIs
2. Create `src/builder/islands/EditorViewerIsland/useEditorState.ts`
   - Combine all exports into a single hook that returns the merged API
   - Keep each logical section commented with its origin (panel / draft / guard) during migration
3. Update `EditorViewerIsland.tsx` to import from `useEditorState` instead of the 3 separate files
4. Delete `useEditorPanel.ts`, `useEditorDraft.ts`, `useEditorGuard.ts`

If the merged file would exceed 400 lines: split into `useEditorState.ts` (public API) and
`useEditorStateInternal.ts` (implementation details). Keep the public hook under 200 lines.

```bash
npm run typecheck
npm run lint
npm run test
wc -l src/builder/islands/EditorViewerIsland/useEditorState.ts
# Should be ≤ 400 (if single file) or ≤ 200 (public API file)
```

Acceptance: `useEditorPanel.ts`, `useEditorDraft.ts`, `useEditorGuard.ts` deleted.
`EditorViewerIsland.tsx` imports from `useEditorState`. Gates pass.

---

### Step 2 — Delete unused hooks

FE2-R2 confirmed these 4 hooks have 0 consumers:
- `src/hooks/usePreferences.ts`
- `src/hooks/usePermissions.ts`
- `src/builder/focus/useFocus.ts`
- `src/queries/users.queries.ts` (hook-like, 0 callers)

Verify before deleting:
```bash
grep -rn "usePreferences\|usePermissions\|useFocus\b" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules"
grep -rn "users\.queries\|users_queries" src/ --include="*.tsx" --include="*.ts" | grep -v "node_modules"
```

If any results appear outside the definition file itself: do not delete that file, document the usage.
If confirmed 0 external consumers: delete the file.

Also check if `src/builder/focus/focus.engine.ts` has any consumers — if `useFocus.ts` was its only
caller and it also has 0 other consumers, delete it too.

```bash
npm run typecheck
npm run build 2>&1 | grep -i error | head -10
npm run test
```

Acceptance: 4 dead hook files deleted. Gates pass.

---

### Step 3 — Fix 3 stale-closure bugs (exhaustive-deps violations)

These are real bugs, not lint cosmetics:

**Bug 1: `useDayGridDrag.ts:114`**
Missing deps: `getTasksForWeek`, `getTasksWithVal`

```bash
# Read the file to understand the useEffect
cat src/builder/stage/views/useDayGridDrag.ts | sed -n '100,130p'
```
Fix: add `getTasksForWeek` and `getTasksWithVal` to the dependency array.
If they change on every render (unstable reference), wrap them with `useCallback` at their definition site.

**Bug 2: `DayTaskCreator.tsx:63`**
Missing deps: `getTasksForWeek`, `getTasksWithVal`

Same issue, same fix. Check if the same functions are used here — likely the same source.

**Bug 3: `StageCore.tsx:14`**
"Unknown function dependencies" — ESLint cannot track the dep because it's a function reference
passed via context or prop without stable identity.

```bash
cat src/builder/stage/StageCore.tsx | head -40
```
Fix: identify the function ref, wrap with `useCallback` or `useRef` at its origin to give it stable identity.

After each fix:
```bash
npm run lint 2>&1 | grep "exhaustive-deps" | grep -E "useDayGridDrag|DayTaskCreator|StageCore"
# Should return 0 lines for the fixed files
npm run typecheck
npm run test
```

Acceptance: 0 exhaustive-deps violations in the 3 fixed files. No test regressions.

---

### Step 4 — Remove as any casts from EditorViewerIsland

FE2-R1/BE2-R1 found 17 `as any` violations in EditorViewerIsland:
- `EditorViewerIsland.tsx`: 4 casts (lines 62, 143, 143, 174) on `draftData`
- `useEditorDraft.ts`: 3 casts (lines 48, 66, 83) on `draftData`
- `useEditorPanel.ts`: 3 casts (lines 37, 55, 72)
- `useEditorReadiness.ts`: 4 casts (lines 15, 24, 31, 31)
- `UnsavedChangesModal.tsx`: 1 cast (line 5)

Note: `useEditorDraft.ts` and `useEditorPanel.ts` will be merged into `useEditorState.ts` (Step 1).
Fix the casts in the merged file, not the originals.

`draftData` is typed as `EditorDraftData | null` in the store (BE2-R1 confirmed).
The `as any` casts are workarounds for accessing properties on `draftData` — replace them with
proper null checks and type narrowing:

```typescript
// Before
const name = (draftData as any).name;

// After
const name = draftData?.name ?? '';
```

For cases where `EditorDraftData` is missing a field that's accessed via `as any`:
add the field to the `EditorDraftData` type definition rather than keeping the cast.

```bash
npm run lint 2>&1 | grep "no-explicit-any" | grep -E "EditorViewerIsland|useEditorState|useEditorReadiness|UnsavedChanges"
# Should return 0 lines
npm run typecheck
```

Acceptance: 0 `as any` casts in EditorViewerIsland cluster. `no-explicit-any` count reduced by ≥17.

---

### Step 5 — Extract drag state from StageProvider

FE2-R2 reported: `StageProvider.tsx` has 14 useState + 18 exports. Drag state was planned for
extraction in P1 but not executed.

```bash
wc -l src/builder/stage/StageProvider.tsx
grep -n "drag\|Drag" src/builder/stage/StageProvider.tsx | head -30
cat src/builder/stage/useDragState.ts
```

`useDragState.ts` already exists — check if it's a standalone hook or integrated into StageProvider.

If drag state is still inside StageProvider:
1. Create `src/builder/stage/DragContext.tsx` that wraps `useDragState` and provides its values
2. Move drag-related state from `StageProvider` into `DragContext`
3. Wrap `<StageProvider>` children with `<DragContext>` in `BuilderPage.tsx` or wherever StageProvider renders
4. Update all drag-state consumers to read from `DragContext` instead of `StageContext`

If `useDragState.ts` is already extracted and StageProvider only calls it:
document that drag state is already decoupled and skip this step.

Constraint: do not break the 24 context-coupled components listed in FE2-R3. They must continue
to compile and render correctly. If extraction would break any of them, document the risk and skip.

```bash
npm run typecheck
npm run validate:architecture
npm run test
```

Acceptance: `StageProvider.tsx` useState count reduced by ≥4 (the drag state vars). OR step is
documented as already done/blocked with clear reason.

---

### Step 6 — Full gate check + output

```bash
npm run typecheck
npm run lint
npm run validate:architecture
npm run test
```

Browser verify (executable):
```bash
npm run dev   # serves http://localhost:3000 (per vite.config.ts)
```
Using Playwright (`baseURL: http://localhost:3000`) or the `chrome-devtools` MCP, capture console
output and a screenshot for each check (a console error fails the gate):
- Builder opens and stage renders
- Drag-and-drop works (if drag state was extracted) — exercise a drag and confirm task position updates
- Editor panel opens without errors (this is the merged `useEditorState` path — verify it still drives the panel)
- Kanban, timeline, week views load
- Record the console-error count (target: 0 — list any errors) and attach a stage screenshot

Write output to `docs/plans/active/folder-structure-v2/output/P3-structure-quality.md`:

```markdown
# P3 — Structure + Code Quality Output
Date: {date} | Agent: {agent}

## Session Environment
{build-current-state.sh + verify-tooling-state.sh output}

## Hook merge result
useEditorState.ts: N lines | merged from: useEditorPanel, useEditorDraft, useEditorGuard

## Deleted hooks
{list 4 deleted hooks}

## Stale closure fixes
{list 3 fixes with the solution applied}

## any violation reduction
Before: 63 total | After: N total | EditorViewerIsland cluster: 0

## Drag state extraction
{done / skipped — with reason}

## Gate results
{typecheck/lint/arch/test/browser}
```

---

## Acceptance criteria

- [ ] `## Session Environment` recorded from both agent scripts in the output
- [ ] `useEditorPanel.ts`, `useEditorDraft.ts`, `useEditorGuard.ts` deleted
- [ ] `useEditorState.ts` exists, ≤ 400 lines
- [ ] 4 unused hooks deleted (usePreferences, usePermissions, useFocus, users.queries)
- [ ] 0 exhaustive-deps violations in useDayGridDrag, DayTaskCreator, StageCore
- [ ] 0 `as any` casts in EditorViewerIsland cluster
- [ ] Total `no-explicit-any` violations reduced from 63 baseline
- [ ] **Component/shell structure preserved** — shells (`CardShell*`, `BuilderIslandShell`, `PopoverShell`, `StickyPopupShell`) and atom homes unchanged; `src/ui/shadcn/*` + `src/stories/*` left intact (pre-P5, not dead); no folder moves
- [ ] All gates pass
- [ ] Browser: dev server on port 3000, console-error count 0, drag exercised, stage screenshot attached — **or** screenshot gate `BLOCKED — Playwright unavailable` + dev-smoke fallback (core.md §28)
- [ ] No drag/stage regressions in browser
- [ ] **Step 0 + final step:** carry-forward read at start, README carry-forward updated at end (core.md §27)
