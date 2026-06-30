import { useNavigate } from 'react-router-dom';
import { ApprovalConfirmModal } from '@/builder/ui/modals/ApprovalConfirmModal';
import { ValidationSummary } from '@/builder/ui/feedback/ValidationSummary';
import ImportPreviewModal from '@/builder/ui/modals/ImportPreviewModal';
import type { BuilderNode } from '@/types/builder-node.types';
import type { Version } from '@/types/domain';
import type { ImportDiffGroup, ImportDecision } from '@/builder/import/import.helpers';

interface BuilderDomainTree {
  phases: Array<{ id: string; label?: string; actions?: Array<{ id: string; name?: string; tasks?: Array<{ id: string; name?: string }> }> }>;
}

interface MetadataModalsContainerProps {
  versionId: string;
  versionData: Version | undefined;
  siblings: Version[];
  domainTree: BuilderDomainTree | undefined;
  isApprovalModalOpen: boolean;
  setIsApprovalModalOpen: (open: boolean) => void;
  handleConfirmApproval: () => void;
  isImportOpen: boolean;
  setIsImportOpen: (open: boolean) => void;
  importFlow: {
    importedNodes: BuilderNode[] | null;
    diff: ImportDiffGroup | null;
    applyImport: () => void;
    loadFromFile: (file: File) => Promise<void>;
    clear: () => void;
    confirmDeletes: boolean;
    setConfirmDeletes: (v: boolean) => void;
    decisions: Record<string, ImportDecision>;
    setDecision: (id: string, decision: ImportDecision) => void;
  };
  setErrorText: (text: string | null) => void;
  isValidationOpen: boolean;
  setIsValidationOpen: (open: boolean) => void;
  validationIssues: string[];
}

export function MetadataModalsContainer({
  versionId,
  versionData,
  siblings,
  domainTree,
  isApprovalModalOpen,
  setIsApprovalModalOpen,
  handleConfirmApproval,
  isImportOpen,
  setIsImportOpen,
  importFlow,
  setErrorText,
  isValidationOpen,
  setIsValidationOpen,
  validationIssues,
}: MetadataModalsContainerProps) {
  const navigate = useNavigate();

  return (
    <>
      {versionData && (
        <ApprovalConfirmModal
          isOpen={isApprovalModalOpen}
          onClose={() => setIsApprovalModalOpen(false)}
          onConfirm={handleConfirmApproval}
          version={versionData}
          siblings={siblings}
        />
      )}

      <ImportPreviewModal
        isOpen={isImportOpen}
        onClose={() => {
          setIsImportOpen(false);
          importFlow.clear();
        }}
        importedNodes={importFlow.importedNodes}
        diff={importFlow.diff}
        onApply={() => {
          try {
            importFlow.applyImport();
          } catch (err) {
            setErrorText(err instanceof Error ? err.message : 'Apply failed');
            return;
          }
          setIsImportOpen(false);
        }}
        onFileLoad={async (file: File) => {
          try {
            await importFlow.loadFromFile(file);
          } catch (err: unknown) {
            setErrorText(err instanceof Error ? err.message : 'Failed to read import file');
          }
        }}
        confirmDeletes={importFlow.confirmDeletes}
        setConfirmDeletes={importFlow.setConfirmDeletes}
        decisions={importFlow.decisions}
        setDecision={importFlow.setDecision}
        labelForId={(id: string) => {
          if (!domainTree || !domainTree.phases) return id;
          for (const phase of domainTree.phases) {
            if (phase.id === id) return phase.label || `phase:${phase.id}`;
            for (const action of phase.actions || []) {
              if (action.id === id) return action.name || `action:${action.id}`;
              for (const task of action.tasks || []) {
                if (task.id === id) return task.name || `task:${task.id}`;
              }
            }
          }
          return id;
        }}
      />

      <ValidationSummary
        isOpen={isValidationOpen}
        issues={validationIssues}
        onClose={() => setIsValidationOpen(false)}
        onFocusIssue={(issue) => {
          const idMatch = issue.match(/id[: ]?(\w[-\w\d_]*)/i);
          if (idMatch) {
            const nodeId = idMatch[1];
            navigate(`/builder/${versionId}#${nodeId}`);
            setIsValidationOpen(false);
          }
        }}
      />
    </>
  );
}
