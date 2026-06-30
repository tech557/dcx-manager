---
plan: docs-refactor
status: drafted
version_context: v0.3.2
created: 2026-06-25
briefed_by: PO
---

# Plan: Docs Refactor

**Status:** Drafted — sprint files are stubs. Move to `docs/plans/active/` after PO review.

---

## Problem Statement

The documentation system has five compounding problems:

1. **AGENTS.md is too large.** At 400+ lines of global rules, agents spend tokens reading rules irrelevant to their role. There is no clear separation between "rules every agent must follow" and "how this specific agent performs best."

2. **No version awareness.** Agents start a session without knowing what product version they are working in. Version is tracked inconsistently across `AGENTS.md`, `docs/README.md`, and nowhere in code.

3. **Progress logs are unstructured for tooling.** Hundreds of markdown session logs exist with no way to aggregate them, query them, or feed a compact summary to a new agent without copying full files. Token cost of onboarding grows with every session.

4. **No archive automation.** When the project moves to a new minor version, logs and plans from the prior version should be archived. This is done manually today and often skipped.

5. **No codebase manifest.** Agents re-discover file purposes and folder structure every session. A generated manifest would cut context-priming tokens significantly.

---

## Initiatives (Sprints)

### DR-1 — AGENTS.md Modularization
**Goal:** Break the monolithic AGENTS.md into a core rules file + per-agent performance profiles.

**Structure after:**
```
AGENTS.md                          ← Routing header only (~80 lines)
                                     Points to: core rules, per-agent guide, VERSION
docs/agent-rules/
  core.md                          ← Boundaries, file sizes, layout contracts, failure modes
  log-format.md                    ← §12 progress log format + §0 identity block
docs/agent-guides/
  claude.md                        ← Role + strengths + known failure modes + startup checklist
  codex.md                         ← Role + strengths + known failure modes + startup checklist
  gemini.md                        ← Role + strengths + known failure modes + startup checklist
  opencode.md                      ← Role + strengths + re-engagement conditions
```

**AGENTS.md becomes a router:**
```markdown
# AGENTS.md — Router

Read these in order:
1. docs/VERSION.md              ← which version you are in
2. docs/agent-rules/core.md     ← non-negotiable rules
3. docs/agent-guides/<you>.md   ← your role and performance profile
4. docs/plans/active/           ← current work
```

**Performance profiles to add to each agent guide:**

Each guide must include:
- `## Known strengths` — patterns this agent applies correctly without reminders
- `## Known failure modes` — patterns this agent gets wrong under pressure (sourced from session audit logs)
- `## Startup checklist` — what this agent reads before writing any code, ordered by priority
- `## Task handoff format` — what this agent produces for the next agent to pick up cleanly

**Sources for performance data:** `docs/progress/sessions/2026-06-25-codex-audit/`, session logs, and AGENTS.md §16/§22/§24.

---

### DR-2 — Version Awareness System
**Goal:** Every agent session starts knowing the current product version and what that means for log archiving.

**Deliverables:**

`docs/VERSION.md` — single source of truth:
```markdown
# Project Version

current: v0.3.2
previous_minor: v0.2.x (archived: docs/archive/v0.2/)
next_planned: v0.4.0

## Version semantics
- Patch (0.3.1 → 0.3.2): bug fixes, visual polish. Logs accumulate in active session folders.
- Minor (0.3 → 0.4): feature boundary. Triggers archive sweep (see scripts/archive-version.sh).
- Major (0 → 1): full system change. Full docs freeze + new docs tree.

## What agents do with this
- Read this file first, before AGENTS.md core.
- Confirm the version matches the active plan's version_context frontmatter.
- If there is a mismatch, stop and ask the PO before proceeding.
```

`scripts/version-bump.sh` — bump version, update VERSION.md, optionally trigger archive:
```bash
./scripts/version-bump.sh patch   # 0.3.2 → 0.3.3
./scripts/version-bump.sh minor   # 0.3.x → 0.4.0  (also runs archive-version.sh)
```

`scripts/archive-version.sh` — on minor bump, moves:
- `docs/progress/sessions/**` → `docs/archive/sessions/v0.3/`
- `docs/plans/active/**` → `docs/plans/completed/**` (if all sprints done)
- Updates `docs/archive/README.md` with version summary

---

### DR-3 — Log-to-CSV Pipeline
**Goal:** Convert session logs into a compact, queryable CSV that agents can read in <200 tokens instead of scanning hundreds of markdown files.

**Deliverables:**

`docs/progress/index.csv` — auto-generated session summary:
```
date,agent,model,session_folder,sprint_id,status,files_changed,lines_added,lines_removed,gates_passed,notes
2026-06-25,claude,claude-sonnet-4-6,2026-06-25-claude,BUG-OVF,completed,2,47,31,true,Timeline scroll fix
2026-06-25,opencode,unknown,2026-06-25-opencode,BUG-STAGE,code-complete,3,22,8,false,browser-check-blocked
```

`scripts/build-log-index.sh` — parses all `docs/progress/sessions/**/NN-*.md` files, extracts frontmatter/header fields, appends rows to `index.csv`.

**Agent usage:** Instead of reading individual session files, an agent reads `index.csv` for the last 20 rows to understand recent history. Only open specific log files when investigating a specific sprint.

**Archive behavior:** On minor version bump, `archive-version.sh` moves current `index.csv` rows to `docs/archive/sessions/v0.3/index.csv` and starts a fresh `index.csv`.

---

### DR-4 — Codebase Manifest
**Goal:** Give agents a single file that describes every source folder and key file in `src/` so they spend fewer tokens on discovery.

**Deliverables:**

`docs/references/codebase-manifest.md` — auto-generated + manually annotated:
```markdown
# Codebase Manifest — v0.3.2
_Generated: 2026-06-25 | Script: scripts/gen-manifest.sh_

## src/actions/ (3 files, ~280 lines)
Purpose: All builder mutations. Consumed via useBuilderActions() only.
Key exports: useBuilderActions, builderActions, createPhase, movePhases
Do not import directly from cards/islands/stage.

## src/builder/cards/ (12 files across templates/, ~1800 lines)
Purpose: Card chassis (CardShell) + card templates (PhaseCard, ActionCard, TaskCard, DayGridCard)
Key constraint: Never import from src/services/ or src/rules/ — use useCardBehavior()

## src/builder/islands/ (8 islands, ~1400 lines)
...
```

`scripts/gen-manifest.sh` — walks `src/` using `find`, reads file line counts, extracts top-level exports via `grep "^export"`, outputs structured markdown. Manual annotations are preserved via a `# MANUAL:` comment block that the script does not overwrite.

**Regeneration trigger:** Run before any planning session when the codebase has changed significantly. Not part of CI.

---

### DR-5 — Stale Docs Cleanup
**Goal:** Remove or update documents that are outdated and consume agent tokens without providing accurate information.

**Items to address:**
- `docs/product/requirements/` CSV files — outdated, superseded by markdown requirement files. Archive or delete.
- `docs/architecture/builder/current-architecture.md` — verify accuracy against current code; update or archive.
- `docs/README.md` — update version reference (currently says v0.2.15).
- `docs/references/README.md` — populate with what's actually there.
- Audit for references to removed libraries (gsap was removed; any docs still referencing it?).
- `docs/plans/active/` — now empty after builder-refactor move; add a README explaining the folder is empty.

---

## Execution Order

```
DR-5 first  ← unblocks clean baseline (fast, no scripts)
DR-2        ← version file needed before DR-3 references it
DR-4        ← manifest generation can run once codebase is stable
DR-3        ← CSV pipeline built after manifest exists for reference
DR-1 last   ← AGENTS.md split happens after all other docs stabilize
```

DR-5 and DR-2 can be done by Claude in a single session.  
DR-3 and DR-4 require a script-capable agent (Codex or Claude with terminal).  
DR-1 is a planning + writing task, best done by Claude.

---

## Out of Scope

- Changing any source code
- Updating product requirements content (only format/location changes)
- Changing build config or CI pipelines
- Any changes to `src/`
