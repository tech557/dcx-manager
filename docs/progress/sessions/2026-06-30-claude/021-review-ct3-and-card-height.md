---
log: 021-review-ct3-and-card-height
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: audit-review
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: CT-3
PO-Action: DECISION — phase/day card height (recommend keep-as-is, decide before CC-2); ratify §21 ≤260px wording; capture CT-3 screenshots
---

# 021 — Review CT-3; phase/day card height decision; go/no-go

## Type: audit-review
PO: review CT-3, decide if safe to move on; concerned about phase-card vs day-card height mismatch
(phase always max height — functional but sometimes weird; doesn't want to complicate).

## CT-3 verdict: ✅ PASS (functional) — safe to proceed to SK-1
Full review: `output-review/2026-06-30-claude-CT-3-review.md`.
- 6 `--dim-*` tokens → `clamp()`; gates green; computed-value evidence at 1280/1512/2560; 3-row structure
  preserved; flipped stale CT-2/SK-1 labels.

## Two tracked notes (non-blocking)
1. **§21 interpretation:** `--dim-phase-expanded` clamps to 340px above ~1440px (231px at the 1280 floor).
   §21 literally says "max 260px"; CT-3 treats it as a density *floor* (stays <360px hard limit). Defensible
   + documented, but **§21 wording should be ratified** ("≤260 at the 1440 floor; may scale up <360 on larger
   viewports"). Governance note, not a blocker.
2. **Evidence gap (§32):** output cites CT-3 screenshots but `output/evidence/CT-3-responsive/` does not
   exist — only computed-value text proof. Capture the multi-viewport PNGs or correct the claim; 3840 not
   evidenced (cap proven at 2560).

## Phase/day card height (PO design call) — recommend KEEP AS-IS
- Facts: PhaseCard `h-full` (fills Kanban column, equal-height columns pattern); DayGridCard fixed
  (`h-[480px]` weekly / `h-[140px]` monthly). CT-3 did not touch card heights (out of scope).
- **Recommendation: do NOT unify.** Kanban & Timeline are different renderers (`REQ-STG-001`); equal-height
  columns vs fixed day-cells are each correct for their view. `h-full` phase is the simplest + most
  functional; matching them adds complexity for no UX gain (and you don't want to complicate). The legacy
  FP-R4 T02 "same height" goal is over-constraining — recommend dropping it. If the sparse-phase look ever
  bothers you, a cosmetic optional `max-h` cap (not content-height) is the lowest-complexity future tweak.
- **Timing:** card-sizing decision belongs with **CC-2** (responsive Task card), not SK-1 → does not block.

## Gates
Audit/doc-only. 0 `src/` writes by me. No graph mutation.

## Go/no-go
**Proceed to SK-1.** Carry: ratify §21 wording; capture/fix CT-3 screenshots; decide phase/day height before CC-2.
