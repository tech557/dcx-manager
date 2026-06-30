## P2 — Atomic Component System
Agent: Codex
Model: gpt-5
Provider: OpenAI
Date: 2026-06-26
Status: Partial

Intent: Consolidate duplicated UI patterns into stable atoms and relocate components by capability owner.
Trigger: User request — "start with P2"
Requirements covered: P2 acceptance criteria

Execution strategy:
  Task groups with typecheck and consumer verification after each group; no single bulk rewrite.

Files created:
  src/ui/atoms/Badge.tsx — domain-neutral badge visual primitive
  src/ui/atoms/Chip.tsx — domain-neutral pill/button primitive
  src/ui/atoms/Input.tsx — domain-neutral input primitive
  src/ui/atoms/ToggleGroup.tsx — typed toggle-group primitive
  src/ui/atoms/index.ts — atom exports
  src/ui/ReadinessBadge.tsx — semantic readiness wrapper
  src/hooks/useToggle.ts — shared boolean toggle hook
Files edited:
  src/ui/StatusBadge.tsx — now wraps Badge without changing its public API
  src/ui/LockBadge.tsx — now wraps Badge without changing its public API
  src/ui/surfaces/GlassSurface.tsx — additive card/island/popup/popover variants
  src/builder/cards/templates/phase/PhaseReadinessBadge.tsx — compatibility alias to ReadinessBadge
  src/builder/islands/MetadataIsland/ViewTabSwitcher.tsx — migrated to ToggleGroup
  src/builder/islands/EditorViewerIsland/PhaseEditorSection.tsx — migrated to ToggleGroup
  src/ui/atoms/Chip.tsx — added semantic span mode and forwarded native button/drag handlers
  src/ui/atoms/Input.tsx — exported shared class generation for input and textarea wrappers
  src/components/forms/inputs/* — seven existing input APIs now consume Input or its shared style generator
  src/components/elements/buttons/* — three existing builder button APIs now consume Chip
  src/builder/cards/templates/task/task-properties/ChannelPill.tsx — non-interactive Chip wrapper
  29 open/close consumers — migrated from local useState booleans to useToggle while preserving existing APIs
Files deleted:
  None

Churn — work reversed:
  None

Preserve-semantic check:
  Domain-neutral atoms remain free of builder imports. Existing semantic wrapper APIs remain stable during migration.

Open decisions used:
  P2 reviewed decisions — semantic wrappers remain; editor panel/draft/guard hooks remain separate; files relocate by capability owner.

Acceptance criteria:
  □ Atom foundation — PASS
  □ Semantic wrappers — PASS
  □ Badge, ToggleGroup, Chip, and Input wrapper migrations — PASS
  □ useToggle foundation and open/close consumer migration — PASS (29 consumers plus hook)
  □ Editor active-node deduplication — pending
  □ Capability-based relocation — pending
  □ Gates and browser validation — pending

Gates:
  typecheck: PASS after Task Groups 1–3
  dev: PASS — Vite started at http://localhost:3002/
  build: PASS
  vitest: PASS — 27/27 tests
  verify.sh: PASS
  browser manual check: PASS — builder loaded with 0 console warnings/errors; ToggleGroup changed stage view; creator Chip opened the palette; status dropdown and Focus panel toggles opened correctly

Consumer updates required:
  Existing public wrapper imports remain compatible. Badge, ToggleGroup, Chip, and Input consumers were verified through repository search and compilation.

Open issues / follow-ups:
  The plan's raw `useState(false) ≤8` grep target is not behaviorally valid. Count is 22 after migration; every remaining case is non-open state (drag/hover/feedback/loading/saving/dirty/provider signal). Continue with editor active-node deduplication, then capability-based relocation.
