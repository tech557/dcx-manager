import { ISLAND_LABEL_CLASS } from '@/ui/atoms/labels';

interface CampaignDetailsGroupProps {
  projectLabel: string;
  versionName: string;
  isLocked?: boolean;
}

export function CampaignDetailsGroup({ projectLabel, versionName }: CampaignDetailsGroupProps) {
  const displayLabel = projectLabel.toUpperCase().trim();
  // Version data already carries a "V" (e.g. "V1"); collapse any leading v/V so the pill
  // reads "V1" directly, never the doubled "VV1".
  const versionPill = `V${versionName.replace(/^[vV]+/, '').trim().toUpperCase()}`;

  return (
    <div className="flex flex-col text-left justify-center h-full py-0.5 font-sans select-none" id="campaign-details-group">
      {/* Top micro line: campaign label + version pill */}
      <div className="flex items-center gap-2 leading-none mb-1">
        <span className={ISLAND_LABEL_CLASS}>{displayLabel}</span>
        <span
          className="inline-flex items-center rounded-full bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/25 px-1.5 py-[0.15rem] text-dcx-3xs font-medium tracking-[0.1em] text-[var(--theme-accent)] leading-none"
          id="metadata-version-pill"
        >
          {versionPill}
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
