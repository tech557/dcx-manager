## FP-R4 — Builder / version / homepage finalize-behavior spec (GRAPH-GROUNDED REDESIGN)
Status: Completed — executed 2026-06-30 (Codex) after PO activation. Rewrote `output/FP-R4-finalize-spec.md` from legacy-ID prior art into graph-grounded final sprint input.

### Requirement Trace (mandatory — `core.md §35a`)
| Field | Value |
|---|---|
| Graph IDs | the canonical `REQ-` families in RS-R11 brief §2 (EVI, SBC, RDY, STG, KBI, DZ, FCS, IFX, KEY, VHB, UP, VR) + `REQ-SBT-COPY-001`, `REQ-LOAD-SKEL-001` |
| Scope/type | frontend / agent-workflow — discovery (finalize spec), no code |
| Source/lock | `completed/requirements-system/output/RS-R11-reground-brief.md`; graph store; PO direction 2026-06-30 |
| Acceptance outcome | A finalize spec where every criterion cites a graph REQ ID + its coverage/verification state, covers all 3 surfaces, and feeds FP-R5's matrix |
| Evidence | per-criterion graph `req:query`/`req:trace` reads; live-UI confirmation; `output/FP-R4-finalize-spec.md` (rewritten) |

### Intent
Define "finalized" for the three surfaces — **builder, version page, homepage** — grounded in the
**graph** (not the legacy `builder/*.md` docs or `BLD-*`/`OD-*` IDs). The legacy FP-R4 output is prior
art only; this redesign re-grounds every criterion on canonical graph REQ IDs and on the graph's
expected-vs-actual coverage + verification states (RS-R11 brief §4). No code.

### Step 0 — Session environment + carry-forward (MANDATORY, first step)
Run `build-current-state.sh` + `verify-tooling-state.sh`; log output. Read: this README carry-forward +
the **Executor assignment discipline** + **brand/UI interpretation contract**; **`completed/requirements-system/output/RS-R11-reground-brief.md`** (the re-grounding source); FP-R0/R1/R2/R3 outputs +
`output/core-interaction-model.md` (still valid). Use the graph as the requirements source of truth
(`req:query`/`req:trace`/`req:justify`), NOT `docs/product/requirements/builder/*` (archived by RS-R10).

### Scope — in
1. **Re-ground every builder finalize criterion on graph IDs.** Rebuild the per-area checklist
   (Editor, Cards, Readiness, Kanban, Timeline, Drag/drop, Selection, Focus, Theme, Reduced-motion,
   Tokens) using the **RS-R11 §2 old-area → graph-ID map**. Each criterion row carries: `id` (criterion),
   statement, **canonical graph REQ ID(s)**, verification type (code/test/browser/visual/PO), and family
   tag (`change-token`/`change-component`/`wire-mockup-data`). Legacy `BLD-*`/`OD-*` may appear only as a
   parenthetical provenance alias, never as the cited source.
2. **Per-criterion coverage row (RS-R11 §4 method).** For each requirement, record from the graph: its
   **delivery state** (expect `not-assessed`), **verification state**, the **expected manifestation
   categories** (`EMC-*`), and the **RS-R7 candidate `implements` links** to confirm/correct. Treat all
   provisional links as **review input, not proof** (RS-R11 §1). Output a coverage-gap table per area.
3. **Homepage + Version page — NOW UNBLOCKED (D-07 resolved).** The v0.1.4 reference exists at
   `docs/archive/dcx-manager-v0.1.4/src/pages/{home,version}/`. Finalize both specs against it: define
   purpose, sections, states, entry points; cite graph IDs (`REQ-VR-*` version-room/load, `REQ-UP-*` UI
   prefs/restore, `REQ-LOAD-SKEL-001` skeletons). Respect the `core.md §13` placeholder-route boundary —
   no builder-internal imports. Apply the brand/UI contract (themes, no pure black/white, main-blue-on-light).
4. **Two new requirements in scope from the start:**
   - `REQ-SBT-COPY-001` (subtask copy & paste) — add criteria under Cards/keyboard; distinct from the
     card-level `REQ-SBC-DUP-001`/`REQ-KEY-002/003`.
   - `REQ-LOAD-SKEL-001` (app-wide skeleton loading) — add criteria across **all** surfaces (builder
     shell/stage/cards, homepage, version page, modals, lists, editor) with reduced-motion respect (§20).
5. **Decision register:** carry the resolved D-01…D-12 (FP-R5 closed them; RS-R9 recorded them as
   `REQ-FP-D01..D12`). Any NEW `❓` opened here gets a register row with status; no bare ❓ counts.
6. **Family tag every gap** so FP-R5's matrix consumes it directly.

### Scope — out
- No code, no token edits, no component changes, **no graph schema change**. Spec only.
- No legacy `BLD-*`/`OD-*` ID cited as a source of truth (provenance alias only).
- No inferred/provisional graph link treated as proof of implementation (RS-R11 §1).
- No builder-internal imports proposed for home/version (`core.md §13`).
- No feature invented without a graph REQ ID (`core.md §14`) — open a `❓` register row instead.

### Acceptance criteria
- [ ] (PO-verifiable) `output/FP-R4-finalize-spec.md` (rewritten) has a per-surface checklist where
      **every criterion cites a canonical graph REQ ID** (no `BLD-*`/`OD-*` as source).
- [ ] (PO-verifiable) Each area has a **coverage-gap table** (delivery + verification state + expected
      `EMC-*` categories + RS-R7 candidate links to confirm), per RS-R11 §4.
- [ ] (PO-verifiable) **Homepage AND version** finalize specs are complete (not blocked), grounded in
      `docs/archive/dcx-manager-v0.1.4/src/pages/*` and graph IDs; both confirm no builder-internal import.
- [ ] (PO-verifiable) `REQ-SBT-COPY-001` and `REQ-LOAD-SKEL-001` each have criteria (skeleton spans all surfaces).
- [ ] (PO-verifiable) Every finalize gap carries a `change-token`/`change-component`/`wire-mockup-data` tag.
- [ ] (PO-verifiable) Provisional graph links are labeled review-input-not-proof wherever cited.
- [ ] (code-verifiable) Allowed writes only: `output/*.md`, `output/evidence/**`, README carry-forward,
      `audit/*`, progress log. **No `src/` write** (path list + `src/` mtime check).

### Verification plan
| Criterion | Method | Evidence | Fallback |
|---|---|---|---|
| graph-ID grounded | `req:query --by-id` per cited REQ | REQ IDs resolve; coverage state cited | — |
| coverage map real | read graph delivery/verification + `EMC-*` | per-area coverage table | — |
| home/version grounded | read v0.1.4 pages + graph | spec sections cite v0.1.4 + REQ IDs | — |
| live-state confirmation (where a criterion claims current behavior) | Playwright/Preview on `npm run dev` | screenshot/console in `output/evidence/` | dev-smoke HTTP 200 + console (§28), labeled |
| no source changed | path list + `src/` mtime | only allowed-write paths newer | — |

### Executor (per assignment discipline)
**Required skill:** graph tooling (`req:*`) + `dcx-code-query`. **Required tool:** Playwright/Preview MCP
(criteria #2/#3 confirm live current-state). **Eligible:** **Claude or opencode** (browser-capable).
**Not Codex-only** — it lacks Playwright; if Codex drafts the spec, the live-state confirmation criteria
hand off to a browser-capable agent who writes their own log (`§29a`). Discovery-strict → run the Sprint
Doctor self-check before audit (`§36a`).

### Dependencies
RS-R11 brief (done). Parallel-safe with FP-R0/R1/R2/R3 (already complete). FP-R5 consumes this.

### Final step — Continuity wiring (MANDATORY, last step)
Append to README carry-forward: the rewritten finalize-spec location; per-area coverage-gap summary;
per-family gap counts (incl. the 2 new reqs + home/version); any new `❓` register rows; the list of
RS-R7 candidate links flagged for confirmation during implementation. A sprint is not closeable until
this is written (`core.md §27`).
