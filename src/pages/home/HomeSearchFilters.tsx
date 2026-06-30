import { Search, SlidersHorizontal } from 'lucide-react';
import type { Version } from '@/types/domain';
import type { VersionStatus } from '@/types/lifecycle';
import type { HomeFilterState } from './HomeVersionList';

const ALL_STATUSES: VersionStatus[] = ['Draft', 'In Progress', 'Ready for Approval', 'Approved', 'Superseded'];

function getMetaString(version: Version, key: string): string {
  if (version.metadata && typeof version.metadata === 'object' && !Array.isArray(version.metadata)) {
    const val = (version.metadata as Record<string, unknown>)[key];
    if (typeof val === 'string') return val;
  }
  return '';
}

function unique(arr: string[]): string[] {
  return [...new Set(arr.filter(Boolean))];
}

interface HomeSearchFiltersProps {
  versions: Version[];
  filters: HomeFilterState;
  onFiltersChange: (next: HomeFilterState) => void;
  sidebarOpen: boolean;
  onToggleSidebar: () => void;
}

export function HomeSearchFilters({
  versions,
  filters,
  onFiltersChange,
  sidebarOpen,
  onToggleSidebar,
}: HomeSearchFiltersProps) {
  const clients = unique(versions.map((v) => getMetaString(v, 'client')));
  const projects = unique(versions.map((v) => getMetaString(v, 'project')));
  const creators = unique(versions.map((v) => v.createdBy));

  function set<K extends keyof HomeFilterState>(key: K, value: HomeFilterState[K]) {
    onFiltersChange({ ...filters, [key]: value });
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Search + filter toggle row */}
      <div className="flex items-center gap-2">
        <div className="flex-1 relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--theme-text-secondary)]/50 pointer-events-none" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => set('search', e.target.value)}
            placeholder="Search versions, clients, projects…"
            className="glass-field w-full pl-8 pr-3 py-2 rounded-lg text-dcx-xs text-[var(--theme-text-primary)] placeholder:text-[var(--theme-text-secondary)]/40"
          />
        </div>
        <button
          type="button"
          onClick={onToggleSidebar}
          disabled
          className="flex items-center gap-1.5 px-3 py-2 rounded-lg border text-dcx-xs font-semibold bg-[var(--theme-surface-raised)] border-[var(--theme-border)] text-[var(--theme-text-secondary)]/50 opacity-60 cursor-not-allowed"
          aria-label="Filters (coming soon)"
          title="Filters — coming soon"
        >
          <SlidersHorizontal size={13} />
          <span>Filters</span>
          <span className="ml-0.5 px-1.5 py-0.5 rounded-full bg-[var(--theme-accent)]/15 border border-[var(--theme-accent)]/30 text-[var(--theme-accent)] text-[8px] font-black uppercase tracking-wider leading-none">
            soon
          </span>
        </button>
      </div>

      {/* Filter sidebar (inline, collapsible) */}
      {sidebarOpen && (
        <div className="glass-panel grid grid-cols-2 sm:grid-cols-4 gap-2 p-3 rounded-xl">
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/50">Client</label>
            <select
              value={filters.client}
              onChange={(e) => set('client', e.target.value)}
              className="glass-field rounded-lg px-2 py-1.5 text-dcx-xs text-[var(--theme-text-primary)]"
            >
              <option value="">All clients</option>
              {clients.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/50">Project</label>
            <select
              value={filters.project}
              onChange={(e) => set('project', e.target.value)}
              className="glass-field rounded-lg px-2 py-1.5 text-dcx-xs text-[var(--theme-text-primary)]"
            >
              <option value="">All projects</option>
              {projects.map((p) => <option key={p} value={p}>{p}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/50">Status</label>
            <select
              value={filters.status}
              onChange={(e) => set('status', e.target.value as VersionStatus | '')}
              className="glass-field rounded-lg px-2 py-1.5 text-dcx-xs text-[var(--theme-text-primary)]"
            >
              <option value="">All statuses</option>
              {ALL_STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--theme-text-secondary)]/50">Created by</label>
            <select
              value={filters.createdBy}
              onChange={(e) => set('createdBy', e.target.value)}
              className="glass-field rounded-lg px-2 py-1.5 text-dcx-xs text-[var(--theme-text-primary)]"
            >
              <option value="">Anyone</option>
              {creators.map((u) => <option key={u} value={u}>{u}</option>)}
            </select>
          </div>
        </div>
      )}
    </div>
  );
}
