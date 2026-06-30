# Builder — Open Decisions Register

All V1 decisions have been resolved and locked for execution. There are no active open decisions remaining in this register.

| ID | Question | Temporary default | Blocking sprint | How to resolve |
|---|---|---|---|---|
| None | - | - | - | - |

## Resolved Decisions

The following decisions have been resolved and incorporated as permanent product decisions in `docs/product/decisions/builder-decisions.md`:

| Open Decision ID | Question | Permanent Decision ID | Resolution Summary | Date Resolved |
|---|---|---|---|---|
| OD-001 | Maximum editor sessions | BLD-EDT-002 | No hard product limit in V1; display up to 5 pills directly, horizontally scrollable overflow. | June 2026 |
| OD-002 | Empty Day readiness | BLD-RED-001 | An empty Day is neutral / not applicable, not ready. 3 semantic states: ready, incomplete, empty/not-applicable. | June 2026 |
| OD-003 | Long-press movement cancel threshold | BLD-CRD-INT-003 | Use 8px movement tolerance. | June 2026 |
| OD-004 | Task popup dimensions and anchor position | BLD-CRD-INT-004 | Responsive anchored popup: width 280-360px, height content-based, edge flipping, narrow bottom presentation. | June 2026 |
| OD-005 | Card dimensions and breakpoints | BLD-CRD-INT-005 | Fluid layout using density targets and min widths (Phase target 3 columns, Action grid, Task content-driven). | June 2026 |
| OD-006 | View transition animation duration | BLD-MOT-001 | 220ms for the main transition; respect reduced-motion. | June 2026 |
| OD-007 | Files popup: fixed or resizable? | BLD-FIL-002 | Fixed files list popup from Project Meta Island; opened file has resizable preview session. | June 2026 |
| OD-008 | Selection presentation scroll behaviour | BLD-SLC-002 | Object-aware centering (smallest required movement) without resetting the stage. | June 2026 |
| OD-009 | Newly-edited state duration & visual form | BLD-CRD-INT-006 | Subtle two-second change highlight (border and soft background glow), trigger after saved edit. | June 2026 |

## How to Record a Resolution

When a new decision is added and subsequently resolved, update this register:
1. Move the entry to the "Resolved Decisions" table above.
2. Ensure the resolution is documented permanently in `docs/product/decisions/builder-decisions.md`.



# Recommended Resolutions — Builder Open Decisions

## OD-001 — Maximum Editor Sessions

**Decision: No hard product limit in V1.**

* Display up to five session pills directly.
* When more than five sessions are open, the pill area becomes horizontally scrollable or uses an overflow control.
* Opening another session must never replace or discard an existing session.
* Performance may later justify a technical safety limit, but it should not be presented as a product rule.

**Reason:** Five is an arbitrary restriction. The UI should manage overflow rather than block the user.

**Status:** ✅ Resolved

---

## OD-002 — Empty Day Readiness

**Decision: An empty Day is neutral / not applicable, not ready.**

Use three semantic states for Days:

* `ready` — contains Tasks and all are ready.
* `incomplete` — contains at least one incomplete Task.
* `not-applicable` or `empty` — contains no Tasks.

The empty state should not reduce overall Version readiness.

**Reason:** “Ready” implies work exists and has passed validation. An empty Day has nothing to validate.

**Status:** ✅ Resolved

---

## OD-003 — Long-Press Movement Cancellation Threshold

**Decision: Use 8px movement tolerance.**

* Long press activates after 400ms.
* Cancel long press when pointer movement exceeds 8px.
* Cancel immediately when native dragging begins or the pointer is released.

**Reason:** Four pixels is too sensitive for trackpads and normal hand movement. Eight pixels still distinguishes a deliberate hold from a drag.

**Status:** ✅ Resolved

---

## OD-004 — Task Read-Only Popup Dimensions and Position

**Decision: Responsive anchored popup.**

* Preferred width: 320px.
* Minimum width: 280px.
* Maximum width: 360px.
* Height: content-based, with a maximum based on available viewport height.
* Anchor beside the selected Task where space permits.
* Flip horizontally or vertically when near a viewport edge.
* On very narrow screens, use a centred or bottom-positioned presentation.
* The popup must remain independent from the Task expanded state.

**Reason:** One fixed width and direction will fail near stage edges and inside narrow Actions.

**Status:** ✅ Resolved

---

## OD-005 — Card Dimensions and Breakpoints

**Decision: Use density targets and minimum widths, not one fixed card width.**

### Phase

* Default target on a 1440px-wide workspace: three expanded Phases visible.
* Preferred expanded width: approximately 360–400px.
* Minimum expanded width: approximately 340px.
* When available space falls below the three-column target, preserve width and enable horizontal scrolling rather than compressing cards excessively.

### Action

* Width follows the Phase container.
* Expanded Action supports the required Task grid.
* Collapsed Action supports a single horizontal Task row.

### Task

* Compact Task size should be driven by readable content and icons, not a fixed square.
* Expanded Task occupies a full row.

Exact visual dimensions should be finalised during the B3 visual review using the approved 14-inch MacBook reference.

**Reason:** The product requirement is about visible density and usability, not a universal pixel width.

**Status:** ✅ Resolved

---

## OD-006 — View Transition Duration

**Decision: 220ms for the main transition.**

* View exit and entry should complete within approximately 220ms.
* Use easing that feels responsive rather than cinematic.
* Respect reduced-motion preferences by removing translation and using a short fade or instant switch.

**Reason:** 250ms is acceptable, but 220ms better supports a control-room experience that should feel immediate.

**Status:** ✅ Resolved

---

## OD-007 — Files Popup Behaviour

**Decision: The file list and file preview use different presentation types.**

* Files list: fixed popup opened from Project Meta Island.
* Opened file: sticky, resizable preview session.
* Multiple file preview sessions may remain open.
* Minimised previews return to the Files section as session pills.
* The fixed file-list popup itself is not resizable.

**Reason:** This is already established in the confirmed requirements. It should no longer remain an open decision.

**Status:** ✅ Resolved

---

## OD-008 — Presentation Mode Scroll Behaviour

**Decision: Use object-aware centring with the smallest required movement.**

### Phase

* Reveal and centre the Phase horizontally in the Stage.

### Action

* Reveal the parent Phase first.
* Centre the Action within the visible Phase area.
* Avoid unnecessarily centring the whole Phase if the Action is already visible.

### Task

* Reveal the Phase and Action.
* Centre the Task within the visible Action area.
* Expanded Tasks should align as full-row objects.

### General rules

* Use smooth movement only when reduced-motion is not enabled.
* Do not reset the stage to its beginning.
* Do not move the viewport if the selected object is already comfortably visible.
* Restore card states when presentation mode ends, but do not force the old scroll position if the user manually navigated during presentation.

**Reason:** Generic `scrollIntoView({ block: "center", inline: "center" })` is too blunt for nested cards.

**Status:** ✅ Resolved

---

## OD-009 — Newly Edited State

**Decision: Use a subtle two-second change highlight.**

* Apply a brief border and soft background glow.
* Duration: approximately 2 seconds.
* No pulsing or repeated animation.
* The effect must be visually different from:

  * Selected.
  * Newly created.
  * Receiving child.
  * Readiness state.
* Trigger only after a successful saved edit, not on every keystroke.
* Respect reduced-motion preferences.

**Reason:** One second may be missed when the user closes or minimises the Editor. Two seconds remains noticeable without being distracting.

**Status:** ✅ Resolved
