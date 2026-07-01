## Restructure homepage version card + reusable variants
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-07-01
Type: user-request-code
Status: Completed
PO-Action: none
Version: v1.0.2.0
Change-Class: source

Intent: Restructure the homepage version card so it answers immediately — client, project, version, status, launch date, ownership — and improve the shared variants it depends on without changing unrelated consumers. Reduce oversized empty spacing and make the project the primary information. Enforce Gilroy-only typography on the card (the version/date data read wrong in a system monospace).
Trigger: User request — "Restructure the homepage version card and improve the shared variants it depends on"; then "make sure u use only gilroy font because the data isnt showing properly then commit".

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| modified | src/brand/styles/components.css | New `.home-version-card` variant layered on `.glass-card` (base untouched): owns denser padding + subtle hover lift, reduced-motion guarded | +15 −0 |
| created | src/ui/atoms/AvatarGroup.tsx | Reusable compact overlapping avatar cluster with `+N` overflow; token-driven; sizes sm/md — consolidates the card's hand-rolled crew avatars | 56 |
| modified | src/ui/atoms/index.ts | Export `AvatarGroup` + types | +2 −0 |
| modified | src/pages/home/HomeVersionCard.tsx | Reordered hierarchy (client+status → project → version+date → team+Open); project promoted to primary (`dcx-md-plus`); `TBD` launch fallback; `ArrowUpRight` open affordance; replaced arbitrary `text-[9px]` avatars with AvatarGroup; removed `font-mono` so version/date render in Gilroy | +59 −29 |

### Design decisions (inspected first, did not assume shared styles correct)
| Shared piece | Verdict | Action |
|---|---|---|
| `.glass-card` | shared by 4 consumers | not overridden — added `.home-version-card` variant on top |
| `.status-badge` + status tokens | correct, token-governed, shared with HomeActivityPanel | kept as-is; lifecycle colours stay token-driven |
| Avatar treatment | no shared component existed | created reusable `AvatarGroup`; left `VersionCrewPanel` (different vertical-list treatment) untouched |
| Typography | `font-mono` version/date fell back to system monospace (Geist is the app sans; Gilroy loaded via @font-face) | card now uses only inherited Gilroy — no raw colours / new glass opacity / arbitrary values introduced |

### Verification
| Gate | Result |
|---|---|
| npm run verify:frontend (typecheck, lint 0-warnings, verify.sh, validate:architecture — 300 modules) | PASS |
| npm run test | PASS — 92/92 |
| Browser (Playwright, 1280px) | Cards read in required order; TBD confirmed on null-date version; hover brightens border/glow + accents "Open"; avatar `+N` overflow works; navigation preserved (card → /version/:id); computed font-family = Gilroy for project/version/date/body |

Preserved: navigation and all data bindings (client/project from metadata, versionNumber, communicatedDate, assignedTeam, status). No unrelated consumers changed.
