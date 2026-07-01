---
sprint: BE3-R5a
plan: backend-discovery-v3
title: Local capture substrate (sink + scripts + scrub, default-off)
family: instrumentation
executor: Claude / Codex / opencode
required-tools: npm (build/test/verify:frontend), node
depends-on: BE3-R1 (frozen contract + extract-routes.sh to snapshot against)
allowed-writes: src/telemetry/capture-sink.ts, src/telemetry/capture-sink.test.ts, guarded tap in src/services/api-client.ts, scripts/backend/**, output/BE3-R5a-*.md
forbidden-writes: any product-behavior change; .github/workflows/**; Supabase prod; enabling capture by default
status: Active
Status: Active
---

# BE3-R5a — Local capture substrate

Build and **locally prove** the capture substrate — an off-by-default request/response sink, a contract
snapshotter, a payload summarizer, and a scrub — with a measurable no-harm guarantee. This sprint stands
up the machinery; **BE3-R5b** wires it into CI. (Split from the original BE3-R5 per audit blocking #5, so
local instrumentation is never mistaken for live CI capture.)

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Graph IDs | `REQ-GOV-TRACE-001-BACKEND` / `RSP-GOV-TRACE-BACKEND` (governance-trace backend). **NB (audit advisory #1):** `REQ-RG-PLAT-018` / `REQ-RG-AUTO-019` are **`proposed`** in the graph, not PO-locked — the `src/**` tap here is **governance-exempt under `REQ-GOV-TRACE-001-BACKEND`** until those nodes are approved; it does not claim a locked requirement it doesn't have. |
| Scope/type | instrumentation — the ONLY sprint touching `src/**`, behind an off-by-default flag; no product behavior |
| Acceptance outcomes | AC-BE3-5a-1 … AC-BE3-5a-6 |
| Expected manifestations | `src/telemetry/capture-sink.ts`, guarded `apiClient` tap, `scripts/backend/capture-contract-snapshot.sh`, `scripts/backend/summarize-capture.sh` |
| Actual manifestations (reuse) | `src/services/api-client.ts` (tap point), `src/telemetry/optin.ts` (opt-in pattern), `scripts/backend/extract-routes.sh` (from BE3-R1) |
| Evidence | flag-off no-harm proof; local capture run producing a summary; scrub proof; prod-guard assertion |
| Gate result | `verify:frontend` + `npm run test` PASS (record actual count) (proving zero behavior change); `req:validate` PASS |

## Intent
Produce a proven, off-by-default capture substrate ready for CI to drive (plan §7.1–§7.4).

## Step 0 — Session environment + carry-forward (MANDATORY, first step)
1. `bash scripts/agent/build-current-state.sh` + `verify-tooling-state.sh`; confirm one clean dev server
   per env-hygiene memory before any local capture/Playwright verification.
2. Read plan §7 (capture) + §7.4 (safety) + BE3-R1 contract & `extract-routes.sh` + carry-forward.
3. Confirm D-BE3-CAPTURE-OFF: the tap is a **no-op unless `VITE_BE3_CAPTURE=1`**.

## Scope — in
- `src/telemetry/capture-sink.ts`: passive recorder (route, method, scrubbed body, response shape, timing)
  → in-memory ring, flushed to a JSON artifact. **No-op unless `VITE_BE3_CAPTURE=1`.** Mirrors the existing
  `src/telemetry/optin.ts` opt-in pattern.
- Minimal guarded tap in `src/services/api-client.ts`: invoke the sink around `mockDispatch` **only when the
  flag is on**. Must not alter returned data or timing when off.
- `scripts/backend/capture-contract-snapshot.sh`: re-emit the contract from code at the current commit
  (reusing `extract-routes.sh`); diff against committed `contract.json` → a **contract-drift** signal.
- `scripts/backend/summarize-capture.sh`: roll raw captured payloads into per-route field-population rates,
  cardinality, string-length distributions, null-rates, edge cases → `summary.json`; includes a **scrub
  check** (no secrets/PII).
- A **prod-guard assertion** script `scripts/backend/assert-capture-off-in-prod.sh` (a production-context
  build must not set `VITE_BE3_CAPTURE`) — invoked by CI in BE3-R5b, but authored and unit-tested here.

## Scope — out
- Any product behavior change (`verify:frontend` must stay green). Enabling capture in production.
- The GitHub workflow / preview wiring / registry patch (that is **BE3-R5b**). Pointing at `dcx-manager-prod`.
- Wiring a real backend into `apiClient` (that is the build plan).

## Acceptance criteria
- [ ] AC-BE3-5a-1 — **flag-off no-harm (measurable, not "byte-identical"):** a colocated `src/telemetry/capture-sink.test.ts` spy asserts the sink is **not invoked** with the flag unset (and **is** invoked with it set), `apiClient` returns identical data, `npm run verify:frontend` + `npm run test` PASS (record the actual test count from output — do not hard-code it), and the production bundle-size delta is **≤ 1 KB gzipped** (test-verifiable: `npm run test -- src/telemetry/capture-sink.test.ts` + gate output + `du`/rollup size diff attached)
- [ ] AC-BE3-5a-2 — with `VITE_BE3_CAPTURE=1`, a local run (`npm run dev` + a journey walk) produces a payload artifact + `summary.json` (browser-verifiable: artifact attached; fallback below if MCP unavailable)
- [ ] AC-BE3-5a-3 — `capture-contract-snapshot.sh` detects a deliberately-introduced drift and passes on a matching contract (test-verifiable: both cases shown)
- [ ] AC-BE3-5a-4 — scrub check proves no secrets/PII in `summary.json` (code-verifiable: scrub test on a seeded-secret fixture)
- [ ] AC-BE3-5a-5 — `assert-capture-off-in-prod.sh` fails a production-context build that sets the flag (code-verifiable: both cases)
- [ ] AC-BE3-5a-6 — the only `src/**` diff is the sink + the guarded tap; nothing else under `src/` changed (code-verifiable: name-only diff review)

## Verification plan
| Criterion | Method | Evidence required | Fallback if tool unavailable |
|---|---|---|---|
| flag-off no-harm | `npm run test -- src/telemetry/capture-sink.test.ts` (spy: uncalled flag-off, called flag-on) + `npm run verify:frontend` + `npm run test`; bundle-size diff | PASS (record actual test count); spy assertion green; delta ≤ 1 KB gz | — |
| capture produces data | `npm run dev` + seeded journey walk with flag on | `summary.json` attached | if Playwright/preview MCP unavailable: drive journeys via dev-smoke HTTP, mark the screenshot gate `BLOCKED`, log the missing tool (core.md §28) |
| drift detection | snapshot on a mutated route + on clean | fail then pass | — |
| scrub | summarizer on a seeded-secret payload | secret absent from output | — |
| prod-guard | `assert-capture-off-in-prod.sh` on prod+flag / prod-no-flag | fails then passes | — |
| src scope | `git diff --name-only -- src/` | only sink + tap | — |

## Dependencies
BE3-R1 (contract + `extract-routes.sh`). Blocks BE3-R5b (which drives this substrate from CI).

## Files likely affected
- `src/telemetry/capture-sink.ts` — create (off-by-default)
- `src/telemetry/capture-sink.test.ts` — create (flag-off/flag-on spy proof for AC-BE3-5a-1)
- `src/services/api-client.ts` — edit (guarded tap only)
- `scripts/backend/capture-contract-snapshot.sh`, `scripts/backend/summarize-capture.sh`, `scripts/backend/assert-capture-off-in-prod.sh` — create
- `output/BE3-R5a-substrate.md` — create

## Final step — Continuity wiring (MANDATORY, last step)
Append to carry-forward: substrate live (flag name, sink path, script names), the measurable no-harm proof,
and that **BE3-R5b** now wires it to the preview pipeline. The `src/**` tap is recorded as
governance-exempt (advisory #1) pending `REQ-RG-*` approval. Close via `dcx-sprint-close` (must return
PASS / PASS_WITH_QUEUED_REVIEW).
