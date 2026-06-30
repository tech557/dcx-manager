## FP-R4 — Builder / version / homepage finalize-behavior spec
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-28
Status: Completed (builder spec); Blocked on D-07 (homepage, version)

Intent: Define what "finalized" means for builder, version page, and homepage — with per-surface
checklists, requirement IDs, verification tags, and implementation-family classifications.
Trigger: Sprint file FP-R4-behavior-finalize-spec.md
Requirements covered: BLD-EDT-001, BLD-EDT-002, BLD-CRD-INT-002 through BLD-CRD-INT-006,
  BLD-CRD-SPC-001, BLD-CRD-SPC-002, BLD-KAN-001 through BLD-KAN-006, BLD-TML-001 through BLD-TML-004,
  BLD-STG-001, BLD-STG-002, BLD-DND-001 through BLD-DND-005, BLD-SLC-001, BLD-SLC-002,
  BLD-ISL-003, BLD-ISL-007, BLD-FOC-001, BLD-VCX-001, BLD-VCX-002, BLD-RDY-001, BLD-RDY-002,
  BLD-RED-001, BLD-MOT-001, BLD-OVR-001 (deferred); brand-ui-interpretation.md Rules 2–4;
  core.md §10, §13, §17, §20, §22.1

Files created:
  - output/FP-R4-finalize-spec.md — per-surface finalize checklists (353 lines)

Files edited:
  - output/decision-register.md — added D-09, D-10, D-11 (40 lines, was 37)
  - README.md — added FP-R4 carry-forward section (453 lines, was 416)

Files deleted: none

Churn — work reversed: none

Preserve-semantic check:
  - core.md §10 (3-row frozen layout): confirmed — no builder criterion proposes layout changes
  - core.md §13 (no builder imports in home/version): confirmed — boundary check in criteria V01/H01
  - core.md §17 (popup ≠ modal): confirmed — criteria C04/C05 enforce anchored popup, not modal
  - core.md §20 (reduced motion): confirmed — M01–M05 require reduced-motion branches
  - core.md §22.1 (SelectionIsland maxWidth): confirmed — criterion S06

Open decisions used:
  - D-07 blocking home/version: recorded as blocked, draft criteria marked informative-only
  - D-09, D-10, D-11 added to register for PO ruling

Acceptance criteria:
  □ (PO-verifiable) output/FP-R4-finalize-spec.md has a per-surface finalize checklist: PASS
  □ (PO-verifiable) Every criterion is tagged with a verification type and a requirement ID or ❓: PASS
  □ (PO-verifiable) Builder section confirms layout-frozen; home/version confirm no-builder-import: PASS
  □ (PO-verifiable) output/decision-register.md exists; every ❓ is a row with a status, not a count: PASS
  □ (PO-verifiable) Every finalize gap carries a change-token/change-component/wire-mockup-data tag: PASS
  □ (code-verifiable) Allowed writes only: output/*.md, output/evidence/**, README carry-forward,
      audit/*, progress log. No src/ write: PASS — src/ mtime check confirmed no files changed

Gates:
  typecheck: N/A — no code changed
  dev: N/A — no code changed
  verify.sh: N/A — no code changed
  src/ mtime check: PASS — no src/ file newer than output files

Consumer updates required:
  - FP-R5 reads output/FP-R4-finalize-spec.md for three-family gap matrix
  - FP-R5 reads output/decision-register.md (D-01 through D-11) for execution scoping
  - README carry-forward consumed by FP-R0 through FP-R5 sprints

Open issues / follow-ups:
  - D-01 through D-11 (9 open PO decisions) must be resolved before FP-R5 can draft
    implementation sprints for affected scopes
  - D-06 (reduced-motion audit) still unresolved — FP-R3 did not address it
  - Homepage/version specs blocked on D-07 — if waived, draft criteria are ready for FP-R5
