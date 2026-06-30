import React from "react";
import { Users } from "lucide-react";
import { MOCK_USERS } from "../../../mock/users";
import { User } from "../../../types";

export interface CollaboratorItem {
  roleKey: string;
  roleLabel: string;
  userDetail: User | null;
}

interface CollaboratorsAvatarsProps {
  collaborators: CollaboratorItem[];
  isDark: boolean;
  onHoverCollaborator: (collaborator: CollaboratorItem | null) => void;
}

export function CollaboratorsAvatars({
  collaborators,
  isDark,
  onHoverCollaborator,
}: CollaboratorsAvatarsProps) {
  // Only render roles that have assigned users (or all 5 for visual structure, let's render all to maintain perfect role layout balance)
  return (
    <div className="flex items-center gap-2">
      <div className="flex -space-x-3.5 hover:space-x-1 transition-all duration-500 ease-out py-1">
        {collaborators.map((item, index) => {
          const hasUser = !!item.userDetail;
          return (
            <div
              key={item.userDetail?.id || item.roleKey}
              onMouseEnter={() => onHoverCollaborator(item)}
              onMouseLeave={() => onHoverCollaborator(null)}
              className="relative group transition-transform duration-300 hover:scale-115 hover:-translate-y-1 z-10 hover:z-30 cursor-pointer"
              style={{ zIndex: collaborators.length - index }}
            >
              {hasUser && item.userDetail?.avatarUrl ? (
                <div
                  className={`w-9 h-9 rounded-full overflow-hidden border-2 transition-all duration-300 ring-2 ring-transparent group-hover:ring-primary/45 ${
                    isDark ? "bg-[#75E2FF]/20 border-[#75E2FF]/40" : "bg-[#75E2FF]/15 border-[#75E2FF]/50"
                  }`}
                >
                  <img
                    src={item.userDetail.avatarUrl}
                    alt={item.userDetail.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                </div>
              ) : (
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isDark
                      ? "bg-[#75E2FF]/20 border-[#75E2FF]/40 text-[#75E2FF] group-hover:bg-[#75E2FF]/30 group-hover:text-white"
                      : "bg-[#75E2FF]/15 border-[#75E2FF]/50 text-[#3097b3] group-hover:bg-[#75E2FF]/25"
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                </div>
              )}

              {/* Minimal floating indicator for role type */}
              <div
                className={`absolute -bottom-1 -right-1 w-3.5 h-3.5 rounded-full flex items-center justify-center text-[6px] font-black border transition-colors duration-300 overflow-hidden ${
                  hasUser
                    ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-400"
                    : isDark
                    ? "bg-white/5 border-white/10 text-white/40"
                    : "bg-black/5 border-black/10 text-black/40"
                }`}
              >
                {item.roleKey.substring(0, 2)}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
