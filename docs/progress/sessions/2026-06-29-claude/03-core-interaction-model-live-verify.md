## Core Interaction & State Model + live verification
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: mixed (audit-review + user-request-planning + live-verification)
Status: Completed
(Backfill under §33.)

Intent: PO flagged that the discovery captured atomic criteria, not the stage×islands×cards SYSTEM —
state transitions, view/scroll effects, stats, behavior at scale (7–8 phases), and creation flow.
Trigger: user — "first Reopen FP-R4. And i have an important observation... the app is mainly about the
stage, the islands, cards... what happens with 7-8 phases? the scroll? the stats?"

Note: requested FP-R4 reopen was NOT executed — superseded by the deeper core-model concern (PO chose
"core model spec first").

Work:
- Read core requirement docs (builder-overview, stage, cards, readiness, kanban, timeline, islands, drag-and-drop).
- Ran the dev server (preview, port 3000), /builder/v-1; injected 8 phases via localStorage mock store (no src/ change); verified kanban + timeline.
- Live findings: stage is overflow-x-auto/overflow-y-hidden → 8 phases overflow (1760>1200) = horizontal scroll, no vertical (matches stage.md); phases collapsed-by-default centred columns; view switch preserves state; ViewHelperIsland is view-gated (renders timeline, null in kanban → D-03 false gap); per-card readiness but NO aggregate version-readiness display.
- 4 PO alignments captured: (1) version-readiness rollup in header/metadata island; (2) smart default expand (active expanded, rest collapsed); (3) auto-centre on select/navigate; (4) top-down drag-pills as canonical creation.
- Raised CM-1..CM-5 (new requirements) incl. DnD-as-foundational (creation depends on drag, which is inert).

Files created: output/core-interaction-model.md
Gates: N/A — no src/ change (mock injected via browser localStorage only); dev server stopped after.
Follow-ups: fold CM-1..CM-5 into FP-R5; reset preview store done.
