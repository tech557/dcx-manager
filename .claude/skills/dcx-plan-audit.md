---
name: dcx-plan-audit
description: Audit a DCX Manager plan file and produce structured feedback in the format the System Architect (Claude) needs to act on it. Use this skill whenever an agent is asked to "audit a plan", "review a plan before we activate it", "check if this plan is ready", "give feedback on this sprint", "second opinion on this plan", or when a plan is about to be moved from drafted/ to active/. Trigger proactively when a plan references prior art you have not confirmed was read, or when a sprint has acceptance criteria that cannot be verified by running a script. The output is a decision-quality audit report — not notes, not opinions, not summaries. Think: a senior engineer writing structured code review comments on an architecture doc that will be handed to a junior engineer to execute.
---

<!-- Claude adapter — canonical source: agent-skills/dcx-plan-audit/SKILL.md -->
<!-- This file adds Claude-specific MCP and hook context. -->
<!-- To update this skill, edit agent-skills/dcx-plan-audit/SKILL.md and run: bash scripts/agent/sync-skills.sh -->


## What NOT to audit

Do not flag:
- Stylistic preferences (how the plan is phrased)
- Disagreements with architectural decisions already documented in expired plans
  or `docs/product/decisions/`
- Issues outside the plan's stated scope
- The fact that a plan doesn't have tests yet (discovery sprints explicitly don't change code)

If you find yourself writing "I would have approached this differently", stop.
That's not an audit finding — it's an opinion. An audit finding names a specific
file, a specific command, and a specific failure mode.

---
## Claude-specific additions

### MCP tools available
- **playwright** (global) — use for browser-verifiable acceptance criteria
- **chrome-devtools** (global) — use for runtime/console/network inspection
- **context7** (global) — use before writing code that depends on a versioned library
- **eslint** (.mcp.json) — use for interactive lint rule explanation and repair
- Storybook / Semgrep / SonarQube / Shadcn — see .mcp.json (disabled; setup required)

### Deferred tool loading
Use ToolSearch to load MCP tool schemas only when needed. Do not load all tools eagerly.
