---
review-of: FP-R3-modularization
reviewer: claude (claude-opus-4-8)
date: 2026-06-28
verdict: PASS
blocking-issues: 0
advisory-issues: 1
---

# Output Audit: FP-R3 — Modularization & File-Size Audit

## Verdict

PASS — safe for FP-R5 consumption as-is.

**Reason:** Every quantitative claim in FP-R3 reproduces **exactly** against the live v0.3.5 tree. An
independent re-measurement of the full scope (`src/builder`, `src/pages`, `src/ui`, `src/hooks`) and a
clean-room reconstruction of the cap math produced identical results: 187 measured, 1 over hard cap, 27
over target, 159 within — same files, same line counts, same OK/OVER classification. No omissions, no
phantom rows, no `src/` writes. Unlike FP-R2, this output needed no follow-up.

## Verification method

Re-walked the four scope roots for `.ts`/`.tsx`, ran `wc -l` on every file, and re-derived each file's
cap class and pass/fail from the documented cap rules — then diffed the full set against Codex's table.
Spot-checked reuse-map consumer claims with `rg`. No `src/` files written by this audit.

## Metric reproduction — claimed vs reproduced

| Metric | FP-R3 claim | Reproduced | Status |
|---|---:|---:|---|
| Files measured | 187 | 187 | ✅ EXACT |
| Over hard cap | 1 | 1 | ✅ EXACT |
| Over target only | 27 | 27 | ✅ EXACT |
| Within target/cap | 159 | 159 | ✅ EXACT |
| Homepage/version route files over target | 0 | 0 | ✅ EXACT (`HomePage` 9, `VersionPage` 16, `RootLayout` 18) |
| Hard-cap file = `useEditorState.ts` @ 375 (hook 120/200) | 375 | 375 | ✅ EXACT |

**Over-target set membership:** my reconstructed 27-file list is identical to Codex's 27-row table —
every file and every line count matches (248, 239, 239, 237, 235, 233, 217, 210, 209, 208, 206, 204,
204, 198, 190, 188, 183, 180, 174, 174, 166, 160, 159, 157, 155, 152, 136). Because the pass/fail sets
match exactly, there are no off-by-one or kind-misclassification errors that flip OK↔OVER.

**Table completeness:** set difference (tree files ↔ listed files) is empty in both directions — no
in-scope file was silently dropped, and no listed path is fabricated.

## Acceptance criteria check

| Criterion | Result | Notes |
|---|---|---|
| Full file-size table with real `wc -l` | PASS | 187/187 counts reproduce exactly |
| Every over-cap file has a boundary-respecting split proposal | PASS | Hard-cap `useEditorState.ts` + all 27 target-only files have concrete, co-located split proposals citing `§5`/canonical homes |
| Churn-risk / extract-only list present | PASS | 7 hot clusters listed with prior-sprint evidence + extract-only rule |
| Allowed writes only; no `src/` write | PASS | `find src -newer <output>` = empty; only `output/*.md` + README carry-forward touched |
| Step 0 session env + carry-forward | PASS | `build-current-state.sh` + `verify-tooling-state.sh` logged; prior FP outputs read |
| Final step continuity wiring | PASS | README `### FP-R3 carry-forward` present (`README.md:367`) with baseline counts + hard-cap blocker |

## Gate review

| Gate | Result | Notes |
|---|---|---|
| `wc -l` size table | PASS (reproduced) | 187 files, all counts exact |
| `code-query.sh duplicate-controls / raw-controls / consumers / affected` | PASS | All four subcommands exist (`code-query.sh help`) and were used for the reuse map |
| No-source-change | PASS | mtime check clean; sprint is read-only discovery |
| Boundary correctness | PASS | Proposals split into canonical homes; no promotion to `src/ui`, no frozen-layout redesign (`BuilderPage`/`StageCore`/`StageProvider` marked extract-only) |

## Reuse-map spot checks

| Claim | Reproduced |
|---|---|
| `ToggleGroup` consumed by `PhaseEditorSection` + `ViewTabSwitcher` | ✅ exact (plus `atoms/index.ts` re-export) |
| `GlassSurface` — 3 consumers | ✅ 3 |
| Deleted hooks `useEditorPanel` / `useEditorDraft` / `useEditorGuard` absent | ✅ all absent (folder-structure-v2 merge intact) |
| `Input` — 7 consumers | ⚠️ I count 6 distinct importing files (see Advisory #1) |

## Advisory issues (non-blocking)

| # | Issue | Evidence | Suggested fix |
|---|---|---|---|
| 1 | Reuse map states `Input` has "7 consumers"; a direct `rg` for import sites finds **6** distinct feature files. The gap is almost certainly the `src/ui/atoms/index.ts` re-export being counted by `code-query.sh consumers`, i.e. a counting-method nuance, not a fabricated number. | `FP-R3-modularization.md:111`. `rg -l` for `atoms/Input` imports = 6 files. | Optional: note that the consumer count includes the barrel re-export, or cite the exact `code-query.sh consumers Input` output. Does not affect any split decision. |

## What FP-R3 got right

- **The entire quantitative core reproduces exactly** — this is the sprint's whole purpose and it is
  fully trustworthy. FP-R5 can consume 187 / 1 / 27 / 159 and the per-file table without re-checking.
- **One real hard-cap blocker correctly isolated** (`useEditorState.ts` @ 375) with a split that
  preserves the `useEditorState()` facade and explicitly forbids resurrecting the three hook names
  deleted in folder-structure-v2 P3 — a genuine churn-trap avoided.
- **Frozen-layout discipline held** — `BuilderPage`, `StageCore`, `StageProvider` are flagged
  extract-only, not redesign, consistent with `core.md §10`.
- **Honest scoping** — the 27 target-only files are explicitly marked "do not block FP-R5; split only
  when already touched," which is the correct polish-sprint posture.

## Required follow-up

None. FP-R3 is complete and consumable. The single advisory is a documentation nicety, not a defect.
