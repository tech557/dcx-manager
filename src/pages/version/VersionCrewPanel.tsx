import { motion } from 'motion/react';
import type { ApiAssignedMember } from '@/types/api';

const ROLE_INITIALS: Record<string, string> = {
  ICS: 'MS',
  Strategist: 'ST',
  Creative: 'CR',
  Analyst: 'AN',
  Producer: 'PR',
};

function memberInitials(m: ApiAssignedMember): string {
  return ROLE_INITIALS[m.role] ?? m.userId.slice(0, 2).toUpperCase();
}

interface VersionCrewPanelProps {
  assignedTeam: ApiAssignedMember[];
}

export function VersionCrewPanel({ assignedTeam }: VersionCrewPanelProps) {
  return (
    <div className="flex flex-col gap-3">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/40">
        Version Crew
      </h3>
      {assignedTeam.length === 0 ? (
        <p className="text-[11px] text-[var(--theme-text-secondary)]/40">No crew assigned.</p>
      ) : (
        <div className="flex flex-col gap-2">
          {assignedTeam.map((m, i) => (
            <motion.div
              key={m.userId}
              initial={{ opacity: 0, x: 6 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1], delay: i * 0.04 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-8 rounded-full bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/30 flex items-center justify-center text-[10px] font-black text-[var(--theme-accent)] shrink-0">
                {memberInitials(m)}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-[11px] font-bold text-[var(--theme-text-primary)] truncate">{memberInitials(m)}</p>
                <p className="text-[9px] tracking-[0.1em] uppercase text-[var(--theme-text-secondary)]/50 truncate">{m.role}</p>
              </div>
              {m.isProtected && (
                <span className="ml-auto shrink-0 text-[9px] font-bold tracking-[0.1em] uppercase text-[var(--theme-accent)]/60 bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/20 px-1.5 py-0.5 rounded-md">
                  Lead
                </span>
              )}
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
