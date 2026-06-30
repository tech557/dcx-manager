import { X } from "lucide-react";
import { Subtask } from "./SubtaskTemplateSelector";
import { useTheme } from "../../../../../../hooks/useTheme";


interface SubtaskListProps {
  subtasks: Subtask[];
  onToggle: (id: string) => void;
  onUpdate: (id: string, updates: Partial<Subtask>) => void;
  onRemove: (id: string) => void;
  onOpenTemplates: () => void;
}

export function SubtaskList({ subtasks, onToggle, onUpdate, onRemove, onOpenTemplates }: SubtaskListProps) {
  const { isDark } = useTheme();
  if (subtasks.length === 0) {
    return (
      <button
        type="button"
        onClick={onOpenTemplates}
        className="w-full py-3 rounded-xl border border-dashed border-current/10 text-[10px] font-black uppercase opacity-50 hover:opacity-100"
      >
        Add checklist presets
      </button>
    );
  }

  return (
    <div className="space-y-2">
      {subtasks.map((subtask) => (
        <div
          key={subtask.id}
          className={`grid grid-cols-[auto_1fr_auto_auto] items-center gap-2 rounded-xl border p-2 ${
            isDark ? "bg-black/25 border-white/10" : "bg-white border-black/10"
          }`}
        >
          <input type="checkbox" checked={subtask.done} onChange={() => onToggle(subtask.id)} />
          <input
            value={subtask.label}
            onChange={(e) => onUpdate(subtask.id, { label: e.target.value })}
            className="bg-transparent outline-none text-xs font-semibold min-w-0"
          />
          <span className="text-[8px] font-black font-mono opacity-40">{subtask.duration || "Same day"}</span>
          <button type="button" onClick={() => onRemove(subtask.id)} className="p-1.5 rounded-full text-rose-400 hover:bg-rose-500/10">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
