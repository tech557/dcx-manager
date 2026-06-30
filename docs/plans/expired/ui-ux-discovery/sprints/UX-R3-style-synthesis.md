---
sprint: UX-R3
plan: ui-ux-discovery
title: Style Pattern Synthesis
status: not-started
depends-on: UX-R1 and UX-R2 (both must be complete)
output: docs/plans/drafted/ui-ux-discovery/output/UX-R3-style-synthesis.md
assigned-to: Claude (read-only synthesis — no terminal required)
---

# UX-R3 — Style Pattern Synthesis

## Intent

Read UX-R1 (token inventory) and UX-R2 (component CSS map) and produce a final synthesis that:
1. Defines the exact token set P1 should implement (no more, no less)
2. Lists the exact component extractions P2 should make
3. Lists the dead code P2 should delete
4. Flags any design inconsistencies that need a PO decision before P2 runs

This is a judgement document. It translates raw data into recommendations. No code is written.

---

## Input Files

1. `docs/plans/drafted/ui-ux-discovery/output/UX-R1-token-inventory.md`
2. `docs/plans/drafted/ui-ux-discovery/output/UX-R2-component-css-map.md`

Do not read session logs as input. Do not read source code — trust the research output.

---

## Synthesis Tasks

### Task 1 — Define the final token set for P1

From UX-R1 data, produce the definitive list of tokens P1 must create:

For each category (colour, typography, spacing, radius, shadow):
- Token name (proposed in UX-R1)
- Raw value
- Usage count in codebase
- Whether it replaces something in `tokens.ts` or is net new
- Priority: `required` (used 5+ times) | `recommended` (2–4 uses) | `optional` (1 use)

Do NOT include tokens for values used only once unless there is a semantic reason (e.g. a status colour used once is still semantically important).

---

### Task 2 — Design inconsistency flags

From UX-R1 and UX-R2 data, identify cases where the same semantic role has different values in different components. Examples:

- If `.card-shell` uses `border-radius: 2.2rem` but `PhaseCard` also has `rounded-[2rem]` in its JSX, those should be the same value — which is correct?
- If `.editor-input` uses `border-radius: 0.6rem` but `TextInputSmall` uses `rounded-lg` (0.5rem), those should be the same — which wins?
- If accent colour is `#75E2FF` in `tokens.ts` but some JSX files use `#79E4FF`, which is the correct value?

For each inconsistency: list the two conflicting values, which components use each, and what a PO decision would look like.

These are not bugs to fix in this sprint — they are decisions P2 cannot make without the PO.

---

### Task 3 — Component extraction priority list for P2

From UX-R2 data, produce a prioritised list of CSS class extractions for P2:

```markdown
## Extraction Priority List

### Tier 1 — Extract immediately (single owner, clear home)
These classes are used by exactly one component. Moving them to that component's folder is zero-risk.

| Class | Current location | Move to | Risk |
|---|---|---|---|
| .kanban-board | index.css | KanbanView.module.css | Low — 1 consumer |

### Tier 2 — Extract with shared atom (multiple users, shared design DNA)
These classes are used by multiple components that share visual DNA (identified in UX-R2 duplicate groups).
P2 creates a shared atom and all consumers switch to it.

| Classes | Unification atom | Consumers |
|---|---|---|
| .stage-tab + .island-toggle + .channel-pill + .field-indicator | <Chip> atom | 8 files |

### Tier 3 — Decision required before extracting
These classes are used by multiple components whose needs may diverge. Cannot unify without PO input.

| Classes | Conflict | Decision needed |
|---|---|---|
| .card-shell vs .stage-phase-card | Similar but stage card has no selected state | Does stage-phase-card become CardShell with no-selection variant, or stay separate? |
```

---

### Task 4 — Dead code inventory for P2

From UX-R2: list every CSS class with 0 usages. For each, state whether it is safe to delete or should be investigated first.

---

### Task 5 — Responsive design gap

From UX-R1 and UX-R2: document how much of the current UI has zero responsive behaviour.

Questions to answer:
- What percentage of component files have no `@media` query or Tailwind breakpoint class?
- Are there any components that already respond to breakpoints? (If yes: how do they do it? That pattern becomes the standard.)
- What is the minimum responsive contract for DCX Manager? (Does it need to work at 768px? 1024px? Desktop-only is a valid choice if it's intentional.)

This section is a question, not a directive. The PO answers it before P2 runs.

---

## Output Format

`docs/plans/drafted/ui-ux-discovery/output/UX-R3-style-synthesis.md`

```markdown
# UX-R3: Style Pattern Synthesis
Generated: YYYY-MM-DD
Based on: UX-R1-token-inventory.md, UX-R2-component-css-map.md

## Final Token Set for P1

### Colour tokens to add
[table]

### Typography tokens to add
[table]

### Spacing tokens to add (used 5+ times)
[table]

### Tokens already in tokens.ts that need CSS var bridging
[table]

### Tokens in tokens.ts that are dead (defined but never used in JSX/CSS)
[table]

## Design Inconsistencies — PO Decision Required
[one section per conflict, with recommended resolution]

## Component Extraction Priority for P2
[Tier 1 / Tier 2 / Tier 3 tables]

## Dead CSS Classes — Safe to Delete
[list]

## Responsive Design Gap
- Components with no responsive behaviour: N/M (N%)
- Existing responsive patterns found: [list or "none"]
- Minimum breakpoint contract recommendation: [state the recommendation and why]

## PO Decisions Required Before P2 Starts
☐ [inconsistency 1 — two values, which wins?]
☐ [inconsistency 2 — …]
☐ Responsive contract: is this desktop-only intentionally, or must it work at [X]px?
☐ Tier 3 component unification decisions
```

---

## Acceptance Criteria

- [ ] Output file exists with all 5 sections
- [ ] Token set section covers all four categories (colour, typography, spacing, radius) with usage counts from UX-R1 data
- [ ] At least one inconsistency flag documented (if UX-R1 finds any)
- [ ] P2 extraction list has at least Tier 1 and Tier 2 populated
- [ ] Responsive gap section answers all three questions
- [ ] PO decision checklist at end covers all open questions
- [ ] No source file changed
- [ ] Session log written and references output file
