---
review-of: FP-R2-token-audit
reviewer: codex
date: 2026-06-28
verdict: READY_FOR_P3
blocking-issues: 0
advisory-issues: 0
supersedes:
  - output-review/2026-06-28-codex-FP-R2-output-audit.md
  - output-review/2026-06-28-claude-FP-R2-output-audit.md
---

# Output Audit Follow-Up: FP-R2 Token + Hardcoded-Value Audit

## Verdict

READY_FOR_P3

**Reason:** The FP-R2 metric ambiguities that blocked handoff were corrected in both the output
artifact and the README carry-forward contract.

## Resolved Blocker

| Prior blocker | Resolution | Evidence |
|---|---|---|
| `Unique --theme-* names consumed outside brand` was incorrectly reported as 134 because the command counted path-sensitive file/token pairs. | `output/FP-R2-token-audit.md` now reports `35` as actual unique token names and keeps `134` only as path-sensitive file/token pairs. The README carry-forward contract carries both labels. | `output/FP-R2-token-audit.md` baseline table + FP-R5 inputs; README FP-R2 carry-forward baseline table and critical implications. |
| Storybook/demo color literal baseline `44` was not reproducible from a named scope. | `output/FP-R2-token-audit.md` now uses `22`, produced by the exact color scan scoped to `src/stories`, and explicitly says not to use the old `44`. README carries the same number. | `output/FP-R2-token-audit.md` baseline table + FP-R5 inputs; README FP-R2 carry-forward baseline table and critical implications. |
| Zero-direct CSS vars `88` and dead `--theme-*` tokens `0` were documented as manual loops without runnable provenance. | `output/FP-R2-token-audit.md` now includes reproducible loops for both checks. | `output/FP-R2-token-audit.md` dead-token and zero-direct sections. |

## Advisory Resolution

| Prior advisory | Resolution |
|---|---|
| FP-R5 readers could confuse the 108 official arbitrary Tailwind entries with the 342 broad bracket-regex lines. | FP-R2 now labels the 342 count as a broad regex baseline only, not a required migration list, and README carries the same warning. |
| The documented command for the 342 count did not include the excludes needed to reproduce the count. | FP-R2 now documents the `!src/brand/**` and `!src/stories/**` excludes in the baseline table. |

## Handoff Rule For P3 / FP-R5

Use these labels exactly:

| Metric | Count | Meaning |
|---|---:|---|
| Actual unique `--theme-*` token names consumed outside brand | 35 | Token-name breadth. |
| Path-sensitive `--theme-*` file/token pairs outside brand | 134 | File/token-pair breadth; not a unique-token-name count. |
| Broader arbitrary/bracket baseline | 342 | Broad regex baseline; not a required migration list. |
| Storybook/demo color literal baseline | 22 | Separate demo/storybook baseline; not product UI. |
| Zero-direct CSS custom properties | 88 | Build-aware review list, not a deletion list. |

## Gate Review

| Gate | Result | Notes |
|---|---|---|
| `build-current-state.sh` | PASS | Active plan detected; repo version `v0.3.5`; latest prior log was FP-R2 output audit. |
| `verify-tooling-state.sh` | PASS with setup caveats | `verify.sh` passed. Semgrep CLI not installed; code index stale; only ESLint MCP active. |
| Source mutation check | PASS | `find src -type f -newer docs/progress/sessions/2026-06-28-codex/09-FP-R2-output-audit-followup.md` returned no files. |

## Remaining Risk

No FP-R2 blocker remains. The usual plan-level gates still apply before FP-R5: FP-R3 and FP-R4 outputs
must exist, and FP-R5 must not draft executable implementation work for any unresolved
`PO decision required` item.
