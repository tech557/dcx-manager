# BE3-R5a — Local capture substrate (output)

Agent: Claude · Model: claude-opus-4-8 · Provider: Anthropic · Date: 2026-07-01
Version: v1.0.1.0 · Change-Class: **source** (the ONE sprint that touches `src/**`, behind an off-by-default flag)

## What this sprint produced

A proven, **off-by-default** capture substrate — sink + guarded tap + contract snapshotter + payload
summarizer + scrub + prod-guard — with a **measurable** no-harm guarantee (not an unfalsifiable "byte-identical"
claim). BE3-R5b wires it into CI.

| Artifact | Path | Purpose |
|---|---|---|
| Capture sink | `src/telemetry/capture-sink.ts` | off-by-default recorder (scrubbed body + response shape + timing); `isEnabled()` gates on `VITE_BE3_CAPTURE==='1'` |
| Colocated test | `src/telemetry/capture-sink.test.ts` | flag-off/flag-on spy + identical-data + scrub + shape (7 tests) |
| Guarded tap | `src/services/api-client.ts` (edit) | when flag off, unchanged path; when on, measures timing + records |
| Contract snapshot | `scripts/backend/capture-contract-snapshot.sh` | re-emits contract from code (reuses `extract-routes.sh`), diffs committed → drift signal |
| Summarizer | `scripts/backend/summarize-capture.{mjs,sh}` | per-route field-population/null-rate/timing + scrub check |
| Prod-guard | `scripts/backend/assert-capture-off-in-prod.sh` | fails a production build that sets the flag |

## Acceptance criteria — all PASS

| Criterion | Verdict | Evidence |
|---|---|---|
| AC-BE3-5a-1 — flag-off no-harm (measurable) | ✅ PASS | spy: `record` NOT called flag-off, called once flag-on; `apiClient` data identical (test); **`verify:frontend` PASS**; **`npm run test` PASS — 92 tests / 13 files** (7 new); **bundle delta = 644 B gzipped ≤ 1 KB** (two-build measure: 262406 vs 261762) |
| AC-BE3-5a-2 — flag-on local run produces artifact + summary | ✅ PASS | full-route probe through the tap → `docs/backend/captured/local/raw-capture.json` (23 records) + `summary.json` (**21/22 method+template routes**, per-route field-population, scrub PASS). *[Updated per Codex output-review P2/P3: coverage now measured at method+template granularity; artifact re-run.]* |
| AC-BE3-5a-3 — drift detection | ✅ PASS | clean → "OK, 22 routes" (exit 0); mutated contract → "DRIFT DETECTED" (exit 1) |
| AC-BE3-5a-4 — scrub proves no secrets/PII | ✅ PASS | real summary `scrub_check: PASS`; seeded `sk-…` payload → `scrub FAIL` (exit 1); request-body key-scrub unit-tested |
| AC-BE3-5a-5 — prod-guard | ✅ PASS | production+flag → FAIL (exit 1); production-no-flag → OK; preview+flag → OK |
| AC-BE3-5a-6 — only sink + tap under `src/` | ✅ PASS | `git status src/` = `api-client.ts` (M) + `capture-sink.ts` + `capture-sink.test.ts` (new); nothing else |

## No-harm measurement (AC-BE3-5a-1 detail)
```
verify:frontend           → PASS (typecheck 0, lint 0, verify.sh pass, depcruise 0 violations / 299 modules)
npm run test              → 92 passed / 13 files (was 85 + 7 new capture-sink tests)
bundle gz (with sink)     → 262406 B
bundle gz (baseline)      → 261762 B
delta                     → 644 B  ≤ 1024 B threshold  ✅
```

## Governance note (audit advisory #1)
The `src/**` tap is **governance-exempt under `REQ-GOV-TRACE-001-BACKEND`**. `REQ-RG-PLAT-018` /
`REQ-RG-AUTO-019` are `proposed` (not PO-locked) — cited as supporting only; this sprint does not claim a
locked requirement it lacks.

## Gates

| Gate | Result |
|---|---|
| typecheck | PASS |
| lint | PASS |
| verify.sh | PASS |
| validate:architecture | PASS (0 violations, 299 modules) |
| test | PASS (92) |
| bundle delta ≤ 1 KB gz | PASS (644 B) |
| drift / scrub / prod-guard scripts | PASS (both cases each) |

## Follow-ups
- BE3-R5b wires this substrate into `.github/workflows/backend-capture.yml` on preview `deployment_status`.
- `docs/backend/captured/local/raw-capture.json` is a local proof artifact; R5b's `.gitignore` ignores raw
  captures (only summaries committed).
