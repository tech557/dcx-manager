import { CardShell } from '../../CardShell';
import { ActionTaskList } from './ActionTaskList';
import type { ActionCardData } from '@/types/builder-node.types';
import { ReadyMark } from '@/builder/ui/feedback/ReadyMark';
import { AlertMark } from '@/builder/ui/feedback/AlertMark';
import { ReadinessCheckModal } from '@/builder/ui/modals/readiness-check-modal/ReadinessCheckModal';
import { Eye, EyeOff } from 'lucide-react';
import { useActionCard } from './useActionCard';

interface ActionCardProps {
  action: ActionCardData;
  selected?: boolean;
  locked?: boolean;
  onSelect?: (id: string, isMulti: boolean) => void;
}

export function ActionCard({ action, selected = false, locked = false, onSelect }: ActionCardProps) {
  const {
    behavior,
    isExpanded,
    editedName,
    setEditedName,
    isReadinessModalOpen,
    setIsReadinessModalOpen,
    handleNameSubmit,
    taskIds,
    allTasksExpanded,
    handleFocusToggle,
    handleSelect,
    selectedNodeIds,
  } = useActionCard({ action, selected, locked, onSelect });

  return (
    <>
      {/* Editor is task-only in this version — Action cards do not open the editor (no onLongPress). */}
      <CardShell kind="action" data={action} selected={selected} locked={locked} onSelect={onSelect}>
        <header className="action-card-header leading-snug flex justify-between items-center w-full">
          <div className="flex items-center gap-1.5 min-w-0 flex-1">
            <input
              type="text"
              value={editedName}
              onChange={(e) => setEditedName(e.target.value)}
              onBlur={handleNameSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNameSubmit();
                  e.currentTarget.blur();
                }
                if (e.key === 'Escape') {
                  setEditedName(action.name);
                  e.currentTarget.blur();
                }
              }}
              onClick={(e) => e.stopPropagation()}
              onDoubleClick={(e) => e.stopPropagation()}
              className="bg-transparent border border-transparent hover:border-white/10 focus:border-[var(--theme-accent)]/30 hover:bg-white/[0.02] focus:bg-black/30 font-bold text-dcx-xs text-neutral-200 px-1 py-0.5 rounded outline-none transition-all truncate focus:text-white w-full"
              title="Click to edit action name"
            />
          </div>

          <div className="flex items-center gap-1.5 shrink-0">
            {taskIds.length > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFocusToggle();
                }}
                className="text-neutral-500 hover:text-[var(--theme-accent)] focus:outline-none transition-colors p-0.5 rounded flex items-center justify-center cursor-pointer select-none shrink-0"
                title={`${allTasksExpanded ? 'Collapse' : 'Focus (expand)'} all nested Tasks`}
              >
                {allTasksExpanded ? (
                  <Eye className="w-3.5 h-3.5" />
                ) : (
                  <EyeOff className="w-3.5 h-3.5 opacity-60" />
                )}
              </button>
            )}

            {/* Micro-readiness indicator next to the name */}
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setIsReadinessModalOpen(true);
              }}
              className={`flex items-center justify-center p-0.5 rounded cursor-pointer transition-all shrink-0 ${
                behavior.readiness.state === 'ready'
                  ? 'text-emerald-400 hover:text-emerald-300'
                  : behavior.readiness.state === 'blocked'
                    ? 'text-rose-400 hover:bg-rose-500/10'
                    : 'text-amber-400 hover:bg-amber-500/10'
              }`}
              aria-label="Readiness feedback indicator"
              id={`readiness-indicator-${action.id}`}
            >
              {behavior.readiness.state === 'ready' ? (
                <ReadyMark className="w-3.5 h-3.5" id={`ready-mark-${action.id}`} />
              ) : (
                <AlertMark className="w-3.5 h-3.5 animate-none" id={`alert-mark-${action.id}`} />
              )}
            </button>
          </div>
        </header>

        <ActionTaskList
          action={action}
          locked={locked}
          isExpanded={isExpanded}
          onSelect={handleSelect}
          selectedNodeIds={selectedNodeIds}
        />
      </CardShell>

      <ReadinessCheckModal
        isOpen={isReadinessModalOpen}
        onClose={() => setIsReadinessModalOpen(false)}
        action={action}
      />
    </>
  );
}
