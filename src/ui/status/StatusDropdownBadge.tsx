import { useRef, useEffect } from 'react';
import { ChevronDown, Check, Lock, Pencil } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import type { VersionStatus } from '@/types/lifecycle';
import { useTheme } from '@/hooks/useTheme';
import { useToggle } from '@/hooks/useToggle';
import { ISLAND_LABEL_CLASS } from '@/ui/atoms/labels';

interface StatusDropdownBadgeProps {
  status: VersionStatus;
  isLocked: boolean;
  onStatusChange: (status: VersionStatus) => void;
  styleMode?: 'default' | 'minimalist';
}

const STATUS_DETAILS: Record<
  VersionStatus,
  { label: string; textClass: string; bgClass: string; borderClass: string; desc: string }
> = {
  'Draft': {
    label: 'Draft',
    textClass: 'text-neutral-400',
    bgClass: 'bg-neutral-500/10',
    borderClass: 'border-neutral-600/30',
    desc: 'Initial preparation of the campaign version',
  },
  'In Progress': {
    label: 'In Progress',
    textClass: 'text-sky-400',
    bgClass: 'bg-sky-400/10',
    borderClass: 'border-sky-500/30',
    desc: 'Active construction and content drafting',
  },
  'Ready for Approval': {
    label: 'Ready for Approval',
    textClass: 'text-amber-300',
    bgClass: 'bg-amber-400/10',
    borderClass: 'border-amber-500/30',
    desc: 'Sent for reviewer audit and authorization',
  },
  'Approved': {
    label: 'Approved',
    textClass: 'text-emerald-400',
    bgClass: 'bg-emerald-500/10',
    borderClass: 'border-emerald-500/30',
    desc: 'Completed and locked from further edits',
  },
  'Superseded': {
    label: 'Superseded',
    textClass: 'text-neutral-500',
    bgClass: 'bg-neutral-700/15',
    borderClass: 'border-neutral-800/30',
    desc: 'Replaced by a newer version',
  },
};

const ORDERED_STATUSES: VersionStatus[] = [
  'Draft',
  'In Progress',
  'Ready for Approval',
  'Approved',
  'Superseded',
];

export function StatusDropdownBadge({
  status,
  isLocked,
  onStatusChange,
  styleMode = 'default',
}: StatusDropdownBadgeProps) {
  const [isOpen, toggleOpen, , closeOpen] = useToggle();
  const containerRef = useRef<HTMLDivElement>(null);
  const { isDark } = useTheme();

  const current = STATUS_DETAILS[status] || STATUS_DETAILS['Draft'];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        closeOpen();
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [closeOpen]);

  return (
    <div className="relative" ref={containerRef} id="status-dropdown-container">
      {styleMode === 'minimalist' ? (
        <div className="flex flex-col text-left justify-center select-none">
          <span className={`${ISLAND_LABEL_CLASS} mb-1 text-left`}>
            Project Status
          </span>
          <button
            type="button"
            disabled={isLocked}
            onClick={toggleOpen}
            className={`flex items-center gap-2 outline-none select-none text-left tracking-tight font-bold text-white transition-colors duration-200 uppercase ${
              isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:text-[var(--theme-accent)]'
            } text-dcx-md lg:text-dcx-md-plus`}
            aria-label={`Current status: ${status}. Click to change status`}
            title={isLocked ? `Status ${status} is locked` : 'Change version status'}
          >
            <span className="flex items-center shrink-0">
              {isLocked ? (
                <Lock size={12} className="text-neutral-400" />
              ) : (
                <Pencil size={11} className="text-[var(--theme-accent)]" />
              )}
            </span>
            <span>{current.label}</span>
          </button>
        </div>
      ) : (
        <button
          type="button"
          disabled={isLocked}
          onClick={toggleOpen}
          className={`rounded-full border uppercase tracking-wider font-sans font-extrabold text-dcx-xs flex items-center gap-1 px-3 py-1 transition-all duration-200 select-none ${
            isLocked ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:brightness-110 active:scale-95'
          } ${current.textClass} ${current.bgClass} ${current.borderClass}`}
          aria-label={`Current status: ${status}. Click to change status`}
          title={isLocked ? `Status ${status} is locked` : 'Change version status'}
        >
          <span>{current.label}</span>
          {!isLocked && <ChevronDown size={11} className="opacity-70" />}
        </button>
      )}

      <AnimatePresence>
        {isOpen && !isLocked && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.15, ease: 'easeOut' }}
            className={`absolute left-0 mt-2 w-72 rounded-2xl border p-2 z-50 shadow-2xl ${
              isDark
                ? 'bg-[var(--theme-surface-alternate)]/95 border-white/10 backdrop-blur-xl text-white'
                : 'bg-white border-neutral-200 text-neutral-800 shadow-neutral-200/50'
            }`}
            id="status-dropdown-menu"
          >
            <div className={`px-2.5 py-1.5 mb-1.5 border-b text-dcx-xs uppercase font-sans font-extrabold tracking-wider ${
              isDark ? 'border-white/5 text-[var(--theme-accent)]' : 'border-neutral-100 text-[var(--theme-accent-deep)]'
            }`}>
              Update Status
            </div>

            <div className="space-y-1">
              {ORDERED_STATUSES.map((item) => {
                const details = STATUS_DETAILS[item];
                const isActive = item === status;
                const isItemLocked = item === 'Ready for Approval' || item === 'Approved' || item === 'Superseded';

                return (
                  <button
                    key={item}
                    type="button"
                    onClick={() => {
                      onStatusChange(item);
                      closeOpen();
                    }}
                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all relative cursor-pointer group ${
                      isActive
                        ? isDark
                          ? 'bg-white/5 text-white'
                          : 'bg-neutral-50 text-black'
                        : isDark
                        ? 'hover:bg-white/5 text-white/70 hover:text-white'
                        : 'hover:bg-neutral-50 text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    <div className="pt-0.5 shrink-0">
                      <span className={`inline-block w-2.5 h-2.5 rounded-full ${details.bgClass} border ${details.borderClass}`} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-dcx-sm font-sans font-extrabold uppercase tracking-wide">
                          {details.label}
                        </span>
                        {isItemLocked ? (
                          <Lock size={10} className="text-zinc-500 shrink-0" />
                        ) : (
                          <Pencil size={10} className="text-[var(--theme-accent)]/70 shrink-0" />
                        )}
                        {isActive && <Check size={11} className="text-[var(--theme-accent)] pt-0.5" />}
                      </div>
                      <p className={`text-dcx-xs mt-0.5 leading-snug ${
                        isDark ? 'text-white/45' : 'text-neutral-400'
                      }`}>
                        {details.desc}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
