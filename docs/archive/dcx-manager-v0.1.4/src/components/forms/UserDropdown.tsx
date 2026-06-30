import React, { useState, useRef, useEffect } from "react";
import { Search, ChevronDown, Check, Users, Plus } from "lucide-react";
import { BLUR } from "../../styles/tokens";

interface User {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
}

interface UserDropdownProps {
  users: User[];
  selectedUserId: string;
  onSelectUser: (userId: string) => void;
  isDark: boolean;
  roleLabel: string;
}

export function UserDropdown({
  users,
  selectedUserId,
  onSelectUser,
  isDark,
  roleLabel,
}: UserDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Autofocus the search bar when the dropdown list is opened
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    } else if (!isOpen) {
      setSearch("");
    }
  }, [isOpen]);

  const matchedUser = users.find((u) => u.id === selectedUserId);

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div ref={containerRef} className="relative flex-shrink-0 select-none font-sans">
      {/* Branded Avatar Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="relative group focus:outline-hidden cursor-pointer block"
      >
        {matchedUser && matchedUser.avatarUrl ? (
          <div className={`w-10 h-10 rounded-full overflow-hidden border transition-all duration-300 ${
            isDark 
              ? 'border-primary/30 bg-black/40 group-hover:border-primary group-hover:shadow-[0_0_12px_rgba(117,226,255,0.45)]' 
              : 'border-primary/30 bg-black/5 group-hover:border-primary group-hover:shadow-[0_0_12px_rgba(117,226,255,0.3)]'
          }`}>
            <img 
              src={matchedUser.avatarUrl} 
              alt={matchedUser.name}
              className="w-full h-full object-cover select-none pointer-events-none"
              referrerPolicy="no-referrer"
            />
          </div>
        ) : (
          <div className={`w-10 h-10 rounded-full flex items-center justify-center border transition-all duration-300 ${
            isDark 
              ? 'bg-white/5 border-white/10 text-white/30 group-hover:border-primary group-hover:text-primary group-hover:bg-white/10' 
              : 'bg-black/5 border-black/10 text-black/30 group-hover:border-primary group-hover:text-primary group-hover:bg-black/10'
          }`}>
            <Plus className="w-4 h-4 opacity-65 group-hover:opacity-100" />
          </div>
        )}
      </button>

      {/* Floating Dropdown Dialog Panel */}
      {isOpen && (
        <div
          className={`absolute z-50 right-0 mt-1.5 w-[250px] p-2 rounded-2xl border ${BLUR.heavy} shadow-xl space-y-2 ${
            isDark
              ? "bg-[#151516]/95 border-white/15 text-white"
              : "bg-white/95 border-black/10 text-black"
          }`}
        >
          {/* Internal Dropdown Search Input */}
          <div className="relative">
            <input
              ref={searchInputRef}
              type="text"
              placeholder={`Search collaborators...`}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={`w-full pl-8 pr-3 py-1.5 rounded-lg border text-[11px] font-bold outline-hidden transition-all duration-200 ${
                isDark
                  ? "bg-black/40 border-white/10 text-white placeholder-white/30 focus:border-primary/45"
                  : "bg-black/[0.03] border-black/5 text-black placeholder-black/40 focus:border-black/20"
              }`}
            />
            <Search className="w-3 h-3 opacity-40 absolute left-2.5 top-1/2 -translate-y-1/2" />
          </div>

          {/* Users List */}
          <div className="max-h-[160px] overflow-y-auto custom-scrollbar space-y-0.5">
            {/* Unassigned Trigger option */}
            <button
              type="button"
              onClick={() => {
                onSelectUser("");
                setIsOpen(false);
              }}
              className={`w-full text-left px-2 py-1.5 rounded-lg text-[10px] font-black transition-all flex items-center justify-between ${
                !selectedUserId
                  ? "bg-primary text-black"
                  : isDark
                  ? "text-white/40 hover:bg-white/5"
                  : "text-black/40 hover:bg-black/5"
              }`}
            >
              <span className="uppercase tracking-wider">Unassigned</span>
              {!selectedUserId && <Check className="w-3 h-3 text-current stroke-[3px]" />}
            </button>

            {filteredUsers.map((user) => {
              const isSelected = user.id === selectedUserId;
              return (
                <button
                  key={user.id}
                  type="button"
                  onClick={() => {
                    onSelectUser(user.id);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1.5 rounded-lg text-xs transition-all flex items-center justify-between gap-2.5 ${
                    isSelected
                      ? "bg-primary text-black font-bold"
                      : isDark
                      ? "text-white/85 hover:bg-white/5"
                      : "text-black/85 hover:bg-black/5"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0">
                    {user.avatarUrl ? (
                      <div className="w-6 h-6 rounded-full overflow-hidden border border-white/10 bg-black/10 flex-shrink-0">
                        <img
                          src={user.avatarUrl}
                          alt={user.name}
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      </div>
                    ) : (
                      <div className="w-6 h-6 rounded-full flex items-center justify-center bg-current/10 flex-shrink-0">
                        <Users className="w-3 h-3 opacity-60" />
                      </div>
                    )}
                    <div className="flex flex-col min-w-0">
                      <span className="font-bold text-xs truncate leading-none mb-0.5">
                        {user.name}
                      </span>
                      <span className={`text-[9px] truncate font-mono tracking-tight leading-none opacity-50`}>
                        {user.title}
                      </span>
                    </div>
                  </div>
                  {isSelected && <Check className="w-3.5 h-3.5 text-current stroke-[3px]" />}
                </button>
              );
            })}

            {filteredUsers.length === 0 && (
              <div className="py-4 text-center text-[10px] opacity-40 italic">
                No matches found
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
