---
review: HV-1-HV-2-discovery-reaudit-2
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
source-review: output-review/2026-06-30-codex-HV-1-HV-2-discovery-reaudit.md
verdict: NEEDS ONE TARGETED CLEANUP
---

# HV-1 / HV-2 Discovery Re-Audit 2

## Verdict

**NEEDS ONE TARGETED CLEANUP before HV execution.** Claude's round-two revision fixed the substantive
P1 blockers from the prior re-audit: HV-1 now owns the early `REQ-VER-ROOM` supersession, "Active" is
normalized to Active DCXs in the sprint handoff, D-6/D-7 are hard-gated in the sign-off block, stale
preview wording is mostly gone, and the README candidate count is corrected to 22.

The remaining issue is localized: the detailed HV-2 spec still says the `REQ-VER-ROOM` supersession is
proposed/applied in HV-2, while the sprint files and sign-off sheet now correctly move that work to HV-1.

## Finding

### P2 — `HV-2-version-spec.md` still assigns the `REQ-VER-ROOM` supersession to HV-2

Evidence:
- HV-1 Step 0 now says to `req:propose` + apply `REQ-VER-ROOM` before Home card navigation
  (`sprints/HV-1.md:11`, `sprints/HV-1.md:20`).
- HV-2 sprint now agrees: by HV-2, `REQ-VER-ROOM` should already be canonical, and HV-2 should confirm it
  (`sprints/HV-2.md:18-29`).
- The component sign-off block also agrees that ordering is resolved by applying `REQ-VER-ROOM` in HV-1
  Step 0, or by reordering HV-2 ahead of HV-1 (`tasks/HV-1-HV-2-component-signoff.md:336-339`).
- But the detailed Version spec still labels §G as "ready to `req:propose` at HV-2," says the candidate
  table "includes the supersession," and says D-1's action is to supersede `REQ-VR-001` at HV-2
  (`tasks/HV-2-version-spec.md:114-121`, `tasks/HV-2-version-spec.md:137`).
- Its executor handoff still tells HV-2 to `req:propose` the §G candidates including the `REQ-VR-001`
  supersession (`tasks/HV-2-version-spec.md:145-150`).

Impact:
An HV-2 executor could double-propose, reapply, or reopen the already-HV-1-governed `REQ-VER-ROOM`
supersession. This is not a design blocker anymore, but it is a governance handoff inconsistency in the
spec that HV-2 is explicitly told to read.

Recommendation:
Patch only `tasks/HV-2-version-spec.md`:
- Rename §G wording to say: `REQ-VER-ROOM` is proposed/applied in HV-1 Step 0; HV-2 only confirms it.
- In the candidate table, mark `REQ-VER-ROOM` as "expected pre-applied by HV-1; confirm, do not re-propose
  unless missing."
- In §H D-1 action, replace "at HV-2" with "applied in HV-1 Step 0; HV-2 confirms."
- In §I handoff, tell HV-2 to propose only the remaining `REQ-VER-*` candidates, and confirm
  `REQ-VER-ROOM` exists before relying on the version-room flow.

## Prior Re-Audit Resolution Check

| Prior finding | Current state | Result |
|---|---|---|
| HV-1 before HV-2 blocked on `REQ-VER-ROOM` | HV-1 Step 0 now applies `REQ-VER-ROOM`; sign-off block hard-gates ordering | Fixed, with one stale HV-2 spec row remaining |
| Active DCXs vs active versions | HV-1 sprint now says Active DCXs and DCX-level seam | Fixed |
| Sign-off could pass without D-6/D-7 | Sign-off block now includes D-6/D-7 and says `SIGNED OFF` invalid while unresolved | Fixed |
| Stale decision labels | Page headers/sign-off/handoff mostly corrected | Fixed |
| Stale preview language | HV-2 sprint and spec coverage now say branded launch panel/no builder visual | Fixed |
| Candidate count 21 vs 22 | README now says 22 staged candidates | Fixed |

## Final Recommendation

After the single HV-2 spec cleanup above, the discovery package is ready to support HV-1/HV-2 execution.
Do not start HV-1 until PO resolves D-6/D-7 and component/shared-block sign-off is complete.
