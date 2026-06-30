---
log: 002-rs-r11-add-calibration-debt-cleanup-task
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: user-request-planning
version_context: v0.3.5
plan: requirements-system
---

# 002 — RS-R11 readiness confirmation + add RS-R11.2 (calibration-debt cleanup convention)

## Type: user-request-planning
PO asked: (1) are we ready for P11? (2) propose a new sprint task that lets agents know the
requirement files are clearable calibration debt — flagging duplicates / unlinked links and routing
PO-confirmable changes. Stage (§34): Plan/Revise of a Drafted sprint, at PO direction. No code,
no graph mutation, no execution.

## Readiness verdict
**RS-R11 is READY to execute** (confirmed in log `001`). Inputs, populated graph, `req:trace`/
`req:justify`, and RS-R8 verification states all present; latest verdict READY. Two doc-integrity
items remain before a clean **plan close** (not blockers to running R11): RS-R8 header still
`Drafted`; plan DoD checkboxes stale.

## Change applied (drafting only)
Restructured `sprints/RS-R11-reground-frontend-polish.md` into two tasks:
- **RS-R11.1** — the existing FP re-grounding brief (unchanged scope).
- **RS-R11.2 (NEW)** — Requirement-graph calibration-debt cleanup **convention** (durable hand-off).

### Why this is the right placement / not redundant
- The debt and the queues already exist (RS-R7: ~238 candidate links, ~223 unlinked manifestations,
  121 normalized duplicates; queues `views/rs-r7-deferred-cleanup-queue.md`,
  `views/rs-r7-review-queue.md`, RS-R2 queue keys). What was **missing** was a durable, agent-facing
  convention telling agents to clear it *opportunistically when checking requirements* rather than
  only in a dedicated sprint — so it would otherwise rely on voluntary doc-reading (violates the
  behavior-sustaining principle).
- RS-R11.2 therefore (a) documents the convention + queue map + opportunistic-workflow table in the
  brief, and (b) **wires it durably**: an "Opportunistic cleanup" subsection in
  `output/RS-rollout-calibration-mode.md` + a pointer in the `dcx-manifestation-reconcile` and
  `dcx-code-query` skills (re-synced via `sync-skills.sh`).

### Guardrails encoded in the task
- Product-truth changes → `req:propose` + **PO confirmation** only; never silent edit (`core.md §35b`).
- Technical-only corrections → ≥0.80 auto-apply + audit ledger (existing rule).
- A link/coverage score **never** authorizes a `src/**` change (RS-R7 carry-forward).
- Scope-out: **no bulk cleanup executed in R11.2** — it defines the convention, it does not clear the
  ~238/~223 backlog; that clears opportunistically during real work or a future dedicated pass.

## Verified before drafting
All referenced paths exist: the two RS-R7 queue files + `generated/rs-r7-review-queue.json`; skills
`agent-skills/dcx-manifestation-reconcile` and `agent-skills/dcx-code-query`.

## Gates
Planning/doc-only — no code, no graph mutation. `src/**` untouched. (RS-R11.2's own gates run when
the sprint is executed.)

## Requirements covered
- `REQ-GOV-TRACE-001` (self-governance: cleanup routes through governed mutation + PO confirmation).

## Follow-ups (for PO)
1. Decide whether RS-R11.2's skill edits warrant a light re-audit (additive convention, consistent
   with calibration mode → likely no conceptual re-audit needed).
2. Then execute RS-R11 (both tasks), reconcile the two doc-integrity items, and close the plan (§29).
