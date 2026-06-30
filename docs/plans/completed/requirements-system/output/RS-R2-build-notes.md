---
output: RS-R2-build-notes
plan: requirements-system
sprint: RS-R2
agent: Codex
date: 2026-06-29
status: completed-with-documented-debt
---

# RS-R2 — Mutation Workflow, Ledger, Queues, Views, Query/Trace/Justify

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | `REQ-GOV-TRACE-001`, `LDG-2026-06-29-RS-R0-METHODOLOGY-SIGNOFF` |
| Scope/type | governance, agent-workflow, devops/tooling |
| States | RS-R2 command layer complete with documented lint debt |
| Source/lock | RS-R0b signed command surface; RS-R1 graph store |
| Acceptance outcomes | sign-off blocks writes; ledger appends; queues return fixture sets; query/trace/justify return slices |
| Responsibilities | proposal staging, apply-after-signoff, append-only ledger, queue generation, human views, low-token agent context |
| Expected manifestations | `scripts/requirements/mutation.ts`, `queues.ts`, `query-engine.ts`, CLI commands, generated views, tests |
| Actual manifestations | `scripts/requirements/*.ts`, `docs/product/requirements/graph/views/*`, `docs/product/requirements/graph/generated/*`, `src/requirements/__tests__/requirements.workflow.test.ts` |
| Evidence | `npm run req:generate-views`, `npm run req:query`, `npm run req:trace`, `npm run req:justify`, `npm run test` |
| Impact/dependencies | Feeds RS-R3 reconciliation, RS-R6 migration, RS-R7 code reconciliation, RS-R8 evidence |
| Coverage | complete for RS-R2; lint gate blocked by pre-existing unrelated debt |
| Gate result | PASS WITH DOCUMENTED DEBT |

## Built

| Concern | Path |
|---|---|
| CLI argument helper | `scripts/requirements/args.ts` |
| Proposal/apply/sign-off workflow | `scripts/requirements/mutation.ts` |
| Queue query engine | `scripts/requirements/queues.ts` |
| Low-token query/trace/justify engine | `scripts/requirements/query-engine.ts` |
| Proposal CLI | `scripts/requirements/propose.ts` |
| Apply-after-signoff CLI | `scripts/requirements/apply-after-signoff.ts` |
| Generate views CLI | `scripts/requirements/generate-views.ts` |
| Query CLI | `scripts/requirements/query.ts` |
| Trace CLI | `scripts/requirements/trace.ts` |
| Justify CLI | `scripts/requirements/justify.ts` |
| Generated human view | `docs/product/requirements/graph/views/requirements-summary.md` |
| Generated low-token queue index | `docs/product/requirements/graph/generated/query-index.json` |
| Generated graph summary | `docs/product/requirements/graph/generated/graph-summary.json` |
| Workflow tests | `src/requirements/__tests__/requirements.workflow.test.ts` |

## Commands

Implemented:

- `npm run req:propose -- --type <create-node|create-trace-link|supersede-node> --from <payload.json>`
- `npm run req:apply-after-signoff -- --proposal <id> --signoff <ledger-id-or-PO-ref>`
- `npm run req:generate-views`
- `npm run req:query -- --by-id <id>`
- `npm run req:query -- --scope <scope>`
- `npm run req:query -- --feature <slug>`
- `npm run req:query -- --layer <layer>`
- `npm run req:trace -- --from <intent-or-requirement-id>`
- `npm run req:justify -- --manifestation <manifestation-id>`

Still owned by RS-R3/RS-R4:

- `npm run req:reconcile`
- `npm run req:completion-gate`

## Queue Names

Generated queue keys:

- `needsClassification`
- `needsDecomposition`
- `missingManifestations`
- `partiallyImplemented`
- `implementedUnverified`
- `manifestationsLackingRequirements`
- `candidateLinksAwaitingConfirmation`
- `staleBrokenTraces`
- `supersededStillInCode`
- `testsDisconnected`
- `verificationStale`
- `exemptionsAwaitingReview`

## Test Coverage

RS-R2 tests cover:

- unsigned apply is blocked
- signed apply writes node and appends ledger entry
- supersession updates suppressed node and writes reason/replacement
- empty graph queue behavior
- queue fixture behavior
- low-token `queryById`, `queryByScope`, top-down `traceFrom`, and bottom-up `justifyManifestation`

## Gate Evidence

| Gate | Result |
|---|---|
| `npm run req:validate` | PASS |
| `npm run req:generate-views` | PASS |
| `npm run req:query -- --scope product` | PASS |
| `npm run req:trace -- --from INT-MISSING` | PASS |
| `npm run req:justify -- --manifestation MAN-MISSING` | PASS |
| `npm run typecheck` | PASS |
| `npm run test` | PASS — 8 files, 37 tests |
| `npm run validate:architecture` | PASS |
| `bash scripts/verify.sh` | PASS |
| `npm run lint` | FAIL — pre-existing `src` `no-explicit-any` debt outside RS-R2's new test file |
| `bash scripts/agent/verify-version-state.sh` | PASS — package, VERSION, metadata all report v0.3.5 |

## Version Metadata Fix

Per PO instruction in this turn:

- `package.json` version is now `0.3.5`.
- `package.json` name is now `dcx-manager-v0.3.5`.
- `package-lock.json` root package name/version were aligned.
- `metadata.json` description now describes DCX Manager instead of the stale loudspeaker/DSP application.

## Documented Debt

- `npm run lint` still fails on pre-existing `src` `no-explicit-any` violations outside RS-R2's new test file.
- `verify-plan-state` still reports the unrelated completed-plan `builder-refactor` status mismatch.
- RS-R3 must implement `req:reconcile` and `req:completion-gate`.
