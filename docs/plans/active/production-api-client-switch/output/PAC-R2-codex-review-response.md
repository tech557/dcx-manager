# PAC-R2 — response to Codex output-review (2026-07-01)

Reviewed: `docs/plans/active/production-api-client-switch/output-review/2026-07-01-codex-PAC-R2-risk-review.md`
(verdict: ACCEPT WITH RISKS). Disposition of each finding below.

## P1 — `duplicateVersion` did not copy the builder tree on the real backend — **FIXED**

Codex correctly identified: `saveBuilderTree(newId, sourceTree.phases)` inserted the source tree's
phase/action/task/subtask rows with their **original IDs unchanged**. Those IDs are primary keys already
owned by the source version, so the insert would violate the PK constraint — silently swallowed by
`duplicateVersion`'s `try/catch`, leaving the new version with an empty builder tree while still reporting
success.

**Fix:** added `remapBuilderTreeIds()` (`src/services/real-dispatch.ts`) — generates a fresh ID for every
phase/action/task/subtask top-down and rewrites the parent-reference fields (`phaseId`/`actionId`/`taskId`)
to match, before the tree is handed to `saveBuilderTree`. Verified: `typecheck`/`lint`/`test`
(92/92)/`validate:architecture`/`verify.sh`/contract-drift all still PASS after the fix.

## P2 — `saveBuilderTree` is non-transactional delete-then-insert — **carried forward, not fixed**

Real risk: a mid-write failure during full-tree replace can leave a version with a partially restored or
empty tree. Not fixed in PAC-R2 because a true fix (wrapping the operation in a single Postgres
transaction) requires a Supabase RPC function, which means an `apply_migration` — **explicitly forbidden in
this sprint's frontmatter** (`forbidden-writes: ... any Supabase apply/promotion`). Fixing it here would
itself be a governance violation.

**Disposition:** tracked as a known limitation, carried forward to **PAC-R4/PAC-R5** (parity + cutover) —
per Codex's own recommendation, this must **block real-backend promotion** (PAC-R6) until resolved. Do not
enable `VITE_USE_REAL_BACKEND` against real user workflows before a transactional write path exists. Options
for the fix, to be decided at the appropriate sprint: (a) a Postgres RPC (`plpgsql`, transactional) that
performs the full delete+insert atomically, called via `db.rpc(...)` instead of the current 3+N round-trip
sequence; (b) or a compensating-rollback strategy if RPC isn't viable.

## P2 — acceptance is type-level, not live-behavior verified — **as-designed, correctly flagged by Codex**

This was intentional and already stated in PAC-R2's own output ("full detail in PAC-R4") — Codex confirms
this is acceptable *for PAC-R2* but "must block any real-backend promotion" until PAC-R4 actually runs live
route probes against the dev schema (RLS behavior, generated IDs, insert ordering, enum/jsonb shape
mismatches, auth-session behavior). No action needed at PAC-R2; flagging for whoever executes PAC-R4 to not
skip the live probe on the assumption PAC-R2 already covered it.

## P3 — version metadata drift (`VERSION.md` v1.0.4.0 vs `metadata.json` v1.0.1.0) — **not this sprint's to fix**

Pre-existing drift, unrelated to PAC-R2's changes (confirmed: neither file was touched by this sprint).
`docs/VERSION.md` is PO-maintained by hand per its own file header — not something an agent edits on its own
initiative. Flagged to the PO; no code action taken.

## Gate re-verification after the P1 fix

| Gate | Result |
|---|---|
| typecheck | PASS |
| lint | PASS |
| test | PASS (92/92) |
| validate:architecture | PASS (305 modules) |
| verify.sh | PASS |
| req:validate | PASS |
| req:completion-gate (`src/services/real-dispatch.ts`) | PASS |
| contract-drift | PASS |
