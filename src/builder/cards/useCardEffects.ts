import type { EffectName } from '@/ui/motion/effects.registry';
import type { CardKind, ReadinessState } from '@/types/card.types';
import { getCardConfig } from './card.registry';

interface UseCardEffectsOptions {
  kind: CardKind;
  isDragOver: boolean;
  isLifted?: boolean;
  isJustCreated: boolean;
  isJustEdited?: boolean;
  isReceivingChild?: boolean;
  isSelected: boolean;
  isHighlighted: boolean;
  isLocked: boolean;
  readinessState: ReadinessState;
  isHovered?: boolean;
}

export function useCardEffects({
  kind,
  isDragOver,
  isLifted = false,
  isJustCreated,
  isJustEdited = false,
  isReceivingChild = false,
  isSelected,
  isHighlighted,
  isLocked,
  readinessState,
  isHovered = false,
}: UseCardEffectsOptions) {
  const config = getCardConfig(kind).effects;
  let effectName: EffectName = 'newItemHighlight';
  let effectActive = false;

  if (isLifted) {
    // Grabbed via long-press — lift the card above the board for a fast, smooth drag.
    effectName = 'dragFeedback';
    effectActive = true;
  } else if (isDragOver && config.showDropGlow) {
    effectName = 'dropTargetGlow';
    effectActive = true;
  } else if (isJustCreated) {
    effectName = 'newItemHighlight';
    effectActive = true;
  } else if (isJustEdited) {
    effectName = 'saveSyncFeedback';
    effectActive = true;
  } else if (isLocked) {
    effectName = 'lockedFeedback';
    effectActive = true;
  } else if (isSelected || isHighlighted) {
    effectName = 'selectedHighlight';
    effectActive = config.showSelectionScale;
  }

  const glassBorderClass = readinessState === 'ready'
    ? config.glassBorderReady ?? ''
    : readinessState === 'incomplete'
      ? config.glassBorderIncomplete ?? ''
      : config.glassBorderBlocked ?? '';
  const isActive = isDragOver || isSelected || isHighlighted;

  const surfaceClass = isLifted
    ? 'bg-white/[0.08] border-[var(--theme-accent)]/55 shadow-[0_18px_50px_-14px_rgba(0,0,0,0.65)] ring-2 ring-[var(--theme-accent)]/40 transition-all duration-200 ease-out'
    : isReceivingChild
    ? 'bg-[var(--theme-accent)]/12 border-[var(--theme-accent)]/70 shadow-[0_0_16px_var(--theme-accent-medium)] transition-all duration-300 scale-[1.01] ring-2 ring-[var(--theme-accent)]/15'
    : isActive
      ? kind === 'action'
        ? 'bg-white/[0.04] border-white/[0.08] shadow-[inset_0_0_12px_var(--theme-accent-medium)]'
        : kind === 'phase'
          ? 'bg-white/[0.05] border-white/[0.08] shadow-[inset_0_0_16px_var(--theme-accent-strong)]'
          : 'bg-white/[0.07] border-white/[0.15] shadow-xl'
      : isHovered
        ? kind === 'action'
          ? 'bg-white/[0.02] border-white/[0.04] shadow-[inset_0_0_6px_var(--theme-accent-soft)]'
          : kind === 'phase'
            ? 'bg-white/[0.03] border-white/[0.04] shadow-[inset_0_0_8px_var(--theme-accent-bg)]'
            : 'bg-white/[0.05] border-white/[0.08] shadow-md'
        : config.noBackground
          ? 'bg-transparent border-transparent'
          : 'bg-white/[0.03] border-transparent';

  const showCorners: 'selected' | 'hover' | 'none' = (isSelected && config.showSelectionCorners)
    ? 'selected'
    : (isHovered && config.showSelectionCorners)
      ? 'hover'
      : 'none';

  return {
    effectName,
    effectActive,
    glassBorderClass,
    surfaceClass,
    showCorners,
    noBackground: Boolean(config.noBackground && !isActive && !isHovered && !isReceivingChild && !isLifted),
  };
}
