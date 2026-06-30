---
review-of: RS-R1-build-notes (graph store + schema + validators)
plan: requirements-system
sprint: RS-R1
reviewer: Claude (claude-opus-4-8)
date: 2026-06-29
type: output-audit (core.md §30) — gates re-run independently
verdict: ACCEPT — RS-R1 complete; documented debt is pre-existing and unrelated
---

# Output audit — RS-R1 (graph store + schema + validators)

## Verdict

**ACCEPT.** RS-R1 delivers a real, working data + validation layer. I **re-ran every gate myself** (not
trusting the log) and all of Codex's PASS claims hold; the only failing gate (`lint`) is pre-existing debt
in builder files with **zero** errors from the new RS-R1 code. Honest stubs for later-sprint commands
(§16 respected). RS-R2 is correctly teed up.

## Gates — re-run independently (this is the core of the audit)

| Gate | Codex claim | Re-run result |
|---|---|---|
| `npm run req:validate` | PASS | ✅ `{pass:true, errors:[], warnings:[]}`, exit 0 |
| `npm run typecheck` | PASS | ✅ exit 0 |
| `npm run test` | 33 pass / 7 files | ✅ 33/33, 7 files (6 new requirements tests + 27 existing) |
| `npm run validate:architecture` | PASS | ✅ 0 violations, 264 modules cruised |
| `bash scripts/verify.sh` | PASS | ✅ "verify passed" |
| `npm run lint` | FAIL (pre-existing) | ✅ 43 errors, **none reference `requirements/`** — all pre-existing builder `no-explicit-any` |

## Acceptance criteria — verified

| Criterion | Verdict | Evidence |
|---|---|---|
| `validate` command exists, exact name/path, depend-able | ✅ | `npm run req:validate` → `scripts/requirements/validate.ts`; declared in carry-forward |
| Validators catch each error class + progressive maturation | ✅ | `validators.ts` covers schema/id/scope/state/progressive/lock/relationship/derivation/coverage/exemption/evidence/ledger; tests assert draft-passes + impl-ready-fails |
| Lock enforcement rejects illegal locked nodes | ✅ | `validateStateCombination` + test "rejects locked nodes without lock owner and date" |
| Coverage returns complete/partial | ✅ | `calculateCoverageRollup` + test |
| Gates run | ✅ | re-run table above |
| §28 fallback / no `src/` product change | ✅ (with note F-R1-1) | only new `src/` is an isolated test subtree; no builder/product code touched |

## Code quality notes

- `schema.ts` / `validators.ts` / `store.ts` are real, typed, and readable; validators push structured
  `{validator, id, message}` errors — good for the queues later.
- Seed ledger entry persisted: `LDG-2026-06-29-RS-R0-METHODOLOGY-SIGNOFF` (the RS-R0b sign-off) — exactly
  as the carry-forward required.
- Build-notes carry a **Requirement Trace** section — dogfooding the RS-R0b format early. Good.

## Findings (minor; non-blocking — for RS-R2/R3)

| # | Finding | Why it matters | Action |
|---|---|---|---|
| F-R1-1 | Tests live in `src/requirements/__tests__/` and import from `scripts/requirements/` via `../../../`. | Justified (Vitest only discovers `src/**`); passes dependency-cruiser. But it's a `src → scripts` cross-tree import. | Acceptable. RS-R2 could add a Vitest `include` for `scripts/requirements/**` and relocate, or keep — PO/owner choice. |
| F-R1-2 | `validateCoverage` link filter (`source===node.id \|\| expected_categories.includes(source)`) is a simplification keyed on `link.target`. | Works on fixtures; real EMC↔MAN graphs are richer. | RS-R3 must harden coverage rollup against real reconciliation data. |
| F-R1-3 | `lint` debt: 43 pre-existing `no-explicit-any` errors in builder `src`. | Not RS-R1's; but the plan says clear env debt **before RS-R3**. | Track; resolve before RS-R3. |

## Recommendation

Accept RS-R1 and proceed to **RS-R2** (mutation/sign-off + ledger + queues + views + low-token query),
which must **reuse** `scripts/requirements/{schema,store,validators}.ts` and the declared `req:*` scripts.
Clear the lint debt before RS-R3 (reconciliation).
