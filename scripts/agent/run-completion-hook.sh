#!/usr/bin/env bash
# run-completion-hook.sh — Completion gate hook for sprint output files
# Called by PostToolUse when a sprint output file is written/edited.
# Warns if the sprint may have unreconciled manifestations.
# Usage: bash scripts/agent/run-completion-hook.sh <path-to-output-file>
set -euo pipefail

OUTPUT_FILE="${1:-}"
if [[ -z "$OUTPUT_FILE" ]]; then
  echo "[COMPLETION-HOOK] No output file provided — skipping"
  exit 0
fi

REPO="$(cd "$(dirname "$0")/../.." && pwd)"

# Only run for sprint output files that modify source code
OUTPUT_BASENAME="$(basename "$OUTPUT_FILE")"

# If the output file exists, check if it references code changes
if grep -qi "created\|edited\|modified\|built\|implemented" "$OUTPUT_FILE" 2>/dev/null; then
  echo ""
  echo "╔══════════════════════════════════════════════════════════════╗"
  echo "║  COMPLETION GATE REMINDER                                   ║"
  echo "║                                                            ║"
  echo "║  This sprint output was written for a sprint that may have  ║"
  echo "║  changed source code. Before closing, run:                  ║"
  echo "║                                                            ║"
  echo "║    dcx-manifestation-reconcile                              ║"
  echo "║    npm run req:completion-gate -- --changed <files>         ║"
  echo "║    npm run req:validate                                     ║"
  echo "║                                                            ║"
  echo "║  A sprint must not be closed with unreconciled              ║"
  echo "║  manifestations or failing validators (core.md §REQ-1).     ║"
  echo "╚══════════════════════════════════════════════════════════════╝"
  echo ""
fi
