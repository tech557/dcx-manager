#!/usr/bin/env bash
# verify-tooling-state.sh — Check which tools/scripts/MCPs are operational
# Output: JSON with tool statuses and code-index staleness
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"

python3 << PYEOF
import json, subprocess, os, time, shutil

repo = "$REPO"
results = {}

def run(cmd, cwd=repo):
    try:
        r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=30)
        return r.returncode, r.stdout.strip(), r.stderr.strip()
    except Exception as e:
        return -1, '', str(e)

def has_cmd(name):
    return shutil.which(name) is not None

def script_exists(rel):
    return os.path.isfile(os.path.join(repo, rel))

def pkg_script_exists(name):
    try:
        pkg = json.load(open(os.path.join(repo, 'package.json')))
        return name in pkg.get('scripts', {})
    except:
        return False

# npm scripts
for script in ['typecheck', 'lint', 'test', 'build', 'validate:architecture',
               'test:e2e', 'verify:frontend', 'generate:code-index', 'inspect:react']:
    results[f'npm_script_{script.replace(":","_")}'] = {
        'status': 'available' if pkg_script_exists(script) else 'missing',
    }

# verify.sh
code, out, err = run(['bash', 'scripts/verify.sh'])
results['verify_sh'] = {'status': 'pass' if code == 0 else 'fail', 'output': out or err}

# dependency-cruiser
results['dependency_cruiser'] = {'status': 'available' if has_cmd('depcruise') or
    os.path.isdir(os.path.join(repo, 'node_modules/.bin')) else 'check_node_modules'}

# semgrep
semgrep_wrapper = os.path.join(repo, 'scripts/agent/run-semgrep.sh')
if os.path.isfile(semgrep_wrapper):
    code, out, err = run(['bash', semgrep_wrapper, '--version'])
    results['semgrep_cli'] = {
        'status': 'available' if code == 0 else 'blocked',
        'version': out if code == 0 else None,
        'output': out or err,
        'setup': 'python3 -m pip install --user semgrep' if code != 0 else None
    }
else:
    results['semgrep_cli'] = {'status': 'available' if has_cmd('semgrep') else 'not_installed',
                               'setup': 'python3 -m pip install --user semgrep' if not has_cmd('semgrep') else None}

# playwright
results['playwright_test'] = {'status': 'available' if
    os.path.isfile(os.path.join(repo, 'playwright.config.ts')) and
    os.path.isdir(os.path.join(repo, 'node_modules/@playwright/test')) else 'config_missing'}
playwright_mcp_cli = os.path.join(repo, 'node_modules/@playwright/mcp/cli.js')
if os.path.isfile(playwright_mcp_cli):
    code, out, err = run(['node', playwright_mcp_cli, '--version'])
    results['playwright_mcp'] = {
        'status': 'available' if code == 0 else 'blocked',
        'version': out.replace('Version ', '') if code == 0 else None,
        'output': out or err,
        'setup': 'npm install --save-dev @playwright/mcp' if code != 0 else None
    }
else:
    results['playwright_mcp'] = {
        'status': 'not_installed',
        'setup': 'npm install --save-dev @playwright/mcp'
    }

# e2e tests
results['e2e_tests_exist'] = {'status': 'yes' if
    os.path.isdir(os.path.join(repo, 'e2e')) and
    len(os.listdir(os.path.join(repo, 'e2e'))) > 0 else 'no_tests_written'}

# storybook
results['storybook'] = {'status': 'installed' if
    os.path.isdir(os.path.join(repo, '.storybook')) else 'not_installed',
    'setup': 'npx storybook@latest init' if not os.path.isdir(os.path.join(repo, '.storybook')) else None}

# code-index freshness
components_path = os.path.join(repo, 'code-index/components.json')
code_index_stale = True
code_index_age_minutes = None
if os.path.exists(components_path):
    age_seconds = time.time() - os.path.getmtime(components_path)
    code_index_age_minutes = round(age_seconds / 60)
    code_index_stale = age_seconds > 3600  # stale after 1 hour
results['code_index'] = {
    'status': 'stale' if code_index_stale else 'fresh',
    'age_minutes': code_index_age_minutes,
    'regenerate': 'npm run generate:code-index' if code_index_stale else None
}
results['code_index_stale'] = code_index_stale
results['code_index_age_minutes'] = code_index_age_minutes

# MCP config
mcp_path = os.path.join(repo, '.mcp.json')
if os.path.exists(mcp_path):
    try:
        mcp = json.load(open(mcp_path))
        servers = mcp.get('mcpServers', {})
        active = [k for k,v in servers.items() if not v.get('disabled')]
        disabled = [k for k,v in servers.items() if v.get('disabled')]
        results['mcp_configured'] = list(servers.keys())
        results['mcp_active'] = active
        results['mcp_awaiting_setup'] = disabled
    except:
        results['mcp_config'] = 'parse_error'
else:
    results['mcp_config'] = 'no_.mcp.json'

print(json.dumps(results, indent=2))
PYEOF
