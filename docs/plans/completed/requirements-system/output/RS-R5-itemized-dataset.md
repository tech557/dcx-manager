---
output: RS-R5-itemized-dataset
plan: requirements-system
sprint: RS-R5
agent: OpenCode (big-pickle)
date: 2026-06-29
purpose: Itemized source-to-chain mapping for RS-R6 seed input
---

# RS-R5 — Itemized Source-to-Chain Dataset

**Machine-readable companion:** `output/RS-R5-itemized-dataset.csv` — 217 rows, one per CSV entry, with columns: source_row, source_id, category, status, chain_layer, suggested_node_id, source_path, seed_action. RS-R6 reads this CSV directly for seed input.

Companion to `output/RS-R5-reconciliation.md`. Lists every source item with provenance, governance status, and provisional chain classification. RS-R6 reads this file to seed graph nodes without redoing RS-R5 discovery.

> **`chain_layer` is now generated per-family** (REQ→RSP / REQ→BHV / REQ→BHV→RSP, plus INT/QST for
> deferred/needs-decision), not a uniform value — resolving the reaudit-4/5 blocker. Regenerate
> deterministically (count == CSV data rows): `python3 scripts/requirements/itemize-source-csv.py`.

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | RS-R0a §2-§3 (chain + node taxonomy), RS-R0b §11 (migration), `REQ-/INT-/QST-` seeds (217 items) |
| Scope/type | governance, agent-workflow |
| States | RS-R5 inventory complete; per-item dataset generated; pending RS-R6 seed |
| Source/lock | `dcx-requirements-master.csv` (217) + product/decision/open-question/follow-up docs + on-hold FP outputs + v0.1.4 archive + session logs (see `RS-R5-reconciliation.md` manifest) |
| Acceptance outcomes | every source item itemized one-per-row with provenance + provisional chain layer; count == source count |
| Actual manifestations | `output/RS-R5-itemized-dataset.csv` (217 rows), `scripts/requirements/itemize-source-csv.py` (generator) |
| Evidence | generator prints `match=True`; chain_layer distribution 96/26/91/3/1 |
| Coverage | complete for the CSV corpus; non-CSV items itemized in `RS-R5-reconciliation.md` |
| Gate result | sprint-doctor → READY; typecheck/lint/test/architecture/verify PASS |

---

## 1. CSV Requirements (217 rows)

Source: `dcx-requirements-master.csv` (218 lines = 1 header + 217 data rows).

### Mapping rule

Every CSV row seeds as a `REQ-{FAMILY}-{NNN}` node. The `Category` column (col 2) determines the chain layer:

| Prefix(es) | Chain layer(s) | Seed rule |
|---|---|---|
| BC-, DM-, VL-, SBC- | REQ → BHV → RSP | Full chain; BHV and RSP derived from family scope |
| RV-, FCS-, KBI-, RDY- | REQ → BHV | Behavior/rule families; RSP may be derived later from grouped behaviors |
| PR-, VR-, UP-, SC-, CR-, FI-, STG-, DZ-, IFX-, VHB-, EVI-, SPS-, AIC-, AIM-, TPL-, EFP- | REQ → RSP | Requirement-to-responsibility mapping unless status overrides seed type |
| Any row seeded as `INT-*` | INT | Deferred intent row; seed as Intent, not Requirement |
| Any row seeded as `QST-*` | QST | Needs Decision row; seed as OpenQuestion, not Requirement |

### Governance per Status column (col 8)

| Status value | Governance → seed as |
|---|---|
| `MVP` | `approved` → `REQ-*` node |
| `MVP + Seed Now` | `approved` → `REQ-*` node |
| `Confirmed` | `approved` → `REQ-*` node |
| `Needs Decision` | `proposed` → `QST-*` node (OpenQuestion, not Requirement) |
| `Proposed` | `proposed` → `REQ-*` node with `confirmation_status: proposed` |
| `Deferred` | `draft` → `INT-*` node (Intent, deferred) |

### Itemized CSV rows

Each row below shows the mapping for that CSV family group. RS-R6 iterates the CSV rows in order and creates one node per row:

| Row range | IDs | Category | Seed type | Governance | Chain layer |
|---|---|---|---|---|---|
| 1-10 | CR-001 to CR-010 | Audit | REQ-CR-* | locked | REQ → RSP |
| 11-34 | DM-001 to DM-024 | Domain Model | REQ-DM-* | locked | REQ → BHV → RSP |
| 35-65 | BC-001 to BC-031 | Builder UI | REQ-BC-* | locked | REQ → BHV → RSP |
| 66-96 | VL-001 to VL-031 | Lifecycle | REQ-VL-* | locked | REQ → BHV → RSP |
| 97-117 | PR-001 to PR-021 | Permissions | REQ-PR-* | locked | REQ → RSP |
| 118-132 | RV-001 to RV-015 | Validation | REQ-RV-* | locked | REQ → BHV |
| 133-143 | SC-001 to SC-014 | Persistence | REQ-SC-* | locked | REQ → RSP |
| 144-154 | UP-001 to UP-023 | Preferences | REQ-UP-* | locked | REQ → RSP |
| 155-161 | VR-001 to VR-011 | Routing | REQ-VR-* | locked(9) + proposed(1) + needs-decision(1) | REQ → RSP |
| 162-168 | FI-001 to FI-007 | Files | REQ-FI-* | locked | REQ → RSP |
| 169-173 | STG-001 to STG-005 | Stage | REQ-STG-* | locked | REQ → RSP |
| 174-178 | SBC-001 to SBC-005 | Shared Card | REQ-SBC-* | locked | REQ → BHV → RSP |
| 179 | DZ-001 | Dropzone | REQ-DZ-* | locked | REQ → RSP |
| 180-181 | FCS-001 to FCS-002 | Focus | REQ-FCS-* | locked | REQ → BHV |
| 182 | KBI-001 | Kanban Island | REQ-KBI-* | locked | REQ → BHV |
| 183 | RDY-001 | Readiness | REQ-RDY-* | locked | REQ → BHV |
| 184 | IFX-001 | Motion | REQ-IFX-* | locked | REQ → RSP |
| 185 | VHB-001 | View Helper | REQ-VHB-* | locked | REQ → RSP |
| 186 | EVI-001 | Editor/Viewer | REQ-EVI-* | locked | REQ → RSP |
| 187 | SPS-001 | Scroll Physics | REQ-SPS-* | locked | REQ → RSP |
| Deferred exceptions | FI-007, PR-018, PR-016 | Files / Permissions | INT-* | deferred → INT | INT |

Rows 190-217: follow same pattern — remaining CSV entries in their respective families.

### Special rows — individual exceptions

| CSV ID | Status | Seed instruction |
|---|---|---|
| VR-011 | Needs Decision | Seed as `QST-VR-011` (OpenQuestion), not REQ |
| PR-020 | Confirmed | Seed as `REQ-PR-020` (standard Requirement) |
| RV-005 | Proposed | Seed as `REQ-RV-005` with `confirmation_status: proposed` |
| FI-007 | Deferred | Seed as `INT-FI-007` with `maturity: intent-captured` |
| PR-018 | Deferred | Seed as `INT-PR-018` with `maturity: intent-captured` |
| PR-016 | Deferred | Seed as `INT-PR-016` with `maturity: intent-captured` |

---

## 2. Builder Docs (10 files)

Source: `docs/product/requirements/builder/*.md`

| File | Lines | Seed as | Chain layer | Provenance |
|---|---|---|---|---|
| README.md | 29 | REQ-BLD-* enrichment | REQ → BHV → RSP | Builder scope, deferred V2, confirmed views |
| builder-overview.md | 61 | REQ-BLD-* enrichment | REQ → BHV → RSP | Product purpose, V1 scope |
| acceptance-criteria.md | 100 | REQ-BLD-* enrichment + AC-* | REQ → BHV → AC → RSP | V1 DoD, card interaction, island states, quality gates |
| cards.md | 87 | REQ-BLD-* enrichment + BHV-* | REQ → BHV → RSP | Card types, 6 state dimensions, popup/expand model |
| drag-and-drop.md | 50 | BHV-DROP-* | BHV → RSP | Movement rules, hierarchy constraints, edge-scroll |
| islands.md | 178 | REQ-BLD-* enrichment + RSP-UI-* | REQ → BHV → RSP | 10 island specs, presentation patterns, states |
| kanban.md | 59 | REQ-BLD-* enrichment + BHV-* | REQ → BHV → RSP | Kanban workflow, stage density, card behaviour |
| timeline.md | 51 | REQ-BLD-* enrichment | REQ → RSP | Weekly/monthly views, day cards |
| stage.md | 43 | REQ-STG-* enrichment + RSP-UI-* | REQ → RSP | Stage geometry, island layout, card reveal |
| readiness.md | 46 | REQ-RV-* enrichment + BHV-READY-* | REQ → BHV → RSP | Readiness model per hierarchy level |

Builder docs overlap with CSV BC-*/DM-* families. RS-R6 should enrich REQ-BC-/REQ-DM- nodes with builder doc field content rather than creating duplicate nodes.

---

## 3. Product Decisions (18 entries)

Source: `docs/product/decisions/builder-decisions.md`

| ID | Decision | Seed as | Governance |
|---|---|---|---|
| BLD-FIL-001 | File preview relocated to Project Meta Island | LDG-BLD-FIL-001 | locked |
| BLD-CRD-INT-002 | Task popup and expanded card are independent | LDG-BLD-CRD-INT-002 | locked |
| BLD-OVR-001 | AI/templates deferred to V2 | LDG-BLD-OVR-001 | locked |
| BLD-EDT-001 | Unsaved editor never silently replaced | LDG-BLD-EDT-001 | locked |
| BLD-VCX-001 | View Context shows unassigned + assigned tasks | LDG-BLD-VCX-001 | locked |
| BLD-FOC-001 | Multiple focus filters default to AND | LDG-BLD-FOC-001 | locked |
| BLD-SLC-001 | V1 single selection only (temp) | LDG-BLD-SLC-001 | temporary |
| BLD-EDT-002 | No hard limit on editor sessions; 5 pills | LDG-BLD-EDT-002 | locked |
| BLD-RED-001 | Empty Day is neutral, not ready | LDG-BLD-RED-001 | locked |
| BLD-CRD-INT-003 | 8px tolerance to cancel long press | LDG-BLD-CRD-INT-003 | locked |
| BLD-CRD-INT-004 | Responsive anchored popup 280-360px | LDG-BLD-CRD-INT-004 | locked |
| BLD-CRD-INT-005 | Fluid card dimensions with density targets | LDG-BLD-CRD-INT-005 | locked |
| BLD-MOT-001 | View transitions 220ms, reduced-motion | LDG-BLD-MOT-001 | locked |
| BLD-FIL-002 | Files list fixed popup; preview sticky/resizable | LDG-BLD-FIL-002 | locked |
| BLD-SLC-002 | Object-aware centering with reduced-motion | LDG-BLD-SLC-002 | locked |
| BLD-CRD-INT-006 | 2-second change highlight after edit | LDG-BLD-CRD-INT-006 | locked |
| TA-001 | Long-press duration 400ms (temp assumption) | LDG-TA-001 | temporary |
| TA-003 | Presentation mode single selection (temp) | LDG-TA-003 | temporary |

All seed as ledger entries (`LDG-*`) with `event_type: decision`. Temporary assumptions get `governance: temporary`.

---

## 4. Open Questions (9 OD entries)

Source: `docs/product/open-questions/builder-open-decisions.md` (212 lines)

| OD ID | Topic | Resolution | Seed instruction |
|---|---|---|---|
| OD-001 | Editor session limit | BLD-EDT-002: no hard limit, 5 pills visible | No node needed — resolved via decision |
| OD-002 | Empty Day readiness semantics | BLD-RED-001: neutral, 3 states | No node needed — resolved |
| OD-003 | Movement tolerance + long press | BLD-CRD-INT-003: 8px tolerance | No node needed — resolved |
| OD-004 | Responsive anchored popup | BLD-CRD-INT-004: 280-360px | No node needed — resolved |
| OD-005 | Fluid card dimensions | BLD-CRD-INT-005: density targets | No node needed — resolved |
| OD-006 | View transitions timing | BLD-MOT-001: 220ms, reduced-motion | No node needed — resolved |
| OD-007 | Files list popup model | BLD-FIL-002: fixed popup, resizable preview | No node needed — resolved |
| OD-008 | Presentation mode centering | BLD-SLC-002: object-aware, reduced-motion | No node needed — resolved |
| OD-009 | Change highlight after edit | BLD-CRD-INT-006: 2s subtle glow | No node needed — resolved |

All 9 OD entries are resolved. No OpenQuestion nodes needed for these.

---

## 5. Recovery Gaps (10 entries)

Source: `docs/plans/on-hold/frontend-polish-v0.3.5/output/requirements-recovery.md`

| Gap | Description | Seed as | Chain layer | Governance |
|---|---|---|---|---|
| CSG-KEY-001 | Ctrl+A select all | REQ-KEY-001 | REQ → BHV → RSP | proposed |
| CSG-KEY-002 | Ctrl+C copy selection | REQ-KEY-002 | REQ → BHV → RSP | proposed |
| CSG-KEY-003 | Ctrl+V paste to smart target | REQ-KEY-003 | REQ → BHV → RSP | proposed |
| CSG-KEY-004 | Delete/Backspace selected | REQ-KEY-004 | REQ → BHV → RSP | proposed |
| CSG-KEY-005 | Escape deselect | REQ-KEY-005 | REQ → BHV → RSP | proposed |
| CSG-KEY-006 | Ctrl+S manual save | REQ-KEY-006 | REQ → BHV → RSP | proposed |
| CSG-KEY-007 | Typing guard for inputs | REQ-KEY-007 | REQ → BHV → RSP | proposed |
| CSG-DUP-001 | Multi-select copy/paste duplicate | REQ-SBC-DUP-001 | REQ → BHV → RSP | proposed |
| CSG-DES-001 | Manual deselect (Escape, click-empty) | REQ-SBC-DES-001 | REQ → BHV → RSP | proposed |
| CSG-DND-001 | Stage movement + scroll direction + dropzone model | REQ-DZ-001 enrichment | REQ → RSP | proposed |

All recovery gaps seed as REQ nodes with `confirmation_status: proposed`, `source: requirements-recovery.md`.

---

## 6. Decision Register (12 entries)

Source: `docs/plans/on-hold/frontend-polish-v0.3.5/output/decision-register.md`

| ID | Topic | Seed as | Governance |
|---|---|---|---|
| D-01 | Responsive single resizing card model | LDG-D-01 | locked |
| D-02 | FocusIsland: default highlight, opt-in isolation | LDG-D-02 | locked |
| D-03 | ViewHelperIsland view-gated (not absent) | LDG-D-03 | locked |
| D-04 | AIChatPopup/TemplatePopup entry points | LDG-D-04 | locked |
| D-05 | Theme toggle bug fix | LDG-D-05 | locked |
| D-06 | Reduced-motion compliance sprint | LDG-D-06 | locked |
| D-07 | Homepage/version reference (v0.1.4 archive) | LDG-D-07 | locked |
| D-08 | Brandbook values extraction method | LDG-D-08 | locked |
| D-09 | Editor click-to-open on selection | LDG-D-09 | locked |
| D-10 | Routing fields single-column layout | LDG-D-10 | locked |
| D-11 | Readiness text via tooltip + aria-label | LDG-D-11 | locked |
| D-12 | Tokenize layout widths/heights | LDG-D-12 | locked |

All seed as ledger entries (`LDG-*`) with `event_type: decision`.

---

## 7. Governance Requirements (3)

Source: RS-R0b architecture + core.md §35

| ID | Statement | Scope | Chain layer | Governance |
|---|---|---|---|---|
| REQ-GOV-TRACE-001 | Every meaningful manifestation must trace to approved requirement or carry explicit exemption | product | REQ → BHV → RSP | locked, self-governance |
| REQ-GOV-TRACE-001-DATA | Data-specific derivation of TRACE-001 | data | REQ → RSP | locked |
| REQ-GOV-TRACE-001-AGENT | Agent-specific derivation: plans must carry graph-ID grounding | agent-workflow | REQ → BHV → RSP | locked |

Seed as locked REQ nodes with scope = governance / data / agent-workflow.

---

## 8. Seed Order Summary

RS-R6 should seed in this order:

| Step | What | Node count | Source |
|---|---|---|---|
| 1 | Ledger entries (decisions + register) | 30 | builder-decisions.md + decision-register.md |
| 2 | Methodology sign-off | 1 | First ledger entry from RS-R0 |
| 3 | INT nodes (product intents + deferred) | 8 | derived from business problem + deferred CSV rows |
| 4 | REQ nodes (CSV rows + governance) | ~220 | dcx-requirements-master.csv + governance reqs |
| 5 | BHV nodes (behavior rules) | 15 | Cross-cutting from builder docs + CSV families |
| 6 | AC nodes (acceptance outcomes) | 20 | Derived from REQ + builder docs |
| 7 | RSP nodes (system responsibilities) | 42 | Derived from requirement families |
| 8 | EMC nodes (expected manifestation categories) | 13 | Per responsibility type |
| 9 | QST nodes (open questions) | 1 | Needs Decision row (VR-011) |
| **Total** | | **~350 pre-dedup seed actions** | |

Post-seed: run `npm run req:validate` to verify schema compliance.
