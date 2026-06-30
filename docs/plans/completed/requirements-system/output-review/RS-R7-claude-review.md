---
review-of: RS-R7 (initial code reconciliation)
plan: requirements-system
sprint: RS-R7
reviewer: Claude (claude-opus-4-8)
date: 2026-06-29
executor-audited: OpenCode (run) + Codex (audit + engine amendment)
type: output-audit (core.md §30)
verdict: INCOMPLETE — concur with Codex "NOT ACCEPTED AS COMPLETE". Inventory done; persistence + PO gate not.
---

# Output audit — RS-R7 (initial code reconciliation)

## Verdict

**INCOMPLETE — I concur with Codex's "NOT ACCEPTED AS COMPLETE."** The engine *inventoried* 387 code
manifestations, but **persisted nothing**: 0 MAN nodes created (of 387), the 362 inferred candidate links
are transient command output (not in the graph/review queue), and coverage is 0% across all scopes. The
"450 awaiting confirmation" are R6's seed links, not R7's. So the PO confirmation gate **cannot be
meaningfully exercised** — there is nothing persisted to confirm. The report is honest about all of this.

## What I verified

| Check | Result |
|---|---|
| Inventory ran, reused code-index | ✅ 387 manifestations (194 react-component, 26 function, 22 hook) |
| MAN nodes persisted | ❌ 0 of 387 (engine `--mode inventory` discovers but does not write MAN nodes) |
| Candidate links persisted to review queue | ❌ 362 are transient stdout; persisted queue is still R6's 450 |
| Auto-applied links honest | ⚠️→✅ 3 high-confidence links were written **dangling** (no MAN node) then caught by the validator and removed; Codex amended the engine to pre-check |
| `req:validate` after amendment | ✅ pass (310 nodes / 458 links / 35 ledger) |
| no `src/` product change | ✅ |

## The important root cause (and a vindicated finding)

The dangling-link incident is exactly the **validate-before-write / rollback gap (F-R2-1 / F-R3-2)** I
flagged at R2, R3, R5, and R6. It finally bit here: auto-apply wrote trace-link files **and** ledger
entries before validating, the validator flagged the dangling refs, and they had to be manually deleted.
**Codex's amendment (pre-check that the source MAN node exists before writing) is essentially that
hardening** — good, but it's now applied narrowly in the reconcile path, not the shared mutation layer.

## The real gap to close

RS-R7's purpose — link existing code to the seeded graph so coverage/delivery becomes real — is **not
done**. To finish it, a pass must:
1. **Persist MAN nodes** for the meaningful manifestations (per the RS-R0a "smallest meaningful" boundary —
   not necessarily all 387; trivial helpers inherit parents).
2. **Persist the candidate links into the review queue** (so they're durable records, not stdout).
3. Then the **PO confirms the 5 batches**, links are applied/exempted, delivery flips off `not-assessed`.

Until then, RS-R8 (verification) has nothing to attach evidence to.

## Findings

| # | Severity | Finding |
|---|---|---|
| R7-1 | Blocking (sprint) | MAN nodes + candidate links not persisted; coverage 0%; PO gate not exercisable. **Needs a completion pass or a narrowed acceptance (PO decision).** |
| R7-2 | Carried/partly-fixed | Validate-before-write gap manifested; Codex patched the reconcile path. Recommend lifting the fix into the shared mutation layer (F-R2-1) so it's not per-script. |
| R7-3 | Process (good) | Codex correctly refused to mark it complete and corrected the inflated "809 candidates" claim to the true 450 persisted + 362 transient. Honest. |

## Recommendation

Do **not** treat RS-R7 as complete. The completion path (full persist vs narrow-and-defer) is a PO
decision — see the questions raised this turn. Lift the validate-before-write fix into the mutation layer
as part of whichever path is chosen.
