## SA-R1 — Dependency Graph with ts-morph
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Generate a folder-to-folder dependency graph to understand import relationships and detect violations
Trigger: src-structure-audit plan — SA-R1 sprint
Requirements covered: None (research sprint)

Files created:
  scripts/gen-dep-graph.ts                    — ts-morph dependency graph generator (271 lines)
  docs/references/dependency-graph.md         — folder-to-folder matrix, upward violations, analysis (69 lines)
  docs/plans/active/src-structure-audit/sprints/SA-R1.md  — sprint file (47 lines)

Files edited:
  docs/plans/active/src-structure-audit/README.md  — status drafted→active (unchanged line count)
  docs/plans/active/README.md                      — added src-structure-audit to current plans table

Files deleted: none
Drafted plan moved: docs/plans/drafted/src-structure-audit/ → docs/plans/active/src-structure-audit/

Churn — work reversed:
  None. Research sprint with no source code changes.

Preserve-semantic check:
  No source code in src/ was changed. Script reads src/ with ts-morph in read-only mode.

Open decisions used:
  None.

Acceptance criteria:
  □ AC1: scripts/gen-dep-graph.ts runs without error — PASS (258 files analyzed)
  □ AC2: dependency-graph.md contains a folder-to-folder import matrix — PASS (16×16 table)
  □ AC3: Report answers all 4 questions — PASS:
    - components imports builder? ⚠️ Yes (2 imports: channel.icons)
    - ui imports builder? ⚠️ Yes (LightRays imports StageProvider)
    - 5 upward import violations found (listed in report)
    - 1 circular pair: builder ↔ components
  □ AC4: No source code moved or renamed — PASS
  □ AC5: typecheck + verify.sh pass — PASS

Gates:
  typecheck: PASS (0 errors)
  dev: N/A (no source changes)
  verify.sh: PASS
  gen-dep-graph.ts: PASS (258 files analyzed, 5 violations, 1 circular)
  browser manual check: N/A (research sprint)

Consumer updates required:
  None. Report is a reference document.

Open issues / follow-ups:
  Key findings for SA-R3:
  - src/components/auth/RouteGuard imports from services (L3→L9 violation)
  - src/ui/BuilderBg/LightRays imports from builder/stage (L1→L8 violation)
  - 2 channel form components import from builder/cards (L3→L4 violation)
  - ReadinessCheckModal imports from rules (L3→L9 violation)
  - Next: SA-R2 (tool evaluation) — can run in parallel with SA-R3 preparation
