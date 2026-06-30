# CLAUDE.md — DCX Manager

Claude Code reads this file automatically. It is a thin Claude-specific adapter.
The shared rules and routing live in `AGENTS.md` and `docs/agent-rules/core.md`.

## Bootstrap order

Read in order before writing any code:
```
1. docs/VERSION.md                        ← Active version
2. docs/agent-rules/core.md              ← Non-negotiable rules (read §4 twice)
3. docs/agent-rules/log-format.md        ← Progress log template
4. docs/agent-guides/claude.md           ← Claude-specific role and failure modes
5. docs/plans/active/                    ← Active sprint work (if any)
```

For orientation without reading all docs, run:
```bash
bash scripts/agent/build-current-state.sh
```

---

## Project skills (Claude)

Skills are in `.claude/skills/`. They trigger automatically by description matching.
Canonical source: `agent-skills/`. Full documentation: `docs/agent-skills.md`.

| Skill | Invoke | When |
|---|---|---|
| `dcx-sprint-planner` | `/dcx-sprint-planner` | Planning any sprint or feature |
| `dcx-frontend-refactor` | `/dcx-frontend-refactor` | Before extracting or restructuring components |
| `dcx-frontend-verify` | `/dcx-frontend-verify` | After any code change, before claiming done |
| `dcx-sprint-close` | `/dcx-sprint-close` | Before writing Status: Completed |
| `dcx-code-query` | `/dcx-code-query` | Any codebase structure or component question |
| `dcx-plan-audit` | `/dcx-plan-audit` | Before activating a plan; when reviewing any drafted sprint or plan for readiness |
| `dcx-donkey-work` | `/dcx-donkey-work` | Sweep requirements graph for gaps; produce unfakeable mechanical evidence; never commits without PO approval |
| `impeccable` | `/impeccable` | **ENABLED — BRAND-SYSTEM ONLY** (quarantine lifted 2026-06-28 by PO). Third-party visual/design skill; may edit `src/brand/` only. Run `/impeccable init` first. See `docs/agent-skills.md`. |

---

## MCP servers

### Project scope (.mcp.json)
| Server | Status | Use for |
|---|---|---|
| `eslint` | Active | Interactive lint rule explanation and repair |
| `storybook` | Disabled — needs Storybook install | Component discovery, props, stories |
| `shadcn` | Disabled — verify pkg name | Search approved shadcn/ui components |
| `semgrep` | Disabled — needs semgrep CLI | Structural code search |
| `sonarqube` | Disabled — needs external service | Repo-wide duplication audit |

### Global (~/.claude/mcp.json)
| Server | Use for |
|---|---|
| `playwright` | Browser flows, screenshot verification, E2E testing |
| `chrome-devtools` | Live DOM, console errors, network in an open tab |
| `context7` | Up-to-date library docs before writing version-sensitive code |

### Deferred tool loading
Use `ToolSearch` to load MCP tool schemas only when needed.
Do not load all tool schemas eagerly at session start.

---

## Hooks (`.claude/settings.json`)

**PostToolUse Write|Edit**: When editing `docs/progress/sessions/*.md`, the hook
runs `scripts/build-log-index.sh` to update the progress index automatically.

Do not disable this hook. It maintains `docs/progress/index.csv`.

---

## Verification shortcuts

```bash
bash scripts/agent/build-current-state.sh    # Orient: version, plans, MCPs, staleness
bash scripts/agent/code-query.sh component X  # Find component without loading full index
bash scripts/agent/verify-frontend.sh --quick # Fast gates: skip build
npm run verify:frontend                        # Full gate: typecheck+lint+verify.sh+validate:arch
npm run test                                   # 27 existing unit tests
```

---

## Integrity rules

See `AGENTS.md §Integrity rules — completion claims` for the full list.
Short form: never write PASS for an unrun gate; never claim browser verification
without a running dev server; never claim an MCP is connected without testing it.
