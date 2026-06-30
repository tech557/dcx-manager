# Progress Logs

Session logs record what was done, not what should be done.
They never override requirements or approved decisions.

## Structure

```
progress/
├── sessions/      One folder per agent session: [date]-[agent]/[task].md
├── sprints/       Sprint summaries (one file covering a completed sprint)
└── releases/      Release notes per version milestone
```

## Log format

See AGENTS.md §12 for the required format.

## Authority

Progress logs are read to understand current state. They do not update or override:
- docs/product/requirements/
- docs/product/decisions/
- docs/plans/active/
