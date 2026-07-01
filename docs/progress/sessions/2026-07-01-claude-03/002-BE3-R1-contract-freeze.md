## BE3-R1 — API contract freeze
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: none
Version: v1.0.1.0
Change-Class: non-source

Intent: Freeze the 22-route contract surface into a deterministic, drift-checkable machine + human spec proven against live Api* types.
Trigger: backend-discovery-v3 execution (BE3-R1), user request to run all sprints.
Requirements covered: REQ-DM-017 (api.ts), REQ-SC-001 (service layer)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | scripts/backend/extract-routes.mjs | deterministic route parser (authoritative route list) | 73 |
| created | scripts/backend/extract-routes.sh | portable wrapper (paths from script location) | 8 |
| created | docs/backend/contract/contract.json | 22 enriched route entries | 42 |
| created | docs/backend/contract/contract.md | human contract by 8 families + drift findings | 96 |
| created | scripts/backend/check-contract-types.ts | contract↔code round-trip type assertions | 97 |
| created | scripts/backend/tsconfig.contract-check.json | isolated tsconfig for the check | 9 |
| created | docs/plans/active/backend-discovery-v3/output/BE3-R1-contract.md | sprint output | 53 |
| edited | docs/plans/active/backend-discovery-v3/README.md | carry-forward: R1 facts | +8 |
| edited | docs/backend/README.md | dataset index: contract → COMPLETE | ~1 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no `src/**` touched; contract mirrors code (D-BE3-CONTRACT-SOT), no fork |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-BE3-1-1 — extractor length == contract.json length (22) | PASS |
| AC-BE3-1-2 — each entry records method/path/params/req/resp/service | PASS |
| AC-BE3-1-3 — round-trip type-check passes | PASS (`tsc -p tsconfig.contract-check.json` exit 0) |
| AC-BE3-1-4 — drift list produced | PASS (error-reporter stub flagged; no dead/unregistered live routes) |
| AC-BE3-1-5 — no `src/**` changed | PASS (`git diff --name-only -- src/` empty) |

### Gates
| Gate | Result |
|---|---|
| typecheck (contract round-trip) | PASS (0 errors) |
| verify.sh | N/A this task (docs/scripts only; full verify at plan level) |
| validate:architecture | N/A — no src |
| test | N/A — no runtime code |
| route parity (deterministic) | PASS (22==22, identical set) |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None — new scripts/docs; no existing exports changed.

### Open issues / follow-ups
- `POST /error-reports` `@route` is a client-side stub, not a backend route — build-plan decision (recommend: keep out of v1 backend contract).
- Contract-drift CI gate authored in BE3-R5a, wired live in BE3-R5b.
