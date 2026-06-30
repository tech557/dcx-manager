import { motion, AnimatePresence } from 'motion/react';
import type { Version } from '@/types/domain';
import type { VersionStatus } from '@/types/lifecycle';

const STATUS_TOKEN_KEY: Record<VersionStatus, string> = {
  'Draft': 'draft',
  'In Progress': 'inprogress',
  'Ready for Approval': 'ready',
  'Approved': 'approved',
  'Superseded': 'superseded',
};

interface VersionSwitchboardProps {
  versions: Version[];
  activeVersionId: string;
  onSelect: (id: string) => void;
}

export function VersionSwitchboard({ versions, activeVersionId, onSelect }: VersionSwitchboardProps) {
  return (
    <div className="flex flex-col gap-1">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/40 mb-3">
        Campaign Versions
      </h3>
      <AnimatePresence initial={false}>
        {versions.map((v, i) => {
          const isActive = v.id === activeVersionId;
          const tokenKey = STATUS_TOKEN_KEY[v.status];
          return (
            <motion.button
              key={v.id}
              type="button"
              onClick={() => onSelect(v.id)}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              className={`flex items-center gap-3 w-full text-left px-3 py-2.5 rounded-xl border transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)] ${
                isActive
                  ? 'glass-card border-[var(--theme-accent)]/50 shadow-[0_0_12px_var(--theme-accent)]/10'
                  : 'bg-transparent border-transparent hover:bg-[var(--theme-surface-raised)]/60 hover:border-[var(--theme-border)]/40'
              }`}
            >
              <span
                className="w-1.5 h-1.5 rounded-full shrink-0"
                style={{ background: `var(--status-${tokenKey}-dot)` }}
              />
              <span className="flex-1 min-w-0">
                <span className="block font-mono text-[11px] font-bold truncate text-[var(--theme-text-primary)]">{v.versionNumber}</span>
                <span className="block text-[9px] tracking-[0.1em] uppercase truncate text-[var(--theme-text-secondary)]/50">{v.status}</span>
              </span>
              {isActive && (
                <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)] shadow-[0_0_6px_var(--theme-accent)]" />
              )}
            </motion.button>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
