#!/usr/bin/env bash
# Sweeps all TRC links with needs_confirmation: true
# Outputs a CSV: id,source,target,source_exists,target_exists,action
set -euo pipefail
GRAPH="docs/product/requirements/graph"
NODES="$GRAPH/nodes"
echo "id,source,target,source_exists,target_exists,action"
for f in "$GRAPH/trace-links"/TRC-*.json; do
  needs=$(jq -r '.needs_confirmation // false' "$f")
  [ "$needs" = "true" ] || continue
  id=$(jq -r '.id' "$f")
  src=$(jq -r '.source' "$f")
  tgt=$(jq -r '.target' "$f")
  # resolve source
  prefix_src="${src%%-*}"
  case "$prefix_src" in
    REQ) src_dir="$NODES/requirement" ;;
    MAN) src_dir="$NODES/manifestation" ;;
    AC)  src_dir="$NODES/acceptance" ;;
    BHV) src_dir="$NODES/behavior" ;;
    RSP) src_dir="$NODES/responsibility" ;;
    EMC) src_dir="$NODES/expected-category" ;;
    INT) src_dir="$NODES/intent" ;;
    QST) src_dir="$NODES/open-question" ;;
    *)   src_dir="$NODES/misc" ;;
  esac
  # resolve target
  prefix_tgt="${tgt%%-*}"
  case "$prefix_tgt" in
    REQ) tgt_dir="$NODES/requirement" ;;
    MAN) tgt_dir="$NODES/manifestation" ;;
    AC)  tgt_dir="$NODES/acceptance" ;;
    BHV) tgt_dir="$NODES/behavior" ;;
    RSP) tgt_dir="$NODES/responsibility" ;;
    EMC) tgt_dir="$NODES/expected-category" ;;
    INT) tgt_dir="$NODES/intent" ;;
    QST) tgt_dir="$NODES/open-question" ;;
    *)   tgt_dir="$NODES/misc" ;;
  esac
  src_exists="false"
  find "$src_dir" -name "${src}.json" 2>/dev/null | grep -q . && src_exists="true"
  tgt_exists="false"
  find "$tgt_dir" -name "${tgt}.json" 2>/dev/null | grep -q . && tgt_exists="true"
  if [ "$src_exists" = "true" ] && [ "$tgt_exists" = "true" ]; then
    action="CONFIRM"
  else
    action="STALE"
  fi
  echo "$id,$src,$tgt,$src_exists,$tgt_exists,$action"
done
