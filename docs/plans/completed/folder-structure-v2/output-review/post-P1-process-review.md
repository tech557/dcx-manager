---
review-of: folder-structure-v2 (planning process, post-P1)
reviewer: Claude (claude-opus-4-8, Anthropic)
date: 2026-06-27
type: output review (process) — applied to active plan + canonical skills/rules
scope: planning logic, continuity wiring, closing levels, tooling fallbacks, output-audit phase
---

# Post-P1 Process Review — Tightening the Planning System

This is the second output review after P1 (the first was `P1-token-system-review.md`). It is **not**
about P1's code — it captures the process improvements the PO requested and records exactly what was
applied to the canonical skills/rules and to this active plan.

## What was determined (PO direction)

1. **Output audit is optional but common.** Reviewing a sprint's *output after execution* is a normal
   phase, distinct from the pre-activation plan audit, and may re-open a sprint when it finds a gap.
2. **Continuity wiring belongs at the END of every sprint**, wiring forward to **all** later sprints —
   not just the next. One living carry-forward contract per plan; every sprint reads it (Step 0) and
   updates it (final step).
3. **Closing must work at four levels** — task, multi-task (bundled run), sprint, plan — because agents
   bundle their runs differently. (PO: "I don't wanna fight this now" → accommodate, don't enforce one
   bundling.)
4. **Tools fail; provide alternatives + log them.** MCP/test/skill unavailability must use a labelled
   fallback and a logged follow-up — never a faked gate. (Not fixing installation now.)

## Applied to the canonical system (so ALL future plans inherit it)

| Change | Where |
|---|---|
| §27 Continuity Wiring — carry-forward contract; read first / update last; wire to all sprints | `docs/agent-rules/core.md` |
| §28 Fallbacks & Graceful Degradation — log, don't fake, don't silently skip | `docs/agent-rules/core.md` |
| §29 Closing Levels — task / multi-task / sprint / plan, with the bar for each | `docs/agent-rules/core.md` |
| §30 Output Audit — optional but common; `output-review/` folder; may re-open a sprint | `docs/agent-rules/core.md` |
| Sprint template gains Step 0 (carry-forward read) + final continuity-wiring step + fallback column in the verification plan | `agent-skills/dcx-sprint-planner/SKILL.md` |
| Closing skill gains Step 0 (pick closing level), a fallback row + carry-forward row in the verdict table, and fallback rules (tool-unavailable → PASS WITH DOCUMENTED DEBT, never PASS) | `agent-skills/dcx-sprint-close/SKILL.md` |
| Plan-audit skill gains §7 continuity-wiring check, §8 tooling-fallback check, the plan-vs-output-audit distinction, and two ready-checklist items | `agent-skills/dcx-plan-audit/SKILL.md` |
| Adapters regenerated | `bash scripts/agent/sync-skills.sh` → `.claude/skills/`, `.agents/skills/` |

## Applied to THIS active plan (folder-structure-v2)

- **Carry-forward contract** already present (README `## Carry-forward contract — current structural
  state`), populated with the post-P1 facts (split CSS in `src/brand/styles/*`, the `--theme-*` /
  `--theme-component-*` token homes, `text-dcx-*` utilities, existing atoms, retained-by-policy items,
  documented debt). Every sprint P2–P5 Step 0 reads it; each binding instructs updating it at sprint end.
- **Execution-gates block** updated: Step 0 now includes "read carry-forward + previous output"; a
  **final step** "update the carry-forward contract"; and a **tooling-fallback** clause (Playwright
  Chromium missing → dev-smoke + HTTP 200, mark screenshot gate BLOCKED, PASS WITH DOCUMENTED DEBT).
- **Process-contract pointer** added under execution gates referencing core.md §27–§30 and this file.

## Verification

- `grep "^## §2[789]\|^## §30" docs/agent-rules/core.md` → 4 sections present.
- `sync-skills.sh` → 6 skills synced.
- README has `## Carry-forward contract`, the final-step + fallback lines, and the §27–§30 pointer.
- P2–P5 each carry exactly one `Carry-forward contract (MANDATORY` Step-0 binding.

## Not done on purpose

- No tool installation (Playwright Chromium, semgrep, Storybook) — tracked as debt, per PO.
- No `version_context` bump (PO-only).
- Did not retro-fit closing-level text into each P2–P5 sprint body; the closing levels live in the
  `dcx-sprint-close` skill (the right home) and apply to every sprint automatically.

## Tooling gap found while applying this (logged per §28, not fixed now)

`scripts/agent/sync-skills.sh` produces a **truncated adapter for `dcx-plan-audit`**:
`.claude/skills/dcx-plan-audit.md` is **35 lines** vs the **233-line** canonical, while every other
adapter is `canonical + ~12`. The awk body-extraction breaks on that file's markdown tables /
blockquotes / code fences, so the plan-audit methodology (incl. the new §7 continuity-wiring and §8
tooling-fallback checks) **does not reach the adapter**. Mitigation in place: the adapter carries a
pointer comment to the canonical, and `docs/agent-skills.md` declares the canonical authoritative —
so an agent running a plan audit must read `agent-skills/dcx-plan-audit/SKILL.md`. Fix later: make the
sync extractor robust to tables/fences (or have the adapter inline the full canonical body verbatim).

## Follow-ups

- First real exercise of the contract is **P2**: confirm P2's close updates the carry-forward block
  and uses the fallback clause for its browser gate if the MCP is unavailable.
- **`sync-skills.sh` truncates the `dcx-plan-audit` adapter** (above) — tooling debt.
- Pre-existing: `build-log-index.sh` mislabel; `P1b-color-tokens`; `production-api-client-switch`;
  Quality-gates `BLD-*` ID; repo-wide lint backlog; Playwright Chromium binary.
