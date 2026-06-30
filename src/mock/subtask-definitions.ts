import type { ApiSubtaskDefinition } from '@/types/api';

export const MOCK_SUBTASK_DEFINITIONS: ApiSubtaskDefinition[] = [
  { id: 'def-copy', label: 'Copywriting', estimatedMinutes: 120, channelIds: ['email', 'intranet', 'sms', 'social'] },
  { id: 'def-design', label: 'Design', estimatedMinutes: 180, channelIds: ['email', 'intranet', 'social'] },
  { id: 'def-approval', label: 'Approval', estimatedMinutes: 30, channelIds: ['email', 'intranet', 'sms', 'social', 'feedback'] },
  { id: 'def-dev', label: 'Development', estimatedMinutes: 240, channelIds: ['intranet', 'feedback'] },
  { id: 'def-review', label: 'Content Review', estimatedMinutes: 60, channelIds: ['email', 'intranet', 'social'] },
  { id: 'def-logistics', label: 'Logistics', estimatedMinutes: 90, channelIds: ['meeting'] },
  { id: 'def-invite', label: 'Invite Management', estimatedMinutes: 45, channelIds: ['meeting'] },
  { id: 'def-slides', label: 'Slide Deck', estimatedMinutes: 120, channelIds: ['meeting'] },
];
