import { Project } from 'ts-morph';
import * as path from 'path';
import * as fs from 'fs';
import { execSync } from 'child_process';

const TOP_DIRS = [
  'actions', 'brand', 'builder', 'components', 'hooks',
  'mock', 'pages', 'queries', 'rules', 'services',
  'store', 'telemetry', 'types', 'ui', 'utils',
];

const L_LEVELS: Record<string, number> = {
  'ui/surfaces': 1,
  'ui/motion': 1,
  'ui': 2,
  'components/forms': 3,
  'components': 3,
  'builder/cards': 4,
  'builder/cards/templates': 5,
  'builder/islands': 7,
  'builder/stage': 8,
  'pages': 9,
};

function getTopDir(filePath: string): string {
  const parts = filePath.replace(/\\/g, '/').split('/');
  for (const p of parts) {
    if (TOP_DIRS.includes(p)) return p;
  }
  return 'other';
}

function getSubDir(filePath: string): string {
  const normalized = filePath.replace(/\\/g, '/');
  for (const key of Object.keys(L_LEVELS)) {
    if (normalized.includes(`/src/${key}/`)) return key;
  }
  const parts = normalized.split('/');
  for (const p of parts) {
    if (TOP_DIRS.includes(p)) return p;
  }
  return 'other';
}

function resolveTargetDir(importPath: string, sourceFile: string): string {
  let resolved: string;
  if (importPath.startsWith('@/')) {
    resolved = path.join(process.cwd(), 'src', importPath.slice(2));
  } else if (importPath.startsWith('.')) {
    resolved = path.resolve(path.dirname(sourceFile), importPath);
  } else {
    return 'external';
  }
  resolved = path.normalize(resolved);
  return getSubDir(resolved);
}

function getLayerLabel(dir: string): string {
  const l = L_LEVELS[dir];
  if (l) return `L${l}`;
  return 'foundational';
}

// Only these folder paths participate in the L1-L9 hierarchy
const L_HIERARCHY = new Set(Object.keys(L_LEVELS));

function isInHierarchy(dir: string): boolean {
  return L_HIERARCHY.has(dir);
}

function getLineCounts(): Map<string, number> {
  try {
    const out = execSync('git ls-files src/ -- \'*.ts\' \'*.tsx\'', { encoding: 'utf-8' });
    const files = out.trim().split('\n').filter(Boolean);
    const map = new Map<string, number>();
    for (const f of files) {
      try {
        const wc = execSync(`wc -l < "${f}"`, { encoding: 'utf-8' });
        map.set(f, parseInt(wc.trim(), 10));
      } catch { /* skip */ }
    }
    return map;
  } catch {
    // Fallback: walk src/ manually
    const map = new Map<string, number>();
    const walk = (dir: string) => {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const full = path.join(dir, entry.name);
        if (entry.isDirectory()) walk(full);
        else if (/\.(ts|tsx)$/.test(entry.name)) {
          try {
            const wc = execSync(`wc -l < "${full}"`, { encoding: 'utf-8' });
            map.set(path.relative(process.cwd(), full), parseInt(wc.trim(), 10));
          } catch { /* skip */ }
        }
      }
    };
    walk('src');
    return map;
  }
}

async function run() {
  console.log('=== Dependency Graph Generator (SA-R1) ===\n');
  const project = new Project({ tsConfigFilePath: 'tsconfig.json' });
  const sourceFiles = project.getSourceFiles()
    .filter(sf => !sf.getFilePath().includes('node_modules'));

  const matrix: Record<string, Record<string, number>> = {};
  const upwardViolations: { file: string; from: string; to: string; importPath: string; line: number }[] = [];
  const folderImports: Record<string, string[]> = {};

  for (const dir of TOP_DIRS) {
    matrix[dir] = {};
    folderImports[dir] = [];
  }

  for (const sf of sourceFiles) {
    const filePath = sf.getFilePath();
    const relPath = path.relative(process.cwd(), filePath);
    const fromDir = getTopDir(relPath);
    if (fromDir === 'other') continue;

    for (const id of sf.getImportDeclarations()) {
      const spec = id.getModuleSpecifierValue();
      const line = id.getStartLineNumber();
      if (!spec.startsWith('.') && !spec.startsWith('@/')) continue;

      const toDir = resolveTargetDir(spec, filePath);
      if (!toDir || toDir === fromDir) continue;

      if (!matrix[fromDir][toDir]) matrix[fromDir][toDir] = 0;
      matrix[fromDir][toDir]++;

      if (!folderImports[fromDir].includes(toDir)) {
        folderImports[fromDir].push(toDir);
      }

      const fromLevel = L_LEVELS[fromDir] ?? 99;
      const toLevel = L_LEVELS[toDir] ?? 99;
      // Only flag when BOTH source and target are in the explicit L1-L9 hierarchy
      if (isInHierarchy(fromDir) && isInHierarchy(toDir) && fromLevel < toLevel) {
        upwardViolations.push({
          file: relPath,
          from: fromDir,
          to: toDir,
          importPath: spec,
          line,
        });
      }
    }
  }

  // ── Section 1: Folder Import Matrix ────────────────────────────────
  let md = '# SA-R1: Dependency Graph\n\n';
  md += `_Generated: ${new Date().toISOString().slice(0, 10)} | ts-morph via scripts/gen-dep-graph.ts_\n\n`;
  md += '## Folder Import Matrix\n\n';
  md += '| From ↓ imports From →';
  for (const dir of TOP_DIRS) md += ` | ${dir}`;
  md += ' |\n';
  md += '|' + '---|'.repeat(TOP_DIRS.length + 1) + '\n';

  // Detect surprising imports for "?" marker
  const surprisingImports = new Set<string>();
  for (const fromDir of TOP_DIRS) {
    for (const toDir of TOP_DIRS) {
      if (matrix[fromDir][toDir] && matrix[fromDir][toDir] > 0) {
        const fL = L_LEVELS[fromDir] ?? 99;
        const tL = L_LEVELS[toDir] ?? 99;
        // Surprising: components → builder, ui → builder
        if ((fromDir === 'components' && toDir.startsWith('builder')) ||
            (fromDir === 'ui' && toDir.startsWith('builder'))) {
          surprisingImports.add(`${fromDir}→${toDir}`);
        }
      }
    }
  }

  for (const fromDir of TOP_DIRS) {
    md += `| ${fromDir}`;
    for (const toDir of TOP_DIRS) {
      if (fromDir === toDir) {
        md += ' | —';
      } else if (matrix[fromDir][toDir] && matrix[fromDir][toDir] > 0) {
        const key = `${fromDir}→${toDir}`;
        if (surprisingImports.has(key)) {
          md += ' | ?';
        } else {
          md += ' | ✓';
        }
      } else {
        md += ' | ';
      }
    }
    md += ' |\n';
  }
  md += '\n_Legend: ✓ = imports exist, ? = surprising upward import, — = self, (blank) = no imports._\n';

  // ── Section 2: Layer Violations ─────────────────────────────────────
  md += '\n## Layer Violations\n\n';
  if (upwardViolations.length === 0) {
    md += 'No layer violations found.\n';
  } else {
    md += '| File | Imports | Expected direction | Violation |\n';
    md += '|---|---|---|---|\n';
    for (const v of upwardViolations) {
      const fromLabel = getLayerLabel(v.from);
      const toLabel = getLayerLabel(v.to);
      const direction = `${fromLabel} (${v.from}) should not import ${toLabel} (${v.to})`;
      md += `| \`${v.file}\` | \`${v.importPath}\` (${v.to}) | ${direction} | ⚠️ upward |\n`;
    }
  }

  // ── Section 3: components/ Scope Analysis ──────────────────────────
  md += '\n## src/components/ — Scope Analysis\n\n';
  const compFiles = sourceFiles
    .filter(sf => getTopDir(sf.getFilePath()) === 'components')
    .sort((a, b) => path.relative(process.cwd(), a.getFilePath()).localeCompare(path.relative(process.cwd(), b.getFilePath())));

  // Build import index: which files in components/ are imported by whom
  const compImporters: Record<string, { byBuilder: boolean; byOutside: string[] }> = {};
  for (const cf of compFiles) {
    const relPath = path.relative(process.cwd(), cf.getFilePath());
    compImporters[relPath] = { byBuilder: false, byOutside: [] };
  }

  for (const sf of sourceFiles) {
    const sfRel = path.relative(process.cwd(), sf.getFilePath());
    const sfDir = getTopDir(sfRel);
    for (const id of sf.getImportDeclarations()) {
      const spec = id.getModuleSpecifierValue();
      for (const cf of compFiles) {
        const cfRel = path.relative(process.cwd(), cf.getFilePath());
        const cfName = cfRel.replace('src/', '@/').replace(/\.(ts|tsx)$/, '');
        if (spec === cfName || spec === cfName.replace('/index', '')) {
          if (sfDir === 'builder') {
            compImporters[cfRel].byBuilder = true;
          } else if (sfDir !== 'components') {
            if (!compImporters[cfRel].byOutside.includes(sfDir)) {
              compImporters[cfRel].byOutside.push(sfDir);
            }
          }
        }
      }
    }
  }

  md += '| File | Imported by builder? | Imported outside builder? | Verdict |\n';
  md += '|---|---|---|---|\n';
  for (const cf of compFiles) {
    const relPath = path.relative(process.cwd(), cf.getFilePath());
    const info = compImporters[relPath];
    const byBuilder = info.byBuilder ? 'Yes' : 'No';
    const outside = info.byOutside.length > 0 ? `Yes (${info.byOutside.join(', ')})` : 'No';
    let verdict: string;
    if (!info.byBuilder && info.byOutside.length === 0) {
      verdict = 'unused';
    } else if (info.byOutside.length > 0) {
      verdict = 'truly shared';
    } else {
      verdict = 'builder-only';
    }
    md += `| ${relPath} | ${byBuilder} | ${outside} | ${verdict} |\n`;
  }

  // ── Section 4: Large File Index ─────────────────────────────────────
  md += '\n## Files Exceeding 150 Lines\n\n';
  const lineCounts = getLineCounts();
  const over150: { file: string; lines: number }[] = [];
  for (const [file, lines] of lineCounts) {
    if (lines > 150) over150.push({ file, lines });
  }
  over150.sort((a, b) => b.lines - a.lines);

  md += '| File | Lines | Cap | Action needed |\n';
  md += '|---|---|---|---|\n';
  for (const { file, lines } of over150) {
    const action = lines > 250 ? 'must split' : lines > 200 ? 'close to cap' : 'watch';
    md += `| ${file} | ${lines} | 250 | ${action} |\n`;
  }

  const outPath = path.join(process.cwd(), 'docs/plans/active/src-structure-audit/output/SA-R1-dependency-graph.md');
  fs.mkdirSync(path.dirname(outPath), { recursive: true });
  fs.writeFileSync(outPath, md, 'utf-8');
  console.log(`\nDone! Output written to docs/plans/active/src-structure-audit/output/SA-R1-dependency-graph.md`);
  console.log(`Files analyzed: ${sourceFiles.length}`);
  console.log(`Layer violations: ${upwardViolations.length}`);
  console.log(`Components analyzed: ${compFiles.length}`);
}

run().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
