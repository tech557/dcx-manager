import React from "react";
import { 
  Layers, 
  ExternalLink, 
  FileText, 
  Layout, 
  FileCode, 
  FileSpreadsheet, 
  Presentation, 
  Users, 
  Clock,
  Calendar,
  Check,
  Play
} from "lucide-react";
import { EnrichedVersion } from "../../../types";
import { MOCK_USERS } from "../../../mock/users";
import { CollaboratorsAvatars, CollaboratorItem } from "./CollaboratorsAvatars";
import { GlassCard, FileTag, MiniBuilderCanvas } from "../../../components/ui";

interface VersionSummaryProps {
  isDark: boolean;
  currentVersion: EnrichedVersion;
  onLaunchBuilder?: () => void;
}

const ROLE_LABELS_MAP: { [key: string]: string } = {
  COA: "COMMUNICATION ASSOCIATE",
  ICS: "INTERNAL COMMUNICATION STRATEGIST",
  CCW: "CREATIVE COPY WRITER",
  EXD: "EXPERIENCE DESIGNER",
  TEC: "TECH",
};

export function VersionSummary({
  isDark,
  currentVersion,
  onLaunchBuilder,
}: VersionSummaryProps) {
  const attachments = currentVersion.attachments || [];
  const assignedTeam = currentVersion.assignedTeam || [];

  const [hoveredStagingCollaborator, setHoveredStagingCollaborator] = React.useState<CollaboratorItem | null>(null);

  const stagingCollaborators: CollaboratorItem[] = assignedTeam.map((member) => {
    const userDetail = MOCK_USERS.find((u) => u.id === member.userId) || null;
    return {
      roleKey: member.role,
      roleLabel: ROLE_LABELS_MAP[member.role] || member.role,
      userDetail,
    };
  });

  const anchorDateStr = currentVersion.communicatedDate || "2026-03-08";

  return (
    <GlassCard
      isDark={isDark}
      className="flex flex-col h-full font-sans"
    >
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 pb-4 border-b border-current/[0.05]">
        <div className="space-y-1">
          <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-30 block leading-none">
            Active Version Workspace
          </span>
          <h3 className={`text-xl font-black tracking-tight ${isDark ? "text-white" : "text-black"}`}>
            Version Sandbox Console
          </h3>
        </div>

        {/* Labeled Link back to Switchboard selection */}
        <div className="flex items-center gap-2">
          <span className="text-[9px] font-mono opacity-40 font-black uppercase tracking-wider">
            Linked Context:
          </span>
          <a
            href="#campaign-switchboard"
            className={`px-3 py-1.5 rounded-xl text-[10px] font-black tracking-tight flex items-center gap-1.5 transition-all duration-300 border hover:scale-[1.02] cursor-pointer ${
              isDark
                ? "bg-[#75E2FF]/15 border-[#75E2FF]/30 text-primary hover:bg-[#75E2FF]/25 hover:border-primary/50"
                : "bg-black/5 border-black/10 text-black hover:bg-black/10"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Version {currentVersion.versionNumber}</span>
            <ExternalLink className="w-3" />
          </a>
        </div>
      </div>

      {/* Main Layout Area: Stacked components with side-by-side lower compartments */}
      <div className="flex-1 flex flex-col gap-6 min-h-0 overflow-y-auto custom-scrollbar pr-1 pb-2">
        {/* Row 1: Sandbox Interactive Preview */}
        <div className="flex flex-col w-full shrink-0">
          <MiniBuilderCanvas
            phases={currentVersion.phases}
            isDark={isDark}
            anchorDateStr={anchorDateStr}
          />
          
          {/* Launch Call to action */}
          <div className="mt-3.5 pt-3.5 border-t border-current/[0.03] flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-1.5">
              <Play className="w-3 h-3 text-primary animate-pulse" />
              <span className="text-[9px] font-mono opacity-45 font-bold">
                Wired directly with the campaign builder state. Click launch to modify.
              </span>
            </div>
            <button
              type="button"
              onClick={onLaunchBuilder}
              className={`px-4 py-2 rounded-full text-[9px] font-black tracking-[0.12em] uppercase flex items-center gap-1.5 border transition-all duration-300 hover:scale-[1.02] cursor-pointer shadow-sm ${
                isDark
                  ? "bg-[#75E2FF]/10 text-primary border-[#75E2FF]/20 hover:bg-[#75E2FF]/20 hover:border-primary"
                  : "bg-black text-white border-black hover:bg-neutral-800"
              }`}
            >
              <Layout className="w-3 h-3" />
              <span>Launch Canvas</span>
            </button>
          </div>
        </div>

        {/* Row 2: Resources & Staging Crew Side-by-Side */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full shrink-0">
          {/* Section 2: Workspace Resources */}
          <div className="flex flex-col min-h-[140px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-30 block">
                2. Workspace Resources
              </span>
              <span className="px-2 py-0.5 rounded-md text-[8px] font-mono font-black bg-current/[0.05] opacity-50">
                {attachments.length} files
              </span>
            </div>

            <div
              className={`flex-1 rounded-[1.5rem] border p-3.5 overflow-x-auto custom-scrollbar flex flex-row justify-start items-center gap-4 h-[110px] sm:h-[120px] ${
                isDark ? "bg-black/10 border-white/5" : "bg-[#FDFDFD] border-black/5"
              }`}
            >
              {attachments.length > 0 ? (
                attachments.map((file, i) => (
                  <FileTag
                    key={i}
                    title={file.title}
                    url={file.url}
                    isDark={isDark}
                  />
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                  <FileCode className="w-6 h-6 opacity-25 mb-1 text-primary" />
                  <h5 className={`text-[10px] font-black ${isDark ? "text-white" : "text-black"}`}>
                    No Documents Attached
                  </h5>
                </div>
              )}
            </div>
          </div>

          {/* Section 3: Active Version Crew */}
          <div className="flex flex-col min-h-[140px]">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-30 block">
                3. Version Staging Crew
              </span>
              <span className="px-2 py-0.5 rounded-md text-[8px] font-mono font-black bg-current/[0.05] opacity-50">
                {assignedTeam.length} active
              </span>
            </div>

            <div
              className={`flex-1 rounded-[1.5rem] border p-4 flex flex-row items-center justify-between gap-4 h-[110px] sm:h-[120px] ${
                isDark ? "bg-black/10 border-white/5" : "bg-[#FDFDFD] border-black/5"
              }`}
            >
              {assignedTeam.length > 0 ? (
                <>
                  <div className="flex flex-col items-start gap-1 min-w-0 flex-1">
                    <span className="text-[9.5px] font-black tracking-[0.2em] uppercase opacity-30 select-none pb-0.5">
                      Staging Role Inspect
                    </span>
                    <div className="min-h-[22px] flex items-center min-w-0">
                      {hoveredStagingCollaborator ? (
                        <p className="text-[10px] leading-none animate-slideUp font-bold tracking-tight truncate">
                          <span className="font-extrabold uppercase tracking-wide opacity-50 mr-1 text-primary">
                            {hoveredStagingCollaborator.roleKey}:
                          </span>
                          <strong className={`font-black uppercase ${isDark ? "text-primary" : "text-black"}`}>
                            {hoveredStagingCollaborator.userDetail ? hoveredStagingCollaborator.userDetail.name : "Unassigned"}
                          </strong>
                          {hoveredStagingCollaborator.userDetail && (
                            <span className="opacity-45 font-mono text-[8px] ml-1.5 font-bold hidden sm:inline">
                              // {hoveredStagingCollaborator.userDetail.title}
                            </span>
                          )}
                        </p>
                      ) : (
                        <p className="text-[8.5px] opacity-35 leading-none font-bold font-mono">
                          // Hover avatar to inspect active staff
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <CollaboratorsAvatars
                      collaborators={stagingCollaborators}
                      isDark={isDark}
                      onHoverCollaborator={setHoveredStagingCollaborator}
                    />
                  </div>
                </>
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-4 text-center">
                  <Users className="w-5 h-5 opacity-25 mb-1 text-primary" />
                  <h5 className={`text-[10px] font-black ${isDark ? "text-white" : "text-black"}`}>
                    No Active Crew Assigned
                  </h5>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}
