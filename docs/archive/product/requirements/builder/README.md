# Builder — Product Requirements Index

**Authority:** These documents are the source of truth for Builder behaviour.  
**Source document:** DCX Builder — Product Requirements and Expected Behaviour (June 2026)

| Document | Covers |
|---|---|
| [builder-overview.md](builder-overview.md) | Purpose, planning directions, V1 scope |
| [stage.md](stage.md) | Stage behaviour, layout, island relationships |
| [cards.md](cards.md) | All card types, states, interaction model |
| [kanban.md](kanban.md) | Kanban view, density, creation workflow |
| [timeline.md](timeline.md) | Weekly and monthly views, Day cards, navigation |
| [islands.md](islands.md) | All islands — states, child features, presentation patterns |
| [drag-and-drop.md](drag-and-drop.md) | Drag rules, edge scroll, multi-select |
| [readiness.md](readiness.md) | Readiness model, all levels |
| [acceptance-criteria.md](acceptance-criteria.md) | V1 Definition of Done |

## Requirement ID Format

```
BLD-[AREA]-[NNN]
```

Examples: `BLD-FIL-001`, `BLD-CRD-INT-002`, `BLD-EDT-001`

All requirement IDs must be cited in:
- Sprint task files
- Code comments where they directly influence implementation
- Progress log entries
