---
doc: requirements-recovery
plan: frontend-polish-v0.3.5
agent: Claude (claude-opus-4-8)
date: 2026-06-29
status: CRITICAL FINDING — discovery coverage gap
trigger: PO flagged missing core requirements (keyboard, duplicate, multi-move, deselect, drag/scroll)
---

# Requirements Recovery — discovery coverage gap

## The core problem

The entire discovery (FP-R0…R5) and the FP-R4 finalize spec were grounded in the hand-written
`docs/product/requirements/builder/*.md` docs. **Those are a thin subset.** Two authoritative sources
were never consulted:

1. **`dcx-requirements-master.csv` (217 confirmed requirements)** at the repo root — never referenced by
   any plan, sprint, or agent-rule (`rg "requirements-master" docs/plans` → 0 hits).
2. **The v0.1.4 codebase** (`docs/archive/dcx-manager-v0.1.4`) — which *implemented* several behaviors
   that were **dropped in the v0.3.5 rewrite** and never re-specced.

Result: whole requirement families are missing from the discovery — exactly the ones the PO flagged.

---

## Answers to the PO's specific questions (with evidence)

### 1. "Where did the keyboard shortcuts go?"
**They existed in v0.1.4 and were dropped.** `docs/archive/.../src/pages/builder/hooks/useKeyboardInteractions.ts`
implemented a global builder keyboard layer; the current `src/` has **no global keyboard hook**
(`rg 'useKeyboard|keydown' src` finds only local popup/input handlers, not the builder shortcuts).

| Shortcut | v0.1.4 behavior | Current v0.3.5 |
|---|---|---|
| **Ctrl/⌘ + A** | Select all (actions + tasks) | ❌ gone |
| **Ctrl/⌘ + C** | Copy selection | ❌ gone |
| **Ctrl/⌘ + V** | Paste to smart target (selected card → its parent, else first phase) | ❌ gone |
| **Delete / Backspace** | Delete selected | ❌ gone |
| **Escape** | **Clear selection (deselect)** | ❌ gone |
| **Ctrl/⌘ + S** | Manual save (master CSV **SC-004**) | ❌ gone |
| Typing guard | Ignores shortcuts inside input/textarea/contentEditable | ❌ gone |

Master CSV also names shortcuts in **BC-012** (Creator Island supports shortcuts).

### 2. "Duplication and moving multiple cards to the same location?"
Recovered from multiple sources — **none implemented in current build, none in FP-R4 spec:**
- **Copy/Paste of a multi-selection** (v0.1.4 Ctrl+C/Ctrl+V) = duplicate/move multiple cards to a target.
- **Card-level Duplicate** (`islands.md`): preserves order, newly-created behavior, same parent context.
- **SBC-001** (master CSV): card primitive layer covers **multi-selection, drag-and-drop, reorder, delete, duplicate**.
- **RV-017**: selective import on duplication. Version-level duplication: VL-028, RV-016, VL-016, RV-004.

### 3. "Drag rearrangement — tasks between actions, scroll direction by container, no longer breaks"
This is **STG-004 + SBC-002 + DZ-001** in the master CSV — never captured in the thin `drag-and-drop.md`:
- **STG-004 (Kanban Stage Movement):** *"phases horizontal; actions vertical within a phase and horizontal
  between phases; tasks within and between actions. When dragging near/beyond visible bounds, support
  edge-scroll, valid insertion zones, off-stage dropzones, and continuation feedback … User never loses
  drag context off-screen."* ← **the scroll-direction-by-container + "no longer breaks" requirement.**
- **STG-005:** timeline movement + off-stage **date** dropzones.
- **DZ-001:** typed shared dropzone engine (view type, target type, accepted types, edge-zone state, drop command).
- **SBC-002:** card-specific movement rules (same matrix).
- **Current state:** FP-R0 found `activeDrag` is initialized but **never set — all drop zones inert.** So
  none of this works, and the off-stage/edge-scroll/container-direction model was never specced in FP-R4.

### 4. "Deselecting from stage"
v0.1.4 **Escape clears selection**; current build has **no deselect** (no global Escape handler, no
click-empty-to-deselect in `src/builder/stage`). The spec only had *auto*-deselect after create — the
**manual deselect was lost.**

---

## Conflict with a decision we just locked — D-02 (FocusIsland)

We recorded **D-02 = "highlight, not hide."** The master CSV shows **two** focus behaviors:
- **FCS-001 (default):** select/**highlight** all matching tasks (✅ matches the PO ruling).
- **FCS-002 (Focus Isolation Mode):** *"hides all non-selected tasks … visual filtering only — no data
  deleted."* An **opt-in isolation mode that DOES hide.**

→ **D-02 must be refined:** default = highlight (FCS-001); isolation/hide is a **separate opt-in mode**
(FCS-002), not forbidden. Re-confirm with PO.

---

## Categories the discovery never touched (master CSV)

Builder-relevant and missing/under-covered: **Stage System (STG)**, **Shared Builder Card System (SBC)**,
**Dropzone Engine (DZ)**, **Interaction & Motion System (IFX-001)**, **Focus Island engine (FCS-001/002)**,
**Kanban Builder Island (KBI-001 drag-to-create)**, **View Helper Bridge (VHB-001)**, **Editor/Viewer
Island (EVI-001)**, **per-field readiness (RDY-003)**. Out-of-polish-scope but present: Lifecycle (33),
Permissions (19), Persistence/Autosave (16), Preferences (20).

---

## Recommended corrective action

The discovery's requirement grounding is incomplete. Before drafting the implementation plan:

1. **Adopt `dcx-requirements-master.csv` as the authoritative requirement source** (the `builder/*.md`
   docs become readable summaries, not the source of truth). Wire it into the carry-forward + agent-rules.
2. **Recover the v0.1.4 lost behaviors** as explicit requirements: keyboard layer (Ctrl+A/C/V, Delete,
   Escape-deselect, Ctrl+S), copy/paste, manual deselect.
3. **Re-ground FP-R4** (which is being reopened anyway) against the master CSV + this recovery — add the
   missing families (SBC card system, STG movement, DZ dropzones, keyboard, IFX motion, FCS isolation).
4. **Re-open D-02** to add the FCS-002 isolation mode.
5. **Then** FP-R5 synthesis + the implementation plan, re-ranked (DnD + dropzone engine + card primitive
   layer are now clearly foundational).

This is bigger than the homepage/version FP-R4 reopen — it is a re-grounding of the builder requirements.

---

## Reconciliation method (timeline-based — PO-confirmed)

**Evidence (mtimes):** CSV `2026-06-25 15:52` → builder/*.md + decisions + open-questions `2026-06-25
23:51` (~8h later, same day) → src-structure-decision `2026-06-28`. **No later doc references the CSV's
`STG-/SBC-/DZ-/FCS-/IFX-/KBI-/VHB-/EVI-` IDs** — they were dropped when the builder/*.md were re-authored
under a new ID scheme (`BLD-*` / `CRD-INT-*` / `OD-*`).

**Rule (PO-confirmed):**
1. **builder/*.md + dated `builder-decisions.md` = CURRENT** for every topic they cover (newer, "confirmed and locked").
2. **CSV (+ v0.1.4 code) = authoritative for the GAPS** — topics the builder docs are silent on.
3. **Conflict on a covered topic → newer (builder/*.md/decision) wins, but flag it** for PO awareness.
4. The CSV is the *broad base*; it is **outdated where a later decision changed it** — never apply a CSV
   row blindly over a newer builder/*.md statement.

## Gap requirements to recover + INTEGRATE (silent in builder/*.md) — keeps FP-R5 coherent

| Gap | CSV / v0.1.4 source | Family | Folds into (existing plan) |
|---|---|---|---|
| Keyboard layer (⌘A / ⌘C / ⌘V / Delete / **Esc-deselect** / ⌘S) | v0.1.4 `useKeyboardInteractions`, SC-004, BC-012 | wire | **NEW sprint WM-10 (keyboard + selection)** |
| Copy/paste + **duplicate/move multiple to a target** | v0.1.4 C/V, SBC-001, islands Duplicate, RV-017 | wire | WM-10 + Selection (WM-8) |
| **Manual deselect** (Esc + click-empty-stage) | v0.1.4 Escape, stage | wire | WM-10 |
| **STG-004/005 full movement** (scroll-dir-by-container, **off-stage dropzones**, edge continuation, never-lose-context) | STG-004, STG-005, SBC-002 | wire | **This is the real spec for WM-2 (DnD) — expand it** |
| **DZ-001 typed dropzone engine** | DZ-001 | wire (+ component) | foundational under WM-2 |
| **SBC card primitive system** (multi-select / reorder / duplicate / locked as ONE shared layer) | SBC-001…005 | component (+ wire) | card sprints (CC-2) + WM-2/8 |
| IFX-001 motion/feedback system | IFX-001 | component | CC-5 reduced-motion + `effects.registry.ts` |
| **FCS-002 Focus isolation (hide mode)** | FCS-002 | wire | extends WM-5 — **re-decide D-02** |
| RDY-003 per-field readiness states | RDY-003 | wire | readiness CC-4 / WM |
| KBI-001 drag-to-create precision (phase on board, action on phase, task on action) | KBI-001 | wire | CM-4 creation + WM-2 |

> **Coherence rule:** recovered gaps become **additional/expanded sprints inside the SAME three-family
> matrix** — FP-R5 presents ONE integrated plan (existing 17 + recovered), not two. WM-2 (DnD) absorbs
> STG-004/STG-005/DZ-001 as its real specification and remains foundational.

## Contradiction register (CSV vs newer — for PO ruling)

| # | Topic | CSV says | Newer doc / decision says | Proposed resolution |
|---|---|---|---|---|
| C-1 | FocusIsland | **FCS-002:** isolation mode *hides* non-selected | islands.md / D-02: *highlight*, keep all visible | **Highlight by default (FCS-001) + opt-in isolation/hide mode (FCS-002).** Re-open D-02. |
| — | Editor / View-Helper / Kanban-island / readiness | CSV adds detail (EVI-001, VHB-001, KBI-001, RDY-003) | builder/*.md consistent | No conflict — CSV detail *augments*, doesn't contradict. |

Only **C-1** is a genuine contradiction; the rest of the CSV's builder content augments rather than
conflicts with the newer docs.
