---
name: dcx-frontend-verify
description: >
  Select and run proportionate frontend verification for a DCX Manager change.
  Use this skill when the user says "verify my change", "check if this works",
  "run the tests", "does this pass?", "verify the sprint", "check my PR", or
  when an agent has finished implementing something and needs to confirm the
  gates pass. Also trigger when deciding which verification tools to use for
  a given type of change. Do not wait for the user to specify which tools to
  run — apply the proportional matrix automatically.
---

# DCX Frontend Verify

Run the right verification gates for the change at hand — no more, no less.
Loading and running every tool after every small change wastes tokens and obscures
real failures. Use the matrix below.

## Step 1 — Classify the change

Ask yourself (or read the sprint file / user message):
- **Copy / label / Tailwind class only?** → Level 1
- **Component behavior, state, hook, or event handler?** → Level 2
- **Architecture change, new layer boundary, store/service/action?** → Level 3
- **Full sprint close or release gate?** → Level 4

## Step 2 — Run proportionate gates

### Level 1 — Copy / CSS only

Before running: check if the changed component has an existing test in `e2e/` or
a `*.stories.tsx` file. If it does, run that test even for a small change.


```bash
npm run typecheck
npm run lint
bash scripts/verify.sh
```
Evidence: paste output. All must pass.

### Level 2 — Component behavior change
```bash
npm run typecheck
npm run lint
bash scripts/verify.sh
npm run validate:architecture
npm run test
```
Then verify in browser using Playwright MCP for any affected user journey.
Evidence: CLI outputs + screenshot or Playwright trace.

### Level 3 — Architecture / refactor
```bash
npm run verify:frontend     # typecheck + lint + verify.sh + validate:architecture
npm run test
```
Also run:
- `npm run inspect:react` against dev server (check for render regressions)
- Playwright MCP for affected journeys
- `npm run scan:semgrep` if boundaries were restructured (needs semgrep CLI)

Evidence: full CLI output + react-scan report (pass/warn) + browser screenshots.

### Level 4 — Sprint close / release gate
```bash
npm run verify:frontend
npm run test
npm run build
npm run test:e2e             # only if e2e/ tests exist
```
Evidence: all of the above + screenshot confirming the feature in the browser.

## Tool routing — which MCP or CLI for each concern

| Concern | Use this |
|---|---|
| Component props, variants, states | Storybook MCP (when installed) → `code-index/components.json` |
| React render / hooks / performance | `npm run inspect:react` (react-scan, dev server required) |
| Lint rule explanation or repair | ESLint MCP (interactive) |
| Import boundary violations | `npm run validate:architecture` (dependency-cruiser) |
| Structural code search | `npm run scan:semgrep` or Semgrep MCP |
| Browser user journey | Playwright MCP (global) |
| Permanent regression guard | checked-in test in `e2e/` via `npm run test:e2e` |
| Live DOM, console, network | Chrome DevTools MCP (global) |
| Repo-wide duplication/complexity | SonarQube MCP (when configured) |
| Approved component sourcing | Shadcn MCP → always check `src/ui/` first |

## Reporting results

Report exact output — never paraphrase. For each gate:

```
typecheck:              PASS — 0 errors
lint:                   PASS — 0 warnings  (or FAIL — N errors: [list first 5])
verify.sh:             PASS
validate:architecture: PASS — 0 violations
test:                  PASS — 27/27
browser:               PASS — screenshot confirms [journey name] renders correctly
                       (or BLOCKED — dev server could not start)
```

If a gate was not run, write `NOT RUN — [reason]`. Never write `PASS` for an unrun gate.

## Blocked gates

If a gate is blocked (Storybook not installed, semgrep CLI not available, dev server
failed to start), record it as BLOCKED and explain what is needed to unblock it.
Do not mark a blocked gate as passed.

A sprint cannot be closed if any required gate is BLOCKED unless the block is
documented as accepted debt in the sprint file.
