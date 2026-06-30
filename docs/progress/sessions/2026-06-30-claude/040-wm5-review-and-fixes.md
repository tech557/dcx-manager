---
log: 040-wm5-review-and-fixes
session: 2026-06-30-claude
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: mixed
PO-Action: none
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: WM-5
---

# 040 — WM-5 review + error fixes

`mixed`: (a) review of WM-5 output [[036-wm5-focus-selection-keyboard-readiness]], (b) user-request-code
— fix the two errors the review surfaced.

## A. WM-5 review (audit-review)

| Area | Verdict |
|---|---|
| REQ-PRESENT-001 drill-in (descendant expand + centre) | ✅ Correct. `useStageExpansion` is additive-only now, so it won't re-collapse the presented subtree (the original bug's 2nd half). Scroll target `card-${id}` matches real DOM id. |
| Ctrl+A / C / V / Delete / Escape | ✅ Wired; Ctrl+S fires in inputs (intentional); rest guarded by `isTypingTarget`. |
| Governed deletion | ✅ delete/duplicate actions all call `assertCanRunBuilderMutation`. |
| REQ-SBC-DES-001 empty-stage-click deselect | ❌ **BUG** — see fix 1. |
| Locked-version Delete/Ctrl+V | ⚠️ **Robustness** — guard throws uncaught — see fix 2. |
| Gates typecheck/lint/test(85)/arch(275)/req:validate | ✅ re-ran, all green |
| TRC artifacts (5 × WM5) + WM-3 E02 retraction | ✅ present; WM-3 TRC `confirmation_status: retracted` with note |

## B. Errors fixed (user-request-code)

### Fix 1 — `src/builder/stage/StageCore.tsx` (REQ-SBC-DES-001)
`handleStageBackdropClick` used `e.target === e.currentTarget` on `<section id="stage-core">`, but the
inner `#stage-canvas-wrapper` (`w-full h-full`) covers the section — so the check only matched the thin
`p-2` padding edge and **never the visible canvas**. Empty-canvas clicks did not deselect.
**Fix:** deselect for any bubbled click whose target is not inside a card
(`!e.target.closest('[data-card-kind]')`). Cards (incl. day) carry `data-card-kind`, so card clicks
still short-circuit.

### Fix 2 — `src/builder/BuilderPage.tsx` (REQ-KEY-004 / KEY-003 hardening)
The Delete/Backspace and Ctrl+V loops called mutation actions whose lock guard *throws*; the keydown
handler had no try/catch, so on a locked (Approved/Ready/Superseded) version a press emitted an uncaught
console error and aborted mid-loop. **Fix:** early `if (isLocked) return;` on both mutating shortcuts +
try/catch around the loops; added `isLocked` to the effect deps so the guard can't go stale. Non-mutating
shortcuts (Ctrl+A/C, Escape) still work while locked.

## Gates
typecheck ✅ · lint ✅ (0 warn) · test 85 ✅ · (arch/req unchanged from WM-5 — no graph/arch surface touched)

## Browser verification (Preview MCP, real DOM)
Route `/builder/v-1`, observed `#stage-canvas-wrapper[data-selected-count]`:
- Ctrl+A → count **0 → 13** (select-all works)
- Click empty canvas → **13 → 0** (deselect fix works) ✅
- Re-select-all (13) → click a card → **13 → 1**, NOT 0 (card-click guard holds) ✅
- Zero console errors.

Fix 2 (locked path) is code-verified only — needs an Approved/Ready/Superseded version to exercise in a
browser; logic + gates confirm it no longer throws.

## Not fixed (flagged, not errors)
- `sprints/WM-5.md` still `Status: Drafted` while output says Completed (doc consistency).
- Escape branch comment mislabels REQ-SBC-DES-001 (cosmetic).

## Files touched
- `src/builder/stage/StageCore.tsx`
- `src/builder/BuilderPage.tsx`
