---
name: dcx-manifestation-reconcile
description: Run the changed-file reconciliation and completion-gate check before closing work that touched manifestations. Use this skill when a sprint is about to close and any file was created, edited, or moved that could be a manifestation of a requirement. Also trigger proactively when the user says "done", "close the sprint", "verify my change", or when changed files include components, hooks, services, tests, scripts, or rules.
---

<!-- Claude adapter — canonical source: agent-skills/dcx-manifestation-reconcile/SKILL.md -->
<!-- This file adds Claude-specific MCP and hook context. -->
<!-- To update this skill, edit agent-skills/dcx-manifestation-reconcile/SKILL.md and run: bash scripts/agent/sync-skills.sh -->


# DCX Manifestation Reconcile

This skill wraps the RS-R3 reconciliation engine's change-triggered check and
the completion gate. It answers: does every changed manifestation trace to an
approved requirement (or have a valid exemption)? Are existing traces still
valid? Does bottom-up justification succeed?

## When to use

- Before closing any sprint that changed source files
- When the user says "done", "close the sprint", "verify my change"
- When changed files include: components, hooks, services, actions, rules,
  tests, scripts, validators, skills, generated views, or documentation
- When the completion gate (`req:completion-gate`) is invoked

## Step 1 — Identify changed manifestations

```bash
# List changed files since the last known state
git diff --name-only HEAD 2>/dev/null || find src/ -newer <last-session-marker> -type f

# Or use the completion gate directly
npm run req:completion-gate -- --changed <file1> <file2> ...
```

If you don't have a specific file list, run the inventory mode to see what
currently exists:
```bash
npm run req:reconcile -- --mode inventory
```

Filter the changed files to only those that are **meaningful manifestations** —
exclude:
- Generated artifacts (types, compiled output, lockfiles)
- Pure CSS/Tailwind changes (unless they affect a distinct visual surface)
- Configuration files (tsconfig, eslint, prettier, postcss)
- Build/tooling config (vite, vitest)
- Package.json dependency updates
- README, changelog, or documentation-only changes

## Step 2 — Run the completion gate

```bash
npm run req:completion-gate -- --changed <meaningful-changed-files>
```

The gate returns one of:
- `PASS` — all manifestations trace to approved requirements
- `PASS_WITH_QUEUED_REVIEW` — ambiguous manifestations routed to review queue;
  no product-truth mutation detected
- `BLOCKED` — manifestations with no requirement link, broken traces, or
  failed validators. Blocked means the sprint cannot close.

## Step 3 — Handle issues

### If BLOCKED: missing requirement link

For each manifestation with no link, determine whether it is:

1. **Intentional technical work** (refactor, extraction, migration, tooling):
   Add an exemption entry to the ledger with category, reason, and owner.

2. **New behavior with no requirement**:
   Run `dcx-requirement-intake` to propose a new requirement.

3. **Existing behavior whose requirement link broke** (file moved/renamed):
   Update the TraceLink with the new path.

### If BLOCKED: stale evidence

When a changed manifestation invalidates existing evidence:

```bash
npm run req:trace -- --from <affected-requirement-id>
```

This shows what evidence exists and which is now stale. Record the stale
evidence in the review queue.

### If BLOCKED: validator failure

```bash
npm run req:validate
```

Fix all blocking validation errors before retrying the completion gate.

### If PASS_WITH_QUEUED_REVIEW

Review the queue entries in:
```
docs/product/requirements/graph/generated/queues/candidate-link-awaiting-confirmation.json
```

For each queued item, determine if it can be promoted to a confirmed TraceLink
or if it needs PO attention. If PO attention is needed, log it in the session
log with `PO-Action: pending`.

## Step 4 — Run bidirectional answerability

After the completion gate passes, confirm bidirectional answerability:

```bash
# Top-down: requirement → manifestation
npm run req:trace -- --from <requirement-id>

# Bottom-up: manifestation → requirement
npm run req:justify -- --manifestation <manifestation-id>
```

Both directions should succeed for every changed manifestation and every
affected requirement. If either direction fails, the completion gate is
re-opened as BLOCKED.

## Step 5 — Log the result

```
## Manifestation Reconciliation — <sprint-id>

**Gate result:** PASS / PASS_WITH_QUEUED_REVIEW / BLOCKED

**Changed files:** <count>
**New manifestations:** <count>
**Updated traces:** <count>
**Stale evidence:** <count>
**Queued items:** <count>

**Issues:** <summary or "None">
```

If blocked, include the specific blocking issues and what must be resolved.

## Output format

Session log entry with gate result, changed manifestation summary, and
any open issues. If the gate is PASS or PASS_WITH_QUEUED_REVIEW, the sprint
may proceed to close. If BLOCKED, the sprint must not be marked Completed.

## Opportunistic calibration-debt cleanup (RS-R11.2)

The graph runs in **test/calibration mode** — first-population data carries known debt (duplicate MAN
identities, ~238 unconfirmed RS-R7 candidate links, 223 unlinked manifestations). When reconciliation
surfaces such debt, **clear it opportunistically without blocking the current task**:

- Duplicate identity/alias → record in `graph/views/rs-r7-deferred-cleanup-queue.md` or
  `req:propose --type supersede-node`.
- Unlinked manifestation → propose a candidate link or a typed `Exemption`.
- Weak/wrong/stale link → flag in `candidateLinksAwaitingConfirmation` / `staleBrokenTraces`.
- **Anything touching locked/approved product truth → `req:propose` + PO confirmation only; never a
  silent edit (`core.md §35b`).** No link or coverage score authorizes a `src/**` change.

Full convention + workflow table: `docs/plans/active/requirements-system/output/RS-R11-reground-brief.md` §5.

## Verification

- [ ] `npm run req:completion-gate -- --changed <files>` returns PASS or
  PASS_WITH_QUEUED_REVIEW
- [ ] `npm run req:validate` passes with 0 violations
- [ ] Every new manifestation has a TraceLink or exemption
- [ ] Bottom-up justification succeeds for each manifestation
- [ ] Top-down trace succeeds for each affected requirement
- [ ] Stale evidence is queued or updated
- [ ] Review queue items have a note about what PO action (if any) is needed

---
## Claude-specific additions

### MCP tools available
- **playwright** (global) — use for browser-verifiable acceptance criteria
- **chrome-devtools** (global) — use for runtime/console/network inspection
- **context7** (global) — use before writing code that depends on a versioned library
- **eslint** (.mcp.json) — use for interactive lint rule explanation and repair
- Storybook / Semgrep / SonarQube / Shadcn — see .mcp.json (disabled; setup required)

### Deferred tool loading
Use ToolSearch to load MCP tool schemas only when needed. Do not load all tools eagerly.
