---
output: RS-R7-po-confirmation-brief
plan: requirements-system
sprint: RS-R7
agent: Codex
date: 2026-06-29
status: support-brief-po-confirmation-pending
source_queue: docs/product/requirements/graph/generated/rs-r7-review-queue.json
---

# RS-R7 PO Confirmation Brief

## Purpose

RS-R7 is past the persistence blocker, but it is still not complete. The remaining gate is PO confirmation
of the persisted review queue: confirm, redirect, or reject candidate links, and classify unlinked
manifestations as either requirement-backed or exempt technical work.

This brief summarizes the persisted queue generated at `2026-06-29T16:46:29.616Z`.

## Current Gate

| Item | Count | Required action |
|---|---:|---|
| Persisted RS-R7 candidate links | 362 | Confirm, redirect, or reject by batch |
| Total `candidateLinksAwaitingConfirmation` | 812 | Includes 450 RS-R6 provisional links + 362 RS-R7 links |
| Manifestations lacking requirement/exemption links | 302 | Link to a requirement or create typed exemption |
| Confirmed implementation coverage | 0% | Do not claim coverage until confirmations are ledgered |

## Batch Summary

| Batch | Candidate links | Sample coverage in generated examples | Review note |
|---|---:|---|---|
| `remaining` | 123 | 20 examples, 11 unique paths, 15 requirements | Mixed services, types, app entry, utilities; review in smaller sub-batches |
| `ux-ui-components` | 93 | 20 examples, 4 unique paths, 10 requirements | High duplicate density around shared UI atoms; confirm at component-path level first |
| `frontend-islands` | 68 | 20 examples, 5 unique paths, 10 requirements | Island files carry repeated manifestation identity variants |
| `card-components` | 46 | 20 examples, 3 unique paths, 10 requirements | Card templates map to several behavior/data-model requirements |
| `stage-views` | 31 | 20 examples, 6 unique paths, 7 requirements | Stage view mappings include duplicated path variants |
| `actions-store` | 1 | 1 example, 1 path, 1 requirement | Small enough to decide directly |

## Identity-Deduplication Risk

The generated examples show repeated candidates for the same physical path with different manifestation IDs.
Examples:

| Path | Example repeated mappings |
|---|---|
| `src/builder/islands/KanbanBuilderIsland/KanbanBuilderIsland.tsx` | `REQ-AIC-001`, `REQ-BC-023`, `REQ-BC-025` each appear against both short and path-derived MAN IDs |
| `src/builder/islands/EditorViewerIsland/TaskEditor/TaskEditor.tsx` | `REQ-BC-006`, `REQ-BC-010`, `REQ-BC-011` each appear against both short and path-derived MAN IDs |
| `src/builder/cards/templates/task/TaskCard.tsx` | `REQ-BC-003`, `REQ-BC-006`, `REQ-BC-011`, `REQ-DM-002` repeat across duplicate MAN IDs |
| `src/ui/forms/selects/Select.tsx` | `REQ-BC-009`, `REQ-BC-016`, `REQ-DM-021`, `REQ-EVI-001` repeat across duplicate MAN IDs |

Before bulk confirmation, the PO/agent reviewer should choose the canonical manifestation identity when
two MAN IDs represent the same meaningful artifact. Otherwise RS-R7 may confirm duplicate links and inflate
coverage.

## Recommended Review Order

1. Confirm the single `actions-store` candidate first to prove the ledger update path.
2. Review `card-components` and `stage-views` next, because their examples are concentrated in a few
   recognizable files and duplicate identities are easy to detect.
3. Review `frontend-islands` and `ux-ui-components` by physical path, not by raw link count.
4. Split `remaining` into services/types/app-entry/utilities before PO review; it is too mixed for one
   decision batch.
5. After each confirmed batch, run `npm run req:validate` and regenerate views before proceeding.

## PO Decision Needed

| Decision | Options | Why it matters |
|---|---|---|
| Batch confirmation strategy | Confirm by raw link, by physical path, or by canonical MAN identity | Prevents duplicate identity confirmation and inflated coverage |
| Duplicate MAN handling | Pick canonical MAN IDs now, or confirm links and clean identities later | Earlier cleanup makes RS-R8 evidence binding cleaner |
| Exemption pass | Classify unlinked manifestations before or after candidate-link confirmation | Determines whether the 302 unlinked manifestations block RS-R7 close |

## Completion Boundary

This brief does not close RS-R7. RS-R7 can close only after:

- PO confirms/redirects/rejects the ambiguous mapping batches.
- Decisions are recorded in the decision ledger.
- Confirmed links or exemptions are applied to the graph.
- `npm run req:validate` and `npm run req:reconcile -- --mode inventory` pass after confirmation.
