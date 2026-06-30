---
review-of: docs/plans/active/folder-structure-v2/output/P4-backend-readiness.md
sprint: P4-backend-readiness
reviewer: Claude (claude-opus-4-8, Anthropic)
date: 2026-06-28
verdict: P4 ACCEPT (complete & gate-clean) · P5 READY to start (after methodology hardening applied here)
method: live grep/ls of every P4 claim + re-ran typecheck/test/validate:architecture/lint; P5 premise + methodology check
---

# P4 Output Review + P5 Readiness Verdict

## Verdict

**P4 is complete and gate-clean — every claim verifies live, the mock-API seam is real, and the
browser evidence was captured AND properly logged this time (opencode, with its own session log —
the §29a fix worked).** **P5 is READY**, with the same methodology hardening I applied to P2–P4
(it was missing the §27 final step, §28 fallback, the impeccable-quarantine note, and a realistic
lint acceptance).

---

## 1. P4 claims verified live (all PASS)

| Check | Live result |
|---|---|
| Services using `readMockJson`/`writeMockJson`/`localStorage` | **0** (all 7 wired to `apiClient`) |
| `readMockJson`/`writeMockJson` in `api-client.ts` | **0** (removed) |
| `src/utils/safe-storage.ts` | deleted ✓ |
| Recursion fix | route handlers moved to `src/services/mock/*` (access/builder/channels/logs/subtasks/versions + `store.ts`); `mock-dispatch` is now a dispatcher — avoids `service→apiClient→mockDispatch→service` |
| `attachVersionFile` persists | ✓ routes to `attachVersionFileToMock` (versions.mock.ts), not a no-op echo |
| Mock-API completeness matrix | all 9 domains covered; `clickup` + `ai` labelled pure stubs |
| `mock-dispatch.ts` + `src/mock/*` | retained (dev/mock layer) |

## 2. Gates re-run live

| Gate | P4 claim | My live result |
|---|---|---|
| typecheck | PASS | **PASS** |
| test | 27/27 | **27/27 (6 files)** |
| validate:architecture | PASS (264 mod) | **PASS — 264 modules, 0 violations** |
| build | PASS | accepted (P4 + opencode both ran it) |
| lint | 119 (114 err / 5 warn) | **119** — matches; **down from 125 at P3** (backlog still shrinking) |
| Browser/console + seam | PASS (opencode, Playwright MCP, 0 errors, 3 screenshots) | accepted — and **logged** in `2026-06-28-opencode/01-P4-browser-evidence.md` |

## 3. Process win + one nuance

- **§29a worked:** unlike the P1/P2/P3 browser evidence (unlogged), opencode's P4 browser evidence has
  its **own session log with attribution** and the evidence is in `output/evidence/`. The handoff-logging
  rule landed.
- **Nuance to flag (not a P4 blocker):** `localStorage` now lives in exactly two utils —
  `src/services/mock/store.ts` (the mock backend, correctly **behind** the `apiClient` seam) and the
  **new** `src/utils/browser-storage.helpers.ts` (consumed by `preference.helpers.ts`,
  `useEditorState.ts`, and the mock store). The services are clean. But `browser-storage.helpers.ts` is
  a **non-seam** local path used for UI prefs + editor draft + **day-notes**. If day-notes are app data
  (not UI scratch), that's a hidden data domain the completeness matrix didn't cover. **PO question:**
  confirm editor-draft/day-note local persistence is intended to stay UI-local, or schedule it for the
  seam in the follow-up production plan.

## 4. P5 readiness

**Premises hold (verified):** shadcn installed (`components.json`, `src/ui/shadcn/button.tsx`), the
atoms + `text-dcx-*`/`--theme-*` token language are in place, and P5 reads the P1–P4 outputs. P5
governs component sourcing + runs the visual polish gate — independent of P4's service work.

**Methodology gap (fixed in this pass):** P5 had the Step 0 carry-forward binding but was **missing**:
- the **§28 fallback** on its screenshot/polish gate (→ added; with a §29a handoff note since the visual
  baseline is mandatory);
- the explicit **§27 final continuity step** (→ added as Step 8, which also feeds the plan-level close);
- an **impeccable-quarantine note** (P5 is the design/polish sprint — it must use its **own** visual spec,
  NOT the quarantined `impeccable` skill) (→ added);
- a **structure-preservation / post-P4-inventory** guard (→ added);
- a realistic lint acceptance (`max-warnings 0` → "0 NEW; pre-existing 119 documented") (→ fixed).

## 5. Bottom line

- **P4:** ACCEPT — complete, gate-clean, seam real, evidence captured **and logged**. No rework.
- **P5:** READY to start, methodology hardened to match P2–P4. **Note: P5 is the LAST sprint** — its
  close triggers the **plan-level close** (all sprints done → README → completed → move per §24).
- **PO follow-ups (non-blocking):** confirm the day-note/editor-draft localStorage intent; the 42
  residual `no-explicit-any` + 119 lint backlog still ride along (no sprint targets them — optional
  cleanup sprint).
