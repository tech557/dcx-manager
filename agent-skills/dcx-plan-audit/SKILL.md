---
name: dcx-plan-audit
description: >
  Audit a DCX Manager plan file and produce structured feedback in the format the
  System Architect (Claude) needs to act on it. Use this skill whenever an agent
  is asked to "audit a plan", "review a plan before we activate it", "check if
  this plan is ready", "give feedback on this sprint", "second opinion on this
  plan", or when a plan is about to be moved from drafted/ to active/. Trigger
  proactively when a plan references prior art you have not confirmed was read,
  or when a sprint has acceptance criteria that cannot be verified by running a
  script. The output is a decision-quality audit report — not notes, not opinions,
  not summaries. Think: a senior engineer writing structured code review comments
  on an architecture doc that will be handed to a junior engineer to execute.
---

# DCX Plan Audit

You are the Senior Engineer reviewing the System Architect's plan. Your job is not
to approve or criticize — it is to catch what the architect might have missed:
unverifiable acceptance criteria, undeclared assumptions, scope that will silently
expand, and handoffs that will confuse the executing agent.

The audit output is a decision-quality report that Claude (System Architect) can
read and act on with confidence. Write for precision, not politeness.

> **Plan audit vs output audit.** This skill is the **plan audit** — it reviews a plan *before*
> activation (`audit/` folder). A separate, **optional but common** review — the **output audit** —
> reviews a sprint's *output after execution* and lives in the plan's `output-review/` folder
> (core.md §30). An output audit may re-open a sprint when it finds a plan gap. If you were asked to
> review a *completed sprint's output* rather than a not-yet-active plan, write to `output-review/`,
> not `audit/`, and judge execution-against-the-real-tree (did it reuse existing tokens/classes/files
> per §7/§27?) rather than pre-activation readiness.

---

## Team roles (context)

| Agent | Role | Primary concern |
|---|---|---|
| Claude | System Architect | Correctness of the plan structure, architectural decisions |
| Codex | Senior Engineer | Implementation feasibility, scope risk, missing context |
| opencode | Junior Engineer | Clarity of sprint files — will follow them literally |
| Gemini (AI Studio) | Frontend/Artistic | Visual fidelity, design system consistency |

When you write your audit, address Claude directly. Flag anything that would
confuse opencode. If a Gemini sprint exists, flag missing visual specs.

---

## Before you start

1. Run environment check:
   ```bash
   bash scripts/agent/build-current-state.sh
   bash scripts/agent/verify-tooling-state.sh
   ```
   Log both under `## Session Environment` in your progress log.

2. Read the plan README in full.

3. Read every sprint file listed in the plan's Sprint Index.

4. If the plan has a `prior-art:` field — read those expired plan outputs before
   auditing. Prior art findings are load-bearing for the new plan's scope.

---

## What to audit

### 0. Requirement Trace grounding (MANDATORY — fail if missing)

Every plan and sprint output **must** carry a Requirement Trace section per the
RS-R0b §8 format. Check:

- Does each sprint file have a `## Requirement Trace` section after the title?
- Does the trace include graph IDs (`INT-`, `REQ-`, `BHV-`, `AC-`, `RSP-`,
  `EMC-`, `MAN-`, `TRC-`, `EVD-`)?
- Do **behavior claims** in the sprint reference a graph ID? Any claim like
  "implements focus control" without naming `INT-FOCUS-CONTROL` or `REQ-FCS-002`
  is an ungrounded claim.
- If the sprint touches code: are the expected manifestations (`EMC-`) and actual
  manifestations (`MAN-`) filled?
- If the sprint touches product behavior: are `Scope/type`, `States`, and
  `Source/lock` filled?
- If the sprint runs verification: is `Gate result` filled?

**Fail the plan** (verdict NOT READY or NEEDS REVISION) if:
1. Any sprint file is missing the Requirement Trace section entirely.
2. Any sprint makes behavior claims without graph IDs.
3. Any code-modifying sprint has empty `Actual manifestations` and the sprint
   title or scope says it creates new code.
4. The Requirement Trace claims coverage (`complete`, `partial`, etc.) without
   evidence that `req:validate` or `req:completion-gate` ran.

**Exception:** Pre-RS-R5 sprints that cite RS-R0b design IDs only and explicitly
state "Requirement Trace uses design IDs — graph IDs pending RS-R5 inventory."
This must be a deliberate statement, not a default.

---

### 1. Prior art compliance
Does the plan reference what was learned from its expired predecessor?
- Does the README have a `prior-art:` field?
- Are the expired plan's key findings incorporated (not just mentioned)?
- Are any recommendations from the expired plan being repeated without acknowledging
  they were already tried? (This is the most expensive mistake to make.)
- Are any recommendations being silently dropped without a documented reason?

### 2. Sprint feasibility
For each sprint file: can an agent (opencode or Codex) actually complete it with
the tools and information provided?
- Are the `bash` commands in the sprint steps real commands that exist in this repo?
  Check: `scripts/agent/`, `npm run`, `grep`, `find` patterns.
- Does each step produce a deterministic output, or does it require judgment calls
  that are not defined in the sprint?
- Are the acceptance criteria verifiable by running a script, not by reading files manually?
  Flag any criterion that uses words like "check", "ensure", "verify" without naming
  the command that checks it.
- Can the expected output format be produced without reading the full code-index?
  (Good: `bash scripts/agent/code-query.sh component X` — Bad: "read code-index/components.json")

### 3. Scope risk
What is underspecified or likely to expand?
- Anything that says "and related files" without naming them
- Any script that hasn't been confirmed to exist with `ls` or `find`
- Any "if X then Y" branch in a sprint that doesn't have a defined fallback
- Acceptance criteria that use counts ("~30 files") without a deterministic source
  for that count

### 4. Gate coverage
Every sprint that modifies code must run gates before claiming done.
Required gates (unless sprint explicitly marks them N/A with a reason):
- `npm run typecheck` (0 errors)
- `npm run lint` (max-warnings 0, or pre-existing debt documented)
- `npm run validate:architecture` (0 violations)
- `npm run test` (all pass)

Check: does each sprint file list which gates it runs? Flag any sprint that says
"browser verification" without a running dev server being part of the steps.

### 5. Multi-agent handoff quality
Is the output of each sprint sufficient input for the next sprint?
- Does the output format section define the exact file path and section structure?
- If the next sprint is executed by a different agent, is enough context in the
  output file that the next agent doesn't need to re-read the source code?
- Is the executor (`Codex / opencode / Gemini`) named for each sprint?

### 6. Session start compliance
Does the plan require agents to run `build-current-state.sh` and log results?
Check if each sprint has an explicit "Session environment check" step. Sprint files
without this step risk starting from stale state.

### 7. Continuity wiring (core.md §27)
For any plan with 2+ sprints, the README must carry a single `## Carry-forward contract`
section (canonical homes + facts each completed sprint leaves behind). Check:
- Does the contract exist? Flag its absence as blocking for a multi-sprint plan.
- Does **every** sprint's Step 0 read the contract + the previous sprint's output?
- Does **every** sprint's final step update the contract (so it wires forward to ALL later
  sprints, not just the next)? Flag any sprint that ends without a carry-forward update.
- Does the plan rely on "sprint 2 knows about sprint 1" alone? That is the failure mode — the
  contract must make sprint N inherit the real tree left by sprints 1…N-1.

### 8. Tooling fallbacks (core.md §28)
Any acceptance criterion that depends on an MCP, a binary, or an installed tool (Playwright
screenshot, Storybook, semgrep, a browser MCP) must name a **fallback** for when it is
unavailable in-session. Flag any "if X then Y" branch without a defined fallback, and any
browser/visual gate with no honest degraded path. The rule is: log the gap, never fake the
gate. (Do not flag the *absence of installation* — we are not fixing setup now; flag the
absence of a documented fallback + a follow-up log.)

---

## Output format

Write the audit to `audit/YYYY-MM-DD-<your-agent-id>.md` inside the plan folder.
If an `audit/` folder does not exist, create it.

Use exactly this structure:

```markdown
---
audit-of: <plan-name>
auditor: <your agent id>
date: YYYY-MM-DD
verdict: READY | NEEDS REVISION | NOT READY
blocking-issues: N
advisory-issues: N
---

# Plan Audit: <plan-name>

## Verdict

READY / NEEDS REVISION / NOT READY

**Reason:** [One sentence. Be direct. "Sprint FE2-R1 has unverifiable acceptance criteria
and no gate coverage." not "There are some areas that could be improved."]

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | FE2-R1 | `code-query.sh hardcoded-tokens` is called but does not exist in scripts/agent/ | `ls scripts/agent/` shows no such script | Add the script or replace with the equivalent grep command |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|

## Prior art compliance

[What the expired plan found. What this plan incorporates. What it silently dropped.
If no expired plan: state "No prior art — first plan of this scope."]

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| UX2-R1 | N/A | N/A | N/A | N/A | N/A | Discovery sprint, no code changed |

## Handoff quality

[Are the output formats sufficient for the next agent? Flag any output that would
require the next agent to re-read source files.]

## Ready checklist

- [ ] All blocking issues resolved
- [ ] Prior art findings incorporated
- [ ] Every sprint has executor named
- [ ] Every code-modifying sprint has gate coverage
- [ ] Session start steps present in each sprint
- [ ] (2+ sprints) Carry-forward contract present; every sprint reads it (Step 0) and updates it (final step)
- [ ] Tool-dependent criteria have a documented fallback (core.md §28)
```

---

## Verdict definitions

**READY** — No blocking issues. Advisory issues are noted but the plan can be
activated as-is. The PO can move it to `docs/plans/active/`.

**NEEDS REVISION** — 1–3 blocking issues that are fixable in under an hour.
List exact fixes. The plan should not be activated until they are resolved.

**NOT READY** — Fundamental scope, dependency, or feasibility problem.
The plan needs to be re-drafted, not patched. Explain what the new draft needs
to get right that this one doesn't.

---

## What NOT to audit

Do not flag:
- Stylistic preferences (how the plan is phrased)
- Disagreements with architectural decisions already documented in expired plans
  or `docs/product/decisions/`
- Issues outside the plan's stated scope
- The fact that a plan doesn't have tests yet (discovery sprints explicitly don't change code)

If you find yourself writing "I would have approached this differently", stop.
That's not an audit finding — it's an opinion. An audit finding names a specific
file, a specific command, and a specific failure mode.
