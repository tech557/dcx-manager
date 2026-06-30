## RS-R7 persist audit + manifestation foldering + folder-index generator
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: mixed
Status: Completed
PO-Action: pending

Intent: Audit RS-R7 persist pass; sub-fold the manifestation node folder by kind; add generated per-folder summary tables.
Trigger: PO request — "R7 is now done can audit, and categorize the manifest folder too? ... will there be a task ... summarized tables for nodes folders especially huge ones?".
Requirements covered: RS-R7 output audit (core.md §30); graph accessibility (foldering + folder-index).

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/plans/active/requirements-system/output-review/RS-R7-persist-review.md | persist pass ACCEPT; PO gate still open; mis-kind finding | 50 |
| edited | scripts/requirements/store.ts | manifestations sub-fold by kind (nodes/manifestation/<kind>/) | 100 |
| moved | nodes/manifestation/*.json → nodes/manifestation/<kind>/ | 397 files by kind (react-component 259, function 73, hook 32, service 21, type 9, store-action 2, test 1) | — |
| created | scripts/requirements/folder-index.ts + npm req:folder-index | generates README.md summary table per node folder (+ subfolder roll-ups) | 80 |
| edited | package.json | + req:folder-index script | — |
| created | docs/product/requirements/graph/nodes/**/README.md | generated folder indexes (700 nodes) | — |

### Audit verdict (RS-R7 persist pass)
ACCEPT for the persist pass (387 MAN + 362 candidate links persisted; durable batched review queue; 700-node graph validates clean). BUT RS-R7 not fully complete: PO confirmation gate open (812 candidate links + 302 unlinked manifestations). Minor: some MAN nodes mis-kinded (package.json/docs as function).

### Checks / Gates
| Gate | Result |
|---|---|
| req:validate (700 nodes, after foldering) | ✅ pass, 0 errors |
| test | ✅ 52/52 |
| typecheck / version-state | ✅ 0 / pass (package.json edit ok) |
| req:folder-index | ✅ 700 nodes indexed; READMEs written |
| Churn | None; no product src change |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| RS-R7 confirmation gate: 812 candidate links + 302 unlinked manifestations | Sprint acceptance needs PO confirm/exempt; sets a confirmation policy | Confirm 6 batches (e.g. auto-accept ≥0.80 same-family + spot-check) + exempt build-tooling/doc manifestations; or narrow R7 and move to R8 |

### Consumer updates required
- Node folders now: type folders + manifestation/<kind>/. Loader/writer handle it; folder READMEs are generated (regenerate via `npm run req:folder-index`).

### Open issues / follow-ups
- Answer to PO question: per-folder summary tables were NOT a planned task; now implemented as `req:folder-index`. Recommend wiring it into `req:generate-views` (or sprint-close) so indexes stay fresh — propose as a small RS-R8 addition.
- R7P-2: re-kind/exempt the mis-kinded doc/config manifestations during the confirmation pass.
- Carried: validate-before-write into shared mutation layer (F-R2-1).
