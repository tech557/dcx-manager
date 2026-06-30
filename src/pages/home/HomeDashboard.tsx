import { useState, useCallback } from 'react';
import { useAllVersionsQuery } from '@/queries/versions.queries';
import { useAllActivityLogsQuery } from '@/queries/logs.queries';
import { useToggle } from '@/hooks/useToggle';
import { SkeletonBlock } from '@/ui/skeleton/SkeletonBlock';
import { MouseGlowBackground } from '@/ui/MouseGlowBackground/MouseGlowBackground';
import { Plus } from 'lucide-react';
import { HomeHeroBar } from './HomeHeroBar';
import { HomeSearchFilters } from './HomeSearchFilters';
import { HomeSavedViews, type SavedView } from './HomeSavedViews';
import { HomeVersionList, type HomeFilterState } from './HomeVersionList';
import { HomeAnalyticsPanel } from './HomeAnalyticsPanel';
import { HomeActivityPanel } from './HomeActivityPanel';
import { CreateVersionDialog } from './CreateVersionDialog';

const EMPTY_FILTERS: HomeFilterState = { search: '', client: '', project: '', status: '', createdBy: '' };

const DEFAULT_VIEWS: SavedView[] = [
  { id: 'view-all', name: 'All', filters: EMPTY_FILTERS },
  { id: 'view-active', name: 'Active', filters: { ...EMPTY_FILTERS, status: 'In Progress' } },
];

export function HomeDashboard() {
  const { data: versions = [], isLoading: versionsLoading } = useAllVersionsQuery();
  const { data: logs = [], isLoading: logsLoading } = useAllActivityLogsQuery();

  const [filters, setFilters] = useState<HomeFilterState>(EMPTY_FILTERS);
  const [activeViewId, setActiveViewId] = useState<string | null>('view-all');
  const [savedViews, setSavedViews] = useState<SavedView[]>(DEFAULT_VIEWS);
  const [sidebarOpen, , , toggleSidebar] = useToggle();
  const [isCreateOpen, openCreate, closeCreate] = useToggle();

  const handleFiltersChange = useCallback((next: HomeFilterState) => {
    setFilters(next);
    setActiveViewId(null);
  }, []);

  function handleSelectView(view: SavedView) {
    if (activeViewId === view.id) {
      setActiveViewId(null);
      setFilters(EMPTY_FILTERS);
    } else {
      setActiveViewId(view.id);
      setFilters(view.filters);
    }
  }

  function handleDeleteView(id: string) {
    setSavedViews((prev) => prev.filter((v) => v.id !== id));
    if (activeViewId === id) {
      setActiveViewId(null);
      setFilters(EMPTY_FILTERS);
    }
  }

  function handleSaveCurrentView() {
    const name = window.prompt('Name this saved view:');
    if (!name?.trim()) return;
    const newView: SavedView = { id: `view-${Date.now()}`, name: name.trim(), filters };
    setSavedViews((prev) => [...prev, newView]);
    setActiveViewId(newView.id);
  }

  const hasNonDefaultFilters = Object.entries(filters).some(([k, v]) => k !== 'search' && v !== '');

  if (versionsLoading) {
    return (
      <div className="w-full h-screen flex items-center justify-center">
        <SkeletonBlock className="w-12 h-12 rounded-xl" surface="light" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[var(--theme-surface-void)]">
      {/* Ambient mouse-glow background (v0.1.4 parity; pointer-events-none, z-[1]) */}
      <MouseGlowBackground />

      {/* All content above the bg at z-10 */}
      <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Thin identity strip: brand + user only */}
        <div className="shrink-0 px-6 pt-4 pb-3 border-b border-[var(--theme-border)]/40">
          <HomeHeroBar />
        </div>

        {/* Two-zone body */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[var(--theme-border)]/25">
          {/* Left — hero + search + list */}
          <div className="flex-1 min-h-0 flex flex-col gap-0 overflow-hidden">
            {/* Hero: title + subtitle + Add Version (v0.1.4 order: hero → search → list) */}
            <div className="shrink-0 px-6 pt-6 pb-5">
              <div className="flex items-end justify-between gap-4">
                <div className="flex flex-col gap-1.5">
                  <h1 className="text-4xl sm:text-5xl font-black leading-none tracking-tighter">
                    <span className="text-[var(--theme-accent)]">DCX</span>
                    <span className="text-[var(--theme-text-primary)]"> Manager</span>
                  </h1>
                  <p className="text-dcx-sm text-[var(--theme-text-secondary)]/60 max-w-md leading-snug">
                    Create and manage detailed communication experiences. Structure campaigns across phases, actions, and messages.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={openCreate}
                  className="btn-brand shrink-0 px-5 py-2.5 rounded-xl text-dcx-sm"
                  aria-label="Add new version"
                >
                  <Plus size={15} />
                  Add Version
                </button>
              </div>
            </div>

            {/* Search + filter controls */}
            <div className="shrink-0 px-6 py-4 flex flex-col gap-3">
              <HomeSearchFilters
                versions={versions}
                filters={filters}
                onFiltersChange={handleFiltersChange}
                sidebarOpen={sidebarOpen}
                onToggleSidebar={toggleSidebar}
              />
              <HomeSavedViews
                savedViews={savedViews}
                activeViewId={activeViewId}
                onSelectView={handleSelectView}
                onDeleteView={handleDeleteView}
                onSaveCurrentView={handleSaveCurrentView}
                canSave={hasNonDefaultFilters && activeViewId === null}
              />
            </div>

            {/* Version list (scrollable) */}
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-4">
              <HomeVersionList versions={versions} filters={filters} />
            </div>
          </div>

          {/* Right — analytics + activity */}
          <div className="w-full lg:w-80 xl:w-96 shrink-0 flex flex-col divide-y divide-[var(--theme-border)]/25 overflow-hidden">
            <div className="shrink-0 px-6 py-5">
              <HomeAnalyticsPanel versions={versions} />
            </div>
            <div className="flex-1 min-h-0 overflow-y-auto px-6 py-5">
              {logsLoading ? (
                <SkeletonBlock className="w-full h-32 rounded-xl" surface="light" />
              ) : (
                <HomeActivityPanel logs={logs} versions={versions} />
              )}
            </div>
          </div>
        </div>
      </div>

      <CreateVersionDialog isOpen={isCreateOpen} onClose={closeCreate} versions={versions} />
    </div>
  );
}
