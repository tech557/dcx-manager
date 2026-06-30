---
review-of: FP-R2-token-audit
reviewer: claude (claude-opus-4-8)
date: 2026-06-28
verdict: REOPEN
blocking-issues: 2
advisory-issues: 3
---

# RESOLVED — Superseded By Codex Follow-Up

This audit is preserved as historical evidence, but its blocking findings are no longer current.
Codex resolved the FP-R2 metric confusion and recorded the replacement handoff in
`output-review/2026-06-28-codex-FP-R2-output-audit-followup.md`.

Current FP-R2 handoff status: **READY_FOR_P3**.

Use the follow-up's corrected baselines for FP-R3 / FP-R5:

- actual unique `--theme-*` token names: `35`
- path-sensitive `--theme-*` file/token pairs: `134`
- storybook/demo color literal baseline: `22`
- broader arbitrary/bracket baseline: `342` as a broad baseline, not a migration list
- zero-direct CSS custom properties: `88`, with reproducible loop
- dead `--theme-*` tokens: `0`, with reproducible loop

---

# Output Audit: FP-R2 — Token + Hardcoded-Value Audit

## Verdict

REOPEN (light — fix the supplementary baselines, primary findings stand)

**Reason:** The primary deliverable is sound — the official `code-query.sh` baselines (108 / 0),
the dead-token finding (0 proven dead `--theme-*`), and the hardcoded-color file:line inventory all
reproduce exactly against the live v0.3.5 tree. But three of the "broader" baselines that FP-R2 hands
to FP-R5 as **"exact metric baselines"** do not reproduce from the commands the report documents:
the broader color-literal count is **35, not 26**; the "unique `--theme-*` names consumed = 134" is
arithmetically impossible (only 68 `--theme-*` tokens are defined) and its documented command yields
1; and the 44 storybook count cannot be reproduced from the stated scope. FP-R5 must not consume the
26 / 44 / 134 figures until they are corrected.

## Verification method

Re-ran every command FP-R2 documents in its baseline table against the live tree. `rg` and
`scripts/agent/code-query.sh` confirmed present. No `src/` files were written by this audit.

## Metric reproduction — claimed vs reproduced

| Metric | FP-R2 claim | Reproduced | Status | Note |
|---|---:|---:|---|---|
| Official hardcoded hex (`code-query.sh --json`) | 0 | 0 | ✅ EXACT | |
| Official arbitrary Tailwind (`code-query.sh`) | 108 | 108 | ✅ EXACT | Primary baseline — solid |
| Broader product arbitrary/bracket lines | 342 | 342 | ✅ EXACT | Reproduces with brand+stories excluded |
| Old `text-[var(--text-*)]` regressions | 0 | 0 | ✅ EXACT | |
| `text-dcx-*` usages outside brand | 260 | 260 | ✅ EXACT | |
| `[var(--theme-*)]` bracket usages outside brand | 297 | 297 | ✅ EXACT | Confirms 297 (not stale 287) |
| All `var(--theme-*)` usages outside brand | 343 | 343 | ✅ EXACT | |
| Defined `--theme-*` tokens (unique) | 68 | 68 | ✅ EXACT | 136 declarations = 68 × (dark+light) |
| Defined `--text-*` tokens | 11 | 11 | ✅ EXACT | |
| Defined custom props in brand CSS (unique) | 168 | 168 | ✅ EXACT | 268 declarations = 168 unique × themes |
| **Broader product color/gradient literals** | **26** | **35** | ❌ MISMATCH | Documented `rg` cmd yields 35; see Blocking #1 |
| **Storybook/demo color literals** | **44** | **28** | ⚠️ UNREPRODUCIBLE | `src/stories` alone = 28; "+SVGs" delta unspecified; see Blocking #1 |
| **Unique `--theme-*` names consumed outside brand** | **134** | **35** | ❌ IMPOSSIBLE | 134 > 68 defined; documented cmd yields 1; see Blocking #2 |
| Proven dead `--theme-*` tokens | 0 | 0 | ✅ CONFIRMED | All 35 consumed names are defined; no undefined/typo consumers |
| Zero-direct CSS custom props (manual loop) | 88 | — | ⚠️ NOT REPRODUCED | Manual derivation, no single command; see Advisory #3 |

Spot-checked 3/3 of the hardcoded-color file:line references (`BuilderBg.tsx:17`,
`card.registry.ts:5`, `TimelineBuilderIsland.tsx:40`) — all accurate. Inventory evidence quality is high.

## Blocking issues (must fix before FP-R5 consumes these baselines)

| # | Issue | Evidence | Required fix |
|---|---|---|---|
| 1 | FP-R5-input baselines **26** (color literals) and **44** (storybook) do not reproduce from their documented commands. The exact `rg '#...\|rgba?\|hsla?\|oklch' src --glob '!src/brand/**' --glob '!src/stories/**'` yields **35** matching lines, not 26. The storybook "44" is sourced to a scan "scoped to `src/stories/**` and SVGs" but `src/stories` alone yields **28**, and the SVG portion is not pinned to a reproducible glob. | Re-ran both commands verbatim on the live tree. FP-R2 lists 26 and 44 as exact FP-R5 inputs at `FP-R2-token-audit.md:251-252`. | Either correct the baselines to the reproducible numbers (35; storybook to a fully-specified glob) **or** show the post-filter step that reduces 35→26 (which false positives were removed) and the explicit SVG file set behind 44. A "use these exact baselines" handoff must be command-reproducible. |
| 2 | "Unique `--theme-*` names consumed outside brand = **134**" is arithmetically impossible and unreproducible. Only **68** `--theme-*` tokens are defined, so consumed-unique-names cannot exceed 68. The documented command `rg -o '--theme-*' src \| sort -u` treats `*` as a regex quantifier on the dash and yields **1** unique match (`--theme-`), not 134. | `FP-R2-token-audit.md:33`. Reproduced: corrected pattern `--theme-[A-Za-z0-9-]+` gives **35** unique consumed names, all of which are defined. | Replace 134 with the correct figure (35 unique consumed names) and fix the documented command to `rg -o '--theme-[A-Za-z0-9-]+'`. Even though Codex labels this "not a migration count," an impossible number in a baseline report erodes trust in the rest of the table. |

## Advisory issues (should fix, won't block)

| # | Issue | Evidence | Suggested fix |
|---|---|---|---|
| 1 | The documented command for the **342** row omits the `!src/brand/**` / `!src/stories/**` excludes that actually produce 342 (raw, no excludes = 343). The number is correct; the command text under-specifies it. | `FP-R2-token-audit.md:27` shows the bare `rg` with no glob excludes. | Add the glob excludes to the documented command so the 342 is reproducible as written. |
| 2 | The no-`src/`-change claim is asserted but carries no mtime/path evidence, and the live tree **does** contain recent `src/` writes — `src/brand/fonts/29LTZaridSlab-*.woff` (mtime 22:26, from adjacent FP-R1 font work, before FP-R2's 22:49 output). A naive "src/ mtime" gate would now flag these. | Plan DoD requires each sprint show a `src/` mtime/path check (`README.md:192-193`). FP-R2 Verification (`FP-R2-token-audit.md:266`) only states "No `src/` files were edited." | Add the path-list + mtime check to the Verification section, explicitly attributing the font writes to FP-R1 so the gate reads cleanly. |
| 3 | The **88** zero-direct-consumer figure (an FP-R5 input) comes from a "manual `rg -F` loop" with no single reproducible command, so it cannot be independently re-derived from the doc. | `FP-R2-token-audit.md:37,257`. | Capture the exact loop (or a script) that produces 88 so FP-R5 can re-verify, or label 88 as a manual estimate requiring build-aware confirmation (which the prose already implies but the FP-R5 inputs list presents as exact). |

## Acceptance criteria check (FP-R2 sprint)

| Criterion | Result | Notes |
|---|---|---|
| Every hardcoded literal outside `src/brand/` listed | PASS | Color/gradient table + 108-entry arbitrary list; spot-checks accurate |
| Dead-token list produced | PASS | 0 proven dead `--theme-*`; conservative, correct, internally consistent |
| Baseline counts feeding metrics captured | PASS WITH CAVEAT | Primary baselines exact; 3 broader baselines (26/44/134) not reproducible — Blocking #1, #2 |
| No `src/` changes | PASS WITH CAVEAT | True for FP-R2, but no mtime evidence shown and concurrent font writes exist — Advisory #2 |

## Gate review

| Gate | Result | Notes |
|---|---|---|
| `build-current-state.sh` | PASS (claimed + re-run) | Re-ran this session; v0.3.5, plan active |
| `verify-tooling-state.sh` / `verify.sh` | PASS (claimed) | Reported pass; not independently re-run this audit |
| `code-query.sh hardcoded-tokens` (json + text) | PASS (reproduced) | 108 / 0 confirmed live |
| Read-only discovery gate | PASS | No `src/` writes attributable to FP-R2 |

## What FP-R2 got right (carry forward with confidence)

- **108 official arbitrary-Tailwind baseline** and **0 hardcoded hex** — reproduce exactly. This is the
  primary FP-R5 input and it is trustworthy.
- **297** retained `[var(--theme-*)]` bracket usages — correctly supersedes the stale 287; reproduced.
- **0 proven-dead `--theme-*` tokens** — the conservative-deletion stance is correct and now
  independently confirmed (every one of the 35 consumed names is defined; no undefined consumers).
- The hardcoded color/gradient **file:line inventory** is accurate (3/3 spot-checks) and is the
  highest-value part of the deliverable for the `change-token` family.

## Required follow-up

Re-open FP-R2 as **Partial** only with respect to its three supplementary baselines (26, 44, 134) and
the `88` provenance. Correct or fully document those four numbers in `output/FP-R2-token-audit.md` and
in the README FP-R2 carry-forward, then FP-R5 may consume the table. The primary baselines (108, 0,
342, 297, 343, 68, 11, 168, 0-dead) need no rework.
