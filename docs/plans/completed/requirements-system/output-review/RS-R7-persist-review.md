---
review-of: RS-R7 persist pass (MAN nodes + review-queue persistence)
plan: requirements-system
sprint: RS-R7
reviewer: Claude (claude-opus-4-8)
date: 2026-06-29
executor-audited: Codex (persist pass)
type: output-audit (core.md §30)
verdict: PERSIST PASS ACCEPT — but RS-R7 NOT fully complete (PO confirmation gate still open)
---

# Output audit — RS-R7 persist pass

## Verdict

**The persist pass is ACCEPT** — it closes the gap I flagged in the prior R7 audit. **387 code MAN nodes
and 362 candidate links are now persisted**, the **review queue is a durable artifact** (batched), and the
**700-node graph validates clean** (0 errors). However, **RS-R7 is not fully complete per its own
acceptance criteria**: the PO confirmation gate is still open — **812 candidate links** await
confirm/redirect/reject and **302 manifestations** await requirement-link or exemption.

## Verified (re-run)

| Check | Result |
|---|---|
| `req:validate` on 700-node graph | ✅ pass, 0 errors, 1 warning |
| MAN nodes persisted | ✅ 397 (387 code-discovered + prior) |
| Candidate links persisted to durable review queue | ✅ 362 new; queue `views/rs-r7-review-queue.md` + `generated/rs-r7-review-queue.json` |
| Batched for PO review | ✅ 6 batches (frontend-islands 68, ux-ui 93, card 46, stage 31, actions-store 1, remaining 123) |
| typecheck / tests | ✅ 0 / 52-52 |
| no `src/` product change | ✅ |
| validate-before-write gap | ✅ engine now pre-checks (no dangling writes this pass) |

## Findings

| # | Severity | Finding |
|---|---|---|
| R7P-1 | Open gate (not a defect) | RS-R7 acceptance requires PO confirmation of the ambiguous batches + exemption classification of unlinked manifestations. **812 links + 302 unlinked remain.** Sprint can't be marked Completed until handled (or acceptance explicitly narrowed). |
| R7P-2 | Data quality (minor) | Some MAN nodes are **mis-kinded**: `package.json` and several plan docs/build-notes carry id `MAN-function-…` though their `kind` field is `config`/`documentation-view`, and a few non-`src/` artifacts were inventoried as manifestations. Clean up during the PO confirmation/exemption pass (likely → exemptions: build-tooling / generated-code). |
| R7P-3 | Good | Codex correctly kept RS-R7 "PO gate pending" rather than over-claiming completion. |

## Recommendation

Accept the persist pass. To **close RS-R7**, handle the confirmation gate — either confirm the 6 batches
(with a policy, e.g. auto-accept ≥0.80 same-family links + spot-check the rest) and exempt the obvious
build-tooling/doc manifestations, or explicitly narrow RS-R7 and move confirmation into RS-R8. The
mis-kinded doc/config manifestations (R7P-2) should be exempted or re-kinded in that same pass.

## Confirmation analysis (2026-06-29) — auto-accept is UNSAFE; deferred

I attempted the confirmation policy and **stopped before mutating** — the candidate data is too low-precision
to rubber-stamp (ledger: `LDG-2026-06-29-R7-CONFIRM-ANALYSIS`):

| Problem | Evidence |
|---|---|
| **Duplicate MAN nodes** | **126 source files have 2 MAN nodes each** (inventory keyed one by component-name, one by src-path). ~⅓ of the 397 are dupes. |
| **Flat confidence** | all **362** candidate `implements` links carry confidence **0.85** — no real signal to threshold on. |
| **Over-linking / false positives** | `Select.tsx` "implements" **23** requirements (incl. `FCS-002` focus-isolation — nonsense); `mock-store` 25; `types/api` 23. Pure name-similarity noise. |

Auto-confirming would cement hundreds of wrong traces + duplicate nodes, destroying the traceability the
system exists to provide.

**Prerequisites before R7 can be confirmed/closed:**
1. **Dedupe MAN nodes by source path** (one node per file).
2. **Replace name-similarity inference with import/usage-based evidence** (reuse `code-index/component-usages.json`) or do targeted per-requirement curation — so links are precise.
3. Then confirm batches + exempt infra/docs/config.

R7 stays **persisted-but-not-confirmed**; **RS-R8 verification remains gated** until coverage is trustworthy.
