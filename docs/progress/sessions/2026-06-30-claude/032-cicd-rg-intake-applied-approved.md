## RG-PLAN — Apply + finalize 19 REQ-RG requirements (PO-approved); blocker #1 closed
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: user-request-planning
Status: Completed
PO-Action: none

Intent: On PO sign-off ("i approve them all"), apply the 19 REQ-RG proposals to canonical truth, finalize them to approved/PO-locked, flip all sprint traces to approved, and update the plan to reflect blocker #1 closed.
Trigger: PO message: "i approve them all"

### Actions
1. `req:apply-after-signoff` (signoff `PO-2026-06-30-RG-INTAKE-SIGNOFF`) for all 19 PRP-* → 19 canonical nodes + 19 ledger entries. Applied: 19, failed: 0.
2. Finalize: apply wrote payload as-is (governance still "proposed"); since sign-off is recorded in the ledger, finalized the 19 canonical nodes to `governance: approved`, `confirmation_status: po-decided`, `confidence: 1`, `lock_owner: PO`, `lock_date: 2026-06-30`, `ledger_ref: LDG-2026-06-30-create-node-<ID>`. (Avoided re-propose because the deterministic proposal/ledger IDs would collide.)
3. `req:validate` → pass=true, 0 errors, 0 warnings.
4. Flipped all 10 sprint `## Requirement Trace` statuses: `proposed — graph intake pending` → `approved — canonical graph nodes, PO-locked`.
5. README: closed OD-RG-07; updated banner, §7 grounding, §8 matrix header, audit-response blocker #1 → ✅, Next step.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/product/requirements/graph/nodes/requirement/REQ-RG-*.json (×19) | canonical approved requirement nodes (via apply-after-signoff) | 19 files |
| edited | (same 19 nodes) | finalized to approved/PO-locked + ledger_ref | 19 |
| appended | docs/product/requirements/graph/ledger/decision-ledger.jsonl | 19 sign-off entries | 19 |
| edited | sprints/RG-R0a..R8.md (10) | trace Status → approved | 10 |
| edited | cicd-release-governance/README.md | OD-RG-07 closed; blocker #1 ✅; banner/§7/§8/audit-response/Next-step | ~6 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | Graph mutated via sanctioned propose→signoff→apply path + ledger (§35b honored) |
| Open decisions used (⏱) | OD-RG-07 closed by PO sign-off; none silently decided |
| req:validate | pass=true, 0 errors, 0 warnings |
| Status: proposed remaining in sprints | 0 |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| 19 proposals applied to canonical graph | PASS (19/19) |
| Nodes approved + PO-locked + ledger-referenced | PASS |
| Graph validates | PASS |
| All sprint traces cite canonical IDs, Status approved | PASS (0 proposed) |
| README reflects blocker #1 closed | PASS |

### Gates
| Gate | Result |
|---|---|
| req:validate | PASS |
| typecheck / verify.sh / test | N/A — no source changed |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None blocking | All 3 executable-audit blockers resolved; decisions locked; intake done | Hand to Codex for confirming re-audit → on READY, activate |

### Consumer updates required
- None.

### Open issues / follow-ups
- Confirming re-audit expected READY. Execution step 0 = git init (RG-R0b) when PO activates.
- index: run `bash scripts/build-log-index.sh`.
