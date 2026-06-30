# RS-R7 Deferred Mapping Cleanup Queue

Status: open — intentionally deferred after RS-R7 close.

Acceptance principle:

> Imperfect graph data is acceptable and reversible; uncontrolled source-code mutation is not.

## Boundary

This queue exists so RS-R7 can close without pretending the graph is perfect. It does not authorize any
product source change. Every future `src/**` change still requires a separate implementation plan that
states intended behavior, affected requirements, affected files/manifestations, expected code changes,
tests and verification, and PO approval or the required gate.

## Queue Summary

| Cleanup group | Count | Disposition |
|---|---:|---|
| Canonical RS-R7 candidate links still awaiting review | 238 | Leave provisional until reviewed during frontend-polish re-grounding or implementation planning |
| Canonical manifestations in review | 54 | Review by canonical manifestation, not raw trace-link row |
| Canonical manifestations still unlinked | 223 | Confirm, redirect, reject, or exempt later |
| Superseded MAN aliases preserved for history | 121 | Keep as reversible audit history |
| Historical supersession trace links preserved | 124 | Keep as reversible audit history |
| Duplicate active requirement-manifestation relationships | 0 | No active duplicate relation blocker |

## Cleanup Rules

| Rule | Meaning |
|---|---|
| Provisional is not implementation authority | A provisional link may guide planning, but cannot authorize a code change |
| Confirmed is planning context | Even confirmed links are context, not automatic implementation instructions |
| Weak links stay visible | Weak or possibly incorrect links remain in generated review data until explicitly resolved |
| Rejected/redirected history stays | Cleanup must preserve original IDs, replacement IDs, evidence, confidence, and ledger references |
| Review during real work | Prefer resolving mappings when a frontend-polish or implementation plan touches the relevant artifact |

## Review Sources

| Source | Use |
|---|---|
| `docs/product/requirements/graph/generated/rs-r7-review-queue.json` | Canonical manifestation review items |
| `docs/product/requirements/graph/generated/rs-r7-identity-normalization.json` | Alias map and normalization audit |
| `docs/plans/active/requirements-system/output/RS-R7-identity-normalization.md` | PO-facing summary and example batches |

## Added 2026-06-30 (RS-R11 close — opportunistic-cleanup convention, first entry)

| Item | Detail | Disposition |
|---|---|---:|
| Skill manifestation identity collision | `req:completion-gate` derives path-based IDs `MAN-function-agent-skills-dcx-manifestation-reconcile-skill` and `MAN-function-agent-skills-dcx-code-query-skill` for the two RS-R11.2-edited skills, but RS-R9 self-trace already created canonical `MAN-skill-dcx-manifestation-reconcile` (and dcx-code-query predates the `MAN-skill-*` scheme). Gate reported `manifestations lacking requirements: 2`. | Redirect path-derived IDs to the canonical `MAN-skill-*` nodes (or create `MAN-skill-dcx-code-query`) and link to `REQ-GOV-TRACE-001-AGENT`. **Non-blocking** (calibration mode: duplicate identity / low-risk mapping); gate exit code 0. |
| Stale/broken trace | `stale/broken traces: 1` reported by the same gate run. | Review during the FP re-grounding reconciliation pass. |

These are **calibration debt**, not close blockers: none of the calibration-mode hard blockers apply
(no `src/**` mutation, no silent locked-truth change, no inferred-link-as-authorization, canonical data
valid — `req:validate` PASS). Recorded here per the opportunistic-cleanup convention rather than blocking
the requirements-system plan close.

## Close-Out Note

RS-R7 may close with this queue open because unresolved mappings are visible, auditable, reversible, and
blocked from mutating source code without a later explicit implementation plan.
