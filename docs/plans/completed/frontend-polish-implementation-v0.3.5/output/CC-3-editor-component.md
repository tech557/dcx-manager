---
sprint: CC-3
plan: frontend-polish-implementation-v0.3.5
executor: Claude (claude-opus-4-8)
date: 2026-06-30
status: Completed
---

# CC-3 — Editor component fixes (enable-on-select + single-column routing)

## What was built
Two editor-island fixes from FP-R5 §CC-3:

1. **Enable-on-select editor pill.** The collapsed editor pill (`#editor-island`) was hardcoded
   `disabled` and only openable by dragging a card onto it. It is now clickable whenever an editable
   card (phase/action/task) is selected, opening the editor for that selection.
2. **Single-column routing/endpoint.** The "Routing & Endpoint Directory" sender + receiver fields
   rendered in a 2-column grid at the 382px editor width, truncating labels. They now render in a
   single column at full editor width, so text no longer truncates.

G-IMPECCABLE mode: **direct `dcx-frontend-refactor` route** (impeccable not invoked; these are
component/logic fixes, not brand-design). The stale root `CLAUDE.md` QUARANTINED line was also
reconciled to match `docs/agent-skills.md` (ENABLED, brand-system only) — see minor-debt note below.

## Changes
| File | Change |
|---|---|
| `src/builder/islands/EditorViewerIsland/useEditorState.ts` | Pull `selectedNodeIds` from stage; derive `selectedEditableNodeId` (most-recently-selected id resolving via `findEditorNode` to a non-`day` node); expose it. |
| `src/builder/islands/EditorViewerIsland/EditorViewerIsland.tsx` | Collapsed pill: `disabled={!selectedEditableNodeId}`; `onClick` → `setFocusedNodeId(selectedEditableNodeId)`; selection-aware styling (accent ring + cursor-pointer + title "Open editor for selected card"); added `data-testid="editor-pill"`. |
| `src/builder/islands/EditorViewerIsland/TaskEditor/RoutingDirectorySection.tsx` | Sender/receiver wrapper `grid grid-cols-2 gap-3` → `grid grid-cols-1 gap-3`. |

## Requirement Trace
| Field | Value |
|---|---|
| Graph IDs | REQ-EVI-001 (pill / stage-pushing editor), REQ-FP-D09 (enable-on-select), REQ-FP-D10 (single-column routing) |
| States | All three `delivery: not-assessed → implemented` (governance `approved`, maturity `logic-defined` unchanged). `verified` NOT claimed — interactive proof BLOCKED (see Gates). |
| Manifestations | `MAN-react-component-...-editorviewerisland-editorviewerisland`, `MAN-react-component-...-taskeditor-routingdirectorysection`, `MAN-hook-...-useeditorstate` → all `delivery: not-assessed → implemented` |
| RS-R7 candidate link | `TRC-RS-R7-REQ-EVI-001-TO-MAN-...-editorviewerisland`: **confirmed** (`code-discovered → confirmed`, `needs_confirmation: false`) — CC-3 implemented EVI-001 behavior in that component |
| New TRC links | `TRC-CC3-REQ-FP-D09-TO-MAN-...-editorviewerisland` (pill enable-on-select); `TRC-CC3-REQ-FP-D10-TO-MAN-...-routingdirectorysection` (single-column) |

## Requirement Debt Burn-down
- RS-R7 candidate links for touched reqs: 1 needing-confirmation (EVI-001→EditorViewerIsland) → 0 (confirmed).
- Changed-scope unlinked manifestations: 0 (all touched MANs already existed and are now traced + delivery-marked).
- `req:completion-gate --changed`: ✅ PASS · `req:validate`: ✅ PASS (QST-VR-011 pre-existing).

## Gates
- typecheck ✅ · lint ✅ · test(82) ✅ · architecture(272) ✅
- `req:validate` ✅ · `req:completion-gate --changed` ✅
- No targeted unit test exists for `useEditorState`/`EditorViewerIsland`/`RoutingDirectorySection`
  (per CC-1 carry-forward); full suite (82) run instead.
- Build/dev-smoke ✅: Vite compiled the 3 changed files with **no build errors**; **no browser
  console errors** at mount.
- **Interactive PO Web Check ⚠ BLOCKED (§28)** — NOT marked PASS. Preview MCP browser wedges to
  `chrome-error://chromewebdata/` right after mount; sandboxed Vite port unreachable from Bash
  (`curl` → HTTP 000) and Playwright (network-context split). Port 3000 held by another chat's
  server (Vite bumped to 3001, proxy could not track it). Same limitation as logs 025/026. PO must
  verify with real pointer/drag — steps in `output/evidence/CC-3-editor-component/README.md`.

## Evidence
`output/evidence/CC-3-editor-component/README.md` — documents the blocked check, the non-visual
evidence captured, and the exact real-pointer steps the PO must run.

## Carry-forward / open
- **Live-verify path still flaky** (carried from 025/026). Add a reliable shared-port path before
  WM-5's presentation PO Web Check and to retire this CC-3 BLOCKED interactive check. Closing the
  other chat's :3000 server, or pinning a free port for this session's preview, would unblock it.
- enable-on-select + single-column are low-risk and type-checked; the only outstanding item is the
  visual/interactive confirmation, deferred to PO.
