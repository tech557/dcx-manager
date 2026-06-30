# Agent Execution Guide

All sprint tasks in `sprints/` use a single format executable by any agent. Tasks are not agent-specific. The task is always the same. Only the execution method differs.

## Task format

Every task contains:
- Objective
- Requirements and IDs
- Files to inspect (read first)
- Files likely to change
- Required behaviour
- State and data implications
- Preserve-semantic boundaries
- Acceptance criteria
- Tests and manual validation
- Rollback boundary
- Progress-log requirement
- Agent Execution Notes (separate instructions per terminal access level)

## For an agent WITH terminal access (Codex, Claude Code)

1. Read this file and `AGENTS.md` at the project root
2. Read the sprint task file in full
3. Read all files listed under "Files to inspect"
4. Implement the changes
5. Run: `npm run typecheck` — must pass with 0 errors
6. Run: `npm test` if the task includes test requirements
7. Check that no files outside the scope were changed
8. Write the progress log entry
9. Confirm every acceptance criterion

## For an agent WITHOUT terminal access (Gemini AI Studio)

1. Read the sprint task file in full
2. Ask for the contents of all files listed under "Files to inspect" if not provided
3. Implement the changes
4. Return complete file contents (not patches) for every file changed
5. Return a list of every import/consumer that may need updating
6. Provide a manual validation checklist the product owner can run
7. Write the progress log entry
8. State what the product owner must verify in a browser

## What every agent must never do

- Change files outside the sprint task scope without stating why
- Silently decide open questions (❓) — use the temporary default and label it ⏱
- Remove existing behaviour not covered by the task
- Add features not listed in the task objective
- Write a log entry without the Agent/Model/Provider block

## Progress log requirement

Every sprint task must produce a log entry in:
`docs/progress/sessions/[date]-[agent]/[sprint-id]-[task-name].md`

Format is defined in `AGENTS.md` §Log Format.
