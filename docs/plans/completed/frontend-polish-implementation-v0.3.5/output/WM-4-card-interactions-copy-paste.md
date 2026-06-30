---
sprint: WM-4
plan: frontend-polish-implementation-v0.3.5
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
status: Status: Completed
version_context: v0.3.5
---

# WM-4 — Card interactions + card/subtask copy-paste

## Requirement Trace
| Field | Value |
|---|---|
| Graph IDs | REQ-SBC-001, REQ-SBC-002, REQ-SBC-DUP-001, REQ-SBT-COPY-001, REQ-KEY-002, REQ-KEY-003, REQ-KEY-007, REQ-EVI-001, REQ-FCS-001, REQ-UP-012 |
| Scope/type | frontend / interaction |
| States before | `delivery: not-assessed` (REQ-SBC-DUP-001, REQ-SBT-COPY-001, REQ-KEY-002, REQ-KEY-003, REQ-KEY-007) |
| States after | `delivery: implemented` — keyboard copy/paste + subtask copy/paste newly implemented; single-click select / double-click expand / card duplicate button pre-existing |

## Gap analysis

| Feature | State before WM-4 | Gap |
|---|---|---|
| Single-click select | ✅ Pre-existing (CardShell + useCardBehavior) | None |
| Double-click expand/collapse independent | ✅ Pre-existing (CardShell:101-108) | None |
| Task card anchored popup | ✅ Pre-existing (TaskReadOnlyPopup) | None |
| Card duplicate (UI button) | ✅ Pre-existing (SelectionIsland + nodeActions.duplicateNode) | None |
| Subtask cloning via task duplicate | ✅ Pre-existing (cloneTask) | None |
| Ctrl+C — copy selection (REQ-KEY-002) | ❌ Missing | **Fixed** |
| Ctrl+V — paste (REQ-KEY-003) | ❌ Missing | **Fixed** |
| Keyboard guard in text inputs (REQ-KEY-007) | ❌ Missing | **Fixed** |
| Subtask copy/paste distinct from card copy (REQ-SBT-COPY-001) | ❌ Missing | **Fixed** |

## Changes made

### `src/builder/BuilderPage.tsx`
- Added `useRef` import; added `cardClipboard = useRef<string[]>([])` and `builderActionsHook = useBuilderActions()` to `BuilderWorkspaceContent`
- Merged the existing Ctrl+S handler into a unified keyboard handler that also handles:
  - **Ctrl/Cmd+C**: copies `selectedNodeIds` to `cardClipboard.current` (REQ-KEY-002)
  - **Ctrl/Cmd+V**: iterates `cardClipboard.current` and calls `builderActionsHook.duplicateNode({ nodeId })` for each; smart target = `duplicateNode` places each node into its original parent (REQ-KEY-003)
  - **`isTypingTarget()` guard**: returns `true` for `INPUT` / `TEXTAREA` / `contenteditable`; C and V shortcuts skip early; S does not (save intentionally works anywhere) (REQ-KEY-007)

### `src/builder/ui/forms/subtask/subtaskClipboard.ts` (new)
- Module-level singleton clipboard for subtask instances
- `copy(subtasks)`, `paste()`, `hasItems()`, `count()` API
- Paste returns fresh copies; new IDs assigned at paste-time in the form (no stale `taskId`)

### `src/builder/ui/forms/subtask/QuickSubtaskForm.tsx`
- Added per-row `<input type="checkbox">` for subtask selection (REQ-SBT-COPY-001)
- Selected rows get a `border-sky-500/30` highlight
- **"Copy N" button** (sky, top-right of header): appears when ≥1 subtask selected; calls `subtaskClipboard.copy(selected)` — copies label, estimatedMinutes, definitionId, specs, and field values verbatim; no generation re-run
- **"Paste N" button** (emerald, top-right of header): appears when clipboard has items; calls `subtaskClipboard.paste()` and **appends** cloned subtasks with new IDs — satisfies no-blind-overwrite constraint; existing subtasks preserved
- Clipboard persistence: module-level, survives task switching within the session — a user can copy subtasks from Task A, open Task B, and paste them there

## RS-R7 TRC links created
- `TRC-WM4-REQ-KEY-002-TO-MAN-...-builderworkspacecontent` (confirmed, complete)
- `TRC-WM4-REQ-KEY-003-TO-MAN-...-builderworkspacecontent` (confirmed, complete)
- `TRC-WM4-REQ-KEY-007-TO-MAN-...-builderworkspacecontent` (confirmed, complete)
- `TRC-WM4-REQ-SBC-DUP-001-TO-MAN-...-builderworkspacecontent` (confirmed, partial — keyboard path; UI button path pre-existing via SelectionIsland TRCs)
- `TRC-WM4-REQ-SBT-COPY-001-TO-MAN-...-quicksubtaskform` (confirmed, complete)

## Requirement Debt Burn-down
Touched: REQ-SBC-DUP-001, REQ-SBT-COPY-001, REQ-KEY-002, REQ-KEY-003, REQ-KEY-007

| Metric | Before | After |
|---|---|---|
| Unlinked changed-scope manifestations | 0 | 0 |
| Candidate links needing confirmation (changed scope) | 1 (pre-existing, not in WM-4 scope) | 1 (unchanged) |

## Gates
- `npm run typecheck` ✅
- `npm run lint` ✅ (0 warnings)
- `npm run validate:architecture` ✅ (275 modules, 0 violations)
- `npm run test` ✅ (85 tests passed, 12 files)
- `npm run req:validate` ✅ (pass: true, 0 errors)
- `npm run req:completion-gate -- --changed BuilderPage.tsx QuickSubtaskForm.tsx subtaskClipboard.ts` ✅ (PASS, 0 unlinked in changed scope)

## PO Web Check — BLOCKED §28 (no Playwright-reachable dev server this session)
Route `/builder`; open a Task in editor → subtasks tab; check per-row checkboxes, copy, open another task, paste → subtasks appended not overwritten. Select a card on stage → Ctrl+C → Ctrl+V → expect duplicate appears. While typing in a card name input → Ctrl+C → expect no selection change (guard active).
Evidence path: `output/evidence/WM-4-card-copy/` — batch with WM-2/WM-3 real-pointer verification.

## Files touched
- `src/builder/BuilderPage.tsx`
- `src/builder/ui/forms/subtask/QuickSubtaskForm.tsx`
- `src/builder/ui/forms/subtask/subtaskClipboard.ts` (new)
- 5 × TRC JSON files (new trace links)
