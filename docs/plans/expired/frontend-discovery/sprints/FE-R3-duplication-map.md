---
sprint: FE-R3
plan: frontend-discovery
title: Duplication + Consolidation Map
status: not-started
depends-on: FE-R1 and FE-R2 (both must be complete)
output: docs/plans/drafted/frontend-discovery/output/FE-R3-duplication-map.md
assigned-to: Claude (synthesis — no terminal required)
---

# FE-R3 — Duplication + Consolidation Map

## Intent

Read FE-R1 (component tree) and FE-R2 (state flow) and identify every case of duplicate or overlapping component logic. For each: recommend whether to consolidate, leave separate, or delete. This is the direct input to P2's atom extraction decisions.

**No source file changes. Pure analysis from research outputs.**

---

## Synthesis Tasks

### Task 1 — Component duplication catalogue

Cross-reference FE-R1's leaf atoms and component tree against UX-R2's duplicate visual pattern groups. For each pattern group identified in UX-R2:

- Confirm from FE-R1 whether the components truly overlap in the tree (same parent using both) or serve different islands
- Confirm from FE-R2 whether they share state access patterns (both read `selectedNodeIds`) or are fully independent
- Decide: `consolidate now` | `consolidate later` | `keep separate` | `delete one`

Decision criteria:
- If two components render the same visual output with different prop interfaces → consolidate
- If two components look similar but serve different state contexts → keep separate, add comment
- If one component is a subset of another (simpler version) → make it a variant of the richer one
- If a component is used nowhere (from FE-R1) → delete

---

### Task 2 — Hook duplication

From FE-R2's hook map: are there hooks with overlapping responsibilities?

Example to look for:
- Multiple hooks reading `StageContext.selectedNodeIds` and deriving similar "active node" objects
- Multiple hooks managing open/close state for similar popover patterns

For each overlap: recommend one canonical hook and which other hooks should delegate to it.

---

### Task 3 — Atom extraction candidates

From FE-R1's leaf atom list, rank by:
1. Used in 3+ different islands (high value to extract — shared across all)
2. Has zero context dependencies (safe to move)
3. Has a clear prop interface (not over-coupled to parent)

These become the P2 extraction priority list.

---

### Task 4 — File deletion candidates

From FE-R1: components that are imported nowhere (0 consumers). List them.
From UX-R2: CSS classes used nowhere (0 consumers). Already in UX-R2, cross-reference here.

Combined: list of files and classes that can be deleted without any consumer update.

---

## Output Format

```markdown
# FE-R3: Duplication + Consolidation Map

## Component Duplication Groups

### Group 1 — Badge/Status display
Components: StatusBadge.tsx, LockBadge.tsx, .readiness-badge-* (CSS classes)
Visual overlap: Yes (all are small rounded coloured pills with text)
State overlap: None (all are purely presentational, no context access)
Used in islands: StatusBadge in 4 islands, LockBadge in 2, CSS classes in 3
Recommendation: CONSOLIDATE — create <Badge status variant size> atom
Risk: Low (no context deps, pure display)

### Group 2 — Pill chip elements
Components: .stage-tab, .island-toggle, .channel-pill, .field-indicator (CSS classes)
Visual overlap: Yes (similar shape, similar border treatment)
State overlap: Partial (.stage-tab has active state, others don't)
Recommendation: CONSOLIDATE into <Chip active> atom; variants handle active/default
Risk: Medium (need to verify click handlers don't assume className structure)

### Group 3 — CardShell vs StagePhaseCard
Components: .card-shell (global CSS + extracted in P2), .stage-phase-card (global CSS)
Visual overlap: High (both are glass cards with border)
State overlap: .card-shell has 4 state variants (selected, ready, incomplete, blocked); .stage-phase-card has none
Recommendation: KEEP SEPARATE — different contexts (kanban/timeline cards vs stage overview cards)
Reason: Stage overview cards never have selection state; forcing them into CardShell with state=undefined would be confusing

## Hook Duplication

### useActiveNode vs useEditorDraft
Both read selectedNodeIds and nodes from StageContext
Overlap: both derive "which node is being edited"
Recommendation: useEditorDraft should call useActiveNode internally; don't have both independently reading the context

## Atom Extraction Candidates (ranked)

| Component | Used in N islands | Context deps | Safe to extract | Priority |
|---|---|---|---|---|
| StatusBadge | 4 | None | Yes | P1 |
| DividerLine | 6 | None | Yes | P1 |
| LockBadge | 2 | None | Yes | P1 |
| PopoverShell | 3 | None | Yes | P2 |

## Deletion Candidates

### Unused component files (0 imports found)
| File | Last known purpose | Safe to delete? |
|---|---|---|
| src/components/auth/LoginRedirect.tsx | Route redirect — superseded? | Verify then delete |

### Dead CSS classes (from UX-R2 — confirmed no consumers)
[cross-reference list from UX-R2]

## PO Decisions Required Before P2

☐ Group 1 (Badge): consolidate into single atom — confirm
☐ Group 2 (Chip): consolidate — confirm or keep separate?
☐ Group 3 (Cards): keep separate — confirm
☐ Deletion list: confirm all candidates are safe to delete
☐ auth/ files: confirm unused — delete or keep?
```

---

## Acceptance Criteria

- [ ] Every UX-R2 duplicate pattern group addressed with a consolidate/keep/delete decision
- [ ] Hook duplication section covers all hooks with overlapping context reads
- [ ] Atom extraction list ranked and prioritised
- [ ] Deletion candidates list is cross-referenced with both FE-R1 (zero consumers) and UX-R2 (dead CSS)
- [ ] PO decision checklist at end is complete and specific
- [ ] No source file changed
