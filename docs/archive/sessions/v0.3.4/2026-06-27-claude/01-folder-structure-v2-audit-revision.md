## folder-structure-v2 — Revise plan to pass 2026-06-27 codex audit
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-27
Status: Completed

Intent: Amend the drafted folder-structure-v2 plan so it resolves all blocking and advisory issues in the 2026-06-27 codex audit (verdict: NEEDS REVISION).
Trigger: user request — "create a new folder session and start working on amending the plan to pass the audit. edit relevant file then log your overall progress."
Requirements covered: N/A — planning/docs revision, no product/source code changed.

## Session Environment

No-terminal scripts were not invoked as a sprint Step 0 (this is a plan-revision session, not a sprint execution). Grounding facts were verified directly against the repo instead:
- Dev server port: `3000` (`vite.config.ts:19`); Playwright `baseURL: http://localhost:3000` (`playwright.config.ts:10`). The P1 sprint previously cited `5173` — corrected.
- shadcn NOT installed (no `components.json`); `shadcn` MCP listed in `.mcp.json` but awaiting setup per CLAUDE.md.
- `mock-dispatch.ts` has 14 route entries incl. `POST /versions/:id/files` already present (`src/services/mock-dispatch.ts:71`).
- 7 distinct `*.service.ts` files use `readMockJson`/`writeMockJson`/`localStorage`; `clickup.service.ts` + `ai.service.ts` are pure stubs.

## Audit addressed: docs/plans/drafted/folder-structure-v2/audit/2026-06-27-codex.md

Blocking (3/3):
1. Missing polish readiness → created P5 sprint with a multi-viewport (1440/1920/2560) visual polish gate: written acceptance spec, screenshot + console-error evidence, Playwright path.
2. Component sourcing → P5 adds custom-vs-library/MCP decision matrix, adapter-seam rule, shadcn-candidate list; durable artifact `docs/product/component-source-policy.md` (created by executor at run time).
3. P4 mock-API completeness → added Step 8f data-domain→mock-route→fixture completeness matrix with grep proof that no app-facing service bypasses the seam; pure stubs (clickup, ai) labelled.

Advisory (5/5):
1. Added "Step 0 — Session environment" (build-current-state.sh + verify-tooling-state.sh) to P1–P5.
2. Made browser gates executable in every sprint: `npm run dev` → port 3000, Playwright/chrome-devtools, console-error count, screenshot evidence.
3. P1 now requires per-pattern before/after counts from UX2-R2 (authoritative) + literal remaining-pattern grep output in the output file.
4. P4 reframed mock-dispatch.ts / src/mock/ as "dev/mock layer retained" and named the follow-up `production-api-client-switch` sprint; removed the ambiguous keep/delete default.
5. Logged `build-log-index.sh` first-heading mislabel as tooling debt in the README follow-ups section.

README: added P5 to sprint table, an explicit "Frontend readiness chain" scope boundary (P1–P4 / P5 / follow-up production plan), 3 new metrics rows, updated execution gates + dependency diagram + status block + tooling-debt section.

Files created:
  docs/plans/drafted/folder-structure-v2/sprints/P5-frontend-readiness.md — new readiness/governance + polish-gate sprint (305 lines)
  docs/progress/sessions/2026-06-27-claude/01-folder-structure-v2-audit-revision.md — this log

Files edited:
  docs/plans/drafted/folder-structure-v2/README.md — audit-response block, P5 row, readiness chain, metrics, gates, deps, tooling debt (191 lines, was 147)
  docs/plans/drafted/folder-structure-v2/sprints/P1-token-system.md — Step 0, port 5173→3000, executable browser gate, UX2-R2 per-pattern counts, output template (435 lines, was ~384)
  docs/plans/drafted/folder-structure-v2/sprints/P2-component-consolidation.md — Step 0, executable browser gate w/ viewports+console+screenshot, P5 cross-ref (312 lines, was ~284)
  docs/plans/drafted/folder-structure-v2/sprints/P3-structure-quality.md — Step 0, executable browser gate, output template (297 lines, was ~273)
  docs/plans/drafted/folder-structure-v2/sprints/P4-backend-readiness.md — Step 0 + data-domain inventory, Step 8f mock-API completeness matrix, dev/mock-retained + named follow-up, executable browser gate (388 lines, was ~300)

Files deleted: None

Churn — work reversed:
  None. Additive revision over Sonnet's drafted sprints; no prior task undone. The only correction was the P1 dev-server port (5173→3000), which was a factual error.

Preserve-semantic check:
  Inherited decisions from expired src-structure-refactor preserved (no CSS modules, no mobile breakpoints — P5 builder viewports are 1440px–4K, ai.service stays stub, Kanban/SmokeStage/TimelineView not deleted). P4 mock retention explicitly does NOT cross into real backend integration — kept as the plan's scope boundary.

Open decisions used:
  ⏱ P5 executor set to `opencode` to mirror P2 (frontend-consolidation executor); PO may reassign in sprint frontmatter at activation.
  ⏱ Follow-up production sprint named `production-api-client-switch` as a placeholder; PO owns whether/when it is drafted.

Acceptance criteria:
  □ All 3 blocking audit issues addressed in plan files: PASS
  □ All 5 advisory audit issues addressed: PASS
  □ Step 0 session-environment present in every sprint (P1–P5): PASS
  □ Browser gates executable (port 3000 + console + screenshot): PASS
  □ README states explicit P1-P4 / P5 / follow-up chain: PASS

Gates:
  typecheck: N/A — no source code changed (docs/plan only)
  dev: N/A — no source code changed
  verify.sh: N/A — no source code changed
  browser manual check: N/A — plan-revision session, no app behavior changed

Consumer updates required:
  None — no exported code changed. The new P5 output artifact `docs/product/component-source-policy.md` is produced by the executor at sprint run time, not now.

Open issues / follow-ups:
  - `scripts/build-log-index.sh` first-heading mislabel (logged in README tooling-debt; this log avoids a leading `## Session Environment` heading so the index keys off the real title).
  - `production-api-client-switch` follow-up plan is named but not drafted — PO decision.
  - Plan remains DRAFTED; awaits PO review + re-audit before activation.
