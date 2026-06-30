## MCP tooling setup for sprint execution
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-30
Type: user-request-code
Status: Completed
PO-Action: pending

Intent: Install/configure the MCP tooling needed so Codex can execute most planned sprints, while keeping blocked MCPs disabled until their gates pass.
Trigger: user request: "can u install the needed mcps in sprints here so codex is able to excute most of the sprints ?"
Requirements covered: REQ-GOV-TRACE-001-AGENT

## Session Environment

| Item | Result |
|---|---|
| Repository version | v0.3.5 |
| Active plans | none |
| MCP operational after changes | eslint, shadcn |
| MCP awaiting after changes | storybook, semgrep, sonarqube |
| Tooling gates | typecheck/lint/test/build/validate:architecture/test:e2e/verify:frontend/generate-code-index/inspect:react available; verify.sh pass |
| Blocked/missing gates | Storybook MCP runtime blocked; Semgrep scan blocked by semgrep-core exit; e2e tests not written |
| Code index | stale, age 889 minutes |
| Skills invoked | none |
| Notes | `git status --short` failed: not a git repository |

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| updated | `.mcp.json` | Enabled local Shadcn MCP; kept Storybook/Semgrep/SonarQube disabled with current blocker notes | 32 |
| updated | `package.json` | Routed `scan:semgrep` through the local wrapper | 84 |
| updated | `semgrep/dcx-rules.yml` | Replaced invalid import patterns with regex patterns accepted by Semgrep | 65 |
| added | `scripts/agent/run-semgrep.sh` | Portable Semgrep wrapper that finds user Python installs and routes logs/cache to writable temp paths | 60 |
| updated | `scripts/agent/verify-tooling-state.sh` | Detects Semgrep through the wrapper instead of PATH-only lookup | 110 |
| updated | `docs/architecture/frontend-tooling.md` | Refreshed MCP/tooling status for Shadcn, Storybook, and Semgrep | 177 |
| regenerated | `docs/generated/CURRENT_STATE.json` | Current tool/MCP snapshot after MCP config changes | 76 |
| added | `docs/progress/sessions/2026-06-30-codex/007-mcp-tooling-setup.md` | Session log for this setup request | 82 |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None |
| Preserve-semantic (§9) | N/A — tooling/config/docs only; no product behavior changed |
| Open decisions used (⏱) | None |
| MCP truthfulness | PASS — only `eslint` and `shadcn` are active; blocked MCPs remain disabled |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| Run and log session environment checks before code work | PASS |
| Configure MCPs that can be verified locally | PASS — Shadcn configured via `npx shadcn mcp` |
| Keep unavailable MCPs disabled with explicit blocker notes | PASS — Storybook, Semgrep, SonarQube disabled |
| Update sprint/tooling documentation so future agents use accurate status | PASS |

### Gates
| Gate | Result |
|---|---|
| build-current-state.sh | PASS — repository_version v0.3.5, active_plans [], mcp_operational [eslint, shadcn], mcp_awaiting [storybook, semgrep, sonarqube], code_index_stale true |
| verify-tooling-state.sh | PASS with warnings — verify.sh pass; semgrep_cli available 1.37.0; storybook installed; e2e_tests_exist no_tests_written; code_index stale |
| `.mcp.json` parse | PASS — `python3 -m json.tool .mcp.json` succeeded |
| Shadcn command/config | PASS — local `shadcn mcp --help` works and `shadcn info --json` resolves project config after network approval |
| Storybook MCP smoke | BLOCKED — Storybook packages/addon installed, but dev server does not expose `/mcp`; CLI prompts about port `6006` / `undefined`, and CI mode errors with `expected options to have a port` |
| Semgrep version | PASS — wrapper reports Semgrep 1.37.0 |
| Semgrep scan | BLOCKED — `npm run scan:semgrep -- src/store/builderStore.ts` fails because `semgrep-core` exits unexpectedly |
| Playwright MCP | N/A — local Playwright package has no usable `mcp` CLI entrypoint in this checkout; no unverified MCP added |
| SonarQube MCP | N/A — requires external SonarQube server and credentials |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| Storybook MCP remains blocked | Component discovery sprints cannot rely on Storybook MCP yet | Approve a small tooling fix sprint to repair Storybook v10 CLI startup and verify `http://localhost:6006/mcp` |
| Semgrep scan remains blocked | Structural search MCP/CLI cannot be used as a gate while `semgrep-core` exits | Approve investigation into Semgrep runtime compatibility or replace the gate with a supported structural scanner |
| SonarQube remains blocked | Repository-wide duplication/quality MCP needs an external service | Provide SonarQube URL/token or keep SonarQube out of sprint gates |

### Consumer updates required
- Future sprint agents can use Shadcn MCP from `.mcp.json`.
- Sprint plans must not require Storybook MCP or Semgrep MCP as passing gates until the blockers above are resolved.

### Open issues / follow-ups
- Regenerate the code index before source-work sprints (`npm run generate:code-index`) because the current index is stale.
- Add checked-in E2E tests when a sprint requires browser regression proof.
