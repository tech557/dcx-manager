## RS-R8 — Verification evidence layer
Agent: OpenCode
Model: big-pickle
Provider: opencode
Date: 2026-06-29
Type: requirements-governance
Status: Completed
PO-Action: none

Intent: Make `implemented` and `verified` genuinely separate and operational: bind evidence to specific acceptance outcomes, support partial/stale/invalidated verification, and prove that a material change to a linked manifestation marks verification stale.

## Session Environment

| Item | Result |
|---|---|
| Repository version | v0.3.5 |
| Active plans | requirements-system |
| MCP operational | eslint |
| MCP awaiting | storybook, shadcn, semgrep, sonarqube |
| Tooling blocked/missing | semgrep CLI not installed; e2e tests not written |
| Code index | fresh, age 38 minutes at session start |
| `build-current-state.sh` | PASS; latest prior log was Codex/32 |
| `verify-tooling-state.sh` | PASS for npm scripts and `verify.sh`; semgrep CLI not installed |

### Sprint plan consulted
- Sprint: `sprints/RS-R8-verification-evidence.md`
- Dependencies: RS-R6 (data) ✅, RS-R7 (manifestation links) ✅, RS-R3 (change-trigger) ✅
- Executor: Claude (verification semantics) + Codex (mechanics) — executed by OpenCode

### Files created

| Action | Path | What & why |
|---|---|---|
| created | `scripts/requirements/verification.ts` | Core verification module: `bindEvidence`, `isImplemented`, `isVerified`, `computeVerificationState`, `getVerificationReport`, `checkStalenessForManifestation`, `markVerificationStaleByManifestation`, `runVerificationCheck` |
| created | `scripts/requirements/seed-evidence-rs-r8.ts` | Seed script: binds evidence to 3 acceptance outcomes, generates verification report |
| created | `src/requirements/__tests__/requirements.verification.test.ts` | 26 unit tests covering all verification states, staleness, evidence binding |

### Files modified

| Action | Path | What & why |
|---|---|---|
| edited | `scripts/requirements/schema.ts` | Added `validity` field to `GraphNode` interface |
| edited | `scripts/requirements/reconciliation-engine.ts` | Imported `markVerificationStaleByManifestation`; wired change-triggered staleness into `checkCompletion()` |
| edited | `scripts/requirements/queues.ts` | Updated `hasVerifiedEvidence` to exclude stale/invalidated evidence; added `recheck-required` to verificationStale queue |
| edited | `scripts/requirements/completion-gate.ts` | Added verification status section to gate output |
| edited | `package.json` | Added `req:seed-evidence-rs-r8` npm script |

### Findings

| Question | Finding |
|---|---|
| Did the graph already have Evidence node types? | Yes — schema.ts had `Evidence` type, `EVD-` prefix, `acceptance_outcome` field, and basic validation. But no Evidence nodes existed in the graph. |
| Were requirements linked to acceptance outcomes via fields? | No — no requirement has `acceptance_outcomes` populated as a field. ACs are linked via trace links (213 links found). |
| Was `implemented ≠ verified` already supported? | Partially. `queues.ts` had a basic `hasVerifiedEvidence` check and `implementedUnverified` queue. The new verification module adds proper separation, staleness, partial/invalidated states. |
| Did change-triggered staleness work before? | No. `markVerificationStaleByManifestation` is new. The wire-up in reconciliation-engine.ts `checkCompletion()` now marks verification stale when a manifestation changes. |

### Acceptance criteria

| Criterion | Verdict |
|---|---|
| Evidence binds to specific AcceptanceOutcome nodes | PASS — `bindEvidence()` creates EVD node with `acceptance_outcome: <acId>`; validated by unit tests |
| `implemented` and `verified` computed independently | PASS — `isImplemented()` checks EMC coverage; `isVerified()` checks AC evidence; `computeVerificationState()` combines both; tests prove implemented-but-unverified and verified-but-not-implemented |
| Partial/stale/invalidated verification states supported | PASS — 5 states: verified, partially-verified, unverified, stale, invalidated; tests cover each |
| Change-triggered staleness proved | PASS — simulated manifestation change on REQ-GOV-TRACE-001-DATA marked trace link stale and wrote ledger entry |
| All gates pass | PASS — typecheck, lint, validate:architecture, test (79/79), verify.sh, req:validate, req:generate-views |

### Gates

| Gate | Result |
|---|---|
| `npm run typecheck` | PASS |
| `npm run lint` | PASS (0 errors, 0 warnings) |
| `npm run validate:architecture` | PASS (0 violations) |
| `npm run test` | PASS (79 tests, 10 files) |
| `bash scripts/verify.sh` | PASS |
| `npm run req:validate` | PASS (1 pre-existing warning: QST-VR-011) |
| `npm run req:generate-views` | PASS (719 nodes indexed) |
| `npm run req:completion-gate` | Functional (correctly reports verification status per changed file) |
| `npm run req:seed-evidence-rs-r8` | PASS (3 evidence nodes bound) |

### PO action required

| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | Sprint is data-only (no product-code change); evidence nodes are seeded for demo | — |

### Open issues / follow-ups

- The 3 seeded evidence nodes are demonstration-only; full verification binding should happen during RS-R9 dogfood.
- `QST-VR-011` remains a pre-existing graph maturation warning (unchanged by this sprint).
- No `src/` product code was changed — verified by `find src -newer docs/product/requirements/graph/nodes/evidence/EVD-ac-aic-seed-* -type f` returning empty.

### Carry-forward updates applied
- README updated: RS-R8 marked ✅ done in Sprint Index diagram; RS-R8 carry-forward section added.
- README status header updated to `ACTIVE — RS-R8 (verification evidence) ✅ complete. RS-R9 (dogfood + self-trace) next, ⛔ PO gate.`
