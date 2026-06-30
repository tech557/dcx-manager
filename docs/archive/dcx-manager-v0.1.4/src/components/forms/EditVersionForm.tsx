import React, { useState } from "react";
import { Plus, Trash2, FileText } from "lucide-react";
import { EnrichedVersion } from "../../types";
import { MOCK_USERS } from "../../mock/users";
import { UserDropdown } from "./UserDropdown";

interface EditVersionFormProps {
  isDark: boolean;
  version: EnrichedVersion;
  onSubmit: (updated: EnrichedVersion) => void;
  onCancel: () => void;
  id?: string;
}

export function EditVersionForm({
  isDark,
  version,
  onSubmit,
  onCancel,
  id
}: EditVersionFormProps) {
  const [newVerNumber, setNewVerNumber] = useState(version.versionNumber);
  const [assignedRoles, setAssignedRoles] = useState<{ [roleKey: string]: string }>(() => {
    const roles: { [roleKey: string]: string } = {
      COA: "",
      ICS: "",
      CCW: "",
      EXD: "",
      TEC: ""
    };
    version.assignedTeam?.forEach((member) => {
      roles[member.role] = member.userId;
    });
    return roles;
  });

  const [tempFiles, setTempFiles] = useState<Array<{ title: string; url: string }>>(version.attachments || []);
  const [fileTitle, setFileTitle] = useState("");
  const [fileUrl, setFileUrl] = useState("");

  const handleSave = () => {
    if (!newVerNumber.trim()) return;

    // Map designated team roles
    const assignedTeam = Object.entries(assignedRoles)
      .filter(([_, userId]) => userId !== "")
      .map(([roleKey, userId]) => ({
        userId: userId as string,
        role: roleKey as string
      }));

    if (assignedTeam.length === 0) {
      assignedTeam.push({ userId: "u-1", role: "ICS" });
    }

    const updatedVersion: EnrichedVersion = {
      ...version,
      versionNumber: newVerNumber.toUpperCase().startsWith("V") ? newVerNumber.toUpperCase() : `V${newVerNumber}`,
      assignedTeam,
      attachments: tempFiles,
      lastUpdatedAt: new Date().toISOString().split("T")[0],
      lastUpdatedBy: "u-1"
    };

    onSubmit(updatedVersion);
  };

  return (
    <div id={id || "edit-version-form"} className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start pt-1 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
      {/* Left Column: Core Fields */}
      <div className="space-y-5">
        {/* Ready Parameters Banner */}
        <div className="p-4 rounded-2xl border text-xs space-y-2.5 bg-[#75E2FF]/5 border-[#75E2FF]/15">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase opacity-50 tracking-wider">Campaign Ingress Parameter</span>
            <span className="px-2 py-0.5 rounded bg-[#75E2FF]/10 text-primary text-[8px] font-black uppercase tracking-widest border border-[#75E2FF]/20">Fixed</span>
          </div>
          <div>
            <span className="opacity-45 text-[9px] font-mono tracking-widest uppercase block mb-0.5">Assigned Target Client</span>
            <div className={`font-black text-xs ${isDark ? "text-white" : "text-black"}`}>{version.dcx.client}</div>
          </div>
          <div>
            <span className="opacity-45 text-[9px] font-mono tracking-widest uppercase block mb-0.5">Linked Workspace Portfolio</span>
            <div className={`font-black text-xs ${isDark ? "text-white" : "text-black"}`}>{version.dcx.projectName}</div>
          </div>
        </div>

        {/* Version Code Element */}
        <div className="space-y-2">
          <h4 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">1. Specify Sequence Tag</h4>
          <input
            type="text"
            value={newVerNumber}
            onChange={(e) => setNewVerNumber(e.target.value)}
            placeholder="e.g. V4, V2_CoreTest"
            className={`w-full px-4 py-2.5 rounded-xl border text-xs outline-none transition-all duration-300 font-mono font-bold ${
              isDark 
                ? "bg-black/20 border-white/5 text-white placeholder-white/20 focus:border-[#75E2FF]/40 focus:bg-black/40" 
                : "bg-black/[0.02] border-black/5 text-black placeholder-black/30 focus:border-black/20 focus:bg-white"
            }`}
          />
        </div>

        {/* Attach files */}
        <div className="space-y-3 pt-3 border-t border-current/[0.05]">
          <div className="flex items-center justify-between">
            <h4 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">
              2. Attach Google Drive Resources
            </h4>
            <span className="text-[9px] font-mono tracking-wider opacity-40">
              {tempFiles.length} Linked
            </span>
          </div>

          <div className="flex flex-col gap-2.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <input
                type="text"
                placeholder="Document Title"
                value={fileTitle}
                onChange={(e) => setFileTitle(e.target.value)}
                className={`px-3 py-2.5 rounded-lg border text-xs outline-none transition-all duration-300 ${
                  isDark 
                    ? "bg-black/20 border-white/5 text-white placeholder-white/20 focus:border-[#75E2FF]/40 focus:bg-black/40" 
                    : "bg-black/[0.02] border-black/5 text-black placeholder-black/30 focus:border-black/20 focus:bg-white"
                }`}
              />
              
              <div className="flex gap-2">
                <input
                  type="url"
                  placeholder="https://drive.google.com/..."
                  value={fileUrl}
                  onChange={(e) => setFileUrl(e.target.value)}
                  className={`flex-1 px-3 py-2.5 rounded-lg border text-xs outline-none transition-all duration-300 font-mono ${
                    isDark 
                      ? "bg-black/20 border-white/5 text-white placeholder-white/20 focus:border-[#75E2FF]/40 focus:bg-black/40" 
                      : "bg-black/[0.02] border-black/5 text-black placeholder-black/30 focus:border-black/20 focus:bg-white"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => {
                    if (!fileTitle.trim() || !fileUrl.trim()) return;
                    setTempFiles(prev => [...prev, { title: fileTitle.trim(), url: fileUrl.trim() }]);
                    setFileTitle("");
                    setFileUrl("");
                  }}
                  className="px-3 bg-primary text-black rounded-lg hover:shadow-lg transition-all flex items-center justify-center cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Attachments List Container */}
            <div className={`h-[110px] rounded-xl border flex flex-col justify-start transition-all duration-300 overflow-hidden ${
              isDark ? 'bg-black/20 border-white/5' : 'bg-black/[0.01] border-black/5'
            }`}>
              {tempFiles.length > 0 ? (
                <div className="w-full h-full overflow-y-auto custom-scrollbar p-2 space-y-1">
                  {tempFiles.map((f, i) => (
                    <div key={i} className="flex items-center justify-between text-xs p-2 rounded-lg bg-current/[0.02]">
                      <div className="flex items-center gap-2 min-w-0">
                        <FileText className="w-3.5 h-3.5 text-primary flex-shrink-0" />
                        <span className="font-bold truncate">{f.title}</span>
                        <span className="font-mono text-[9px] opacity-40 truncate">({f.url})</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setTempFiles(prev => prev.filter((_, idx) => idx !== i));
                        }}
                        className="p-1 hover:text-rose-500 transition-colors text-current opacity-60 hover:opacity-100 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-4 text-center">
                  <p className="text-[10px] font-black uppercase tracking-wider opacity-20">
                    No resources attached
                  </p>
                  <p className="text-[9px] opacity-45 max-w-[220px] mt-1">
                    Link design briefs or sequence spreadsheets here.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Roles Allocation */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">
            3. Allocate Collaborators
          </h4>
        </div>

        <div className={`p-5 rounded-2xl border space-y-4 ${
          isDark ? 'bg-black/10 border-white/5' : 'bg-[#FAFAFA] border-black/5'
        }`}>
          {[
            { key: "COA", label: "COMMUNICATION ASSOCIATE" },
            { key: "ICS", label: "INTERNAL COMMUNICATION STRATEGIST" },
            { key: "CCW", label: "CREATIVE COPY WRITER" },
            { key: "EXD", label: "EXPERIENCE DESIGNER" },
            { key: "TEC", label: "TECH" }
          ].map((role) => {
            const assignedUserId = assignedRoles[role.key];
            const matchedUser = MOCK_USERS.find(u => u.id === assignedUserId);

            return (
              <div key={role.key} className="flex items-center justify-between gap-4 p-2 rounded-xl transition-all duration-300 hover:bg-current/[0.02]">
                <div className="flex flex-col gap-0.5 min-w-0 font-sans">
                  <span className="text-[9px] font-black tracking-[0.1em] uppercase opacity-50 block text-current">
                    {role.label}
                  </span>
                  <span className={`text-xs font-bold leading-none ${
                    matchedUser ? 'text-primary' : 'opacity-30 italic'
                  }`}>
                    {matchedUser ? matchedUser.name : "Unassigned"}
                  </span>
                  {matchedUser && (
                    <p className="text-[9px] font-mono opacity-40">{matchedUser.title}</p>
                  )}
                </div>

                <div className="flex items-center gap-3">
                  <UserDropdown
                    users={MOCK_USERS}
                    selectedUserId={assignedUserId}
                    isDark={isDark}
                    roleLabel={role.label}
                    onSelectUser={(userId) => {
                      setAssignedRoles(prev => ({ ...prev, [role.key]: userId }));
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* Self-contained Form action buttons */}
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
            onClick={handleSave}
            className="px-6 py-2.5 bg-primary text-black rounded-xl text-xs font-bold hover:shadow-[0_4px_20px_rgba(117,226,255,0.3)] transition-all duration-300 hover:scale-[1.01] cursor-pointer"
          >
            Apply Changes
          </button>
        </div>
      </div>
    </div>
  );
}
