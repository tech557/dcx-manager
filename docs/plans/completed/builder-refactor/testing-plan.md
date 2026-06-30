# Builder Refactor — Testing Plan

## Automated checks (run after every task)

```bash
npm run typecheck    # must pass — 0 errors
npx vitest run       # run when test files are included in the task — package.json has no "test" script
```

## Manual browser checks (run after each sprint)

### After B0
- Focus Island opens and closes (local state, not context)
- Editor column still animates between 4.5rem and 25rem

### After B-FIL
- Files area in MetadataIsland: clicking Paperclip opens file list popup
- Local file input opens preview in StickyPopupShell
- Remote URL opens preview in StickyPopupShell
- ViewHelperIsland expanded: no file preview, no location jumper, no keyboard shortcuts

### After B-CRD
- Task single click: popup opens AND card selected
- Task double click: expand toggles AND popup stays open
- Task long press 400ms: editor opens
- Phase single click: selects, no popup
- Existing drag-drop: create Phase, Action, Task — drag each
- BLD-CRD-INT-002 confirmed by combining popup + expand simultaneously

### After B1
- Navigate to /builder/v-1 with network throttled
- Skeleton renders in three-row layout
- No "Preparing workspace" text
- No layout shift when data arrives

### After B5
- Open two tasks in editor
- Minimise first — pill appears
- Open third task — second session active
- Click pill — first session restores with unsaved draft intact
- Attempt to open 6th task — error message, no silent replace

### After B6
- Select 1 card → click count → presentation mode
- Unrelated cards collapse
- Exit → all previous states restored exactly
- Select 3 tasks → delete → confirmation shows

### After B8
- In Timeline: ViewHelperIsland pill visible
- Expand: shows task list grouped by Phase > Action
- Unassigned tasks active (draggable)
- Assigned tasks visible but greyed (not draggable)
- Drag unassigned task to Day: date assigned, task greyed in View Context
- No file preview in ViewHelperIsland

### After B12
Full visual review (see visual-validation.md)

## Test files to maintain

| File | Must pass after |
|---|---|
| `builder/cards/__tests__/handleCardDrop.test.ts` | B-CRD |
| `builder/cards/__tests__/cardDrag.helpers.test.ts` | B9 |
| `builder/cards/__tests__/useCardEffects.test.ts` | B-CRD |
| `builder/import/__tests__/import.helpers.test.ts` | Every sprint |
