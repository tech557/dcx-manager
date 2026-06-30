# Builder Refactor — Visual Validation Checklist

Run this full checklist after B12. Capture screenshots at each step.

## Scenarios

| Scenario | Screen | Verify |
|---|---|---|
| Empty version | 14-inch MacBook 1440×900 | Empty state, no layout issues, skeleton→live no jump |
| 3 expanded phases, 2 actions, 3 tasks each | 14-inch MacBook | Default density without horizontal scroll |
| Editor open, 3 phases visible | 14-inch MacBook | Stage narrows correctly, phases accessible |
| Task single click | Any | Popup appears, card selected, expand unaffected |
| Task double click with popup open | Any | Expand toggles, popup stays open |
| Task long press 400ms | Any | Editor session opens |
| 2 editor sessions, 1 minimised | Any | Pills appear, restore works |
| 6th session attempt | Any | Error message, no silent replacement |
| Presentation mode | Any | Collapse unrelated, centre, restore on exit |
| Files popup from MetadataIsland | Any | File list visible, preview opens |
| File preview session minimised | Any | Pill appears, restore opens preview |
| Focus filter applied, collapsed | Any | Count badge on pill |
| AND/OR toggle with 2 filters | Any | Toggle appears, default AND |
| View Context in Timeline | Any | Unassigned tasks active, assigned tasks visible+disabled |
| Drag task from View Context to Day | Timeline | Date assigned, task greyed in View Context |
| No file preview in View Context | Timeline | Confirmed absent |
| Drag phase to distant position | Kanban | Edge scroll, correct drop |
| Multi-select 3 tasks, drag | Kanban | All 3 move in order |
| View switch Kanban → Timeline | Any | Smooth directional animation, selection preserved |
| Day with incomplete tasks | Timeline | Readiness indicator |
| Loading state | Any | Skeleton, no text, no layout jump |
| Light mode | All above | All elements legible and consistent |
| Dark mode | All above | All elements legible and consistent |
| Large version (10+ phases) | Any | Performance acceptable, scroll works |

## Screenshot capture points

| After sprint | Capture |
|---|---|
| B3 | Kanban default density at 1440px |
| B-CRD | Task popup open + card expanded simultaneously |
| B-FIL | MetadataIsland Files popup with file preview session |
| B5 | Editor with 2 sessions, 1 minimised (pills visible) |
| B6 | Presentation mode active |
| B8 | View Context open in Timeline showing task list |
| B12 | Full builder: light mode and dark mode |
