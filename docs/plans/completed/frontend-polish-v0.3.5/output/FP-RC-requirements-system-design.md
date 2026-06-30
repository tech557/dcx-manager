---
doc: FP-RC-requirements-system-design
status: SUPERSEDED (2026-06-29) — premature design; methodology rejected by PO
superseded-by: docs/plans/drafted/requirements-system/
agent: Claude (claude-opus-4-8)
date: 2026-06-29
purpose: (historical) early design sketch. The proper plan is docs/plans/drafted/requirements-system/.
---

> **SUPERSEDED.** Premature, markdown-centric, no automation/sign-off model. PO course-corrected: the
> system must be human+agent editable, mechanically automated, with sign-off-before-mutation and
> relationship checking. See `docs/plans/drafted/requirements-system/`. Kept only as a thinking record.

# DCX Requirements System — design proposal (FP-RC)

## Why (the problem this kills permanently)

Six overlapping requirement sources, two ID schemes, drift, duplication, and contradictions. It caused
the discovery to miss the core interaction system. The fix is not "pick a master file" — it's a **system**
that is grounded (every requirement traceable), ledgered (decisions have an audit trail / timeline),
navigable (no confusion finding anything), and **wired into the agents** so the gap can't recur.

---

## The system (proposed shape)

```
docs/product/
├── REQUIREMENTS.md              ← THE entry point: map, ID legend, "how to find X", links out
├── requirements/
│   ├── stage.md                 ← canonical requirements, one file per DOMAIN
│   ├── cards.md                 ←   (Stage, Cards, Islands, Drag/Drop, Readiness, Views,
│   ├── drag-drop.md             ←    Creation, Keyboard/Selection, Lifecycle, Permissions,
│   ├── islands.md               ←    Files, Persistence …)
│   ├── readiness.md
│   ├── views.md
│   ├── creation.md
│   ├── keyboard-selection.md    ← (recovered: ⌘A/C/V, Delete, Esc-deselect, ⌘S)
│   ├── lifecycle.md  permissions.md  files.md  persistence.md
│   └── data-model.md            ← canonical data-model summary (entities, fields, relations, states)
├── decision-ledger.md           ← APPEND-ONLY audit trail of every product + technical decision
└── _provenance/                 ← one-time migration record (CSV row → new ID, v0.1.4 source …); archivable
```

### 1. Canonical requirements (editable, by domain)
Each requirement is a structured block:
`ID | statement | status | priority | provenance | related-IDs | affected-modules | decision-ref | last-changed`
- **Editable** markdown the PO can update — but any change is mirrored to the ledger.
- Status drives behavior: `Confirmed | Proposed | Superseded | Deferred(V2) | Removed`.

### 2. Decision ledger (append-only — the timeline backbone)
`date | decision-id | decision | rationale | supersedes | source (PO/CSV/v0.1.4/sprint) | affects-IDs`
- **Never edit a past entry; supersede with a new one.** This is the audit ledger you asked for.
- Permanently resolves "which is newer" — a requirement's current truth is its latest ledger entry.
- The FP discovery decisions (D-01…D-12, the 4 core-model alignments, FCS-002) become the first
  ledger entries, with their dates.

### 3. Data-model summary
Concise canonical model (Version → Phase → Action → Task → Subtask; Day; Channel; Composition) — fields,
relationships, readiness states — wired to requirement IDs and `src/types/`.

### 4. The index (REQUIREMENTS.md)
One user-friendly map: domain list, ID-scheme legend, "where do I find drag rules / keyboard / readiness",
links to ledger + data model. This is the "accessible, no confusion" piece.

### 5. Agent wiring (so it sticks)
- **`core.md`**: new rule — every behavior claim/sprint must **cite a requirement ID**; every new/changed
  decision must be **appended to the decision-ledger** (not buried in a session log).
- **`AGENTS.md`**: routing — "requirements live in `docs/product/REQUIREMENTS.md`; the CSV + v0.1.4 are
  migrated historical inputs, do not cite directly."
- Old scattered docs are dispositioned (keep/merge/remove/archive) — **PO-gated**.

---

## The FP-RC sprint (staged, PO-gated)

| Step | Output | Gate |
|---|---|---|
| RC.1 **System design** | this doc | **PO confirm (now)** |
| RC.2 **Migrate + reconcile** | all sources → the system, timeline/ledger-based; data-model summary; your additions folded in | PO review |
| RC.3 **Doc disposition** | keep/merge/remove/archive proposal for every old requirement doc | **PO approves before any delete** |
| RC.4 **Agent wiring** | core.md/AGENTS.md rules + REQUIREMENTS.md index | PO review |
| RC.5 **Final sign-off** | locked canonical set + ledger | **PO sign-off** |
| → then | **redo FP-R4** (behavior spec) and **FP-R5** (synthesis) grounded on the system | normal |

No `src/` changes. Edits are confined to `docs/product/**` + the agent-rule files; deletions PO-gated.

---

## Open design choices for PO (confirm before I write the sprint file)

1. **Scope:** full project (all 217 CSV categories incl. lifecycle/permissions/persistence) or
   builder-interaction first, others later?
2. **ID scheme:** keep the CSV domain prefixes (STG/SBC/CRD/DZ/FCS/RDY…) as canonical and alias the
   BLD-/OD- IDs into them, or design a fresh unified scheme?
3. **Ledger shape:** one global `decision-ledger.md`, or per-domain ledgers?
4. **Data-model source:** derive from `src/types/` (code-true) or author from requirements (intent-true),
   reconciling differences as ledger entries?
