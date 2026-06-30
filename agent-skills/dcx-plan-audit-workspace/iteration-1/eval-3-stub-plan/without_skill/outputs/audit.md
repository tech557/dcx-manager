# Plan Audit: folder-structure-v2
**Audit date:** 2026-06-26
**Auditor:** Claude Code
**Question:** Is folder-structure-v2 ready to be activated?

---

## Verdict: NOT READY — do not activate

The plan explicitly states "DRAFT — DO NOT EXECUTE SPRINTS YET" and the conditions it sets for activation have not been met.

---

## Activation criteria stated in the plan

The plan requires all three discovery plans to complete and produce outputs before any sprint can be drafted:

| Required output | Location | Status |
|---|---|---|
| UX2-R1 (token verification) | ux-discovery-v2/output/ | **MISSING** |
| UX2-R2 (tailwind audit) | ux-discovery-v2/output/ | **MISSING** |
| UX2-R3 (visual synthesis) | ux-discovery-v2/output/ | **MISSING** |
| FE2-R1 (architecture audit) | frontend-discovery-v2/output/ | **MISSING** |
| FE2-R2 (state hook analysis) | frontend-discovery-v2/output/ | **MISSING** |
| FE2-R3 (refactorability) | frontend-discovery-v2/output/ | **MISSING** |
| BE2-R1 (type system) | backend-discovery-v2/output/ | **MISSING** |
| BE2-R2 (service audit) | backend-discovery-v2/output/ | **MISSING** |
| BE2-R3 (integration gap) | backend-discovery-v2/output/ | **MISSING** |

All nine output files are absent. The output/ directories for all three discovery plans exist but contain no files.

---

## Discovery plan statuses

| Plan | Status | Sprint files exist | Output files exist |
|---|---|---|---|
| ux-discovery-v2 | drafted | Yes (3 sprints) | No |
| frontend-discovery-v2 | drafted | Yes (3 sprints) | No |
| backend-discovery-v2 | drafted | Yes (3 sprints) | No |

None of the three dependency plans have been executed. They are all still in `drafted` status. Their sprint files exist but have not been run.

---

## What the plan cannot do without those outputs

The plan is explicit about why the outputs are required before drafting sprints:

- Sprint scope (file counts, which components move) depends on FE2-R3 and UX2-R3
- Before/After metrics table has 7 of 8 rows marked TBD, to be filled by the discovery outputs
- Dep-cruiser violation count is listed as "unknown pre-P1" and must be measured by FE2-R1
- Files over 250-line cap post-P1 are unknown — must be measured by FE2-R1
- Token cleanup scope (raw hex usages remaining after P1) depends on UX2-R1
- Arbitrary font size file count post-P1 depends on UX2-R2

Without this data, sprints P1–P4 cannot be correctly scoped. The sprint table in the plan has no sprint files — only stub placeholders with "Not drafted" status.

---

## What is complete and sound

- The plan's rationale is solid and internally consistent
- Inherited decisions from src-structure-refactor are correctly documented (6 decisions, all with clear reasoning)
- Execution gates are defined (typecheck, lint, validate:architecture, test, browser)
- Prior art has been read and correctly superseded
- The folder-structure-v2 plan itself is a well-formed stub

---

## Path to activation

Activation requires completing the three discovery plans in sequence or in parallel:

1. Execute all sprints in `ux-discovery-v2` (UX2-R1, UX2-R2, UX2-R3) and confirm outputs land in `output/`
2. Execute all sprints in `frontend-discovery-v2` (FE2-R1, FE2-R2, FE2-R3) and confirm outputs land in `output/`
3. Execute all sprints in `backend-discovery-v2` (BE2-R1, BE2-R2, BE2-R3) and confirm outputs land in `output/`
4. Once all 9 output files exist, draft sprints P1–P4 using that data
5. Move folder-structure-v2 from `drafted/` to `active/` only after sprints are drafted and PO approves

The discovery plans are independent of each other and can run in parallel.
