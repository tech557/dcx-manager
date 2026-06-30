---
review: OA-1 output review + card-density confirmation
sprint: OA-1
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
verdict: PASS (code) with process gaps — fade coverage partial-by-design; density gap → CC-7
---

# OA-1 Review — overflow fades + density confirmation

## Code verdict: ✅ PASS (functional)
- `src/hooks/useScrollEdge.ts` created (vertical/horizontal edge detector). ✅
- **Phase → action (vertical)**: PhaseCard uses `useScrollEdge('vertical')` → top/bottom gradient overlays on
  the action list (lines 190/193). ✅
- **Action → task (horizontal)**: HorizontalTaskFlow uses `useScrollEdge('horizontal')` → left/right gradient
  (lines 37/40). ✅

## Fade coverage (PO's confirm question) — answered
- **Actions inside a phase: ✅ DONE** (vertical fade).
- **Phase cards moving out of the stage: ❌ NOT done** — this stage→phase horizontal signal was **deferred to
  CC-6/WM-6** by design (stage-owned, not card-owned). So that half is still pending; it is not a regression,
  but it is **not yet implemented**.

## Process / quality gaps (non-blocking but must be tracked)
1. **No OA-1 output doc and no session log** — the code shipped but the sprint was not closed per §29/§33/§36
   (no `output/OA-1-*.md`, no `output/evidence/`, no executor log). Needs a back-fill close.
2. **Hardcoded `black/40` gradient** (not a theme token). The CC-2 checkpoint proposed `var(--theme-glass-bg)`.
   On the always-dark stage it reads OK, but it's a hardcoded-color literal (FP-R2/CT-1 discipline) → fix to a
   token. Track for CC-OPT or a quick token pass.

## Card density — PO observations confirmed; model now LOCKED
PO observed: ~3 phases fit the stage ✅; **3 collapsed actions do NOT fit comfortably in a phase** ❌; 3–4
collapsed tasks fit an action ✅. Verified plausible in code (collapsed action = header + task row + gap).
- Density was **not a captured requirement** and the compactness gap is **not in any later sprint**.
- **Action taken:** locked **`REQ-DENSITY-001`** (stage ~3 phases / phase ~3 actions / action ~3–4 tasks;
  overflow signaled by OA-1 but the default density must be MET by compact spacing without breaking rhythm).
- **New sprint `CC-7`** added (order 6.6) — compact action-card density to make ~3 collapsed actions fit;
  `change-component` + optional `impeccable` visual-review (G-IMPECCABLE-gated, per PO's creative recommendation).

## Recommendation
Cards are *mostly* closed: Task/Action/Phase responsive + 80%/10% height (CC-2) + overflow fades (OA-1) are
done. Remaining card items: **CC-7** (compact action density), the **OA-1 close back-fill** (output/log +
black/40→token), and the **stage→phase fade** (CC-6/WM-6). After CC-7 + those, the card discussion closes.
