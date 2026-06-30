## P1 — folder-structure-v2 activation and token-system implementation
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-27
Status: Partial — implementation complete; lint gate blocked by existing repo-wide debt

Intent: Move `folder-structure-v2` to active and start Sprint P1 by implementing the token-system cleanup.
Trigger: user request quoted: "ok now can you move the plan to ready and start working on the first sprint"
Requirements covered: P1 typography utility migration, raw app-side hex removal, dead CSS/token cleanup, active plan state update.

## Session Environment

build-current-state.sh:
```text
repository_version: v0.3.4
package_version: 0.2.0
metadata_version: v0.3.3
active_plans: []
mcp_operational: [eslint]
mcp_awaiting: [storybook, shadcn, semgrep, sonarqube]
code_index_stale: true
documentation_contradictions: docs/VERSION.md=v0.3.4 vs metadata.json=v0.3.3
```

verify-tooling-state.sh:
```text
typecheck: available
lint: available
test: available
build: available
validate:architecture: available
test:e2e: available but no e2e tests found
verify:frontend: available
generate-code-index: available
inspect-react: available
verify.sh: pass
dependency_cruiser: available
semgrep_cli: not_installed
playwright_test: available
storybook: installed
code_index: stale
MCP active: eslint
MCP awaiting: storybook, shadcn, semgrep, sonarqube
```

Skills invoked:
```text
dcx-plan-audit: prior final audit verdict READY was the activation basis; no new audit skill run in this implementation turn.
```

Files created:
```text
docs/plans/active/folder-structure-v2/output/P1-token-system.md
docs/progress/sessions/2026-06-27-codex/11-folder-structure-v2-activation-p1.md
```

Files edited:
```text
docs/plans/active/folder-structure-v2/README.md
docs/plans/active/folder-structure-v2/sprints/P1-token-system.md
docs/plans/active/folder-structure-v2/sprints/P2-component-consolidation.md
docs/plans/active/folder-structure-v2/sprints/P3-structure-quality.md
docs/plans/active/folder-structure-v2/sprints/P4-backend-readiness.md
docs/plans/active/folder-structure-v2/sprints/P5-frontend-readiness.md
src/brand/index.css
src/brand/tokens.ts
src/builder/stage/views/KanbanView.tsx
src/ui/BuilderBg/LightRays.tsx
plus source files touched by mechanical text utility migration from `text-[var(--text-*)]` to `text-dcx-*`
```

Files deleted:
```text
None
```

Churn — work reversed:
```text
None. The plan was moved from drafted to active; no user code was reverted.
```

Preserve-semantic check:
```text
No product behavior, data model, readiness logic, service contract, or mock backend behavior intentionally changed. The app-side change is visual-token syntax and dead token/CSS cleanup.
```

Implementation summary:
```text
- Moved `docs/plans/drafted/folder-structure-v2` to `docs/plans/active/folder-structure-v2`.
- Updated active plan/sprint paths and set P1 status to in-progress.
- Registered 11 `text-dcx-*` font-size utilities.
- Replaced all live `text-[var(--text-*)]` usages in source with `text-dcx-*`.
- Added six named surface/accent/error tokens and exposed them through `brand/tokens.ts`.
- Replaced raw app-side hex colors with theme variables or non-hex literal forms where appropriate.
- Removed dead `.readiness-badge`, `.editor-toggle-btn`, and `.editor-toggle-btn-active` CSS blocks.
- Removed dead `typographyTokens`, `radiusTokens`, and `shadowTokens` exports.
- Excluded `docs` and `code-index` from Tailwind source scanning so historical audit examples do not generate production CSS.
```

Acceptance criteria:
```text
☑ Plan moved to active: PASS
☑ P1 output artifact written: PASS
☑ `text-[var(--text-*)]` source grep: PASS — 0
☑ Raw app-side hex source grep: PASS — 0 outside token/index CSS and comments
☑ Phantom categories checked: PASS — font/shadow/radius arbitrary token patterns all 0
☑ Dead CSS classes removed: PASS
☑ Dead token exports removed: PASS
☑ New surface tokens added: PASS
☒ P1 sprint completed: BLOCKED — lint gate still fails from existing repo-wide lint debt
```

Gates:
```text
typecheck: PASS
lint: BLOCKED — 157 problems remain (150 errors, 7 warnings), repo-wide existing debt after local `LightRays` lint nit was fixed
validate:architecture: PASS — no dependency violations found (276 modules, 559 dependencies)
test: PASS — 6 files, 27 tests
build: PASS — final rebuild passed without Tailwind CSS optimizer warnings after excluding docs/code-index from source scan
dev: PASS — Vite served on http://localhost:3002/ because 3000/3001 were occupied
browser/dev smoke: PASS — `curl -I http://localhost:3002/` returned HTTP/1.1 200 OK
```

Open issues / follow-ups:
```text
P1 cannot be honestly marked completed until `npm run lint` passes or the plan explicitly accepts the known lint backlog as a separate blocker. Next agent should either run a lint-fix sprint first or update the sprint policy with PO approval.
```
