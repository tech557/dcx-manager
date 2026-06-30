# DCX Manager — Documentation

**Current version:** v0.3.2  
**Last updated:** 2026-06-25

## Structure

```
docs/
├── product/            Product requirements, decisions, and open questions (legacy docs archived to `docs/archive/`; graph is now the source of truth)
├── architecture/       Current and target technical architecture
├── plans/
│   ├── active/         Plans agents are currently executing
│   ├── drafted/        Plans scoped but not yet specified (agents may read, not execute)
│   └── completed/      Finished plans — read-only archive
├── progress/           Session logs (indexed NN-name.md), index.csv (pending DR-3)
├── agent-guides/       Per-agent performance profiles and startup checklists
├── agent-rules/        Core rules modules (pending DR-1 split from AGENTS.md)
├── references/         Stable reference material (design tokens, brand, API contracts)
└── archive/            Superseded documents (do not delete — historical record)
```

## Authority Order

When sources conflict, this order applies — higher wins:

1. `product/requirements/builder/` — confirmed product requirements
2. `product/decisions/builder-decisions.md` — approved product decisions
3. `plans/active/` — active sprint plans
4. `architecture/builder/` — architectural contracts
5. Existing code — what is already implemented
6. `progress/` — historical record only; never overrides requirements

Drafted and completed plans have no authority over code.

## Quick Links

- [Builder requirements](product/requirements/builder/README.md)
- [Builder decisions](product/decisions/builder-decisions.md)
- [Open decisions](product/open-questions/builder-open-decisions.md)
- [Active plans](plans/active/)
- [Drafted plans](plans/drafted/)
- [Agent guides](agent-guides/README.md)
- [Current architecture](architecture/builder/current-architecture.md)
- [State ownership](architecture/builder/state-ownership.md)

## Plan Lifecycle

```
drafted/ → (PO writes sprint files) → active/ → (all sprints done) → completed/
```

See AGENTS.md §25 for the full protocol.

## Migration Map — Old Path → New Path

| Old path | New path | Status |
|---|---|---|
| `docs/progress-log.md` | `docs/progress/progress-log-root.md` | Archived |
| `docs/dcx-data-model.md` | `docs/archive/dcx-data-model.md` | Superseded |
| `docs/dcx-development-plan.md` | `docs/archive/dcx-development-plan.md` | Superseded |
| `docs/dcx-sprint-task-breakdown.md` | `docs/archive/dcx-sprint-task-breakdown.md` | Superseded |
| `docs/dcx-refactor-plan-v022.md` | `docs/archive/dcx-refactor-plan-v022.md` | Superseded |
| `docs/dcx-refactor-plan-v0213.md` | `docs/archive/dcx-refactor-plan-v0213.md` | Superseded |
| `docs/builder-restructure-plan.md` | `docs/archive/builder-restructure-plan.md` | Superseded |
| `docs/plans/active/builder-refactor/` | `docs/plans/completed/builder-refactor/` | Completed 2026-06-25 |
