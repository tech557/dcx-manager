import * as path from 'node:path';
import type { GraphData, GraphNode, TraceLink, CoverageValue, DeliveryState, Scope } from './schema.ts';
import { GRAPH_ROOT, loadGraph, writeNode, writeTraceLink, appendLedger, ensureGraphDirs } from './store.ts';
import { validateGraphData } from './validators.ts';
import { getQueueReport } from './queues.ts';

export interface VerificationState {
  requirementId: string;
  implemented: boolean;
  implementedCoverage: CoverageValue | 'not-assessed';
  verified: boolean;
  verifiedState: 'verified' | 'partially-verified' | 'unverified' | 'stale' | 'invalidated' | 'not-assessed';
  acceptanceOutcomes: AcceptanceOutcomeVerification[];
}

export interface AcceptanceOutcomeVerification {
  acceptanceOutcomeId: string;
  statement: string;
  evidenceCount: number;
  hasVerifiedEvidence: boolean;
  stalestValidity: string;
  lastEvidenceDate: string | null;
}

export interface VerificationReport {
  requirements: VerificationState[];
  implementedButUnverified: string[];
  verificationStale: string[];
  verificationInvalidated: string[];
  partiallyVerified: string[];
  unverified: string[];
  acceptanceOutcomesWithoutEvidence: string[];
  evidenceByAcceptanceOutcome: Record<string, string[]>;
}

export function getEvidenceForAcceptanceOutcome(acId: string, graph?: GraphData): GraphNode[] {
  const data = graph ?? loadGraph();
  return data.nodes.filter((n) => n.type === 'Evidence' && n.acceptance_outcome === acId);
}

export function hasVerifiedEvidenceForAcceptanceOutcome(acId: string, graph?: GraphData): boolean {
  const evidenceNodes = getEvidenceForAcceptanceOutcome(acId, graph);
  return evidenceNodes.some((e) => e.delivery === 'verified');
}

export function isVerified(requirementId: string, graph?: GraphData): boolean {
  const data = graph ?? loadGraph();
  const req = data.nodes.find((n) => n.id === requirementId);
  if (!req || !req.acceptance_outcomes || req.acceptance_outcomes.length === 0) {
    return false;
  }
  return req.acceptance_outcomes.every((acId) => hasVerifiedEvidenceForAcceptanceOutcome(acId, data));
}

export function isImplemented(requirementId: string, graph?: GraphData): boolean {
  const data = graph ?? loadGraph();
  const req = data.nodes.find((n) => n.id === requirementId);
  if (!req || !req.expected_manifestation_categories || req.expected_manifestation_categories.length === 0) {
    return false;
  }
  const links = data.traceLinks.filter((link) =>
    link.source === requirementId,
  );
  const coveredTargets = links
    .filter((l) => (l.coverage === 'complete' || l.coverage === 'exempt') && l.relationship_type === 'implements')
    .map((l) => l.target);
  return req.expected_manifestation_categories.every((cat) => coveredTargets.includes(cat));
}

export function computeAcceptanceOutcomeVerification(
  acId: string,
  graph?: GraphData,
): AcceptanceOutcomeVerification {
  const data = graph ?? loadGraph();
  const ac = data.nodes.find((n) => n.id === acId);
  const evidenceNodes = getEvidenceForAcceptanceOutcome(acId, data);
  const stalest = evidenceNodes.reduce((worst, e) => {
    const v = e.validity ?? 'current';
    if (v === 'invalidated') return 'invalidated';
    if (v === 'stale') return 'stale';
    if (v === 'recheck-required' && worst !== 'invalidated' && worst !== 'stale') return 'recheck-required';
    return worst;
  }, 'current');
  const dates = evidenceNodes.map((e) => e.provenance?.last_checked_date).filter(Boolean) as string[];
  dates.sort();
  return {
    acceptanceOutcomeId: acId,
    statement: ac?.statement ?? '',
    evidenceCount: evidenceNodes.length,
    hasVerifiedEvidence: evidenceNodes.some((e) => e.delivery === 'verified'),
    stalestValidity: stalest,
    lastEvidenceDate: dates.length > 0 ? dates[dates.length - 1] : null,
  };
}

export function computeVerificationState(requirementId: string, graph?: GraphData): VerificationState {
  const data = graph ?? loadGraph();
  const req = data.nodes.find((n) => n.id === requirementId);
  if (!req) {
    return {
      requirementId,
      implemented: false,
      implementedCoverage: 'not-assessed',
      verified: false,
      verifiedState: 'not-assessed',
      acceptanceOutcomes: [],
    };
  }
  const impl = isImplemented(requirementId, data);
  const acOutcomes = (req.acceptance_outcomes ?? []).map((acId) =>
    computeAcceptanceOutcomeVerification(acId, data),
  );
  const verified = acOutcomes.length > 0 && acOutcomes.every((ac) => ac.hasVerifiedEvidence);
  const partiallyVerified = acOutcomes.length > 0 && acOutcomes.some((ac) => ac.hasVerifiedEvidence) && !verified;
  const hasStale = acOutcomes.some((ac) => ac.stalestValidity === 'stale');
  const hasInvalidated = acOutcomes.some((ac) => ac.stalestValidity === 'invalidated');
  let verifiedState: VerificationState['verifiedState'] = 'not-assessed';
  if (hasInvalidated) verifiedState = 'invalidated';
  else if (hasStale) verifiedState = 'stale';
  else if (verified) verifiedState = 'verified';
  else if (partiallyVerified) verifiedState = 'partially-verified';
  else if (acOutcomes.length > 0) verifiedState = 'unverified';
  return {
    requirementId,
    implemented: impl,
    implementedCoverage: impl ? 'complete' : 'missing',
    verified,
    verifiedState,
    acceptanceOutcomes: acOutcomes,
  };
}

export function getVerificationReport(graph?: GraphData): VerificationReport {
  const data = graph ?? loadGraph();
  const requirements = data.nodes.filter((n) => n.type === 'Requirement' || n.type === 'Intent');
  const states: VerificationState[] = requirements.map((r) => computeVerificationState(r.id, data));
  const evidenceNodes = data.nodes.filter((n) => n.type === 'Evidence');
  const evidenceByAcceptanceOutcome: Record<string, string[]> = {};
  for (const ev of evidenceNodes) {
    const acId = ev.acceptance_outcome ?? 'unlinked';
    if (!evidenceByAcceptanceOutcome[acId]) evidenceByAcceptanceOutcome[acId] = [];
    evidenceByAcceptanceOutcome[acId].push(ev.id);
  }
  return {
    requirements: states,
    implementedButUnverified: states.filter((s) => s.implemented && !s.verified).map((s) => s.requirementId),
    verificationStale: states.filter((s) => s.verifiedState === 'stale').map((s) => s.requirementId),
    verificationInvalidated: states.filter((s) => s.verifiedState === 'invalidated').map((s) => s.requirementId),
    partiallyVerified: states.filter((s) => s.verifiedState === 'partially-verified').map((s) => s.requirementId),
    unverified: states.filter((s) => s.verifiedState === 'unverified').map((s) => s.requirementId),
    acceptanceOutcomesWithoutEvidence: data.nodes
      .filter((n) => n.type === 'AcceptanceOutcome')
      .filter((ac) => (evidenceByAcceptanceOutcome[ac.id] ?? []).length === 0)
      .map((ac) => ac.id),
    evidenceByAcceptanceOutcome,
  };
}

function findVerifiesLinksForManifestation(
  manifestationId: string,
  data: GraphData,
): TraceLink[] {
  return data.traceLinks.filter(
    (link) =>
      (link.source === manifestationId || link.target === manifestationId) &&
      link.relationship_type === 'verifies',
  );
}

function findEvidenceForManifestation(
  manifestationId: string,
  data: GraphData,
): GraphNode[] {
  const verifiesLinks = findVerifiesLinksForManifestation(manifestationId, data);
  const acIds = new Set(
    verifiesLinks.map((l) => (l.source !== manifestationId ? l.source : l.target)),
  );
  const evidenceNodes: GraphNode[] = [];
  for (const acId of acIds) {
    evidenceNodes.push(...data.nodes.filter(
      (n) => n.type === 'Evidence' && n.acceptance_outcome === acId,
    ));
  }
  return evidenceNodes;
}

export function checkStalenessForManifestation(
  manifestationId: string,
  graph?: GraphData,
): {
  stale: boolean;
  affectedAcceptanceOutcomes: string[];
  affectedEvidence: string[];
  affectedTraceLinks: string[];
} {
  const data = graph ?? loadGraph();
  const verifiesLinks = findVerifiesLinksForManifestation(manifestationId, data);
  const acIds = [...new Set(
    verifiesLinks.map((l) => (l.source !== manifestationId ? l.source : l.target)),
  )];
  const evidenceNodes = data.nodes.filter(
    (n) => n.type === 'Evidence' && acIds.includes(n.acceptance_outcome ?? ''),
  );
  return {
    stale: acIds.length > 0,
    affectedAcceptanceOutcomes: acIds,
    affectedEvidence: evidenceNodes.map((e) => e.id),
    affectedTraceLinks: verifiesLinks.map((l) => l.id),
  };
}

export function markVerificationStaleByManifestation(
  manifestationId: string,
  graph?: GraphData,
  rootOverride?: string,
): string[] {
  const data = graph ?? loadGraph();
  const staleInfo = checkStalenessForManifestation(manifestationId, data);
  const updated: string[] = [];
  const root = rootOverride ?? GRAPH_ROOT;
  for (const linkId of staleInfo.affectedTraceLinks) {
    const link = data.traceLinks.find((l) => l.id === linkId);
    if (link && link.stale_state !== 'stale') {
      const updatedLink: TraceLink = { ...link, stale_state: 'stale', last_checked_date: new Date().toISOString().split('T')[0] };
      writeTraceLink(root, updatedLink);
      updated.push(linkId);
    }
  }
  for (const evId of staleInfo.affectedEvidence) {
    const ev = data.nodes.find((n) => n.id === evId);
    if (ev && ev.validity !== 'stale') {
      const updatedEv: GraphNode = { ...ev, validity: 'stale' };
      writeNode(root, updatedEv);
      updated.push(evId);
    }
  }
  if (updated.length > 0) {
    appendLedger(root, {
      id: `LDG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
      type: 'DecisionLedgerEntry',
      event_type: 'verification-stale-manifestation',
      actor: 'verification-engine',
      date: new Date().toISOString(),
      source: 'verification.ts',
      reason: `Manifestation ${manifestationId} changed — marking ${staleInfo.affectedTraceLinks.length} trace links and ${staleInfo.affectedEvidence.length} evidence nodes stale`,
      affected_links: staleInfo.affectedTraceLinks,
    });
  }
  return updated;
}

export function bindEvidence(
  acceptanceOutcomeId: string,
  options: {
    statement: string;
    source: string;
    source_path?: string;
    authoring_actor: string;
    delivery?: DeliveryState;
    validity?: 'current' | 'stale' | 'invalidated' | 'recheck-required';
    evidence_refs?: string[];
    id?: string;
    scope?: Scope;
  },
  graph?: GraphData,
  rootOverride?: string,
): GraphNode {
  const data = graph ?? loadGraph();
  const ac = data.nodes.find((n) => n.id === acceptanceOutcomeId);
  if (!ac) {
    throw new Error(`AcceptanceOutcome ${acceptanceOutcomeId} not found in graph`);
  }
  const acSlug = acceptanceOutcomeId.replace(/[^a-zA-Z0-9-]/g, '-').toLowerCase();
  const evId = options.id ?? `EVD-${acSlug}-${Date.now()}`;
  const evidenceNode: GraphNode = {
    id: evId,
    type: 'Evidence',
    acceptance_outcome: acceptanceOutcomeId,
    statement: options.statement,
    governance: 'approved',
    maturity: 'logic-defined',
    scope: options.scope,
    delivery: options.delivery ?? 'verified',
    validity: options.validity ?? 'current',
    evidence_refs: options.evidence_refs ?? [],
    provenance: {
      source: options.source,
      source_path: options.source_path ?? '',
      authoring_actor: options.authoring_actor,
      confidence: 0.9,
      confirmation_status: 'confirmed',
      last_checked_date: new Date().toISOString().split('T')[0],
    },
  };
  const root = rootOverride ?? GRAPH_ROOT;
  writeNode(root, evidenceNode);
  appendLedger(root, {
    id: `LDG-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
    type: 'DecisionLedgerEntry',
    event_type: 'evidence-binding',
    actor: options.authoring_actor,
    date: new Date().toISOString(),
    source: 'verification.ts',
    reason: `Evidence ${evId} bound to AcceptanceOutcome ${acceptanceOutcomeId}`,
  });
  return evidenceNode;
}

export function runVerificationCheck(graph?: GraphData): {
  pass: boolean;
  report: VerificationReport;
  issues: string[];
} {
  const data = graph ?? loadGraph();
  const report = getVerificationReport(data);
  const issues: string[] = [];
  for (const reqId of report.implementedButUnverified) {
    const req = data.nodes.find((n) => n.id === reqId);
    issues.push(`Requirement "${req?.statement?.slice(0, 60) ?? reqId}" is implemented but unverified`);
  }
  for (const reqId of report.verificationStale) {
    const req = data.nodes.find((n) => n.id === reqId);
    issues.push(`Requirement "${req?.statement?.slice(0, 60) ?? reqId}" has stale verification`);
  }
  for (const reqId of report.verificationInvalidated) {
    const req = data.nodes.find((n) => n.id === reqId);
    issues.push(`Requirement "${req?.statement?.slice(0, 60) ?? reqId}" has invalidated verification`);
  }
  return {
    pass: report.verificationStale.length === 0 && report.verificationInvalidated.length === 0,
    report,
    issues,
  };
}

if (import.meta.url === `file://${process.argv[1]}`) {
  const report = getVerificationReport();
  console.log(JSON.stringify(report, null, 2));
}
