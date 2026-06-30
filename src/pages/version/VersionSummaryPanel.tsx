import type { Version } from '@/types/domain';
import { VersionBuilderPanel } from './VersionBuilderPanel';
import { VersionStructureSummary } from './VersionStructureSummary';
import { VersionResourcesPanel } from './VersionResourcesPanel';
import { VersionCrewPanel } from './VersionCrewPanel';

interface VersionSummaryPanelProps {
  version: Version;
}

// Version command — builder opener + structure + resources + crew, laid out to fit one
// desktop viewport (no page scroll; the resources/crew lists scroll internally if long).
export function VersionSummaryPanel({ version }: VersionSummaryPanelProps) {
  return (
    <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-5 min-h-0">
      {/* Left — builder opener (the command) + structure summary */}
      <div className="flex flex-col gap-5 min-h-0">
        <VersionBuilderPanel version={version} />
        <VersionStructureSummary versionId={version.id} />
      </div>

      {/* Right — resources + crew (each scrolls internally to keep the page in one viewport) */}
      <div className="flex flex-col gap-5 min-h-0">
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
          <VersionResourcesPanel attachments={version.attachments} />
        </div>
        <div className="flex-1 min-h-0 overflow-y-auto scrollbar-none">
          <VersionCrewPanel assignedTeam={version.assignedTeam} />
        </div>
      </div>
    </div>
  );
}
