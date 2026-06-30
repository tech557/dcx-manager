---
log: 036-wm5-focus-selection-keyboard-readiness
session: 2026-06-30-claude
agent: Claude
model: claude-sonnet-4-6
provider: Anthropic
date: 2026-06-30
type: implementation
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: WM-5
---

# 036 — WM-5: Focus / selection / keyboard / readiness wiring

## Status: ✅ Completed (code + gates)

## WM-4 review written + minor debts resolved
- `output-review/2026-06-30-claude-WM-4-review.md` written — PASS with PO revert noted.
- WM-3 E02 debt resolved: `TRC-WM3-REQ-EVI-001-TO-MAN-...-actioncard` retracted; WM-3 output corrected.
- PO confirmed: editor is task-only; ActionCard `onLongPress` removed.

## WM-5 gap analysis
Pre-existing (no gaps): REQ-FCS-001/002 (FocusIsland filtering + isolation), REQ-RDY-001/003 (readiness rules), REQ-KEY-002/003/006/007 (done in WM-4 or pre-existing).

Gaps fixed:
- **REQ-PRESENT-001 (BUG FIX)**: `enterPresentationMode` expanded ancestors, collapsing subtree → fixed to expand descendants (phase→actions+tasks, action→tasks)
- **REQ-KEY-001** (Ctrl+A select all) ❌ → ✅
- **REQ-KEY-004** (Delete/Backspace delete selected) ❌ → ✅
- **REQ-KEY-005** (Escape deselect) ❌ → ✅
- **REQ-SBC-DES-001** (empty-stage click deselect) ❌ → ✅

## Implementation
1. `StageProvider.tsx`: `enterPresentationMode` — descendant walk instead of ancestor walk; `findParentId` import removed (unused after fix)
2. `BuilderPage.tsx`: Ctrl+A, Delete/Backspace, Escape added to unified keyboard handler; `setSelectedNodeIds` + `resolveNodeKind` added
3. `StageCore.tsx`: `handleStageBackdropClick` on `<section>` — `e.target === e.currentTarget` guard → deselect

## RS-R7 debt
Created 5 TRC links: REQ-PRESENT-001 → StageProvider; REQ-KEY-001/004/005 → BuilderWorkspaceContent; REQ-SBC-DES-001 → StageCore.

## Gates
typecheck ✅ · lint ✅ · test(85) ✅ · architecture(275) ✅ · req:validate ✅ · completion-gate ✅ PASS

## PO Web Check
BLOCKED §28 — real-pointer proof (present drill-in expansion, keyboard shortcuts, backdrop click) requires Playwright/preview server. Batch with accumulating WM-2/3/4/5 Playwright queue.

## Next
WM-6 (stage views / Kanban / Timeline / ViewHelper + day-card create + scroll).
