#!/usr/bin/env bash
# run-semgrep.sh — portable wrapper for the DCX Semgrep gate.
set -euo pipefail

REPO="$(cd "$(dirname "$0")/../.." && pwd)"

find_semgrep() {
  if command -v pysemgrep >/dev/null 2>&1; then
    command -v pysemgrep
    return 0
  fi

  if command -v python3 >/dev/null 2>&1; then
    local user_base
    user_base="$(python3 -m site --user-base 2>/dev/null || true)"
    if [[ -n "$user_base" && -x "$user_base/bin/pysemgrep" ]]; then
      printf '%s\n' "$user_base/bin/pysemgrep"
      return 0
    fi
    if [[ -n "$user_base" && -x "$user_base/bin/semgrep" ]]; then
      printf '%s\n' "$user_base/bin/semgrep"
      return 0
    fi
  fi

  if command -v semgrep >/dev/null 2>&1; then
    command -v semgrep
    return 0
  fi

  return 1
}

SEMGREP_BIN="$(find_semgrep || true)"
if [[ -z "$SEMGREP_BIN" ]]; then
  echo "BLOCKED — semgrep CLI not found. Install with: python3 -m pip install --user semgrep" >&2
  exit 127
fi

export SEMGREP_LOG_FILE="${TMPDIR:-/tmp}/dcx-semgrep.log"
export XDG_CACHE_HOME="${TMPDIR:-/tmp}/dcx-semgrep-cache"
if [[ "${1:-}" == "--version" ]]; then
  set +e
  VERSION_OUTPUT="$("$SEMGREP_BIN" --metrics=off --disable-version-check --version 2>&1)"
  VERSION_CODE=$?
  set -e
  VERSION_LINE="$(printf '%s\n' "$VERSION_OUTPUT" | grep -E '^[0-9]+[.][0-9]+[.][0-9]+' | tail -1 || true)"
  if [[ -n "$VERSION_LINE" ]]; then
    printf '%s\n' "$VERSION_LINE"
    exit 0
  fi
  printf '%s\n' "$VERSION_OUTPUT"
  exit "$VERSION_CODE"
fi

cd "$REPO"
if [[ "$#" -eq 0 ]]; then
  set -- src
fi
exec "$SEMGREP_BIN" --metrics=off --disable-version-check -j 1 --max-memory 1024 --config semgrep/dcx-rules.yml "$@"
