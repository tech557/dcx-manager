---
output: RS-R10-disposition-table
plan: requirements-system
sprint: RS-R10
agent: OpenCode
date: 2026-06-29
status: proposed (Phase A — awaiting PO approval)
---

## RS-R10 — Legacy Document Disposition Table

Generated from Phase A inventory. Each row requires PO sign-off before archiving.

### Source manifest (verified against filesystem)

| Group | Path | Files | Lines | Verified |
|---|---|---|---|---|
| Master CSV | `dcx-requirements-master.csv` | 1 | 218 | ✅ |
| Builder reqs | `docs/product/requirements/builder/README.md` | 1 | 29 | ✅ |
| Builder reqs | `docs/product/requirements/builder/acceptance-criteria.md` | 1 | 100 | ✅ |
| Builder reqs | `docs/product/requirements/builder/builder-overview.md` | 1 | 61 | ✅ |
| Builder reqs | `docs/product/requirements/builder/cards.md` | 1 | 87 | ✅ |
| Builder reqs | `docs/product/requirements/builder/drag-and-drop.md` | 1 | 50 | ✅ |
| Builder reqs | `docs/product/requirements/builder/islands.md` | 1 | 178 | ✅ |
| Builder reqs | `docs/product/requirements/builder/kanban.md` | 1 | 59 | ✅ |
| Builder reqs | `docs/product/requirements/builder/readiness.md` | 1 | 46 | ✅ |
| Builder reqs | `docs/product/requirements/builder/stage.md` | 1 | 43 | ✅ |
| Builder reqs | `docs/product/requirements/builder/timeline.md` | 1 | 51 | ✅ |
| Decisions | `docs/product/decisions/builder-decisions.md` | 1 | 31 | ✅ |
| Decisions | `docs/product/decisions/src-structure-decision.md` | 1 | 151 | ✅ |
| Open Qs | `docs/product/open-questions/builder-open-decisions.md` | 1 | 212 | ✅ |
| Follow-ups | `docs/product/follow-ups/builder-follow-ups.md` | 1 | 20 | ✅ |
| Component policy | `docs/product/component-source-policy.md` | 1 | 97 | ✅ |

### Disposition rows

| # | Source path | Lines | Action | Reason | Graph replacement IDs | Graph replacement count | Ledger refs | Migration confidence | Unresolved debt/questions | Proposed archive destination | PO decision | PO notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `dcx-requirements-master.csv` | 218 | archive | All 217 rows already seeded as graph nodes by RS-R6. Stray file at repo root — `docs/archive/` is correct home. | All 251 REQ-* nodes, 4 INT-*, 2 QST-*, 30 AC-*, 8 BHV-*, 26 RSP-*, 26 EMC-* | 347 graph nodes via RS-R6 | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high — all rows mapped per RS-R5 itemized CSV | Verify 0 orphan rows remain unseeded | `docs/archive/dcx-requirements-master.csv` | ✅ approved | — |
| 2 | `docs/product/requirements/builder/builder-overview.md` | 61 | archive | Overview content is fully represented in graph node structure, views, and `query-index.json` | All builder REQ families (REQ-BC-*, REQ-DM-*, REQ-VL-*, REQ-UP-*, REQ-RV-*, REQ-PR-*, REQ-SC-*, REQ-CR-*, REQ-VR-*, REQ-KEY-*, REQ-FCS-*, REQ-KBI-*, REQ-IFX-*) | ~165 REQ nodes | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high — content overlaps with CSV rows already seeded | None | `docs/archive/product/requirements/builder/builder-overview.md` | ✅ approved | — |
| 3 | `docs/product/requirements/builder/acceptance-criteria.md` | 100 | archive | AC patterns are seeded as 30 AC nodes in the graph. The readable AC patterns doc is superseded by graph acceptance nodes. | 30 AC-*-SEED nodes (AC-BC-SEED, AC-CR-SEED, AC-DM-SEED, etc.) | 30 AC nodes | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high — ACs mapped per RS-R6 seed | Some AC-SEED nodes may need per-outcome refinement; queued for RS-R11+ | `docs/archive/product/requirements/builder/acceptance-criteria.md` | ✅ approved | — |
| 4 | `docs/product/requirements/builder/cards.md` | 87 | archive | Card builder requirements seeded as REQ-BC-* chain | REQ-BC-001..031, AC-BC-SEED, RSP-*, EMC-*, BHV-* | 31 REQ + related nodes | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high | None | `docs/archive/product/requirements/builder/cards.md` | ✅ approved | — |
| 5 | `docs/product/requirements/builder/drag-and-drop.md` | 50 | archive | DND requirements seeded as REQ-DZ-* | REQ-DZ-001..002, AC-DZ-SEED, related RSP/EMC nodes | 2 REQ + related | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high | Cross-ref project drag-and-drop may need refinement | `docs/archive/product/requirements/builder/drag-and-drop.md` | ✅ approved | — |
| 6 | `docs/product/requirements/builder/islands.md` | 178 | archive | Island requirements seeded as REQ-SBC-*, REQ-UP-*, REQ-SC-*, REQ-VL-* families | REQ-SBC-001..007, REQ-UP-*, REQ-SC-*, REQ-VL-*, REQ-CR-* (partial), AC-SBC-SEED, AC-SC-SEED, AC-UP-SEED, AC-VL-SEED, AC-CR-SEED | ~60 REQ + AC nodes | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high | Island-specific behavior rules in graph may not cover all edge cases from builder doc; deferred to FP redo | `docs/archive/product/requirements/builder/islands.md` | ✅ approved | — |
| 7 | `docs/product/requirements/builder/kanban.md` | 59 | archive | Kanban requirements seeded as REQ-VL-*, REQ-RV-*, REQ-UP-* | REQ-VL-*, REQ-RV-*, REQ-UP-* (partial), AC-VL-SEED, AC-RV-SEED, AC-UP-SEED | ~30 REQ + AC nodes | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high | None | `docs/archive/product/requirements/builder/kanban.md` | ✅ approved | — |
| 8 | `docs/product/requirements/builder/readiness.md` | 46 | archive | Readiness requirements seeded as REQ-RDY-* | REQ-RDY-001..002, AC-RDY-SEED | 2 REQ + related | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high | None | `docs/archive/product/requirements/builder/readiness.md` | ✅ approved | — |
| 9 | `docs/product/requirements/builder/stage.md` | 43 | archive | Stage requirements seeded as REQ-STG-* | REQ-STG-001..005, AC-STG-SEED | 5 REQ + related | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high | None | `docs/archive/product/requirements/builder/stage.md` | ✅ approved | — |
| 10 | `docs/product/requirements/builder/timeline.md` | 51 | archive | Timeline requirements seeded as REQ-TPL-* | REQ-TPL-001, AC-TPL-SEED | 1 REQ + related | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high | None | `docs/archive/product/requirements/builder/timeline.md` | ✅ approved | — |
| 11 | `docs/product/requirements/builder/README.md` | 29 | archive | Overview doc — content is redundant with graph structure and generated views | All builder REQ families (same as row 2) | ~165 REQ nodes | `LDG-2026-06-29-RS-R6-SEED-MIGRATION` | high | None — pure overview, no unique content | `docs/archive/product/requirements/builder/README.md` | ✅ approved | — |
| 12 | `docs/product/decisions/builder-decisions.md` | 31 | archive | 16 product decisions already live as ledger entries (LDG-BLD-*). 2 TA entries also in ledger. | LDG-BLD-CRD-INT-002..006, LDG-BLD-EDT-001..002, LDG-BLD-FIL-001..002, LDG-BLD-FOC-001, LDG-BLD-MOT-001, LDG-BLD-OVR-001, LDG-BLD-RED-001, LDG-BLD-SLC-001..002, LDG-BLD-VCX-001, LDG-TA-001, LDG-TA-003 | 16 BLD + 2 TA ledger entries | `LDG-BLD-*`, `LDG-TA-*` | high | None — all decisions seeded | `docs/archive/product/decisions/builder-decisions.md` | ✅ approved | — |
| 13 | `docs/product/decisions/src-structure-decision.md` | 151 | keep | Architecture design rationale, not requirements. Keep in place as live doc for source-structure context. | N/A — not a requirement document | 0 | N/A | N/A | N/A | N/A | ✅ n/a | Keep |
| 14 | `docs/product/open-questions/builder-open-decisions.md` | 212 | archive | Open questions resolved into graph: QST-LIFECYCLE-POST-READY (lifecycle post-readiness), QST-VR-011 (validation rule). OD→BLD mappings in ledger. | QST-LIFECYCLE-POST-READY, QST-VR-011; ledger entries LDG-D-01..D-12 | 2 QST nodes + 12 D-ledger entries | `LDG-D-01` through `LDG-D-12` | high — resolved ODs are already mapped | Some OD editorial context may not be fully replicated in graph metadata | `docs/archive/product/open-questions/builder-open-decisions.md` | ✅ approved | — |
| 15 | `docs/product/follow-ups/builder-follow-ups.md` | 20 | archive | Follow-ups ingested by RS-R5 into tracked queues (manifestationsLackingRequirements, needsDecomposition, etc.) | Tracked in queue views at `docs/product/requirements/graph/views/` | N/A (queue items) | N/A | high — content ingested per RS-R5 | Verify 0 follow-up items are still actionable outside the queue system | `docs/archive/product/follow-ups/builder-follow-ups.md` | ✅ approved | — |
| 16 | `docs/product/component-source-policy.md` | 97 | keep | Component sourcing policy (shadcn vs custom), not requirements. Keep as live architecture reference. | N/A — not a requirement document | 0 | N/A | N/A | N/A | N/A | ✅ n/a | Keep |

### Summary

| Action | Count | Files |
|---|---|---|
| archive | 14 | CSV, 10 builder docs (incl. README), builder-decisions, builder-open-decisions, builder-follow-ups |
| keep | 2 | src-structure-decision.md, component-source-policy.md |
| Total | 16 | — |

### PO decision record

PO approved all 14 archive rows on 2026-06-29. Row 13 (src-structure-decision.md) and row 16 (component-source-policy.md) kept as live docs.

Ledger entry: `LDG-2026-06-29-RS-R10-DISP-APPROVAL`
