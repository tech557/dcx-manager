import React from "react";

interface SandboxBriefingProps {
  isDark: boolean;
  projectName: string;
  clientName: string;
  productName: string;
  createdAt: string;
  versionNumber: string;
}

export function SandboxBriefing({
  isDark,
  projectName,
  clientName,
  productName,
  createdAt,
  versionNumber,
}: SandboxBriefingProps) {
  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Dynamic Project Meta Matrix */}
      <h3 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-40">
        Workspace Specifications
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div
          className={`p-4 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-white/[0.01] border-white/5 hover:border-white/10"
              : "bg-black/[0.01] border-black/5 hover:border-black/10"
          }`}
        >
          <span className="text-[8px] font-black uppercase tracking-wider block opacity-40 mb-1">
            Client Entity
          </span>
          <p className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
            {clientName || "N/A"}
          </p>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-white/[0.01] border-white/5 hover:border-white/10"
              : "bg-black/[0.01] border-black/5 hover:border-black/10"
          }`}
        >
          <span className="text-[8px] font-black uppercase tracking-wider block opacity-40 mb-1">
            Product Scope
          </span>
          <p className={`text-sm font-black ${isDark ? "text-white" : "text-black"}`}>
            {productName || "N/A"}
          </p>
        </div>

        <div
          className={`p-4 rounded-2xl border transition-all duration-300 ${
            isDark
              ? "bg-white/[0.01] border-white/5 hover:border-white/10"
              : "bg-black/[0.01] border-black/5 hover:border-black/10"
          }`}
        >
          <span className="text-[8px] font-black uppercase tracking-wider block opacity-40 mb-1">
            Version Created
          </span>
          <p className={`text-sm font-bold font-mono ${isDark ? "text-white" : "text-black"}`}>
            {createdAt || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
}
