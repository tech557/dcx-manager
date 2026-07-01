# Backend Readiness Scorecard (BE3-R6, re-run at BE3-R7)

> **Gate verdict: 🟢 READY** — all six criteria PASS as of 2026-07-01 (BE3-R7 debt clearance). The dataset's
> static discovery (G1–G4) was complete at the first R6 run; **G5** is now met by a real seeded local-dev
> capture (PO-amended OD-BE3-03) and **G6** by a completed requirement intake. The hand-off to
> `production-api-client-switch` is **emitted** (below). The plan is **Completed** and archived under
> `docs/plans/completed/backend-discovery-v3/`.
>
> **History:** the first R6 run (2026-07-01) scored G5+G6 FAIL and correctly kept the plan in discovery
> (BE3-R5b was Partial — CI-credential-blocked). BE3-R7 cleared both *for real* (no override, no faked PASS):
> the PO amended the G5 sufficiency bar to a live **local** seeded walk, and the backend tooling
> manifestations were intaken and grounded to an approved requirement.

Scored against plan §9. Every line cites a captured artifact or a script output (G6 rule). Date: 2026-07-01.

| # | Criterion | Verdict | Evidence |
|---|---|---|---|
| **G1** | Contract complete & drift-free | ✅ **PASS** | `extract-routes.sh \| jq length` = 22 = `contract.json` routes (identical set); round-trip `tsc -p scripts/backend/tsconfig.contract-check.json` exit 0; `capture-contract-snapshot.sh` → "OK — no drift (22 routes match committed contract)" (exit 0), DRIFT on mutation (exit 1). Re-confirmed clean at BE3-R7. |
| **G2** | Schema derived & validated | ✅ **PASS** (1 tooling caveat) | `schema/schema.sql` = **17 tables + 6 enums** covering all 12 `Api*` entities + auth merge; `rationale.md` records every enum/relationship/nullability decision; **OD-BE3-01 resolved → jsonb**; offline structural check PASS. **Caveat:** full `supabase db lint` ⛔ BLOCKED (no CLI, §28) — carried to the build plan's CI. Column sizing/index/nullability hypotheses now backed by real captured field-population (G5). |
| **G3** | Auth/RLS modelled | ✅ **PASS** | `auth/rls-policies.sql` = **25 policies**; route×policy coverage table (`auth-model.md`) = **0 uncovered of 22**; interface conformance maps all 6 `MyAccess`/`DCXAccess` fields; **OD-BE3-02 → workspace-scoped**; addendum merged into `schema.sql` (BE3-R6). |
| **G4** | Integrations decided | ✅ **PASS** | `integrations/decision-matrix.md` = 4 decisions, **no "TBD"**; ClickUp/AI stay-stub-v1, Files external-URL-only (**OD-BE3-05**), GAS stay-out; build additions named + handed forward. |
| **G5** | Capture coverage sufficient | ✅ **PASS** (v1 bar, PO-amended OD-BE3-03) | Real **seeded UI walk against a live local dev server** (`VITE_BE3_CAPTURE=1`, port 4321), driving all 22 contract routes through the real `apiClient` tap. `captured/local/summary.json` (BE3-R7): **total_records 71, routes_observed 22/22, every route ≥ 3 captures** (min 3, several 4), **scrub_check PASS**, per-route field-population/null-rate/timing recorded. Meets **OD-BE3-03 N ≥ 3**. **Deferred (not a v1 blocker):** organic *live-preview* CI capture (BE3-R5b) continues to accumulate in the build plan. |
| **G6** | Every readiness claim evidence-backed | ✅ **PASS** | `req:validate` PASS (0 errors); `req:completion-gate --changed <7 backend files>` **PASS** (deterministic, 3/3 exit 0). The 7 backend capture/contract manifestations are grounded to approved **`REQ-GOV-TRACE-001-BACKEND`** via 7 committed trace links (`supports`/`verifies`) with PO sign-off ledger `LDG-2026-07-01-BE3-R7-BACKEND-TRACE-INTAKE` + proposal `PRP-2026-07-01-be3-r7-backend-trace-intake`. |

## Open decisions — status

| ID | Decision | Status |
|---|---|---|
| OD-BE3-01 (blocks G2) | `ApiTaskDate`/`ApiFieldCompletionState` → **jsonb** | ✅ RESOLVED |
| OD-BE3-02 (blocks G3) | tenancy → **workspace-scoped** | ✅ RESOLVED |
| OD-BE3-03 (blocks G5) | capture threshold **N = 3 payloads/route**; **v1 bar = real seeded LOCAL-dev walk** (PO-amended 2026-07-01) | ✅ RESOLVED **and MET** (22/22 @ ≥3) |
| OD-BE3-04 | auth provider → **Supabase Auth (email+OAuth)** | ✅ RECORDED (build-time) |
| OD-BE3-05 (blocks G4) | files → **external-URL-only v1** | ✅ RESOLVED |
| OD-BE3-06 | make drift/coverage gates *required* | ⏳ deferred (build plan, post-readiness) |

## Hand-off to `production-api-client-switch` — ✅ EMITTED (2026-07-01)

Readiness gate PASS → the build plan may activate and consume this **frozen** dataset:

| Input | Artifact | Use in build |
|---|---|---|
| Contract to implement | `docs/backend/contract/contract.json` + `contract.md` (22 routes) | implement `realDispatch` against these exact routes |
| Schema to apply | `docs/backend/schema/schema.sql` (17 tables, 6 enums, auth merged) | `apply_migration` (PO-gated) |
| RLS to write | `docs/backend/auth/rls-policies.sql` (25 policies) | write Supabase RLS |
| Integration scope | `docs/backend/integrations/decision-matrix.md` | build/stub per v1 decision |
| Real payload fixtures + column confirmation | `docs/backend/captured/local/summary.json` (22 routes, ≥3 samples, field-population/null-rate) | parity tests + confirm column sizing/nullability/index hypotheses |

**Carried-forward (not blocking, tracked in the build plan):**
- Full `supabase db lint` of `schema.sql` (needs the Supabase CLI in build CI — §28).
- Organic live-preview CI capture (BE3-R5b `backend-capture.yml`, credential-blocked) accumulates continuously once GitHub Actions write + Vercel preview creds are granted — augments, never replaces, the v1 local dataset.
- OD-BE3-06: promote contract-drift + capture-coverage gates from advisory → required.
