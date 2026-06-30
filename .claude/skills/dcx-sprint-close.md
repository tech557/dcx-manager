---
name: dcx-sprint-close
description: Run deterministic sprint-completion checks for DCX Manager to prevent false completion claims. Use this skill when the user says "mark the sprint complete", "close the sprint", "the sprint is done", "sprint finished", "ready to close", or when an agent is about to write a progress log entry with Status: Completed. Also trigger when reviewing whether another agent's sprint claim is trustworthy. This skill does not rely on natural-language reasoning — it runs scripts.
---

<!-- Claude adapter — canonical source: agent-skills/dcx-sprint-close/SKILL.md -->
<!-- This file adds Claude-specific MCP and hook context. -->
<!-- To update this skill, edit agent-skills/dcx-sprint-close/SKILL.md and run: bash scripts/agent/sync-skills.sh -->


# DCX Sprint Close

This skill prevents false sprint completion. It runs deterministic scripts against
the repository and returns exactly one of:

```
PASS
PASS WITH DOCUMENTED DEBT
BLOCKED
```

Do not close a sprint without running this skill first.

## Step 0 — Pick the closing level (agents bundle runs differently)

Agents do not all close at the same granularity. Identify which level you are closing and apply that
level's bar (core.md §29). Do not claim a higher level than you satisfied.

| Level | What it closes | Bar to close | Where it's logged |
|---|---|---|---|
| **Task** | one acceptance-criterion-sized unit | that criterion has evidence | session log entry |
| **Multi-task** (bundled run) | several tasks closed in one run | each task's evidence recorded; one log may cover all, with a per-task verdict line | one session log listing each task |
| **Sprint** | a sprint file's full acceptance set | ALL criteria met (or debt documented) + gates (§11) + **carry-forward updated (core.md §27)** + output file written | plan `output/` + README sprint status |
| **Plan** | every sprint in the plan | every sprint closed + README → completed + plan moved per core.md §24 + final carry-forward reflects end state | plan README + move folder |

Rules:
- Closing 3 of 5 tasks is a **multi-task** close, not a **sprint** close. State it as such.
- A **sprint** is not closeable while any task lacks evidence, gates were not run, or the
  carry-forward update (§27) is missing.
- A **plan** is not closeable while any sprint is open.
- For a bundled multi-task run, run the gates (Step 1) once for the combined diff, then give each task
  its own acceptance verdict in Step 2.

## Step 0b — Sprint Doctor FIRST (pre-handoff gate — core.md §36)

Before anything else, run the one-shot readiness gate and paste its output into the session log:

```bash
bash scripts/agent/sprint-doctor.sh <plan-name> <sprint-id> <executor-agent>
```

It bundles every check an output-auditor would REOPEN on (close-out artifacts, indexed session log,
carry-forward, tooling portability, determinism, and the gates). **If the verdict is ❌ NOT READY, fix the
listed items before continuing — do not hand the sprint off.** This is what collapses 3–4 re-audit rounds
into one. The detailed scripts below (Step 1) are the same checks the doctor invokes; run them for any item
the doctor flagged.

## Step 1 — Run all verification scripts

Run these in sequence. Do not skip any. Each produces JSON output.

```bash
# 1. Plan state — folder location, frontmatter, sprint status
bash scripts/agent/verify-plan-state.sh

# 2. Version consistency — VERSION.md, package.json, metadata.json
bash scripts/agent/verify-version-state.sh

# 3. Log claims — claimed created/edited/deleted files vs reality
#    Find current session: ls -t docs/progress/sessions/ | head -1
#    Find latest log:      ls docs/progress/sessions/<session>/ | sort | tail -1
bash scripts/agent/verify-log-claims.sh docs/progress/sessions/<session>/NNN-<sprint>.md

# 4. Tooling state — which scripts and packages are operational
bash scripts/agent/verify-tooling-state.sh

# 5. Frontend gates — typecheck, lint, verify.sh, validate:architecture, test, build
bash scripts/agent/verify-frontend.sh

# 6. REQUIREMENT GATES — validate + changed-file reconciliation + completion check
#    Run if the sprint modified any source file (code, scripts, skills, tests).
#    Put changed files in a comma-separated list.
npm run req:validate
npm run req:completion-gate -- --changed <file1,file2,...> 2>&1 || echo "req:completion-gate result logged above"
```

**If `req:completion-gate` returns BLOCKED**, the sprint MUST NOT be closed.
The blocked issues must be resolved before re-running Step 1. See
`dcx-manifestation-reconcile` skill for handling each blocked issue type.

**If the requirements graph does not yet exist** (pre-RS-R5), skip gate #6 and
log: `Requirement gates: SKIPPED — graph not yet populated (pre-RS-R5 state)`.

## Step 1b — Separate pre-existing failures from sprint failures

If `verify-frontend.sh` reports failures, determine if they pre-date this sprint
before blocking it. The lint gate currently has 151 pre-existing errors (tracked
in the LINT-FIX sprint). These must not block unrelated correct sprints.

```bash
# Check how many lint errors exist
npm run lint 2>&1 | tail -3

# If lint fails and you suspect pre-existing errors, note:
# - Pre-existing failures = documented in progress index before this sprint
# - Sprint-introduced failures = present in files you changed
```

Compare lint failures against `docs/progress/index.csv`: if the same count of
failures was present before this sprint started, classify as pre-existing debt and
allow PASS WITH DOCUMENTED DEBT for the gate.

**Rule:** A sprint is BLOCKED only if it *introduced* a new gate failure or if a
required acceptance criterion has no evidence. Pre-existing unrelated failures may
be documented as debt if they are tracked in an open sprint.

## Step 2 — Evaluate acceptance criteria

Read the sprint file's acceptance criteria. For each criterion:
- **code-verifiable**: confirm the gate output from Step 1 covers it
- **test-verifiable**: confirm test results include it
- **browser-verifiable**: confirm Playwright trace or screenshot exists
- **visually verifiable**: confirm screenshot is attached to the log
- **PO-verifiable**: confirm the user has explicitly confirmed it

A criterion is NOT met if:
- The gate was not run
- The test result is not recorded
- The screenshot is described but not provided
- The browser journey was claimed but the dev server was not started

## Step 3 — Check for completion blockers

```bash
# Check for stubs masquerading as complete implementations
grep -rn "console.log" src/builder/ src/actions/ src/services/ | grep -v "\/\/" | grep -v test
```

Any `console.log(...)` at a boundary that the sprint said it would wire means the
sprint is NOT complete (see core.md §16 Stub ≠ Complete).

## Step 4 — Produce the verdict

Return the verdict and exact evidence table:

```markdown
## Sprint Close Verdict: [PASS | PASS WITH DOCUMENTED DEBT | BLOCKED]

### Gate results
| Gate | Result | Evidence |
|---|---|---|---|
| Closing level | Task/Multi-task/Sprint/Plan | [which level this close claims] |
| verify-plan-state | PASS/FAIL | [finding] |
| verify-version-state | PASS/FAIL | [finding] |
| verify-log-claims | PASS/FAIL | [finding] |
| Frontend gates | PASS/FAIL | typecheck 0 errors, lint 0 warn, ... |
| Requirement gates | PASS/BLOCKED/SKIPPED | req:validate + req:completion-gate result (or SKIPPED pre-RS-R5) |
| Acceptance criteria | N/N met | [any unmet criteria] |
| Stubs check | PASS/FAIL | [any console.log boundaries] |
| Browser verification | PASS/BLOCKED | [screenshot, OR `BLOCKED — <tool> unavailable; dev-smoke fallback used` per core.md §28] |
| Tooling fallbacks used | none / list | [each unavailable MCP/test/skill, the fallback used, logged for future] |
| Carry-forward updated (§27) | PASS/N/A | [sprint close only: README carry-forward block updated with this sprint's changes] |

### Documented debt (if PASS WITH DOCUMENTED DEBT)
[List each item, the reason it is accepted, and which sprint will close it]

### Blocking issues (if BLOCKED)
[Exact description of what must be fixed before this sprint can be closed]
```

## Verdict rules

- **PASS**: All gates pass, all acceptance criteria met, no stubs, browser confirmed or N/A. For a
  sprint-level close, the carry-forward update (§27) is written.
- **PASS WITH DOCUMENTED DEBT**: All required gates pass; a non-critical item is explicitly
  accepted as debt and logged in the sprint file with a follow-up sprint name. **A tooling fallback
  (core.md §28) lands here, not in PASS:** e.g. screenshot gate BLOCKED because Playwright Chromium
  is missing but dev-smoke passed — record the fallback, mark the original gate BLOCKED, and log the
  missing tool in the plan README follow-ups.
- **BLOCKED**: Any required gate failed, any stub exists at a claimed boundary, any
  browser-required criterion has no evidence AND no honest fallback, or (sprint level) the
  carry-forward update is missing.

A tool being unavailable is never a reason to return PASS for its gate — use a labelled fallback and
PASS WITH DOCUMENTED DEBT, or BLOCKED. Never fake the gate (core.md §28).

Never return PASS if verify-frontend.sh was not run.
Never return PASS if any acceptance criterion has no evidence.
Never return a **sprint**-level PASS if the carry-forward contract (§27) was not updated.
Never return PASS if the plan folder is `completed/` but the sprint file says `Active`.

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
