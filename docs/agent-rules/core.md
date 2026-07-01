# Core Rules — DCX Manager v0.2.18

**Read this file completely before writing any code. Read §4 (UI-Churn) twice.**

Every rule here is derived from observed agent behaviour across 50+ sessions. When a rule seems strict, that exact pattern already caused damage in this project.

---

## §1. What This Project Is

DCX Manager is a campaign-planning workspace.

```
Project → DCX/Campaign → Version → Phase → Action → Task → Subtask
                                                     ↑
                          Task is created via Channel + ChannelComposition
                          which auto-names it and generates Subtask instances
```

Builder layout — three rows, fullscreen canvas (frozen — see §10):
```
Row 1  Header:  HeaderBrandIsland | MetadataIsland | HeaderUserIsland
Row 2  Stage:   EditorViewerIsland (left) | StageCore (center) | FocusIsland (right)
Row 3  Footer:  SelectionIsland | KanbanBuilderIsland/TimelineBuilderIsland | ViewHelperIsland
```

---

## §2. Documentation Authority Order

When sources conflict, higher wins:

```
1. docs/product/requirements/builder/   Confirmed product requirements
2. docs/product/decisions/              Approved product decisions
3. docs/plans/active/                   Active sprint plans (current work)
4. docs/architecture/builder/           Architectural contracts
5. Existing code                        What is already implemented
6. docs/progress/                       Historical record only — never overrides requirements
```

Drafted and completed plans have no authority over code. See §24 for the full plan lifecycle.

See `AGENTS.md` (routing header) for the "Where things live" table.

### Requirement ID format
`BLD-[AREA]-[NNN]` (e.g. BLD-FIL-001). Cite in: sprint task files, code comments where they influence implementation, and progress log entries under "Requirements covered." **Progress logs never override requirements or approved decisions.**

---

## §3. How to Work in One Session

1. Read this file.
2. Write the identity block at the top of your log entry before touching code (see log-format.md).
3. Read `docs/progress/` master log to understand current state.
4. Read only the sprint task file for your task.
5. Work only on files in scope.
6. Run the three gates (§6) or provide the agent-without-terminal checklist.
7. Append a complete log entry (see log-format.md).

---

## §4. The UI-Churn Problem — The #1 Failure Mode

Auditing 50+ sessions found the same cycle: an agent redesigns a working component → a later agent undoes it → a third agent rebuilds it differently.

**4.1** — Check before you change. Read the file first. State why your change is not redoing prior work.  
**4.2** — No redesign without a requirement ID or a direct user quote.  
**4.3** — One file, one task, then stop. Do not return to the same file in the next task.  
**4.4** — Deletion is a planning failure. If you delete something a previous task created, log it under "Churn — work reversed."  
**4.5** — No experimental variants beside the real component.

---

## §5. Preserve-Semantic Boundaries

These systems define architectural contracts. They must not be changed in ways that violate their semantics. **Controlled additions required by an approved task are allowed.** What is not allowed: removing semantics, creating parallel systems, or bypassing the contracts.

| System | Semantic contract |
|---|---|
| `rules/readiness.rules.ts` | Single source of readiness — never compute readiness in UI |
| `actions/` (all files) | All builder mutations through named commands — never setNodes from cards/islands/stage |
| `services/api-mappers.ts` | Never skip the mapping layer — never pass domain types to services with `as any` |
| `brand/tokens.ts` | Single visual constant source — no hardcoded hex elsewhere |
| `ui/motion/effects.registry.ts` | All named effects — never create parallel animation systems |
| `builder/cards/card.registry.ts` | Card config source — extend OK; break existing config is not OK |
| `builder/stage/StageProvider.tsx` | Stage-level state only — island state must not live in stage context |
| `builder/islands/BuilderIslandShell.tsx` | Shared island animation chassis — do not create alternatives |
| `hooks/useAutosave.ts` | Correct mapper call (domainPhasesToApi) — do not regress |

---

## §6. File Size Rules

| File type | Target | Hard cap |
|---|---|---|
| React component (`.tsx`) | ≤ 150 lines | **250 lines** |
| Custom hook (`use*.ts`) | ≤ 120 lines | **200 lines** |
| Actions / service / rules | ≤ 150 lines | **250 lines** |
| Registry / config (pure data) | ≤ 200 lines | **400 lines** |
| `brand/index.css` | no cap | no cap |

A file over the hard cap must be split before committing. No self-granted exceptions.

---

## §7. Before Creating Any File

```
1. Does this UI atom exist in src/ui/?                → import it
2. Does a shell already cover this?                   → use BuilderIslandShell, GlassSurface, CardShell
3. Does this hook exist in src/hooks/?                → use useTheme, usePermissions, usePreferences
4. Does this type exist in src/types/?                → import it; never redefine locally
5. Does this util or action already exist?            → import it; check component_registry.json
6. None matched → create the file                     → apply §6 rules; apply §8 placement
```

---

## §8. Folder Placement

```
src/ui/surfaces/        L1 glass primitives
src/ui/motion/          L1 animation system
src/ui/                 L2 UI atoms (StatusBadge, LockBadge, DividerLine)
src/components/forms/   L3 form elements
src/components/         L3 shared non-builder components
src/builder/cards/      L4 card chassis
src/builder/cards/templates/  L5 card templates
src/builder/islands/BuilderIslandShell.tsx  L6 island chassis
src/builder/islands/<Name>/   L7 island content
src/builder/stage/      L8 stage system
src/pages/              L9 page orchestrators
src/actions/            mutations (via useBuilderActions only)
src/services/           integration seams
src/rules/              business logic
```

Import only from equal or lower levels. Never import upward.

---

## §9. The Five Boundaries

**9.1 Action boundary:** Cards, islands, stage, dropzones never call `setNodes` or import from `src/services/`. All mutations go through `useBuilderActions()`.

**9.2 Readiness boundary:** Card templates never import logic from `src/rules/`. Readiness comes via `useCardBehavior()`.

**9.3 Theme boundary:** Never read `themeMode` from `useAppStore` directly. Use `useTheme()`.

**9.4 Mapper boundary:** Never pass domain types to services with `as any`. Write the mapper.

**9.5 No global side-channels:** Use StageProvider context or builderStore for inter-component communication. Never `window.dispatchEvent` for component-to-component.

---

## §10. Builder Layout Contract — Frozen

The three-row grid is stable. Do not change the row structure or layout strategy.

Island layout contracts:
- `EditorViewerIsland` → pushes stage (stage narrows)
- `StickyPopupShell` → floats above stage (no layout effect)
- `FocusIsland` → filters visibility (does not move anything)
- Bottom islands → `h-14` row, same visual register

---

## §11. Session Gates

**With terminal access:**
```bash
npm run typecheck        # 0 errors, 0 suppressions
npm run dev              # app starts
bash scripts/verify.sh   # no forbidden patterns
```

**Without terminal access:**
Return complete files + list of all changed imports + manual validation checklist for the product owner.

A React controlled/uncontrolled input warning or console error is a failed gate even if typecheck passes.

---

## §12. Animation — One System, One Library

- `motion` (Framer) only for component and layout animation, through `src/ui/motion/effects.registry.ts`
- `gsap` is no longer used (TargetCursor was removed in a previous session)
- Never import `gsap` into builder cards, islands, or stage components
- All motion comes from named effects in the registry

---

## §13. Home and Version Pages

These pages have placeholder routes and are not part of the active builder refactor plan.

Do not import builder internals: `BuilderIslandShell`, `StageProvider`, `builderStore`, `useBuilderActions`, `GlassSurface` into these pages.

---

## §14. Absolute Constraints

- Never create `src/types.ts`
- Never use `'Ready for Review'`, `'Rejected'`, `'Placed'` as status values
- Never use `as any` at a service boundary — write the mapper
- Never import `src/services/` in cards/islands/stage
- Never import `src/rules/` logic in card templates — use `behavior.readiness`
- Never read `themeMode` from `useAppStore` directly — use `useTheme()`
- Never use `window.dispatchEvent` for component-to-component communication
- Never redesign the three-row builder layout — fix CSS inside it
- Never add decorative features without a requirement ID
- Never invent a file-size exception — over the hard cap means split
- Never commit a log entry without Agent/Model/Provider
- Never silently decide open questions (❓) — use temporary default and label ⏱
- Never replace or discard an unsaved editor session silently ✅ BLD-EDT-002

---

## §15. The Nested Node Rule — #2 Failure Mode (discovered audit 2026-06-25)

**This rule is mandatory. Violating it caused 6 sprints to fail their acceptance criteria.**

The runtime builder state is a **tree**, not a flat list:

```
nodes: BuilderNode[]   ← contains ONLY PhaseNodes
  └── node.data.actionCards: ActionCardData[]
        └── action.tasks: TaskCardData[]
```

**NEVER** search for Actions or Tasks directly in `nodes`:
```typescript
// ❌ WRONG — returns undefined for any Action or Task id
nodes.find(n => n.id === taskId)
nodes.filter(n => n.kind === 'task')
```

**ALWAYS** use the traversal helpers from `src/utils/node.helpers.ts`:
```typescript
// ✅ CORRECT
import { findTask, findAction, getAllTasks, getAllActions, resolveNodeKind } from '@/utils/node.helpers';

const task   = findTask(nodes, taskId);         // nested search
const action = findAction(nodes, actionId);     // nested search
const kind   = resolveNodeKind(nodes, anyId);   // phase | action | task
const all    = getAllTasks(nodes);               // flat list of all tasks
```

Before writing any code that searches for an Action or Task by id or kind, ask: **am I using the node.helpers traversal functions?** If not, stop and use them.

---

## §16. Stub ≠ Complete

A feature whose integration point is `console.log(...)` is **not complete**. Do not mark a sprint as Completed if any acceptance criterion calls a stub. Stubs must be wired before the sprint is logged as Completed.

Specifically:
- Long press `onLongPress={() => console.log('open editor', id)}` means B-CRD is NOT complete.
- Any integration boundary that writes to console instead of calling the real action fails the gate.

---

## §17. Popup ≠ Modal

`TaskReadOnlyPopup` and all card-level popovers are **anchored** beside the card, not centered on screen. Requirements BLD-CRD-INT-004 / OD-004 confirm this.

Do not implement:
- `position: fixed` with `top: 50%, left: 50%, transform: translate(-50%, -50%)`
- A backdrop overlay on a card-level popup
- Full-screen modal behaviour for a read-only card popup

Do implement:
- `position: absolute` relative to the card container, or `position: fixed` using `getBoundingClientRect()` to anchor beside the card
- Edge-flip: if the popup would overflow the viewport right edge, flip it to appear on the left

---

## §18. wc -l Before Claiming Complete

Before writing a progress log entry, run `wc -l` on every file you changed or created. Include the output in the log under "Files created / edited." If any file exceeds the hard cap (§6), split it first — do not log the sprint as Completed with a cap violation.

---

## §19. Visual Polish Sprints — CSS Only

A visual polish sprint (B12, FIX-POL, or any sprint labelled "polish") may only change:
- CSS classes and Tailwind utilities
- Static JSX structure (no new state, no new hooks, no event handler changes)
- `brand/index.css` and `brand/tokens.ts`

Any change to a `.ts` hook, store, action, rule, or service belongs in a functional sprint, not a polish sprint. If you realise a visual goal requires logic, stop, document the logic change needed, and do it in a separate sprint first.

Visual polish sprints also require screenshot evidence in the progress log. Without screenshots, the sprint cannot be marked Completed.

---

## §20. Reduced Motion — Always Required

Any animation that responds to user interaction or view change must include a `prefers-reduced-motion` branch. Use `useReducedMotion()` from `framer-motion`. The reduced-motion variant must be a short fade (≤ 100ms) or instant switch — never a slide or scale.

This applies to: view transitions (B10 / FIX-MOT), card entrance effects (B4), receiving-child state (B-CRD), and any future motion added to the builder.

---

## §21. Layout Viewport Planning — #3 Failure Mode (discovered BUG-WIDE / BUG-ISL 2026-06-25)

Card and column widths must be planned against real viewport math, not assumed generous screen space. The target viewport is 1440px.

**The rule:** Before setting any `w-[Xpx]` on a repeating card or column, calculate how many fit in the available stage width.

Available stage width at 1440px:
```
1440 - 48 (p-6 canvas) - 16×2 (gap-4 between stage columns) - 72 (left col) - 72 (right col) = ~1216px
```
When editor opens: `1216 - 328 (25rem - 4.5rem) = ~888px`

At **360px**: 3.4 expanded cards fit at rest. Only 2.5 when editor is open. **Too few.**  
At **260px**: 4.7 cards at rest. 3.4 when editor is open. **Acceptable.**

**Rule:** No repeating card/column may use `w-[360px]` or wider. Maximum is `w-[260px]` for expanded card columns in this project. If a feature requires more width, discuss with PO before setting it.

**The overflow-visible trap:** Layout columns in BuilderPage use `overflow-visible` so island content (tooltips, pills) can paint outside the column. The canvas `overflow-hidden` is the outer clip. Any `absolute`-positioned element inside an `overflow-visible` column that exceeds the canvas boundary will be silently clipped. Before adding any `absolute`/`fixed` positioned element inside an island or stage column, confirm the clip boundary. If it needs to exceed the column, use `position: fixed` to escape the column stacking context entirely.

---

## §22. Island Boundary Rules

1. **SelectionIsland** must always have a `maxWidth` in its style prop. It lives in a `grid-cols-3` footer cell — if it grows unconstrained, it overlaps the center builder island. Max: `420px`.
2. **ViewHelperIsland** popup is `absolute` inside a 56px wrapper. If the popup is wider than ~200px, use `position: fixed` so it doesn't clip against the canvas `overflow-hidden`.
3. **EditorViewerIsland** session pill is `absolute` inside the left column. Only render the pill when the editor is expanded (`isExpanded = true`). At 72px collapsed width, a 200px pill overflows 64px each side into the stage.
4. **FocusIsland** expanded content must not exceed the 72px column. Use `absolute` only for tooltips and badges, never for primary content panels.

---

## §23. Layout State Signal Rule — #4 Failure Mode (discovered BUG-STAGE 2026-06-25)

When two layout consumers read different signals for the same concept, the one further from the source will always be one render behind. This causes a "split state" where one part of the layout shifts and another doesn't — visible to the user as a double jump.

**In this project:**
- `isEditorOpen` (StageProvider state, set via useEffect in `useEditorPanel`) is the authoritative signal for "editor panel is open"
- `focusedNodeId` (StageProvider state, set synchronously on click) is NOT the same thing — a focused node doesn't always mean the editor opens (day cards, for example)

**Rule:** Any layout element that needs to know "is the editor open" must read `isEditorOpen`, never `!!focusedNodeId`. Do not invent a new derived variable — import `isEditorOpen` from `useStageContext`.

**Corollary:** `setIsEditorOpen` must be gated to only fire when the editor will actually expand. If `EditorViewerIsland.isExpanded` uses `activeNode.kind !== 'day'`, then `setIsEditorOpen` must also exclude day-kind nodes.

---

## §24. Plan Lifecycle — Active vs Drafted vs On-hold vs Completed vs Expired

Plans live in one of five folders. The folder is authoritative; do not trust status labels inside a README if the folder location disagrees.

```
docs/plans/
  active/      ← agents execute work here
  drafted/     ← agents may READ only; no code changes
  on-hold/     ← PAUSED mid-flight; agents must NOT execute, draft, or resume until PO reactivates
  completed/   ← agents may READ only; archive of finished work
  expired/     ← agents must READ; reference prior art before starting replacement plan
```

### Active (`docs/plans/active/<plan-name>/`)
- Has sprint files with acceptance criteria.
- PO has confirmed scope and execution order.
- Agents execute sprints, write progress logs, and mark tasks done.
- A sprint is only complete when all acceptance criteria pass and gates (§11) pass.

### Drafted (`docs/plans/drafted/<plan-name>/`)
- The PO has named a future piece of work and may have described intent.
- No sprint files exist, or they are stubs without acceptance criteria.
- **Agents must not write code for a drafted plan.** Reading for context is allowed.
- A drafted plan becomes active when the PO moves it to `docs/plans/active/` and writes sprint files.

### On-hold (`docs/plans/on-hold/<plan-name>/`)  — added 2026-06-29
- A plan that was **active but is paused mid-flight** because a dependency, blocker, or upstream decision
  must be resolved first (e.g. its requirements base is being rebuilt).
- **Agents must NOT execute, draft new sprints for, resume, or re-audit an on-hold plan** — and must not
  treat its outputs as the current source of truth. It is parked precisely to **prevent confusion**.
- Its completed outputs remain readable as record, but may be **invalidated** by the work that paused it
  (the README's on-hold banner says what is blocking it and what it is waiting on).
- A plan returns to `active/` **only when the PO moves it back** and states the blocker is resolved.
- `build-current-state.sh` / session-start orientation must not list on-hold plans as active work.

### Completed (`docs/plans/completed/<plan-name>/`)
- All sprints finished. The plan is a permanent archive.
- **Agents must not resume or add sprints to a completed plan.**
- If a regression is discovered, the fix belongs in a new sprint under a new or existing *active* plan — not by reopening the completed one.

### Expired (`docs/plans/expired/<plan-name>/`)
- The plan's scope is being reworked with improved tooling, better discovery data, or a changed codebase.
- The plan's work may have been partially or fully executed, but the scope is being revisited.
- **Agents must not execute sprints from an expired plan.**
- **Agents MUST read the expired plan's README and output files before starting any replacement plan** that covers the same scope. Expired plans are the authoritative record of why the previous approach was taken and what it found — this prevents repeating mistakes.
- Each expired plan README has a `superseded-by:` field naming the replacement plan.
- The replacement plan's README has a `prior-art:` field naming the expired plan.
- When to read: every time the replacement plan's sprint file says "discovery", "audit", or "analysis" — check if an expired plan already has that output.

---

## §25. User-Initiated Tasks vs Active Plan Sprints

**Most agent sessions start with a user message, not a sprint file.** This is normal. Not every message refers to a plan. Agents must correctly classify each message before deciding how to respond.

### How to classify an incoming message

Read the first message of the session and ask: does it explicitly reference a sprint ID, a sprint file, or an active plan name?

- **Yes → Sprint task.** Read the sprint file in `docs/plans/active/`. Follow it exactly. Do not add scope.
- **No → User-initiated task.** Treat it as a direct instruction. Do not invent a sprint ID or reference a plan unless the user does.

If you are unsure, default to user-initiated. Never assume a plan is in scope unless the user or a sprint file says so.

---

### The four message types

| Type | Signals | How to handle |
|---|---|---|
| **Sprint execution** | References a sprint ID (SA-R1, SR-Z2 …) or says "work on the plan" | Read sprint file. Follow acceptance criteria. Write output to plan `output/` folder. |
| **User-initiated code change** | Direct instruction: "fix X", "add Y", "change Z" | Make the change. Log in session folder. Run gates if code changed. Do NOT attach to a plan unless user says to. |
| **User-initiated planning** | "let's plan…", "create a draft for…", "what should we do about…" | Write or update docs (plan README, draft, decision doc). No code changes. Log in session folder. |
| **User-initiated question / review** | "check the implementation of…", "is this good?", "why does X…" | Read and respond. Write findings to the plan `output/` folder if this is a sprint review; to session log if it's a standalone check. |

---

### Comparison table

| | Sprint task | User-initiated task |
|---|---|---|
| Source | Sprint file in `docs/plans/active/` | Direct message from PO |
| Has sprint ID | Yes | No — do NOT invent one |
| Output file required | Yes — in `output/<sprint-id>-<name>.md` | No — session log is enough |
| Gates required | Always | Only if code changed |
| Logged in plan README | Yes (mark sprint complete) | No |
| Scope | Exactly what the sprint file says | Exactly what the user said |
| Can close a sprint | Yes, when criteria pass | Never |

---

### Common mistakes to avoid

- **Do not wrap a user-initiated task in a sprint file** you created yourself. Sprint files are written by the PO or by an agent at PO direction.
- **Do not reference a plan in your session log** unless the user's message referred to that plan or sprint.
- **Do not run sprint-level gates** (typecheck, verify.sh) for a conversational message that asked you to check something or explain something.
- **Do not assume a drafted or completed plan is the context** for a message just because the topic is related. A user asking "what's the folder structure?" is not starting SA-R1.


---

## §26. Version Number — 4-Part Split Ownership (revised RG-R1, 2026-07-01)

The version is a 4-part `Major.Stage.Iteration.Revision` (e.g. `v0.3.5.0`). **PO owns Major and Stage
exclusively** (tied to an actual Staging/Production promotion). **The system/agents own Iteration and
Revision**, but only *mechanically* — via the classifier and CI wiring introduced in
`docs/plans/active/cicd-release-governance/` (RG-R1..RG-R3), never by an agent hand-picking a number.

**Rules:**
- Never increment, bump, or suggest a **Major** or **Stage** change in any output or plan — PO-only,
  triggered only by a real Staging/Production promotion.
- **Until the RG-R3 CI wiring exists**, treat `docs/VERSION.md` as still PO-maintained by hand (same as
  the pre-governance rule) — do not edit it or hand-pick an Iteration/Revision bump on your own
  initiative. Once RG-R3 lands, Iteration bumps on source changes and Revision bumps on non-source
  changes are mechanical (CI-driven), not agent-judged.
- Never run `scripts/version-bump.sh` on your own initiative outside the RG-governed mechanism.
- When writing `version_context` in a plan or log frontmatter, copy the exact value from `docs/VERSION.md` — do not derive or guess.
- If the PO says "the version is now vX.Y.Z.W", update only the `current` field in `docs/VERSION.md` to that exact value. Do not change anything else.
- If `version_context` in a plan frontmatter does not match the current version in `docs/VERSION.md`, note the mismatch but do not auto-correct it — ask the PO whether the plan should be updated.

---

## §26a. Release Governance (added RG-R1, 2026-07-01)

This project uses a mechanically-enforced release pipeline, defined in full in
`docs/plans/active/cicd-release-governance/README.md`. Summary for day-to-day work:

- **Operational record of truth:** `docs/releases/registry.csv` (RG-R2) — one append-only row per
  build/version event. Markdown (this doc, session logs, plan READMEs) stays the human narrative; the
  registry is the queryable, diff-able machine record, the same relationship `index.csv` has to session
  logs (§1/§29).
- **Promotion gate (§2.3 of the plan):** a build is promoted to Staging or Production **only** via
  `scripts/release/promote.sh` (RG-R4), and only after a recorded PO approval
  (`docs/releases/approvals/<version>-<env>.md`). **No agent ever promotes a build on its own
  initiative** — promotion is the one action in this entire rule set that is hard-gated on an explicit,
  recorded PO sign-off, never inferred from a conversational "looks good."
- **No auto-promotion, ever.** Every source-code change gets a preview deployment automatically; nothing
  moves from preview → staging → production without that recorded approval.
- This section is additive to the rest of `core.md` — it does not relax any existing rule (§5 preserve-
  semantic boundaries, §6 file size, §19 no `src/` writes for governance/discovery sprints, etc.).

---

## §27. Continuity Wiring — Every Sprint Inherits the Real Current State

A multi-sprint plan fails when sprint N is written against the *pre-plan baseline* instead of the
*actual tree left by sprints 1…N-1*. Symptoms: an agent recreates a token/class/file that an earlier
sprint already created, points at a path an earlier sprint moved, or re-migrates work already done.

**Every plan with 2+ sprints must carry a single living "carry-forward contract"** (a section in the
plan README, e.g. `## Carry-forward contract — current structural state`). It states:
- The **canonical homes** for tokens, classes, components, hooks, services (reuse, don't recreate).
- The **facts each completed sprint left behind** (new files, moved paths, new tokens, deleted code).
- The **retained-by-policy** items (things intentionally NOT changed) and **documented debt**.

**Two binding obligations:**
1. **First step of every sprint** (Step 0): read the carry-forward contract AND the previous
   sprint's `output/*.md`, then obey the **REUSE-don't-RECREATE** rule (see §7).
2. **Last step of every sprint:** update the carry-forward contract with what this sprint changed,
   so it wires forward to **all** later sprints — not just the next one. A sprint is not closeable
   until its carry-forward update is written.

The contract is the single source of forward truth. Without it, continuity degrades to "sprint 2
knows about sprint 1, and nothing else knows about anything."

---

## §28. Fallbacks & Graceful Degradation — Log, Don't Fake, Don't Silently Skip

Tools fail: an MCP is not connected, a binary is missing (e.g. Playwright Chromium), `semgrep`/
Storybook are not installed, a skill errors. **An unavailable tool never justifies a faked result or
a silently skipped gate.**

When a required MCP, test runner, script, or skill is unavailable or fails:
1. **Use the documented alternative** if one exists, and say which path you used. Examples:
   - Playwright/screenshot MCP unavailable → start the dev server and verify HTTP 200 + console via
     a reachable method; record it as `dev-smoke (fallback)` not as a passed screenshot gate.
   - `validate:architecture` MCP down → run `npm run validate:architecture` via Bash.
   - A skill won't load → perform its steps inline and note the skill was unavailable.
2. **Mark the original gate `BLOCKED — <tool> unavailable`**, never `PASS`. A fallback satisfies a
   *weaker* claim than the original gate; label it as such.
3. **Log the failure for future setup** in the sprint output AND in the plan README "Follow-ups /
   tooling debt" — we are not fixing installation now, but every gap must be tracked so it can be.

Never claim browser verification without a running server. Never claim an MCP is connected without
testing it (see AGENTS.md Integrity rules). A fallback is honest only when it is labelled as one.

---

## §29. Closing Levels — Task, Multi-Task, Sprint, Plan

Agents bundle their runs differently (one task per session, several tasks in one run, a whole sprint,
or several sprints). Closing must work at every granularity. Use the `dcx-sprint-close` skill; it
defines the four levels. Summary:

| Level | What it closes | Minimum to close |
|---|---|---|
| **Task** | one acceptance-criterion-sized unit inside a sprint | its criterion has evidence; logged |
| **Multi-task** (bundled run) | several tasks closed in one agent run | each task's evidence recorded; one log may cover all, listing each task's verdict |
| **Sprint** | one sprint file's full acceptance set | all criteria met (or debt documented); gates §11; **carry-forward updated (§27)**; output file written |
| **Plan** | all sprints in a plan | every sprint closed; README status → completed; plan moved per §24; final carry-forward reflects end state |

Do not upgrade a level you didn't satisfy: closing 3 of 5 tasks is a **multi-task** close, not a
**sprint** close. A sprint is not closeable while any task lacks evidence or the carry-forward update
is missing. A plan is not closeable while any sprint is open.

### §29a. Every task you complete gets YOUR log — including a handoff someone left you

When a sprint hands a task to another agent (e.g. Codex hands the browser/MCP gate to opencode because
Codex's env lacks Playwright), the agent that **does** the work owns the audit trail:

1. **Write your own session log** (`docs/progress/sessions/<date>-<agent>/NNN-…md`) for that task, and
   add the index entry (`build-log-index.sh` or hand-append). Appending a section to **another
   agent's output file is not a substitute** — it leaves the work unlogged and unattributed.
2. **Attribute it.** Name the agent + model in the log and in the output section you append
   (`Browser evidence — captured by <agent> via Playwright MCP`). "In this session…" is not attribution.
3. **Put evidence in the plan, not the repo root.** Screenshots/artifacts go in
   `docs/plans/active/<plan>/output/evidence/` (relative `evidence/…` references in the output file
   resolve there). Do NOT leave them in the repo-root cwd where the MCP dropped them.
   **See §32 — Evidence & Screenshot Paths for the mandatory move procedure.**

A handoff task with no session log, no index entry, and evidence at the repo root is an **incomplete
close** even if the screenshots exist — the work cannot be trusted or traced (see AGENTS.md Integrity
rules). The sprint that handed off must list the handoff in its acceptance criteria so the receiver's
log is required before sprint close.

---

## §30. Output Audit — Optional but Common

Distinct from the **plan audit** (§24 / `dcx-plan-audit`, which reviews a plan *before* activation),
an **output audit** reviews a sprint's *output after execution* — did the executor actually do what
the sprint required, on the real tree, without creating duplicate tokens/classes/files (§7, §27)?

Output audits are **optional but frequently needed** — especially when a sprint touched shared
infrastructure (tokens, CSS, atoms, services) that later sprints depend on. They live in the plan's
`output-review/` folder (create it if absent) as `output-review/<sprint-id>-review.md`, written by a
reviewer agent. An output audit may **re-open a sprint** (add steps, mark incomplete) when it finds a
plan gap. It is a normal phase, not an exception — plan for it but do not force it where unneeded.

---

## §31. Opening a Session — New Folder on PO Request, Even Same Day

A "session" is one continuous unit of agent work that the PO opens. Session logs live in
`docs/progress/sessions/<session-folder>/`. **The session folder is opened per the PO's request, not
per calendar day.** Multiple sessions can occur on the same date.

**The rule:**
1. **When the PO asks to start / open a new session, the agent MUST create a new session folder** —
   even when one already exists for the same date and the same agent. Do **not** append the new work
   to the existing day's folder just because the date matches.
2. **Folder naming:** `[YYYY-MM-DD]-[agent][-NN]`.
   - The **first** session of the day for an agent is bare: `2026-06-28-claude/`.
   - Each **additional** PO-requested same-day session for that agent appends a zero-padded counter
     starting at `-02`: `2026-06-28-claude-02/`, `2026-06-28-claude-03/`, …
   - Never rename or merge an existing folder to make room — only add the next `-NN`.
3. **Both folders must be indexed.** `scripts/build-log-index.sh` walks **every** directory under
   `docs/progress/sessions/` and dedupes by `session_folder/log_name`, so distinct folder names index
   independently. After writing the new session's first log, run the index builder (or rely on the
   `PostToolUse` hook) and confirm **every** same-day folder appears in `docs/progress/index.csv`.
4. **Log numbering is per-folder.** `NNN` restarts at `01` inside each new session folder
   (see `log-format.md §1`); it is not continuous across folders.

When to open a new folder vs. append: a new PO request that starts fresh work (a new plan, a new
topic, "let's start a new session") → **new folder**. Continuing the same task you were just doing in
the same run → same folder, next `NNN`. If unsure, default to a new folder on an explicit PO
"new session" request.

---

## §32. Evidence & Screenshot Paths — Never the Repo Root

**This rule exists because agents repeatedly drop screenshots in the repo root cwd.** Every MCP tool
(Playwright, Preview MCP, computer-use) saves files to the working directory by default. That default
is almost always the repo root. **Do not leave them there.**

### The one rule

Screenshots, artifacts, and any binary evidence produced during a sprint **must** end up in:

```
docs/plans/active/<plan-name>/output/evidence/
```

### How to apply it

1. **Before taking any screenshot**, `mkdir -p docs/plans/active/<plan>/output/evidence/` if it does not exist.
2. **If the MCP tool saves to the repo root** (e.g. Playwright drops `screenshot-001.png` at `/`):
   - After the tool call, immediately `mv <file> docs/plans/active/<plan>/output/evidence/<descriptive-name>.png`.
   - Never reference the root path in your output file — only reference the plan-relative path.
3. **If you cannot move the file** (tool error, permission, etc.): log the root path in your session
   log under "Evidence — saved at repo root (move pending)" and open a follow-up note. Never silently
   leave root artifacts without logging them.
4. **References in output files** use the plan-relative path: `evidence/01-builder-loaded.png`, not
   an absolute path and not the repo-root path.

### What counts as "evidence root" violations

Any of these paths is **wrong** and must be corrected before the sprint can be marked Completed:
- `/<repo-root>/screenshot.png`
- `/<repo-root>/evidence/anything.png` ← this is a directory at root, not inside the plan
- `/<repo-root>/output/anything.png`

The correct canonical path is always under `docs/plans/active/<plan>/output/evidence/`.

### If you are working on a completed or expired plan

Evidence for **reviews or audits** of completed/expired plans goes in:
```
docs/plans/<status>/<plan-name>/output-review/evidence/
```
Create `output-review/` if it does not exist. Still never the repo root.

---

## §33. Every User Message Is an Indexed, Typed Task Log (STRICT — added 2026-06-29)

**Every user message in a session is recorded as exactly one indexed task log entry** (`NNN-…md`) in the
current session folder, carrying a `Type:` field. The allowed types (see `log-format.md §2`):
`sprint-execution | user-request-code | user-request-planning | audit-review | process-governance | mixed`.

**No message goes unlogged** — questions, reviews, audits, and governance requests included. A multi-part
turn is **one `mixed` entry** listing its sub-tasks, not several files. This makes the §25 classification
an **auditable record**, not just an in-the-moment decision.

A session is **not closeable** (§29) while any user message lacks its typed log entry. This rule was added
because audit/finding/decision work (e.g. the v0.3.5 FP-R5 + requirements-recovery chat) was performed but
never session-logged — the gap this closes.

---

## §34. Plan Lifecycle Loop — Plan → Audit → Revise → Decision (added 2026-06-29)

Every plan moves through one standard loop. Agents must recognize **which stage** a user message targets
(via §25 message types) and act for that stage only — never skip Audit before Implement, never self-activate.

```
PLAN ──▶ AUDIT ──▶ REVISE ──▶ DECISION
(draft)  (dcx-     (apply       ├─ RE-AUDIT   verdict NEEDS REVISION / NOT READY → back to AUDIT
         plan-     blocking     ├─ IMPLEMENT  verdict READY → PO moves drafted/ → active/, sprints execute
         audit)    findings)    └─ ARCHIVE    abandoned/superseded → expired/ (or on-hold/ if only paused)
```

### Stages
- **Plan** — draft in `docs/plans/drafted/` (no execution). May use `dcx-sprint-planner`.
- **Audit** — `dcx-plan-audit` writes `audit/YYYY-MM-DD-<agent>.md` with a verdict:
  `READY | NEEDS REVISION | NOT READY`. Multiple auditors append; do not overwrite.
- **Revise** — apply the blocking findings; record what changed (a `Type: user-request-planning` log).
- **Decision** (PO-gated; agents recommend, never decide):
  | Latest verdict | Recommended decision |
  |---|---|
  | READY | **Implement** — PO moves to `active/`, sprints execute (§24). |
  | NEEDS REVISION | Revise → **Re-audit**. |
  | NOT READY | Revise (often deep) → **Re-audit**; or **Archive** if the approach is wrong. |
  | Superseded / abandoned | **Archive** → `expired/` (`superseded-by:` set) or `on-hold/` if paused. |

### Authority & guards
- The **PO chooses** Implement / Re-audit / Archive. Agents recommend based on the **latest** audit verdict.
- A plan is **never activated without passing Audit** (READY), and a **NOT READY plan is never activated**.
- After a non-trivial Revise, **Re-audit** before Implement — don't trust a stale verdict.

### Message-type → stage mapping (extends §25)
A user message usually targets one stage:
| Message | Stage | Type (§33) |
|---|---|---|
| "draft / plan X" | Plan | user-request-planning |
| "audit / review the plan" | Audit | audit-review |
| "apply the revision / fix the findings" | Revise | user-request-planning |
| "activate / implement / run it" | Implement | sprint-execution (PO-gated) |
| "archive / abandon / supersede it" | Archive | user-request-planning / process-governance |

**Custom / off-loop asks** ("do X differently", a one-off question, a tangent): handle as a user-initiated
task (§25) — do **not** force it into the loop or invent a plan for it. It still gets a typed log (§33).
If a message mixes stages (e.g. "revise and re-audit"), it is one `mixed` task that names the stages.

---

## §35. Requirements Governance — Mandatory Rules (added 2026-06-29 RS-R4)

The requirements graph (`docs/product/requirements/graph/`) is the **authoritative
source of truth** for what the system must do and what it manifests. These rules
govern every agent working in this repository.

### §35a. Graph-ID Grounding — Every Behavior Claim Cites a Graph ID

No sprint, plan output, or behavior claim may describe product intent,
implementation scope, or verification criteria without citing a graph ID:

- Product behavior claims must reference `INT-`, `REQ-`, or `BHV-` IDs.
- Technical/governance claims must reference `RSP-`, `GOV-`, or `REQ-GOV-` IDs.
- Acceptance criteria must reference `AC-` IDs.
- Verification claims must reference `EVD-` IDs.

**Violation:** A sprint that says "implements focus control" without
`INT-FOCUS-CONTROL` or `REQ-FCS-002` is **ungrounded** and must be revised
before activation (see `dcx-plan-audit`).

**Exemption:** Pre-RS-R5 sprints may use RS-R0b design IDs and explicitly
state "Requirement Trace uses design IDs — graph IDs pending RS-R5 inventory."

### §35b. Sign-Off Before Mutation — No Silent Canonical Writes

No command or agent action mutates locked canonical truth in the requirements
graph without a sign-off ledger entry:

- All new requirement proposals use `npm run req:propose`.
- All canonical mutations use `npm run req:apply-after-signoff` with a
  ledger sign-off ref.
- Supersession creates new nodes + a `supersedes` TraceLink; it does not
  silently edit old truth.
- Product truth changes always require PO sign-off.
- High-confidence technical TraceLinks (confidence ≥ 0.80) may auto-apply
  only if they do not change product truth AND write an audit ledger entry.

**Violation:** Editing a node file directly without a proposal + sign-off
path is a governance failure.

### §35c. Validate + Reconcile Before Done — No Unchecked Closing

Before any sprint is marked Completed:

1. Run `npm run req:validate` — zero blocking violations required.
2. Run `npm run req:reconcile -- --mode changed -- --files <changed-files>`
   (via `dcx-manifestation-reconcile`) — every meaningful manifestation must
   trace to an approved requirement or carry a valid exemption.
3. The `dcx-sprint-close` skill must include Requirement gates in its verdict.
4. The completion gate (`npm run req:completion-gate`) must return PASS or
   PASS_WITH_QUEUED_REVIEW.

**Violation:** A sprint closed without validation or reconciliation is an
incomplete close and must be reopened.

### §35d. No Silent Unlinked Manifestations

Every meaningful manifestation (component, hook, service, action, rule, test,
script, skill, validator, generated view) must either:
- Trace to an approved requirement via a `TraceLink` with `confidence ≥ 0.80`,
- Carry a valid `Exemption` (category, reason, owner, review status), or
- Be explicitly documented as intentional technical/governance work with a
  ledger entry.

### §35e. System Is the Source of Truth

- The graph store is canonical; generated views are disposable.
- `src/**` is never a requirements source of truth; it is reconciled as
  manifestation evidence.
- When the graph and a plan output disagree, the graph wins.
- When the graph and code disagree, the reconciliation engine must explain
  the gap — not silently favour one side.
- The requirement system traces itself: schemas, validators, scripts, skills,
  rules, generated views, hooks, tests, and output evidence become `MAN-`
  nodes during RS-R9 dogfood.

### §35f. Skills Enforce These Rules

- `dcx-sprint-planner` fails plans missing the Requirement Trace.
- `dcx-plan-audit` fails ungrounded/unverifiable trace claims.
- `dcx-sprint-close` includes `req:validate` and `req:completion-gate` in
  close checks.
- `dcx-manifestation-reconcile` wraps the changed-file reconciliation and
  completion-gate check.
- `dcx-requirement-intake` handles new requirement proposals.
- `dcx-requirement-maturation` advances nodes through maturity.

---

## §36. Pre-Handoff Sprint Doctor & Tooling Portability (added 2026-06-29)

**Why:** sprints RS-R3/R4/R5 were re-audited 2–4× each. The re-audits caught **process,
portability, and determinism gaps — not logic bugs** (code passed every gate). The fix is to move
the auditor's checks *earlier* and make "done" mechanically checkable, so a sprint converges in **one**
audit pass instead of three.

### §36a. Run the Sprint Doctor before declaring done — MANDATORY

Before an executor hands a sprint off for audit (or marks it Completed), it MUST run:

```bash
bash scripts/agent/sprint-doctor.sh <plan-name> <sprint-id> <executor-agent>
```

and paste the output into its session log. The doctor checks, in one shot, what an auditor would
otherwise REOPEN on: build-notes present (+ Requirement Trace), sprint status = Completed, the
executor's own session log exists **and is indexed**, carry-forward updated, tooling portability,
determinism reminders, and the standard gates. **A sprint with a ❌ doctor verdict is not ready to hand
off.** `dcx-sprint-close` runs this as its first step.

### §36b. Tooling portability — no machine-specific anything

- **No absolute or home paths** (`/Users/...`, the repo's absolute path) in scripts, skills,
  `settings.json`, hooks, or generated tooling. Derive paths from the script location
  (`"$(dirname "$0")/.."`) or `$CLAUDE_PROJECT_DIR`. (A hardcoded path breaks every other checkout,
  worktree, and agent — and was a repeated re-audit cause.)
- **Scripts must be idempotent** — re-running in any environment is a safe no-op when already applied
  (print "no change", never error). Audits run in a *different* environment than the build.
- **Counts are computed, never hand-typed** — `wc -l`, `find … | wc -l`, CSV row counts. Refresh them
  in the final fix so they match current repo state.

### §36c. "Every item" means every item

An acceptance criterion that says "every source item / all sources / itemized" requires **one record
per item** in the output (a generated structured artifact is best), verified by count == source count.
**Range-grouping** ("rows 1–34 follow the same pattern") does **not** satisfy it and will be reopened.

### §36d. Match executor to sprint, gate before audit

Strict/integrative sprints (templated outputs, cross-scope wiring, "every item" datasets) go to a
strong executor **or** behind a green Sprint Doctor self-check before any external audit. Do not put the
weakest executor on the strictest-criteria sprint without the §36a pre-check.

---

## §37. Product-Owner Communication & Sign-off Scope (added 2026-07-01)

**Who "PO" means.** The operator is a real Product Owner, not a developer — regardless of how technical
the session gets. Default to product-friendly language: plain, framed around outcome/impact/risk. Add
technical depth only when the decision genuinely requires it to be understood. Never address the operator
as a developer — no unexplained jargon, no "just run X" phrasing without the product-level why attached.

**Sign-off gates are for PO-level decisions only.** Reserve a "stop and get sign-off" gate for what a real
Product Owner is actually responsible for deciding: production risk, user-facing impact, scope/cost change,
compliance/security exposure, or an irreversible action. Do not route routine technical execution — syntax
choice, which file to touch, an implementation detail with no product-level consequence — through a PO
stop. That decision is the agent's to make and report, not the PO's to approve.

**This is an agent-behavior rule, not a product requirement.** It must never produce a `REQ-*`/`PRP-*`
node, manifestation, or trace link in `docs/product/requirements/graph/` — no requirements-graph work
follows from this section, retroactively or going forward.
