---
review-of: RS-R2-build-notes (mutation/sign-off + ledger + queues + views + low-token query)
plan: requirements-system
sprint: RS-R2
reviewer: Claude (claude-opus-4-8)
date: 2026-06-29
type: output-audit (core.md §30) — gates + CLIs re-run independently
verdict: ACCEPT — RS-R2 complete; one non-blocking robustness finding (F-R2-1) for hardening
---

# Output audit — RS-R2 (mutation/sign-off + ledger + queues + views + query/trace/justify)

## Verdict

**ACCEPT.** RS-R2 delivers the governed-mutation layer, append-only ledger, all twelve queues, generated
human views, and the low-token query/trace/justify slices — reusing RS-R1's `schema/store/validators`. I
**re-ran every gate and the new CLIs myself**; all PASS claims hold. Sign-off enforcement, supersession,
and bidirectional traversal are real and tested. One non-blocking robustness finding (F-R2-1) is noted for
hardening. The PO-directed version-metadata reconciliation is verified consistent.

## Gates + CLIs — re-run independently

| Check | Codex claim | Re-run result |
|---|---|---|
| `npm run typecheck` | PASS | ✅ exit 0 |
| `npm run test` | 37 / 8 files | ✅ 37/37, 8 files |
| `npm run validate:architecture` | PASS | ✅ 0 violations, 264 modules |
| `bash scripts/verify.sh` | PASS | ✅ "verify passed" |
| `npm run req:generate-views` | PASS | ✅ exit 0; wrote views/ + generated/ |
| `npm run req:query -- --scope product` | PASS | ✅ exit 0; empty-graph slice graceful |
| `npm run req:trace -- --from INT-MISSING` | PASS | ✅ exit 0; graceful |
| `npm run req:justify -- --manifestation MAN-MISSING` | PASS | ✅ exit 0; graceful |
| `verify-version-state` | PASS | ✅ VERSION/package/metadata all v0.3.5 |
| `npm run lint` | FAIL (pre-existing) | ✅ pre-existing only; none in RS-R2 files |

## Acceptance criteria — verified

| Criterion | Verdict | Evidence |
|---|---|---|
| `propose`/`apply-after-signoff`/`generate-views`/`query`/`trace`/`justify` exist, exact names | ✅ | package.json + CLIs run |
| Write without sign-off blocked; supersession records suppressed node + reason; ledger appended | ✅ | `mutation.ts` (`SIGNOFF_REQUIRED`, post-apply `validateGraphData`, `appendLedger`) + workflow tests |
| Each queue query correct incl. empty-graph | ✅ | `queues.ts` + test asserts missing-manifestations, candidate-links, orphan-manifestations, exemptions |
| `trace`/`justify` return small slices — bidirectionality | ✅ | `query-engine.ts` + test (`traceFrom`, `justifyManifestation`) |

## Strengths

- Sign-off is genuinely enforced: empty `--signoff` throws `SIGNOFF_REQUIRED`; apply re-validates the whole
  graph before recording the ledger entry; supersession marks the old node `superseded` + `superseded_by`
  + reason and writes the replacement — no in-place edit of locked truth.
- Workflow tests use isolated temp dirs (`mkdtemp`) — no pollution of the canonical store.
- Ledger entries carry `signoff_by`, `signoff_text`, `suppressed_node`, `replacement_node`, `reason`.
- Honest scope: `reconcile` / `completion-gate` still owned by RS-R3/R4 (not faked).

## Findings

| # | Severity | Finding | Detail | Action |
|---|---|---|---|---|
| F-R2-1 | Non-blocking (robustness) | `applyProposalAfterSignoff` writes the node/link to disk **before** validating the resulting graph; on `VALIDATION_FAILED` it throws but the partial write **persists** (no rollback). | A PO-signed but invalid proposal would leave an invalid file in the canonical store; the next `req:validate` would then fail globally. | RS-R2/R3: validate the prospective in-memory graph **before** writing, or roll back the file on validation failure. Add a test for "signed-but-invalid proposal does not mutate the store." |
| F-R2-2 | Note | Generated views/`generated/*.json` are committed artifacts derived from the (currently near-empty) graph. | Fine, disposable; regenerate idempotently. | Ensure RS-R6 regenerates them after migration. |

## Resolved since prior turn (PO roll-up)

- `package.json` version → `0.3.5` and name `dcx-manager-v0.3.5`; `package-lock` aligned; `metadata.json`
  description corrected to DCX Manager. `verify-version-state` → `pass:true`. **The two open PO roll-up
  items (package.json version, metadata description) are closed.**

## Recommendation

Accept RS-R2 and proceed to **RS-R3** (manifestation discovery + reconciliation engine). RS-R3 must:
(1) implement `req:reconcile` + `req:completion-gate` reusing the graph store; (2) address **F-R2-1**
(validate-before-write / rollback); and (3) the plan requires clearing the **pre-existing lint debt
(43 errors) before RS-R3** — recommend a short lint-cleanup task first.
