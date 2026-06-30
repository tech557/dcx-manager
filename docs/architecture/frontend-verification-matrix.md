# Frontend Verification Matrix — DCX Manager

Current as of: 2026-06-26

Use this matrix to determine which tools to run and what evidence to record for each change type. Do not run every tool for every edit — use proportional verification.

---

## Matrix

| Change type | Required tools | Required tests | Evidence | Gate passes when |
|---|---|---|---|---|
| **Copy / label change** | `typecheck` | — | Typecheck output (0 errors) | typecheck passes |
| **Tailwind / CSS only** | `typecheck`, `lint`, `verify.sh` | — | Typecheck + lint output | All 3 pass, 0 warnings |
| **Brand token / design token** | `typecheck`, `lint`, `verify.sh` | — | Typecheck + lint; confirm no hardcoded hex | All pass |
| **New UI atom (`src/ui/`)** | `typecheck`, `lint`, `verify.sh`, `validate:architecture` | Unit test (when Vitest tests exist) | Typecheck + lint + dep-cruiser output | All pass; no new boundary violations |
| **Component behavior change** | `typecheck`, `lint`, `verify.sh`, `validate:architecture` | Unit/component test for changed behavior | All CLI outputs + test results | All pass; no regressions |
| **New action / store mutation** | `typecheck`, `lint`, `verify.sh` | Unit test for action | Typecheck + test output | All pass |
| **New query or service** | `typecheck`, `lint`, `verify.sh`, `validate:architecture` | Unit test | All pass + no boundary violations | All pass |
| **Island or stage change** | `typecheck`, `lint`, `verify.sh`, `validate:architecture` | Playwright journey (if E2E suite exists) | All CLI + browser screenshot | All pass; screenshot confirms layout |
| **Architecture / refactor** | `verify:frontend` (all four gates), `inspect:react` | All unit tests + E2E journey for affected path | Full CLI output + react-scan report + E2E trace | All gates pass; no render regressions |
| **Final sprint / release gate** | `verify:frontend` + `build` | Full test suite + E2E + visual check | Build output + all test results + browser screenshot | Build succeeds; 0 failures; screenshot approved by PO |

---

## Gate commands

```bash
# Individual gates
npm run typecheck            # TypeScript — 0 errors
npm run lint                 # ESLint — 0 warnings
bash scripts/verify.sh       # Forbidden-pattern scan
npm run validate:architecture # Import boundary check

# Combined frontend gate
npm run verify:frontend

# Tests
npm run test                 # Vitest unit/component (none yet)
npm run test:e2e             # Playwright E2E (no tests yet)

# Runtime inspection
npm run dev                  # Start dev server first
npm run inspect:react        # react-scan render profiler (in separate terminal)
```

---

## Evidence recording

In every progress log, record outcomes under `## Validation`:

```markdown
## Validation

| Gate | Command | Outcome |
|---|---|---|
| TypeScript | `npm run typecheck` | Passed — 0 errors |
| ESLint | `npm run lint` | Passed — 0 warnings |
| verify.sh | `bash scripts/verify.sh` | Passed |
| Architecture | `npm run validate:architecture` | Passed — 0 violations |
| Unit tests | `npm run test` | Not applicable — no tests for this change |
| E2E | `npm run test:e2e` | Not applicable — no E2E tests yet |
| Browser | `npm run dev` + playwright MCP | Screenshot: [attached] |
```

**Never write "Passed" without running the command.** If a gate was not run, write "Not run — reason."

---

## Completion rules

1. A sprint is **not complete** if any required gate has not been run.
2. A sprint is **not complete** if any required test is failing.
3. A sprint is **not complete** if the gate was run but its output was not recorded.
4. "The app looked fine" is not evidence — screenshot or Playwright trace required for any browser claim.
5. MCP exploration (Playwright MCP, chrome-devtools) is **supplementary** — it does not replace checked-in CLI gates.

---

## Tool responsibility split

| Concern | MCP (exploratory) | CLI (deterministic gate) |
|---|---|---|
| Lint violations | ESLint MCP — explain / suggest fixes | `npm run lint` — the binding gate |
| Architecture boundaries | Semgrep MCP — structural search | `npm run validate:architecture` — the binding gate |
| Browser behavior | Playwright MCP / chrome-devtools | `npm run test:e2e` — permanent regression guard |
| Component discovery | Storybook MCP | `generate:code-index` — static inventory |
| React render health | — | `inspect:react` (react-scan, manual) |
| Code complexity / duplication | SonarQube MCP | No CLI gate yet (awaits SonarQube setup) |

MCPs surface information quickly during development. CLI gates are what agents report against. Never substitute one for the other.
