import { getArg } from './args.ts';
import { reconcile } from './reconciliation-engine.ts';

const mode = getArg('--mode', 'inventory');
const filesRaw = getArg('--files', '');
const files = filesRaw ? filesRaw.split(',').map((f) => f.trim()).filter(Boolean) : [];

if (mode !== 'inventory' && mode !== 'changed') {
  console.error('Usage: npm run req:reconcile -- --mode inventory|changed [--files <paths>]');
  console.error('  inventory  — scan all src/ + code-index for manifestations');
  console.error('  changed    — reconcile specific changed files (use --files <comma-separated-paths>)');
  process.exit(1);
}

if (mode === 'changed' && files.length === 0) {
  console.error('--mode changed requires --files <comma-separated-paths>');
  process.exit(1);
}

const report = reconcile(mode, mode === 'changed' ? files : undefined);
console.log(JSON.stringify(report, null, 2));

if (report.detectors.manifestationsLackingRequirements.length > 0) {
  console.error(`\n⚠ ${report.detectors.manifestationsLackingRequirements.length} manifestation(s) lack requirement links.`);
}
if (report.queuedCandidates.length > 0) {
  console.error(`⚠ ${report.queuedCandidates.length} candidate link(s) need confirmation (in review queue).`);
}
if (report.autoApplied.length > 0) {
  console.error(`✓ ${report.autoApplied.length} high-confidence technical link(s) auto-applied with audit entries.`);
  process.exit(0);
}
