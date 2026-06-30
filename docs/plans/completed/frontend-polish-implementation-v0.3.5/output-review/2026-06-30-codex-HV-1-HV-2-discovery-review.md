# HV-1 / HV-2 Discovery Output Review

Agent: Codex / GPT-5 / OpenAI  
Date: 2026-06-30  
Reviewed artifacts:
- `tasks/HV-1-HV-2-component-signoff.md`
- `tasks/HV-1-home-spec.md`
- `tasks/HV-2-version-spec.md`
- `sprints/HV-1.md`
- `sprints/HV-2.md`
- current route/query/type files used as evidence

## Verdict

⚠️ **NEEDS REVISION before HV-1/HV-2 execution.**

The discovery is directionally strong: it correctly prevents v0.1.4 copy/paste, keeps Home/Version outside `src/builder/**`, stages new requirement candidates instead of silently mutating the graph, and introduces useful PO sign-off gates.

But several execution blockers remain. If HV-1/HV-2 start from this state, an executor can hit failed browser proof, unclear data boundaries, or a self-imposed "cannot create needed component" block.

## Findings

### P1 — HV-1 browser route is wrong (`/home` vs `/`)

`tasks/HV-1-HV-2-component-signoff.md` correctly records Home route as `/` at line 67, and the actual router only defines Home as the index route under `/` (`src/router.tsx:10-14`). But `sprints/HV-1.md:48-49` still instructs the PO Web Check to use `/home`. There is no `path: 'home'` route in `src/router.tsx`, so the HV-1 browser gate will navigate to a route that does not exist unless the executor adds a route or silently interprets the sprint differently.

**Fix:** revise HV-1 PO Web Check to route `/` unless the intended implementation is to add `/home` as an alias. If adding an alias is intended, state that explicitly in HV-1 scope and requirement trace.

### P1 — Home data source cannot satisfy "all DCXs / client / project" with `useVersionsQuery('dcx-1')`

The Home spec requires total DCXs, all versions, Client/Project filters, and search across version properties (`tasks/HV-1-home-spec.md:52-83`). The component sign-off then tells the executor to start Home with `useVersionsQuery('dcx-1')` (`tasks/HV-1-HV-2-component-signoff.md:130`), but the current query API only lists versions for one `dcxId` (`src/queries/versions.queries.ts:6-13`). That can only show one campaign's versions and cannot compute `# Total DCXs`, filter across Client/Project globally, or represent the "one campaign = one DCX with many versions" Home dashboard.

**Fix:** before HV-1, choose and document one of these:
- add a scoped dashboard/DCX query/mock seam for all Home dashboard data,
- add a temporary all-versions/all-DCX mock route traced to the new HOME requirements,
- or explicitly narrow HV-1 MVP to one `dcxId` and defer global analytics/filtering.

### P1 — Backend-dependent create/analytics requirements are not split from the frontend sprint

HV-1 now includes fetching filtered ClickUp tasks, mapping ClickUp list/folder to project/client, auto-creating a DCX container, and analytics from future Supabase (`tasks/HV-1-home-spec.md:39-60`, candidates at `:136-140`). Those are larger than a page-component sprint and currently have no existing service routes except a thin `clickup.service.ts` entry payload and version mocks. The doc says candidates are "ready to propose," but HV-1 remains a `change-component + wire-mockup-data` sprint and its acceptance still expects create flow/search/filter/dashboard behavior.

**Fix:** split HV-1 into explicit frontend-MVP vs backend-deferred pieces. For HV-1 execution, define the mock/service contract the frontend may use and mark ClickUp/Supabase production integration as deferred unless the sprint is intentionally expanded into backend/API work.

### P1 — Required Brand/User blocks are not in the component sign-off build list

The Home spec requires Brand and User blocks (`tasks/HV-1-home-spec.md:30-37`), and Version reuses those same blocks (`tasks/HV-2-version-spec.md:21-39`). But the sign-off list gates creation of new components and does not include shared `HomeBrandBlock`, `HomeUserBlock`, `PageBrandBlock`, or similar (`tasks/HV-1-HV-2-component-signoff.md:72-84`, `:177-190`). Because the sign-off file says HV-1/HV-2 are blocked from creating any component unless its row is approved (`:23-26`, `:138-152`, `:248-263`), the executor cannot legally create the very blocks the specs require.

**Fix:** add shared sign-off rows for the brand block and user block, or explicitly assign them to existing components that may be reused without new component creation. Be careful with "same controls/icons as builder header user island": implementation must not import `src/builder/**`; it should extract/recreate an app-level non-builder user control if needed.

### P1 — Version structure summary has no named data source

HV-2 adds `VersionStructureSummary` with phase/action/task counts and hover lists (`tasks/HV-2-version-spec.md:73-75`, component row at `tasks/HV-1-HV-2-component-signoff.md:190`). But the current `Version` domain model has no phases/actions/tasks (`src/types/domain.ts:36-57`). The needed tree data lives behind `src/queries/builder.queries.ts` / `src/services/builder.service.ts`, not `useVersionQuery`. The sign-off reuse table lists version queries/actions/files/logs only (`tasks/HV-1-HV-2-component-signoff.md:195-204`), so the executor has no approved source for V-C10.

**Fix:** explicitly allow `useBuilderTreeQuery`/`builder.service.ts` as a data-only dependency for Version summaries, or create a new non-builder `versionStructure` query/service. State that this is a data query only and still forbids importing builder UI/store/actions.

### P2 — Requirement candidates are correctly staged, but sprint wording still overstates graph authority

The docs correctly say the new HOME/VER requirements are not yet in the graph and must go through `req:propose` + PO sign-off (`tasks/HV-1-home-spec.md:123-127`, `tasks/HV-2-version-spec.md:110-113`). However the sprint files also say the new discovery governs when it conflicts with older FP-R5 wording (`sprints/HV-1.md:12-13`, `sprints/HV-2.md:12-13`) and repeatedly phrase D-1 as "supersedes `REQ-VR-001`" (`sprints/HV-1.md:15-16`, `sprints/HV-2.md:15-16`). Until the proposed supersession is applied to the graph, `REQ-VR-001` remains approved canonical truth.

**Fix:** revise the sprint wording to say "proposed supersession; do not implement the conflicting behavior until `REQ-VER-ROOM` and the supersedes TraceLink are applied after PO sign-off." That matches `core.md §35b/§35e`.

### P2 — The review/sign-off task itself appears unlogged

I found the new task/spec files, but no matching Claude progress log or index entry mentioning `HV-1-HV-2-component-signoff`, `HV-1-home-spec`, or `HV-2-version-spec`. The latest Claude log present is `034-wm3-editor-open-paths.md`, and `rg` found no session log for these HV docs. `core.md §33` requires every user message / planning task to be logged as an indexed typed entry.

**Fix:** add the missing Claude session log entry or confirm which existing log owns this work, then rebuild the log index.

## Non-blocking Notes

- The "copy nothing from v0.1.4; borrow behavior only" guidance is good and should remain.
- The status cleanup is good: current lifecycle values are used and old `Ready for Review`, `Rejected`, `Placed` are called out as obsolete.
- `VersionBuilderPanel` Option B is a good boundary-preserving decision for `core.md §13`; just make sure the structure summary data source is approved.
- The sign-off gate is useful, but it should block execution only after its own pending rows are complete. Right now HV-1/HV-2 should remain blocked.

## Recommended Revision Checklist

| Item | Owner | Required before |
|---|---|---|
| Fix HV-1 route proof: `/` vs `/home` | Plan maintainer / PO | HV-1 execution |
| Define Home dashboard data source beyond `dcx-1` | PO + executor | HV-1 execution |
| Split backend-dependent create/analytics work from frontend MVP | PO + executor | HV-1 execution |
| Add sign-off rows for shared Brand/User blocks or assign existing reusable components | PO | HV-1/HV-2 component creation |
| Approve a data-only source for Version structure summary | PO + executor | HV-2 execution |
| Apply/propose graph changes before implementing conflicts with `REQ-VR-001` | Executor + PO sign-off | HV-1/HV-2 implementation |
| Add missing progress log for Claude HV discovery/spec work | Claude / next maintainer | Before closing this planning thread |

