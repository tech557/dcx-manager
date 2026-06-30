---
output: RS-R7-identity-normalization
plan: requirements-system
sprint: RS-R7
agent: Codex
date: 2026-06-29
status: completed-with-deferred-cleanup
---

# RS-R7 Identity Normalization

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | RS-R7, REQ-GOV-TRACE-001, REQ-GOV-TRACE-001-DATA, REQ-GOV-TRACE-001-AGENT |
| Scope/type | data/governance — initial code reconciliation, identity normalization, deferred cleanup queue |
| Source/lock | PO close-out direction on 2026-06-29: imperfect graph data is acceptable and reversible; uncontrolled source-code mutation is not |
| Acceptance outcomes | Manifestations inventoried, duplicate MAN identities normalized, candidate links queued canonically, questionable mappings deferred, source-code mutation boundary recorded |
| Responsibilities | Durable manifestation inventory, canonical review queue, reversible audit history, cleanup queue, no source-code authorization from trace data |
| Expected manifestations | Normalization command, graph node/link updates, canonical review queue, deferred cleanup queue, sprint output/carry-forward |
| Actual manifestations | `scripts/requirements/normalize-rs-r7-identities.ts`, `generated/rs-r7-review-queue.json`, `generated/rs-r7-identity-normalization.json`, `views/rs-r7-deferred-cleanup-queue.md` |
| Evidence | `npm run req:normalize-rs-r7-identities`, `npm run req:validate`, `npm run req:completion-gate`, `bash scripts/agent/verify-frontend.sh` |
| Gate result | PASS WITH DOCUMENTED DEBT — mapping cleanup remains queued; no product `src/**` changes |

## Result

RS-R7 bulk PO confirmation has **not** been performed. Per PO direction on 2026-06-29, RS-R7 may close
with imperfect mappings when unresolved items are visible, auditable, reversible, and queued for later
cleanup. This pass normalized duplicate manifestation identities first, then regenerated the review queue
by canonical manifestation.

| Metric | Before | After |
|---|---:|---:|
| Raw RS-R7 candidate links | 362 | 238 active canonical candidates |
| Duplicate identity groups | 121 | 0 active duplicate relationship groups |
| Superseded MAN aliases preserved | 0 | 121 |
| Redirected candidate links | 0 | 124 |
| Merged duplicate candidates | 0 | 46 |
| Canonical manifestations in PO review | N/A | 54 |
| Unlinked canonical manifestations | 302 raw/unconfirmed | 223 canonical/unconfirmed |

## Generated Artifacts

| Artifact | Purpose |
|---|---|
| `docs/product/requirements/graph/generated/rs-r7-review-queue.json` | Canonical-manifestation PO review queue |
| `docs/product/requirements/graph/views/rs-r7-review-queue.md` | Human summary of normalized batch counts |
| `docs/product/requirements/graph/generated/rs-r7-identity-normalization.json` | Alias map, counts, duplicate-relationship validation |
| `LDG-2026-06-29-RS-R7-IDENTITY-NORMALIZATION` | Ledger entry for the normalization pass |
| `docs/product/requirements/graph/views/rs-r7-deferred-cleanup-queue.md` | Deferred cleanup queue for questionable mappings |

## PO Review Batches

| Batch | Candidate links | Canonical manifestations | Recommended PO action |
|---|---:|---:|---|
| `actions-store` | 1 | 1 | Confirm or reject directly |
| `card-components` | 23 | 4 | Review by card template; partial-confirm likely |
| `stage-views` | 18 | 6 | Review by view surface |
| `frontend-islands` | 35 | 10 | Review by island; redirect over-broad matches |
| `ux-ui-components` | 48 | 11 | Review shared atoms carefully; many links may be support-only |
| `remaining` | 113 | 22 | Split into services/types/app-entry/utilities before bulk decisions |

## Example Canonical Manifestations

| Canonical manifestation | Source path | Symbol | Suggested links | Recommended decision |
|---|---|---|---|---|
| `MAN-function-src-actions-action-guards` | `src/actions/action.guards.ts` | `action.guards` | `REQ-PR-008` | Confirm if permission/action guard is the intended manifestation |
| `MAN-react-component-src-builder-cards-templates-action-actioncard` | `src/builder/cards/templates/action/ActionCard.tsx` | `ActionCard` | `REQ-DM-004`, `REQ-DM-015`, `REQ-RV-007`, `REQ-SBC-002`, `REQ-SBC-004`, `REQ-VR-003` | Partially confirm; reject links that are only incidental text similarity |
| `MAN-react-component-src-builder-cards-templates-phase-phasecard` | `src/builder/cards/templates/phase/PhaseCard.tsx` | `PhaseCard` | `REQ-BC-004`, `REQ-DM-016`, `REQ-RV-006`, `REQ-SBC-002`, `REQ-SBC-003`, `REQ-VR-003` | Partially confirm; keep card/rendering links separate from data-model links |
| `MAN-react-component-src-builder-stage-views-daygridcard` | `src/builder/stage/views/DayGridCard.tsx` | `DayGridCard` | `REQ-BC-007`, `REQ-BC-008`, `REQ-DM-005` | Confirm only the day/grid behavior it materially implements |
| `MAN-react-component-src-builder-islands-editorviewerisland-taskeditor-taskeditor` | `src/builder/islands/EditorViewerIsland/TaskEditor/TaskEditor.tsx` | `TaskEditor` | 16 suggested requirements | Split before PO decision; likely mixed confirm/redirect/reject |
| `MAN-react-component-src-ui-atoms-badge` | `src/ui/atoms/Badge.tsx` | `Badge` | `REQ-BC-010`, `REQ-RV-013`, `REQ-VL-005`, `REQ-VL-013` | Confirm support/display roles only; avoid treating atom usage as full requirement coverage |

## Validation

| Check | Result |
|---|---|
| Duplicate active requirement-manifestation relationships | PASS — 0 |
| Graph validation | PASS, with existing `QST-VR-011` maturation warning |
| Completion gate for changed tooling | PASS |
| RS-R7 completion | PASS WITH DOCUMENTED DEBT — mapping cleanup deferred and queued |

## PO Options Per Canonical Manifestation

- Confirm all suggested links for the manifestation.
- Partially confirm only the links the artifact materially implements.
- Redirect a suggested link to a better canonical manifestation.
- Reject a weak or incidental similarity match.
- Exempt the manifestation as governed technical work when it is meaningful but not requirement-backed.

## Source-Code Mutation Boundary

No trace link, inferred requirement, provisional mapping, or coverage score created by RS-R7 authorizes a
product source-code change. Every future `src/**` change still requires a separate explicit implementation
plan with intended behavior, affected requirements, affected files/manifestations, expected code changes,
tests and verification, and PO approval or the required gate.

## Deferred Cleanup Queue

Questionable mappings remain open in:

`docs/product/requirements/graph/views/rs-r7-deferred-cleanup-queue.md`

This debt is accepted for RS-R7 close because it is visible, auditable, reversible, and blocked from
mutating source code without a later implementation plan.
