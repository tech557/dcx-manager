export interface ChannelOption {
  id: string;
  name: string;
  iconName: string; // Lucide icon name, e.g., "Slack", "Mail", "MessageSquare", "Phone", "Bell"
}

export interface ParticipantOption {
  id: string;
  name: string;
  role: string;
  avatarUrl?: string;
}

export const TASK_CHANNELS: ChannelOption[] = [
  { id: 'ch-1', name: 'Slack Workplace', iconName: 'MessageSquare' },
  { id: 'ch-2', name: 'Direct Email', iconName: 'Mail' },
  { id: 'ch-3', name: 'Microsoft Teams', iconName: 'Send' },
  { id: 'ch-4', name: 'WhatsApp Business', iconName: 'Phone' },
  { id: 'ch-5', name: 'In-App Notification', iconName: 'Bell' },
  { id: 'ch-6', name: 'SMS Gateway', iconName: 'Share2' },
];

export const TASK_SENDERS: ParticipantOption[] = [
  { id: 'p-1', name: 'Creative Director', role: 'Art & Copy Approval Lead' },
  { id: 'p-2', name: 'ICS Senior Specialist', role: 'Integration Operations' },
  { id: 'p-3', name: 'Account Executive', role: 'Client Communications' },
  { id: 'p-4', name: 'Database Architect', role: 'Backend Operations' },
  { id: 'p-5', name: 'Production Lead', role: 'Media Assets Hub' },
];

export const TASK_RECEIVERS: ParticipantOption[] = [
  { id: 'r-1', name: 'End Consumer Segment', role: 'Primary Target Audience' },
  { id: 'r-2', name: 'Core Integration Server', role: 'System Ingress' },
  { id: 'r-3', name: 'Regional Marketing Manager', role: 'Local Campaign Approval' },
  { id: 'r-4', name: 'Mobile Application Client', role: 'V2 Frontend Endpoint' },
  { id: 'r-5', name: 'QA Verification Group', role: 'Automated Compliance' },
];
