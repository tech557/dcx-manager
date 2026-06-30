import {
  GRAPH_ROOT,
  ensureGraphDirs,
  writeNode,
  writeTraceLink,
  appendLedger,
  writeJsonFile,
  nodePath,
  loadGraph,
} from './store.ts';
import { validateGraphData } from './validators.ts';
import { generateFolderIndexes } from './folder-index.ts';
import type { GraphNode, TraceLink, LedgerEntry } from './schema.ts';

const root = GRAPH_ROOT;
const today = '2026-06-29';
const authoringActor = 'RS-R9 seed';
const source = 'docs/plans/active/requirements-system/sprints/RS-R9-dogfood-self-trace.md';

function req(id: string, statement: string, scope: string, extra: Record<string, unknown> = {}): GraphNode {
  return {
    id,
    type: 'Requirement',
    statement,
    scope,
    governance: 'approved',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    chain_layer: 'REQ->BHV->RSP',
    provenance: {
      source,
      source_path: source,
      authoring_actor: authoringActor,
      confidence: 1,
      confirmation_status: 'po-decided',
      last_checked_date: today,
    },
    ...extra,
  } as GraphNode;
}

function intentNode(id: string, statement: string): GraphNode {
  return {
    id,
    type: 'Intent',
    statement,
    scope: 'frontend',
    governance: 'approved',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    chain_layer: 'INT',
    provenance: {
      source,
      source_path: 'docs/plans/on-hold/frontend-polish-v0.3.5/output/decision-register.md',
      authoring_actor: authoringActor,
      confidence: 1,
      confirmation_status: 'po-decided',
      last_checked_date: today,
    },
  } as GraphNode;
}

function responsibilityNode(id: string, statement: string, scope: string, respType: string): GraphNode {
  return {
    id,
    type: 'SystemResponsibility',
    statement,
    scope,
    governance: 'proposed',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    responsibility_type: respType,
    chain_layer: 'RSP',
    provenance: {
      source,
      authoring_actor: authoringActor,
      confidence: 0.9,
      confirmation_status: 'skill-derived',
      last_checked_date: today,
    },
  } as GraphNode;
}

function expectedCategoryNode(id: string, statement: string, scope: string, category: string): GraphNode {
  return {
    id,
    type: 'ExpectedManifestationCategory',
    statement,
    scope,
    governance: 'proposed',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    category,
    chain_layer: 'EMC',
    provenance: {
      source,
      authoring_actor: authoringActor,
      confidence: 0.9,
      confirmation_status: 'skill-derived',
      last_checked_date: today,
    },
  } as GraphNode;
}

function acceptanceNode(id: string, statement: string, scope: string): GraphNode {
  return {
    id,
    type: 'AcceptanceOutcome',
    statement,
    scope,
    governance: 'proposed',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    chain_layer: 'AC',
    provenance: {
      source,
      authoring_actor: authoringActor,
      confidence: 0.8,
      confirmation_status: 'skill-derived',
      last_checked_date: today,
    },
  } as GraphNode;
}

function manifestationNode(
  id: string, statement: string, scope: string, kind: string, paths: string[],
): GraphNode {
  return {
    id,
    type: 'Manifestation',
    statement,
    scope,
    governance: 'proposed',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    kind,
    current_paths: paths,
    lifecycle: 'created',
    provenance: {
      source,
      authoring_actor: authoringActor,
      confidence: 0.95,
      confirmation_status: 'po-decided',
      last_checked_date: today,
    },
  } as GraphNode;
}

function traceLink(
  id: string, sourceId: string, targetId: string, relType: string, confidence = 0.95,
): TraceLink {
  return {
    id,
    type: 'TraceLink',
    source: sourceId,
    target: targetId,
    relationship_type: relType as TraceLink['relationship_type'],
    coverage: 'complete',
    confidence,
    inference_source: 'RS-R9 seed (manual curation)',
    confirmation_status: 'confirmed',
    last_checked_date: today,
    stale_state: 'current',
    needs_confirmation: false,
  };
}

function decisionLedger(id: string, eventType: string, reason: string, affected?: string[]): LedgerEntry {
  return {
    id,
    type: 'DecisionLedgerEntry',
    event_type: eventType,
    actor: 'PO',
    date: today,
    source,
    signoff_by: 'PO',
    signoff_text: 'PO sign-off via ask-user (2026-06-29 session)',
    reason,
    affected_links: affected,
  };
}

// ===== PART A: Session Decision Ingest (D-01..D-12 + 4 core-model alignments) =====

const sessionDecisions: { id: string; statement: string; label: string }[] = [
  {
    id: 'REQ-FP-D01',
    statement: 'Task card as a single responsive component that resizes between collapsed/expanded (not separate components). Spacing, margins, font-sizes must be responsive/token-driven. Requires design-exploration step + PO sign-off before implementation.',
    label: 'D-01',
  },
  {
    id: 'REQ-FP-D02',
    statement: 'FocusIsland DEFAULT mode = highlight/spotlight: activates/highlights matching values while keeping non-matching VISIBLE. No opt-in isolation mode. Full picture retained at all times.',
    label: 'D-02',
  },
  {
    id: 'REQ-FP-D03',
    statement: 'ViewHelperIsland is NOT absent — code is view-gated (only renders in timeline/calendar views). Confirmed in scope; wire browser-verification step for timeline view in the relevant sprint.',
    label: 'D-03',
  },
  {
    id: 'REQ-FP-D04',
    statement: 'Wire entry points so AIChatPopup and TemplatePopup are reachable. Both in scope for v0.3.5.',
    label: 'D-04',
  },
  {
    id: 'REQ-FP-D05',
    statement: 'Theme toggle must actually switch dataset.theme/classList. PREREQUISITE for all light-theme token work (L01–L08) — must land before/with the change-token light-theme sprint.',
    label: 'D-05',
  },
  {
    id: 'REQ-FP-D06',
    statement: 'Dedicated sprint to add reduced-motion branches across effects.registry.ts + islands/cards per FP-R4 M01–M05 and core.md §20.',
    label: 'D-06',
  },
  {
    id: 'REQ-FP-D07',
    statement: 'Homepage/version reference available at docs/archive/dcx-manager-v0.1.4 (full prior codebase). FP-R5 grounds homepage/version sprints in this reference + brand contract.',
    label: 'D-07',
  },
  {
    id: 'REQ-FP-D08',
    statement: 'Brandbook values extracted from PDF text layer. Use output/brandbook-values.md as the FP-R1 values source.',
    label: 'D-08',
  },
  {
    id: 'REQ-FP-D09',
    statement: 'Enable click-to-open on collapsed editor when a card is selected (in addition to drag).',
    label: 'D-09',
  },
  {
    id: 'REQ-FP-D10',
    statement: 'Routing & Endpoint Directory fields: single-column layout (full width). No editor-width change.',
    label: 'D-10',
  },
  {
    id: 'REQ-FP-D11',
    statement: 'Collapsed Phase readiness text via tooltip (hover) + aria-label (screen readers).',
    label: 'D-11',
  },
  {
    id: 'REQ-FP-D12',
    statement: 'Tokenize layout widths/heights (phase 72/260px, editor 382px, header 64px, footer 76px). Same pixels, sourced from tokens, not hardcoded. Aligns with D-01 responsive direction.',
    label: 'D-12',
  },
];

const coreModelAlignments: { id: string; statement: string }[] = [
  {
    id: 'REQ-FP-CMA-001',
    statement: 'Add a live Version-readiness summary in the header / metadata island, updating on every edit. The "stats" surface the discovery missed.',
  },
  {
    id: 'REQ-FP-CMA-002',
    statement: 'SMART default: active phase(s) expanded, the rest collapsed columns. Scales to 7–8 phases without a wall of scroll.',
  },
  {
    id: 'REQ-FP-CMA-003',
    statement: 'AUTO-CENTRE on select/navigate: selecting a card or jumping via focus/filter scrolls the stage to centre it (object-specific centring).',
  },
  {
    id: 'REQ-FP-CMA-004',
    statement: 'Drag-to-create pill: dragging from KBI-001 button creates a new card. Existing REQ-KBI-001 captures this; refined by PO alignment from core-interaction-model.',
  },
];

// ===== PART B: Self-Trace — Derived Requirements for Missing Scopes =====

interface DerivedReq {
  id: string;
  statement: string;
  scope: string;
  responsibilityType: string;
  expectedCategory: string;
  acceptanceStatement: string;
}

const derivedReqs: DerivedReq[] = [
  {
    id: 'REQ-GOV-TRACE-001-FRONTEND',
    statement: 'Frontend-specific derivation of trace governance: every meaningful React component, hook, store action, or UI behavior must trace to an approved product requirement or carry an explicit exemption.',
    scope: 'frontend',
    responsibilityType: 'ui-presentation',
    expectedCategory: 'component',
    acceptanceStatement: 'Frontend manifestations (components, hooks, store actions) each have a trace link to an approved requirement or exemption.',
  },
  {
    id: 'REQ-GOV-TRACE-001-BACKEND',
    statement: 'Backend-specific derivation of trace governance: every service, API endpoint, mapper, or data contract must trace to an approved requirement or carry an explicit exemption.',
    scope: 'backend',
    responsibilityType: 'service-integration',
    expectedCategory: 'service',
    acceptanceStatement: 'Backend manifestations (services, endpoints, mappers) each have a trace link to an approved requirement or exemption.',
  },
  {
    id: 'REQ-GOV-TRACE-001-DEVOPS',
    statement: 'DevOps-specific derivation of trace governance: every CI hook, deployment script, build config, or infrastructure definition must trace to an approved requirement or carry an explicit exemption.',
    scope: 'devops',
    responsibilityType: 'operations',
    expectedCategory: 'script',
    acceptanceStatement: 'DevOps manifestations (CI hooks, scripts, configs) each have a trace link to an approved requirement or exemption.',
  },
  {
    id: 'REQ-GOV-TRACE-001-TESTQA',
    statement: 'Test/QA-specific derivation of trace governance: every test suite, test case, or quality gate must trace to the acceptance outcome or requirement it verifies, or carry an explicit exemption.',
    scope: 'test-qa',
    responsibilityType: 'verification',
    expectedCategory: 'unit-test',
    acceptanceStatement: 'Test/QA manifestations (test files, e2e suites, quality gates) each have a trace link to the acceptance outcome or requirement they verify.',
  },
  {
    id: 'REQ-GOV-TRACE-001-SECURITY',
    statement: 'Security-specific derivation of trace governance: every policy, guard, permission check, or security test must trace to an approved security requirement or carry an explicit exemption.',
    scope: 'security',
    responsibilityType: 'security',
    expectedCategory: 'policy',
    acceptanceStatement: 'Security manifestations (guards, policies, security tests) each have a trace link to an approved requirement or exemption.',
  },
  {
    id: 'REQ-GOV-TRACE-001-OPS',
    statement: 'Operations-specific derivation of trace governance: every operational script, monitoring check, alert rule, or runbook must trace to an approved operations requirement or carry an explicit exemption.',
    scope: 'operations',
    responsibilityType: 'operations',
    expectedCategory: 'script',
    acceptanceStatement: 'Operations manifestations (scripts, monitoring, alerting) each have a trace link to an approved requirement or exemption.',
  },
];

// ===== PART C: Self-Trace — System Manifestations =====

interface SysMan {
  id: string;
  statement: string;
  scope: string;
  kind: string;
  paths: string[];
}

const systemManifestations: SysMan[] = [
  {
    id: 'MAN-agent-rule-docs-agent-rules-core-md',
    statement: 'Core agent rules: AGENTS.md router + core.md non-negotiable rules including §33-35 requirements governance clauses.',
    scope: 'governance',
    kind: 'agent-rule',
    paths: ['docs/agent-rules/core.md', 'AGENTS.md'],
  },
  {
    id: 'MAN-agent-rule-agents-md-skill-router',
    statement: 'Project skills and tooling documentation in AGENTS.md: skill routing, gate commands, frontend tool routing, MCP server listing.',
    scope: 'agent-workflow',
    kind: 'agent-rule',
    paths: ['AGENTS.md'],
  },
  {
    id: 'MAN-skill-dcx-requirement-intake',
    statement: 'dcx-requirement-intake skill: captures product intent from PO messages and creates candidate requirement nodes via governed workflow.',
    scope: 'agent-workflow',
    kind: 'skill',
    paths: ['.agents/skills/dcx-requirement-intake/SKILL.md'],
  },
  {
    id: 'MAN-skill-dcx-requirement-maturation',
    statement: 'dcx-requirement-maturation skill: adds acceptance criteria, rules, conditions, exceptions, responsibilities, and expected manifestation categories to requirements.',
    scope: 'agent-workflow',
    kind: 'skill',
    paths: ['.agents/skills/dcx-requirement-maturation/SKILL.md'],
  },
  {
    id: 'MAN-skill-dcx-manifestation-reconcile',
    statement: 'dcx-manifestation-reconcile skill: reconciles code manifestations against requirements, runs change-triggered checks, and produces coverage reports.',
    scope: 'agent-workflow',
    kind: 'skill',
    paths: ['.agents/skills/dcx-manifestation-reconcile/SKILL.md'],
  },
  {
    id: 'MAN-validator-scripts-requirements-validators',
    statement: 'Graph validators: structural validation of all graph nodes, trace links, and ledger entries. Enforces three-state lifecycle, progressive field requirements, relationship integrity.',
    scope: 'data',
    kind: 'validator',
    paths: ['scripts/requirements/validators.ts'],
  },
  {
    id: 'MAN-validator-scripts-requirements-verification',
    statement: 'Verification module: binds evidence to acceptance outcomes, tracks implemented vs verified states, detects staleness from code changes, produces verification reports.',
    scope: 'governance',
    kind: 'validator',
    paths: ['scripts/requirements/verification.ts'],
  },
  {
    id: 'MAN-function-scripts-requirements-store',
    statement: 'Graph store module: loads, writes, and organizes graph nodes (typed subfolders), trace links, and the append-only JSONL ledger.',
    scope: 'data',
    kind: 'function',
    paths: ['scripts/requirements/store.ts'],
  },
  {
    id: 'MAN-function-scripts-requirements-reconciliation-engine',
    statement: 'Reconciliation engine: inventories code manifestations, proposes confidence-scored candidate trace links, detects orphan/partial/stale links.',
    scope: 'data',
    kind: 'function',
    paths: ['scripts/requirements/reconciliation-engine.ts'],
  },
  {
    id: 'MAN-function-scripts-requirements-queues',
    statement: 'Reconciliation and governance queues: surfaces requirements needing classification, decomposition, manifestations, verification, or other attention.',
    scope: 'governance',
    kind: 'function',
    paths: ['scripts/requirements/queues.ts'],
  },
  {
    id: 'MAN-function-scripts-requirements-completion-gate',
    statement: 'Completion gate hook: runs validation + reconciliation + verification checks before a sprint can be marked done.',
    scope: 'governance',
    kind: 'function',
    paths: ['scripts/requirements/completion-gate.ts'],
  },
  {
    id: 'MAN-function-scripts-requirements-folder-index',
    statement: 'Folder index generator: produces index.csv and README.md in every node subfolder for human navigation.',
    scope: 'devops',
    kind: 'function',
    paths: ['scripts/requirements/folder-index.ts'],
  },
  {
    id: 'MAN-script-scripts-requirements-seed-rs-r6',
    statement: 'RS-R6 migration seed script: populated the initial requirements graph from the RS-R5 itemized dataset.',
    scope: 'devops',
    kind: 'script',
    paths: ['scripts/requirements/seed-rs-r6.ts'],
  },
  {
    id: 'MAN-script-scripts-requirements-seed-evidence-rs-r8',
    statement: 'RS-R8 evidence seed script: bound seeded evidence nodes to acceptance outcomes.',
    scope: 'governance',
    kind: 'script',
    paths: ['scripts/requirements/seed-evidence-rs-r8.ts'],
  },
  {
    id: 'MAN-script-scripts-requirements-seed-rs-r9',
    statement: 'RS-R9 seed script: ingests session decisions and creates self-trace nodes for the system itself.',
    scope: 'governance',
    kind: 'script',
    paths: ['scripts/requirements/seed-rs-r9.ts'],
  },
  {
    id: 'MAN-ci-hook-package-json-req-scripts',
    statement: 'npm package.json req:* script entries: validate, propose, apply-after-signoff, generate-views, query, trace, justify, reconcile, refresh-code-index, completion-gate.',
    scope: 'devops',
    kind: 'ci-hook',
    paths: ['package.json'],
  },
  {
    id: 'MAN-documentation-view-docs-product-requirements-graph-views',
    statement: 'Generated graph views: human-readable Markdown/CSV summary views of the requirements graph.',
    scope: 'governance',
    kind: 'documentation-view',
    paths: ['docs/product/requirements/graph/views/'],
  },
  {
    id: 'MAN-documentation-view-docs-product-requirements-graph-generated',
    statement: 'Generated query outputs: low-token JSON slices for agent consumption, query index, graph summary.',
    scope: 'governance',
    kind: 'documentation-view',
    paths: ['docs/product/requirements/graph/generated/'],
  },
  {
    id: 'MAN-test-src-requirements-tests-requirements-reconciliation-test',
    statement: 'Reconciliation engine unit tests: verifies inventory, candidate link inference, orphan/partial/stale detection.',
    scope: 'test-qa',
    kind: 'test',
    paths: ['src/requirements/__tests__/requirements.reconciliation.test.ts'],
  },
  {
    id: 'MAN-test-src-requirements-tests-requirements-verification-test',
    statement: 'Verification module unit tests: 26 tests covering evidence binding, staleness detection, verification reports.',
    scope: 'test-qa',
    kind: 'test',
    paths: ['src/requirements/__tests__/requirements.verification.test.ts'],
  },
];

// ===== Write Everything =====

const allNodes: GraphNode[] = [];
const allTraceLinks: TraceLink[] = [];
const allLedgerEntries: LedgerEntry[] = [];

// --- Session Intent Node ---
const sessionIntent = intentNode(
  'INT-FP-DECISION-SESSION-001',
  '2026-06-29 frontend-polish PO decision session: resolved D-01..D-12, 4 core-model alignments, and recovered requirement families from CSV + v0.1.4 codebase.',
);
allNodes.push(sessionIntent);

// --- D-01..D-12 Requirement Nodes ---
for (const d of sessionDecisions) {
  const n = req(d.id, d.statement, 'frontend', {
    source_id: d.label,
    source_category: 'frontend-polish decision register',
    priority: 'MVP',
    status: 'Confirmed',
    provenance: {
      source: 'docs/plans/on-hold/frontend-polish-v0.3.5/output/decision-register.md',
      source_path: 'docs/plans/on-hold/frontend-polish-v0.3.5/output/decision-register.md',
      authoring_actor: authoringActor,
      confidence: 1,
      confirmation_status: 'po-decided',
      last_checked_date: today,
    },
  });
  allNodes.push(n);
  allTraceLinks.push(traceLink(
    `TRC-${d.id}-TO-INT-FP-DECISION-SESSION-001`,
    d.id, 'INT-FP-DECISION-SESSION-001', 'derives-from',
  ));
}

// --- 4 Core-Model Alignment Requirement Nodes ---
for (const cma of coreModelAlignments) {
  const n = req(cma.id, cma.statement, 'frontend', {
    source_category: 'core-interaction-model PO alignments',
    priority: 'MVP',
    status: 'Confirmed',
    provenance: {
      source: 'docs/plans/on-hold/frontend-polish-v0.3.5/output/core-interaction-model.md',
      source_path: 'docs/plans/on-hold/frontend-polish-v0.3.5/output/core-interaction-model.md',
      authoring_actor: authoringActor,
      confidence: 1,
      confirmation_status: 'po-decided',
      last_checked_date: today,
    },
  });
  allNodes.push(n);
  allTraceLinks.push(traceLink(
    `TRC-${cma.id}-TO-INT-FP-DECISION-SESSION-001`,
    cma.id, 'INT-FP-DECISION-SESSION-001', 'derives-from',
  ));
}

// --- PO Sign-Off Ledger Entry for Session Decisions ---
allLedgerEntries.push(decisionLedger(
  'LDG-2026-06-29-RS-R9-SESSION-DECISIONS',
  'po-signoff',
  'PO sign-off on RS-R9 session decisions ingest: D-01..D-12 (D-02 as highlight-only, rejecting opt-in isolation refinement), 4 core-model alignments. All 16 requirements approved as product intent for frontend-polish re-grounding.',
  sessionDecisions.map((d) => d.id).concat(coreModelAlignments.map((c) => c.id)),
));

// --- Self-Trace: Derived Requirement Nodes + Responsibilities + Categories + Acceptances ---
for (const dr of derivedReqs) {
  const n = req(dr.id, dr.statement, dr.scope, {
    lock_owner: 'PO',
    lock_date: today,
    ledger_ref: 'LDG-2026-06-29-RS-R6-SEED-MIGRATION',
  });
  allNodes.push(n);

  // derives-from the root trace requirement
  allTraceLinks.push(traceLink(
    `TRC-${dr.id}-TO-REQ-GOV-TRACE-001`,
    dr.id, 'REQ-GOV-TRACE-001', 'derives-from',
  ));

  // Responsibility node
  const rspId = `RSP-GOV-TRACE-${dr.scope.toUpperCase().replace(/-/g, '')}`;
  const rsp = responsibilityNode(
    rspId,
    `Trace governance ${dr.scope} responsibility: enforce traceability for all ${dr.scope} manifestations.`,
    dr.scope,
    dr.responsibilityType,
  );
  allNodes.push(rsp);

  // REQ -> RSP trace
  allTraceLinks.push(traceLink(
    `TRC-${dr.id}-TO-${rspId}`,
    dr.id, rspId, 'decomposes-into',
  ));

  // Expected Manifestation Category node
  const emcId = `EMC-GOV-TRACE-${dr.scope.toUpperCase().replace(/-/g, '')}`;
  const emc = expectedCategoryNode(
    emcId,
    `Trace governance ${dr.scope} expected manifestation category: ${dr.expectedCategory}.`,
    dr.scope,
    dr.expectedCategory,
  );
  allNodes.push(emc);

  // RSP -> EMC trace
  allTraceLinks.push(traceLink(
    `TRC-${rspId}-TO-${emcId}`,
    rspId, emcId, 'decomposes-into',
  ));

  // Acceptance Outcome node
  const acId = `AC-GOV-TRACE-${dr.scope.toUpperCase().replace(/-/g, '')}`;
  const ac = acceptanceNode(acId, dr.acceptanceStatement, dr.scope);
  allNodes.push(ac);

  // REQ -> AC trace
  allTraceLinks.push(traceLink(
    `TRC-${dr.id}-TO-${acId}`,
    dr.id, acId, 'validates', 0.85,
  ));
}

// --- Self-Trace: Manifestation Nodes + Trace Links ---
const selfTraceReqIds = derivedReqs.map((d) => d.id);

for (const sm of systemManifestations) {
  const n = manifestationNode(sm.id, sm.statement, sm.scope, sm.kind, sm.paths);
  allNodes.push(n);

  // Manifestation implements the relevant derived requirement
  // Map by manifest scope -> derived req
  const scopeToDerivedReq: Record<string, string> = {
    'governance': 'REQ-GOV-TRACE-001',
    'agent-workflow': 'REQ-GOV-TRACE-001-AGENT',
    'data': 'REQ-GOV-TRACE-001-DATA',
    'frontend': 'REQ-GOV-TRACE-001-FRONTEND',
    'backend': 'REQ-GOV-TRACE-001-BACKEND',
    'devops': 'REQ-GOV-TRACE-001-DEVOPS',
    'test-qa': 'REQ-GOV-TRACE-001-TESTQA',
    'security': 'REQ-GOV-TRACE-001-SECURITY',
    'operations': 'REQ-GOV-TRACE-001-OPS',
    'verification': 'REQ-GOV-TRACE-001',
  };

  const targetReq = scopeToDerivedReq[sm.scope] || 'REQ-GOV-TRACE-001';
  allTraceLinks.push(traceLink(
    `TRC-${targetReq}-TO-${sm.id}`,
    targetReq, sm.id, 'implements', 0.95,
  ));
}

// --- Self-Trace: PO Sign-Off Ledger Entry ---
allLedgerEntries.push(decisionLedger(
  'LDG-2026-06-29-RS-R9-SELF-TRACE',
  'po-signoff',
  'PO sign-off on RS-R9 self-trace: derived requirements across frontend, backend, devops, test-qa, security, operations; system responsibility/expected-category/acceptance nodes; 20 manifestation nodes for system artifacts; full trace link chain.',
  derivedReqs.map((d) => d.id).concat(systemManifestations.map((m) => m.id)),
));

// ===== Write to Disk =====
ensureGraphDirs(root);

// Write ledger entries first
for (const entry of allLedgerEntries) {
  appendLedger(root, entry);
}

// Write trace links
for (const link of allTraceLinks) {
  writeTraceLink(root, link);
}

// Write nodes
for (const node of allNodes) {
  writeNode(root, node);
}

// Rebuild all folder indexes
const indexed = generateFolderIndexes(root + '/nodes');

// ===== Validate =====
const graph = loadGraph(root);
const validation = validateGraphData(graph);

// ===== Output Report =====
const report = {
  phase: 'RS-R9 dogfood + self-trace',
  sessionDecisionsCreated: sessionDecisions.length,
  coreModelAlignmentsCreated: coreModelAlignments.length,
  selfTraceDerivedReqs: derivedReqs.length,
  selfTraceManifestations: systemManifestations.length,
  ledgerEntriesAdded: allLedgerEntries.length,
  totalNewNodes: allNodes.length,
  totalNewTraceLinks: allTraceLinks.length,
  folderIndexNodeCount: indexed,
  validationPass: validation.pass,
  validationErrors: validation.errors.length,
  validationWarnings: validation.warnings.length,
  validationErrorsDetail: validation.errors,
  validationWarningsDetail: validation.warnings,
};

writeJsonFile(`${root}/generated/rs-r9-seed-report.json`, report);

console.log(JSON.stringify(report, null, 2));
