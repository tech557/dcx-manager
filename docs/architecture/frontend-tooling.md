# Frontend Tooling — DCX Manager

Current as of: 2026-06-30

---

## Package scripts

| Script | Command | Purpose |
|---|---|---|
| `typecheck` | `tsc --noEmit` | TypeScript strict type-check (0-error gate) |
| `lint` | `eslint src --max-warnings 0` | ESLint with React-hooks and TypeScript rules |
| `validate:architecture` | `depcruise src --config .dependency-cruiser.cjs` | Enforce import boundary rules |
| `scan:semgrep` | `bash scripts/agent/run-semgrep.sh` | Structural DCX-rule scan (uses local/user Semgrep CLI when available) |
| `test` | `vitest run` | Unit / component tests (no tests exist yet) |
| `test:watch` | `vitest` | Watch mode for test-driven development |
| `test:e2e` | `playwright test` | Playwright E2E regression tests (`e2e/` dir) |
| `test:e2e:ui` | `playwright test --ui` | Playwright interactive UI runner |
| `inspect:react` | `npx react-scan@latest http://localhost:3000` | React render profiling (dev server must be running) |
| `verify:frontend` | typecheck + lint + verify.sh + validate:architecture | Full local gate before claiming done |
| `build` | `vite build` | Production build |
| `dev` | `vite --port=3000 --host=0.0.0.0` | Dev server |
| `generate:code-index` | ts-morph AST analysis | Component inventory (output: `code-index/`) |

---

## Installed tools and status

### TypeScript (`typescript ~5.8.2`)
- **Status:** Operational
- Strict mode enabled. Run: `npm run typecheck`
- Config: `tsconfig.json`

### ESLint (`eslint ^9`, `typescript-eslint`, `eslint-plugin-react-hooks`)
- **Status:** Operational
- Flat config format. Run: `npm run lint`
- Config: `eslint.config.js`
- Rules: no-explicit-any (error), react-hooks/rules-of-hooks (error), react-hooks/exhaustive-deps (warn), unused-vars (error)

### dependency-cruiser (`dependency-cruiser ^18`)
- **Status:** Operational
- Enforces 6 architectural boundary rules. Run: `npm run validate:architecture`
- Config: `.dependency-cruiser.cjs`
- Rules: no-types-imports, no-utils-to-high, no-service-to-store, no-ui-to-builder, no-pages-to-builder, mock-limited-imports

### verify.sh
- **Status:** Operational
- Forbids: `src/types.ts`, legacy status strings, `useState<any[]>`, `(window as any)`, direct service imports in builder
- Run: `bash scripts/verify.sh`

### Vitest (`vitest ^1.0.0`)
- **Status:** Configured, no tests written yet
- Config: `vitest.config.ts`
- Environment: jsdom (requires `jsdom ^29` peer dep — installed)
- Test files: `src/**/*.{test,spec}.{ts,tsx}`

### Playwright Test (`@playwright/test ^1.61`)
- **Status:** Configured, no E2E tests written yet
- Config: `playwright.config.ts`
- Test directory: `e2e/` (create this directory when writing first test)
- Base URL: `http://localhost:3000`
- Browsers: Chromium only (add Firefox/WebKit as needed)

### Playwright MCP (`@playwright/mcp ^0.0.77`)
- **Status:** Installed and configured
- Config: `.mcp.json` server `playwright`
- Browser binary: Chromium installed through `node node_modules/playwright/cli.js install chromium`
- Run/verify: `node node_modules/@playwright/mcp/cli.js --version`
- MCP command: `node node_modules/@playwright/mcp/cli.js --headless --isolated`

### react-scan (React Doctor)
- **Status:** Available via npx, no devDep required
- Use: `npm run inspect:react` (dev server must be running on :3000)
- Reports excessive re-renders and component performance issues

### Semgrep CLI
- **Status:** Installed, blocked
- Install/update: `python3 -m pip install --user semgrep`
- Rules: `semgrep/dcx-rules.yml` (6 DCX-specific rules)
- Run: `npm run scan:semgrep`
- Current block: Semgrep launches through `scripts/agent/run-semgrep.sh`, but `semgrep-core` exits unexpectedly even on a one-file scan. Do not report this gate as passing until the scan completes.

### Storybook
- **Status:** Installed, MCP runtime blocked
- Packages: Storybook 10.4.6, `@storybook/addon-mcp` 0.6.0, `@storybook/mcp` 0.7.0
- Config: `.storybook/main.ts` includes `@storybook/addon-mcp`
- Current block: `npm run storybook` does not reach `http://localhost:6006/mcp`; local smoke prompts about port `6006` / `undefined`, and CI mode errors with `expected options to have a port`.

### Shadcn
- **Status:** Installed, MCP configured
- Package: `shadcn` 4.12.0
- Config: `components.json`
- Run MCP: `npx shadcn mcp`

---

## MCP servers (project scope — `.mcp.json`)

Smoke-tested: 2026-06-30 (TOOL-003)

| Server | Package | Version | Status | Session tools |
|---|---|---|---|---|
| `eslint` | `@eslint/mcp` | 0.3.7 | **configured** | Not in deferred list (npx startup lag); loads next session with `type: "stdio"` fix applied |
| `playwright` | `@playwright/mcp` | 0.0.77 | **configured** | Local package installed; Chromium browser binary installed; configured as stdio with headless isolated context |
| `storybook` | `@storybook/addon-mcp` | 0.6.0 | **blocked** | Installed/configured, but runtime smoke fails before `/mcp` responds |
| `shadcn` | `shadcn mcp` | 4.12.0 | **configured** | Local package and `components.json` verified |
| `semgrep` | `semgrep-mcp` | — | **blocked** | CLI installed, but `semgrep-core` exits unexpectedly during scan |
| `sonarqube` | `@sonarsource/mcp-server-sonarqube` | — | **blocked** | Needs SonarQube server + `SONAR_TOKEN` + `SONAR_HOST_URL` |

ESLint smoke test evidence (2026-06-26):
- `npx @eslint/mcp@0.3.7` → prints "ESLint MCP server is running. cwd: …" ✓
- CLI lint run: `eslint src` → 158 problems detected (pre-existing 151 errors, 7 warnings) ✓
- `.mcp.json` updated: added `"type": "stdio"` to eslint entry

### Globally registered MCPs (`~/.claude/mcp.json`)

| Server | Package | Version | Status | Notes |
|---|---|---|---|---|
| `playwright` | `@playwright/mcp` | 0.0.76 | **configured** | Package starts (`--help` responds); not in session deferred list (npx startup timing); use `mcp__Claude_Preview__*` in-session |
| `chrome-devtools` | `chrome-devtools-mcp` | 1.4.0 | **blocked** | Package starts but requires Chrome with `--remote-debugging-port=9222`; user action needed; use `mcp__Claude_in_Chrome__*` in-session |
| `context7` | `@upstash/context7-mcp` | latest | **configured** | Registered; not tested in this session |

Browser + DevTools smoke test evidence (2026-06-26, via `mcp__Claude_Preview__*`):
- Dev server started on :3000 ✓
- Accessibility tree snapshot: "DCX Manager v0.2.0" title, MetadataIsland, KanbanBuilderIsland all rendered ✓
- Screenshot: header, campaign metadata, Kanban builder visible ✓
- Console logs: no errors; only Vite HMR connect/reconnect and React DevTools suggestion ✓
- Network requests: 150+ source modules, all 200/304 — no failed requests ✓

### Session tool availability

In a Claude Code session the `mcp__playwright__*` and `mcp__eslint__*` tools may not appear in the deferred list if the npx processes haven't resolved by session start time (packages are large; first-run download takes several seconds past MCP timeout). The packages themselves work correctly:

| Capability | Registered MCP | Available in-session fallback |
|---|---|---|
| Browser navigation + screenshot | `@playwright/mcp` | `mcp__Claude_Preview__preview_screenshot`, `preview_snapshot` |
| Console inspection | `chrome-devtools-mcp` | `mcp__Claude_Preview__preview_console_logs` |
| Network inspection | `chrome-devtools-mcp` | `mcp__Claude_Preview__preview_network` |
| ESLint rule query | `@eslint/mcp` | `npm run lint` CLI |

---

## How to verify MCP connections

```bash
# Test ESLint MCP manually (should print "ESLint MCP server is running")
npx @eslint/mcp@latest

# Test Playwright MCP
node node_modules/@playwright/mcp/cli.js --version

# Test Chrome DevTools MCP (requires Chrome with remote debugging)
# First: launch Chrome with --remote-debugging-port=9222
npx chrome-devtools-mcp@latest --browserUrl http://127.0.0.1:9222

# When Storybook is installed, start it and then enable the MCP:
npm run storybook
# Then confirm http://localhost:6006/mcp responds before enabling storybook in .mcp.json

# Test Shadcn MCP command
npx shadcn mcp --help
```

---

## Starting development servers

```bash
# Vite dev server (required for react-scan, playwright E2E, chrome-devtools)
npm run dev
# → http://localhost:3000

# Storybook
npm run storybook
# → http://localhost:6006
```

---

## Known issues

- `vitest@^1` depends on a vulnerable version of `esbuild` (dev-only, not production). Upgrading to vitest@4 is a breaking change; defer to a dedicated devtools upgrade sprint.
- `scan:semgrep` now finds the user Python Semgrep install, but the Semgrep engine currently exits unexpectedly. Treat Semgrep CLI and MCP as blocked until a scan completes.
- Storybook packages and MCP addon are installed, but the dev server does not currently expose `/mcp`. Keep Storybook MCP disabled until the runtime smoke passes.
- SonarQube requires an external service. Do not enable without confirmed credentials.
