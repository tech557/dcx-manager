# Active Plans

This folder contains plans that agents are currently executing. Only plans in this folder are actionable.

## Current plans

| Plan | Status | Executing | Goal |
|---|---|---|---|
| [production-api-client-switch](./production-api-client-switch/README.md) | active — activated 2026-07-01 | next: **PAC-R0** (PO confirmations + signed `REQ-BE-*` IDs) → PAC-R1..R6 | Replace `mockDispatch` with a real Supabase backend behind the frozen 22-route `apiClient` contract, using the `backend-discovery-v3` readiness dataset. Applies schema (PO-gated) + wires the real backend behind a flag. |

As of 2026-07-01, `backend-discovery-v3` is **completed**
([`docs/plans/completed/backend-discovery-v3/`](../completed/backend-discovery-v3/README.md)) — all sprints
BE3-R0..BE3-R7 ran; **BE3-R7** (PO-authorized final debt clearance) cleared the last two gates for real:
**G5** via a PO-amended local seeded capture (22/22 routes ≥3 payloads, scrub PASS) and **G6** via a
requirement intake grounding the backend tooling manifestations to `REQ-GOV-TRACE-001-BACKEND` (PO sign-off
ledger). The re-run readiness gate scored **G1–G6 all PASS → READY**; the hand-off dataset
(`docs/backend/readiness-scorecard.md`) is frozen and feeds `production-api-client-switch`.

As of 2026-07-01, `cicd-release-governance` is **completed**
([`docs/plans/completed/cicd-release-governance/`](../completed/cicd-release-governance/README.md)) —
all sprints RG-R0a..RG-R8 ran; first production release live (`v1.0.0.0`); the three PO-owned open items
(repo-privacy, branch protection, deployment protection) were **accepted by the PO as permanent tracked
debt** at close (see `docs/progress/po-actions.md`). All output-review findings were resolved first.

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
