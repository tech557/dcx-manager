import { colorTokens, shadowStyleTokens } from '@/brand/tokens';
import { motionPresets } from './motion.config';

export type EffectName =
  | 'dropTargetGlow'
  | 'invalidDrop'
  | 'parentGlow'
  | 'selectedHighlight'
  | 'newItemHighlight'
  | 'focusHighlight'
  | 'expandCollapse'
  | 'dragFeedback'
  | 'saveSyncFeedback'
  | 'lockedFeedback'
  | 'viewTransitionIn'
  | 'viewTransitionOut';

import type { Variants } from 'motion/react';

export interface EffectMotionProps {
  initial?: unknown;
  animate?: unknown;
  exit?: unknown;
  transition?: Record<string, unknown>;
  variants?: Variants;
}

export const effectsRegistry: Record<EffectName, EffectMotionProps> = {
  dropTargetGlow: {
    animate: {
      boxShadow: `0 0 0 1.5px ${colorTokens.accent}, 0 0 24px ${colorTokens.dark.selectedGlow}`,
      scale: 1.015,
    },
    transition: motionPresets.card,
  },
  invalidDrop: {
    animate: {
      x: [0, -4, 4, -2, 2, 0],
      opacity: 0.72,
    },
    transition: { duration: 0.24 },
  },
  parentGlow: {
    animate: {
      boxShadow: `0 0 20px ${colorTokens.dark.selectedGlow}`,
    },
    transition: motionPresets.gentle,
  },
  selectedHighlight: {
    animate: {
      scale: 1.005,
    },
    transition: motionPresets.card,
  },
  newItemHighlight: {
    initial: { opacity: 0, scale: 0.96 },
    animate: {
      opacity: 1,
      scale: 1,
    },
    transition: motionPresets.card,
  },
  focusHighlight: {
    animate: {
      outlineColor: colorTokens.accent,
      outlineWidth: 2,
      outlineOffset: 4,
    },
    transition: motionPresets.gentle,
  },
  expandCollapse: {
    initial: { opacity: 0.88, scale: 0.98 },
    animate: { opacity: 1, scale: 1 },
    exit: { opacity: 0, scale: 0.98 },
    transition: motionPresets.island,
  },
  dragFeedback: {
    animate: {
      scale: 1.025,
      rotate: 0.4,
      boxShadow: shadowStyleTokens.card,
    },
    transition: motionPresets.card,
  },
  saveSyncFeedback: {
    animate: {
      boxShadow: `0 0 0 1px ${colorTokens.accent}, 0 0 16px ${colorTokens.dark.selectedGlow}`,
    },
    transition: motionPresets.gentle,
  },
  lockedFeedback: {
    animate: {
      opacity: 0.56,
      filter: 'saturate(0.8)',
    },
    transition: motionPresets.gentle,
  },
  viewTransitionIn: {
    initial: 'initial',
    animate: 'animate',
    transition: { duration: 0.22, ease: 'easeInOut' },
    variants: {
      initial: (direction: number) => ({
        x: direction > 0 ? '100%' : '-100%',
        opacity: 0,
      }),
      animate: {
        x: 0,
        opacity: 1,
      },
    },
  },
  viewTransitionOut: {
    exit: 'exit',
    transition: { duration: 0.22, ease: 'easeInOut' },
    variants: {
      exit: (direction: number) => ({
        x: direction > 0 ? '-100%' : '100%',
        opacity: 0,
      }),
    },
  },
};

export const viewTransitionReducedIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  transition: { duration: 0.08 },
};

export const viewTransitionReducedOut = {
  exit: { opacity: 0 },
  transition: { duration: 0.08 },
};

/** Reduced-motion variants — no spring/scale/shake; ≤100ms fades or instant state changes. */
export const reducedEffectsRegistry: Record<EffectName, EffectMotionProps> = {
  dropTargetGlow: {
    animate: {
      boxShadow: `0 0 0 1.5px ${colorTokens.accent}, 0 0 24px ${colorTokens.dark.selectedGlow}`,
    },
    transition: { duration: 0.08 },
  },
  invalidDrop: {
    animate: { opacity: [1, 0.5, 1] },
    transition: { duration: 0.2, ease: 'linear' },
  },
  parentGlow: {
    animate: {
      boxShadow: `0 0 20px ${colorTokens.dark.selectedGlow}`,
    },
    transition: { duration: 0.08 },
  },
  selectedHighlight: {
    animate: {},
    transition: { duration: 0 },
  },
  newItemHighlight: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: 0.08 },
  },
  focusHighlight: {
    animate: {
      outlineColor: colorTokens.accent,
      outlineWidth: 2,
      outlineOffset: 4,
    },
    transition: { duration: 0 },
  },
  expandCollapse: {
    initial: { opacity: 0 },
    animate: { opacity: 1 },
    exit: { opacity: 0 },
    transition: { duration: 0.08 },
  },
  dragFeedback: {
    animate: {
      boxShadow: shadowStyleTokens.card,
    },
    transition: { duration: 0.08 },
  },
  saveSyncFeedback: {
    animate: {
      boxShadow: `0 0 0 1px ${colorTokens.accent}, 0 0 16px ${colorTokens.dark.selectedGlow}`,
    },
    transition: { duration: 0.08 },
  },
  lockedFeedback: {
    animate: {
      opacity: 0.56,
      filter: 'saturate(0.8)',
    },
    transition: { duration: 0 },
  },
  viewTransitionIn: viewTransitionReducedIn as EffectMotionProps,
  viewTransitionOut: viewTransitionReducedOut as EffectMotionProps,
};
