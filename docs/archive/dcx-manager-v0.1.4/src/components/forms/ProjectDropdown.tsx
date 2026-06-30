import React, { useState } from "react";
import { Search } from "lucide-react";

interface MockProject {
  id: string;
  name: string;
}

interface EnrichedVersion {
  id: string;
  dcxId: string;
  versionNumber: string;
  dcx: {
    projectName: string;
  };
}

interface ProjectDropdownProps {
  projects: MockProject[];
  selectedProjectId: string;
  selectedClientId: string;
  onSelectProject: (projectId: string, projectName: string) => void;
  isDark: boolean;
  isApiLoading: boolean;
  versions: EnrichedVersion[];
  calculateNextVersion: (versionNumbers: string[]) => string;
}

export function ProjectDropdown({
  projects,
  selectedProjectId,
  selectedClientId,
  onSelectProject,
  isDark,
  isApiLoading,
  versions,
  calculateNextVersion,
}: ProjectDropdownProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredProjects = projects.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-3 w-full">
      {/* Search Input */}
      <div className="relative">
        <input
          id="project-search-input"
          type="text"
          placeholder="Search client catalog projects..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className={`w-full pl-10 pr-4 py-3 rounded-xl border text-xs font-bold outline-hidden transition-all duration-300 ${
            isDark
              ? "bg-black/20 border-white/5 text-white placeholder-white/30 focus:border-primary/40 focus:bg-black/40"
              : "bg-black/[0.02] border-black/5 text-black placeholder-black/40 focus:border-black/20 focus:bg-white"
          }`}
        />
        <Search className="w-4 h-4 opacity-40 absolute left-3.5 top-1/2 -translate-y-1/2" />
      </div>

      {/* Projects list container */}
      <div className="space-y-1.5 h-[152px] overflow-y-auto custom-scrollbar pr-1">
        {isApiLoading ? (
          <div className="flex flex-col items-center justify-center py-8">
            <span className="w-5 h-5 rounded-full border-2 border-primary/30 border-t-primary animate-spin" />
            <span className="text-[9px] font-mono font-black text-primary uppercase mt-2">
              Loading Projects...
            </span>
          </div>
        ) : (
          <>
            {filteredProjects.map((project) => {
              const isSelected = selectedProjectId === project.id;
              
              // Filter versions to find existing ones for this specific project name
              const existingProjectVersions = versions.filter(
                (v) => v.dcx.projectName === project.name
              );
              const versionNumbers = existingProjectVersions.map((v) => v.versionNumber);
              const inlineVerNum = calculateNextVersion(versionNumbers);

              return (
                <button
                  key={project.id}
                  id={`project-item-${project.id}`}
                  type="button"
                  onClick={() => onSelectProject(project.id, project.name)}
                  className={`w-full text-left px-4 py-3 rounded-xl border flex items-center justify-between transition-all duration-500 cursor-pointer ${
                    isSelected
                      ? isDark
                        ? "bg-primary/15 border-primary/55 text-primary shadow-[0_4px_20px_rgba(117,226,255,0.15)]"
                        : "bg-black border-black text-white hover:bg-black/90 shadow-md"
                      : isDark
                      ? "bg-white/[0.02] border-white/5 text-white/80 hover:bg-white/[0.06] hover:border-white/10"
                      : "bg-[#FAFAFA] border-black/5 text-black hover:bg-black/[0.03]"
                  }`}
                >
                  <span className="text-xs font-black tracking-tight font-sans">
                    {project.name}
                  </span>

                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-black tracking-wider font-mono border ${
                        isSelected
                          ? isDark
                            ? "bg-emerald-500/15 border-emerald-500/35 text-emerald-400"
                            : "bg-white/20 border-white/20 text-white"
                          : isDark
                          ? "bg-white/[0.04] border-white/5 text-amber-400/80"
                          : "bg-black/[0.04] border-black/5 text-amber-700"
                      }`}
                    >
                      {inlineVerNum}
                    </span>
                  </div>
                </button>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="py-8 text-center">
                <p className={`text-[10px] font-black opacity-30`}>
                  No matching projects found.
                </p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
