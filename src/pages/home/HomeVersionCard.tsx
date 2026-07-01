import { useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import type { Version } from '@/types/domain';
import type { VersionStatus } from '@/types/lifecycle';
import type { ApiAssignedMember } from '@/types/api';
import { AvatarGroup, type AvatarGroupItem } from '@/ui/atoms';

const STATUS_TOKEN: Record<VersionStatus, string> = {
  'Draft': 'draft',
  'In Progress': 'inprogress',
  'Ready for Approval': 'ready',
  'Approved': 'approved',
  'Superseded': 'superseded',
};

const ROLE_INITIALS: Record<string, string> = {
  ICS: 'MS',
  Strategist: 'ST',
  Creative: 'CR',
  Analyst: 'AN',
  Producer: 'PR',
};

function memberInitials(member: ApiAssignedMember): string {
  return ROLE_INITIALS[member.role] ?? member.userId.slice(0, 2).toUpperCase();
}

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

function formatLaunchDate(iso: string | null): string {
  if (!iso) return 'TBD';
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

  const team = version.assignedTeam;
  const avatarItems: AvatarGroupItem[] = team.map((member) => ({
    id: member.userId,
    initials: memberInitials(member),
    title: `${member.role}: ${member.userId}`,
  }));

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
      className="home-version-card glass-card relative w-full text-left rounded-xl flex flex-col gap-2 group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--theme-accent)]"
      aria-label={`Open version ${version.versionNumber} — ${client} ${project}`}
    >
      {/* Mouse-follow radial glow */}
      <div className="mouse-glow" aria-hidden />

      {/* 1. Client + lifecycle status */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-dcx-2xs font-bold uppercase tracking-widest text-[var(--theme-text-secondary)]/70 truncate">
          {client}
        </span>
        <span
          className="status-badge shrink-0"
          style={{
            color: `var(--status-${tokenKey}-fg)`,
            borderColor: `var(--status-${tokenKey}-border)`,
            backgroundColor: `var(--status-${tokenKey}-bg)`,
          }}
        >
          {version.status}
        </span>
      </div>

      {/* 2. Project — primary information */}
      <h3 className="text-dcx-md-plus font-bold text-[var(--theme-text-primary)] leading-snug truncate">
        {project}
      </h3>

      {/* 3. Version number + launch date */}
      <div className="flex items-center gap-2 text-dcx-2xs">
        <span className="font-bold tracking-wider text-[var(--theme-accent)]">{version.versionNumber}</span>
        <span className="h-3 w-px bg-[var(--theme-border)]" aria-hidden />
        <span className="text-[var(--theme-text-secondary)]/70">{formatLaunchDate(version.communicatedDate)}</span>
      </div>

      {/* 4. Assigned team + open affordance */}
      <div className="mt-0.5 flex items-center justify-between gap-2 border-t border-[var(--theme-border-subtle)] pt-2">
        {team.length > 0 ? (
          <div className="flex items-center gap-2 min-w-0">
            <AvatarGroup items={avatarItems} max={3} size="sm" />
            <span className="text-dcx-3xs text-[var(--theme-text-secondary)]/60 truncate">
              {team.length} member{team.length !== 1 ? 's' : ''}
            </span>
          </div>
        ) : (
          <span className="text-dcx-3xs text-[var(--theme-text-secondary)]/40">No crew assigned</span>
        )}
        <span className="flex shrink-0 items-center gap-1 text-dcx-2xs font-semibold text-[var(--theme-text-secondary)]/50 transition-colors group-hover:text-[var(--theme-accent)]">
          Open
          <ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 motion-reduce:transform-none" />
        </span>
      </div>
    </button>
  );
}
