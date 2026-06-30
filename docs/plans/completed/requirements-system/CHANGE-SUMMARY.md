---
doc: requirements-system CHANGE-SUMMARY
date: 2026-06-29
author: Claude (claude-opus-4-8)
about: the 2026-06-29 redesign — flat requirements store → living product-intelligence & governance graph
audience: PO + the re-audit (dcx-plan-audit)
---

# Change summary — requirements-system redesign (2026-06-29)

## 1. Concise change summary

The plan was redesigned from a **governed requirements store** (flat records + ledger + relationship
checks + intake skill, READY at `audit/2026-06-29-codex-ready.md`) into a **living product-intelligence &
governance architecture**: a typed, validated **graph** plus the skills, agent rules, generated context,
scripts, validators, hooks, completion gates, ledgers, code indexes and PO workflows that continuously
**explain and enforce**, in **both directions**, the chain:

```
product intent → requirement → rules & behaviors → system responsibilities
   → expected manifestation categories → actual technical manifestations → verification evidence
```

The architecture is treated as a **required system behavior that must survive across Claude, Codex, and
future agents** without relying on conversational memory or voluntary doc-reading. The sprint set grew
**8 → 13** and was resequenced; the old set is archived (not destroyed) under
`sprints/_superseded-2026-06-29-flat-model/`. No prior audit fix was weakened (README Hard constraints §A
preserves them all). Because this is a non-trivial **Revise** (`core.md §34`), the plan must be
**re-audited READY before activation**; the prior READY verdict applied to the archived flat model and is
stale.

## 2. Old → new sprint mapping

| Old (flat model, archived) | New | Disposition |
|---|---|---|
| RS-R0 Methodology & system design | **RS-R0a** Conceptual model & graph design + **RS-R0b** Operational & enforcement architecture | **Split + greatly expanded** (3 state dims, responsibilities, manifestations, trace links, exemptions, verification, reconciliation, Behavior-Sustaining Map, sample records) |
| RS-R1 Source inventory & reconciliation | **RS-R5** Source & intent inventory + reconciliation map | **Moved later in number, same role**, + provisional chain classification |
| RS-R2a Store + schema + validators | **RS-R1** Graph store + schema + 3-state lifecycle + progressive validators | **Expanded** to typed graph + progressive maturation |
| RS-R2b Workflow + views + intake skill | **RS-R2** Mutation/sign-off + ledger + queues + views + low-token query/trace/justify **AND** **RS-R4** (intake skill moved into the skills/wiring sprint) | **Split**: data-plane vs agent-wiring |
| — (none) | **RS-R3** Manifestation discovery + reconciliation engine | **NEW** |
| — (none) | **RS-R4** Skills + agent-rule wiring + planner/audit grounding + hooks/gates + skill-sync | **NEW** (absorbs old RS-R5 wiring + the intake skill) |
| RS-R3 Migrate + ledger + data-model | **RS-R6** Migrate → seed graph + ledger + code-true data model | **Expanded** (classify into chain + 3 states; progressive) |
| — (none) | **RS-R7** Initial code reconciliation pass (bottom-up bootstrap) | **NEW** |
| — (none) | **RS-R8** Verification evidence layer | **NEW** |
| RS-R4 Dogfood session decisions | **RS-R9** Dogfood + **self-trace the system itself** | **Expanded** with self-governance dogfood |
| RS-R5 Agent wiring + doc disposition | wiring → **RS-R4**; disposition → **RS-R10** | **Split**: wiring moved earlier (before the graph goes live), disposition stays last-but-one |
| RS-R6 Re-grounding brief | **RS-R11** Re-grounding brief (hand-off only) | **Preserved** as handoff-only boundary |

## 3. New session requirement → where implemented in the revised plan

| # | New session requirement (from PO) | README | Sprint(s) |
|---|---|---|---|
| 1 | Living product-intelligence & governance architecture (not logger/tracker/folders/app) | "System goal", "What changed" | RS-R0a/R0b, RS-R4 |
| 2 | Enforce the full chain intent→…→evidence | "System goal", Core model §1/§6 | RS-R0a, RS-R1, RS-R2 |
| 3 | Bidirectional (top-down + bottom-up) as a gate | Core model §1, constraint 32, "Behavior-sustaining" | RS-R0b, RS-R2 (`trace`/`justify`), RS-R4 (gate) |
| 4 | Survive across Claude/Codex/future agents; no reliance on memory/voluntary reading | "Behavior-sustaining architecture" (pt 9) | RS-R0b (Map), RS-R4 (rules/hooks/sync) |
| 5 | Progressive, graph-based model (not flat record in one step) | Core model §1, constraint 18 | RS-R0a, RS-R1 |
| 6 | Typed graph storage (many-to-many) | Core model §1/§2, constraint 18 | RS-R0a, RS-R1 |
| 7 | Three separate state dimensions; `locked ≠ implemented ≠ verified`; named combinations | Core model §3, constraint 19 | RS-R0a, RS-R1 |
| 8 | Progressive maturation; required/optional fields per state; drafts don't fail | Core model §4, constraint 20 | RS-R0a, RS-R1 (validators), RS-R6 |
| 9 | Provenance/confidence; distinguish PO-decided/agent-proposed/skill-derived/code-discovered/confirmed/verified | Core model §5, constraint 21 | RS-R0a, RS-R1 |
| 10 | System Responsibilities layer (PO writes no code) | Core model §6, constraint 22 | RS-R0a, RS-R1, RS-R6 |
| 11 | Expected manifestation categories before impl; coverage complete/partial | Core model §6/§12, constraint 23 | RS-R0a, RS-R1, RS-R7 |
| 12 | Manifestations first-class; durable non-path identity + lifecycle; "smallest meaningful" boundary | Core model §7, constraint 24 | RS-R0a, RS-R3 |
| 13 | Trace links first-class typed records + relationship taxonomy | Core model §8, constraint 25 | RS-R0a, RS-R1, RS-R3 |
| 14 | Automatic manifestation reconciliation (existing-code + change-triggered) reusing code-index | Core model §9, constraint 26 | RS-R0b, RS-R3, RS-R7 |
| 15 | Confidence/evidence/reason on inferences; auto-apply only high-confidence technical w/ audit; ambiguous → queue | Core model §9, constraint 26 | RS-R0b, RS-R3, RS-R7 |
| 16 | Explicit typed exemptions; unlinked ≠ ignored | Core model §10, constraint 27 | RS-R0a, RS-R3, RS-R7 |
| 17 | Reconciliation & governance queues (human + low-token agent) | Core model §11, constraint 28 | RS-R0b, RS-R2 |
| 18 | Verification model: implemented vs verified; evidence binds to acceptance outcomes; partial/stale/invalidated; change→stale | Core model §12, constraint 29 | RS-R0a, RS-R1, RS-R3, RS-R8 |
| 19 | System governs & traces itself (locked source requirement; self-trace) | Core model §13, constraint 30 | RS-R0b, RS-R9 |
| 20 | Behavior-Sustaining Map (10 points) for every major behavior; correct layer per concern | "Behavior-sustaining architecture", constraint 31 | RS-R0b, RS-R4 |
| 21 | Preserve all existing constraints/prior audit fixes | Hard constraints §A | all sprints (global requirements) |
| 22 | Plan redesign: expand/split/add/reorder; cover the full required list | "Sprint Index", this doc §2 | whole plan |

Every required-coverage item the PO listed — methodology/architecture, graph/object model, lifecycle &
progressive maturation, validators, mutation/sign-off, skills & agent-rule wiring, human & agent views,
low-token graph queries, source migration, manifestation discovery, initial code reconciliation,
automatic change-triggered reconciliation, verification evidence, self-dogfooding, legacy doc disposition,
frontend-polish re-grounding handoff — maps to a sprint above.

## 4. Conflicts / supersessions vs the old plan (explicit, per PO request)

These **materially expand or supersede** the archived flat model. None weakens a prior audit *fix*.

| # | Old behavior | New behavior | Type |
|---|---|---|---|
| C1 | Flat requirement records | Typed **graph** (records are nodes; trees are views) | **Supersedes** storage model |
| C2 | One lifecycle (`draft→…→archived`) | **Three** state dimensions (governance/maturity/delivery) | **Supersedes** lifecycle model |
| C3 | `domain`/`affected-modules` fields | First-class **SystemResponsibility** + **ExpectedManifestationCategory** layers | **Expands** |
| C4 | Technical trace = path strings via code-index | **Manifestations + TraceLinks** as first-class objects with identity/confidence/evidence/staleness | **Expands** (still reuses code-index) |
| C5 | Intake skill = the main agent flow | Intake + **maturation** + **reconcile** skills; reconciliation + grounding as **completion gates** | **Expands** |
| C6 | No reconciliation of existing code | **Discovery + change-triggered reconciliation engine** + initial bootstrap pass | **New capability** |
| C7 | No exemptions concept | **Typed exemptions**; unlinked-never-ignored | **New capability** |
| C8 | `implemented` ≈ has a code link | `implemented` (coverage of expected categories) **separate from** `verified` (evidence per acceptance outcome) | **Supersedes** completion semantics |
| C9 | Dogfood = session decisions | Dogfood **+ self-trace the system itself** | **Expands** |
| C10 | 8 sprints, fixed order | **13 sprints**, resequenced (wiring before go-live; reconciliation + verification added) | **Restructures** |

**Carry-forward fact corrected (portable form):** earlier carry-forwards asserted a specific synced state
of `.agents/skills/` / `.claude/skills/`. Such current-state claims are **not portable** — observed
distribution differs across worktrees — so the carry-forward now states only portable truths: canonical
skills live in `agent-skills/`; `sync-skills.sh` produces the per-agent copies; synced state must not be
assumed; RS-R4 discovers/repairs/proves. The real durable gap is that `sync-skills.sh` has a **hardcoded
`SKILLS=()` array** that must be extended for each new skill (RS-R4).

## 5. Audit-ready statement

This redesign is structured for `dcx-plan-audit` re-audit (`core.md §34`):

- **Every sprint** names an executor, a Step 0 (env + carry-forward read), an explicit scope-in/out,
  acceptance criteria, and a final carry-forward update (`§27`).
- **Gate coverage:** design sprints (RS-R0a/R0b, RS-R5) are design/discovery (N/A gates + no-`src`-change
  checks + PO gates); tooling sprints (RS-R1–R4) list exact `npm run` / `bash` commands; data/governance
  sprints (RS-R6–R10) inherit the global gate set and name §28 fallbacks; RS-R11 is brief-only with a
  no-on-hold-cross check.
- **PO gates** at: RS-R0b (design sign-off, blocks all build), RS-R7 (confirm ambiguous mappings), RS-R9
  (inaugural batch sign-off), RS-R10 (file-by-file disposition approval).
- **Boundaries preserved:** on-hold `frontend-polish-v0.3.5` is never executed/resumed/re-audited; RS-R11
  is handoff-only; archive-not-destroy throughout; locked nodes immutable except by governed supersession.
- **Known open items for the auditor to weigh** (not blocking the *plan*, but flag-worthy): (a) RS-R0b
  carries heavy design load — if the auditor judges it overloaded, it can split further; (b) the storage
  engine is deliberately left to RS-R0b for PO sign-off, so RS-R1 gate commands are named generically
  ("exact names declared in carry-forward after RS-R0b") rather than pre-committed; (c) the auto-apply
  confidence threshold is a PO/RS-R0b decision, surfaced as a named carry-forward output.

**Recommendation:** treat as `NEEDS RE-AUDIT` → run `dcx-plan-audit` on this redesign before the PO moves
it to `active/`. Do not rely on the prior READY verdict.

## 6. Revision applied — response to codex redesign re-audit (2026-06-29)

Audit: `audit/2026-06-29-codex-redesign-reaudit.md` — verdict NEEDS REVISION (2 blocking, 1 advisory). All
three applied:

| # | Severity | Finding | Fix applied |
|---|---|---|---|
| 1 | Blocking | Carry-forward claimed skill distribution is working in both agent dirs, but Codex's environment showed only `.agents/skills/impeccable`. | Addressed by making RS-R4 **discover → repair → prove** sync (explicit `ls` before/after, in acceptance), **not** by asserting current sync is already present. *(Follow-up: the redesign re-audit-2 flagged that the response wording itself still claimed a verified-here synced state; that non-portable claim has now been removed from the README carry-forward and this summary, leaving only portable facts — canonical sources in `agent-skills/`, sync produced by `sync-skills.sh`, synced state varies by worktree and must not be assumed.)* |
| 2 | Blocking | Mandatory Requirement Trace transition pointed at RS-R5, which is now the source-inventory sprint. | README global-sprint-requirements transition rule rewritten: format **designed in RS-R0b**, enforced **after RS-R4**; explicitly notes RS-R5 is inventory, not the trace-format sprint. |
| 3 | Advisory | RS-R0b carries very large design load (highest-risk handoff). | Added a **strict 14-heading output template** to RS-R0b (command-name table, validator-catalog table, ≥1 sample record per node type, PO sign-off checklist) + a matching acceptance criterion. RS-R0b kept as one sign-off sprint (not split) per the auditor's "keep RS-R0b but make the template strict." |

Codex stated that after the two blockers are fixed the plan "should be activatable without another
conceptual redesign." Per `core.md §34`, the PO decides Implement vs Re-audit; these were
current-state/sequencing wording fixes (not a conceptual change), so a light re-audit confirmation is
reasonable before activation.
