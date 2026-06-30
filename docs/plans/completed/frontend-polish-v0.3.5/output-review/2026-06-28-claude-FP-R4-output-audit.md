---
review-of: FP-R4-finalize-spec
reviewer: claude (claude-opus-4-8)
date: 2026-06-28
verdict: REOPEN
blocking-issues: 2
advisory-issues: 3
---

# Output Audit: FP-R4 — Builder / Version / Homepage Finalize-Behavior Spec

## Verdict

REOPEN (NEEDS REVISION — fixable in under an hour; do not let FP-R5 consume as-is)

**Reason:** The spec's structure, boundary discipline, and decision-register handling are sound, and
the D-07 gating is applied correctly. But two load-bearing claims fail verification: **~20 of the
cited `BLD-*` requirement IDs do not exist** in any requirements or decisions doc (the spec's own
acceptance criterion is "gaps grounded, not invented"), and the **three-family gap counts are wrong
and internally self-inconsistent** (claims 44/17/9=70; the actual tag counts are 45/21/10=76; its own
area breakdown sums to a third set, 42/24/9). Both feed FP-R5's three-family matrix directly, so they
must be corrected before FP-R5 drafts from them.

## Verification method

Extracted every cited ID and family tag from the spec and checked them against the live tree:
`docs/product/requirements/builder/**`, `docs/product/decisions/**`,
`docs/product/open-questions/**`. Re-tallied family tags by parsing each criterion row's Family
column. Ran the `src/` mtime check. No `src/` files written by this audit.

## Blocking issues (must fix before FP-R5 consumes this spec)

### 1. ~20 fabricated `BLD-*` requirement IDs

The spec cites 28 distinct `BLD-*` IDs, but only **8** of them exist in the requirements/decisions
corpus. The kanban / drag-and-drop / timeline / stage requirement files define **no formal IDs at
all** — they are prose specs — yet the spec invents ID codes for those domains and presents them as
authoritative traceability anchors.

**Cited but nonexistent (20):**
`BLD-DND-001`–`005`, `BLD-ISL-003`, `BLD-ISL-007`, `BLD-KAN-001/002/004/006`, `BLD-RDY-001/002`,
`BLD-STG-001/002`, `BLD-TML-001`–`004`, `BLD-VCX-002`.

**Evidence:** `rg -o 'BLD-[A-Z]+-[0-9]+' docs/product/requirements docs/product/decisions` returns
only `BLD-EDT-001/002`, `BLD-FIL-001/002`, `BLD-FOC-001`, `BLD-MOT-001`, `BLD-OVR-001`,
`BLD-RED-001`, `BLD-SLC-001/002`, `BLD-VCX-001`. The DND/KAN/TML/STG/RDY domains have zero defined
IDs.

**Why it blocks:** The sprint scope says "Cite BLD-* IDs" and "do not invent … flag desired-but-
unspecified behavior as ❓" (`core.md §14`). The underlying behaviors *are* real (documented in
`kanban.md`, `drag-and-drop.md`, `timeline.md`, `stage.md`), but the IDs are not — an implementing
agent or FP-R5 cannot trace `BLD-KAN-001` to anything. The spec already does this correctly on some
rows (e.g. C02 cites `kanban.md`, C07 cites `cards.md`, T05 cites `islands.md`).

**Fix:** For each fabricated ID, either cite the real source file (e.g. `drag-and-drop.md`,
`kanban.md`) the way other rows do, or — where the behavior is genuinely unspecified — flag it as a
`❓` decision-register row. Do not present invented codes as requirement IDs.

### 2. Three-family gap counts are wrong and self-inconsistent

The spec's §1.12 summary claims `wire-mockup-data=44`, `change-component=17`, `change-token=9`,
**total 70**. Re-tallying the actual Family column on all 79 builder criteria gives a different
result, and the spec's *own* area-breakdown table sums to yet a third result.

| Source | wire | component | token | tagged total |
|---|---:|---:|---:|---:|
| Spec §1.12 summary table (claimed) | 44 | 17 | 9 | 70 |
| Spec §1.12 area breakdown (sums to) | 42 | 24 | 9 | 75 |
| **Actual Family-column tags (reproduced)** | **45** | **21** | **10** | **76** |

(79 criteria total = 76 tagged + 3 marked `—`: K03, K04, M03.)

**Evidence:** Parsed every `| <ID> | … | <family> |` row. Per-area, e.g. Editor is 6 wire + 3 comp =
9 (spec's breakdown says 5+4); Card is 6 wire + 5 comp = 11 (spec's breakdown says 5+5=10).

**Why it blocks:** These counts are the direct input to FP-R5's three-family matrix and are echoed
into the README carry-forward. A baseline that disagrees with itself cannot be a handoff number.

**Fix:** Recount from the actual tags (45/21/10, 76 tagged) and reconcile the summary table, the area
breakdown, and the README carry-forward to the same numbers. Note Blocking #1 may shift a few rows
between families once mis-cited rows are re-grounded — recount *after* fixing IDs.

## Advisory issues (should fix, won't block)

| # | Issue | Evidence | Suggested fix |
|---|---|---|---|
| 1 | 5 card-interaction criteria cite `BLD-CRD-INT-002`…`006`, but the real IDs are `CRD-INT-002`…`006` (no `BLD-` prefix). The requirement is real; only the label is wrong. | `rg -o 'CRD-INT-[0-9]+' docs/product/requirements` returns `CRD-INT-002..006`; the spec prefixes them `BLD-`. | Normalize to `CRD-INT-*` so the citations resolve. |
| 2 | Bare `❓` in the **completed** builder spec without a decision-register row, violating AC#4 ("every ❓ is a row with a status, not a count"): E02, X01, X02, X03. | Rows show `❓` with no `D-` link; no D-row covers the X-series tokenization questions. | Add register rows (e.g. D-12 "tokenize phase/editor/header dimensions?") or mark the X-series explicitly `Out of scope`. (The H/V section's bare `❓` are acceptable — that whole section is blocked-on-D-07 and informative-only.) |
| 3 | README FP-R4 carry-forward repeats the wrong family counts (44/17/9/70). | `README.md:417-422`. | Fix together with Blocking #2. |

## Acceptance criteria check

| Criterion | Result | Notes |
|---|---|---|
| Per-surface finalize checklist | PASS | Builder fully specced; home/version blocked-on-D-07 with informative drafts |
| Every criterion tagged with verification type + requirement ID or ❓ | FAIL | ~20 IDs are fabricated (Blocking #1); 4 bare ❓ unlinked (Advisory #2) |
| Builder layout-frozen; home/version no-builder-import confirmed | PASS | §10 boundary check present; H01/V01 enforce `core.md §13` |
| `decision-register.md` exists; every ❓ is a row with a status | PASS WITH CAVEAT | Register well-formed (D-01–D-11, statuses, defaults); but X-series ❓ not entered (Advisory #2) |
| Every finalize gap carries a family tag | PASS (counts wrong) | All 76 tagged; the *totals* are miscounted (Blocking #2) |
| Allowed writes only; no `src/` write | PASS | `find src -newer <output>` empty |

## Gate review

| Gate | Result | Notes |
|---|---|---|
| Requirement-ID grounding | FAIL | 20/28 BLD IDs nonexistent |
| Family-count reproduction | FAIL | 45/21/10, not 44/17/9 |
| `OD-*` decision references | PASS | OD-001/002/003/004/006/008/009 all exist in decisions/open-questions |
| `TA-003`, `BLD-EDT-001/002`, `BLD-VCX-001`, `BLD-FOC-001`, `BLD-MOT-001`, `BLD-RED-001`, `BLD-SLC-001/002` | PASS | All real |
| Decision register structure | PASS | D-01–D-11, opened-by/closed-by frontmatter, statuses + defaults present; D-09/10/11 added by FP-R4 |
| D-07 gating | PASS | Homepage + version correctly marked blocked; drafts labelled informative-only |
| Preserve-semantic (`§10/§13/§17/§20/§22.1`) | PASS | Layout frozen; popup≠modal (C05); reduced-motion branches (M01–M05); SelectionIsland maxWidth (S06) |
| No-source-change | PASS | mtime clean |

## What FP-R4 got right

- **Decision register is solid** — D-01 through D-11 are well-formed rows with surface, question,
  status, and default-if-unresolved; D-08 correctly shown resolved; FP-R4's own D-09/10/11 added. This
  directly satisfies the old FP-R0 audit blocker about counts-not-rows.
- **`OD-*` and the 8 real `BLD-*` citations are accurate** — every open-decision reference resolves.
- **D-07 gate honoured** — homepage and version specs are blocked, not faked, with informative-only
  draft criteria that respect the `core.md §13` placeholder-route boundary.
- **Boundary/preserve-semantic discipline is correct** — layout frozen, popup≠modal, reduced-motion
  coverage, no builder imports into home/version.
- **No `src/` writes.**

## Required follow-up

Re-open FP-R4 as **Partial**: (1) re-ground or `❓`-flag the ~20 fabricated `BLD-*` IDs, (2) recount
the three families from the actual tags and reconcile summary + area-breakdown + README to one set of
numbers, (3) normalize the `CRD-INT-*` prefix and enter the X-series `❓` into the register. The
decision register, D-07 gating, and boundary work need no rework. FP-R5 should not build its
three-family matrix until the IDs and counts are corrected — both are its direct inputs.
