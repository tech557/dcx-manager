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
    <div className="flex flex-col text-left justify-center font-sans select-none" id="campaign-details-group">
      {/* Top micro line: campaign label + version pill (h-4 keeps the row aligned with the other labels) */}
      <div className="flex items-center gap-1.5 leading-none mb-0.5 h-4">
        <span className={ISLAND_LABEL_CLASS}>{displayLabel}</span>
        <span
          className="inline-flex items-center rounded-full bg-[var(--theme-accent)]/10 border border-[var(--theme-accent)]/25 px-1 text-dcx-4xs font-medium tracking-[0.08em] text-[var(--theme-accent)] leading-none"
          id="metadata-version-pill"
        >
          {versionPill}
        </span>
      </div>

      {/* Value row — h-4 + same size as the other fields so all values sit on one line */}
      <span className="flex items-center h-4 text-dcx-xs font-black tracking-tight uppercase text-white leading-none">
        Ramadan 2026
      </span>
    </div>
  );
}
