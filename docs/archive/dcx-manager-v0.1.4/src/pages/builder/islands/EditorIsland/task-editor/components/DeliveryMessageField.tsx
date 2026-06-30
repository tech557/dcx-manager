import { useTheme } from "../../../../../../hooks/useTheme";
interface DeliveryMessageFieldProps {
  value: string;
  onChange: (val: string) => void;
}

export function DeliveryMessageField({ value, onChange }: DeliveryMessageFieldProps) {
  const { isDark } = useTheme();
  return (
    <label className="block">
      <span className="block text-[9px] font-black tracking-[0.25em] uppercase text-[#75E2FF] mb-1.5">
        Message
      </span>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full min-h-24 px-3.5 py-3 rounded-xl text-xs font-semibold border outline-none resize-none ${
          isDark ? "bg-black/35 border-white/10 text-white" : "bg-white border-black/10 text-black"
        }`}
      />
    </label>
  );
}
