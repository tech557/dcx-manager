## AC-SEED-ALL — 39 acceptance criteria gaps closed across 11 families
Agent: opencode
Model: deepseek-v4-flash-free
Provider: opencode
Date: 2026-06-30
Type: process-governance
Status: Completed
PO-Action: none

Intent: Seed AC nodes and TRC links for all 39 REQs identified as missing acceptance criteria trace links in the 008 gap audit. Decision sequence: FP → KEY → CAL + SBC → remaining 7 families (PO-approved per-family).
Trigger: PO decision on 008 gap table output — "do FP first", then "both", then "yes" for remaining.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/product/requirements/graph/nodes/acceptance/AC-FP-SEED.json | AC for Focus & Presentation family | 18 |
| created | docs/product/requirements/graph/nodes/acceptance/AC-KEY-SEED.json | AC for Keyboard shortcuts family | 18 |
| created | docs/product/requirements/graph/nodes/acceptance/AC-CAL-SEED.json | AC for Calendar views family | 18 |
| created | docs/product/requirements/graph/nodes/acceptance/AC-SBC-SEED.json | AC for Selection behavior family | 18 |
| created | docs/product/requirements/graph/nodes/acceptance/AC-GOV-SEED.json | AC for Governance family | 18 |
| created | docs/product/requirements/graph/nodes/acceptance/AC-PRESENT-SEED.json | AC for Presentation drill-in | 18 |
| created | docs/product/requirements/graph/nodes/acceptance/AC-LOAD-SEED.json | AC for Loading/skeleton states | 18 |
| created | docs/product/requirements/graph/nodes/acceptance/AC-DENSITY-SEED.json | AC for Density | 18 |
| created | docs/product/requirements/graph/nodes/acceptance/AC-RESP-SEED.json | AC for Responsibility | 18 |
| created | docs/product/requirements/graph/nodes/acceptance/AC-SBT-SEED.json | AC for Copy/paste selection | 18 |
| created | docs/product/requirements/graph/nodes/acceptance/AC-DZ-SEED.json | AC for Drop zones | 18 |
| created | docs/product/requirements/graph/trace-links/ (39 files) | TRC links REQ-* → AC-*-SEED | 14 each |

### AC seeding summary
| Family | AC node | TRC links | Gap count |
|---|---|---|---|
| FP (Focus & Presentation) | AC-FP-SEED | 16 | 16 ✅ |
| KEY (Keyboard shortcuts) | AC-KEY-SEED | 7 | 7 ✅ |
| CAL (Calendar views) | AC-CAL-SEED | 2 | 2 ✅ |
| SBC (Selection behavior) | AC-SBC-SEED | 2 | 2 ✅ |
| GOV (Governance) | AC-GOV-SEED | 6 | 6 ✅ |
| PRESENT | AC-PRESENT-SEED | 1 | 1 ✅ |
| LOAD | AC-LOAD-SEED | 1 | 1 ✅ |
| DENSITY | AC-DENSITY-SEED | 1 | 1 ✅ |
| RESP | AC-RESP-SEED | 1 | 1 ✅ |
| SBT | AC-SBT-SEED | 1 | 1 ✅ |
| DZ | AC-DZ-SEED | 1 | 1 ✅ |
| **Total** | **11 AC nodes** | **39 TRC links** | **39 ✅** |

### Verification
| Check | Result |
|---|---|
| All 39 REQs now have AC TRC count = 1 | ✅ |
| req:validate | pass: true |
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no code changes |
