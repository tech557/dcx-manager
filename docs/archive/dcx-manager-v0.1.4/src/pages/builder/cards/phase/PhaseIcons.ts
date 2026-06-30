import {
  BarChart3,
  Bell,
  CalendarClock,
  ClipboardList,
  Flag,
  Megaphone,
  Rocket,
  Send,
  Sparkles,
  Target,
} from "lucide-react";

export type PhaseIconType =
  | "awareness"
  | "megaphone"
  | "rocket"
  | "target"
  | "flag"
  | "calendar"
  | "send"
  | "sparkles"
  | "bell"
  | "chart"
  | "clipboard";

export const PHASE_ICONS_MAP: Record<PhaseIconType, { icon: typeof Megaphone; label: string; color: string }> = {
  awareness: { icon: Megaphone, label: "Awareness", color: "text-[#75E2FF]" },
  megaphone: { icon: Megaphone, label: "Announce", color: "text-[#75E2FF]" },
  rocket: { icon: Rocket, label: "Launch", color: "text-fuchsia-300" },
  target: { icon: Target, label: "Target", color: "text-emerald-300" },
  flag: { icon: Flag, label: "Milestone", color: "text-amber-300" },
  calendar: { icon: CalendarClock, label: "Schedule", color: "text-sky-300" },
  send: { icon: Send, label: "Send", color: "text-cyan-300" },
  sparkles: { icon: Sparkles, label: "Creative", color: "text-violet-300" },
  bell: { icon: Bell, label: "Reminder", color: "text-rose-300" },
  chart: { icon: BarChart3, label: "Measure", color: "text-lime-300" },
  clipboard: { icon: ClipboardList, label: "Checklist", color: "text-blue-300" },
};
