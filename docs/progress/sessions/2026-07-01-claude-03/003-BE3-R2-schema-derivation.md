## BE3-R2 — Schema derivation (proposed, never applied)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v1.0.1.0
Change-Class: non-source

Intent: Derive a proposed Supabase schema (tables/enums/FKs/constraints/RLS-enable) from Api* types + mock seed, with per-column rationale. Nothing applied.
Trigger: backend-discovery-v3 execution (BE3-R2).
Requirements covered: REQ-DM-017, REQ-DM-018, REQ-GOV-TRACE-001-DATA

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/backend/schema/schema.sql | 5 enums + 15 tables + RLS enable | 261 |
| created | docs/backend/schema/erd.md | entity→table map + Mermaid ERD + enums | 58 |
| created | docs/backend/schema/rationale.md | derivation rules, OD-BE3-01, HYPOTHESIS cols, validation | 65 |
| created | docs/plans/active/backend-discovery-v3/output/BE3-R2-schema.md | sprint output | 47 |
| edited | docs/plans/active/backend-discovery-v3/README.md | carry-forward: R2 facts + tooling debt | +9 |
| edited | docs/backend/README.md | dataset index: schema → COMPLETE | ~1 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no `src/**`; schema derived from types, not forked |
| Open decisions used (⏱) | OD-BE3-01 recorded (jsonb recommended); HYPOTHESIS columns flagged, not silently defaulted |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-BE3-2-1 — every `Api*` entity has a table | PASS (12/12 + view) |
| AC-BE3-2-2 — every enum union → enum/check | PASS (5/5) |
| AC-BE3-2-3 — schema.sql syntax-valid | PASS via offline structural parse; DB-lint BLOCKED (no psql/supabase CLI, §28) |
| AC-BE3-2-4 — OD-BE3-01 recorded with recommendation | PASS (jsonb) |
| AC-BE3-2-5 — projects empty; no migration applied | PASS (list_tables=[], list_migrations=[]) |
| AC-BE3-2-6 — no `src/**` changed | PASS |

### Gates
| Gate | Result |
|---|---|
| typecheck | N/A — no code |
| verify.sh | N/A this task |
| validate:architecture | N/A — no src |
| test | N/A |
| SQL DB-lint | BLOCKED — no psql/supabase CLI (§28) |
| SQL structural (fallback) | PASS |
| no-apply (list_tables/list_migrations) | PASS (0/0) |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None.

### Open issues / follow-ups
- Tooling debt: full `supabase db lint` needs a machine with the CLI (or build-plan CI) — logged in plan carry-forward.
- HYPOTHESIS columns (id format, date type, icon/role enums, sizing, indexes, client_id FK) gate G2 until BE3-R5 capture confirms them.
- BE3-R3 adds RLS policies + workspaces/memberships/roles addendum; BE3-R6 merges into schema.sql.
