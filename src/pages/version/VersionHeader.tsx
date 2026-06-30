import { useNavigate } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';
import type { Version } from '@/types/domain';

function getMetaString(v: Version, key: string): string {
  const meta = v.metadata as Record<string, unknown> | null;
  if (!meta || typeof meta[key] !== 'string') return '—';
  return meta[key] as string;
}

function getInitials(userId: string): string {
  if (userId === 'ms' || userId === 'u-1') return 'MS';
  if (userId === 'u-2') return 'ST';
  if (userId === 'u-3') return 'CR';
  return userId.slice(0, 2).toUpperCase();
}

interface VersionHeaderProps {
  version: Version;
  siblings: Version[];
}

export function VersionHeader({ version, siblings }: VersionHeaderProps) {
  const navigate = useNavigate();
  const client = getMetaString(version, 'client');
  const project = getMetaString(version, 'project');
  const product = getMetaString(version, 'product');

  const allTeam = [version, ...siblings].flatMap((v) => v.assignedTeam);
  const uniqueUsers = [...new Map(allTeam.map((m) => [m.userId, m])).values()];

  return (
    <div className="shrink-0 px-6 pt-4 pb-5 flex flex-col gap-2.5">
      {/* Top row: back + client · product type */}
      <div className="flex items-center gap-3 min-w-0">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-[var(--theme-text-secondary)]/60 hover:text-[var(--theme-accent)] hover:bg-[var(--theme-surface-raised)] transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]"
          aria-label="Back to Campaign Hub"
        >
          <ChevronLeft size={15} />
        </button>
        <div className="flex items-center gap-2 min-w-0 text-[10px] font-bold tracking-[0.2em] uppercase">
          <span className="text-[var(--theme-accent)] truncate">{client}</span>
          {product !== '—' && (
            <>
              <span className="text-[var(--theme-text-secondary)]/30 shrink-0">·</span>
              <span className="text-[var(--theme-text-secondary)]/40 truncate">{product}</span>
            </>
          )}
        </div>
      </div>

      {/* Campaign name */}
      <h1 className="text-2xl sm:text-3xl font-black leading-none tracking-tight text-[var(--theme-text-primary)] truncate">
        {project}
      </h1>

      {/* Collaborators below the name */}
      {uniqueUsers.length > 0 && (
        <div className="flex items-center gap-1">
          {uniqueUsers.map((m) => (
            <div
              key={m.userId}
              title={`${getInitials(m.userId)} — ${m.role}`}
              className="w-6 h-6 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-accent)]/40 flex items-center justify-center text-[9px] font-black text-[var(--theme-accent)]"
            >
              {getInitials(m.userId)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
