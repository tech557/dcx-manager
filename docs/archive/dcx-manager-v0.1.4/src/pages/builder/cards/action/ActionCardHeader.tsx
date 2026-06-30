import { Copy, Plus, Trash2 } from "lucide-react";
import { useTheme } from "../../../../hooks/useTheme";


interface ActionCardHeaderProps {
  isEditingName: boolean;
  setIsEditingName: (val: boolean) => void;
  editNameText: string;
  setEditNameText: (val: string) => void;
  handleSaveNameInline: () => void;
  name: string;
  onAddTask: () => void;
  onDuplicate: () => void;
  onDelete: () => void;
}

export function ActionCardHeader({
isEditingName,
  setIsEditingName,
  editNameText,
  setEditNameText,
  handleSaveNameInline,
  name,
  onAddTask,
  onDuplicate,
  onDelete,
}: ActionCardHeaderProps) {
  const { isDark } = useTheme();
  const iconButton = isDark
    ? "hover:bg-white/10 text-neutral-400 hover:text-white"
    : "hover:bg-black/5 text-neutral-500 hover:text-black";

  return (
    <div className="flex items-start gap-2">
      <div className="flex-1 min-w-0">
        {isEditingName ? (
          <input
            value={editNameText}
            onChange={(e) => setEditNameText(e.target.value)}
            onBlur={handleSaveNameInline}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSaveNameInline();
              if (e.key === "Escape") setIsEditingName(false);
            }}
            className={`w-full bg-transparent border-b outline-none text-xs font-black uppercase tracking-tight ${
              isDark ? "border-white/20 text-white focus:border-[#75E2FF]" : "border-black/20 text-black focus:border-black"
            }`}
            autoFocus
          />
        ) : (
          <button
            type="button"
            onDoubleClick={() => setIsEditingName(true)}
            className="block text-left w-full text-xs font-black uppercase tracking-tight truncate hover:underline decoration-dotted decoration-[#75E2FF]/50"
            title="Double click to rename"
          >
            {name}
          </button>
        )}
      </div>
      <div className="flex items-center gap-0.5 shrink-0">
        <button type="button" onClick={onAddTask} className={`p-1.5 rounded-full transition-colors ${iconButton}`} title="Add task">
          <Plus className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onDuplicate} className={`p-1.5 rounded-full transition-colors ${iconButton}`} title="Duplicate action">
          <Copy className="w-3.5 h-3.5" />
        </button>
        <button type="button" onClick={onDelete} className="p-1.5 rounded-full hover:bg-rose-500/10 text-rose-400 transition-colors" title="Delete action">
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
