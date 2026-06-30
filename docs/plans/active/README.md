# Active Plans

This folder contains plans that agents are currently executing. Only plans in this folder are actionable.

## Current plans

| Plan | Status | Executing | Goal |
|---|---|---|---|
| [cicd-release-governance](./cicd-release-governance/README.md) | active (PO-activated 2026-07-01, final-approval audit READY) | RG-R0a → RG-R0b → RG-R1 → RG-R2 → RG-R3 → RG-R4 → RG-R5/RG-R6 → RG-R7 → RG-R8, one sprint at a time | Mechanically-enforced CI/CD + release governance: preview-per-source-change, exact-build promotion gated by PO approval, 4-part versioning, CSV release registry. Docs/tooling/config only — never writes `src/`. |

As of 2026-06-30, `requirements-system` and `frontend-polish-v0.3.5` are **completed**
(`docs/plans/completed/`).

**Next (PO action, separate track):** create + audit `docs/plans/drafted/frontend-polish-implementation-v0.3.x/`
from the FP-R5 17-sprint set (`completed/frontend-polish-v0.3.5/output/FP-R5-synthesis.md`); on READY,
activate and implement **WM-1 first**. Implementation PO Web Checks must use real pointer/drag; resolve
**G-IMPECCABLE** before the CT-1 token sprint. The requirements graph at `docs/product/requirements/graph/`
is the live source of truth.

## Rules

- Agents execute sprints, run gates, and write progress logs.
- A plan is only complete when all its sprints pass acceptance criteria and gates.
- Do not add scope beyond the sprint file without PO approval.
- See `docs/agent-rules/core.md` §24 for the full plan lifecycle protocol.

## Quick links

- [Core rules](../agent-rules/core.md)
- [Agent guides](../agent-guides/README.md)
- [Progress logs](../progress/)
