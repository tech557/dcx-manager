---
sprint: FP-R5
title: Started-metrics baseline — frontend-polish v0.3.5
agent: Codex
date: 2026-06-30
status: Complete
purpose: Numeric baseline captured at graph-grounded discovery close so the implementation plan can show movement.
---

# Metrics Baseline — frontend-polish v0.3.5

## Source Set

| Source | Date | Role |
|---|---|---|
| FP-R0 live inventory | 2026-06-28 | current Builder behavior gaps |
| FP-R1 brand reconciliation + brand UI contract | 2026-06-28 | token/contrast/brand constraints |
| FP-R2 token audit | 2026-06-28 | hardcoded-token and token-consumer counts |
| FP-R3 modularization audit | 2026-06-28 | file-size and reuse constraints |
| FP-R4 rewritten finalize spec | 2026-06-30 | graph-grounded criteria |
| RS-R11 re-grounding brief | 2026-06-30 | requirements delivery/verification coverage |

## Requirements Coverage Baseline

| Metric | Baseline | Source | Target |
|---|---:|---|---|
| Frontend requirements in RS-R11 scope | 104 | RS-R11 brief | accounted and progressively verified |
| Delivery-confirmed implemented | 0 | RS-R11 brief | increase per sprint touched area |
| Verified | 0 | RS-R11 brief | increase only after evidence bound |
| Approved/proposed frontend requirements | 102 approved + 2 newly approved/recovered | RS-R11 + graph | no orphaned frontend intent |
| RS-R7 active candidate links | 238 | RS-R11 brief | confirm/correct/reject touched candidates |
| Queue-count unlinked canonical manifestations | 223 | RS-R11 brief | link/exempt touched-area manifestations |
| Direct frontend-scope unlinked count | 185 | RS-R11 brief | burn down by touched area |

## FP-R4 Criterion Coverage Baseline

| Surface | Explicit criterion rows | Cross-surface policy rows | Delivery state | Verification state |
|---|---:|---:|---|---|
| Builder | 64 | 1 skeleton policy | not-assessed | not verified |
| Home | 9 | 1 skeleton policy | not-assessed | not verified |
| Version | 11 | 1 skeleton policy | not-assessed | not verified |
| Reduced-motion skeleton policy | — | 1 | not-assessed | not verified |
| **Total** | **84** | **4** | 0 implemented | 0 verified |

| Family | Explicit criterion rows | Owner sprint families |
|---|---:|---|
| `wire-mockup-data` | 49 | WM-1..WM-6, HV-1, HV-2 |
| `change-component` | 29 | SK-1, CC-1..CC-6, HV-1, HV-2 |
| `change-token` | 6 | CT-1, CT-2 |

## Token / Hardcoded-Value Metrics

| Metric | Baseline | Source | Target direction |
|---|---:|---|---|
| Official arbitrary-Tailwind entries | 108 | FP-R2 `code-query.sh hardcoded-tokens` | down via CT-2/CC consumption |
| Official hardcoded hex entries | 0 | FP-R2 | hold 0 |
| Broader product color/gradient literal lines | 26 | FP-R2 rg scan | down via CT-1/CC-5 |
| Broader product arbitrary/bracket lines | 342 | FP-R2 rg scan | down where structural/token values are touched |
| Storybook/demo color literal lines | 22 | FP-R2 | out of product scope |
| `text-[var(--text-*)]` regressions | 0 | FP-R2 | hold 0 |
| `text-dcx-*` utility usages outside brand | 260 | FP-R2 | stable/increase |
| Retained `[var(--theme-*)]` arbitrary usages | 297 | FP-R2 | gradual down, no blind churn |
| Proven dead `--theme-*` tokens | 0 | FP-R2 | hold 0 |
| Zero-direct CSS custom properties | 88 | FP-R2 | informational; do not delete blindly |

## Brand / Contrast Metrics

| Metric | Baseline | Owner sprint | Target |
|---|---:|---|---|
| Pure-white token offenders | 2 (`--theme-surface-void`, `--theme-dropdown-bg`) + shadcn `--background` | CT-1 | 0 |
| Missing/empty tokens | 1 (`--theme-text-secondary`) | CT-1 | 0 |
| Known contrast failures | 1 (`--theme-accent #75E2FF` as text on light) | CT-1 | 0 |
| Glass density variants defined | 3 | CT-1 preserves | no ungoverned variants |

## Modularization Metrics

| Metric | Baseline | Owner sprint | Target |
|---|---:|---|---|
| Files measured | 187 | FP-R3 | informational |
| Over hard cap | 1 (`useEditorState.ts` 375 lines) | CC-1 | 0 |
| Over target only | 27 | CC-OPT opportunistic | down only when touched |
| Within target/cap | 159 | FP-R3 | increase |
| Homepage/version route files over target | 0 | HV-1/HV-2 preserve | hold |

## Drafted Implementation Plan Metrics

| Metric | Value |
|---|---:|
| Implementation sprints drafted | 16 + CC-OPT |
| Token sprints | 2 |
| Component sprints | 7 + CC-OPT |
| Wiring/data sprints | 6 |
| Home/version sprints | 2 |
| Skeleton cross-surface sprint | 1 |
| Backend-deferred frontend rows | 0 |
| Open decisions | 0 |
| Pre-implementation PO gate | 1 (`G-IMPECCABLE`) |

## Movement Rule

Each implementation sprint reports:
- before/after for the metrics it touches,
- before/after touched-area candidate link queue counts,
- touched `REQ/EMC/MAN/TRC` IDs,
- `req:completion-gate --changed <files>` or current repo equivalent,
- `npm run req:validate`,
- PO Web Check evidence path.
