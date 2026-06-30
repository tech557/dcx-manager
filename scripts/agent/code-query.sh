#!/usr/bin/env bash
# DCX Code Query — focused queries against code-index/ without loading full indexes
# Usage: code-query.sh [--json] <command> [arg]
# Commands: component, consumers, imports, labels, raw-controls,
#           duplicate-controls, hardcoded-tokens, affected, unresolved
set -euo pipefail
REPO="$(cd "$(dirname "$0")/../.." && pwd)"

JSON_MODE=false
[[ "${1:-}" == "--json" ]] && { JSON_MODE=true; shift; }

CMD="${1:-help}"
ARG="${2:-}"

if [[ "$CMD" == "help" ]]; then
  echo "Usage: code-query.sh [--json] <command> [arg]"
  echo "Commands:"
  echo "  component <Name>     — definition, props, children"
  echo "  consumers <Name>     — all usages of a component"
  echo "  imports <file>       — what a file imports"
  echo "  labels <text>        — find UI text label occurrences"
  echo "  raw-controls         — list form controls and input primitives"
  echo "  duplicate-controls   — controls with potentially duplicated purpose"
  echo "  hardcoded-tokens     — hex/spacing/font values outside brand/"
  echo "  affected <file>      — reverse dep: who imports this file"
  echo "  unresolved           — unresolved imports"
  exit 0
fi

# Delegate all index-based commands to Python to avoid quoting issues
exec python3 - "$REPO" "$CMD" "$ARG" "$JSON_MODE" << 'PYEOF'
import json, sys, os, re, subprocess

repo, cmd, arg, json_mode_str = sys.argv[1], sys.argv[2], sys.argv[3], sys.argv[4]
json_mode = json_mode_str == 'true'
index = os.path.join(repo, 'code-index')

def load_index(name):
    p = os.path.join(index, name)
    if not os.path.exists(p):
        print(f'ERROR: {p} not found. Run: npm run generate:code-index', file=sys.stderr)
        sys.exit(1)
    with open(p) as f:
        return json.load(f)

def wc(path):
    try:
        r = subprocess.run(['wc', '-l', path], capture_output=True, text=True)
        return r.stdout.strip().split()[0]
    except:
        return '?'

if cmd == 'component':
    if not arg:
        print('Usage: code-query.sh component <Name>', file=sys.stderr); sys.exit(1)
    data = load_index('components.json')
    name = arg
    if name not in data:
        matches = [k for k in data if k.lower() == name.lower()]
        name = matches[0] if matches else None
    if not name:
        print(f'ERROR: Component "{arg}" not found in code-index. Run: npm run generate:code-index')
        sys.exit(0)
    d = {'name': name, **data[name]}
    if json_mode:
        print(json.dumps(d, indent=2))
    else:
        loc = d.get('definedIn', '?')
        props = d.get('props', [])
        children = [c for c in d.get('childComponentsUsed', []) if c[0].isupper()]
        full = os.path.join(repo, loc)
        lines = f' ({wc(full)} lines)' if os.path.exists(full) else ''
        print(name)
        print(f'  defined in: {loc}{lines}')
        if props:
            pnames = [p['name'] + ('' if p.get('required') else '?') for p in props]
            print(f'  props: {", ".join(pnames)}')
        if children:
            print(f'  child components: {", ".join(children)}')

elif cmd == 'consumers':
    if not arg:
        print('Usage: code-query.sh consumers <Name>', file=sys.stderr); sys.exit(1)
    data = load_index('component-usages.json')
    hits = [e for e in data if e.get('component', '') == arg]
    if not hits:
        hits = [e for e in data if arg.lower() in e.get('component', '').lower()]
    if json_mode:
        print(json.dumps(hits, indent=2))
    else:
        if not hits:
            print(f'No usages of "{arg}" found in code-index.')
        else:
            by_file = {}
            for h in hits:
                f = h.get('usedIn', '?')
                by_file.setdefault(f, []).append(h)
            print(f'{arg} — {len(hits)} usage(s) in {len(by_file)} file(s)')
            for f, usages in sorted(by_file.items()):
                lines = sorted(set(str(u.get('line', '?')) for u in usages))
                print(f'  {f} (lines: {", ".join(lines)})')

elif cmd == 'imports':
    if not arg:
        print('Usage: code-query.sh imports <file>', file=sys.stderr); sys.exit(1)
    full = os.path.join(repo, arg)
    if not os.path.exists(full):
        print(f'File not found: {arg}', file=sys.stderr); sys.exit(1)
    with open(full) as f:
        import_lines = [l.rstrip() for l in f if l.startswith('import ')]
    if json_mode:
        print(json.dumps(import_lines))
    else:
        print(f'Imports in {arg}:')
        for l in import_lines:
            print(f'  {l}')

elif cmd == 'labels':
    if not arg:
        print('Usage: code-query.sh labels "<text>"', file=sys.stderr); sys.exit(1)
    data = load_index('text-labels.json')
    query = arg.lower()
    hits = [e for e in data if query in e.get('text', '').lower()]
    if json_mode:
        print(json.dumps(hits, indent=2))
    else:
        if not hits:
            print(f'No labels matching "{arg}" found.')
        else:
            print(f'{len(hits)} occurrence(s) of "{arg}":')
            for h in hits:
                print(f'  {h["file"]}:{h["line"]}  "{h["text"]}"')

elif cmd == 'raw-controls':
    data = load_index('components.json')
    kw = ['input', 'button', 'select', 'textarea', 'checkbox', 'radio', 'toggle', 'switch', 'slider']
    hits = [(name, d) for name, d in data.items() if any(k in name.lower() for k in kw)]
    if json_mode:
        print(json.dumps({n: d for n, d in hits}, indent=2))
    else:
        print(f'{len(hits)} control component(s):')
        for name, d in sorted(hits):
            print(f'  {name}  →  {d.get("definedIn", "?")}')

elif cmd == 'duplicate-controls':
    data = load_index('components.json')
    from collections import defaultdict
    kw = ['input', 'button', 'select', 'textarea', 'checkbox', 'radio', 'toggle', 'switch', 'slider']
    groups = defaultdict(list)
    for name, d in data.items():
        norm = re.sub(r'(dcx|builder|shared|base|custom|new|old|v[0-9]+)', '', name.lower())
        for k in kw:
            if k in norm:
                groups[k].append((name, d.get('definedIn', '?')))
                break
    dupes = {k: v for k, v in groups.items() if len(v) > 1}
    if json_mode:
        print(json.dumps(dupes, indent=2))
    else:
        if not dupes:
            print('No potentially duplicated controls found.')
        else:
            print('Potentially duplicated controls:')
            for kind, items in sorted(dupes.items()):
                print(f'  [{kind}]')
                for name, path in items:
                    print(f'    {name}  →  {path}')

elif cmd == 'hardcoded-tokens':
    print('Scanning src/ for hardcoded hex colors, arbitrary Tailwind values...')
    src_dir = os.path.join(repo, 'src')
    hex_hits, arb_hits = [], []
    for root, dirs, files in os.walk(src_dir):
        dirs[:] = [d for d in dirs if d not in ('node_modules', '__tests__')]
        if 'brand' in root:
            continue
        for fname in files:
            if not fname.endswith(('.ts', '.tsx')):
                continue
            fpath = os.path.join(root, fname)
            rel = fpath.replace(repo + '/', '')
            try:
                with open(fpath) as f:
                    for i, line in enumerate(f, 1):
                        if re.search(r'["\']#[0-9a-fA-F]{3,6}["\']', line):
                            hex_hits.append(f'{rel}:{i}: {line.strip()[:80]}')
                        if re.search(r'\[(#[0-9a-fA-F]|[0-9]+px|[0-9]+rem)', line):
                            arb_hits.append(f'{rel}:{i}: {line.strip()[:80]}')
            except:
                pass
    if json_mode:
        print(json.dumps({'hardcoded_hex': hex_hits, 'arbitrary_tailwind': arb_hits}))
    else:
        if not hex_hits and not arb_hits:
            print('No hardcoded tokens found outside src/brand/.')
        if hex_hits:
            print(f'Hardcoded hex ({len(hex_hits)}):')
            for h in hex_hits[:15]:
                print(f'  {h}')
            if len(hex_hits) > 15:
                print(f'  ... and {len(hex_hits)-15} more')
        if arb_hits:
            print(f'Arbitrary Tailwind values ({len(arb_hits)}):')
            for h in arb_hits[:15]:
                print(f'  {h}')
            if len(arb_hits) > 15:
                print(f'  ... and {len(arb_hits)-15} more')

elif cmd == 'affected':
    if not arg:
        print('Usage: code-query.sh affected <src/path/file.tsx>', file=sys.stderr); sys.exit(1)
    basename = os.path.splitext(os.path.basename(arg))[0]
    src_dir = os.path.join(repo, 'src')
    matches = []
    for root, dirs, files in os.walk(src_dir):
        dirs[:] = [d for d in dirs if d != 'node_modules']
        for fname in files:
            if not fname.endswith(('.ts', '.tsx')):
                continue
            fpath = os.path.join(root, fname)
            rel = fpath.replace(repo + '/', '')
            if rel == arg:
                continue
            try:
                with open(fpath) as f:
                    content = f.read()
                if re.search(rf'''from ['"].*{re.escape(basename)}['"]''', content):
                    matches.append(rel)
            except:
                pass
    if json_mode:
        print(json.dumps(matches))
    else:
        if not matches:
            print(f'No files import from {arg}')
        else:
            print(f'{len(matches)} file(s) import from {arg}:')
            for m in sorted(matches):
                print(f'  {m}')

elif cmd == 'unresolved':
    data = load_index('unresolved.json')
    if json_mode:
        print(json.dumps(data, indent=2))
    else:
        items = data if isinstance(data, list) else [data]
        if not items:
            print('No unresolved imports.')
        else:
            print(f'{len(items)} unresolved import(s):')
            for item in items[:20]:
                print(f'  {item}')
            if len(items) > 20:
                print(f'  ... and {len(items)-20} more (use --json for full list)')

else:
    print(f'Unknown command: {cmd}. Run: code-query.sh help', file=sys.stderr)
    sys.exit(1)
PYEOF
