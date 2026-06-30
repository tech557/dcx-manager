---
review: CC-2 design checkpoint audit — requirement overlap + sprint impact
sprint: CC-2 (pre-implementation)
plan: frontend-polish-implementation-v0.3.5
reviewer: Claude (claude-opus-4-8)
date: 2026-06-30
status: audit-COMPLETE — verdict appended at end
po-signoff: CORRECTED — the prior "RECEIVED, all 6 confirmed" was premature (Q1–Q5 were never answered). Actual PO decisions recorded 2026-06-30 in the checkpoint header + session log 022.
source-output: docs/plans/active/frontend-polish-implementation-v0.3.5/output/CC-2-design-checkpoint.md (v4)
---

# CC-2 Design Checkpoint — Audit Brief

## Why this audit exists

CC-2's design checkpoint surfaced a product principle ("never add mental work on top of the real work") and proposed a new requirement `REQ-COG-AWARE-001`. PO confirmed this principle is **not new** — it is already embedded in existing requirements (e.g., the readiness model, movement model). Before CC-2 implementation begins, an auditor must:

1. Determine whether `REQ-COG-AWARE-001` already exists under a different ID or is genuinely additive.
2. Assess which existing sprints already cover the CC-2 scope additions (overflow signals, structural skeleton, scroll-awareness).
3. Decide whether new sprints are needed or existing sprint specs need editing.
4. Return a verdict so implementation can proceed with correct requirement tracing.

---

## Inputs to audit

### The principle (§P from CC-2 checkpoint v4)
> At every nesting level (stage→phase, phase→action, action→task), the user must always perceive spatial context without effort. No container may clip its children without an overflow signal (gradient fade, arrow, mini-stub, or magnetic snap). Cropped cards with no signal are a violation.

### Proposed new requirement
```
REQ-COG-AWARE-001 (proposed)
Statement: At every nesting level (stage→phase, phase→action, action→task),
           the user must always perceive spatial context without effort.
           No container may clip children without an overflow signal.
Scope: frontend / ux-contract
Priority: MVP
Affected: KanbanView, PhaseCard, HorizontalTaskFlow, BuilderLoadingShell
```

### Known existing requirements that may already cover this

| Req ID | Statement summary | Overlap with §P? |
|---|---|---|
| `REQ-FP-CMA-003` | AUTO-CENTRE on select/navigate: selecting/jumping scrolls stage to centre the card | **Direct overlap** — scroll-into-view on selection IS spatial awareness |
| `REQ-FP-CMA-002` | Smart default: active phase expanded, rest collapsed; scales to 7–8 phases without a wall of scroll | Partial — reduces the need for overflow signals by smart defaults |
| `REQ-SBC-002` | Card movement matches mental model (per-card movement rules) | Tangential — about motion semantics not overflow signals |
| `REQ-FCS-001` | Context-aware focusing (filter/focus system) | Partial — focus system helps spatial awareness but is a different mechanism |
| `REQ-RDY-001..003` | Readiness model — always-visible state without asking | **Conceptual sibling** — same "no hidden state" principle applied to readiness, not spatial overflow |
| `REQ-IFX-001` | Interaction feedback — motion + visual response | Tangential — feedback on action, not spatial context |
| `REQ-DZ-001-RECOVERY` | Stage movement, scroll direction, dropzone behavior | Partial — scroll direction mentions exist |

### New scope in CC-2 checkpoint not covered by any existing requirement

| Item | Existing coverage? | Gap? |
|---|---|---|
| Gradient fade at action-list edges (phase→action vertical overflow) | None found | Likely gap |
| Gradient fade at task-row edges (action→task horizontal overflow) | None found | Likely gap |
| `useScrollEdge` hook | None | Implementation detail — not a req gap |
| Structural skeleton `state` prop (pending/error) | None found | Likely gap — skeleton as optimistic/error primitive is new |
| Tiered skeleton loading (phase→action→task stagger) | SK-1 covers initial shell; inner phase/action/task detail not specified | Likely additive to SK-1 scope |
| Stage→phase horizontal awareness (KanbanView) | `REQ-FP-CMA-003` partly covers scroll-to-centre; overflow signal (gradient/arrow) not explicitly specified | Partial gap |

---

## Audit questions (agent must answer each)

### Q1 — Requirement overlap
Does `REQ-FP-CMA-003` (auto-centre on select) already subsume the overflow-signal requirement, or is overflow-signal awareness genuinely additive?
- Read `REQ-FP-CMA-003.json` and any linked TRC/RSP nodes.
- Read the `core-interaction-model.md` provenance source: `docs/plans/on-hold/frontend-polish-v0.3.5/output/core-interaction-model.md`
- Verdict: (a) fully covered by FP-CMA-003 → link CC-2 implementations to it; (b) partial → extend FP-CMA-003 statement; (c) genuinely new → propose REQ-COG-AWARE-001.

### Q2 — Readiness model as instance of §P
PO stated the readiness model is "part of this requirement." Is `REQ-RDY-001` (or its chain) linked to a parent UX principle node in the graph? If not, does the graph have a mechanism for a "meta-requirement" or "principle node" that other reqs reference?

### Q3 — Structural skeleton gap
Is the skeleton-as-optimistic-UI-primitive (pending/error state) covered by any existing requirement? Check `REQ-LOAD-SKEL-001`, `REQ-IFX-001`, `REQ-UP-*`. If not, is it large enough to warrant a new requirement node, or is it an implementation detail to attach to an existing one?

### Q4 — Sprint scope impact
For each item in CC-2 checkpoint §7 (files touched), confirm it fits `change-component` family and does not introduce new features that belong in a later sprint. Specifically:
- `useScrollEdge` + overflow fades in PhaseCard + HorizontalTaskFlow → fits CC-2?
- Structural skeleton state prop in SkeletonBlock + BuilderLoadingShell tiered detail → fits CC-2, or should split into SK-1b?
- KanbanView stage→phase signals → confirm deferred to CC-6/WM-6.

### Q5 — New sprint needed?
Given the audit findings, recommend one of:
- (A) No new sprints — all CC-2 scope fits existing sprint definitions with updated req traces.
- (B) Edit existing sprint specs — identify which sprint files need statement edits and what to change.
- (C) New micro-sprint — define it: title, family, scope, requirements touched, placement in execution order.

---

## CC-2 implementation scope (locked, regardless of audit)

These items are PO-signed-off and confirmed in-scope for CC-2 regardless of how req tracing resolves:

1. `TaskCard.tsx` — single branch, `h-[60px]`, `px-2.5 py-1.5` expanded / `px-1.5` collapsed, `gap-2` inter-card
2. `CardShell.tsx` — `effectiveSelected` → `scrollIntoView` for tasks
3. `ActionCard.tsx` — remove `max-w-[200px]`
4. `HorizontalTaskFlow.tsx` — gradient edge fades (`useScrollEdge`); expanded task `w-[calc(100%-1rem)] mx-2 flex-none`; text-only empty state
5. `TaskBentoGrid.tsx` — remove `max-h-[300px] overflow-y-auto`; text-only empty state
6. `PhaseCard.tsx` — gradient edge fades on action list; text-only empty state for 0 actions
7. `BuilderLoadingShell.tsx` — tiered phase/action/task stubs via CSS animation-delay
8. `SkeletonBlock.tsx` — `children` prop + `state` prop (`loading`/`pending`/`error`)
9. `components.css` — skeleton contrast fix (10–22% dark, 7–14% light) + pending/error variants
10. `src/hooks/useScrollEdge.ts` — new shared scroll-edge hook

Implementation must NOT begin until this audit returns a verdict on Q4 and Q5.

---

## Expected audit output

A short verdict document (≤ 400 words) covering:
- Q1 verdict + action (link to FP-CMA-003 / extend / propose new)
- Q2 verdict + action (meta-req pattern or not)
- Q3 verdict + action (new req node or attach to existing)
- Q4 verdict (all CC-2 items confirmed in-scope or flagged)
- Q5 verdict (A / B / C + specifics if B or C)

Return the verdict to this file's `status` field as `audit-PASS` or `audit-NEEDS-CHANGES` and append the findings below this line.

---

# AUDITOR VERDICT — Claude (opus 4.8), 2026-06-30 — audit-COMPLETE

Answering the brief's own Q1–Q5 (they were left open). Verdict: **NEEDS-CHANGES → resolved by PO decisions
(checkpoint header).** Net: tighten CC-2, spin out OA-1, fold the principle, add the 80%/10% height rule.

- **Q1 (overlap):** `REQ-COG-AWARE-001` is **partially additive but does not warrant a new node.** Overflow-
  signal-on-clip is distinct from FP-CMA-003 (auto-centre-on-select), but it is the same "no hidden state"
  family as readiness. **Action (PO #3):** fold into `REQ-FP-CMA-003` + `REQ-RDY-001` family as the trace;
  do NOT create `REQ-COG-AWARE-001`.
- **Q2 (principle node):** the graph has no formal "meta-requirement / principle node" mechanism, and
  inventing one now is scope we don't need. Treat the §P principle as design guidance traced to the existing
  family. No graph mechanism change.
- **Q3 (skeleton gap):** skeleton `state` (pending/error) + tiered loading is **genuinely additive and NOT
  CC-2** — it extends `REQ-LOAD-SKEL-001`/SK-1 (already shipped). **Action:** defer to a SK-1 follow-up
  (SK-1b), not CC-2. Optimistic/error UI is arguably its own small requirement when it's actually built.
- **Q4 (scope fit):** CC-2 as written (10 files) does NOT all fit `change-component`-for-cards. `useScrollEdge`
  + fades + BuilderLoadingShell tiers + SkeletonBlock state belong elsewhere. **Confirmed in-CC-2:** TaskCard
  merge, ActionCard `max-w` removal, TaskBentoGrid `max-h` removal, Phase states, **+ the new 80%/10%
  height model**, text-only empty states. **Out:** fades→OA-1; skeleton state/tiers→SK-1b.
- **Q5 (new sprint):** **option (C) — new micro-sprint `OA-1`** (overflow/spatial-awareness gradient fades,
  `change-component`, after CC-2, stage-level deferred to CC-6/WM-6) **+ option (B)** edit CC-2 scope. Both done.

**Disagreement with the original output (explicit):** (a) the checkpoint over-scoped CC-2 and partly
re-did the completed SK-1; (b) the "PO sign-off RECEIVED — all 6" claim was not real (Q1–Q5 unanswered);
(c) the checkpoint missed the actual phase/day card-height question — now resolved by the PO's 80%/10% rule.
