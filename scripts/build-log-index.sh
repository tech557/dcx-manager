#!/usr/bin/env bash
# build-log-index.sh — Parse all session logs and build docs/progress/index.csv
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
INDEX_FILE="${PROJECT_DIR}/docs/progress/index.csv"
SESSIONS_DIR="${PROJECT_DIR}/docs/progress/sessions"

echo "=== Log Index Builder ==="
echo "Sessions: $SESSIONS_DIR"
echo "Index: $INDEX_FILE"

# Ensure sessions directory exists
if [ ! -d "$SESSIONS_DIR" ]; then
  echo "No sessions directory found at $SESSIONS_DIR"
  echo "Creating empty index."
  mkdir -p "$(dirname "$INDEX_FILE")"
  echo "date,agent,model,session_folder,sprint_id,status,intent,typecheck,verify,other_gates,files_changed,type" > "$INDEX_FILE"
  exit 0
fi

# Create header if file doesn't exist
if [ ! -f "$INDEX_FILE" ]; then
  mkdir -p "$(dirname "$INDEX_FILE")"
  echo "date,agent,model,session_folder,sprint_id,status,intent,typecheck,verify,other_gates,files_changed,type" > "$INDEX_FILE"
fi

# Track already-indexed filenames via temp file
# Check which log paths are already in the index
if [ -f "$INDEX_FILE" ]; then
  tail -n +2 "$INDEX_FILE" 2>/dev/null | cut -d',' -f4 > /tmp/indexed_sessions.tmp || true
else
  : > /tmp/indexed_sessions.tmp
fi

NEW_ENTRIES=0

# Walk session directories
for session_dir in "$SESSIONS_DIR"/*/; do
  [ -d "$session_dir" ] || continue
  session_name=$(basename "$session_dir")
  echo "  Scanning $session_name..."

  for log_file in "$session_dir"*.md; do
    [ -f "$log_file" ] || continue
    log_name=$(basename "$log_file")

    # Skip README files
    if [[ "$log_name" == "README.md" ]]; then
      continue
    fi
    if grep -F "$session_name/$log_name" /tmp/indexed_sessions.tmp > /dev/null 2>&1; then
      echo "    Skipping (already indexed): $log_name"
      continue
    fi

    # Extract fields using awk
    fields=$(awk -v session_name="$session_name" -v log_name="$log_name" '
      function trim(s){ gsub(/^[ \t]+/, "", s); gsub(/[ \t]+$/, "", s); return s }
      BEGIN {
        sprint_id = ""; agent = ""; model = ""; provider = "";
        date = ""; status = ""; intent = ""; files_changed = 0;
        typecheck = ""; verify = ""; other_gates = ""; type = "";
      }
      # Sprint ID from title: ## SprintID — ...
      # Capture the FIRST H2 only; later section headings must not overwrite it.
      /^## / {
        if (sprint_id == "") {
          title = substr($0, 4);
          split(title, parts, " — ");
          sprint_id = parts[1];
        }
      }
      # Key-value fields
      /^Agent: / { agent = substr($0, 8); }
      /^Model: / { model = substr($0, 8); }
      /^Provider: / { provider = substr($0, 10); }
      /^Date: / { date = substr($0, 7); }
      /^Status: / { status = substr($0, 9); }
      /^Type: / { type = substr($0, 7); }
      /^Intent: / { intent = substr($0, 9); }
      # Count files created and edited — OLD plain-block format
      /^Files created:/ { in_files = 1; next; }
      /^Files edited:/ { in_files = 1; next; }
      /^Files deleted:/ { in_files = 0; next; }
      /^Churn/ { in_files = 0; next; }
      in_files && /^  / { files_changed++; next; }
      in_files && /^$/ { in_files = 0; }
      # Count files — NEW "### Files touched" table format (rows: | created/edited | ... |)
      /^\| *created *\|/ { files_changed++; next; }
      /^\| *edited *\|/ { files_changed++; next; }
      # Gate results — OLD plain "Gates:" block format
      /^  typecheck:/ { typecheck = substr($0, index($0, ":") + 2); }
      /^  verify\\.sh:/ { verify = substr($0, index($0, ":") + 2); }
      /^Gates:/ { in_gates = 1; next; }
      in_gates && /^  / && !/^  typecheck:/ && !/^  verify\\.sh:/ {
        gsub(/^  /, "");
        other_gates = other_gates ";" $0;
      }
      /^Consumer/ { in_gates = 0; }
      # Gate results — NEW "### Gates" table format (rows: | gate | result |)
      /^### Gates/ { in_gtbl = 1; next; }
      /^### / { in_gtbl = 0; }
      /^## / { in_gtbl = 0; }
      /^\| *typecheck *\|/ { split($0, gc, "|"); typecheck = trim(gc[3]); next; }
      /^\| *verify\.sh *\|/ { split($0, gc, "|"); verify = trim(gc[3]); next; }
      in_gtbl && /^\| / && !/^\|[ :|-]*$/ {
        split($0, gc, "|"); g = trim(gc[2]); r = trim(gc[3]);
        if (g != "" && g != "Gate") other_gates = other_gates ";" g ":" r;
      }
      END {
        # Escape commas and quotes for CSV
        gsub(/,/, " ", sprint_id);
        gsub(/,/, " ", intent);
        gsub(/,/, " ", agent);
        gsub(/,/, " ", model);
        gsub(/,/, " ", provider);
        gsub(/,/, " ", status);
        gsub(/"/, "", sprint_id);
        gsub(/"/, "", intent);
        gsub(/,/, " ", typecheck);
        gsub(/,/, " ", verify);
        gsub(/,/, " ", other_gates);
        gsub(/,/, " ", type);
        printf "%s,%s,%s,%s/%s,%s,%s,\"%s\",%s,%s,\"%s\",%d,%s\n",
          date, agent, model, session_name, log_name,
          sprint_id, status, intent, typecheck, verify, other_gates, files_changed, type;
      }
    ' "$log_file")

    if [ -n "$fields" ]; then
      echo "$fields" >> "$INDEX_FILE"
      NEW_ENTRIES=$((NEW_ENTRIES + 1))
      echo "    Added: $log_name"
    else
      echo "    Warning: could not parse $log_name"
    fi
  done
done

rm -f /tmp/indexed_sessions.tmp

echo ""
echo "=== Index updated ==="
echo "New entries: $NEW_ENTRIES"
echo "Total lines: $(wc -l < "$INDEX_FILE")"

# Regenerate the PO follow-up roll-up (log-format.md §3) so it is always current.
if [ -x "${SCRIPT_DIR}/build-po-actions.sh" ]; then
  echo ""
  bash "${SCRIPT_DIR}/build-po-actions.sh" || echo "WARN: build-po-actions.sh failed (non-fatal)"
fi
