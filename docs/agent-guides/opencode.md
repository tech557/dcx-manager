# opencode — Agent Guide

**Status:** ✅ Active — implementation sprints. Read the re-engagement conditions below before each sprint.

## Role in this project (when active)

Implementation sprints only. opencode produces correct code and respects architectural boundaries. It must not self-certify completion of visual or browser-dependent acceptance criteria.

## Known strengths (from session 2026-06-25)

- Correctly applies nested traversal helpers without being told to re-read the pattern
- Respects Codex plan-review concerns (level boundaries, shared helpers, union type handling)
- Accurate `wc -l` line counts in logs
- Proactively flags pre-existing cap violations it did not introduce
- Typecheck and verify.sh gates consistently pass

## Known failure modes (from session 2026-06-25)

### 1. False acceptance on unit tests
opencode claimed PASS on unit test criteria without writing the tests. Both NLC.5 (mixed-kind drag) and NLC.6 (linked-date readiness) acceptance criteria required new tests — neither was written. The overall vitest suite still passed because existing tests were unrelated.

**Mitigation:** When a sprint criterion says "unit test added," explicitly name the test file and describe one assertion before starting. After implementation, grep for the test function name to confirm it exists.

### 2. Browser verification skipped
Neither FIX-DEN nor FIX-NLC included browser manual checks despite both sprints requiring them. opencode listed them as "needs manual verification" in open issues rather than completing the gate.

**Mitigation:** If a sprint has a browser gate, require a screenshot or explicit browser log line before marking Completed. If the agent does not have browser access, it must state so in the log and leave the sprint marked Partial until a human verifies.

### 3. Log line count format
FIX-DEN log wrote "1 line, was 120" meaning "changed 1 line in a 120-line file." The log format requires the current total line count, not the number of lines edited.

**Mitigation:** Always write `(N lines, was M)` where N = current `wc -l` output.

## Startup checklist

Read in order before writing any code:

1. **Read AGENTS.md** — the routing header. Then read the files it points to.
2. **Read `docs/agent-rules/core.md` completely.** Pay special attention to §4 (UI-churn), §5 (boundaries), §6 (file size caps), §11 (gates), §14 (absolute constraints), §15 (nested node rule), §16 (stub ≠ complete), §18 (wc -l gate), §19 (polish CSS-only), §20 (reduced motion).
3. **Read `docs/agent-rules/log-format.md`** — the identity block and log template.
4. **Read this file** — your guide (strengths, failure modes, re-engagement conditions).
5. **Read the sprint file.** Read every task and every acceptance criterion before opening any source file.
6. **Check what already exists.** Before creating anything: (a) does a helper exist in `src/utils/node.helpers.ts`? (b) does a shell already cover this? (c) does this hook exist in `src/hooks/`? Only create if nothing matches.
7. **For every acceptance criterion that says "unit test added":**
   - Name the test file and function before starting implementation.
   - Write the test. Run `npx vitest run` (not `npm test` — no test script exists).
   - Confirm the new test appears in the output by name before claiming PASS.
8. **For every browser gate:**
   - If you have browser access: complete the check and describe what you saw (not what you expected to see).
   - If you do not have browser access: write "Browser gate: BLOCKED — no browser access" in the log and mark the sprint Partial, not Completed.
9. **Run `wc -l` on every file you changed.** Include the number in the log as `(N lines, was M)`. If any file exceeds the hard cap (250 lines for components, 200 lines for hooks), split it before claiming completion.
10. **Do not mark a sprint Completed if any acceptance criterion has a □ (unchecked box).** A PASS means verified, not assumed.

## Task handoff format

For the next agent, produce:
- Complete changed files — not patches or diffs
- Paths to all files created or edited, with `wc -l` counts
- A list of every import or consumer that may need updating
- The progress log entry with identity block

## Re-engagement conditions

opencode may resume implementation work only when:
1. It reads AGENTS.md routing header + core.md + this guide in full before touching any code
2. It does NOT update `docs/plans/active/builder-refactor/README.md` sprint status — only Claude or the product owner does that
3. Browser verification checkboxes are left OPEN — opencode marks them "BLOCKED: no browser access" and stops; it does not invent a PO override
4. Any skipped acceptance criterion must state a specific blocker, not be silently passed
5. Sprint status is set to "Code complete — awaiting external verification" — never "Completed"

## What opencode should NOT do

- Do not use `npm test` — use `npx vitest run`
- Do not call `nodes.find(n => n.kind === 'task')` — use `getAllTasks()` from `@/utils/node.helpers`
- Do not import `src/rules/` in card templates — use `behavior.readiness`
- Do not import `src/services/` in islands, cards, or stage
- Do not change interaction logic in a visual polish sprint
- Do not use `console.log` as an integration stub and call it complete
- Do not mark a unit test criterion PASS without the test existing in a test file

## Log identity block

Every log must open with:

```
Agent: opencode
Model: [exact model name]
Provider: opencode
Date: YYYY-MM-DD
```

Without this block the log is incomplete per log-format.md §0.

## Current sprint status (as of 2026-06-25)

| Sprint | Status |
|--------|--------|
| FIX-NDX | ✅ Completed (Codex) |
| FIX-CRD | ✅ Completed (Codex) |
| FIX-DEN | ⚠️ Code complete — browser gate outstanding |
| FIX-NLC | ⚠️ Code complete — 2 unit tests and browser gate outstanding |
| FIX-FIL | ✅ Completed |
| FIX-MOT | ✅ Completed |
| FIX-CAP | ✅ Completed |
| FIX-POL | ✅ Completed |
| B13 | ✅ Completed |
| BUG-KAN | ✅ Code complete — browser gate outstanding |
| BUG-WIDE | ✅ Code complete — browser gate outstanding |
| BUG-ISL | ✅ Code complete — browser gate outstanding |
| BUG-STAGE | ✅ Code complete — browser gate outstanding |
