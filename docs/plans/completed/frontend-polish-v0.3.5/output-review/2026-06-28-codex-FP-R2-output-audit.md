---
review-of: FP-R2-token-audit
reviewer: codex
date: 2026-06-28
verdict: REOPEN
blocking-issues: 1
advisory-issues: 1
---

# Output Audit: FP-R2 Token + Hardcoded-Value Audit

## Verdict

REOPEN

**Reason:** FP-R2 is broadly useful and source-safe, but one metric is demonstrably wrong and should
be corrected before FP-R5 consumes the output as a baseline.

## Blocking Issues

| # | Issue | Evidence | Required fix |
|---|---|---|---|
| 1 | `Unique --theme-* names consumed outside brand` is counted incorrectly as 134. The command used in the output keeps filenames in `rg -o` results, so it counts file/token pairs, not unique token names. | `output/FP-R2-token-audit.md` baseline table says 134. Re-run with `rg --no-filename --glob '!src/brand/**' -o -- "--theme-[a-zA-Z0-9_-]+" src \| sort -u \| wc -l` returns 35. The path-sensitive command returns 134. | Change the metric to `35` and label any `134` metric, if kept, as "unique file/token pairs" rather than unique token names. Update README only if this metric is carried there later. |

## Advisory Issues

| # | Issue | Evidence | Suggested fix |
|---|---|---|---|
| 1 | The output says `code-query.sh hardcoded-tokens` maps every hex/rgba/arbitrary value, but the project script only returns `hardcoded_hex: []` and `arbitrary_tailwind: 108`. The broader manual scans add 26 color/gradient lines and 342 bracket lines, but only the 26 color lines are enumerated in full. | FP-R2 sprint scope says the script should return every hex/rgba/arbitrary value outside `src/brand/`. Current output correctly separates the broader scan as a fallback/noise baseline, but FP-R5 readers may confuse 108 vs 342. | Add one sentence under the 342-line metric: "This is not a required migration list; it is a broad regex baseline and is intentionally not expanded line-by-line." |

## Acceptance Criteria Check

| Criterion | Result | Notes |
|---|---|---|
| `output/FP-R2-token-audit.md` lists every hardcoded literal with file:line | PASS with caveat | Official 108 script entries are listed by file:line, and the 26 broader color/gradient literal lines are listed. The 342 broad bracket count is intentionally summarized, not a full migration list. |
| Dead-token list with consumer evidence | PASS | Output proves 0 dead `--theme-*` tokens and explains why 88 zero-direct CSS vars are not safe-delete candidates. |
| Baseline counts present with raw numbers | FAIL | One baseline number is wrong: unique `--theme-*` names should be 35, not 134. |
| Allowed writes only / no `src/` write | PASS | Output, README, and progress log only. Fresh `find src -type f -newer docs/progress/sessions/2026-06-28-codex/07-FP-R2-token-audit.md` returned no files. |

## Verified Counts

| Metric | Rechecked result |
|---|---:|
| Official `hardcoded_hex` | 0 |
| Official arbitrary Tailwind entries | 108 |
| Broader product color/gradient literal lines | 26 |
| Broader product arbitrary/bracket lines | 342 |
| Old `text-[var(--text-*)]` regressions | 0 |
| `--theme-*` arbitrary bracket usages outside brand | 297 |
| All `var(--theme-*)` usages outside brand | 343 |
| Actual unique `--theme-*` names outside brand | 35 |
| Path-sensitive file/token pairs currently mislabelled as unique names | 134 |
| Defined `--theme-*` tokens | 68 |
| Proven dead `--theme-*` tokens | 0 |

## Gate Review

| Gate | Result | Notes |
|---|---|---|
| `build-current-state.sh` | PASS | Active plan and latest log detected. |
| `verify-tooling-state.sh` | PASS with setup caveats | `verify.sh` passed; semgrep CLI not installed; code index stale. |
| Source mutation check | PASS | No `src/` files newer than the FP-R2 progress log. |

## Required Follow-Up

Patch `output/FP-R2-token-audit.md` to replace the wrong `134` unique-token metric with `35`, or
rename it to "file/token pairs" and add the true unique-token count. After that, FP-R2 can be treated
as ready for FP-R5 consumption.
