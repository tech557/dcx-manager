---
plan: production-api-client-switch
status: active
classification: Path 1 — ACTIVE EXECUTABLE PLAN (sprint files present with acceptance criteria; dcx-plan-audit READY; BE3 readiness gate PASS; PO activation complete)
stage: Active — Codex reaudit READY (0 blocking) on 2026-07-01; BE3-R6 gate G1–G6 all PASS after BE3-R7; PO activated
version_context: v1.0.2.0        # re-copied from docs/VERSION.md at activation (core.md §26); was v1.0.1.0 at draft time
created: 2026-07-01
activated: 2026-07-01 (PO request: "clear the debt now in a one final sprint" — BE3 discovery reached READY via BE3-R7; PO activated this build plan. Two-stage activation stands: activate PAC-R0 first to collect PO confirmations + signed REQ-BE-* IDs, then PAC-R1..R6.)
author: Claude (claude-opus-4-8, Anthropic)
prior-art: completed/backend-discovery-v3 (the readiness dataset this plan consumes — contract/schema/auth/integrations/captured), completed/cicd-release-governance (the release pipeline + promote.sh + approvals this plan promotes through), completed/backend-discovery-v2 (pre-refactor readiness audit), completed/folder-structure-v2 (P4 wired apiClient → mockDispatch — the seam this plan swaps)
depends-on: backend-discovery-v3 readiness gate (§9) = READY — ✅ SATISFIED 2026-07-01 (BE3-R6 rescore after BE3-R7: G1–G6 all PASS; hand-off emitted in docs/backend/readiness-scorecard.md).
does-not-disrupt: keeps mockDispatch as the default until real-backend parity is proven behind a flag; no UI/component changes (the 22-route apiClient contract is preserved); ClickUp/AI stay stubs; GAS stays out
audit-result: READY — audit/2026-07-01-codex-reaudit.md (0 blocking, 2 advisory: version_context re-copied to v1.0.2.0 at activation ✅; metadata drift noted)
---

# Plan: production-api-client-switch — connect the real Supabase backend behind the frozen contract

> **Status: ACTIVE (2026-07-01).** All three activation preconditions are met: (a) `dcx-plan-audit` returned
> READY (`audit/2026-07-01-codex-reaudit.md`, 0 blocking); (b) the PO moved it to `docs/plans/active/`; and
> (c) `backend-discovery-v3` reached its readiness gate (§9 = all G1–G6 PASS after BE3-R7). Agents may now
> execute these sprints — **starting with PAC-R0** (collect PO confirmations + signed `REQ-BE-*` IDs) before
> PAC-R1..R6. This plan applies Supabase schema and wires a real backend, so every `apply_migration` is
> PO-gated and production promotion goes only through `promote.sh` (core.md §26a). See core.md §24/§34.

## Purpose

Replace the in-memory/localStorage `mockDispatch` backend with a **real Supabase backend**, implemented
**behind the existing 22-route `apiClient` contract** (frozen in `backend-discovery-v3`). Because every data
call in the app already funnels through `apiClient(route) → mockDispatch`, the switch is mechanical: implement
the 22 routes against Supabase (schema + RLS from the discovery dataset), then swap the dispatcher — the mapper
layer (`api-mappers.ts`) and every UI component stay unchanged.

**What this plan consumes (the discovery dataset — do not re-derive):**
| Input | From |
|---|---|
| The 22-route contract to implement | `docs/backend/contract/contract.json` + `contract.md` (BE3-R1) |
| The schema to apply | `docs/backend/schema/schema.sql` (BE3-R2 + BE3-R6 auth merge: 17 tables, 6 enums) |
| The RLS to write | `docs/backend/auth/rls-policies.sql` (BE3-R3: 25 policies) |
| Integration scope | `docs/backend/integrations/decision-matrix.md` (BE3-R4) |
| Real payload fixtures | `docs/backend/captured/**` (BE3-R5b — needed for parity tests) |
| Where each endpoint is used | `docs/backend/endpoint-integration-overview.md` |

**Hard boundary — this plan applies mutations and must be governed:** unlike discovery, this plan **applies
schema to Supabase** and **wires a real backend**. Therefore: (1) every Supabase `apply_migration` is gated on
a **recorded PO approval**; (2) production promotion goes **only** through `scripts/release/promote.sh` +
`docs/releases/approvals/<version>-<env>.md` (core.md §26a); (3) the real backend ships behind a flag
(`VITE_USE_REAL_BACKEND`) so mock stays default until parity is proven. No auto-promotion, ever.

## Decisions carried in from discovery (PO-delegated 2026-07-01; confirm at PAC-R0)

| ID | Decision | Confirm at PAC-R0 |
|---|---|---|
| Access model | **workspace-scoped** RLS (`MyAccess.workspaceIds`) | ✅ confirm vs per-DCX |
| Auth provider | **Supabase Auth (email + OAuth)** | ✅ |
| Files | **external-URL-only** for v1 (no Supabase Storage) | ✅ (attachments UI not wired today) |
| Discriminated unions | **jsonb** (`ApiTaskDate`, `ApiFieldCompletionState`) | technical |
| Integrations | ClickUp **stub**, AI **build-next (separate)**, GAS **out** | ✅ |
| Version creation | **duplicate-only** (no create-from-scratch route today) | ✅ **or** add a create endpoint (OD-PAC-01) |

## Open decisions (resolve during the plan)

| ID | Decision | Blocks |
|---|---|---|
| **OD-PAC-01** | Add a create-from-scratch version endpoint (`POST /versions`) or keep duplicate-only for v1 | PAC-R2 contract surface |
| **OD-PAC-02** | Builder tree write (`PATCH /versions/:id/builder`) — full-tree replace vs. diff-based upsert transaction | PAC-R2 |
| **OD-PAC-03** | Data migration: seed dev only, or migrate any existing mock/localStorage data | PAC-R4 |
| **OD-PAC-04** | Cutover strategy: per-route incremental (strangler) vs. whole-dispatcher flip behind the flag | PAC-R2/R5 |

## Sprint plan

**Execution order:** `PAC-R0 → PAC-R1 → PAC-R2 → PAC-R3 → PAC-R4 → PAC-R5 → PAC-R6`
(R2 and R3 may overlap once R1 lands; R6 is PO-gated and last.)

| Sprint | Title | Change-Class | Writes | Applies mutations? |
|---|---|---|---|---|
| [PAC-R0](./sprints/PAC-R0.md) | Prerequisites, PO confirmations & switch architecture | non-source | `docs/**`, plan docs | no |
| [PAC-R1](./sprints/PAC-R1.md) | Apply schema + RLS to Supabase **dev** (PO-approved) | non-source (SQL apply) | migration on `dcx-manager-dev`, generated types | **yes — dev only, PO-approved** |
| [PAC-R2](./sprints/PAC-R2.md) | Real dispatcher implementing the 22 routes (flagged) | **source** | `src/services/**` (real client + flag) | no |
| [PAC-R3](./sprints/PAC-R3.md) | Supabase Auth wiring → `MyAccess`/`DCXAccess` + RLS | **source** | `src/services/access.*`, `src/ui/auth/**` | no |
| [PAC-R4](./sprints/PAC-R4.md) | Route parity + data seed (real vs. contract) | **source** (tests) | `src/**/*.test.ts`, seed scripts | dev seed only |
| [PAC-R5](./sprints/PAC-R5.md) | Cutover behind flag on a **preview** (dev backend) | **source** | flag default, env wiring | no (preview) |
| [PAC-R6](./sprints/PAC-R6.md) | Staging/Production promotion (PO sign-off, release governance) | non-source | approvals, `promote.sh` run | **yes — prod, PO-signed** |

## Carry-forward contract — current structural state (core.md §27)

Single source of forward truth for this plan. Every sprint's Step 0 reads this; every sprint's final step
updates it.

### Canonical homes (reuse — never recreate)
| Concern | Canonical home | Reuse rule |
|---|---|---|
| Contract surface | `docs/backend/contract/contract.json` (22 routes) + `src/services/mock-dispatch.ts` | the real dispatcher implements exactly these routes; parity is checked against `contract.json` |
| Domain shapes / mappers | `src/types/api.ts` + `src/services/api-mappers.ts` | never bypass the mapper (core.md §5/§9.4); real responses map through it unchanged |
| Apply/promote governance | `scripts/release/promote.sh` + `docs/releases/approvals/` + `docs/releases/registry.csv` | all schema applies + promotions go through the RG pipeline; no ad-hoc `apply_migration` without approval |
| Capture / parity fixtures | `docs/backend/captured/**` + `scripts/backend/capture-contract-snapshot.sh` | reuse the capture summaries as parity fixtures; reuse the drift gate |
| Schema / RLS source | `docs/backend/schema/schema.sql` + `docs/backend/auth/rls-policies.sql` | apply these as-is (do not fork); any change is a discovery-dataset edit first |

### Facts each sprint leaves behind
_To be appended by each sprint as it closes (PAC-R0 first). At draft time: nothing built; mock is still the
only backend; both Supabase projects empty._

**PAC-R0 (2026-07-01, Completed):**
- Readiness reconfirmed READY (cited `docs/backend/readiness-scorecard.md`).
- PO confirmations recorded: `docs/backend/switch/po-confirmations.md` — access model workspace-scoped,
  **OD-PAC-01 closed → duplicate-only** (no new version-create endpoint), files external-URL-only,
  integrations ClickUp-stub/AI-separate/GAS-out.
- Switch architecture recorded: `docs/backend/switch/architecture.md` — flag `VITE_USE_REAL_BACKEND`,
  **OD-PAC-04 closed → whole-dispatcher flip**, real-dispatcher shape (`src/services/real-dispatch.ts`,
  reuses `api-mappers.ts`), apply order dev-first/prod-last. OD-PAC-02/OD-PAC-03 deferred to PAC-R2/PAC-R4.
- Requirement intake queued (not yet signed): `PRP-2026-07-01-create-node-REQ-BE-{SCHEMA,AUTH,API}-001.json`.
- Both Supabase projects (`dcx-manager-dev` = `ibekkxqujqvlajeldpoa`, `dcx-manager-prod` =
  `xokgguodxjjwokngyquo`) confirmed **zero migrations** — no schema applied yet.
- **Blocking for PAC-R1+:** the 3 `REQ-BE-*` proposals need PO sign-off (`req:apply-after-signoff`) before
  any sprint past PAC-R0 may execute (ID-lock rule, audit blocking #1). This is the next PO action.
- **RESOLVED 2026-07-01:** PO signed off all 3 proposals (`LDG-2026-07-01-create-node-REQ-BE-{SCHEMA,AUTH,API}-001`).
  Wildcards replaced with real IDs (`REQ-BE-SCHEMA-001`/`REQ-BE-AUTH-001`/`REQ-BE-API-001`) across
  PAC-R1/R2/R3/R6 traces + this README. PAC-R1+ unblocked.

**PAC-R1 (2026-07-01, Completed):**
- PO approval to apply recorded: `docs/backend/switch/apply-approval-dev.md` (dev only, prod explicitly excluded).
- Schema (17 tables, 6 enums) + RLS (25 policies) applied to `dcx-manager-dev` (`ibekkxqujqvlajeldpoa`) via
  3 migrations (`supabase/migrations/2026070112*`). **Found + fixed at apply time (no schema/logic change,
  reorder only):** `schema.sql`'s RLS helper functions were sequenced before the tables they reference —
  Postgres rejects `LANGUAGE sql` functions referencing not-yet-existing tables; moved the 3 functions after
  `dcx`/`versions`. Also found + fixed: the helper functions defaulted to `anon`-callable via PostgREST RPC
  (Supabase schema-level default privilege, not `PUBLIC`) — revoked from `anon` explicitly.
- `list_tables` (dev) = 17/17, all RLS-enabled. `get_advisors` security: anon-facing WARNs resolved; 3
  `authenticated`-facing WARNs (structural — RLS needs the grant) + 2 by-design INFO (memberships/workspaces
  default-deny) triaged and recorded, not silently dropped — see `output/PAC-R1-dev-apply.md`.
- `src/types/supabase.ts` generated from dev; `npm run typecheck` PASS.
- Prod (`xokgguodxjjwokngyquo`) confirmed untouched: `list_tables` = `[]`, `list_migrations` = `[]`.

**PAC-R2 (2026-07-01, Completed):**
- `src/services/real-dispatch.ts` (new) implements all 22 contract routes against the dev schema, returning
  `Api*` shapes only — never calls `api-mappers.ts`, never touches `src/queries`/`src/builder`/`src/pages`.
  Route parity verified programmatically: 22/22, byte-identical to `mock-dispatch.ts`'s route table.
- `src/services/supabase-client.ts` (new) — lazy Supabase JS client + `VITE_USE_REAL_BACKEND` flag reader.
- `src/services/api-client.ts` edited: whole-dispatcher flip (**OD-PAC-04**) — `dispatch = flag ? realDispatch
  : mockDispatch`, resolved once per call; BE3-R5a capture tap now wraps whichever is active. Flag stays off
  by default — flag-off test suite (92/92) unaffected.
- **OD-PAC-02 resolved → full-tree replace** for `PATCH /versions/:id/builder` (delete subtasks→tasks→
  actions→phases bottom-up, since schema FKs have no `ON DELETE CASCADE`, then re-insert verbatim).
- New dependency: `@supabase/supabase-js`.
- `/access/me` / `/dcx/:dcxId/access` implemented against `memberships`/`dcx` via `supabase.auth.getUser()` —
  safe "no access" default pre-PAC-R3 (full auth UX is PAC-R3's scope); doesn't block the 22-route contract.
- All gates PASS (typecheck/lint/test/validate:architecture/verify.sh/req:validate/req:completion-gate/
  contract-drift). Requirement graph housekeeping: 2 new manifestation nodes + 3 trace links → `REQ-BE-API-001`,
  all PO-signed.
- **Next:** PAC-R3 (Supabase Auth wiring) may start now (plan execution order allows R2/R3 to overlap once
  R1 lands); PAC-R4 (route parity + data seed) depends on this sprint's dispatcher and can follow. No blockers
  recorded.
- **Codex output-review (2026-07-01, ACCEPT WITH RISKS)** caught a real P1 bug: `duplicateVersion` inserted
  the copied builder tree with the source version's own IDs (PK violation, silently swallowed) — **fixed**
  via `remapBuilderTreeIds()`. Two risks carried forward (not fixed in PAC-R2, by design/scope): (P2)
  `saveBuilderTree` is non-transactional delete-then-insert — **must block PAC-R6 promotion** until a
  transactional RPC path exists (fixing requires `apply_migration`, forbidden in PAC-R2's scope); (P2) PAC-R2
  only proves route parity at the type level — PAC-R4 must still run live route probes, not skip them.
  See `output/PAC-R2-codex-review-response.md`.

**PAC-R3 (2026-07-01, Completed):**
- `src/services/supabase-auth.ts` (new) — email magic-link + Google OAuth session wiring
  (`signInWithEmail`/`signInWithOAuth`/`signOut`/`getCurrentSession`/`onAuthStateChange`).
- `src/ui/auth/LoginRedirect.tsx` — real sign-in form (was a static placeholder); mock path never renders it
  (`getMyAccessFromMock` is always authenticated), so zero mock-path risk.
- `src/ui/auth/RouteGuard.tsx` — additive-only: subscribes to `onAuthStateChange` **only when
  `VITE_USE_REAL_BACKEND` is on**, invalidating the `access.me` query via the existing `queryClient`
  (no new global side-channel). `MyAccess`/`DCXAccess` interfaces and `permissions.rules.ts` unchanged.
- **Tenant isolation + role-based edit gating proven on real Postgres RLS** (not just type-level): a 5-case
  matrix run via `execute_sql` on `dcx-manager-dev` (outsider denied, member reads, editor writes, viewer
  blocked from writing, viewer still reads) — all 5 passed. Seed rows created and cleaned up afterward.
- `get_advisors` security unchanged from the PAC-R1 baseline (no schema touched this sprint); prod still
  untouched (`list_migrations` = `[]`).
- All gates PASS. Requirement graph: 1 new manifestation node (`supabase-auth`) + 2 trace links
  (`supabase-auth` → `REQ-BE-AUTH-001`, `LoginRedirect` → `REQ-PR-002`), signed off.
- **Next:** PAC-R4 (route parity + data seed) can start — depends on PAC-R2 (dispatcher, done) and benefits
  from PAC-R3's real auth for multi-user parity tests. No blockers recorded.

**PAC-R4 (2026-07-01, Completed):**
- `scripts/backend/seed-dev.mjs` (new, idempotent) + live seed executed via `execute_sql`: catalog (channels/
  compositions/subtask-definitions, same IDs as mock) + 1 workspace/dcx/version/builder-tree/file/activity
  tenant fixture (`seed-ws-1`/`seed-dcx-1`/`seed-v-1`) + 1 confirmed test user (`editor` in `seed-ws-1`).
- `src/services/__tests__/real-dispatch.parity.test.ts` (new) — 22/22 routes, real (flag-on) vs mock
  (flag-off) shape-equivalence, against real seeded dev data with a real Supabase Auth session. 23/23 pass.
  Full suite 115/115.
- **3 real findings from live testing (the reason this sprint exists):**
  1. **FIXED** — `getMyAccessReal`/`checkDCXAccessReal` (`real-dispatch.ts`) queried `memberships` directly,
     which RLS blocks entirely (0 policies, by design) — silently returned empty/false instead of erroring.
     Fixed to call the `app_user_workspace_ids()`/`app_user_can_edit()` RPCs instead.
  2. **CONFIRMED (not a bug)** — `versions.communicated_date` HYPOTHESIS resolved: it's `timestamptz`, not
     date-only — a date-only PATCH round-trips as a full ISO timestamp. `rationale.md` update recommended
     (not done — outside this sprint's `allowed-writes`).
  3. **BLOCKED, discovery-dataset defect** — `channel_compositions_write`'s RLS `WITH CHECK` does a raw
     `memberships` subquery (same RLS-blocked-table issue as #1), so it rejects every insert including real
     editors. Fix needs a migration — out of PAC-R4's tool scope (no `apply_migration`). **Must be fixed
     before PAC-R6** (or any real composition-create use). Full detail in `output/PAC-R4-parity.md`.
- Prod confirmed untouched throughout (`list_migrations` = `[]`). Dev cleaned after every test run — final
  state: 1 persistent seed version (`seed-v-1`), no debris.
- All gates PASS. Requirement graph: 2 new manifestation nodes (parity test, seed-dev script) + 2 trace
  links → `REQ-BE-API-001`, signed off.
- **Next:** PAC-R5 (cutover behind flag on a preview) can start, but should treat findings #2 and #3 above as
  a checklist item — #3 specifically blocks enabling real compositions before a migration fix lands.

**PAC addendum — ClickUp-gated Google/email sign-in (2026-07-01, Completed, auth-gating scope):**
- PO requested sign-in restricted to ClickUp workspace members, same roster usable for in-app assignment.
  **Supersedes part of decision #4** (ClickUp moves from stub to a real one-time member-list sync) —
  recorded in `docs/backend/switch/po-confirmations.md`.
- `allowed_members` table + `enforce_allowed_signup()` `BEFORE INSERT ON auth.users` trigger applied to
  `dcx-manager-dev` (PO-approved, `apply-approval-dev-2026-07-01-clickup-gated-auth.md`) — rejects sign-up
  (Google or email) for any email not on the list, enforced at the DB level. Seeded 21 ClickUp members.
  Found + fixed one new security issue along the way: the trigger function defaulted to `PUBLIC`-executable
  via RPC (same class as PAC-R1's finding) — revoked from `anon`/`authenticated`/`PUBLIC`.
- **Declined this round:** the separate `channel_compositions_write` RLS-policy fix from PAC-R4 (PO: "only
  the auth-gating one") — stays BLOCKED/documented as before.
- **Explicitly deferred:** wiring `allowed_members` into the app's UI assignee pickers — needs a new
  contract route + UI change, a real scope addition requiring its own design pass, not bolted on here.
- `scripts/backend/sync-allowed-members.mjs` (new) — documented manual re-sync script (PO: one-time seed +
  manual refresh, no automation for v1).
- New requirement `REQ-BE-AUTH-ALLOWLIST-001` (PO-signed) + 1 manifestation + 1 trace link. All gates PASS;
  prod untouched. Full detail: `output/PAC-addendum-clickup-gated-auth.md`.

**PAC addendum — clear tracked debt: channel_compositions_write RLS fix (2026-07-01, Completed):**
- Cleared PAC-R4 finding #3 (the last remaining blocker before PAC-R6 for real composition-create use):
  `channel_compositions_write`'s `WITH CHECK` ran a raw `memberships` subquery under a role with zero SELECT
  access to that table, rejecting every insert. Fixed via a new `app_user_is_any_editor()` `SECURITY
  DEFINER` helper (no target-workspace arg, since `channel_compositions` has no workspace column) — PO
  approved, applied to `dcx-manager-dev` only.
- **Second gap found live in the same turn:** once the first insert succeeded, `createComposition`'s cascade
  writes to `composition_definitions`/`channel_available_compositions` hit a total absence of INSERT
  policies on those two join tables (invisible until the first blocker cleared). Fixed the same way,
  PO-approved as an in-turn extension.
- `real-dispatch.parity.test.ts`'s composition-write test rewritten from an expected-42501-failure assertion
  to a real success + shape-equivalence assertion. 23/23 parity tests, 115/115 full suite, typecheck/lint
  PASS. Prod confirmed untouched. Full detail: `output/PAC-addendum-composition-write-rls-fix.md`; approval:
  `docs/backend/switch/apply-approval-dev-2026-07-01-composition-write-rls-fix.md`.
- **PAC-R6 readiness:** with this cleared, the only remaining pre-PAC-R6 checklist items are finding #2's
  doc-only `rationale.md` update (non-blocking) and the PAC-R2 P2 (`saveBuilderTree` non-transactional
  write, must block PAC-R6 promotion until a transactional RPC path exists).

## Requirement traceability (core.md §35a)

This plan **creates net-new backend product requirements** (real persistence, auth, RLS enforcement). Per the
same pattern `cicd-release-governance` used, PAC-R0 **queues a requirement intake** (`REQ-BE-*`) for PO
sign-off **before** any source sprint (PAC-R2+) executes — no invented IDs. The discovery manifestations
(`capture-sink`, `scripts/backend/*`) intake (backend-discovery-v3 G6) is a prerequisite and should be signed
off together.

> **🔒 Requirement-ID lock rule (audit blocking #1).** The `REQ-BE-*` / `EVD-*` IDs below are **PLACEHOLDERS**.
> They do not exist in the graph yet (only `REQ-GOV-TRACE-001-BACKEND` does). **PAC-R0 is the only sprint the
> PO may activate until PAC-R0's intake produces PO-signed `REQ-BE-*` IDs.** PAC-R1..R6 each carry a **hard
> gate acceptance criterion**: the sprint MUST NOT execute until its Requirement Trace cites the **exact
> PO-signed IDs** (wildcards replaced). An executor that finds a wildcard trace stops and returns to PAC-R0.

| Deliverable | Anchor / intake (placeholder — locked at PAC-R0) |
|---|---|
| Real dispatcher (PAC-R2) | new `REQ-BE-API-001` (persistence behind the contract) — intake at PAC-R0 |
| Auth wiring (PAC-R3) | new `REQ-BE-AUTH-001` + existing `REQ-PR-001`/`REQ-PR-020` (route-guard/permissions) |
| Schema apply (PAC-R1) | new `REQ-BE-SCHEMA-001` (tables/RLS) |
| Promotion (PAC-R6) | existing release-governance nodes (`REQ-RG-*`) + recorded PO approval |

## Standard closeout gates (every source sprint — audit blocking #3)

Every sprint that changes `src/**` or `scripts/**` (PAC-R2, R3, R4, R5; R1 for generated types) MUST pass, and
record in its log, the full local gate set — never a partial subset:

`npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test` ·
`bash scripts/verify.sh` (or `npm run verify:frontend`) · `npm run req:validate` ·
`npm run req:reconcile -- --mode changed --files "<CF>"` · `npm run req:completion-gate -- --changed "<CF>"` ·
`bash scripts/agent/sprint-doctor.sh <plan> <sprint> <agent>`.

**Tool-dependent fallbacks (core.md §28) — never a fake PASS:**
| Capability | If unavailable | Recorded as |
|---|---|---|
| Supabase MCP (`apply_migration`, `get_advisors`, `generate_typescript_types`, `list_tables`) | use the Supabase CLI / dashboard for the same evidence; if none, stop | `BLOCKED — Supabase MCP/CLI unavailable` + the exact missing capability |
| Vercel preview | run the build + a local `vite preview`/dev server for a dev-smoke equivalent | `BLOCKED — Vercel preview unavailable` (weaker: local smoke) |
| Playwright / preview MCP (browser) | drive dev-smoke HTTP + console checks | `BLOCKED — browser MCP unavailable`; screenshot gate BLOCKED |

## Risks & mitigations

| Risk | Mitigation |
|---|---|
| Real backend diverges from the frozen contract | PAC-R4 per-route parity tests against `contract.json` + captured fixtures; the contract-drift gate stays required |
| Applying schema breaks/locks data | Apply to **dev first** (PAC-R1), advisors clean, parity proven, before any prod apply (PAC-R6, PO-signed) |
| RLS misconfiguration exposes cross-tenant data | PAC-R3 tests every policy (from `rls-policies.sql`) with multi-user fixtures; `get_advisors` security clean before promotion |
| Cutover regresses the app | Flagged rollout (`VITE_USE_REAL_BACKEND`); mock stays default; preview validation (PAC-R5) before promotion |
| Scope creep into ClickUp/AI/files | Explicitly out (decision matrix): stubs stay; files external-URL-only; GAS out |

## Plan lifecycle

Drafted (this file) → `dcx-plan-audit` (writes `audit/YYYY-MM-DD-<agent>.md`, verdict READY/NEEDS REVISION/NOT
READY) → revise if needed → **PO decision**: activate only when (a) audit READY **and** (b)
backend-discovery-v3 readiness gate = READY. On activation, PO moves this folder to `docs/plans/active/` and
sprints execute `PAC-R0 → … → PAC-R6`. **No schema is applied and no source changes until activation.**

**Two-stage activation (audit advisory #3).** Because PAC-R1..R6 are locked on PAC-R0's requirement intake +
the 4 product-model confirmations, the PO activates in two steps: **(1)** activate **PAC-R0 only** — it records
the confirmations and produces the PO-signed `REQ-BE-*` IDs; **(2)** once those IDs exist and the confirmations
are recorded, activate PAC-R1..R6. Alternatively the PO confirms the four product points **before** moving the
whole plan to active. Either way, no wildcard-trace sprint executes.

## Audit history
- `audit/2026-07-01-codex.md` — **NEEDS REVISION** (3 blocking, 3 advisory). Revised 2026-07-01 (Claude):
  blocking #1 (ID-lock rule + per-sprint hard-gate AC), #2 (PAC-R2 mapper direction corrected), #3 (standard
  closeout gate table + §28 fallbacks added to every source sprint); advisories #1–#3 (PAC-R5 live-capture
  note + cleanup step; two-stage activation) addressed. Ready for re-audit.
