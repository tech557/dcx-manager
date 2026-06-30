---
output: RS-rollout-calibration-mode
plan: requirements-system
agent: Codex
date: 2026-06-29
status: active-operating-mode
---

# Requirements System Rollout Calibration Mode

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-GOV-TRACE-001, REQ-GOV-TRACE-001-DATA, REQ-GOV-TRACE-001-AGENT |
| Scope/type | governance / agent-workflow — operating mode clarification |
| Source/lock | PO direction on 2026-06-29 |
| Acceptance outcome | Remaining sprints run as planned, while imperfect first-population graph mappings are treated as visible, reversible calibration debt rather than automatic blockers |
| Responsibilities | Preserve architecture; prevent uncontrolled `src/**` mutation; guide agents on when to investigate deeper |
| Evidence | Active plan README section: "Operating mode during rollout — test / calibration mode" |

## Decision

The requirements-system architecture is not weakened and the remaining sprints are not rewritten. The
system still aims for canonical requirements, governed manifestation structure, progressive enrichment,
bidirectional traceability, reconciliation, verification evidence, agent rules, validators, gates,
explicit planning before implementation, auditability, and reversibility.

During rollout, the system operates in **test / calibration mode**:

- Graph data is the default planning context.
- First-population mappings are not assumed perfect.
- Provisional, weak, duplicate, incorrect, or incomplete links may temporarily exist when visible,
  auditable, reversible, and queued.
- Cleanup debt should be recorded rather than blocking the whole plan for low-risk imperfections.
- Accuracy is improved through actual planning and implementation use.
- Enforcement tightens as repeated use proves graph accuracy.

## Blocking Issues

Block work for serious safety or governance issues:

| Blocker | Why |
|---|---|
| Graph/tool operation attempts to modify `src/**` | Requirements governance must not mutate product code |
| Silent locked-truth mutation | Violates governed source of truth |
| Inferred link used as automatic implementation authorization | Confuses planning context with product approval |
| Invalid canonical data prevents system operation | Breaks the requirements system itself |
| High-risk implementation proceeds without uncertainty review | Risks encoding wrong product intent |

## Non-Blocking Calibration Debt

Do not block remaining sprints solely for:

| Debt | Handling |
|---|---|
| Misclassified manifestations | Queue and correct when touched by real work |
| Weak candidate links | Keep provisional / pending |
| Duplicate identities already recorded for cleanup | Preserve audit history and defer cleanup |
| Missing low-risk mappings | Track as coverage debt |
| Imperfect coverage percentages | Treat as calibration signal, not truth |
| Incomplete enrichment of older requirements | Mature progressively |

## Investigation Triggers

Agents should investigate beyond the stored graph when a task is risky, graph links conflict, requirements
are ambiguous, planned code changes do not match stored manifestations, tests fail, runtime behavior
contradicts the graph, a decision could alter locked product intent, or confidence is too low to plan
safely.

## Opportunistic cleanup (added RS-R11.2, 2026-06-30)

Calibration debt is cleared **opportunistically by any agent that checks requirements** — not deferred
to a dedicated sprint. Whenever you run `req:query` / `req:trace` / `req:justify` / `req:reconcile` or
`dcx-code-query` during normal work and notice debt, act on it without blocking your current task:

| Finding | Action | Gate |
|---|---|---|
| Duplicate identity / alias | record in the deferred-cleanup queue or `req:propose --type supersede-node` | **PO confirm** if it changes product truth |
| Unlinked manifestation (no link, no exemption) | propose a candidate link or a typed `Exemption` | **PO confirm** if it asserts product coverage |
| Weak / wrong / stale link | flag in `candidateLinksAwaitingConfirmation` / `staleBrokenTraces` | technical-only ≥0.80 auto-applies + audit ledger; else **PO** |
| Touches a locked/approved requirement | `req:propose` only — **never** silent edit | **PO sign-off required** (`core.md §35b`) |

**Where the debt lives:** `graph/views/rs-r7-deferred-cleanup-queue.md`,
`graph/views/rs-r7-review-queue.md` (+ `generated/rs-r7-review-queue.json`), and the RS-R2 queue keys
(`candidateLinksAwaitingConfirmation`, `manifestationsLackingRequirements`, `staleBrokenTraces`,
`supersededStillInCode`, `exemptionsAwaitingReview`).

**Hard boundary:** no inferred/provisional/confirmed link or coverage score ever authorizes a `src/**`
change. Cleanup mutates graph/trace/ledger data only — never product code. Full hand-off context:
`docs/plans/active/requirements-system/output/RS-R11-reground-brief.md` §5.

## Operating Principle

> Build the full system as planned, but operate it in calibration mode until repeated real-world use proves
> its accuracy. Treat graph data as authoritative planning context, while allowing investigation,
> correction, and deferred cleanup where confidence is low.
