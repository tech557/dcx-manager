import { Task, Action, Phase, TaskDate } from "./types/domain";
export type { TaskDate };

export type DCXStatus = 'Draft' | 'In Progress' | 'Completed';
export type VersionStatus = 'Draft' | 'In Progress' | 'Ready for Review' | 'Approved' | 'Rejected' | 'Placed';

export interface User {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
}

export interface AssignedMember {
  userId: string;
  role: string; // ICS, Creative Director, etc.
}

export interface FilterState {
  status: VersionStatus[];
  clients: string[];
  products: string[];
}

export interface SavedView {
  id: string;
  name: string;
  filters: FilterState;
  isDefault?: boolean;
}

export interface DCX {
  id: string;
  client: string;
  projectName: string;
  product: string;
  subProduct?: string;
  status: DCXStatus;
  tags: string[];
  createdAt: string;
  createdBy: string; // User ID
  lastUpdatedAt: string;
  lastUpdatedBy: string; // User ID
}

export interface WeekData {
  id: string;
  weekNumber: number;
}

export interface DCXVersion {
  id: string;
  dcxId: string;
  versionNumber: string; // V1, V2, etc.
  status: VersionStatus;
  createdAt: string;
  createdBy: string; // User ID
  lastUpdatedAt: string;
  lastUpdatedBy: string; // User ID
  assignedTeam: AssignedMember[];
  attachments?: { title: string; url: string }[];
  phases?: PhaseData[];
  communicatedDate?: string;
  weeks?: WeekData[];
}

export type TaskCardData = Task;

export interface ActionCardData extends Action {}

export interface PhaseData extends Omit<Phase, 'actions'> {
  actionCards?: ActionCardData[];
  actions?: Action[];
  position?: { x: number; y: number };
}

// Enriched version with parent DCX data for UI display
export interface EnrichedVersion extends DCXVersion {
  dcx: DCX;
}

export type ActivityType = 'create' | 'update' | 'approve' | 'reject' | 'comment' | 'assign' | 'status_change';

export interface Activity {
  id: string;
  type: ActivityType;
  userId: string;
  versionId: string;
  projectName: string;
  clientName: string;
  timestamp: string;
  details?: string;
  versionNumber: string;
}
