export interface SubtaskTemplateOption {
  id: string;
  name: string;
  defaultDuration: string;
}

export const SUBTASK_TEMPLATES: SubtaskTemplateOption[] = [
  { id: "stk-temp-1", name: "Copy", defaultDuration: "2 hrs" },
  { id: "stk-temp-2", name: "Design", defaultDuration: "1 hr" },
  { id: "stk-temp-3", name: "Animation", defaultDuration: "1.5 hrs" },
  { id: "stk-temp-4", name: "Development Plan", defaultDuration: "0.5 hrs" },
  { id: "stk-temp-5", name: "Test", defaultDuration: "2.5 hrs" },
  { id: "stk-temp-6", name: "Voiceover", defaultDuration: "1 hr" },
  { id: "stk-temp-7", name: "Video Editing", defaultDuration: "3 hrs" },
];
