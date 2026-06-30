---
sprint: UX2-R3
plan: ux-discovery-v2
title: Visual System Synthesis
status: completed
requires: UX2-R1, UX2-R2
output: output/UX2-R3-synthesis.md
executor: Codex / opencode
---

# UX2-R3 — Visual System Synthesis

## Context (read before starting)

This sprint synthesizes the UX2-R1 and UX2-R2 outputs into an actionable spec for `folder-structure-v2`.
It does not run any new scans — all evidence comes from the outputs of the two parallel sprints.

**Do not start this sprint until both `docs/plans/drafted/ux-discovery-v2/output/UX2-R1-token-status.md` and `docs/plans/drafted/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md` exist.**

> **CSS modules are explicitly rejected.** The expired `src-structure-refactor` plan rejected CSS modules
> as incompatible with the Tailwind-first architecture. Do not re-recommend CSS modules.

Prior art files to read in Step 2:
- `docs/plans/expired/ui-ux-discovery/output/UX-R3-style-synthesis.md` — v1 synthesis (for comparison)
- `docs/plans/expired/src-structure-refactor/plan/README.md` — documents why CSS modules were rejected and which UX-R3 recommendations were challenged

> Do not modify any source file. This is a read-only synthesis sprint.

---

## Steps

### Step 1 — Session environment check

**Run:**
```bash
bash scripts/agent/build-current-state.sh
bash scripts/agent/verify-tooling-state.sh
```

**Log:** paste both outputs under `## Session Environment` in your progress log. Confirm UX2-R1 and UX2-R2 output files exist:
```bash
test -f docs/plans/drafted/ux-discovery-v2/output/UX2-R1-token-status.md && echo "R1 OK" || echo "R1 MISSING — do not continue"
test -f docs/plans/drafted/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md && echo "R2 OK" || echo "R2 MISSING — do not continue"
```

If either is missing, stop and wait for the parallel sprint to complete.

---

### Step 2 — Read all required inputs

Read each file in full before continuing. Do not skip any.

- Read `docs/plans/drafted/ux-discovery-v2/output/UX2-R1-token-status.md` (hardcoded colors, dead tokens)
- Read `docs/plans/drafted/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md` (CSS classes, duplication groups)

> **Arbitrary Tailwind list:** if UX2-R1 references `/tmp/ux2-r1-arbitrary-*.txt` instead of
> embedding the full list, use `## 3 — Arbitrary Tailwind values (full list)` from UX2-R2 — it
> contains the same data and is durable.
- Read `docs/plans/expired/ui-ux-discovery/output/UX-R3-style-synthesis.md` (v1 synthesis — compare, do not copy)
- Read `docs/plans/expired/src-structure-refactor/plan/README.md` (which v1 recommendations were rejected and why)

**Record for Step 3:** the exact pre-P1 raw hex count (269), the exact post-P1 count from UX2-R1.
**Record for Step 4:** the 5 pre-P1 duplication groups from UX-R2, the post-P1 status from UX2-R2.

---

### Step 3 — Calculate P1 completion delta

Using numbers from Step 2, compute:

```
Raw hex remaining   = UX2-R1 "Summary → Raw hex values → Post-P1"
Raw hex reduction % = ((269 − remaining) / 269) × 100
Tokens still needed = UX2-R1 "Token gaps" section — count of gaps
Dead tokens         = UX2-R1 "Dead tokens" section — count
```

Write these 4 numbers down. They go directly into the output `## P1 completion status` section.

---

### Step 4 — Identify remaining duplication and cleanup work

Using UX2-R2 output from Step 2:

- Which of the 5 pre-P1 duplication groups still exist? Which were resolved?
- How many dead CSS classes remain? (Was 48, now N)
- Which single-owner CSS classes are candidates to inline as Tailwind utilities?

Write these lists down. They go into `## Remaining visual duplication` and `## Dead CSS cleanup`.

---

### Step 5 — Build the rejected-approaches list

From the `src-structure-refactor` README read in Step 2, extract every v1 UX recommendation that was explicitly rejected or modified. At minimum:

- **CSS modules**: rejected — build complexity, Tailwind-first project
- Any other rejections documented in that README

Write one bullet per rejected approach with the reason.

---

### Step 6 — Write recommendations and output file

Using the data from Steps 3–5, write `docs/plans/drafted/ux-discovery-v2/output/UX2-R3-synthesis.md` with this exact structure:

```markdown
# UX2-R3 — Visual System Synthesis
Date: YYYY-MM-DD | Agent: <name>

## Session Environment
[paste build-current-state.sh output here]

## P1 completion status
| Metric | Pre-P1 | Post-P1 | Delta |
|--------|--------|---------|-------|
| Raw hex values | 269 | N | ±N (N% reduction) |
| Token gaps remaining | N/A | N | — |
| Dead tokens | N/A | N | — |

What P1 claimed vs what the scan shows:
[2–4 sentence comparison — specific, no vague language]

## Remaining token work (folder-structure-v2 P1)
Numbered list. Each entry must have:
1. What to do (specific token name or pattern to create)
2. Files affected (file paths)
3. Acceptance criterion (the grep command that confirms done)

## Remaining visual duplication (folder-structure-v2 P2)
| Group | Components | Recommended resolution |
|-------|------------|----------------------|
[For each surviving duplication group from UX2-R2]

## Dead CSS cleanup (folder-structure-v2 P1)
[Class names to delete — full list from UX2-R2]
Include: `grep -r "class-name" src/ --include="*.tsx" | wc -l` = 0 as acceptance criterion for each.

## Rejected approaches (do not re-propose in folder-structure-v2)
[From Step 5 — at minimum: CSS modules]

## folder-structure-v2 P1 task list
Numbered tasks. Each task must include:
- File(s) to change
- Specific change (token name, class to delete, etc.)
- Acceptance criterion (runnable command)

## folder-structure-v2 P2 task list
Numbered tasks. Each task must include:
- Component(s) to change
- Specific change (merge, split, rename)
- Acceptance criterion
```

---

## Acceptance criteria

- [x] Synthesis uses only UX2-R1 and UX2-R2 outputs — no new source file reads
- [x] P1 completion status includes the before/after hex count and % reduction
- [x] folder-structure-v2 task lists are numbered, specific, and each has a runnable acceptance criterion
- [x] Rejected approaches section present with CSS modules listed and reason given
- [x] Output written to `docs/plans/drafted/ux-discovery-v2/output/UX2-R3-synthesis.md`
- [x] No source files changed

## Gates

| Gate | Status | Reason |
|------|--------|--------|
| typecheck | N/A | no code changed |
| lint | N/A | no code changed |
| validate:architecture | N/A | no code changed |
| test | N/A | no code changed |
| browser | N/A | no code changed |
| verify-tooling-state.sh | Required | run in Step 1 |
