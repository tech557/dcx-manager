---
review-of: P1-token-system + P2-component-consolidation (final, pre-P3)
reviewer: Claude (claude-opus-4-8, Anthropic)
date: 2026-06-27
verdict: PROCEED TO P3 — with a short coherence-cleanup first (do NOT redo P1/P2)
method: live grep/ls + gate runs + cross-read of P1/P2 outputs, prior reviews, codex task logs, and the component/shell structure requirement
requirement-lens: docs/product/decisions/src-structure-decision.md (components/ui boundary) + shell components
---

# P1 + P2 — Final Audit (Safe to pass to P3?)

## Verdict

**The P1 and P2 *code* is sound and the component/shell structure is maintained — so we do NOT redo
P1/P2 or re-plan.** But it is **not clean to just proceed**: the authoritative component/shell
**structure doc is incoherent with reality**, and there is untracked pre-P5 scaffolding in the tree.
The fix is a **short coherence-cleanup + a structure-preservation guard on P3**, not a refactor of the
executed work.

**Answer: PROCEED TO P3 after the cleanup below (all applied in this pass except where noted for PO).**

---

## 1. Code verified live (all PASS — P1/P2 are real)

| Check | Live result |
|---|---|
| `text-[var(--text-*)]` remaining | **0** |
| `text-dcx-*` usages | 260 (was 272 at P1 — P2 deleted ~13 files; not a regression) |
| Raw hex in app JSX | **0** (the 1 grep hit is `#default-export` in a URL comment in `src/stories/Button.stories.ts` — false positive) |
| Raw color literals in `styles/components.css` rules | **0** |
| Atoms (reused, not recreated) | `Badge, Chip, Input, ToggleGroup` (+ `index.ts`) |
| `forms/inputs/` | `ListInputLines, SpecsInput, index.ts` (≤2 ✓) |
| `forms/selects/` | `Select, CompletionStateSelect, index.ts` (≤3 ✓) |
| GlassSurface `radius`+`intensity` | present |
| 10 orphans deleted + barrels clean | ✓ (verified by two prior reviews + re-checked) |
| Gates | typecheck PASS · test 27/27 · validate:architecture PASS · build PASS · lint 156 pre-existing debt |
| Browser evidence | captured (8 screenshots, 0 app console errors at 1440/1920) — debt closed |

## 2. Component / shell structure — MAINTAINED (the requirement lens)

The shell architecture is intact and P2 preserved it:
`CardShell`, `CardShellContent`, `BuilderIslandShell`, `PopoverShell`, `StickyPopupShell` all present;
`CardShellContent` correctly composes `GlassSurface` (now with `radius`/`intensity`). No base
primitive was duplicated; consumers were reconciled onto existing atoms. ✅

## 3. Incoherences found (this is the real subject — doc/process, not code)

1. **`docs/product/decisions/src-structure-decision.md` is STALE — the authoritative component/shell
   structure doc no longer matches the codebase.** It still says `Status: Proposed — awaiting PO
   approval`, describes **`src/components/` (46 files)** which **no longer exists** (it was merged into
   `src/ui/` — `src/ui/forms/`, `src/ui/auth/` are the migrated homes), lists **deleted primitives**
   (`StatusBadge`, `LockBadge`) as live `src/ui/` examples, and proposes moves **D1/D2** that are now
   moot. This is the #1 coherence problem and exactly what "maintain the components and shell structure
   / refer to requirements" points at. **It is NOT referenced by P3's coded steps** (P3 consumes the
   FE2 discovery outputs), so it is not a hard P3 blocker — but the structure authority is lying and
   must be refreshed by the PO. *(Applied: a STALE banner surfacing the contradiction — decisions not
   rewritten without PO.)*
2. **P2 output header says `Status: In progress`** while the sprint frontmatter is
   `completed-with-documented-debt` and Task 10 records a PASS close. Internal contradiction.
   *(Applied: header fixed.)*
3. **Untracked pre-P5 scaffolding in the tree:** `src/ui/shadcn/button.tsx` (unused — **0 consumers**,
   no adapter), `src/stories/Button.stories.ts`, and a Storybook install, all added ~02:01 during
   shadcn/Storybook setup. No sprint owns them. They are *pre-positioned for P5* (component-source
   governance), not dead orphans — so P3 must NOT delete them, and they must be tracked.
   *(Applied: recorded in the carry-forward contract as "pre-positioned for P5 — leave, don't treat as
   dead".)*
4. **README carry-forward numbers stale:** color arbitraries `~311 → 297`, `text-dcx 272 → 260`
   (both explained by P2 deletions). *(Applied: refreshed.)*
5. **"more tests" claim unverifiable:** the live suite is **27 tests / 6 files — unchanged since P1**.
   opencode's "more tests" are not reflected in the count (files may have been reorganized, or the
   claim is off). **PO/opencode to reconcile** — I could not confirm any net-new tests.
6. **Process noise:** the plan was *self-activated by Codex* (drafted→active) after its own READY
   verdict rather than by the PO (core.md §24), and there are **6+ overlapping audit/re-audit logs**
   plus multiple review docs. The *outcome* is verified-correct, but the process is the incoherence
   you're sensing — too many audits, self-activation, and a stale structure authority.

## 4. What to do before P3 (light — applied here)

- [x] Fix the P2 output `Status` header.
- [x] Add a STALE banner to `src-structure-decision.md` (PO to refresh/supersede it).
- [x] Refresh README carry-forward numbers (297 / 260) and record the shadcn/stories pre-P5 scaffolding.
- [x] Add a **component/shell-structure-preserved** acceptance criterion to P3 (and a Step-0 note to
      treat `src/ui/shadcn/*` + `src/stories/*` as pre-P5, not dead).
- [ ] **PO/opencode:** reconcile the "more tests" claim (count is still 27/6) and decide whether
      `src-structure-decision.md` should be rewritten to current reality or marked superseded.

## 5. Bottom line

P1/P2 do **not** need refactoring or more steps — the executed code is correct and the shell/component
structure is intact. The plan needs a **coherence pass on its docs + one guard step on P3**, which
this review applies. After that, **P3 is safe to start.**
