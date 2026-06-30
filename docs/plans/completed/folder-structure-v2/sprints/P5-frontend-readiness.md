---
sprint: P5-frontend-readiness
plan: folder-structure-v2
version_context: v0.3.4
status: in-progress
executor: Codex
depends-on: P3-structure-quality (consolidated component set must be stable before governance + polish)
inputs:
  - docs/plans/completed/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md
  - docs/plans/completed/ux-discovery-v2/output/UX2-R3-synthesis.md
  - docs/plans/completed/frontend-discovery-v2/output/FE2-R3-refactorability.md
  - docs/plans/active/folder-structure-v2/output/P1-token-system.md
  - docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md
output: docs/plans/active/folder-structure-v2/output/P5-frontend-readiness.md
---

# P5 — Frontend System Readiness (Component-Source Governance + Polish Gate)

## Why this sprint exists

P1–P4 remove token, component, structure, and mock-data-source debt. They do **not**
prove the frontend is ready for a final-polish pass, and they leave no source-of-truth
for how an agent chooses between a custom component and a library/MCP component.

This sprint closes both gaps so the next frontend-polish agent starts from a documented
component-source policy and a measured visual baseline — not a cold rediscovery.

It produces two durable artifacts:
1. **Component-source governance** — `docs/product/component-source-policy.md`
2. **Visual polish baseline + gate** — screenshot evidence at three viewports, recorded
   in `output/P5-frontend-readiness.md`

This is a readiness/QA sprint. It changes **no feature behavior**. The only code it may
write is the adapter-seam comment in Step 3 (thin, non-breaking) and hard-gate token fixes
surfaced by the polish gate in Step 6.

## Execution method

Codex is executing this sprint one task at a time. After each completed task, Codex must:
- update this sprint file before moving to the next task;
- append/update the P5 output file;
- write a task log in `docs/progress/sessions/2026-06-28-codex/`;
- run `bash scripts/build-log-index.sh`;
- record unavailable MCP/browser gates honestly instead of claiming them.

## Task Progress

| Task | Status | Notes |
|------|--------|-------|
| Step 0 — Session environment | Completed | P4 audit read; session/tool state recorded; carry-forward contract and P1-P4 outputs read; shadcn/Storybook state verified live. |
| Step 1 — Inventory current `src/ui/` surface | Completed | 24 UI TSX files inventoried with role, prop contract summary, and live consumer count. |
| Step 2 — Component source policy | Completed | `docs/product/component-source-policy.md` created with source matrix, adapter rules, shadcn candidates, landing folder, and `PopoverShell` seam. |
| Step 3 — Adapter seam comment | Completed | `src/ui/PopoverShell.tsx` now documents the adapter seam; typecheck and focused lint pass; full lint still reports known 119-problem backlog. |
| Step 4 — Visual acceptance spec | Completed | Output now defines hard gate vs accepted-by-policy categories before screenshots. |
| Step 5 — Browser/screenshot evidence | Blocked (partial evidence captured) | 1440/1920/2560 dark+light screenshots saved with 0 console errors; editor-panel evidence blocked because `Open Editor` remains disabled in reachable Builder state. |
| Step 6 — Remediate hard-gate findings | Completed (none applied) | No token/color/spacing source defect found; editor-panel evidence blocker is a verification/handoff issue, not a P5 source remediation. |
| Step 7 — Full gates + output | Completed with documented blockers | typecheck/architecture/test pass; lint fails known 119-problem backlog; browser evidence partial with editor-panel blocker. |
| Step 8 — Continuity wiring | Completed | README carry-forward updated; plan intentionally left active because editor-panel evidence blocker prevents closeout. |

## Product requirements touched

This plan changes no feature behavior, but P5 **implements the Builder V1 quality gate** for
pixel-perfect visual review and open-decision logging. Cite, in the P5 output:
- `docs/product/requirements/builder/acceptance-criteria.md#quality-gates` — the quality gates
  (typecheck, tests, pixel-perfect light+dark review, open decisions logged). Per
  `docs/product/requirements/builder/README.md`, sprint files cite the requirement they implement.
  **The `## Quality gates` section currently has no `BLD-*` ID** — so cite it by its anchor and write
  `Quality gates: no requirement ID assigned in source doc`. **Do not invent a `BLD-*` ID.** (A
  product-doc follow-up to assign a formal ID to Quality Gates is noted in the README follow-ups.)

---

## Step 0 — Session environment

```bash
bash scripts/agent/build-current-state.sh
bash scripts/agent/verify-tooling-state.sh
```

Record both outputs verbatim in `output/P5-frontend-readiness.md` under a
`## Session Environment` section. Confirm:
- `version_context` (`v0.3.4`) matches `docs/VERSION.md` `current`. If mismatched, stop and ask the PO.
- Which MCPs are operational. **Re-verify live — do not trust any baked-in claim.** As of
  2026-06-27 the tooling moved: `components.json` now exists (shadcn configured, `style: radix-nova`,
  alias `ui → @/ui/shadcn`) and Storybook is installed (`.storybook/`). The `shadcn`/`storybook`
  MCPs may still report `awaiting setup` even though the libraries are installed — check both the
  MCP state and the actual repo (`ls components.json .storybook`).
- Playwright test runner availability (used by the polish gate in Step 5).

**Carry-forward contract (MANDATORY — read before any edit).** Read the README
`## Carry-forward contract — current structural state` section **and** the P1–P4 `output/*.md`, and
obey the **REUSE-don't-RECREATE** rule. For P5 specifically: the visual hard gate is judged against
the *actual* post-P1 token language — `text-dcx-*` utilities, `--theme-*` tokens in
`src/brand/styles/tokens.css`, global classes in `src/brand/styles/components.css` (0 literals).
Inventory and govern the components that **exist**; do not introduce new base primitives or tokens.
At sprint end, update the README carry-forward block with what P5 changed.

**Scope guards (P4 readiness review, 2026-06-28):**
- **Inventory the CURRENT (post-P4) tree**, not "post-P2" — P3/P4 also ran. The inventory greps live,
  so it self-corrects, but reason about the present state (merged `useEditorState`, the wired services,
  `src/ui/shadcn/button.tsx`, `src/services/mock/*`).
- **Do NOT use the `impeccable` skill.** It is quarantined (hard-blocked by a `Skill` PreToolUse hook;
  see `docs/agent-skills.md`). P5 runs its **own** visual acceptance spec (Step 4), not impeccable.
  Impeccable is for *after* this refactor, brand-system-only.
- **Preserve structure.** P5 governs and documents the component surface and may add the adapter-seam
  comment (Step 3); it does **not** move/restructure components, shells, or atoms, and does not delete
  the pre-P5 scaffolding (`src/ui/shadcn/*`, `src/stories/*`).

Step 2 must describe the **current** shadcn state from this check, not a stale "not installed" claim.

---

## Read before starting

```
docs/plans/completed/ux-discovery-v2/output/UX2-R2-tailwind-patterns.md   ← duplication groups, token usage
docs/plans/completed/ux-discovery-v2/output/UX2-R3-synthesis.md           ← consolidated atom inventory
docs/plans/completed/frontend-discovery-v2/output/FE2-R3-refactorability.md ← atom/wrapper boundaries, consumer counts
docs/plans/active/folder-structure-v2/output/P1-token-system.md          ← registered dcx-* utilities (the visual token language)
docs/plans/active/folder-structure-v2/output/P2-component-consolidation.md ← surviving atoms after consolidation
src/ui/                                                                     ← actual component tree to inventory
```

P5 must consume the **post-P2** component set, not the pre-consolidation inventory.
If `output/P2-component-consolidation.md` does not exist yet, stop — P5 depends on P3
which depends on P2.

---

## Steps

### Step 1 — Inventory the post-P2 component surface

Build the real, current `src/ui/` inventory (consolidation has already run by P5):

```bash
find src/ui -name "*.tsx" | sort
# Group by role:
ls src/ui/atoms/        # leaf atoms (Badge, ToggleGroup, ...)
ls src/ui/forms/inputs/ # TextInput (+ date input)
ls src/ui/forms/selects/# Select (+ domain wrappers)
ls src/ui/surfaces/     # GlassSurface, shells
```

For each component record: file path, role (`atom` / `form-control` / `surface` / `wrapper` /
`domain-component`), exported prop contract (the `Props` interface), and consumer count
(`grep -rn "<ComponentName" src/ --include="*.tsx" | grep -v "node_modules" | wc -l`).

Acceptance: output contains a full inventory table — one row per `src/ui/` component with
path, role, prop contract summary, and consumer count.

---

### Step 2 — Build the custom-vs-library decision matrix

Define, as the project source-of-truth, when an agent uses a **custom** component vs a
**library / MCP-sourced** component (shadcn/ui via the `shadcn` MCP).

Current factual state — **record from the Step 0 live check, not from memory.** As of 2026-06-27:
- `components.json` **exists** → shadcn IS configured (`style: radix-nova`, `cssVariables: true`,
  `baseColor: neutral`, icon lib `lucide`). The shadcn alias is **`ui → @/ui/shadcn`** — i.e. shadcn
  components are expected to land in `src/ui/shadcn/`.
- Storybook **is installed** (`.storybook/main.ts`, `.storybook/preview.tsx`).
- Today the app's primitives are still custom under `src/ui/` (atoms/surfaces/forms); `src/ui/shadcn/`
  may be empty or sparsely populated — verify and record what is actually there.

So the policy is no longer "shadcn not installed." It is: **shadcn is available; define the seam and
the rule for when to reach for it.** Produce a decision table with at least these columns:

| Component need | Source | Why | Where it lives |
|---|---|---|---|
| Brand-owned visual atom (Badge, Chip, GlassSurface, ToggleGroup, Input) | Custom | Carries DCX tokens + glass system; no library equal | `src/ui/atoms`, `src/ui/surfaces` |
| Generic primitive with heavy a11y (Dialog, Popover, Combobox) | shadcn (`@/ui/shadcn`) **behind an adapter** | a11y + focus management is expensive to own; primitive must wear DCX tokens | `src/ui/shadcn/` (raw) → adapter in `src/ui/<role>/` |
| Domain control (CompletionStateSelect, version actions) | Custom wrapper over a shared primitive | Domain logic, not a visual primitive | feature folder, thin wrapper |

Rules the table must state explicitly:
1. **No raw shadcn component (`@/ui/shadcn/*`) is consumed directly by feature code.** It is wrapped
   by an adapter in `src/ui/<role>/` that applies DCX tokens. Feature code imports the adapter, never
   `@/ui/shadcn/*` directly.
2. **The adapter boundary is the swap seam.** Switching a control from custom → shadcn (or back)
   changes only the adapter file; consumers do not change. Document the seam location.
3. **Custom stays default** for brand atoms; reach for shadcn-behind-adapter when a primitive's
   a11y/interaction cost justifies it. List the named first candidates (e.g. Dialog/Popover/Combobox)
   so the future agent has a concrete target list, and note `src/ui/shadcn/` as their landing folder.

Write this as `docs/product/component-source-policy.md` (new file). Reference it from the
P5 output and from the README (see plan README "Frontend readiness chain").

Acceptance: `docs/product/component-source-policy.md` exists with (a) the inventory-backed
source matrix, (b) the adapter-boundary rule, (c) the named shadcn-candidate list + `src/ui/shadcn/`
landing folder, (d) the swap-seam location. Verify and record the current `src/ui/shadcn/` contents,
and confirm no feature file imports `@/ui/shadcn/*` directly
(`grep -rn "@/ui/shadcn" src --include="*.tsx" | grep -v "src/ui/"` → record the baseline).

---

### Step 3 — Establish the adapter seam (structure only, no behavior change)

Create the directory and pattern the policy describes, so the seam is real and not just
documented:

1. Confirm/define where adapters live: raw shadcn primitives in `src/ui/shadcn/` (per the
   `components.json` alias), adapters wrapping them in `src/ui/<role>/` co-located with atoms.
2. For one existing custom primitive that is the most likely future swap target (pick from
   the Step 2 candidate list — e.g. a Popover/Dialog shell already in `src/ui/`), add a
   short header comment marking it as the adapter seam: which props are the public contract,
   and what a shadcn-backed replacement must preserve.
3. Do **not** actually swap any component to shadcn and do **not** rewrite behavior in this sprint.
   shadcn is already installed, but P5 only makes the seam explicit so a later swap is a single-file
   change. Adding raw shadcn components / performing swaps is the polish agent's job, not P5's.

```bash
npm run typecheck
npm run lint
```

Acceptance: the designated adapter file documents its public prop contract and swap
contract. Gates pass. Zero behavior change (no consumer edits).

---

### Step 4 — Define the visual acceptance spec

Before capturing evidence, write the pass/fail spec the screenshots are judged against.
**The spec must match what P1 actually cleaned — not phantom utilities.** P1 promotes only
typography size to named utilities; it does NOT create `font-dcx-*`, `rounded-dcx-*`, or
`shadow-dcx-*` (those have 0 source occurrences — see P1's scope-boundary table). So the spec checks
the real target state and treats the intentionally-retained arbitrary categories as **acceptable**,
not failures.

Record in the P5 output as `## Visual acceptance spec`:

**Hard gate (P1 must have delivered these — fail if violated):**
- **Typography** — 0 remaining `text-[var(--text-*)]` arbitrary patterns (cross-check P1 output);
  all typography size is a `text-dcx-*` utility.
- **Color (raw hex)** — 0 raw hex in rendered JSX (cross-check P1 hex count → 0); the 6 P1 surface
  tokens are in use.
- **No clipping/overlap** — no text truncated or overlapping at the three target viewports.
- **Light/dark mode** — both render without unreadable contrast (the builder ships a dark surface
  system; confirm both states if a theme toggle exists, else document dark-only).

**Accepted-by-policy (intentionally retained — NOT a P5 failure; list, do not fail on):**
- Theme color/border/ring `[var(--theme-*)]` (~287) — theme-reactive, retained per P1 scope table.
- Arbitrary `shadow-[…]` (~62), `rounded-[…]` (~14), layout sizes (~187) — no token requirement;
  retained or deferred to a named polish follow-up. Record the live count; do not gate on them.

**Note:** there is no spacing/margin token scale (no product decision created one); spacing uses the
native Tailwind scale (0 arbitrary `m-[var()]`/`p-[var()]`/`gap-[var()]`). Do not invent a spacing
gate. If the polish review finds a genuine spacing irregularity, log it as a follow-up.

Acceptance: a written, checkable visual spec exists in the output before any screenshot is taken,
split into the **hard gate** (P1 deliverables) and the **accepted-by-policy** retained categories.

---

### Step 5 — Capture browser/screenshot evidence at three viewports

This is the **polish gate**. It must produce real evidence, not a "no regressions" claim.

Start the dev server (port **3000**, per `vite.config.ts`):

```bash
npm run dev   # serves http://localhost:3000
```

Drive the app and capture evidence using whatever browser path is actually available in-session.
**Preferred: the Playwright test runner** (configured, `baseURL: http://localhost:3000` in
`playwright.config.ts`; `verify-tooling-state.sh` confirms it as available). Use the `playwright` or
`chrome-devtools` **MCP only if it is operational in this session** (check the Step 0 MCP list — the
current verified operational MCP set may be just `[eslint]`). Do not assume a browser MCP is present.

For each viewport — **1440×900, 1920×1080, 2560×1440** (builder is 1440px–4K per the
inherited "no mobile breakpoints" decision):

1. Load the app, open the builder.
2. Capture console output — record 0 errors (or list each error). A console error fails the gate.
3. Screenshot: builder stage, an open editor panel, MetadataIsland, and at least one of
   Kanban / Timeline / Week view.
4. Judge each screenshot against the Step 4 visual spec; note any clipping, overlap, token
   drift, or spacing irregularity.

Save screenshots under `output/P5-evidence/` (or describe each precisely if the runner
cannot persist files) and reference them in the output table.

```bash
# Example Playwright-driven capture (adapt to existing e2e setup):
npx playwright test --grep @polish-baseline   # if a baseline spec is added
```

Acceptance: for all three viewports — console-error count recorded (target 0), screenshots
captured for stage + editor + metadata + one stage view, each judged against the Step 4 spec.

---

### Step 6 — Remediate polish-gate findings (token/spacing only)

Only **hard-gate** findings (Step 4 hard gate) are fixed here. Accepted-by-policy categories
(theme color/border/ring, arbitrary shadow/radius/layout) are **not** remediated in P5 — they are
listed as retained/follow-up.

For each hard-gate finding:
- Typography drift (a stray `text-[var(--text-*)]` P1 missed) → replace with the correct `text-dcx-*`.
- Raw hex that P1 missed → replace with the token.
- Clipping/overlap → fix the offending layout utility.

Do **not** invent new tokens, do **not** migrate the retained arbitrary categories, and do **not**
undertake feature redesign. Anything beyond the hard gate is recorded as a follow-up for the
dedicated polish agent.

```bash
npm run typecheck
npm run lint
npm run test
```

Re-capture (Step 5) any view that was changed. Acceptance: every Step 5 finding is either
fixed-and-re-screenshotted or logged as an explicit follow-up with rationale.

---

### Step 7 — Full gate check + output

```bash
npm run typecheck
npm run lint
npm run validate:architecture
npm run test
```

Browser (executable): dev server on `http://localhost:3000`, builder open, console-error
count = 0, final screenshots attached.

**Tooling fallback (core.md §28).** P5's polish gate REQUIRES real screenshots (it is the visual
baseline). The Playwright MCP was operational in the P4 session, so capture should work — but if the
MCP/Chromium is unavailable in-session, do **not** fake it and do **not** silently pass: capture what
you can via dev-smoke (HTTP 200 + console), mark the screenshot gate `BLOCKED — Playwright unavailable`,
record `PASS WITH DOCUMENTED DEBT`, and **hand the screenshot capture to an MCP-capable agent with its
own session log + `output/evidence/` placement (core.md §29a)** — P5 is not fully closeable until the
3-viewport visual baseline exists.

Write output to `docs/plans/active/folder-structure-v2/output/P5-frontend-readiness.md`:

```markdown
# P5 — Frontend System Readiness Output
Date: {date} | Agent: {agent}

## Session Environment
{build-current-state.sh + verify-tooling-state.sh output}

## Component inventory (post-P2)
{table: path | role | prop contract | consumers}

## Source decision matrix
{the custom-vs-library table; link to docs/product/component-source-policy.md}
Adapter seam location: {path}
shadcn state: installed (components.json, alias @/ui/shadcn) — current src/ui/shadcn/ contents: {...}
shadcn-candidate list (first swap targets): {names}

## Product requirements implemented
{cite docs/product/requirements/builder/acceptance-criteria.md section IDs for the visual quality gate}

## Visual acceptance spec
Hard gate (P1 deliverables): {0 text-[var(--text-*)]; 0 raw hex; no clipping; light/dark}
Accepted-by-policy (retained, with live counts): {theme color ~287; shadow ~62; rounded ~14; layout ~187}

## Polish-gate evidence
| Viewport | Console errors | Screenshots | Findings |
|----------|----------------|-------------|----------|
| 1440×900  | 0 | stage, editor, metadata, kanban | ... |
| 1920×1080 | 0 | ...                              | ... |
| 2560×1440 | 0 | ...                              | ... |

## Remediations applied
{token/spacing fixes made in Step 6}

## Follow-ups for the polish agent
{anything deferred, with rationale}

## Gate results
- typecheck: PASS
- lint: PASS
- validate:architecture: PASS
- test: PASS (N/27)
- Browser: PASS — port 3000, 0 console errors, screenshots attached
```

---

### Step 8 — Continuity wiring (final step, MANDATORY — core.md §27)

P5 is the last sprint of folder-structure-v2. Update the README `## Carry-forward contract` with what
P5 changed (the `docs/product/component-source-policy.md` artifact, the adapter-seam location, the
visual baseline result, any token/spacing remediations, deferred polish follow-ups). If P5 is the
final close, this also feeds the **plan-level close** (core.md §29): all sprints done → README status
→ completed → move the plan per core.md §24. **P5 is not closeable until this update is written.**

---

## Acceptance criteria for sprint sign-off

- [ ] `## Session Environment` recorded from both agent scripts in the output
- [ ] Full post-P2 `src/ui/` inventory table (path, role, prop contract, consumers)
- [ ] `docs/product/component-source-policy.md` created with source matrix + adapter rule + shadcn-candidate list + swap-seam location + `@/ui/shadcn` landing folder
- [ ] shadcn current state recorded live (installed; `src/ui/shadcn/` contents); no feature file imports `@/ui/shadcn/*` directly
- [ ] Adapter seam made explicit on the designated primitive (no behavior change)
- [ ] Visual spec split into **hard gate** (P1 deliverables: 0 `text-[var(--text-*)]`, 0 raw hex, no clipping, light/dark) and **accepted-by-policy** retained categories (theme color/shadow/radius/layout) — does NOT gate on retained arbitraries or phantom `*-dcx` purity
- [ ] Builder V1 acceptance-criteria section cited in output for the visual quality gate
- [ ] Screenshot + console evidence captured at 1440 / 1920 / 2560, judged against the hard gate
- [ ] All polish-gate findings fixed or logged as explicit follow-ups
- [ ] Did **not** use the quarantined `impeccable` skill; component/shell structure preserved; `src/ui/shadcn/*` + `src/stories/*` left intact
- [ ] `npm run typecheck` → 0 errors
- [ ] `npm run lint` → **0 NEW problems introduced by P5** (pre-existing backlog — 119 at P4 — documented; focused lint on touched files passes)
- [ ] `npm run test` → all pass
- [ ] Browser: dev server on port 3000, builder opens, 0 console errors, screenshots at 1440/1920/2560 — **or** screenshot gate `BLOCKED` + §28 fallback + §29a handoff (P5 not closeable without the visual baseline)
- [ ] **Step 8 done:** README carry-forward updated; if final sprint, plan-level close per core.md §29/§24
