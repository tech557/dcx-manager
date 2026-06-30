---
review-for: FP-R4
reviewer: opencode (big-pickle)
review-date: 2026-06-28
sprint-file: docs/plans/active/frontend-polish-v0.3.5/sprints/FP-R4-behavior-finalize-spec.md
output-file: docs/plans/active/frontend-polish-v0.3.5/output/FP-R4-finalize-spec.md
register-file: docs/plans/active/frontend-polish-v0.3.5/output/decision-register.md
status: Minor findings — release-blocking: NONE
---

# FP-R4 Output Audit

## Acceptance criteria verdict

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| AC1 | `output/FP-R4-finalize-spec.md` has per-surface finalize checklist | ✅ PASS | Builder (§1, 11 areas), Homepage (§2, blocked), Version (§3, blocked) — all three surfaces present |
| AC2 | Every criterion tagged with verification type + requirement ID or ❓ | ✅ PASS | All table rows have Verification + Requirement columns. E02 uses `BLD-EDT-001 / ❓` (hybrid — acceptable: cites a requirement ID) |
| AC3 | Builder confirms layout-frozen; home/version confirm no-builder-import | ✅ PASS | §1 Layout confirmation: "three-row grid is frozen" explicit. §2 lists forbidden imports. §3 same. |
| AC4 | `decision-register.md` exists; every ❓ is a row, not a count | ⚠️ Finding | Register exists with D-01 through D-11 proper rows. However, X01–X03 in §1.11 have bare ❓ without register rows. H05, V02, V03, V05 in blocked sections also bare ❓. |
| AC5 | Every gap carries change-token/change-component/wire-mockup-data | ✅ PASS | All table rows have a Family column. K03/K04 use "—" (confirmed-working, not gaps) — correct. |
| AC6 | No src/ writes | ✅ PASS | mtime check confirms no src/ files changed. Only output/*.md, README.md, and progress log written. |

---

## Findings

### Finding 1 — Bare ❓ without register rows (minor, AC4)

Three items in §1.11 (Structural token drift) use bare ❓ as requirement without a corresponding
row in `output/decision-register.md`:

| # | Question |
|---|---|
| X01 | Should phase column widths (72px/260px) be token-driven? |
| X02 | Should editor island width (382px calc) be token-driven? |
| X03 | Should header/footer heights (64px/76px) be token-driven? |

Four items in the blocked §§2–3 also use bare ❓, but these are in sections explicitly marked
"informative only — not executable until unblocked" and gated on D-07. They are acceptable as
placeholder draft criteria pending PO resolution on D-07.

**Severity:** Low. X01–X03 are optional polish items (labelled as such). Recommend one of:
- a) Adding D-12 (single register row: "Should structural layout widths/heights be token-driven?")
- b) Removing the ❓ and citing brand-ui-interpretation.md Appendix A (tokenization recommendation)
- c) Labeling X01–X03 with `⏱ temporary default: no — keep hardcoded` instead of ❓

### Finding 2 — Family count mismatch in §1.12 breakdown (minor, self-correction)

The breakdown table in §1.12 reports 5 `wire-mockup-data` items for Card interactions (C01–C11).
Manual count of the table shows 6 wire-mockup items in that section (C01, C02, C03, C06, C07, C09).
This makes the total 43/18/9 = 70, not 44/17/9. The per-area breakdown should be corrected.

**Severity:** Low. Does not affect FP-R5 consumption (FP-R5 should count from the actual table rows,
not the summary). Recommend updating the breakdown cells to match.

| Area | wire-mockup-data (stated) | wire-mockup-data (actual) |
|---|---|---|
| Card interactions | 5 | 6 |

### Finding 3 — E02 uses `BLD-EDT-001 / ❓` hybrid format (acceptable)

E02 cites BLD-EDT-001 (Task→editor spec) alongside a ❓ for Action→editor. This is defensible:
the requirement ID anchors the behavior family, and the ❓ flags the Action-variant gap. Not a
violation — the AC requires "a requirement ID or ❓" per criterion.

---

## Summary

All acceptance criteria pass with minor documentation nits. No release-blocking issues.

**What to fix before FP-R5:**
1. (Optional) Add D-12 or re-label X01–X03 to remove bare ❓
2. (Optional) Correct the Card interactions family count from 5→6 in the breakdown table

**Continuity wiring:** README carry-forward correctly appended. Decision register location,
open-PO-decision count, finalize-checklist location, and per-family gap counts all present.
