import React from "react";
import { motion } from "motion/react";
import { EnrichedVersion } from "../../../../types";
import { ProjectDetails } from "./components/ProjectDetails";
import { Collaborators } from "./components/Collaborators";
import { FilesConnection } from "./components/FilesConnection";
import { ViewToggle } from "./components/ViewToggle";
import { SURFACE, BLUR, RADIUS, SHADOW } from "../../../../styles/tokens";
import { useTheme } from "../../../../hooks/useTheme";


interface MetadataIslandProps {
  currentVersion: EnrichedVersion;
  viewMode: "kanban" | "timeline";
  onViewModeChange: (mode: "kanban" | "timeline") => void;
}

export function MetadataIsland({
currentVersion,
  viewMode,
  onViewModeChange,
}: MetadataIslandProps) {
  const { isDark } = useTheme();
  const surface = isDark ? SURFACE.dark : SURFACE.light;
  return (
    <motion.div
      id="metadata-island"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.15 }}
      className={`h-14 px-5 rounded-full flex items-center justify-between gap-5 pointer-events-auto border transition-all duration-300 select-none max-w-full ${BLUR.heavy} ${
        isDark
          ? "bg-black/25 border-white/[0.04] shadow-[0_8px_32px_rgba(0,0,0,0.3)] hover:bg-black/35 hover:border-white/[0.08]"
          : "bg-white/80 border-black/[0.07] shadow-[0_8px_24px_rgba(0,0,0,0.03)] hover:bg-white/95 hover:border-black/[0.12]"
      }`}
    >
      {/* 1. Project details (Client, Project context, version, communication date, status) */}
      <ProjectDetails currentVersion={currentVersion} />

      {/* Thin elegant separator */}
      <div className={`w-px h-6 opacity-10 ${isDark ? "bg-white" : "bg-black"}`} />

      {/* 2. Group details: Collaborators & Connected Files */}
      <div className="flex items-center gap-2.5">
        <Collaborators currentVersion={currentVersion} />
        <FilesConnection currentVersion={currentVersion} />
      </div>

      {/* Thin elegant separator */}
      <div className={`w-px h-6 opacity-10 ${isDark ? "bg-white" : "bg-black"}`} />

      {/* 3. View Switcher Mode Switch */}
      <ViewToggle viewMode={viewMode} onViewModeChange={onViewModeChange} />
      
    </motion.div>
  );
}
