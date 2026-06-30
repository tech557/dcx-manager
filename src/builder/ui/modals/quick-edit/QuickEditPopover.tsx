import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { X } from 'lucide-react';

interface QuickEditPopoverProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  triggerRef: React.RefObject<HTMLElement | null>;
  children: React.ReactNode;
}

export function QuickEditPopover({
  isOpen,
  onClose,
  title,
  triggerRef,
  children,
}: QuickEditPopoverProps) {
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  // Measure and position the popover below the trigger element
  useEffect(() => {
    if (isOpen && triggerRef.current) {
      const rect = triggerRef.current.getBoundingClientRect();
      const popoverWidth = 260; // Estimated or fixed width
      
      // Keep inside viewport horizontal boundaries
      let left = rect.left + window.scrollX;
      if (left + popoverWidth > window.innerWidth) {
        left = window.innerWidth - popoverWidth - 16;
      }
      if (left < 16) left = 16;

      setCoords({
        top: rect.bottom + window.scrollY + 6,
        left,
      });
    }
  }, [isOpen, triggerRef]);

  // Handle click-away
  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(e: MouseEvent) {
      if (
        popoverRef.current &&
        !popoverRef.current.contains(e.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(e.target as Node)
      ) {
        onClose();
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose, triggerRef]);

  if (!isOpen || !coords) return null;

  return createPortal(
    <AnimatePresence>
      <div 
        className="absolute z-[99999]" 
        style={{ top: coords.top, left: coords.left }}
        ref={popoverRef}
        id="quick-edit-popover-portal"
      >
        <motion.div
          initial={{ opacity: 0, y: -6, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -6, scale: 0.96 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="w-[260px] p-3.5 bg-[var(--theme-surface-void)]/95 border border-white/10 rounded-2xl shadow-2xl backdrop-blur-xl text-white select-none relative"
        >
          {/* Header section */}
          <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-white/5">
            <span className="text-dcx-xs font-black tracking-widest uppercase font-sans text-neutral-400">
              {title}
            </span>
            <button
              onClick={onClose}
              className="p-1 rounded hover:bg-white/5 text-neutral-400 hover:text-white transition-all cursor-pointer outline-none"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Children container */}
          <div className="max-h-[280px] overflow-y-auto pr-0.5 [scrollbar-width:thin] scrollbar-thin">
            {children}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>,
    document.body
  );
}
