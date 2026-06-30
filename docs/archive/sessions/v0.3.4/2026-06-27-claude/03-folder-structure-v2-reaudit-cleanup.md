## folder-structure-v2 — Clear the Codex re-audit (2 blockers + 4 advisories)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-27
Status: Completed

Intent: Resolve the residual issues in the Codex re-audit (`audit/2026-06-27-codex.md`, rewritten 14:27) which dropped from 6 blockers to 2 blockers + 4 advisories after the round-2 revision.
Trigger: user request — "check the re-audit".
Requirements covered: N/A — planning/docs revision, no product/source code changed.

## Re-audit result read
Codex confirmed the round-2 fixes landed (P1 typography-only scope, 287 theme colors retained, P2 reconciliation onto existing atoms, barrel-safe deletion, P5 accepted-by-policy spec, P4 mock-seam scope). Remaining: 2 blockers + 4 advisories, all local wording/spec fixes.

## Blockers resolved
1. README/P1 residual phantom wording:
   - README P1 sprint-table row "fix typography, weight, radius" → rewritten to "promote 11 typography-size vars; replace 26 hex; add 6 tokens; delete 3 dead classes + 3 dead exports".
   - P1 output template "## Font weight utilities registered {--font-weight-dcx-*}" → replaced with "## Phantom categories confirmed 0".
2. P5 impossible ID citation: P5 told the executor to "quote exact acceptance-criteria section IDs" but `## Quality gates` in `builder/acceptance-criteria.md` has no `BLD-*` ID. Reworded to cite the `#quality-gates` anchor and record "no requirement ID assigned in source doc"; "Do not invent a `BLD-*` ID." Added a product-doc follow-up (assign a BLD ID to Quality Gates) to the README.

## Advisories resolved
1. P1 Step 3 "For every pattern in UX2-R2" → "For every typography-size pattern in UX2-R2" + explicit note that retained color/shadow/radius/layout categories are recorded-only, not migrated.
2. P2 Select.tsx boundary: added line — "no existing Select atom, so Select.tsx is a form-control adapter/wrapper in forms/selects/, not a base atom competing with src/ui/atoms/*."
3. P5 Playwright MCP wording: changed from "playwright MCP is available globally" to "use the Playwright test runner; use playwright/chrome-devtools MCP only if operational in-session (Step 0 MCP list may be just [eslint])."
4. Preflight artifact: moved `output/P1-token-system.md` → `audit/supporting/P1-token-system-preflight.md` (git mv) so `output/` is empty at activation; updated its header to note the move + retraction of the false activation claim.

Files created:
  docs/plans/drafted/folder-structure-v2/audit/supporting/P1-token-system-preflight.md — moved from output/ (8203 bytes; header updated)
  docs/progress/sessions/2026-06-27-claude/03-folder-structure-v2-reaudit-cleanup.md — this log

Files edited:
  docs/plans/drafted/folder-structure-v2/README.md — P1 row reworded; follow-ups: build-log-index + Quality-gates BLD-ID
  docs/plans/drafted/folder-structure-v2/sprints/P1-token-system.md — output template "Phantom categories confirmed 0"; Step 3 typography-size-only wording
  docs/plans/drafted/folder-structure-v2/sprints/P2-component-consolidation.md — Select.tsx adapter/wrapper boundary note
  docs/plans/drafted/folder-structure-v2/sprints/P5-frontend-readiness.md — Quality-gates anchor citation (no invented ID); Playwright MCP-only-if-available wording

Files deleted:
  docs/plans/drafted/folder-structure-v2/output/P1-token-system.md — moved to audit/supporting/ (not a true delete)

Churn — work reversed:
  Tightens my own round-2 wording (the Builder-ID citation I added was too strong; the preflight file I marked is now moved). No source code reversed (none written).

Preserve-semantic check:
  All inherited decisions intact. The 287 theme colors remain RETAINED; P1 stays typography-size-only; P2 stays reconciliation-onto-existing-atoms; P5 hard-gate vs accepted-by-policy unchanged.

Open decisions used:
  ⏱ Quality Gates section cited by anchor with "no requirement ID assigned"; product-doc follow-up named to assign a BLD ID (PO decision).

Acceptance criteria:
  □ Codex blocking #1 (phantom wording in README + output template) resolved: PASS
  □ Codex blocking #2 (P5 impossible ID citation) resolved: PASS
  □ Advisories 1–4 resolved: PASS
  □ Final sweep: no "weight, radius" / "Font weight utilities" / "For every pattern in UX2-R2" remain; output/ empty: PASS

Gates:
  typecheck: N/A — no source code changed (docs/plan only)
  dev: N/A — no source code changed
  verify.sh: N/A — no source code changed
  browser manual check: N/A — plan-revision session, no app behavior changed

Consumer updates required:
  None — no exported code changed.

Open issues / follow-ups:
  - Product-doc follow-up: assign a `BLD-*` ID to `acceptance-criteria.md#quality-gates`.
  - `P1b-color-tokens` (PO decision) + `production-api-client-switch` follow-ups still named, not drafted.
  - `build-log-index.sh` mislabel still open tooling debt.
  - Plan remains DRAFTED; all known audit findings (round-1, round-2, re-audit) now addressed — ready for PO review / final re-audit before activation.
