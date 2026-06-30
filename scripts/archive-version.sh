#!/usr/bin/env bash
set -euo pipefail

if [ $# -ne 2 ]; then
  echo "Usage: $0 <old_version> <new_version>"
  echo "Example: $0 v0.3.2 v0.4.0"
  exit 1
fi

OLD_VERSION="$1"
NEW_VERSION="$2"
OLD_BASE="${OLD_VERSION#v}"
NEW_BASE="${NEW_VERSION#v}"

ARCHIVE_DIR="docs/archive"
SESSION_ARCHIVE="${ARCHIVE_DIR}/sessions/v${OLD_BASE%.*}.${OLD_BASE##*.}"
PLANS_COMPLETED="docs/plans/completed"

echo "=== Archive: ${OLD_VERSION} -> ${NEW_VERSION} ==="

# 1. Archive progress sessions
if [ -d "docs/progress/sessions" ] && [ "$(ls -A docs/progress/sessions/ 2>/dev/null)" ]; then
  mkdir -p "$SESSION_ARCHIVE"
  echo "Moving docs/progress/sessions/ -> $SESSION_ARCHIVE/"
  cp -r docs/progress/sessions/* "$SESSION_ARCHIVE/"
  echo "Session logs copied to archive. Run 'rm -rf docs/progress/sessions/*' manually after confirming."
else
  echo "No session logs to archive."
fi

# 2. Archive completed active plans
if [ -d "docs/plans/active" ]; then
  for plan_dir in docs/plans/active/*/; do
    plan_name=$(basename "$plan_dir")
    plan_readme="${plan_dir}README.md"
    
    # Check if plan README says "completed" or all sprints done
    if [ -f "$plan_readme" ] && grep -qi "status: completed" "$plan_readme" 2>/dev/null; then
      mkdir -p "$PLANS_COMPLETED"
      echo "Moving completed plan $plan_name to docs/plans/completed/"
      cp -r "$plan_dir" "${PLANS_COMPLETED}/${plan_name}"
    fi
  done
fi

# 3. Update archive README
ARCHIVE_README="${ARCHIVE_DIR}/README.md"
mkdir -p "$ARCHIVE_DIR"

if [ -f "$ARCHIVE_README" ]; then
  # Append new version entry
  echo "" >> "$ARCHIVE_README"
  echo "## ${NEW_VERSION} Archive" >> "$ARCHIVE_README"
  echo "- **Date:** $(date +%Y-%m-%d)" >> "$ARCHIVE_README"
  echo "- **Previous version:** ${OLD_VERSION}" >> "$ARCHIVE_README"
  echo "- **Session logs:** \`sessions/v${OLD_BASE%.*}.${OLD_BASE##*.}/\`" >> "$ARCHIVE_README"
else
  cat > "$ARCHIVE_README" << EOF
# Documentation Archive

Superseded documents from previous versions. Do not delete — historical record.

## ${NEW_VERSION} Archive

- **Date:** $(date +%Y-%m-%d)
- **Previous version:** ${OLD_VERSION}
- **Session logs:** \`sessions/v${OLD_BASE%.*}.${OLD_BASE##*.}/\`
EOF
fi

echo "=== Archive complete ==="
echo "Next steps (manual):"
echo "  1. Verify archived content in ${SESSION_ARCHIVE}/"
echo "  2. Remove archived sessions: rm -rf docs/progress/sessions/*"
echo "  3. Remove moved plans from docs/plans/active/"
