---
review-of: docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md
sprint: P2-component-consolidation
reviewer: Claude (claude-opus-4-8, Anthropic)
date: 2026-06-27
verdict: ACCEPT — CODE COMPLETE & GATE-CLEAN; browser gate is documented (now unblockable)
method: live grep/ls + ran typecheck/test/validate:architecture/lint/build against the working tree
also-covers: re-verification that P1 final state still holds; plan-close readiness decision
---

# P2 Output Review — Component Consolidation (and plan-close readiness)

## Verdict

**P2's code work is real, accurate, and gate-clean — every factual claim in the output file was
verified against the live tree.** The only unmet acceptance criterion is the **browser/screenshot/
console gate**, which Codex correctly logged as BLOCKED (Playwright Chromium binary missing + MCP
failure) rather than faked. That is the one piece of debt to close.

**The plan as a whole is NOT closeable yet** — see §4.

---

## 1. P2 claims verified against live code (all PASS)

| Claim (P2 output) | Live check | Result |
|---|---|---|
| 9 confirmed-dead orphans + `ReadinessBadge` deleted (10 total) | `ls` each of the 13 candidate files | ✓ all gone |
| `templates/day/` folder + `.gitkeep` removed | path absent | ✓ |
| Barrels updated, no broken re-exports | `cat inputs/index.ts selects/index.ts` | ✓ only existing files |
| No lingering imports of deleted components | repo-wide grep | ✓ none |
| Badge owns variants `default/status/readiness/lock` | `Badge.tsx` | ✓ all four present |
| `PhaseReadinessBadge` → renders `Badge variant="readiness"` (not a re-export) | file read | ✓ |
| Input gains `as="textarea"`; no new `TextInput.tsx` | `Input.tsx` + ls | ✓ `as?: 'input'\|'textarea'`; no duplicate |
| `forms/inputs/` = `ListInputLines`, `SpecsInput`, `index.ts` | ls | ✓ exactly these |
| `Select.tsx` created; `InlineSelect` deleted; `forms/selects/` = `Select`,`CompletionStateSelect`,`index.ts` | ls | ✓ |
| GlassSurface gains `radius` + `intensity` props | `GlassSurface.tsx` | ✓ both typed |
| Chip reused (not re-extracted) | `atoms/Chip.tsx` present, consumers migrated | ✓ |

**This directly clears my four round-2 blocking audit issues** (`audit/2026-06-27-claude.md`):
B3 (no duplicate atoms — reconciled onto existing `atoms/*`), B4 (barrels updated, `FieldIndicator`
type-collision excluded, no build break), plus the Badge merge-vs-delete reconciliation. Confirmed fixed.

## 2. Gates — re-run live by this review (not trusting the output)

| Gate | P2 output claim | My live result |
|---|---|---|
| `npm run typecheck` | PASS | **PASS** |
| `npm run test` | 27/27 | **27/27 PASS** (6 files) |
| `npm run validate:architecture` | PASS | **PASS** |
| `npm run build` | PASS | **PASS** |
| `npm run lint` | 156 problems (documented debt) | **156 (149 err / 7 warn)** — matches; pre-existing |
| Browser (dev server + console=0 + screenshots) | **BLOCKED** (Chromium/MCP) | **still BLOCKED in this env** — the open item |

## 3. Minor accuracy notes (non-blocking — do not re-open P2)

1. **`text-dcx-*` count is 260 live, P1 output said 272.** Expected: P2 deleted ~13 files that
   contained `text-dcx-*` usages. Not a regression — typography arbitrary (`text-[var(--text-*)]`)
   is still **0**.
2. **Retained color arbitraries are 297 live, README/P1 said ~311.** Same cause (P2 deletions). The
   "retained-by-policy" decision holds; the number just drifted down. Worth refreshing the README
   carry-forward number from 311 → 297.
3. **P1 output's "rounded-[var(--radius-*)] = 0" grep claim is inaccurate** — `CardShellContent.tsx:26`
   has `rounded-[var(--radius-3xl)]` and `rounded-[var(--radius-xl)]`. This is **allowed** (arbitrary
   `rounded-[…]` is retained-by-policy per the README), so it's not a defect — but P1's literal
   "No results" grep line should not be read as authoritative.

## 4. Plan-close readiness — NOT READY (this is the answer to "officially closed")

The plan is in `docs/plans/active/` (it is **not** in `completed/`). It cannot be closed because:

1. **P3, P4, P5 are `not-started`** — 3 of 5 sprints have no code, no output, no logs. A plan closes
   only when all its sprints close (core.md §29 plan-level close; §24 lifecycle).
2. **P1 + P2 browser/console/screenshot gates were never actually run** — only dev-smoke (HTTP 200).
   Their own acceptance criteria require "builder opens, console-error count 0, screenshots at
   1440/1920(/2560)". Those are open as documented debt, not satisfied.
3. **Repo-wide lint backlog (156)** is real; P3 is the sprint that reduces `as any`/exhaustive-deps,
   so some of it closes there, not before.

**Process note (the "bad behavior"):** the README shows the plan was *self-activated by Codex* after
its own READY verdict, rather than the PO moving drafted→active (§24). The revisions Codex made to
address the 8 combined blockers are substantive and **verified correct above**, so the outcome is
sound — but self-activation + marking sprints done with browser gates unmet is the process gap to
keep in view. Nothing is in `completed/`, so no improper close has actually happened yet.

## 5. Recommendation — yes, use opencode (now MCP/Playwright-ready)

Since opencode now has the MCPs + Playwright installed, have it do the following **before** any close,
in order:

1. **Close the P1+P2 browser debt first.** Start the dev server, open the builder via Playwright/
   chrome-devtools MCP at 1440 & 1920, capture **console-error count (must be 0)** and screenshots of
   the consolidated surfaces (Badge in MetadataIsland, Input in TaskEditor, Select in task-creation,
   GlassSurface card/popup). Append the evidence to `output/P1-token-system.md` and
   `output/P2-component-consolidation.md`, flipping the browser gate from BLOCKED → PASS.
2. **Execute P3 → P4 → P5 in dependency order**, each with full gates including the now-working browser
   gate, each writing its `output/*.md`, progress logs, and updating the README carry-forward contract.
3. **Then, and only then,** run `dcx-sprint-close` at plan level and move
   `docs/plans/active/folder-structure-v2/` → `docs/plans/completed/`.

Do **not** let opencode redo P1/P2 code — that work is verified complete. Its P1/P2 task is **only**
the browser evidence in step 1.

## Ready checklist (plan-close)

- [x] P1 code complete & gate-clean (verified; CSS split + tokenization done)
- [x] P2 code complete & gate-clean (verified above)
- [ ] P1+P2 browser/console/screenshot gates actually run (opencode, step 1)
- [ ] P3 executed + gated
- [ ] P4 executed + gated
- [ ] P5 executed + gated (visual polish baseline)
- [ ] Plan moved to `completed/` via plan-level close
