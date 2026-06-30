---
sprint: WM-5
plan: frontend-polish-implementation-v0.3.5
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
status: Status: Completed
version_context: v0.3.5
---

# WM-5 — Focus / selection / keyboard / readiness wiring

## Requirement Trace
| Field | Value |
|---|---|
| Graph IDs | REQ-FCS-001, REQ-FCS-002, REQ-FP-D02, REQ-FP-CMA-001, REQ-FP-CMA-003, REQ-RDY-001, REQ-RDY-003, REQ-SBC-DES-001, REQ-KEY-001, REQ-KEY-002, REQ-KEY-003, REQ-KEY-004, REQ-KEY-005, REQ-KEY-006, REQ-KEY-007, REQ-UP-005, REQ-UP-006, REQ-UP-012, REQ-PRESENT-001 |
| Scope/type | frontend / interaction + state |
| States before | `delivery: not-assessed` (REQ-PRESENT-001, REQ-KEY-001, REQ-KEY-004, REQ-KEY-005, REQ-SBC-DES-001) |
| States after | `delivery: implemented` — all gaps fixed; pre-existing features confirmed |

## Gap analysis

| Feature | State before WM-5 | Gap |
|---|---|---|
| REQ-PRESENT-001 — presentation drill-in expands descendants | ❌ **BUG**: expanded ancestors, collapsed subtree | **Fixed** |
| REQ-KEY-001 — Ctrl+A select all eligible cards | ❌ Missing | **Fixed** |
| REQ-KEY-004 — Delete/Backspace governed deletion | ❌ Missing | **Fixed** |
| REQ-KEY-005 — Escape deselects | ❌ Missing | **Fixed** |
| REQ-SBC-DES-001 — empty-stage click deselects | ❌ Missing | **Fixed** |
| REQ-KEY-002 — Ctrl+C copy | ✅ Done in WM-4 | None |
| REQ-KEY-003 — Ctrl+V paste | ✅ Done in WM-4 | None |
| REQ-KEY-006 — Ctrl+S save | ✅ Pre-existing | None |
| REQ-KEY-007 — keyboard guard in text inputs | ✅ Done in WM-4 | None |
| REQ-FCS-001 — FocusIsland filtering engine | ✅ Pre-existing (week + property filters, selects matching tasks) | None |
| REQ-FCS-002 — Focus isolation visual hide | ✅ Pre-existing (`isolatedNodeIds` in StageProvider + CardShell null-return) | None |
| REQ-RDY-001 — Readiness shared feature | ✅ Pre-existing (centralized readiness.rules.ts) | None |
| REQ-RDY-003 — Per-field readiness on tasks | ✅ Pre-existing (field-level states in task readiness) | None |

## Changes made

### `src/builder/stage/StageProvider.tsx`
**REQ-PRESENT-001 bug fix** — `enterPresentationMode` rewritten:
- **Before (bug):** walked up to ancestors and set `expandedNodeIds = [ancestors + selectedId]` — this *collapsed* the selected node's children
- **After (fix):** walks *down* to descendants. Phase → all its actions + all their tasks. Action → all its tasks. Task → self only. Sets `expandedNodeIds = [selectedId, ...descendants]` then scrolls card into view.
- `findParentId` import removed (now unused).

### `src/builder/BuilderPage.tsx`
Added `setSelectedNodeIds` to destructure and `resolveNodeKind` import. Unified keyboard handler now covers:
- **REQ-KEY-001 (Ctrl+A):** iterates all `nodes`, collects phase + action + task IDs (excludes day-cards), calls `setSelectedNodeIds(allIds)`
- **REQ-KEY-004 (Delete/Backspace):** resolves kind per selected ID, calls `deletePhase`/`deleteAction`/`deleteTask`, clears selection
- **REQ-KEY-005 (Escape):** clears `selectedNodeIds` when non-empty
- Guard: `isTypingTarget()` applies to all shortcuts except Ctrl+S (pre-existing behaviour)

### `src/builder/stage/StageCore.tsx`
**REQ-SBC-DES-001 empty-stage click** — added `setSelectedNodeIds` to destructure; `handleStageBackdropClick` on `<section>` — fires only when `e.target === e.currentTarget` (not bubbled from a card), clears selection.

## RS-R7 TRC links created
- `TRC-WM5-REQ-PRESENT-001-TO-MAN-...-stageprovider` (confirmed, complete)
- `TRC-WM5-REQ-KEY-001-TO-MAN-...-builderworkspacecontent` (confirmed, complete)
- `TRC-WM5-REQ-KEY-004-TO-MAN-...-builderworkspacecontent` (confirmed, complete)
- `TRC-WM5-REQ-KEY-005-TO-MAN-...-builderworkspacecontent` (confirmed, complete)
- `TRC-WM5-REQ-SBC-DES-001-TO-MAN-...-stagecore` (confirmed, partial — empty-stage path; Escape path via KEY-005 TRC)

### WM-3 E02 debt resolved
- `TRC-WM3-REQ-EVI-001-TO-MAN-...-actioncard` → retracted (PO rolled back ActionCard onLongPress; editor is task-only)
- `output/WM-3-editor-open-paths-sessions.md` → E02 row corrected to "Fixed then reverted"

## Requirement Debt Burn-down
Touched: REQ-PRESENT-001, REQ-KEY-001, REQ-KEY-004, REQ-KEY-005, REQ-SBC-DES-001

| Metric | Before | After |
|---|---|---|
| Unlinked changed-scope manifestations | 0 | 0 |

## Gates
- `npm run typecheck` ✅
- `npm run lint` ✅ (0 warnings)
- `npm run validate:architecture` ✅ (275 modules, 0 violations)
- `npm run test` ✅ (85 tests passed, 12 files)
- `npm run req:validate` ✅ (pass: true)
- `npm run req:completion-gate -- --changed BuilderPage.tsx StageProvider.tsx StageCore.tsx` ✅ (PASS)

## PO Web Check — BLOCKED §28 (no Playwright-reachable dev server this session)
Route `/builder`; select a Phase → "Present" → expect phase expands (actions + tasks visible, not collapsed); previously subtree collapsed. Select cards → Ctrl+A → all selected. Select → Delete → removed. Escape → deselects. Click empty stage area → deselects.
Evidence path: `output/evidence/WM-5-focus-selection/` — batch with WM-2/WM-3/WM-4 Playwright queue.

## Files touched
- `src/builder/stage/StageProvider.tsx` (enterPresentationMode fix)
- `src/builder/BuilderPage.tsx` (Ctrl+A, Delete, Escape)
- `src/builder/stage/StageCore.tsx` (backdrop click deselect)
- 5 × TRC JSON files (new)
- `TRC-WM3-REQ-EVI-001-TO-MAN-...-actioncard.json` (retracted)
- `output/WM-3-editor-open-paths-sessions.md` (E02 row corrected)
