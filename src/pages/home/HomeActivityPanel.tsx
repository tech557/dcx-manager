import type { ApiActivityEvent } from '@/types/api';
import type { Version } from '@/types/domain';
import type { VersionStatus } from '@/types/lifecycle';

const STATUS_TOKEN: Record<VersionStatus, string> = {
  'Draft': 'draft',
  'In Progress': 'inprogress',
  'Ready for Approval': 'ready',
  'Approved': 'approved',
  'Superseded': 'superseded',
};

function getMetaString(version: Version, key: string, fallback = ''): string {
  if (version.metadata && typeof version.metadata === 'object' && !Array.isArray(version.metadata)) {
    const val = (version.metadata as Record<string, unknown>)[key];
    if (typeof val === 'string') return val;
  }
  return fallback;
}

function formatTimeMono(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  const time = d.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  return `${date} ${time}`;
}

interface HomeActivityPanelProps {
  logs: ApiActivityEvent[];
  versions: Version[];
}

export function HomeActivityPanel({ logs, versions }: HomeActivityPanelProps) {
  const versionMap = new Map(versions.map((v) => [v.id, v]));
  const sorted = [...logs].sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="flex flex-col gap-3 min-h-0">
      <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/40 shrink-0">
        Activity Log ({sorted.length})
      </h3>
      {sorted.length === 0 ? (
        <p className="text-dcx-xs text-[var(--theme-text-secondary)]/50 text-center py-6">No activity yet</p>
      ) : (
        <div className="flex flex-col gap-0 overflow-y-auto flex-1 min-h-0">
          {sorted.map((log) => {
            const version = versionMap.get(log.versionId);
            const client = version ? getMetaString(version, 'client', version.dcxId) : '—';
            const project = version ? getMetaString(version, 'project', '—') : '—';
            const status = version?.status;
            const tokenKey = status ? STATUS_TOKEN[status] ?? 'draft' : 'draft';

            return (
              <div key={log.id} className="flex flex-col gap-1 py-2.5 border-b border-[var(--theme-border)]/30 last:border-b-0">
                {/* Client › Project + timestamp */}
                <div className="flex items-center justify-between gap-2 min-w-0">
                  <p className="flex items-center gap-1.5 min-w-0 text-dcx-xs leading-snug">
                    <span className="font-black uppercase tracking-wider text-[10px] text-[var(--theme-accent)] shrink-0">{client}</span>
                    <span className="opacity-30 shrink-0">›</span>
                    <span className="font-semibold text-[var(--theme-text-primary)] truncate">{project}</span>
                  </p>
                  <span className="shrink-0 font-mono text-[9px] text-[var(--theme-text-secondary)]/50 tracking-tight">{formatTimeMono(log.timestamp)}</span>
                </div>
                {/* Version status + version number */}
                <div className="flex items-center gap-2">
                  {status && (
                    <span
                      className="status-badge"
                      style={{
                        color: `var(--status-${tokenKey}-fg)`,
                        borderColor: `var(--status-${tokenKey}-border)`,
                        backgroundColor: `var(--status-${tokenKey}-bg)`,
                      }}
                    >
                      {status}
                    </span>
                  )}
                  {version && (
                    <span className="font-mono text-[9px] font-bold text-[var(--theme-text-secondary)]/50 tracking-wide">{version.versionNumber}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
