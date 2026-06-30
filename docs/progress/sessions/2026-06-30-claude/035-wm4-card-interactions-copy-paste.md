---
log: 035-wm4-card-interactions-copy-paste
session: 2026-06-30-claude
agent: Claude
model: claude-sonnet-4-6
provider: Anthropic
date: 2026-06-30
type: implementation
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: WM-4
---

# 035 — WM-4: Card interactions + card/subtask copy-paste

## Status: ✅ Completed (code + gates)

## WM-3 review written
- `output-review/2026-06-30-claude-WM-3-review.md` — PASS. ActionCard long-press fix verified in code mirrors TaskCard pattern exactly. One open item: real-pointer long-press proof BLOCKED §28 (batched with WM-2/WM-3 Playwright capture queue).

## WM-4 gap analysis
Pre-existing (no gap):
- Single-click select (CardShell + useCardBehavior)
- Double-click expand/collapse (CardShell:101-108)
- Task card anchored popup (TaskReadOnlyPopup)
- Card duplicate via SelectionIsland button + nodeActions.duplicateNode
- Subtask cloning when task duplicated (cloneTask)

Gaps fixed:
- **REQ-KEY-002** (Ctrl+C) ❌ → ✅
- **REQ-KEY-003** (Ctrl+V) ❌ → ✅
- **REQ-KEY-007** (input guard) ❌ → ✅
- **REQ-SBT-COPY-001** (subtask copy/paste) ❌ → ✅

## Implementation
1. `BuilderPage.tsx`: unified keyboard handler; `cardClipboard` ref; Ctrl+C saves `selectedNodeIds`; Ctrl+V calls `duplicateNode` per clipboard ID; `isTypingTarget()` guard skips C/V when inside INPUT/TEXTAREA/contenteditable
2. `subtaskClipboard.ts` (new): module-level singleton clipboard for subtask instances
3. `QuickSubtaskForm.tsx`: per-row checkboxes; "Copy N" button (copies to subtaskClipboard); "Paste N" button (appends cloned subtasks — no overwrite)

## RS-R7 debt
Created 5 TRC links: REQ-KEY-002, REQ-KEY-003, REQ-KEY-007, REQ-SBC-DUP-001 → BuilderWorkspaceContent; REQ-SBT-COPY-001 → QuickSubtaskForm.

## Gates
typecheck ✅ · lint ✅ · test(85) ✅ · architecture(275) ✅ · req:validate ✅ · completion-gate ✅ PASS

## PO Web Check
BLOCKED §28 — real-pointer keyboard proof + subtask paste proof require Playwright/preview server. Batch with WM-2/WM-3 queue.

## Next
WM-5 (focus / selection / keyboard / readiness wiring).
