# Builder — Kanban View

**ID prefix:** BLD-KAN

## Purpose ✅

Kanban is the main top-down planning and structural viewing experience. It represents Phase → Action → Task.

## Supported workflows ✅

- Creating the communication structure
- Reviewing hierarchy
- Rearranging Phases, Actions and Tasks
- Creating quick Tasks
- Viewing readiness
- Opening detailed Task editing

## Stage density ✅

Default on 14-inch MacBook at 100%: three expanded Phase cards, two to three expanded Actions per Phase, two to three collapsed Tasks per Action.

## Phase card behaviour ✅

- Remain vertically centred in the stage
- Use a consistent bounded height
- Do not increase total stage height
- Scroll internally when Actions exceed available height
- Arrange horizontally across the stage
- Horizontal stage scrolling when available width is exceeded

## Action card behaviour ✅

- Collapsed: Tasks shown in a horizontal row
- Expanded: Tasks shown in a grid
- Remains within Phase card's internal vertical layout

## Task card behaviour ✅

- Collapsed: compact item in Action layout
- Expanded: full row inside Action
- Monthly Timeline: expanded state not available

## Kanban interaction model ✅

| Interaction | Result |
|---|---|
| Single click | Selects card. For Tasks: also opens read-only popup |
| Double click | Toggles collapsed/expanded state |
| Long press on Task (400ms ⏱) | Opens Task in Editor Island |
| Drag Task to Editor Island | Opens Task in Editor Island |

Phase and Action cards: click selects only. Names editable inline.

## Kanban Builder Island ✅

**Inactive state:** Pill  
**Expanded state:** Three draggable pills — Phase, Action, Task  
**Long press on pills:** Opens template popup for that object type (V1 templates seeded, V2 library 🔮)  
**AI creation entry:** Reserved position. AI features deferred to V2. 🔮
