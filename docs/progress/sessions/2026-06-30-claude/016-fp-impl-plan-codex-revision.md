---
log: 016-fp-impl-plan-codex-revision
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: mixed
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
---

# 016 — Check Codex audit of implementation plan; apply all revisions

## Type: mixed (audit-review + user-request-planning / §34 Revise)
PO: check Codex plan audit. Verdict: **NEEDS REVISION** — 3 blocking, 4 advisory
(`audit/2026-06-30-codex.md`). All 7 applied by regenerating the 18 sprint files.

## Codex findings → fixes
| # | Sev | Finding | Fix |
|---|---|---|---|
| 1 | Block | No Step 0 / session-env check in sprint files | Added `### Step 0 — Session environment + continuity` to **all 18**: run build-current-state + verify-tooling, log, stop on version mismatch, read carry-forward + prev output, confirm tool access |
| 2 | Block | Browser/visual gates lack §28 fallback | Added §28 fallback to **all 18**: dev-smoke/Playwright-CLI, mark MCP gate `BLOCKED` (never PASS), Codex §29a handoff for browser gates |
| 3 | Block | Requirement Trace too thin for RS-R0b/§35a | Expanded **all 18** to RS-R0b shape: Scope/type, States (→target implemented/verified), Source/lock, Expected manifestation categories (concrete `EMC-*`), Actual manifestations (_to fill during execution_), Gate result (_pending_). CC-1 now cites `REQ-EVI-001/UP-011/UP-012` + labels file-size governance (not a bare non-graph ID) |
| A1 | Adv | Evidence folder names shortened | Restored FP-R5 descriptive names (`WM-1-theme-toggle`, `CT-1-theme-tokens`, `CC-2-card-responsive`, …) |
| A2 | Adv | CT-1/CT-2 lack G-IMPECCABLE stop-condition | Added a **first G-IMPECCABLE stop-task** to CT-1 + CT-2 (check quarantine; else direct brand route + log mode) |
| A3 | Adv | CC-2 design checkpoint artifact undefined | CC-2 Step 0a writes `output/CC-2-design-checkpoint.md` + PO sign-off evidence before code |
| A4 | Adv | Targeted test selection vague | Gates now say `npm run test -- <pattern>` when a test exists, else `npm run test` + log "no targeted test" with code-query evidence |

## Codex positives (kept)
Token-first order preserved; 2026-06-30 patch absorbed (T06/T07/K08→WM-6, L06→CT-1); three-family
routing intact; impeccable constrained to brand; RS-R11 "0 delivery-confirmed" carried; prior-art
compliance correct (cites completed, not expired).

## Gates
Planning/doc-only. 0 `src/` writes. No graph mutation. Plan remains drafted.

## Next
Codex **re-audits** the revised plan (`core.md §34`). On READY → resolve G-IMPECCABLE → PO activates
(`drafted/ → active/`) → execute WM-1 first.
