## P6 — Step 6 Agent And Doc Coherence
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-28
Status: Completed

Intent: Make quarantined skill status and open follow-ups durable outside the active plan archive.
Trigger: P6 Step 6.
Requirements covered: P6 Step 6.

Files created: docs/product/follow-ups/builder-follow-ups.md - durable follow-up register (20 lines); docs/progress/sessions/2026-06-28-codex/27-P6-task6-agent-doc-coherence.md - task log (39 lines before count patch)
Files edited: AGENTS.md - added `impeccable` quarantined skill row (246 lines); CLAUDE.md - added `impeccable` quarantined skill row (90 lines); docs/plans/active/folder-structure-v2/output/P6-closeout-coherence.md - Step 6 evidence added (392 lines); docs/plans/active/folder-structure-v2/sprints/P6-closeout-coherence.md - Step 6 marked complete (196 lines)
Files deleted: None

Churn - work reversed:
  None.

Preserve-semantic check:
  PASS - Documentation-only update. No source behavior changed.

Open decisions used:
  `docs/agent-skills.md` already defines `impeccable` as quarantined and not ready for invocation.

Acceptance criteria:
  PASS - `impeccable` listed in AGENTS.md as quarantined.
  PASS - `impeccable` listed in CLAUDE.md as quarantined.
  PASS - Durable follow-up register exists outside the active plan folder.
  PASS - Follow-up register captures typed-any cleanup, production API switch, day-note storage policy, metadata version sync, P1b color-token decision, quality-gates ID, MCP setup, Semgrep CLI, log-index wording, sync-skills adapter drift, and test expansion.
  PASS - Test count documented as 27 tests across 6 files.

Gates:
  PASS - Manual doc inspection and targeted text search.

Consumer updates required:
  Future FE/BE final plans should start with `docs/product/follow-ups/builder-follow-ups.md` plus `docs/product/decisions/src-structure-decision.md`.

Open issues / follow-ups:
  Follow-ups remain open by design; Step 6 only moved them into a durable home.
