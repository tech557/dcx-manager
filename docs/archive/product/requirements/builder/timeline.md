# Builder — Timeline View

**ID prefix:** BLD-TML

## Purpose ✅

Timeline is the main bottom-up planning and scheduling experience. It represents Week → Day → Task.

## Supported workflows ✅

- Creating Tasks directly inside a date
- Assigning Tasks to dates
- Reviewing weekly and monthly schedules
- Navigating across the version duration
- Moving unassigned Tasks from View Context into a Day
- Reviewing readiness by Day

## Weekly view ✅

Default Timeline view. Default stage: seven Day cards — five expanded working Day cards, two collapsed and disabled weekend Day cards.

Day cards follow the same fixed-height rules as Phase cards. Switching from Kanban to Timeline should feel like replacing Phase cards with Day cards inside the same stage.

## Monthly view ✅

Same Days and Tasks using compact view-specific representations. Days remain visible in calendar structure. Expanded Task state not available in monthly view.

## Day card behaviour ✅

- Fixed height matching Phase cards
- Expanded working days: show assigned Tasks
- Collapsed weekend days: disabled
- Task creation directly inside a Day
- Readiness indicator reflecting all assigned Tasks

## Timeline Builder Island ✅

**States:** Inactive pill / Expanded control state  
**Controls:**
- Previous period arrow
- Next period arrow
- Active week or month indicator
- Weekly/Monthly view toggle
- Add weeks control

**Synchronisation:** Island and stage are always synchronised bidirectionally.  
**No month-add control.** Only weeks are added.

## View Context Island (Timeline only) ✅

See [islands.md](islands.md) — View Context section.
