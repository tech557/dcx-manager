## RS-R7 — Identity normalization before PO confirmation
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-29
Type: sprint-execution
Status: Partial
PO-Action: none

Intent: Normalize duplicate RS-R7 manifestation identities before any bulk PO confirmation, regenerate canonical review queues, and leave ambiguous mappings unconfirmed.
Trigger: User request: "Do not proceed with bulk RS-R7 PO confirmation yet... First perform an RS-R7 identity-normalization pass"
Requirements covered: REQ-GOV-TRACE-001, REQ-GOV-TRACE-001-DATA, RS-R7

## Session Environment

| Item | Result |
|---|---|
| Repository version | v0.3.5 |
| Active plans | requirements-system |
| MCP operational | eslint |
| MCP awaiting | storybook, shadcn, semgrep, sonarqube |
| Tooling blocked/missing | semgrep CLI not installed; e2e tests not written |
| Code index | stale, age 101 minutes at session start |
| `build-current-state.sh` | PASS; wrote `docs/generated/CURRENT_STATE.json`; latest log was Codex/28 |
| `verify-tooling-state.sh` | PASS for npm scripts and `verify.sh`; semgrep CLI not installed; code index stale |
| Skill invoked | `dcx-manifestation-reconcile` present in `.agents/skills/`; used its completion-gate/reconciliation closure guidance |
| Git status | BLOCKED - `.git` directory is absent in this checkout, so `git status` is unavailable |

### Files touched

| Action | Path | What & why | Lines |
|---|---|---|---|
| created | `scripts/requirements/normalize-rs-r7-identities.ts` | New normalization command: groups MAN nodes by source path + source anchor, preserves aliases, redirects/merges candidate links, regenerates canonical review queue | 324 |
| edited | `package.json` | Added `req:normalize-rs-r7-identities` command | 82 |
| created | `docs/plans/active/requirements-system/output/RS-R7-identity-normalization.md` | Concise PO review grouped by canonical manifestation | 73 |
| edited | `docs/plans/active/requirements-system/README.md` | Carry-forward updated with normalized RS-R7 state | 803 |
| generated | `docs/product/requirements/graph/generated/rs-r7-review-queue.json` | Canonical-manifestation queue; 238 active RS-R7 candidate links across 54 canonical manifestations | 3259 |
| generated | `docs/product/requirements/graph/views/rs-r7-review-queue.md` | Human batch-count view | 24 |
| generated | `docs/product/requirements/graph/generated/rs-r7-identity-normalization.json` | Alias map, duplicate relationship validation, unlinked canonical manifestations | 631 |
| edited | graph MAN nodes + trace links | 121 MAN IDs marked superseded aliases; 124 historical trace links preserved as `supersedes`; exact duplicate active relationships merged | bulk generated |
| created | graph self-trace node/link | Added confirmed trace for the normalization script to `REQ-GOV-TRACE-001-DATA` | node 23 / link 18 |
| generated | graph views/indexes/ledger | Regenerated `graph-summary`, `query-index`, `requirements-summary`, folder indexes; ledger now includes normalization entry | summary 5 / query 1259 / requirements 20 / ledger 40 |

### Checks

| Check | Result |
|---|---|
| Churn - work reversed | None; prior RS-R7 queue was normalized, not confirmed or discarded |
| Preserve-semantic (§9) | No product `src/` behavior changed; graph mutation preserved old MAN IDs as aliases/superseded identities |
| Open decisions used (temporary default) | None; PO confirmation remains pending |
| Duplicate active requirement-manifestation relationships | PASS - 0 |
| Stale/broken trace records from normalization | PASS - 0 |
| Historical preservation | 121 superseded MAN aliases + 124 history trace links retained |

### Acceptance criteria

| Criterion | Verdict |
|---|---|
| Group persisted/candidate manifestations by physical source path plus exported symbol/object | PASS |
| Identify multiple MAN IDs for same manifestation | PASS - 121 duplicate groups |
| Select canonical MAN ID | PASS - path+symbol canonical IDs retained |
| Preserve old IDs as aliases/superseded identities | PASS - 121 preserved |
| Redirect candidate/provisional trace links to canonical MAN ID | PASS - 124 redirected |
| Merge exact duplicate requirement-manifestation candidates | PASS - 46 merged |
| Regenerate queues/counts/views | PASS |
| Validate one manifestation may link to many requirements without duplicate same relationship | PASS |
| Produce concise PO review grouped by canonical manifestation | PASS - `output/RS-R7-identity-normalization.md` |
| Do not claim RS-R7 complete or apply ambiguous mappings | PASS - PO gate still pending |

### Gates

| Gate | Result |
|---|---|
| typecheck | PASS |
| lint | PASS |
| validate:architecture | PASS - 0 violations |
| test | PASS - 9 files, 53 tests |
| verify.sh | PASS |
| req:normalize-rs-r7-identities | PASS |
| req:generate-views | PASS |
| req:validate | PASS, with existing `QST-VR-011` maturation warning |
| req:completion-gate | PASS for `scripts/requirements/normalize-rs-r7-identities.ts,package.json`; still reports 225 requirements lacking manifestations as existing RS-R7/RS-R6 queue state |
| bidirectional trace | PASS - `req:justify` and `req:trace` show the normalization script linked to `REQ-GOV-TRACE-001-DATA` |
| browser manual check | N/A |

### PO action required

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | Superseded by RS-R7 close with deferred cleanup queue in `30-rs-r7-close-with-deferred-cleanup.md` | — |

### Consumer updates required

- Consumers use `npm run req:normalize-rs-r7-identities` for repeatable normalization.
- Later RS-R7/RS-R8 work should use canonical queue fields in `docs/product/requirements/graph/generated/rs-r7-review-queue.json`, not raw trace-link row counts.

### Open issues / follow-ups

- RS-R7 remains PO-confirmation pending.
- `QST-VR-011` remains an existing graph maturation warning.
- Code index was stale at session start; this pass normalized persisted graph identities and did not refresh code inventory.
