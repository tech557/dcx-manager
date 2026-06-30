import type { GraphData, GraphNode, TraceLink } from './schema.ts';

export interface QueueReport {
  needsClassification: string[];
  needsDecomposition: string[];
  missingManifestations: string[];
  partiallyImplemented: string[];
  implementedUnverified: string[];
  manifestationsLackingRequirements: string[];
  candidateLinksAwaitingConfirmation: string[];
  staleBrokenTraces: string[];
  supersededStillInCode: string[];
  testsDisconnected: string[];
  verificationStale: string[];
  exemptionsAwaitingReview: string[];
}

function hasItems(value: unknown): value is string[] {
  return Array.isArray(value) && value.length > 0;
}

function incomingLinks(id: string, links: TraceLink[]): TraceLink[] {
  return links.filter((link) => link.target === id);
}

function outgoingLinks(id: string, links: TraceLink[]): TraceLink[] {
  return links.filter((link) => link.source === id);
}

function isRequirement(node: GraphNode): boolean {
  return node.type === 'Requirement';
}

function hasVerifiedEvidence(node: GraphNode, data: GraphData): boolean {
  if (!hasItems(node.acceptance_outcomes)) return false;
  const evidenceNodes = data.nodes.filter((candidate) => candidate.type === 'Evidence');
  return node.acceptance_outcomes.every((outcome) =>
    evidenceNodes.some(
      (evidence) =>
        evidence.acceptance_outcome === outcome &&
        evidence.delivery === 'verified' &&
        evidence.validity !== 'stale' &&
        evidence.validity !== 'invalidated',
    ),
  );
}

export function getQueueReport(data: GraphData): QueueReport {
  const report: QueueReport = {
    needsClassification: [],
    needsDecomposition: [],
    missingManifestations: [],
    partiallyImplemented: [],
    implementedUnverified: [],
    manifestationsLackingRequirements: [],
    candidateLinksAwaitingConfirmation: [],
    staleBrokenTraces: [],
    supersededStillInCode: [],
    testsDisconnected: [],
    verificationStale: [],
    exemptionsAwaitingReview: [],
  };

  for (const node of data.nodes) {
    if (isRequirement(node) && !node.scope) report.needsClassification.push(node.id);
    if (
      isRequirement(node) &&
      (node.governance === 'approved' || node.governance === 'locked') &&
      (!hasItems(node.responsibilities) || !hasItems(node.expected_manifestation_categories))
    ) {
      report.needsDecomposition.push(node.id);
    }
    if (isRequirement(node) && hasItems(node.expected_manifestation_categories)) {
      const links = data.traceLinks.filter((link) => node.expected_manifestation_categories?.includes(link.source));
      for (const category of node.expected_manifestation_categories) {
        const categoryLinks = links.filter((link) => link.source === category);
        if (!categoryLinks.some((link) => link.coverage === 'complete' || link.coverage === 'exempt')) {
          report.missingManifestations.push(`${node.id}:${category}`);
        }
        if (categoryLinks.some((link) => link.coverage === 'partial')) report.partiallyImplemented.push(node.id);
      }
    }
    if (isRequirement(node) && node.delivery === 'implemented' && !hasVerifiedEvidence(node, data)) {
      report.implementedUnverified.push(node.id);
    }
    if (node.type === 'Manifestation') {
      const links = incomingLinks(node.id, data.traceLinks);
      const hasJustification = links.some((link) =>
        ['implements', 'partially-implements', 'supports', 'verifies', 'exempt-from-trace'].includes(link.relationship_type),
      );
      if (!hasJustification) report.manifestationsLackingRequirements.push(node.id);
      if (node.kind === 'test' && !links.some((link) => link.relationship_type === 'verifies')) {
        report.testsDisconnected.push(node.id);
      }
    }
    if (node.governance === 'superseded') {
      const liveLinks = outgoingLinks(node.id, data.traceLinks).filter((link) => ['implements', 'partially-implements'].includes(link.relationship_type));
      if (liveLinks.length > 0) report.supersededStillInCode.push(node.id);
    }
    if (node.type === 'Evidence' && (node.delivery === 'blocked' || node.validity === 'stale' || node.validity === 'invalidated' || node.validity === 'recheck-required')) {
      report.verificationStale.push(node.id);
    }
    if (node.type === 'Exemption' && node.review_status !== 'reviewed' && node.review_status !== 'approved') {
      report.exemptionsAwaitingReview.push(node.id);
    }
  }

  for (const link of data.traceLinks) {
    if (link.needs_confirmation || link.confidence < 0.8) report.candidateLinksAwaitingConfirmation.push(link.id);
    if (link.coverage === 'stale' || link.coverage === 'invalidated' || link.stale_state === 'stale' || link.stale_state === 'broken') {
      report.staleBrokenTraces.push(link.id);
    }
  }

  return report;
}
