# References

Stable reference material that agents may consult during implementation.

## Codebase references

| Resource | Location | Description |
|---|---|---|
| Brand tokens | `src/brand/tokens.ts` | All design tokens (colours, spacing, typography) |
| Design system | `src/brand/index.css` | Global styles, Tailwind theme extensions, utility classes |
| Component registry | `docs/component_registry.json` | Index of every component, its purpose, and file location |
| API types | `src/types/api.ts` | API request/response type definitions |
| Domain model | `src/types/domain.ts` | Campaign, Version, Phase, Action, Task domain types |
| Stage context types | `src/builder/stage/stageContext.types.ts` | Stage provider context type definitions |
| Effects registry | `src/ui/motion/effects.registry.ts` | Named animation effects (the only animation entry point) |
| Card registry | `src/builder/cards/card.registry.ts` | Card type configurations |
| Readiness rules | `src/rules/readiness.rules.ts` | Single source of readiness computation |
| Node helpers | `src/utils/node.helpers.ts` | Tree traversal utilities (findTask, findAction, etc.) |
| Builder actions | `src/actions/` | All builder mutations (useBuilderActions) |
| API mappers | `src/services/api-mappers.ts` | Domain-to-API type mapping layer |

## Doc references

| Resource | Location | Description |
|---|---|---|
| Core rules | `docs/agent-rules/core.md` | Non-negotiable rules for every agent |
| Log format | `docs/agent-rules/log-format.md` | Progress log template and identity block |
| Agent guides | `docs/agent-guides/` | Per-agent strengths, failure modes, startup checklists |
| Product requirements | `docs/product/requirements/graph/` | Confirmed product requirements (graph; legacy docs archived) |
| Product decisions | `docs/product/requirements/graph/ledger/decision-ledger.jsonl` | Approved product decisions (ledger) |
| Open decisions | `docs/product/open-questions/builder-open-decisions.md` | Open questions with temporary defaults |
| Active plans | `docs/plans/active/` | Current sprint work |
| Architecture | `docs/architecture/builder/` | Current and target architecture |
| Session logs | `docs/progress/sessions/` | Historical progress log entries |
| Archive | `docs/archive/` | Superseded documents (do not delete) |
