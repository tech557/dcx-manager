## DR-1 — AGENTS.md Modularization
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Break monolithic AGENTS.md (501 lines) into routing header + extracted rule files + updated agent guides
Trigger: PO request after BUG-STAGE completion
Requirements covered: None (doc-only sprint)

Files created:
  docs/agent-rules/core.md              — extracted non-negotiable rules (393 lines)
  docs/agent-rules/log-format.md        — extracted identity block + log template (71 lines)
  docs/plans/active/docs-refactor/sprints/DR-1.md  — sprint file with acceptance criteria (108 lines)

Files edited:
  AGENTS.md                             — slimmed from 501→67 lines routing header
  docs/agent-guides/claude.md           — added strengths, failure modes, startup checklist, task handoff (45 lines, was 25)
  docs/agent-guides/codex.md            — added strengths, failure modes, startup checklist, task handoff (53 lines, was 32)
  docs/agent-guides/gemini.md           — reformatted to add strengths, startup checklist, task handoff (49 lines, was 47)
  docs/agent-guides/opencode.md         — reorganized with new sections, updated sprint status table (110 lines, was 113)
  docs/agent-guides/README.md           — added opencode to table; added links to agent-rules/ (14 lines, was 9)
  docs/plans/active/docs-refactor/README.md  — changed status drafted→active (193 lines, unchanged)

Files deleted: none

Churn — work reversed:
  None. This is a doc-only extraction sprint with no code changes.

Preserve-semantic check:
  No source code touched. AGENTS.md now routes to core.md, log-format.md, and per-agent guides. All rules preserved verbatim.

Open decisions used:
  None.

Acceptance criteria:
  □ AC1: core.md exists with §§1-26 (minus §0, §12) preserved — PASS (393 lines)
  □ AC2: log-format.md exists with §0 + §12 — PASS (71 lines)
  □ AC3: AGENTS.md ≤ 85 lines — PASS (67 lines)
  □ AC4: All 4 agent guides have strengths/failure-modes/startup-checklist/task-handoff — PASS
  □ AC5: agent-guides/README.md includes opencode — PASS
  □ AC6: No src/ changed — PASS
  □ AC7: No file exceeds size cap (core.md 393 ≤ 400, log-format.md 71 ≤ 200) — PASS
  □ AC8: AGENTS.md routing header accurately describes where rules live — PASS

Gates:
  typecheck: PASS (0 errors)
  dev: N/A (no source changes)
  verify.sh: PASS
  browser manual check: N/A (no UI changes)

Consumer updates required:
  All existing references from `docs/progress/` logs to AGENTS.md §§ remain valid — the same content now lives in `docs/agent-rules/core.md` under the same section numbers. No broken internal links.

Open issues / follow-ups:
  - DR-2 (Version Awareness) is next in the execution order per the plan README, but PO may override
  - Existing progress log files in `docs/progress/sessions/2026-06-25-opencode/` lack indexed filenames (pre-v0.2.18); future logs must use `NNN-` prefix
