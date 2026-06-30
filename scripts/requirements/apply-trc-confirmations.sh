#!/usr/bin/env bash
set -euo pipefail
GRAPH="docs/product/requirements/graph"
REPORT="/tmp/trc-confirm-report.csv"
count=0
while IFS=, read -r id src tgt src_exists tgt_exists action; do
  [ "$action" = "CONFIRM" ] || continue
  f="$GRAPH/trace-links/${id}.json"
  [ -f "$f" ] || continue
  tmp=$(mktemp)
  jq '.needs_confirmation = false
    | .confirmation_status = "confirmed"
    | .last_checked_date = "2026-06-30"' "$f" > "$tmp" && mv "$tmp" "$f"
  count=$((count + 1))
done < <(tail -n +2 "$REPORT")
echo "Applied CONFIRM to $count TRC files"
