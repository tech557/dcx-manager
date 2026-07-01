Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
PO-Action: none
Version: v1.0.13.0
Change-Class: source

# Fix: dropping a new phase between phases did nothing (no phase created)

## The bug (PO-reported)
Dragging the "Phase" creator-palette item and dropping it on the insert-zone between two phases showed
the dropzone but created no phase.

**Root cause:** the palette item drags a `create: true` payload (`id: "new:phase"`), but
`PhaseDropZone.handleDrop` unconditionally called `actions.movePhases({ ids: payload.ids, ... })`.
`movePhases` looks each id up in `nodes`, finds no node with id `new:phase`, and returns unchanged —
so the drop silently no-op'd. It never checked the `create` flag (unlike the board-drop handler, which
does — but that one only appends at the end, with no index).

## Fix
| File | Change |
|---|---|
| `PhaseDropZone.tsx` | `handleDrop` now checks `payload.create`: if set, `createPhase({ versionId })` then `movePhase({ id, toIndex: index })` to drop it into the between-phases slot. Existing-phase reorder path (`movePhases`) unchanged. Added a `versionId` prop. |
| `KanbanView.tsx` | Passes `versionId` to both `PhaseDropZone` instances. |

## Verification (Preview MCP)
- On v-1 (Ready-for-Approval = locked) the drop now throws `createPhase cannot run while builder is
  locked` — proving the create branch is reached (the old code went to `movePhases`, which silently
  no-op'd). Lock is an orthogonal governance guard.
- On an editable duplicate (v-930, Draft): simulated a palette "Phase" create-drag dropped on the
  between-phases dropzone (`phase-drop-zone-1`) → phase count **14 → 15** (`createdBetween: true`).
- `npm run typecheck` PASS.

## Note
Same latent bug likely exists in `ActionDropZone` / `TaskDropZone` (they also call `moveActions`/
`moveTasks` for a `create` payload) — not reported yet, so out of scope here; flag for a follow-up.

## Environment
Committed ONLY `PhaseDropZone.tsx` + `KanbanView.tsx` + this log via `git commit -o` — the concurrent
sessions' backend work (api-client / supabase / telemetry) is excluded. See
[[concurrent-session-shares-checkout]].
</content>
