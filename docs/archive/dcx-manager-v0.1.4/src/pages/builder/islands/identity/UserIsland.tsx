import { motion } from "motion/react";
import { X } from "lucide-react";
import { ThemeToggle } from "../../../../components/topbar/ThemeToggle";
import { useTheme } from "../../../../hooks/useTheme";


interface BuilderUserIslandProps {
  toggleTheme: () => void;
  onClose: () => void;
}

export function BuilderUserIsland({
toggleTheme,
  onClose,
}: BuilderUserIslandProps) {
  const { isDark } = useTheme();
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
      className={`glass glass-glow p-2 rounded-full flex items-center gap-2 ${isDark ? 'glass-dark' : 'glass-light'}`}
    >
      {/* Theme Toggle Button reused from core component */}
      <ThemeToggle isDark={isDark} toggle={toggleTheme} />

      {/* User Avatar with initials "MS" styled exactly like UserIsland.tsx */}
      <div 
        className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-500 overflow-hidden ${
          isDark 
            ? 'bg-black/40 border border-white/5 shadow-inner' 
            : 'bg-black/5 border border-black/5 shadow-inner'
        }`}
      >
        <span className={`text-[11px] font-bold tracking-tight transition-colors duration-500 ${isDark ? 'text-white' : 'text-black'}`}>
          MS
        </span>
      </div>

      {/* Elegant Vertical Divider if needed / or compact spacing */}
      <div className={`w-px h-6 opacity-10 ${isDark ? "bg-white" : "bg-black"}`} />

      {/* Close Canvas / Exit Button styled to match */}
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={onClose}
        className={`w-10 h-10 rounded-full flex items-center justify-center cursor-pointer transition-all duration-500 ${
          isDark 
            ? "bg-rose-500/10 border border-rose-500/20 hover:bg-rose-500/25 text-rose-400" 
            : "bg-rose-500/5 border border-rose-500/10 hover:bg-rose-500/15 text-rose-600"
        }`}
      >
        <X className="w-4 h-4" />
      </motion.button>
    </motion.div>
  );
}
