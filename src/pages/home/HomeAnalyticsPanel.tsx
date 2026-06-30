import { motion } from 'motion/react';
import type { Version } from '@/types/domain';

function deriveDcxStatus(versions: Version[]): 'active' | 'approved' | 'superseded' {
  if (versions.every((v) => v.status === 'Superseded')) return 'superseded';
  if (versions.some((v) => v.status === 'Approved')) return 'approved';
  return 'active';
}

interface HomeAnalyticsPanelProps {
  versions: Version[];
}

export function HomeAnalyticsPanel({ versions }: HomeAnalyticsPanelProps) {
  const byDcx = new Map<string, Version[]>();
  for (const v of versions) {
    const arr = byDcx.get(v.dcxId) ?? [];
    arr.push(v);
    byDcx.set(v.dcxId, arr);
  }

  const totalDcxs = byDcx.size;
  const activeDcxs = [...byDcx.values()].filter((vs) => deriveDcxStatus(vs) === 'active').length;
  const totalVersions = versions.length;

  return (
    <div className="flex flex-col gap-0">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/40 mb-4">Workspace Analytics</h3>

      <div className="glass-panel rounded-xl p-5 flex flex-col gap-4">
        {/* Primary stat */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col gap-2"
        >
          <div className="flex items-center gap-2">
            <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-[var(--theme-text-secondary)]/50">STATUS</span>
            <div className="flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--theme-accent)] animate-pulse" />
              <span className="text-[8px] font-bold tracking-[0.15em] uppercase text-[var(--theme-accent)]/70">LIVE</span>
            </div>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-black tabular-nums leading-none text-[var(--theme-accent)]">{activeDcxs}</span>
          </div>
          <span className="text-[9px] font-bold tracking-[0.25em] uppercase text-[var(--theme-text-secondary)]/40">Active Campaigns</span>
        </motion.div>

        {/* Divider */}
        <div className="w-full border-t border-dashed border-[var(--theme-border)]" />

        {/* Secondary row */}
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
          className="grid grid-cols-2 gap-6"
        >
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1 h-7">
              <span className="text-xl font-black tabular-nums leading-none text-[var(--theme-text-primary)]">{totalDcxs}</span>
              <span className="text-[var(--theme-accent)] text-xs font-black leading-none">↑</span>
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--theme-text-secondary)]/30">Total DCXs</span>
          </div>
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5 h-7">
              <span className="text-xl font-black tabular-nums leading-none text-[var(--theme-text-primary)]">{totalVersions}</span>
              <div className="flex flex-col gap-0.5">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-3 h-0.5 rounded-full bg-[var(--theme-text-secondary)]/20" />
                ))}
              </div>
            </div>
            <span className="text-[10px] tracking-[0.2em] uppercase text-[var(--theme-text-secondary)]/30">Versions</span>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
