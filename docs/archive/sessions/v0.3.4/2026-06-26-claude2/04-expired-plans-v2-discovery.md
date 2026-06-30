## SESSION-004 — Expired Plan State + v2 Discovery Plans
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-26
Status: Completed

Intent: Add expired plan lifecycle state; update AGENTS.md with session start connection test and prior art requirements; create v2 discovery plans for UX, frontend, backend, and folder structure.
Trigger: User request: redo folder structure refactor plan with better tooling; add expired state for plans being redone; test skills/MCP at session start; create discovery plans (Codex/opencode will implement).

---

## Changes

### Plan lifecycle: new expired/ state

New lifecycle state added: `expired` (fourth peer to active/drafted/completed).

Definition: plan scope is being reworked with improved tooling, better data, or changed codebase.
Agents must read expired plans before starting replacements. Expired plans are never deleted.

- `docs/agent-rules/core.md` §24 — added expired state definition with rules
- `docs/plans/expired/README.md` — created, index of all expired plans
- 5 plans moved from `completed/` to `expired/`:
  - `ui-ux-discovery` → superseded by `ux-discovery-v2`
  - `frontend-discovery` → superseded by `frontend-discovery-v2`
  - `backend-discovery` → superseded by `backend-discovery-v2`
  - `src-structure-audit` → superseded by `frontend-discovery-v2`
  - `src-structure-refactor` → superseded by `folder-structure-v2`
- Status field updated to `expired` in all 5 plan READMEs

### AGENTS.md additions

1. **Expired plans section** — prior art requirement, index table of all expired plans and supersedors
2. **Session start section** — required commands at every session start:
   - `bash scripts/agent/build-current-state.sh`
   - `bash scripts/agent/verify-tooling-state.sh`
   - Log both under `## Session Environment` in progress log
   - Log MCP operational/awaiting lists, skill availability, blocked gates
3. **Where-things-live table** — added expired/ row

### New drafted plans (4 plans, 10 sprint files)

**ux-discovery-v2** (3 sprints):
- UX2-R1: Token verification post-P1 (`code-query.sh hardcoded-tokens`, grep for raw hex vs baseline 269)
- UX2-R2: Tailwind v4 pattern audit (arbitrary values, dead CSS classes, duplication groups)
- UX2-R3: Visual system synthesis (recommendations for folder-structure-v2 P1/P2)

**frontend-discovery-v2** (3 sprints):
- FE2-R1: Architecture + boundary audit (`npm run validate:architecture`, file size caps, code-index)
- FE2-R2: State + hook pattern analysis (useState count, context inventory, ESLint hook violations)
- FE2-R3: Refactorability + extraction plan (safe-to-extract list vs expired plan's 35-component count)

**backend-discovery-v2** (3 sprints):
- BE2-R1: Type system health (`npm run typecheck`, ESLint any-count, api.ts/domain.ts duplication)
- BE2-R2: Service layer readiness (localStorage scan, apiClient status, mapper coverage)
- BE2-R3: Integration gap report (Scenario A fix list, delta from expired BE-R3)

**folder-structure-v2** (stub, sprint files to be written after discoveries):
- Prior art: expired/src-structure-refactor (P1 partially executed)
- Inherited decisions documented (no CSS modules, partial StageContext split, etc.)
- Before/After metrics table with TBD slots for discovery measurements

### docs/plans/drafted/README.md

Updated with v2 plan table, execution order diagram, and key rule for discovery sprints.

---

## Key design decisions

1. **Expired vs completed**: Completed = work is done and standing. Expired = work scope is being revisited.
   Expired plans are authoritative learning context, not failures.

2. **Discovery sprint tool mandate**: Every v2 discovery sprint requires using scripts
   (`code-query.sh`, `npm run lint`, `npm run validate:architecture`) not manual file reading.
   This makes findings reproducible and exploits the new toolchain.

3. **Prior art fields**: Every new plan has `prior-art:` in its README frontmatter pointing to the
   expired plan it replaces. Every expired plan README has `status: expired` (set via sed).

4. **folder-structure-v2 stays a stub**: Sprint files will be written only after all 9 discovery
   sprint outputs are available. The plan README documents inherited decisions so they are not lost
   or re-litigated.

5. **Executor: Codex / opencode**: Discovery sprints explicitly mark who executes them — not Claude.
   This prevents scope confusion.

---

## Files created/edited summary

Created:
  docs/plans/expired/README.md
  docs/plans/drafted/ux-discovery-v2/README.md
  docs/plans/drafted/ux-discovery-v2/sprints/UX2-R1-token-verification.md
  docs/plans/drafted/ux-discovery-v2/sprints/UX2-R2-tailwind-audit.md
  docs/plans/drafted/ux-discovery-v2/sprints/UX2-R3-visual-synthesis.md
  docs/plans/drafted/frontend-discovery-v2/README.md
  docs/plans/drafted/frontend-discovery-v2/sprints/FE2-R1-architecture-audit.md
  docs/plans/drafted/frontend-discovery-v2/sprints/FE2-R2-state-hook-analysis.md
  docs/plans/drafted/frontend-discovery-v2/sprints/FE2-R3-refactorability.md
  docs/plans/drafted/backend-discovery-v2/README.md
  docs/plans/drafted/backend-discovery-v2/sprints/BE2-R1-type-system.md
  docs/plans/drafted/backend-discovery-v2/sprints/BE2-R2-service-audit.md
  docs/plans/drafted/backend-discovery-v2/sprints/BE2-R3-integration-gap.md
  docs/plans/drafted/folder-structure-v2/README.md

Moved:
  completed/ui-ux-discovery      → expired/ui-ux-discovery
  completed/frontend-discovery   → expired/frontend-discovery
  completed/backend-discovery    → expired/backend-discovery
  completed/src-structure-audit  → expired/src-structure-audit
  completed/src-structure-refactor → expired/src-structure-refactor

Edited:
  docs/agent-rules/core.md §24      — added expired lifecycle state
  AGENTS.md                          — session start test, expired plan section, where-things-live row
  docs/plans/drafted/README.md       — v2 plan table + execution order
  5 expired plan READMEs             — status: expired (via sed)

---

## Gates

  typecheck:              N/A (no application code changed)
  lint:                   N/A (no application code changed)
  validate:architecture:  N/A (no application code changed)
  test:                   N/A (no application code changed)
  browser:                N/A (no application code changed)
