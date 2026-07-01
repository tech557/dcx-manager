---
sprint: RG-R8
plan: cicd-release-governance
date: 2026-07-01
agent: Claude (claude-sonnet-5, Anthropic)
status: complete — first production release live, verified end-to-end
---

# RG-R8 — First-production bootstrap (one-time)

## Requirement Trace (core.md §35a)
| Field | Value |
|---|---|
| Requirements | REQ-RG-PROD-004, REQ-RG-APPROVAL-005, REQ-RG-VER-006, REQ-RG-RESET-010, D-RG-VER — approved, canonical graph nodes, PO-locked 2026-06-30 |
| Acceptance IDs | AC-RG-8-1 … AC-RG-8-6 — all PASS |
| Verification (EVD) | production URL confirmed serving the bound build (HTTP 200, exact deployment ID); registry shows `promoted-prod`; approval record precedes the alias move |

## Ambiguity resolved before touching anything

The sprint's own instructions said to bind "the current deployed/approved existing build" — but that
was ambiguous in practice: the production domain (`dcx-manager-gov.vercel.app`) was still aliased to an
**accidental first-ever deployment** from when the Vercel project was created (RG-R4), not any
deliberate release; and `main` (Vercel's configured production branch) had never been deployed on its
own since the repo's initial push — all real work landed on `integration` instead. **Asked the PO
directly** rather than guessing which build "the approved existing build" meant. PO chose: bind
`integration`'s current state.

The actual "current state" resolved to the **last real (non-skipped) build**: commit `b4b5d0b`
(`dpl_Fo3goq12YuLapcgin3Pq1Ms25cAR`) — every commit pushed after it was docs-only and correctly skipped
by RG-R7's `vercel-ignore-build.sh`, so there was no newer artifact to bind to. **Confirmed this exact
binding with the PO again, explicitly, before writing the approval record or moving any alias** — this is
the single highest-stakes action of the entire plan (the first-ever real production release) and
approval must be unambiguous, not inferred.

## What happened, in order

1. **Seed row** (`append-release-row.sh`): `v0.3.5.0`, `change_class=bootstrap`, bound to commit
   `b4b5d0b09ed6f64f3cc45d76f9a376788def5707` / deployment
   `https://dcx-manager-dij3wundt-dot-techs-projects.vercel.app`, `status=verified`.
2. **Production approval record** (`docs/releases/approvals/v0.3.5.0-production.md`): quotes the PO's
   explicit in-chat approval verbatim, names the exact bound build.
3. **`promote.sh v0.3.5.0 production`**: validated all four §2.3 gate layers, re-aliased
   `dcx-manager-gov.vercel.app` to the bound deployment (`vercel alias set`, no rebuild), appended a new
   row `v1.0.0.0` (`promoted-prod`) per §3.2 (Major `0→1`, Stage/Iteration/Revision reset), synced
   `docs/VERSION.md`.

## Live verification

```
$ curl -s -o /dev/null -w "%{http_code}\n" https://dcx-manager-gov.vercel.app
200
```
`get_deployment("dcx-manager-gov.vercel.app")` → `id: dpl_Fo3goq12YuLapcgin3Pq1Ms25cAR`,
`githubCommitSha: b4b5d0b09ed6f64f3cc45d76f9a376788def5707` — **the exact bound build**, same
`createdAt`/`ready` timestamps as before the promotion (no rebuild happened; this is a genuine alias
move, not a new deployment).

```
$ tail -2 docs/releases/registry.csv
"v0.3.5.0","bootstrap",...,"verified",...
"v1.0.0.0","promotion",...,"promoted-prod","production","PO (Mahmoud, tech@dotment.com)","2026-07-01",...
$ grep '| current |' docs/VERSION.md
| current | `v1.0.0.0` |
```

## Note carried forward, not silently dropped: production has no confirmed deployment protection

The production URL served this request with a plain `200` — **no Vercel deployment-protection
challenge**, unlike the staging alias (which returned a `302` SSO redirect during RG-R4's test). This is
consistent with RG-R4's still-open finding (AC-RG-4-6: deployment protection status was never confirmed —
no MCP/CLI path exists to check or configure it). **The first production release is live and public with
protection status still unverified** — flagging this prominently here since it's now materially true of
production, not a hypothetical future gap.

## Hand-off to normal rules

From this point forward, every release follows the ordinary §2.3 promotion path: a source change lands
on `integration` → CI classifies + stamps an Iteration/Revision version → Vercel builds a real preview
(or is genuinely skipped if non-source, per RG-R7) → the PO approves a specific version for an
environment in chat → `promote.sh` re-aliases the exact build. **No second bootstrap path exists or is
needed** — `promote.sh` has no bootstrap-specific branch; RG-R8 only ever ran the seed-row step once,
manually, outside the script.

## Acceptance criteria

| ID | Criterion | Verdict |
|---|---|---|
| AC-RG-8-1 | `v0.3.5.0` seed row created (carry-as-is, not v0.3.6) | **PASS** — exact version string in registry |
| AC-RG-8-2 | Bound to the approved existing build (exact deployment_id) | **PASS** — same deployment ID before and after promotion |
| AC-RG-8-3 | PO production approval record exists before alias move | **PASS** — approval file committed and pushed before `promote.sh` ran |
| AC-RG-8-4 | Production alias set once, no rebuild | **PASS** — `get_deployment` confirms unchanged build timestamps |
| AC-RG-8-5 | Subsequent releases use normal rules (no second bootstrap) | **PASS** — `promote.sh` has no bootstrap branch; documented above |
| AC-RG-8-6 | no `src/**` changed | **PASS** — `find src -type f -exec shasum` pre/post diff empty |

## Gates

| Gate | Result |
|---|---|
| no-`src/**` proof | PASS |
| §2.3 promotion gate | PASS — `promote.sh` enforced all four layers live |
| browser | N/A — verified via `curl` HTTP check + Vercel REST API `get_deployment`, equally strong live evidence; no PR/UI screen existed to screenshot |
