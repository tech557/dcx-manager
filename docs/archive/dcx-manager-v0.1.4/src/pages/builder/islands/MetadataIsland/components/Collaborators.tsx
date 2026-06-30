import React, { useState } from "react";
import { Users, X } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EnrichedVersion } from "../../../../../types";
import { MOCK_USERS } from "../../../../../mock/users";
import { PopoverShell } from "../../../../../components/ui/PopoverShell";
import { useTheme } from "../../../../../hooks/useTheme";


interface CollaboratorsProps {
  currentVersion: EnrichedVersion;
}

export function Collaborators({ currentVersion }: CollaboratorsProps) {
  const { isDark } = useTheme();
  const { assignedTeam = [] } = currentVersion;
  const [isOpen, setIsOpen] = useState(false);

  // Helper to extract initials
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  return (
    <div className="relative inline-block">
      {/* 1. Collapsed Pill Indicator Button */}
      <button
        id="metadata-collaborators-btn"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 font-sans cursor-pointer hover:scale-105 active:scale-95 select-none ${
          isOpen
            ? "bg-[#75E2FF]/15 border-[#75E2FF]/35 text-[#75E2FF] shadow-[0_0_12px_rgba(117,226,255,0.2)]"
            : isDark
            ? "bg-white/5 border-white/5 text-neutral-300 hover:text-[#75E2FF] hover:border-[#75E2FF]/20 hover:bg-white/10"
            : "bg-[#151516]/5 border-black/5 text-neutral-600 hover:text-[#75E2FF] hover:border-[#75E2FF]/25 hover:bg-neutral-100"
        }`}
        title={`${assignedTeam.length} Assigned Collaborators`}
      >
        <Users className="w-4 h-4 text-current" />
        <span className="text-[10.5px] font-black font-sans leading-none">
          {assignedTeam.length}
        </span>
      </button>

      {/* 2. Downward Dropdown Popup with Click-Outside Trigger */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for click outside */}
            <div
              id="collaborators-popup-backdrop"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-transparent cursor-default"
            />

            {/* Popup floating down */}
            <motion.div
              id="collaborators-dropdown-popup"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ type: "spring", stiffness: 350, damping: 26 }}
              className="absolute top-full mt-2.5 left-1/2 -translate-x-1/2 z-50"
            >
              <PopoverShell
                width="w-72"
                className="relative p-4 flex flex-col gap-3 select-none text-left"
              >
              {/* Header section */}
              <div className="flex items-center justify-between pb-1.5 border-b border-current/[0.06]">
                <div className="flex flex-col">
                  <span className="text-[8px] font-black tracking-[0.2em] text-[#75E2FF] uppercase font-sans">
                    Collaborators
                  </span>
                  <span className="text-[11px] font-extrabold tracking-tight mt-0.5 uppercase leading-none">
                    Assigned Team ({assignedTeam.length})
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className={`p-1 rounded-full transition-all cursor-pointer ${
                    isDark ? "hover:bg-white/10 text-neutral-400 hover:text-white" : "hover:bg-black/5 text-neutral-500 hover:text-black"
                  }`}
                >
                  <X className="w-3 h-3" />
                </button>
              </div>

              {/* Members List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5 custom-scrollbar">
                {assignedTeam.map((member, index) => {
                  const userDetail = MOCK_USERS.find((u) => u.id === member.userId);
                  const userName = userDetail ? userDetail.name : `User ${member.userId}`;
                  const initials = getInitials(userName);

                  return (
                    <div
                      key={member.userId + index}
                      className={`flex items-center gap-2.5 p-2 rounded-xl transition-all duration-300 border ${
                        isDark 
                          ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/10 text-white" 
                          : "bg-black/5 border-transparent hover:bg-neutral-50 hover:border-black/5 text-neutral-800"
                      }`}
                    >
                      {/* Avatar with initials */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-black uppercase font-sans border tracking-wider shrink-0 ${
                        isDark 
                          ? "bg-neutral-800 border-white/10 text-[#75E2FF]" 
                          : "bg-[#75E2FF]/10 border-[#75E2FF]/20 text-[#51bcd8]"
                      }`}>
                        {initials}
                      </div>

                      {/* Display Stack */}
                      <div className="min-w-0 flex-1 leading-none">
                        <p className="text-[11.5px] font-extrabold truncate">
                          {userName}
                        </p>
                        <p className={`text-[8.5px] font-semibold mt-1 opacity-50 uppercase tracking-wider font-sans`}>
                          {member.role || "Team Member"}
                        </p>
                      </div>
                    </div>
                  );
                })}

                {assignedTeam.length === 0 && (
                  <div className="text-center py-4 text-[10px] opacity-40 font-bold tracking-wide uppercase">
                    No active assignments
                  </div>
                )}
              </div>
              </PopoverShell>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
