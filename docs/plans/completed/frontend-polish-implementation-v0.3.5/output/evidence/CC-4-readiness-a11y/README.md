# CC-4 — Readiness accessibility evidence

Route `/builder/v-1`, Kanban view, 1440×900 (Preview MCP on a clean port 3000 — stray-server
collision from CC-3 resolved). Real pointer/double-click used to collapse a phase (cards are
pointer-driven; `.click()` does not toggle — collapse is `dblclick` on the phase `<article>`).

## What was verified (live DOM, not source)

**Collapsed phase readiness marker** (`[data-testid="phase-readiness-collapsed"]`, phase-1 / AWARENESS, state `blocked`):
- `title` (hover tooltip): `Readiness: Blocked — click to view checklist`
- `aria-label` (screen reader): `Phase readiness: Blocked. Open readiness checklist.`
- `.sr-only`: `Readiness: Blocked`
- Focusable `<button>` `tabIndex=0`; `marker.focus()` → `document.activeElement === marker` (**keyboard focus reaches it**).

**Expanded phase readiness marker** (`[data-testid="phase-readiness-expanded"]`, 7 cards): identical
tooltip + aria-label text from the shared `readiness-label.ts` helpers.

**Compactness:** collapsing a phase renders the narrow vertical rail (see screenshot); the column does
not widen or overflow (column stays at the ≤260px §21 cap). CC-4 adds only a11y attributes — no layout change.

**Console:** no errors at mount or after collapse.

## Screenshot
- `builder-kanban-collapsed-phase-readiness-focus-1440.png` — phase-1 (AWARENESS) collapsed into the
  vertical rail with focus ring + readiness marker (blocked) at the bottom; other phases expanded.

## Reproduce
1. `npm run dev` (ensure port 3000 free — one clean server).
2. `/builder/v-1`, 1440×900, switch to Kanban view.
3. Double-click a phase card to collapse it.
4. Hover / Tab to the readiness marker at the bottom of the collapsed rail → tooltip + SR label expose readiness.
