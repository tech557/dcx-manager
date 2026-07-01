## PAC-R0 — Prerequisites, PO confirmations & switch architecture
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-07-01
Type: sprint-execution
Status: Completed
PO-Action: pending
Version: v1.0.3.0
Change-Class: non-source

Intent: Execute the sole first-activatable sprint of `production-api-client-switch` — confirm discovery readiness, record the 4 PO product-model confirmations, queue the `REQ-BE-*` requirement intake, and fix the switch architecture, so PAC-R1..R6 have a decided, unblocked foundation.
Trigger: User request — "execute the active plan... complete your read and then start sprint by sprint, log each sprint output and task when finished and only stop when u need PO inputs"
Requirements covered: REQ-GOV-TRACE-001-BACKEND (anchor); queues REQ-BE-API-001, REQ-BE-AUTH-001, REQ-BE-SCHEMA-001 (agent-proposed, not yet PO-signed)

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/backend/switch/po-confirmations.md | Records the 4 PO-confirmed product-model points, closes OD-PAC-01 (duplicate-only) | 25 |
| created | docs/backend/switch/architecture.md | Records flag, real-dispatcher shape, closes OD-PAC-04 (whole-dispatcher flip), apply order | 67 |
| created | docs/plans/active/production-api-client-switch/output/PAC-R0-prerequisites.md | Sprint output — AC evidence + gate results | 69 |
| created | docs/product/requirements/graph/proposals/PRP-2026-07-01-create-node-REQ-BE-SCHEMA-001.json | Requirement intake proposal (schema) | 28 |
| created | docs/product/requirements/graph/proposals/PRP-2026-07-01-create-node-REQ-BE-AUTH-001.json | Requirement intake proposal (auth/RLS) | 28 |
| created | docs/product/requirements/graph/proposals/PRP-2026-07-01-create-node-REQ-BE-API-001.json | Requirement intake proposal (real dispatcher) | 28 |
| edited | docs/plans/active/production-api-client-switch/sprints/PAC-R0.md | status Drafted → Completed; all 5 AC checked | 2 lines changed |
| edited | docs/plans/active/production-api-client-switch/README.md | carry-forward "Facts each sprint leaves behind" — PAC-R0 entry appended | +13 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | No src/** touched by this sprint (pre-existing uncommitted api-client.ts diff from prior BE3-R5a work, unrelated); no Supabase apply |
| Open decisions used (⏱) | None — OD-PAC-01 and OD-PAC-04 resolved via explicit PO answer this turn, not a temporary default |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| AC-PAC-0-1 — readiness = READY confirmed | PASS — cited `docs/backend/readiness-scorecard.md` verdict "🟢 READY", G1–G6 all PASS |
| AC-PAC-0-2 — PO confirmations recorded, no TBD | PASS — `po-confirmations.md`, 4/4 points, OD-PAC-01 closed (PO: "it should be a duplicate yes") |
| AC-PAC-0-3 — requirement intake queued | PASS — 3 `req:propose create-node` proposals written; `req:validate` → pass:true, 0 errors |
| AC-PAC-0-4 — switch architecture recorded | PASS — `architecture.md`, OD-PAC-04 closed (whole-dispatcher flip, PO-selected) |
| AC-PAC-0-5 — no src/** changed, no Supabase apply | PASS — `git diff --name-only -- src/` shows only a pre-existing unrelated diff; `list_migrations` on both `dcx-manager-dev` (ibekkxqujqvlajeldpoa) and `dcx-manager-prod` (xokgguodxjjwokngyquo) → `{"migrations":[]}` |

### Gates
| Gate | Result |
|---|---|
| typecheck | N/A — no src/** change from this sprint |
| lint | N/A — no src/** change from this sprint |
| verify.sh | N/A — non-source sprint |
| test | N/A — non-source sprint |
| validate:architecture | N/A — non-source sprint |
| req:validate | PASS — `{"pass": true, "errors": [], "warnings": []}` |
| browser manual check | N/A — no UI change |
| sprint-doctor.sh | Ran pre-fix (flagged status: Drafted, now corrected); re-verify below |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Sign off 3 queued `REQ-BE-*` proposals | ID-lock rule (audit blocking #1): PAC-R1..R6 carry placeholder Requirement Trace fields and legally cannot execute until these are PO-signed, minting real node IDs | Run `npm run req:apply-after-signoff -- --id <PRP-id> --signoff <ref>` for each of `PRP-2026-07-01-create-node-REQ-BE-{SCHEMA,AUTH,API}-001`, or direct the executing agent to do so once you approve |

### Consumer updates required
- None (docs/governance-only sprint)

### Open issues / follow-ups
- PAC-R1..R6 remain blocked until the PO sign-off above lands — this is the stop point requested ("only stop when u need PO inputs"). No further sprint should execute until that happens.
