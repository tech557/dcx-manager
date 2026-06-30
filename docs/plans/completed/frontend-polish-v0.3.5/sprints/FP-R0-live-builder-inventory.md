## FP-R0 — Live-builder interaction inventory (browser-backed)
Status: ✅ COMPLETED 2026-06-28 — HISTORICAL, NOT EXECUTABLE in this activation. Output `output/FP-R0-live-builder-inventory.md` is read-only prior art consumed by FP-R4/R5. Do not re-run. (Active set = FP-R4 → FP-R5 only.)

### Intent
Capture the real, running state of every builder island and core card flow — current vs required —
so FP-R5 drafts implementation work from observed gaps, not from docs and grep alone. No source changed.

### Step 0 — Session environment + carry-forward (MANDATORY, first step)
Run `bash scripts/agent/build-current-state.sh` + `bash scripts/agent/verify-tooling-state.sh`; log
output. Read README `## Carry-forward contract` (island list + mock homes) AND any prior FP outputs.
Confirm Playwright MCP availability; if unavailable, plan the dev-smoke fallback (`core.md §28`).

### Scope — in
- Start the dev server (`npm run dev`) and drive the builder with Playwright MCP (preferred) to
  inventory **each island** in the carry-forward list and **each core card flow** (phase/action/task
  create, drag/drop, long-press → editor, readiness display).
- For each island/flow record: current behavior, required behavior, and the **gap class** —
  `change-token`, `change-component`, `wire-mockup-data`, or `PO decision` (→ decision register).
- Explicitly cover (PO-required coverage): task **drag/drop completeness** (known-incomplete),
  **editor island inputs**, **text styles/types**, **width/height/radius/font-size token drift**,
  **island open/close** behavior, **popups**, **confirmations**, **required/empty/error states**, and
  **reduced-motion** (`core.md §20`) for every interactive animation.
- Use `impeccable` in **`impeccable-visual-review`** mode (Claude-only): inspect the **running UI**
  (screenshots / dev server) to judge look/feel gaps and write **markdown findings + screenshots
  only** — **zero** source edits (no `src/brand`, no component/token changes). Capture screenshots as
  evidence into `output/evidence/` (`core.md §29a`). Brand-token edits are FP-R1's `impeccable-brand-audit`.

### Scope — out
- No source changes. No fixes applied — this is an inventory. No token/component/data edits.
- No builder three-row layout change proposed (`core.md §10`). `impeccable-visual-review` inspects
  only — it does not edit `src/brand/`, components, or tokens in this sprint (that is FP-R1).

### Acceptance criteria
- [ ] (browser-verifiable) `output/FP-R0-live-builder-inventory.md` covers every island in the
      carry-forward list + the core card flows, each with current-vs-required state.
- [ ] (browser-verifiable) Screenshot (or dev-smoke note) evidence per island/flow in `output/evidence/`.
- [ ] (PO-verifiable) Every gap is classified into one of the three families or `PO decision` and, if
      `PO decision`, written to `output/decision-register.md` (created if absent).
- [ ] (PO-verifiable) PO-required coverage list above is fully addressed (drag/drop, editor inputs,
      text styles, w/h/radius/font-size tokens, island states, popups, confirmations, reduced-motion).
- [ ] (code-verifiable) Allowed writes only: `output/*.md`, `output/evidence/**`, README carry-forward,
      `audit/*`, progress log. **No `src/` write** (path list + `src/` mtime check).

### Verification plan
| Criterion | Method | Evidence | Fallback if tool unavailable |
|---|---|---|---|
| islands/flows covered | Playwright MCP drive + snapshot | per-island sections + screenshots | Playwright MCP down → `npm run dev` dev-smoke (HTTP 200 + console), describe state from DOM/source; mark browser gate `BLOCKED — Playwright MCP unavailable`, log it (`core.md §28`) |
| reduced-motion checked | toggle `prefers-reduced-motion`, observe | note per animation | inspect effects.registry usage in source, labelled fallback |
| gap classification | map each gap → family | class column | — |
| no source changed | path list + `src/` mtime | only allowed-write paths newer | — |

### Dependencies
- Parallel with FP-R1–R4. FP-R5 consumes this (the inventory is the backbone of the 3-family matrix).
- Needs a runnable dev server; brand corrections (FP-R1) are cited if available but not required.

### Files likely affected
- create: `output/FP-R0-live-builder-inventory.md`, `output/evidence/*` (screenshots), and
  `output/decision-register.md` (if first to open it)
- read-only: `src/builder/**`, `src/mock/**`, `src/brand/**`
- **`impeccable` init exception:** if `PRODUCT.md` does not exist at repo root, the `impeccable`
  skill requires it before `impeccable-visual-review` can run. Creating `PRODUCT.md` at repo root
  is therefore an allowed write for this sprint — it is a design-context file, not a product source
  file. It must not be deleted. If `PRODUCT.md` already exists, skip this write.

### Final step — Continuity wiring (MANDATORY, last step)
Append to README `## Carry-forward contract`: count of gaps per family, count of `PO decision` items
opened in the decision register, and the evidence location — so FP-R5 inherits the live picture.
