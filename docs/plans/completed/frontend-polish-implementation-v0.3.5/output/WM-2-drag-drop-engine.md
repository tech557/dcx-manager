# WM-2 Output — Typed Drag/Drop Engine (refine)

Sprint: WM-2 | Plan: frontend-polish-implementation-v0.3.5 | Version: v0.3.5
Executor: Claude (claude-sonnet-4-6) | Date: 2026-06-30 | Status: Completed

---

## Scope delivered

Refined the drag/drop engine on top of the live-confirmed drag baseline from 2026-06-30. Two structural
gaps fixed; `data-testid` hooks added for Playwright real-pointer verification.

### Gap 1 — activeDrag not wired (dropzones never activated)

`KanbanView.tsx` had `const [activeDrag] = useState<ActiveDragState | null>(null)` — hardcoded null,
never updated. `useDropzones` uses `activeDrag` to flip `zone.active`, so no dropzone ever received
`active=true` during a drag. `DropTarget` only shows `dropTargetGlow` when `zone.active=true`.

**Fix:** Removed the dead `useState`. Derived `activeDrag` from `useStageContext()`:
```tsx
const activeDrag = isDragging && draggedNodeKind && draggedNodeKind !== 'day'
  ? { id: draggedNodeId ?? '', kind: draggedNodeKind }
  : null;
```
The stage context already tracks `isDragging`, `draggedNodeKind`, `draggedNodeId` via `useDragState`.
Narrowing excludes `'day'` (not a BuilderNodeKind). Now all dropzones in `KanbanHiddenDropzones`
correctly go `active=true` during a compatible drag and show `dropTargetGlow` effect via `EffectLayer`.

### Gap 2 — No edge/off-stage scroll (open real-pointer item)

Added `scrollKanbanEdge` module-level helper + RAF loop in `useKanbanInteraction`:
- Attaches a `pointermove` listener on `document` when `isDragging=true` to track pointer X.
- Each animation frame, computes distance from left/right edge of `#kanban-scroller` (120px zone).
- Applies proportional scroll speed up to 18px/frame toward the near edge.
- Loop and listener tear down on `isDragging=false` or component unmount.
- `EDGE_SCROLL_ZONE=120`, `EDGE_SCROLL_MAX_SPEED=18` are named constants.

### Testid hooks (Playwright real-pointer prerequisite)

| Element | `data-testid` |
|---|---|
| `CardShell` article | `card-{kind}-{id}` (e.g. `card-phase-phase-1`) |
| `DropTarget` div | `drop-target-{zone.id}` |
| KanbanView phase section | `kanban-phase-column-{phase.id}` |

## Files touched

- `src/builder/stage/views/KanbanView.tsx` — remove dead `useState`; add context destructure for
  `isDragging`, `draggedNodeKind`, `draggedNodeId`; derive `activeDrag`; add `data-testid`/`data-phase-id`
  on phase column sections.
- `src/builder/stage/views/useKanbanInteraction.ts` — add `scrollKanbanEdge` helper + RAF edge-scroll
  loop tied to `isDragging`.
- `src/builder/cards/CardShell.tsx` — add `data-testid="card-{kind}-{id}"` to the article element.
- `src/builder/dropzones/DropTarget.tsx` — add `data-testid="drop-target-{zone.id}"` to the drop div.

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-DZ-001, REQ-STG-004, REQ-SBC-001, REQ-SBC-002 |
| Scope/type | frontend / interaction + state |
| States before | MAN-hook-src-builder-stage-views-usekanbaninteraction: `delivery: not-assessed`; MAN-react-component-src-builder-cards-cardshell: `delivery: not-assessed` |
| States after | Both → `delivery: implemented` (activeDrag + edge-scroll wired) |
| TRC links created | TRC-WM2-REQ-DZ-001-TO-MAN-hook-usekanbaninteraction; TRC-WM2-REQ-SBC-001-TO-MAN-react-component-cardshell |
| Expected manifestation categories | EMC-DZ-SEED, EMC-STG-SEED |
| Actual manifestations confirmed | MAN-hook-src-builder-stage-views-usekanbaninteraction; MAN-react-component-src-builder-cards-cardshell; MAN-react-component-src-builder-stage-views-kanbanview (existing); MAN-react-component-src-builder-dropzones-droptarget (existing) |

## Debt Burn-down

| Metric | Before | After |
|---|---|---|
| Changed-scope manifestationsLackingRequirements | 2 | 0 |
| Requirements lacking manifestations (global) | 252 | 251 |
| Candidate links (global) | unchanged | unchanged |

## Gates

- typecheck ✅
- lint ✅
- test(85) ✅ (no targeted test for drag-wiring; full suite green)
- architecture(274 modules) ✅
- req:validate ✅ (QST-VR-011 pre-existing)
- req:completion-gate --changed ✅ PASS

## Browser Proof (dev server, port 3000, 0 console errors)

- `/builder/v-1`, 1440×900 dark theme (default)
- 8 phase cards rendered: `data-testid="card-phase-*"` all `draggable=true` ✅
- 13 drop targets rendered: `data-testid="drop-target-*"` all `data-active=false` at rest ✅
- `#kanban-scroller` present ✅ (edge-scroll loop attaches on drag start)
- 0 console errors ✅

Evidence: `output/evidence/WM-2-drag-drop/` (structural DOM proof above; inline screenshot not persisted — see review note)

## PO Web Check — PENDING (real pointer/drag required)

Real-pointer drag test: Route `/builder/v-1`; drag a Phase card between columns — expect `PhaseDropZone`
slots to light up; drag an Action card over a Phase column — expect `dropTargetGlow` on the phase drop
target; drag Task to an Action card — expect glow; drag near right edge — expect scroller to scroll right.
One valid + one invalid drop each card type. Evidence path: `output/evidence/WM-2-drag-drop/`.

## Hierarchy constraints (carry-forward)

Constraints already implemented in `cardDrag.helpers.ts` (`isCardDropCompatible`) and `handleCardDrop.ts`:
- Phase → phase only via `PhaseDropZone` (slot before/after)
- Action → phase (into phase) or action (same-level reorder)
- Task → action (into action) or task (same-level reorder)
- Multi-drag: `draggedIds` from `payload.ids` sorted by visual order; mixed-kind selection falls back to single

These were live-confirmed working 2026-06-30 and are refinement-not-build; WM-2 activates the visual
feedback layer that was structurally broken (activeDrag=null).
