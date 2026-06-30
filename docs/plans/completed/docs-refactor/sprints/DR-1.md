# DR-1 — AGENTS.md Modularization

**Status:** Draft

---

## Objective

Break the monolithic AGENTS.md (501 lines) into a routing header (~80 lines) + extracted rule files + updated per-agent guides. No source code changed.

## Requirements and IDs

None — this is a doc-only sprint.

---

## Tasks

### T1. Create `docs/agent-rules/core.md`

Extract from AGENTS.md:
- §1 What This Project Is
- §2 Documentation Authority Order + Where things live + Requirement ID format
- §3 How to Work in One Session
- §4 UI-Churn Problem (the #1 Failure Mode)
- §5 Preserve-Semantic Boundaries
- §6 File Size Rules
- §7 Before Creating Any File
- §8 Folder Placement + Import level rule
- §9 The Five Boundaries
- §10 Builder Layout Contract — Frozen
- §11 Session Gates
- §13 Animation — One System, One Library
- §14 Home and Version Pages
- §15 Absolute Constraints
- §16 The Nested Node Rule (#2 Failure Mode)
- §17 Stub ≠ Complete
- §18 Popup ≠ Modal
- §19 wc -l Before Claiming Complete
- §20 Visual Polish Sprints — CSS Only
- §21 Reduced Motion — Always Required
- §22 Layout Viewport Planning (#3 Failure Mode)
- §23 Island Boundary Rules
- §24 Layout State Signal Rule (#4 Failure Mode)
- §25 Plan Lifecycle — Active vs Drafted vs Completed
- §26 User-Initiated Tasks vs Active Plan Sprints

Preserve all language verbatim. Only change: renumber sections sequentially (no longer using §N from AGENTS.md). Add an explicit note: "This file replaces AGENTS.md §§1-26. No rule is changed — only extracted."

### T2. Create `docs/agent-rules/log-format.md`

Extract from AGENTS.md:
- §0 Identity Block (verbatim)
- §12 Progress Log Format (verbatim, including the template and log rules)

### T3. Slim `AGENTS.md` to routing header

New AGENTS.md (~80 lines):
- Title line + version
- "This file is a router. Read the files below in order before writing code."
- Router:
  1. `docs/VERSION.md` (will exist after DR-2) — or skip if not yet created
  2. `docs/agent-rules/core.md`
  3. `docs/agent-guides/<your-agent>.md`
  4. `docs/plans/active/`
- Quick-reference table: Where things live (same table as current §2)
- Brief statement: The core rules, log format, and per-agent guidance have moved to the files above. No rules were changed — only extracted.

### T4. Update per-agent guides

Each guide must include (as specified in plan README):
- `## Known strengths`
- `## Known failure modes`
- `## Startup checklist` — what this agent reads before writing any code
- `## Task handoff format` — what this agent produces for the next agent

Sources: existing guide content, AGENTS.md failure modes (§16/§22/§24), session audit logs, and the opencode guide's existing performance data.

**claude.md:** Add strengths/failure modes/startup-checklist/task-handoff sections. Source from session logs (audit of 50+ sessions referenced in AGENTS.md).

**codex.md:** Already has rules for every task. Add strengths/failure modes/startup-checklist/task-handoff.

**gemini.md:** Already has a common failure modes table. Reformat to match the same section headers. Add strengths/startup-checklist/task-handoff.

**opencode.md:** Already has extensive strengths/failure modes/mitigations. Reorganize to match the same section headers. Add `## Task handoff format`. Update the startup instructions to reference `docs/agent-rules/core.md` instead of AGENTS.md §§.

**agent-guides/README.md:** Add opencode to the table.

---

## Acceptance Criteria

- [ ] AC1: `docs/agent-rules/core.md` exists and contains all extracted sections from AGENTS.md §§1-26 (except §0, §11, §12) with original language preserved
- [ ] AC2: `docs/agent-rules/log-format.md` exists with §0 identity block and §12 log format template
- [ ] AC3: AGENTS.md is ≤ 85 lines and acts as a router pointing to core.md, agent-guides, and active plans
- [ ] AC4: Every agent guide (claude.md, codex.md, gemini.md, opencode.md) has sections: Known strengths, Known failure modes, Startup checklist, Task handoff format
- [ ] AC5: agent-guides/README.md includes opencode in the table
- [ ] AC6: No source code (src/) was changed
- [ ] AC7: No file exceeds its size cap (core.md ≤ 400 lines as registry/config, log-format.md ≤ 200 lines as config)
- [ ] AC8: Final AGENTS.md routing header accurately describes where each rule category lives and does not repeat extracted content

---

## Gates

- [ ] `npm run typecheck` — 0 errors (no source changes expected, but verify)
- [ ] `bash scripts/verify.sh` — no forbidden patterns
- [ ] Manual: all existing links in docs/agent-guides/README.md still resolve
