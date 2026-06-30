import {
  CANONICAL_EXPECTED_CATEGORIES,
  CONFIRMATION_STATUSES,
  COVERAGE_VALUES,
  DELIVERY_STATES,
  EXEMPTION_CATEGORIES,
  GOVERNANCE_STATES,
  MATURITY_STATES,
  MANIFESTATION_KINDS,
  NODE_ID_PREFIX,
  NODE_TYPES,
  RELATIONSHIP_TYPES,
  RESPONSIBILITY_TYPES,
  SCOPES,
  TRACE_LINK_TYPE,
  type GraphData,
  type GraphNode,
  type TraceLink,
  type ValidationError,
  type ValidationResult,
} from './schema.ts';

type IssueSink = Pick<ValidationResult, 'errors' | 'warnings'>;

function includes<T extends readonly string[]>(values: T, value: unknown): value is T[number] {
  return typeof value === 'string' && values.includes(value);
}

function pushError(sink: IssueSink, validator: string, message: string, id?: string): void {
  sink.errors.push({ validator, id, message });
}

function pushWarning(sink: IssueSink, validator: string, message: string, id?: string): void {
  sink.warnings.push({ validator, id, message });
}

function hasText(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length > 0;
}

function hasStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === 'string' && item.trim().length > 0);
}

function validateBaseNode(node: GraphNode, sink: IssueSink): void {
  if (!hasText(node.id)) pushError(sink, 'schema-valid', 'Node id is required.');
  if (!includes(NODE_TYPES, node.type)) pushError(sink, 'schema-valid', `Invalid node type "${String(node.type)}".`, node.id);
  if (includes(NODE_TYPES, node.type)) {
    const expectedPrefix = NODE_ID_PREFIX[node.type];
    if (!node.id.startsWith(expectedPrefix)) {
      pushError(sink, 'id-format-unique', `Expected id prefix ${expectedPrefix} for ${node.type}.`, node.id);
    }
  }

  if (node.scope !== undefined && !includes(SCOPES, node.scope)) {
    pushError(sink, 'scope-taxonomy', `Invalid scope "${String(node.scope)}".`, node.id);
  }
  if (node.governance !== undefined && !includes(GOVERNANCE_STATES, node.governance)) {
    pushError(sink, 'state-dimensions-valid', `Invalid governance state "${String(node.governance)}".`, node.id);
  }
  if (node.maturity !== undefined && !includes(MATURITY_STATES, node.maturity)) {
    pushError(sink, 'state-dimensions-valid', `Invalid maturity state "${String(node.maturity)}".`, node.id);
  }
  if (node.delivery !== undefined && !includes(DELIVERY_STATES, node.delivery)) {
    pushError(sink, 'state-dimensions-valid', `Invalid delivery state "${String(node.delivery)}".`, node.id);
  }
  if (node.provenance?.confidence !== undefined && !isValidConfidence(node.provenance.confidence)) {
    pushError(sink, 'confidence-scale', 'Confidence must be a number between 0 and 1.', node.id);
  }
  if (
    node.provenance?.confirmation_status !== undefined &&
    !includes(CONFIRMATION_STATUSES, node.provenance.confirmation_status)
  ) {
    pushError(sink, 'provenance-required', `Invalid confirmation status "${node.provenance.confirmation_status}".`, node.id);
  }
}

function isValidConfidence(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
}

function requireFields(node: GraphNode, sink: IssueSink, validator: string, fields: string[]): void {
  for (const field of fields) {
    const value = node[field];
    if (Array.isArray(value) ? value.length === 0 : !hasText(value)) {
      pushError(sink, validator, `Missing required field "${field}" for maturity "${node.maturity}".`, node.id);
    }
  }
}

function validateProgressiveFields(node: GraphNode, sink: IssueSink): void {
  if (!node.maturity) return;
  requireFields(node, sink, 'progressive-fields', ['id', 'statement']);

  if (node.maturity === 'logic-defined') {
    requireFields(node, sink, 'progressive-fields', ['scope']);
  }
  if (node.maturity === 'behavior-defined') {
    requireFields(node, sink, 'progressive-fields', ['scope']);
    if (!hasStringArray(node.acceptance_outcomes)) {
      pushError(sink, 'progressive-fields', 'Behavior-defined nodes require acceptance_outcomes.', node.id);
    }
  }
  if (node.maturity === 'decomposed' || node.maturity === 'implementation-ready') {
    if (!hasStringArray(node.responsibilities)) {
      pushError(sink, 'progressive-fields', `${node.maturity} nodes require responsibilities.`, node.id);
    }
    if (!hasStringArray(node.expected_manifestation_categories)) {
      pushError(sink, 'progressive-fields', `${node.maturity} nodes require expected_manifestation_categories.`, node.id);
    }
  }
}

function validateStateCombination(node: GraphNode, sink: IssueSink): void {
  if (node.governance === 'locked') {
    if (!hasText(node.lock_owner) || !hasText(node.lock_date)) {
      pushError(sink, 'lock-enforcement', 'Locked nodes require lock_owner and lock_date.', node.id);
    }
    if (node.maturity === 'intent-captured' && !hasText(node.ledger_ref)) {
      pushError(sink, 'state-combination-policy', 'locked + intent-captured requires a migration/ledger reason.', node.id);
    }
  }
  if (node.governance === 'approved' && node.maturity === 'intent-captured') {
    pushWarning(sink, 'state-combination-policy', 'approved + intent-captured should enter the needs-maturation queue.', node.id);
  }
  if (node.governance === 'superseded' && !hasText(node.superseded_by)) {
    pushError(sink, 'relationship-integrity', 'Superseded nodes require superseded_by.', node.id);
  }
}

function validateTypeSpecificNode(node: GraphNode, sink: IssueSink): void {
  if (node.type === 'Requirement' && !node.scope) {
    pushError(sink, 'scope-taxonomy', 'Requirement nodes require scope.', node.id);
  }
  if (node.type === 'SystemResponsibility' && !includes(RESPONSIBILITY_TYPES, node.responsibility_type)) {
    pushError(sink, 'schema-valid', 'SystemResponsibility requires a valid responsibility_type.', node.id);
  }
  if (node.type === 'ExpectedManifestationCategory' && !hasText(node.category)) {
    pushError(sink, 'expected-category-canonical', 'ExpectedManifestationCategory requires category.', node.id);
  }
  if (node.type === 'Manifestation' && !includes(MANIFESTATION_KINDS, node.kind)) {
    pushError(sink, 'schema-valid', 'Manifestation requires a valid kind.', node.id);
  }
  if (node.type === 'Evidence' && !hasText(node.acceptance_outcome)) {
    pushError(sink, 'evidence-binding', 'Evidence must bind to a specific acceptance outcome.', node.id);
  }
  if (node.type === 'Exemption') {
    if (!includes(EXEMPTION_CATEGORIES, node.exemption_category)) {
      pushError(sink, 'exemption-validity', 'Exemption requires a valid exemption_category.', node.id);
    }
    if (!hasText(node.reason) || !hasText(node.review_status)) {
      pushError(sink, 'exemption-validity', 'Exemption requires reason and review_status.', node.id);
    }
  }
}

function validateTraceLink(link: TraceLink, nodeIds: Set<string>, seenLinks: Set<string>, sink: IssueSink): void {
  if (!hasText(link.id)) pushError(sink, 'schema-valid', 'TraceLink id is required.');
  if (link.type !== TRACE_LINK_TYPE) pushError(sink, 'schema-valid', 'TraceLink type must be TraceLink.', link.id);
  if (seenLinks.has(link.id)) pushError(sink, 'id-format-unique', 'Duplicate TraceLink id.', link.id);
  seenLinks.add(link.id);
  if (!link.id.startsWith('TRC-')) pushError(sink, 'id-format-unique', 'TraceLink id must start with TRC-.', link.id);
  if (!nodeIds.has(link.source)) pushError(sink, 'relationship-integrity', `Dangling source ${link.source}.`, link.id);
  if (!nodeIds.has(link.target)) pushError(sink, 'relationship-integrity', `Dangling target ${link.target}.`, link.id);
  if (!includes(RELATIONSHIP_TYPES, link.relationship_type)) {
    pushError(sink, 'relationship-integrity', `Invalid relationship type "${String(link.relationship_type)}".`, link.id);
  }
  if (!includes(COVERAGE_VALUES, link.coverage)) {
    pushError(sink, 'coverage-rollup', `Invalid coverage "${String(link.coverage)}".`, link.id);
  }
  if (!isValidConfidence(link.confidence)) {
    pushError(sink, 'confidence-scale', 'TraceLink confidence must be a number between 0 and 1.', link.id);
  }
}

function validateDerivationIntegrity(link: TraceLink, nodesById: Map<string, GraphNode>, sink: IssueSink): void {
  if (link.relationship_type !== 'derives-from') return;
  const source = nodesById.get(link.source);
  const target = nodesById.get(link.target);
  if (!source || !target) return;
  if (source.type !== 'Requirement' || target.type !== 'Requirement') return;
  const isGoverned = (s: string) => s === 'product' || s === 'governance';
  if (!isGoverned(source.scope ?? '') && !isGoverned(target.scope ?? '')) {
    pushError(sink, 'derivation-integrity', 'Technical/test requirement derivation must point back to product or governed source.', link.id);
  }
}

function validateDoubleSupersede(nodes: GraphNode[], sink: IssueSink): void {
  const supersedeTargets = new Map<string, string[]>();
  for (const node of nodes) {
    if (hasText(node.superseded_by)) {
      const refs = supersedeTargets.get(node.id) ?? [];
      refs.push(node.superseded_by);
      supersedeTargets.set(node.id, refs);
    }
  }
  for (const [id, refs] of supersedeTargets) {
    if (new Set(refs).size > 1) {
      pushError(sink, 'relationship-integrity', 'Node is double-superseded by multiple replacements.', id);
    }
  }
}

export function calculateCoverageRollup(requiredCategoryIds: string[], links: TraceLink[]): 'complete' | 'partial' | 'missing' {
  const coverageByTarget = new Map(links.map((link) => [link.target, link.coverage]));
  let sawPartial = false;
  for (const categoryId of requiredCategoryIds) {
    const coverage = coverageByTarget.get(categoryId);
    if (coverage === 'complete' || coverage === 'exempt') continue;
    if (coverage === 'partial') {
      sawPartial = true;
      continue;
    }
    return 'missing';
  }
  return sawPartial ? 'partial' : 'complete';
}

function validateCoverage(data: GraphData, sink: IssueSink): void {
  for (const node of data.nodes) {
    if (node.type !== 'Requirement' || !hasStringArray(node.expected_manifestation_categories)) continue;
    const links = data.traceLinks.filter((link) => link.source === node.id || node.expected_manifestation_categories?.includes(link.source));
    const rollup = calculateCoverageRollup(node.expected_manifestation_categories, links);
    if (node.delivery === 'implemented' && rollup !== 'complete') {
      pushError(sink, 'coverage-rollup', `Implemented requirement has ${rollup} expected manifestation coverage.`, node.id);
    }
  }
}

export function validateGraphData(data: GraphData): ValidationResult {
  const result: ValidationResult = { pass: true, errors: [], warnings: [] };
  const seenNodeIds = new Set<string>();
  const nodesById = new Map<string, GraphNode>();

  for (const node of data.nodes) {
    validateBaseNode(node, result);
    if (seenNodeIds.has(node.id)) pushError(result, 'id-format-unique', 'Duplicate node id.', node.id);
    seenNodeIds.add(node.id);
    nodesById.set(node.id, node);
    validateProgressiveFields(node, result);
    validateStateCombination(node, result);
    validateTypeSpecificNode(node, result);
  }

  const seenLinks = new Set<string>();
  for (const link of data.traceLinks) {
    validateTraceLink(link, seenNodeIds, seenLinks, result);
    validateDerivationIntegrity(link, nodesById, result);
  }

  for (const entry of data.ledger) {
    if (!entry.id.startsWith('LDG-')) pushError(result, 'id-format-unique', 'Ledger entry id must start with LDG-.', entry.id);
    if (!hasText(entry.event_type) || !hasText(entry.actor) || !hasText(entry.date) || !hasText(entry.source)) {
      pushError(result, 'schema-valid', 'Ledger entry requires event_type, actor, date, and source.', entry.id);
    }
  }

  validateDoubleSupersede(data.nodes, result);
  validateCoverage(data, result);
  result.pass = result.errors.length === 0;
  return result;
}
