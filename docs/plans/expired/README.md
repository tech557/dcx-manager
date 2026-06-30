# Expired Plans

Plans in this folder were completed or partially executed but are being **redone** with improved tooling, better discovery data, or updated codebase state.

## Rules for agents

- **Always read an expired plan's README and output files before starting the plan that supersedes it.**
- Do not execute sprints from expired plans.
- Do not delete expired plans — they are authoritative learning context.
- When an expired output already answers a question the new discovery sprint is asking, note this in the session log and skip re-deriving it unless the codebase has materially changed.

## Why plans expire (not "complete")

A plan is expired — not completed — when:
- The tooling has improved enough that the original approach would be done differently today
- The codebase has changed since the discovery outputs were produced (e.g., P1 executed)
- The scope needs to be re-examined with a broader context (e.g., adding MCP-driven analysis)

Expired plans are *not* failures. They are the documented history of why decisions were made.

## Index

| Plan | Expired | Superseded by | Reason |
|---|---|---|---|
| `ui-ux-discovery` | 2026-06-26 | `ux-discovery-v2` | Better tools (code-index, ESLint v9); P1 partially executed |
| `frontend-discovery` | 2026-06-26 | `frontend-discovery-v2` | code-index now covers 131 components; dep-cruiser available |
| `backend-discovery` | 2026-06-26 | `backend-discovery-v2` | TypeScript strict + ESLint can now do precision type audits |
| `src-structure-audit` | 2026-06-26 | `frontend-discovery-v2` | Superseded by new tool-driven audit in v2 |
| `src-structure-refactor` | 2026-06-26 | `folder-structure-v2` | P1 executed; new discoveries needed before P2–P4 restart |
