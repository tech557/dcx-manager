# AGENTS.md — DCX Manager — Router

**This file is a router.** The core rules, log format, and per-agent guidance have moved to the files below. No rules were changed — only extracted.

Read these files **in order** before writing any code:

```
1. docs/VERSION.md                  ← Which version you are in
2. docs/agent-rules/core.md         ← Non-negotiable rules for every agent
3. docs/agent-rules/log-format.md   ← Progress log format + identity block
4. docs/agent-guides/<your-agent>.md  ← Your role, strengths, failure modes
5. docs/plans/active/               ← Current sprint work
```

---

## Where things live

| What | Where |
|---|---|---|
| Product requirements | `docs/product/requirements/graph/` (graph is the source of truth) |
| Confirmed decisions | `docs/product/requirements/graph/ledger/decision-ledger.jsonl` |
| Open decisions | `docs/product/requirements/graph/nodes/open-question/` |
| Legacy docs (archived) | `docs/archive/` |
| **Active** sprint plans | `docs/plans/active/<plan-name>/` |
| **Drafted** plans (no agent work allowed) | `docs/plans/drafted/<plan-name>/` |
| **On-hold** plans (paused mid-flight — no execute/draft/resume; see `core.md §24`) | `docs/plans/on-hold/<plan-name>/` |
| **Completed** plans (read-only archive) | `docs/plans/completed/<plan-name>/` |
| **Expired** plans (prior art — must read before replacement) | `docs/plans/expired/<plan-name>/` |
| Progress logs | `docs/progress/sessions/[date]-[agent]/` |
| Agent guides | `docs/agent-guides/` |
| Core rules | `docs/agent-rules/core.md` |
| Log format | `docs/agent-rules/log-format.md` |

---

## Quick reference

| What was in original AGENTS.md | Now lives in |
|---|---|
| Identity block (§0) | `docs/agent-rules/log-format.md` §0 |
| Project description, layout (§1) | `docs/agent-rules/core.md` §1 |
| Authority order (§2) | `docs/agent-rules/core.md` §2 |
| How to work (§3) | `docs/agent-rules/core.md` §3 |
| UI-Churn (#1 failure, §4) | `docs/agent-rules/core.md` §4 |
| Preserve-semantic boundaries (§5) | `docs/agent-rules/core.md` §5 |
| File size rules (§6) | `docs/agent-rules/core.md` §6 |
| Before creating any file (§7) | `docs/agent-rules/core.md` §7 |
| Folder placement (§8) | `docs/agent-rules/core.md` §8 |
| Five boundaries (§9) | `docs/agent-rules/core.md` §9 |
| Layout contract (§10) | `docs/agent-rules/core.md` §10 |
| Session gates (§11) | `docs/agent-rules/core.md` §11 |
| Log format (§12) | `docs/agent-rules/log-format.md` §1 |
| Animation (§13) | `docs/agent-rules/core.md` §12 |
| Home/Version pages (§14) | `docs/agent-rules/core.md` §13 |
| Absolute constraints (§15) | `docs/agent-rules/core.md` §14 |
| Nested node rule (#2 failure, §16) | `docs/agent-rules/core.md` §15 |
| Stub ≠ complete (§17) | `docs/agent-rules/core.md` §16 |
| Popup ≠ modal (§18) | `docs/agent-rules/core.md` §17 |
| wc -l gate (§19) | `docs/agent-rules/core.md` §18 |
| Polish sprints (§20) | `docs/agent-rules/core.md` §19 |
| Reduced motion (§21) | `docs/agent-rules/core.md` §20 |
| Viewport planning (#3 failure, §22) | `docs/agent-rules/core.md` §21 |
| Island boundary rules (§23) | `docs/agent-rules/core.md` §22 |
| Layout state signal (#4 failure, §24) | `docs/agent-rules/core.md` §23 |
| Plan lifecycle (§25) | `docs/agent-rules/core.md` §24 |
| User-initiated tasks (§26) | `docs/agent-rules/core.md` §25 |

---

## Session start — environment and connection test

At the beginning of every session (before any code work), run and log the following:

```bash
# 1. Orient: version, active plans, tool status, MCP operational list
bash scripts/agent/build-current-state.sh

# 2. Confirm all frontend gates are available
bash scripts/agent/verify-tooling-state.sh
```

Log both outputs in your session progress file under a `## Session Environment` heading. Record:
- Repository version
- Active plans (if any)
- MCP operational list (from CURRENT_STATE.json `mcp_operational`)
- MCP awaiting list (from CURRENT_STATE.json `mcp_awaiting`)
- Any gate that is BLOCKED or missing (semgrep CLI, Chrome DevTools, etc.)
- Whether code-index is fresh or stale

If a gate you need for the current task is BLOCKED, write `BLOCKED — <reason>` in the session log and stop before claiming that gate passes.

**Skills**: Before invoking a skill, verify it is listed in `.claude/skills/` (Claude) or `.agents/skills/` (other agents). Log which skills you invoked and whether they resolved.

**MCP session status**: The `mcp_operational` list in CURRENT_STATE.json reflects what was connected at the time `build-current-state.sh` was last run. Always log actual tool availability discovered in-session (e.g., `mcp__Claude_Preview__*` available, `mcp__playwright__*` not in deferred list).

---

## Expired plans — prior art requirement

Before starting any sprint that is a rediscovery, re-audit, or replacement of prior work:

1. Check if `docs/plans/expired/` contains a plan with matching scope.
2. If yes: **read the expired plan's README and all output files** before writing a single line.
3. Record in the session log: "Read expired plan X — key prior finding: …"
4. Do not reproduce analysis the expired plan already did unless the codebase has changed enough to invalidate it.

Expired plan index:

| Expired plan | Superseded by | Key outputs |
|---|---|---|
| `ui-ux-discovery` | `ux-discovery-v2` | UX-R1 token inventory, UX-R2 CSS map, UX-R3 synthesis |
| `frontend-discovery` | `frontend-discovery-v2` | FE-R1 component tree, FE-R2 state flow, FE-R3 duplication map |
| `backend-discovery` | `backend-discovery-v2` | BE-R1 type inventory, BE-R2 service audit, BE-R3 integration gap |
| `src-structure-audit` | `frontend-discovery-v2` | SA-R1 dep graph, SA-R2 tool eval, SA-R3 structure assessment |
| `src-structure-refactor` | `folder-structure-v2` | P1–P4 sprints, discovery outputs, ASSUMPTIONS.md |

---

## Project skills — when to use each

Project skills are available in `.claude/skills/` (Claude) and `.agents/skills/` (other agents).
The canonical source is `agent-skills/`. Full documentation: `docs/agent-skills.md`.

| Skill | Trigger keywords |
|---|---|
| `dcx-sprint-planner` | "plan a sprint", "create a sprint for", "draft a plan", "what should we build next" |
| `dcx-frontend-refactor` | "refactor X", "extract component", "modularize", "split file", before creating any new component |
| `dcx-frontend-verify` | "verify my change", "run the tests", "does this pass?", sprint gate check |
| `dcx-sprint-close` | "mark sprint complete", "close the sprint", "sprint is done", before writing Status: Completed |
| `dcx-code-query` | "where is X", "who uses X", "find label Y", "consumers of X", any codebase structure question |
| `dcx-plan-audit` | "audit this plan", "review the plan", "is this ready to activate", "check if this sprint is executable", "second opinion on this plan", before moving any drafted plan to active |
| `dcx-requirement-intake` | "we need a requirement", "new feature", "users should be able to", PO message with product intent, change-trigger finds unlinked manifestation |
| `dcx-requirement-maturation` | "mature this requirement", "add acceptance criteria", "specify rules", "ready to lock", "advance maturity" |
| `dcx-manifestation-reconcile` | "close the sprint" (code changed), "verify my change", "reconcile manifestations", "check traces", "run completion gate" |
| `impeccable` | **QUARANTINED — do not invoke yet.** Third-party visual/design skill; see `docs/agent-skills.md` before any future use. |

**Rule:** Do not manually reproduce a workflow when a relevant project skill exists. Invoke the skill.

**Rule:** Do not read full code-index files (`code-index/*.json`) when `scripts/agent/code-query.sh`
covers the question. The query script returns focused output; the full files are 16,000+ lines.

**Rule:** Do not re-read `AGENTS.md`, `core.md`, or all requirements files at the start of every
task. Read only what the current task requires. Use `build-current-state.sh` to orient.

---

## Integrity rules — completion claims

- **Never claim a gate passed without running it.** Record exact output in the progress log.
- **Never claim browser verification passed** if the dev server or browser was not started.
- **Never claim a test passed** without a recorded test run result.
- **Never claim an MCP is operational** without having successfully connected to it.
- **Historical logs are evidence, not absolute truth.** Current repository state overrides old
  completion claims. Run `verify-log-claims.sh` to check whether a log's claims hold.
- **Blocked external setup must be reported as BLOCKED**, not skipped or assumed passing.
- **Never close a sprint** without running `dcx-sprint-close` (or its equivalent scripts manually).

---

## Communicating with the PO

The operator is a real Product Owner, not a developer. Default to product-friendly language; add
technical depth only when the decision needs it. Reserve "stop and get PO sign-off" for genuine
PO-level decisions (production risk, user-facing impact, scope/cost change, compliance/security
exposure, irreversible actions) — not routine technical execution. Full rule: `core.md §37`.

---

## Frontend tool routing

Use the right tool proportionally. Do not run every tool for every edit.

| Concern | Tool |
|---|---|
| Existing component, props, variants | Storybook MCP (when installed) → `code-index/components.json` |
| React hooks / rendering health | `npm run inspect:react` (react-scan, dev server running) |
| Local lint or coding rule | `npm run lint` (ESLint CLI) — ESLint MCP for interactive repair |
| Module / import boundaries | `npm run validate:architecture` (dependency-cruiser) |
| Structural code search | `npm run scan:semgrep` or Semgrep MCP |
| Browser user journey | Playwright MCP (global) |
| Permanent behavior regression | Checked-in Playwright test in `e2e/` |
| Runtime / console / network | Chrome DevTools MCP (global) |
| Repo-wide complexity / duplication | SonarQube MCP (when configured) |
| Approved component sourcing | Shadcn MCP → always check `src/ui/` first |

**Proportional verification rule:**

| Change type | Run |
|---|---|
| Copy / CSS only | `typecheck` + `lint` + `verify.sh` |
| Component behavior | Above + `test` + `validate:architecture` |
| Architecture / refactor | `verify:frontend` + `test:e2e` + `inspect:react` |
| Final sprint / release | Everything above + screenshot evidence |

Full matrix: `docs/architecture/frontend-verification-matrix.md`

---

## Requirements tool routing

Use the right tool for requirements governance work. See `core.md §35` for the mandatory rules.

| Concern | Tool |
|---|---|
| Requirement proposal (PO message → candidate) | `dcx-requirement-intake` skill |
| Requirement maturation (add rules, AC, evidence) | `dcx-requirement-maturation` skill |
| Pre-close reconciliation + completion gate | `dcx-manifestation-reconcile` skill → `npm run req:completion-gate` |
| Validation | `npm run req:validate` |
| Reconcile changed manifestations | `npm run req:reconcile -- --mode changed -- --files <paths>` |
| Full inventory | `npm run req:reconcile -- --mode inventory` |
| Top-down trace (requirement → manifestation) | `npm run req:trace -- --from <id>` |
| Bottom-up justify (manifestation → requirement) | `npm run req:justify -- --manifestation <id>` |
| Graph query | `npm run req:query` (by-id, scope, feature, layer) |
| Generate queue/views | `npm run req:generate-views` |
| Refresh code index | `npm run req:refresh-code-index` (wrapper around `npm run generate:code-index`) |
| Requirements graph location | `docs/product/requirements/graph/` |
| Decision ledger | `docs/product/requirements/graph/ledger/decision-ledger.jsonl` |

---

## Integrity rules

- **Never claim a gate passed without running it.** Record exact output in progress log.
- **Never claim browser verification passed** if the dev server or browser was not started.
- **MCP tools are exploratory.** They do not replace checked-in CLI gates.
- **Never commit secrets, tokens, or personal paths** to `.mcp.json` or any tracked file.
- A sprint is only complete when all required gates are run and their output is recorded.

---

## Component creation — when justified

Do not interpret "modularize" as "convert every `<div>` into a component."

A new component is justified when it is:
- Reused in 2+ places
- Stateful or behaviorally distinct
- A recognizable UI concept (card, island, badge, shell)
- Independently testable
- Variant-driven
- An architectural boundary
- A repeated structure expected to evolve consistently

Every reusable decision must be governed: design tokens, typography, form controls, buttons, repeated visual patterns, labels, variants, behavioral boundaries.

Avoid: giant universal components, one-line wrappers, premature abstractions, uncontrolled fragmentation.

---

## MCP Servers available to all agents

These are registered globally in `~/.claude/mcp.json` and active in every Claude Code session.

| Server | Package | When to use |
|---|---|---|
| `playwright` | `@playwright/mcp` | End-to-end browser testing, screenshot verification, interaction testing. Use for any task that requires confirming UI behaviour in a real browser — verifying a component renders, clicking through a flow, checking responsive layout. |
| `chrome-devtools` | `chrome-devtools-mcp` | Attaches to an already-open Chrome tab via CDP. Use when you need to inspect the live DOM, read console errors, audit network requests, or measure performance of the running dev server without launching a new browser. |
| `context7` | `@upstash/context7-mcp` | Fetches up-to-date library documentation from Context7. Use before writing code that uses a library where the version matters (Tailwind v4, Vite config, Playwright APIs, etc.) — resolves hallucination risk from stale training data. |

### When to reach for each

- **Verifying a UI change works** → `playwright` (launch, navigate, screenshot, assert)
- **Debugging the live dev server** → `chrome-devtools` (attach to existing tab, inspect network/console)
- **Checking library API before writing code** → `context7` (query docs for the exact version in use)
- **Both playwright and chrome-devtools available**: prefer `playwright` for new flows, `chrome-devtools` for inspecting state in a session already open

---

---

## Related tooling documents

| Document | Purpose |
|---|---|
| `CLAUDE.md` | Claude Code session bootstrap; MCP status; verification shortcuts |
| `docs/architecture/frontend-tooling.md` | All installed tools, scripts, setup commands, MCP status |
| `docs/architecture/frontend-verification-matrix.md` | Change type → required tools → evidence → gate |
| `.mcp.json` | Project-scope MCP server configuration |
| `semgrep/dcx-rules.yml` | DCX-specific Semgrep structural rules |

*AGENTS.md — DCX Manager v0.2.18 — slimmed to router 2026-06-25 (DR-1); MCP servers added 2026-06-26; frontend tooling layer added 2026-06-26; expired plan state + session start test + prior art requirement added 2026-06-26*
