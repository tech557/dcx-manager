import React from "react";
import { VersionStatus } from "../../types";

interface StatusBadgeProps {
  status: VersionStatus;
  size?: "sm" | "md";
  className?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = "md",
  className = ""
}) => {
  const getStatusConfig = (val: VersionStatus) => {
    switch (val) {
      case "Approved":
        return {
          bg: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
          dot: "bg-emerald-400"
        };
      case "Rejected":
        return {
          bg: "bg-rose-500/10 text-rose-400 border-rose-500/20",
          dot: "bg-rose-400"
        };
      case "Placed":
        return {
          bg: "bg-blue-500/10 text-blue-400 border-blue-500/20",
          dot: "bg-blue-400"
        };
      case "Ready for Review":
        return {
          bg: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20",
          dot: "bg-indigo-400"
        };
      case "In Progress":
        return {
          bg: "bg-amber-500/10 text-amber-500 border-amber-500/20",
          dot: "bg-amber-500"
        };
      case "Draft":
      default:
        return {
          bg: "bg-neutral-500/10 text-neutral-400 border-neutral-500/20",
          dot: "bg-neutral-400"
        };
    }
  };

  const config = getStatusConfig(status);
  const sizeClasses = size === "sm" ? "px-2 py-0.5 text-[9px]" : "px-2.5 py-1 text-xs";

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border font-black uppercase tracking-wider ${sizeClasses} ${config.bg} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <span>{status}</span>
    </span>
  );
};
