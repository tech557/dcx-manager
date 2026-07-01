## Codex output-review remediation — backend-discovery-v3
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: mixed
Status: Completed
PO-Action: pending
Version: v1.0.1.0
Change-Class: source

Intent: Resolve the three findings in the Codex output review of backend-discovery-v3 (P1 type-check, P1 workflow route coverage, P2/P3 capture-count/granularity).
Trigger: User request — "check codex output review and resolve any sprints debt".
Sub-tasks (mixed): (1) audit-review of Codex findings; (2) src fix (capture-sink process ref); (3) script fix (summarizer templating); (4) workflow fix (seeded walk); (5) doc corrections.
Requirements covered: REQ-GOV-TRACE-001-BACKEND (backend discovery governance)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | src/telemetry/capture-sink.ts | P1: read env via globalThis.process (not bare process) → contract-check tsc green | 121 |
| edited | scripts/backend/summarize-capture.mjs | P2/P3: normalize concrete paths → route templates; group by method+template | 142 |
| edited | .github/workflows/backend-capture.yml | P1-workflow: seeded walk now drives every route via dev-server + apiClient; coverage gate method+template | 182 |
| edited | docs/backend/captured/local/summary.json | re-run artifact (23 records → 21 method+template routes) | — |
| edited | docs/backend/captured/local/raw-capture.json | re-run raw capture (gitignored) | — |
| edited | docs/backend/readiness-scorecard.md | G5 evidence corrected (21/22 method+template, synthetic @1) | 50 |
| edited | docs/plans/active/backend-discovery-v3/output/BE3-R5a-substrate.md | AC-BE3-5a-2 count corrected | — |
| edited | docs/plans/active/backend-discovery-v3/output/BE3-R5b-live-capture.md | AC-5b-3 + remediation section | — |
| edited | docs/plans/active/backend-discovery-v3/output/BE3-R6-readiness.md | G5 evidence corrected | — |
| edited | docs/plans/active/backend-discovery-v3/README.md | carry-forward: numbers + softened "accumulates automatically" | — |
| created | docs/plans/active/backend-discovery-v3/output-review/2026-07-01-claude-resolution.md | resolution record | 58 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — fixes are additive corrections; did NOT touch the 4 concurrent-agent UI files |
| Preserve-semantic (§9) | Respected — capture-sink env read still off-by-default; api-client signature unchanged |
| Open decisions used (⏱) | None |

### Findings resolved
| Finding | Verdict |
|---|---|
| P1 — contract-check tsc fails (`process` in capture-sink) | RESOLVED — globalThis access; tsc exit 0 |
| P1 — workflow seeded walk never uses route list | RESOLVED — dev-server + apiClient drives every route; claim softened |
| P2/P3 — capture count 6/22 vs 5 records; wrong granularity | RESOLVED — method+template normalization; artifact re-run; docs corrected to 21/22 |

### Gates
| Gate | Result |
|---|---|
| typecheck (root) | PASS |
| contract-check tsc | PASS (exit 0) |
| lint | PASS |
| verify.sh | PASS |
| validate:architecture | PASS (0 violations / 299 modules) |
| test | PASS (92) |
| drift / prod-guard / scrub scripts | PASS |
| backend-capture.yml YAML | valid (10 steps) |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Concurrent UI edits in shared tree | 4 files (Input.tsx, CommunicationDateField.tsx, EditorViewerIsland/*) modified by a parallel frontend-polish process 2026-07-01 12:03–12:04 — not part of this plan | ensure they are attributed/committed to their own workstream, not backend-discovery-v3 |
| (Carried) live capture + requirement intake | G5/G6 still fail — gate remains NOT READY | run R5b live to ≥3 organic payloads/route; run requirement intake for the 8 backend manifestations |

### Consumer updates required
- None — api-client signature unchanged; capture-sink env-read behavior identical (off-by-default).

### Open issues / follow-ups
- Gate verdict unchanged: still NOT READY (G5 organic capture + G6 intake pending). Corrections make the control docs accurate.
- The local 21/22 is a synthetic full-route probe (1 sample/route); organic N≥3 accumulation needs live previews.
