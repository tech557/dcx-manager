## SA-R1 — Dependency Graph (replanned)
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Generate a folder-to-folder import matrix with layer violations, component scope analysis, and large file index
Trigger: SA-R1 sprint file (replanned by Claude)
Requirements covered: None (research sprint)

Files created:
  docs/plans/active/src-structure-audit/output/SA-R1-dependency-graph.md  — complete 4-section report (122 lines)

Files edited:
  scripts/gen-dep-graph.ts  — rewritten to match new SA-R1 output spec (294 lines)

Files marked old (superseded by replan):
  docs/progress/sessions/2026-06-25-opencode/06-SA-R1-dep-graph.md → .old
  docs/progress/sessions/2026-06-25-opencode/07-SA-R2-tool-evaluation.md → .old
  docs/progress/sessions/2026-06-25-opencode/08-SA-R3-structure-assessment.md → .old

Churn — work reversed:
  None. All prior work artefacts (docs/references/dependency-graph.md, docs/references/tool-evaluation.md,
  docs/product/decisions/src-structure-decision.md) remain intact for reference but are superseded.

Preserve-semantic check:
  No source code in src/ was changed.

Key output:
  Section 1 — Folder Import Matrix (✓/?/— format): 15×15 matrix
    - "?" markers: components→builder (surprising upward import)
  Section 2 — Layer Violations: 3 real violations found:
    1. ui/BuilderBg/LightRays → builder/stage/StageProvider (L2→L8)
    2. components/forms/channel/CompositionLibraryModal → builder/cards/channel.icons (L3→L4)
    3. components/forms/channel/InlineChannelCompositionSelector → builder/cards/channel.icons (L3→L4)
  Section 3 — components/ Scope Analysis: 44 files analyzed
    - 13 builder-only (index.ts barrels, feedback, modals, some buttons)
    - 31 unused within components/ (only imported internally)
  Section 4 — Large File Index: 35 files over 150 lines
    - 2 must-split: task.actions.ts (288), ReadinessCheckModal.tsx (282)
    - 12 close to cap (200-250)
    - 21 watch (150-200)

Gates:
  typecheck: PASS (0 errors)
  verify.sh: PASS

Consumer updates required:
  None. Output is a reference document.
