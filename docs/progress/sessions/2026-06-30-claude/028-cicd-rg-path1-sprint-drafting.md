## RG-PLAN — Path 1 conversion: draft RG sprint files for final approval
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-30
Type: user-request-planning
Status: Completed
PO-Action: pending

Intent: Check the Codex re-audit and, since the architecture passed (READY as Path 2), convert the brief to a Path 1 executable plan — add a carry-forward contract + sprint files RG-R0a..RG-R8 for final-approval audit.
Trigger: PO request: "ok now check the re-audit and when ready start drafting the sprints for final approval"

### Re-audit findings reviewed (4 audit files)
| File | Verdict | Note |
|---|---|---|
| audit/2026-06-30-codex.md | NOT READY (6) | original |
| audit/2026-06-30-codex-reaudit.md | **READY (Path 2 architecture)** | 0 blocking, 3 wording advisories — architecture approved |
| audit/2026-06-30-codex-final-reaudit.md | NOT READY (executable) | only blocker = no sprint files |
| audit/2026-06-30-codex-final-reaudit-2.md | NOT READY (executable) | same; + PO git approval + first-production bootstrap advisories |

Conclusion: architecture is approved; the only path to executable-READY is to write the sprint files → did so.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | sprints/RG-R0a.md | Discovery & capability report (audit-only) | 64 |
| created | sprints/RG-R0b.md | Repo + integration setup (PO-owned; D-RG-GIT boundary) | 73 |
| created | sprints/RG-R1.md | Versioning model + rule changes (docs) | 66 |
| created | sprints/RG-R2.md | Release registry + scripts | 71 |
| created | sprints/RG-R3.md | GitHub CI wiring | 66 |
| created | sprints/RG-R4.md | Vercel preview/promote (exact-build) | 73 |
| created | sprints/RG-R5.md | Supabase env separation | 62 |
| created | sprints/RG-R6.md | ClickUp board + GAS sink | 64 |
| created | sprints/RG-R7.md | Concurrency enforcement + dogfood | 68 |
| created | sprints/RG-R8.md | First-production bootstrap (one-time) | 72 |
| edited | cicd-release-governance/README.md | Path 1 conversion: frontmatter/banner; Decisions table (D-RG-PATH/GIT/VER); Carry-forward contract (§27); §7 sprint table w/ executors + RG-R8 + script-name alignment; Next-step reworded; advisory fixes | ~6 edits |
| edited | docs/plans/drafted/README.md | Index row → Path 1, sprints present, exec order | 1 |

### How each audit finding was addressed
| Finding | Resolution |
|---|---|
| final-reaudit-2 B#1 no sprint files | **Fixed** — RG-R0a..R8 written |
| B#2 still classified as brief | **Fixed** — README now Path 1 executable plan |
| B#3 Requirement Trace cannot be audited | **Fixed** — every sprint has `## Requirement Trace` citing REQ-RG-* with "proposed — intake pending (OD-RG-07)" temporary-trace policy (§35b honored: no silent graph mutation) |
| B#4 no carry-forward / gates / executors / fallbacks | **Fixed** — README carry-forward contract; each sprint has Step 0, executor, allowed writes, exact commands, gates, fallbacks, sprint-doctor close |
| reaudit-2 Adv#1 git boundary | **Recorded** — Decision D-RG-GIT (git/GitHub setup allowed; no src/** until implementation) |
| reaudit-2 Adv#2 first-production bootstrap | **Added** — dedicated RG-R8 one-time bootstrap |
| reaudit#1 Adv#1 next-step wording | **Fixed** — reworded to architecture-READY → Path 1 → executable audit → activate |
| reaudit#1 Adv#2 script-name mismatch §6/§7 | **Fixed** — §7 now uses classify-change/append-release-row/build-release-views/validate-release-registry |
| reaudit#1 Adv#3 "start immediately" qualifier | **Fixed** — qualified to "after PO activates, without touching src/**" |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — additive conversion; no source/other plan altered |
| Preserve-semantic (§9) | N/A — no source changed |
| Open decisions used (⏱) | OD-RG-02..09 remain open (defaults shown); OD-RG-01 decided; D-RG-GIT recorded from PO |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Check the re-audit; report verdict accurately | PASS (architecture READY; executable NOT READY for missing sprints) |
| Draft sprint files for final approval | PASS — 10 files RG-R0a..R8 |
| Each sprint: Requirement Trace, Step 0, gates, fallbacks, carry-forward close | PASS |
| Carry-forward contract in README (§27) | PASS |
| Record git boundary + first-production bootstrap | PASS (D-RG-GIT, RG-R8) |
| No src/** changed | PASS — docs/planning only |

### Gates
| Gate | Result |
|---|---|
| typecheck / verify.sh / validate:architecture / test | N/A — docs/planning only |
| browser manual check | N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Final-approval (executable) audit | Path 1 sprints now exist; needs an executable-plan audit | Run dcx-plan-audit → `audit/2026-06-30-<auditor>-executable.md` |
| Requirement intake (OD-RG-07) | Activation precondition; traces are "proposed" | `req:propose` REQ-RG-*/GOV-RG-* + PO sign-off |
| OD-RG-02..09 | Needed before/within relevant sprints | Confirm defaults |
| Activation | Plan stays in drafted/ until moved | On executable READY + intake → move to active/ |

### Consumer updates required
- None.

### Open issues / follow-ups
- output/ folder is created at execution time per sprint (not pre-created).
- index: run `bash scripts/build-log-index.sh`.
