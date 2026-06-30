import React from 'react';
import { motion, AnimatePresence } from "motion/react";
import { X } from "lucide-react";
import { BLUR } from "../styles/tokens";
import { GlassCard } from "./ui/GlassCard";

interface RightSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  isDark: boolean;
  children: React.ReactNode;
}

export const RightSidebar: React.FC<RightSidebarProps> = ({ isOpen, onClose, title, isDark, children }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className={`fixed inset-0 bg-black/60 ${BLUR.light} z-[100]`}
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-[400px] z-[101] flex flex-col"
          >
            <GlassCard
              isDark={isDark}
              padding="none"
              className="w-full h-full flex flex-col rounded-r-none rounded-l-[2rem] border-r-0 border-t-0 border-b-0 border-l shadow-[0_20px_50px_rgba(0,0,0,0.3)]"
            >
            {/* Header */}
            <div className={`p-6 border-b flex items-center justify-between ${
              isDark ? 'border-white/5' : 'border-black/5'
            }`}>
              <h3 className={`text-lg font-bold tracking-tight ${isDark ? 'text-white' : 'text-black'}`}>
                {title}
              </h3>
              <button
                onClick={onClose}
                className={`p-2 rounded-lg transition-colors ${
                  isDark ? 'hover:bg-white/5 text-white/40 hover:text-white' : 'hover:bg-black/5 text-black/40 hover:text-black'
                }`}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
              {children}
            </div>
            </GlassCard>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
