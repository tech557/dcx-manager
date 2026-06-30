# Builder — Drag and Drop

**ID prefix:** BLD-DND

## Object movement rules ✅

| Object | Movement |
|---|---|
| Phase | Horizontal across the board |
| Action | Vertical within a Phase; horizontal between Phases |
| Task | Within an Action; between Actions; to Days in Timeline |

## Drop indicator rules ✅

- Valid drop targets show when a dragged object is compatible
- Invalid drop targets: no indicator shown
- In monthly Timeline: an expanded Task can only occupy a full row; drop indicators respect this

## Hierarchy constraints ✅

- Phase can only drop into Phase drop zones (not onto Action or Task)
- Action can only drop onto Phase
- Task can only drop onto Action
- Mixed-level selection cannot be dragged as a group

## Multi-select drag ✅

Multiple cards may be dragged together when all selected cards share the same hierarchy level:
- Multiple Phases ✓
- Multiple Actions ✓
- Multiple Tasks ✓
- Mixed levels ✗

When multiple Tasks are moved: inserted into destination, internal visual order preserved.

## View Context drag ✅

Tasks dragged from View Context to a Day: date assigned, Task becomes disabled in View Context.

## Receiving-child state ✅

When a card receives a new or moved child: direct parent receives receiving-child state and must expand. Grandparent also expands but does not receive the receiving-child state.

## Edge auto-scroll ✅

- Stage supports drag-edge auto-scroll
- Horizontal scrolling when pointer held near left/right edge
- Scrolling continues while pointer remains near edge
- Edge zones are NOT shown as visible drop zones
- Actual drop indicators appear only at valid insertion targets
