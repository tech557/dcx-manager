# PAC-R2 risk review — Claude output

Date: 2026-07-01
Reviewer: Codex
Subject: `docs/progress/sessions/2026-07-01-claude-05/005-production-api-client-switch-PAC-R2.md`
Verdict: ACCEPT WITH RISKS

## Scope Reviewed

- Claude PAC-R2 session log.
- PAC-R2 sprint output.
- `src/services/api-client.ts`
- `src/services/supabase-client.ts`
- `src/services/real-dispatch.ts`
- Supabase schema primary keys for builder hierarchy tables.

## Checks Re-run

| Gate | Result |
|---|---|
| `bash scripts/agent/build-current-state.sh` | PASS; current repo version `v1.0.4.0`; latest log is Claude PAC-R2 |
| `bash scripts/agent/verify-tooling-state.sh` | PASS; code index stale |
| `npm run typecheck` | PASS |
| `npm run lint` | PASS |
| `npm run test` | PASS; 13 files, 92 tests |
| `npm run validate:architecture` | PASS; 305 modules |
| `bash scripts/verify.sh` | PASS |
| `npm run req:validate` | PASS |
| `npm run req:completion-gate -- --changed src/services/real-dispatch.ts,src/services/api-client.ts,src/services/supabase-client.ts` | PASS for changed files |
| `bash scripts/backend/capture-contract-snapshot.sh` | PASS; 22 routes match |
| `bash scripts/agent/verify-log-claims.sh docs/progress/sessions/2026-07-01-claude-05/005-production-api-client-switch-PAC-R2.md` | Non-useful PASS; checked 0 claims |

## Findings

### P1 — `duplicateVersion` likely does not copy the builder tree on the real backend

`duplicateVersion` loads the source builder tree and passes `sourceTree.phases` directly into `saveBuilderTree(newId, ...)`.
`saveBuilderTree` inserts each phase/action/task/subtask using the incoming IDs unchanged. The Supabase schema defines
`phases.id`, `actions.id`, `tasks.id`, and `subtasks.id` as primary keys, so copying an existing tree into a new version
with the same IDs should violate primary-key constraints. The error is caught and only logged, then the route still returns
the newly created version.

Evidence:
- `src/services/real-dispatch.ts:338-390` inserts the incoming hierarchy IDs unchanged.
- `src/services/real-dispatch.ts:662-669` catches tree-copy failure and still returns `loadFullVersion(newId)`.
- `docs/backend/schema/schema.sql:190-245` defines the hierarchy IDs as primary keys.

Risk: real `POST /versions/:sourceVersionId/duplicate` can appear successful while creating a version without its copied
builder tree. This is directly on the v1 version-creation path.

Suggested remediation: when duplicating, deep-clone the builder tree with fresh IDs and updated parent references before
calling `saveBuilderTree`, or make duplication a transactional backend RPC that performs the ID remap atomically.

### P2 — `PATCH /versions/:versionId/builder` is non-transactional delete-then-insert

`saveBuilderTree` deletes the existing subtree bottom-up and then inserts the replacement hierarchy. If any insert fails
after deletion, the version can be left with a partially restored or empty builder tree.

Evidence:
- `src/services/real-dispatch.ts:302-403` performs multiple delete and insert calls without a transaction boundary.
- PAC-R2 output acknowledges full-tree replace behavior but does not flag the partial-write risk.

Risk: once the real backend flag is enabled, a failed builder save can cause data loss or partial state. This is acceptable
only if PAC-R4/PAC-R5 keep it blocked from real user workflows until a transactional path exists.

Suggested remediation: move full-tree replace into a Supabase RPC/SQL transaction, or add a temporary table/versioned write
strategy with rollback behavior.

### P2 — PAC-R2 acceptance is type-level, not live-behavior verified

The claimed route parity is valid for method/path coverage and TypeScript shapes, and the contract snapshot passes. However,
the PAC-R2 output explicitly defers live route-by-route probing with the real Supabase schema to PAC-R4.

Evidence:
- `docs/plans/active/production-api-client-switch/output/PAC-R2-real-dispatch.md:41-46`
- `docs/progress/sessions/2026-07-01-claude-05/005-production-api-client-switch-PAC-R2.md:68-71`

Risk: runtime issues such as RLS behavior, generated IDs, insert ordering, enum/json shape mismatches, and auth-session
behavior remain unproven. This is not a blocker for PAC-R2 if the plan intentionally defers live probing, but it must block
any real-backend promotion.

### P3 — version metadata drift remains in logs/state

Current state reports `docs/VERSION.md` as `v1.0.4.0`, while `metadata.json` remains `v1.0.1.0`. Claude's PAC-R2 log records
`Version: v1.0.3.0`.

Risk: release/governance work may cite inconsistent versions unless version metadata is reconciled before promotion.

## Positive Findings

- The dispatcher switch remains behind `VITE_USE_REAL_BACKEND` and mock remains the default.
- Query/UI directories were not touched by PAC-R2.
- `real-dispatch.ts` does not import `api-mappers.ts` or domain types.
- Source, architecture, requirement validation, completion gate for changed files, and contract snapshot all pass locally.

## Recommendation

Do not block PAC-R2 documentation as a scoped flagged implementation, but do not treat PAC-R2 as production-ready. Fix or
explicitly carry forward the duplicate-copy bug and non-transactional builder save risk before PAC-R4/PAC-R5 live parity or
real-backend promotion.
