---
opened-by: FP-R0 (Claude claude-sonnet-4-6, 2026-06-28)
closed-by: FP-R5 (Claude claude-opus-4-8, 2026-06-29 — PO ruling session)
status: closed
---

# Decision Register — frontend-polish-v0.3.5

**CLOSED 2026-06-29.** All items ruled by the PO (tech@dotment.com) in an interactive FP-R5 decision
session. No item remains `PO decision required`. FP-R5 may now draft executable implementation sprints
for every resolved scope.

Statuses: `PO decision required` | `Resolved — <decision>` | `Out of scope`

---

| ID | Surface | Question | Status | Family |
|---|---|---|---|---|
| D-01 | Task card (stage) | Task cards render at 56×56px showing only a date badge — name/channel not visible without opening the editor. Intentional, or a gap? | `Resolved — Keep compact but re-engineer as ONE responsive card that resizes between collapsed/expanded (NOT separate collapsed/expanded components). Spacing, margins, font-sizes must be responsive/token-driven, not hardcoded px. PO wants further design thought on the expand/collapse-as-resize model → sprint includes a design-exploration step + PO sign-off before implementation.` | `change-component` (+ `change-token` for responsive sizing) |
| D-02 | FocusIsland | Button opens editor as a side-effect; no filter/locator panel rendered. What should it show? Highlight vs hide? | `Resolved (refined 2026-06-29 after CSV reconciliation) — TWO modes: (1) DEFAULT = highlight/spotlight (FCS-001): activates/highlights matching values while keeping non-matching VISIBLE (full picture retained); (2) OPT-IN Isolation Mode (FCS-002): an explicit toggle that HIDES non-selected cards (visual-only, no data deleted). Both exist; default is highlight. Implement per islands.md F01–F06 + master CSV FCS-001/FCS-002.` | `wire-mockup-data` |
| D-03 | ViewHelperIsland | Absent from DOM at 1440px during FP-R0. Deferred, removed, or in scope? | `Resolved — NOT absent: code is view-gated (if view === 'kanban' return null) so it only renders in timeline/calendar views. FP-R0 inventoried kanban view → false gap. In scope, behavior covered by FP-R4 T05/T06. Add a browser-verification step in the TIMELINE view to the relevant sprint — no new discovery sprint needed.` | `wire-mockup-data` |
| D-04 | AIChatPopup / TemplatePopup | No discoverable trigger/entry point. In scope? | `Resolved — Wire entry points so both popups are reachable. In scope for v0.3.5.` | `wire-mockup-data` |
| D-05 | Theme toggle (HeaderUserIsland) | Clicking did not change html.dataset.theme/classList. Bug, dev-lock, or intentional? | `Resolved — Treat as a bug; fix the toggle to actually switch theme. PREREQUISITE for all light-theme token work (L01–L08) — must land before/with the change-token light-theme sprint.` | `wire-mockup-data` |
| D-06 | Reduced-motion compliance | prefers-reduced-motion branches unverified; effects.registry.ts has none wired. Original default 'assign to FP-R3' is stale (FP-R3 completed without it). | `Resolved — Dedicated sprint to add reduced-motion branches across effects.registry.ts + islands/cards per FP-R4 M01–M05 and core.md §20.` | `change-component` |
| D-07 | Homepage / version reference | Brand/UI contract requires a v0.1.4 UI reference; none was in the workspace. | `Resolved — PO supplied the reference at docs/archive/dcx-manager-v0.1.4 (full prior codebase incl. src/pages/home/{Home,VersionsList,VersionCard} and src/pages/version/{VersionPage,VersionSummary}). Homepage/version UNBLOCKED. FP-R4 left those specs informative-only → FP-R5 grounds the homepage/version sprints in this reference + the brand contract.` | `change-component` + `wire-mockup-data` |
| D-08 | brandbook.pdf | Brandbook values extraction (image-only vs text-layer). | `Resolved — Codex extracted brandbook values from the PDF text layer; use output/brandbook-values.md as the FP-R1 values source. Evidence: output/evidence/brandbook-colors-page-11..14.png.` | N/A (FP-R1) |
| D-09 | Builder — Editor | Collapsed editor button (#editor-island) disabled unconditionally, drag-only. Enable click-to-open on selection? | `Resolved — Enable click-to-open when a card is selected (in addition to drag).` | `change-component` |
| D-10 | Builder — Editor | Routing & Endpoint Directory fields truncate at 382px editor width. | `Resolved — Single-column layout for the routing fields (full width). No editor-width change.` | `change-component` |
| D-11 | Builder — Readiness | Collapsed Phase (72px) hides readiness text — only badge circles visible. | `Resolved — Add readiness text via tooltip (hover) + aria-label (screen readers).` | `change-component` |
| D-12 | Builder — Structural tokens | Tokenize layout widths/heights (phase 72/260px, editor 382px, header 64px, footer 76px), or keep hardcoded? | `Resolved — Tokenize them; move toward responsive, token-driven sizing and away from hardcoded px (aligns with D-01 direction). Values unchanged (layout frozen, core.md §10) — same pixels, sourced from tokens.` | `change-token` (define) + `change-component` (consume) |

---

## Resolution summary (for FP-R5 drafting)

- **All 12 items resolved.** 0 remain `PO decision required`. Nothing is parked.
- **Nothing dropped as Out-of-scope** this round — the PO opted for a thorough polish pass. (D-03/D-04
  which carried "out of scope" defaults were both pulled INTO scope.)
- **Two items carry PO design direction beyond a yes/no:**
  - **D-01** — responsive single-resizing-card model; needs a design-exploration step + PO sign-off in
    its sprint (not a blind fix).
  - **D-02** — FocusIsland highlight-not-hide semantic.
- **Sequencing constraint:** D-05 (theme-toggle fix) is a prerequisite for the light-theme
  `change-token` work (L01–L08). D-12/D-01 responsive-sizing tokens should land with the token sprint
  so components consume them.
- **D-07 reopens homepage/version:** FP-R4 specced those surfaces as informative-only; FP-R5 now drafts
  their sprints grounded in `docs/archive/dcx-manager-v0.1.4`.

FP-R5 reads this register before drafting. All scopes are now draftable.
