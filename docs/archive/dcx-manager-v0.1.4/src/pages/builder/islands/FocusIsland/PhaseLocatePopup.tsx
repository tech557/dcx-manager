import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, MapPin, ArrowRight } from "lucide-react";
import { PopoverShell } from "../../../../components/ui/PopoverShell";
import { useTheme } from "../../../../hooks/useTheme";


interface PhaseLocatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  phases: any[];
  onLocate: (id: string, type: "phase") => void;
}

export function PhaseLocatePopup({
  isOpen,
  onClose,
phases,
  onLocate,
}: PhaseLocatePopupProps) {
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");

  const filteredPhases = useMemo(() => {
    return phases.filter((phase, idx) => {
      const label = phase.data?.label || `Phase ${idx + 1}`;
      return label.toLowerCase().includes(search.toLowerCase());
    });
  }, [phases, search]);

  // Dispatch custom hover event to light up / glow the column on the board
  const handleItemHover = (id: string, isHovering: boolean) => {
    if (isHovering) {
      window.dispatchEvent(
        new CustomEvent("object-created", {
          detail: { id, type: "phase" },
        })
      );
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Invisible Backdrop to handle Click Outside closing */}
          <div
            onClick={onClose}
            className="fixed inset-0 z-30 cursor-default pointer-events-auto bg-transparent"
          />

          {/* Connected Floating Glass Overlay Panel (Floats beside the pill) */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, x: 15 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.95, x: 15 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="absolute right-16 top-0 z-40"
          >
            <PopoverShell
              width="w-[300px]"
              className="relative h-[350px] overflow-hidden p-5 flex flex-col gap-3.5 select-none"
            >
            {/* Header capsule */}
            <div className="flex items-center justify-between pb-2 border-b border-current/[0.05]">
              <div className="flex flex-col">
                <span className="text-[8px] font-black tracking-[0.25em] text-[#75E2FF] uppercase font-mono">
                  Stage Locator
                </span>
                <span className="text-xs font-black tracking-tight mt-0.5 font-sans uppercase">
                  Find Phase
                </span>
              </div>

              {/* Close pin */}
              <button
                type="button"
                onClick={onClose}
                className={`p-1.5 rounded-full transition-all cursor-pointer ${
                  isDark
                    ? "hover:bg-white/10 text-neutral-400 hover:text-white"
                    : "hover:bg-black/5 text-neutral-500 hover:text-black"
                }`}
                title="Dismiss locator"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Filter/Search Bar */}
            <div className="relative shrink-0">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 opacity-45 text-current" />
              <input
                type="text"
                placeholder="Search phases..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className={`w-full pl-8.5 pr-3 py-1.5 rounded-xl text-xs border outline-none transition-all duration-300 font-sans font-medium ${
                  isDark
                    ? "bg-black/40 border-white/10 text-white focus:border-[#75E2FF]/60 focus:ring-1 focus:ring-[#75E2FF]/20"
                    : "bg-white border-black/10 text-neutral-800 focus:border-[#75E2FF] focus:ring-1 focus:ring-[#75E2FF]/20"
                }`}
              />
            </div>

            {/* Scrollable list */}
            <div className="flex-1 overflow-y-auto pr-0.5 space-y-1.5 custom-scrollbar min-h-0">
              {filteredPhases.map((phase, idx) => {
                const label = phase.data?.label || `Phase ${idx + 1}`;
                const actionCards = phase.data?.actionCards || [];
                const actionsCount = actionCards.length;
                const tasksCount = actionCards.reduce(
                  (acc: number, c: any) => acc + (c.tasks?.length || 0),
                  0
                );

                return (
                  <button
                    key={phase.id}
                    type="button"
                    onMouseEnter={() => handleItemHover(phase.id, true)}
                    onClick={() => {
                      onLocate(phase.id, "phase");
                      onClose();
                    }}
                    className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all duration-300 hover:scale-[1.01] hover:-translate-y-0.5 cursor-pointer ${
                      isDark
                        ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-[#75E2FF]/35 text-white"
                        : "bg-black/5 border-black/5 hover:bg-white hover:border-[#75E2FF]/40 text-neutral-800 shadow-sm"
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 border ${
                          isDark
                            ? "bg-white/5 border-white/5 text-[#75E2FF]"
                            : "bg-black/5 border-[#151516]/5 text-[#51bcd8]"
                        }`}
                      >
                        <MapPin className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[7px] font-mono tracking-wider opacity-40 leading-none">
                          PHASE {idx + 1}
                        </span>
                        <span className="block text-xs font-bold truncate mt-0.5 leading-none">
                          {label}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      <div className="text-right text-[8px] font-mono font-black opacity-55 px-1.5 py-0.5 rounded bg-current/5 mr-1 font-semibold">
                        <span>{actionsCount}A</span>
                        <span className="mx-0.5">•</span>
                        <span>{tasksCount}T</span>
                      </div>
                      <ArrowRight className="w-3 h-3 opacity-30 group-hover:opacity-100" />
                    </div>
                  </button>
                );
              })}

              {filteredPhases.length === 0 && (
                <div className="text-center py-8 text-xs opacity-50 font-sans font-medium">
                  No matching phases
                </div>
              )}
            </div>
            </PopoverShell>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
