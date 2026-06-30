interface CampaignDetailsGroupProps {
  projectLabel: string;
  versionName: string;
  isLocked?: boolean;
}

export function CampaignDetailsGroup({ projectLabel, versionName }: CampaignDetailsGroupProps) {
  const cleanVersion = versionName.toUpperCase().trim();
  const displayLabel = projectLabel.toUpperCase().trim();
  
  return (
    <div className="flex flex-col text-left justify-center h-full py-0.5 font-sans select-none" id="campaign-details-group">
      {/* Top micro line: campaign label • version info */}
      <div className="flex items-center gap-1.5 leading-none mb-1">
        <span className="text-dcx-3xs font-bold tracking-[0.18em] uppercase text-neutral-400/70">
          {displayLabel}
        </span>
        <span className="text-neutral-600 text-dcx-xs px-0.5 opacity-45">•</span>
        <span className="text-dcx-3xs font-bold tracking-[0.18em] text-[var(--theme-accent)]/80">
          {cleanVersion}
        </span>
      </div>

      {/* Title & Editable capsule block */}
      <div className="flex items-center gap-3 leading-none">
        <span className="text-dcx-base font-black tracking-tight uppercase text-white leading-none">
          Ramadan 2026
        </span>
      </div>
    </div>
  );
}
