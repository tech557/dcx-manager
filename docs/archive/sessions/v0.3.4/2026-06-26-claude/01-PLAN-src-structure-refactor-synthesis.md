## 01-PLAN — src-structure-refactor Final Synthesis
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-26
Status: Completed

Task type: User-initiated (planning synthesis) — not a sprint task
Trigger: User message — "om now all discovery is run i want you to look at all outputs and then come up with your own conclusion for a structure plan that allow all these inputs (challenge the recommendations if wanted), also i know u needed some PO decision but use your recommendation while documenting the assumption made in the structure plan alone in the plan folder. Also make sure we dont integrate backend right now it should be ready with mockdata to represent every endpoint now"

Discovery inputs read:
  - UX-R1-token-inventory.md — 19 hex colors, 13 untokenized; 50+ accent opacity variants; no typography system
  - UX-R2-component-css-map.md — 48 dead CSS classes (50%); 5 duplicate visual patterns; 11 inline-style files
  - UX-R3-style-synthesis.md — full token set recommendation; canonical opacity scale; responsive gap analysis
  - FE-R1-component-tree.md — 98 components; 35 safe leaf atoms; 20 context-coupled (not safe to move); all src/components/ builder-only
  - FE-R2-state-flow.md — 131 useState; StageContext 28 values; split selection state; clean action boundary
  - FE-R3-duplication-map.md — 5 duplication groups; 48 dead CSS; 0 orphaned components; useToggle opportunity
  - BE-R1-type-inventory.md — 50% domain.ts duplicates api.ts; mock data clean; 0 ambiguous types
  - BE-R2-service-audit.md — 0 any in services/actions; 100% mapper coverage; 8 services localStorage-only; apiClient() seam exists but throws
  - BE-R3-integration-gap.md — Scenario A: 8 services swap, everything else survives; type dedup needed; camelizeKeys for Scenario B/C

Key agent decisions (with documented assumptions):
  - CSS modules: NOT adopted (ASSUMPTIONS.md A3) — Tailwind-first, no build overhead for modules
  - Responsive contract: desktop-only 1440px+ (ASSUMPTIONS.md A2) — only 7% files have responsive behaviour
  - StageContext full split: NOT in this plan — too many consumers, post-v1 scope
  - Accent opacity canonical scale: 6 levels (ASSUMPTIONS.md A6)
  - Card radius: 2.2rem wins (ASSUMPTIONS.md A7)
  - Backend: mock-readiness only, no real fetch (ASSUMPTIONS.md A9)
  - ai.service.ts and clickup.service.ts: future scope, left as stubs (ASSUMPTIONS.md A4)

Files created:
  docs/plans/drafted/src-structure-refactor/README.md                     — plan overview (updated from blocked to ready)
  docs/plans/drafted/src-structure-refactor/ASSUMPTIONS.md                — 9 documented assumptions with reasoning
  docs/plans/drafted/src-structure-refactor/sprints/P1-design-tokens.md   — 8 steps, acceptance criteria, measurable gates
  docs/plans/drafted/src-structure-refactor/sprints/P2-atomic-components.md — 9 steps, 8 acceptance criteria
  docs/plans/drafted/src-structure-refactor/sprints/P3-file-structure.md  — 6 steps, 8 acceptance criteria
  docs/plans/drafted/src-structure-refactor/sprints/P4-backend-readiness.md — 8 steps, 8 acceptance criteria

Before/after metrics documented in README (key ones):
  - Raw #75E2FF usages: 269 → 0
  - text-[Npx] arbitrary font sizes: ~80 files → 0
  - Dead CSS classes: 48 → 0
  - Duplicate visual component groups: 5 → 0
  - Files in src/components/: 44 → 0
  - Import layer violations: 3 → 0
  - Files over 250-line cap: 2 → 0
  - Identical types in domain.ts vs api.ts: 10 → 0
  - draftData: any: 1 → 0
  - Services with 0 error handling: 7 → 0

Gates: no source code changed: PASS
