---
name: dcx-sprint-planner
description: Plan a DCX Manager implementation, design, refactor, or technical sprint from current evidence. Use this skill whenever the user says "plan a sprint", "create a sprint for", "what should we build next", "draft a plan for", "write a sprint file", "plan the refactor of", or asks for acceptance criteria for a piece of work. Also trigger when a user describes a feature or bug and asks what needs to change — even if they don't use the word "sprint".
---

<!-- Claude adapter — canonical source: agent-skills/dcx-sprint-planner/SKILL.md -->
<!-- This file adds Claude-specific MCP and hook context. -->
<!-- To update this skill, edit agent-skills/dcx-sprint-planner/SKILL.md and run: bash scripts/agent/sync-skills.sh -->


# DCX Sprint Planner

You are planning a sprint for DCX Manager. The project uses a file-based sprint
system in `docs/plans/`. Sprints only become actionable when a PO moves them to
`docs/plans/active/`. Your job is to produce a well-scoped, evidence-based sprint
file — not to begin implementation.

## Step 1 — Read current state (do this first, in parallel)

Run the current-state snapshot to orient yourself:
```bash
bash scripts/agent/build-current-state.sh
```
Then read these files (small, always relevant):
- `docs/VERSION.md` — active version
- `docs/plans/active/` — is there already an active sprint?
- The latest 1–2 progress logs (check `docs/progress/index.csv` for the most recent)

Do NOT read all historical logs. Do NOT read all requirements. Read only what the
user's sprint topic makes relevant.

For CSS/layout or positioning bugs: also check `docs/product/decisions/builder-decisions.md`
for an approved approach before locking in a fix direction in the sprint scope.

## Step 2 — Check Requirement Trace grounding (MANDATORY)

Every plan or sprint output must carry the **Requirement Trace** section defined
in RS-R0b §8. Before writing any sprint file:

1. Read the Requirement Trace format from `docs/plans/active/requirements-system/output/RS-R0b-architecture.md` §8.
2. If the sprint implements or modifies a requirement, identify the graph IDs:
   - `INT-` (intent), `REQ-` (requirement), `BHV-` (behavior rule),
     `AC-` (acceptance outcome), `RSP-` (responsibility), `EMC-` (expected
     category), `MAN-` (manifestation), `TRC-` (trace link), `EVD-` (evidence).
3. If the sprint references behavior claims, cite a graph ID for each.
4. Include the Requirement Trace in the sprint file structure (Step 4).

**If no graph IDs exist for the sprint's scope**, the plan/sprint is not ready
for activation. Do one of:
- Run `dcx-requirement-intake` to propose new requirements.
- Reference RS-R0b's sample records as design IDs for early sprints (pre-RS-R5).
- State explicitly that the sprint is governance-only and exempt from grounding.

**Fail the plan** if a mandatory Requirement Trace is missing and the sprint
touches product behavior or system manifestations.

## Step 3 — Inspect current code (targeted, not full)

For the component or area the sprint concerns:
```bash
bash scripts/agent/code-query.sh component <ComponentName>
bash scripts/agent/code-query.sh consumers <ComponentName>
```

Read the actual source file for any component being refactored. Check file sizes
against the hard caps in `docs/agent-rules/core.md §6` before proposing splits.

Only read `docs/agent-rules/core.md` if you haven't already read it this session.

## Step 3 — Identify conflicts before writing

Before writing a sprint file, state:
- What the user wants done
- What already exists (code + completed sprints on the same topic)
- Any contradiction between the request and existing approved decisions
  (check `docs/product/decisions/builder-decisions.md`)
- Any open question that must be resolved before implementation starts

If a contradiction exists, surface it now. Do not silently adopt a default.

## Step 4 — Write the sprint file

Sprint files live in `docs/plans/active/<plan-name>/` or `docs/plans/drafted/<plan-name>/`.
Ask the user which folder if unclear.

**Sprint file structure:**
```markdown
## [SPRINT-ID] — [Short factual title]
Status: Drafted | Active

### Requirement Trace
| Field | Value |
|---|---|
| Graph IDs | INT-..., REQ-..., BHV-..., AC-..., RSP-..., EMC-..., MAN-..., TRC-..., EVD-... |
| Scope/type | product/frontend/backend/devops/test-qa/data/security/operations/governance/agent-workflow |
| States | governance=..., maturity=..., delivery=... |
| Source/lock | source path + ledger/signoff ref + locked/superseded status |
| Acceptance outcomes | AC-... list |
| Responsibilities | RSP-... list |
| Expected manifestations | EMC-... list |
| Actual manifestations | MAN-... current paths/functions/selectors/scripts/skills/rules/hooks/tests |
| Evidence | EVD-... or queued evidence need |
| Impact/dependencies | depends-on/conflicts/supersedes/supports |
| Coverage | complete/partial/missing/stale/invalidated/exempt |
| Gate result | req:validate + trace/justify/completion-gate result |

### Intent
[One sentence.]

### Step 0 — Session environment + carry-forward (MANDATORY, first step)
Run build-current-state.sh + verify-tooling-state.sh. For a multi-sprint plan, read the README
`## Carry-forward contract` section AND the previous sprint's output/*.md, then obey the
REUSE-don't-RECREATE rule (core.md §7, §27). Name the canonical homes this sprint must reuse
(tokens / classes / components / hooks / services) — never recreate them.

### Scope — in
[Bulleted list of exactly what will change.]

### Scope — out
[Bulleted list of what will NOT change in this sprint.]

### Acceptance criteria
Each criterion must be one of:
- [ ] code-verifiable (typecheck, lint, test)
- [ ] test-verifiable (unit/component/E2E test)
- [ ] browser-verifiable (Playwright MCP or checked-in test)
- [ ] visually verifiable (screenshot required)
- [ ] PO-verifiable (user confirms in real session)

### Verification plan
| Criterion | Method | Evidence required | Fallback if tool unavailable |
|---|---|---|---|
| ... | npm run typecheck | 0 errors | — |
| renders in builder | Playwright MCP screenshot | screenshot attached | dev-smoke HTTP 200 + console; mark the screenshot gate BLOCKED and log the missing tool (core.md §28) |

### Dependencies
[Other sprints, decisions, or open questions that must resolve first.]

### Files likely affected
[List with expected change type: create / edit / delete]

### Final step — Continuity wiring (MANDATORY, last step)
Update the plan README `## Carry-forward contract` with what THIS sprint changed (new/moved files,
new tokens/classes/components, deleted code, new retained-by-policy items, new documented debt) so it
wires forward to ALL later sprints, not just the next one (core.md §27). The sprint is not closeable
until this update is written.
```

For any plan with 2+ sprints, ensure the README contains a `## Carry-forward contract` section as the
single living source of forward truth — add it if missing. Every sprint's Step 0 reads it; every
sprint's final step updates it. (An **output audit** of a completed sprint — `output-review/` — is an
optional but common follow-up; see core.md §30. Plan for it; do not force it where unneeded.)

## Step 5 — Final checks

Before presenting the sprint:
- Scope is bounded (one agent, one session)
- No acceptance criterion is "agent says it looks fine"
- Every browser-verifiable criterion names the specific journey AND a fallback if the MCP/binary is
  unavailable in-session (core.md §28 — log the gap, never fake the gate)
- Scope-out explicitly names the temptations that must be resisted
- Step 0 (carry-forward read) and the final continuity-wiring step are present (core.md §27)
- **Requirement Trace is present** with graph IDs linked to the requirement graph; if no IDs exist
  for the sprint's scope, the absence is explicitly noted as a pre-RS-R5 governance-exempt sprint
- **Every behavior claim** has a graph ID — if a claim lacks a graph ID, the sprint is ungrounded
  and must not be activated

## Output format

Return the sprint file contents and a 2-sentence summary of what makes this
sprint safe to execute now (or what must be resolved first).

Do not create a new plan directory if one already exists for this topic.
Do not add to a completed plan — create a new sprint in a new or existing active plan.

---
## Claude-specific additions

### MCP tools available
- **playwright** (global) — use for browser-verifiable acceptance criteria
- **chrome-devtools** (global) — use for runtime/console/network inspection
- **context7** (global) — use before writing code that depends on a versioned library
- **eslint** (.mcp.json) — use for interactive lint rule explanation and repair
- Storybook / Semgrep / SonarQube / Shadcn — see .mcp.json (disabled; setup required)

### Deferred tool loading
Use ToolSearch to load MCP tool schemas only when needed. Do not load all tools eagerly.
