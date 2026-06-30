import React from "react";
import { Layers, Calendar, Plus } from "lucide-react";
import { EnrichedVersion } from "../../../types";
import { GlassCard } from "../../../components/ui";

interface VersionSwitchBarProps {
  isDark: boolean;
  currentVersion: EnrichedVersion;
  allVersions: EnrichedVersion[];
  onSelectVersion: (versionId: string) => void;
  onAddClick?: () => void;
}

export function VersionSwitchBar({
  isDark,
  currentVersion,
  allVersions,
  onSelectVersion,
  onAddClick,
}: VersionSwitchBarProps) {
  // Filter versions to only those belonging to the same dcx campaign
  const campaignVersions = allVersions.filter(
    (v) => v.dcxId === currentVersion.dcxId
  );

  return (
    <GlassCard
      id="campaign-switchboard"
      isDark={isDark}
      className="flex flex-col h-full"
    >
      <div className="flex items-center justify-between mb-4">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-30 block leading-none">
            Campaign Log
          </span>
          <h3 className={`text-base font-black tracking-tight ${isDark ? "text-white" : "text-black"}`}>
            Available Versions
          </h3>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md text-[9px] font-mono font-black bg-primary/10 text-primary border border-primary/20">
            {campaignVersions.length} Total
          </span>
          {onAddClick && (
            <button
              onClick={onAddClick}
              className="p-1 rounded-md bg-primary text-black hover:bg-opacity-80 hover:scale-[1.05] active:scale-[0.98] transition-all flex items-center justify-center cursor-pointer"
              title="Create New Sequence Version"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          )}
        </div>
      </div>

      {/* Version list */}
      <div className="space-y-2.5 overflow-y-auto min-h-0 pr-1 flex-1 custom-scrollbar">
        {campaignVersions.map((v) => {
          const isActive = v.id === currentVersion.id;
          return (
            <button
              key={v.id}
              onClick={() => onSelectVersion(v.id)}
              className={`w-full text-left p-3.5 rounded-2xl border transition-all duration-300 flex items-center justify-between group cursor-pointer ${
                isActive
                  ? isDark
                    ? "bg-[#75E2FF]/10 border-primary text-white"
                    : "bg-black border-black text-white"
                  : isDark
                  ? "bg-white/[0.01] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
                  : "bg-black/[0.01] border-black/5 hover:bg-black/[0.03] hover:border-black/10"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  className={`p-2 rounded-xl transition-colors duration-300 ${
                    isActive
                      ? "bg-primary text-black"
                      : isDark
                      ? "bg-white/5 text-white/40 group-hover:text-white"
                      : "bg-black/5 text-black/40 group-hover:text-black"
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-black tracking-tight">
                      {v.versionNumber}
                    </span>
                    {isActive && (
                      <span className="text-[8px] font-black uppercase bg-emerald-500/15 text-emerald-400 px-1.5 py-0.5 rounded-md tracking-wider">
                        Active Space
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1.5 opacity-40 text-[9px] font-mono mt-0.5 font-black">
                    <Calendar className="w-2.5 h-2.5" />
                    <span>{v.createdAt}</span>
                  </div>
                </div>
              </div>

              {/* Status flag */}
              <span
                className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-[0.05em] font-mono border ${
                  v.status === "Approved"
                    ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/15"
                    : v.status === "Ready for Review"
                    ? "bg-[#75E2FF]/10 text-primary border-[#75E2FF]/15"
                    : "bg-amber-500/10 text-amber-400 border-amber-500/15"
                }`}
              >
                {v.status}
              </span>
            </button>
          );
        })}
      </div>
    </GlassCard>
  );
}
