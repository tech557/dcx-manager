---
sprint: RG-R5
plan: cicd-release-governance
date: 2026-07-01
agent: Claude (claude-sonnet-5, Anthropic)
status: complete — env model live, keys scoped, migration gate built+tested; real prod-migration test deliberately not performed (see below)
---

# RG-R5 — Supabase environment separation

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PLAT-018, REQ-RG-APPROVAL-005, REQ-RG-AUTO-019 — approved, canonical graph nodes, PO-locked 2026-06-30 |
| Acceptance IDs | AC-RG-5-1 … AC-RG-5-5 — see status table below |
| Verification (EVD) | two real, live Supabase projects; real Vercel env-var scoping; a tested migration gate |

## AC-RG-5-1 — OD-RG-05 decided + recorded

Already PO-decided before this sprint (plan README D-RG-ENV / OD-RG-05, 2026-06-30): **separate
production project (hard isolation)**. This sprint refined the non-prod side of that decision: the
spec's literal "preview branches for preview/staging" turned out to be a **paid** Supabase feature
(~$0.0134/hour, confirmed via `get_cost`, not the $0/month a plain project costs) — the PO chose to use a
**second free project** (`dcx-manager-dev`) shared by preview and staging instead, rather than pay for
per-branch isolation. Recorded below and in the plan README carry-forward.

## What was built — real infrastructure, not just config

| Resource | ID | Region | Purpose |
|---|---|---|---|
| `dcx-manager-prod` | `xokgguodxjjwokngyquo` | `us-east-1` | Production — hard-isolated, never touched by preview/staging |
| `dcx-manager-dev` | `ibekkxqujqvlajeldpoa` | `us-east-1` | Shared by preview + staging (no paid branching) |

Both confirmed `ACTIVE_HEALTHY`; `get_advisors` (security) returned zero findings on both (expected —
no schema yet).

### AC-RG-5-2 — Keys scoped per environment, none in-repo

Set via the Vercel CLI (`vercel env add ... --value ... --yes`), confirmed via `vercel env ls`:

| Variable | Production | Preview | Development |
|---|---|---|---|
| `VITE_SUPABASE_URL` | `dcx-manager-prod` URL | `dcx-manager-dev` URL | `dcx-manager-dev` URL |
| `VITE_SUPABASE_ANON_KEY` | `dcx-manager-prod` publishable key | `dcx-manager-dev` publishable key | `dcx-manager-dev` publishable key |

All four stored **encrypted in Vercel**, never written to this repo. `git grep` for `sb_publishable`,
`sb_secret`, `service_role`, and `supabase.co` across tracked content found zero real key/URL leaks (two
unrelated pre-existing hits in `docs/archive/`/the requirements graph just mention "Supabase" as a
product term, not a credential).

### AC-RG-5-3 — Preview never targets prod data

By construction: `preview` and `development` environments both point at `dcx-manager-dev`;
`production` is the only environment pointing at `dcx-manager-prod`. There is no code path or config
that could cross them, since they're entirely separate Supabase projects (not row-level/schema
separation within one project, which would be weaker).

### AC-RG-5-4 — Prod migration gated to an approved release

New `scripts/release/gate-prod-migration.sh <version>`: pure gate check (no Supabase connection itself).
`ALLOWED` iff `docs/releases/approvals/<version>-production.md` exists with non-empty `approved-by` and
`approved-at`. Mirrors `promote.sh`'s gate-layer logic but as a standalone script, since migration-gating
is a pre-check a caller runs *before* invoking any actual Supabase migration tool — this script never
touches a database.

**Tested with disposable fixtures** (`GATE_APPROVALS_DIR` override, never touching the real
`docs/releases/approvals/`): blocked with no record, allowed with a complete record, blocked with an
incomplete record (missing `approved-by`/`approved-at`). 3/3 new tests, **26/26 total** in the suite.

**Deliberately not performed: a real production migration test.** Doing a genuinely live test (per the
sprint's own "blocked/allowed with dry-run" instruction) would require either (a) fabricating a
production approval record — which this agent must never do, since approval is the one gate explicitly
reserved for an actual PO decision (`core.md §26a`) — or (b) asking the PO to approve a synthetic
production "release" purely to test plumbing, the same way they did for the RG-R4 staging promotion.
Given there is no real schema or migration to run yet (the app is still 100% mocked — confirmed earlier
this session, `src/services/api-client.ts` routes to `mockDispatch`), a live test would have no real
migration content to gate anyway. **Flagging this as an honest gap rather than manufacturing a fake
approval just to exercise the script.** The gate logic itself is the same shape already proven live by
`promote.sh`'s identical approval-record contract in RG-R4.

## Acceptance criteria

| ID | Criterion | Verdict |
|---|---|---|
| AC-RG-5-1 | OD-RG-05 decided + recorded | **PASS** — pre-decided + refined this sprint (paid branching avoided) |
| AC-RG-5-2 | Keys scoped per environment; none in-repo | **PASS** — live in Vercel, `git grep` confirms no repo leaks |
| AC-RG-5-3 | Preview never targets prod data | **PASS** — by construction, separate projects |
| AC-RG-5-4 | Prod migration gated to an approved release | **PASS (mechanism, disposable-fixture tested)** — real live test deliberately not performed (see above); not a fabricated PASS |
| AC-RG-5-5 | no `src/**` changed | **PASS** — `find src -type f -exec shasum` pre/post diff empty |

## Gates

| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| migration-gate test | PASS — 3/3 new tests (blocked/allowed/incomplete-record), 26/26 total suite |
| advisors | PASS — zero security findings on both new projects |
