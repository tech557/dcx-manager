## BE3-R5a — Local capture substrate
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v1.0.1.0
Change-Class: source

Intent: Build + locally prove an off-by-default request/response capture substrate (sink + tap + snapshot + summarizer + scrub + prod-guard) with measurable no-harm.
Trigger: backend-discovery-v3 execution (BE3-R5a) — the only sprint touching src/**.
Requirements covered: REQ-GOV-TRACE-001-BACKEND / RSP-GOV-TRACE-BACKEND (src tap governance-exempt; REQ-RG-PLAT-018/AUTO-019 are proposed, cited supporting-only)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | src/telemetry/capture-sink.ts | off-by-default capture sink (scrub + response-shape) | 116 |
| created | src/telemetry/capture-sink.test.ts | flag-off/on spy + identical-data + scrub + shape | 91 |
| edited | src/services/api-client.ts | guarded capture tap (no-op path when flag off) | 39 (was 23) |
| created | scripts/backend/capture-contract-snapshot.sh | contract-drift detector (reuses extract-routes.sh) | 33 |
| created | scripts/backend/summarize-capture.mjs | per-route field-population + scrub check | 109 |
| created | scripts/backend/summarize-capture.sh | wrapper | 7 |
| created | scripts/backend/assert-capture-off-in-prod.sh | prod-guard | 26 |
| created | docs/backend/captured/local/raw-capture.json | local capture proof artifact (5 records) | — |
| created | docs/backend/captured/local/summary.json | rolled summary (scrub PASS) | — |
| created | docs/plans/active/backend-discovery-v3/output/BE3-R5a-substrate.md | sprint output | 60 |
| edited | docs/plans/active/backend-discovery-v3/README.md | carry-forward: R5a facts | +10 |
| edited | docs/backend/README.md | dataset index: substrate → COMPLETE | ~1 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — additive; no existing behavior changed (flag off = unchanged path) |
| Preserve-semantic (§9) | Respected — tap wraps mockDispatch through apiClient; no service/rule/action semantics changed; mapper boundary untouched |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-BE3-5a-1 — flag-off no-harm (measurable) | PASS (spy off/on; identical data; verify:frontend PASS; test 92; bundle Δ 644 B gz ≤ 1 KB) |
| AC-BE3-5a-2 — flag-on run → artifact + summary | PASS (5 routes captured → summary.json) |
| AC-BE3-5a-3 — drift detection | PASS (clean exit0 / mutated exit1) |
| AC-BE3-5a-4 — scrub no secrets/PII | PASS (real PASS / seeded-secret FAIL) |
| AC-BE3-5a-5 — prod-guard | PASS (prod+flag FAIL; else OK) |
| AC-BE3-5a-6 — only sink + tap under src | PASS |

### Gates
| Gate | Result |
|---|---|
| typecheck | PASS |
| lint | PASS |
| verify.sh | PASS |
| validate:architecture | PASS (0 violations / 299 modules) |
| test | PASS — 92 tests / 13 files |
| bundle delta ≤ 1 KB gz | PASS (644 B) |
| browser manual check | N/A — capture proven via vitest through real apiClient tap (no UI change) |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- `src/services/api-client.ts` public signature unchanged (only internal tap added) — no consumer changes.

### Open issues / follow-ups
- BE3-R5b wires the substrate into `.github/workflows/backend-capture.yml` (may close Partial on CI creds).
- Raw capture artifacts to be gitignored in R5b (only summaries committed).
- src tap governance-exempt pending REQ-RG-* approval (advisory #1).
