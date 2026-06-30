import React, { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { EnrichedVersion, VersionStatus } from "../../types";
import { Popup } from "../../components/popup/Popup";
import { MOCK_USERS } from "../../mock/users";
import { CollaboratorsAvatars, CollaboratorItem } from "./components/CollaboratorsAvatars";
import { VersionSwitchBar } from "./components/VersionSwitchBar";
import { VersionSummary } from "./components/VersionSummary";
import { GlassCard } from "../../components/ui";
import { EditVersionForm } from "../../components/forms";
import { VersionStatusBar } from "./components/VersionStatusBar";
import { generateId } from "../../utils/id.helpers";

interface VersionPageProps {
  isDark: boolean;
  versionId: string;
  versions: EnrichedVersion[];
  onBack: () => void;
  onSelectVersion?: (id: string) => void;
  onUpdateVersionStatus?: (id: string, status: VersionStatus) => void;
  onAddVersion?: (newVersion: EnrichedVersion) => void;
  onLaunchBuilder?: () => void;
}

const ROLE_LABELS_MAP: { [key: string]: string } = {
  COA: "COMMUNICATION ASSOCIATE",
  ICS: "INTERNAL COMMUNICATION STRATEGIST",
  CCW: "CREATIVE COPY WRITER",
  EXD: "EXPERIENCE DESIGNER",
  TEC: "TECH",
};

export default function VersionPage({
  isDark,
  versionId,
  versions,
  onBack,
  onSelectVersion,
  onUpdateVersionStatus,
  onAddVersion,
  onLaunchBuilder,
}: VersionPageProps) {
  const [hoveredCollaborator, setHoveredCollaborator] = useState<CollaboratorItem | null>(null);

  // Sequence Creation Popup State
  const [isAddPopupOpen, setIsAddPopupOpen] = useState(false);
  const [addStep, setAddStep] = useState<"options" | "scratch">("options");
  const [newVerNumber, setNewVerNumber] = useState("");

  const currentVersion = versions.find((v) => v.id === versionId);

  // If no version is found, show friendly missing screen
  if (!currentVersion) {
    return (
      <main className="relative z-10 px-4 sm:px-10 pt-8 pb-10 w-full max-w-[1800px] mx-auto min-h-screen flex flex-col justify-center items-center font-sans">
        <GlassCard
          isDark={isDark}
          className="p-10 text-center max-w-md"
        >
          <span className="text-[10px] font-black tracking-[0.3em] uppercase opacity-30 text-rose-500 block mb-4">
            Security Sandbox Fault
          </span>
          <h2 className="text-xl font-black tracking-tight mb-2">Version Workspace Not Found</h2>
          <p className="text-xs opacity-60 mb-6 font-bold leading-relaxed">
            The requested campaign sandbox instance either does not exist, has expired, or is currently unindexed.
          </p>
          <button
            onClick={onBack}
            className="w-full py-3 bg-primary text-black text-xs font-bold rounded-xl hover:scale-[1.01] hover:shadow-[0_4px_16px_rgba(117,226,255,0.25)] transition-all duration-300 cursor-pointer"
          >
            Return to Dashboard
          </button>
        </GlassCard>
      </main>
    );
  }

  // Filter versions belonging to the same campaigns portfolio to auto-increment sequences
  const campaignVersions = versions.filter((v) => v.dcxId === currentVersion.dcxId);

  const calculateNextVersion = (projectVersions: string[]): string => {
    if (projectVersions.length === 0) return "V1";
    const versionNumbers = projectVersions.map((v) => {
      const match = v.match(/v(\d+)/i);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxVal = Math.max(0, ...versionNumbers);
    return `V${maxVal + 1}`;
  };

  const handleCreateNewSequenceSubmit = (newVersion: EnrichedVersion) => {
    if (onAddVersion) {
      // Set default creation properties in the submitted new form
      onAddVersion({
        ...newVersion,
        versionNumber: newVersion.versionNumber.toUpperCase().startsWith("V") 
          ? newVersion.versionNumber.toUpperCase() 
          : `V${newVersion.versionNumber}`
      });
    }
    setIsAddPopupOpen(false);
  };

  // Map Campaign Collaborators as unique values of users across all versions of this campaign
  const uniqueUserIds = Array.from(
    new Set(campaignVersions.flatMap((v) => v.assignedTeam?.map((m) => m.userId) || []))
  );

  const campaignCollaboratorsList: CollaboratorItem[] = uniqueUserIds.map((userId) => {
    const userDetail = MOCK_USERS.find((u) => u.id === userId) || null;
    let matchedRoleKey = "STAFF";
    let matchedRoleLabel = userDetail ? userDetail.title : "Contributor";
    
    for (const v of campaignVersions) {
      const match = v.assignedTeam?.find((m) => m.userId === userId);
      if (match) {
        matchedRoleKey = match.role;
        matchedRoleLabel = ROLE_LABELS_MAP[match.role] || match.role;
        break;
      }
    }
    
    return {
      roleKey: matchedRoleKey,
      roleLabel: matchedRoleLabel,
      userDetail,
    };
  });

  // Create a template version structure for the edit/create form to use
  const templateDraftVersion: EnrichedVersion = {
    id: `v-${generateId()}`,
    dcxId: currentVersion.dcxId,
    versionNumber: newVerNumber,
    status: "In Progress",
    createdAt: new Date().toISOString().split("T")[0],
    createdBy: "u-1",
    lastUpdatedAt: new Date().toISOString().split("T")[0],
    lastUpdatedBy: "u-1",
    assignedTeam: [],
    attachments: [],
    dcx: currentVersion.dcx,
  };

  return (
    <main className="relative z-10 px-4 sm:px-10 pt-2 w-full max-w-[1800px] mx-auto h-auto lg:h-[calc(100vh-140px)] flex flex-col justify-start font-sans lg:overflow-hidden pb-10 lg:pb-0">
      <div className="flex flex-col gap-6 h-full pb-6 sm:pb-8 min-h-0">
        
        {/* Campaign Header */}
        <div className="w-full flex flex-col md:flex-row md:items-center justify-between pb-3.5 border-b border-current/[0.04] gap-4 shrink-0">
          <div className="flex items-center gap-4 min-w-0">
            <button
              id="back-to-home-btn"
              onClick={onBack}
              className={`p-3 rounded-2xl border transition-all duration-300 cursor-pointer shrink-0 hover:scale-[1.05] ${
                isDark
                  ? "bg-white/5 border-white/5 text-white/60 hover:bg-[#75E2FF]/10 hover:border-[#75E2FF]/20 hover:text-primary shadow-[0_0_15px_rgba(117,226,255,0.05)]"
                  : "bg-black/5 border-black/5 text-black/60 hover:bg-[#75E2FF]/5 hover:border-[#75E2FF]/30 hover:text-[#3a8b9f]"
              }`}
              title="Back to Campaign Dashboard"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <div className="min-w-0 flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-[10px] font-black tracking-[0.3em] uppercase text-primary leading-none">
                  {currentVersion.dcx.client}
                </span>
                <span className="opacity-30 text-[9px] select-none font-mono font-bold leading-none">//</span>
                <span className="text-[9px] font-black tracking-[0.15em] uppercase opacity-60 leading-none">
                  {currentVersion.dcx.product}
                </span>
              </div>

              <h1 className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tightest leading-none ${isDark ? "text-white" : "text-black"}`}>
                {(() => {
                  const name = currentVersion.dcx.projectName;
                  const parts = name.split(" ");
                  if (parts.length > 1) {
                    return (
                      <>
                        <span className="text-primary">{parts[0]}</span>{" "}
                        <span className="font-normal opacity-85">{parts.slice(1).join(" ")}</span>
                      </>
                    );
                  }
                  return <span className="text-primary">{name}</span>;
                })()}
              </h1>
            </div>
          </div>

          <div className="flex flex-col items-start md:items-end gap-1.5 shrink-0">
            <div className="flex items-center gap-4 flex-nowrap">
              <span className="text-[9px] font-black tracking-[0.2em] uppercase opacity-30 select-none hidden sm:inline">
                Team Crew
              </span>
              <CollaboratorsAvatars
                collaborators={campaignCollaboratorsList}
                isDark={isDark}
                onHoverCollaborator={setHoveredCollaborator}
              />
            </div>
            
            <div className="min-h-[16px] flex items-center md:justify-end w-full">
              {hoveredCollaborator ? (
                <p className="text-[10px] leading-none animate-slideUp font-bold tracking-tight text-left md:text-right">
                  <span className="font-extrabold uppercase tracking-wide opacity-50 mr-1 text-primary">
                    {hoveredCollaborator.roleKey}:
                  </span>
                  <strong className={`font-black uppercase ${isDark ? "text-primary" : "text-black"}`}>
                    {hoveredCollaborator.userDetail ? hoveredCollaborator.userDetail.name : "Unassigned"}
                  </strong>
                </p>
              ) : (
                <p className="text-[8.5px] opacity-35 leading-none font-bold font-mono text-left md:text-right w-full">
                  // Hover teammates to inspect roles
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Dynamic Status Update Action Bar banner */}
        {onUpdateVersionStatus && (
          <VersionStatusBar
            isDark={isDark}
            status={currentVersion.status}
            onChangeStatus={(newStatus) => onUpdateVersionStatus(currentVersion.id, newStatus)}
          />
        )}

        {/* Bottom Asymmetrical Grid of Sandbox Controllers */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-stretch w-full flex-1 min-h-0">
          {/* Bottom Left: Switchboard */}
          <div className="lg:col-span-1 h-full min-h-0 flex flex-col">
            <VersionSwitchBar
              isDark={isDark}
              currentVersion={currentVersion}
              allVersions={versions}
              onSelectVersion={onSelectVersion || (() => {})}
              onAddClick={() => {
                const nextVer = calculateNextVersion(campaignVersions.map((v) => v.versionNumber));
                setNewVerNumber(nextVer);
                setAddStep("options");
                setIsAddPopupOpen(true);
              }}
            />
          </div>

          {/* Bottom Right: Version summary console */}
          <div className="lg:col-span-3 h-full min-h-0 flex flex-col">
            <VersionSummary
              isDark={isDark}
              currentVersion={currentVersion}
              onLaunchBuilder={onLaunchBuilder}
            />
          </div>
        </div>
      </div>

      {/* Sequence Initialization Popup Step Dialog wrapping isolated EditVersionForm */}
      <Popup
        isOpen={isAddPopupOpen}
        onClose={() => setIsAddPopupOpen(false)}
        title={addStep === "options" ? "Initialize Experience Sequence" : "Create Sequence Space"}
        subtitle="Campaign Workspace Creator"
        description={
          addStep === "options"
            ? "Initialize a new version sequence for this workspace portfolio. Select either to start a stand-alone workspace from scratch or clone parameters from the current baseline."
            : "Construct a clean sequence holding pre-specified details. Add Google Drive resources or customize team allocations to initiate this sequence."
        }
        isDark={isDark}
        maxWidthClass={addStep === "options" ? "max-w-2xl" : "max-w-5xl"}
      >
        {addStep === "options" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              type="button"
              onClick={() => setAddStep("scratch")}
              className={`p-6 rounded-[2rem] border text-left flex flex-col justify-between group cursor-pointer transition-all duration-300 hover:scale-[1.01] ${
                isDark
                  ? "bg-white/[0.02] border-white/5 hover:border-[#75E2FF]/30 hover:bg-[#75E2FF]/5"
                  : "bg-black/[0.02] border-black/5 hover:border-black/20 hover:bg-black/[0.04]"
              }`}
            >
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-[#75E2FF]/10 text-primary border border-[#75E2FF]/20">
                  Standalone
                </span>
                <h4 className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
                  Create from Scratch
                </h4>
                <p className="text-[10px] leading-relaxed opacity-60 font-bold">
                  Initialize a new sequence utilizing preselected campaign parameters. Client &amp; Project will be locked automatically.
                </p>
              </div>
              <span className="text-primary text-[10px] font-mono font-black mt-4 group-hover:translate-x-1 transition-transform inline-block">
                Proceed &rarr;
              </span>
            </button>

            <button
              disabled
              type="button"
              className={`p-6 rounded-[2rem] border text-left flex flex-col justify-between opacity-50 cursor-not-allowed ${
                isDark ? "bg-white/[0.01] border-white/5" : "bg-black/[0.01] border-black/5"
              }`}
            >
              <div className="space-y-2">
                <span className="px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider bg-amber-500/10 text-amber-500 border border-amber-500/20">
                  Unavailable
                </span>
                <h4 className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
                  Duplicate Existing
                </h4>
                <p className="text-[10px] leading-relaxed opacity-60 font-bold">
                  Clone directories, linked assets, and project collaborator metadata from the active version baseline. (Will build this later)
                </p>
              </div>
              <span className="text-xs font-mono font-black mt-4 opacity-40 text-amber-500">
                Coming Soon
              </span>
            </button>
          </div>
        ) : (
          <EditVersionForm
            isDark={isDark}
            version={templateDraftVersion}
            onSubmit={handleCreateNewSequenceSubmit}
            onCancel={() => setIsAddPopupOpen(false)}
          />
        )}
      </Popup>
    </main>
  );
}
