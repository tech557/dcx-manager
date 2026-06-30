import React from "react";
import { Calendar } from "lucide-react";
import { EnrichedVersion } from "../../../../../types";
import { useTheme } from "../../../../../hooks/useTheme";


interface ProjectDetailsProps {
  currentVersion: EnrichedVersion;
}

export function ProjectDetails({ currentVersion }: ProjectDetailsProps) {
  const { isDark } = useTheme();
  const { dcx, versionNumber, status, communicatedDate } = currentVersion;

  // Custom styling for status badge based on design system guidelines (non-mono, sans-serif)
  const getStatusBadgeStyles = (val: string) => {
    switch (val) {
      case "Approved":
        return "bg-emerald-500/10 text-emerald-400 border-emerald-500/15";
      case "Ready for Review":
        return "bg-cyan-500/10 text-[#75E2FF] border-[#75E2FF]/20";
      case "In Progress":
        return "bg-amber-500/10 text-amber-400 border-amber-500/15";
      default:
        return "bg-white/5 border-white/10 text-gray-400";
    }
  };

  // Turn ISO date or placeholder into polished readable text
  const formatCommDate = (rawDate?: string) => {
    if (!rawDate) return "No Date Set";
    try {
      const d = new Date(rawDate);
      if (isNaN(d.getTime())) return rawDate;
      return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
    } catch {
      return rawDate;
    }
  };

  return (
    <div id="metadata-project-details" className="flex items-center gap-4 text-left font-sans select-none">
      
      {/* Client & Campaign Stack */}
      <div className="flex flex-col justify-center">
        {/* Client Row with Product Type Pill next to client name */}
        <div className="flex items-center gap-1.5 leading-none">
          <span className="text-[10px] font-black tracking-wider text-primary font-sans">
            {dcx.client}
          </span>
          <span className={`px-1.5 py-0.5 rounded-md text-[7.5px] font-black tracking-widest font-sans uppercase ${
            isDark ? "bg-white/5 text-neutral-400 border border-white/[0.04]" : "bg-black/5 text-neutral-500 border border-black/[0.04]"
          }`}>
            {dcx.product}
          </span>
        </div>

        {/* Campaign Name Row with inline Version Badge */}
        <div className="flex items-center gap-2 mt-1.5 leading-none">
          <h2 className="font-extrabold tracking-tight text-[11.5px] text-current truncate max-w-[150px] uppercase leading-none">
            {dcx.projectName}
          </h2>
          <span className="px-1.5 py-0.5 rounded-full text-[8.5px] font-black font-sans bg-[#75E2FF]/10 border border-[#75E2FF]/20 text-[#75E2FF] tracking-wider uppercase leading-none select-none">
            {versionNumber}
          </span>
        </div>
      </div>

      {/* Stacked Status and Date Block */}
      <div className="flex flex-col justify-center items-start gap-1 leading-none">
        {/* Project Status */}
        <span className={`px-1.5 py-0.5 rounded-md text-[7.5px] font-black uppercase tracking-wider border leading-none font-sans select-none ${getStatusBadgeStyles(status)}`}>
          {status}
        </span>

        {/* Version Communication Date with tiny icon */}
        <div className="flex items-center gap-1 text-[8px] font-bold font-sans tracking-wide leading-none opacity-50">
          <Calendar className="w-2.5 h-2.5 text-[#75E2FF]" />
          <span>{formatCommDate(communicatedDate || dcx.createdAt)}</span>
        </div>
      </div>

    </div>
  );
}
