# Builder — Card Behaviour

**ID prefix:** BLD-CRD

## Card types ✅

- Phase
- Action
- Task
- Day

The same object may be represented differently depending on view (e.g. a Task appears as a Kanban tile, a weekly Day task, a compact monthly task, or a disabled View Context item). Object identity and data are the same across all representations.

## Card states — all independent dimensions ✅

States may coexist. A card can be simultaneously expanded, selected, with children expanded, and newly edited.

| Dimension | Values |
|---|---|
| Display | Collapsed / Expanded |
| Interaction | Default / Selected / Disabled |
| Children | All collapsed / All expanded / Mixed |
| Change feedback | None / Newly created / Newly edited |
| Receiving | None / Receiving child |
| Presentation override | Normal / Selection presentation mode |

## Disabled state ✅

A disabled card:
- Remains visible
- Cannot be used for interactions not allowed in that context
- Retains its identity and applicable readiness information
- May still be selected or inspected when the related experience allows it

Examples: weekend Day cards, Tasks already assigned in View Context.

## Newly created state ✅

When a card is created:
1. Receives newly-created visual feedback
2. Is brought into view
3. Is temporarily selected
4. Is then automatically deselected
5. Temporary visual feedback remains for its defined duration

When multiple objects are created: stage reveals them sequentially from first to last.

## Newly edited state ✅

Tasks that have been saved from the editor receive a brief newly-edited visual feedback.

## Receiving-child state ✅

When a card receives a new or moved child:
- The direct parent receives the receiving-child state
- The direct parent must be expanded
- The grandparent, when present, must also be expanded
- The grandparent does NOT receive the receiving-child state
- This is not represented through a generic active state

## Independent popup and expanded state ✅ BLD-CRD-INT-002

Task popup and expanded card state are independent systems:
- Single click → opens read-only popup (and selects card)
- Double click → toggles expanded state (popup state unaffected)
- Both can be active simultaneously
- Closing one does not affect the other
- Popup is a presentation layer
- Expanded state is a card state

## Presentation override ✅

The Selection Island can place a selected card into temporary presentation mode:
- Required ancestors expand
- Unrelated cards collapse
- Stage centres the selected object (object-specific centring)
- Previous card states are preserved
- All temporarily changed cards return to their exact previous states when presentation mode ends

## State ownership clarification ✅

| State | Owner |
|---|---|
| Popup open/closed | Task presentation layer (TaskCard) |
| Card expanded/collapsed | Shared card state (expandedNodeIds in StageProvider) |
| Editor sessions | Editor Island (EditorViewerIsland) |
| CardShell interaction events | CardShell (exposes onClick, onDoubleClick, onLongPress as shared events) |
