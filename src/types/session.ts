export interface FocusSession {
  id: string;
  user_id: string;
  task_id: string;
  start_time: string;
  end_time?: string;
  intended_duration_minutes: number;
  actual_duration_minutes?: number;
  interruptions_count: number;
  outcome: SessionOutcomeType;
  subjective_difficulty?: number; // 1-10
  distraction_notes?: string;
  productivity_score?: number;
  created_at: string;
}

export const SessionOutcome = {
  COMPLETED: 'completed',
  PARTIAL: 'partial',
  ABANDONED: 'abandoned',
  IN_PROGRESS: 'in-progress',
} as const;

export type SessionOutcomeType = typeof SessionOutcome[keyof typeof SessionOutcome];

export interface SessionStats {
  total_sessions: number;
  completed_sessions: number;
  total_focus_minutes: number;
  average_productivity: number;
  current_streak: number;
  longest_streak: number;
}

export interface CreateSessionRequest {
  task_id: string;
  intended_duration_minutes: number;
}

export interface UpdateSessionRequest {
  end_time?: string;
  actual_duration_minutes?: number;
  interruptions_count?: number;
  outcome?: SessionOutcomeType;
  subjective_difficulty?: number;
  distraction_notes?: string;
  productivity_score?: number;
}

export interface SessionSummary {
  session: FocusSession;
  task: any; // Task type
  productivity_breakdown: {
    completion_score: number;
    focus_score: number;
    outcome_multiplier: number;
  };
  next_suggestion?: string;
} 