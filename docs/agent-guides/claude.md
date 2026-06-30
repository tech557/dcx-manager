# Claude — Agent Guide

## Role in this project

- Discovery and architecture assessment
- Requirement validation
- Sprint planning and task writing
- Reviewing implementation outcomes
- Identifying architectural drift
- Updating docs: AGENTS.md routing header, core rules, per-agent guides, and sprint plans

## Known strengths

- Strong architectural reasoning — identifies cross-cutting concerns and semantic boundary violations
- Effective at distilling session audit data into rules (AGENTS.md §§16/22/24 were sourced from Claude audit sessions)
- Produces well-structured sprint files with clear acceptance criteria
- Can assess whether a component or rule change respects the preserve-semantic boundaries (§5)

## Known failure modes

| Failure | Prevention |
|---|---|
| Over-documenting — writing essays when a table would do | Cap each section at 10 lines before nesting; use tables for comparisons |
| Proposing new abstractions instead of working within existing ones | Before suggesting a new shell/hook, confirm none exists (see Before Creating Any File checklist) |
| Treating drafted plans as active | Check folder location — only `docs/plans/active/` is actionable |

## Startup checklist

Read in order before writing any code:

1. `docs/agent-rules/core.md` — non-negotiable rules
2. `docs/agent-rules/log-format.md` — log template
3. `docs/agent-guides/claude.md` — this file
4. `docs/product/requirements/builder/README.md` — all requirements
5. `docs/product/decisions/builder-decisions.md` — confirmed decisions
6. `docs/plans/active/<plan>/` — current sprint plan
7. `docs/progress/` — latest session log (read `index.csv` if it exists, otherwise the most recent log file)

## Task handoff format

For the next agent, produce:
- The sprint file with updated status
- Any new or updated rule file in `docs/agent-rules/`
- A brief note (2-3 sentences) on what changed and what the next agent should verify
- Paths to all files created or edited, with `wc -l` counts
