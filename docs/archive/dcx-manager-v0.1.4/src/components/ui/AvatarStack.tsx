import React from "react";
import { User } from "../../types";

interface AvatarStackProps {
  users: User[];
  max?: number;
  size?: "sm" | "md" | "lg";
  isDark: boolean;
  className?: string;
}

export const AvatarStack: React.FC<AvatarStackProps> = ({
  users,
  max = 4,
  size = "md",
  isDark,
  className = ""
}) => {
  const visibleUsers = users.slice(0, max);
  const remainingCount = users.length - max;

  const sizeMap = {
    sm: "w-6 h-6 text-[10px]",
    md: "w-8 h-8 text-[12px]",
    lg: "w-10 h-10 text-[14px]"
  };

  const ringClass = isDark ? "ring-neutral-900" : "ring-white";

  return (
    <div className={`flex items-center -space-x-2.5 ${className}`}>
      {visibleUsers.map((user, i) => {
        const initials = user.name
          .split(" ")
          .map((n) => n[0])
          .slice(0, 2)
          .join("");

        return (
          <div
            key={user.id || i}
            className={`relative rounded-full flex items-center justify-center font-black uppercase ring-2 ${ringClass} overflow-hidden shrink-0 transition-transform hover:scale-110 hover:z-10 cursor-pointer ${
              sizeMap[size]
            } ${
              isDark
                ? "bg-neutral-800 text-white/80 border-neutral-700"
                : "bg-neutral-100 text-black/80 border-neutral-200"
            }`}
            title={user.name}
          >
            {user.avatarUrl ? (
              <img
                src={user.avatarUrl}
                alt={user.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
        );
      })}

      {remainingCount > 0 && (
        <div
          className={`rounded-full flex items-center justify-center font-black ring-2 ${ringClass} bg-primary/25 border-primary/40 text-primary shrink-0 ${
            sizeMap[size]
          }`}
          title={`${remainingCount} more`}
        >
          +{remainingCount}
        </div>
      )}
    </div>
  );
};
