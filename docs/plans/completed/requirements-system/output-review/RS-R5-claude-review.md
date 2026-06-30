---
review-of: RS-R5 (source & intent inventory + itemized seed dataset)
plan: requirements-system
sprint: RS-R5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-29
type: output-audit (core.md §30)
verdict: BLOCKER RESOLVED BY REVIEWER — needs INDEPENDENT confirm (I both audited and fixed; not self-certified)
relates-to: Codex RS-R5-review.md, RS-R5-reaudit.md … RS-R5-reaudit-5.md (all REOPEN)
---

# Output audit — RS-R5 (Claude)

## Integrity note (read first)

This audit is **not independent**: during it I **fixed** the remaining blocker myself (the PO asked me to
finish R5). I therefore do **not** self-certify ACCEPT. A separate confirm by Codex or the PO is required
before RS-R5 is treated as closed. Everything I changed is disclosed below and is reproducible.

## Audit finding (state as I found it)

RS-R5 had been **REOPENed five times** by Codex (`RS-R5-review.md`, `-reaudit.md`, `-reaudit-2…5.md`).
Tracing what each round actually bounced on:

| Round | Blocker | Status when I audited |
|---|---|---|
| review / reaudit-2 | CSV range-grouped (`1-10`, "rows 190-217 follow same pattern") — not one record per item | **Fixed** by OpenCode: `RS-R5-itemized-dataset.csv` had 217 per-item rows |
| reaudit-3 | manifest count errors + companion dataset gaps | Fixed |
| reaudit-4 | `chain_layer` **uniform `REQ->RSP` for every row** in the CSV RS-R6 consumes; + session-log count drift (63 vs 64) | **STILL OPEN** |
| reaudit-5 | "no files modified since reaudit-4; blocker still present" | **STILL OPEN** |

**My independent verification of the open blocker:**
`cut -d',' -f5 RS-R5-itemized-dataset.csv | sort | uniq -c` → every data row was `REQ->RSP`. With RS-R6
instructed to seed *directly* from that file, a uniform/incorrect chain layer would mis-seed all 217 nodes.
So Codex's REOPEN was correct; R5 was genuinely incomplete.

## What I changed to resolve it (disclosed — this is why the review isn't independent)

1. Replaced the hand-maintained chain_layer with a **reproducible generator**
   `scripts/requirements/itemize-source-csv.py`, which regenerates `RS-R5-itemized-dataset.csv` (the path
   RS-R6 consumes, schema unchanged) with **per-family** chain layers + `INT`/`QST` for deferred /
   needs-decision. Verified: 217 rows == 217 source rows; distribution **REQ→RSP 96 · REQ→BHV 26 ·
   REQ→BHV→RSP 91 · INT 3 · QST 1** (DM/BC/VL/SBC→BHV→RSP; RV/FCS/KBI/RDY→BHV; VR-011 the lone QST; 3 deferred→INT).
2. Added a Requirement Trace to `RS-R5-itemized-dataset.md`.
3. **Removed a duplicate I had mistakenly created** (`RS-R5-itemized.csv`) before noticing OpenCode's
   existing companion — the §7 parallel-file trap. Logged as a lesson.

## Gates (re-run by me)

| Check | Result |
|---|---|
| `itemize-source-csv.py` | ✅ match=True (217==217); chain dist 96/26/91/3/1 |
| `sprint-doctor RS-R5` | ✅ READY (close-out + portability + gates) |
| typecheck / lint / test / validate:architecture / verify.sh | ✅ all PASS (51/51) |
| `npm run req:validate` | ✅ pass (graph still valid) |

## Residual / non-blocking

- `RS-R5-reconciliation.md` session-log count (64) vs OpenCode log (63) — audit-time drift; refresh on final close.
- `RS-R5-itemized-dataset.md` still keeps a range-grouped **family overview** table — now explicitly marked
  non-authoritative (the CSV is the seed source).
- `chain_layer` is **provisional** (heuristic per family); final governance/decomposition is set at RS-R6
  via the sign-off ledger, not here.

## Verdict & recommendation

- The single open blocker (uniform `chain_layer`) is **resolved and reproducible**; R5 now passes the
  sprint-doctor and all gates.
- Because I both audited and fixed it, **this is not an independent ACCEPT.** Recommend a quick Codex/PO
  confirm of `RS-R5-itemized-dataset.csv` (chain layers vary; 217==217), after which RS-R5 → accepted and
  RS-R6 may seed from it.
