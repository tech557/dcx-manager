#!/usr/bin/env bash
# verify-version-state.sh — Check VERSION.md, package.json, metadata.json consistency
# Output: JSON { pass: bool, versions: {...}, findings: string[] }
set -uo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"

python3 - "$REPO" << 'PYEOF'
import json, os, re, sys

repo = sys.argv[1]
findings = []
pass_result = True

def slurp(path):
    try:
        with open(os.path.join(repo, path)) as f: return f.read()
    except: return ''

def jload(path):
    try:
        with open(os.path.join(repo, path)) as f: return json.load(f)
    except: return {}

# VERSION.md
version_md_content = slurp('docs/VERSION.md')
m = re.search(r'v([0-9]+\.[0-9]+\.[0-9]+)', version_md_content)
version_md = m.group(0) if m else None
if not version_md:
    findings.append('WARN: Could not parse version from docs/VERSION.md')

# package.json
pkg = jload('package.json')
pkg_version = pkg.get('version')
if not pkg_version:
    findings.append('FAIL: Could not parse version from package.json')
    pass_result = False

# metadata.json
meta = jload('metadata.json')
meta_name = meta.get('name', '')
m2 = re.search(r'v([0-9]+\.[0-9]+\.[0-9]+)', meta_name)
meta_version = m2.group(0) if m2 else None

# Cross-check VERSION.md vs metadata.json
if version_md and meta_version and version_md != meta_version:
    findings.append(f'WARN: docs/VERSION.md={version_md} vs metadata.json={meta_version} — check if intentional')

print(json.dumps({
    'pass': pass_result,
    'versions': {
        'VERSION_md': version_md or 'unknown',
        'package_json': pkg_version or 'unknown',
        'metadata_json': meta_version or 'unknown'
    },
    'findings': findings
}, indent=2))
PYEOF
