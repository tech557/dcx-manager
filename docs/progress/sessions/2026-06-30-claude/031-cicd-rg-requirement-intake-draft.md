## RG-PLAN — Requirement intake draft (19 REQ-RG-* proposals, pending PO sign-off)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: user-request-planning
Status: Completed
PO-Action: pending

Intent: Draft the requirement-graph intake for blocker #1 (OD-RG-07) — propose the 19 REQ-RG-* nodes the sprint traces cite, via the governance-mandated `req:propose` tool, leaving apply for PO sign-off (§35b).
Trigger: PO message: "yes" (proceed with the intake draft).

### Process (dcx-requirement-intake skill)
- Step 2 dup-check: grep nodes + ledger for ci/cd/release/deploy/promote/version → no duplicate; precedent `REQ-GOV-TRACE-001-DEVOPS` (scope devops) reused as the schema model.
- Step 3 draft: 19 payloads (one per cited ID) → `npm run req:propose -- --type create-node` → saved to `graph/proposals/`.
- Step 4 check: `npm run req:validate` → `{pass:true, errors:[], warnings:[]}`.
- Step 5 present (this log + chat) for PO sign-off.

### Proposals created (governance: proposed; pending sign-off)
19 nodes `REQ-RG-PREVIEW-001` … `REQ-RG-AUTO-019`. Scope split: 9 devops, 9 governance, 1 agent-workflow.
IDs match exactly what the sprint `## Requirement Trace` sections cite → applying them clears audit blocker #1.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/product/requirements/graph/proposals/PRP-2026-06-30-create-node-REQ-RG-*.json (×19) | pending requirement proposals (req:propose) | 19 files |
| created | scratchpad/rg-intake.sh + payloads/ | generator (temp, outside repo) | — |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — no source code; graph proposals are pending, not canonical |
| Open decisions used (⏱) | OD-RG-07 intake executed as proposals; **no canonical mutation** — apply is PO-gated (§35b) |
| req:validate | pass=true, 0 errors, 0 warnings |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| 19 REQ-RG-* proposals created via req:propose | PASS |
| IDs match sprint trace citations | PASS |
| Graph still validates | PASS |
| Nothing applied/canonical without sign-off | PASS (proposals only) |

### Gates
| Gate | Result |
|---|---|
| req:validate | PASS |
| typecheck / verify.sh / test | N/A — no source changed |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| **Sign off the 19 REQ-RG-* proposals** | §35b — canonical mutation requires PO sign-off | Reply "approved" → I run `req:apply-after-signoff` for all 19, update sprint trace status to canonical, then re-audit |

### Consumer updates required
- After sign-off + apply: update each sprint `## Requirement Trace` status from "proposed — pending" to canonical (IDs unchanged).

### Open issues / follow-ups
- AC-RG-* acceptance nodes remain sprint-local; created per-sprint during execution (not needed to clear blocker #1).
- After apply: re-run dcx-plan-audit → expect READY.
- index: run `bash scripts/build-log-index.sh`.
