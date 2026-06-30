---
sprint: CC-4
plan: frontend-polish-implementation-v0.3.5
executor: Claude (claude-opus-4-8)
date: 2026-06-30
status: Completed
---

# CC-4 — Readiness accessibility (tooltip + aria-label for collapsed Phase readiness)

## What was built
Per FP-R5 §CC-4 (REQ-RDY-001, REQ-FP-D11): the collapsed Phase readiness marker now exposes its
readiness state to **hover (tooltip)** and **screen readers (aria-label)**, and is keyboard-focusable.
The same treatment is mirrored on the expanded marker for consistency. Readiness **computation** is
untouched (stays in `rules/readiness.rules.ts` via `useCardBehavior`) — out of scope (WM-5).

1. **Shared readiness labels (new canonical home).** `readiness-label.ts` defines `READINESS_LABEL`
   (`ready`/`incomplete`/`blocked`/`empty` → human text) plus `readinessAriaLabel()` (screen-reader
   text) and `readinessTooltip()` (hover text). Single source so the collapsed/expanded markers and the
   badge never disagree about how a state is described.
2. **Collapsed phase readiness marker** (`[data-testid="phase-readiness-collapsed"]`): `title` =
   `readinessTooltip(state)`, `aria-label` = `readinessAriaLabel(state)`, plus a `focus-visible` ring.
3. **Expanded phase readiness marker** (`[data-testid="phase-readiness-expanded"]`): same a11y text.
4. **PhaseReadinessBadge** sr-only text now sourced from `READINESS_LABEL` (was an ad-hoc
   "Phase or day is {state}" string).

G-IMPECCABLE mode: **direct `dcx-frontend-refactor` route** (component/a11y, not brand-design).

## Changes
| File | Change |
|---|---|
| `src/builder/cards/templates/phase/readiness-label.ts` | **New** — `READINESS_LABEL` map + `readinessAriaLabel`/`readinessTooltip` helpers. |
| `src/builder/cards/templates/phase/readiness-label.test.ts` | **New** — 3 unit tests (label coverage + aria/tooltip text). |
| `src/builder/cards/templates/phase/PhaseCard.tsx` | Collapsed + expanded readiness buttons: `aria-label` + readiness-bearing `title` + `data-testid` + `focus-visible` ring. |
| `src/builder/cards/templates/phase/PhaseReadinessBadge.tsx` | sr-only text sourced from `READINESS_LABEL`. |

## Requirement Trace
| Field | Value |
|---|---|
| Graph IDs | REQ-RDY-001 (shared readiness display), REQ-FP-D11 (collapsed tooltip + aria-label) |
| States | REQ-FP-D11 + REQ-RDY-001 `delivery: not-assessed → implemented`; MANs PhaseCard, PhaseReadinessBadge, readiness-label, readiness-label-test → `implemented`. Evidence node binds CC-4 browser a11y proof to AC-RDY-SEED (`verified`). |
| New MANs | `MAN-function-...-readiness-label`, `MAN-test-...-readiness-label-test` |
| New TRCs | `TRC-CC4-REQ-FP-D11-TO-MAN-...-phasecard` (complete), `...-phasereadinessbadge` (partial), `...-readiness-label` (complete); `TRC-CC4-REQ-RDY-001-TO-MAN-...-phasereadinessbadge` + `...-readiness-label` (partial); `TRC-CC4-MAN-test-...-readiness-label-test-VERIFIES-REQ-FP-D11` |
| New evidence | `EVD-cc4-readiness-a11y-1782833731000` → AC-RDY-SEED (`verified`) |

## Requirement Debt Burn-down
- Changed-scope `manifestationsLackingRequirements`: **3 → 0** (PhaseReadinessBadge, readiness-label, readiness-label-test now linked).
- Acceptance outcomes without evidence (global): 27 → 26 (AC-RDY-SEED bound).
- `req:completion-gate --changed`: ✅ PASS · `req:validate`: ✅ PASS (QST-VR-011 pre-existing).

## Gates
- typecheck ✅ · lint ✅ · **test 85** ✅ (82 prior + 3 new targeted; `readiness-label.test.ts` passes) · architecture(273) ✅
- `req:validate` ✅ · `req:completion-gate --changed` ✅ · changed-scope reconcile ✅ (0 unlinked)
- **Browser/visual a11y proof ✅ (Preview MCP, clean port 3000):** confirmed in live DOM at
  `/builder/v-1` Kanban 1440×900 — collapsed marker (phase-1, `blocked`) `title`/`aria-label`/`sr-only`
  correct, keyboard focus reaches it (`activeElement === marker`); 7 expanded markers identical text;
  no console errors; collapse renders the compact vertical rail without overflow.

## Evidence
`output/evidence/CC-4-readiness-a11y/` — `README.md` (DOM assertions + repro) + screenshot
`builder-kanban-collapsed-phase-readiness-focus-1440.png`.

## Carry-forward / open
- **CC-3 minor debt (stray :3000 server) resolved** — the Preview MCP worked on a clean port this
  session. CC-3 enable-on-select **positively confirmed live** (editor pill enabled + selection-aware
  title "Open editor for selected card" with a phase selected); routing single-column stays
  source-confirmed (`grid-cols-1`).
- **Canonical home (reuse):** all phase readiness presentation text comes from `readiness-label.ts`
  (`READINESS_LABEL` / `readinessAriaLabel` / `readinessTooltip`). Do not inline readiness strings.
- Readiness *computation* unchanged (WM-5 owns wiring).
