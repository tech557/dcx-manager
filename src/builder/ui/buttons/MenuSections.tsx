import React from 'react';
import { Chip } from '@/ui/atoms/Chip';

export interface MenuSectionButtonProps {
  id: string;
  label: string;
  title?: string;
  isActive: boolean;
  isPassed: boolean;
  onClick: () => void;
}

export function MenuSectionButton({
  id,
  label,
  title,
  isActive,
  isPassed,
  onClick
}: MenuSectionButtonProps) {
  // Determine standard brand colors matched with the readiness rules color scheme
  // If passed: emerald (green) glossy style. Otherwise: amber (yellow) glossy style.
  const stateColorClass = isPassed
    ? {
        border: isActive ? 'border-emerald-400' : 'border-emerald-500/30 hover:border-emerald-400/50',
        bg: isActive ? 'bg-emerald-500/25' : 'bg-emerald-500/5 hover:bg-emerald-500/15',
        glow: isActive ? 'shadow-[0_0_10px_var(--theme-success-glow),inset_0_1px_1px_rgba(255,255,255,0.05)] scale-110' : 'scale-100',
        inner: 'bg-emerald-400'
      }
    : {
        border: isActive ? 'border-amber-400' : 'border-amber-500/30 hover:border-amber-400/50',
        bg: isActive ? 'bg-amber-500/25' : 'bg-amber-500/5 hover:bg-amber-500/15',
        glow: isActive ? 'shadow-[0_0_10px_var(--theme-warning-glow),inset_0_1px_1px_rgba(255,255,255,0.05)] scale-110' : 'scale-100',
        inner: 'bg-amber-400/80'
      };

  return (
    <Chip
      onClick={onClick}
      className={`relative h-4 w-4 min-w-0 p-0 select-none ${stateColorClass.border} ${stateColorClass.bg} ${stateColorClass.glow}`}
      title={`${label}: ${title || ''}`}
      ariaLabel={`${label} section`}
      id={`menu-section-btn-${id}`}
      icon={<span className={`h-1.5 w-1.5 rounded-full transition-transform duration-300 ${stateColorClass.inner} ${isActive ? 'scale-125' : 'scale-100'}`} />}
    />
  );
}
