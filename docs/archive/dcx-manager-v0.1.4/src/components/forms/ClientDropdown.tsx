import React, { useState, useRef, useEffect } from "react";
import { ChevronDown, Check } from "lucide-react";
import { BLUR } from "../../styles/tokens";

interface Client {
  id: string;
  name: string;
}

interface ClientDropdownProps {
  clients: Client[];
  selectedClientId: string;
  onSelectClient: (clientId: string) => void;
  isDark: boolean;
}

export function ClientDropdown({
  clients,
  selectedClientId,
  onSelectClient,
  isDark,
}: ClientDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const selectedClient = clients.find((c) => c.id === selectedClientId);

  return (
    <div ref={containerRef} className="relative w-full">
      <button
        id="branded-client-dropdown-trigger"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full text-left px-4 py-3 rounded-xl border font-bold text-xs flex items-center justify-between cursor-pointer transition-all duration-300 ${
          isDark
            ? "bg-black/20 border-white/5 text-white hover:bg-black/40 hover:border-white/10"
            : "bg-black/[0.02] border-black/5 text-black hover:bg-black/[0.04] hover:border-black/10"
        }`}
      >
        <span className="font-black text-xs">
          {selectedClient ? selectedClient.name : "Select Client"}
        </span>
        <ChevronDown className="w-3.5 h-3.5 opacity-50" />
      </button>

      {isOpen && (
        <div
          className={`absolute z-50 left-0 right-0 mt-1.5 p-2 rounded-xl border ${BLUR.heavy} shadow-xl space-y-1 ${
            isDark
              ? "bg-[#151516] border-white/10 text-white"
              : "bg-white border-black/10 text-black"
          }`}
        >
          {clients.map((client) => {
            const isSelected = client.id === selectedClientId;
            return (
              <button
                key={client.id}
                type="button"
                onClick={() => {
                  onSelectClient(client.id);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-between ${
                  isSelected
                    ? "bg-primary text-black"
                    : isDark
                    ? "text-white/85 hover:bg-white/5"
                    : "text-black/85 hover:bg-black/5"
                }`}
              >
                <span>{client.name}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-current stroke-[3px]" />}
              </button>
            );
          })}
          {clients.length === 0 && (
            <div className="px-3 py-2 text-xs text-center opacity-40 italic">
              No clients available.
            </div>
          )}
        </div>
      )}
    </div>
  );
}
