# Backend Readiness Dataset

> Created by **BE3-R0** (`docs/plans/active/backend-discovery-v3/`). This directory is the single home for
> the backend-readiness dataset the `backend-discovery-v3` plan produces. When the readiness gate (§9 of the
> plan / `readiness-scorecard.md`) passes, the follow-up **`production-api-client-switch`** build plan reads
> this dataset and connects the real Supabase backend with no open discovery questions.

**Hard boundary:** this dataset is *discovery-only*. No Supabase schema is applied, no `promote.sh` is run,
no real endpoint is wired into `apiClient`. The one sprint that touches `src/**` (BE3-R5a) adds an
**off-by-default** capture sink only (`VITE_BE3_CAPTURE=1`).

## How to read this dataset

1. Start with **`contract/`** — the frozen interface the backend must implement (every route + its types).
2. Read **`schema/`** — the proposed Postgres/Supabase tables derived from the `Api*` types + mock seed.
3. Read **`auth/`** — how the `access.service.ts` seam maps to real Supabase Auth + Row-Level Security.
4. Read **`integrations/`** — the per-integration real-vs-stub v1 decisions.
5. Read **`captured/`** — real request/response summaries captured mechanically from preview deploys.
6. Finish with **`readiness-scorecard.md`** — the go/no-go gate that scores G1–G6 and, on PASS, hands off.

Everything here traces to a captured artifact or a script output — never to "an agent read the code and
believes." Source of truth for the contract surface is `src/services/mock-dispatch.ts` (D-BE3-CONTRACT-SOT);
domain shapes are `src/types/api.ts` + `src/types/lifecycle.ts`.

## Dataset index

| Part | Path | Owner sprint | Status |
|---|---|---|---|
| 1. Frozen API contract | `contract/contract.json` + `contract.md` | BE3-R1 | ✅ COMPLETE (22 routes) |
| 2. Proposed schema | `schema/schema.sql` + `erd.md` + `rationale.md` | BE3-R2 (+R6 auth merge) | ✅ COMPLETE (17 tables, 6 enums post-merge) |
| 3. Auth & RLS model | `auth/auth-model.md` + `rls-policies.sql` + `schema-auth-additions.sql` | BE3-R3 | ✅ COMPLETE (25 policies) |
| 4. Integration decisions | `integrations/decision-matrix.md` | BE3-R4 | ✅ COMPLETE (4 decisions) |
| 5. Captured usage data | `captured/<version>/summary.json` | BE3-R5b (CI) | 🟡 PARTIAL — CI authored, live run credential-blocked (local proof only) |
| — Capture substrate (scripts + sink) | `scripts/backend/**`, `src/telemetry/capture-sink.ts` | BE3-R5a | ✅ COMPLETE (off-by-default, no-harm proven) |
| 6. Readiness scorecard (the gate) | `readiness-scorecard.md` | BE3-R6 | 🔴 SCORED — gate NOT READY (G5+G6 fail; re-runnable) |
| PO-review overview | `endpoint-integration-overview.md` | (PO context) | 📋 endpoint→feature map + integration plan + decisions to confirm |

_Status legend: ⏳ PENDING · 🔄 IN PROGRESS · ✅ COMPLETE · ⛔ BLOCKED_

## Verified baseline (BE3-R0, 2026-07-01)

| Fact | Value | Evidence |
|---|---|---|
| Contract surface | **22 routes** registered in `src/services/mock-dispatch.ts` (bootstrap `grep` sanity count) | authoritative deterministic count is **deferred to BE3-R1's `scripts/backend/extract-routes.sh`** (plan reaudit advisory #1) — this `grep` is a bootstrap sanity check only |
| Domain types | complete `Api*` set in `src/types/api.ts`; enums in `src/types/lifecycle.ts` | read 2026-07-01 |
| Supabase `dcx-manager-prod` (`xokgguodxjjwokngyquo`) | **0 public tables** (empty) | `list_tables` (read-only) 2026-07-01 |
| Supabase `dcx-manager-dev` (`ibekkxqujqvlajeldpoa`) | **0 public tables** (empty) | `list_tables` (read-only) 2026-07-01 |
| `src/**` changed by R0 | none | `git diff --name-only -- src/` empty |

See the plan README `## Carry-forward contract` for the living forward-truth each sprint updates.
