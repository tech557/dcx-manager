## FP-R2 — Token + hardcoded-value audit & baseline metrics
Status: ✅ COMPLETED 2026-06-28 — HISTORICAL, NOT EXECUTABLE in this activation. Output `output/FP-R2-token-audit.md` is read-only prior art consumed by FP-R4/R5. Do not re-run. (Active set = FP-R4 → FP-R5 only.)

### Intent
Map every visual value that bypasses the token system and produce the numeric baseline the
implementation plan will move — no source changed.

### Step 0 — Session environment + carry-forward (MANDATORY, first step)
Run `build-current-state.sh` + `verify-tooling-state.sh`; log output. Read README carry-forward AND
FP-R1 output if present (do not re-derive brand deltas — cite them). Confirm canonical token homes.

### Scope — in
- `bash scripts/agent/code-query.sh hardcoded-tokens` → every hex/rgba/arbitrary value outside
  `src/brand/`. Group by file and surface (builder / version / homepage / shared).
- Identify dead tokens: tokens/classes in `src/brand/` with 0 consumers (cross-check via
  `code-query.sh consumers` / `code-query.sh labels`).
- Find remaining `text-[var(--text-*)]` arbitrary-syntax regressions (should be 0 post P1; verify).
- Capture baseline counts: # hardcoded literals, # dead tokens, # arbitrary-syntax hits, #
  `--theme-*` arbitraries intentionally retained (the P1b 287 set — re-count live).

### Scope — out
- No edits to tokens, CSS, or components. Findings only.
- Do not migrate the intentionally-retained theme arbitraries (that is the `P1b` decision, PO-owned).

### Acceptance criteria
- [ ] (PO-verifiable) `output/FP-R2-token-audit.md` lists every hardcoded literal with file:line.
- [ ] (PO-verifiable) Dead-token list with consumer evidence (0 consumers proven, not assumed).
- [ ] (code-verifiable) Baseline counts section present with raw numbers (feeds metrics-baseline).
- [ ] (code-verifiable) Allowed writes only: `output/*.md`, `output/evidence/**`, README carry-forward,
      `audit/*`, progress log. **No `src/` write** (path list + `src/` mtime check).

### Verification plan
| Criterion | Method | Evidence | Fallback |
|---|---|---|---|
| hardcoded list complete | `code-query.sh hardcoded-tokens` | command output quoted | if script fails: `grep -rnE '#[0-9a-fA-F]{3,8}|rgba?\(' src --include=*.tsx --include=*.css` and mark fallback (`§28`) |
| dead tokens proven | `code-query.sh consumers <token>` per candidate | 0-consumer output | manual grep fallback, labeled |
| baseline numbers | tally from above | counts table | — |
| no source changed | path list + mtime check of `src/` | no `src/` path newer; only allowed-write paths | — |

### Dependencies
- None on other FP sprints (parallel). FP-R5 consumes this.

### Files likely affected
- create: `output/FP-R2-token-audit.md`
- read-only: `src/**`, `src/brand/**`

### Final step — Continuity wiring (MANDATORY, last step)
Append to README carry-forward: the baseline counts (so FP-R5 metrics and the implementation plan
measure deltas against fixed numbers) and the dead-token list location.
