---
review-of: FP-R4-finalize-spec
reviewer: claude (claude-opus-4-8)
date: 2026-06-29
supersedes: 2026-06-28-claude-FP-R4-output-audit.md
verdict: PASS
blocking-issues: 0
advisory-issues: 1
---

# Re-Audit: FP-R4 — Finalize-Behavior Spec (after opencode revision)

## Verdict

PASS — ready for FP-R5 consumption.

opencode's revision (`2026-06-28-opencode-02/02-FP-R4-revision.md`) resolved both blocking issues from
the original audit. Independently re-verified against the live tree.

## Blocking issues — both RESOLVED

| # | Original issue | Fix verified |
|---|---|---|
| 1 | ~20 fabricated `BLD-*` IDs | ✅ Every cited `BLD-*` ID now exists. The DND/KAN/TML/STG/RDY/ISL codes were replaced with their real source-file references (`drag-and-drop.md`, `kanban.md`, `timeline.md`, `stage.md`, `readiness.md`, `islands.md`). Re-ran cited-vs-defined diff: **0 missing.** |
| 2 | Family counts wrong + self-inconsistent (44/17/9 vs 42/24/9 vs actual) | ✅ Summary table, area breakdown, and README carry-forward all now read **45 / 21 / 10 = 76 tagged** (+3 confirmed = 79). The area-breakdown rows sum exactly to the totals, and match my independent tag count. |

## Advisory — my original advisory #1 was WRONG (correction)

I flagged `BLD-CRD-INT-002..006` as a spurious `BLD-` prefix that should be `CRD-INT-*`. opencode
correctly pushed back: **both forms exist**, and `BLD-CRD-INT-*` is the canonical decision-doc form —
`builder-decisions.md:8` defines `BLD-CRD-INT-002` and `cards.md:61` tags it. No fix was needed; the
citations were correct as written. Withdrawn.

## Advisory — resolved

- X-series bare `❓`: `D-12` (structural-token tokenization) added to the register; X01–X03 now link
  `❓ — see D-12`. ✅
- README carry-forward counts corrected to 45/21/10/76. ✅

## Advisory — 1 trivial residual (non-blocking)

| # | Issue | Evidence | Suggested fix |
|---|---|---|---|
| 1 | E02 still carries a stray bare `❓` alongside its real ID (`BLD-EDT-001 / ❓`) with no register row. The criterion *is* grounded in `BLD-EDT-001` + FP-R0 Gap 1, so the `❓` is redundant rather than ungrounded. | `FP-R4-finalize-spec.md` E02 row. | Drop the `❓` (it's grounded), or link it to a D-row if there's a genuine open sub-question. Cosmetic; does not affect FP-R5. |

## Re-verification

- Cited `BLD-*` IDs vs defined corpus: 0 missing.
- Family tags re-parsed: wire 45 / comp 21 / token 10 / —3 = 79; area breakdown sums match.
- Decision register: D-01–D-12, all well-formed, statuses + defaults present.
- `src/` mtime check: clean (no source writes).

## Bottom line

FP-R4 is consumable by FP-R5. The only residual is one cosmetic stray `❓` on E02. With R0–R4 all
audited (R2 and R4 corrected), the discovery phase is complete pending the PO decision pass on the
register (D-01…D-12) — see note to PO.
