import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useTheme } from "../../../hooks/useTheme";


interface NavigationArrowsProps {
  showLeft: boolean;
  showRight: boolean;
  onScrollLeft: () => void;
  onScrollRight: () => void;
  leftOffset: number; // Safe margin to live outside left island limits
  rightOffset: number; // Safe margin to live outside right island limits
}

export function NavigationArrows({
showLeft,
  showRight,
  onScrollLeft,
  onScrollRight,
  leftOffset,
  rightOffset,
}: NavigationArrowsProps) {
  const { isDark } = useTheme();
  return (
    <>
      <AnimatePresence>
        {showLeft && (
          <motion.button
            key="left-arrow"
            initial={{ opacity: 0, scale: 0.7, x: -20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.7, x: -20 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.75, x: -12 }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
            onClick={onScrollLeft}
            style={{ left: `${leftOffset + 24}px` }}
            className={`fixed top-1/2 -translate-y-1/2 z-35 w-16 h-16 flex items-center justify-center pointer-events-auto select-none rounded-full group cursor-pointer border-0 bg-transparent outline-none`}
            title="Scroll Left"
          >
            {/* Minimal ambient indicator */}
            <div className={`absolute inset-0 rounded-full scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-100 transition-all duration-300 ${
              isDark 
                ? "bg-white/[0.04]" 
                : "bg-black/[0.02]"
            }`} />

            <ChevronLeft 
              className={`w-10 h-10 transition-all duration-300 cursor-pointer ${
                isDark
                  ? "text-white/40 group-hover:text-[#75E2FF] group-hover:drop-shadow-[0_0_12px_#75E2FF]"
                  : "text-black/30 group-hover:text-black group-hover:drop-shadow-[0_0_6px_rgba(0,0,0,0.15)]"
              }`} 
            />
          </motion.button>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showRight && (
          <motion.button
            key="right-arrow"
            initial={{ opacity: 0, scale: 0.7, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.7, x: 20 }}
            whileHover={{ scale: 1.15 }}
            whileTap={{ scale: 0.75, x: 12 }}
            transition={{ type: "spring", stiffness: 350, damping: 15 }}
            onClick={onScrollRight}
            style={{ right: `${rightOffset + 24}px` }}
            className={`fixed top-1/2 -translate-y-1/2 z-35 w-16 h-16 flex items-center justify-center pointer-events-auto select-none rounded-full group cursor-pointer border-0 bg-transparent outline-none`}
            title="Scroll Right"
          >
            {/* Minimal ambient indicator */}
            <div className={`absolute inset-0 rounded-full scale-0 opacity-0 group-hover:scale-75 group-hover:opacity-100 transition-all duration-300 ${
              isDark 
                ? "bg-white/[0.04]" 
                : "bg-black/[0.02]"
            }`} />

            <ChevronRight 
              className={`w-10 h-10 transition-all duration-300 cursor-pointer ${
                isDark
                  ? "text-white/40 group-hover:text-[#75E2FF] group-hover:drop-shadow-[0_0_12px_#75E2FF]"
                  : "text-black/30 group-hover:text-black group-hover:drop-shadow-[0_0_6px_rgba(0,0,0,0.15)]"
              }`} 
            />
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}
