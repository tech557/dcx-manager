import { getArg } from './args.ts';
import { checkCompletion } from './reconciliation-engine.ts';
import { GRAPH_ROOT, loadGraph } from './store.ts';
import { validateGraphData } from './validators.ts';
import { runVerificationCheck } from './verification.ts';

const changedRaw = getArg('--changed', '');
const paths = changedRaw ? changedRaw.split(',').map((p) => p.trim()).filter(Boolean) : [];

if (paths.length === 0) {
  console.error('Usage: npm run req:completion-gate -- --changed <comma-separated-paths>');
  console.error('  Runs reconciliation checks on changed files before work is marked done.');
  console.error('  Example: npm run req:completion-gate -- --changed src/components/Foo.tsx');
  process.exit(1);
}

const graphData = loadGraph();

// Pre-RS-R5: graph store has no requirement nodes yet; skip the gate
const hasRequirementNodes = graphData.nodes.some((n) =>
  n.type === 'Requirement' || n.type === 'SystemResponsibility' || n.type === 'Intent',
);

if (!hasRequirementNodes) {
  console.log(`=== Completion Gate Report ===`);
  console.log(`Changed files: ${paths.length}`);
  console.log(`Gate status: ⏭️ SKIPPED — pre-RS-R5 state (graph has no requirement nodes)`);
  console.log(`Manifestations in scope: ${paths.length}`);
  console.log('');
  console.log(`The requirements graph (docs/product/requirements/graph/) is not yet populated.`);
  console.log(`RS-R5 (source inventory) and RS-R6 (seed data) will populate requirement nodes.`);
  console.log(`Once the graph has requirement nodes, run this gate against changed files.`);
  process.exit(0);
}

const validationResult = validateGraphData(graphData);

if (!validationResult.pass) {
  console.error('❌ Graph validation failed — fix errors before marking done.');
  console.error(JSON.stringify(validationResult, null, 2));
  process.exit(1);
}

const result = checkCompletion(paths);
const verificationCheck = runVerificationCheck();

const lines: string[] = [];
lines.push(`=== Completion Gate Report ===`);
lines.push(`Changed files: ${paths.length}`);
lines.push(`Gate status: ${result.gatePass && verificationCheck.pass ? '✅ PASS' : '❌ FAIL'}`);
lines.push('');
lines.push(`--- Verification Status ---`);
lines.push(`Implemented but unverified: ${verificationCheck.report.implementedButUnverified.length}`);
lines.push(`Verification stale: ${verificationCheck.report.verificationStale.length}`);
lines.push(`Verification invalidated: ${verificationCheck.report.verificationInvalidated.length}`);
lines.push(`Partially verified: ${verificationCheck.report.partiallyVerified.length}`);
lines.push(`Acceptance outcomes without evidence: ${verificationCheck.report.acceptanceOutcomesWithoutEvidence.length}`);
lines.push('');

if (result.issues.length > 0) {
  lines.push('Issues:');
  for (const issue of result.issues) {
    lines.push(`  ⚠ ${issue}`);
  }
  lines.push('');
}

if (result.detectors.manifestationsLackingRequirements.length > 0) {
  lines.push(`Manifestations lacking requirements: ${result.detectors.manifestationsLackingRequirements.length}`);
}
if (result.detectors.requirementsLackingManifestations.length > 0) {
  lines.push(`Requirements lacking manifestations: ${result.detectors.requirementsLackingManifestations.length}`);
}
if (result.detectors.staleBrokenTraces.length > 0) {
  lines.push(`Stale/broken traces: ${result.detectors.staleBrokenTraces.length}`);
}
if (result.queuedCandidates.length > 0) {
  lines.push(`Candidate links needing confirmation: ${result.queuedCandidates.length}`);
}
if (result.autoApplied.length > 0) {
  lines.push(`Auto-applied technical links (with audit): ${result.autoApplied.length}`);
}
if (result.inventory.length > 0) {
  lines.push(`Manifestations in scope: ${result.inventory.length}`);
}

console.log(lines.join('\n'));

if (!result.gatePass) {
  process.exit(1);
}
