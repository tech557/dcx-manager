import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Version } from '@/types/domain';
import type { VersionStatus } from '@/types/lifecycle';

const STATUS_TOKEN: Record<VersionStatus, string> = {
  'Draft': 'draft',
  'In Progress': 'inprogress',
  'Ready for Approval': 'ready',
  'Approved': 'approved',
  'Superseded': 'superseded',
};

function getClientFromMetadata(version: Version): string {
  if (version.metadata && typeof version.metadata === 'object' && !Array.isArray(version.metadata)) {
    const meta = version.metadata as Record<string, unknown>;
    if (typeof meta['client'] === 'string') return meta['client'];
  }
  return version.dcxId;
}

function getProjectFromMetadata(version: Version): string {
  if (version.metadata && typeof version.metadata === 'object' && !Array.isArray(version.metadata)) {
    const meta = version.metadata as Record<string, unknown>;
    if (typeof meta['project'] === 'string') return meta['project'];
  }
  return '—';
}

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

interface HomeVersionCardProps {
  version: Version;
}

export function HomeVersionCard({ version }: HomeVersionCardProps) {
  const navigate = useNavigate();
  const tokenKey = STATUS_TOKEN[version.status] ?? 'draft';
  const client = getClientFromMetadata(version);
  const project = getProjectFromMetadata(version);
  const cardRef = useRef<HTMLButtonElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    const rect = cardRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    cardRef.current?.style.setProperty('--mx', `${x}%`);
    cardRef.current?.style.setProperty('--my', `${y}%`);
  }, []);

  return (
    <button
      ref={cardRef}
      type="button"
      onClick={() => navigate(`/version/${version.id}`)}
      onMouseMove={handleMouseMove}
      className="relative w-full text-left glass-card rounded-xl p-4 flex flex-col gap-2.5 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]"
      aria-label={`Open version ${version.versionNumber} — ${client} ${project}`}
    >
      {/* Mouse-follow radial glow */}
      <div className="mouse-glow" aria-hidden />

      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-0.5 min-w-0">
          <span className="text-dcx-xs font-black text-[var(--theme-text-secondary)] uppercase tracking-widest truncate">{client}</span>
          <span className="text-dcx-sm font-semibold text-[var(--theme-text-primary)] truncate leading-snug">{project}</span>
        </div>
        <span
          className="status-badge shrink-0 mt-0.5"
          style={{
            color: `var(--status-${tokenKey}-fg)`,
            borderColor: `var(--status-${tokenKey}-border)`,
            backgroundColor: `var(--status-${tokenKey}-bg)`,
          }}
        >
          {version.status}
        </span>
      </div>
      <div className="flex items-center justify-between gap-2">
        <span className="text-dcx-2xs font-semibold text-[var(--theme-accent)] tracking-wider font-mono">{version.versionNumber}</span>
        <span className="text-dcx-3xs text-[var(--theme-text-secondary)]/70 font-mono">{formatDate(version.communicatedDate)}</span>
      </div>
      {version.assignedTeam.length > 0 && (
        <div className="flex items-center gap-1.5">
          <div className="flex -space-x-1">
            {version.assignedTeam.slice(0, 3).map((m) => (
              <div
                key={m.userId}
                className="w-5 h-5 rounded-full bg-[var(--theme-accent)]/20 border border-[var(--theme-border)] flex items-center justify-center text-[9px] font-bold text-[var(--theme-accent)] transition-all group-hover:grayscale-0"
                title={`${m.role}: ${m.userId}`}
              >
                {m.role.charAt(0)}
              </div>
            ))}
          </div>
          <span className="text-dcx-3xs text-[var(--theme-text-secondary)]/60">
            {version.assignedTeam.length} member{version.assignedTeam.length !== 1 ? 's' : ''}
          </span>
        </div>
      )}
    </button>
  );
}
