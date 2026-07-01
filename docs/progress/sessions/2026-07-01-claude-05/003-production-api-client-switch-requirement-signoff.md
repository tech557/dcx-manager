## production-api-client-switch — PO sign-off of PAC-R0 requirement intake
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
Status: Completed
PO-Action: none
Version: v1.0.3.0
Change-Class: non-source

Intent: PO directed "sign them off" for the 3 `REQ-BE-*` proposals queued at PAC-R0, unblocking PAC-R1..R6 per the plan's ID-lock rule.
Trigger: User request — "sign them off"
Requirements covered: REQ-BE-SCHEMA-001, REQ-BE-AUTH-001, REQ-BE-API-001 (all created + signed this entry)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/product/requirements/graph/nodes/requirement/REQ-BE-SCHEMA-001.json | Minted by req:apply-after-signoff | 17 |
| created | docs/product/requirements/graph/nodes/requirement/REQ-BE-AUTH-001.json | Minted by req:apply-after-signoff | 17 |
| created | docs/product/requirements/graph/nodes/requirement/REQ-BE-API-001.json | Minted by req:apply-after-signoff | 17 |
| edited | docs/product/requirements/graph/ledger/decision-ledger.jsonl | 3 new ledger entries (LDG-2026-07-01-create-node-REQ-BE-{SCHEMA,AUTH,API}-001), signoff_by "Mahmoud (PO)" | +3 |
| edited | docs/plans/active/production-api-client-switch/sprints/PAC-R1.md, PAC-R2.md, PAC-R3.md, PAC-R5.md, PAC-R6.md | Replaced `REQ-BE-{SCHEMA,AUTH,API}-*` wildcards with the real signed IDs (ID-lock rule) | small, per file |
| edited | docs/plans/active/production-api-client-switch/README.md | Same wildcard→real-ID replacement in the requirement-traceability table | 3 lines |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | No src/** touched |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| 3 proposals signed off via req:apply-after-signoff | PASS — all 3 returned `"applied": true` |
| req:validate still clean | PASS — `{"pass": true, "errors": [], "warnings": []}` |
| No wildcard REQ-BE-* traces remain in sprint files | PASS — grep confirms all replaced with real IDs |

### Gates
| Gate | Result |
|---|---|
| req:validate | PASS |
| typecheck/lint/test/verify | N/A — no src/** change |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None

### Open issues / follow-ups
- None — PAC-R1 was executed immediately after in this same session (separate log entry).
