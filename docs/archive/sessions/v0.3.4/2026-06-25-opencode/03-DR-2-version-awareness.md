## DR-2 — Version Awareness System
Agent: opencode
Model: big-pickle
Provider: opencode
Date: 2026-06-25
Status: Completed

Intent: Every agent session starts knowing the current product version and what that means for log archiving
Trigger: docs-refactor plan execution order (DR-2 after DR-5)
Requirements covered: None (doc-only sprint)

Files created:
  docs/VERSION.md                       — single source of truth for version (25 lines)
  scripts/version-bump.sh               — patch/minor bump script (69 lines)
  scripts/archive-version.sh            — archive script for minor bumps (75 lines)
  docs/plans/active/docs-refactor/sprints/DR-2.md  — sprint file (52 lines)

Files edited:
  AGENTS.md                             — added VERSION.md as first read in routing header (68 lines, was 67)

Files deleted: none

Churn — work reversed:
  None. Doc-only sprint with new scripts.

Preserve-semantic check:
  No source code touched. AGENTS.md now lists VERSION.md as the first read. Scripts are standalone bash with no side effects on source.

Open decisions used:
  None.

Acceptance criteria:
  □ AC1: docs/VERSION.md exists with current, previous_minor, next_planned, semantics, and agent instructions — PASS (v0.3.2, matches plan version_context)
  □ AC2: scripts/version-bump.sh is executable and handles patch/minor — PASS (tested: v0.3.2→v0.3.3, then reverted)
  □ AC3: scripts/archive-version.sh is executable — PASS
  □ AC4: AGENTS.md routing header lists VERSION.md as first read — PASS
  □ AC5: No source code changed — PASS
  □ AC6: typecheck + verify.sh pass — PASS

Gates:
  typecheck: PASS (0 errors)
  dev: N/A (no source changes)
  verify.sh: PASS
  version-bump.sh patch: PASS (v0.3.2→v0.3.3, then reverted)
  browser manual check: N/A (doc-only sprint)

Consumer updates required:
  Per-agent guides that reference the startup checklist order may need updating to mention VERSION.md first. This was done for opencode.md in DR-1; other guides already say "read core rules first" which remains accurate since VERSION.md is now listed before core.md in the routing header.

Open issues / follow-ups:
  Next: DR-4 (Codebase Manifest) per execution order
