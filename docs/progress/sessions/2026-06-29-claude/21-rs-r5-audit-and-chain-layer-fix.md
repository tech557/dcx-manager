## RS-R5 — Audit + fix the chain_layer blocker (took over from OpenCode)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: mixed
Status: Completed
PO-Action: none

Intent: Audit final RS-R5 output and fix the blocker that survived 5 OpenCode re-audits, so RS-R6 can proceed.
Trigger: PO request — "audit final R5 output ... I'm tired of opencode".
Requirements covered: RS-R5 acceptance (every source item itemized + provisional chain layer); core.md §36c.

### Audit finding
OpenCode's `RS-R5-itemized-dataset.csv` already had 217 per-item rows (the reaudit-2 itemization blocker was fixed). The **persistent** blocker (Codex reaudit-4 + reaudit-5, both REOPEN) was: `chain_layer` was **uniformly `REQ->RSP` for every row**, and RS-R6 consumes that file directly. 5 rounds did not fix it.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | scripts/requirements/itemize-source-csv.py | Generator: per-FAMILY chain_layer + INT/QST for deferred/needs-decision; writes the R6-consumed path | 95 |
| edited | docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv | Regenerated: 217 rows, chain_layer now varies (96/26/91 + 3 INT + 1 QST) | 218 |
| edited | docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.md | Added Requirement Trace + generator note | +20 |
| deleted | docs/plans/active/requirements-system/output/RS-R5-itemized.csv | redundant duplicate I created before noticing OpenCode's file (§7 — don't create parallels) |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | Removed my own redundant RS-R5-itemized.csv (created then deleted same session). |
| Preserve-semantic (§9) | N/A — no product `src/` change; generated dataset + generator only. |
| Open decisions used (⏱) | chain_layer is provisional; final governance set at RS-R6 sign-off. |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Every source item itemized one-per-row | ✅ 217 rows == 217 CSV data rows (computed) |
| Provisional chain classification per item | ✅ per-family chain_layer (no longer uniform) |
| Reproducible / deterministic | ✅ `itemize-source-csv.py` prints match=True |
| sprint-doctor verdict | ✅ READY (gates pass, portability clean) |

### Gates
| Gate | Result |
|---|---|
| sprint-doctor RS-R5 | ✅ READY (3 warnings eyeballed) |
| typecheck / lint / test / validate:architecture / verify.sh | ✅ all PASS (51/51) |
| itemize-source-csv.py | ✅ 217==217, chain dist 96/26/91/3/1 |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | Blocker fixed; remaining open items (hardening, settings.json hook path) already tracked in logs 19/20 | — |

### Consumer updates required
- RS-R6 seeds from `RS-R5-itemized-dataset.csv` (now correct chain_layer) row by row.

### Open issues / follow-ups
- Minor: `RS-R5-reconciliation.md` session-log count (64) is audit-time drift vs OpenCode log (63) — non-blocking; refresh on final close if desired.
- Recommend ONE final confirm (Codex or PO) now that the chain_layer blocker is resolved.
- Lesson logged: I created a duplicate file before checking for OpenCode's — exactly the §7 trap; sprint-doctor should arguably also scan for the claimed companion file.
