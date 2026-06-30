---
log: 036-hv-discovery-spec-and-audit-revision
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: mixed
PO-Action: pending
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: HV-1, HV-2 (pre-execution discovery/spec)
---

# 036 — HV-1/HV-2 discovery solidification, PO specs, decisions, + Codex-audit revision

## Status: ✅ Planning work complete (specs recorded; 5 decisions resolved, 2 opened by audit)

This entry owns the HV-1/HV-2 **discovery + spec planning thread** (multiple PO messages in one
continuous session). `Type: mixed` — sub-tasks below. No code changed; docs only.

## Sub-tasks (per PO message)
| # | PO request | Type | Output |
|---|---|---|---|
| 1 | Review Codex HV discovery output, solidify per-page, log as non-sprint task, reference in README, keep out of `output/` | user-request-planning | Moved `output/HV-1-HV-2-component-discovery-support.md` → `tasks/HV-1-HV-2-component-signoff.md` (per-page, per-component sign-off). README "Supporting tasks" section added. |
| 2 | Record detailed Home spec; check requirements saved / ready to append | user-request-planning | `tasks/HV-1-home-spec.md` — spec + requirement-coverage map + staged `REQ-HOME-*` candidates (not written to graph, §35b). |
| 3 | Add Home search/filter; record Version page; re-check v0.1.4 | user-request-planning | `tasks/HV-2-version-spec.md`; read v0.1.4 `pages/home/*` + `pages/version/*`; resolved D-1 (version room). |
| 4–8 | Resolve decisions D-1…D-5 one by one | user-request-planning | D-1 version room; D-2 Active=not Approved/not Superseded; D-3 logs = same `activity_logs`, auto-load; D-4 product type from ClickUp custom field (endpoint backend-deferred); D-5 Option B (no builder visual, branded launch). |
| 9 | Update the two sprint files + plan index with discovery findings | user-request-planning | `sprints/HV-1.md` + `sprints/HV-2.md` "Discovery findings" sections; README sprint-index rows + context note. |
| 10 | Address Codex output audit (NEEDS REVISION) | audit-review + user-request-planning | This revision — see below. |

## Artifacts created/changed (docs only)
- **New:** `tasks/HV-1-HV-2-component-signoff.md`, `tasks/HV-1-home-spec.md`, `tasks/HV-2-version-spec.md`.
- **Edited:** `sprints/HV-1.md`, `sprints/HV-2.md`, plan `README.md`.
- **Removed:** `output/HV-1-HV-2-component-discovery-support.md` (relocated; content preserved).
- **Staged (NOT in graph):** 14 `REQ-HOME-*` + 8 `REQ-VER-*` requirement candidates incl. `REQ-VER-ROOM`
  (proposed supersession of `REQ-VR-001`). To be `req:propose`d + signed off at HV execution.

## Codex audit response (`output-review/2026-06-30-codex-HV-1-HV-2-discovery-review.md` — NEEDS REVISION)
| Finding | Disposition |
|---|---|
| P1 — HV-1 route `/home` vs `/` | **Fixed.** PO Web Check + sprint now use `/` (Home is the index route; no `/home` in `src/router.tsx`). |
| P1 — Home data source can't do all-DCX/total/global filter with `useVersionsQuery('dcx-1')` | **Recorded as decision D-6 + gap H-G7.** Build-shape no longer hardcodes `dcx-1`; recommend all-DCX dashboard seam or narrowed MVP. PO decision pending. |
| P1 — Backend create/analytics not split from frontend sprint | **Recorded as decision D-7 + gap H-G8.** HV-1 acceptance met against a defined mock/service contract; live ClickUp/Supabase deferred. Backend-dependent candidates flagged. |
| P1 — Brand/User blocks missing from sign-off list | **Fixed.** Added shared `SH-C1 PageBrandBlock` + `SH-C2 PageUserBlock` sign-off rows (§S.0); user block recreated app-level, no `src/builder/**` import. |
| P1 — Version structure summary has no data source | **Fixed.** Approved `useBuilderTreeQuery`/`builder.service.ts` as **data-only** (they live outside `src/builder/**`, so not a §13 violation); added to Page-2 reuse table. |
| P2 — Sprint wording overstates graph authority | **Fixed.** Sprints now say candidates are the intended target but graph IDs stay canonical until proposed+applied; `REQ-VR-001` not to be contradicted until `REQ-VER-ROOM` applied (§35b/§35e). |
| P2 — This planning work unlogged | **Fixed by this entry (036)** + index rebuild. |

## Gates
Docs-only planning; no code gates run (no `src/**` change). `req:*` graph mutations intentionally **not**
run — candidates are staged for HV-execution-time proposal per §35b.

## PO-Action: pending
- Decide **D-6** (Home dashboard data scope) and **D-7** (frontend-MVP vs backend split) before HV-1.
- Per-component sign-off (Approve/Reject) in `tasks/HV-1-HV-2-component-signoff.md` §1.7 / §2.7 / §S.0.
