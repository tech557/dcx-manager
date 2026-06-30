import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { X, Search, Activity, ArrowRight } from "lucide-react";
import { PopoverShell } from "../../../../components/ui/PopoverShell";
import { useTheme } from "../../../../hooks/useTheme";


interface ActionLocatePopupProps {
  isOpen: boolean;
  onClose: () => void;
  phases: any[];
  onLocate: (id: string, type: "action") => void;
}

export function ActionLocatePopup({
  isOpen,
  onClose,
phases,
  onLocate,
}: ActionLocatePopupProps) {
  const { isDark } = useTheme();
  const [search, setSearch] = useState("");

  const actionsList = useMemo(() => {
    const list: { id: string; name: string; phaseId: string; phaseLabel: string }[] = [];
    phases.forEach((p, idx) => {
      const phaseLabel = p.data?.label || `Phase ${idx + 1}`;
      const actionCards = p.data?.actionCards || [];
      actionCards.forEach((action: any) => {
        list.push({
          id: action.id,
          name: action.name || "Unnamed Action",
          phaseId: p.id,
          phaseLabel
        });
      });
    });
    return list;
  }, [phases]);

  const filteredActions = useMemo(() => {
    return actionsList.filter((action) => {
      return (
        action.name.toLowerCase().includes(search.toLowerCase()) ||
        action.phaseLabel.toLowerCase().includes(search.toLowerCase())
      );
    });
  }, [actionsList, search]);

  // Dispatch custom hover event to light up / glow the card on the board
  const handleItemHover = (id: string, isHovering: boolean) => {
    if (isHovering) {
      window.dispatchEvent(
        new CustomEvent("object-created", {
          detail: { id, type: "action" },
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
                  Find Action
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
                placeholder="Search action cards..."
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
              {filteredActions.map((action) => {
                return (
                  <button
                    key={action.id}
                    type="button"
                    onMouseEnter={() => handleItemHover(action.id, true)}
                    onClick={() => {
                      onLocate(action.id, "action");
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
                        <Activity className="w-3.5 h-3.5" />
                      </div>
                      <div className="min-w-0">
                        <span className="block text-[7px] font-mono tracking-wider opacity-40 leading-none truncate uppercase">
                          IN: {action.phaseLabel}
                        </span>
                        <span className="block text-xs font-bold truncate mt-0.5 leading-none">
                          {action.name}
                        </span>
                      </div>
                    </div>

                    <ArrowRight className="w-3.5 h-3.5 opacity-30 shrink-0 select-none ml-2" />
                  </button>
                );
              })}

              {filteredActions.length === 0 && (
                <div className="text-center py-8 text-xs opacity-50 font-sans font-medium">
                  No matching action cards
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
