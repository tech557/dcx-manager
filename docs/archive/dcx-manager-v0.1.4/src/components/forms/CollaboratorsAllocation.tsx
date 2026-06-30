import React from "react";
import { User } from "../../types";
import { UserDropdown } from "./UserDropdown";

interface CollaboratorsAllocationProps {
  isDark: boolean;
  assignedTeamRoles: Record<string, string>;
  onAssignRole: (roleKey: string, userId: string) => void;
  users: User[];
  onAddLog: (msg: string) => void;
}

const ROLES = [
  { key: "COA", label: "COMMUNICATION ASSOCIATE", shortLabel: "COMMUNICATION ASSOC." },
  { key: "ICS", label: "INTERNAL COMMUNICATION STRATEGIST", shortLabel: "INTERNAL STRATEGIST" },
  { key: "CCW", label: "CREATIVE COPY WRITER", shortLabel: "CREATIVE COPYWRITER" },
  { key: "EXD", label: "EXPERIENCE DESIGNER", shortLabel: "EXPERIENCE DESIGNER" },
  { key: "TEC", label: "TECH", shortLabel: "TECH LEAD / DEV" },
];

export function CollaboratorsAllocation({
  isDark,
  assignedTeamRoles,
  onAssignRole,
  users,
  onAddLog,
}: CollaboratorsAllocationProps) {
  return (
    <div className="space-y-3 font-sans">
      <div className="flex items-center justify-between">
        <h4 className="text-[10px] font-black tracking-[0.2em] uppercase opacity-30 text-current select-none">
          5. Collaborators Allocation
        </h4>
        <span className="text-[9px] font-mono tracking-wider opacity-40 text-current select-none">
          Horizontal Team Alignment
        </span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 w-full">
        {ROLES.map((role) => {
          const assignedUserId = assignedTeamRoles[role.key];
          const matchedUser = users.find((u) => u.id === assignedUserId);

          return (
            <div
              key={role.key}
              className={`flex flex-col justify-between p-3.5 rounded-2xl border transition-all duration-300 min-h-[96px] ${
                isDark
                  ? "bg-black/20 border-white/[0.04] hover:bg-black/35 hover:border-white/10"
                  : "bg-black/[0.015] border-black/[0.04] hover:bg-black/[0.035] hover:border-black/10"
              }`}
            >
              <div className="flex flex-col gap-1 min-w-0">
                {/* Role Label */}
                <span className="text-[8px] font-black tracking-[0.05em] uppercase opacity-40 block text-current truncate select-none" title={role.label}>
                  {role.shortLabel}
                </span>

                {/* Assigned User Name */}
                <span
                  className={`text-xs font-bold leading-tight truncate pr-1 ${
                    matchedUser ? "text-primary font-extrabold" : "opacity-35 italic font-medium"
                  }`}
                >
                  {matchedUser ? matchedUser.name : "Unassigned"}
                </span>

                {/* User Title placeholder */}
                {matchedUser ? (
                  <span className="text-[9px] font-mono opacity-45 truncate leading-none">
                    {matchedUser.title}
                  </span>
                ) : (
                  <span className="text-[9px] font-mono opacity-25 leading-none">Assign role...</span>
                )}
              </div>

              {/* Selector / Avatar Dropdown */}
              <div className="flex justify-end items-center mt-2 pt-2 border-t border-current/[0.04]">
                <UserDropdown
                  users={users}
                  selectedUserId={assignedUserId}
                  isDark={isDark}
                  roleLabel={role.label}
                  onSelectUser={(userId) => {
                    onAssignRole(role.key, userId);
                    const uInfo = users.find((u) => u.id === userId);
                    onAddLog(`[ASSIGN] ${role.key}: ${uInfo ? uInfo.name : "Unassigned"}`);
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
