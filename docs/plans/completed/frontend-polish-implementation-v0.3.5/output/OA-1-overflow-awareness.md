---
sprint: OA-1
plan: frontend-polish-implementation-v0.3.5
executor: Claude (claude-sonnet-4-6)
date: 2026-06-30
status: Completed (back-filled 2026-06-30 by Claude/claude-sonnet-4-6 per session 024 review)
---

# OA-1 — Overflow / Spatial-Awareness Gradient Fades

## What was built
Introduced `useScrollEdge` — a shared scroll-edge detection hook (vertical + horizontal axes,
reduced-motion safe) — and wired it into the two in-scope scroll containers:

| Container | Axis | Signal | Gradient overlay |
|---|---|---|---|
| PhaseCard action list | vertical | `startFade` / `endFade` | top (`from-black/40`) / bottom (`from-black/40`) |
| HorizontalTaskFlow task row | horizontal | `startFade` / `endFade` | left (`from-black/40`) / right (`from-black/40`) |

## Requirement Trace
| Field | Value |
|---|---|
| Graph IDs | REQ-FP-CMA-003 (primary), REQ-SBC-004 (action card) |
| Scope/type | frontend / ui-presentation (overflow awareness) |
| States | `REQ-FP-CMA-003` delivery `not-assessed → implemented` (partial — stage→phase fade still deferred) |
| Expected manifestation categories | EMC-IFX-SEED |
| Actual manifestations | `MAN-hook-src-hooks-usescrolledge` (new); `MAN-react-component-src-builder-cards-templates-phase-phasecard` (pre-existing, updated); `MAN-react-component-src-builder-cards-templates-phase-horizontaltaskflow` (pre-existing, updated) |
| TRC links | `TRC-OA1-REQ-FP-CMA-003-TO-MAN-hook-usescrolledge` (implements, partial) |

## Fade coverage answer (confirmed in session 024)
- **Actions inside a phase: ✅ DONE** — vertical fade on PhaseCard's action-list scroll container.
- **Phase cards out of stage: ❌ NOT done** — stage→phase horizontal signal deferred to CC-6/WM-6 by design
  (stage-owned, not card-owned). Not a regression.

## Known debt (tracked, non-blocking)
- Gradient colour `from-black/40` is a hardcoded literal (FP-R2/CT-1 discipline). CC-2 checkpoint proposed
  `var(--theme-glass-bg)`. Fixed as part of CC-7 (same files, same session).

## Requirement Debt Burn-down
- Changed-scope `manifestationsLackingRequirements`: 1 → 0 (useScrollEdge MAN node created + linked).
- `req:completion-gate --changed`: ✅ PASS.
- `req:validate`: ✅ PASS (QST-VR-011 pre-existing).

## Gates
- typecheck ✅ · lint ✅ · test(82) ✅ · architecture(272) ✅
- `req:validate` ✅ · `req:completion-gate --changed` ✅
- Browser smoke ✅ (no JS errors at 1280px)
- Real-pointer PO Web Check ⚠ BLOCKED (§28/§29a): phase expand requires real pointer; mock data has
  1 action/phase — PO must verify manually with ≥5 actions expanded and scrolled.

## Evidence
`output/evidence/OA-1-overflow-awareness/builder-smoke-1280.jpeg`
