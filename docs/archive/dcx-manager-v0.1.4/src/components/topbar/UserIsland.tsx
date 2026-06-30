import { motion } from "motion/react";
import { ThemeToggle } from "./ThemeToggle";

interface UserIslandProps {
  isDark: boolean;
  toggleTheme: () => void;
  flat?: boolean;
}

export default function UserIsland({ isDark, toggleTheme, flat = false }: UserIslandProps) {
  return (
    <motion.div
      initial={flat ? false : { opacity: 0, y: -20 }}
      animate={flat ? false : { opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={`${flat ? 'flex items-center gap-2' : `glass glass-glow p-2 rounded-full flex items-center gap-2 ${isDark ? 'glass-dark' : 'glass-light'}`}`}
    >
      <ThemeToggle isDark={isDark} toggle={toggleTheme} />
      <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden ${isDark ? 'bg-black/40 border border-white/5 shadow-inner' : 'bg-black/5 border border-black/5 shadow-inner'}`}>
        <span className={`text-[11px] font-bold tracking-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>MS</span>
      </div>
    </motion.div>
  );
}
