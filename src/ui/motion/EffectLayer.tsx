import type { HTMLMotionProps } from 'motion/react';
import { motion } from 'motion/react';
import type { PropsWithChildren } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { useEffect as useLayerEffect } from './useEffect';
import type { EffectName } from './effects.registry';

interface EffectLayerProps extends PropsWithChildren {
  effect: EffectName;
  active: boolean;
  className?: string;
}

export function EffectLayer({ effect, active, className, children }: EffectLayerProps) {
  const reduced = useReducedMotion();
  const motionProps = useLayerEffect(effect, active, reduced) as HTMLMotionProps<'div'>;

  return (
    <motion.div className={`card-effect-wrap bg-transparent border-none shadow-none outline-none ${className || ''}`} {...motionProps}>
      {children}
    </motion.div>
  );
}
