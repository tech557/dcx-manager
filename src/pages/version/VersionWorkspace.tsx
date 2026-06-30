import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useVersionQuery, useVersionsQuery } from '@/queries/versions.queries';
import { SkeletonBlock } from '@/ui/skeleton/SkeletonBlock';
import { PageBrandBlock } from '@/ui/app-shell/PageBrandBlock';
import { PageUserBlock } from '@/ui/app-shell/PageUserBlock';
import { MouseGlowBackground } from '@/ui/MouseGlowBackground/MouseGlowBackground';
import { VersionMissingState } from './VersionMissingState';
import { VersionHeader } from './VersionHeader';
import { VersionSwitchboard } from './VersionSwitchboard';
import { VersionSummaryPanel } from './VersionSummaryPanel';

function VersionLoadingShell() {
  return (
    <div className="w-full h-screen flex items-center justify-center bg-[var(--theme-surface-void)]">
      <SkeletonBlock className="w-12 h-12 rounded-xl" surface="light" />
    </div>
  );
}

export function VersionWorkspace() {
  const { versionId: routeVersionId } = useParams<{ versionId: string }>();
  const [activeVersionId, setActiveVersionId] = useState<string>(routeVersionId ?? '');
  const [prevRouteId, setPrevRouteId] = useState(routeVersionId);

  if (prevRouteId !== routeVersionId && routeVersionId) {
    setPrevRouteId(routeVersionId);
    setActiveVersionId(routeVersionId);
  }

  const { data: activeVersion, isLoading, isError } = useVersionQuery(activeVersionId);
  const { data: siblings = [] } = useVersionsQuery(activeVersion?.dcxId ?? '');

  if (isLoading) return <VersionLoadingShell />;
  if (isError || !activeVersion) return <VersionMissingState />;

  const allVersionsForCampaign = siblings.length > 0 ? siblings : [activeVersion];

  return (
    <div className="relative w-full h-screen overflow-hidden flex flex-col bg-[var(--theme-surface-void)]">
      <MouseGlowBackground />

      <div className="relative z-10 flex flex-col flex-1 min-h-0 overflow-hidden">
        {/* Thin brand strip (no version number) */}
        <div className="shrink-0 px-6 pt-4 pb-3 border-b border-[var(--theme-border)]/40 flex items-center justify-between gap-4">
          <PageBrandBlock />
          <PageUserBlock />
        </div>

        {/* Campaign identity header (title + single status control) */}
        <VersionHeader version={activeVersion} siblings={allVersionsForCampaign.filter((v) => v.id !== activeVersionId)} />

        {/* Body — version column (left, below title) + version command (one viewport, no page scroll) */}
        <div className="flex-1 min-h-0 flex flex-col lg:flex-row divide-y lg:divide-y-0 lg:divide-x divide-[var(--theme-border)]/25">
          {/* Left — version column (switchboard) */}
          <div className="w-full lg:w-56 xl:w-64 shrink-0 min-h-0 overflow-y-auto px-6 py-5">
            <VersionSwitchboard
              versions={allVersionsForCampaign}
              activeVersionId={activeVersionId}
              onSelect={setActiveVersionId}
            />
          </div>

          {/* Main — version command (summary + builder opener) */}
          <div className="flex-1 min-h-0 overflow-hidden px-6 py-5">
            <VersionSummaryPanel version={activeVersion} />
          </div>
        </div>
      </div>
    </div>
  );
}
