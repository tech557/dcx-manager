#!/usr/bin/env bash
# build-po-actions.sh — Roll up every open PO follow-up into docs/progress/po-actions.md
# A log opts in by carrying `PO-Action: pending` in its header and a `### 🔔 PO action required` table.
# Safe to run repeatedly; regenerates the roll-up from scratch each time. See log-format.md §3.
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
SESSIONS_DIR="${PROJECT_DIR}/docs/progress/sessions"
OUT_FILE="${PROJECT_DIR}/docs/progress/po-actions.md"

python3 - "$SESSIONS_DIR" "$OUT_FILE" << 'PYEOF'
import os, sys, glob, datetime

sessions_dir, out_file = sys.argv[1], sys.argv[2]
entries = []  # (session, logname, title, rows[])

for log_path in sorted(glob.glob(os.path.join(sessions_dir, "*", "*.md"))):
    name = os.path.basename(log_path)
    if name == "README.md":
        continue
    session = os.path.basename(os.path.dirname(log_path))
    try:
        lines = open(log_path, encoding="utf-8").read().splitlines()
    except Exception:
        continue

    # header: PO-Action: pending ?
    po_pending = any(l.strip().lower().startswith("po-action:") and "pending" in l.lower()
                     for l in lines[:40])
    if not po_pending:
        continue

    # title = first H2
    title = next((l[3:].strip() for l in lines if l.startswith("## ")), name)

    # extract the rows of the "🔔 PO action required" table
    rows, in_section, seen_sep = [], False, False
    for l in lines:
        s = l.strip()
        if s.startswith("###"):
            in_section = ("PO action required" in s)
            seen_sep = False
            continue
        if in_section and s.startswith("|"):
            cells = [c.strip() for c in s.strip("|").split("|")]
            if all(set(c) <= set("-: ") for c in cells):  # separator row
                seen_sep = True
                continue
            low = " ".join(cells).lower()
            if not seen_sep and ("item" in low and "suggested action" in low):  # header row
                continue
            if cells and cells[0].lower() in ("none", "-", ""):  # explicit none
                continue
            rows.append(cells)
    if rows:
        entries.append((session, name, title, rows))

now = datetime.date.today().isoformat()
out = []
out.append("# PO Action Roll-up")
out.append("")
out.append("> **Generated** by `scripts/build-po-actions.sh` (also run by `build-log-index.sh`). "
           "Do not hand-edit — flip the source log's `PO-Action:` header to `none` when an item is done. "
           "See `docs/agent-rules/log-format.md` §3.")
out.append("")
out.append(f"_Last generated: {now} — open items: {len(entries)}_")
out.append("")

if not entries:
    out.append("✅ **No open PO actions.** Every session log is `PO-Action: none`.")
else:
    for session, name, title, rows in entries:
        rel = f"sessions/{session}/{name}"
        out.append(f"## {title}")
        out.append(f"Source: [`{rel}`]({rel})")
        out.append("")
        out.append("| Item | Why it needs the PO | Suggested action |")
        out.append("|---|---|---|")
        for cells in rows:
            cells = (cells + ["", "", ""])[:3]
            out.append("| " + " | ".join(cells) + " |")
        out.append("")

open(out_file, "w", encoding="utf-8").write("\n".join(out) + "\n")
print(f"PO action roll-up written: {out_file} ({len(entries)} open).")
PYEOF
