## sprint-doctor — Pre-handoff gate + portability rule to stop re-audit churn
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: process-governance
Status: Completed
PO-Action: pending

Intent: Build a pre-handoff "sprint doctor" gate + a tooling-portability rule so sprints converge in one audit pass instead of 3–4 (root-cause fix for the RS-R3/R4/R5 churn).
Trigger: PO request — investigate the re-audit churn and "what to do"; PO chose option (b) build the gate + rule.
Requirements covered: process-governance (core.md §36, new); does not touch RS-R5 (left for Codex).

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | scripts/agent/sprint-doctor.sh | One-shot pre-handoff readiness gate (close-out + log+index + carry-forward + portability + determinism + gates) | 110 |
| edited | docs/agent-rules/core.md | New §36 (sprint-doctor mandate + portability + "every item" + executor-matching) | 829 (was 784) |
| edited | agent-skills/dcx-sprint-close/SKILL.md | New Step 0b — run sprint-doctor first | +13 |
| edited | .claude/skills/dcx-sprint-close.md + .agents/skills/dcx-sprint-close.md | synced via sync-skills.sh | (generated) |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — additive governance + new script. |
| Preserve-semantic (§9) | N/A — no product `src/` change. |
| Self-dogfood | ✅ doctor found 2 bugs in itself (self-match on `/Users/` pattern; loose log match) — both fixed. |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Pre-handoff gate exists + works | ✅ `sprint-doctor.sh` runs; verdict + exit code |
| Catches what auditors REOPEN on | ✅ on RS-R4: flags `.claude/settings.json` hardcoded path (the R4 finding); gates all pass |
| Portability rule in core.md | ✅ §36b |
| Wired into close workflow | ✅ dcx-sprint-close Step 0b; synced to both agent dirs |

### Gates
| Gate | Result |
|---|---|
| sprint-doctor self-run (RS-R4) | ✅ runs; typecheck/lint/test/architecture/verify all PASS inside it |
| sync-skills.sh | ✅ 9/9 synced |
| typecheck / lint / test | ✅ unchanged green (51/51) |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| `.claude/settings.json` PostToolUse hook uses a hardcoded absolute path | Now flagged by §36b/sprint-doctor; breaks the hook for any other checkout/agent. It is local hook config, so I did not edit it | Have OpenCode (or you) change it to a `$CLAUDE_PROJECT_DIR`/relative path |

### Consumer updates required
- Executors must run `bash scripts/agent/sprint-doctor.sh <plan> <sprint> <agent>` before handoff (core.md §36a); dcx-sprint-close enforces it.

### Open issues / follow-ups
- R5 left untouched for Codex audit (per PO). When R5 closes, RS-R6+ executors should run the doctor first.
- Carried-over hardening (F-R2-1/F-R3-2 validate-before-write) still needs an owner before RS-R6 writes real nodes.
