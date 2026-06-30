## SKILL-001 — Agent Skills System: Portable Skills, Deterministic Scripts, Current-State Generator
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-26
Status: Completed

Intent: Create a governed, portable agent skills system that reduces token usage, prevents repeated context loading, replaces agent natural-language reasoning with deterministic scripts, and prevents false completion claims.
Trigger: User request: "create a governed, portable Agent Skills system for DCX Manager"
Requirements covered: N/A (tooling task)

Files created:
  agent-skills/dcx-sprint-planner/SKILL.md        — Canonical sprint planning skill (113 lines)
  agent-skills/dcx-frontend-refactor/SKILL.md     — Canonical refactor governance skill (118 lines)
  agent-skills/dcx-frontend-verify/SKILL.md       — Canonical proportional verification skill (112 lines)
  agent-skills/dcx-sprint-close/SKILL.md          — Canonical sprint-close deterministic check (131 lines)
  agent-skills/dcx-code-query/SKILL.md            — Canonical focused code-query skill (104 lines)
  .claude/skills/dcx-sprint-planner.md            — Claude adapter (synced)
  .claude/skills/dcx-frontend-refactor.md         — Claude adapter (synced)
  .claude/skills/dcx-frontend-verify.md           — Claude adapter (synced)
  .claude/skills/dcx-sprint-close.md              — Claude adapter (synced)
  .claude/skills/dcx-code-query.md                — Claude adapter (synced)
  .agents/skills/dcx-sprint-planner.md            — Portable adapter (synced)
  .agents/skills/dcx-frontend-refactor.md         — Portable adapter (synced)
  .agents/skills/dcx-frontend-verify.md           — Portable adapter (synced)
  .agents/skills/dcx-sprint-close.md              — Portable adapter (synced)
  .agents/skills/dcx-code-query.md                — Portable adapter (synced)
  scripts/agent/code-query.sh                     — Focused component/label/token queries against code-index (executable)
  scripts/agent/verify-plan-state.sh              — Plan folder/frontmatter/status consistency check
  scripts/agent/verify-version-state.sh           — VERSION.md vs package.json vs metadata.json
  scripts/agent/verify-log-claims.sh              — Claimed files exist/absent, scripts exist
  scripts/agent/verify-tooling-state.sh           — All tool/MCP/index status
  scripts/agent/verify-frontend.sh                — Run all frontend gates, return JSON
  scripts/agent/build-current-state.sh            — Generate docs/generated/CURRENT_STATE.json
  scripts/agent/sync-skills.sh                    — Sync canonical → adapters
  docs/generated/CURRENT_STATE.json               — Non-authoritative state snapshot (generated)
  docs/agent-skills.md                            — Full documentation: architecture, scripts, policies

Files edited:
  AGENTS.md         — Added: skills routing table, integrity/completion rules, "do not manually reproduce a workflow" rule
  CLAUDE.md         — Rewritten as thin adapter: bootstrap order, skill table, MCP table, hooks, integrity rules
  .claude/settings.json — Added hook: warn when editing completed/ plan files

Files deleted: None

Churn — work reversed: None

Preserve-semantic check:
  No application code changed. All §9 boundaries intact. New scripts only read repo files.
  .claude/settings.json hook addition is additive, not replacing existing hook.

Open decisions used: None

Acceptance criteria:
  ✓ 5 canonical SKILL.md files created in agent-skills/
  ✓ .claude/skills/ adapters synced (Claude-specific MCP context added)
  ✓ .agents/skills/ adapters synced (portable content)
  ✓ sync-skills.sh works and propagates improvements
  ✓ All 7 deterministic scripts created and tested
  ✓ code-query.sh: all subcommands working (component, consumers, imports, labels, hardcoded-tokens, duplicate-controls, affected, unresolved)
  ✓ verify-plan-state.sh: detects 5 real pre-existing plan-state mismatches (correct)
  ✓ verify-version-state.sh: detects VERSION.md vs metadata.json mismatch (correct)
  ✓ verify-log-claims.sh: verified against actual log — PASS
  ✓ verify-tooling-state.sh: reports all tool statuses correctly
  ✓ verify-frontend.sh: runs all gates, reports JSON; lint FAIL (pre-existing, documented)
  ✓ build-current-state.sh: generates valid CURRENT_STATE.json
  ✓ Skill Creator used for format guidance and evaluation
  ✓ 5 test prompts evaluated; improvements applied based on findings
  ✓ AGENTS.md updated with skills routing, integrity rules, token-efficiency rules
  ✓ CLAUDE.md updated as thin Claude-specific adapter
  ✓ docs/agent-skills.md documentation created

Gates:
  typecheck:              PASS — 0 errors
  verify.sh:             PASS — no forbidden patterns
  validate:architecture: PASS — 0 violations (265 modules, 550 deps)
  test:                  PASS — 27/27
  build:                 PASS — 2.36s
  lint:                  FAIL — 151 pre-existing errors (tracked in LINT-FIX chip, unrelated to this session)
  browser:               N/A — no application code changed

Consumer updates required:
  All agents should now use skills instead of manually re-reading large instruction files.
  Specifically: before any sprint close, run dcx-sprint-close (or scripts/agent/verify-frontend.sh).
  Before any component creation, run dcx-code-query first.

Repository contradictions discovered:
  1. 5 plans in completed/ have README files claiming status=active, drafted, or "column" — not "completed".
     These are pre-existing. Fix with explicit corrections in a documentation sprint.
  2. docs/VERSION.md=v0.3.2 vs metadata.json=v0.3.3 — minor version drift.
  3. 151 pre-existing ESLint lint errors prevent verify:frontend from passing fully (LINT-FIX sprint).

Recommended next task:
  1. LINT-FIX sprint: fix 151 pre-existing ESLint errors so lint gate passes.
  2. PLAN-DOCS-FIX: Update 5 completed/ plan READMEs to say status=completed to resolve
     plan-state contradictions detected by verify-plan-state.sh.
  3. STORYBOOK-SETUP: Install Storybook to activate dcx-frontend-refactor's component discovery.
