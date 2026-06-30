## AC-COVERAGE-GAP — Acceptance criteria gap table
Agent: opencode
Model: deepseek-v4-flash-free
Provider: opencode
Date: 2026-06-30
Type: audit-review
Status: Completed
PO-Action: pending

Intent: Identify all REQ nodes with zero TRC links to an AC node. Output a prioritised gap table for PO to decide which AC nodes to create next. No graph files modified.
Trigger: PO-approved sweep — session 2026-06-30 Task E

### Summary
| Metric | Count |
|---|---|
| Total REQs | 258 |
| REQs with AC link | 219 |
| REQs WITHOUT AC link (gaps) | 39 |

### Gap table

### Family: CAL (2 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-CAL-MONTH-001 | unknown | approved | partially-implemented |
| REQ-CAL-WEEK-001 | unknown | approved | not-assessed |

### Family: DENSITY (1 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-DENSITY-001 | unknown | approved | implemented |

### Family: DZ (1 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-DZ-001-RECOVERY | unknown | proposed | not-assessed |

### Family: FP (16 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-FP-CMA-001 | MVP | approved | not-assessed |
| REQ-FP-CMA-002 | MVP | approved | not-assessed |
| REQ-FP-CMA-003 | MVP | approved | not-assessed |
| REQ-FP-CMA-004 | MVP | approved | not-assessed |
| REQ-FP-D01 | MVP | approved | not-assessed |
| REQ-FP-D02 | MVP | approved | not-assessed |
| REQ-FP-D03 | MVP | approved | not-assessed |
| REQ-FP-D04 | MVP | approved | not-assessed |
| REQ-FP-D05 | MVP | approved | not-assessed |
| REQ-FP-D06 | MVP | approved | implemented |
| REQ-FP-D07 | MVP | approved | not-assessed |
| REQ-FP-D08 | MVP | approved | not-assessed |
| REQ-FP-D09 | MVP | approved | implemented |
| REQ-FP-D10 | MVP | approved | implemented |
| REQ-FP-D11 | MVP | approved | implemented |
| REQ-FP-D12 | MVP | approved | not-assessed |

### Family: GOV (6 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-GOV-CAL-001 | unknown | locked | implemented |
| REQ-GOV-INV-001 | unknown | locked | implemented |
| REQ-GOV-SRC-001 | unknown | locked | implemented |
| REQ-GOV-TRACE-001-AGENT | unknown | locked | not-assessed |
| REQ-GOV-TRACE-001-DATA | unknown | locked | not-assessed |
| REQ-GOV-TRACE-001 | unknown | locked | not-assessed |

### Family: KEY (7 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-KEY-001 | unknown | approved | partially-implemented |
| REQ-KEY-002 | unknown | approved | partially-implemented |
| REQ-KEY-003 | unknown | approved | partially-implemented |
| REQ-KEY-004 | unknown | approved | partially-implemented |
| REQ-KEY-005 | unknown | approved | partially-implemented |
| REQ-KEY-006 | unknown | approved | not-assessed |
| REQ-KEY-007 | unknown | approved | partially-implemented |

### Family: LOAD (1 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-LOAD-SKEL-001 | unknown | approved | implemented |

### Family: PRESENT (1 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-PRESENT-001 | unknown | approved | implemented |

### Family: RESP (1 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-RESP-001 | unknown | approved | not-assessed |

### Family: SBC (2 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-SBC-DES-001 | unknown | approved | partially-implemented |
| REQ-SBC-DUP-001 | unknown | approved | not-assessed |

### Family: SBT (1 gaps)
| REQ ID | priority | governance | delivery |
|---|---|---|---|
| REQ-SBT-COPY-001 | unknown | approved | not-assessed |

### Top 5 MVP gaps (PO priority)

These are the highest-value AC nodes to create next — MVP priority, governance approved, currently missing AC trace links.

| REQ ID | statement (first 60 chars) | why it matters |
|---|---|---|
| REQ-FP-CMA-001 | Add a live Version-readiness summary in the header / metadat | Core UX — users need at-a-glance readiness |
| REQ-FP-CMA-002 | SMART default: active phase(s) expanded, the rest collapsed | Default builder state — highest-visibility UX |
| REQ-FP-CMA-003 | AUTO-CENTRE on select/navigate: selecting a card or jumping | Navigation contract — anchors stage behaviour |
| REQ-FP-D01 | Task card as a single responsive component that resizes betw | Card system foundation — responsive layout |
| REQ-FP-D06 | Dedicated sprint to add reduced-motion branches across effec | Accessibility requirement — reduced motion |

### Spot-check verification
| REQ ID checked | AC TRC count | Expected |
|---|---|---|
| REQ-CAL-MONTH-001 | 0 | 0 |
| REQ-KEY-001 | 0 | 0 |
| REQ-FP-D06 | 0 | 0 |

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| none | — | Read-only audit | — |

### PO follow-up required
PO-Action: pending — review gap table and confirm which AC families
to create next. Suggested next skill: dcx-requirement-intake.
