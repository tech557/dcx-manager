## RG-PLAN — Path 2 revision: fix Codex-audit defects, relabel as architecture brief
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: user-request-planning
Status: Completed
PO-Action: pending

Intent: Apply the PO's chosen Path 2 — fix the objective defects from Codex's NOT READY audit (#2 grounding precondition, #3 version-format contradiction, #5 RG-R0 audit/setup conflation) plus the 3 advisories, and relabel the plan as an architecture brief (not requesting READY activation) — so Codex can re-audit it as a brief.
Trigger: PO request: "i will take your recommendation in G1,G2,G3. And take path two after u finish, will get codex to reaudit"
Requirements covered: N/A — planning doc; proposed REQ-RG-* remain non-canonical (intake is now stated as a precondition to Path 1, per Codex blocker #2 / core.md §35a).

### PO decisions recorded
| Gate | Decision |
|---|---|
| G1 | Lock architecture now; defer the build until after the active polish plan |
| G2 | PO owns git/GitHub init+connect before RG-R3 (RG-R0b) |
| G3 | Path 2 — keep as architecture brief; fix objective defects only |
| OD-RG-01..09 | NOT yet decided — remain open for a later pass |

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | docs/plans/drafted/cicd-release-governance/README.md | Relabelled to ARCHITECTURE BRIEF + scope banner + Path-1 preconditions; fixed #3 (`v0.4.0.0.0`→`v0.4.0.0`); split RG-R0 into R0a (agent discovery) / R0b (PO setup) for #5; reworded Vercel-MCP overclaim (adv #1); split registry writer into append-only + views (adv #2); stated graph intake as a Path-1 precondition (#2) | ~25 edits |
| edited | docs/plans/drafted/README.md | Index version `v0.4.0.0.0`→`v0.4.0.0` | 1 |

### Codex audit findings — disposition
| Finding | Path-2 action |
|---|---|
| B#1 no sprint files | Accepted by design — relabelled brief; "do not request READY in brief form" |
| B#2 requirement grounding missing | Stated as a precondition to Path 1 (req:propose + sign-off) in the scope banner |
| B#3 version format contradiction | **Fixed** — `v0.4.0.0` (4 segments) everywhere |
| B#4 no carry-forward contract | Accepted by design (only exists if promoted to Path 1) — noted in banner |
| B#5 RG-R0 mixes audit + PO setup | **Fixed** — split into RG-R0a (agent) / RG-R0b (PO-owned) |
| B#6 per-sprint gates/executors/fallbacks | Accepted by design (Path 1 only) — noted in banner |
| Adv#1 Vercel MCP overclaim | **Fixed** — reworded to "verify in RG-R4" |
| Adv#2 registry append/refresh ambiguity | **Fixed** — append-only writer + separate views; corrections = superseding row |
| Adv#3 Vercel pattern-A capability unproven | Already a §9 risk + RG-R4 verification note; left as-is |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — same draft revised; no source/log/other plan altered |
| Preserve-semantic (§9) | N/A — no source changed |
| Open decisions used (⏱) | OD-RG-01..09 left open (not silently decided); only G1/G2/G3 recorded per PO |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Apply G1/G2/G3 decisions | PASS |
| Fix objective defects #3, #5 | PASS |
| Address advisories #1, #2 | PASS |
| Relabel as architecture brief, not READY activation | PASS |
| No 5-segment version strings remain | PASS (grep: 0) |

### Gates
| Gate | Result |
|---|---|
| typecheck | N/A — docs only |
| verify.sh | N/A — docs only |
| validate:architecture | N/A — docs only |
| test | N/A — docs only |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Re-audit by Codex (as a brief) | PO stated intent to get Codex to re-audit | Run dcx-plan-audit judging architecture, not execution-readiness |
| OD-RG-01..09 still open | Needed before any Path-1 promotion | Decide when/if promoting to an executable plan |
| `no .git` blocker (G2) | PO-owned; gates RG-R3 | Init/connect git+GitHub when ready |

### Consumer updates required
- None.

### Open issues / follow-ups
- If PO later chooses Path 1: intake REQ-RG-*/GOV-RG-* via req:propose, write RG-R0..R7 sprint files + carry-forward contract + per-sprint gates.
- index: run `bash scripts/build-log-index.sh`.
