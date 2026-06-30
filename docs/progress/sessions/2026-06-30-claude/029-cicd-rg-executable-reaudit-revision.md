## RG-PLAN — Revise for executable re-audit (NEEDS REVISION → fix blockers #2/#3 + advisories)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: user-request-planning
Status: Completed
PO-Action: pending

Intent: Address the Codex executable-reaudit (NEEDS REVISION, 3 blockers): fix the two mechanical blockers (#2 sprint-doctor path, #3 §35c close gates) and all 3 advisories; record blocker #1 (graph intake) as the remaining PO-gated item.
Trigger: PO message: "codex audit log is added with NEEDS REVISION: 3 blockers"

### Audit reviewed
`audit/2026-06-30-codex-executable-reaudit.md` — verdict NEEDS REVISION; Ready checklist 6/7 (structure accepted: executors, gates, fallbacks, carry-forward, RG-R8 bootstrap all ✅). Only "all blockers resolved" unchecked.

### Resolution
| Finding | Action | Status |
|---|---|---|
| Blocker #1 — traces cite non-canonical IDs | PO-gated requirement intake (OD-RG-07); `req:propose` → sign-off → apply. Not silently mutating the graph (§35b). Recorded as remaining activation precondition. | OPEN — PO-gated |
| Blocker #2 — bare `sprint-doctor.sh` (RG-R1..R8) | Replaced with `bash scripts/agent/sprint-doctor.sh ...` in all 10 sprints (verified: 0 bare refs) | ✅ Fixed |
| Blocker #3 — §35c close gates missing | Added `req:validate` + `req:reconcile --mode changed` + `req:completion-gate` (or `dcx-sprint-close`) to every sprint Close (verified: 10/10) | ✅ Fixed |
| Adv #1 — RG-R0a no-src proof weak | pre/post `shasum` manifest, git diff once git exists | ✅ Fixed |
| Adv #2 — RG-R7 dogfood path vague | dedicated fixtures `dogfood/source-probe.txt` + `dogfood/doc-probe.txt`, allowlisted in RG-R2 | ✅ Fixed |
| Adv #3 — OD-RG-02..09 open | §9.2 OD→consuming-sprint mapping + temporary defaults + PO gates (§14) | ✅ Fixed |

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | sprints/RG-R0a..R8.md (10 files) | Close sections: correct sprint-doctor path + §35c requirement gates | 10× ~4 |
| edited | sprints/RG-R0a.md | stronger no-src pre/post manifest gate (Adv#1) | 1 |
| edited | sprints/RG-R2.md | define dogfood source/doc fixtures + classifier allowlist (Adv#2) | 1 |
| edited | sprints/RG-R7.md | use the fixtures in dogfood A/B; AC + fallback (Adv#2) | 3 |
| edited | cicd-release-governance/README.md | §9.2 OD→sprint mapping (Adv#3); Executable-audit response section | 2 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — additive revision |
| Preserve-semantic (§9) | N/A — no source changed |
| Open decisions used (⏱) | OD-RG-02..09 each given a temporary default + consuming-sprint gate (§14); none silently decided |
| Verification | grep: 0 bare `sprint-doctor.sh`; 10/10 sprints have `req:completion-gate` + correct doctor path |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Blocker #2 fixed in all sprints | PASS (0 bare refs) |
| Blocker #3 wired in all sprints | PASS (10/10) |
| Advisories #1/#2/#3 addressed | PASS |
| Blocker #1 status recorded honestly (PO-gated, not faked) | PASS |
| No src/** changed | PASS — docs/planning only |

### Gates
| Gate | Result |
|---|---|
| typecheck / verify.sh / validate:architecture / test | N/A — docs/planning only |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Blocker #1 — requirement intake (OD-RG-07) | Only remaining blocker; canonical graph mutation needs PO sign-off (§35b) | Authorize intake; I can draft node payloads + run `req:propose`, you sign off, then `apply-after-signoff` and traces cite canonical IDs |
| Re-audit after intake | Confirm executable-READY | Re-run dcx-plan-audit; expect READY once traces are canonical |
| OD-RG-02..09 | Confirm temporary defaults | Review §9.2 mapping |

### Consumer updates required
- None.

### Open issues / follow-ups
- Blocker #1 is the sole remaining gate; everything else is resolved. Offered to execute the intake on PO go-ahead.
- index: run `bash scripts/build-log-index.sh`.
