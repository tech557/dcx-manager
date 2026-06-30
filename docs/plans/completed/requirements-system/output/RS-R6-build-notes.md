---
output: RS-R6-build-notes
plan: requirements-system
sprint: RS-R6
agent: Codex
date: 2026-06-29
status: completed
---

# RS-R6 — Seed Graph Data

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-GOV-TRACE-001, REQ-GOV-TRACE-001-DATA, REQ-GOV-TRACE-001-AGENT, RS-R6 |
| Scope/type | data/governance — seed canonical graph nodes, trace links, ledger, data-model summary |
| States | governance=approved/locked/proposed/draft, maturity=logic-defined or intent-captured, delivery=not-assessed |
| Source/lock | RS-R5 accepted inventory + RS-R0b signed architecture |
| Acceptance outcomes | graph seeded, validators pass, historical ledger seeded, code-true data model summary generated |
| Responsibilities | deterministic migration, provenance preservation, three-state assignment, validation |
| Expected manifestations | `docs/product/requirements/graph/**`, `scripts/requirements/seed-rs-r6.ts` |
| Actual manifestations | canonical graph nodes, trace links, ledger, generated views, data-model summary, RS-R6 self-trace manifestations |
| Evidence | `npm run req:seed-rs-r6`, `npm run req:validate`, `npm run req:generate-views` |
| Impact/dependencies | Feeds RS-R7 code manifestation reconciliation |
| Gate result | PASS — validators report 0 errors and 0 warnings |

## What Changed

RS-R6 added a deterministic seed command:

```text
npm run req:seed-rs-r6
```

The command reads:

- `docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv`
- `dcx-requirements-master.csv`
- RS-R5 recovery/governance decisions encoded in the seed script
- current code-true type files under `src/types/`

It writes canonical graph data into:

- `docs/product/requirements/graph/nodes/*.json`
- `docs/product/requirements/graph/trace-links/*.json`
- `docs/product/requirements/graph/ledger/decision-ledger.jsonl`
- `docs/product/requirements/graph/generated/data-model-summary.json`
- `docs/product/requirements/graph/views/data-model-summary.md`

Generated views were refreshed with `npm run req:generate-views`.

## Seed Counts

| Artifact | Count |
|---|---:|
| Nodes | 307 |
| TraceLinks | 455 |
| Ledger entries | 35 |

### Nodes by Type

| Type | Count |
|---|---:|
| Requirement | 226 |
| AcceptanceOutcome | 24 |
| SystemResponsibility | 20 |
| ExpectedManifestationCategory | 20 |
| BehaviorRule | 8 |
| Manifestation | 5 |
| Intent | 3 |
| OpenQuestion | 1 |

### Requirement Scope Counts

| Scope | Requirement count |
|---|---:|
| frontend | 85 |
| product | 54 |
| data | 46 |
| security | 19 |
| backend | 10 |
| operations | 10 |
| governance | 1 |
| agent-workflow | 1 |

### State Counts

| State dimension | Values |
|---|---|
| Governance | approved 211; proposed 90; draft 3; locked 3 |
| Maturity | logic-defined 303; intent-captured 4 |
| Delivery | not-assessed 302; implemented 5 |

Delivery is intentionally `not-assessed` for source-truth nodes. The 5 implemented nodes are RS-R6 self-trace manifestations for the seed script/config/docs that changed in this sprint.

## Ledger Seed

| Event type | Count |
|---|---:|
| methodology-signoff | 1 |
| product-decision | 16 |
| temporary-assumption | 2 |
| frontend-polish-decision | 12 |
| data-model-drift | 3 |
| seed-migration | 1 |

Data-model drift entries:

- `LDG-2026-06-29-DMD-001` — requirements mention persistence/database structures, but current repo has TypeScript/API types and mocks rather than a DB schema.
- `LDG-2026-06-29-DMD-002` — AI/context metadata exists as optional fields; RS-R7 must verify actual manifestation coverage before implementation claims.
- `LDG-2026-06-29-DMD-003` — `ApiAssignedMember.role` is a plain string and does not encode the full permission taxonomy.

## Generated Queues

From `docs/product/requirements/graph/views/requirements-summary.md`:

| Queue | Count |
|---|---:|
| needsClassification | 0 |
| needsDecomposition | 209 |
| manifestationsLackingRequirements | 0 |
| candidateLinksAwaitingConfirmation | 450 |
| staleBrokenTraces | 0 |
| supersededStillInCode | 0 |
| testsDisconnected | 0 |

`candidateLinksAwaitingConfirmation` is expected after RS-R6: seed trace links are provisional and RS-R7 owns code manifestation reconciliation and confirmation.

## Validation

```text
npm run req:seed-rs-r6
pass: true
nodes: 307
traceLinks: 455
ledger: 35
errors: []
warnings: []
```

```text
npm run req:validate
pass: true
errors: []
warnings: []
```

```text
npm run req:generate-views
pass: true
```

## Notes for RS-R7

- The graph is seeded from product/source truth only; `src/**` is still not treated as truth.
- Current trace links are provisional and marked `needs_confirmation`.
- Delivery remains `not-assessed` until RS-R7 links code manifestations.
- `data-model-summary.md` is code-true from `src/types/`; drift items are ledgered rather than silently resolved.
