## folder-structure-v2 — Revise plan to clear round-2 audits (Claude + Codex)
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-27
Status: Completed

Intent: Resolve every blocking issue (and consider advisories) from the two round-2 audits that re-checked the plan against live v0.3.4 code: `audit/2026-06-27-claude.md` (4 blocking) and `audit/2026-06-27-codex.md` (6 blocking, supersedes its own earlier READY).
Trigger: user request — "i asked both sonnet and codex to audit the plan again because i was able to identify token issues ... make sure the plan is updated to remove these blockers and please consider their advisory."
Requirements covered: N/A — planning/docs revision, no product/source code changed.

## Live verification performed (grep/ls against src/, v0.3.4)
Both audits were confirmed accurate before editing:
- `text-[var(--text-*)]` = 275 across 11 variants (incl. `3xs-plus` 13, `md-plus` 9, `xs-plus` 7, `2xs-plus` 7). `font-[var(--font-*)]` = 0, `shadow-[var(--shadow-*)]` = 0, `rounded-[var(--radius-*)]` = 0. `--font-weight-*` / `--shadow-*` vars do not exist in `src/brand/index.css` (only `--font-sans`/`--font-heading`).
- Theme color/border/ring: `text-[var(--theme-*)]` 126, `bg-` 74, `border-` 77, `ring-` 10 = **287**. Arbitrary `shadow-[…]` 62, `rounded-[…]` 14.
- `src/ui/atoms/` already contains `Badge.tsx`, `Chip.tsx`, `Input.tsx`, `ToggleGroup.tsx`, `index.ts` (dated 2026-06-25) — all barrel-exported.
- Orphan barrels: `forms/inputs/index.ts` re-exports `DateInputTBD`/`DualInput`/`TextInputSmall`; `forms/selects/index.ts` re-exports `SearchableSelect`/`SearchableSelectIcons`. `FieldIndicator` also exists as a type at `src/types/card.types.ts:22` (collision).
- **shadcn IS installed**: `components.json` present (`style: radix-nova`, alias `ui → @/ui/shadcn`); Storybook installed (`.storybook/`). P5's "not installed" premise was stale.
- Dead CSS classes present at index.css ≈635/686/700; dead exports `typographyTokens`/`radiusTokens`/`shadowTokens` present; `blurTokens` kept.

## Blockers resolved
P1 (Claude #1-3 / Codex #1-3): re-scoped to typography-size only. Removed phantom font/shadow/radius register+migrate. Listed all 11 `--text-*` vars (Step 2/3, longest-match-first so `-plus` isn't corrupted). Added a **scope-boundary table** with an explicit disposition for every token category; the 287 theme color/border/ring usages declared **intentionally retained** (theme-reactive) with `P1b` named if PO wants migration. UX2-R3 token tasks (6 tokens, 26 hex, 3 dead classes inlined, 3 dead exports) made first-class. Fixed README "same treatment for font weights/radius/shadow" sentence.
P2 (Claude #3-4 / Codex #4-5): rewritten as reconciliation onto existing `atoms/*` — removed "Badge created in P1" and the "create `forms/inputs/TextInput.tsx`" instruction (would duplicate `atoms/Input.tsx`, violates core §4.5/§7). Step 1 now excludes barrel re-exports + `FieldIndicator` type from "real usage"; Step 2 removes barrel lines on delete + typechecks per batch. Added Step 7b Chip verification. Fixed Glass radius to map to `--radius-*` (not phantom `rounded-dcx-*`).
P5 (Claude #2 / Codex #6): visual spec split into a **hard gate** (P1 deliverables: 0 `text-[var(--text-*)]`, 0 raw hex, no clipping, light/dark) and **accepted-by-policy** retained arbitraries (no gating on them or on phantom `*-dcx` purity). Step 2/3 updated to current shadcn state (installed; `@/ui/shadcn` landing folder; raw-shadcn-behind-adapter rule). Builder V1 acceptance-criteria citation added.

## Advisories considered/applied
- Stale baselines: counts marked "as of v0.3.2 discovery, re-verify at Step 1" in README + sprints; typography 274→275 live.
- Dead-class names inlined in P1 Step 6.
- Codex adv#1: corrected the stale `output/P1-token-system.md` header — it falsely claimed the plan was activated/moved to `active/`; reframed as preflight-evidence-only, plan still DRAFTED.
- Codex adv#3: Builder acceptance-criteria citation note added to P5 (verified `docs/product/requirements/builder/acceptance-criteria.md` exists).
- Codex adv#4: P5 shadcn facts refreshed (installed). Codex adv#5 / logging: `build-log-index.sh` mislabel kept in README follow-ups.
- Chip (Claude adv#3): added as P2 Step 7b.

Files edited:
  docs/plans/drafted/folder-structure-v2/sprints/P1-token-system.md — re-scoped to typography-only; scope-boundary table; 11-variant migration; inlined dead classes; acceptance (471 lines, was 435)
  docs/plans/drafted/folder-structure-v2/sprints/P2-component-consolidation.md — reconcile-onto-existing-atoms rewrite; barrel-safe deletion; Chip step; Glass radius fix (400 lines, was 312)
  docs/plans/drafted/folder-structure-v2/sprints/P5-frontend-readiness.md — shadcn-installed facts; hard-gate vs accepted-by-policy spec; Builder criteria citation (350 lines, was 305)
  docs/plans/drafted/folder-structure-v2/README.md — status/audit-round-2 block; token-problem scope correction; color/phantom/retained metrics rows; stale-baseline note (220 lines, was 191)
  docs/plans/drafted/folder-structure-v2/output/P1-token-system.md — corrected false activation claim → preflight-evidence-only (204 lines, header only)

Files created:
  docs/progress/sessions/2026-06-27-claude/02-folder-structure-v2-audit-round2.md — this log

Files deleted: None

Churn — work reversed:
  Reverses parts of my own session-01 revision: the round-1 P1/P2/P5 wording I added (phantom font/shadow/radius migration, "Badge created in P1", "create TextInput.tsx", "shadcn not installed", `rounded-dcx-*` purity in P5) was itself inherited from Sonnet's draft and is now corrected. No source code reversed (none was written).

Preserve-semantic check:
  Inherited decisions preserved: no CSS modules, no mobile breakpoints (P5 1440/1920/2560), ai.service stub, mock retained (P4), context-coupled components in place (P3), dynamic-stage components not deleted. New: 287 theme color usages explicitly RETAINED (theme-reactive) rather than migrated — a documented scope boundary, not a silent drop.

Open decisions used:
  ⏱ 287 theme color/border/ring usages → "intentionally retained as arbitrary"; if PO wants them named, that is a separate `P1b-color-tokens` sprint (named, not drafted).
  ⏱ shadcn primitives land in `src/ui/shadcn/` per the `components.json` alias; P5 documents the seam but performs no swap.

Acceptance criteria:
  □ All 4 Claude blocking issues resolved in plan files: PASS
  □ All 6 Codex blocking issues resolved: PASS
  □ Advisories considered (stale baselines, dead-class inlining, stale P1 output, Builder citation, shadcn facts, Chip, logging): PASS
  □ No phantom font/shadow/radius migration remains (sweep clean): PASS
  □ No "created in P1" / "create TextInput.tsx" / port 5173 / "shadcn not installed" stale claims remain (sweep clean): PASS

Gates:
  typecheck: N/A — no source code changed (docs/plan only)
  dev: N/A — no source code changed
  verify.sh: N/A — no source code changed
  browser manual check: N/A — plan-revision session, no app behavior changed

Consumer updates required:
  None — no exported code changed.

Open issues / follow-ups:
  - `P1b-color-tokens` sprint is named but not drafted — PO decision whether the 287 theme usages get named utilities.
  - `production-api-client-switch` follow-up still named, not drafted (from round 1).
  - `scripts/build-log-index.sh` first-heading mislabel — still open tooling debt (README follow-ups). This log uses a real title as its first `##` to reduce mislabel risk; verify index entry after build.
  - Plan remains DRAFTED; awaits PO review + re-audit before activation.
