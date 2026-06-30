---
audit-of: requirements-system
auditor: codex
date: 2026-06-29
verdict: NOT READY
blocking-issues: 5
advisory-issues: 2
---

# Plan Audit: requirements-system Re-audit

## Verdict

NOT READY

**Reason:** Claude resolved the first audit's process blockers, but the revised plan still does not require a concrete cross-scope requirements object model, lock model, plan-output trace contract, or human editing/preview tooling evaluation.

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | RS-R0, RS-R2a, RS-R3 | The plan still treats requirements as one generic record instead of defining a cross-scope requirements taxonomy and derivation model. | README goal says "product + technical decisions" at lines 30-33, and RS-R0 schema fields include only generic `domain`/`affected-modules` at lines 18-20. There is no required model for `product`, `frontend`, `backend`, `devops`, `test/QA`, `data`, `security`, or `operations` requirements, nor a rule that product requirements are usually the locked source from which technical/test requirements derive. | Add an RS-R0 deliverable: a requirements object model with `scope/type` taxonomy, parent/child or derives-from links, dependency direction, ownership, verification mode, and examples for product → frontend/backend/devops/test decomposition. RS-R2a validators must enforce allowed scope/type values and derivation links. RS-R3 must classify migrated requirements into this model. |
| 2 | RS-R0, RS-R2a, RS-R2b | The "lock requirements" target is not modeled as a first-class lifecycle state. | README lines 41-46 cover sign-off and supersession, but there is no explicit lifecycle such as `draft/proposed/approved/locked/superseded/archived`, no lock owner, no lock date, and no rule that locked product requirements cannot be mutated except by governed supersession. | RS-R0 must define requirement lifecycle states and lock semantics. RS-R2a must validate illegal edits to locked records. RS-R2b must make the apply workflow create new ledger entries or supersessions rather than mutating locked truth. |
| 3 | RS-R0, RS-R4 | The dogfood dataset does not require Claude to model the new requirements-system requirements themselves across product/frontend/backend/devops/test. | README first usage lines 66-73 only ingests D-01..D-12, core-model alignments, and recovered builder requirements. RS-R4 lines 13-20 repeats that dataset. The PO explicitly wants this plan to add sample requirements like the requirements-system feature itself, plus product/front/back/test/devops examples, to prove the structure can break them down. | Add RS-R0 examples and RS-R4 dogfood entries for the requirements-system feature: product requirement, frontend/human-edit view requirement, backend/store or automation requirement, devops/tooling requirement, test/validation requirement, and agent-workflow requirement. Each should show derivation from a product/source requirement and trace to technical manifestations where applicable. |
| 4 | RS-R5, RS-R6, future plans | The exact plan-output trace format is still missing. | README lines 51-56 and RS-R5 lines 11-18 say planner/audit enforce requirement-ID grounding and code-index traces, but no sprint defines the required section every activated plan/output must contain. RS-R6 lines 13-16 only says FP-R4/FP-R5 cite system IDs. | Define a mandatory generated "Requirement Trace" section for every plan and sprint output: requirement IDs, scope/type, source/locked status, acceptance criteria, affected files/classes/functions/selectors/scripts, tests/gates, impact/dependency notes, and implementation status. `dcx-sprint-planner` should fail plans missing it; `dcx-plan-audit` should fail unverifiable or ungrounded traces. |
| 5 | RS-R0, RS-R2b | Human editing/preview and low-token agent consumption are underspecified. | README line 37-40 requires human-editable/generated views, and RS-R2b lines 14-18 says generated human/agent views, but no requirement asks Claude to evaluate actual editing/preview surfaces or low-token query slices. The PO specifically asked for large-file preview/edit tools like Obsidian and for agents to use locked requirements without spending too many tokens. | Add an RS-R0 tool-evaluation deliverable comparing local/editable surfaces and generated views: spreadsheet/CSV, SQLite browser or lightweight admin, Obsidian-style graph/markdown preview, generated docs, and agent query CLI. Require a low-token contract: agents read a small generated manifest/query result by ID/scope/feature, not the whole store. RS-R2b must implement the chosen generated views/query commands. |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | RS-R0 | RS-R0 still says "Evaluate storage options against the 6 hard constraints" even the README now has 9. | RS-R0 line 15 says 6; README lines 35-59 lists 9. | Change RS-R0 line 15 to "all README hard constraints". |
| 2 | RS-R2a, RS-R2b | Gate shorthand is inconsistent with exact command requirements. | RS-R2a line 23 says `lint`, `validate:architecture`, `test`; RS-R2b line 28 says `lint`, `test` instead of full commands. | Use exact commands everywhere: `npm run lint`, `npm run validate:architecture`, `npm run test`. |

## Prior art compliance

The prior audit blockers #1-#7 are materially addressed: the revised README includes session logs and `docs/progress/index.csv` as first-class sources, deterministic source manifests, carry-forward obligations, standard gates/fallbacks, correct archival policy direction, RS-R2 split, skill wiring, code-index reuse, and RS-R6 as brief-only.

The remaining gap is not prior-art compliance; it is target fit. The plan now wires a governed system, but does not yet force Claude to design the requirement structure deeply enough for product/devops/backend/frontend/test scopes, locked product-source requirements, derived technical requirements, and plan-level mechanical traces.

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| RS-R0 | N/A | N/A | N/A | N/A | N/A | Design sprint; needs expanded object model/tooling deliverables. |
| RS-R1 | N/A | N/A | N/A | N/A | N/A | Discovery/map sprint; deterministic manifest now present. |
| RS-R2a | Listed | Listed shorthand | Listed shorthand | Listed shorthand | N/A | Needs exact command wording and validators for scope/type/lifecycle/lock model. |
| RS-R2b | Listed | Listed shorthand | Missing | Listed shorthand | N/A | Should include generated low-token query/view commands and exact gates. |
| RS-R3 | Global gates | Global gates | Global gates | Global gates | N/A | Migration must classify records into the scope/type model. |
| RS-R4 | Global gates | Global gates | Global gates | Global gates | N/A | Dogfood should include requirements-system requirements, not only builder session decisions. |
| RS-R5 | Listed | Listed shorthand | Listed shorthand | Listed shorthand | N/A | Needs mandatory plan-output trace format. |
| RS-R6 | N/A | N/A | N/A | N/A | N/A | Brief-only shape is fixed. |

## Handoff quality

Handoff quality is improved but not yet safe for the PO's target. An executing agent can now follow the sprint sequence, but RS-R0 can still choose a storage/schema design that lacks the structural richness the PO needs. Claude should add a required RS-R0 section that shows the final shape with concrete sample records: one product source requirement, derived frontend/backend/devops/test requirements, locked/superseded examples, plan-output trace examples, and a low-token agent query example.

## Ready checklist

- [ ] All blocking issues resolved
- [ ] Prior art findings incorporated
- [ ] Every sprint has executor named
- [ ] Every code-modifying sprint has gate coverage
- [ ] Session start steps present in each sprint
- [ ] (2+ sprints) Carry-forward contract present; every sprint reads it (Step 0) and updates it (final step)
- [ ] Tool-dependent criteria have a documented fallback (core.md §28)
- [ ] Requirement taxonomy covers product/frontend/backend/devops/test and derived requirement relationships
- [ ] Locked requirement lifecycle is modeled and validator-backed
- [ ] Plan-output trace format is mandatory and enforceable
- [ ] Human edit/preview tooling and low-token agent query surfaces are evaluated in RS-R0
