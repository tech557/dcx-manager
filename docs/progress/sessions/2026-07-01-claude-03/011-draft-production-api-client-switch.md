## Draft the production-api-client-switch implementation plan
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-planning
Status: Completed
PO-Action: pending
Version: v1.0.1.0
Change-Class: non-source

Intent: Draft the implementation plan that consumes the backend-discovery-v3 dataset to connect the real Supabase backend behind the frozen 22-route contract.
Trigger: User request — "now create the drafted implementation plan".

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/plans/drafted/production-api-client-switch/README.md | plan: purpose, decisions, carry-forward, sprint table, requirement trace, risks, lifecycle | 118 |
| created | docs/plans/drafted/production-api-client-switch/sprints/PAC-R0.md | prerequisites, PO confirmations, switch architecture | 66 |
| created | docs/plans/drafted/production-api-client-switch/sprints/PAC-R1.md | apply schema+RLS to dev (PO-approved) | 70 |
| created | docs/plans/drafted/production-api-client-switch/sprints/PAC-R2.md | real dispatcher (22 routes, flagged) | 74 |
| created | docs/plans/drafted/production-api-client-switch/sprints/PAC-R3.md | Supabase Auth wiring | 66 |
| created | docs/plans/drafted/production-api-client-switch/sprints/PAC-R4.md | route parity + dev seed | 66 |
| created | docs/plans/drafted/production-api-client-switch/sprints/PAC-R5.md | preview cutover behind flag | 66 |
| created | docs/plans/drafted/production-api-client-switch/sprints/PAC-R6.md | staging/prod promotion (PO-gated) | 70 |
| edited | docs/plans/drafted/README.md | index: list the drafted plan | ~8 |

### Design decisions baked in
- Placed in drafted/ (NOT active) — follows draft→audit→activate lifecycle (§24/§34); gated on backend-discovery-v3 READY.
- Mechanical switch: real dispatcher implements the same 22 routes behind apiClient; mapper + UI unchanged; flag VITE_USE_REAL_BACKEND (default off) until parity proven.
- Every schema apply/promotion is PO-approved via the release-governance pipeline (dev-first, prod-last, no auto-promotion).
- Carries the PO-delegated decisions (workspace-scoped auth, Supabase Auth, external-URL files, jsonb, stubs) + 4 confirm-at-PAC-R0 product-model points (incl. create-via-duplicate OD-PAC-01).
- Queues REQ-BE-* requirement intake at PAC-R0 (no invented IDs).

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | Plan respects mapper boundary + no-UI-change + RLS; no code written (draft only) |
| Open decisions used (⏱) | OD-PAC-01..04 recorded as open; PO-delegated decisions flagged for confirmation |

### Acceptance criteria (this planning task)
| Criterion | Verdict |
|---|---|
| Drafted plan created with sprint files carrying acceptance criteria | PASS (7 sprints, each with AC + verification plan) |
| Consumes discovery dataset, does not re-derive | PASS (inputs table references contract/schema/auth/integrations/captured) |
| Gated on discovery READY + audit + PO activation | PASS (frontmatter + lifecycle) |

### Gates
| Gate | Result |
|---|---|
| typecheck/verify/test | N/A — planning docs only, no code |
| req:validate | run at audit time (dcx-plan-audit) |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Audit + activate decision | drafted plan cannot execute until audited READY + PO activation, and only after backend-discovery-v3 = READY | run `dcx-plan-audit` on the drafted plan; activate when both conditions hold |
| Confirm 4 product-model points | drive PAC-R0/PAC-R2 scope | confirm at audit/activation: create-via-duplicate (OD-PAC-01), workspace-scoped access, files scope, ClickUp/AI stubs |

### Consumer updates required
- None (planning only).

### Open issues / follow-ups
- Next: `dcx-plan-audit` on the drafted plan → revise if needed → PO activates once discovery is READY.
- Prereqs to activation remain: backend-discovery-v3 G5 (live capture) + G6 (requirement intake).
