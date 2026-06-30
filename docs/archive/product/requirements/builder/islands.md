# Builder — Island System

**ID prefix:** BLD-ISL

## Island purpose ✅

Islands are the workspace controls surrounding the stage. They may contain static information, child features, open sessions, or applied effects.

## Island presentation patterns ✅

Three patterns used consistently:

| Pattern | Behaviour |
|---|---|
| Inline expansion | Expands within the island. Does not overlap the stage. |
| Fixed popup | Opens in relation to triggering element. Consistent popup design. Close control. |
| Resizable sticky popup | Floats above stage. Resizable. Minimisable. Preserves context when minimised. Returns to island as pill when minimised. |

## Island states ✅

**Collapsible islands:** when collapsed, represent active child features, applied effects, open sessions.  
**Always-open islands:** child controls remain visible; no separate summary needed.

## Child-feature states ✅

| State | Meaning |
|---|---|
| Inactive | Not currently in use |
| Active | Currently being used |
| Applied | Continues affecting the stage after interaction ends |
| Disabled | Not available in current context |

Multiple child features may be active or applied simultaneously.

---

## Brand Island ✅

Represents current brand identity and context. No collapsed/applied states needed unless interactive Brand features are added.

---

## Project Meta Island ✅ BLD-FIL-001

Contains version and session information available before the working session begins.

### Team ✅
Fixed popup showing team member names and information.

### Files ✅ BLD-FIL-001
Fixed popup listing all project files.

Opening a file:
- Loads from Google Drive
- Opens in a **resizable sticky popup** (persistent session)
- Session preserved while user works
- File can be minimised → returns as session pill in Files area
- Multiple file sessions may remain available

**File list popup:** Fixed. Always shows all files.  
**File preview session:** Sticky, resizable, minimisable. Multiple sessions allowed.

This functionality was migrated from ViewHelperIsland. View Context contains zero file preview logic.

---

## User Island ✅

Includes:
- Close Builder
- Autosave progress indicator
- Enable/disable autosave toggle
- Manual save
- Import current version from local file
- Export current version locally
- Toggle light and dark mode

**Exit protection:** When closing with autosave disabled and unsaved changes exist: Save / Discard / Cancel prompt required.

---

## Editor Island ✅

### Scope
Currently used for Tasks only. Phase and Action editing is limited to inline name changes.

### Opening
- Long press on Task (400ms hold, 8px movement cancel)
- Dragging Task to Editor Island
- Double click does NOT open editor (it toggles collapse/expand)

### Multi-session model ✅

- Opening a Task creates an editor session
- Unsaved changes preserved when switching sessions
- Unsaved sessions must never be silently replaced or discarded ✅
- No hard product limit on sessions in V1 (display up to 5 directly, with horizontally scrollable overflow when more than 5 are open ✅ BLD-EDT-002 / OD-001)
- Minimising returns open Tasks as round session pills
- Clicking a pill restores that Task's editing context
- Session persists until user saves / discards / clears

---

## Kanban Builder Island ✅

See [kanban.md](kanban.md) for full details.

---

## Timeline Builder Island ✅

See [timeline.md](timeline.md) for full details.

---

## View Context Island ✅ (Timeline only)

### Purpose
Provides an interactive Kanban context inside Timeline for Tasks without communication dates.

### Task display ✅
- **Unassigned Tasks (date.mode === 'unset'):** shown as active, draggable
- **Assigned Tasks (date set):** shown as visible but disabled — NOT filtered out ✅

### Task assignment ✅
User drags Task from View Context onto a Day:
- Day's date is assigned as Task's communication date
- Task becomes disabled in View Context
- Task cannot be reassigned unless its date is cleared

### Presentation ✅
- Resizable sticky popup
- Overlays stage (does not shift cards)
- Minimisable → returns to island pill

### Zero file preview ✅ BLD-FIL-001
View Context contains no file preview functionality.

---

## Selection Island ✅

### Summary ✅
Shows number of selected objects and their type when all share the same type.

### Presentation action ✅
Clicking selection count triggers temporary presentation mode (V1: single selection only ⏱ / TA-003).

### Duplicate action ✅
Preserves order. Uses newly-created behaviour. Same parent context.

### Delete action ✅
Confirmation required when: more than one object selected, or a ready Phase/Action/Task is being deleted.

### Clearing focus ✅
Applied Focus filters cleared from Selection Island.

---

## Focus Island ✅

### Categories ✅
- Week
- Phase
- Action
- Task Properties

### Phase and Action focus ✅
Fixed selection popups. One or more values selectable.

### Task Property focus ✅
Nested inline pills. A property pill shown only when ≥1 Task has a valid value for that property. Each pill opens a reusable fixed selection popup showing only values present in the current version.

### Multiple filter rules ✅
- Default: AND
- When 2+ filters active: global AND/OR toggle appears
- Applied state persists on collapsed island pill (count badge)
- Applied Focus cleared from Selection Island
