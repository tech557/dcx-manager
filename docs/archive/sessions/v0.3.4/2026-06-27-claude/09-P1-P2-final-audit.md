## folder-structure-v2 — Final P1+P2 audit (pre-P3) + coherence cleanup
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-27
Status: Completed

Intent: Re-audit P1+P2 output (opencode added tests; cross-agent logs); judge against the component/shell structure requirement; give a final verdict — safe to start P3 or refactor existing sprints + add steps.
Trigger: user request — "audit P1 and P2 output again since opencode has provided more tests ... read the logs (incoherent text) ... maintain the components and shell structure, refer to requirements ... final verdict if safe to pass to next sprint or refactor existing sprints and add more steps."
Requirements covered: N/A — audit/verification + sprint/doc coherence fixes; no product src changed.

## Verdict: PROCEED TO P3 after a short coherence-cleanup. Do NOT redo P1/P2.

## Code verified live (P1/P2 sound)
text-[var(--text-*)]=0; text-dcx=260; raw hex in JSX=0 (lone match is `#default-export` URL comment in src/stories/Button.stories.ts — false positive); components.css literals=0; atoms intact (Badge/Chip/Input/ToggleGroup); forms/inputs=ListInputLines+SpecsInput+index; forms/selects=Select+CompletionStateSelect+index; GlassSurface radius/intensity. Gates: typecheck/test(27/27)/architecture/build PASS; lint 156 pre-existing. Browser evidence captured (8 screenshots, 0 app console errors). Shell architecture (CardShell/CardShellContent/BuilderIslandShell/PopoverShell/StickyPopupShell) intact — component/shell structure MAINTAINED.

## Incoherences found (doc/process, not code)
1. docs/product/decisions/src-structure-decision.md STALE — describes src/components/ (gone; merged into src/ui/), lists deleted primitives (StatusBadge/LockBadge), proposes moot moves D1/D2. The component/shell structure authority is out of sync. NOT referenced by P3's coded steps.
2. P2 output header said "Status: In progress" while sprint = completed-with-documented-debt + Task 10 PASS. Internal contradiction.
3. Pre-P5 scaffolding untracked: src/ui/shadcn/button.tsx (0 consumers/adapter), src/stories/Button.stories.ts, Storybook install — added ~02:01, owned by no sprint, pre-positioned for P5.
4. README carry-forward numbers stale: color arbitraries ~311→297; text-dcx 272→260 (P2 deletions).
5. "more tests" claim unverifiable — live suite still 27 tests / 6 files, unchanged since P1. PO/opencode to reconcile.
6. Process noise: Codex self-activated plan (drafted→active) vs PO (core.md §24); 6+ overlapping audit/re-audit logs.

## Coherence fixes applied
- P2 output header → "Completed with documented debt" + reconciliation comment.
- src-structure-decision.md → ⚠️ STALE banner (surfaced contradiction; decisions NOT rewritten — PO to refresh/supersede).
- README carry-forward → number refresh (297/260), pre-P5 scaffolding "do not delete as dead" note, structure-doc-stale note, browser-debt-closed note.
- P3 sprint → structure/shell guard in Step 0 (no folder moves; preserve shells; shadcn/stories not dead; ignore stale structure doc) + acceptance criterion "Component/shell structure preserved" + §28 fallback + §27 first/last-step criterion.
- Created output-review/P1-P2-final-audit.md (the verdict).

## Files
Files created:
  docs/plans/active/folder-structure-v2/output-review/P1-P2-final-audit.md
  docs/progress/sessions/2026-06-27-claude/09-P1-P2-final-audit.md (this log)
Files edited:
  docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md (header)
  docs/product/decisions/src-structure-decision.md (STALE banner)
  docs/plans/active/folder-structure-v2/README.md (carry-forward refresh + scaffolding/structure notes)
  docs/plans/active/folder-structure-v2/sprints/P3-structure-quality.md (structure/shell guard + acceptance)
Files deleted: None

Churn — work reversed: None. P1/P2 code untouched (verified sound). Doc/process coherence only.

Preserve-semantic check: No code changed. Shells/atoms/structure preserved; pre-P5 scaffolding explicitly protected from deletion.

Open decisions used:
  ⏱ src-structure-decision.md banner-only (not rewritten) — it's a PO-approval doc; PO to refresh.
  ⏱ shadcn/stories scaffolding kept (not deleted) — pre-positioned for P5.

Acceptance criteria:
  □ P1/P2 re-audited live incl. shell structure: PASS
  □ Incoherences identified + surfaced: PASS
  □ Coherence fixes applied; P3 structure/shell guard added: PASS
  □ Final verdict delivered (proceed to P3 after cleanup): PASS

Gates (this session's checks):
  typecheck: PASS; test: PASS (27/27); validate:architecture: PASS; build: PASS
  browser manual check: N/A — audit; P1/P2 browser evidence already captured by prior run

Consumer updates required: None.

Open issues / follow-ups (PO):
  - Refresh or supersede src-structure-decision.md against the live tree.
  - Reconcile the "more tests" claim (count still 27/6).
  - Decide ownership of src/ui/shadcn + src/stories (P5 wires them; until then they're tracked scaffolding).
  - Process: PO-owned activation vs agent self-activation; consolidate the audit-log proliferation.
  - Pre-existing: lint backlog; build-log-index.sh mislabel; sync-skills.sh plan-audit truncation; P1b-color-tokens; production-api-client-switch; Quality-gates BLD ID.

index: hand-appended to docs/progress/index.csv (build-log-index.sh mislabels/duplicates — known tooling debt).
