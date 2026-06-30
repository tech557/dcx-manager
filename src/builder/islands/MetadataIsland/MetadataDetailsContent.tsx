import { AlertCircle, Copy, Paperclip, Users } from 'lucide-react';
import { CommunicationDateField } from '@/ui/forms/date';
import { DividerLine } from '@/ui/DividerLine';
import { Chip } from '@/ui/atoms/Chip';
import type { VersionStatus } from '@/types/lifecycle';
import type { ViewKind } from '@/types/stage.types';
import { CampaignDetailsGroup } from './CampaignDetailsGroup';
import { StatusDropdownBadge } from '@/ui/status/StatusDropdownBadge';
import { ViewTabSwitcher } from './ViewTabSwitcher';

interface MetadataDetailsContentProps {
  versionName: string;
  status: VersionStatus;
  communicatedDate: string | null;
  teamCount: number;
  filesCount: number;
  currentView: ViewKind;
  isLocked: boolean;
  isDuplicating: boolean;
  errorText: string | null;
  onStatusChange: (status: VersionStatus) => void;
  onDateChange: (date: string) => void;
  onViewChange: (view: ViewKind) => void;
  onDuplicate: () => void;
  onFilesClick: () => void;
}

export function MetadataDetailsContent({
  versionName,
  status,
  communicatedDate,
  teamCount,
  filesCount,
  currentView,
  isLocked,
  isDuplicating,
  errorText,
  onStatusChange,
  onDateChange,
  onViewChange,
  onDuplicate,
  onFilesClick,
}: MetadataDetailsContentProps) {
  return (
    <>
      <CampaignDetailsGroup projectLabel="HSA Campaign" versionName={versionName} isLocked={isLocked} />
      <DividerLine />
      <div className="flex items-center">
        <StatusDropdownBadge status={status} isLocked={isLocked} onStatusChange={onStatusChange} styleMode="minimalist" />
      </div>
      <DividerLine />
      <div className="relative flex items-center min-w-[110px]">
        <CommunicationDateField
          value={communicatedDate ? { mode: 'fixed', date: communicatedDate } : { mode: 'unset' }}
          onChange={(date) => onDateChange(date.mode === 'fixed' ? date.date : '')}
          anchorDateStr={communicatedDate || '2026-07-01'}
          label="Launch Window"
          showLinkMode={false}
          disabled={isLocked}
          triggerStyle="minimalist"
        />
      </div>
      <DividerLine />
      <div className="flex items-center gap-3 text-white/70">
        <div className="flex items-center gap-1.5" title={`${teamCount} team members`}>
          <Users size={12} className="text-[var(--theme-muted)] shrink-0" />
          <span className="text-dcx-xs font-bold font-mono text-white/60">{teamCount}</span>
        </div>
        <button
          id="metadata-files-trigger-button"
          type="button"
          onClick={onFilesClick}
          className="flex items-center gap-1.5 hover:text-[var(--theme-accent)] hover:opacity-100 opacity-80 text-white transition cursor-pointer"
          title={`${filesCount} attachments — Click to view files`}
        >
          <Paperclip size={12} className="text-[var(--theme-muted)] shrink-0" />
          <span className="text-dcx-xs font-bold font-mono text-white/60">{filesCount}</span>
        </button>
      </div>
      <DividerLine />
      <ViewTabSwitcher currentView={currentView} onViewChange={onViewChange} />
      {isLocked && (
        <>
          <DividerLine />
          <Chip
            id="btn-duplicate-version"
            label={isDuplicating ? 'Duplicating...' : 'Duplicate'}
            icon={<Copy className="w-3 h-3" />}
            size="sm"
            variant="accent"
            isDisabled={isDuplicating}
            onClick={onDuplicate}
            className="px-3 py-1 text-dcx-xs font-extrabold"
          />
        </>
      )}
      {errorText && (
        <>
          <DividerLine />
          <Chip
            as="span"
            id="version-transition-error"
            title={errorText}
            label="Blocked"
            icon={<AlertCircle className="w-3 h-3 text-red-500" />}
            size="sm"
            className="px-3 py-1 text-dcx-xs font-extrabold text-red-400 bg-red-950/25 border-red-900/40"
          />
        </>
      )}
    </>
  );
}
