import { motion } from "motion/react";
import { useTheme } from "../../../../hooks/useTheme";


interface BuilderBrandIslandProps {
  onClick?: () => void;
}

export function BuilderBrandIsland({ onClick }: BuilderBrandIslandProps) {
  const { isDark } = useTheme();
  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      onClick={onClick}
      className={`glass glass-glow p-2 rounded-full flex items-center gap-4 transition-all duration-500 ${
        isDark ? "glass-dark" : "glass-light"
      } ${onClick ? "cursor-pointer" : "cursor-default"}`}
    >
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center relative overflow-hidden transition-all duration-300 ${
          isDark
            ? "bg-black/40 border border-white/5 shadow-inner"
            : "bg-black/10 border border-black/5 shadow-inner"
        }`}
      >
        <span className="font-black text-[11px] tracking-tight text-[#75E2FF]">D</span>
      </div>
      <div className="pr-3 text-left leading-none">
        <h1 className={`text-base font-black leading-none transition-colors duration-500 ${isDark ? "text-white" : "text-black"}`}>
          DOTMENT
        </h1>
        <span className="text-[8px] font-black tracking-[0.25em] uppercase text-[#75E2FF]/70">
          DCX Manager
        </span>
      </div>
    </motion.button>
  );
}
