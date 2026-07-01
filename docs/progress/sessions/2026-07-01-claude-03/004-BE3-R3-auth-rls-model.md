## BE3-R3 — Auth & RLS model
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v1.0.1.0
Change-Class: non-source

Intent: Map access.service.ts seam to Supabase Auth + RLS; draft a policy for every contract route; addendum tables for R6 to merge.
Trigger: backend-discovery-v3 execution (BE3-R3).
Requirements covered: REQ-PR-001, REQ-PR-020

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/backend/auth/auth-model.md | interface conformance + route×policy coverage + OD-BE3-02/04 | 97 |
| created | docs/backend/auth/rls-policies.sql | 25 draft RLS policies | 124 |
| created | docs/backend/auth/schema-auth-additions.sql | workspaces/memberships/role enum + 3 helper fns | 74 |
| created | docs/plans/active/backend-discovery-v3/output/BE3-R3-auth.md | sprint output | 50 |
| edited | docs/plans/active/backend-discovery-v3/README.md | carry-forward: R3 facts + R3→R6 merge follow-up | +8 |
| edited | docs/backend/README.md | dataset index: auth → COMPLETE | ~1 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no src; did NOT edit schema/ (single-owner boundary, audit blocking #3) |
| Open decisions used (⏱) | OD-BE3-02 (workspace-scoped) + OD-BE3-04 (Supabase Auth) recorded with recommendation, not silently defaulted |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-BE3-3-1 — model satisfies MyAccess + DCXAccess exactly | PASS (6/6 fields mapped) |
| AC-BE3-3-2 — write route→write policy; read route→visibility | PASS (0 uncovered of 22) |
| AC-BE3-3-3 — OD-BE3-02 + OD-BE3-04 recorded | PASS |
| AC-BE3-3-4 — RLS + addendum syntax-valid | PASS (structural); DB-lint BLOCKED (§28) |
| AC-BE3-3-5 — no schema/** or src/** edited, no policy applied | PASS |

### Gates
| Gate | Result |
|---|---|
| interface conformance | PASS |
| route×policy coverage | PASS (0 uncovered) |
| SQL DB-lint | BLOCKED — no CLI (§28) |
| SQL structural (fallback) | PASS (both files: balanced parens, $$ paired, no dup policy) |
| no schema/src edit; no apply | PASS |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None.

### Open issues / follow-ups
- R3→R6 MERGE: merge schema-auth-additions.sql into schema.sql + rename dcx.client_id → dcx.workspace_id (recorded in carry-forward).
- Reconcile version_members.role vs memberships.role at build.
- Full supabase db lint deferred (tooling debt).
