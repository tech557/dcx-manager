#!/usr/bin/env bash
# verify-plan-state.sh — Check plan folder location, frontmatter, sprint status consistency
# Usage: verify-plan-state.sh [plan-name]
# Output: JSON { pass: bool, findings: string[], warnings: string[] }
set -uo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"
PLAN_NAME="${1:-}"

python3 - "$REPO" "$PLAN_NAME" << 'PYEOF'
import json, os, sys, re, glob

repo = sys.argv[1]
filter_name = sys.argv[2]  # optional: check only this plan name
plans_dir = os.path.join(repo, 'docs/plans')

findings = []
warnings = []

for folder_status in ('active', 'drafted', 'completed'):
    status_dir = os.path.join(plans_dir, folder_status)
    if not os.path.isdir(status_dir):
        continue
    for plan_dir in sorted(glob.glob(os.path.join(status_dir, '*/'))):
        plan_name = os.path.basename(plan_dir.rstrip('/'))
        if filter_name and plan_name != filter_name:
            continue

        readme = os.path.join(plan_dir, 'README.md')
        if os.path.exists(readme):
            with open(readme) as f:
                content = f.read()
            # Look for status field in any format
            m = re.search(r'(?i)\bstatus[:\s]+([a-z]+)', content)
            if m:
                stated = m.group(1).lower().strip()
                if stated != folder_status:
                    findings.append(
                        f'MISMATCH: Plan in {folder_status}/ but README says status={stated} — {plan_dir.replace(repo+"/","")}'
                    )

        # Active plans should have sprint files
        if folder_status == 'active':
            sprint_files = [f for f in os.listdir(plan_dir)
                           if f.endswith('.md') and f not in ('README.md',)
                           and not os.path.isdir(os.path.join(plan_dir, f))]
            if not sprint_files:
                warnings.append(f'WARN: Active plan has no sprint files: {plan_dir.replace(repo+"/","")}')

# Check for misplaced sprint files directly in active/ (not in a subdirectory)
active_root = os.path.join(plans_dir, 'active')
if os.path.isdir(active_root):
    misplaced = [f for f in os.listdir(active_root)
                 if f.endswith('.md') and f != 'README.md'
                 and os.path.isfile(os.path.join(active_root, f))]
    if misplaced:
        warnings.append(f'WARN: Sprint files directly in plans/active/ (should be in subdirs): {misplaced}')

print(json.dumps({
    'pass': len(findings) == 0,
    'findings': findings,
    'warnings': warnings
}, indent=2))
PYEOF
