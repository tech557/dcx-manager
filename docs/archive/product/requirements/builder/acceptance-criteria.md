# Builder V1 — Acceptance Criteria

This document defines the observable conditions that confirm V1 is complete.

## File preview ✅ BLD-FIL-001
- [ ] File preview accessible from Project Meta Island → Files section
- [ ] Files: fixed popup listing all attachments
- [ ] Opened file: sticky resizable persistent session
- [ ] Multiple file sessions supported
- [ ] Minimise/restore as session pills
- [ ] View Context contains zero file preview functionality
- [ ] No regression from ViewHelperIsland migration

## Card interaction model ✅ BLD-CRD-INT-002
- [ ] Single click on Task: selects AND opens read-only popup
- [ ] Double click: toggles expand/collapse; popup unaffected
- [ ] Popup open + card expanded: coexist without conflict
- [ ] Closing popup does not affect expanded state
- [ ] CardShell supports independent interaction layers

## Card states
- [ ] Newly created: highlight, temp select, auto-deselect
- [ ] Newly edited: brief visual feedback after editor save
- [ ] Receiving-child state: parent shows on drop
- [ ] Disabled state: visible but non-interactive

## Editor Island
- [ ] Long press (400ms hold, 8px movement cancel) on Task opens editor session
- [ ] Drag Task to Editor opens editor session
- [ ] Editor multi-session: display up to 5 directly, with horizontal scrollable overflow if > 5 open (no hard limit ✅ BLD-EDT-002 / OD-001)
- [ ] Minimised sessions shown as pills
- [ ] Clicking pill restores session
- [ ] Unsaved sessions never silently replaced ✅

## Selection Island
- [ ] Presentation mode: collapse unrelated, centre, restore on exit
- [ ] Single selection only for V1 (⏱ TA-003)
- [ ] Delete confirmation: multi-select or ready objects

## Focus Island
- [ ] Applied filter badge on collapsed pill
- [ ] AND/OR toggle when 2+ filters active
- [ ] Default AND ✅

## View Context ✅
- [ ] Shows unassigned Tasks as active (draggable)
- [ ] Shows assigned Tasks as visible but disabled
- [ ] Drag-to-Day assigns date
- [ ] Task disabled in View Context after assignment
- [ ] Zero file preview in View Context

## User Island
- [ ] Close Builder with exit protection (Save/Discard/Cancel)
- [ ] Autosave toggle, progress, manual save
- [ ] Import/export

## Project Meta Island ✅ BLD-FIL-001
- [ ] Team popup with team member info
- [ ] Files popup (fixed list) with preview sessions (sticky resizable)

## Timeline Builder Island
- [ ] Week navigation synced with stage
- [ ] Weekly/Monthly view toggle
- [ ] Add weeks control
- [ ] No Add Month control

## Loading
- [ ] Skeleton loading shell — no text placeholder
- [ ] No layout jump on data arrival
- [ ] Error state with retry button

## Readiness
- [ ] Readiness calculated at Task, Action, Phase, Day, Version level
- [ ] Readiness indicators visible on all card types

## Views and navigation
- [ ] Kanban density correct on 14-inch MacBook
- [ ] Timeline weekly/monthly with Day readiness
- [ ] View transition animation
- [ ] Stage does not reset context on view switch

## Drag and drop
- [ ] Phase/Action/Task hierarchy enforced
- [ ] Multi-select drag (same level) works
- [ ] Drag-to-Day from View Context assigns date
- [ ] Edge auto-scroll
- [ ] Receiving-child state on drop

## Quality gates
- [ ] npm run typecheck — 0 errors
- [ ] All existing tests pass
- [ ] Pixel-perfect review complete (light + dark mode)
- [ ] All open decisions (❓) logged — not silently decided

## V2 deferred (not in this plan) 🔮
- AI creation and templates
- Real-time collaboration / presence
- Analytics and monitoring
- Freeform view
- Multi-selection presentation mode
