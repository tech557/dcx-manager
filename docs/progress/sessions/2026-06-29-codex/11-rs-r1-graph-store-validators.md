## RS-R1 — Graph store and validators
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-29
Type: sprint-execution
Status: Completed with documented debt

Intent: Implement the requirements graph store, schema, validate command, and RS-R1 validator tests after RS-R0b sign-off.
Trigger: PO request: "Kick off RS-R1 now"
Requirements covered: RS-R1; `REQ-GOV-TRACE-001`; RS-R0b command/storage decisions.

Files created:
- docs/product/requirements/graph/README.md — graph store entry point (20 lines)
- docs/product/requirements/graph/ledger/decision-ledger.jsonl — seed methodology sign-off ledger entry (1 line)
- docs/product/requirements/graph/nodes/.gitkeep — preserve nodes dir (1 line)
- docs/product/requirements/graph/trace-links/.gitkeep — preserve trace-links dir (1 line)
- docs/product/requirements/graph/proposals/.gitkeep — preserve proposals dir (1 line)
- docs/product/requirements/graph/views/.gitkeep — preserve views dir (1 line)
- docs/product/requirements/graph/generated/.gitkeep — preserve generated dir (1 line)
- scripts/requirements/schema.ts — graph schema, enums, types, canonical categories (264 lines)
- scripts/requirements/store.ts — graph loader for nodes, trace links, ledger (36 lines)
- scripts/requirements/validators.ts — RS-R1 validator catalog implementation and coverage rollup (261 lines)
- scripts/requirements/validate.ts — `npm run req:validate` CLI (11 lines)
- scripts/requirements/propose.ts — RS-R2 placeholder command (2 lines)
- scripts/requirements/apply-after-signoff.ts — RS-R2 placeholder command (2 lines)
- scripts/requirements/generate-views.ts — RS-R2 placeholder command (2 lines)
- scripts/requirements/query.ts — RS-R2 placeholder command (2 lines)
- scripts/requirements/trace.ts — RS-R2 placeholder command (2 lines)
- scripts/requirements/justify.ts — RS-R2 placeholder command (2 lines)
- scripts/requirements/reconcile.ts — RS-R3 placeholder command (2 lines)
- scripts/requirements/completion-gate.ts — RS-R3/RS-R4 placeholder command (2 lines)
- src/requirements/__tests__/requirements.validators.test.ts — unit tests for progressive validation, locks, trace integrity, coverage, exemptions (116 lines)
- docs/plans/active/requirements-system/output/RS-R1-build-notes.md — sprint output and evidence (123 lines)

Files edited:
- package.json — added exact `req:*` command surface from RS-R0b (78 lines)
- docs/plans/active/requirements-system/README.md — RS-R1 carry-forward appended (668 lines)
- docs/plans/active/requirements-system/sprints/RS-R1-graph-store-validators.md — status set to completed with documented debt (59 lines)
- docs/plans/active/requirements-system/sprints/RS-R2-mutation-ledger-queues-views.md — status set to next active sprint (55 lines)

Files deleted:
- None.

Churn — work reversed:
- None.

Preserve-semantic check:
- No product builder code changed.
- `src/requirements/__tests__` added only because current Vitest config includes tests under `src/**/*.{test,spec}.{ts,tsx}`.
- No builder UI, action, readiness, mapper, theme, motion, stage, or island boundary changed.
- On-hold `frontend-polish-v0.3.5` was not resumed or executed.

Open decisions used:
- RS-R0b methodology sign-off is recorded in `output-review/RS-R0b-review.md`.
- Placeholder `req:*` commands intentionally fail until owning later sprints implement them; this preserves exact command names without pretending RS-R2/RS-R3 are complete.

Acceptance criteria:
- PASS — `npm run req:validate` exists and passes.
- PASS — validators catch schema/state/scope/relationship/confidence/progressive/lock/exemption/evidence error classes.
- PASS — draft with intent-level fields passes; implementation-ready node missing required fields fails.
- PASS — lock enforcement rejects locked nodes without lock owner/date.
- PASS — expected-vs-actual coverage returns complete/partial on fixtures.
- PASS WITH DOCUMENTED DEBT — gates pass except inherited lint debt.
- PASS — no product `src` change beyond the test harness required by current Vitest config.

Gates:
- `npm run req:validate`: PASS
- `npm run typecheck`: PASS
- `npm run test`: PASS — 7 files, 33 tests
- `npm run validate:architecture`: PASS
- `bash scripts/verify.sh`: PASS
- `npm run lint`: FAIL — 42 pre-existing `src` `no-explicit-any` errors outside the new RS-R1 test file
- `bash scripts/agent/verify-frontend.sh`: FAIL only on lint; typecheck, verify.sh, architecture, test, build all pass
- `bash scripts/agent/verify-plan-state.sh`: FAIL — pre-existing unrelated completed-plan mismatch in `docs/plans/completed/builder-refactor/`
- `bash scripts/agent/verify-version-state.sh`: PASS
- browser manual check: N/A — tooling/data sprint; no browser surface changed
- stubs check: PASS — no boundary `console.log` matches

Sprint Close Verdict: PASS WITH DOCUMENTED DEBT

Documented debt:
- Existing lint debt remains in older builder files.
- Existing `verify-plan-state` mismatch remains in completed `builder-refactor`.
- RS-R2 must implement proposal/apply/views/query/trace/justify internals.
- RS-R3 must implement reconcile/completion-gate internals.

Consumer updates required:
- RS-R2 must reuse `scripts/requirements/schema.ts`, `store.ts`, `validators.ts`, and the declared package scripts.
- RS-R3 must reuse the same graph store and coverage/confidence semantics.

Open issues / follow-ups:
- RS-R2 is now marked active next.
