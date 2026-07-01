#!/usr/bin/env bash
# BE3-R5a — wrapper for summarize-capture.mjs (portable; core.md §36b).
# Rolls a raw capture JSON into a per-route summary + scrub check.
# Usage: summarize-capture.sh <raw-capture.json> [out-summary.json]
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec node "${HERE}/summarize-capture.mjs" "$@"
