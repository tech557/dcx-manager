import { motion } from 'motion/react';
import { useTheme } from '@/hooks/useTheme';

interface HeaderBrandIslandProps {
  onClick?: () => void;
}

export function HeaderBrandIsland({ onClick }: HeaderBrandIslandProps) {
  const { isDark } = useTheme();

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`glass glass-glow p-2 rounded-full flex items-center gap-3.5 transition-all duration-500 ${
        isDark ? 'glass-dark text-white' : 'glass-light text-black'
      } ${onClick ? 'cursor-pointer' : 'cursor-default'}`}
      id="header-brand-island"
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
          isDark
            ? 'bg-black/40 border border-white/5 shadow-inner'
            : 'bg-black/10 border border-black/5 shadow-inner'
        }`}
      >
        <span className="font-black text-dcx-md tracking-tight text-[var(--theme-accent)]">D</span>
      </div>
      <div className="pr-3 text-left leading-none flex flex-col justify-center">
        <h1 className="text-dcx-base font-black leading-none tracking-tight transition-colors duration-500 m-0 text-[var(--theme-text-primary)]">
          DOTMENT
        </h1>
      </div>
    </motion.button>
  );
}
