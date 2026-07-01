## PAC-R1 — Apply schema + RLS to Supabase dev (PO-approved)
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v1.0.3.0
Change-Class: non-source

Intent: Stand up the real dev schema (17 tables, 6 enums, 25 RLS policies) on `dcx-manager-dev` exactly as backend-discovery-v3 proposed, so PAC-R2's dispatcher has a real backend to hit. Prod untouched.
Trigger: Sprint execution, PAC-R1 (plan production-api-client-switch), following PO approval to apply
Requirements covered: REQ-BE-SCHEMA-001

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/backend/switch/apply-approval-dev.md | Records PO approval to apply to dev (AC-PAC-1-1) | 13 |
| created | supabase/migrations/20260701120812_init.sql | Local record of the assembled + applied schema+RLS migration | 448 |
| created | supabase/migrations/20260701121415_harden_rls_helper_grants.sql | Local record of the anon-EXECUTE-revoke follow-up migration | 15 |
| created | src/types/supabase.ts | Generated via generate_typescript_types (dev); AC-PAC-1-4 | 855 |
| created | docs/plans/active/production-api-client-switch/output/PAC-R1-dev-apply.md | Sprint output — AC evidence, advisor triage, gate results | 86 |
| edited | docs/plans/active/production-api-client-switch/sprints/PAC-R1.md | status Drafted → Completed; all 6 AC checked | small |
| edited | docs/plans/active/production-api-client-switch/README.md | Carry-forward — PAC-R1 entry appended | +14 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | `docs/backend/schema/schema.sql` / `rls-policies.sql` left byte-for-byte unchanged (frozen discovery artifact); only the *assembled migration's* statement order was adjusted (functions moved after their dependent tables) to make identical DDL executable — no columns/types/policies changed |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-PAC-1-0 — ID lock cleared (real REQ-BE-SCHEMA-001, no wildcard) | PASS |
| AC-PAC-1-1 — recorded PO approval exists, cited | PASS — `apply-approval-dev.md` |
| AC-PAC-1-2 — migration applied to dev; 17 tables | PASS — `list_tables` = 17/17 |
| AC-PAC-1-3 — advisors security, RLS on every table | PASS (RLS 17/17) with 5 findings triaged and recorded (3 structural WARN, 2 by-design INFO) — not a silent 0, see output doc for full disposition |
| AC-PAC-1-4 — types generated + typecheck | PASS — `npm run typecheck` 0 errors |
| AC-PAC-1-5 — prod untouched | PASS — prod `list_tables` = [], `list_migrations` = [] |

### Gates
| Gate | Result |
|---|---|
| typecheck | PASS (0 errors) |
| lint | N/A — sprint's own gate table marks lint/test/verify advisory-only (no app src behavior change) |
| test | N/A (same) |
| validate:architecture | N/A (same) |
| verify.sh | N/A (same) |
| browser manual check | N/A — generated types file, not yet wired to any UI/runtime path |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None yet — `src/types/supabase.ts` is not imported anywhere until PAC-R2 wires the real dispatcher.

### Open issues / follow-ups
- `docs/backend/schema/schema.sql` has a real statement-ordering defect (RLS helper functions declared before their dependent tables) — worked around at apply time without forking the source file; should be corrected in the discovery dataset itself in a future doc-only edit so the next environment that applies this file directly (e.g. prod at PAC-R6) doesn't hit the same error blind. Recommend fixing `schema.sql`'s function placement before PAC-R6.
- 3 `authenticated`-facing `SECURITY DEFINER` RPC-exposure WARNs remain (structural, needed for RLS to function) — a full fix (move helpers to a non-exposed `private` schema) is deferred to a future hardening sprint, not blocking.
- Performance advisors (64 findings, all INFO/WARN) recorded as backlog, not fixed — mirrors the discovery G2 caveat already tracked.
