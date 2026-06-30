import React, { useState } from "react";
import { Link as LinkIcon, X, FileText, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { EnrichedVersion } from "../../../../../types";
import { PopoverShell } from "../../../../../components/ui/PopoverShell";
import { useTheme } from "../../../../../hooks/useTheme";


interface FilesConnectionProps {
  currentVersion: EnrichedVersion;
}

export function FilesConnection({ currentVersion }: FilesConnectionProps) {
  const { isDark } = useTheme();
  const { attachments = [] } = currentVersion;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative inline-block">
      {/* 1. Collapsed Pill Indicator Button */}
      <button
        id="metadata-files-btn"
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 font-sans cursor-pointer hover:scale-105 active:scale-95 select-none ${
          isOpen
            ? "bg-[#75E2FF]/15 border-[#75E2FF]/35 text-[#75E2FF] shadow-[0_0_12px_rgba(117,226,255,0.2)]"
            : isDark
            ? "bg-white/5 border-white/5 text-neutral-300 hover:text-[#75E2FF] hover:border-[#75E2FF]/20 hover:bg-white/10"
            : "bg-[#151516]/5 border-black/5 text-neutral-600 hover:text-[#75E2FF] hover:border-[#75E2FF]/25 hover:bg-neutral-100"
        }`}
        title={`${attachments.length} Connected Documents`}
      >
        <LinkIcon className="w-4 h-4 text-current" />
        <span className="text-[10.5px] font-black font-sans leading-none">
          {attachments.length}
        </span>
      </button>

      {/* 2. Downward Dropdown Popup with Click-Outside Trigger */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop for click outside */}
            <div
              id="files-popup-backdrop"
              onClick={() => setIsOpen(false)}
              className="fixed inset-0 z-40 bg-transparent cursor-default"
            />

            {/* Popup floating down */}
            <motion.div
              id="files-dropdown-popup"
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
                    Resources
                  </span>
                  <span className="text-[11px] font-extrabold tracking-tight mt-0.5 uppercase leading-none">
                    Files ({attachments.length})
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

              {/* Files/Attachments List */}
              <div className="space-y-2 max-h-48 overflow-y-auto pr-0.5 custom-scrollbar">
                {attachments.map((file, index) => {
                  return (
                    <a
                      key={file.title + index}
                      href={file.url}
                      target="_blank"
                      referrerPolicy="no-referrer"
                      rel="noopener noreferrer"
                      className={`flex items-center gap-2.5 p-2 rounded-xl transition-all duration-300 border text-left group leading-none ${
                        isDark 
                          ? "bg-white/5 border-white/5 hover:bg-white/10 hover:border-[#75E2FF]/35 text-white" 
                          : "bg-black/5 border-transparent hover:bg-[#75E2FF]/5 hover:border-[#75E2FF]/20 text-neutral-800"
                      }`}
                    >
                      {/* Document Icon */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center border shrink-0 transition-colors ${
                        isDark 
                          ? "bg-neutral-800 border-white/10 text-neutral-300 group-hover:text-[#75E2FF]" 
                          : "bg-neutral-100 border-neutral-200 text-neutral-600 group-hover:text-[#51bcd8]"
                      }`}>
                        <FileText className="w-4 h-4" />
                      </div>

                      {/* Display Stack */}
                      <div className="min-w-0 flex-1">
                        <p className="text-[11px] font-extrabold truncate pr-1">
                          {file.title}
                        </p>
                        <p className="text-[8px] font-bold text-[#75E2FF] mt-1 flex items-center gap-1 opacity-70 group-hover:opacity-100">
                          <span>View resource</span>
                          <ExternalLink className="w-2.5 h-2.5" />
                        </p>
                      </div>
                    </a>
                  );
                })}

                {attachments.length === 0 && (
                  <div className="text-center py-4 text-[10px] opacity-40 font-bold tracking-wide uppercase">
                    No linked documents
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
