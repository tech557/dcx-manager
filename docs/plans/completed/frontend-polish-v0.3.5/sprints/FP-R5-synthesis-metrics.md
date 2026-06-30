## FP-R5 — Synthesis → graph-grounded three-family matrix + drafted implementation sprints + metrics (GRAPH-GROUNDED REDESIGN)
Status: Completed — executed 2026-06-30 (Codex). Rewrote `output/FP-R5-synthesis.md` and `output/metrics-baseline.md` after FP-R4 validation.

### Requirement Trace (mandatory — `core.md §35a`)
| Field | Value |
|---|---|
| Graph IDs | all FP REQ families (RS-R11 §2) + `REQ-SBT-COPY-001`, `REQ-LOAD-SKEL-001`; governance `REQ-GOV-TRACE-001-FRONTEND/-AGENT` |
| Scope/type | frontend / agent-workflow — synthesis + drafted implementation plan, no code |
| Source/lock | FP-R4 (graph-grounded) + FP-R0/R1/R2/R3 + RS-R11 brief; PO direction 2026-06-30 |
| Acceptance outcome | A three-family matrix + drafted implementation sprints, each citing graph IDs, carrying a Requirement Trace, and assigned by skill/tool access |
| Evidence | `output/FP-R5-synthesis.md` (rewritten), `output/metrics-baseline.md`, graph coverage reads |

### Intent
Combine FP-R0…R4 (with FP-R4 now graph-grounded) into a prioritized, drafted implementation plan and a
metrics baseline — no source changed. Every drafted sprint cites **graph REQ IDs**, carries the mandatory
**Requirement Trace**, and is **assigned by the Executor Assignment Discipline** (skill + tool access).
Provisional graph links are review input, not proof (RS-R11 §1).

### Step 0 — Session environment + carry-forward (MANDATORY, first step)
Run `build-current-state.sh` + `verify-tooling-state.sh`; log output. Read: README carry-forward + the
**Executor assignment discipline** + brand/UI contract; the **rewritten** `output/FP-R4-finalize-spec.md`;
FP-R0/R1/R2/R3 + `output/metrics-baseline.md` (prior) + RS-R11 brief. Synthesize and cite — do not re-derive.

### Scope — in
1. **Rebuild the three-family agent/task matrix on graph IDs.** Every finalize gap from the rewritten
   FP-R4 maps to exactly one family; the matrix carries each gap's **graph REQ ID** and its coverage
   state:

   | Family | Required skill / tool | Eligible executor | Source data | Touches | Never |
   |---|---|---|---|---|---|
   | `change-token` | `impeccable` (brand-only) + Playwright/Preview | **Claude** (only impeccable holder)¹ | FP-R1 corrections, FP-R2 metrics, brand REQ/token contract | `src/brand/**` | components, logic, services |
   | `change-component` | `dcx-frontend-refactor` (+Playwright if browser/visual) | Claude / opencode (Codex non-browser only) | FP-R3 splits, FP-R4 markup gaps | `src/ui/**`, `src/builder/**` structure/markup | brand identity, features |
   | `wire-mockup-data` | any (+Playwright for behavior proof) | Claude / opencode (Codex via §29a handoff) | FP-R0 behavior gaps, graph behavior reqs, `src/mock/*.mock.ts` | builder behavior + data wiring | visual redesign, features |

   ¹ Subject to **G-IMPECCABLE** gate (README Open gates). If un-quarantine is not confirmed,
   `change-token` runs without impeccable (Claude applies `brand-ui-interpretation.md` directly).
2. **Draft prioritized implementation sprints**, each naming: family, **graph REQ ID(s)**, a
   **Requirement Trace**, executor + required skill + required tool access (per discipline), scope in/out,
   acceptance criteria expressed as graph state transitions (**confirm/correct RS-R7 candidate links →
   coverage of expected `EMC-*` categories → `delivery: implemented` → bind evidence → `verified`**;
   `implemented ≠ verified`, RS-R8), verification + gates, and the REUSE-don't-RECREATE home.
   **Every drafted implementation sprint MUST also include these two blocks** (audit 2026-06-30 B2/B3):
   - **PO Web Check** (so the PO can verify it in the running app without inferring): target **route(s)**,
     **viewport(s)**, **seed/mock data** (`src/mock/*`), the **click/keyboard steps**, the **expected
     visible result**, the **screenshot/video evidence path** (`output/evidence/**`), explicit
     **non-goals**, and a "PO should check…" line. At least **one** implementation sprint must be scoped
     small enough that the PO can verify it independently end-to-end.
   - **Requirement Debt Burn-down**: the touched `REQ/EMC/MAN/TRC` IDs; RS-R7 candidate links to
     **confirm/correct/reject**; unlinked manifestations to **link or exempt**; **before/after queue
     counts** for the touched area; and the `req:completion-gate -- --changed <files>` + `req:validate`
     evidence. A sprint may not close while it leaves its touched-area debt unaccounted.
2a. **Implementation Coverage Ledger (mandatory output — audit 2026-06-30 B4).** A one-to-one table:
    **every FP-R4 criterion** (all 3 surfaces) + `REQ-SBT-COPY-001` + `REQ-LOAD-SKEL-001` →
    `implementation sprint` → `files likely touched` → `graph IDs` → `PO Web Check` → `graph gate`.
    Anything not assigned to a sprint must be explicitly marked **`backend-deferred`** with the **named
    backend dependency** and the **frontend placeholder/check remaining now** — no generic "later backend
    sprint" bucket. The ledger proves "all frontend accounted for," not just "every gap has a family."
3. **Carry the two new requirements into the sprint set:** `REQ-SBT-COPY-001` (subtask copy/paste) and
   `REQ-LOAD-SKEL-001` (app-wide skeleton — its own sprint spanning builder + homepage + version, since
   it is cross-surface).
4. **Homepage/version implementation sprints are now draftable** (D-07 resolved) — grounded in the
   rewritten FP-R4 §home/version + v0.1.4 reference + graph IDs; `core.md §13` boundary preserved.
5. **Per-sprint completion-gate hook:** each drafted sprint's gates include `req:completion-gate --changed`
   + `req:validate` (`core.md §35c`), and the opportunistic calibration-debt cleanup convention
   (RS-R11.2) applies when it touches manifestations.
6. **Metrics baseline** (`output/metrics-baseline.md`): hardcoded-literal count, dead-token count,
   over-cap-file count, contrast failures, per-family gap counts, **per-surface coverage** (reqs at
   not-assessed/implemented/verified), open-`❓` count — each with source + date, so movement is measurable.
7. Recommend the implementation plan name/folder + execution order (token-first; WM theme-toggle first).

### Scope — out
- No source code changes; no new `active`/`drafted` plan folder created unless PO directs (output the
  contents ready to place). No graph schema change.
- No family collapsing; no routing a non-impeccable family to a Claude+impeccable sprint or vice-versa.
- No sprint drafted on a provisional link as if it were proof, and none for an unresolved `❓`.
- No legacy `BLD-*`/`OD-*` ID as a source of truth.

### Acceptance criteria
- [ ] (PO-verifiable) `output/FP-R5-synthesis.md` (rewritten) has the three-family matrix; **every gap
      cites a graph REQ ID** and maps to exactly one family.
- [ ] (PO-verifiable) Each drafted sprint carries a **Requirement Trace** + names executor, **required
      skill + required tool access**, scope, acceptance as graph-state transitions, and gates.
- [ ] (PO-verifiable) The **assignment discipline** is honored: no browser/visual sprint assigned to a
      Codex-only run; impeccable only on Claude `change-token` (and only if G-IMPECCABLE is cleared).
- [ ] (PO-verifiable) `REQ-SBT-COPY-001` + `REQ-LOAD-SKEL-001` each have a drafted sprint; homepage/version
      sprints are drafted (D-07 resolved).
- [ ] (PO-verifiable, B2) **Every** drafted implementation sprint has a **PO Web Check** block (route,
      viewport, seed data, steps, expected visible result, evidence path, non-goals); at least one slice is
      independently PO-verifiable end-to-end.
- [ ] (PO-verifiable, B3) **Every** drafted implementation sprint has a **Requirement Debt Burn-down**
      (touched REQ/EMC/MAN/TRC, candidate-link actions, before/after queue counts, `req:completion-gate` +
      `req:validate` evidence).
- [ ] (PO-verifiable, B4) The **Implementation Coverage Ledger** maps every FP-R4 criterion + all 3
      surfaces + the 2 new reqs to a sprint or an explicit `backend-deferred` (named dependency); no generic
      backend bucket.
- [ ] (PO-verifiable) `output/metrics-baseline.md` has numeric baselines incl. per-surface coverage, with source + date.
- [ ] (PO-verifiable) Execution order + proposed implementation-plan name/folder stated; FP-R5 does not self-promote.
- [ ] (code-verifiable) Allowed writes only: `output/*.md`, `output/evidence/**`, README carry-forward,
      `audit/*`, progress log. **No `src/` write** (path list + `src/` mtime check).

### Verification plan
| Criterion | Method | Evidence | Fallback |
|---|---|---|---|
| matrix graph-grounded | cross-ref FP-R4 graph IDs | every gap has a REQ ID + family | — |
| sprints carry trace + assignment | read each drafted sprint | trace + skill/tool + executor present | — |
| discipline honored | check each sprint's executor vs capability matrix | no browser sprint on Codex-only; impeccable Claude-only | — |
| acceptance = graph transitions | read acceptance blocks | confirm-link→implemented→verified phrasing | — |
| metrics are numbers | read baseline | counts incl. coverage, not adjectives | — |
| no source changed | path list + `src/` mtime | only allowed-write paths newer | — |

### Executor (per assignment discipline)
**Required skill:** `dcx-sprint-planner` (drafts sprints w/ Requirement Trace) + graph tooling.
**Required tool:** none beyond graph (synthesis is doc-only; it *plans* browser work, doesn't run it).
**Eligible:** **Claude** (strongest for this integrative, templated, "every-gap" output — `§36d`) or a
strong agent behind a green Sprint Doctor. Codex eligible (no browser needed for synthesis itself).

### Dependencies
BLOCKED until the rewritten FP-R4 + FP-R0/R1/R2/R3 outputs all exist. (FP-R0/R1/R2/R3 are complete; FP-R4
is the only upstream that re-executes.)

### Final step — Continuity wiring (MANDATORY, last step) + plan close
Append final carry-forward (matrix location, per-family + per-surface counts, drafted sprint list with
their graph IDs + assignments, metrics baseline). Then per `dcx-sprint-close` plan-level: recommend the
PO move this discovery plan to `completed/` and place the implementation contents into a new `drafted/`
implementation plan (`dcx-plan-audit` it before activation). FP-R5 does not self-promote.
