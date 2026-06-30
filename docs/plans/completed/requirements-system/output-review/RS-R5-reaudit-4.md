---
output: RS-R5-reaudit-4
plan: requirements-system
sprint: RS-R5
agent: Codex
date: 2026-06-29
verdict: REOPEN
reviewed_output:
  - docs/plans/active/requirements-system/output/RS-R5-reconciliation.md
  - docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.md
  - docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv
  - docs/progress/sessions/2026-06-29-opencode/06-RS-R5-source-inventory.md
---

# RS-R5 Re-Audit 4

## Verdict

**REOPEN.** The previous two blockers are mostly fixed: `PR-020` is no longer treated as a question, `VR-011` is the only `QST-*` row, and the builder decision count is now generally corrected to 18. However, RS-R6 is explicitly instructed to consume `RS-R5-itemized-dataset.csv` directly, and that machine-readable file still carries incorrect chain-layer data for every row.

This is not a cosmetic markdown issue. If RS-R6 trusts the CSV, it will seed many requirement families with the wrong graph shape.

## Blocking Findings

### R5-6 — Machine-readable CSV chain classification is flattened and contradicts the output

`RS-R5-itemized-dataset.md` defines different chain layers by family:

- BC/DM/VL/SBC and several others: `REQ -> BHV -> RSP`
- RV/FCS/KBI/RDY: `REQ -> BHV`
- PR/UP/SC/CR/FI/STG/etc.: `REQ -> RSP`
- AIC/deferred items: intent/deferred handling
- `VR-011`: `QST-*`, not a requirement

But the CSV that RS-R6 is told to read has `chain_layer=REQ->RSP` for all 217 rows.

Evidence:

```text
header_fields=8
rows=217
chain_layer[REQ->RSP]=217
```

Examples of directly wrong rows:

```text
75,FI-007,...,Deferred,REQ->RSP,INT-FI-007,...
119,PR-018,...,Deferred,REQ->RSP,INT-PR-018,...
123,VR-011,...,Needs Decision,REQ->RSP,QST-VR-011,...
```

The CSV has the right row count and node-id exceptions, but the `chain_layer` field is unusable as RS-R6 seed input in its current form.

Required fix:

- Regenerate `RS-R5-itemized-dataset.csv` so each row's `chain_layer` matches the family mapping in `RS-R5-itemized-dataset.md` and the exception handling for `QST-*` / `INT-*`.
- Add a deterministic verification command to the log showing at least:
  - multiple expected `chain_layer` values are present,
  - all `QST-*` rows have a question/open-question classification,
  - all `INT-*` rows have an intent/deferred classification,
  - BC/DM/VL/SBC rows are not flattened to `REQ->RSP`.

## Non-Blocking Corrections Before Ready

### R5-N1 — Product decision heading still says 22 entries

`RS-R5-itemized-dataset.md` line 111 still says:

```text
## 3. Product Decisions (22 entries)
```

The table below it has 18 entries, and `RS-R5-reconciliation.md` now correctly says 18 entries from `builder-decisions.md`. Fix the heading to avoid reintroducing the earlier count contradiction.

### R5-N2 — Total graph-object arithmetic is still inconsistent

The reconciliation and log still claim `~355` total graph objects after reducing ledger entries to 30.

The latest log states:

```text
293 nodes + 30 ledger entries + 28 deferred/intent
```

That sums to 351, not 355. The reconciliation also says `~293` nodes and `~355` all graph objects. This needs either a corrected total or an explanation of the missing objects before RS-R6 treats the count as a target.

### R5-N3 — Session-log count in the OpenCode log drifted behind the output

`RS-R5-reconciliation.md` says 64 session logs. The OpenCode log acceptance table still says all session logs 63. This is likely drift from the extra audit logs created during the rework, but the sprint log should match the final manifest.

## Checks Run

| Check | Result |
|---|---|
| `bash scripts/agent/build-current-state.sh` | PASS; repository/package/metadata v0.3.5; active plan `requirements-system`; code index stale; MCP operational `eslint`; awaiting `storybook`, `shadcn`, `semgrep`, `sonarqube` |
| `bash scripts/agent/verify-tooling-state.sh` | PASS overall; `verify.sh` pass; semgrep CLI not installed; e2e tests not written; code index stale |
| `bash scripts/agent/verify-log-claims.sh docs/progress/sessions/2026-06-29-opencode/06-RS-R5-source-inventory.md` | PASS |
| `npm run req:validate` | PASS |
| `bash scripts/verify.sh` | PASS |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run validate:architecture` | PASS |

## Ready Criteria

RS-R5 should flip to ready after:

1. The CSV chain-layer data is corrected and verified.
2. The 22-entry heading is corrected to 18.
3. The `~355` total is corrected or justified.
4. The OpenCode log count drift is corrected.

Once those are done, I expect the next re-audit can likely accept RS-R5 unless the CSV regeneration exposes a deeper source-count issue.
