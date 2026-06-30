## FP-R3 — Modularization & file-size audit (builder / version / homepage)
Status: ✅ COMPLETED 2026-06-28 — HISTORICAL, NOT EXECUTABLE in this activation. Output `output/FP-R3-modularization.md` is read-only prior art consumed by FP-R4/R5. Do not re-run. (Active set = FP-R4 → FP-R5 only.)

### Intent
Measure every builder/version/homepage file against the `core.md §6` size caps and produce a
split-candidate + churn-risk map — no source changed.

### Step 0 — Session environment + carry-forward (MANDATORY, first step)
Run `build-current-state.sh` + `verify-tooling-state.sh`; log output. Read README carry-forward AND
prior FP outputs. Confirm canonical homes (`src-structure-decision.md`); REUSE map governs any split
recommendation (split INTO canonical homes, never into new parallel trees).

### Scope — in
- Enumerate files for the three surfaces: `src/builder/**`, `src/pages/` (version + home routes),
  plus their direct shared deps in `src/ui/**`, `src/hooks/**`, and `src/builder/ui/**`.
  *(There is no `src/components/` post folder-structure-v2 — legacy refs are prior-art only.)*
- Run `wc -l` on each; table each against `§6` caps (tsx ≤150/250, hook ≤120/200,
  actions/service/rules ≤150/250, registry ≤200/400).
- For each over-cap file: propose a split that respects `§5` preserve-semantic boundaries and the
  canonical homes; cite which `dcx-frontend-refactor` move applies.
- Churn-risk flag (`core.md §4`): note files multiple past sprints touched; recommend "do not
  redesign — extract only".
- Map reuse opportunities: duplicate component logic across the three surfaces (use
  `code-query.sh component` / `consumers`).

### Scope — out
- No file is split, moved, or edited. Recommendations only.
- No builder three-row layout change proposed (`core.md §10`) — modularization is internal only.
- Do not propose promoting builder behavior into `src/ui` (governance).

### Acceptance criteria
- [ ] (PO-verifiable) `output/FP-R3-modularization.md` has the full file-size table with real `wc -l`.
- [ ] (PO-verifiable) Every over-cap file has a concrete, boundary-respecting split proposal.
- [ ] (PO-verifiable) Churn-risk list present (which files prior sprints repeatedly touched).
- [ ] (code-verifiable) Allowed writes only: `output/*.md`, `output/evidence/**`, README carry-forward,
      `audit/*`, progress log. **No `src/` write** (path list + `src/` mtime check).

### Verification plan
| Criterion | Method | Evidence | Fallback |
|---|---|---|---|
| size table real | `wc -l` per file | counts in table | — |
| split respects boundaries | cross-ref `core.md §5/§8` per proposal | boundary cited | — |
| reuse/duplication found | `code-query.sh component/consumers` | command output | manual import grep, labeled (`§28`) |
| no source changed | path list + mtime check of `src/` | no `src/` path newer; only allowed-write paths | — |

### Dependencies
- None on other FP sprints (parallel). FP-R5 consumes this.

### Files likely affected
- create: `output/FP-R3-modularization.md`
- read-only: `src/builder/**`, `src/pages/**`, `src/ui/**`, `src/hooks/**`, `src/builder/ui/**`

### Final step — Continuity wiring (MANDATORY, last step)
Append to README carry-forward: count of over-cap files (baseline metric), the split-candidate list
location, and any churn-risk "extract-only" files the implementation plan must respect.
