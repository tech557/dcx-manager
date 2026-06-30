# Progress Log Format — DCX Manager v0.2.18

This file replaces AGENTS.md §0 (Identity Block) and §12 (Progress Log Format). No rule is changed — only extracted.

---

## §0. Identity Block — First Line of Every Log Entry

```
Agent: [Codex | Google AI Studio | Claude | other]
Model: [exact model name e.g. gemini-2.5-pro, gpt-4o, claude-opus-4]
Provider: [Google | OpenAI | Anthropic | other]
Date: YYYY-MM-DD
Type: [sprint-execution | user-request-code | user-request-planning | audit-review | process-governance | mixed]
PO-Action: [none | pending]
```

No session log is complete without this. `Type:` is mandatory — see **§2**. `PO-Action:` is mandatory —
see **§3** (it drives the always-visible PO follow-up roll-up). These stay as plain `Key: value` lines
(the index builder parses them); the **body** of the log is tables (§1) for human readability.

---

## §2. One indexed, typed task per user message (STRICT — added 2026-06-29)

**Every user message is indexed as exactly one task entry** in the current session folder — a sequential
`NNN-…md` log file carrying a `Type:` field. **No user message goes unlogged** — including questions,
reviews, audits, and process/governance requests. This complements `core.md §25` (how to *classify* a
message) and `core.md §29a` (every task gets a log): §25 decides the type; **this rule requires you to
record that type on a log entry, one per message.**

### Type taxonomy (aligns with `core.md §25`)

| `Type:` | When | §25 mapping |
|---|---|---|
| `sprint-execution` | message references a sprint ID / active-plan sprint | Sprint execution |
| `user-request-code` | direct code-change instruction ("fix X", "add Y") | User-initiated code change |
| `user-request-planning` | planning / draft / decision-doc work, no code | User-initiated planning |
| `audit-review` | "check this", "audit", "is this good?", "why does X" | User-initiated question / review |
| `process-governance` | changes to agent rules, logging, or the workflow itself | (new) |
| `mixed` | one turn spanning 2+ of the above — **list the components** in the entry | (spans) |

### Rules
- **One log file per user message** (append-only `NNN`). A message that does several things = **one
  `mixed` entry that lists its sub-tasks**, not several files.
- `Type:` is **mandatory** in the §0 header block.
- Conversational / quick answers still get a short entry — brevity is fine, **omission is not**.
- Audits/reviews still write full findings to `output-review/` or `output/`; the session-log entry is the
  **index pointer + summary**, not a duplicate of the full audit.
- A session is **not closeable** (`core.md §29`) while any user message lacks its typed log entry.

---

## §1. Progress Log Format

Log file: `docs/progress/sessions/[YYYY-MM-DD]-[agent][-NN]/[NNN]-[sprint-id]-[task-name].md`

`NNN` is a zero-padded sequential index (01, 02, 03 …) within the session folder. Every log file **must** start with the index. No un-indexed filenames are allowed from v0.2.18 onward. `NNN` restarts at `01` in each new session folder.

**Session folder `[-NN]` suffix:** the first session of the day for an agent is bare (`2026-06-28-claude/`); each additional PO-requested same-day session for that agent appends a zero-padded counter starting at `-02` (`2026-06-28-claude-02/`). See `core.md §31` — open a new folder on a PO "new session" request even on the same date; never merge into the existing day's folder.

**The header stays as plain `Key: value` lines** (machine-parsed). **The body is tables** (human-readable).

```markdown
## [Sprint ID] — [Short factual title]
Agent: [name]
Model: [exact model]
Provider: [name]
Date: YYYY-MM-DD
Type: [see §2 taxonomy]
Status: Completed | Partial | Blocked
PO-Action: none | pending

Intent: [one sentence]
Trigger: [requirement ID | user request quoted | bug name]
Requirements covered: [BLD-XXX-NNN list]

### Files touched
| Action | Path | What & why | Lines |
|---|---|---|---|
| created | path | purpose | N |
| edited | path | what changed | N (was M) |
| deleted | path | why | — |

### Checks
| Check | Result |
|---|---|
| Churn — work reversed | None  /  [earlier task + component if this undoes prior work] |
| Preserve-semantic (§9) | [each boundary respected, or what changed] |
| Open decisions used (⏱) | None  /  [❓ item + temporary default applied] |

### Acceptance criteria
| Criterion | Verdict |
|---|---|
| [criterion from sprint task] | PASS / FAIL |

### Gates
| Gate | Result |
|---|---|
| typecheck | PASS / FAIL / N/A |
| verify.sh | PASS / FAIL / N/A |
| validate:architecture | PASS / FAIL / N/A |
| test | PASS / FAIL / N/A |
| browser manual check | [what was verified] / N/A |

### 🔔 PO action required
| Item | Why it needs the PO | Suggested action |
|---|---|---|
| None | — | — |

### Consumer updates required
- [files that import changed exports — must be verified, or "None"]

### Open issues / follow-ups
- [anything incomplete, new warnings, deferred items, or "None"]
```

### Log rules
- No marketing adjectives (not "gorgeous," "premium," "stunning," "elegant")
- Line counts are real `wc -l` numbers
- Task numbering is append-only, never reused
- The **Checks** row "Churn — work reversed" is mandatory (never omit it)
- The **🔔 PO action required** table is mandatory; if there is nothing for the PO, keep the single
  `| None | — | — |` row AND set the header `PO-Action: none`. If there is **anything** the PO must
  decide, approve, add, fix, or be aware of, list it as a row AND set the header `PO-Action: pending`.

### Mandatory: update the CSV index after every log

After writing or updating a session log file, run:

```bash
bash scripts/build-log-index.sh
```

This is a **required final step** — a sprint is not complete until the index is updated. The script is incremental (skips already-indexed entries) so running it multiple times is safe.

Agents without terminal access must note in their log: `index: deferred — no terminal`. The next terminal-capable agent in the session must run the script before closing the session.

`build-log-index.sh` also regenerates the PO follow-up roll-up (§3) on every run, so a normal log close
keeps both current.

---

## §3. PO Follow-up Roll-up — always-visible required actions (added 2026-06-29)

The PO must be able to see, in one place, **every open item that needs his decision, approval, addition,
or attention** — without re-reading every session log.

### Mechanism
1. **Every log carries a `PO-Action:` header** (`none` | `pending`) and a mandatory **`### 🔔 PO action
   required`** table (§1).
2. **`docs/progress/po-actions.md` is the single roll-up.** It is **generated** by
   `bash scripts/build-po-actions.sh` (also invoked automatically at the end of `build-log-index.sh`, which
   the `PostToolUse` hook already runs). It lists every log whose header is `PO-Action: pending`, with that
   log's `🔔 PO action required` rows and a link back to the source log.
3. **The PO checks `docs/progress/po-actions.md`** (or runs `bash scripts/build-po-actions.sh` to refresh).
   When an item is handled, the PO (or an agent at PO direction) flips that log's header to
   `PO-Action: none` and removes/annotates the row; the next roll-up drops it.

### Rules
- If a task produces **anything** the PO must act on or be aware of (a sign-off gate reached, a decision to
  confirm, a version/tooling mismatch, an approval needed, a doc the PO must add), set `PO-Action: pending`
  and list it. **Silent "I'll just mention it in prose" is not allowed** — it must be a roll-up row.
- A session is not closeable (`core.md §29`) while a `PO-Action: pending` log is missing its roll-up row.
- Never set `PO-Action: none` when an open PO item exists — that hides it from the roll-up.

---

## §4. Readable artifacts — tables, charts, glyphs (added 2026-06-29)

Logs and plan outputs are read by humans first. Beyond the §1 tables, use **Mermaid charts** for flows,
graphs, lifecycles, and proportions; **status glyphs** (`✅ ⚠️ ❌ ⛔ 🔔 ⏱ ◷`) for at-a-glance scanning; and
**saved artifacts** (`…/output/evidence/`, never the repo root — `core.md §32`) for screenshots / rendered
images. The canonical convention (when to use which, Mermaid rules, examples) is
**`docs/agent-rules/output-style.md`** — follow it. Keep visuals proportional: a chart must carry
information a sentence wouldn't carry better.
