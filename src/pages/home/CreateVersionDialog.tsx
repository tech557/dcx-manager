import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { duplicateEditableVersion } from '@/actions/version.actions';
import { QUERY_KEYS } from '@/queries/QUERY_KEYS';
import type { Version } from '@/types/domain';

interface CreateVersionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  versions: Version[];
}

export function CreateVersionDialog({ isOpen, onClose, versions }: CreateVersionDialogProps) {
  const queryClient = useQueryClient();
  const [sourceVersionId, setSourceVersionId] = useState<string>('');

  const { mutate: duplicate, isPending } = useMutation({
    mutationFn: (id: string) => duplicateEditableVersion(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: QUERY_KEYS.versions.all });
      onClose();
    },
  });

  if (!isOpen) return null;

  const editableVersions = versions.filter((v) => v.status === 'Draft' || v.status === 'In Progress');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (sourceVersionId) {
      duplicate(sourceVersionId);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-label="New version"
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="glass-panel relative w-full max-w-md rounded-2xl overflow-hidden" style={{ boxShadow: 'var(--shadow-overlay)' }}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-[var(--theme-border)]">
          <div>
            <h2 className="text-dcx-md font-black text-[var(--theme-text-primary)]">New Version</h2>
            <p className="text-dcx-xs text-[var(--theme-text-secondary)]/70 mt-0.5">Duplicate an existing version to start a new iteration</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-[var(--theme-text-secondary)] hover:text-[var(--theme-text-primary)] hover:bg-[var(--theme-surface-raised-hover)] transition-colors"
            aria-label="Close dialog"
          >
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-5">
          <div className="flex flex-col gap-2">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/60">
              Base version (duplicate)
            </label>
            {editableVersions.length === 0 ? (
              <p className="text-dcx-xs text-[var(--theme-text-secondary)]/60 py-2">
                No editable versions available. Create a draft version first or contact your administrator.
              </p>
            ) : (
              <select
                value={sourceVersionId}
                onChange={(e) => setSourceVersionId(e.target.value)}
                className="glass-field rounded-lg px-3 py-2.5 text-dcx-sm text-[var(--theme-text-primary)] w-full"
              >
                <option value="">Select a version to duplicate…</option>
                {editableVersions.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.versionNumber} — {v.status}
                  </option>
                ))}
              </select>
            )}
          </div>

          <div className="glass-panel rounded-xl p-4">
            <p className="text-dcx-xs text-[var(--theme-text-secondary)]/60 leading-relaxed">
              <strong className="font-semibold text-[var(--theme-text-secondary)]">ClickUp integration</strong> — Live ClickUp task fetch, client/project mapping, and DCX auto-create are backend-deferred.
              The version number is assigned automatically on creation.
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-xl glass-card text-dcx-sm font-semibold text-[var(--theme-text-secondary)] border-0"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={!sourceVersionId || isPending}
              className="btn-brand flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-dcx-sm disabled:opacity-40 disabled:cursor-not-allowed disabled:transform-none"
            >
              <Plus size={15} />
              {isPending ? 'Creating…' : 'Create Version'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
