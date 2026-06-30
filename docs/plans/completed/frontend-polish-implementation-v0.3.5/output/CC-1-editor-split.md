---
sprint: CC-1
title: Editor State Hard-Cap Split
status: Completed
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
---

# CC-1 — Editor State Hard-Cap Split

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-EVI-001, REQ-UP-011, REQ-UP-012 |
| Scope/type | frontend / refactoring (file-size governance) |
| States | governance `approved` · maturity `logic-defined` · delivery `not-assessed` → `implemented` |
| Source/lock | FP-R5-synthesis §CC-1; §6 hard cap (custom hook ≤ 200 lines) |
| Expected EMC | EMC-EVI-SEED, EMC-UP-SEED, EMC-GOV-TRACE-TESTQA |
| Gate result | ✅ PASS |

## What was done

`useEditorState.ts` was 375 lines — 175 lines over the §6 hard cap (200 lines for custom hooks). Split into 4 sub-modules, all within `EditorViewerIsland/`, keeping the public `useEditorState()` facade unchanged.

### Files created

| File | Lines | Contents |
|---|---|---|
| `editor-node.helpers.ts` | 76 | `DayNode`, `EditorNode` types; `createDayNode`, `findEditorNode`, `getInitialDraft` pure functions |
| `useDraftReducer.ts` | 21 | `DraftState`, `DraftAction` types; `draftReducer` reducer function |
| `useEditorDragHandlers.ts` | 46 | `useEditorDragHandlers` hook — `isDragActive` state + `handleDragOver/Leave/Drop` |
| `useEditorSessionManager.ts` | 63 | `useEditorSessionManager` hook — `sessionToDiscard` state + `closeSession/confirmDiscardSession/cancelDiscardSession` |

### Files modified

| File | Before | After | Notes |
|---|---|---|---|
| `useEditorState.ts` | 375 lines | 168 lines | Imports from sub-modules; public API unchanged; re-exports `DayNode`/`EditorNode` |
| `useEditorReadiness.ts` | imports `EditorNode` from `./useEditorState` | imports from `./editor-node.helpers` | Direct import to avoid circular dependency |

### Decisions
- Public `useEditorState()` return shape is identical; `EditorViewerIsland.tsx` required zero changes.
- `DayNode` and `EditorNode` are re-exported from `useEditorState.ts` via `export type { ... } from './editor-node.helpers'` to preserve the existing public surface; `useEditorReadiness.ts` updated to import directly from `editor-node.helpers.ts`.
- No behavior changes; no hook names revived.

## Gates

| Gate | Result |
|---|---|
| `npm run typecheck` | ✅ PASS |
| `npm run lint` | ✅ PASS |
| `npm run test` | ✅ PASS (82 tests) |
| `npm run validate:architecture` | ✅ PASS (271 modules, 0 violations) |
| `npm run req:validate` | ✅ PASS (QST-VR-011 pre-existing) |
| `npm run req:completion-gate --changed` | ✅ PASS |
| Browser smoke (Playwright) | ✅ builder loads, no JS errors, phase selection intact |

No targeted unit test exists for useEditorState (confirmed via code-query — no `__tests__` file in EditorViewerIsland).

## Browser evidence

Route `/builder/v-1` — Playwright MCP at 1440×900 equivalent:
- Builder loads (HTTP 200) ✅
- No JS errors (only pre-existing favicon.ico 404) ✅
- Phase card click → SelectionIsland "1 phase selected PRESENT" ✅
- Stage layout intact (Kanban view, 2 phases visible) ✅

Screenshot: `output/evidence/CC-1-editor-split/builder-1440-editor-split.png`

## Requirement Debt Burn-down

- Files over hard cap: 1 → 0 ✅
- New MAN nodes created: 4 (`editor-node-helpers`, `usedraftreducer`, `useeditordraghandlers`, `useeditorsessionmanager`)
- TRC links created: 5 (REQ-EVI-001 → all 5 MAN nodes in the EditorViewerIsland area)
- Manifestations lacking requirements (changed scope): 5 → 0 ✅
- `req:completion-gate --changed`: ✅ PASS
- `req:validate`: ✅ PASS (QST-VR-011 pre-existing)
