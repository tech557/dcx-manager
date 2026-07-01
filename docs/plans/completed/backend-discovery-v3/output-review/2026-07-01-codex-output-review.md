# Backend Discovery v3 Output Review — Codex

Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-07-01
Type: audit-review
Version: v1.0.1.0
Change-Class: non-source

## Verdict

**Not ready to hand off.** The output correctly withholds the `production-api-client-switch` handoff because
G5 and G6 fail, and the static discovery outputs are mostly useful. However, I found three issues that
should be fixed before treating the dataset as a stable control document.

## Findings

### P1 — Contract type-check claim is stale in the current tree

`docs/plans/active/backend-discovery-v3/output/BE3-R1-contract.md:24` and
`docs/backend/readiness-scorecard.md:14` cite
`npx tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` as passing evidence for G1.
Re-running that exact command now fails:

```text
src/telemetry/capture-sink.ts(39,14): error TS2591: Cannot find name 'process'.
src/telemetry/capture-sink.ts(39,41): error TS2591: Cannot find name 'process'.
src/telemetry/capture-sink.ts(39,61): error TS2591: Cannot find name 'process'.
```

Root cause: `scripts/backend/tsconfig.contract-check.json` sets `"types": []`, and
`src/telemetry/capture-sink.ts:39` references `process.env`. The route snapshot itself still passes
(`capture-contract-snapshot.sh` reports 22 routes, no drift), and the root `npm run typecheck` completed
successfully, but the specific G1 evidence cited by R1/R6 is no longer true after R5a.

**Required fix:** remove the browser-source dependency on `process`, type it safely without Node globals, or
adjust the contract-check config intentionally. Then re-run the contract round-trip and update R1/R6 evidence.

### P1 — Live capture workflow does not actually exercise every contract route

`docs/plans/active/backend-discovery-v3/sprints/BE3-R5b.md` requires the seeded journey to exercise every
route from `extract-routes.sh`. The committed workflow does not do that. In
`.github/workflows/backend-capture.yml:90-105`, the temporary Playwright script loads the page, reads
`window.__BE3_CAPTURE__`, and calls `sink.flush()`. It passes the route list into `page.evaluate`, but never
uses it to call services or drive UI flows.

That means a live run can commit a summary, but it cannot satisfy AC-BE3-5b-3 or G5 as authored. At best it
captures whatever the page loaded naturally. This matches the existing follow-up in
`BE3-R5b-live-capture.md:47-48`, but the output also says the workflow will accumulate capture automatically
once live (`README.md:165-166`), which is too strong for the current script.

**Required fix:** add the preview-only service hook the output mentions, or replace the temporary script with
real Playwright journeys that deterministically hit all 22 routes. Until then, R5b should remain Partial for
workflow capability, not only credentials.

### P2 — Capture-count evidence is internally inconsistent

The actual local summary says:

```text
docs/backend/captured/local/summary.json
_meta.total_records = 5
_meta.routes_observed = 5
routes = /access/me, /activity-logs, /api/channels, /api/subtask-definitions, /versions
```

But the R5b/R6 documents say local coverage is **6/22**:

- `docs/plans/active/backend-discovery-v3/output/BE3-R5b-live-capture.md:25`
- `docs/plans/active/backend-discovery-v3/output/BE3-R5b-live-capture.md:32`
- `docs/plans/active/backend-discovery-v3/output/BE3-R6-readiness.md:23`
- `docs/plans/active/backend-discovery-v3/README.md:174`
- `docs/backend/readiness-scorecard.md:18`

This does not change the gate verdict; G5 fails either way. But the scorecard is supposed to be the
mechanical evidence record, so the number should be corrected to **5/22 with 17 missing routes**, or the
capture should be re-run and the artifact committed.

## Checks Run

| Check | Result |
|---|---|
| `bash scripts/agent/build-current-state.sh` | PASS; active plan `backend-discovery-v3`; code index stale; MCP operational `eslint`, `shadcn`, `playwright` |
| `bash scripts/agent/verify-tooling-state.sh` | PASS for tooling availability; code index stale; Storybook/Semgrep/SonarQube MCP awaiting setup |
| `bash scripts/backend/extract-routes.sh` | PASS; 22 routes emitted |
| `jq '.routes|length' docs/backend/contract/contract.json` | PASS; 22 |
| `bash scripts/backend/capture-contract-snapshot.sh` | PASS; no drift, 22 routes match committed contract |
| `npx tsc -p scripts/backend/tsconfig.contract-check.json --noEmit` | FAIL; `process` missing in `capture-sink.ts` under contract-check config |
| `npm run typecheck` | PASS; root TS config completed successfully |
| `jq` over `docs/backend/captured/local/summary.json` | PASS; artifact has 5 total records / 5 observed routes |

## Prior Art Read

Read expired `backend-discovery` README and outputs:

- BE-R1 found the API/domain type split was clean but duplicated.
- BE-R2 found services were localStorage/mock-backed and the mapper layer was the reusable backend seam.
- BE-R3 found the real backend switch should preserve mappers and replace service persistence.

BE3-v3 carries the important prior finding forward: the current contract is the service/API seam, not a
backend implementation.

## Positive Notes

- The outputs are honest that R5b and R6 are Partial / NOT READY; no handoff is emitted.
- Static discovery artifacts are useful: route extraction, contract JSON/MD, proposed schema, auth/RLS,
  integration decisions, and scorecard all exist in `docs/backend/`.
- DB lint is correctly marked BLOCKED instead of PASS.
- The drift snapshot currently matches the committed contract.
