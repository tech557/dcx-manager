import type { ApiChannel } from '@/types/api';

export const MOCK_CHANNELS: ApiChannel[] = [
  { id: 'email', label: 'Email', icon: 'email', availableCompositionIds: ['comp-email-std', 'comp-email-short'] },
  { id: 'intranet', label: 'Intranet', icon: 'intranet', availableCompositionIds: ['comp-intranet-std'] },
  { id: 'meeting', label: 'Meeting', icon: 'meeting', availableCompositionIds: ['comp-meeting-std'] },
  { id: 'sms', label: 'SMS', icon: 'sms', availableCompositionIds: ['comp-sms-std'] },
  { id: 'social', label: 'Social Media', icon: 'social', availableCompositionIds: ['comp-social-std'] },
  { id: 'feedback', label: 'Feedback Form', icon: 'feedback', availableCompositionIds: ['comp-feedback-std'] },
];
