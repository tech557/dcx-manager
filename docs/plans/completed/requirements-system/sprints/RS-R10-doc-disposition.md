## RS-R10 — Legacy document disposition
Status: Completed (2026-06-29, OpenCode)

### Requirement Trace

| Field | Value |
|---|---|
| Graph IDs | REQ-GOV-TRACE-001, REQ-GOV-CAL-001, REQ-GOV-SRC-001, REQ-GOV-INV-001, REQ-GOV-TRACE-001-DATA, RS-R0b §8 (Requirement Trace format), RS-R0b §11 (disposition policy) |
| Scope/type | governance — legacy document disposition, no `src/` changes |
| States | governance=approved, maturity=behavior-defined, delivery=not-started |
| Source/lock | RS-R0b-architecture.md §11 (PO-signed 2026-06-29); RS-R5-reconciliation.md (source inventory); RS-R5-itemized-dataset.md (itemized source data) |
| Acceptance outcomes | file-by-file disposition table produced; PO approves every row; legacy files archived under `docs/archive/`; entry points updated to graph; historical/provenance references preserved |
| Responsibilities | Inventory legacy docs, classify each file, generate disposition table for PO review, archive after PO approval, update navigation entry points, generate archive index, leave no legacy file in original location (except `keep`) |
| Expected manifestations | `output/RS-R10-disposition-table.md`, `docs/plans/active/requirements-system/output/RS-R10-disposition-table.md`, `docs/product/requirements/graph/generated/rs-r10-disposition-table.json`, `docs/archive/requirements-disposition-index.md`, archived files under `docs/archive/`, updated AGENTS.md/README.md |
| Evidence | disposition table with PO decisions, ledger entries per action, archive index with graph replacement IDs, completion gate passing post-archive |
| Impact/dependencies | RS-R9 (dogfood + self-trace) ✅ complete. Feeds RS-R11 (frontend-polish reground brief). RS-R0b §11 disposition policy must be re-read before execution. |
| Coverage | not-started |
| Gate result | — (not yet executed) |

**Calibration-mode boundary (REQ-GOV-CAL-001):** This sprint operates in test/calibration mode. The graph is authoritative planning context but not perfectly accurate: RS-R7 still has deferred mapping debt and some graph nodes may carry incomplete or unverified source links. Each disposition row must carry migration confidence and unresolved-debt notes. Do not require perfect code-manifestation mapping before archiving a file. However, per REQ-GOV-SRC-001 and REQ-GOV-INV-001, inferred graph links do not automatically authorize erasing or rewriting source evidence — historical/provenance references must remain immutable.

---

### Intent
Now that the graph is populated, reconciled, and dogfooded (RS-R9 ✅), disposition the legacy
requirement docs — **PO-gated, file-by-file, archive-not-destroy** — so there is one source of truth and no
drifting parallel docs. This sprint has two phases: **Phase A** (pre-approval, generates disposition table for PO review) and **Phase B** (post-approval, executes archive and updates entry points).

---

## Phase A — Pre-approval (create disposition table only)

### Step A1 — Environment
Per README **Global sprint requirements**:
1. Run `bash scripts/agent/build-current-state.sh` and `bash scripts/agent/verify-tooling-state.sh`.
2. Read the **carry-forward contract** in README (every section from RS-R0a through RS-R9).
3. Read `output/RS-R0b-architecture.md` §11 (disposition policy).
4. Read `output/RS-R5-reconciliation.md` (source manifest with deterministic counts).
5. Read the audit at `docs/plans/active/requirements-system/audit/2026-06-29-codex-rs-r10.md` (this sprint's prior audit).
6. Confirm the graph is populated (779+ nodes, 883+ trace links, 53+ ledger entries expected post-RS-R9).
7. **Phase A does not archive or remove any legacy files.** Only the disposition table, generated JSON, archive index proposal, and audit/log artifacts are created.

### Step A2 — Inventory legacy docs on disk
Build a deterministic manifest of every file to be dispositioned. Compare against the RS-R5 inventory
(`output/RS-R5-reconciliation.md`) and the actual filesystem. Expected groups:

| Group | Path | Files | Lines | RS-R5 row count |
|---|---|---|---|---|
| Master CSV | `dcx-requirements-master.csv` (repo root) | 1 | 218 | 217 rows |
| Builder reqs | `docs/product/requirements/builder/*.md` | 10 | 704 | 10 docs |
| Decisions | `docs/product/decisions/*.md` | 2 | 182 | 2 docs |
| Open questions | `docs/product/open-questions/*.md` | 1 | 212 | 1 doc |
| Follow-ups | `docs/product/follow-ups/*.md` | 1 | 20 | 1 doc |
| Component source policy | `docs/product/component-source-policy.md` | 1 | 97 | 1 doc |

**Note:** `dcx-requirements-master.csv` is a stray at the repo root — it should move under `docs/archive/`
so the root stays clean.

### Step A3 — Classify each file
For each inventoried file, determine:

| Label | Meaning |
|---|---|
| **superseded → graph** | All content is fully migrated into graph nodes. File can be archived. |
| **superseded → archive** | Content is historical interest only. No migration needed. Archive as-is. |
| **keep** | File should stay in place (e.g., architecture docs that aren't requirements). |
| **merge** | Some content is graph-migrated; some is not. Partial archive. |
| **remove → archive** | No remaining value as live doc. Archive to `docs/archive/`. |

**Decision rules** (from RS-R0b §11):
- Nothing is destroyed (only archived).
- A file is superseded when its content exists in the graph as requirement nodes + trace links.
- A file is kept if it describes structure/rationale/architecture (not requirements).
- The PO approves every row before any move/archive.
- Archive destination preserves original relative path under `docs/archive/<original-path>`.

**Expected classifications (best guess, executor must verify each):**

| File | Expected label | Reason | Confidence |
|---|---|---|---|
| `dcx-requirements-master.csv` | superseded → archive | All 217 rows seeded by RS-R6 into graph nodes | high — all rows mapped in RS-R6 |
| `docs/product/requirements/builder/builder-overview.md` | superseded → archive | Overview content is now in graph structure + views | high |
| `docs/product/requirements/builder/acceptance-criteria.md` | superseded → archive | ACs seeded into graph as AcceptanceOutcome nodes | high |
| `docs/product/requirements/builder/cards.md` | superseded → archive | Card requirements seeded as REQ nodes + BHV/RSP chain | high |
| `docs/product/requirements/builder/drag-and-drop.md` | superseded → archive | DND requirements seeded | high |
| `docs/product/requirements/builder/islands.md` | superseded → archive | Island requirements seeded | high |
| `docs/product/requirements/builder/kanban.md` | superseded → archive | Kanban requirements seeded | high |
| `docs/product/requirements/builder/readiness.md` | superseded → archive | Readiness requirements seeded | high |
| `docs/product/requirements/builder/stage.md` | superseded → archive | Stage requirements seeded | high |
| `docs/product/requirements/builder/timeline.md` | superseded → archive | Timeline requirements seeded | high |
| `docs/product/requirements/builder/README.md` | superseded → archive | Redundant — graph is now the source of truth | high |
| `docs/product/decisions/builder-decisions.md` | superseded → archive | 16 decisions seeded into the ledger by RS-R6 | high |
| `docs/product/decisions/src-structure-decision.md` | keep | Architecture design rationale, not requirements | high |
| `docs/product/open-questions/builder-open-decisions.md` | superseded → archive | Open questions seeded as QST nodes by RS-R6 | high |
| `docs/product/follow-ups/builder-follow-ups.md` | superseded → archive | Follow-ups ingested by RS-R5 and tracked in queues | high |
| `docs/product/component-source-policy.md` | keep | Component sourcing policy, not requirements | high |

### Step A4 — Generate disposition table
Create `output/RS-R10-disposition-table.md` with the following columns. Each row includes enough evidence
for the PO to make a decision without reopening source files:

| # | Source path | Lines | Action | Reason | Graph replacement IDs | Graph replacement count | Ledger refs | Migration confidence | Unresolved debt/questions | Proposed archive destination | PO decision | PO notes |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | `dcx-requirements-master.csv` | 218 | archive | 217 rows seeded by RS-R6 | REQ-… (from RS-R6 seed) | ~217 node IDs | LDG-2026-06-29-RS-R6 | high — all rows mapped | Verify 0 orphan rows | `docs/archive/dcx-requirements-master.csv` | | |

Fill the table with actual data from RS-R6 seed output and RS-R5 itemized dataset. The graph replacement
IDs should be listed (full list or representative range + count). No file is moved in this phase.

Also create `docs/product/requirements/graph/generated/rs-r10-disposition-table.json` for agent consumption
with the same data plus confidence, debt notes, and proposed archive path.

### Step A5 — Generate archive index proposal
Per RS-R0b §11: archived files must move with an index that points to the graph replacement.
Create `docs/archive/requirements-disposition-index.md` with columns:

| Source path | Archive path | Action | Graph replacement IDs | Ledger IDs | PO decision |
|---|---|---|---|---|---|
| `dcx-requirements-master.csv` | `docs/archive/dcx-requirements-master.csv` | archive | REQ-… | LDG-… | |

This file is a proposal in Phase A. It is finalized in Phase B after PO decisions are recorded.

### Step A6 — Phase A gates (pre-approval)
1. Confirm no legacy file has been moved or removed (only generated table + json + index).
2. Run `npm run req:validate` — graph must remain valid (no nodes touched).
3. Run `npm run req:completion-gate -- --changed output/RS-R10-disposition-table.md,docs/product/requirements/graph/generated/rs-r10-disposition-table.json,docs/archive/requirements-disposition-index.md` — the completion gate should see new generated files and report any unexpected issues.
4. Run `npm run typecheck`, `npm run lint`, `bash scripts/verify.sh` (non-doc gates).

**Phase A deliverable summary:** `output/RS-R10-disposition-table.md` (PO-facing), `docs/product/requirements/graph/generated/rs-r10-disposition-table.json` (agent-facing), `docs/archive/requirements-disposition-index.md` (proposal), and this build log. Present to PO for row-by-row approval. **Do not proceed to Phase B without full PO sign-off.**

---

## Phase B — Post-approval (execute archive + update)

### Step B1 — PO approval gate
Submit the final disposition table (from Phase A) to the PO for sign-off. **No file is moved or archived
until every row is approved.** The PO can override any classification (e.g., decide to keep a builder doc
as a readable overview alongside the graph). Record overrides as row-level changes in the disposition
table and archive index.

**Ledger entry:** Record each PO-approved row as `LDG-2026-06-29-RS-R10-DISP-<action>-<slug>`.

### Step B2 — Execute archive
For each row with action `archive` or `remove → archive`:
1. Copy the file to `docs/archive/<original-path>` preserving directory structure.
2. Write a ledger entry: `LDG-2026-06-29-RS-R10-ARCHIVE-<slug>` with reason and graph replacement IDs.
3. Remove the file from its original location (not deleted — the archive copy is the authoritative copy).
4. For `dcx-requirements-master.csv` specifically: move to `docs/archive/dcx-requirements-master.csv` and update any references in the plan README carry-forward and AGENTS.md.

### Step B3 — Update navigation entry points only
After archiving, update only these **live navigation/entry-point docs**:

**Allowed paths (update):**
- `AGENTS.md` — "Where things live" table:
  - `Product requirements` → `docs/product/requirements/graph/` (graph is now the source of truth)
  - `Confirmed decisions` → `docs/product/requirements/graph/ledger/decision-ledger.jsonl`
  - `Open decisions` → `docs/product/requirements/graph/nodes/open-question/`
  - Add a row: `Legacy docs (archived)` → `docs/archive/`
- `docs/README.md` — if it links to legacy requirement paths, update to point to the graph.
- `docs/references/README.md` — if it links to legacy paths, update to point to the graph.
- Active plan README (`docs/plans/active/requirements-system/README.md`) — carry-forward contract:
  -  "Canonical homes" table:
    - Master requirements: `archived to docs/archive/ ✅` (graph is source)
    - Readable builder reqs: `archived to docs/archive/ ✅`
    - Confirmed decisions: `archived to docs/archive/; ledger is the source ✅`
    - Open decisions: `archived to docs/archive/ ✅`
    - Follow-ups: `archived to docs/archive/ ✅`

**Forbidden paths (DO NOT update — historical/provenance records must remain stable):**
- `docs/progress/**` — historical session logs
- `docs/plans/**/audit/**` — plan audits
- `docs/plans/active/requirements-system/output/**` — sprint output artifacts
- `docs/plans/active/requirements-system/output-review/**` — output reviews
- `docs/plans/on-hold/frontend-polish-v0.3.5/output/**` — FP output
- `docs/plans/on-hold/frontend-polish-v0.3.5/output-review/**` — FP reviews
- `docs/plans/on-hold/frontend-polish-v0.3.5/audit/**` — FP audits
- Graph provenance `source_path` fields — do not rewrite graph node/metadata source paths

**Report-only list (flag for PO awareness but do not rewrite):**
Any remaining references to legacy paths in non-entry-point docs. The executor must grep for
`builder-decisions.md`, `builder-open-decisions.md`, `builder-follow-ups.md`,
`dcx-requirements-master.csv` across the repo, produce a summary of all locations, and classify each as
either "live" (update) or "historical/provenance" (report only). Append the report to the build notes.

### Step B4 — Finalize archive index
Update `docs/archive/requirements-disposition-index.md` with final PO decisions: fill the
`PO decision` column for every row. Remove the "proposal" label.

### Step B5 — Verify (Phase B)
1. Confirm every archived file exists under `docs/archive/<original-path>`.
2. Confirm no legacy file remains in its original location (except files labelled `keep`).
3. Confirm no forbidden path was modified (run `git diff` / `rg` check against forbidden path patterns).
4. Run `npm run req:validate` — graph must remain valid (no nodes deleted by this sprint).
5. Run `npm run req:completion-gate -- --changed docs/archive/**,AGENTS.md,docs/README.md,docs/references/README.md,docs/plans/active/requirements-system/README.md,docs/archive/requirements-disposition-index.md` — archival does not break traces.
6. Run `npm run typecheck`, `npm run lint`, `bash scripts/verify.sh`.
7. Confirm no `src/` files were changed (`git diff --name-only | grep '^src/'` must be empty).

### Scope — in
- File-by-file disposition table for every legacy requirement doc: `dcx-requirements-master.csv`,
  `docs/product/requirements/builder/*.md`, `docs/product/decisions/*.md`,
  `docs/product/open-questions/*.md`, `docs/product/follow-ups/*.md`,
  `docs/product/component-source-policy.md`.
- Phase A: disposition table + generated JSON + archive index proposal + audit/log artifacts (no archiving).
- Phase B: move to `docs/archive/` after PO approval only; preserve directory structure.
- Update AGENTS.md, docs/README.md, docs/references/README.md, active plan README entry points.
- Ledger entries for every archived file.
- Archive index at `docs/archive/requirements-disposition-index.md` with graph replacement links.
- Cross-reference report (report-only — no rewrites of historical/provenance docs).

### Scope — out
- No frontend-polish redo or reactivation (RS-R11 + PO).
- No schema changes (frozen after RS-R4/R8).
- No graph node changes — this sprint archives source docs, not graph nodes.
- Do not touch `docs/archive/` contents (except adding new archived files).
- Do not archive anything before PO approval of the disposition table.
- Do not delete any file — only archive (copy + remove original) or keep.
- Do not rewrite `docs/progress/**`, `docs/plans/**/audit/**`, `output/**`, `output-review/**`, graph provenance `source_path` fields.
- No `src/` file changes.

### Acceptance criteria
- [ ] (PO-verifiable) Phase A: File-by-file disposition table present at `output/RS-R10-disposition-table.md` and
      `docs/product/requirements/graph/generated/rs-r10-disposition-table.json`.
- [ ] (PO-verifiable) Phase A: Archive index proposal at `docs/archive/requirements-disposition-index.md`.
- [ ] (PO-verifiable) **PO has approved every row** before any file is moved (Phase B gate).
- [ ] (PO-verifiable) Removed docs archived under `docs/archive/<original-path>` (not destroyed).
- [ ] (PO-verifiable) Each archived file has a ledger entry with reason + graph replacement IDs.
- [ ] (PO-verifiable) `AGENTS.md` "Where things live" table now names the graph as the source of truth.
- [ ] (PO-verifiable) The `dcx-requirements-master.csv` stray at the repo root is gone (moved to archive).
- [ ] (PO-verifiable) `docs/archive/requirements-disposition-index.md` is finalized with PO decisions.
- [ ] No live entry-point cross-references to legacy paths remain outside `docs/archive/` and the graph.
- [ ] No historical/provenance paths were rewritten (forbidden paths intact).
- [ ] Cross-reference report appended to build notes, classifying each reference as live vs historical.
- [ ] No `src/` files changed.
- [ ] Gates: `npm run typecheck` · `npm run lint` · `npm run validate:architecture` · `npm run test` ·
      `bash scripts/verify.sh` · `npm run req:validate` · `npm run req:completion-gate -- --changed <live-changed-files>`.
      §28 fallbacks if any gate is unavailable.

### Dependencies
- RS-R9 (dogfood + self-trace) ✅ complete. The graph is populated, reconciled, and verified.
- RS-R0b architecture §11 disposition policy (read before executing).
- Codex audit `docs/plans/active/requirements-system/audit/2026-06-29-codex-rs-r10.md`.
- Feeds RS-R11 (frontend-polish reground brief).

### Executor
Claude. PO approves every disposition row before any move. No product `src/` changes. Historical/provenance references are report-only, never rewritten.

### Final step
Carry-forward to README:
- Which files were kept, which were archived, which were moved.
- The canonical entry point path — now `docs/product/requirements/graph/` for requirements.
- Archive locations under `docs/archive/` with the path mapping.
- Any PO overrides from the default classifications above.
- Cross-reference report summary (live updates applied, historical references left intact).
- Update the README sprint index: RS-R10 ✅ done.
- Remove the ⛔ PO gate note from the README status line (or change to `RS-R10 ♻️ archived`).
