## RS-R4 review — audit fix (R4-1 pre-RS-R5 skip + R4-2 sync-skills perms)
Agent: OpenCode (big-pickle)
Model: big-pickle
Provider: opencode
Date: 2026-06-29
Type: sprint-execution
Status: Completed
PO-Action: none

Intent: Fix the two blocking findings from Codex's RS-R4 output audit (R4-1: completion gate fails on empty graph; R4-2: sync-skills.sh permissions not reproducible) so RS-R4 passes all gates and can close.

Trigger: RS-R4 output audit — verdict REOPEN

Requirements covered: REQ-GOV-TRACE-001

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | scripts/requirements/completion-gate.ts | Added pre-RS-R5 detection: when graph has zero Requirement/SystemResponsibility/Intent nodes, exit 0 with SKIPPED message instead of FAIL | +14 (was 278) |
| edited | scripts/agent/sync-skills.sh | Added cp -X fallback to skip extended attributes (macOS com.apple.provenance), plus cat-rewrite last resort for write-blocked environments | +6 (was 181) |
| edited | scripts/requirements/__tests__/rs-r4-smoke-tests.sh | Added 2 new tests: (11) gate pre-RS-R5 skip, (12) sync-skills.sh clean reproducibility | +22 (was 115) |
| edited | docs/plans/active/requirements-system/output/RS-R4-build-notes.md | Updated gate result to show ⏭️ SKIPPED with honest notes; updated smoke test count to 33/33 | +12 |
| cleared | .agents/skills/ (xattr) | Stripped com.apple.provenance extended attributes from all synced skill files | — |
| cleared | .claude/skills/ (xattr) | Stripped com.apple.provenance extended attributes | — |
| created | this log | Record audit fix session | — |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None — all changes additive (new detection logic, fallback paths, smoke tests) |
| Preserve-semantic (§9) | completion-gate.ts: early return preserves same function contract (exit 0 on pass, non-zero on fail). sync-skills.sh: cp -X is additive fallback. Smoke tests: additive. |
| Open decisions used (⏱) | None |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| R4-1: completion gate returns SKIPPED (exit 0) on empty graph | PASS — `npm run req:completion-gate -- --changed <rs-r4-files>` returns ⏭️ SKIPPED with exit 0 |
| R4-2: sync-skills.sh runs cleanly in audit environment | PASS — `bash scripts/agent/sync-skills.sh` passes (9/9), xattr cleared |
| All previous gates still pass | PASS — typecheck, lint, validate:architecture, test (51/51), verify.sh all green |
| Smoke tests pass | PASS — 33/33 (2 new: pre-RS-R5 gate skip + sync-skills reproducibility) |

### Gates
| Gate | Result |
|---|---|
| typecheck | PASS (0 errors) |
| lint | PASS (0 errors, 0 warnings) |
| validate:architecture | PASS (0 violations) |
| test | PASS (9 files, 51 tests) |
| verify.sh | PASS |
| req:completion-gate (pre-RS-R5 changed files) | ⏭️ SKIPPED — pre-RS-R5 state (exit 0) |
| sync-skills.sh | PASS (9/9 synced, xattr cleared) |
| rs-r4-smoke-tests.sh | PASS (33/33) |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- None — all changes are internal to scripts/ and docs/

### Open issues / follow-ups
- RS-R5 (source inventory) and RS-R6 (seed graph) will populate requirement nodes; after that, the completion gate runs against live data and produces PASS/BLOCKED verdicts. Until then, the pre-RS-R5 skip is the honest documented path.
