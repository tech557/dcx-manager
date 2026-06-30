import { motion } from 'motion/react';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Layers, ArrowRight } from 'lucide-react';
import type { Version } from '@/types/domain';
import type { VersionStatus } from '@/types/lifecycle';
import { EDITABLE_VERSION_STATUSES } from '@/types/lifecycle';
import { QUERY_KEYS } from '@/queries/QUERY_KEYS';
import { updateVersionStatus } from '@/actions/version.actions';
import { StatusDropdownBadge } from '@/ui/status/StatusDropdownBadge';

interface VersionBuilderPanelProps {
  version: Version;
}

export function VersionBuilderPanel({ version }: VersionBuilderPanelProps) {
  const navigate = useNavigate();
  const qc = useQueryClient();
  const isEditable = (EDITABLE_VERSION_STATUSES as string[]).includes(version.status);

  const { mutate: changeStatus } = useMutation({
    mutationFn: (next: VersionStatus) => updateVersionStatus(version.id, next),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: QUERY_KEYS.versions.detail(version.id) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.versions.list(version.dcxId) });
      qc.invalidateQueries({ queryKey: QUERY_KEYS.versions.all });
    },
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
      whileHover={isEditable ? { scale: 1.01 } : undefined}
      className={`relative overflow-hidden rounded-2xl border flex flex-col gap-4 p-5 transition-shadow ${
        isEditable
          ? 'glass-panel border-[var(--theme-accent)]/30 shadow-[0_0_24px_rgba(117,226,255,0.08)]'
          : 'glass-panel border-[var(--theme-border)]/40 opacity-60'
      }`}
    >
      {/* Glow ring — accent radial behind content */}
      {isEditable && (
        <div
          className="pointer-events-none absolute inset-0 rounded-2xl"
          style={{
            background: 'radial-gradient(ellipse at 50% 0%, color-mix(in srgb, var(--theme-accent) 12%, transparent) 0%, transparent 70%)',
          }}
        />
      )}

      {/* Version status control — status is linked to this version and changed here */}
      <div className="relative flex items-center justify-between gap-3">
        <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-[var(--theme-text-secondary)]/40">Version Status</span>
        <StatusDropdownBadge
          status={version.status}
          isLocked={false}
          onStatusChange={(next) => changeStatus(next)}
        />
      </div>

      <div className="relative h-px bg-[var(--theme-border)]/40" />

      <div className="relative flex items-start gap-4">
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
          isEditable
            ? 'bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/30 shadow-[0_0_16px_var(--theme-accent)]/15'
            : 'bg-[var(--theme-surface-raised)] border border-[var(--theme-border)]/40'
        }`}>
          <Layers size={22} className={isEditable ? 'text-[var(--theme-accent)]' : 'text-[var(--theme-text-secondary)]/50'} />
        </div>
        <div className="flex flex-col gap-0.5 min-w-0">
          <h3 className="text-base font-black text-[var(--theme-text-primary)] tracking-tight">Campaign Builder</h3>
          <p className="text-[11px] text-[var(--theme-text-secondary)]/60 leading-snug">
            {isEditable
              ? 'Open the full builder to structure phases, actions, and tasks for this version.'
              : `This version is ${version.status.toLowerCase()} and cannot be edited.`}
          </p>
        </div>
      </div>

      <button
        type="button"
        disabled={!isEditable}
        onClick={() => navigate(`/builder/${version.id}`)}
        className="relative btn-brand flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl font-bold text-[11px] tracking-[0.05em] disabled:cursor-not-allowed disabled:opacity-30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]"
        aria-label={`Open builder for version ${version.versionNumber}`}
      >
        <Layers size={15} />
        Open Builder
        <ArrowRight size={15} />
      </button>

      {!isEditable && (
        <p className="relative text-[9px] text-center tracking-[0.15em] uppercase text-[var(--theme-text-secondary)]/30">
          Create a new version to make changes
        </p>
      )}
    </motion.div>
  );
}
