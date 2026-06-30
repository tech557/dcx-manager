## folder-index — CSV + summary + auto-refresh wiring
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: user-request-code
Status: Completed
PO-Action: pending

Intent: Make node-folder summaries machine-readable (CSV), add a summary header, and auto-refresh whenever a node file is added.
Trigger: PO request — "summary for folders also in csv format and mechanically wired to add items whenever a new file is added ... contain summary at the beginning ... recommend further folder structure? ... when safe to proceed with R8".
Requirements covered: graph accessibility (folder index CSV + auto-wire).

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| edited | scripts/requirements/folder-index.ts | per-folder index.csv + README summary header; exported writeFolderIndex()/generateFolderIndexes() | 130 |
| edited | scripts/requirements/store.ts | writeNode now refreshes its folder's index on every add (mechanical) | ~5 |
| edited | scripts/requirements/generate-views.ts | full folder-index refresh on every view regen | ~3 |
| generated | docs/product/requirements/graph/nodes/**/{index.csv,README.md} | per-folder CSV + summary (700 nodes) | — |

### Checks / Gates
| Gate | Result |
|---|---|
| req:folder-index | ✅ 700 nodes; index.csv + README per folder |
| req:generate-views | ✅ folderIndexNodes: 700 (auto-refresh wired) |
| req:validate / typecheck / test / architecture | ✅ 0 errors / 0 / 52-52 / 0 violations |
| Churn | None; no product src change |

### Mechanical wiring
- `writeNode()` → `writeFolderIndex(folder)` on every node add (per-file refresh).
- `req:generate-views` → `generateFolderIndexes()` (full refresh; runs after seed/persist/apply workflows).
- `npm run req:folder-index` → manual full refresh.

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| R7 confirmation gate still open (812 candidate links + 302 unlinked) | Blocks meaningful R8 verification (0% confirmed coverage) | Approve a confirmation policy (auto-accept ≥0.80 same-family + exempt build-tooling/docs + spot-check) to close R7 before R8 |

### Recommendations (answered in chat)
- Further foldering of react-component (259): NOT necessary now that each folder has index.csv + summary; only sub-fold by source-area if filesystem browsing matters. Offered.
- R8 safety: build R8 mechanism anytime, but data-dependent verification needs R7 confirmation gate closed first.

### Open issues / follow-ups
- Fold validate-before-write (F-R2-1) into the mutation layer before R8.
- Clean mis-kinded manifestations (package.json/docs as function) during R7 confirmation pass.
