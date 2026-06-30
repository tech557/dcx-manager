import { motion } from "motion/react";
import { BrandedButton } from "../../components/BrandedButton";

interface HeroProps {
  isDark: boolean;
  onAddClick?: () => void;
}

export function Hero({ isDark, onAddClick }: HeroProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-5">
        <motion.h1 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className={`text-5xl font-black tracking-tightest leading-none ${isDark ? 'text-white' : 'text-black'}`}
        >
          <span className="text-primary">DCX</span> <span className="font-normal opacity-80">Manager</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <BrandedButton isDark={isDark} onClick={onAddClick} />
        </motion.div>
      </div>

      <motion.p 
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
        className={`text-sm max-w-md leading-relaxed font-medium ${isDark ? 'text-white/40' : 'text-black/50'}`}
      >
        Create and manage detailed communication experiences.
        <br />
        Structure campaigns across phases, actions, and messages.
      </motion.p>
    </div>
  );
}
