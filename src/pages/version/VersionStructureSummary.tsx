import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useBuilderTreeQuery } from '@/queries/builder.queries';
import { SkeletonBlock } from '@/ui/skeleton/SkeletonBlock';
import type { Phase } from '@/types/domain';

interface CountCardProps {
  label: string;
  count: number;
  items: string[];
  delay?: number;
}

function CountCard({ label, count, items, delay = 0 }: CountCardProps) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      className="relative flex-1"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay }}
    >
      <button
        type="button"
        onMouseEnter={() => setOpen(true)}
        onMouseLeave={() => setOpen(false)}
        onFocus={() => setOpen(true)}
        onBlur={() => setOpen(false)}
        className="glass-panel flex flex-col items-center gap-1 w-full p-3 rounded-xl hover:border-[var(--theme-accent)]/40 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]"
        aria-label={`${count} ${label} — hover to list`}
      >
        <span className="text-2xl font-black tabular-nums text-[var(--theme-accent)]">{count}</span>
        <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/50">{label}</span>
      </button>

      <AnimatePresence>
        {open && items.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 4, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.97 }}
            transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 z-20 w-52 glass-panel rounded-xl p-3 flex flex-col gap-1.5"
          >
            {items.slice(0, 8).map((item, i) => (
              <p key={i} className="text-[11px] text-[var(--theme-text-primary)] truncate">{item}</p>
            ))}
            {items.length > 8 && (
              <p className="text-[9px] text-[var(--theme-text-secondary)]/40 tracking-widest uppercase">+{items.length - 8} more</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function computeSummary(phases: Phase[]) {
  const phaseNames = phases.map((p) => p.label);
  const actions = phases.flatMap((p) => p.actions);
  const actionNames = actions.map((a) => a.name);
  const taskNames = actions.flatMap((a) => a.tasks).map((t) => t.name);
  return { phaseNames, actionNames, taskNames };
}

interface VersionStructureSummaryProps {
  versionId: string;
}

export function VersionStructureSummary({ versionId }: VersionStructureSummaryProps) {
  const { data: tree, isLoading } = useBuilderTreeQuery(versionId);

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3">
        <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/40">Structure</h3>
        <div className="flex gap-2">
          <SkeletonBlock className="flex-1 h-16 rounded-xl" surface="light" />
          <SkeletonBlock className="flex-1 h-16 rounded-xl" surface="light" />
          <SkeletonBlock className="flex-1 h-16 rounded-xl" surface="light" />
        </div>
      </div>
    );
  }

  if (!tree) return null;

  const { phaseNames, actionNames, taskNames } = computeSummary(tree.phases);

  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/40">Structure</h3>
      <div className="flex gap-2">
        <CountCard label="Phases" count={phaseNames.length} items={phaseNames} delay={0} />
        <CountCard label="Actions" count={actionNames.length} items={actionNames} delay={0.05} />
        <CountCard label="Tasks" count={taskNames.length} items={taskNames} delay={0.1} />
      </div>
    </div>
  );
}
