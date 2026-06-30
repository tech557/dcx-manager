import React from "react";
import { FileText, ExternalLink, FileSpreadsheet, Presentation } from "lucide-react";

interface FileTagProps {
  title: string;
  url: string;
  isDark: boolean;
  className?: string;
}

export const getFileDetails = (title: string, url: string) => {
  const t = title.toLowerCase();
  const u = url.toLowerCase();

  if (
    t.includes("sheet") ||
    t.includes("spread") ||
    t.includes("excel") ||
    u.includes("spreadsheet") ||
    t.includes("csv")
  ) {
    return {
      tag: "GSHEET // RECON",
      icon: FileSpreadsheet,
      bg: "bg-emerald-500/[0.08] text-emerald-400 border-emerald-500/15 hover:bg-emerald-500/[0.12] hover:border-emerald-500/30",
      accent: "text-emerald-400"
    };
  }
  if (
    t.includes("slide") ||
    t.includes("deck") ||
    t.includes("presentation") ||
    u.includes("presentation") ||
    t.includes("concept") ||
    t.includes("mood")
  ) {
    return {
      tag: "GSLIDES // DECK",
      icon: Presentation,
      bg: "bg-amber-500/[0.08] text-amber-400 border-amber-500/15 hover:bg-amber-500/[0.12] hover:border-amber-500/30",
      accent: "text-amber-400"
    };
  }
  if (t.includes("pdf") || u.includes(".pdf")) {
    return {
      tag: "PDF // RELEASES",
      icon: FileText,
      bg: "bg-rose-500/[0.08] text-rose-400 border-rose-500/15 hover:bg-rose-500/[0.12] hover:border-rose-500/40",
      accent: "text-rose-400"
    };
  }
  return {
    tag: "GDOC // SPEC",
    icon: FileText,
    bg: "bg-[#75E2FF]/[0.08] text-[#75E2FF] border-[#75E2FF]/15 hover:bg-[#75E2FF]/[0.12] hover:border-[#75E2FF]/40",
    accent: "text-primary"
  };
};

export const FileTag: React.FC<FileTagProps> = ({
  title,
  url,
  isDark,
  className = ""
}) => {
  const details = getFileDetails(title, url);
  const IconComp = details.icon;

  return (
    <a
      href={url}
      target="_blank"
      referrerPolicy="no-referrer"
      rel="noopener noreferrer"
      className={`p-3 rounded-xl border flex items-center justify-between transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.01] hover:shadow-[0_8px_20px_rgba(117,226,255,0.04)] cursor-pointer group/card w-[220px] sm:w-[240px] shrink-0 ${
        isDark
          ? "bg-white/[0.01] border-white/5 hover:bg-white/[0.04] hover:border-white/10"
          : "bg-black/[0.01] border-black/5 hover:bg-white hover:border-black/10 hover:shadow-xs"
      } ${className}`}
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className={`p-2 rounded-lg flex items-center justify-center border transition-all duration-300 ${details.bg}`}
        >
          <IconComp className="w-3.5 h-3.5" />
        </div>
        <div className="min-w-0">
          <div
            className={`text-xs font-black truncate leading-tight group-hover/card:text-primary transition-colors ${
              isDark ? "text-white" : "text-black"
            }`}
          >
            {title}
          </div>
          <span className={`text-[8px] font-mono font-black opacity-50 uppercase tracking-tight block mt-0.5 ${details.accent}`}>
            {details.tag}
          </span>
        </div>
      </div>
      <ExternalLink className="w-3.5 h-3.5 opacity-30 group-hover/card:opacity-100 group-hover/card:text-primary transition-all flex-shrink-0" />
    </a>
  );
};
