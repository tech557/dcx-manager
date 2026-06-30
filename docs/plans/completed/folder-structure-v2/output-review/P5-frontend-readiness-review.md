---
review-of: docs/plans/active/folder-structure-v2/output/P5-frontend-readiness.md
sprint: P5-frontend-readiness
reviewer: Claude (claude-opus-4-8, Anthropic)
date: 2026-06-28
verdict: P5 governance + visual baseline ACCEPT; editor "blocker" is a FALSE ALARM (not a regression). Do NOT archive yet — run the P6 closeout first (PO-approved).
method: live grep/ls + read the editor-open code path; full close-out debt sweep
---

# P5 Output Review + Plan-Close Readiness

## Verdict

**P5's governance work and visual baseline are real and accepted.** Its one open item — the
"editor-panel evidence blocker" — is **NOT a code regression**; it is a verification-path
misunderstanding. **The plan is NOT ready to archive as-is**, but not because of broken code: it
carries doc/agent debt that would misinform the next 4 plans. PO approved a **bounded-cleanup P6
closeout sprint, run before archiving.**

---

## 1. P5 deliverables verified (ACCEPT)

- `docs/product/component-source-policy.md` created; 24-component inventory; custom-vs-shadcn matrix;
  adapter seam documented on `PopoverShell`; shadcn state recorded live; **0 feature imports of
  `@/ui/shadcn/*`** (adapter rule holds); impeccable correctly **not used** (it's hard-blocked).
- Visual hard gate: 0 `text-[var(--text-*)]`, 0 app-rendered raw hex; 6 screenshots at 1440/1920/2560
  (dark+light), **0 console errors**, no viewport overflow. Accepted-by-policy arbitraries recorded
  (theme 297, shadow 58, rounded 11, layout 182).
- Gates: typecheck PASS, test 27/27, validate:architecture PASS (264 modules), build PASS, lint 119 debt.

## 2. The editor "blocker" — FALSE ALARM (the key close-decision)

P5 reported `Open Editor` stays disabled and couldn't capture the editor-panel screenshot. **This is
expected design, not a bug:**
- `EditorViewerIsland.tsx:121` — the "Open Editor" collapsed button is hardcoded `disabled`; title
  *"Drag task here to edit"*. It is a **drop hint**, never clickable.
- Editor expands via `isExpanded = !!activeNode && activeNode.kind !== 'day' && !!draftData`, driven by
  **drag-drop** onto the editor island (`onDrop={handleDrop}`) or long-press → `setFocusedNodeId`.
- **P3 already captured the editor open** (`output/evidence/p3-editor-open.png`, `task-editor-input.png`),
  post-`useEditorState`-merge — so the editor works.

The P5 agent clicked the disabled hint / double-clicked textboxes instead of dragging. **No regression
from the refactor.** P6 Step 1 reclassifies it as resolved and (optionally) re-captures via drag.

## 3. Close-out debt sweep (what would block/misinform the NEXT 4 plans)

| Debt | Detail | Risk | Handled in P6 |
|---|---|---|---|
| Lint 114 errors | `unused-vars ×51`, `no-explicit-any ×42`, **react-hooks ×24** (`set-state-in-effect ×13`, `exhaustive-deps ×5`, …) | react-hooks ones are **potential real bugs** the next plans build on | Step 2 (bounded: clean 51 + fix react-hooks; defer 42 `any`) |
| **Stale v2 discovery** | `ux/fe/be-discovery-v2` describe the PRE-refactor tree | **#1 misinformation risk** — next FE/BE discovery plans would re-read them as truth | Step 4 (SUPERSEDED banners) |
| **Carry-forward truth archives with the plan** | the "current structural state" lives in the plan README → moves to `completed/` | next 4 plans lose the structural source-of-truth | Step 3 (promote into `src-structure-decision.md`) |
| `src-structure-decision.md` stale | still describes `src/components/` (deleted) | structure authority lies | Step 3 (refresh to live) |
| Version mismatch | `VERSION.md` v0.3.4 vs `metadata.json` v0.3.3 | flagged every session; PO-owned | Step 5 (surface, PO resolves) |
| Code-index stale (~36h) | discovery plans read it | stale discovery | Step 3 (regenerate) |
| Day-note `localStorage` | `browser-storage.helpers.ts` non-seam path | possible hidden data domain | Step 5 (document decision) |
| Agent-doc gaps | impeccable not in CLAUDE.md/AGENTS.md; follow-ups archive with plan | misinformation | Step 6 (durable follow-ups + skill tables) |
| Build warnings | `versions.service.ts`/`main.tsx` dynamic+static import; chunk >500KB | perf/bundling | note as follow-up (not blocking) |

## 4. Decision (PO, 2026-06-28)

- **Lint:** bounded cleanup in P6 (remove 51 unused-vars + fix the ~24 react-hooks bugs; defer the 42
  `any` to a named `typed-any-cleanup`). → lint errors ~114 → ~44.
- **Sequencing:** run P6 closeout, THEN archive. The plan stays active until P6 promotes the structural
  truth + supersedes the stale discovery docs, so the next 4 plans (FE/BE final discovery + impl) start
  from accurate state.

## 5. Bottom line

- **P5:** ACCEPT (governance + baseline). Editor "blocker" = false alarm, resolved in P6 Step 1.
- **Plan:** NOT closeable yet — **P6 closeout sprint added** (`sprints/P6-closeout-coherence.md`). After
  P6: bounded lint done, structural truth durable, v2 discovery superseded, version/code-index/agent
  docs reconciled → THEN plan-level close + move to `completed/`, with the next-4-plans pointer set.
