---
review: RS-R5-output-review
plan: requirements-system
sprint: RS-R5
reviewer: Codex
date: 2026-06-29
verdict: REOPEN
---

# RS-R5 Output Review

## Verdict

REOPEN.

RS-R5 produced a useful first reconciliation map, but it does not meet the sprint's completeness bar. The sprint contract required a deterministic manifest of the full source corpus and every source item with provenance/status/classification. The current output excludes required source groups, undercounts required folders, and provides sample/category summaries rather than a complete itemized dataset for RS-R6.

## Blocking Findings

### R5-1 — Source manifest omits required full-corpus inputs

The RS-R5 sprint explicitly requires the full corpus, including:

- `docs/product/{requirements,decisions,open-questions,follow-ups}/**`
- on-hold FP `output/` plus that plan's `audit/` and `output-review/`
- `docs/progress/sessions/**` plus `docs/progress/index.csv`

See `docs/plans/active/requirements-system/sprints/RS-R5-inventory-reconciliation.md` lines 15-22.

The output manifest lists only two on-hold FP output files, only 202 lines, and does not list the on-hold audit/output-review files at all. Actual on-hold FP source files include:

```text
docs/plans/on-hold/frontend-polish-v0.3.5/output/      many markdown files, 2964 markdown lines before evidence images
docs/plans/on-hold/frontend-polish-v0.3.5/audit/       3 files
docs/plans/on-hold/frontend-polish-v0.3.5/output-review/ 10 files
```

The output also excludes required session logs:

- `docs/plans/active/requirements-system/output/RS-R5-reconciliation.md` lines 66-67 exclude `docs/progress/sessions/2026-06-28-*` and `docs/progress/sessions/2026-06-29-opencode/*`.
- The sprint required `docs/progress/sessions/**` as first-class sources, not only `2026-06-29-claude/*`.

Required fix: rebuild the source manifest from deterministic commands and include every required source path or an itemized exclusion that is allowed by the sprint contract.

### R5-2 — Counts are inconsistent with the repository

The Requirement Trace says `dcx-requirements-master.csv` has 227 lines at `RS-R5-reconciliation.md` line 20, but `wc -l dcx-requirements-master.csv` returns 218.

The manifest claims total text sources are about 3,962 lines and 244 files at line 56. Re-run checks show the counted corpus is not stable:

```text
wc -l dcx-requirements-master.csv docs/product/... docs/plans/on-hold/.../output/*.md docs/progress/sessions/2026-06-29-claude/*.md docs/progress/index.csv
4905 total

find docs/progress/sessions -type f | xargs wc -l
3817 total

find docs/archive/dcx-manager-v0.1.4 -type f | wc -l
209
```

The output also omits `docs/product/decisions/src-structure-decision.md` even though the sprint scope includes `docs/product/decisions/**`.

Required fix: make the manifest reproducible from exact commands, with counts that match current repo state.

### R5-3 — "Every source item" is not listed with provenance/status/classification

Acceptance criterion 2 requires every source item to be listed with provenance, status, and provisional chain classification (`RS-R5-inventory-reconciliation.md` lines 36-37).

The current output mostly gives family summaries and samples. For example, `RS-R5-reconciliation.md` lines 438-450 gives category counts, and lines 461-471 gives approximate seed counts, but it does not itemize every CSV row, every builder decision/open question/follow-up, every recovered requirement, or every relevant session-log decision as source items.

Required fix: add an itemized reconciliation dataset/table that RS-R6 can seed from without redoing RS-R5 discovery.

### R5-4 — Output claims PASS for checks that were not actually satisfied

OpenCode's log claims:

- deterministic source manifest PASS, 13 source groups, 244 files, about 3,962 lines;
- source manifest verification PASS, all counts cross-referenced against actual files.

See `docs/progress/sessions/2026-06-29-opencode/06-RS-R5-source-inventory.md` lines 32-37 and 39-45.

Those claims do not survive the re-run checks above. The output should not be used as RS-R6's seed input until the manifest is corrected.

## Non-Blocking Notes

- The sprint file still says `Status: Drafted` at `docs/plans/active/requirements-system/sprints/RS-R5-inventory-reconciliation.md` line 2, while the README marks RS-R5 complete. This is lifecycle/documentation drift; not the main blocker, but it should be cleaned up after the output is accepted.
- The no-`src` check passed in this audit. `find src -type f -newer docs/plans/active/requirements-system/output/RS-R5-reconciliation.md` returned empty.

## Verified Passes

```text
bash scripts/agent/build-current-state.sh
PASS: repository v0.3.5, package 0.3.5, active plan requirements-system

bash scripts/agent/verify-tooling-state.sh
PASS: core scripts available, verify.sh pass
NOTE: semgrep CLI not installed, code-index stale

bash scripts/agent/verify-log-claims.sh docs/progress/sessions/2026-06-29-opencode/06-RS-R5-source-inventory.md
PASS: basic file-claim check only

npm run req:validate
PASS

bash scripts/verify.sh
PASS

npm run typecheck
PASS

npm run lint
PASS

find src -type f -newer docs/plans/active/requirements-system/output/RS-R5-reconciliation.md
PASS: no files listed
```

## Recommendation

Do not hand RS-R5 to RS-R6 yet. Reopen RS-R5 for a focused completion pass:

1. Generate a command-backed source manifest for the exact required corpus.
2. Include on-hold FP `output/`, `audit/`, and `output-review/`, not just `requirements-recovery.md` and `decision-register.md`.
3. Include all `docs/progress/sessions/**` and `docs/progress/index.csv`, or record itemized allowed exclusions.
4. Add an itemized source-to-chain table suitable as RS-R6 seed input.
5. Re-run the count checks and update the output/log evidence.
