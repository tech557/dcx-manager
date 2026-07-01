Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
PO-Action: none
Version: v1.0.6.0
Change-Class: source

# Task card — hover name card, smaller collapsed date, smaller expanded card, open-editor button

## Request
PO: (1) make the hover card over a task card smaller — name only, auto-dismiss on hover-out, no
close button; (2) in the collapsed card, reduce the date font token size and keep it bold; (3) make
everything in the expanded card smaller; (4) add a button in the expanded state that opens the editor
directly when clicked (just an "enter" glyph).

## What changed

| File | Change |
|---|---|
| `TaskHoverCard.tsx` (new) | Minimal hover card: name only, floats above the card, `pointer-events-none`, 100ms fade, no close button. |
| `TaskReadOnlyPopup.tsx` | **Deleted** — replaced by the hover card (it was a click-opened, detailed, close-button popup). |
| `TaskCard.tsx` | Collapsed card now opens the hover card on `mouseenter`/`mouseleave` (was a click popup); collapsed date `dcx-3xs → dcx-4xs` (kept bold). Expanded card shrunk throughout: icon `w-6.5 → w-5` (glyph `w-4 → w-3.5`), name `dcx-xs-plus → dcx-2xs-plus`, date icons/text reduced (`dcx-2xs-plus → dcx-3xs`), padding/gap tightened. Added an **open-in-editor** button (`CornerDownLeft` glyph) that calls `setFocusedNodeId(task.id)` — the same signal the editor-drop uses. |
| `TaskProperties.tsx` | Quick-edit pins `w-[18px] → w-4`, glyphs `w-2.5 → w-2` (expanded-card only). |

## Notes
- Opening the editor reuses the existing focus signal (`setFocusedNodeId` → `useEditorState` opens the
  session) — no new editor-open path, no `builderStore`/action boundary crossing from the card.
- Clicking a collapsed card now just selects it (the detailed popup is gone); details live in the editor,
  reachable via the new button once expanded.

## Gates
| Gate | Result |
|---|---|
| `npm run typecheck` | PASS |
| `eslint` (3 files) | PASS |
| `bash scripts/verify.sh` | `verify passed` |
| `npm run test` | PASS — 92/92 |
| File-size caps (§6) | PASS — TaskCard 210, TaskHoverCard 45 |

## Browser verification (Preview MCP + Playwright, own server on :3000)
- Builder loaded clean (329 collapsed tasks), no console errors.
- Hover (trusted Playwright): hovering a collapsed task shows the small name-only card
  ("Announcement email"); moving off the card removes it (`role="tooltip"` gone). No close button.
- Expanded (double-click): renders the smaller card; open-editor button present (20×20, within the card).
- Clicking the open-editor button opens the Task Editor panel for that task (verified via screenshot —
  "TASK EDITOR / Announcement email" with its fields). Zero console errors.
</content>
