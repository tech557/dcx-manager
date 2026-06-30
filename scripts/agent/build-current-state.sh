#!/usr/bin/env bash
# build-current-state.sh — Generate docs/generated/CURRENT_STATE.json
# Non-authoritative snapshot of repository state for agent orientation.
# Run: bash scripts/agent/build-current-state.sh
# Output: docs/generated/CURRENT_STATE.json (also printed to stdout)
set -uo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
OUT="$REPO/docs/generated/CURRENT_STATE.json"
mkdir -p "$(dirname "$OUT")"

python3 << PYEOF
import json, os, subprocess, time, glob, re
from datetime import datetime, timezone

repo = "$REPO"
now = datetime.now(timezone.utc).isoformat()

def slurp(path, default=''):
    try:
        with open(os.path.join(repo, path)) as f: return f.read()
    except: return default

def jload(path, default=None):
    try:
        with open(os.path.join(repo, path)) as f: return json.load(f)
    except: return default

def run_quiet(cmd):
    try:
        r = subprocess.run(cmd, cwd=repo, capture_output=True, text=True, timeout=30)
        return r.returncode, r.stdout.strip()
    except: return -1, ''

# --- Version ---
version_md_content = slurp('docs/VERSION.md')
repo_version = re.search(r'v([0-9]+\.[0-9]+\.[0-9]+)', version_md_content)
repo_version = repo_version.group(0) if repo_version else 'unknown'

pkg = jload('package.json', {})
pkg_version = pkg.get('version', 'unknown')

meta = jload('metadata.json', {})
meta_version_str = meta.get('name', '')
meta_version = re.search(r'v([0-9]+\.[0-9]+\.[0-9]+)', meta_version_str)
meta_version = meta_version.group(0) if meta_version else 'unknown'

# --- Plans ---
active_plans = []
for d in glob.glob(os.path.join(repo, 'docs/plans/active/*/'), ):
    name = os.path.basename(d.rstrip('/'))
    sprints = [f for f in os.listdir(d) if f.endswith('.md') and f != 'README.md']
    active_plans.append({'name': name, 'sprint_files': sprints})

# --- Latest log ---
latest_log = None
index_path = os.path.join(repo, 'docs/progress/index.csv')
if os.path.exists(index_path):
    with open(index_path) as f:
        lines = [l.strip() for l in f.readlines() if l.strip()]
    if len(lines) > 1:
        latest = lines[-1].split(',')
        if len(latest) >= 4:
            latest_log = {'date': latest[0], 'agent': latest[1], 'folder': latest[3], 'status': latest[5] if len(latest) > 5 else ''}

# --- Available scripts ---
scripts_list = list(pkg.get('scripts', {}).keys())

# --- Code index freshness ---
ci_path = os.path.join(repo, 'code-index/components.json')
ci_stale, ci_age = False, None
if os.path.exists(ci_path):
    age = time.time() - os.path.getmtime(ci_path)
    ci_age = round(age / 60)
    ci_stale = age > 3600

# --- MCP ---
mcp = jload('.mcp.json', {})
servers = mcp.get('mcpServers', {})
mcp_active = [k for k,v in servers.items() if not v.get('disabled')]
mcp_awaiting = [k for k,v in servers.items() if v.get('disabled')]

# --- Git state ---
code, git_branch = run_quiet(['git', 'branch', '--show-current'])
code, git_status = run_quiet(['git', 'status', '--short'])
uncommitted = len(git_status.strip().split('\n')) if git_status.strip() else 0

# --- Documentation contradictions ---
contradictions = []
if repo_version != meta_version and meta_version != 'unknown':
    contradictions.append(f'docs/VERSION.md={repo_version} vs metadata.json={meta_version}')

# --- Unresolved open questions ---
oq_path = os.path.join(repo, 'docs/product/open-questions/builder-open-decisions.md')
open_questions_count = 0
if os.path.exists(oq_path):
    with open(oq_path) as f:
        open_questions_count = f.read().count('❓')

state = {
    '_generated_at': now,
    '_note': 'Non-authoritative snapshot. Do not edit manually. Regenerate: bash scripts/agent/build-current-state.sh',
    'repository_version': repo_version,
    'package_version': pkg_version,
    'metadata_version': meta_version,
    'active_plans': active_plans,
    'latest_log': latest_log,
    'open_questions_count': open_questions_count,
    'available_scripts': scripts_list,
    'mcp_configured': list(servers.keys()),
    'mcp_operational': mcp_active,
    'mcp_awaiting_external_setup': mcp_awaiting,
    'code_index_stale': ci_stale,
    'code_index_age_minutes': ci_age,
    'git_branch': git_branch or 'unknown',
    'uncommitted_changes': uncommitted,
    'documentation_contradictions': contradictions,
    'validation_scripts': [
        'scripts/agent/verify-plan-state.sh',
        'scripts/agent/verify-version-state.sh',
        'scripts/agent/verify-log-claims.sh <log>',
        'scripts/agent/verify-tooling-state.sh',
        'scripts/agent/verify-frontend.sh',
        'scripts/agent/code-query.sh help'
    ]
}

out_path = "$OUT"
with open(out_path, 'w') as f:
    json.dump(state, f, indent=2)

print(json.dumps(state, indent=2))
print(f'\n# Written to: {out_path}', file=__import__('sys').stderr)
PYEOF
