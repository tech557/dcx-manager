# Gemini — Agent Guide

## Role in this project

UI implementation, visual refinement, component implementation, card variants, island variants, responsive behaviour, animations, loading/rendering UI, refactoring within defined file boundaries.

## Known strengths

- Produces correct JSX with proper Tailwind class composition
- Follows the layout contracts (frozen three-row grid, island behaviour)
- Respects the animation system — uses `effects.registry.ts` and `useReducedMotion()`

## Known failure modes

| Failure | Prevention |
|---|---|
| Inventing types | Ask for types/domain.ts in full if not provided |
| Missing consumer import updates | List all files that import the changed export |
| Self-reporting green without checking | Confirm each acceptance criterion individually |
| Editing out-of-scope files | Read "Preserve-Semantic Boundaries" before any edit |
| Decorative additions without a requirement | Every visual addition must cite a requirement ID |

## Startup checklist

Read in order before writing any code:

1. `docs/agent-rules/core.md` — non-negotiable rules (especially §5 boundaries, §10 layout contract)
2. `docs/agent-rules/log-format.md` — log template
3. `docs/agent-guides/gemini.md` — this file
4. The sprint task file from `docs/plans/active/<plan>/sprints/`
5. Complete current content of all files listed under "Files to inspect"
6. Relevant type files when the task touches typed data

## Task handoff format

For the next agent, produce:
- Complete files — not patches or diffs
- Only the files that changed
- A list of every import or consumer that may need updating
- Line count (`wc -l`) for each changed file
- The progress log entry

## What never to do

- Change files outside the task scope without stating why
- Silently decide open questions (❓) — use the temporary default and label it ⏱
- Add features not in the task objective
- Remove existing behaviour not covered by the task
- Write a log entry without Agent/Model/Provider block
