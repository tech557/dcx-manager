## 02-PLAN — Structure Refactor Plan — Response to Codex + Gemini Review
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-26
Status: Completed

Task type: User-initiated (review + planning revision) — not a sprint task
Trigger: User message — "please read the codex and gemni reviews for the plan and read the final conclusion in your session logs before moving on to changing the plan or stick to your opnion"

Reviews read:
  - docs/progress/sessions/2026-06-26-codex/02-structure-Refactor-Plan-Review-Log
  - docs/progress/sessions/2026-06-26-gemini/02-PLAN-src-structure-refactor-review.md
  - docs/progress/sessions/2026-06-26-claude/01-PLAN-src-structure-refactor-synthesis.md (own log)

Changes made to plan (agreed with reviewers):

  P2 — Step 2 (Badge):
    Before: Single <Badge variant="status|readiness|lock"> with mutually exclusive props
    After: <Badge> visual primitive (base styling) + StatusBadge/LockBadge/ReadinessBadge as semantic wrappers
    Reason: Codex + Gemini both flagged oversized universal atoms with unrelated optional props as bad pattern

  P2 — Step 8 (hook merging):
    Before: Merge useEditorPanel + useEditorDraft + useEditorGuard into useEditorState
    After: Only merge useActiveNode into useEditorDraft (duplicate subscription). The 3 editor hooks stay separate.
    Reason: Gemini correctly noted that merging to reduce file count when concerns are distinct creates bloated hooks

  P2 — Step 9 (component relocation):
    Before: Move all 44 src/components/ files to src/ui/
    After: Generic, domain-neutral forms/inputs → src/ui/forms/; builder-specific buttons/feedback → src/builder/ui/
    Success metric changed from "src/components/ is empty" to "every file is in a folder matching its capability owner"
    Reason: Both reviewers strongly flagged that src/ui/ must remain domain-neutral

  P3 — Step 1 (LightRays fix):
    Before: "Pick one after reading the file" (ambiguous)
    After: Option A (prop injection) made explicit — no ambiguity left for agent to decide at runtime
    Reason: Codex flagged unresolved choices in sprint files; Gemini confirmed Option A is correct

  P4 — Step 3b (domain types):
    Before: Domain types extend their ApiX counterparts (e.g. interface Version extends ApiVersion)
    After: Domain types stay independently declared — no extends from transport types
    Reason: Codex correctly identified that extends couples domain stability to transport changes; mapper is the correct boundary

  P4 — Step 6 (error handling):
    Before: Add try/catch to each of 7 service files individually
    After: Centralized withServiceErrorHandler() wrapper in service-utils.ts; services use the wrapper
    Reason: Codex flagged repetitive try/catch as antipattern; centralized handler is cleaner

Positions maintained (disagreed with reviewers):
  - CSS modules: Not adopted. Reviewers did not challenge this.
  - StageContext full split: Deferred post-v1. Neither reviewer challenged.
  - Contract tests: Not added to P4. No test infrastructure exists; post-v1 scope.
  - source-structure.csv: Valid idea, not added to this plan — additive scope, separate sprint.
  - build-log-index.sh bug: Real bug (both reviewers confirmed); separate fix outside this plan's scope.

Files edited:
  docs/plans/drafted/src-structure-refactor/sprints/P2-atomic-components.md — Badge pattern, hook merge scope, folder destination
  docs/plans/drafted/src-structure-refactor/sprints/P3-file-structure.md — LightRays fix made explicit
  docs/plans/drafted/src-structure-refactor/sprints/P4-backend-readiness.md — domain type independence, centralized error handler
  docs/plans/drafted/src-structure-refactor/ASSUMPTIONS.md — added review decision table

Gates: no source code changed: PASS
