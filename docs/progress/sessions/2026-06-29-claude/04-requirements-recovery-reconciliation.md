## Requirements recovery + CSV/v0.1.4 reconciliation
Agent: Claude
Model: claude-opus-4-8
Provider: Anthropic
Date: 2026-06-29
Type: mixed (audit-review + user-request-planning)
Status: Completed (pending PO's additional requirements)
(Backfill under §33.)

Intent: PO believed core requirements (keyboard, duplication, multi-move, deselect, drag rearrangement/
scroll-by-container) were written "over and over" but missing from the discovery. Search everything.
Trigger: user — "where did the keyboard shortcuts go? duplication... deselecting from stage... search all
requirement and product docs and csv... leave no decision open."

Critical finding: the entire discovery was grounded in the thin docs/product/requirements/builder/*.md and
NEVER opened the authoritative `dcx-requirements-master.csv` (217 reqs) NOR the v0.1.4 codebase.

Recovered (evidence):
- Keyboard layer LOST in v0.3.5 rewrite — v0.1.4 useKeyboardInteractions.ts had ⌘A/⌘C/⌘V/Delete/Escape-deselect; current src/ has no global keyboard hook. SC-004 (⌘S), BC-012 (shortcuts).
- Copy/paste + duplicate-multiple-to-target (v0.1.4 C/V, SBC-001, islands Duplicate).
- Manual deselect (v0.1.4 Escape) — gone in current build.
- STG-004/005 (scroll-direction-by-container, off-stage dropzones, "never lose drag context" = "no longer breaks"), DZ-001 dropzone engine, SBC-001..005 card system, IFX-001 motion, FCS-002 isolation, RDY-003, KBI-001.

Reconciliation method (timeline, evidence): CSV 06-25 15:52 → builder/*.md 06-25 23:51; no later doc references CSV STG/SBC/DZ/FCS IDs. Rule: builder/*.md current for what it covers; CSV+v0.1.4 fill the gaps; newer wins on conflict.

Contradiction found + re-decided: FCS-002 (hide) vs D-02 (highlight) → D-02 refined to highlight-default + opt-in Isolation Mode. Register updated.

Files created: output/requirements-recovery.md (recovery + reconciliation method + gap-integration map + contradiction register).
Files edited: output/decision-register.md (D-02 refined).
Gates: N/A — discovery/docs only, no src/ change.
Follow-ups: PO will add the rest of the missing requirements ("I'll add the rest myself"); then finalize gap list + integrate all into a single coherent FP-R5 three-family matrix. INTEGRATION ON HOLD pending PO list.
