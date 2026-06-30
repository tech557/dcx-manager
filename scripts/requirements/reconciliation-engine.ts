import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';
import type { GraphData, GraphNode, TraceLink, ManifestationKind, CoverageValue, RelationshipType } from './schema.ts';
import { GRAPH_ROOT, loadGraph, writeTraceLink, appendLedger, ensureGraphDirs } from './store.ts';
import { getQueueReport } from './queues.ts';
import type { QueueReport } from './queues.ts';
import { markVerificationStaleByManifestation } from './verification.ts';

const REPO_ROOT = path.resolve(import.meta.dirname, '../..');
const CODE_INDEX_DIR = path.join(REPO_ROOT, 'code-index');

let cachedCodeIndex: CodeIndex | null = null;

interface CodeIndex {
  components: Record<string, ComponentEntry>;
  componentUsages: ComponentUsageEntry[];
  textLabels: TextLabelEntry[];
  unresolved: { unresolvedImports: unknown[]; unresolvedComponents: unknown[] };
}

interface ComponentEntry {
  definedIn?: string;
  props?: { name: string; required?: boolean }[];
  childComponentsUsed?: string[];
  exports?: string[];
}

interface ComponentUsageEntry {
  component: string;
  usedIn: string;
  line?: number;
}

interface TextLabelEntry {
  text: string;
  type: string;
  file: string;
  line: number;
}

export interface ManifestationCandidate {
  id: string;
  kind: ManifestationKind;
  current_paths: string[];
  name: string;
  lifecycle: 'created' | 'modified' | 'renamed' | 'moved' | 'deleted' | 'replaced' | 'deprecated';
}

export interface CandidateLink {
  manifestationId: string;
  targetId: string;
  relationship_type: RelationshipType;
  confidence: number;
  evidence: string;
  reason: string;
  needs_confirmation: boolean;
  is_technical: boolean;
}

export interface InventoryResult {
  manifestations: ManifestationCandidate[];
  existingLookup: Map<string, GraphNode>;
  newCount: number;
}

export interface DetectorResult {
  manifestationsLackingRequirements: string[];
  requirementsLackingManifestations: string[];
  partialImplementation: { requirementId: string; missingCategories: string[] }[];
  staleBrokenTraces: string[];
  supersededStillInCode: string[];
  testsDisconnected: string[];
  supersededRequirementsStillManifested: string[];
}

export interface ReconciliationReport {
  mode: 'inventory' | 'changed';
  inventory: ManifestationCandidate[];
  candidateLinks: CandidateLink[];
  autoApplied: CandidateLink[];
  queuedCandidates: CandidateLink[];
  detectors: DetectorResult;
  queues: QueueReport;
  sourceManifest: { included: string[]; excluded: string[]; count: number };
}

function loadCodeIndex(): CodeIndex {
  if (cachedCodeIndex) return cachedCodeIndex;
  const loadJson = <T>(fname: string): T => {
    const fp = path.join(CODE_INDEX_DIR, fname);
    if (!fs.existsSync(fp)) return (fname === 'components.json' ? {} : []) as T;
    return JSON.parse(fs.readFileSync(fp, 'utf8')) as T;
  };
  cachedCodeIndex = {
    components: loadJson<Record<string, ComponentEntry>>('components.json'),
    componentUsages: loadJson<ComponentUsageEntry[]>('component-usages.json'),
    textLabels: loadJson<TextLabelEntry[]>('text-labels.json'),
    unresolved: loadJson<{ unresolvedImports: unknown[]; unresolvedComponents: unknown[] }>('unresolved.json'),
  };
  return cachedCodeIndex;
}

function scanSourceFiles(): string[] {
  const srcDir = path.join(REPO_ROOT, 'src');
  const files: string[] = [];
  function walk(dir: string) {
    for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
      const full = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (entry.name !== 'node_modules' && entry.name !== '__tests__') walk(full);
      } else if (entry.isFile() && /\.(ts|tsx)$/.test(entry.name)) {
        files.push(path.relative(REPO_ROOT, full));
      }
    }
  }
  walk(srcDir);
  return files;
}

export function createManifestationId(kind: ManifestationKind, owner: string, slug: string): string {
  const cleanSlug = slug.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '').toLowerCase();
  const cleanOwner = owner.replace(/[^a-zA-Z0-9-]/g, '-').replace(/-+/g, '-').toLowerCase();
  return `MAN-${kind}-${cleanOwner}-${cleanSlug}`;
}

function inferKindFromPath(filePath: string): ManifestationKind {
  const basename = path.basename(filePath);
  if (basename.startsWith('use') && /[A-Z]/.test(basename[3] ?? '')) return 'hook';
  if (basename.endsWith('.test.ts') || basename.endsWith('.test.tsx') || basename.endsWith('.spec.ts')) return 'test';
  if (filePath.includes('/types/') || filePath.includes('/schema')) return 'type';
  if (filePath.includes('/store/') || filePath.endsWith('.store.ts')) return 'store-action';
  if (filePath.includes('/services/')) return 'service';
  if (basename.endsWith('.tsx') || filePath.includes('/components/')) return 'react-component';
  return 'function';
}

function inferComponentName(comp: string): string {
  return comp.replace(/^(Dcx|Builder|Base)/, '').replace(/(Card|Popup|Modal|Panel|Island|Button|Input)$/, '').replace(/([a-z])([A-Z])/g, '$1 $2').trim();
}

export function runInventory(graph?: GraphData): InventoryResult {
  const data = graph ?? loadGraph();
  const existingManifestations = data.nodes.filter((n) => n.type === 'Manifestation');
  const existingLookup = new Map(existingManifestations.map((n) => [n.id, n]));
  const codeIndex = loadCodeIndex();
  const srcFiles = scanSourceFiles();
  const seen = new Set<string>();
  const manifestations: ManifestationCandidate[] = [];

  for (const [name, entry] of Object.entries(codeIndex.components)) {
    const filePath = entry.definedIn ?? '';
    const kind = filePath.endsWith('.tsx') ? 'react-component' as ManifestationKind : 'function' as ManifestationKind;
    const owner = path.basename(filePath, path.extname(filePath)).replace(/\.(ts|tsx)$/, '');
    const id = createManifestationId(kind, owner, name);
    if (seen.has(id)) continue;
    seen.add(id);
    manifestations.push({
      id,
      kind,
      current_paths: filePath ? [filePath] : [],
      name,
      lifecycle: 'created',
    });
  }

  for (const filePath of srcFiles) {
    const basename = path.basename(filePath, path.extname(filePath)).replace(/\.(ts|tsx)$/, '');
    const kind = inferKindFromPath(filePath);
    const ownerDir = path.dirname(filePath).replace(/\//g, '-');
    const id = createManifestationId(kind, ownerDir, basename);
    if (seen.has(id)) continue;
    seen.add(id);
    manifestations.push({
      id,
      kind,
      current_paths: [filePath],
      name: basename,
      lifecycle: 'created',
    });
  }

  const existingIds = new Set(existingManifestations.map((m) => m.id));
  const newCount = manifestations.filter((m) => !existingIds.has(m.id)).length;

  return { manifestations, existingLookup, newCount };
}

export function runDetectors(data: GraphData, manifestations: ManifestationCandidate[]): DetectorResult {
  const manifestIds = new Set(manifestations.map((m) => m.id));
  const requirementIds = new Set(data.nodes.filter((n) => n.type === 'Requirement').map((n) => n.id));
  const exemptionIds = new Set(data.nodes.filter((n) => n.type === 'Exemption').map((n) => n.id));

  const manifestationsLackingRequirements: string[] = [];
  const requirementsLackingManifestations: string[] = [];
  const partialImplementation: { requirementId: string; missingCategories: string[] }[] = [];
  const staleBrokenTraces: string[] = [];
  const supersededStillInCode: string[] = [];
  const testsDisconnected: string[] = [];
  const supersededRequirementsStillManifested: string[] = [];

  for (const m of manifestations) {
    const links = data.traceLinks.filter(
      (link) => link.source === m.id || link.target === m.id,
    );
    const hasJustification = links.some((link) =>
      ['implements', 'partially-implements', 'supports', 'verifies', 'exempt-from-trace'].includes(link.relationship_type),
    );
    if (!hasJustification) {
      manifestationsLackingRequirements.push(m.id);
    }
  }

  for (const reqId of requirementIds) {
    const links = data.traceLinks.filter((link) => link.source === reqId || link.target === reqId);
    const manifestLinks = links.filter((link) =>
      ['implements', 'partially-implements', 'supports'].includes(link.relationship_type) &&
      manifestIds.has(link.source === reqId ? link.target : link.source),
    );
    if (manifestLinks.length === 0) {
      requirementsLackingManifestations.push(reqId);
    }
    const req = data.nodes.find((n) => n.id === reqId);
    if (req?.expected_manifestation_categories) {
      const covered = new Set(
        data.traceLinks
          .filter((link) => link.source === reqId && link.coverage === 'complete')
          .map((link) => link.target),
      );
      const missing = req.expected_manifestation_categories.filter((cat) => !covered.has(cat));
      if (missing.length > 0) {
        partialImplementation.push({ requirementId: reqId, missingCategories: missing });
      }
    }
  }

  for (const link of data.traceLinks) {
    if (link.stale_state === 'stale' || link.stale_state === 'broken' || link.coverage === 'stale') {
      staleBrokenTraces.push(link.id);
    }
  }

  const supersededNodes = data.nodes.filter((n) => n.governance === 'superseded');
  for (const node of supersededNodes) {
    const outgoing = data.traceLinks.filter((link) => link.source === node.id);
    const hasLiveManifestation = outgoing.some((link) =>
      ['implements', 'partially-implements'].includes(link.relationship_type) &&
      manifestIds.has(link.target),
    );
    if (hasLiveManifestation) {
      supersededStillInCode.push(node.id);
    }
  }

  for (const m of manifestations) {
    if (m.kind === 'test') {
      const links = data.traceLinks.filter(
        (link) => link.source === m.id || link.target === m.id,
      );
      const verifiesAccepted = links.some((link) => link.relationship_type === 'verifies');
      if (!verifiesAccepted) {
        testsDisconnected.push(m.id);
      }
    }
  }

  for (const node of supersededNodes) {
    const outgoing = data.traceLinks.filter((link) => link.source === node.id);
    const hasLive = outgoing.some((link) =>
      ['implements', 'partially-implements'].includes(link.relationship_type) &&
      manifestIds.has(link.target),
    );
    if (hasLive && requirementIds.has(node.id)) {
      supersededRequirementsStillManifested.push(node.id);
    }
  }

  return {
    manifestationsLackingRequirements,
    requirementsLackingManifestations,
    partialImplementation,
    staleBrokenTraces,
    supersededStillInCode,
    testsDisconnected,
    supersededRequirementsStillManifested,
  };
}

function tokenize(value: string): string[] {
  return value
    .toLowerCase()
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .split(/-|_|\s+/)
    .map((t) => t.replace(/[^a-z0-9]/g, ''))
    .filter(Boolean);
}

function similarity(a: string, b: string): number {
  const aTokens = tokenize(a);
  const bTokens = tokenize(b);
  const aStr = aTokens.join('');
  const bStr = bTokens.join('');
  if (aStr === bStr) return 1.0;
  if (aStr.includes(bStr) || bStr.includes(aStr)) return 0.85;
  const aSet = new Set(aTokens);
  const bSet = new Set(bTokens);
  if (aSet.size === 0 || bSet.size === 0) return 0;
  const intersection = new Set([...aSet].filter((w) => bSet.has(w)));
  const maxSize = Math.max(aSet.size, bSet.size);
  return intersection.size / maxSize;
}

export function inferCandidateLinks(
  manifestations: ManifestationCandidate[],
  data: GraphData,
  codeIndex?: CodeIndex,
): CandidateLink[] {
  const ci = codeIndex ?? loadCodeIndex();
  const candidates: CandidateLink[] = [];
  const requirementNodes = data.nodes.filter(
    (n) => n.type === 'Requirement' || n.type === 'SystemResponsibility' || n.type === 'Intent',
  );

  for (const manifest of manifestations) {
    const cleanManifest = manifest.name;
    const manifestLower = cleanManifest.toLowerCase();

    for (const req of requirementNodes) {
      const reqText = [req.statement ?? '', req.id, ...(req.aliases ?? [])].join(' ').toLowerCase();
      const score = similarity(cleanManifest, reqText);
      if (score >= 0.3) {
        const existingLink = data.traceLinks.find(
          (link) =>
            (link.source === manifest.id && link.target === req.id) ||
            (link.source === req.id && link.target === manifest.id),
        );
        if (existingLink) continue;

        const isTechnical = req.type === 'SystemResponsibility';
        const needsConfirmation = score < 0.8 || !isTechnical;
        candidates.push({
          manifestationId: manifest.id,
          targetId: req.id,
          relationship_type: 'implements',
          confidence: Math.round(score * 100) / 100,
          evidence: `Name/code similarity: "${manifest.name}" matches "${req.statement ?? req.id}" (score: ${score.toFixed(2)})`,
          reason: `Automatically inferred from naming similarity (confidence threshold: ${score >= 0.8 ? 'high' : 'medium'})`,
          needs_confirmation: needsConfirmation,
          is_technical: isTechnical,
        });
      }
    }

    if (manifest.kind === 'test') {
      for (const usage of ci.componentUsages) {
        const usageLower = usage.component.toLowerCase();
        if (usageLower.includes('test') || usageLower.includes('spec')) continue;
        if (manifestLower.includes(usageLower.replace(/[^a-z0-9]/g, ''))) {
          const target = data.traceLinks.find(
            (link) =>
              link.source.includes(usage.component) ||
              link.target.includes(usage.component),
          );
          if (target) {
            candidates.push({
              manifestationId: manifest.id,
              targetId: target.source,
              relationship_type: 'verifies',
              confidence: 0.5,
              evidence: `Test file "${manifest.name}" references usage of "${usage.component}"`,
              reason: 'Test file naming suggests verification of related component',
              needs_confirmation: true,
              is_technical: false,
            });
          }
        }
      }
    }
  }

  return candidates;
}

export function classifyCandidates(
  candidates: CandidateLink[],
  existingData: GraphData,
): { autoApply: CandidateLink[]; queue: CandidateLink[] } {
  const autoApply: CandidateLink[] = [];
  const queue: CandidateLink[] = [];
  const existingManifestationIds = new Set(
    existingData.nodes
      .filter((node) => node.type === 'Manifestation')
      .map((node) => node.id),
  );

  for (const candidate of candidates) {
    if (
      candidate.confidence >= 0.8 &&
      candidate.is_technical &&
      !candidate.needs_confirmation &&
      existingManifestationIds.has(candidate.manifestationId)
    ) {
      autoApply.push(candidate);
    } else {
      queue.push(candidate);
    }
  }

  return { autoApply, queue };
}

function generateSourceManifest(files: string[]): ReconciliationReport['sourceManifest'] {
  return {
    included: files.slice(0, 50),
    excluded: [],
    count: files.length,
  };
}

export function reconcile(mode: 'inventory' | 'changed', changedFiles?: string[]): ReconciliationReport {
  const data = loadGraph();
  const codeIndex = loadCodeIndex();
  ensureGraphDirs(GRAPH_ROOT);

  let manifestations: ManifestationCandidate[];
  if (mode === 'inventory') {
    const inventory = runInventory(data);
    manifestations = inventory.manifestations;
  } else {
    manifestations = (changedFiles ?? []).map((fp) => {
      const basename = path.basename(fp, path.extname(fp)).replace(/\.(ts|tsx)$/, '');
      const kind = inferKindFromPath(fp);
      const ownerDir = path.dirname(fp).replace(/\//g, '-');
      return {
        id: createManifestationId(kind, ownerDir, basename),
        kind,
        current_paths: [fp],
        name: basename,
        lifecycle: 'modified',
      };
    });
  }

  const detectorResults = runDetectors(data, manifestations);
  const candidateLinks = inferCandidateLinks(manifestations, data, codeIndex);
  const { autoApply, queue } = classifyCandidates(candidateLinks, data);

  for (const candidate of autoApply) {
    const linkId = `TRC-${candidate.manifestationId}-${candidate.targetId}-${Date.now()}`;
    const traceLink: TraceLink = {
      id: linkId,
      type: 'TraceLink',
      source: candidate.manifestationId,
      target: candidate.targetId,
      relationship_type: candidate.relationship_type,
      coverage: 'complete',
      confidence: candidate.confidence,
      evidence_refs: [candidate.evidence],
      inference_source: 'reconciliation-engine',
      confirmation_status: 'skill-derived',
      last_checked_date: new Date().toISOString().split('T')[0],
      stale_state: 'current',
      needs_confirmation: false,
    };
    writeTraceLink(GRAPH_ROOT, traceLink);

    appendLedger(GRAPH_ROOT, {
      id: `LDG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'DecisionLedgerEntry',
      event_type: 'auto-trace-link',
      actor: 'reconciliation-engine',
      date: new Date().toISOString(),
      source: 'reconciliation-engine',
      reason: `Auto-applied high-confidence technical trace link (confidence: ${candidate.confidence})`,
      affected_links: [linkId],
    });
  }

  return {
    mode,
    inventory: manifestations,
    candidateLinks,
    autoApplied: autoApply,
    queuedCandidates: queue,
    detectors: detectorResults,
    queues: getQueueReport(data),
    sourceManifest: generateSourceManifest(manifestations.map((m) => m.current_paths).flat()),
  };
}

export function checkCompletion(changedPaths: string[]): ReconciliationReport & { gatePass: boolean; issues: string[] } {
  const report = reconcile('changed', changedPaths);
  const issues: string[] = [];
  const ungroundedManifestations = new Set(report.detectors.manifestationsLackingRequirements);

  for (const mid of report.detectors.manifestationsLackingRequirements) {
    const manifest = report.inventory.find((m) => m.id === mid);
    if (manifest) {
      issues.push(`Manifestation "${manifest.name}" (${mid}) has no linked requirement or exemption`);
    }
  }

  for (const m of report.queuedCandidates) {
    if (ungroundedManifestations.has(m.manifestationId)) {
      issues.push(`Candidate link for "${m.manifestationId}" → "${m.targetId}" requires confirmation (confidence: ${m.confidence})`);
    }
  }

  for (const manifest of report.inventory) {
    const staleInfo = markVerificationStaleByManifestation(manifest.id);
    if (staleInfo.length > 0) {
      issues.push(`Manifestation "${manifest.name}" (${manifest.id}) changed — ${staleInfo.length} verification records marked stale`);
    }
  }

  const gatePass = issues.length === 0;
  return { ...report, gatePass, issues };
}
