---
review: CC-4 output review
sprint: CC-4
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
verdict: PASS — best-evidenced sprint yet; ready for CC-5
---

# CC-4 Review — readiness accessibility (tooltip + aria-label)

## Verdict: ✅ PASS
Clean, well-tested, and the **first sprint with real browser evidence** (the env-hygiene fix from the prior
turn worked — Preview MCP ran on a clean port 3000).

## Verified in code
- **`readiness-label.ts` (new canonical home):** typed `READINESS_LABEL` (ready/incomplete/blocked/empty) +
  `readinessAriaLabel()` ("Phase readiness: X. Open readiness checklist.") + `readinessTooltip()`. Documented
  "do not inline" — single source so markers + badge never disagree. ✅
- **PhaseCard:** collapsed marker (`data-testid="phase-readiness-collapsed"`) + expanded marker get
  `aria-label` + readiness-bearing `title` + `focus-visible` ring; keyboard-focusable. ✅ (REQ-FP-D11)
- **PhaseReadinessBadge:** sr-only text now sourced from `READINESS_LABEL` (was ad-hoc). ✅
- `readiness-label.test.ts` (3 tests) present; readiness **computation** untouched (stays in
  `rules/readiness.rules.ts` via `useCardBehavior` — §5 boundary respected). ✅

## Gates / evidence
- typecheck ✅ · lint ✅ · **test 85** (82+3) ✅ · architecture(273) ✅ · req:validate ✅ · completion-gate ✅.
- Debt burn-down: changed-scope unlinked manifestations **3 → 0**; **first `verified` evidence binding**
  (`EVD-cc4-…` → AC-RDY-SEED). Acceptance-without-evidence 27 → 26.
- **Real browser a11y proof** (DOM assertions: title/aria-label/sr-only correct, `activeElement === marker`
  on keyboard focus, 7 expanded markers consistent, no console errors) on a clean port 3000.

## Notes (minor, non-blocking)
1. **Stale status fixed:** header said `Drafted` though done — corrected to `Completed`.
2. **Evidence PNG:** the output cites `…-focus-1440.png` but the evidence folder holds only `README.md`
   (DOM assertions). For a11y, DOM assertions are actually stronger than a screenshot, so acceptable — but
   the PNG claim should match (save it or drop the claim). The inline-image-not-persisting quirk again.
3. **Bonus confirmations:** the clean-port env retroactively **confirmed CC-3 enable-on-select live**
   (editor pill enabled + selection-aware title), and validated the env-hygiene memory fix.

## Recommendation
Keep CC-4. Ready to proceed to **CC-5** (reduced-motion). The env is clean and one Preview server now gives
real browser proof — the "can't screenshot" era is over for this session.
