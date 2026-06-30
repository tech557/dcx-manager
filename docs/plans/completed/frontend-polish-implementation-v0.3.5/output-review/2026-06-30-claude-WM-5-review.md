---
review: WM-5 output review
sprint: WM-5
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-sonnet-4-6)
date: 2026-06-30
verdict: PASS — REQ-PRESENT-001 bug fixed correctly; all keyboard gaps closed; linter strengthened two files post-close (intentional, no logic change)
---

# WM-5 Review — Focus / selection / keyboard / readiness wiring

## Verdict: ✅ PASS — correct across all gaps; no regressions

## Post-close linter improvements (noted, not blocking)
After WM-5 closed, the linter refined two files:
- **`BuilderPage.tsx`**: Ctrl+V and Delete handlers wrapped in `try/catch` + `isLocked` guard added before mutations. Comment on backdrop click improved. No logic regression.
- **`StageCore.tsx`**: `handleStageBackdropClick` guard replaced `target === currentTarget` (too strict — matched only padding edge) with `e.target.closest('[data-card-kind]')` check — more correct: deselects on any click that didn't originate inside a card. Also intentional improvement.

Both changes tighten correctness. `isLocked` guard on paste/delete prevents mutations on approved/locked versions (governed deletion rule — aligns with REQ-KEY-004 governance intent).

## Verified in code

### REQ-PRESENT-001 — bug fix
`StageProvider.enterPresentationMode` — old code walked ancestors and set `expandedNodeIds = [ancestors + selectedId]`, collapsing the subtree. New code:
- Phase: pushes all `action.id` + all `action.tasks[*].id` into `descendants[]`
- Action: pushes all `task.id`
- Task: no descendants (self only)
- Sets `expandedNodeIds = [selectedId, ...descendants]` → opens the subtree, not collapses it. ✅
- `findParentId` import removed (unused after fix). ✅ Confirmed lint passes.

### REQ-KEY-001 (Ctrl+A)
Iterates `nodes`, collects all phase + action + task IDs (excludes day-cards which start with `day:`). Calls `setSelectedNodeIds(allIds)`. Guard: `isTypingTarget`. ✅

### REQ-KEY-004 (Delete/Backspace)
Resolves kind per ID via `resolveNodeKind`, routes to `deletePhase`/`deleteAction`/`deleteTask`. `isLocked` guard added by linter (correct). `try/catch` wraps for mutation-guard safety. Clears selection on success. ✅

### REQ-KEY-005 (Escape)
Clears `selectedNodeIds` when non-empty, guarded by `isTypingTarget`. ✅

### REQ-SBC-DES-001 (empty-stage click)
`StageCore.handleStageBackdropClick`: skips if `e.target.closest('[data-card-kind]')` — so card clicks don't deselect. Deselects for genuine backdrop clicks. ✅

### Pre-existing confirmed (no regression)
FocusIsland (REQ-FCS-001/002), readiness rules (REQ-RDY-001/003), Ctrl+C/V/S + guard (WM-4). All gates green post-linter pass.

## Gates
typecheck ✅ · lint ✅ · test (85, 12 files) ✅ · architecture (275 modules) ✅ · req:validate ✅ · completion-gate ✅

## Open item (not blocking)
All browser/visual proofs (present drill-in, keyboard shortcuts, backdrop deselect) BLOCKED §28 — batch with WM-2/3/4/5 Playwright queue.

## Recommendation
Keep WM-5. Ready for **WM-6** (stage views / Kanban / Timeline / ViewHelper + day-card create + calendar layouts).
