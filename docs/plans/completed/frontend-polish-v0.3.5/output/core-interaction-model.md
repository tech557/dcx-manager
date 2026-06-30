---
doc: core-interaction-model
plan: frontend-polish-v0.3.5
agent: Claude (claude-opus-4-8) — interactive PO alignment + live verification
date: 2026-06-29
status: aligned (PO-confirmed) + live-verified
grounds: FP-R4 reopen, FP-R5 synthesis, the whole implementation plan
verified_against: live dev server (port 3000), /builder/v-1, 2 and 8 phases, kanban + timeline
---

# Core Interaction & State Model — DCX Builder

> **Why this doc exists.** FP-R0…R4 captured *atomic* criteria (truncation, button-enable, tooltips,
> token fixes) but never the **system**: how stage × islands × cards behave together, how state
> transitions ripple into the view/scroll/stats, and what happens at real scale. The PO flagged this
> gap directly. This doc synthesizes the requirement specs into one coherent model, **reconciles it
> against the live app**, and records the PO alignments that the requirement docs were silent on. It is
> the backbone every implementation sprint hangs off.

---

## 1. The three primitives and their interaction contracts

| Primitive | Role | Contract |
|---|---|---|
| **Stage** | Persistent fixed-height workspace | Switching views swaps the *card system* inside it, never a page. **Horizontal scroll only** when content exceeds width; **no vertical stage scroll**. (✅ live: `overflow-x-auto / overflow-y-hidden`.) |
| **Islands** | Controls surrounding the stage | Interact with the stage in **four distinct ways** (below). Opening/closing an island must **never reset** card states, selection, focus, scroll position, active week/month, current view, or editor sessions. |
| **Cards** | Phase / Action / Task / Day | Carry **identity across views** (same Task = kanban tile / weekly-day task / monthly task / View-Context item). |

**Island↔stage interaction modes (the part FP-R4 flattened):**
| Island | Stage effect |
|---|---|
| Editor Island | **Narrows** the stage (reserves space); cards stay accessible |
| View Context (timeline only) | **Overlays** the stage (higher layer); does NOT move/resize cards |
| Focus Island | **Filters visibility** (highlight semantic — see §4); does NOT move cards |
| Sticky popups (file preview, View Context) | **Float** above the stage; do NOT touch stage geometry |

---

## 2. Card state machine — 6 independent, coexisting dimensions

A card may be simultaneously expanded + selected + children-expanded + newly-edited + receiving-child.
These are **orthogonal dimensions**, not a single enum:

| Dimension | Values | Owner |
|---|---|---|
| Display | Collapsed / Expanded | shared `expandedNodeIds` (StageProvider) |
| Interaction | Default / Selected / Disabled | shared selection state |
| Children | All collapsed / All expanded / Mixed | derived |
| Change feedback | None / Newly created / Newly edited | card-local, time-boxed |
| Receiving | None / Receiving child | drag/drop + create |
| Presentation override | Normal / Selection presentation mode | Selection Island |

**Hard rules (from cards.md):**
- **Popup ≠ expanded.** Single-click = read-only popup **+ select**; double-click = toggle expand; both coexist; closing one never affects the other. Popup = presentation layer (TaskCard); expand = card state (StageProvider). (`core.md §17`)
- **Disabled** cards stay visible, keep identity + readiness, may still be inspected (weekend Days, already-assigned View-Context Tasks).
- **Newly-created** sequence: visual feedback → brought into view → temp-selected → auto-deselected → feedback persists its duration. Multiple creates reveal **sequentially first→last**.
- **Receiving-child:** direct parent gets the state and **must expand**; grandparent **also expands but does NOT get the state**.

---

## 3. Scale, scroll & centring  *(live-verified at 8 phases)*

| Aspect | Spec | Live (8 phases) | PO alignment |
|---|---|---|---|
| Many phases | Horizontal arrangement, horizontal scroll when width exceeded | ✅ content 1760 > stage 1200 → scrolls horizontally | — |
| Vertical | No vertical stage scroll | ✅ `overflow-y-hidden` | — |
| Phase height | Bounded; internal vertical scroll when Actions overflow; never grows stage | ✅ bounded columns | — |
| Density target | 3 expanded phases / 2–3 actions / 2–3 collapsed tasks on 14" | app defaults to **collapsed** columns | **PO: SMART default — active phase(s) expanded, the rest collapsed columns.** Scales to 7–8 without a wall of scroll. |
| Centring | Per-object centring rule (Phase top-level, Action within Phase, Task within Action+Phase) | not auto-applied on select | **PO: AUTO-CENTRE on select/navigate** — selecting a card or jumping via focus/filter scrolls the stage to centre it (object-specific). |

**Implication:** "smart default expand" + "auto-centre on select" are **new behavior requirements** not in
the original docs — they materially change the kanban/stage wiring sprint.

---

## 4. Readiness / stats model

**Propagation chain (readiness.md):** Subtask → Task → Action → Phase → Version, plus Day readiness.
- Task ready = all required inputs (name, channel, sender, receiver, message, date) + specs/missing-data
  filled-or-not-needed + ≥1 subtask + ≥1 valid subtask + all subtask durations valid. **Zero subtasks ⇒ never ready.**
- Action ready = all child Tasks ready. Phase ready = all child Actions ready.
- Day: 3 states (ready / incomplete / empty). **Empty Day is neutral and does NOT reduce Version readiness** (BLD-RED-001/OD-002).
- Version = Task→Action→Phase rollup + Day readiness + required-objects-exist.

**Live finding + PO alignment:** per-card readiness indicators exist (colored circle + "PHASE IS
INCOMPLETE" tooltip), but **no aggregate Version-readiness rollup is displayed anywhere**. →
**PO: add a live Version-readiness summary in the header / metadata island**, updating on every edit.
This is the "stats" surface the discovery missed. (New requirement — `change-component` markup +
`wire-mockup-data` live compute.)

---

## 5. View model (two connected planning directions)

| View | Direction | Represents | Stage content |
|---|---|---|---|
| Kanban | Top-down | Phase → Action → Task | Phase columns |
| Timeline Weekly | Bottom-up | Week → Day → Task | 7 Day cards (5 working expanded + 2 weekend collapsed/disabled) ✅ live |
| Timeline Monthly | Bottom-up | Week → Day → Task | Compact Days; **no expanded Task state** |

- Same version, two lenses; cards keep identity. View switch animates cards out/in and **preserves
  selection, focus, expanded states, active week** (✅ live: kanban↔timeline swap works).
- **ViewHelperIsland / View Context is timeline-only** (`if view==='kanban' return null`) — ✅ live-confirmed
  present in timeline, absent in kanban. **D-03 was a false gap.** It shows unassigned Tasks (active,
  draggable) + assigned Tasks (visible-but-disabled, not filtered); drag a Task to a Day assigns its date.

---

## 6. Creation flow  *(PO-aligned: top-down drag-pills is canonical)*

The requirement docs had **no creation-flow spec**; three half-built entry points exist in code. PO
ruling: **the canonical creation model is top-down drag-pills from the Kanban Builder Island.**

| Entry point | Role after PO ruling |
|---|---|
| **KanbanBuilderIsland → 3 draggable pills (Phase / Action / Task)** | **CANONICAL.** Drag a pill onto the stage to create in place (top-down). Long-press a pill → template popup (V1 seeded). |
| Stage `+` / quick-add | Secondary convenience; creates a minimal card → newly-created state → fill details after. Keep, but not the primary path. |
| `TaskCreationFlow` (channel → composition → subtasks) | The **Task-specific** guided detail flow once a Task exists; not a competing top-level creator. |

**Dependency this exposes:** because creation is **drag-based**, the drag-and-drop wiring (currently
`activeDrag` is initialized but never set — all drop zones inert, per FP-R0) is a **foundational
prerequisite for the creation flow**, not just for rearranging. This elevates the DnD sprint's priority.

Newly-created cards follow the §2 sequence (reveal → temp-select → auto-deselect; sequential for multi).

---

## 7. Reconciliation: spec vs live vs PO alignment

**Confirmed live (no change needed):** horizontal-only scroll; bounded centred phase columns;
view-switch state preservation; timeline Day cards + week nav; ViewHelperIsland view-gating;
per-card readiness.

**New requirements raised here (must flow into FP-R4 reopen + FP-R5 synthesis + implementation plan):**
| # | New requirement | Family | Source |
|---|---|---|---|
| CM-1 | Live **Version-readiness rollup** in header/metadata island | `change-component` + `wire-mockup-data` | §4 PO |
| CM-2 | **Smart default display** — active phase(s) expanded, rest collapsed | `wire-mockup-data` (+ `change-component`) | §3 PO |
| CM-3 | **Auto-centre on select/navigate** (object-specific) at scale | `wire-mockup-data` | §3 PO |
| CM-4 | **Drag-pill creation** as canonical flow (depends on DnD wiring) | `wire-mockup-data` | §6 PO |
| CM-5 | DnD wiring is a **foundational prerequisite** (creation + rearrange + assign all depend on it) | `wire-mockup-data` | §6 |

**Open for FP-R4 reopen (homepage/version) — separate from this builder model:** grounded in
`docs/archive/dcx-manager-v0.1.4`.

---

## 8. How this changes the plan

1. **FP-R5 synthesis must be updated** to add CM-1…CM-3 as sprints, fold CM-4 into creation, and
   **re-rank DnD wiring (WM-2) as foundational** (creation depends on it) — likely promote it ahead of
   several component sprints.
2. **FP-R4 reopen** (homepage/version) proceeds in parallel; it does not touch this builder model.
3. The atomic FP-R4 criteria (E/C/R/K/T/D/S/F/L/M/X) remain valid but now **hang off this model** rather
   than standing alone.
