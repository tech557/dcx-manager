# Schema Derivation Rationale (BE3-R2)

Per-decision record for [`schema.sql`](./schema.sql). Every column traces to an `src/types/api.ts` field.
Anything not derivable from types alone (sizing, indexes, some nullability, id format) is marked
**HYPOTHESIS** and is deliberately left open until **BE3-R5 capture** confirms it (that is why capture
gates readiness — plan §9 G5). Nothing here is applied (D-BE3-NO-APPLY).

## Derivation rules applied

| Rule | Applied as |
|---|---|
| Every `Api*` field → a column | 1:1 snake_case mapping; the mapper layer bridges the seam |
| `T \| null` → nullable | e.g. `sub_product`, `composition_id`, `is_small`, all `*_at` optionals |
| enum unions → Postgres enum | 5 enums (see erd.md); file `source` → `file_source` enum |
| `ApiJsonValue \| null` / metadata / `*_context` / `details` → `jsonb` | `dcx.metadata`, `versions.metadata`/`strategy_context`, `phases/actions/tasks.metadata`, `tasks.generation_context`, `activity_events.details`, `subtasks.metadata` |
| Discriminated unions → jsonb (OD-BE3-01) | `tasks.date`, `tasks.specs_state`, `tasks.missing_data_state` |
| Arrays of scalars → `text[]` | `dcx.tags` |
| Arrays of ids (M:N) → join table | `availableCompositionIds`, `definitionIds`, `channelIds` |
| `ApiBuilderTree` → view/composite read | not a table |

## OD-BE3-01 — `ApiTaskDate` / `ApiFieldCompletionState`: jsonb vs. normalized

**Decision (recommended): `jsonb`.** Blocks G2.

| Option | Pros | Cons |
|---|---|---|
| **jsonb** (recommended) | preserves the discriminated-union shape 1:1 (`{mode:'unset'}` / `{mode:'linked',weekOffset,dayOffset}` / `{mode:'fixed',date}`; `{status:'filled',value}` / `{status:'not-needed'}` / `{status:'empty'}`); no lossy flattening; mapper stays trivial; variants can evolve without a migration | not directly queryable without `->>`; no column-level constraint on variant fields |
| normalized columns | queryable/indexable variant fields; DB-enforced types | explodes one field into `mode` + nullable `week_offset`/`day_offset`/`fixed_date` (and `status` + `value`); reintroduces the "which columns are valid for which mode" invariant the union already encodes; heavier mapper |

**Rationale:** these unions are read/written as whole values by the builder, never filtered on in SQL today
(confirm with G5 capture — if capture shows server-side filtering by task date is needed, revisit). jsonb keeps
the type round-trip honest and defers normalization until a real query need appears. **Recorded as the OD-BE3-01
recommendation; final ratification is BE3-R6.**

## HYPOTHESIS columns — must be confirmed by BE3-R5 capture before G2 passes

| Column(s) | Hypothesis | What capture (G5) must confirm |
|---|---|---|
| all `id` PKs | `text` (matches current string ids) | real id format — if UUIDs, switch to `uuid` + `gen_random_uuid()` default |
| `versions.communicated_date` and other `*_at` | `timestamptz` | whether `communicated_date` is a date-only value (→ `date`) vs timestamp |
| `channels.icon` | free `text` | whether icon is a bounded set (→ enum) or arbitrary |
| `version_members.role` | free `text` | the real role set — likely becomes an enum with the BE3-R3 auth model |
| all `text` columns | unbounded `text` | real max lengths → whether to cap (e.g. `varchar(n)`) for indexing |
| index candidates | none declared yet | which FKs/filters are hot (e.g. `versions.dcx_id`, `activity_events.version_id`, `tasks.action_id`) — add indexes once capture shows cardinality/access patterns |
| `dcx.client_id` | plain `text` | whether it FKs a real `clients`/`workspaces` table (BE3-R3 auth introduces `workspaces`) |

**No column sizing, nullability-on-a-hypothesis, or index is finalized here** — that is exactly what capture
(BE3-R5) exists to ground (plan §4 + §9 G5).

## RLS

RLS is `ENABLE`d on every table in `schema.sql`, but **policies are the BE3-R3 addendum**
(`docs/backend/auth/rls-policies.sql`) plus the `workspaces`/`memberships`/`roles` tables in
`docs/backend/auth/schema-auth-additions.sql`. BE3-R6 merges the addendum into `schema.sql`. R2 does not
write auth tables or policies (single-owner carry-forward; audit blocking #3).

## Validation performed (BE3-R2)

| Check | Method | Result |
|---|---|---|
| Entity parity | every plan-§4 `Api*` entity has a table | ✅ 12/12 entities mapped (+3 M:N joins = 15 tables); `ApiBuilderTree` = view |
| Enum parity | every enum union → enum/check | ✅ 5/5 (`version_status`, `version_source_type`, `lifecycle_event_type`, `phase_icon_type`, `file_source`) |
| SQL syntax (full) | `psql`/`supabase db lint` | ⛔ **BLOCKED — no psql / supabase CLI locally** (core.md §28); no engine could apply anyway (D-BE3-NO-APPLY) |
| SQL structure (fallback) | offline node structural parse | ✅ PASS — balanced parens, all 6 FK targets defined & created-before-use, all 5 enums defined before use, no dup tables, 35 statements |
| No-apply proof | `list_tables` + `list_migrations` before/after | ✅ both Supabase projects still 0 tables, 0 migrations; nothing applied |
