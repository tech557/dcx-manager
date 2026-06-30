import React from "react";
import { Check, Clock, Play, Layers } from "lucide-react";
import { VersionStatus } from "../../../types";

interface VersionStatusBarProps {
  isDark: boolean;
  status: VersionStatus;
  onChangeStatus: (newStatus: VersionStatus) => void;
  id?: string;
}

export function VersionStatusBar({
  isDark,
  status,
  onChangeStatus,
  id
}: VersionStatusBarProps) {
  const statusOptions: VersionStatus[] = [
    "Draft",
    "In Progress",
    "Ready for Review",
    "Approved"
  ];

  return (
    <div
      id={id || "version-status-bar"}
      className={`p-3 px-4 rounded-2xl border flex flex-col sm:flex-row items-center justify-between gap-3 font-sans transition-all duration-300 ${
        isDark ? "bg-black/20 border-white/5" : "bg-[#FAFDFD] border-black/5"
      }`}
    >
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-black uppercase tracking-[0.25em] opacity-40">
          Sandbox Status:
        </span>
        <span
          className={`px-2.5 py-0.5 rounded-lg text-[9px] font-black uppercase tracking-wider font-mono border ${
            status === "Approved"
              ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15"
              : status === "Ready for Review"
              ? "bg-[#75E2FF]/10 text-primary border-[#75E2FF]/15 animate-pulse"
              : status === "Draft"
              ? "bg-neutral-500/10 text-neutral-400 border-neutral-500/15"
              : "bg-amber-500/10 text-amber-400 border-amber-500/15"
          }`}
        >
          {status}
        </span>
      </div>

      <div className="flex items-center gap-1">
        {statusOptions.map((opt) => {
          const isActive = status === opt;
          return (
            <button
              key={opt}
              type="button"
              onClick={() => onChangeStatus(opt)}
              className={`px-3 py-1.5 rounded-lg text-[10px] font-bold tracking-tight border transition-all duration-300 cursor-pointer ${
                isActive
                  ? opt === "Approved"
                    ? "bg-emerald-500/10 border-emerald-500/35 text-emerald-400 font-black"
                    : opt === "Ready for Review"
                    ? "bg-[#75E2FF]/15 border-[#75E2FF]/35 text-primary font-black shadow-[0_0_15px_rgba(117,226,255,0.15)]"
                    : opt === "Draft"
                    ? "bg-white/10 border-white/20 text-white font-black"
                    : "bg-amber-500/10 border-amber-500/35 text-amber-400 font-black"
                  : isDark
                  ? "bg-white/[0.01] border-transparent text-white/40 hover:bg-white/5 hover:text-white/80"
                  : "bg-black/[0.01] border-transparent text-black/40 hover:bg-black/5 hover:text-black/80"
              }`}
            >
              {opt}
            </button>
          );
        })}
      </div>
    </div>
  );
}
