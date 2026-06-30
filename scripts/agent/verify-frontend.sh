#!/usr/bin/env bash
# verify-frontend.sh — Run all frontend gates and report results as JSON
# Usage: verify-frontend.sh [--quick]   (--quick skips build)
# Output: JSON { pass: bool, gates: { name: { status, output } } }
set -uo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
QUICK="${1:-}"

python3 << PYEOF
import json, subprocess, os, sys

repo = "$REPO"
quick = "$QUICK" == "--quick"
gates = {}

def run_gate(name, cmd, cwd=repo, timeout=120):
    try:
        r = subprocess.run(cmd, cwd=cwd, capture_output=True, text=True, timeout=timeout, shell=isinstance(cmd, str))
        status = 'pass' if r.returncode == 0 else 'fail'
        out = (r.stdout + r.stderr).strip()
        # Truncate long output
        if len(out) > 800:
            lines = out.split('\n')
            out = '\n'.join(lines[:20]) + f'\n... ({len(lines)-20} more lines)'
        return {'status': status, 'exit_code': r.returncode, 'output': out}
    except subprocess.TimeoutExpired:
        return {'status': 'timeout', 'exit_code': -1, 'output': f'Gate timed out after {timeout}s'}
    except Exception as e:
        return {'status': 'error', 'exit_code': -1, 'output': str(e)}

# 1. typecheck
gates['typecheck'] = run_gate('typecheck', ['npm', 'run', 'typecheck'])

# 2. lint
gates['lint'] = run_gate('lint', ['npm', 'run', 'lint'])

# 3. verify.sh
gates['verify_sh'] = run_gate('verify_sh', ['bash', 'scripts/verify.sh'])

# 4. validate:architecture
gates['validate_architecture'] = run_gate('validate_architecture', ['npm', 'run', 'validate:architecture'])

# 5. tests
gates['test'] = run_gate('test', ['npm', 'run', 'test'], timeout=60)

# 6. build (skip with --quick)
if not quick:
    gates['build'] = run_gate('build', ['npm', 'run', 'build'], timeout=180)
else:
    gates['build'] = {'status': 'skipped', 'exit_code': 0, 'output': 'Skipped with --quick'}

# Aggregate
all_pass = all(g['status'] in ('pass', 'skipped') for g in gates.values())
failed = [k for k, g in gates.items() if g['status'] == 'fail']

summary = {
    'pass': all_pass,
    'failed_gates': failed,
    'gates': gates
}

print(json.dumps(summary, indent=2))
PYEOF
