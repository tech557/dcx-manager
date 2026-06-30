import React from "react";
import { FileText, Link2 } from "lucide-react";

interface ProjectNavigationProps {
  activeTab: "brief" | "attachments";
  setActiveTab: (tab: "brief" | "attachments") => void;
  isDark: boolean;
  attachmentsCount: number;
}

export function ProjectNavigation({
  activeTab,
  setActiveTab,
  isDark,
  attachmentsCount,
}: ProjectNavigationProps) {
  return (
    <div
      className={`flex items-center gap-2 p-1.5 rounded-2xl border transition-all duration-300 w-full ${
        isDark ? "bg-white/[0.02] border-white/5" : "bg-black/[0.02] border-black/5"
      }`}
    >
      <button
        type="button"
        onClick={() => setActiveTab("brief")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
          activeTab === "brief"
            ? isDark
              ? "bg-[#75E2FF]/10 text-primary border border-[#75E2FF]/20"
              : "bg-black text-white border border-transparent"
            : isDark
            ? "text-white/50 border border-transparent hover:bg-white/5 hover:text-white"
            : "text-black/50 border border-transparent hover:bg-black/5 hover:text-black"
        }`}
      >
        <FileText className="w-4 h-4" />
        <span>Sandbox Briefing</span>
      </button>

      <button
        type="button"
        onClick={() => setActiveTab("attachments")}
        className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all duration-300 cursor-pointer ${
          activeTab === "attachments"
            ? isDark
              ? "bg-[#75E2FF]/10 text-primary border border-[#75E2FF]/20"
              : "bg-black text-white border border-transparent"
            : isDark
            ? "text-white/50 border border-transparent hover:bg-white/5 hover:text-white"
            : "text-black/50 border border-transparent hover:bg-black/5 hover:text-black"
        }`}
      >
        <Link2 className="w-4 h-4" />
        <span>Attached Assets</span>
        <span
          className={`px-2 py-0.5 rounded-full text-[9px] font-bold font-mono transition-colors duration-300 ${
            activeTab === "attachments"
              ? isDark
                ? "bg-[#75E2FF]/20 text-[#75E2FF]"
                : "bg-white/20 text-white"
              : isDark
              ? "bg-white/10 text-white/60"
              : "bg-black/10 text-black/60"
          }`}
        >
          {attachmentsCount}
        </span>
      </button>
    </div>
  );
}
