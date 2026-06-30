import React, { useState, useEffect } from "react";
import { EnrichedVersion, DCX, FilterState } from "../../types";
import { fetchClientsWithProjectsSimulated, MockClient } from "../../mock/projects";
import { MOCK_USERS } from "../../mock/users";
import { ClientDropdown } from "./ClientDropdown";
import { ProjectDropdown } from "./ProjectDropdown";
import { BrandedDateInput } from "./BrandedDateInput";
import { CollaboratorsAllocation } from "./CollaboratorsAllocation";
import { DriveResourceAttachments } from "./DriveResourceAttachments";
import { generateId } from "../../utils/id.helpers";

interface CreateDCXFormProps {
  isDark: boolean;
  onSubmit: (newVersion: EnrichedVersion) => void;
  onCancel: () => void;
  versions: EnrichedVersion[];
}

export function CreateDCXForm({
  isDark,
  onSubmit,
  onCancel,
  versions
}: CreateDCXFormProps) {
  // Local state
  const [clientsData, setClientsData] = useState<MockClient[]>([]);
  const [isApiLoading, setIsApiLoading] = useState(false);
  const [selectedClientId, setSelectedClientId] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [newCampaignVersion, setNewCampaignVersion] = useState("V1");
  const [apiLogs, setApiLogs] = useState<string[]>([]);
  const [communicatedDate, setCommunicatedDate] = useState("TBH");
  const [tempAttachments, setTempAttachments] = useState<Array<{ title: string; url: string }>>([]);
  const [assignedTeamRoles, setAssignedTeamRoles] = useState<{ [roleKey: string]: string }>({
    COA: "",
    ICS: "",
    CCW: "",
    EXD: "",
    TEC: ""
  });

  // Load clients data on mount
  useEffect(() => {
    let active = true;
    const fetchClients = async () => {
      setIsApiLoading(true);
      setApiLogs(prev => [...prev, `[GET] /api/v1/clients-projects?timestamp=${Date.now()}`]);
      try {
        const data = await fetchClientsWithProjectsSimulated();
        if (active) {
          setClientsData(data);
          setApiLogs(prev => [
            ...prev,
            `[200 OK] Received ${data.reduce((acc, c) => acc + c.projects.length, 0)} projects nested inside ${data.length} clients.`
          ]);
        }
      } catch {
        if (active) {
          setApiLogs(prev => [...prev, `[500 ERROR] Simulation list endpoint failed.`]);
        }
      } finally {
        if (active) {
          setIsApiLoading(false);
        }
      }
    };

    fetchClients();
    return () => {
      active = false;
    };
  }, []);

  // Helper algorithm to calculate next sequence version number
  const calculateNextVersion = (projectVersions: string[]): string => {
    if (projectVersions.length === 0) return "V1";
    const versionNumbers = projectVersions.map(v => {
      const match = v.match(/v(\d+)/i);
      return match ? parseInt(match[1], 10) : 0;
    });
    const maxVal = Math.max(0, ...versionNumbers);
    return `V${maxVal + 1}`;
  };

  // Deduced product type from project name
  const deduceProduct = (projectName: string): string => {
    const nameLower = projectName.toLowerCase();
    if (nameLower.includes("activation") || nameLower.includes("showcase") || nameLower.includes("gala")) {
      return "Social Engagement";
    }
    if (nameLower.includes("forum") || nameLower.includes("refresh") || nameLower.includes("hub")) {
      return "Nurturing Flow";
    }
    if (nameLower.includes("awareness") || nameLower.includes("initiative")) {
      return "Public Awareness";
    }
    return "Campaign Management";
  };

  const handleSelectProject = (projectId: string, projectName: string) => {
    setSelectedProjectId(projectId);
    setApiLogs(prev => [...prev, `[CHOOSE] Nested Project: ${projectName} (${projectId})`]);

    const existingProjectVersions = versions.filter(v => v.dcx.projectName === projectName);
    if (existingProjectVersions.length > 0) {
      const versionNumbers = existingProjectVersions.map(v => v.versionNumber);
      const nextVer = calculateNextVersion(versionNumbers);
      setNewCampaignVersion(nextVer);
      setApiLogs(prev => [
        ...prev,
        `[CACHE SEARCH] Found ${existingProjectVersions.length} existing version(s). Suggested auto-increment tag: ${nextVer}`
      ]);
    } else {
      setNewCampaignVersion("V1");
      setApiLogs(prev => [
        ...prev,
        `[CACHE SEARCH] No prior versions for "${projectName}". Defaulting tag to V1`
      ]);
    }
  };

  const handleFormSubmit = (customStatus: "Draft" | "In Progress" | "Ready for Review" | "Approved" = "In Progress") => {
    if (!selectedProjectId) {
      setApiLogs(prev => [...prev, `[WARNING] Validation failed: Please select a nested project.`]);
      return;
    }

    const client = clientsData.find(c => c.id === selectedClientId);
    const project = client?.projects.find(p => p.id === selectedProjectId);

    if (!client || !project) {
      setApiLogs(prev => [...prev, `[WARNING] Validation failed: Client or project mismatch.`]);
      return;
    }

    const campaignProduct = deduceProduct(project.name);

    // Check if we already created a version/DCX for this project to retrieve or create DCX
    const matchProject = versions.find(v => v.dcx.projectName === project.name);
    let linkedDcx: DCX;

    if (matchProject) {
      linkedDcx = matchProject.dcx;
      setApiLogs(prev => [...prev, `[LINKING] Attaching to existing DCX Workspace sequence.`]);
    } else {
      const newDcxId = `dcx-${generateId()}`;
      linkedDcx = {
        id: newDcxId,
        client: client.name,
        projectName: project.name,
        product: campaignProduct,
        status: customStatus === "Draft" ? "Draft" : "In Progress",
        tags: ["Digital", "New", "API-Generated"],
        createdAt: new Date().toISOString().split('T')[0],
        createdBy: "u-1",
        lastUpdatedAt: new Date().toISOString().split('T')[0],
        lastUpdatedBy: "u-1"
      };
    }

    const newVersionId = `v-${generateId()}`;

    // Map designated team roles
    const assignedTeam = Object.entries(assignedTeamRoles)
      .filter(([_, userId]) => userId !== "")
      .map(([roleKey, userId]) => ({
        userId: userId as string,
        role: roleKey as string
      }));

    // If team is completely unassigned, default to user1 u-1
    if (assignedTeam.length === 0) {
      assignedTeam.push({ userId: "u-1", role: "ICS" });
    }

    const newVersion: EnrichedVersion = {
      id: newVersionId,
      dcxId: linkedDcx.id,
      versionNumber: newCampaignVersion.toUpperCase().startsWith('V') ? newCampaignVersion.toUpperCase() : `V${newCampaignVersion.replace(/v/i, '')}`,
      status: customStatus,
      createdAt: new Date().toISOString().split('T')[0],
      createdBy: "u-1",
      lastUpdatedAt: new Date().toISOString().split('T')[0],
      lastUpdatedBy: "u-1",
      assignedTeam,
      attachments: tempAttachments,
      dcx: linkedDcx,
      communicatedDate: communicatedDate
    };

    onSubmit(newVersion);
  };

  return (
    <div id="create-dcx-form" className="flex flex-col gap-6 pt-1">
      {/* First Row: Split into Column A (Client & Project) and Column B (Comm Date & Google Drive Resources) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        
        {/* Column A: Client & Project dropdowns */}
        <div id="create-dcx-col-a" className="space-y-5">
          {/* Option 1: Select Client */}
          <div className="space-y-3">
            <h4 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-30">1. Select Client</h4>
            <div className="flex flex-col gap-1.5">
              <ClientDropdown
                clients={clientsData}
                selectedClientId={selectedClientId}
                onSelectClient={(clientId) => {
                  setSelectedClientId(clientId);
                  setSelectedProjectId(""); // Clear selected project on client switch
                  setApiLogs(prev => [...prev, `[QUERY] Selected client ID: ${clientId}`]);
                }}
                isDark={isDark}
              />
            </div>
          </div>

          {/* Option 2: Select Target Project */}
          <div className="space-y-3 pt-3 border-t border-current/[0.05]">
            <div className="flex items-center justify-between">
              <h4 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-30">2. Select Target Project</h4>
              {isApiLoading && (
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary animate-ping" />
                  <span className="text-[8px] font-mono font-black text-primary uppercase">Fetching Catalog...</span>
                </div>
              )}
            </div>

            <ProjectDropdown
              projects={clientsData.find(c => c.id === selectedClientId)?.projects || []}
              selectedProjectId={selectedProjectId}
              selectedClientId={selectedClientId}
              onSelectProject={(projectId, projectName) => handleSelectProject(projectId, projectName)}
              isDark={isDark}
              isApiLoading={isApiLoading}
              versions={versions}
              calculateNextVersion={calculateNextVersion}
            />
          </div>
        </div>

        {/* Column B: Communicated Date & Google Drive Resources */}
        <div id="create-dcx-col-b" className="space-y-5">
          {/* Option 3: Communicated Date */}
          <div className="space-y-3">
            <BrandedDateInput
              value={communicatedDate}
              onChange={(val) => {
                setCommunicatedDate(val);
                setApiLogs(prev => [...prev, `[DATE] Adjusted communicated date to: ${val}`]);
              }}
              isDark={isDark}
              label="3. Communicated Date"
            />
          </div>

          {/* Option 4: Attachments */}
          <div className="pt-3 border-t border-current/[0.05]">
            <DriveResourceAttachments
              isDark={isDark}
              tempAttachments={tempAttachments}
              onChangeAttachments={(attachments) => setTempAttachments(attachments)}
              onAddLog={(log) => setApiLogs(prev => [...prev, log])}
            />
          </div>
        </div>

      </div>

      {/* Second Row: Collaborators Allocation spanning full popup width */}
      <div className="pt-4 border-t border-current/[0.05]">
        <CollaboratorsAllocation
          isDark={isDark}
          assignedTeamRoles={assignedTeamRoles}
          onAssignRole={(roleKey, userId) => {
            setAssignedTeamRoles(prev => ({ ...prev, [roleKey]: userId }));
          }}
          users={MOCK_USERS}
          onAddLog={(log) => setApiLogs(prev => [...prev, log])}
        />
      </div>

      {/* API Logs Output for professional feedback */}
      {apiLogs.length > 0 && (
        <div className="pt-4 border-t border-current/[0.05] space-y-2">
          <span className="text-[8px] font-black tracking-widest uppercase opacity-35 font-mono">WORKSPACE API LOGS</span>
          <div className={`p-3 rounded-xl border font-mono text-[9px] max-h-[100px] overflow-y-auto space-y-1 ${
            isDark ? "bg-black/40 border-white/5 text-[#75E2FF]/80" : "bg-black/[0.02] border-black/5 text-[#00667a]"
          }`}>
            {apiLogs.map((log, index) => (
              <div key={index} className="opacity-75 leading-relaxed">&gt; {log}</div>
            ))}
          </div>
        </div>
      )}

      {/* Buttons at bottom of the form for clean self-containment */}
      <div className="flex items-center justify-end gap-3 pt-6 border-t border-current/[0.05]">
        <button
          type="button"
          onClick={onCancel}
          className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
            isDark 
              ? "bg-white/5 border-white/5 text-white/60 hover:bg-white/10 hover:text-white" 
              : "bg-black/5 border-black/5 text-black/60 hover:bg-black/10 hover:text-black"
          }`}
        >
          Cancel
        </button>
        <button
          type="button"
          onClick={() => handleFormSubmit("Draft")}
          className={`px-5 py-2.5 rounded-xl border text-xs font-bold transition-all duration-300 hover:scale-[1.01] cursor-pointer ${
            isDark 
              ? "bg-amber-500/10 border-amber-500/25 text-amber-400 hover:bg-amber-500/20" 
              : "bg-amber-500/10 border-amber-500/30 text-amber-800 hover:bg-amber-500/20"
          }`}
        >
          Save Draft
        </button>
        <button
          type="button"
          disabled={!selectedProjectId}
          onClick={() => handleFormSubmit("In Progress")}
          className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all duration-300 hover:scale-[1.01] cursor-pointer flex items-center justify-center ${
            !selectedProjectId
              ? "bg-current/10 border border-current/10 opacity-30 cursor-not-allowed"
              : "bg-primary text-black hover:shadow-[0_4px_20px_rgba(117,226,255,0.3)]"
          }`}
        >
          {isApiLoading ? "Connecting API..." : "Create Experience Workspace"}
        </button>
      </div>
    </div>
  );
}
