---
sprint: BE3-R6
plan: backend-discovery-v3
title: Readiness synthesis & gate (go/no-go)
family: discovery + governance
executor: Claude / Codex / opencode
required-tools: bash scripts, npm (req:* gates)
depends-on: BE3-R1, BE3-R2, BE3-R3, BE3-R4, BE3-R5a, BE3-R5b
allowed-writes: docs/backend/readiness-scorecard.md, docs/backend/schema/schema.sql (merge R3 auth addendum only), output/BE3-R6-*.md
forbidden-writes: src/**, Supabase apply/execute
status: Active
Status: Active
re-runnable: yes — re-run until the gate returns PASS
---

# BE3-R6 — Readiness synthesis & gate

Score the assembled dataset against the §9 exit criteria and declare readiness — or name exactly which
capture coverage is still thin and send it back for another R5 round. On PASS, emit the hand-off to
`production-api-client-switch`.

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-GOV-TRACE-001-BACKEND` / `RSP-GOV-TRACE-BACKEND` (governance-trace backend); anchors R1–R5 outputs |
| Scope/type | governance / synthesis (scorecard; no behavior) |
| Acceptance outcomes | AC-BE3-6-1 … AC-BE3-6-4 |
| Expected manifestations | `docs/backend/readiness-scorecard.md` (the hand-off artifact) |
| Actual manifestations | the full `docs/backend/**` dataset (contract, schema, auth, integrations, captured summaries) |
| Evidence | every scorecard line cites a captured artifact or script output (G6); `req:*` gates PASS |
| Gate result | `req:validate` + `req:reconcile` + `req:completion-gate` PASS |

## Intent
Make "enough data to finalize the backend connection" a mechanical, evidence-backed decision (plan §9).

## Step 0 — Session environment + carry-forward (MANDATORY, first step)
1. `bash scripts/agent/build-current-state.sh`; read plan §9 (gate criteria) + the full carry-forward and
   every R1–R5 output.
2. Read the accumulated `docs/backend/captured/**` summaries — this is what makes G5 measurable.

## Scope — in
- **Merge the BE3-R3 auth addendum** (`docs/backend/auth/schema-auth-additions.sql`) into
  `docs/backend/schema/schema.sql` (the single R3→schema follow-up recorded in R3's carry-forward, audit
  blocking #3) — this is the only edit R6 makes to `schema/`. Re-run the R2 syntax check after merging.
- Score G1–G6 (plan §9). For each: PASS/FAIL + the citing evidence (captured artifact path or script output).
- Resolve/confirm the open decisions that block criteria: OD-BE3-01 (G2), OD-BE3-02 (G3), OD-BE3-03 (G5).
- If any criterion FAILs: name the exact gap (e.g. "routes X,Y under N captured payloads") and record the
  targeted next action (another capture round / a seeded-journey run) — the plan stays in discovery.
- On all-PASS: write the hand-off section — the dataset index the `production-api-client-switch` build plan
  consumes (contract to implement, schema to apply, RLS to write, integrations to build, fixtures to test).

## Scope — out
- Building/connecting the backend. Applying schema. Any `src/**` change. Inventing readiness — every line
  must cite evidence (G6).

## Acceptance criteria
- [ ] AC-BE3-6-1 — scorecard scores all of G1–G6 with a PASS/FAIL + cited evidence per line (doc-verifiable: no uncited claim)
- [ ] AC-BE3-6-2 — blocking open decisions (OD-BE3-01/02/03) are resolved or the criterion is marked FAIL (doc-verifiable)
- [ ] AC-BE3-6-3 — on all-PASS, a hand-off section names every artifact the build plan needs (doc-verifiable); on any-FAIL, the exact gap + next action is recorded
- [ ] AC-BE3-6-4 — `req:validate` / `req:reconcile` / `req:completion-gate` PASS; no `src/**` changed (gate + diff)

## Verification plan
| Criterion | Method | Evidence required | Fallback if tool unavailable |
|---|---|---|---|
| every line cited | grep scorecard for uncited PASS | 0 uncited | — |
| capture coverage (G5) | `summarize-capture` roll-up vs. contract routes × N | coverage table | — |
| req gates | `CF="$(git diff --name-only \| paste -sd, -)"` (comma-separated + quoted — the reconcile/completion-gate parsers expect a CSV path list, not whitespace-split args; reaudit blocking #3); then `npm run req:validate` + `npm run req:reconcile -- --mode changed --files "$CF"` + `npm run req:completion-gate -- --changed "$CF"` | PASS | — |
| no src | `git diff --name-only -- src/` | empty | — |

## Dependencies
BE3-R1..R5b. Re-runnable: re-run after each additional capture round until the gate returns PASS.

**Handoff note (reaudit advisory #3):** R6 **may run after a Partial BE3-R5b only to emit `FAIL` for G5** —
it cannot PASS until live capture evidence exists in `docs/backend/captured/**`. A blocked/Partial R5b
therefore never lets the readiness gate go green; it only lets R6 record the precise capture gap.

## Files likely affected
- `docs/backend/readiness-scorecard.md` — create/update
- `output/BE3-R6-readiness.md` — create

## Final step — Continuity wiring (MANDATORY, last step)
Append to carry-forward the gate result. On PASS: mark the plan ready to hand off to
`production-api-client-switch` and note the dataset is frozen for the build; do **not** move this plan to
`completed/` until the PO accepts the readiness scorecard. On FAIL: record the outstanding capture gaps so
the next round is unambiguous. Close via `dcx-sprint-close`.
