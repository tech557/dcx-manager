---
review-of: RS-R0a-conceptual-model
plan: requirements-system
sprint: RS-R0a
reviewer: Claude (claude-opus-4-8)
date: 2026-06-29
type: output-audit (core.md §30)
verdict: ACCEPT — all acceptance criteria genuinely met; refinements deferred to RS-R0b (non-blocking)
---

# Output audit — RS-R0a (conceptual model & graph design)

## Verdict

**ACCEPT.** The output (`output/RS-R0a-conceptual-model.md`, by Codex/GPT-5) meets every RS-R0a acceptance
criterion with real evidence, honors the README conceptual model, and the procedural obligations (session
log, carry-forward update, no-`src`-change, attribution) are all satisfied. A handful of conceptual
refinements are correctly left for RS-R0b to operationalize — they are not RS-R0a defects.

## The audited model, at a glance

The 7-layer chain RS-R0a defined, with the node-type prefix per layer and the two traversal directions:

```mermaid
flowchart LR
  INT[INT- intent]:::n --> REQ[REQ- requirement]:::n --> BHV[BHV-/AC- rules + acceptance]:::n --> RSP[RSP- responsibilities]:::n --> EMC[EMC- expected categories]:::n --> MAN[MAN- manifestations]:::n --> EVD[EVD- evidence]:::n
  EVD -.->|▲ bottom-up: justify| INT
  classDef n fill:#1f5fbf,stroke:#06f,color:#fff
```
Legend: → top-down (`trace --from intent`, surfaces coverage gaps) · ▲ bottom-up (`justify --manifestation` → intent / exemption). Acceptance: ✅ 6/6 criteria met · 4 refinements (F1–F4) deferred to RS-R0b.

## Acceptance criteria — verified independently

| RS-R0a criterion | Verdict | Evidence I checked |
|---|---|---|
| Defines every in-scope item | PASS | Output §2–§12 cover chain, taxonomy, scopes, states, maturation, provenance, responsibilities, manifestations, trace links, exemptions, verification. |
| Three state dimensions separate; 4 combinations shown | PASS | Output §5 — orthogonal table + all four named combinations (`locked+not-started`, `locked+partially-implemented`, `locked+implemented-but-unverified`, `superseded+still-manifested-in-code`). |
| Progressive maturation; draft passes with intent-only fields | PASS | Output §6 matrix + explicit "a draft passes with only intent/problem/provenance/actor/open-questions." |
| Responsibilities + expected categories + manifestation identity/boundary + trace/relationship/exemption/verification taxonomies | PASS | Output §8–§12; manifestation identity is semantic (`MAN-<kind>-<owner>-<slug>`), path-as-attribute. |
| Worked cross-scope decomposition | PASS | Output §4 — `REQ-FCS-002` → FE/BE/DATA/DEVOPS/TQA with `derives-from`. Real, project-grounded. |
| No `src/` change | PASS | Session log records `src/` mtime unchanged (`1782674791` before/after); I re-checked `find src -newermt 11:00` → empty. |

## Procedural obligations (core.md §27/§29a/§33)

| Obligation | Status |
|---|---|
| Session log written + attributed (Codex/GPT-5) | PASS — `2026-06-29-codex/09-…-r0a.md` |
| Indexed in `docs/progress/index.csv` | PASS |
| Carry-forward updated with RS-R0a decisions | PASS — README §"RS-R0a carry-forward" (taxonomy, prefixes, scopes, 3 states, matrix, provenance set, relationship/exemption/verification lists) |
| Sprint status flipped to Completed; RS-R0b → Active | PASS |

## Quality notes (strengths)

- Adjacency-boundary rules per chain layer (output §2) exceed the ask and make top-down/bottom-up precise.
- Provenance confirmation enum adds `disputed` + `stale` beyond the README set — a genuine improvement.
- TraceLink gains a `coverage` value set (`complete|partial|missing|stale|invalidated|exempt`) — useful.
- The FCS-002 worked decomposition uses a real project requirement, not a toy example.

## Findings for RS-R0b to absorb (non-blocking refinements)

| # | Finding | Why it matters | Where |
|---|---|---|---|
| F1 | Define the **coverage → delivery-state rollup**: how TraceLink `coverage` values aggregate into a node's `delivery/verification` state. | RS-R1 validators + RS-R3 reconciliation need a deterministic rule, not two parallel vocabularies. | RS-R0b validator catalog |
| F2 | Pin the **`confidence` representation** (numeric 0–1 vs ordinal enum). | RS-R3 auto-apply thresholds depend on a comparable scale. | RS-R0b command/threshold design |
| F3 | Clarify whether the maturation **field-requirement matrix keys on maturity alone** (truly orthogonal) or on the paired governance×maturity progression shown. | The output pairs them; the README calls the three dimensions orthogonal. Resolve so e.g. `approved + intent-captured` is either valid or explicitly disallowed. | RS-R0b + RS-R1 schema |
| F4 | Make **expected-manifestation-category sets canonical per responsibility type** (output §8 lists examples). | Coverage = complete/partial must be computable, not illustrative. | RS-R0b + RS-R1 |

## Environment debt surfaced at close (pre-existing, NOT RS-R0a defects — PO visibility)

These came from Codex's gate run and are unrelated to this doc-only sprint, but the PO should see them:

| Item | State | Owner |
|---|---|---|
| `npm run lint` fails on pre-existing `src` `no-explicit-any` errors | pre-existing | PO/maintenance — later code sprints must not inherit |
| `verify-plan-state` mismatch in `docs/plans/completed/builder-refactor/` (README `status=column`) | pre-existing | PO/maintenance |
| `docs/VERSION.md=v0.3.5` vs `metadata.json=v0.3.3` | mismatch | **PO** (version is PO-owned, `core.md §26`) |
| `code-index/` stale; Semgrep CLI not installed | tooling | RS-R3 must `npm run generate:code-index` / use §28 fallbacks |

## Recommendation

Proceed to **RS-R0b** (already flipped to Active). RS-R0b should explicitly resolve F1–F4 in its validator
catalog + sample records, and its output is the **PO methodology sign-off gate** that unblocks the build
sprints (RS-R1+). See the PO action items below / in the session log.
