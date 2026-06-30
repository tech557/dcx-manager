## RS-R7 audit + 4 PO decisions recorded + graph node foldering
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: mixed
Status: Completed
PO-Action: none

Intent: Audit RS-R7 output; record the 4 PO decisions via the ledger; categorize graph nodes into type folders for accessibility.
Trigger: PO request — "audit the final r7 output ... handle the po decision here one by one ... categorize the graph nodes into folder for accessibility".
Requirements covered: RS-R7 output audit (core.md §30); PO decisions C-03/keyboard-copy/VR-011/R7-path; graph storage accessibility.

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | docs/plans/active/requirements-system/output-review/RS-R7-claude-review.md | RS-R7 audit — INCOMPLETE (concur w/ Codex) | 60 |
| edited | docs/product/requirements/graph/ledger/decision-ledger.jsonl | +3 PO decision entries (C-03, KBD, VR-011) | 38 |
| edited | docs/product/requirements/graph/nodes/** | promoted 9 keyboard/copy nodes; resolved QST-VR-011; annotated RV-005; +QST-LIFECYCLE-POST-READY | — |
| edited | scripts/requirements/store.ts | loader recursive; nodePath routes by type-folder; ensureGraphDirs creates subfolders | 88 |
| moved | docs/product/requirements/graph/nodes/*.json → nodes/<type>/ | 311 nodes into 8 type folders (requirement/manifestation/…) | — |
| edited | src/requirements/__tests__/requirements.workflow.test.ts | use nodePath() instead of hardcoded flat node paths | — |

### Audit verdict (RS-R7)
INCOMPLETE — concur with Codex "NOT ACCEPTED AS COMPLETE." Inventory found 387 manifestations but persisted 0 MAN nodes; 362 candidates are transient; coverage 0%; PO gate not exercisable. The validate-before-write gap (F-R2-1) finally manifested (dangling auto-links written then removed); Codex patched the reconcile path. Needs a persist pass (PO chose: finish properly).

### PO decisions recorded (ledger)
| Decision | Ruling | Ledger | Node effect |
|---|---|---|---|
| R7 path | Finish properly (persist pass) | — | next execution step |
| C-03 Ready terminal? | NO — post-Ready state exists | LDG-…-PO-C03 | RV-005 stays proposed; +QST-LIFECYCLE-POST-READY (name TBD; not Placed/Rejected/Ready-for-Review §14) |
| Keyboard/copy scope | Full v0.1.4 set | LDG-…-PO-KBD | REQ-KEY-001..007 + REQ-SBC-DES-001/DUP-001 → approved/po-decided |
| VR-011 read/edit | Access implies edit (within version locks) | LDG-…-PO-VR011 | QST-VR-011 resolved; R7 to derive REQ-VR-011 |

### Checks / Gates
| Gate | Result |
|---|---|
| req:validate (after decisions + foldering) | ✅ pass, 0 errors (1 warning: QST-VR-011 approved+intent-captured → maturation queue) |
| test | ✅ 52/52 (fixed 2 that hardcoded flat node paths) |
| typecheck / lint / validate:architecture | ✅ 0 / 0 / 0 |
| req:generate-views against foldered graph | ✅ exit 0 |
| Churn | Fixed 2 own-broken tests same session; no product src change |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None new | Post-Ready state name is tracked as QST-LIFECYCLE-POST-READY (in the graph's own queue); existing roll-up items unchanged | decide post-Ready name when convenient |

### Consumer updates required
- Graph nodes now live in `nodes/<type>/`; all readers (loadGraph) + writers (writeNode/nodePath) handle it. Re-running `seed-rs-r6.ts` would need its flat reset loop made folder-aware (follow-up).

### Open issues / follow-ups
- **Next: RS-R7 persist pass** (PO chose "finish properly") — persist MAN nodes for meaningful manifestations + the 362 candidate links into the review queue; fold the validate-before-write fix (F-R2-1) into the shared mutation layer first.
- seed-rs-r6.ts reset loop is folder-unaware (only matters if re-seeding).
