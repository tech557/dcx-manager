import { motion } from "motion/react";
import { Plus } from "lucide-react";

interface BrandedButtonProps {
  isDark?: boolean;
  onClick?: () => void;
  className?: string;
}

export function BrandedButton({ isDark = true, onClick, className = "" }: BrandedButtonProps) {
  return (
    <motion.button
      whileHover="hover"
      whileTap="tap"
      onClick={onClick}
      className={`relative group ${className}`}
    >
      {/* Outer Glow Ring */}
      <motion.div
        variants={{
          hover: { scale: 1.3, opacity: 1 },
          tap: { scale: 0.9, opacity: 0.5 }
        }}
        initial={{ scale: 1, opacity: 0 }}
        className={`absolute inset-0 rounded-full blur-2xl transition-colors duration-500 ${
          isDark ? "bg-primary/30" : "bg-black/10"
        }`}
      />
 
      {/* Main Button Body */}
      <motion.div
        variants={{
          hover: { scale: 1.05 },
          tap: { scale: 0.95 }
        }}
        className={`relative w-14 h-14 rounded-full flex items-center justify-center border transition-all duration-500 ${
          isDark 
            ? "bg-black/40 border-white/10 glass shadow-[0_0_20px_rgba(0,0,0,0.4)] group-hover:border-primary/40 group-hover:bg-black/60" 
            : "bg-white/60 border-black/5 shadow-[0_4px_12px_rgba(0,0,0,0.05)] group-hover:border-black/20 group-hover:bg-white/80"
        }`}
      >
        {/* Animated Plus Icon */}
        <motion.div
          variants={{
            hover: { rotate: 90, scale: 1.1 },
            tap: { scale: 0.9 }
          }}
          transition={{ type: "spring", stiffness: 300, damping: 15 }}
          className={isDark ? "text-primary" : "text-black"}
        >
          <Plus className="w-7 h-7 stroke-[2.5px]" />
        </motion.div>

        {/* Inner Radial Shine (Glass effect) */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none" />
      </motion.div>
    </motion.button>
  );
}
