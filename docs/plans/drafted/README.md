# docs/plans/drafted/

Plans in this folder are scoped and have sprint files, but are not yet approved for execution. Agents may read sprint files but must not execute them.

A drafted plan moves to `docs/plans/active/` when:
1. Sprint files are written with acceptance criteria
2. The PO has reviewed and confirmed scope
3. Agent assignments and execution order are confirmed

## Current drafted plans

| Plan | Version | Prior art | Runs when | Goal |
|---|---|---|---|---|
| [production-api-client-switch](./production-api-client-switch/README.md) | v1.0.1.0 | `active/backend-discovery-v3` (readiness dataset), `completed/cicd-release-governance` (release pipeline) | After `dcx-plan-audit` READY **and** backend-discovery-v3 readiness gate = READY → PO activates | Connect the real Supabase backend behind the frozen 22-route `apiClient` contract (7 sprints PAC-R0..R6): apply schema+RLS to dev, real dispatcher behind a flag, auth wiring, route parity, preview cutover, PO-gated production promotion |

> **Drafted 2026-07-01.** Not yet audited. Must NOT execute until (a) audit READY and (b) backend-discovery-v3
> reaches its readiness gate. Applies schema + wires a real backend, so every apply/promotion is PO-approved
> through the release-governance pipeline.

> **2026-07-01:** `backend-discovery-v3` was drafted, audited READY (`audit/2026-07-01-codex-ready.md`,
> 0 blocking), and **activated** — it now lives in [`docs/plans/active/backend-discovery-v3/`](../active/backend-discovery-v3/README.md)
> and is executing.
>
> **2026-07-01 (earlier):** `frontend-polish-implementation-v0.3.5` completed its audit + execution and moved
> to [`docs/plans/completed/frontend-polish-implementation-v0.3.5/`](../completed/frontend-polish-implementation-v0.3.5/README.md).
> `cicd-release-governance` also completed (see `docs/plans/completed/`).

## Execution order (implementation)

```
WM-1 → CT-1 → CT-2 → SK-1 → CC-1 → CC-2 → CC-3 → CC-4 → CC-5 → CC-6
     → WM-2 → WM-3 → WM-4 → WM-5 → WM-6 → HV-1 → HV-2     (+ CC-OPT opportunistic)
```

Sprint specification source of truth: `completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md`
(+ FP-R5 PATCH) and the FP-R4 finalize spec (+ PATCH). **No source changes until the PO activates** the
plan (audit READY first); resolve **G-IMPECCABLE** before the CT-1 token sprint.

> **Note (2026-06-30):** the `frontend-polish-v0.3.5` **discovery** plan and `requirements-system` are
> **completed** (`docs/plans/completed/`). This implementation plan is their downstream. The earlier v2
> discovery plans also completed; structural baseline in `docs/product/decisions/src-structure-decision.md`.

## Key rule for discovery sprints

Every discovery sprint must:
1. Run `bash scripts/agent/build-current-state.sh` and log the output at session start
2. Use scripts (`code-query.sh`, `npm run lint`, `npm run validate:architecture`, `npm run typecheck`) — not manual file reading
3. Read the corresponding expired plan outputs before starting (prior art)
4. Produce a structured markdown output file in the plan's `output/` folder
5. Change no source files

## Relationship to expired plans

These are v2 replacements for plans that moved to `docs/plans/expired/`. See `docs/plans/expired/README.md`
for the full index and reasons each plan was expired.
