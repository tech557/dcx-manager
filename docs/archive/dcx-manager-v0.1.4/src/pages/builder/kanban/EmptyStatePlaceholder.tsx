import { Plus, Layers } from "lucide-react";

interface EmptyStatePlaceholderProps {
  key?: string;
  onAddPhase: (index?: number) => void;
}

export function EmptyStatePlaceholder({ onAddPhase }: EmptyStatePlaceholderProps) {
  return (
    <button
      type="button"
      onClick={() => onAddPhase()}
      className="w-80 sm:w-[330px] h-[350px] rounded-[2rem] border border-dashed border-[#75E2FF]/35 bg-[#75E2FF]/5 text-[#75E2FF] flex flex-col items-center justify-center gap-3 hover:bg-[#75E2FF]/10 transition-all"
    >
      <Layers className="w-8 h-8 opacity-70" />
      <span className="text-xs font-black uppercase tracking-widest">Create First Phase</span>
      <span className="flex items-center gap-1.5 text-[10px] font-bold uppercase opacity-60">
        <Plus className="w-3 h-3" />
        Add sequencing container
      </span>
    </button>
  );
}
