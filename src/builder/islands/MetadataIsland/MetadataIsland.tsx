import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';
import { motion } from 'motion/react';
import { useVersionQuery, useVersionsQuery } from '@/queries/versions.queries';
import { useBuilderTreeQuery } from '@/queries/builder.queries';
import type { Phase } from '@/types/domain';
import {
  duplicateEditableVersion,
  updateVersionCommunicationDate,
  updateVersionStatus,
} from '@/actions/version.actions';
import { HeaderBrandIsland } from '../HeaderBrandIsland';
import { HeaderUserIsland } from '../HeaderUserIsland/HeaderUserIsland';
import { useTheme } from '@/hooks/useTheme';
import { validateVersionForReady } from '@/rules/validation.rules';
import type { ViewKind } from '@/types/stage.types';
import type { VersionStatus } from '@/types/lifecycle';
import { useImport } from '@/builder/import/useImport';
import { MetadataModalsContainer } from './MetadataModalsContainer';
import { MetadataDetailsContent } from './MetadataDetailsContent';
import { useFilePreview } from './useFilePreview';
import { useToggle } from '@/hooks/useToggle';

interface MetadataIslandProps {
  versionId: string;
  currentView: ViewKind;
  onViewChange: (view: ViewKind) => void;
  isLocked?: boolean;
  onExport?: () => void;
}

const getErrorMessage = (err: unknown, fallback: string) => err instanceof Error ? err.message : fallback;

export function MetadataIsland({
  versionId,
  currentView,
  onViewChange,
  isLocked = false,
  onExport,
}: MetadataIslandProps) {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { isDark } = useTheme();

  const [isApprovalModalOpen, , openApprovalModal, closeApprovalModal] = useToggle();
  const [errorText, setErrorText] = useState<string | null>(null);
  const [isDuplicating, setIsDuplicating] = useState(false);
  const [validationIssues, setValidationIssues] = useState<string[]>([]);
  const [isValidationOpen, , openValidation, closeValidation] = useToggle();
  const [isImportOpen, , openImport, closeImport] = useToggle();

  const filePreview = useFilePreview();

  const importFlow = useImport(versionId);

  const versionQuery = useVersionQuery(versionId);
  const versionData = versionQuery.data;

  const builderTreeQuery = useBuilderTreeQuery(versionId);
  const domainTree = builderTreeQuery.data;

  const dcxId = versionData?.dcxId || 'dcx-1';
  const siblingsQuery = useVersionsQuery(dcxId);
  const siblings = siblingsQuery.data || [];

  // versionNumber already carries its "V" (e.g. "V1"); pass it raw so the pill isn't doubled.
  const versionName = versionData?.versionNumber ?? `v${versionId}`;
  const status: VersionStatus = versionData?.status || 'Draft';
  const teamCount = versionData?.assignedTeam?.length ?? 0;
  const attachments = versionData?.attachments ?? [];

  const handleDateChange = async (dateVal: string) => {
    try {
      setErrorText(null);
      await updateVersionCommunicationDate(versionId, dateVal || null);
      queryClient.invalidateQueries({ queryKey: ['versions'] });
    } catch (err: unknown) {
      setErrorText(getErrorMessage(err, 'Failed to update communication date.'));
    }
  };

  const handleTransition = async (nextStatus: VersionStatus) => {
    try {
      setErrorText(null);
      if (nextStatus === 'Approved') {
        const hasDate = versionData?.communicatedDate && versionData.communicatedDate.trim() !== '';
        if (!hasDate) {
          setErrorText('Approval is blocked until the version communication date is set.');
          return;
        }
        openApprovalModal();
        return;
      }

      if (nextStatus === 'Ready for Approval' && versionData) {
        const phases = domainTree?.phases || [];
        const result = validateVersionForReady(versionData, phases as Phase[]);
        if (!result.valid) {
          setValidationIssues(result.issues || []);
          openValidation();
          return;
        }
      }

      await updateVersionStatus(versionId, nextStatus);
      queryClient.invalidateQueries({ queryKey: ['versions'] });
    } catch (err: unknown) {
      setErrorText(getErrorMessage(err, 'Transition rejected.'));
    }
  };

  const handleConfirmApproval = async () => {
    try {
      setErrorText(null);
      closeApprovalModal();
      await updateVersionStatus(versionId, 'Approved');
      queryClient.invalidateQueries({ queryKey: ['versions'] });
    } catch (err: unknown) {
      setErrorText(getErrorMessage(err, 'Approval transition failed.'));
    }
  };

  const handleDuplicate = async () => {
    try {
      setErrorText(null);
      setIsDuplicating(true);
      const newVersion = await duplicateEditableVersion(versionId);
      queryClient.invalidateQueries({ queryKey: ['versions'] });
      navigate(`/builder/${newVersion.id}`);
    } catch (err: unknown) {
      setErrorText(getErrorMessage(err, 'Duplication failed.'));
    } finally {
      setIsDuplicating(false);
    }
  };

  return (
    <>
      <header className="header-container-floating" id="metadata-island" aria-label="Metadata and View controls">
        <HeaderBrandIsland />

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.05 }}
          className={`glass header-island-pill px-4 flex items-center gap-2.5 transition-all duration-500 hover:shadow-[0_0_20px_var(--theme-accent-subtle)] ${
            isDark ? 'glass-dark text-white' : 'glass-light text-black'
          }`}
          id="project-details-island"
        >
          <MetadataDetailsContent
            versionName={versionName}
            status={status}
            communicatedDate={versionData?.communicatedDate || null}
            teamCount={teamCount}
            attachments={attachments}
            filePreview={filePreview}
            currentView={currentView}
            isLocked={isLocked}
            isDuplicating={isDuplicating}
            errorText={errorText}
            onStatusChange={handleTransition}
            onDateChange={handleDateChange}
            onViewChange={onViewChange}
            onDuplicate={handleDuplicate}
          />
        </motion.div>

        <HeaderUserIsland onExport={onExport} onImport={openImport} />
      </header>

      <MetadataModalsContainer
        versionId={versionId}
        versionData={versionData}
        siblings={siblings}
        domainTree={domainTree}
        isApprovalModalOpen={isApprovalModalOpen}
        setIsApprovalModalOpen={(open) => (open ? openApprovalModal() : closeApprovalModal())}
        handleConfirmApproval={handleConfirmApproval}
        isImportOpen={isImportOpen}
        setIsImportOpen={(open) => (open ? openImport() : closeImport())}
        importFlow={importFlow}
        setErrorText={setErrorText}
        isValidationOpen={isValidationOpen}
        setIsValidationOpen={(open) => (open ? openValidation() : closeValidation())}
        validationIssues={validationIssues}
      />
    </>
  );
}
