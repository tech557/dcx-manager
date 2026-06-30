---
review-of: docs/plans/active/folder-structure-v2/output/P3-structure-quality.md
sprint: P3-structure-quality
reviewer: Claude (claude-opus-4-8, Anthropic)
date: 2026-06-28
verdict: P3 ACCEPT (complete & gate-clean) · P4 READY to start (after methodology hardening applied here)
method: live grep/ls of every P3 claim + re-ran typecheck/test/architecture/lint/build; P4 premise + methodology check
---

# P3 Output Review + P4 Readiness Verdict

## Verdict

**P3 is complete and gate-clean — every factual claim in its output verifies against the live tree.**
**P4 is READY to start**, with two methodology steps added here (it was missing the §27 final
continuity step and the §28 browser fallback that P2/P3 carry).

---

## 1. P3 claims verified live (all PASS)

| Claim | Live check | Result |
|---|---|---|
| 3 EditorViewer hooks merged → `useEditorState.ts` (≤400) | `wc -l` = **375**; 3 originals deleted | ✓ |
| `useEditorPanel/Draft/Guard.ts` deleted | all gone | ✓ |
| 4 unused hooks + `focus.engine.ts` deleted | all 5 gone | ✓ |
| EditorViewerIsland `any` casts = 0 | grep = **0** | ✓ |
| repo `no-explicit-any` reduced 63 → 42 | lint = **42** | ✓ |
| StageCore stale-closure fix (stable callbacks) | live code confirmed | ✓ |
| Drag state already extracted (no risky new context) | `StageProvider` calls `useDragState()` + spreads | ✓ |
| Shells + pre-P5 scaffolding untouched | `CardShell*`, `BuilderIslandShell`, `Popover/StickyPopupShell`, `shadcn/button.tsx`, `stories/*` all present | ✓ |

## 2. Gates re-run live (not trusting the output)

| Gate | P3 claim | My live result |
|---|---|---|
| typecheck | PASS | **PASS** |
| test | 27/27 | **27/27 (6 files)** |
| validate:architecture | PASS | **PASS — 257 modules / 524 deps, 0 violations** (down from 276 — deletions) |
| build | PASS | **PASS** |
| lint | 125 (120 err / 5 warn) | **125 (120/5)** — exact match; **down from 156 at P2** (the `any` cleanup helped) |
| browser/console | PASS (Playwright MCP, 0 app errors, 4 screenshots) | accepted (evidence in output; MCP-captured) |

P3 honored the new process: read the carry-forward + prior audits at Step 0, preserved the
component/shell structure, left the pre-P5 scaffolding alone, used the §28 fallback when Chromium was
missing (then opencode closed the browser evidence), and updated the carry-forward at the end (§27).

## 3. One discrepancy to keep visible (not a P3 failure)

**Repo-wide `no-explicit-any` is 42; the README metrics table's aspirational target was `≤5`.** P3's
*own acceptance criterion* was "reduce from 63 baseline" + "EditorViewerIsland cluster → 0" — both
**met**. The remaining 42 `any` live outside the editor cluster. **No later sprint targets them**
(P4 = services, P5 = visual polish), so **42 is the carried end-state for this plan** unless the PO
adds a follow-up (e.g. a `lint-any-cleanup` sprint). Flagging so the ≤5 number isn't assumed met.
The lint backlog overall is shrinking (269→…→156→125), which is the right direction.

## 4. P4 readiness

**Premises hold (verified live):**
- 7 services still use `readMockJson`/`writeMockJson`/`localStorage` (the swap targets):
  channels, builder, access, versions, logs, files, subtask-definitions.
- `apiClient` + `mock-dispatch.ts` present (**23 routes**); **0 services migrated yet** — P3 correctly
  did not touch the service layer. The dependency (P3 = clean structure) is satisfied.

**Methodology gap (fixed in this pass):** P4 had the Step 0 carry-forward binding but was **missing**:
- the **§28 browser-gate fallback** (Playwright Chromium is missing in this env) → **added** to Step 9;
- the **§27 explicit final continuity step** → **added** as Step 10 (update carry-forward; close-blocking);
- a realistic lint acceptance (`max-warnings 0` was unachievable against the 125 backlog) → changed to
  **0 NEW problems introduced by P4** + documented pre-existing debt;
- a **no component/shell regression** criterion (P4 is backend-only) → added.

With those applied, P4 is internally consistent and ready.

## 5. Bottom line

- **P3:** ACCEPT — complete, gate-clean, structure preserved. No rework.
- **P4:** READY to start. Premises verified; methodology hardened to match P2/P3.
- **PO follow-up (non-blocking):** decide whether the 42 residual `no-explicit-any` warrant a cleanup
  sprint (the plan won't reach the ≤5 metric otherwise).
