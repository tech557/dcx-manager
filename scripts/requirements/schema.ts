export const NODE_TYPES = [
  'Intent',
  'Requirement',
  'BehaviorRule',
  'AcceptanceOutcome',
  'SystemResponsibility',
  'ExpectedManifestationCategory',
  'Manifestation',
  'Evidence',
  'Exemption',
  'DecisionLedgerEntry',
  'OpenQuestion',
] as const;

export const TRACE_LINK_TYPE = 'TraceLink' as const;

export const GOVERNANCE_STATES = ['draft', 'proposed', 'approved', 'locked', 'superseded', 'archived'] as const;
export const MATURITY_STATES = ['intent-captured', 'logic-defined', 'behavior-defined', 'decomposed', 'implementation-ready'] as const;
export const DELIVERY_STATES = [
  'not-assessed',
  'not-started',
  'planned',
  'in-progress',
  'partially-implemented',
  'implemented',
  'verified',
  'blocked',
  'deprecated',
] as const;

export const SCOPES = [
  'product',
  'frontend',
  'backend',
  'devops',
  'test-qa',
  'data',
  'security',
  'operations',
  'governance',
  'agent-workflow',
] as const;

export const CONFIRMATION_STATUSES = [
  'po-decided',
  'agent-proposed',
  'skill-derived',
  'code-discovered',
  'confirmed',
  'verified',
  'disputed',
  'stale',
] as const;

export const RESPONSIBILITY_TYPES = [
  'ui-presentation',
  'interaction',
  'domain-logic',
  'state',
  'data',
  'persistence',
  'service-integration',
  'validation',
  'security',
  'operations',
  'governance',
  'agent-workflow',
  'verification',
] as const;

export const RELATIONSHIP_TYPES = [
  'derives-from',
  'decomposes-into',
  'implements',
  'partially-implements',
  'enforces',
  'displays',
  'persists',
  'configures',
  'validates',
  'verifies',
  'supports',
  'depends-on',
  'conflicts-with',
  'supersedes',
  'exempt-from-trace',
] as const;

export const COVERAGE_VALUES = ['complete', 'partial', 'missing', 'stale', 'invalidated', 'exempt'] as const;

export const EXEMPTION_CATEGORIES = [
  'infrastructure',
  'refactoring',
  'generated-code',
  'build-tooling',
  'internal-dev-tooling',
  'observability',
  'security-hardening',
  'defect-correction',
  'dependency-maintenance',
  'migration-compatibility',
] as const;

export const MANIFESTATION_KINDS = [
  'react-component',
  'function',
  'hook',
  'store-action',
  'state-transition',
  'type',
  'schema',
  'endpoint',
  'service',
  'db-structure',
  'selector',
  'script',
  'config',
  'skill',
  'agent-rule',
  'validator',
  'ci-hook',
  'infra',
  'test',
  'evidence-artifact',
  'documentation-view',
] as const;

export type NodeType = (typeof NODE_TYPES)[number];
export type GovernanceState = (typeof GOVERNANCE_STATES)[number];
export type MaturityState = (typeof MATURITY_STATES)[number];
export type DeliveryState = (typeof DELIVERY_STATES)[number];
export type Scope = (typeof SCOPES)[number];
export type ConfirmationStatus = (typeof CONFIRMATION_STATUSES)[number];
export type ResponsibilityType = (typeof RESPONSIBILITY_TYPES)[number];
export type RelationshipType = (typeof RELATIONSHIP_TYPES)[number];
export type CoverageValue = (typeof COVERAGE_VALUES)[number];
export type ExemptionCategory = (typeof EXEMPTION_CATEGORIES)[number];
export type ManifestationKind = (typeof MANIFESTATION_KINDS)[number];

export interface Provenance {
  source: string;
  authoring_actor: string;
  source_path?: string;
  source_anchor?: string;
  inference_source?: string;
  confidence?: number;
  confirmation_status?: ConfirmationStatus;
  derivation_reason?: string;
  last_checked_date?: string;
  evidence_refs?: string[];
}

export interface GraphNode {
  id: string;
  type: NodeType;
  statement?: string;
  scope?: Scope;
  governance?: GovernanceState;
  maturity?: MaturityState;
  delivery?: DeliveryState;
  provenance?: Provenance;
  aliases?: string[];
  lock_owner?: string;
  lock_date?: string;
  superseded_by?: string;
  supersedes?: string;
  reason?: string;
  ledger_ref?: string;
  open_questions?: string[];
  responsibilities?: string[];
  expected_manifestation_categories?: string[];
  acceptance_outcomes?: string[];
  responsibility_type?: ResponsibilityType;
  category?: string;
  kind?: ManifestationKind;
  current_paths?: string[];
  validity?: 'current' | 'stale' | 'invalidated' | 'recheck-required';
  lifecycle?: 'created' | 'modified' | 'renamed' | 'moved' | 'deleted' | 'replaced' | 'deprecated';
  exemption_category?: ExemptionCategory;
  review_status?: string;
  acceptance_outcome?: string;
  evidence_refs?: string[];
  [key: string]: unknown;
}

export interface TraceLink {
  id: string;
  type: typeof TRACE_LINK_TYPE;
  source: string;
  target: string;
  relationship_type: RelationshipType;
  coverage: CoverageValue;
  confidence: number;
  evidence_refs?: string[];
  inference_source?: string;
  confirmation_status?: ConfirmationStatus;
  last_checked_date?: string;
  verification_refs?: string[];
  stale_state?: 'current' | 'stale' | 'broken' | 'invalidated';
  needs_confirmation?: boolean;
}

export interface LedgerEntry {
  id: string;
  type: 'DecisionLedgerEntry';
  event_type: string;
  actor: string;
  date: string;
  source: string;
  signoff_by?: string;
  signoff_text?: string;
  recorded_by?: string;
  suppressed_node?: string;
  replacement_node?: string;
  reason?: string;
  affected_links?: string[];
}

export interface GraphData {
  nodes: GraphNode[];
  traceLinks: TraceLink[];
  ledger: LedgerEntry[];
}

export interface ValidationError {
  validator: string;
  id?: string;
  message: string;
}

export interface ValidationResult {
  pass: boolean;
  errors: ValidationError[];
  warnings: ValidationError[];
}

export const NODE_ID_PREFIX: Record<NodeType, string> = {
  Intent: 'INT-',
  Requirement: 'REQ-',
  BehaviorRule: 'BHV-',
  AcceptanceOutcome: 'AC-',
  SystemResponsibility: 'RSP-',
  ExpectedManifestationCategory: 'EMC-',
  Manifestation: 'MAN-',
  Evidence: 'EVD-',
  Exemption: 'EXM-',
  DecisionLedgerEntry: 'LDG-',
  OpenQuestion: 'QST-',
};

export const CANONICAL_EXPECTED_CATEGORIES: Record<ResponsibilityType, string[]> = {
  'ui-presentation': ['component', 'visual-state', 'accessible-label', 'design-token'],
  interaction: ['event-handler', 'command-action', 'keyboard-shortcut', 'drag-drop-behavior'],
  'domain-logic': ['rule-function', 'selector', 'state-transition'],
  state: ['store-field', 'reducer-action', 'context-provider'],
  data: ['type-schema', 'mapper', 'storage-field', 'migration'],
  persistence: ['type-schema', 'mapper', 'storage-field', 'migration'],
  'service-integration': ['service', 'api-mapper', 'contract'],
  validation: ['validator', 'error-class', 'fixture'],
  security: ['policy', 'guard', 'test'],
  operations: ['script', 'config', 'monitoring'],
  governance: ['agent-rule', 'validator', 'ledger-entry', 'signoff-workflow'],
  'agent-workflow': ['skill', 'generated-context', 'planner-audit-check'],
  verification: ['unit-test', 'e2e-test', 'manual-evidence', 'stale-evidence-check'],
};
