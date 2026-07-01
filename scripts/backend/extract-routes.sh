#!/usr/bin/env bash
# Deterministic contract-route extractor (BE3-R1).
# Emits the registered route list from src/services/mock-dispatch.ts as JSON.
# Thin portable wrapper around extract-routes.mjs (paths derived from script
# location — no absolute/home paths, core.md §36b). Reused by BE3-R5a/R5b.
set -euo pipefail
HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
exec node "${HERE}/extract-routes.mjs" "$@"
