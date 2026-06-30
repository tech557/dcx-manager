# Builder Follow-Ups

Durable follow-up register for Builder work that must survive active-plan archive moves.

Current as of: 2026-06-28.

| ID | Follow-up | Owner | Status | Notes |
|---|---|---|---|---|
| `typed-any-cleanup` | Replace the remaining 42 explicit `any` lint findings with real types. | FE-final-implementation | Open | P6 reduced lint from 119 findings to 42 explicit-any only; no hook or unused-var findings remain. |
| `production-api-client-switch` | Replace `apiClient -> mockDispatch` with production API wiring. | BE-final-implementation | Open | Includes Vercel/GitHub/Supabase/ClickUp setup decisions and retiring mock-only storage where appropriate. |
| `day-note-storage-policy` | Decide whether day-note/editor-draft persistence remains UI-local or becomes backend app data. | BE-final-discovery / PO | Open | P6 keeps it temporary UI-local through `browser-storage.helpers.ts`; services must not regain direct storage bypasses. |
| `metadata-version-sync` | Resolve `metadata.json` label `v0.3.3` vs authoritative `docs/VERSION.md` `v0.3.4`. | PO | Open | Agents must not bump versions or silently edit version labels. |
| `P1b-color-tokens` | Decide whether retained `[var(--theme-*)]`, shadows, radii, and layout arbitraries need a future token-migration sprint. | PO / FE-final-discovery | Open | P1/P5 accepted these by policy unless screenshots reveal real visual defects. |
| `quality-gates-id` | Assign a formal `BLD-*` ID to the Builder Quality Gates requirement. | Product docs | Open | Future sprint citations should not rely on an unnumbered heading. |
| `mcp-awaiting-setup` | Complete Storybook, shadcn, Semgrep, and SonarQube MCP setup. | Tooling / opencode | Open | Current Codex session only had ESLint operational. |
| `semgrep-cli-install` | Install/enable Semgrep CLI if structural scans are required. | Tooling | Open | P6 session tooling check reported Semgrep CLI unavailable. |
| `log-index-labeling` | Review `scripts/build-log-index.sh` output wording. | Tooling | Open | Script reports all scanned files as "Added"; useful but potentially misleading when rebuilding the whole index. |
| `sync-skills-plan-audit-adapter` | Check `sync-skills.sh` handling of the `dcx-plan-audit` adapter. | Tooling | Open | Prior sessions flagged adapter/listing drift; verify before relying on automatic sync. |
| `test-coverage-expansion` | Add behavior/browser tests beyond the current unit suite. | FE-final-implementation | Open | P6 confirmed the current checked-in suite remains 27 tests across 6 files. |

