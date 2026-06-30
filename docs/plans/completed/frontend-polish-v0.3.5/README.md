---
plan: frontend-polish-v0.3.5
status: completed
completed: 2026-06-30 (graph-grounded discovery; FP-R4/R5 executed + patched; live-confirmed)
on-hold-since: 2026-06-29
off-hold-since: 2026-06-30 (blocker resolved — requirements-system COMPLETED)
prior-blocked-on: requirements-system (now docs/plans/completed/requirements-system/)
version_context: v0.3.5
created: 2026-06-28
revised: 2026-06-30 (FP-R4 + FP-R5 redesigned & graph-grounded on RS-R11 brief; Codex re-audit READY; PO activated)
prior-art: completed/requirements-system (RS-R11 reground brief), expired/ui-ux-discovery, expired/frontend-discovery, completed/ux-discovery-v2, completed/frontend-discovery-v2, completed/folder-structure-v2
feeds-into: frontend-polish-implementation-v0.3.x (drafted at FP-R5)
executor: per-sprint by skill/tool access (see "Executor assignment discipline")
---

# Plan: Front-End Polish Discovery (v0.3.5)

## Status: COMPLETED (2026-06-30) — graph-grounded discovery done; FP-R4 + FP-R5 executed (Codex) + patched (Claude: +4 criteria, drag live-confirmed); moved to `docs/plans/completed/`. Next: PO creates + audits `drafted/frontend-polish-implementation-v0.3.x/` from the FP-R5 17-sprint set, then implements (WM-1 first).

> **Off-hold:** the blocker (`requirements-system`) is **COMPLETED** (now
> `docs/plans/completed/requirements-system/`); the graph at `docs/product/requirements/graph/` is the
> live source of truth. This plan moved `on-hold/ → drafted/` on 2026-06-30.
> **What was redone:** **FP-R4** (finalize spec) and **FP-R5** (synthesis/matrix) are **redesigned to be
> graph-grounded** on `completed/requirements-system/output/RS-R11-reground-brief.md` — every criterion
> cites canonical `REQ-` graph IDs (legacy `BLD-*`/`OD-*` are provenance aliases only), provisional graph
> links are treated as **review input, not proof**, and the two new requirements
> (`REQ-SBT-COPY-001` subtask copy-paste, `REQ-LOAD-SKEL-001` app-wide skeleton loading) are in scope.
> **Still valid (NOT redone):** FP-R0/R1/R2/R3 + `output/core-interaction-model.md` + `brand-ui-interpretation.md`.
> **Next:** execute FP-R4, then FP-R5. FP-R4 produces the graph-grounded finalize spec; FP-R5 drafts the
> implementation plan with PO Web Checks, Requirement Debt Burn-down, and the Implementation Coverage
> Ledger. Implementation begins only after that implementation plan is drafted and audited.

An active discovery plan. Agents execute **FP-R4 → FP-R5 only**. Execution (token/component changes)
happens in a **separate implementation plan** that FP-R5 drafts from the findings here.

---

## Executor assignment discipline (PO-required, 2026-06-30) — assign a sprint ONLY to an agent with the matching skill AND tool access

Every sprint (discovery and implementation) declares **required skill(s)** and **required tool access**,
and may be assigned **only** to an agent that has both. This prevents the repeated failure where a sprint
needing browser proof or brand tooling lands on an agent that cannot run it (`core.md §28/§29a/§36d`).

### Capability matrix

| Capability | What it gates | Agents that have it | Agents that do NOT |
|---|---|---|---|
| `impeccable` skill | brand/visual `change-token` work; visual review | **Claude only** (Claude-only by governance) | Codex, opencode |
| Playwright / Preview MCP (browser + screenshots) | any `verification: browser/visual` criterion; live-UI evidence | Claude, opencode | **Codex** (no Playwright — proven in RS-R5/R7 handoffs) |
| `dcx-frontend-refactor` | `change-component` structural splits/markup | Claude, Codex, opencode | — |
| `dcx-frontend-verify` | post-change verification gate | Claude, Codex, opencode | — |
| graph tooling (`req:*`) + `dcx-code-query` | graph-ID grounding, coverage/justify, reconciliation | Claude, Codex, opencode | — |

### Family → required skill/tool → eligible executor

| Family | Required skill | Required tool access | Eligible executor(s) | Never |
|---|---|---|---|---|
| `change-token` | `impeccable` (brand-only) | Playwright/Preview for light-theme visual proof | **Claude** (only impeccable holder) | components, logic, services |
| `change-component` | `dcx-frontend-refactor` | Playwright/Preview if the criterion is `browser`/`visual` | Claude or opencode (Codex only for non-browser splits) | brand identity, new features |
| `wire-mockup-data` | — (any) | Playwright/Preview for behavior proof | Claude or opencode (Codex only if a browser-capable agent owns the §29a handoff for its browser criteria) | visual redesign, new features |

### Rules
1. **impeccable is Claude-only and currently QUARANTINED in the root `CLAUDE.md`.** The FP carry-forward
   recorded a PO un-quarantine on 2026-06-28, but `CLAUDE.md` still says "do not invoke yet." **This is a
   PO gate (see Open gates):** either confirm un-quarantine (update `CLAUDE.md` + `docs/agent-skills.md`)
   or `change-token` sprints run **without** impeccable (Claude applies the `brand-ui-interpretation.md`
   corrections directly). No sprint invokes impeccable until that gate is cleared.
2. **No browser/visual criterion may be assigned to a Codex-only run.** It must go to Claude/opencode, or
   Codex must hand the browser criteria to a browser-capable agent who writes their own log (`§29a`).
3. **Strict/integrative sprints** (templated outputs, "every item" datasets, cross-scope wiring) go to a
   strong executor or behind a green **Sprint Doctor** self-check before audit (`§36a/§36d`).
4. **Every sprint carries the mandatory Requirement Trace** citing graph IDs (`core.md §35a`); planner/
   audit fail ungrounded sprints.

### Open gates (PO action — does NOT block discovery activation)
- **G-IMPECCABLE (pre-implementation, not pre-discovery):** the docs already conflict —
  `docs/agent-skills.md` says impeccable is **enabled** (brand-system only) while root `CLAUDE.md` says
  **QUARANTINED — do not invoke yet**. The PO reconciles this (update `CLAUDE.md` to match
  `agent-skills.md`, or vice-versa) **before any `change-token` implementation sprint runs**. It does
  **not** block activating/executing the FP-R4/FP-R5 discovery sprints (neither invokes impeccable).
  If unresolved when `change-token` work starts, that family runs **without** impeccable (Claude applies
  `brand-ui-interpretation.md` corrections directly).

---

## Audit response

**Current status:** latest re-audit `audit/2026-06-28-codex-reaudit.md` (round 3) confirmed all prior
scope/decision/three-family/live-builder/brand-UI blockers resolved, and raised **2 blocking + 2
advisory** — the `output/evidence/**` write-gate and the `impeccable` two-mode ambiguity, plus two
nits. **All four are resolved in this round** (allowed-writes now include `output/evidence/**`;
`impeccable` split into `impeccable-brand-audit` / `impeccable-visual-review`; FP-R5 intent fixed).

<details><summary>Audit history (rounds 1–2)</summary>

- **Round 1** (`audit/2026-06-28-codex.md`, 4 blocking + 1 advisory): write-scope contradiction,
  decision-closure, three-family matrix, live-builder inventory (new FP-R0), `src/components` advisory
  — all resolved (see rows below).
- **Round 2** re-emitted rounds-1 issues citing **pre-revision** line numbers (scored a stale
  snapshot) and added **blocker 5 (brand/UI interpretation)** — the only genuinely new one, resolved
  via the Brand/UI interpretation contract.

</details>

| # | Codex blocker | Resolution |
|---|---|---|
| 1 | Write-scope contradiction: README allowed only `output/*.md` but every sprint's final step writes the README carry-forward. | **Hard scope rule rewritten.** Allowed writes are now `output/*.md` + this README's carry-forward section + `audit/*` + progress logs. The no-source-change gate is now "no writes under `src/`" (proven by path/mtime), not "only output/". All sprint acceptance criteria updated to match. |
| 2 | Open PO decisions could be counted but not resolved, hiding blockers as backlog. | **`output/decision-register.md` is now mandatory** (FP-R4 opens it, FP-R5 closes it). Every `❓` must be `Resolved` / `PO decision required` / `Out of scope`. **FP-R5 may not draft an executable implementation sprint for any item still `PO decision required`.** |
| 3 | Success condition needs **three** task families + Claude-only `impeccable` routing, not two. | **Success condition added to Goal** (below). FP-R5 now outputs a three-family agent/task matrix: `change-token` (Claude + `impeccable`, brand-only), `change-component` (`dcx-frontend-refactor`, no `impeccable`), `wire-mockup-data` (builder behavior/data wiring vs `src/mock/*`, no visual redesign). Every drafted sprint names executor, allowed skill(s), scope in/out, source data, gates. |
| 4 | No live-builder interaction inventory — token/spec audits miss real visible gaps. | **New sprint [FP-R0](./sprints/FP-R0-live-builder-inventory.md)** (browser-backed, Playwright + dev-smoke fallback) inventories every island + core card flow: drag/drop, editor inputs, text styles, width/height/radius/font-size token drift, island open/close, popups, confirmations, reduced-motion. Each gap classified into one of the three families or `PO decision`. `impeccable` used for visual assessment, routed to Claude, code unchanged. |
| **5 (new)** | Brandbook must not be treated as a full web-app UI spec; missing theme planning + homepage/version reference. | **New required output `output/brand-ui-interpretation.md`** (FP-R1, Claude+impeccable) — see the *Brand/UI interpretation contract* below. It caps the brandbook to color/spacing/token correction, **preserves current app interaction language** (hover-light effects, stage/glass islands), allows **glass density variants**, **bans pure black/white tokens** (live `--theme-surface-void`/`--theme-dropdown-bg` are `#FFFFFF` — must be fixed), defines **dark + light theme token sets** and the **main-blue-on-light** rule, and **requires a v0.1.4 homepage/version reference review** before FP-R4/FP-R5 draft those page sprints. Since no `v0.1.4` reference exists in the workspace, it is a **`PO decision required`** register item (PO must supply the path/assets). |
| Adv-1 | Stale `src/components/**` references (folder removed in folder-structure-v2). | Replaced everywhere with: legacy `src/components/**` is prior-art only; live shared deps are `src/ui/**`, `src/hooks/**`, `src/builder/ui/**`. |

---

## Brand/UI interpretation contract (PO-defined, 2026-06-28 — audit blocker 5)

The brandbook is **brand guidance** (company / static / social), **not** a web-app UI redesign spec.
FP-R1 produces `output/brand-ui-interpretation.md` stating these binding rules; FP-R4/FP-R5 obey them:

1. **Scope of brandbook authority:** color and spacing **strongly** inform tokens. Interaction feel,
   hover-light effects, and the stage/glass-island visual language **stay as-is** — existing app UI
   decisions remain authoritative. No wholesale visual redesign.
2. **Glass density variants are allowed** (the only sanctioned expansion of the glass language) — define
   the permitted density set as tokens; do not invent new surface paradigms.
3. **No pure black, no pure white** tokens. Live offenders to fix in the token sprint:
   `--theme-surface-void: #FFFFFF`, `--theme-dropdown-bg: #FFFFFF` (re-grep for others in FP-R2).
4. **Dark AND light theme token sets** must be defined (token choice planned per theme), not a single
   palette. The main brand **blue must not be used on white/light backgrounds** — define where the blue
   is allowed in light theme and the contrast-safe alternative for light surfaces.
5. **v0.1.4 reference review:** the homepage and version pages must be informed by the **v0.1.4** UI
   reference for features and design. No `v0.1.4` reference path exists in this workspace → this is a
   **`PO decision required`** item: the PO supplies the v0.1.4 source/assets, OR explicitly waives it,
   before FP-R4/FP-R5 draft homepage/version implementation sprints.

---

## Goal

Produce the evidence and the spec needed to bring the three primary surfaces — **builder**,
**version page**, **homepage** — to a final, polished, perfectly modular state, with:

1. A **brand-corrected design system** — reconcile `src/brand/` tokens against `brandbook.pdf`
   (authoritative brand source) using the `impeccable` skill, brand-system-only.
2. **Best-in-class token usage** — every visual value flows through a token / `text-dcx-*` utility;
   zero new hardcoded literals; dead tokens identified.
3. **Perfect modularization** — every builder/version/homepage file within the `core.md §6` size
   caps, with named split candidates and churn-risk flags.
4. **Synthesized UI/UX guidelines** — one guideline doc (contrast, typography, motion/reduced-motion,
   spacing, z-index, anti-patterns) grounded in `impeccable` references + the brandbook.
5. **A finalize-behavior spec** for builder, version, and homepage — what "done" means for each.
6. **A started-metrics baseline** — measurable numbers (hardcoded-token count, oversized-file count,
   contrast failures, modularization debt) captured now so the implementation plan can show movement.
7. **A live-builder interaction inventory** — browser-backed current-vs-required state for every
   island and core card flow (FP-R0), so the implementation plan acts on real visible gaps.
8. **A brand/UI interpretation contract** — brandbook scoped to color/spacing/token correction (not a
   UI redesign), dark+light theme token sets, no pure black/white, main-blue-on-light rule, glass
   density variants, and a v0.1.4 homepage/version reference review (see contract below).

The output is **analysis + a drafted implementation plan**, not code.

### Success condition (PO-defined, 2026-06-28)

This discovery succeeds **only if** its output lets the implementation plan finish the required
builder behavior and look/feel through **exactly three task families** — nothing else:

| Family | Executor + skill | Touches | Never |
|---|---|---|---|
| `change-token` | **Claude** + `impeccable` (brand-only) | `src/brand/**` tokens/CSS | components, logic, services |
| `change-component` | `dcx-frontend-refactor` (any agent, **no** `impeccable`) | `src/ui/**`, `src/builder/**` structure/markup | brand identity, new features |
| `wire-mockup-data` | any agent (**no** `impeccable`) | builder behavior + data wiring vs `src/mock/*.mock.ts` | visual redesign, new features |

`impeccable` is a **Claude-only** skill (brand-system only). Any sprint that uses it must be routed to
Claude. FP-R5 must produce the agent/task matrix that proves every finalize gap maps to one of these
three families (or is an explicit, resolved PO decision).

---

## Hard scope rules (apply to every sprint)

- **No `src/` changes — but discovery docs DO get written.** Allowed writes for every sprint:
  this plan's `output/*.md`, this plan's `output/evidence/**` (screenshots/artifacts), this README's
  `## Carry-forward contract` section, this plan's `audit/*`, and the agent's progress log.
  **Forbidden:** any write under `src/` (or any other product source). The gate is "no `src/` change"
  — proven by path list + `src/` mtime check — **not** "only output/".
- **`impeccable` runs in one of two explicit modes — never both at once, both Claude-only, both
  zero source edits except as noted:**
  - **`impeccable-brand-audit`** (FP-R1 + future `change-token` sprints): inspects `src/brand/` only
    and produces brand-token *recommendations*. In discovery it writes markdown only; in a
    `change-token` implementation sprint it may edit `src/brand/**` only. Never touches `src/ui`,
    `src/builder`, logic, or services.
  - **`impeccable-visual-review`** (FP-R0): inspects the **running UI** (screenshots / dev server) to
    judge look/feel, and writes **markdown findings + screenshots only**. It makes **zero** source
    edits — no `src/brand`, no component, no token changes. Inspecting the builder visually is allowed;
    *editing* builder/component code is not.

  Component modularization is analyzed (not executed) here and is owned by `dcx-frontend-refactor` in
  the implementation plan (no `impeccable`). (See `docs/agent-skills.md`.) *(Legacy `src/components/**`
  no longer exists post folder-structure-v2 — live shared deps are `src/ui/**`, `src/hooks/**`,
  `src/builder/ui/**`.)*
- **Builder layout is FROZEN** (`core.md §10`). Discovery may describe the three-row grid; the
  implementation plan may NOT redesign it.
- **No version changes** (`core.md §26`). `version_context` here is `v0.3.5` — copied from
  `docs/VERSION.md`, not derived.
- **No new features.** Polish only — token and modularization corrections, per PO direction.

---

## Sprint Index

### Executable in this activation — FP-R4 then FP-R5 ONLY (graph-grounded redesign)

| Sprint | Title | Order | Uses | Output |
|---|---|---|---|---|
| [FP-R4](./sprints/FP-R4-behavior-finalize-spec.md) | Builder/version/homepage finalize-behavior spec (graph-grounded) | 1 | RS-R11 brief, graph (`req:*`), v0.1.4 ref | `output/FP-R4-finalize-spec.md` (rewritten) |
| [FP-R5](./sprints/FP-R5-synthesis-metrics.md) | Synthesis → three-family matrix + Implementation Coverage Ledger + Requirement Debt Burn-down + drafted impl sprints | 2 (after FP-R4) | FP-R4 + FP-R0–R3 outputs | `output/FP-R5-synthesis.md` (rewritten), `output/metrics-baseline.md` |

```
RS-R11 brief ──▶ FP-R4 (graph-grounded finalize) ──▶ FP-R5 (matrix + coverage ledger + debt burn-down + drafted impl plan)
prior art (read-only): FP-R0, FP-R1, FP-R2, FP-R3 outputs  ──┘
```

### Completed prior outputs — READ-ONLY, NOT executable in this activation

FP-R0–FP-R3 already ran (2026-06-28); their outputs are the **prior art FP-R4/R5 consume**. They are
**not** re-run and are **not** in the executable set above. Each sprint file carries a "historical —
not executable" banner. (They predate the graph and the mandatory Requirement Trace; their *outputs*
remain valid — brand reconciliation, token metrics, modularization, live-builder inventory.)

| Prior sprint | Output (consumed by FP-R4/R5) | Status |
|---|---|---|
| [FP-R0](./sprints/FP-R0-live-builder-inventory.md) | `output/FP-R0-live-builder-inventory.md` | ✅ completed — read-only |
| [FP-R1](./sprints/FP-R1-brandbook-reconciliation.md) | `output/FP-R1-brand-reconciliation.md`, `output/brand-ui-interpretation.md` | ✅ completed — read-only |
| [FP-R2](./sprints/FP-R2-token-audit-metrics.md) | `output/FP-R2-token-audit.md` | ✅ completed — read-only |
| [FP-R3](./sprints/FP-R3-modularization-audit.md) | `output/FP-R3-modularization.md` | ✅ completed — read-only |

> **Active execution order = FP-R4 → FP-R5 only.** FP-R0–R3 are inputs, not steps. FP-R5 runs only
> after the rewritten FP-R4 exists.

---

## Definition of Done (plan)

- [x] `output/FP-R0-live-builder-inventory.md` — per-island/per-flow current-vs-required state with
      browser evidence (or dev-smoke fallback, labelled), each gap classified `change-token` /
      `change-component` / `wire-mockup-data` / `PO decision`.
- [x] `output/FP-R1-brand-reconciliation.md` — brandbook values vs current `src/brand/` tokens, with a
      correction list (token-by-token: keep / change / add / retire). No tokens edited.
- [x] `output/brand-ui-interpretation.md` — the brand/UI interpretation contract instantiated:
      brandbook scope cap, preserved interaction/glass language, glass density variants, no pure
      black/white (with live offenders), dark+light theme token sets, main-blue-on-light rule, and the
      v0.1.4 reference status (resolved or `PO decision required`).
- [x] `output/FP-R2-token-audit.md` — every hardcoded literal outside `src/brand/`, dead-token list,
      and the baseline counts feeding metrics.
- [x] `output/FP-R3-modularization.md` — file-size table for builder/version/homepage vs `§6` caps,
      split candidates, churn-risk flags, reuse-don't-recreate map.
- [x] `output/FP-R4-finalize-spec.md` — per-surface "finalize" spec (builder behavior, version page,
      homepage) tied to requirement IDs where they exist; open questions flagged ❓.
- [x] `output/decision-register.md` — every `❓` from FP-R0/FP-R4 marked `Resolved` /
      `PO decision required` / `Out of scope`; opened by FP-R4, closed by FP-R5.
- [x] `output/FP-R5-synthesis.md` — the **three-family agent/task matrix** (`change-token` /
      `change-component` / `wire-mockup-data`) + prioritized drafted implementation sprints, each
      naming executor, allowed skill(s), scope in/out, source data, and gates. No executable sprint is
      drafted for any item still `PO decision required`.
- [x] `output/metrics-baseline.md` — the started-metrics dashboard (numbers, not adjectives).
- [x] No `src/` changes across all six sprints. Each sprint lists its touched paths and shows a `src/`
      mtime/path check proving no source write. (This repo is not git; rely on path list + mtime.)

> **DoD reconciled at close (2026-06-30):** all outputs exist; FP-R4 + FP-R5 graph-grounded, executed
> (Codex), and patched (Claude — +4 criteria T06/T07/K08/L06, drag/stage live-confirmed). FP-R0–R3 are
> completed read-only prior outputs (Sprint Index). 0 `src/` writes across the plan. **Discovery COMPLETE.**
> Downstream (PO, not this plan): create + audit `drafted/frontend-polish-implementation-v0.3.x/` from the
> FP-R5 17-sprint set (PO Web Checks use real pointer/drag; resolve G-IMPECCABLE before CT-1), implement WM-1 first.

---

## Carry-forward contract — current structural state (READ BEFORE EVERY SPRINT)

> ### ⚠️ CURRENT OVERRIDE (2026-06-30) — read this first; it supersedes any older statement below
> - **Lifecycle:** plan is in `active/` (was on-hold, then drafted; blocker `requirements-system` is COMPLETED).
>   **Only FP-R4 → FP-R5 execute** in this activation; **FP-R0–R3 are completed read-only prior outputs.**
> - **Requirements source of truth = the graph** (`docs/product/requirements/graph/`, via `req:*`), NOT
>   `docs/product/requirements/builder/*` (archived by RS-R10). Legacy `BLD-*`/`OD-*` IDs are provenance
>   aliases only. Provisional graph links are **review input, not proof** (RS-R11 §1).
> - **v0.1.4 reference IS present** at `docs/archive/dcx-manager-v0.1.4/src/pages/{home,version}/` →
>   homepage/version are **unblocked** (D-07 resolved). Any older "v0.1.4 missing" / "home/version parked"
>   line below is **stale** and overridden.
> - **Legacy FP-R4/FP-R5 outputs are superseded** by the graph-grounded redesign (the sprint files);
>   the old `output/FP-R4-finalize-spec.md` / `output/FP-R5-synthesis.md` are prior art to be rewritten.
> - **Two new requirements in scope:** `REQ-SBT-COPY-001`, `REQ-LOAD-SKEL-001`.
> - **G-IMPECCABLE** is a pre-implementation PO action, not a discovery blocker (see Open gates).

**Binding fact sheet.** Every sprint's Step 0 reads this section AND the previous sprint's
`output/*.md`, then obeys REUSE-don't-RECREATE (`core.md §7, §27`). Because this is discovery, the
"recreate" risk is duplicate *analysis*, not duplicate code — do not re-derive a map an earlier
sprint already produced; cite it.

### Canonical homes (from `docs/product/decisions/src-structure-decision.md`, post folder-structure-v2)
| Concern | Canonical home | Never |
|---|---|---|
| Typography size utility | `src/brand/styles/theme.css` → `text-dcx-*` | reintroduce `text-[var(--text-*)]` |
| Theme/color/surface value | `src/brand/styles/tokens.css` → `--theme-*` | hardcode a color literal in JSX/CSS |
| Global component/layout CSS | `src/brand/styles/components.css` | rebuild `src/brand/index.css` as a monolith |
| TS token object | `src/brand/tokens.ts` | redefine tokens deleted in folder-structure-v2 P1 |
| Base UI atom | `src/ui/atoms/` | create a duplicate base primitive |
| Raw shadcn primitive | `src/ui/shadcn/` | import `@/ui/shadcn/*` from feature code |
| Builder card/island/stage | `src/builder/` | promote builder behavior into `src/ui/` |

### Facts this plan inherits
- `src/brand/index.css` is a ~10-line entry point (folder-structure-v2 P1) — content in
  `styles/theme.css`, `styles/tokens.css`, `styles/components.css`.
- shadcn IS installed (`components.json`, alias `@/ui/shadcn`); Storybook IS installed.
- Builder three-row layout is frozen (`core.md §10`); home/version pages are placeholder routes that
  must NOT import builder internals (`core.md §13`).
- Brand source of truth for corrections: `brandbook.pdf` (repo root, 4.0 MB, PDF 1.6).
- `impeccable` quarantine LIFTED 2026-06-28 (PO); brand-only, Claude-only governance still applies.
- **No `src/components/`** post folder-structure-v2. Live shared deps: `src/ui/**`, `src/hooks/**`,
  `src/builder/ui/**` (`buttons`, `feedback`, `forms`, `modals`).
- **Builder islands (live, FP-R0 must cover each):** HeaderBrandIsland, MetadataIsland,
  HeaderUserIsland, EditorViewerIsland, FocusIsland, SelectionIsland, KanbanBuilderIsland,
  TimelineBuilderIsland, ViewHelperIsland, AIChatPopup, TemplatePopup, TaskCreationFlow,
  PreviewReviewModal (+ `island.registry.ts`).
- **Mock-data home (the `wire-mockup-data` family's source):** `src/mock/*.mock.ts`
  (`builder`, `channels`, `subtasks`, `versions`, `access`, `logs`) + `src/mock/store.ts`; service
  seam `src/services/api-client.ts → mock-dispatch.ts → mock/*`.
- **Tooling for FP-R0 evidence:** Playwright test available; dev server via `npm run dev`
  (dev-smoke HTTP 200 + console is the §28 fallback if the Playwright MCP is unavailable in-session).
- **Brand/UI interpretation (see contract above):** brandbook = color/spacing/token guidance only, NOT
  a UI redesign; preserve hover-light + stage/glass language; glass density variants allowed; **no pure
  black/white** (live offenders `--theme-surface-void: #FFFFFF`, `--theme-dropdown-bg: #FFFFFF`);
  dark+light theme token sets required; main blue must not sit on white/light backgrounds.
- **`v0.1.4` reference NOT present in workspace** (grep found only incidental matches). The homepage +
  version finalize specs (FP-R4) depend on it → tracked as a `PO decision required` register item; PO
  supplies the v0.1.4 source/assets or waives it before those page sprints are drafted.

### Documented debt carried in (do NOT fix here unless a sprint scopes it)
- `metadata.json` is stale boilerplate (describes a "Loudspeaker/DSP" app; `name` embeds `v0.3.3`) —
  it drives the false "VERSION.md vs metadata.json" contradiction. PO decision pending.
- `build-log-index.sh` known mislabel/dup bug (logs hand-appended when it misbehaves).
- Carried from folder-structure-v2 P6: `typed-any-cleanup` (42 `any`),
  `production-api-client-switch`, `P1b-color-tokens` (287 theme arbitraries intentionally retained).

### Update obligation
Each sprint's final step appends its facts here (new output files, new metric baselines, decisions
taken) so later sprints inherit the real state.

---

### FP-R0 carry-forward (2026-06-28, Claude claude-sonnet-4-6)

**Output files written:**
- `output/FP-R0-live-builder-inventory.md` — full island + card flow inventory, gap matrix, visual assessment
- `output/evidence/` — directory created; screenshots described in inventory §11 (Playwright BLOCKED, Preview MCP fallback)
- `PRODUCT.md` (repo root) — impeccable init requirement, written before visual-review mode

**Gap counts by family:**
| Family | Count |
|---|---|
| `change-token` | 6 |
| `change-component` | 6 |
| `wire-mockup-data` | 6 |
| `PO decision` | 7 items (D-01 through D-07) |

**PO decision items opened** (enter into decision-register.md in FP-R4):
- D-01: Task card size (56×56px) — intentional or gap?
- D-02: FocusIsland panel content — not defined/implemented
- D-03: ViewHelperIsland — absent from DOM, scope unclear
- D-04: AIChatPopup / TemplatePopup entry points — not surfaced
- D-05: Theme toggle unresponsive — dev-only lock or bug?
- D-06: Reduced-motion source audit scope
- D-07: v0.1.4 reference — still missing (PO decision required)

**Critical token findings (confirmed live):**
- `--theme-surface-void: #FFFFFF` in light theme — pure white offender ✅ confirmed
- `--theme-dropdown-bg: #FFFFFF` in light theme — pure white offender ✅ confirmed
- `--theme-text-secondary: ""` in both themes — empty/unset
- `--theme-accent: #75E2FF` on light backgrounds — WCAG contrast failure

**Critical behavior findings:**
- Action card → editor: `setFocusedNodeId` not called from ActionCard (only TaskCard has it)
- Drag/drop: `activeDrag` state initialized but never set — all drop zones inert
- Light theme split: stage canvas stays dark when rest of UI switches to light
- Theme toggle: clicking the button did not change `html.dataset.theme` in this session

**Plan status:** frontend-polish-v0.3.5 moved from `docs/plans/drafted/` to `docs/plans/active/` (2026-06-28).

---

### FP-R1 carry-forward (2026-06-28, Claude claude-sonnet-4-6)

**Output files written:**
- `output/FP-R1-brand-reconciliation.md` — full token-by-token audit (§1–§14, 14 token groups)
- `output/brand-ui-interpretation.md` — 5-rule brand/UI interpretation contract (scope cap, glass variants, no pure white/black, dark+light themes + main-blue-on-light rule, v0.1.4 status)

**Brandbook gate:** RESOLVED BY CODEX FOLLOW-UP — Claude initially marked `brandbook.pdf` image-only,
but Codex verified the bundled runtime can extract the PDF text layer and render color pages. Use
`output/brandbook-values.md` as the extracted values source. Rendered evidence:
`output/evidence/brandbook-colors-page-11.png` through `brandbook-colors-page-14.png`. D-08 is now
resolved in `output/decision-register.md`.

**New finding from brandbook XMP:** `29LT Zarid Slab Black` (OTF) is embedded in the PDF — this font is NOT in `src/brand/`. May be the brand display typeface. Awaiting PO confirmation before adding to font stack.

**Critical corrections identified (change-token family, block light-theme shipping):**
- `--theme-surface-void` light: `#FFFFFF` → `oklch(0.99 0.004 220)`
- `--theme-dropdown-bg` light: `#FFFFFF` → `oklch(0.985 0.004 220)`
- `--theme-text-secondary`: `""` → dark: `rgba(247,247,248,0.78)` / light: `rgba(21,21,22,0.78)`

**Interpretation contract rules (binding for all implementation sprints):**
1. Brandbook governs token values only — NOT glass language, NOT layout, NOT animation curves
2. Three glass density variants locked (glass-dark 0.45, glass-standard 0.72–0.92, glass-light 0.65)
3. No pure white/black in any token — corrections listed above
4. Dark-first; component text tokens shared both themes; light-theme surface corrections required
5. main-blue-on-light: `--theme-accent` forbidden as text on light bg; use `--theme-accent-deep` instead

**PO decision items:** D-08 (brandbook values export) is resolved by `output/brandbook-values.md`.
D-07 (v0.1.4 reference) confirmed still missing — default: waive, proceed without it.

---

### FP-R2 carry-forward (2026-06-28, Codex GPT-5)

**Output files written:**
- `output/FP-R2-token-audit.md` — token/hardcoded-value audit and metrics baseline.

**Cleanup note:** no Claude FP-R2 artifact existed to wipe. Codex reran FP-R2 cleanly and left the
unrelated opencode FP-R1 brandbook screenshots intact.

**Baseline counts for FP-R5:**
| Metric | Count |
|---|---:|
| Official `code-query.sh hardcoded-tokens` arbitrary Tailwind entries | 108 |
| Official `code-query.sh hardcoded-tokens` hardcoded hex entries | 0 |
| Broader product color/gradient literal lines outside `src/brand` and `src/stories` | 26 |
| Broader product arbitrary/bracket lines outside `src/brand` and `src/stories` | 342 |
| Storybook/demo color literal lines | 22 |
| Old `text-[var(--text-*)]` regressions | 0 |
| `text-dcx-*` utility usages outside brand | 260 |
| P1b retained `--theme-*` arbitrary bracket usages outside brand | 297 |
| All `var(--theme-*)` usages outside brand | 343 |
| Actual unique `--theme-*` token names consumed outside brand | 35 |
| Path-sensitive `--theme-*` file/token pairs outside brand | 134 |
| Proven dead `--theme-*` tokens | 0 |
| Zero-direct CSS custom properties needing build-aware review | 88 |

**Critical FP-R5 implications:**
- Use 297, not the old carried 287, as the live retained `--theme-*` arbitrary baseline.
- Use 35 as the actual unique `--theme-*` token-name breadth. Treat 134 only as path-sensitive
  file/token-pair breadth; it is not a unique-token-name count.
- Treat the 342 broader arbitrary/bracket line count as a broad regex baseline, not a required
  migration list.
- Use 22 as the separate storybook/demo color-literal baseline. Do not use the old unreproducible 44
  count.
- The 88 zero-direct CSS custom properties and 0 dead `--theme-*` claims are now backed by
  reproducible loops inside `output/FP-R2-token-audit.md`.
- Do not schedule broad token deletion from FP-R2 alone; no `--theme-*` token is proven dead.
- Token implementation should still prioritize FP-R1 critical fixes: no pure white/black light tokens
  and missing `--theme-text-secondary`.

---

### FP-R3 carry-forward (2026-06-28, Codex GPT-5)

**Output files written:**
- `output/FP-R3-modularization.md` — builder/version/homepage file-size table, split-candidate map,
  churn-risk list, and reuse/duplication map.

**Baseline counts for FP-R5:**
| Metric | Count |
|---|---:|
| Files measured in FP-R3 scope | 187 |
| Over hard cap | 1 |
| Over target only | 27 |
| Within target/cap | 159 |
| Homepage/version route files over target | 0 |

**Mandatory hard-cap split before clean implementation governance:**
- `src/builder/islands/EditorViewerIsland/useEditorState.ts` — 375 lines, hook cap 120/200.
  Split internally inside `src/builder/islands/EditorViewerIsland/` while preserving the public
  `useEditorState()` facade. Do **not** recreate the deleted `useEditorPanel.ts`,
  `useEditorDraft.ts`, or `useEditorGuard.ts` names.

**Target-only cleanup guidance:**
- 27 files are above target but under hard cap. Do not make a broad standalone cleanup sprint for all
  of them unless the PO explicitly asks. Split target-only files only when already touching them for
  `change-component` or `wire-mockup-data`.

**Extract-only churn-risk files/clusters:**
- `src/builder/islands/EditorViewerIsland/*`
- `src/builder/BuilderPage.tsx`
- `src/builder/stage/StageCore.tsx`
- `src/builder/stage/StageProvider.tsx`
- `src/builder/stage/views/DayGridCard.tsx`
- `src/builder/islands/MetadataIsland/*`
- `src/builder/islands/FocusIsland/*`
- `src/builder/ui/forms/channel/*`

**Reuse guardrails:**
- Reuse `BuilderIslandShell`, `StickyPopupShell`, `PopoverShell`, `GlassSurface`, `Input`,
  `ToggleGroup`, and existing builder channel selectors. Do not create new shell/control primitives
  during polish implementation.

---

### FP-R4 carry-forward (rewritten 2026-06-30, Codex)

**Output rewritten:**
- `output/FP-R4-finalize-spec.md` — graph-grounded finalize spec for Builder, Homepage, and Version page.

**Status:** Complete after PO activation. The 2026-06-28 legacy-ID output is superseded. Home and Version
are no longer blocked because `REQ-FP-D07` resolved the v0.1.4 reference at
`docs/archive/dcx-manager-v0.1.4/src/pages/{home,version}/`.

**Gap counts by family (all surfaces):**
| Family | Builder | Home | Version | Total |
|---|---:|---:|---:|---:|
| `wire-mockup-data` | 41 | 3 | 5 | 49 |
| `change-component` | 22 | 5 | 2 | 29 |
| `change-token` | 1 | 1 | 4 | 6 |
| **Explicit criterion rows** | **64** | **9** | **11** | **84** |
| Cross-surface skeleton policy rows | — | — | — | 4 |

**Per-area coverage gaps included:** Editor, Cards, Readiness, Kanban/Stage, Timeline/ViewHelper,
Drag/drop, Selection/Keyboard, Focus, Theme/Tokens/Reduced-motion, Home, Version.

**Graph grounding:** every criterion cites canonical graph `REQ-*` IDs. `REQ-SBT-COPY-001` is included
under Cards/Keyboard. `REQ-LOAD-SKEL-001` is included across Builder, Home, Version, and reduced-motion
skeleton behavior.

**RS-R7 candidate links flagged as review-input-not-proof:** generic/mis-targeted links for Stage,
keyboard, select/input-based copy/deselect, local preferences, and EFP/file preview must be confirmed or
corrected during implementation. The spec explicitly preserves RS-R11's rule that candidate
`implements` links are review input, not delivery proof.

**No new PO decisions opened:** D-01..D-12 are applied through `REQ-FP-D01..D12`.

---

### FP-R5 carry-forward (rewritten 2026-06-30, Codex)

**Output files rewritten:**
- `output/FP-R5-synthesis.md` — graph-grounded three-family matrix, 16 drafted implementation sprints
  + `CC-OPT`, PO Web Checks, Requirement Debt Burn-down blocks, and an Implementation Coverage Ledger.
- `output/metrics-baseline.md` — updated numeric baseline from the actual FP-R4 explicit criterion rows
  + RS-R11 coverage state.

**Implementation plan recommendation:** create
`docs/plans/drafted/frontend-polish-implementation-v0.3.x/` from `output/FP-R5-synthesis.md`, then audit
it before activation. FP-R5 does not self-promote and does not create the folder.

**Execution order:** `WM-1 -> CT-1 -> CT-2 -> SK-1 -> CC-1 -> CC-2 -> CC-3 -> CC-4 -> CC-5 -> CC-6 -> WM-2 -> WM-3 -> WM-4 -> WM-5 -> WM-6 -> HV-1 -> HV-2`, plus `CC-OPT` only when an over-target file is already touched.

**Coverage accounting:** FP-R5 normalized the FP-R4 row count. The explicit FP-R4 checklist contains 84
criterion rows (64 Builder, 9 Home, 11 Version) plus 4 cross-surface skeleton policy rows. The older
99-total prose was corrected so the implementation coverage ledger is auditable.

**Family baseline:** 49 `wire-mockup-data`, 29 `change-component`, 6 `change-token`; 0
`backend-deferred` frontend rows; 0 open PO decisions.

**Sprints drafted:**
| Sprint | Family | Primary scope |
|---|---|---|
| WM-1 | `wire-mockup-data` | Theme toggle + scoped local preference foundation |
| CT-1 | `change-token` | Brand light/dark token corrections |
| CT-2 | `change-token` | Structural dimension tokens |
| SK-1 | `change-component` | App-wide skeleton loading across Builder/Home/Version |
| CC-1 | `change-component` | Editor state hard-cap split |
| CC-2 | `change-component` | Responsive shared card components |
| CC-3 | `change-component` | Editor enable-on-select + routing layout |
| CC-4 | `change-component` | Readiness accessibility |
| CC-5 | `change-component` | Motion + interaction feedback |
| CC-6 | `change-component` | Stage + island light surfaces |
| WM-2 | `wire-mockup-data` | Typed drag/drop engine |
| WM-3 | `wire-mockup-data` | Editor open paths + sessions |
| WM-4 | `wire-mockup-data` | Card interactions + card/subtask copy-paste |
| WM-5 | `wire-mockup-data` | Focus, selection, keyboard, readiness wiring |
| WM-6 | `wire-mockup-data` | Stage views, Kanban builder, Timeline, ViewHelper |
| HV-1 | mixed `change-component` + `wire-mockup-data` | Homepage operational dashboard |
| HV-2 | mixed `change-component` + `wire-mockup-data` | Version workspace |
| CC-OPT | opportunistic `change-component` | File-size cleanup only when touched by owning sprint |

**Remaining PO gate before implementation:** G-IMPECCABLE remains a pre-implementation governance
decision for `change-token` sprints. If unresolved, CT-1/CT-2 run without invoking impeccable and use
`brand-ui-interpretation.md` directly.

**Recommended discovery close:** after audit of FP-R5, move `frontend-polish-v0.3.5` to `completed/`.

---

## Relationship to prior art (read before starting — `core.md §24`)

## Relationship to prior art (read before starting — `core.md §24`)
- `expired/ui-ux-discovery`, `expired/frontend-discovery` — the v0.3.2 first-pass discoveries.
- `completed/ux-discovery-v2`, `completed/frontend-discovery-v2` — the v2 discoveries that fed
  folder-structure-v2. **Re-verify their numbers against the live v0.3.5 tree** — do not copy stale
  counts.
- `completed/folder-structure-v2` — the structural refactor this plan builds on; its
  carry-forward contract is the structural baseline.
