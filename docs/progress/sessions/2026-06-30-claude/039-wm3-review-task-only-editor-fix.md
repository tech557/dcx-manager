---
log: 039-wm3-review-task-only-editor-fix
session: 2026-06-30-claude
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: mixed
PO-Action: pending
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: WM-3
---

# 039 — WM-3 review + task-only editor fix

`mixed`: (a) review of WM-3 output [[034-wm3-editor-open-paths]], (b) user-request-code —
make the EditorViewerIsland strictly task-only and clear the resulting WM-3 debt.

## A. WM-3 review (audit-review)

| Claim in WM-3 output | Verdict |
|---|---|
| E02 added: `ActionCard.onLongPress → setFocusedNodeId(action.id)` | Code present & matched TaskCard pattern — **but design-wrong (see B)** |
| Wiring opens editor for actions (`useEditorState` focus effect) | Confirmed — actions resolve via `findEditorNode` → editor opens |
| Gates typecheck/lint/test(85)/arch(274)/req:* PASS | Re-ran: typecheck ✅ lint ✅ test 85 ✅ arch 275 ✅ |
| PO Web Check BLOCKED §28 (no real-pointer proof) | Confirmed — never validated in a browser |

**Review finding:** WM-3's E02 was implemented per FP-R5 spec ("long-press Task/**Action** opens
editor") but was never browser-verified. PO has since narrowed the design: **the editor island is
task-only in this version.** E02 therefore shipped a real regression.

## B. Bug reproduced (PO report)

Route `/builder`, real 400ms long-press (Preview MCP synthetic pointer + screenshot):

- Long-press a **Task** opened the **ACTION editor** (`editor-expanded-<actionId>`, titled "ACTION
  EDITOR / New action") — screenshot-confirmed.
- Long-press the **Phase** region likewise opened an action editor.

**Root cause:** Task cards are nested inside Action cards. WM-3's `ActionCard.onLongPress` starts a
long-press timer for *any* pointer-down within the action's bounds (event bubbling). The action's
`setFocusedNodeId` won the race, so the user could never reach a Task's editor / subtasks — this is
the "error when clicking a task, couldn't confirm subtasks DnD" report. `useStageContext must be used
inside StageProvider` console errors seen mid-session were HMR churn (zero on clean reload).

## C. Fix — task-only editor (PO chose "Task-only, full")

| File | Change |
|---|---|
| `src/builder/cards/templates/action/ActionCard.tsx` | Removed `onLongPress` (revert WM-3 E02) |
| `src/builder/cards/templates/action/useActionCard.ts` | Removed now-unused `setFocusedNodeId` plumbing |
| `src/builder/islands/EditorViewerIsland/useEditorState.ts` | `selectedEditableNodeId` → task-only (was phase/action/task); `setIsEditorOpen` gated to `kind==='task'` |
| `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` | `isExpanded` gated to `kind==='task'`; editor body simplified to TaskEditor only (dead phase/action branches + imports removed) |

Phase cards had no `onLongPress` (already correct); Day click sets `day:` focus but is excluded from
editor expansion (unchanged — it drives day-grid selection, not the editor). `PhaseEditorSection` /
`ActionEditorSection` components remain in the repo, just no longer branched to, for a future version.

## Gates
typecheck ✅ · lint ✅ (0 warn) · test 85 ✅ · validate:architecture ✅ (275 modules, 0 violations)

## PO Web Check — BLOCKED (manual confirmation pending)
Automated 400ms long-press is flaky in this mock-seed app (random seed per load; Preview synthetic
pointer + Playwright mouse-hold did not reliably land the timer — a plain click *does* register, so
handlers are live). One positive run after the fix opened `editor-expanded-task-1` (correct task
editor, action no longer hijacked). **PO to confirm manually:** long-press a Task → task editor opens;
long-press an Action/Phase → nothing opens.

## Carry-forward / debt
- WM-3 carry-forward in plan README should be annotated: **E02 (action long-press) reverted** — editor
  is task-only this version. Supersedes [[034-wm3-editor-open-paths]].
- TRC `TRC-WM3-REQ-EVI-001-TO-MAN-...-actioncard` (action long-press → editor) is now stale; review on
  next req pass.

## Next
PO manual long-press verification → then unblock WM-5.
