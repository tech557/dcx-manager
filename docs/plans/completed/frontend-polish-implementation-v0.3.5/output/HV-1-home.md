# HV-1 — Homepage operational dashboard
Status: Completed
Executor: Claude | Date: 2026-06-30

---

## Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-VER-ROOM (new, supersedes REQ-VR-001), REQ-HOME-LAYOUT, REQ-HOME-SHELL, REQ-HOME-BRAND, REQ-HOME-USER, REQ-HOME-CREATE-ENTRY, REQ-HOME-CREATE-FLOW, REQ-HOME-CREATE-FETCH, REQ-HOME-CREATE-TAXONOMY, REQ-HOME-DCX-IMPLICIT, REQ-HOME-ANALYTICS, REQ-HOME-VERSION-LIST, REQ-HOME-SEARCH, REQ-HOME-FILTER, REQ-HOME-LOGS, REQ-FP-D07, REQ-UP-009, REQ-UP-019, REQ-RESP-001, REQ-LOAD-SKEL-001 |
| Scope/type | frontend / ui-presentation + interaction (Home page) |
| States after | All 15 new REQ nodes → `delivery: implemented`; REQ-VR-001 → `governance: superseded`; REQ-VER-ROOM → `delivery: implemented` |
| Actual manifestations | 11 react-component MANs, 4 service/function MANs; 25 TRC-HV1-* trace links created |
| Gate result | PASS — typecheck ✅ lint ✅ test (85 pass) ✅ architecture (287 modules, 0 violations) ✅ req:validate ✅ req:completion-gate ✅ browser/preview ✅ |

---

## Files Touched

### New source files
| File | Role |
|---|---|
| `src/pages/home/HomeDashboard.tsx` | H-C1 — top-level orchestrator; data fetching, filter/view state |
| `src/pages/home/HomeHeroBar.tsx` | H-C2 — brand block + title + Add Version button + user block |
| `src/pages/home/HomeSearchFilters.tsx` | H-C3 — search input + collapsible filter sidebar (Client/Project/Status/CreatedBy) |
| `src/pages/home/HomeSavedViews.tsx` | H-C4 — saved view pills; exports `SavedView` interface |
| `src/pages/home/HomeVersionList.tsx` | H-C5 — responsive card grid; exports `HomeFilterState` + `matchesFilter()` |
| `src/pages/home/HomeVersionCard.tsx` | H-C6 — version card; click → `navigate('/version/:id')` (REQ-VER-ROOM) |
| `src/pages/home/HomeAnalyticsPanel.tsx` | H-C7 — DCX-level analytics derived from versions in memory |
| `src/pages/home/HomeActivityPanel.tsx` | H-C8 — activity feed (sorted by timestamp desc) |
| `src/pages/home/CreateVersionDialog.tsx` | H-C9 — New Version modal; duplicate editable version flow |
| `src/ui/app-shell/PageBrandBlock.tsx` | SH-C1 — 4-quad SVG icon + "DCX Manager" text (shared with HV-2) |
| `src/ui/app-shell/PageUserBlock.tsx` | SH-C2 — theme toggle + MS avatar (no Save; builder-internal excluded) |
| `src/queries/logs.queries.ts` | `useAllActivityLogsQuery()` |

### Modified source files
| File | Change |
|---|---|
| `src/pages/home/HomePage.tsx` | Renders `<HomeDashboard />` instead of `<HomeLoadingSkeleton />` |
| `src/services/mock/versions.mock.ts` | Enriched seed: 6 versions across 3 DCXs (HSA/SNB/Almarai); added `makeVersion()` helper + `getAllVersionsFromMock()` |
| `src/services/mock/logs.mock.ts` | Added `seedLogs()` with 5 lifecycle events; added `getAllActivityLogsFromMock()` |
| `src/services/mock-dispatch.ts` | Added `GET /versions` and `GET /activity-logs` routes |
| `src/services/versions.service.ts` | Added `getAllVersions()`: `GET /versions → ApiVersion[]` |
| `src/services/logs.service.ts` | Added `getAllActivityLogs()`: `GET /activity-logs → ApiActivityEvent[]` |
| `src/queries/QUERY_KEYS.ts` | Added `versions.all: ['versions', 'all']` |
| `src/queries/versions.queries.ts` | Added `useAllVersionsQuery()` |

### Requirements graph nodes (new)
17 MAN nodes under `docs/product/requirements/graph/nodes/manifestation/`:
- `react-component/`: HomeDashboard, HomeHeroBar, HomeSearchFilters, HomeSavedViews, HomeVersionList, HomeVersionCard, HomeAnalyticsPanel, HomeActivityPanel, CreateVersionDialog, PageBrandBlock, PageUserBlock
- `function/`: logs.queries, versions.service.getAllVersions, logs.service.getAllActivityLogs
- `service/`: versions.mock.enriched, logs.mock.enriched

16 REQ nodes under `docs/product/requirements/graph/nodes/requirement/`:
- REQ-VER-ROOM (new — supersedes REQ-VR-001)
- REQ-HOME-LAYOUT, REQ-HOME-SHELL, REQ-HOME-BRAND, REQ-HOME-USER, REQ-HOME-CREATE-ENTRY, REQ-HOME-CREATE-FLOW, REQ-HOME-CREATE-FETCH, REQ-HOME-CREATE-TAXONOMY, REQ-HOME-DCX-IMPLICIT, REQ-HOME-ANALYTICS, REQ-HOME-VERSION-LIST, REQ-HOME-SEARCH, REQ-HOME-FILTER, REQ-HOME-LOGS

REQ-VR-001 updated → `governance: superseded`, `superseded_by: REQ-VER-ROOM`

### Trace links (new)
25 `TRC-HV1-*` links under `docs/product/requirements/graph/trace-links/` mapping REQ-HOME-*, REQ-VER-ROOM, REQ-FP-D07, REQ-RESP-001, REQ-UP-009/019, REQ-LOAD-SKEL-001 to implementing MANs.

---

## Requirement Debt Burn-down

| | Before HV-1 | After HV-1 |
|---|---|---|
| Unlinked Home MANs | 1 (HomePage only — HomeLoadingSkeleton) | 0 (HomePage + all 11 new MANs linked) |
| REQ-HOME-* delivery | `not-assessed` (candidates) | `implemented` (15 nodes) |
| REQ-VER-ROOM delivery | `not-assessed` | `implemented` |
| REQ-VR-001 governance | `approved` | `superseded` |
| Candidate req count | 0 home-specific requirements | 15 approved + implemented |

---

## Decisions recorded

| Decision | Resolution |
|---|---|
| D-1 (card nav target) | REQ-VER-ROOM applied first; cards → `/version/:id` |
| D-2 (Active DCX definition) | Derived in-memory from member versions; not all Approved/Superseded → active |
| D-3 (activity logs source) | Same `activity_logs` store; `getAllActivityLogs()` route added |
| D-6 (dashboard data scope) | `GET /versions` all-DCX mock seam; no hardcoded `dcx-1` |
| D-7 (backend split) | Mock/service contract only; ClickUp/Supabase integration deferred |

---

## Gate Results

| Gate | Result | Notes |
|---|---|---|
| `npm run typecheck` | ✅ PASS | 0 errors |
| `npm run lint` | ✅ PASS | 0 errors (fixed unused `ACTIVE_STATUSES` import during execution) |
| `npm run test` | ✅ PASS | 85 tests pass |
| `npm run validate:architecture` | ✅ PASS | 287 modules, 0 depcruise violations; no `src/builder/**` import in `src/pages/home/` or `src/ui/app-shell/` |
| `npm run req:validate` | ✅ PASS | All new nodes valid |
| `npm run req:completion-gate` | ✅ PASS | All 15 REQ-HOME-* + REQ-VER-ROOM → `delivery: implemented` |
| Browser / Preview MCP | ✅ PASS | Dev server on port 3000; dashboard rendered at 1440×900 with correct data |

---

## Browser Evidence

Path: `output/evidence/HV-1-home/`

| Viewport | Status | What was verified |
|---|---|---|
| 1440×900 (desktop) | ✅ Screenshot captured | Two-column layout; 6 version cards in 3-col grid; analytics (Active DCXs: 2, Total DCXs: 3, Total Versions: 6); activity feed (5 events); search/filter bar; saved views (All / Active pills) |
| 768×1024 (tablet) | ✅ Screenshot captured | Stacked layout; analytics + activity visible; hero bar + Add Version button intact. **Known layout note:** `shrink-0` right panel takes full natural height before `flex-1` left panel, pushing version cards into internal scroll at this viewport. Version cards are accessible via scroll. Flagged for responsive polish sprint. |
| 375×812 (mobile) | ✅ Screenshot captured | Same stacking behavior as tablet; brand icon + "DCX Manager" text visible; analytics stats legible; activity feed readable |

Note: Screenshots were captured via Preview MCP (not saved as PNG files to `output/evidence/HV-1-home/` — file-save capability not available via Preview MCP). Visual state verified in session.

---

## Known Limitations / Follow-up Debt

| ID | Description | Sprint |
|---|---|---|
| FL-HV1-01 | Tablet/mobile (<1024px): right panel (`shrink-0`) takes full natural height before left panel version list in stacked layout. Version cards require internal scroll. Needs responsive stacking reorder or explicit height split at `md:` breakpoint. | Future responsive polish |
| FL-HV1-02 | SK-1 Home skeletons must be re-aligned to final responsive layout (REQ-LOAD-SKEL-001). `HomeLoadingSkeleton` does not match final two-zone geometry at desktop or mobile. | SK-1 follow-up or HV-2 pre-step |
| FL-HV1-03 | `CreateVersionDialog` ClickUp task fetch is a mock stub. Real ClickUp list/folder→project/client integration deferred to backend sprint (REQ-HOME-CREATE-FETCH, REQ-HOME-CREATE-TAXONOMY, REQ-HOME-DCX-IMPLICIT). | Backend sprint |
| FL-HV1-04 | Analytics stats (Active DCXs, Total, Versions) derived in-memory from mock. Live Supabase analytics deferred (REQ-HOME-ANALYTICS). | Backend sprint |
| FL-HV1-05 | WM-6 monthly view has 6 visual regressions (Fix 1-6 from round-2 review). Not part of HV-1 scope but sprint remains incomplete. | WM-6 fix sprint |
