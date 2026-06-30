#!/usr/bin/env bash
# verify-log-claims.sh — Verify claimed created/edited/deleted files match reality
# Usage: verify-log-claims.sh <path-to-log-file>
# Output: JSON { pass: bool, checked: int, findings: string[] }
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"

LOG_FILE="${1:-}"
if [[ -z "$LOG_FILE" ]]; then
  echo '{"pass":false,"checked":0,"findings":["No log file provided. Usage: verify-log-claims.sh <path-to-log-file>"]}'
  exit 0
fi

# Resolve path
[[ "$LOG_FILE" != /* ]] && LOG_FILE="$REPO/$LOG_FILE"
if [[ ! -f "$LOG_FILE" ]]; then
  echo "{\"pass\":false,\"checked\":0,\"findings\":[\"Log file not found: $LOG_FILE\"]}"
  exit 0
fi

python3 << PYEOF
import re, json, os, subprocess

log_path = "$LOG_FILE"
repo = "$REPO"
findings = []
checked = 0

with open(log_path) as f:
    content = f.read()

# Extract "Files created:" block
# Pattern: line starting with "Files created:" followed by indented file paths
created_block = re.search(r'Files created:\s*\n((?:[ \t]+\S.*\n?)*)', content, re.MULTILINE)
edited_block  = re.search(r'Files edited:\s*\n((?:[ \t]+\S.*\n?)*)', content, re.MULTILINE)
deleted_block = re.search(r'Files deleted:\s*\n((?:[ \t]+\S.*\n?)*)', content, re.MULTILINE)

def extract_paths(block_text):
    """Extract file paths from log block lines like:  path/to/file — description"""
    paths = []
    if not block_text:
        return paths
    for line in block_text.strip().split('\n'):
        line = line.strip()
        if not line or line.lower() in ('none', 'n/a', '-'):
            continue
        # Match a file path token: allow word chars, slashes, dots, hyphens, underscores
        # Stop at em-dash (—), en-dash (–), two+ spaces, or tab
        m = re.match(r'^([\w./\-]+)', line)
        if m:
            p = m.group(1).strip().rstrip(',;')
            # Must look like a file path (has slash or dot)
            if ('/' in p or '.' in p) and not p.startswith('-'):
                paths.append(p)
    return paths

created = extract_paths(created_block.group(1) if created_block else '')
edited  = extract_paths(edited_block.group(1)  if edited_block  else '')
deleted = extract_paths(deleted_block.group(1) if deleted_block else '')

# Check created files EXIST
for path in created:
    checked += 1
    full = os.path.join(repo, path)
    if not os.path.exists(full):
        findings.append(f"MISSING: Log claims created '{path}' but file does not exist")

# Check edited files EXIST
for path in edited:
    checked += 1
    full = os.path.join(repo, path)
    if not os.path.exists(full):
        findings.append(f"MISSING: Log claims edited '{path}' but file does not exist")

# Check deleted files are ABSENT
for path in deleted:
    checked += 1
    full = os.path.join(repo, path)
    if os.path.exists(full):
        findings.append(f"STILL_EXISTS: Log claims deleted '{path}' but file still exists")

# Check for claimed package scripts
script_claims = re.findall(r'npm run ([\w:-]+)', content)
if script_claims:
    try:
        pkg = json.load(open(os.path.join(repo, 'package.json')))
        scripts = pkg.get('scripts', {})
        for s in set(script_claims):
            # Skip common scripts not project-specific
            if s in ('install', 'ci', 'start'):
                continue
            checked += 1
            if s not in scripts:
                findings.append(f"MISSING_SCRIPT: Log references 'npm run {s}' but script not in package.json")
    except Exception as e:
        findings.append(f"WARN: Could not parse package.json: {e}")

print(json.dumps({
    'pass': len(findings) == 0,
    'checked': checked,
    'log_file': log_path.replace(repo + '/', ''),
    'created_claimed': len(created),
    'edited_claimed': len(edited),
    'deleted_claimed': len(deleted),
    'findings': findings
}, indent=2))
PYEOF
