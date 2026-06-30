## (b) validate-before-write hardening + (a) R7 confirmation analysis
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: mixed
Status: Completed
PO-Action: pending

Intent: (b) fold validate-before-write into the shared mutation layer; (a) run the R7 confirmation policy to close R7.
Trigger: PO request — "do b then a".
Requirements covered: F-R2-1 mutation hardening (core.md §36); RS-R7 confirmation gate analysis.

### (b) Mutation-layer hardening — DONE
| Action | Path | What |
|---|---|---|
| edited | scripts/requirements/mutation.ts | applyProposalAfterSignoff now builds the prospective graph in memory, validates BEFORE writing, commits only if valid (no partial writes / no rollback needed) |
| edited | src/requirements/__tests__/requirements.workflow.test.ts | + test: signed-but-invalid proposal throws VALIDATION_FAILED and writes nothing |

Gates: 53/53 tests (new test incl.), typecheck 0, req:validate 0 errors, architecture 0 violations.

### (a) R7 confirmation — STOPPED before mutating (auto-accept unsafe)
Recorded as `LDG-2026-06-29-R7-CONFIRM-ANALYSIS`. The candidate data cannot be rubber-stamped:
| Problem | Evidence |
|---|---|
| Duplicate MAN nodes | 126 source files have 2 MAN nodes each (~⅓ of 397 are dupes) |
| Flat confidence | all 362 candidate `implements` links = 0.85 (no signal) |
| Over-linking / false positives | Select.tsx → 23 reqs (incl FCS-002 nonsense); mock-store 25; types/api 23 |

Auto-confirming would cement wrong traces + duplicate nodes. **Did NOT mutate the 812 links.**

### Checks
| Check | Result |
|---|---|
| Churn | None; (b) additive; (a) recorded a decision, no link mutation |
| Preserve-semantic (§9) | N/A — no product src change |
| req:validate after ledger append | ✅ pass, 0 errors |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| R7 cannot be closed by auto-confirm (low-precision inference + duplicate MAN nodes) | Rubber-stamping pollutes traceability | Approve: (1) dedupe MAN nodes by path, (2) re-infer links from imports/usages (reuse code-index/component-usages) or curate, THEN confirm. R8 stays gated. |

### Open issues / follow-ups
- R7 prerequisites (dedupe + better inference) before confirmation/close.
- R8 verification remains gated until coverage is trustworthy.
- (b) reconcile auto-apply already had a pre-check (Codex); the shared governed path is now also hardened.
