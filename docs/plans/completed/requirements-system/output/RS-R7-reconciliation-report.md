---
output: RS-R7-reconciliation-report
plan: requirements-system
sprint: RS-R7
agent: OpenCode
date: 2026-06-29
status: persisted-review-queue — PO confirmation pending
---

# RS-R7 — Initial Code Reconciliation Report

## Intent
Run the RS-R3 reconciliation engine over `src/**` to produce the first coverage picture: link existing code manifestations to seeded requirements, classify exempt work, and populate queues.

## Setup
- Code index refreshed: `npm run generate:code-index` (pass)
- Graph validation: `npm run req:validate` (pass; after Codex audit self-trace, 310 nodes / 458 trace links / 35 ledger entries)
- Engine: `npm run req:reconcile -- --mode inventory`

---

## 1. Manifestation Inventory

### Kinds discovered
| Kind | Count |
|---|---|
| react-component | 259 |
| function | 64 |
| hook | 32 |
| service | 21 |
| type | 9 |
| store-action | 2 |
| **Total distinct manifestations** | **387** |

### Source coverage
Manifestations span 20+ source directories under `src/`:
- `src/builder/cards/` — card templates, shells, drag helpers
- `src/builder/stage/` — stage views, providers, hooks
- `src/builder/islands/` — all islands (EditorViewer, Focus, Metadata, Selection, Kanban, Timeline, etc.)
- `src/builder/actions/` — action, node, phase, task mutations
- `src/builder/ui/` — buttons, feedback, modals, forms
- `src/actions/` — store-level actions
- `src/brand/` — theme, tokens
- `src/ui/` — date fields, selects, inputs
- `src/types/` — API, domain types

### Persisted inventory state
After the Codex persist pass, all **387 discovered `src/**` manifestations are persisted as MAN nodes** with `governance=proposed`, `confirmation_status=code-discovered`, and `delivery=not-assessed`.

---

## Audit Amendment — 2026-06-29 Codex

At this audit point, RS-R7 was **not accepted as completed**. The inventory run was useful, but the
sprint's completion criteria were not satisfied because the inferred RS-R7 candidates were not persisted
in the canonical graph/review queue and the PO confirmation gate remained open.

Codex amended the reconciliation engine after audit so `--mode inventory` no longer writes dangling
auto-applied links when the source MAN node does not exist. After the fix:

- `npm run req:reconcile -- --mode inventory` leaves the graph valid.
- Engine output reports 387 discovered manifestations and 362 inferred candidate links.
- `autoApplied` is 0 because no discovered source MAN nodes exist in the graph yet.
- The persisted graph was 310 nodes, 458 trace links, and 35 ledger entries after Codex added self-trace manifestations for the audit amendment.
- The persisted `candidateLinksAwaitingConfirmation` queue remained 450, not 809.

The follow-up persist pass below closes that persistence gap; RS-R7 remains **PO confirmation pending**.

## Persist Pass — 2026-06-29 Codex

Codex completed the PO-selected "finish properly" next step:

- Added `npm run req:persist-rs-r7`.
- Persisted 387 code-discovered MAN nodes from the inventory.
- Persisted 362 RS-R7 inferred candidate trace links as durable `needs_confirmation` review links.
- Generated `docs/product/requirements/graph/views/rs-r7-review-queue.md`.
- Generated `docs/product/requirements/graph/generated/rs-r7-review-queue.json`.

Current graph after persist pass:

| Metric | Count |
|---|---:|
| Nodes | 700 |
| TraceLinks | 822 |
| Ledger entries | 38 |
| Manifestation nodes | 397 |
| Persisted RS-R7 review links | 362 |
| Total candidate links awaiting confirmation | 812 |
| Manifestations lacking requirement/exemption links | 302 |

RS-R7 is now past the persistence blocker, but it is still **PO confirmation pending**: the 812 candidate
links and 302 unlinked manifestations require confirmation, redirect, or exemption before implementation
coverage can be claimed.

## 2. Candidate Trace Links

### Auto-apply attempt
The original engine identified 3 high-confidence (0.85) technical trace links and attempted auto-apply:
| Source | Target | Confidence | Outcome |
|---|---|---|---|
| `src/main.tsx` | `RSP-AIM-SEED` | 0.85 | ❌ Removed — MAN node not persisted |
| `src/types/api.ts` | `RSP-AIM-SEED` | 0.85 | ❌ Removed — MAN node not persisted |
| `src/types/domain.ts` | `RSP-AIM-SEED` | 0.85 | ❌ Removed — MAN node not persisted |

**Root cause:** The engine's auto-apply path creates trace-link files and ledger entries but does not create the corresponding MAN- nodes. The graph validator correctly flags these as dangling. Since MAN-node creation requires product-code inventory approval, auto-apply cannot proceed without a prior pass that manifests the nodes.

**Audit amendment:** Codex added the pre-check. The engine now queues candidates when the source MAN node
does not exist, rather than writing invalid trace links.

### New candidate links discovered
| Queue | Count | Source |
|---|---|---|
| Engine-inferred candidates | **362** | RS-R7 engine inference |
| Persisted RS-R7 review links | **362** | Graph-backed `needs_confirmation` trace links |
| Persisted `candidateLinksAwaitingConfirmation` | **812** | 450 RS-R6 provisional + 362 RS-R7 review links |

The 362 engine-inferred candidates include the 3 links that were previously attempted as auto-apply.
They now sit in the persisted review queue with confidence/evidence and need PO confirmation.

---

## 3. Coverage Summary

| Metric | Count |
|---|---|
| Requirements in graph | 226 |
| Manifestations discovered in `src/**` | 387 |
| Manifestations in graph (persisted) | 397 |
| Requirements with 0 confirmed manifestations | 226 |
| Manifestations with 0 requirement/exemption links | 302 |
| Candidate links (RS-R7 persisted review links) | 362 |
| Candidate links (RS-R6 seed provisional) | 450 |
| Candidate links persisted awaiting confirmation | 812 |
| Auto-applied links after audit amendment | 0 |

### Requirement coverage by scope
| Scope | Requirements | Manifestations | Coverage |
|---|---|---|---|
| frontend | 85 | provisional only | 0% confirmed |
| product | 54 | provisional only | 0% confirmed |
| data | 46 | provisional only | 0% confirmed |
| security | 19 | provisional only | 0% confirmed |
| backend | 10 | provisional only | 0% confirmed |
| operations | 10 | provisional only | 0% confirmed |
| governance | 1 | provisional only | 0% confirmed |
| agent-workflow | 1 | provisional only | 0% confirmed |

Confirmed coverage remains 0% because review links are still `needs_confirmation`.

---

## 4. Exempt Work Classification

No exemptions have been classified yet. The 302 unlinked manifestations require either:
1. Link to a requirement (trace-link creation pending confirmation)
2. Explicit exemption classification (typed: infrastructure, refactoring, etc.)

---

## 5. Queues After RS-R7

| Queue | Count | Note |
|---|---|---|
| needsClassification | 0 | Clear |
| needsDecomposition | 218 | Requirements needing AC/RSP/EMC decomposition or maturation after Claude decisions |
| missingManifestations | 0 | Clear |
| partiallyImplemented | 0 | Clear |
| implementedUnverified | 0 | Clear |
| manifestationsLackingRequirements | **302** | Persisted MAN nodes with no requirement/exemption link yet |
| candidateLinksAwaitingConfirmation | **812** | 450 RS-R6 provisional + 362 RS-R7 review links |
| staleBrokenTraces | 0 | Clear |
| supersededStillInCode | 0 | Clear |
| testsDisconnected | 0 | Clear |
| verificationStale | 0 | Clear |
| exemptionsAwaitingReview | 0 | Clear |

---

## 6. Engine Issue — Dangling Trace Links

**What happened:** The reconciliation engine's `--mode inventory` pass detected 387 code manifestations. The auto-apply path evaluated candidate links and found 3 with confidence ≥ 0.80. It wrote trace-link JSON files and ledger entries, but the source MAN- nodes were never created in the graph. The `relationship-integrity` validator caught the dangling references.

**Resolution:** Removed the 3 orphan trace-link files and their 3 auto-applied ledger entries. Codex then
amended the engine so inventory mode does not write links whose source MAN node is absent. Validation
passes again (458 trace links, 35 ledger entries after audit self-trace).

**Follow-up after persist pass:** The review queue is now durable. PO/agent review must confirm, redirect,
or reject candidate links and classify the 302 unlinked manifestations.

---

## 7. PO Confirmation Required

The following batches need PO review before MAN-node creation and link confirmation can proceed:

### Batch 1: Frontend Island manifestations (~60 items)
Components under `src/builder/islands/` — map to `REQ-BC-*`, `REQ-FCS-*`, `REQ-SBC-*`, `REQ-VHB-*` families.

### Batch 2: Card component manifestations (~40 items)
Components under `src/builder/cards/` — map to `REQ-CRD-*`, `REQ-SBC-*`, `REQ-DM-*` families.

### Batch 3: Stage view manifestations (~25 items)
Components under `src/builder/stage/views/` — map to `REQ-STG-*`, `REQ-VL-*`, `REQ-SC-*` families.

### Batch 4: Action and store manifestations (~30 items)
Functions/hooks under `src/builder/actions/`, `src/actions/` — map to `REQ-DM-*`, `REQ-CR-*` families.

### Batch 5: UX/UI component manifestations (~40 items)
Components under `src/builder/ui/`, `src/ui/` — map to `REQ-BC-*`, `REQ-UP-*` families.

### Remaining
~192 items across `src/brand/`, `src/types/`, `src/rules/`, `src/hooks/`, `src/`, and misc directories.

**PO action:** Confirm, redirect, or reject the persisted RS-R7 review candidates by batch. Decisions must
be recorded in the decision ledger.

---

## 8. Non-blocking Notes

- The persisted `candidateLinksAwaitingConfirmation` queue now holds 812 links: 450 RS-R6 provisional +
  362 RS-R7 review links.
- `manifestationsLackingRequirements` is 302; these need confirmation, redirect, or exemption.
- `needsDecomposition` is 218 after Claude's PO-decision graph updates.
- No `src/` product code was changed.
