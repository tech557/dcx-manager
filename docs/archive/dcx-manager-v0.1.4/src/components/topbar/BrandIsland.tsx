import { motion } from "motion/react";
import { Droplet } from "lucide-react";

interface BrandIslandProps {
  flat?: boolean;
  isDark?: boolean;
  onClick?: () => void;
}

export function BrandIsland({ flat = false, isDark = true, onClick }: BrandIslandProps) {
  return (
    <motion.div
      initial={flat ? false : { opacity: 0, y: -20 }}
      animate={flat ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`${flat ? 'flex items-center gap-4 group' : `glass glass-glow p-2 rounded-full flex items-center gap-4 ${isDark ? 'glass-dark' : 'glass-light'} group ${onClick ? 'cursor-pointer' : ''}`}`}
    >
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 ${isDark ? 'bg-black/40 border border-white/5 shadow-inner' : 'bg-black/10 border border-black/5 shadow-inner'}`}
      >
        <svg 
          viewBox="0 0 100 100" 
          className="w-7 h-7 relative z-10" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
        >
          <rect 
            x="20" 
            y="20" 
            width="60" 
            height="60" 
            rx="18" 
            fill="black" 
          />
          <rect 
            x="42" 
            y="42" 
            width="16" 
            height="16" 
            rx="4" 
            fill="white" 
          />
        </svg>
      </div>
      <div className={flat ? "" : "pr-4"}>
        <h1 className={`text-base font-black tracking-[0.02em] leading-none transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>DOTMENT</h1>
      </div>
    </motion.div>
  );
}
