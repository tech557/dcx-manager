---
audit-of: ux-discovery-v2
auditor: codex
date: 2026-06-26
verdict: NEEDS REVISION
blocking-issues: 3
advisory-issues: 3
---

# Plan Audit: ux-discovery-v2

## Verdict

NEEDS REVISION

**Reason:** UX2-R2 calls `code-query.sh duplicate-controls` and `verify-tooling-state.sh` is absent from its session start; UX2-R3 has no session environment check step at all; and two critical context files referenced in UX2-R1 and UX2-R3 (`src-structure-refactor` expired plan outputs) are not confirmed to exist in the repo.

## Blocking issues (must fix before activation)

| # | Sprint | Issue | Evidence | Fix |
|---|---|---|---|---|
| 1 | UX2-R1 | Step 1 calls `bash scripts/agent/verify-tooling-state.sh` but the Gates section also lists it as the only verify gate — yet UX2-R2's Step 1 omits `verify-tooling-state.sh` entirely (only runs `build-current-state.sh`). The parallel sprint will start from potentially stale tooling state. | UX2-R1 Step 1: both scripts listed. UX2-R2 Step 1: only `build-current-state.sh` listed. | Add `bash scripts/agent/verify-tooling-state.sh` to UX2-R2 Step 1 so both parallel sprints confirm tool availability before running. |
| 2 | UX2-R3 | No session environment check step. Sprint jumps directly to "Read required inputs" with no `build-current-state.sh` call. | UX2-R3 Steps: Step 1 = "Read required inputs", Step 2 = synthesize, no environment check. The skill audit rule §6 requires every sprint to have an explicit session start step. | Add a Step 0 or re-number so `bash scripts/agent/build-current-state.sh` is the first command, with output logged under `## Session Environment`. |
| 3 | UX2-R1 and UX2-R3 | Both sprints reference `docs/plans/expired/src-structure-refactor/output/P1-design-tokens-output.md` and `docs/plans/expired/src-structure-refactor/plan/README.md` as required context files. These files are not in the confirmed expired plan list (`ls docs/plans/expired/` shows only `ui-ux-discovery`). If those files don't exist, the executing agent will block on Step 1 / Step 3 context reads with no fallback defined. | UX2-R1 Context block references `docs/plans/expired/src-structure-refactor/output/P1-design-tokens-output.md`. UX2-R3 Step 1 references `docs/plans/expired/src-structure-refactor/plan/README.md`. Neither path was confirmed to exist in the repo. | Confirm these paths exist (`ls docs/plans/expired/src-structure-refactor/`) before activation, or add a fallback instruction: "If this file does not exist, note that P1 output is unavailable and proceed with UX-R1 baseline only." |

## Advisory issues (should fix, won't block)

| # | Sprint | Issue | Evidence | Suggested fix |
|---|---|---|---|---|
| 1 | UX2-R2 | Step 2 uses `src/**/*.tsx` glob in a bash context (`grep -ohE "[a-z-]+\[[^\]]+\]" src/**/*.tsx`). Without `globstar` enabled in bash, this silently matches only the top-level `src/*.tsx` and produces incomplete results with no error. | Step 2 command: `grep -ohE "..." src/**/*.tsx 2>/dev/null`. The `2>/dev/null` suppresses the missing-glob error, making silent failure the default. | Replace with `grep -roh --include="*.tsx" -E "[a-z-]+\[[^\]]+\]" src/` which works correctly in all bash modes. |
| 2 | UX2-R2 | Step 3 says "Count how many are used in TSX files — for each class name, check if any TSX file uses it" but provides no command to do so. This is a judgment call, not a deterministic step. | Step 3 provides the grep for class names in index.css but the cross-reference step has no command. | Provide the explicit cross-reference command, e.g.: `while IFS= read -r cls; do count=$(grep -rl "$cls" src/ --include="*.tsx" | wc -l); echo "$count $cls"; done < <(grep -oE '\.[a-z-]+' src/brand/index.css)` or equivalent. |
| 3 | UX2-R3 | Step 5 instructs the executor to "name the specific files to change" but provides no tooling to enumerate those files — it relies on the executor reading UX2-R1/R2 outputs and making judgments. If those outputs use inconsistent file-path formats, the synthesis task list may be incomplete. | UX2-R3 Step 5: "produce concrete, unambiguous tasks... name the specific files to change" — no script provided to cross-check file existence. | Add an instruction to validate referenced file paths: `for f in <listed files>; do ls "$f" || echo "MISSING: $f"; done` so the synthesis output's file list is verifiable. |

## Prior art compliance

The expired `ui-ux-discovery` plan produced three output files, all confirmed to exist:
- `docs/plans/expired/ui-ux-discovery/output/UX-R1-token-inventory.md` — pre-P1 baseline (269 raw hex values)
- `docs/plans/expired/ui-ux-discovery/output/UX-R2-component-css-map.md` — CSS class → component mapping
- `docs/plans/expired/ui-ux-discovery/output/UX-R3-style-synthesis.md` — synthesis and recommendations (included CSS modules recommendation)

The v2 plan incorporates the expired plan well:
- README has a `prior-art:` field pointing to the correct directory.
- README instructs executors to read all three output files before starting.
- README explains exactly why v2 is needed (ESLint v9, hardcoded-tokens script, and P1 execution changed the baseline).
- UX2-R3 explicitly lists CSS modules as a rejected approach and names the expired plan that rejected it — this is correct and prevents a known expensive repeat.
- UX2-R2 references the specific expired findings (48 dead CSS classes, 5 duplication groups) as comparison baselines.

One silent drop: the expired UX-R2 produced a CSS class → component map. UX2-R2 does not produce an updated version of this map by name — it produces pattern data and duplication groups, but the explicit per-class ownership table is not in the output format. This may be intentional (Tailwind-first project, fewer global CSS classes now) but is not documented as a deliberate scope reduction.

## Gate coverage summary

| Sprint | typecheck | lint | validate:architecture | test | browser | Notes |
|---|---|---|---|---|---|---|
| UX2-R1 | N/A | N/A | N/A | N/A | N/A | Discovery sprint, no code changed. Gates explicitly marked N/A with reason. |
| UX2-R2 | N/A | N/A | N/A | N/A | N/A | Discovery sprint, no code changed. typecheck/browser marked N/A. lint and validate:architecture not listed — acceptable since no code changes. |
| UX2-R3 | N/A | N/A | N/A | N/A | N/A | Discovery sprint, no code changed. No gate section present at all — not blocking since no source changes, but gate section should be added for consistency. |

All three sprints are pure discovery with no source file changes. Gate N/A markings are appropriate and the Definition of Done explicitly states "No source code changed across all three sprints."

## Handoff quality

**UX2-R1 → UX2-R3:** Output format is well-defined. The output file path (`output/UX2-R1-token-status.md`) is explicit, section names are exact, and UX2-R3 references those sections directly. A fresh agent executing UX2-R3 can act on the R1 output without re-reading source files. Pass.

**UX2-R2 → UX2-R3:** Output format is well-defined. Section names and file path are explicit. UX2-R3 references UX2-R2 output by exact filename. Pass.

**UX2-R3 → folder-structure-v2:** The synthesis output format defines specific task lists with acceptance criteria and file scope. This is the correct level of specificity for handing off to folder-structure-v2 P1/P2. The format will produce output that a fresh agent (opencode) can execute without needing to re-read the discovery source data. Pass, conditional on the task list actually being populated with real file paths (see advisory issue #3).

**Cross-sprint parallel handoff (UX2-R1 ∥ UX2-R2):** Both sprints write to separate output files. UX2-R3 waits for both. No shared state, no race condition. Parallel execution design is correct.

**Executor naming:** All three sprints name `Codex / opencode` as executor. Consistent with Sprint Index. Pass.

## Ready checklist

- [ ] All blocking issues resolved
- [x] Prior art findings incorporated (expired plan outputs referenced, CSS modules rejection documented)
- [x] Every sprint has executor named (`Codex / opencode` in all three sprint frontmatter)
- [x] Every code-modifying sprint has gate coverage (no sprints modify code; N/A is appropriate)
- [ ] Session start steps present in each sprint (UX2-R2 missing `verify-tooling-state.sh`; UX2-R3 missing session environment check entirely)
