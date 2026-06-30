## TOOL-001 — Frontend Inspection, Testing, and Governance Toolchain
Agent: Claude
Model: claude-sonnet-4-6
Provider: Anthropic
Date: 2026-06-26
Status: Completed

Intent: Establish a governed frontend verification layer — ESLint, dependency-cruiser CLI, Playwright config, Vitest config, project MCP config, Semgrep rules, and updated agent documentation — without touching application code.
Trigger: User request: "add a governed frontend inspection, testing, and improvement toolchain for DCX Manager"
Requirements covered: N/A (tooling task, not a product sprint)

Files created:
  eslint.config.js                                        — ESLint flat config (react-hooks, typescript-eslint, no-explicit-any) (20 lines)
  vitest.config.ts                                        — Vitest config pointing at src/**/*.test.{ts,tsx}, jsdom environment (13 lines)
  playwright.config.ts                                    — Playwright E2E config, baseURL :3000, chromium, e2e/ testDir (22 lines)
  .mcp.json                                               — Project MCP config: eslint (active), storybook/shadcn/semgrep/sonarqube (disabled) (40 lines)
  semgrep/dcx-rules.yml                                   — 6 DCX-specific Semgrep rules matching core.md boundaries (66 lines)
  CLAUDE.md                                               — Root-level Claude bootstrap: load order, MCP status, tool routing, integrity rules (78 lines)
  docs/architecture/frontend-tooling.md                   — All tools, scripts, setup commands, MCP status table (115 lines)
  docs/architecture/frontend-verification-matrix.md       — Change type → required tools → evidence → gate matrix (100 lines)

Files edited:
  package.json                                            — Added 8 new scripts (lint, validate:architecture, scan:semgrep, test, test:watch, test:e2e, test:e2e:ui, inspect:react, verify:frontend); added devDeps: eslint, @eslint/js, typescript-eslint, eslint-plugin-react-hooks, dependency-cruiser, @playwright/test, jsdom (54 lines, was 36)
  AGENTS.md                                               — Added §§ Frontend tool routing, Integrity rules, Component creation rules, Related tooling documents table (147 lines, was 87)

Files deleted: None

Churn — work reversed: None

Preserve-semantic check:
  No application code changed. All boundaries in §9 remain intact.
  eslint.config.js ignores dist/, node_modules/, code-index/, scripts/.
  No new components, hooks, stores, or actions created.

Open decisions used: None

Acceptance criteria:
  ✓ ESLint configured and runnable (npm run lint)
  ✓ dependency-cruiser runnable with existing config (npm run validate:architecture)
  ✓ vitest config created (npm run test)
  ✓ playwright config created (npm run test:e2e)
  ✓ .mcp.json created with active/disabled status clearly documented
  ✓ semgrep/dcx-rules.yml mirrors core.md boundaries
  ✓ CLAUDE.md created at project root
  ✓ AGENTS.md updated with tool-routing matrix
  ✓ frontend-tooling.md and frontend-verification-matrix.md created
  ✓ No application code changed

Gates:
  typecheck:              PASS — 0 errors
  verify.sh:             PASS — no forbidden patterns
  validate:architecture: PASS — 0 violations (265 modules, 550 dependencies)
  test:                  PASS — 27 tests in 6 files (pre-existing tests discovered)
  build:                 PASS — built in 3.11s (chunk size warning pre-existing)
  lint:                  FAIL — 151 errors, 7 warnings (pre-existing issues, not regressions from this session)

Consumer updates required:
  Agents must now run `npm run lint` as part of the session gate (§11 / CLAUDE.md).
  The old `lint` script was an alias for `typecheck` — it is now a real ESLint gate.
  151 ESLint errors in the existing codebase must be fixed in a dedicated lint-fix sprint before `lint` can be a passing gate.

Next recommended task:
  LINT-FIX sprint: address the 151 pre-existing ESLint errors. Primary categories:
  - 'e' unused in catch blocks (fix: rename to _e)
  - Unused imports and variables
  - `{}` type in ErrorBoundary (fix: use `Record<string, unknown>`)
  - `any` in effects.registry.ts (scoped, well-understood)
  - react-hooks/set-state-in-effect in useActionCard and usePhaseCard (evaluate whether useEffect → useLayoutEffect or restructuring is appropriate)
  After LINT-FIX, `verify:frontend` becomes a complete passing gate.
