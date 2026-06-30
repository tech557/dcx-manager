---
output: RS-R1-build-notes
plan: requirements-system
sprint: RS-R1
agent: Codex
date: 2026-06-29
status: completed-with-documented-debt
---

# RS-R1 — Graph Store + Schema + Validators

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | `REQ-GOV-TRACE-001`, `LDG-2026-06-29-RS-R0-METHODOLOGY-SIGNOFF` |
| Scope/type | governance, agent-workflow, devops/tooling |
| States | methodology signed off; RS-R1 build complete with documented lint debt |
| Source/lock | RS-R0b sign-off in `output-review/RS-R0b-review.md`; seed ledger persisted |
| Acceptance outcomes | RS-R1 validator command exists; progressive fields tested; lock enforcement tested; coverage tested |
| Responsibilities | schema definition, graph loading, validation, command declaration, unit coverage |
| Expected manifestations | JSON graph folders, JSONL ledger, TS schema/validators/CLI, package scripts, test fixtures |
| Actual manifestations | `docs/product/requirements/graph/**`, `scripts/requirements/*.ts`, `src/requirements/__tests__/requirements.validators.test.ts`, `package.json` |
| Evidence | `npm run req:validate`, `npm run typecheck`, `npm run test`, `npm run validate:architecture`, `bash scripts/verify.sh` |
| Impact/dependencies | Feeds RS-R2 mutation/views/query, RS-R3 reconciliation, RS-R6 migration |
| Coverage | complete for RS-R1; lint gate blocked by pre-existing unrelated debt |
| Gate result | PASS WITH DOCUMENTED DEBT |

## Built

| Concern | Path |
|---|---|
| Graph store root | `docs/product/requirements/graph/` |
| Nodes | `docs/product/requirements/graph/nodes/*.json` |
| TraceLinks | `docs/product/requirements/graph/trace-links/*.json` |
| Ledger | `docs/product/requirements/graph/ledger/decision-ledger.jsonl` |
| Proposals | `docs/product/requirements/graph/proposals/*.json` |
| Generated views | `docs/product/requirements/graph/views/` |
| Generated slices | `docs/product/requirements/graph/generated/` |
| Schema/types | `scripts/requirements/schema.ts` |
| Store loader | `scripts/requirements/store.ts` |
| Validators | `scripts/requirements/validators.ts` |
| Validate CLI | `scripts/requirements/validate.ts` |
| Unit tests | `src/requirements/__tests__/requirements.validators.test.ts` |

## Commands

RS-R1 implemented the real validate command:

```bash
npm run req:validate
```

RS-R1 also declared the remaining exact command names from RS-R0b as placeholder scripts so later sprints
can replace their internals without changing the public command surface:

- `npm run req:propose`
- `npm run req:apply-after-signoff`
- `npm run req:generate-views`
- `npm run req:query`
- `npm run req:trace`
- `npm run req:justify`
- `npm run req:reconcile`
- `npm run req:refresh-code-index`
- `npm run req:completion-gate`

## Validator Coverage

Implemented validator families:

- schema validity and node ID prefixes
- scope taxonomy
- state dimensions
- progressive maturation fields
- state-combination policy
- relationship integrity and dangling TraceLinks
- derivation integrity for technical/test requirements
- lock enforcement
- provenance confirmation status and confidence scale
- expected manifestation category presence
- coverage rollup
- exemption validity
- evidence binding
- seed ledger shape

## Tests

The RS-R1 test harness covers:

- draft requirement with intent-level fields passes
- implementation-ready requirement missing responsibilities/categories fails
- locked node without lock owner/date fails
- dangling TraceLink and invalid confidence fail
- complete and partial expected-manifestation coverage rollups
- valid typed/reasoned exemption passes

## Seed Ledger

Persisted the RS-R0 methodology sign-off as the first append-only ledger record:

`LDG-2026-06-29-RS-R0-METHODOLOGY-SIGNOFF`

Source:

`docs/plans/active/requirements-system/output-review/RS-R0b-review.md`

## Gate Evidence

| Gate | Result |
|---|---|
| `npm run req:validate` | PASS |
| `npm run typecheck` | PASS |
| `npm run test` | PASS — 7 files, 33 tests |
| `npm run validate:architecture` | PASS |
| `bash scripts/verify.sh` | PASS |
| `npm run lint` | FAIL — pre-existing `src` `no-explicit-any` debt; no new RS-R1 test file errors reported |

## Documented Debt

- `npm run lint` still fails on pre-existing `src` `no-explicit-any` violations outside RS-R1's new files.
- `verify-plan-state` still reports the unrelated completed-plan `builder-refactor` status mismatch.
- RS-R2 must replace placeholder command internals for proposal/view/query flows.
- RS-R3 must replace placeholder command internals for reconcile/completion-gate flows.
