---
review: RS-R11-codex-output-audit
sprint: RS-R11
plan: requirements-system
agent: Codex (GPT-5)
date: 2026-06-30
status: PASS_WITH_CAVEATS
scope: Audit Claude RS-R11 output and recommend frontend-polish disposition
---

# RS-R11 — Codex Output Audit

## Verdict

**PASS_WITH_CAVEATS.** Claude's RS-R11 output is directionally correct and fit for hand-off: it does
not mean "0 linked requirements." It means **0 frontend requirements are currently delivery-confirmed
as implemented or verified**. The graph already has many candidate implementation links, but they are
mostly provisional and must be confirmed/corrected during the frontend-polish re-grounding work.

RS-R11 is therefore a good warning, not a catastrophe. It correctly tells FP-R4/FP-R5 to stop treating
old discovery criteria as proof and to re-ground implementation planning on graph IDs, coverage, and
evidence.

## Evidence Checked

| Source / command | Result |
|---|---|
| `npm run req:validate` | PASS; 0 errors; 1 pre-existing warning `QST-VR-011` |
| Direct graph count from `nodes/requirement` + `trace-links` | 104 frontend requirements; all 104 `delivery: not-assessed`; 283 `implements` trace links; 238 `implements` links still needing confirmation; 688/898 total links needing confirmation |
| `npm run req:trace -- --from REQ-SBC-001` | Returned top-down chain plus candidate/partial links to `TaskCard`, `DropTarget`, `Select`; proves linked graph context exists |
| `npm run req:justify -- --manifestation MAN-react-component-taskcard-taskcard` | Returned superseded alias pointing to canonical TaskCard manifestation; confirms Claude's calibration-debt example |
| `views/rs-r7-review-queue.md` | 238 active RS-R7 candidate links; 54 canonical manifestations in review; 223 unlinked canonical manifestations |
| `output/RS-R11-reground-brief.md` | Contains graph ID map, coverage-gap map, calibration-debt convention, and downstream PO reactivation boundary |

## Findings

| Severity | Finding | Evidence | Recommendation |
|---|---|---|---|
| Low | Claude's headline can be misread as "0 linked requirements." | The graph has 283 `implements` links and `REQ-SBC-001` traces to candidate manifestations; the 0 count is specifically delivery state: implemented/verified. | Keep RS-R11, but downstream plans should phrase this as "0 delivery-confirmed frontend requirements" to avoid panic. |
| Low | "All frontend reqs are approved" is slightly over-broad. | Direct count found 102 approved + 2 proposed frontend requirements: `REQ-BC-025`, `REQ-DZ-001-RECOVERY`. | FP-R4/FP-R5 should preserve the two proposed states instead of flattening them to approved. |
| Low | The 223 unlinked-manifestation count is queue-derived, not the same as a direct `scope: frontend` node/link count. | `rs-r7-review-queue.md` says 223; a direct canonical frontend-only count from node/link files found 185 unlinked. Different counting boundaries explain the mismatch. | Future outputs should cite "RS-R7 queue count" when using 223 and avoid mixing it with direct frontend-scope counts. |
| Medium | RS-R11 closes the hand-off sprint, but does not by itself close the requirements-system plan. | Claude's session log lists follow-ups: RS-R8 header, stale DoD checkboxes, plan-level `dcx-sprint-close`. | Do not treat the whole requirements-system plan as cleanly closed until those plan-close tasks run. |

## Frontend-Polish Disposition

The on-hold `frontend-polish-v0.3.5` plan should **not** be resumed unchanged, and it should **not** be
thrown away wholesale.

What remains useful:
- `FP-R0` live-builder inventory.
- `FP-R1` brand reconciliation and `brand-ui-interpretation.md`.
- `FP-R2` token audit metrics.
- `FP-R3` modularization audit.
- `core-interaction-model.md`.
- The three-family execution model: `change-token`, `change-component`, `wire-mockup-data`.

What is invalidated:
- `FP-R4-finalize-spec.md` as the active behavior source.
- `FP-R5-synthesis.md` as an executable implementation matrix.
- Any old criterion that cites legacy `BLD-*` / `OD-*` IDs as source of truth instead of canonical graph IDs.

Recommended PO path:

1. **Do not archive it as completed now.** It is on-hold because two outputs are invalidated, so completed would be misleading.
2. **Do not run a brand-new discovery from zero.** That would repeat valid FP-R0/R1/R2/R3 work and lose useful evidence.
3. **Preferred path:** PO reactivates the existing plan only for a bounded re-grounding revision: redo FP-R4 and FP-R5 from RS-R11, preserve valid prior outputs as prior art, then close the discovery plan.
4. **If the PO wants a cleaner paper trail:** draft a replacement discovery/implementation-planning plan with `prior-art: on-hold/frontend-polish-v0.3.5`, copy forward only the valid outputs above, then move the old on-hold plan to `expired/` as superseded. That is cleaner than pretending the old plan completed.

## Bottom Line

RS-R11 gives enough clarity to proceed. The next decision is not "panic or no panic"; it is a lifecycle
choice:

- **Fastest:** reactivate on-hold FP only to redo FP-R4/R5, then close it.
- **Cleanest:** create a replacement graph-grounded frontend-polish planning plan and expire the old
  on-hold plan as prior art.

Either way, FP-R4/R5 must be graph-grounded and must treat provisional links as review input, not proof.
