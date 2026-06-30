import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Chip } from '@/ui/atoms/Chip';

export interface IslandToggleButtonProps {
  id?: string;
  isActive: boolean;
  onClick: () => void;
  icon: LucideIcon;
  activeIcon?: LucideIcon;
  title?: string;
  ariaLabel?: string;
  className?: string;
}

export function IslandToggleButton({
  id,
  isActive,
  onClick,
  icon: Icon,
  activeIcon: ActiveIcon,
  title,
  ariaLabel,
  className = '',
}: IslandToggleButtonProps) {
  const DisplayIcon = isActive && ActiveIcon ? ActiveIcon : Icon;

  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className="inline-flex"
    >
      <Chip
        id={id}
        onClick={onClick}
        title={title}
        ariaLabel={ariaLabel || title}
        isActive={isActive}
        variant="accent"
        icon={(
          <motion.span
            animate={{ rotate: isActive ? 45 : 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="flex items-center justify-center"
          >
            <DisplayIcon className="h-5 w-5 text-[var(--theme-accent)]" />
          </motion.span>
        )}
        className={`h-11 w-11 animate-none p-0 aspect-square ${
          !isActive ? 'animate-pulse' : ''
        } ${className}`}
      />
    </motion.div>
  );
}
