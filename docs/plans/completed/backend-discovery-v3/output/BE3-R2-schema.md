# BE3-R2 — Schema derivation (output)

Agent: Claude · Model: claude-opus-4-8 · Provider: Anthropic · Date: 2026-07-01
Version: v1.0.1.0 · Change-Class: non-source

## What this sprint produced

A **proposed** Supabase schema derived mechanically from `src/types/api.ts` + `src/types/lifecycle.ts` +
mock seed — **never applied** (D-BE3-NO-APPLY).

| Artifact | Path | Content |
|---|---|---|
| Schema | `docs/backend/schema/schema.sql` | 5 enums + 15 tables (12 entities + 3 M:N joins) + RLS ENABLE per table |
| ERD | `docs/backend/schema/erd.md` | entity→table map + Mermaid ER diagram + enum table |
| Rationale | `docs/backend/schema/rationale.md` | per-rule derivation, OD-BE3-01 decision, HYPOTHESIS columns, validation |

## Acceptance criteria

| Criterion | Verdict | Evidence |
|---|---|---|
| AC-BE3-2-1 — every §4 `Api*` entity has a table | ✅ PASS | 12/12 entities mapped (+3 joins = 15 tables); `ApiBuilderTree` = view (documented) |
| AC-BE3-2-2 — every enum union → enum/check | ✅ PASS | 5/5 enums (`version_status`, `version_source_type`, `lifecycle_event_type`, `phase_icon_type`, `file_source`) |
| AC-BE3-2-3 — `schema.sql` syntax-valid | ⚠️ PASS (fallback) / DB-lint ⛔ BLOCKED | no `psql`/`supabase` CLI locally (§28); offline structural parse PASS — balanced parens, all FK targets defined & ordered, enums defined before use, no dup tables, 35 statements |
| AC-BE3-2-4 — OD-BE3-01 recorded with recommendation | ✅ PASS | rationale.md: jsonb recommended over normalized, trade-off table + rationale |
| AC-BE3-2-5 — both projects empty; no migration applied | ✅ PASS | `list_tables` = [] (dev re-checked post-authoring); `list_migrations` = [] (dev); nothing applied |
| AC-BE3-2-6 — no `src/**` changed | ✅ PASS | `git diff --name-only -- src/` empty |

## OD-BE3-01 (recorded)
`ApiTaskDate` / `ApiFieldCompletionState` → **jsonb** (recommended). Preserves the discriminated-union shape
1:1; no lossy flattening; revisit only if G5 capture shows a server-side query need. Final ratification: BE3-R6.

## HYPOTHESIS columns (must be confirmed by BE3-R5 capture before G2 passes)
id format (text vs uuid) · `communicated_date` (timestamptz vs date) · `channels.icon` (text vs enum) ·
`version_members.role` (text vs enum) · all text sizing · index candidates · `dcx.client_id` (FK to future
workspace). Listed in rationale.md.

## Gates

| Gate | Result |
|---|---|
| entity parity | PASS (12/12 + view) |
| enum parity | PASS (5/5) |
| SQL DB-lint | BLOCKED — no psql/supabase CLI (§28) |
| SQL structural (fallback) | PASS (offline node parse) |
| no-apply proof (`list_tables`/`list_migrations`) | PASS (0/0, unchanged) |
| no-src diff | PASS (empty) |

## Follow-ups
- Full `supabase db lint` deferred to a machine with the CLI (or the build plan's CI) — tooling debt logged.
- BE3-R3 attaches RLS policies + `workspaces`/`memberships`/`roles` addendum; BE3-R6 merges it into `schema.sql`.
- All HYPOTHESIS columns gate G2 until BE3-R5 capture confirms them.
