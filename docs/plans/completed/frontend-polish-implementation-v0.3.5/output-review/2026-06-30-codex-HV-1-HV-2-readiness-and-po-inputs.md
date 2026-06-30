---
review: HV-1-HV-2-readiness-and-po-inputs
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
verdict: NOT READY — ONE DOC CLEANUP + PO INPUTS REQUIRED
---

# HV-1 / HV-2 Readiness Re-Audit + PO Inputs

## Verdict

**NOT READY yet.** The implementation plan is close, but it still needs:

1. **One document cleanup** in `tasks/HV-2-version-spec.md`.
2. **PO decisions/sign-off** on the Home data scope, backend/mock split, component inventory, and a few
   data-model choices.

No code was reviewed or changed in this audit.

## Remaining Document Finding

### P2 — `HV-2-version-spec.md` still assigns `REQ-VER-ROOM` supersession work to HV-2

Evidence:
- HV-1 Step 0 correctly says to `req:propose` + apply `REQ-VER-ROOM` before Home card navigation
  (`sprints/HV-1.md:11`, `sprints/HV-1.md:20`).
- HV-2 sprint correctly says HV-2 should confirm `REQ-VER-ROOM` was already applied in HV-1 Step 0
  (`sprints/HV-2.md:18-29`).
- The component sign-off block also correctly gates ordering on applying `REQ-VER-ROOM` in HV-1 Step 0
  or reordering HV-2 first (`tasks/HV-1-HV-2-component-signoff.md:336-339`).
- But the detailed Version spec still says candidates are "ready to `req:propose` at HV-2," includes
  the supersession in that HV-2 candidate set, and says D-1's action is to supersede at HV-2
  (`tasks/HV-2-version-spec.md:114-121`, `tasks/HV-2-version-spec.md:137`, `tasks/HV-2-version-spec.md:145-150`).

Impact:
An HV-2 executor could double-propose or reapply a requirement supersession that HV-1 already owns.

Required cleanup:
- Mark `REQ-VER-ROOM` in the Version spec as **expected pre-applied by HV-1; HV-2 confirms only**.
- Tell HV-2 to propose only the remaining Version candidates unless `REQ-VER-ROOM` is missing.

## PO Inputs Needed Before Ready

### Required Before HV-1 Starts

| ID | PO input needed | Recommended answer | Why it matters |
|---|---|---|---|
| PO-1 | **D-6 / H-G7: Home dashboard data scope** — all-DCX/all-versions seam or narrowed single-`dcxId` MVP? | Choose **all-DCX/all-versions mock/query seam**. | Required for `# Total DCXs`, Active DCXs, global Client/Project filters, and cross-campaign search. Current `useVersionsQuery(dcxId)` is per-DCX only. |
| PO-2 | **D-7 / H-G8: frontend MVP vs backend-deferred split** — can HV-1 satisfy ClickUp/Supabase behavior through a mock/service contract while live integrations are deferred? | Approve **mock/service contract now; live ClickUp/Supabase deferred**. | HV-1 is `change-component + wire-mockup-data`, not a backend sprint. |
| PO-3 | **HV ordering / graph governance** — confirm `REQ-VER-ROOM` is proposed + applied in HV-1 Step 0 before Home card navigation. | Approve **HV-1 Step 0 applies `REQ-VER-ROOM`**. | Prevents contradiction with canonical `REQ-VR-001` while keeping HV-1 before HV-2. |
| PO-4 | **Home component sign-off** for H-C1 through H-C9. | Approve the listed build list unless a component should be merged/removed. | HV-1 cannot create unapproved page components. |
| PO-5 | **Shared component sign-off** for `PageBrandBlock` and `PageUserBlock`. | Approve both as app-level shared components. | Home and Version both require them; builder imports are forbidden. |
| PO-6 | **H-G1: DCX/project data source** — derive from version metadata or add small DCX/project mock seam? | If PO chooses all-DCX dashboard, approve a **small DCX/project/dashboard mock seam**. | Client/project/global filters need reliable source fields. |
| PO-7 | **H-G5: create-version flow approach** — duplicate/disabled state or real create service? | Approve a **mock-backed createVersion flow** if create popup is expected in HV-1 Web Check; otherwise explicitly defer create and show disabled/deferred state. | The current service supports duplicate, not create-new. |

### Required Before HV-2 Starts

| ID | PO input needed | Recommended answer | Why it matters |
|---|---|---|---|
| PO-8 | **Version component sign-off** for V-C1 through V-C10. | Approve the listed build list. | HV-2 cannot create unapproved Version page components. |
| PO-9 | **V-G4: crew identity display** — role/userId initials first, or add mock users service for names/photos? | Start with **role/userId labels or initials**; add mock users only if PO needs richer crew UI now. | Current `src/` has no user directory. |
| PO-10 | **Confirm D-5 remains Option B** — branded launch panel + structure summary, no builder visual. | Keep **Option B**. | Avoids `src/builder/**` imports and architecture work for a live preview. |

### Requirement Sign-Off At Sprint Time

PO should expect to sign off staged requirement candidates when the sprint executor proposes them:

- HV-1: `REQ-HOME-*` candidates plus `REQ-VER-ROOM` in Step 0.
- HV-2: remaining `REQ-VER-*` candidates, with `REQ-VER-ROOM` confirmed if already applied.

## Ready Criteria

The plan is ready for HV execution when:

1. `tasks/HV-2-version-spec.md` is cleaned so `REQ-VER-ROOM` is owned by HV-1 Step 0 and only confirmed by HV-2.
2. PO resolves PO-1 through PO-7 for HV-1.
3. PO signs off Home + shared components in `tasks/HV-1-HV-2-component-signoff.md`.
4. PO resolves PO-8 through PO-10 before HV-2 starts.

After those are complete, HV-1/HV-2 are ready to execute under the existing sprint gates.
