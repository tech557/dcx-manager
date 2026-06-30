/**
 * Defines the mechanism used to determine a communication task's scheduled release date.
 * - 'unset': No date has been selected or calculated for the task.
 * - 'linked': The task date dynamically resolves relative to the campaign anchor launch date.
 * - 'fixed': An absolute calendar date that remains stable independent of any parent schedule moves.
 */
export type TaskDateMode = "unset" | "linked" | "fixed";

/**
 * A discriminated union model that represents the scheduled date of a communication task.
 * This guarantees strict compile-time types for different date positioning strategies.
 */
export type TaskDate =
  | {
      /** Unscheduled task state containing no dates */
      mode: "unset";
    }
  | {
      /** Dynamic schedule state synced to the master timeline anchor date */
      mode: "linked";
      /** Number of weeks relative to the campaign launch anchor point (can be positive or negative) */
      weekOffset: number;
      /** Representing day index within the offset week (typically 0-6 where 0 is Monday / start of week) */
      dayOffset: number;
      /** Cached ISO date representation computed dynamically at runtime; never persisted */
      resolvedDate?: string;
    }
  | {
      /** Statically locked timeline appointment */
      mode: "fixed";
      /** Absolute calendar date in ISO format (YYYY-MM-DD) */
      date: string;
    };

/**
 * An individual subtask or checklist item nested within a larger communication task.
 * Used for operational tracking and completion status audits.
 */
export interface Subtask {
  /** Unique sequence identifier for the subtask item */
  id: string;
  /** Human-readable instruction, label, or checklist text description */
  label: string;
  /** Binary completion flag denoting whether the subtask has been checked off */
  done: boolean;
  /** Estimated duration in minutes required to perform this subset activity */
  estimatedMinutes?: number;
  /** Legacy duration string field for compatibility */
  duration?: string;
}

/**
 * Known structural phase icon categories corresponding to milestones in the campaign lifecycle.
 * Maps to visual assets and badge styling profiles across views.
 */
export type PhaseIconType = 'awareness' | 'teaser' | 'launch' | 'scale' | 'maintenance';

/**
 * Represents a single digital communication task (or newsletter, push notification, SMS, etc.).
 * Maps to specific delivery channels and roles in the experience workspace.
 */
export interface Task {
  /** Unique sequential timeline identifier */
  id: string;
  /** Short, humbler, search-friendly descriptive action name */
  name: string;
  /** Reference to the target delivery channel (e.g. email, chat, slack) */
  channelId: string;
  /** Draft text copy or payload instruction to transmit over the channel */
  message: string;
  /** Reference to the designated sender entity */
  senderId: string;
  /** Reference to the designated receiver/observer group */
  receiverId: string;
  /** Technical formatting specs or visual guidelines identifier */
  specsIdentifier: string;
  /** List of fields or variables flagged as missing or needing urgent team resolution */
  missingFields?: string[];
  /** Alias for missingFields, for backwards compatibility with components using missingData */
  missingData?: string[];
  /** Subtask checklist items required to mark this communication live */
  subtasks?: Subtask[];
  /** Scheduled date model for this communicative release */
  date?: TaskDate;
  /** Optional visual UI placeholder value for empty inputs */
  subtasksPlaceholder?: string;
  /** UI specific flag denoting compact display preference */
  isSmall?: boolean;
}

/**
 * Groups and controls a set of individual communications tasks within a distinct time frame.
 * Operates as an active tactical directive within a campaign phase.
 */
export interface Action {
  /** Unique identity code of the target action directive */
  id: string;
  /** Descriptive team directive or title for this grouped block */
  name: string;
  /** Deep-dive description of scope, purpose, or strategy associated with this action */
  description?: string;
  /** Calculated or declared absolute start date (YYYY-MM-DD) */
  startDate: string;
  /** Calculated or declared absolute end date (YYYY-MM-DD) */
  endDate: string;
  /** Collection of specific child communication tasks mapped under this action */
  tasks: Task[];
}

/**
 * High-level orchestration wrapper representing a distinct timeline stage block in a campaign lifecycle.
 * Coordinates multiple parent-child directives across Weekly or Monthly timeline grids.
 */
export interface Phase {
  /** High-level campaign block phase reference */
  id: string;
  /** Visual header label indicating scope (e.g., 'Engagement Activation') */
  label: string;
  /** Icon descriptor defining badge representation */
  icon: PhaseIconType;
  /** Absolute start timeline milestone (YYYY-MM-DD) */
  startDate: string;
  /** Absolute end timeline milestone (YYYY-MM-DD) */
  endDate: string;
  /** Nested list of tactical executable action directives belonging to this milestone sequence */
  actions: Action[];
}

