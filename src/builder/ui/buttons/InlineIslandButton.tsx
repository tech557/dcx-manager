import React from 'react';
import type { LucideIcon } from 'lucide-react';
import { motion } from 'motion/react';
import { Chip } from '@/ui/atoms/Chip';

export interface InlineIslandButtonProps {
  id?: string;
  label?: string;
  isActive?: boolean;
  isDisabled?: boolean;
  isAi?: boolean;
  icon?: LucideIcon;
  onClick?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  // Drag and drop properties
  draggable?: boolean;
  onDragStart?: (event: React.DragEvent<HTMLButtonElement>) => void;
  onDragEnd?: (event: React.DragEvent<HTMLButtonElement>) => void;
  title?: string;
  className?: string;
}

export function InlineIslandButton({
  id,
  label,
  isActive = false,
  isDisabled = false,
  isAi = false,
  icon: Icon,
  onClick,
  draggable = false,
  onDragStart,
  onDragEnd,
  title,
  className = '',
}: InlineIslandButtonProps) {
  // Ultra-polished premium v0.1.4 high-fidelity compact capsule design
  // Sizing optimized (height 32px, text size sleek 10px uppercase tracking-wider)
  const baseClass = "inline-flex items-center gap-1.5 px-3 h-[32px] rounded-full border text-dcx-xs font-sans font-bold uppercase tracking-wider select-none transition-all duration-300 backdrop-blur-md cursor-grab active:cursor-grabbing";

  let stateClass = "";
  if (isDisabled) {
    stateClass = "opacity-35 cursor-not-allowed bg-white/[0.01] border-white/5 text-neutral-500 shadow-none";
  } else if (isAi) {
    // Beautiful isolated cyber glow gradient for standalone AI Section
    stateClass = "bg-indigo-950/20 hover:bg-indigo-900/30 border-indigo-500/30 text-[var(--theme-accent)] shadow-[0_0_12px_rgba(99,102,241,0.2)] hover:shadow-[0_0_16px_var(--theme-accent-strong)] hover:border-[var(--theme-accent)]/60 hover:text-white";
  } else if (isActive) {
    // Highly vibrant cyan glow
    stateClass = "bg-[var(--theme-accent)]/15 text-[var(--theme-accent)] border-[var(--theme-accent)]/50 shadow-[0_0_14px_var(--theme-accent-medium)]";
  } else {
    // Dark glass pill, with a crisp interior shine and gorgeous subtle border
    stateClass = "bg-neutral-950/75 border-white/[0.07] text-white/80 hover:text-white hover:bg-neutral-900/90 hover:border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_4px_12px_rgba(0,0,0,0.2)] hover:shadow-[inset_0_1px_1px_rgba(255,255,255,0.1),0_0_12px_rgba(255,255,255,0.08)]";
  }

  // Handle Drag Start to maintain EXACT same visual button as feedback ghost
  const handleDragStart = (e: React.DragEvent<HTMLButtonElement>) => {
    if (isDisabled) {
      e.preventDefault();
      return;
    }
    
    if (e.currentTarget) {
      // Set the button itself as the drag image so it keeps the identical appearance
      const rect = e.currentTarget.getBoundingClientRect();
      e.dataTransfer.setDragImage(e.currentTarget, rect.width / 2, rect.height / 2);
    }
    
    if (onDragStart) {
      onDragStart(e);
    }
  };

  const handleDragEnd = (e: React.DragEvent<HTMLButtonElement>) => {
    if (onDragEnd) {
      onDragEnd(e);
    }
  };

  return (
    <motion.div
      whileHover={isDisabled ? {} : { scale: 1.08, y: -0.5 }}
      whileTap={isDisabled ? {} : { scale: 0.94 }}
      className={`inline-flex shrink-0 relative transition-all duration-200 ${isDisabled ? 'z-10' : 'z-20 hover:z-50'}`}
    >
      <Chip
        id={id}
        label={label}
        icon={Icon ? (
          <Icon
            className={`h-3 w-3 shrink-0 transition-colors duration-300 ${
              isAi || isActive ? 'text-[var(--theme-accent)]' : 'text-white/65'
            }`}
          />
        ) : undefined}
        title={title}
        draggable={draggable && !isDisabled}
        isDisabled={isDisabled}
        isActive={isActive}
        variant={isAi || isActive ? 'accent' : 'default'}
        onClick={onClick}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        className={`${baseClass} ${stateClass} ${className}`}
      />
    </motion.div>
  );
}
