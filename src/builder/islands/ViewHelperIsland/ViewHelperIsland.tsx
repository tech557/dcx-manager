import { motion, AnimatePresence } from 'motion/react';
import { Columns, X, Sparkles, Layers } from 'lucide-react';
import { useViewHelper } from './useViewHelper';
import { useViewHelperScrollers } from './useViewHelperScrollers';
import { ViewContextTaskList } from './ViewContextTaskList';

export function ViewHelperIsland() {
  const {
    isExpanded,
    setIsExpanded,
  } = useViewHelper();

  const {
    view,
  } = useViewHelperScrollers();

  if (view === 'kanban') {
    return null;
  }

  return (
    <div className="relative w-14 h-14 flex items-center justify-end pointer-events-auto" id="view-helper-island-wrapper">
      <AnimatePresence mode="wait">
        {!isExpanded ? (
          <motion.button
            key="collapsed"
            type="button"
            onClick={() => setIsExpanded(true)}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="w-11 h-11 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/10 text-[var(--theme-accent)] border border-white/10 hover:border-white/[0.08] shadow-[0_0_15px_var(--theme-selected-glow)] cursor-pointer group hover:scale-[1.03] transition-all duration-300"
            title="Open View Helpers"
            aria-label="Open View Helpers"
          >
            <Columns className="w-5 h-5 animate-pulse" />
          </motion.button>
        ) : (
          <>
            {/* Stable trigger placeholder to preserve layout metrics inside the footer columns */}
            <div className="w-11 h-11 rounded-full flex items-center justify-center bg-[var(--theme-accent)]/10 text-[var(--theme-accent)]/60 border border-[var(--theme-accent)]/20 opacity-30 select-none">
              <Columns className="w-5 h-5" />
            </div>

            {/* Sticky, floating, resizable overlay popup */}
            <motion.div
              layoutId="view-helper-island"
              id="view-helper-island"
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ type: 'spring', damping: 26, stiffness: 220 }}
              className="fixed bottom-[100px] right-6 z-[100] rounded-[2rem] border border-white/10 bg-[var(--theme-glass-bg)] backdrop-blur-xl shadow-[0_12px_45px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden select-none"
              style={{
                resize: 'both',
                width: '340px',
                height: '420px',
                minWidth: '290px',
                minHeight: '280px',
                maxWidth: '520px',
                maxHeight: '650px',
              }}
            >
              <div className="flex flex-col h-full w-full p-4 overflow-hidden text-left" id="view-helper-expanded-content">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5 mb-3 shrink-0">
                  <div className="flex items-center gap-2">
                    <div className="p-1 px-1.5 rounded-lg bg-[var(--theme-accent)]/10 text-[var(--theme-accent)]">
                      <Layers size={14} />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-dcx-3xs font-black tracking-[0.25em] uppercase opacity-40">PERSPECTIVE</span>
                      <span className="text-dcx-sm font-bold text-[var(--theme-accent)]">View &amp; Stage Helper</span>
                    </div>
                  </div>
                  
                  <button
                    type="button"
                    onClick={() => setIsExpanded(false)}
                    className="p-1 rounded-full hover:bg-white/10 hover:text-white transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                {/* List contents */}
                <div className="flex-1 overflow-hidden min-h-0 text-dcx-md">
                  <ViewContextTaskList />
                </div>

                {/* Footer instruction */}
                <div className="mt-2 text-dcx-2xs opacity-40 uppercase border-t border-white/10 pt-2 shrink-0 flex items-center gap-1 select-none">
                  <Sparkles className="text-[var(--theme-accent)] w-3 h-3 animate-pulse shrink-0" />
                  <span>Interactive View Helper Overlay</span>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
