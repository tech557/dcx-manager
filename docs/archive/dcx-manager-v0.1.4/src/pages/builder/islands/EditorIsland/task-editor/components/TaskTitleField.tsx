import { useTheme } from "../../../../../../hooks/useTheme";
interface TaskTitleFieldProps {
  value: string;
  onChange: (val: string) => void;
}

export function TaskTitleField({ value, onChange }: TaskTitleFieldProps) {
  const { isDark } = useTheme();
  return (
    <label className="block">
      <span className="block text-[9px] font-black tracking-[0.25em] uppercase text-[#75E2FF] mb-1.5">
        Task
      </span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full px-3.5 py-2.5 rounded-xl text-sm font-black border outline-none ${
          isDark ? "bg-black/35 border-white/10 text-white" : "bg-white border-black/10 text-black"
        }`}
      />
    </label>
  );
}
