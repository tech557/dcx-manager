import { DcxLogoMark } from '@/brand/DcxLogoMark';

export function PageBrandBlock() {
  return (
    <div className="flex items-center gap-2.5 select-none" aria-label="Dotment brand">
      <DcxLogoMark size={28} />
      <span className="text-dcx-sm font-black tracking-tight text-[var(--theme-text-primary)]">DOTMENT</span>
    </div>
  );
}
