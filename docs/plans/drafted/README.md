# docs/plans/drafted/

Plans in this folder are scoped and have sprint files, but are not yet approved for execution. Agents may read sprint files but must not execute them.

A drafted plan moves to `docs/plans/active/` when:
1. Sprint files are written with acceptance criteria
2. The PO has reviewed and confirmed scope
3. Agent assignments and execution order are confirmed

## Current drafted plans

| Plan | Version | Prior art | Runs when | Executor | Goal |
|---|---|---|---|---|---|
| [frontend-polish-implementation-v0.3.5](./frontend-polish-implementation-v0.3.5/README.md) | v0.3.5 | `completed/frontend-polish-v0.3.5` (FP-R0..R5 + RS-R11 brief), `completed/requirements-system` | After `dcx-plan-audit` READY → PO activates | per-sprint by skill/tool (see plan) | Execute the graph-grounded frontend polish: 17 sprints (WM/CT/SK/CC/HV) covering all 88 FP-R4 criteria, token-first, with PO Web Checks + Requirement Debt Burn-down |

> **2026-07-01:** `cicd-release-governance` moved to `docs/plans/active/` after the final-approval audit
> (`active/cicd-release-governance/audit/2026-07-01-codex.md`) returned READY (0 blocking). See
> `docs/plans/active/README.md`.

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
