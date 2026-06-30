#!/usr/bin/env bash
set -euo pipefail
GRAPH="docs/product/requirements/graph"
REPORT="/tmp/trc-confirm-report.csv"
count=0
while IFS=, read -r id src tgt src_exists tgt_exists action; do
  [ "$action" = "STALE" ] || continue
  f="$GRAPH/trace-links/${id}.json"
  [ -f "$f" ] || continue
  tmp=$(mktemp)
  jq '.stale_state = "stale"
    | .needs_confirmation = false
    | .stale_reason = "source or target node not found on disk (confirmed 2026-06-30)"' \
    "$f" > "$tmp" && mv "$tmp" "$f"
  count=$((count + 1))
done < <(tail -n +2 "$REPORT")
echo "Applied STALE to $count TRC files"
