---
log: 012-stage-live-stress-test
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: audit-review
version_context: v0.3.5
plan: frontend-polish-v0.3.5
---

# 012 — Live stage stress test (browser, dev server on mocks)

## Type: audit-review (live verification via Preview MCP)
PO asked for a live stress test of core stage behavior: add many phases/actions/tasks, change card
states, check island interaction, attempt task moves (phase/date/week/off-stage). Designed against
`REQ-STG-001/004`, `REQ-SBC-001..005`, `REQ-FP-CMA-002/003`, `REQ-KBI-001`, `REQ-BC-006`, `REQ-DZ-001`.

## Setup
Dev server via Preview MCP (`npm run dev`, port 3000), route `/builder/v-1` (mock builder). **Viewport
corrected to 1440×900** (the design target, `core.md §21`) — the initial 577px viewport was cramped and
gave false "broken layout" impressions.

## CRITICAL METHODOLOGY FINDING
Builder cards use a **pointer-threshold interaction layer**: each card wires `onClick`,
`onDoubleClick`, `onPointerDown/Up/Move/Cancel`, AND full HTML5 drag (`onDragStart…onDrop`). A plain
DOM `.click()` fires but is ignored by the handler. **Automated verification MUST dispatch real
pointer events** (pointerdown→pointerup) — not `.click()`. Every "non-response" disappeared once I
drove pointer events. → Implication for FP-R5: PO Web Checks must use real pointer/drag (Playwright
real mouse), and implementation sprints should add deterministic test hooks.

## Results (driven with real pointer events)
| # | Behavior | Graph req | Result |
|---|---|---|---|
| 1 | Stage renders at 1440px (phases centered) | `REQ-STG-001` | ✅ |
| 2 | Collapsed Phase render: number badge, vertical name, readiness circle | `REQ-SBC-003` | ✅ |
| 3 | Create Phase via Creator Palette (click-to-create) | `REQ-KBI-001` | ✅ created 6 → **8 phases total** |
| 4 | Density: 8 phases (1 expanded + 7 collapsed) fit with **no horizontal scroll** | `REQ-FP-CMA-002` | ✅ (`scrollWidth 1148 < clientWidth 1200`) |
| 5 | Expand/collapse Phase 72px ↔ 260px (double-click) | `REQ-SBC-003` | ✅ `data-expanded` flips |
| 6 | Select card → ring + **SelectionIsland "1 phase selected" + PRESENT/copy/delete** | `REQ-SBC-001`/S01/S05 | ✅ |
| 7 | Create multiple Actions in a phase | `REQ-BC-006` | ✅ 3 actions, "No tasks drafted" empty state |
| 8 | Create Task → **"CREATE TASK · SELECT CHANNEL" flow** (Channel+Composition) | `REQ-BC-006` (§1 data model) | ✅ TaskCreationFlow modal |
| 9 | Focus island opens (FOCUS Controls panel) | `REQ-FCS-001` | ✅ |
| 10 | Drag wiring + **5 dropzone elements present**; cards `draggable=true` | `REQ-DZ-001`/`REQ-STG-004` | ✅ present — **updates FP-R0's stale "activeDrag never set / drop zones inert"** |
| 11 | End-to-end drag MOVE (task→other phase / →timeline day / →off-stage) | `REQ-STG-004`/`REQ-DZ-001` | ⚠️ **not confirmable via synthetic events** — needs real-pointer drag (manual/Playwright). Infra present; behavior unverified. |
| 12 | Timeline day-card task creation | `REQ-BC-007/008` | ⏭️ not tested — and **not in FP-R4** (the gap flagged in log 011 stands) |

## Reconciling the PO's earlier suspicions
- **"Stage weird / scroll defect":** At the 1440px target, 8 phases fit cleanly with no horizontal
  scroll (CMA-002 works). The "weird" was largely the sub-1440 cramped viewport. Per-column internal
  scroll/bounded-height at high action density was NOT stress-tested to overflow → still worth the
  explicit scroll criterion (log 011).
- **"Drag-drop doesn't work":** handlers + dropzones ARE wired now (≠ FP-R0). Whether an end-to-end
  move completes is unconfirmed here — needs a real-pointer test.
- **"Day-card inline new-task popup":** kanban task-creation flow works; the **timeline day-card**
  creation (`REQ-BC-007/008`) remains the FP-R4 coverage gap from log 011.

## Verdict
Core stage/card/island behavior is in **substantially better shape than feared** — selection, expand,
create (phase/action/task), density, and island interaction all work when driven correctly. The real
open items are: (a) end-to-end drag-move needs real-pointer confirmation, (b) the timeline day-card
creation gap (FP-R4), (c) explicit per-column scroll criterion. None are "stage is broken."

## Evidence
Screenshots captured inline in this session (initial load, 1440 render, selection+SelectionIsland,
expanded phase, 8-phase density, task-creation channel flow + Focus panel). Dev server left running
(serverId in session); not saved to `output/evidence/` because Preview MCP returns inline images, not
files — note for follow-up if persisted evidence is required (`core.md §32`).

## Gates
Live verification; **no `src/` writes** (read/inspect + dev server only). No graph mutation.

## Next
Feeds the FP-R4 patch (log 011) + FP-R5 PO Web Checks: (1) add timeline day-card creation criteria
(`REQ-BC-007/008`); (2) add explicit scroll criterion; (3) require real-pointer/drag in PO Web Checks
+ test hooks for E2E drag. Then close discovery + draft implementation plan.
