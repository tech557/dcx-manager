#!/usr/bin/env bash
# run-tests.sh — plain-bash assertion harness for scripts/release/*.
# Fallback (core.md §28): `bats` is not installed in this environment; tests are written as
# plain bash assertions instead. Each test is self-contained and uses a scratch temp dir.
set -uo pipefail

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RELEASE_DIR="$(cd "$SCRIPT_DIR/.." && pwd)"
REPO_DIR="$(cd "$RELEASE_DIR/../.." && pwd)"

PASS=0
FAIL=0

assert_eq() {
  local desc="$1" expected="$2" actual="$3"
  if [ "$expected" = "$actual" ]; then
    echo "  PASS: $desc"
    PASS=$((PASS + 1))
  else
    echo "  FAIL: $desc — expected '$expected', got '$actual'"
    FAIL=$((FAIL + 1))
  fi
}

assert_exit_nonzero() {
  local desc="$1" code="$2"
  if [ "$code" -ne 0 ]; then
    echo "  PASS: $desc (exit $code)"
    PASS=$((PASS + 1))
  else
    echo "  FAIL: $desc — expected non-zero exit, got 0"
    FAIL=$((FAIL + 1))
  fi
}

assert_exit_zero() {
  local desc="$1" code="$2"
  if [ "$code" -eq 0 ]; then
    echo "  PASS: $desc (exit 0)"
    PASS=$((PASS + 1))
  else
    echo "  FAIL: $desc — expected exit 0, got $code"
    FAIL=$((FAIL + 1))
  fi
}

echo "=== classify-change.sh ==="
TMPDIR_GIT="$(mktemp -d)"
(
  cd "$TMPDIR_GIT"
  git init -q
  git config user.email test@test.local
  git config user.name test
  echo "a" > a.txt
  git add -A && git commit -qm base
  git branch base

  # source case: touch src/
  mkdir -p src
  echo "x" > src/file.ts
  git add -A && git commit -qm "src change"
  git branch -f head1
)
src_result="$(cd "$TMPDIR_GIT" && "$RELEASE_DIR/classify-change.sh" base head1)"
assert_eq "src/ diff classifies as source" "source" "$src_result"

(
  cd "$TMPDIR_GIT"
  git checkout -q base
  mkdir -p docs
  echo "y" > docs/note.md
  git add -A && git commit -qm "docs change"
  git branch -f head2
)
doc_result="$(cd "$TMPDIR_GIT" && "$RELEASE_DIR/classify-change.sh" base head2)"
assert_eq "docs/ diff classifies as non-source" "non-source" "$doc_result"
rm -rf "$TMPDIR_GIT"

echo ""
echo "=== append-release-row.sh / validate-release-registry.sh ==="
TMPDIR_CSV="$(mktemp -d)"
CSV="$TMPDIR_CSV/registry.csv"
echo "version,change_class,commit_sha,branch,session_folder,clickup_task,deployment_id,preview_url,staging_url,production_url,status,approved_for,approved_by,approved_at,gates,notes" > "$CSV"

# monkeypatch: point a temp copy of append-release-row at this CSV by symlinking the repo-relative path
TMP_REPO="$TMPDIR_CSV/repo"
mkdir -p "$TMP_REPO/docs/releases" "$TMP_REPO/scripts/release"
cp "$CSV" "$TMP_REPO/docs/releases/registry.csv"
cp "$RELEASE_DIR/append-release-row.sh" "$TMP_REPO/scripts/release/"
cp "$RELEASE_DIR/validate-release-registry.sh" "$TMP_REPO/scripts/release/"

"$TMP_REPO/scripts/release/append-release-row.sh" \
  "v0.3.5.0" "non-source" "abc123" "main" "2026-07-01-claude" "" "" "" "" "" \
  "verified" "staging" "PO" "2026-07-01" "typecheck=PASS" "happy path" > /tmp/append1.log
append1_code=$?
assert_exit_zero "happy-path append succeeds" "$append1_code"
row_count="$(tail -n +2 "$TMP_REPO/docs/releases/registry.csv" | grep -c . || true)"
assert_eq "exactly one data row after happy-path append" "1" "$row_count"

"$TMP_REPO/scripts/release/append-release-row.sh" \
  "v0.3.5.0" "non-source" "def456" "main" "2026-07-01-claude" "" "" "" "" "" \
  "verified" "staging" "PO" "2026-07-01" "typecheck=PASS" "duplicate attempt" > /tmp/append2.log 2>&1
append2_code=$?
assert_exit_nonzero "duplicate-version append is refused" "$append2_code"
row_count_after="$(tail -n +2 "$TMP_REPO/docs/releases/registry.csv" | grep -c . || true)"
assert_eq "row count unchanged after refused duplicate" "1" "$row_count_after"

"$TMP_REPO/scripts/release/validate-release-registry.sh" "$TMP_REPO/docs/releases/registry.csv" > /tmp/validate-clean.log
validate_clean_code=$?
assert_exit_zero "validator passes a clean registry" "$validate_clean_code"

# seed a duplicate version directly (bypassing the writer) to test the validator catches it
printf '"v0.9.9","source","zzz","main","s","","","","","","verified","prod","PO","2026-07-01","","seed1"\n"v0.9.9","source","yyy","main","s","","","","","","verified","prod","PO","2026-07-01","","seed2-duplicate"\n' >> "$TMP_REPO/docs/releases/registry.csv"
"$TMP_REPO/scripts/release/validate-release-registry.sh" "$TMP_REPO/docs/releases/registry.csv" > /tmp/validate-dup.log 2>&1
validate_dup_code=$?
assert_exit_nonzero "validator rejects a seeded duplicate version" "$validate_dup_code"

# Regression test (RG-R3, 2026-07-01 live CI bug): two "verified" rows with NO approved_for yet are
# two unapproved candidate builds, not a conflict — only rows that actually target an env (approved_for
# set) can conflict with each other. The bug stamped two real version-assign commits and broke CI.
CANDIDATES_CSV="$TMPDIR_CSV/candidates.csv"
echo "version,change_class,commit_sha,branch,session_folder,clickup_task,deployment_id,preview_url,staging_url,production_url,status,approved_for,approved_by,approved_at,gates,notes" > "$CANDIDATES_CSV"
printf '"v0.3.5.1","non-source","aaa111","integration","ci","","","","","","verified","","","","","stamped by version-assign.yml"\n"v0.3.5.2","non-source","bbb222","integration","ci","","","","","","verified","","","","","stamped by version-assign.yml"\n' >> "$CANDIDATES_CSV"
"$TMP_REPO/scripts/release/validate-release-registry.sh" "$CANDIDATES_CSV" > /tmp/validate-candidates.log 2>&1
validate_candidates_code=$?
assert_exit_zero "validator does NOT flag two unapproved 'verified' candidates as conflicting" "$validate_candidates_code"

rm -rf "$TMPDIR_CSV"

echo ""
echo "=== idempotence (core.md §36b) ==="
TMPDIR_IDEMP="$(mktemp -d)"
mkdir -p "$TMPDIR_IDEMP/docs/releases" "$TMPDIR_IDEMP/scripts/release"
echo "version,change_class,commit_sha,branch,session_folder,clickup_task,deployment_id,preview_url,staging_url,production_url,status,approved_for,approved_by,approved_at,gates,notes" > "$TMPDIR_IDEMP/docs/releases/registry.csv"
cp "$RELEASE_DIR/build-release-views.sh" "$TMPDIR_IDEMP/scripts/release/"
"$TMPDIR_IDEMP/scripts/release/build-release-views.sh" > /dev/null
first_view="$(cat "$TMPDIR_IDEMP/docs/releases/registry-view.md")"
"$TMPDIR_IDEMP/scripts/release/build-release-views.sh" > /dev/null
second_view="$(cat "$TMPDIR_IDEMP/docs/releases/registry-view.md")"
assert_eq "build-release-views.sh is idempotent on an unchanged registry" "$first_view" "$second_view"
rm -rf "$TMPDIR_IDEMP"

echo ""
echo "=== no absolute/home paths (AC-RG-2-5) ==="
# Pattern is split (/User[s]/) so this check's own source line never contains the literal
# substring it scans for — otherwise this file itself would self-trigger the check.
abs_path_hits="$(grep -rn '/User[s]/\|/home/' "$RELEASE_DIR"/*.sh 2>/dev/null || true)"
if [ -z "$abs_path_hits" ]; then
  echo "  PASS: no absolute/home paths in scripts/release/*.sh"
  PASS=$((PASS + 1))
else
  echo "  FAIL: absolute/home paths found:"
  echo "$abs_path_hits"
  FAIL=$((FAIL + 1))
fi

echo ""
echo "=== Summary ==="
echo "PASS: $PASS"
echo "FAIL: $FAIL"
if [ "$FAIL" -gt 0 ]; then
  exit 1
fi
exit 0
