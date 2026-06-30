## FP-R1 — Brandbook ↔ design-system reconciliation (impeccable, brand-only)
Status: ✅ COMPLETED 2026-06-28 — HISTORICAL, NOT EXECUTABLE in this activation. Outputs `output/FP-R1-brand-reconciliation.md` + `output/brand-ui-interpretation.md` are read-only prior art consumed by FP-R4/R5. Do not re-run. (Active set = FP-R4 → FP-R5 only.)

### Intent
Reconcile the live `src/brand/` design system against `brandbook.pdf` (authoritative brand source)
and produce a token-by-token correction list — no tokens edited.

### Step 0 — Session environment + carry-forward (MANDATORY, first step)
Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`; log
output. Read the README `## Carry-forward contract` AND (if any) prior FP outputs. Confirm the
canonical brand homes you will analyze: `src/brand/styles/tokens.css`, `src/brand/styles/theme.css`,
`src/brand/tokens.ts`. REUSE-don't-RECREATE: you are auditing, not authoring tokens.

### Scope — in
- Extract brand values from `brandbook.pdf` (colors/OKLCH+hex, typography families/weights/scale,
  spacing, radius, logo clear-space, motion tone) using the `pdf` skill.
- Run `/impeccable init`, then use impeccable in **`impeccable-brand-audit`** mode: it reads the
  EXISTING `src/brand/` system (committed brand colors → identity-preservation) and audits `src/brand/`
  against the brandbook, producing brand-token *recommendations* (markdown only this sprint; actual
  `src/brand/**` edits happen later in a `change-token` implementation sprint). It does not inspect or
  edit `src/ui`/`src/builder` (that visual inspection is FP-R0's `impeccable-visual-review`).
- Produce a token-by-token reconciliation table: token name → current value → brandbook value →
  verdict (keep / change-to-X / add / retire) → contrast note where relevant.
- **Produce `output/brand-ui-interpretation.md`** instantiating the README *Brand/UI interpretation
  contract* (audit blocker 5): (a) brandbook governs color/spacing/token correction only — NOT a UI
  redesign; (b) preserve current interaction language (hover-light effects, stage/glass islands) and
  define the **allowed glass density variants**; (c) flag every **pure black/white** token offender
  (start: `--theme-surface-void`, `--theme-dropdown-bg` = `#FFFFFF`) for correction; (d) define
  **dark + light** theme token sets and the **main-blue-on-light** rule (no blue on white/light bg);
  (e) record the **v0.1.4 reference** status — since it is absent from the workspace, open a
  `PO decision required` row in `output/decision-register.md` requesting the v0.1.4 source/assets.

### Scope — out
- No edits to any token file or any source file. (Corrections are LISTED, applied later by the
  implementation plan.)
- impeccable must NOT touch `src/ui`, `src/builder`, logic, or services (no `src/components/` exists).
- No new brand identity — brandbook is the source; do not invent a palette. Do **not** redesign the
  app's interaction/glass language — brandbook informs color/spacing only.

### Acceptance criteria
- [ ] (PO-verifiable) `output/FP-R1-brand-reconciliation.md` exists with the token-by-token table.
- [ ] (PO-verifiable) `output/brand-ui-interpretation.md` exists with all five contract rules
      (scope cap, preserved interaction/glass + density variants, no black/white, dark+light themes +
      main-blue-on-light, v0.1.4 status) and opens the v0.1.4 `PO decision required` register row.
- [ ] (code-verifiable) Allowed writes only: `output/*.md`, `output/evidence/**`, README carry-forward,
      `audit/*`, progress log. **No `src/` write** — prove via path list + `src/brand/` (and wider
      `src/`) mtime check.
- [ ] (PO-verifiable) Every brandbook color cites a contrast verdict vs its intended background; the
      main-blue-on-light failure mode is explicitly addressed.
- [ ] (PO-verifiable) Each correction is tagged brand-token-only (no component-level change implied).

### Verification plan
| Criterion | Method | Evidence | Fallback if tool unavailable |
|---|---|---|---|
| output exists + complete | read the file | table present | — |
| no source changed | path list + mtime of `src/brand/*` | no `src/` path newer; only allowed-write paths | — |
| impeccable ran brand-only | quote `/impeccable init` summary in output | summary lines | if impeccable errors: do the audit manually from `tokens.css`+brandbook, mark `impeccable BLOCKED — <reason>` and log it (`core.md §28`) |
| brandbook readable | `pdf` skill page extract | quoted values | if PDF unreadable: log BLOCKED, request a values export from PO |

### Dependencies
- impeccable quarantine lifted (done 2026-06-28). brandbook.pdf present at repo root.
- None on other FP sprints (parallel with R2–R4).

### Files likely affected
- create: `output/FP-R1-brand-reconciliation.md`, `output/brand-ui-interpretation.md`, and
  `output/decision-register.md` (if first to open it — the v0.1.4 row)
- read-only: `brandbook.pdf`, `src/brand/styles/tokens.css`, `src/brand/styles/theme.css`,
  `src/brand/styles/components.css`, `src/brand/tokens.ts`

### Final step — Continuity wiring (MANDATORY, last step)
Append to README `## Carry-forward contract`: the correction list location, any brandbook-vs-token
deltas later sprints must respect, and whether any "add token" recommendations create new canonical
names. Not closeable until this is written.
