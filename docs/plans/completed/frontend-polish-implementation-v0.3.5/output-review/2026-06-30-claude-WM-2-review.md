---
review: WM-2 output review
sprint: WM-2
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
verdict: PASS — correct real-bug fix; 1 evidence-claim mismatch; real-pointer drag still to verify
---

# WM-2 Review — typed drag/drop engine (refine)

## Verdict: ✅ PASS — strong sprint, fixed a genuine bug
WM-2 correctly diagnosed and fixed the exact symptom I observed in the 2026-06-30 stress test (drops
reparented, but `dropTargetsActivatedDuringDrag: 0` — no glow). Verified in code.

## Verified in code
- **Gap 1 (the real bug):** `KanbanView` had `const [activeDrag] = useState<ActiveDragState|null>(null)` —
  hardcoded null, never updated → `useDropzones` never set `zone.active=true` → `DropTarget` never showed
  `dropTargetGlow`. **Fix confirmed:** dead `useState` removed; `activeDrag` derived from `useStageContext()`
  (`isDragging && draggedNodeKind !== 'day'`). Now dropzones activate + glow during a compatible drag. ✅
  (This is precisely why my earlier live test saw drops work but no active glow — accurate diagnosis.)
- **Gap 2 (edge/off-stage scroll):** `scrollKanbanEdge` helper (`EDGE_SCROLL_ZONE=120`, `MAX_SPEED=18`,
  proportional) + document `pointermove` + RAF loop in `useKanbanInteraction`, torn down on `isDragging=false`. ✅
- **data-testid hooks:** `card-{kind}-{id}` (CardShell), `drop-target-{zone.id}` (DropTarget),
  `kanban-phase-column-{id}` — enables future Playwright real-pointer verification. ✅
- Hierarchy constraints + multi-drag already in `cardDrag.helpers`/`handleCardDrop` (live-confirmed prior);
  WM-2 correctly framed itself as activating the dead feedback layer, not rebuilding.

## Gates / debt
typecheck ✅ · lint ✅ · test(85) ✅ · architecture(274) ✅ · req:validate ✅ · completion-gate ✅ · changed-scope unlinked 2→0.

## Notes
1. **Evidence-claim mismatch:** output cites `builder-dark-1440.png` "captured during session" but the
   `output/evidence/WM-2-drag-drop/` dir is **empty** — the PNG didn't persist (recurring inline-image issue).
   The structural DOM proof in the output (8 draggable cards, 13 drop-targets `active=false` at rest,
   `#kanban-scroller` present, 0 console errors) stands; save the PNG or drop the claim.
2. **Real-pointer drag NOT yet visually verified** (the one genuinely-open behavior): drop-target **glow on
   drag** + **edge-scroll** need a real-pointer drag. The drop *move* was confirmed earlier; the *glow* is
   newly wired and structurally sound but unproven visually. Now automatable via the new data-testids once a
   Playwright-reachable dev server exists (env-hygiene memory).

## Recommendation
Keep WM-2. Ready for **WM-3** (editor open paths + sessions). The drag-glow + edge-scroll real-pointer check
is the highest-value live verification to batch when the Playwright/preview path is reliable.
