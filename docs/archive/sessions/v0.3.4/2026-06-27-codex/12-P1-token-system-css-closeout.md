## P1 — token-system CSS cleanup closeout
Agent: Codex
Model: GPT-5
Provider: OpenAI
Date: 2026-06-27
Status: Completed with documented debt

Intent: Complete the remaining P1 tasks from the output review: tokenize in-rule CSS literals and split `src/brand/index.css` into partials.
Trigger: user request quoted: "ok complete the remaining tasks in -1"
Requirements covered: P1 review Steps 8–10 from `docs/plans/active/folder-structure-v2/output-review/P1-token-system-review.md`.

## Session Environment

build-current-state.sh:
```text
repository_version: v0.3.4
package_version: 0.2.0
metadata_version: v0.3.3
active_plans: [folder-structure-v2]
mcp_operational: [eslint]
mcp_awaiting: [storybook, shadcn, semgrep, sonarqube]
code_index_stale: true (878 min)
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
code_index: stale (878 min)
MCP active: eslint
MCP awaiting: storybook, shadcn, semgrep, sonarqube
```

Skills invoked:
```text
dcx-sprint-close: resolved from agent-skills/dcx-sprint-close/SKILL.md and applied manually because `.agents/skills` is not present in this workspace.
```

Files created:
  src/brand/styles/theme.css
  src/brand/styles/tokens.css
  src/brand/styles/components.css
  docs/progress/sessions/2026-06-27-codex/12-P1-token-system-css-closeout.md

Files edited:
  src/brand/index.css
  docs/plans/active/folder-structure-v2/output/P1-token-system.md
  docs/plans/active/folder-structure-v2/sprints/P1-token-system.md
  docs/plans/active/folder-structure-v2/README.md
  docs/progress/index.csv

Files deleted:
  None

Churn — work reversed:
```text
None. Existing typography, JSX hex, dead CSS class, and dead token export migration was kept as-is.
```

Preserve-semantic check:
```text
No product behavior, data model, service, mock backend, readiness, action, store, or mapper behavior intentionally changed. CSS changes route existing literal values through named tokens and split the stylesheet into partials.
```

Implementation summary:
```text
- Read `output-review/P1-token-system-review.md`.
- Replaced 51 raw rgb/rgba literals inside the component-rule CSS region with named `--theme-component-*` variables.
- Kept token-definition literals in `tokens.css`, where color values are supposed to resolve.
- Split `src/brand/index.css` from 827 lines to a 10-line entry file.
- Added `src/brand/styles/theme.css` for `@custom-variant`, `@theme`, and `@theme inline`.
- Added `src/brand/styles/tokens.css` for local Gilroy font faces, theme vars, shadcn vars, and dark overrides.
- Added `src/brand/styles/components.css` for global component/layout classes.
- Corrected moved Gilroy font URLs from `./fonts/...` to `../fonts/...`.
```

Evidence:
```text
Before component-rule literal count: 51
After component-rule literal count: 0
index.css after split: 10 lines
theme.css: 65 lines
tokens.css: 386 lines
components.css: 434 lines
Old text token grep: 0
Raw app-side TSX hex grep: 0
Phantom font/shadow/radius token grep: 0
```

Acceptance criteria:
```text
☑ Review file read: PASS
☑ Reopened Step 8 tokenized in-rule literals: PASS — 0 component-rule raw hex/rgb/rgba literals
☑ Reopened Step 9 decomposed index.css: PASS — entry + three partials
☑ Font paths after split: PASS — build bundles Gilroy assets
☑ Existing P1 typography/hex/dead-code work preserved: PASS
☑ Existing P1 target greps remain clean: PASS
☑ P1 output updated: PASS
☑ P1 sprint status updated: PASS — completed-with-documented-debt
```

Gates:
```text
typecheck: PASS
validate:architecture: PASS — no dependency violations found (276 modules, 559 dependencies)
test: PASS — 6 files, 27 tests
build: PASS — final rebuild bundles Gilroy assets and has no CSS optimizer warnings
lint: PASS WITH DOCUMENTED DEBT — 157 pre-existing repo-wide problems remain (150 errors, 7 warnings)
dev smoke: PASS — Vite served on http://localhost:3002/ and curl returned HTTP/1.1 200 OK
Playwright screenshot: BLOCKED — local Chromium binary missing and network restricted, so browser install cannot run
```

Sprint close verdict:
```text
PASS WITH DOCUMENTED DEBT
```

Close-skill verification scripts:
```text
verify-plan-state: PASS WITH DOCUMENTED DEBT — failed only on pre-existing completed `builder-refactor` README status parsing as `column`; warned active `folder-structure-v2` has no sprint files because the verifier does not descend into `sprints/`.
verify-version-state: PASS WITH WARNING — docs/VERSION.md=v0.3.4 vs metadata.json=v0.3.3.
verify-log-claims: PASS — checked 9 file claims.
verify-tooling-state: PASS for available tooling; semgrep CLI not installed; code-index stale; MCP awaiting storybook/shadcn/semgrep/sonarqube.
verify-frontend: PASS WITH DOCUMENTED DEBT — typecheck/build/verify.sh/validate/test pass; lint fails with the accepted pre-existing 157-problem backlog.
stubs check: PASS — no console.log boundaries found in src/builder, src/actions, or src/services.
```

Documented debt:
```text
- Repo-wide lint backlog remains outside P1; P1 review explicitly accepts it as pre-existing debt.
- Playwright browser binary setup is missing in this environment; screenshot capture could not run, but executable dev smoke passed.
```
