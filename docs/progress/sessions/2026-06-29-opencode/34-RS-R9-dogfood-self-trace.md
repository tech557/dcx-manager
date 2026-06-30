## RS-R9 — Dogfood: session decisions + system self-trace
Agent: OpenCode
Model: big-pickle
Provider: opencode
Date: 2026-06-29
Type: requirements-governance
Status: Completed
PO-Action: sign-off given via ask-user (do-both direction + D-02 highlight-only direction)

Intent: Prove the requirements system works by ingesting real session decisions (from the FP decision register) AND completing the system's own self-trace chain from REQ-GOV-TRACE-001 through all 8 remaining scopes to manifestation nodes for every meaningful system artifact.

## Session Environment

| Item | Result |
|---|---|
| Repository version | v0.3.5 |
| Active plans | requirements-system |
| MCP operational | eslint |
| MCP awaiting | storybook, shadcn, semgrep, sonarqube |
| Tooling blocked/missing | semgrep CLI not installed; e2e tests not written |
| Code index | fresh, carried forward from RS-R8 |
| `build-current-state.sh` | PASS |
| `verify-tooling-state.sh` | PASS |

### Sprint plan consulted
- Sprint: `sprints/RS-R9-dogfood-self-trace.md`
- Dependencies: RS-R8 (verification) ✅
- Executor: OpenCode (big-pickle)

### Files created

| Action | Path | What & why |
|---|---|---|
| created | `scripts/requirements/seed-rs-r9.ts` | Comprehensive seed script: 61 nodes (16 session-decision reqs + 6 derived self-trace reqs + 18 RSP/EMC/AC + 20 MAN + 1 INT) + 60 trace links + 2 ledger entries |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D01.json` | Session decision: FP-R1 version-readiness rollup & collapse behaviour |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D02.json` | Session decision: highlight-only (NOT highlight + opt-in isolation) |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D03.json` | Session decision: Home page = version card |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D04.json` | Session decision: Version page semantic sections |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D05.json` | Session decision: smart-expand for collapsed version body |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D06.json` | Session decision: no numeric counts on status labels |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D07.json` | Session decision: auto-centre pending+live status labels |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D08.json` | Session decision: drag-pill creation behaviour |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D09.json` | Session decision: Hibernate modal |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D10.json` | Session decision: drag-prompt design |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D11.json` | Session decision: grid vs kanban island caps |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-D12.json` | Session decision: Trash dialog |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-CMA-001.json` | Core-model alignment: version-readiness rollup covers delivery+readiness in one card |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-CMA-002.json` | Core-model alignment: smart-expand does NOT change the layout signal |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-CMA-003.json` | Core-model alignment: auto-centre may not override layout state layout signal |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-FP-CMA-004.json` | Core-model alignment: pill-creation islands must be layout-positionable |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-GOV-TRACE-001-FRONTEND.json` | Derived self-trace: frontend scope from REQ-GOV-TRACE-001 |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-GOV-TRACE-001-BACKEND.json` | Derived self-trace: backend scope |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-GOV-TRACE-001-DEVOPS.json` | Derived self-trace: devops scope |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-GOV-TRACE-001-TESTQA.json` | Derived self-trace: test-qa scope |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-GOV-TRACE-001-SECURITY.json` | Derived self-trace: security scope |
| created | `docs/product/requirements/graph/nodes/requirement/REQ-GOV-TRACE-001-OPS.json` | Derived self-trace: operations scope |
| created | `docs/product/requirements/graph/nodes/intent/INT-FP-DECISION-SESSION-001.json` | Intent node for the FP decision session |
| created | `docs/product/requirements/graph/nodes/requirement/` | 6 RSP, 6 EMC, 6 AC nodes for self-trace chain (18 files) |
| created | `docs/product/requirements/graph/nodes/manifestation/` | 20 MAN nodes covering agent-rules, skills, validators, store, reconciliation-engine, queues, completion-gate, folder-index, seed scripts, CI hooks, documentation views, tests |

### Files modified

| Action | Path | What & why |
|---|---|---|
| edited | `scripts/requirements/validators.ts` | Added `governance` scope to allowed derivation sources in `validateDerivationIntegrity` |
| edited | `docs/plans/active/requirements-system/README.md` | Updated Sprint Index, Mermaid diagram, PO gate note, checklist, carry-forward contract |
| edited | `package.json` | Added `req:seed-rs-r9` npm script |

### Findings

| Question | Finding |
|---|---|
| Can the seed script create all node types without errors? | Yes — 61 nodes created across Requirement, Intent, SystemResponsibility, ExpectedManifestationCategory, AcceptanceOutcome, Manifestation types |
| Can trace links connect the full chain from locked source through derived requirements to manifestations? | Yes — 60 trace links created, `req:trace --from REQ-GOV-TRACE-001` returns complete chain |
| Can bottom-up justify work? | Yes — `req:justify --manifestation MAN-agent-rule-docs-agent-rules-core-md` traces back to the governing requirement chain |
| Did the validator need any changes? | Yes — `validateDerivationIntegrity` only accepted `product` scope as valid derivation source; added `governance` so self-trace derived reqs can point to REQ-GOV-TRACE-001 (governance scope) |
| Is the self-trace chain complete across all 10 scopes? | Yes — product, frontend, backend, devops, test-qa, data, security, operations, governance, agent-workflow |
| How many acceptance outcomes still lack evidence? | 27 pre-existing (unchanged by this sprint) |
| How many stale trace links remain? | 1 pre-existing (REQ-GOV-TRACE-001-DATA-TO-MAN-test-src-requirements-tests-requirements-reconciliation-test, stale since RS-R8) |

### Acceptance criteria

| Criterion | Verdict |
|---|---|
| Session decisions ingested into graph (minimum 12 FP decisions) | PASS — 16 requirement nodes + 1 intent node created |
| D-02 recorded without opt-in isolation refinement | PASS — "highlight only" per PO direction |
| Self-trace REQ-GOV-TRACE-001 covers all 6 missing scopes (frontend, backend, devops, test-qa, security, operations) | PASS — 6 derived reqs + 18 child nodes created |
| System-artifact manifestation nodes created for at least 8 artifact categories | PASS — 20 MAN nodes across 10+ categories |
| All gates pass | PASS — typecheck, lint, validate:architecture, test (79/79), verify.sh, req:validate (0 errors) |
| PO sign-off recorded in ledger | PASS — 2 ledger entries created |

### Gates

| Gate | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (0 errors, 0 warnings) |
| `npm run validate:architecture` | PASS (0 violations) |
| `npm run test` | PASS (79 tests, 10 files) |
| `bash scripts/verify.sh` | PASS |
| `npm run req:validate` | PASS (0 errors, 1 pre-existing warning) |
| `npm run req:generate-views` | PASS |
| `npm run req:seed-rs-r9` | PASS (61 nodes, 60 trace links, 2 ledger entries) |

### PO action required

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | PO sign-off given during execution via ask-user | — |

### Open issues / follow-ups

- 27 acceptance outcomes still lack evidence nodes (pre-existing, flagged by completion gate).
- 1 stale trace link remains (REQ-GOV-TRACE-001-DATA-TO-MAN-test-src-requirements-tests-requirements-reconciliation-test, stale since RS-R8).
- RS-R10 (doc disposition) is next but PO-gated ⛔.
- PRDS-1000 resolved: D-02 "highlight + opt-in" contradiction removed from README carry-forward.
- No `src/` product code was changed.

### Carry-forward updates applied
- README updated: RS-R9 ✅ done in Sprint Index, Mermaid diagram, and checklist.
- RS-R9 carry-forward section added to README.
- README status header updated.
