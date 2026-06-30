---
log: 037-hv-discovery-reaudit-revision-2
session: 2026-06-30-claude
agent: Claude
model: claude-opus-4-8
provider: Anthropic
date: 2026-06-30
type: audit-review
PO-Action: pending
version_context: v0.3.5
plan: frontend-polish-implementation-v0.3.5
sprint: HV-1, HV-2 (pre-execution discovery/spec)
---

# 037 — HV discovery re-audit (round 2) targeted revision

## Status: ✅ All 5 re-audit items addressed

Source: `output-review/2026-06-30-codex-HV-1-HV-2-discovery-reaudit.md` (verdict: NEEDS TARGETED REVISION).
Round-1 fixes (log 036) confirmed by the re-audit. Round-2 patch:

| # | Re-audit finding | Fix |
|---|---|---|
| P1 | HV-1 (before HV-2) blocked on `REQ-VER-ROOM` supersession assigned to HV-2 — governance deadlock | **`REQ-VER-ROOM` now proposed + applied in HV-1 Step 0** (item 6) before Home card→`/version/:id` nav; HV-2 *confirms* it applied. Route already exists; Version page is placeholder until HV-2. |
| P1 | "Active" = DCXs (spec) vs versions (sprint) | HV-1 normalized to **Active DCXs** (derived status per `REQ-VL-019/021/022/024`); D-6 seam must model DCX-level status. |
| P1 | Sign-off block could pass with D-6/D-7 unresolved | Added **D-6/D-7 (+ H-G7/H-G8) rows to the PO sign-off block**; `status: SIGNED OFF` is invalid until both resolved. |
| P2 | Stale resolved/open labels on page headers + handoff | Page 1 header → D-1/D-2/D-3 resolved, D-6/D-7 open; Page 2 header → D-1/D-4/D-5 resolved; §J handoff updated. |
| P2 | Stale "mini-preview" / `VER-PREVIEW-LAUNCH` after D-5 Option B | Replaced with **branded launch panel + structure summary / `REQ-VER-LAUNCH`** in version spec coverage row + HV-2 scope. |
| P3 | README candidate count 21 → 22 | Corrected to **22** (14 Home + 8 Version). |

## Files changed (docs only)
- `sprints/HV-1.md` (Step 0 item 6; D-1/D-2 discovery lines), `sprints/HV-2.md` (D-1 consume; scope; candidate note).
- `tasks/HV-1-HV-2-component-signoff.md` (page headers; sign-off block + gate).
- `tasks/HV-1-home-spec.md` (§J handoff), `tasks/HV-2-version-spec.md` (coverage row).
- `README.md` (audit round-2 note; count 22; status rows).

## Gates
Docs-only; no `src/**` change. Graph unchanged (candidates remain staged for HV-execution-time proposal, §35b).

## PO-Action: pending
- Resolve **D-6** + **D-7** before HV-1 (now hard-gated in the sign-off block).
- Component + shared-block + D-6/D-7 sign-off in `tasks/HV-1-HV-2-component-signoff.md`.
- Separate ask this turn: drafted an **opencode initiation prompt** to burn down open requirements-graph
  items by category (delivered in chat; not a plan artifact).
