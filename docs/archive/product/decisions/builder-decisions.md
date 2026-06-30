# Builder — Approved Product Decisions

These decisions are confirmed and locked for V1 execution. They cannot be changed without a formal product decision.

| ID | Decision | Confirmed | Notes |
|---|---|---|---|
| BLD-FIL-001 | File preview kept and relocated to Project Meta Island → Files | ✅ June 2026 | View Context has zero file preview |
| BLD-CRD-INT-002 | Task popup and expanded card state are independent systems | ✅ June 2026 | Neither closes or prevents the other |
| BLD-OVR-001 | AI creation and templates deferred to V2 | ✅ June 2026 | 🔮 |
| BLD-EDT-001 | Unsaved editor sessions must never be silently replaced or discarded | ✅ June 2026 | |
| BLD-VCX-001 | View Context shows both unassigned (active) and assigned (disabled) Tasks | ✅ June 2026 | Assigned Tasks are visible but not draggable |
| BLD-FOC-001 | Multiple focus filters default to AND | ✅ June 2026 | OR toggle appears when 2+ filters active |
| BLD-SLC-001 | Presentation mode: V1 supports single selection only | ⏱ Temporary | Multi-selection deferred to V2 |
| BLD-EDT-002 | No hard product limit on editor sessions in V1; display up to 5 session pills directly, horizontally scrollable overflow. Opening another session must never replace or discard an existing session. | ✅ June 2026 | OD-001 |
| BLD-RED-001 | Empty Day is neutral / empty, not ready. It does not reduce Version readiness. 3 semantic states: ready, incomplete, empty. | ✅ June 2026 | OD-002 |
| BLD-CRD-INT-003 | Use 8px movement tolerance to cancel long press (which triggers at 400ms). Cancel immediately on native drag or pointer release. | ✅ June 2026 | OD-003 |
| BLD-CRD-INT-004 | Responsive anchored popup: width 280-360px (preferred 320px), content-based height. Anchors beside selected Task, flips near edges, centers/bottoms on narrow screens. Independent from Task expanded state. | ✅ June 2026 | OD-004 |
| BLD-CRD-INT-005 | Fluid card dimensions with density targets and minimum widths. Phase: target 3 columns on 1440px wide (pref 360-400px, min 340px, scroll below target). Action: follows Phase width, supports grid or single horizontal row. Task: compact content-driven, expanded full row. | ✅ June 2026 | OD-005 |
| BLD-MOT-001 | View exit/entry transitions (Kanban <-> Timeline) complete within 220ms using responsive easing. Respects reduced-motion preferences with short fade or instant switch. | ✅ June 2026 | OD-006 |
| BLD-FIL-002 | Files list uses fixed popup from Project Meta Island (not resizable). Opened file uses sticky, resizable preview session (multiple can stay open). Minimised previews return as session pills. | ✅ June 2026 | OD-007 |
| BLD-SLC-002 | Presentation mode uses object-aware centering with the smallest required movement (Phase horizontally centered; Action parent first then Action; Task parent and Action first then Task). Respects reduced motion, do not reset stage, restore states on end. | ✅ June 2026 | OD-008 |
| BLD-CRD-INT-006 | Subtle two-second change highlight (border and soft background glow) after saved edit. No pulsing. Distinct from selected, newly created, receiving child, or readiness. Respects reduced motion. | ✅ June 2026 | OD-009 |

## Temporary Assumptions (labelled ⏱)

These are valid for V1 execution but must be revisited:

| ID | Assumption | Default | Review trigger |
|---|---|---|---|
| TA-001 | Long-press duration | 400ms | User testing |
| TA-003 | Presentation mode scope | Single selection | After V1 ships |
