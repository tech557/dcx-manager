import React from 'react';
import { X, Server, Shield, User, Smartphone, Mail, Users } from 'lucide-react';
import type { SelectOption } from '@/ui/forms/selects';

interface RegistryDirectoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  segmentsList: SelectOption[];
}

export function getIconComponent(iconName?: string) {
  switch (iconName) {
    case 'server':
      return <Server className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
    case 'shield':
      return <Shield className="w-3.5 h-3.5 text-emerald-400 shrink-0" />;
    case 'user':
      return <User className="w-3.5 h-3.5 text-indigo-400 shrink-0" />;
    case 'smartphone':
      return <Smartphone className="w-3.5 h-3.5 text-amber-400 shrink-0" />;
    case 'mail':
      return <Mail className="w-3.5 h-3.5 text-pink-400 shrink-0" />;
    case 'users':
      return <Users className="w-3.5 h-3.5 text-teal-400 shrink-0" />;
    default:
      return <Server className="w-3.5 h-3.5 text-sky-400 shrink-0" />;
  }
}

export function RegistryDirectoryModal({
  isOpen,
  onClose,
  segmentsList,
}: RegistryDirectoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-neutral-950 border border-white/15 rounded-xl max-w-md w-full p-4 space-y-4 shadow-2xl relative font-sans animate-fade-in text-left">
        <div className="flex justify-between items-center border-b border-white/10 pb-2">
          <h4 className="text-sm font-mono font-light text-neutral-200 uppercase tracking-wide">Segment Registry Directory</h4>
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white cursor-pointer hover:bg-white/5 p-1 rounded transition-all"
            type="button"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 max-h-64 overflow-y-auto pr-1 scrollbar-thin [scrollbar-width:thin]">
          <p className="text-dcx-xs text-[var(--theme-accent)] uppercase font-mono tracking-wider font-light pb-1">
            Unified Communication & Audience Segments
          </p>
          <div className="border border-white/5 rounded divide-y divide-white/5">
            {segmentsList.map((s) => (
              <div key={s.value} className="flex items-center justify-between p-2 hover:bg-white/[0.02]">
                <div className="flex items-center gap-2 font-mono">
                  {getIconComponent(s.icon)}
                  <div>
                    <p className="text-dcx-xs-plus text-neutral-200 font-bold leading-tight">{s.label}</p>
                    <p className="text-dcx-3xs text-neutral-500 leading-none mt-0.5">{s.value}</p>
                  </div>
                </div>
                <span className="text-dcx-3xs-plus text-neutral-400 bg-white/5 px-1.5 py-0.5 rounded font-mono">
                  {s.description}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-white/10">
          <button
            onClick={onClose}
            className="bg-white/10 hover:bg-white/15 text-white font-mono text-xs px-3 py-1 rounded cursor-pointer transition-colors"
            type="button"
          >
            Close Directory
          </button>
        </div>
      </div>
    </div>
  );
}
