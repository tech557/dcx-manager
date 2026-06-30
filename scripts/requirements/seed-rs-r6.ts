import * as fs from 'node:fs';
import * as path from 'node:path';
import {
  GRAPH_ROOT,
  ensureGraphDirs,
  traceLinkPath,
  writeJsonFile,
  writeNode,
  writeTraceLink,
} from './store.ts';
import type {
  GraphNode,
  GovernanceState,
  LedgerEntry,
  MaturityState,
  ResponsibilityType,
  Scope,
  TraceLink,
} from './schema.ts';
import { validateGraphData } from './validators.ts';
import { loadGraph } from './store.ts';

type CsvRow = Record<string, string>;

interface SeedRow {
  source_row: string;
  source_id: string;
  category: string;
  status: string;
  chain_layer: string;
  suggested_node_id: string;
  source_path: string;
  seed_action: string;
}

const ROOT = process.cwd();
const MASTER_CSV = path.join(ROOT, 'dcx-requirements-master.csv');
const ITEMIZED_CSV = path.join(ROOT, 'docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv');
const GRAPH = GRAPH_ROOT;
const DATE = '2026-06-29';
const RS_R6_LEDGER_ID = 'LDG-2026-06-29-RS-R6-SEED-MIGRATION';

const SOURCE_BY_ID = new Map(readCsv(MASTER_CSV).map((row) => [row.ID, row]));
const SEED_ROWS = readCsv(ITEMIZED_CSV) as unknown as SeedRow[];

const SCOPE_BY_PREFIX: Record<string, Scope> = {
  AIC: 'product',
  AIM: 'data',
  BC: 'frontend',
  CR: 'operations',
  DM: 'data',
  DZ: 'frontend',
  EFP: 'frontend',
  EVI: 'frontend',
  FCS: 'frontend',
  FI: 'data',
  IFX: 'frontend',
  KBI: 'frontend',
  PR: 'security',
  RDY: 'frontend',
  RV: 'product',
  SBC: 'frontend',
  SC: 'data',
  SPS: 'frontend',
  STG: 'frontend',
  TPL: 'product',
  UP: 'frontend',
  VHB: 'frontend',
  VL: 'product',
  VR: 'backend',
};

const RESPONSIBILITY_BY_PREFIX: Record<string, ResponsibilityType> = {
  AIC: 'service-integration',
  AIM: 'data',
  BC: 'ui-presentation',
  CR: 'operations',
  DM: 'data',
  DZ: 'interaction',
  EFP: 'service-integration',
  EVI: 'ui-presentation',
  FCS: 'interaction',
  FI: 'data',
  IFX: 'interaction',
  KBI: 'interaction',
  PR: 'security',
  RDY: 'validation',
  RV: 'validation',
  SBC: 'ui-presentation',
  SC: 'persistence',
  SPS: 'interaction',
  STG: 'ui-presentation',
  TPL: 'service-integration',
  UP: 'state',
  VHB: 'ui-presentation',
  VL: 'domain-logic',
  VR: 'security',
};

const EMC_CATEGORY_BY_RESPONSIBILITY: Record<ResponsibilityType, string> = {
  'agent-workflow': 'agent-rule',
  data: 'type-schema',
  'domain-logic': 'rule-function',
  governance: 'policy',
  interaction: 'event-handler',
  operations: 'script',
  persistence: 'storage-field',
  security: 'policy',
  'service-integration': 'service',
  state: 'store-field',
  'ui-presentation': 'component',
  validation: 'validator',
  verification: 'test',
};

const RECOVERY_REQUIREMENTS: Array<{
  id: string;
  statement: string;
  chain_layer: string;
  scope: Scope;
  source_anchor: string;
}> = [
  ['REQ-KEY-001', 'Ctrl+A selects all eligible builder cards.', 'REQ->BHV->RSP', 'frontend', 'CSG-KEY-001'],
  ['REQ-KEY-002', 'Ctrl+C copies the current builder selection.', 'REQ->BHV->RSP', 'frontend', 'CSG-KEY-002'],
  ['REQ-KEY-003', 'Ctrl+V pastes copied builder items into a smart target.', 'REQ->BHV->RSP', 'frontend', 'CSG-KEY-003'],
  ['REQ-KEY-004', 'Delete and Backspace remove selected builder items through governed deletion rules.', 'REQ->BHV->RSP', 'frontend', 'CSG-KEY-004'],
  ['REQ-KEY-005', 'Escape deselects the current builder selection.', 'REQ->BHV->RSP', 'frontend', 'CSG-KEY-005'],
  ['REQ-KEY-006', 'Ctrl+S triggers manual save without bypassing autosave governance.', 'REQ->BHV->RSP', 'frontend', 'CSG-KEY-006'],
  ['REQ-KEY-007', 'Keyboard shortcuts are guarded while typing into text inputs.', 'REQ->BHV->RSP', 'frontend', 'CSG-KEY-007'],
  ['REQ-SBC-DUP-001', 'Multi-select copy and paste duplicates selected shared builder cards.', 'REQ->BHV->RSP', 'frontend', 'CSG-DUP-001'],
  ['REQ-SBC-DES-001', 'Manual deselect works through Escape and empty-stage click.', 'REQ->BHV->RSP', 'frontend', 'CSG-DES-001'],
  ['REQ-DZ-001-RECOVERY', 'Stage movement, scroll direction, and dropzone behavior are recovered from the prior implementation.', 'REQ->RSP', 'frontend', 'CSG-DND-001'],
].map(([id, statement, chain_layer, scope, source_anchor]) => ({ id, statement, chain_layer, scope: scope as Scope, source_anchor }));

const GOVERNANCE_REQUIREMENTS: GraphNode[] = [
  {
    id: 'REQ-GOV-TRACE-001',
    type: 'Requirement',
    statement: 'Every meaningful manifestation must trace to an approved requirement or carry an explicit exemption.',
    scope: 'governance',
    governance: 'locked',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    lock_owner: 'PO',
    lock_date: DATE,
    ledger_ref: RS_R6_LEDGER_ID,
    chain_layer: 'REQ->BHV->RSP',
    provenance: provenance('RS-R0b architecture', 'docs/plans/active/requirements-system/output/RS-R0b-architecture.md', 'REQ-GOV-TRACE-001', 'po-decided', 1),
  },
  {
    id: 'REQ-GOV-TRACE-001-DATA',
    type: 'Requirement',
    statement: 'Data-specific derivation of trace governance: graph records must preserve provenance and validate relationships.',
    scope: 'data',
    governance: 'locked',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    lock_owner: 'PO',
    lock_date: DATE,
    ledger_ref: RS_R6_LEDGER_ID,
    chain_layer: 'REQ->RSP',
    provenance: provenance('RS-R0b architecture', 'docs/plans/active/requirements-system/output/RS-R0b-architecture.md', 'REQ-GOV-TRACE-001-DATA', 'po-decided', 1),
  },
  {
    id: 'REQ-GOV-TRACE-001-AGENT',
    type: 'Requirement',
    statement: 'Agent plans and outputs must carry graph-ID grounding before implementation claims are accepted.',
    scope: 'agent-workflow',
    governance: 'locked',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    lock_owner: 'PO',
    lock_date: DATE,
    ledger_ref: RS_R6_LEDGER_ID,
    chain_layer: 'REQ->BHV->RSP',
    provenance: provenance('RS-R0b architecture', 'docs/plans/active/requirements-system/output/RS-R0b-architecture.md', 'REQ-GOV-TRACE-001-AGENT', 'po-decided', 1),
  },
];

const SELF_TRACE_MANIFESTATIONS: GraphNode[] = [
  {
    id: 'MAN-function-scripts-requirements-seed-rs-r6',
    type: 'Manifestation',
    statement: 'RS-R6 deterministic seed script for canonical requirements graph data.',
    governance: 'approved',
    maturity: 'logic-defined',
    delivery: 'implemented',
    scope: 'data',
    kind: 'function',
    current_paths: ['scripts/requirements/seed-rs-r6.ts'],
    lifecycle: 'created',
    provenance: provenance('RS-R6 implementation', 'scripts/requirements/seed-rs-r6.ts', 'seed-rs-r6', 'confirmed', 0.95),
  },
  {
    id: 'MAN-function---package',
    type: 'Manifestation',
    statement: 'Package script exposing the RS-R6 seed command.',
    governance: 'approved',
    maturity: 'logic-defined',
    delivery: 'implemented',
    scope: 'devops',
    kind: 'config',
    current_paths: ['package.json'],
    lifecycle: 'modified',
    provenance: provenance('RS-R6 implementation', 'package.json', 'req:seed-rs-r6', 'confirmed', 0.95),
  },
  {
    id: 'MAN-function-docs-plans-active-requirements-system-output-rs-r6-build-notes',
    type: 'Manifestation',
    statement: 'RS-R6 build notes and close-out evidence.',
    governance: 'approved',
    maturity: 'logic-defined',
    delivery: 'implemented',
    scope: 'agent-workflow',
    kind: 'documentation-view',
    current_paths: ['docs/plans/active/requirements-system/output/RS-R6-build-notes.md'],
    lifecycle: 'created',
    provenance: provenance('RS-R6 implementation', 'docs/plans/active/requirements-system/output/RS-R6-build-notes.md', 'RS-R6-build-notes', 'confirmed', 0.95),
  },
  {
    id: 'MAN-function-docs-plans-active-requirements-system-sprints-rs-r6-migrate-seed-datamodel',
    type: 'Manifestation',
    statement: 'RS-R6 sprint status and acceptance checklist.',
    governance: 'approved',
    maturity: 'logic-defined',
    delivery: 'implemented',
    scope: 'agent-workflow',
    kind: 'documentation-view',
    current_paths: ['docs/plans/active/requirements-system/sprints/RS-R6-migrate-seed-datamodel.md'],
    lifecycle: 'modified',
    provenance: provenance('RS-R6 implementation', 'docs/plans/active/requirements-system/sprints/RS-R6-migrate-seed-datamodel.md', 'RS-R6-sprint', 'confirmed', 0.95),
  },
  {
    id: 'MAN-function-docs-plans-active-requirements-system-readme',
    type: 'Manifestation',
    statement: 'Requirements-system README carry-forward for RS-R6.',
    governance: 'approved',
    maturity: 'logic-defined',
    delivery: 'implemented',
    scope: 'agent-workflow',
    kind: 'documentation-view',
    current_paths: ['docs/plans/active/requirements-system/README.md'],
    lifecycle: 'modified',
    provenance: provenance('RS-R6 implementation', 'docs/plans/active/requirements-system/README.md', 'RS-R6-carry-forward', 'confirmed', 0.95),
  },
];

function parseCsvLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  for (let i = 0; i < line.length; i += 1) {
    const char = line[i];
    const next = line[i + 1];
    if (char === '"' && inQuotes && next === '"') {
      current += '"';
      i += 1;
      continue;
    }
    if (char === '"') {
      inQuotes = !inQuotes;
      continue;
    }
    if (char === ',' && !inQuotes) {
      values.push(current);
      current = '';
      continue;
    }
    current += char;
  }
  values.push(current);
  return values;
}

function readCsv(filePath: string): CsvRow[] {
  const [headerLine, ...lines] = fs.readFileSync(filePath, 'utf8').trim().split(/\r?\n/);
  const headers = parseCsvLine(headerLine);
  return lines.map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']));
  });
}

function slug(value: string): string {
  return value.replace(/[^A-Za-z0-9]+/g, '-').replace(/^-|-$/g, '').toUpperCase();
}

function prefixOf(id: string): string {
  return id.split('-')[0];
}

function provenance(
  source: string,
  source_path: string,
  source_anchor: string,
  confirmation_status: GraphNode['provenance']['confirmation_status'],
  confidence: number,
): GraphNode['provenance'] {
  return {
    source,
    source_path,
    source_anchor,
    authoring_actor: 'RS-R6 migration',
    confidence,
    confirmation_status,
    last_checked_date: DATE,
  };
}

function governanceFor(status: string, nodeId: string): GovernanceState {
  if (nodeId.startsWith('QST-')) return 'proposed';
  if (nodeId.startsWith('INT-')) return 'draft';
  if (status.toLowerCase().includes('proposed')) return 'proposed';
  return 'approved';
}

function maturityFor(nodeId: string): MaturityState {
  if (nodeId.startsWith('INT-') || nodeId.startsWith('QST-')) return 'intent-captured';
  return 'logic-defined';
}

function confirmationFor(status: string): GraphNode['provenance']['confirmation_status'] {
  if (status.toLowerCase().includes('proposed')) return 'agent-proposed';
  if (status.toLowerCase().includes('needs decision')) return 'agent-proposed';
  if (status.toLowerCase().includes('deferred')) return 'agent-proposed';
  return 'confirmed';
}

function statementFor(row: CsvRow): string {
  return [row.Requirement, row['Business Description'], row['Functional Detail']]
    .map((part) => part?.trim())
    .filter(Boolean)
    .join(' — ');
}

function nodeFromSeed(row: SeedRow): GraphNode {
  const source = SOURCE_BY_ID.get(row.source_id);
  if (!source) throw new Error(`Missing source row for ${row.source_id}`);
  const nodeId = row.suggested_node_id;
  const prefix = prefixOf(row.source_id);
  const base = {
    id: nodeId,
    statement: statementFor(source),
    governance: governanceFor(row.status, nodeId),
    maturity: maturityFor(nodeId),
    delivery: 'not-assessed' as const,
    source_id: row.source_id,
    source_category: row.category,
    priority: source.Priority,
    status: row.status,
    chain_layer: row.chain_layer,
    dependencies: source.Dependencies,
    related_requirements: source['Related Requirements'],
    affected_modules: source['Affected Modules'],
    ux_impact: source['UX Impact'],
    risk: source.Risk,
    provenance: provenance('dcx-requirements-master.csv', 'dcx-requirements-master.csv', row.source_id, confirmationFor(row.status), row.status === 'Confirmed' ? 0.95 : 0.75),
  };

  if (nodeId.startsWith('INT-')) return { ...base, type: 'Intent' };
  if (nodeId.startsWith('QST-')) return { ...base, type: 'OpenQuestion', open_questions: [source.Notes || source.Requirement] };
  return {
    ...base,
    type: 'Requirement',
    scope: SCOPE_BY_PREFIX[prefix] ?? 'product',
  };
}

function familyGroups(rows: SeedRow[]): Map<string, SeedRow[]> {
  const groups = new Map<string, SeedRow[]>();
  for (const row of rows) {
    const family = prefixOf(row.source_id);
    const items = groups.get(family) ?? [];
    items.push(row);
    groups.set(family, items);
  }
  return groups;
}

function derivedNodesForFamilies(groups: Map<string, SeedRow[]>): GraphNode[] {
  const nodes: GraphNode[] = [];
  for (const [family, rows] of [...groups.entries()].sort(([a], [b]) => a.localeCompare(b))) {
    const hasBhv = rows.some((row) => row.chain_layer.includes('BHV'));
    const hasRsp = rows.some((row) => row.chain_layer.includes('RSP'));
    const scope = SCOPE_BY_PREFIX[family] ?? 'product';
    const responsibility = RESPONSIBILITY_BY_PREFIX[family] ?? 'domain-logic';
    const description = rows[0]?.category ?? family;

    if (hasBhv) {
      nodes.push({
        id: `BHV-${family}-SEED`,
        type: 'BehaviorRule',
        statement: `${description} behavior rules derived from RS-R5 ${family}- family requirements.`,
        scope,
        governance: 'proposed',
        maturity: 'logic-defined',
        delivery: 'not-assessed',
        chain_layer: 'BHV',
        provenance: provenance('RS-R5 itemized dataset', 'docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv', family, 'skill-derived', 0.8),
      });
    }

    if (hasRsp) {
      nodes.push({
        id: `RSP-${family}-SEED`,
        type: 'SystemResponsibility',
        statement: `${description} system responsibility derived from RS-R5 ${family}- family requirements.`,
        scope,
        governance: 'proposed',
        maturity: 'logic-defined',
        delivery: 'not-assessed',
        responsibility_type: responsibility,
        chain_layer: 'RSP',
        provenance: provenance('RS-R5 itemized dataset', 'docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv', family, 'skill-derived', 0.8),
      });
      nodes.push({
        id: `EMC-${family}-SEED`,
        type: 'ExpectedManifestationCategory',
        statement: `${description} expected manifestation category for ${responsibility} responsibility.`,
        scope,
        governance: 'proposed',
        maturity: 'logic-defined',
        delivery: 'not-assessed',
        category: EMC_CATEGORY_BY_RESPONSIBILITY[responsibility],
        chain_layer: 'EMC',
        provenance: provenance('RS-R5 itemized dataset', 'docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv', family, 'skill-derived', 0.75),
      });
    }

    nodes.push({
      id: `AC-${family}-SEED`,
      type: 'AcceptanceOutcome',
      statement: `${description} acceptance outcome placeholder to be matured during RS-R8 evidence binding.`,
      scope,
      governance: 'proposed',
      maturity: 'logic-defined',
      delivery: 'not-assessed',
      chain_layer: 'AC',
      provenance: provenance('RS-R5 itemized dataset', 'docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv', family, 'skill-derived', 0.7),
    });
  }
  return nodes;
}

function recoveryNodes(): GraphNode[] {
  return RECOVERY_REQUIREMENTS.map((item) => ({
    id: item.id,
    type: 'Requirement',
    statement: item.statement,
    scope: item.scope,
    governance: 'proposed',
    maturity: 'logic-defined',
    delivery: 'not-assessed',
    chain_layer: item.chain_layer,
    source_id: item.source_anchor,
    provenance: provenance(
      'requirements-recovery.md',
      'docs/plans/on-hold/frontend-polish-v0.3.5/output/requirements-recovery.md',
      item.source_anchor,
      'agent-proposed',
      0.8,
    ),
  }));
}

function trace(id: string, source: string, target: string, relationship_type: TraceLink['relationship_type'], confidence = 0.8): TraceLink {
  return {
    id,
    type: 'TraceLink',
    source,
    target,
    relationship_type,
    coverage: 'partial',
    confidence,
    inference_source: 'RS-R6 seed migration',
    confirmation_status: 'skill-derived',
    last_checked_date: DATE,
    stale_state: 'current',
    needs_confirmation: true,
  };
}

function traceLinksFor(rows: SeedRow[], groups: Map<string, SeedRow[]>): TraceLink[] {
  const links: TraceLink[] = [];
  for (const row of rows) {
    const family = prefixOf(row.source_id);
    const nodeId = row.suggested_node_id;
    if (!nodeId.startsWith('REQ-')) continue;
    if (row.chain_layer.includes('BHV')) {
      links.push(trace(`TRC-${nodeId}-TO-BHV-${family}`, nodeId, `BHV-${family}-SEED`, 'decomposes-into'));
    }
    if (row.chain_layer.includes('RSP')) {
      const via = row.chain_layer.includes('BHV') ? `BHV-${family}-SEED` : nodeId;
      links.push(trace(`TRC-${via}-TO-RSP-${family}`.replace(/--+/g, '-'), via, `RSP-${family}-SEED`, 'decomposes-into'));
      links.push(trace(`TRC-RSP-${family}-TO-EMC-${family}`, `RSP-${family}-SEED`, `EMC-${family}-SEED`, 'decomposes-into'));
    }
    links.push(trace(`TRC-${nodeId}-TO-AC-${family}`, nodeId, `AC-${family}-SEED`, 'validates', 0.7));
  }

  return dedupeById(links);
}

function selfTraceLinks(): TraceLink[] {
  return SELF_TRACE_MANIFESTATIONS.map((node) => {
    const requirementId = node.id.includes('readme') || node.id.includes('sprints')
      ? 'REQ-GOV-TRACE-001-AGENT'
      : 'REQ-GOV-TRACE-001-DATA';
    return {
    id: `TRC-${requirementId}-TO-${node.id}`,
    type: 'TraceLink',
    source: requirementId,
    target: node.id,
    relationship_type: 'implements',
    coverage: 'complete',
    confidence: 0.95,
    inference_source: 'RS-R6 self-trace',
    confirmation_status: 'confirmed',
    last_checked_date: DATE,
    stale_state: 'current',
    needs_confirmation: false,
  };
  });
}

function dedupeById<T extends { id: string }>(items: T[]): T[] {
  return [...new Map(items.map((item) => [item.id, item])).values()];
}

function ledgerEntries(): LedgerEntry[] {
  const existing = fs
    .readFileSync(path.join(GRAPH, 'ledger/decision-ledger.jsonl'), 'utf8')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => JSON.parse(line) as LedgerEntry)
    .filter((entry) => entry.id === 'LDG-2026-06-29-RS-R0-METHODOLOGY-SIGNOFF');

  const builderDecisionIds = [
    'BLD-FIL-001', 'BLD-CRD-INT-002', 'BLD-OVR-001', 'BLD-EDT-001', 'BLD-VCX-001', 'BLD-FOC-001',
    'BLD-SLC-001', 'BLD-EDT-002', 'BLD-RED-001', 'BLD-CRD-INT-003', 'BLD-CRD-INT-004',
    'BLD-CRD-INT-005', 'BLD-MOT-001', 'BLD-FIL-002', 'BLD-SLC-002', 'BLD-CRD-INT-006', 'TA-001', 'TA-003',
  ];
  const builderEntries = builderDecisionIds.map((id) => ({
    id: `LDG-${id}`,
    type: 'DecisionLedgerEntry' as const,
    event_type: id.startsWith('TA-') ? 'temporary-assumption' : 'product-decision',
    actor: 'PO',
    date: DATE,
    source: 'docs/product/decisions/builder-decisions.md',
    signoff_by: 'PO',
    signoff_text: `Historical builder decision ${id} accepted into requirements graph.`,
    reason: 'Seeded by RS-R6 from RS-R5 decision inventory.',
  }));

  const fpEntries = Array.from({ length: 12 }, (_, index) => {
    const n = String(index + 1).padStart(2, '0');
    return {
      id: `LDG-D-${n}`,
      type: 'DecisionLedgerEntry' as const,
      event_type: 'frontend-polish-decision',
      actor: 'PO',
      date: DATE,
      source: 'docs/plans/on-hold/frontend-polish-v0.3.5/output/decision-register.md',
      signoff_by: 'PO',
      signoff_text: `Historical frontend-polish decision D-${n} accepted into requirements graph.`,
      reason: 'Seeded by RS-R6 from RS-R5 decision-register inventory.',
    };
  });

  const driftEntries: LedgerEntry[] = [
    {
      id: 'LDG-2026-06-29-DMD-001',
      type: 'DecisionLedgerEntry',
      event_type: 'data-model-drift',
      actor: 'Codex',
      date: DATE,
      source: 'src/types/api.ts',
      reason: 'Requirements mention Supabase/activity-log persistence; current code exposes API/domain TypeScript types and mock services, but no database schema in repo.',
    },
    {
      id: 'LDG-2026-06-29-DMD-002',
      type: 'DecisionLedgerEntry',
      event_type: 'data-model-drift',
      actor: 'Codex',
      date: DATE,
      source: 'src/types/domain.ts',
      reason: 'AI/context metadata exists as optional domain/API fields; RS-R7 must verify manifestation coverage before marking AI-ready requirements implemented.',
    },
    {
      id: 'LDG-2026-06-29-DMD-003',
      type: 'DecisionLedgerEntry',
      event_type: 'data-model-drift',
      actor: 'Codex',
      date: DATE,
      source: 'src/types/api.ts',
      reason: 'ApiAssignedMember role is a plain string and does not yet encode the full PR-* permission taxonomy as typed policy.',
    },
    {
      id: RS_R6_LEDGER_ID,
      type: 'DecisionLedgerEntry',
      event_type: 'seed-migration',
      actor: 'Codex',
      date: DATE,
      source: 'docs/plans/active/requirements-system/output/RS-R5-itemized-dataset.csv',
      signoff_by: 'RS-R0b PO signoff + RS-R5 accepted inventory',
      signoff_text: 'Seed initial requirements graph from accepted RS-R5 inventory; RS-R7 owns code manifestation truth.',
      reason: 'RS-R6 migration seed.',
    },
  ];

  return dedupeById([...existing, ...builderEntries, ...fpEntries, ...driftEntries]);
}

function dataModelSummary(): void {
  const files = [
    'api.ts',
    'domain.ts',
    'builder-node.types.ts',
    'card.types.ts',
    'dropzone.types.ts',
    'editor.types.ts',
    'lifecycle.ts',
    'stage.types.ts',
  ];
  const typeFiles = files.map((file) => {
    const filePath = path.join(ROOT, 'src/types', file);
    const text = fs.readFileSync(filePath, 'utf8');
    const exports = [...text.matchAll(/export (?:interface|type|const) ([A-Za-z0-9_]+)/g)].map((match) => match[1]);
    return { path: `src/types/${file}`, exports };
  });
  const summary = {
    generated_at: `${DATE}T00:00:00.000Z`,
    source: 'src/types/',
    files: typeFiles,
    drift_items: ['LDG-2026-06-29-DMD-001', 'LDG-2026-06-29-DMD-002', 'LDG-2026-06-29-DMD-003'],
  };
  writeJsonFile(path.join(GRAPH, 'generated/data-model-summary.json'), summary);
  fs.writeFileSync(
    path.join(GRAPH, 'views/data-model-summary.md'),
    [
      '# Code-True Data Model Summary',
      '',
      ...typeFiles.flatMap((file) => [`## ${file.path}`, '', file.exports.map((name) => `- ${name}`).join('\n'), '']),
      '## Drift Ledger Entries',
      '',
      '- LDG-2026-06-29-DMD-001',
      '- LDG-2026-06-29-DMD-002',
      '- LDG-2026-06-29-DMD-003',
      '',
    ].join('\n'),
  );
}

function cleanGeneratedGraphFiles(): void {
  for (const dir of ['nodes', 'trace-links']) {
    const full = path.join(GRAPH, dir);
    if (!fs.existsSync(full)) continue;
    for (const name of fs.readdirSync(full)) {
      if (name.endsWith('.json')) fs.unlinkSync(path.join(full, name));
    }
  }
}

function main(): void {
  ensureGraphDirs(GRAPH);
  cleanGeneratedGraphFiles();

  const groups = familyGroups(SEED_ROWS);
  const csvNodes = SEED_ROWS.map(nodeFromSeed);
  const nodes = dedupeById([...csvNodes, ...recoveryNodes(), ...GOVERNANCE_REQUIREMENTS, ...derivedNodesForFamilies(groups), ...SELF_TRACE_MANIFESTATIONS]);
  const links = [...traceLinksFor(SEED_ROWS, groups), ...selfTraceLinks()];

  for (const node of nodes) writeNode(GRAPH, node);
  for (const link of links) writeTraceLink(GRAPH, link);
  fs.writeFileSync(path.join(GRAPH, 'ledger/decision-ledger.jsonl'), `${ledgerEntries().map((entry) => JSON.stringify(entry)).join('\n')}\n`);
  dataModelSummary();

  const graph = loadGraph(GRAPH);
  const result = validateGraphData(graph);
  console.log(JSON.stringify({
    pass: result.pass,
    nodes: graph.nodes.length,
    traceLinks: graph.traceLinks.length,
    ledger: graph.ledger.length,
    errors: result.errors,
    warnings: result.warnings,
  }, null, 2));
  if (!result.pass) process.exit(1);
}

main();
