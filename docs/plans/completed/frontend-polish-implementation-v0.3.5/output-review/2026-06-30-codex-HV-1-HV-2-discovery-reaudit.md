---
review: HV-1-HV-2-discovery-reaudit
reviewer: Codex / GPT-5 / OpenAI
date: 2026-06-30
plan: frontend-polish-implementation-v0.3.5
scope:
  - tasks/HV-1-HV-2-component-signoff.md
  - tasks/HV-1-home-spec.md
  - tasks/HV-2-version-spec.md
  - sprints/HV-1.md
  - sprints/HV-2.md
  - README.md
verdict: NEEDS TARGETED REVISION
---

# HV-1 / HV-2 Discovery Re-Audit

## Verdict

**NEEDS TARGETED REVISION before HV-1/HV-2 execution.** Claude addressed the prior audit's main blockers:
Home route is now `/`, global dashboard scope is no longer hidden behind `useVersionsQuery('dcx-1')`,
backend-dependent ClickUp/Supabase work is split as a mock-contract decision, shared Brand/User blocks
are in the sign-off list, `VersionStructureSummary` has a data-only builder-tree source, graph authority
is caveated, and the planning work is logged.

The remaining issues are mostly handoff consistency problems. One is execution-blocking: HV-1 is ordered
before HV-2 but depends on the `REQ-VER-ROOM` supersession that the docs currently assign to HV-2.

## Findings

### P1 — HV-1 cannot safely implement card navigation before the `REQ-VR-001` supersession is applied

Evidence:
- Sprint order keeps **HV-1 before HV-2** (`README.md:79-80`).
- HV-1 says Home card navigation to `/version/:id` must **not** be implemented until `REQ-VER-ROOM` and its
  `supersedes` TraceLink are applied (`sprints/HV-1.md:18-19`).
- HV-2 is the sprint that proposes `REQ-VER-ROOM` / supersedes `REQ-VR-001` (`sprints/HV-2.md:18-29`,
  `tasks/HV-2-version-spec.md:121-128`).
- Current router already has `/version/:versionId` (`src/router.tsx:13-16`), but the requirements graph
  remains the authority for allowed behavior.

Impact:
HV-1's acceptance says users can find and enter a version, but HV-1 is told not to implement that route
behavior until a requirement change assigned to the later sprint. This creates a graph-governance deadlock.

Recommendation:
Pick one explicit resolution before execution:
- Move the `REQ-VER-ROOM` proposal/supersession into HV-1 Step 0, before Home card navigation is built.
- Or reorder HV-2 before HV-1.
- Or narrow HV-1 acceptance so card navigation remains pending until HV-2, with a visible deferred state.

### P1 — HV-1 dashboard "Active" target is inconsistent: DCXs in the spec, versions in the sprint

Evidence:
- Home spec defines **# Active** as "count of DCXs whose status is not `Approved` and not `Superseded`"
  (`tasks/HV-1-home-spec.md:52-60`).
- HV-1 sprint restates it as "versions whose status is not `Approved` and not `Superseded`"
  (`sprints/HV-1.md:18-23`).
- The same sprint correctly flags that current `useVersionsQuery(dcxId)` is per-DCX and cannot compute
  total DCXs/global filters (`sprints/HV-1.md:22`, `src/queries/versions.queries.ts:6-13`).

Impact:
An executor could implement a version-count statistic while the PO asked for an active-DCX count. This
also affects D-6 because the mock/service seam must model DCX-level analytics, not only version status
counts.

Recommendation:
Make HV-1 consistently say **Active DCXs** everywhere, and define how the mock dashboard seam derives
campaign/DCX status from member versions.

### P1 — The sign-off block can be completed without resolving the actual HV-1 blockers D-6 and D-7

Evidence:
- D-6 and D-7 are explicitly open before HV-1 (`tasks/HV-1-home-spec.md:157-164`,
  `sprints/HV-1.md:22-29`, `README.md:104-117`).
- The final component sign-off checklist asks only for H-G1, H-G5, V-G4, and V-G6 decisions
  (`tasks/HV-1-HV-2-component-signoff.md:328-337`).
- It omits H-G7/H-G8 and D-6/D-7, which are the blockers introduced specifically to answer the prior audit.

Impact:
The PO could mark the component sheet signed off while the dashboard data scope and backend/mock split
remain undecided, allowing HV-1 to start with the two highest-risk data decisions unresolved.

Recommendation:
Add explicit sign-off rows for **D-6 / H-G7** and **D-7 / H-G8**. Make `status: SIGNED OFF` invalid unless
those rows are approved or deliberately deferred with a narrowed HV-1 scope.

### P2 — Several "resolved/open" labels are stale and may mislead executors

Evidence:
- Component sign-off Page 1 says D-1/D-2/D-3 are open, but the Home spec marks them resolved and D-6/D-7
  as open (`tasks/HV-1-HV-2-component-signoff.md:62-65`, `tasks/HV-1-home-spec.md:150-164`).
- Component sign-off Page 2 says D-4/D-5 are open, but the Version spec marks D-1/D-4/D-5 resolved
  (`tasks/HV-1-HV-2-component-signoff.md:168-172`, `tasks/HV-2-version-spec.md:132-141`).
- HV-1 handoff says to resolve D-1/D-2/D-3 "if still open," but the remaining blockers are D-6/D-7
  (`tasks/HV-1-home-spec.md:173-178`).

Impact:
The body of the docs contains the right decisions, but the top-of-page/handoff summaries point to the
wrong unresolved items.

Recommendation:
Update the summaries and HV-1 handoff to state: D-1/D-2/D-3 resolved; **D-6/D-7 must be resolved before
HV-1 coding**. Update Page 2 to state D-1/D-4/D-5 resolved.

### P2 — HV-2 still has stale "preview" language after choosing no builder visual

Evidence:
- D-5 resolves Option B: no builder visual, branded launch + structure summary (`tasks/HV-2-version-spec.md:63-79`,
  `tasks/HV-2-version-spec.md:137-139`, `sprints/HV-2.md:18-29`).
- The coverage map still says "Inert preview only" and names `VER-PREVIEW-LAUNCH`
  (`tasks/HV-2-version-spec.md:104`), while the candidate table uses `REQ-VER-LAUNCH`
  (`tasks/HV-2-version-spec.md:121-128`).
- HV-2 scope still says "summary/mini-preview" (`sprints/HV-2.md:42-44`).

Impact:
An executor could build a preview-like surface despite the settled no-preview decision, risking a
`src/builder/**` boundary mistake or unplanned architecture work.

Recommendation:
Replace "mini-preview"/"inert preview"/`VER-PREVIEW-LAUNCH` with **branded launch panel + structure
summary** / `REQ-VER-LAUNCH` everywhere.

### P3 — README candidate count is off by one

Evidence:
- Home stages 14 candidates (`README.md:104-105`, `tasks/HV-1-home-spec.md:129-144`).
- Version stages 8 candidates (`README.md:105-106`, `tasks/HV-2-version-spec.md:119-128`).
- README says 21 total (`README.md:85-89`); the visible total is 22.

Impact:
Low execution risk, but it makes the support document look less precise than it otherwise is.

Recommendation:
Update the count to **22 staged candidates** or remove the exact total.

## Prior Audit Resolution Check

| Prior finding | Current state | Result |
|---|---|---|
| HV-1 route `/home` was wrong | HV-1 Web Check now uses `/`; router evidence is `/` index | Fixed |
| `useVersionsQuery('dcx-1')` treated as global | D-6/H-G7 now flags per-DCX limitation | Fixed, pending PO decision |
| Backend create/analytics not split | D-7/H-G8 now defines mock-contract vs live integration | Fixed, pending PO decision |
| Brand/User blocks missing from sign-off | `PageBrandBlock` and `PageUserBlock` added | Fixed |
| Structure summary lacked data source | `useBuilderTreeQuery` / `builder.service.ts` approved as data-only | Fixed |
| Graph authority overstated | Specs and sprints now warn candidates are not canonical until applied | Fixed, but creates P1 execution-order issue above |
| Planning work unlogged | Claude log `036-hv-discovery-spec-and-audit-revision.md` exists | Fixed |

## Recommended Next Patch

1. Move or pre-apply the `REQ-VER-ROOM` supersession before HV-1 card navigation, or reorder HV-2 before HV-1.
2. Normalize HV-1 analytics wording to **Active DCXs**, not active versions.
3. Add D-6/D-7 rows to the final sign-off block.
4. Clean stale D-status summaries and HV-2 preview wording.
5. Correct the README staged-candidate count.

After those changes, this discovery package should be ready as a strong supporting document for HV-1 and
HV-2 execution.
