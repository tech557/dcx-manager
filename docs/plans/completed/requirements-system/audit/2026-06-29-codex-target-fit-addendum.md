---
audit-of: requirements-system
auditor: codex
date: 2026-06-29
verdict: NOT READY
addendum-to: 2026-06-29-codex.md
blocking-issues-added: 1
---

# Target-Fit Addendum: requirements-system

## Verdict

The current draft will **not** achieve the PO's stated target yet.

It has the beginnings of a governed requirements store: sign-off, supersession, relationship validation,
ledger, and generated views. It does **not** yet specify the required intake and impact-assessment system:
plain-English user requests must be mechanically assessed as potential requirements before feature work,
confirmed with the PO, checked for contradictions/supersessions, checked for feature impact, and linked to
the narrowest technical manifestations in code.

## Added blocking issue

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 8 | RS-R0, RS-R2, RS-R5, every future plan output | The plan does not cover the required plain-English requirement intake and technical traceability workflow. | README hard constraints cover sign-off before write, relationship integrity, and automation, but do not require user-initiated plain-English messages to be classified as candidate requirements before feature creation. RS-R0 scope defines storage/schema/workflow generally, but not a mechanical intake assessor. RS-R2 builds validators and propose/apply tooling, but not an agent skill/tool that turns a user request into a proposed requirement, contradiction check, impact report, and technical trace map. RS-R5 wires agent rules generally, but does not define the mandatory format each activated plan must link to. | Add a new hard constraint and sprint requirements: (1) a mechanically wired `requirement-intake` skill/tool invoked on user-initiated feature requests; (2) PO confirmation before adding the request as a requirement; (3) contradiction/supersession assessment with explicit "keep/delete/supersede" PO choice; (4) impact analysis against related requirements and affected features; (5) narrow technical trace links to files/classes/functions/selectors/scripts where the requirement manifests; (6) a required plan-output section linking every sprint/feature to requirement IDs and technical traces. |

## Required target model

Before this plan can be activated, RS-R0 should define the workflow below as a first-class system behavior:

1. User writes a plain-English request.
2. Agent classifies whether it is a candidate requirement, implementation task, bug, decision, or question.
3. If it is a candidate requirement, the agent presents a concise proposal and asks the PO whether to add it.
4. The system checks for contradictions, duplicates, dependencies, supersession targets, and impacted features.
5. If it contradicts an existing requirement, the PO chooses: keep both with scope distinction, supersede, delete/archive, or reject the new request.
6. The approved requirement is converted into a technical-ready record: requirement ID, acceptance criteria, provenance, affected feature areas, related/superseded IDs, and narrow code traces.
7. Any activated plan must include a generated requirement trace section linking each sprint/output to the relevant requirement IDs and code manifestations.

## What "state of the art" means here

The system should not merely store requirements after agents manually write them. It should act as a
pre-feature gate: no new feature work starts until the request has either been classified as not-a-requirement
or converted into an approved, mechanically validated, technically traceable requirement.

Claude should still do its own research in RS-R0, but this target must be explicit in the plan before that
research starts. Otherwise Claude may optimize the storage model and miss the intake/impact/traceability
system that the PO actually wants.
