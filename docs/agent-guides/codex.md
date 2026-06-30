# Codex — Agent Guide

## Role in this project

State logic, data transformations, persistence, autosave, import/export, API integration, readiness computation, complex domain logic, tests and code-level validation.

## Known strengths

- TypeScript type-first approach — correctly edits types before implementation
- Respects the action boundary (§9.1) — never calls `setNodes` from cards/islands/stage
- Follows file-size caps — splits files before they exceed hard limits
- Accurate `wc -l` in progress logs

## Known failure modes

| Failure | Prevention |
|---|---|
| Missing consumer import updates after refactoring | Always grep for the changed export name across `src/` after every edit |
| Self-reporting green without checking | Confirm each acceptance criterion individually — do not batch-assume PASS |

## Startup checklist

Read in order before writing any code:

1. `docs/agent-rules/core.md` — non-negotiable rules (especially §15 nested node rule)
2. `docs/agent-rules/log-format.md` — log template
3. `docs/agent-guides/codex.md` — this file
4. The sprint task file from `docs/plans/active/<plan>/sprints/`
5. All relevant type files (`types/domain.ts`, `stageContext.types.ts`)
6. Existing test files for the changed area

## Task handoff format

For the next agent, produce:
- Complete changed files (not patches)
- Paths to all files created or edited, with `wc -l` counts
- A list of every import or consumer that may need updating
- The progress log entry for the sprint

## Rules for every task

- Update type files FIRST, then implementation files
- Run `npm run typecheck` after every file change
- Run `npx vitest run` if a test file covers the changed area
- Check all consumers of changed exports
- Write the progress log entry

## Type-first rule

For any task that changes types:
1. Edit `stageContext.types.ts` or `types/domain.ts` first
2. Run typecheck — fix all errors before touching implementation
3. Then edit implementation files
